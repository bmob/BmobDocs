# 微信支付 App 接入教程

## 简介

本教程将引导你完成微信 App 支付功能的接入，实现以下任务：

- 处理客户端发起的微信支付请求，生成预支付交易会话标识
- 将订单信息存储在 Bmob 的 `pay_order_record` 表中
- 接收微信支付异步通知，自动更新订单支付状态
- 遵循微信支付开发文档规范，确保支付流程安全可靠

## 一、前置准备

### 1.1 微信支付商户平台配置

- 1.1.1 注册 / 登录微信支付商户平台（[https://pay.weixin.qq.com](https://pay.weixin.qq.com/)）
- 1.1.2 完成商户认证（个体工商户或企业资质）
- 1.1.3 开通 "App 支付" 能力（商户平台→产品中心→App 支付→开通）
- 1.1.4 绑定 AppID（需与开发者平台的 App 应用关联）

### 1.2 密钥与证书配置

- 1.2.1 获取商户号（mchid）：商户平台首页可查看
- 1.2.2 配置 API 密钥：
  - 路径：账户中心→API 安全→设置 API 密钥（32 位随机字符串）
- 1.2.3 申请 API 证书：
  - 路径：账户中心→API 安全→申请 API 证书
  - 下载证书后解压，获取 `apiclient_cert.p12` 和 `apiclient_key.pem`（用于签名）
- 1.2.4 记录证书序列号：
  - 可通过微信支付提供的证书工具提取，或在商户平台查看

### 1.3 Bmob 环境准备

- 1.3.1 云函数创建（新建 `wechatPayment` 云函数）

- 1.3.2 数据表设计（

  ```
  pay_order_record
  ```

   

  表字段规范）

  - 必选字段：`out_trade_no`（商户订单号）、`total`（金额，分）、`pay_status`（支付状态）等
  - 关联字段：`user_id`（用户 ID）、`goods_id`（商品 ID）等

- 1.3.3 依赖说明：微信支付 V3 接口无需额外 SDK，直接通过 HTTP 接口调用

### 1.4 数据表设计（pay_order_record 表）

| 字段名         | 数据类型 | 列注释                           | 默认值 | 约束 / 说明                                  |
| -------------- | -------- | -------------------------------- | ------ | -------------------------------------------- |
| **objectId**   | String   | 订单唯一标识（Bmob 自动生成）    | 未设置 | 自增唯一值，内部系统订单标识                 |
| user_id        | String   | 用户 ID                          | 未设置 | 关联用户表的唯一标识                         |
| goods_id       | String   | 商品 ID                          | 未设置 | 关联商品表的唯一标识                         |
| out_trade_no   | String   | 商户订单号                       | 未设置 | 全局唯一，格式为 `tzxz_用户ID_时间戳`        |
| total          | Number   | 订单金额（单位：分）             | 0      | 整数存储，避免浮点数精度问题                 |
| amount         | String   | 金额描述（元）                   | 未设置 | 如 "1.00 元"，用于展示                       |
| pay_type       | Number   | 支付方式（0：微信；1：支付宝）   | 0      | 默认为微信支付                               |
| pay_status     | Number   | 支付状态（0：未支付；1：已支付） | 0      | 默认为未支付                                 |
| pay_status_des | String   | 支付状态描述                     | 未设置 | 如 "已下单，未支付"、"支付成功"              |
| appid          | String   | 微信应用 ID                      | 未设置 | 关联的微信开放平台 AppID                     |
| device_ip      | String   | 客户端 IP 地址                   | 未设置 | 记录下单设备 IP                              |
| prepay_id      | String   | 预支付交易会话标识               | 未设置 | 微信支付返回，用于客户端调起支付             |
| trade_no       | String   | 微信支付订单号                   | 未设置 | 支付成功后由微信回调返回                     |
| pay_time       | Date     | 支付时间                         | 未设置 | 支付成功后更新，格式为 `YYYY-MM-DD HH:mm:ss` |

#### 字段设计说明：

1. 金额存储

   ：

   - `total` 字段以「分」为单位存储整数（如 100 表示 1.00 元）
   - `amount` 字段用于前端展示，存储格式化后的字符串

2. 订单号设计

   ：

   - `out_trade_no` 需全局唯一，采用 `tzxz_用户ID_时间戳` 格式确保唯一性
   - 与微信支付接口的 `out_trade_no` 参数保持一致

3. 状态管理

   ：

   - `pay_status` 用数字表示状态，便于后续扩展（如新增 "已取消" 状态码 2）
   - `pay_status_des` 存储可读性描述，方便后台管理查看

## 二、核心功能开发

### 2.1 云函数入口设计

云函数入口接收客户端请求参数，处理后返回标准化响应格式，确保前后端交互一致性。

#### 2.1.1 请求参数规范（`request.body`字段说明）

客户端需通过 `request.body` 传递以下 JSON 格式参数：

| 参数名        | 数据类型 | 是否必填 | 说明                     | 示例值         |
| ------------- | -------- | -------- | ------------------------ | -------------- |
| `user_id`     | String   | 是       | 用户唯一标识，关联用户表 | `"e1c1897b3f"` |
| `goods_id`    | String   | 是       | 商品唯一标识，关联商品表 | `"p1eyfffg"`   |
| `app_name`    | String   | 是       | 应用名称                 | `"兔子下载"`   |
| `app_channel` | String   | 是       | 应用渠道                 | `"master"`     |
| `device`      | String   | 是       | 设备型号                 | `"三星s10"`    |

**请求参数示例**：

json











```json
{
  "user_id": "e1c1897b3f",
  "goods_id": "p1eyfffg",
  "app_name": "兔子下载",
  "app_channel": "master",
  "device": "三星s10"
}
```

#### 2.1.2 响应格式定义

云函数处理完成后，返回标准化 JSON 响应，包含状态码、业务数据和描述信息：

| 字段名 | 数据类型 | 说明                                                         | 取值范围                      |
| ------ | -------- | ------------------------------------------------------------ | ----------------------------- |
| `code` | Number   | 响应状态码： - 200：成功 - 301：参数错误 - 404：商品不存在 - 500：系统错误 | `200`/`301`/`404`/`500`       |
| `data` | Object   | 业务数据对象，成功时返回支付相关信息                         | 成功时非空，失败时可为 `null` |
| `msg`  | String   | 响应描述信息，说明操作结果                                   | 成功 / 错误提示文本           |

**`data` 对象字段说明**：

| 字段名         | 数据类型 | 说明                                       | 示例值                             |
| -------------- | -------- | ------------------------------------------ | ---------------------------------- |
| `prepay_id`    | String   | 微信预支付交易会话标识，客户端用于调起支付 | `"wx201410272009395522657a640800"` |
| `out_trade_no` | String   | 商户生成的唯一订单号，用于跟踪支付状态     | `"tzxz_e1c1897b3f_1623846752103"`  |

**成功响应示例**：

json











```json
{
  "code": 200,
  "data": {
    "prepay_id": "wx201410272009395522657a640800",
    "out_trade_no": "tzxz_e1c1897b3f_1623846752103"
  },
  "msg": "创建订单成功"
}
```

**错误响应示例（参数错误）**：

```json
{
  "code": 301,
  "data": null,
  "msg": "缺少参数user_id"
}
```

#### 设计说明

1. **参数验证**：严格校验 5 个必填参数，确保业务数据完整性
2. **响应标准化**：与支付宝支付接口保持一致的响应格式，便于客户端统一处理
3. **安全性**：通过签名机制确保请求合法性，防止参数篡改

### 2.2 生成预支付订单代码

#### 2.2.1 预支付订单生成（函数名：wechatPayment）

创建名为 `wechatPayment` 的云函数，用于处理支付请求、创建订单记录并调用微信支付接口获取预支付 ID：

```js
function onRequest(request, response, modules) {
    // 防止重复响应
    let isResponseSent = false;
    const sendResponse = (code, data = null, msg) => {
        if (!isResponseSent) {
            isResponseSent = true;
            response.send({ code, data, msg });
        }
    };

    try {
        // 1. 引入依赖模块
        const http = modules.oHttp;
        const NodeRSA = modules.oCryptoRSA;
        const crypto = modules.oCrypto;
        const db = modules.oData;

        // 2. 微信支付配置
        const config = {
            mchid: "16324234", // 商户ID
            appid: "wxd8cdsfhjkhjf", // 应用ID
            notifyUrl: "http://cloud.bmob.cn/xxxx/pay_notify", // 回调通知地址
            apiUrl: "https://api.mch.weixin.qq.com/v3/pay/transactions/app", // 下单接口地址
            privateKey: "", // 商户私钥（请补充实际密钥）
            serialNo: "xxxxxx" // 证书序列号
        };

        // 3. 解析请求参数
        const {
            user_id,
            goods_id,
            app_name,
            app_channel,
            device
        } = request.body;

        // 客户端IP
        const device_ip = request.ip;

        // 4. 参数验证
        const requiredParams = [
            { key: 'user_id', value: user_id },
            { key: 'goods_id', value: goods_id },
            { key: 'app_name', value: app_name },
            { key: 'app_channel', value: app_channel },
            { key: 'device', value: device }
        ];

        for (const param of requiredParams) {
            if (param.value === undefined || param.value === null || param.value === '') {
                return sendResponse(301, null, `缺少参数${param.key}`);
            }
        }

        // 5. 生成商户订单号
        const out_trade_no = `tzxz_${user_id}_${Date.now()}`;

        // 6. 查询商品信息
        db.findOne({
            table: "goods_info",
            objectId: goods_id
        }, (err, data) => {
            if (err) {
                console.error('查询商品失败:', err);
                return sendResponse(500, null, "查询商品信息失败");
            }

            try {
                const goods_data = JSON.parse(data);
                
                // 验证商品是否存在
                if (goods_data.error) {
                    return sendResponse(404, null, "商品信息不存在");
                }

                // 7. 准备订单数据
                const orderData = {
                    user_info: { "__type": "Pointer", "className": "_User", "objectId": user_id },
                    user_id: user_id,
                    app_name: app_name,
                    app_channel: app_channel,
                    description: goods_data.description || "1个月会员",
                    amount: (goods_data.total / 100) + "元",
                    out_trade_no: out_trade_no,
                    pay_type: 0, // 0表示微信支付
                    pay_status: 0, // 0表示未支付
                    pay_status_des: "已下单,未支付",
                    order_number: 1, // 第几次购买
                    platform: 0, // 0表示安卓
                    goods_id: goods_id,
                    device: device,
                    appid: config.appid,
                    total: goods_data.total || 100, // 金额（分）
                    device_ip: device_ip
                };

                // 8. 创建订单记录
                db.insert({
                    table: "pay_order_record",
                    data: orderData
                }, (insertErr, insertData) => {
                    if (insertErr) {
                        console.error('创建订单失败:', insertErr);
                        return sendResponse(500, null, "创建订单失败");
                    }

                    try {
                        const orderResult = JSON.parse(insertData);
                        if (orderResult.error) {
                            return sendResponse(500, null, "创建订单记录失败");
                        }

                        // 9. 构建微信支付请求参数
                        const timestamp = Math.round(Date.now() / 1000); // 10位时间戳
                        
                        // 生成随机字符串
                        const md5 = crypto.createHash('md5');
                        const nonce_str = md5.update(timestamp.toString()).digest('hex');

                        // 支付金额信息
                        const amount = {
                            total: orderData.total,
                            currency: "CNY"
                        };

                        // 请求体
                        const request_body = JSON.stringify({
                            appid: config.appid,
                            mchid: config.mchid,
                            description: orderData.description,
                            out_trade_no: out_trade_no,
                            notify_url: config.notifyUrl,
                            amount: amount
                        });

                        // 10. 生成签名
                        const signatureStr = [
                            "POST", // 请求方法
                            "/v3/pay/transactions/app", // 接口路径
                            timestamp.toString(), // 时间戳
                            nonce_str, // 随机字符串
                            request_body // 请求体
                        ].join("\n") + "\n";

                        // 签名处理
                        const key = new NodeRSA();
                        key.setOptions({ b: 2048, signingScheme: "sha256" });
                        key.importKey(config.privateKey, "pkcs8-private");
                        const sign_result = key.sign(signatureStr).toString('base64');

                        // 11. 构建请求头
                        const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${config.mchid}",nonce_str="${nonce_str}",timestamp="${timestamp}",serial_no="${config.serialNo}",signature="${sign_result}"`;

                        // 12. 调用微信支付接口
                        const options = {
                            url: config.apiUrl,
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": authorization
                            },
                            body: request_body
                        };

                        // 发送请求
                        http.post(options, (error, res, body) => {
                            if (error) {
                                console.error('调用微信支付接口失败:', error);
                                return sendResponse(500, null, "获取预支付信息失败");
                            }

                            try {
                                const payResult = JSON.parse(body);
                                if (payResult.prepay_id) {
                                    // 返回预支付ID
                                    sendResponse(200, {
                                        prepay_id: payResult.prepay_id,
                                        out_trade_no: out_trade_no
                                    }, "创建订单成功");
                                } else {
                                    console.error('微信支付接口返回异常:', body);
                                    sendResponse(500, null, "微信支付接口返回异常");
                                }
                            } catch (parseError) {
                                console.error('解析支付结果失败:', parseError);
                                sendResponse(500, null, "解析支付结果失败");
                            }
                        });

                    } catch (orderParseError) {
                        console.error('解析订单结果失败:', orderParseError);
                        sendResponse(500, null, "解析订单数据失败");
                    }
                });

            } catch (goodsParseError) {
                console.error('解析商品数据失败:', goodsParseError);
                sendResponse(500, null, "解析商品信息失败");
            }
        });

    } catch (error) {
        console.error('系统异常:', error);
        sendResponse(500, null, "系统异常，请稍后重试");
    }
}
```

#### 2.2.2 微信支付回调处理

微信支付回调函数用于接收微信支付平台发送的支付结果通知，验证通知合法性并更新订单状态：

微信支付成功后，会传入这些参数，可以查看官方文档：https://pay.weixin.qq.com/doc/v3/merchant/4013070368

```javascript
{
    "id": "EV-2018022511223320873",
    "create_time": "2015-05-20T13:29:35+08:00",
    "resource_type": "encrypt-resource",
    "event_type": "TRANSACTION.SUCCESS",
    "summary": "支付成功",
    "resource": {
        "original_type": "transaction",
        "algorithm": "AEAD_AES_256_GCM",
        "ciphertext": "",
        "associated_data": "",
        "nonce": ""
    }
}
```

具体就是接收这些参数，然后更新订单表

```js
function onRequest(request, response, modules) {
    // 防止重复响应
    let isResponseSent = false;
    const sendResponse = (data) => {
        if (!isResponseSent) {
            isResponseSent = true;
            response.send(data);
        }
    };

    try {
        const crypto = modules.oCrypto;
        const db = modules.oData;
        const NodeRSA = modules.oCryptoRSA;

        // 1. 微信支付配置
        const config = {
            mchid: "16343434", // 商户ID
            appid: "wxd8dsfdsfd324234", // 应用ID
            apiV3Key: "", // API v3密钥（用于解密回调数据）
            alipayPublicKey: "", // 微信支付平台公钥（用于验签）
            signType: "RSA2"
        };

        // 2. 获取回调参数
        const headers = request.headers;
        const notifyBody = request.body;
        
        // 回调通知中的签名信息
        const signature = headers['wechatpay-signature'];
        const timestamp = headers['wechatpay-timestamp'];
        const nonce = headers['wechatpay-nonce'];
        const serial = headers['wechatpay-serial'];

        console.log('收到微信支付通知:', {
            signature,
            timestamp,
            nonce,
            serial,
            body: notifyBody
        });

        // 3. 验证签名
        const signatureStr = [
            timestamp,
            nonce,
            JSON.stringify(notifyBody)
        ].join("\n") + "\n";

        const pubKey = new NodeRSA();
        pubKey.importKey(config.alipayPublicKey, "pkcs8-public");
        const verifyResult = pubKey.verify(signatureStr, signature, 'utf8', 'base64');

        if (!verifyResult) {
            console.error('微信支付通知签名验证失败');
            return sendResponse({ code: 'FAIL', message: '签名验证失败' });
        }

        // 4. 解析通知数据
        const {
            out_trade_no, // 商户订单号
            transaction_id, // 微信支付订单号
            trade_state, // 交易状态
            amount
        } = notifyBody;

        // 验证关键参数
        if (!out_trade_no || !trade_state) {
            console.error('通知缺少关键参数', { out_trade_no, trade_state });
            return sendResponse({ code: 'FAIL', message: '参数不完整' });
        }

        // 5. 处理支付结果
        if (trade_state === 'SUCCESS') {
            // 6. 查询订单是否已处理（幂等性处理）
            db.findOne({
                table: 'pay_order_record',
                where: { out_trade_no: out_trade_no }
            }, (err, orderData) => {
                if (err) {
                    console.error('查询订单失败:', err);
                    return sendResponse({ code: 'FAIL', message: '查询订单失败' });
                }

                if (!orderData) {
                    console.error('订单不存在:', out_trade_no);
                    return sendResponse({ code: 'FAIL', message: '订单不存在' });
                }

                // 7. 检查订单当前状态
                if (orderData.pay_status === 1) {
                    console.log('订单已处理:', out_trade_no);
                    return sendResponse({ code: 'SUCCESS' });
                }

                // 8. 更新订单状态
                const updateData = {
                    pay_status: 1, // 标记为已支付
                    pay_status_des: "支付成功",
                    trade_no: transaction_id,
                    pay_time: {
                        "__type": "Date",
                        "iso": new Date().toISOString().replace('T', ' ').split('.')[0]
                    },
                    prepay_id: orderData.prepay_id // 保留预支付ID
                };

                db.update({
                    "table": 'pay_order_record',
                    "objectId": orderData.objectId,
                    "data": updateData
                }, (updateErr) => {
                    if (updateErr) {
                        console.error('更新订单失败:', updateErr);
                        return sendResponse({ code: 'FAIL', message: '更新订单失败' });
                    }

                    console.log('订单支付成功并更新:', out_trade_no);
                    sendResponse({ code: 'SUCCESS' });
                });
            });
        } else {
            // 处理其他状态（如支付失败、关闭等）
            console.log(`订单状态: ${trade_state}, 订单号: ${out_trade_no}`);
            
            if (['CLOSED', 'PAYERROR'].includes(trade_state)) {
               //这里不支持条件更新，先查出 objectId 再更新
                db.update({
                    "table": 'pay_order_record',
                    "where": { out_trade_no: out_trade_no },
                    "data": { 
                        pay_status: 2, // 2表示支付失败
                        pay_status_des: "支付失败"
                    }
                }, (err) => {
                    if (err) console.error('更新失败状态出错:', err);
                    sendResponse({ code: 'SUCCESS' });
                });
            } else {
                sendResponse({ code: 'SUCCESS' });
            }
        }

    } catch (error) {
        console.error('回调处理异常:', error);
        sendResponse({ code: 'FAIL', message: '处理异常' });
    }
}
```

##### 回调函数核心作用：

1. **验证通知合法性**：通过签名验证确保通知来自微信支付平台
2. **处理支付结果**：根据 `trade_state` 更新订单状态
3. **保证幂等性**：防止重复处理同一通知导致的订单状态异常
4. **同步支付信息**：保存微信支付订单号、支付时间等关键信息

## 三、微信支付云函数详细说明

### 3.1 函数概述

**函数名称**：微信支付云函数（`wechatPayment`）
**功能描述**：处理客户端支付请求，创建订单记录，调用微信支付接口生成预支付 ID
**依赖资源**：

- `modules.oHttp`：Bmob HTTP 请求模块
- `modules.oCryptoRSA`：RSA 加密模块
- `modules.oCrypto`：加密工具模块
- `modules.oData`：Bmob 数据操作模块

### 3.2 核心流程解析

#### 3.2.1 初始化与配置


```javascript
// 防重复响应机制
let isResponseSent = false;
const sendResponse = (code, data = null, msg) => {
    if (!isResponseSent) {
        isResponseSent = true;
        response.send({ code, data, msg });
    }
};
```

- 作用：确保云函数仅返回一次响应，避免异步操作导致的重复响应

#### 3.2.2 参数验证流程


```javascript
const requiredParams = [
    { key: 'user_id', value: user_id },
    { key: 'goods_id', value: goods_id },
    { key: 'app_name', value: app_name },
    { key: 'app_channel', value: app_channel },
    { key: 'device', value: device }
];

