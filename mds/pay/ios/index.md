## 简介

iOS支付SDK接口是Bmob为广大开发人员提供的统一、正规的收费手段，让没有企业认证的个人开发者，也能通过支付宝和微信向用户收费。该文档可以让您快速为自己的应用接入Bmob的支付功能。下图为使用支付的流程。

![](image/flow.png)

## 使用需知

使用Bmob支付组件前，请认真阅读[Bmob服务协议](https://www.bmobapp.com/service)。

对于以下两种情况，开发者需要特别注意：

1.违反服务协议，特别是含有以下内容的应用：

**1）封建迷信和/或淫秽、色情、下流的信息或教唆犯罪的信息；**
**2）博彩有奖、赌博游戏、“私服”、“外挂”等非法互联网出版活动；**

Bmob平台有权进行独立判断并采取技术手段予以删除、屏蔽或断开链接。同时，本平台有权视用户的行为性质，采取包括但不限于暂停或终止服务，限制、冻结或终止本平台网站账号的使用，追究法律责任等措施。

2.应用遇到过多的用户投诉，如应用的使用者支付了相关款项，但是该应用却没有提供相应的服务。本平台有权限制或冻结该应用支付收入的所有款项，并保留追究法律责任的权利。

3.**Bmob将在每笔交易中收取10%服务费。**

4.**微信支付暂不支持**

##  打款需知

1.打款前请先在控制台填写以下信息

![](image/14579272227324.jpg)


2.每月的1、2、16、17号为申请打款时间，15号、月尾日为打款时间，确保用户有半个月的追诉期。

## 支持平台

目前 iOS 端仅提供支付宝支持。

## 启用须知

**支付限制流程：**
**用户创建应用即可使用支付功能，无任何限制**
**应用收入大于50元，需要身份证审核和应用审核都通过才可继续使用**
**提交应用审核申请时，开发者的联系方式至少要有两种(邮箱，电话，QQ)，方便后续支付弹出的订单页面展示，如下：**

![](https://ww4.sinaimg.cn/large/006y8lVagw1fbpzckrljvj30b40jr0tz.jpg)

## SDK 接入

- 1. 将 `BmobPaySDK.framework` 拖入项目中，并选取 `copy items if needed`

![](image/1C61E5DA-F4BE-4800-AC54-A3D011D1FC8C.png)

- 2. 在 info.plist 添加以下两个字端：
A. `View controller-based status bar appearance`，类型为 `BOOL`，值为 `NO`
B. `LSApplicationQueriesSchemes`，类型为 `Array`，字符串元素 `alipays` 和 `weixin`

![](https://ww1.sinaimg.cn/large/006tNc79gy1fbw2e24ep5j30u0036aah.jpg)

```
<key>UIViewControllerBasedStatusBarAppearance</key>
<false/>
<key>LSApplicationQueriesSchemes</key>
<array>
<string>alipays</string>
<string>weixin</string>
</array>
```

- 3. 添加使用的framework:
A. CoreTelephony.framework
B. libz.1.2.5.tbd
C. libsqlite3.tbd
D. libc++.tbd


## 支付调用

```
#import <BmobPaySDK/Bmob.h>
```

在 AppDelegaet 注册应用：

```
[Bmob registerWithAppKey:@"xxxxxxxx"];

```

> 注意，如果没有注册 AppKey ，则不会有任何反应，也不会有回调。

然后进行关键函数调用：

```
[BmobPay payWithPayType:BmobAlipay //支付类型选择
price:@888 //订单价格，0 - 5000
orderName:@"订单名称" //不为空
describe:@"订单描述" //不为空
result:nil]; //应用内支付回调
```

## 订单查询

> 注意事项：查询操作自动从内存中获取订单号，应该等待支付操作回调执行时或执行后才进行查询接口调用。

### 获取订单号
```
+ (void)orderInfoCallback:(void(^)(NSDictionary *orderInfo))orderInfoCallback;
```
### 根据订单号订单查询

```
+ (void)queryWithOrderNumber:(NSString *)orderNumber
result:(void(^)(NSDictionary *resultDic, NSError *error))result;

```

成功查询会返回以下类似数据：

```
{
"transaction_id" : "C20170727115355672433",
"pay_type" : "ALIPAY", WECHATPAY（微信支付）或ALIPAY（支付宝支付）
"total_fee" : 0.01,      //订单总金额
"create_time" : "2017-07-27 11:53:56",   //调起支付的时间
"trade_state" : "SUCCESS",     //NOTPAY（未支付）或 SUCCESS（支付成功）
"body" : "商品详情",
"name" : "小吃",      //商品名称
"out_trade_no" : "e3aa75aaf1e1a92a6f466c102ff1dae1"     //Bmob系统的订单号
}
```

## 应用外支付回调

如图，可以在支付-配置信息处填入通知url。

![](http://i.imgur.com/40aAkKh.png)


这样在支付成功后会向该url（SDK使用异步通知URL，PHP等调用网页支付的使用同步返回URL）发送post请求，结构如下：

```
{
"trade_status":"1",
"out_trade_no":"809488d695ed42ec56b57546d2df94cc",
"trade_no":"2016033021001004810225607152"
}
```
trade_status：表示支付状态，目前只有支付成功才产生回调，值恒为1.
out_trade_no：Bmob返回的订单号
trade_no：支付宝或微信返回的订单号