for (const param of requiredParams) {
    if (param.value === undefined || param.value === null || param.value === '') {
        return sendResponse(301, null, `缺少参数${param.key}`);
    }
}
```

- 验证逻辑：检查所有必填参数是否存在且有效
- 错误处理：发现缺失参数立即返回 301 错误，终止流程

#### 3.2.3 订单创建与商品信息查询

1. **生成商户订单号**：


   ```javascript
   const out_trade_no = `tzxz_${user_id}_${Date.now()}`;
   ```

   采用用户 ID + 时间戳的格式，确保订单号唯一

2. **查询商品信息**：


   ```javascript
   db.findOne({
       table: "goods_info",
       objectId: goods_id
   }, (err, data) => { ... });
   ```

   从商品表获取商品价格、描述等信息，用于创建订单

#### 3.2.4 微信支付签名生成

微信支付 V3 接口要求请求必须包含签名，生成过程如下：

1. **构建签名字符串**：

   

   ```javascript
   const signatureStr = [
       "POST", // 请求方法
       "/v3/pay/transactions/app", // 接口路径
       timestamp.toString(), // 时间戳
       nonce_str, // 随机字符串
       request_body // 请求体
   ].join("\n") + "\n";
   ```

2. **生成签名**：


   ```javascript
   const key = new NodeRSA();
   key.setOptions({ b: 2048, signingScheme: "sha256" });
   key.importKey(config.privateKey, "pkcs8-private");
   const sign_result = key.sign(signatureStr).toString('base64');
   ```

3. **构建 Authorization 头**：


   ```javascript
   const authorization = `WECHATPAY2-SHA256-RSA2048 mchid="${config.mchid}",nonce_str="${nonce_str}",timestamp="${timestamp}",serial_no="${config.serialNo}",signature="${sign_result}"`;
   ```

#### 3.2.5 调用微信支付接口


```javascript
const options = {
    url: config.apiUrl,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": authorization
    },
    body: request_body
};

http.post(options, (error, res, body) => { ... });
```

- 接口地址：`https://api.mch.weixin.qq.com/v3/pay/transactions/app`
- 请求方法：POST
- 成功响应：返回包含`prepay_id`的 JSON 数据，用于客户端调起支付

## 四、使用注意事项

1. **配置信息**：
   - 替换`config`中的`mchid`、`appid`为实际商户号和 AppID
   - 补充`privateKey`（商户私钥）和`serialNo`（证书序列号）
   - 确保`notifyUrl`是可公开访问的 URL，用于接收支付结果通知
2. **安全注意**：
   - 私钥不可泄露，建议通过 Bmob 环境变量存储
   - 生产环境必须使用 HTTPS 协议
   - 定期更新 API 密钥和证书，确保账户安全
3. **测试环境**：
   - 开发阶段可使用微信支付沙箱环境进行测试
   - 沙箱环境地址：`https://api.mch.weixin.qq.com/sandboxnew/pay/transactions/app`
   - 测试时需使用沙箱专用的密钥和证书
4. **异常处理**：
   - 确保所有异步操作都有错误处理机制
   - 关键步骤添加日志记录，便于问题排查
   - 实现订单超时处理机制，避免长期未支付订单占用资源