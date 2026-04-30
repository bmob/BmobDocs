# Bmob REST API 开发文档

## 目录

- [概述](#概述)
- [请求格式](#请求格式)
- [请求 Header](#请求-header)
- [响应格式](#响应格式)
- [快速参考](#快速参考)
- [对象](#对象)
- [查询](#查询)
- [数组](#数组)
- [数据关联](#数据关联)
- [用户管理](#用户管理)
- [文件管理](#文件管理)
- [ACL 和角色](#acl-和角色)
- [地理位置](#地理位置)
- [微信小程序](#微信小程序)
- [获取服务器时间](#获取服务器时间)
- [错误码](#错误码)

---

## 概述

Bmob REST API 基于标准的 HTTP 协议，为开发者提供跨平台、语言无关的数据交互能力。任何具备 HTTP 通信能力的设备或编程语言均可与 Bmob 后端云服务进行无缝对接。REST API 的典型应用场景包括但不限于：

- **多语言数据接入**：支持使用 C、Java、Python、PHP、C# 等任意编程语言访问 Bmob 云端数据
- **Web 数据展示**：将 Bmob 作为后端数据源，驱动前端网站的数据展示与渲染
- **数据批量导入**：通过 API 批量写入业务数据，供移动端应用实时消费
- **自定义数据分析**：拉取平台数据进行离线分析、统计报表及商业智能处理
- **异构系统集成**：实现任意技术栈与 Bmob 平台的双向数据交互
- **数据导出与迁移**：支持全量数据的自主导出，保障数据的可移植性

## 请求格式

对于 `POST` 和 `PUT` 类型的请求，**请求体（Request Body）必须采用 JSON 格式编码**，同时 HTTP 请求头（Header）中的 `Content-Type` 字段须设置为 `application/json`。

## 请求 Header

Bmob 后端云支持两种 RESTful API 的 Header 授权方式。

### 简易授权方式

简易授权方式只需要在 Header 中提供 `X-Bmob-Application-Id` 和 `X-Bmob-REST-API-Key`，其中 `X-Bmob-Application-Id` 头表明你正在访问的是哪个 App 程序，而 `X-Bmob-REST-API-Key` 头是用来授权的。

> **本文档后续所有接口的 Header 默认包含以下字段**，不再逐一列出：

```http
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: application/json
```

示例请求：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

### 加密授权方式

简易授权方式适合服务端或者不公开对外运行的那些应用，不需要担心抓包破解的问题。加密授权方式更适合公开客户端模式的应用，Header 头的格式如下：

```bash
curl -X GET \
    -H 'content-type: application/json' \
    -H 'X-Bmob-SDK-Type: wechatApp' \
    -H 'X-Bmob-Secret-Key: bc7814ffb203da9f' \
    -H 'X-Bmob-Noncestr-Key: mI7dRHI4gbai0KaU' \
    -H 'X-Bmob-Safe-Timestamp: 1583920308' \
    -H 'X-Bmob-Safe-Sign: abf91342a4103732cbcf8d8a727065da' \
    -H 'X-Bmob-SDK-Version: 10' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

| 参数                  | 类型   | 参数说明                                                     |
| --------------------- | ------ | ------------------------------------------------------------ |
| X-Bmob-SDK-Type       | string | SDK 类型，目前固定为 `wechatApp`                             |
| X-Bmob-Safe-Timestamp | string | 客户端请求的 unix 时间戳（UTC），精确到毫秒，长度13位字符      |
| X-Bmob-Noncestr-Key   | string | 客户端请求产生的一个随机码，长度16个字符                     |
| X-Bmob-Secret-Key     | string | Bmob 控制台应用密匙 **Secret Key**                           |
| X-Bmob-SDK-Version    | string | SDK 版本，当前固定为 `10`                                    |
| X-Bmob-Safe-Sign      | string | md5 签名，签名规则 md5(url + timeStamp + SecurityCode + noncestr + body + SDKVersion)，具体看下面介绍 |

> **注意**：以上所有参数必填，请求时间客户端到服务器请求必须 10s 内，如果客户端手机时间不对，则无法请求。

#### MD5 加密规则说明

| 参数         | 参数说明                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| url          | 例如请求 `https://your-api-domain/1/classes/GameScore/e1kXT22L`，其 url 则为 `**/1/classes/GameScore/e1kXT22L**`，如果 GET 请求后面带 `?aa=1` 则不算 url 加密参数之中 |
| timeStamp    | 客户端请求的 unix 时间戳（UTC），精确到毫秒                                                                                 |
| SecurityCode | 自定义 API 安全码，不通过网络传输。设置 **API 安全码**：在应用功能设置，安全验证，API 安全码，可自行设置                     |
| noncestr     | 客户端请求产生的一个随机码，长度16个字符                                                                                    |
| body         | 客户端请求的 json 内容，仅 `POST` 和 `PUT` 请求类型需要，其他类型均为空值                                                   |
| SDKVersion   | 目前固定为 `10`                                                                                                             |

## 响应格式

对于所有 REST API 请求的响应内容体都是一个 JSON 对象。

一个请求是否成功是由 HTTP 状态码表明的，一个 2XX 的状态码表示成功，而一个 4XX 表示请求失败。当一个请求失败时响应的主体仍然是一个 JSON 对象，但是总会包含 `code` 和 `error` 这两个字段，你可以用它们来进行调试。举个例子，如果保存一个对象的时候，尝试用不允许的 Key，比如包含下划线的 `_name` 的话，就会得到如下请求失败的响应信息：

```json
{
    "code": 105,
    "error": "invalid field name: bl!ng"
}
```

## 快速参考

API 访问需要在 `https://your-api-domain` 域名下，相对路径前缀 `/1/` 表明现在使用的是第 1 版的 API。

### 对象快速参考

| URL                            | HTTP   | 功能       |
| :----------------------------- | :----- | :--------- |
| /1/classes/TableName           | POST   | 添加数据   |
| /1/classes/TableName/objectId  | PUT    | 更新数据   |
| /1/classes/TableName/objectId  | DELETE | 删除数据   |
| /1/batch                       | POST   | 批量操作数据 |
| /1/classes/TableName/objectId  | GET    | 查询数据   |
| /1/cloudQuery                  | GET    | 使用 BQL 查询 |

### 用户快速参考

| URL                                  | HTTP   | 功能                                   |
| :----------------------------------- | :----- | :------------------------------------- |
| /1/users                             | POST   | 用户注册、使用手机号注册登录、第三方注册登录 |
| /1/login                             | POST   | 登录                                   |
| /1/users/objectId                    | GET    | 获取当前用户、查询用户                   |
| /1/users/objectId                    | PUT    | 更新用户、第三方连接及断开连接           |
| /1/users/objectId                    | DELETE | 删除用户                               |
| /1/requestPasswordReset              | POST   | 密码重置                               |
| /1/resetPasswordBySmsCode/smsCode    | PUT    | 短信密码重置                           |
| /1/updateUserPassword/objectId       | POST   | 旧密码更新密码                         |
| /1/requestEmailVerify                | POST   | 邮箱验证                               |

### 文件管理快速参考

| URL                        | HTTP   | 功能           |
| :------------------------- | :----- | :------------- |
| /2/files/fileName          | POST   | 文件上传       |
| /2/files/cdnName/url       | DELETE | 删除文件       |
| /2/cdnBatchDelete          | POST   | 批量删除 CDN 文件 |

### ACL 和角色管理快速参考

| URL                     | HTTP   | 功能     |
| :---------------------- | :----- | :------- |
| /1/roles                | POST   | 创建角色 |
| /1/roles/objectId       | GET    | 获取角色 |
| /1/roles/objectId       | PUT    | 更新角色 |

### App 服务快速参考

| URL               | HTTP   | 功能             |
| :---------------- | :----- | :--------------- |
| /1/apps           | GET    | 获取所有 App 信息 |
| /1/apps/appId     | GET    | 获取特定 App 信息 |
| /1/apps           | POST   | 创建新 App       |
| /1/apps/appId     | PUT    | 修改 App 信息    |

### 数据表快速参考

| URL                        | HTTP   | 功能         |
| :------------------------- | :----- | :----------- |
| /1/schemas                 | GET    | 获取所有表信息 |
| /1/schemas/TableName       | GET    | 获取特定表信息 |
| /1/schemas/TableName       | POST   | 创建表       |
| /1/schemas/TableName       | PUT    | 修改表       |
| /1/schemas/TableName       | DELETE | 删除表       |

### 其它功能快速参考

| URL                 | HTTP   | 功能               |
| :------------------ | :----- | :----------------- |
| /1/timestamp        | GET    | 获取服务器时间     |
| /1/requestSmsCode   | POST   | 请求短信验证码     |
| /1/requestEmailCode | POST   | 请求邮件验证码     |
| /1/verifySmsCode    | POST   | 验证短信/邮件验证码 |

## 对象

### 对象格式

通过 REST API 保存数据需要将对象的数据通过 JSON 来编码，这个数据是无模式化的（Schema Less），这意味着你不需要提前标注每个对象上有哪些 Key，你只需要随意设置 key-value 对就可以，REST API 后端会存储它的。

举个例子，假设你正在记录一局游戏的最高分，一个简单的对象可能包含：

```json
{
    "score": 1337,
    "playerName": "Sean Plott",
    "cheatMode": false
}
```

Key 必须是字母和数字组成的字符串，Value 可以是任何可以 JSON 编码的东西。

每个对象都有一个类名，你可以通过类名来区分不同的数据，例如，我们可以把游戏得分对象称之为 GameScore。我们推荐你使用 **NameYourClassesLikeThis** 和 **nameYourKeysLikeThis** 这样的格式为你的类名和 Key 命名，这可以使你的代码看起来很漂亮。

当你从 [Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 中获取对象时，一些字段会被自动加上：`createdAt`、`updatedAt` 和 `objectId`，这些字段的名字是保留的，你不能自行设置它们，我们上面设置的对象在获取时应该是下面的样子：

```json
{
    "score": 1337,
    "playerName": "Sean Plott",
    "cheatMode": false,
    "createdAt": "2011-08-20 02:06:57",
    "updatedAt": "2011-08-20 02:06:57",
    "objectId": "e1kXT22L"
}
```

`createdAt` 和 `updatedAt` 都是 UTC 时间戳，以 ISO 8601 标准和毫秒级精度储存：`YYYY-mm-dd HH:ii:ss`。`objectId` 是一个 string，在类中唯一表明了一个对象。

在 REST API 中 class 级在一个资源上的操作只能根据类名来进行，例如，如果类名是 GameScore，那么 class 的 URL 就是：

```
https://your-api-domain/1/classes/GameScore
```

用户有一个特殊的类级的 URL：

```
https://your-api-domain/1/users
```

针对于一个特定对象的操作可以通过组织一个 URL 来做，例如，对 GameScore 中的一个 objectId 为 `e1kXT22L` 的对象的操作应使用如下 URL：

```
https://your-api-domain/1/classes/GameScore/e1kXT22L
```

### 数据类型

到现在为止我们只使用了可以被标准 JSON 编码的值，[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 移动客户端 SDK 库同样支持日期、地理位置数据和指针数据、关系型数据。在 REST API 中，这些值都被编码了，同时有一个 `__type` 字段来标识出它们所属的类型，所以如果你采用正确的编码的话就可以读或者写这些字段了。

**Date** 类型包含了一个 `iso` 字段存储了一个 UTC 时间戳，以 ISO 8601 格式和毫秒级的精度来存储时间：`YYYY-MM-DDTHH:MM:SS.MMMZ` 或者 `YYYY-MM-DDTHH:MM:SS`。

```json
{
    "__type": "Date",
    "iso": "2011-08-21 18:02:52"
}
```

Date 与内置的 `createdAt` 字段和 `updatedAt` 字段相结合的时候特别有用，举个例子：为了找到在一个特殊时间创建的对象，只需要将 Date 编码在一个查询的 where 条件中：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"createdAt":{"$gte":{"__type":"Date","iso":"2011-08-21 18:02:52"}}}' \
    https://your-api-domain/1/classes/GameScore
```

**File** 类型是在上传后返回的 JSON 数据再加一个 Key 为 `"__type":"File"`，用来保存到数据列为文件类型的值：

```json
{
    "__type": "File",
    "group": "group1",
    "filename": "1.xml",
    "url": "M00/01/14/sd2lkds0.xml"
}
```

更新对象时可以为该对象保存上传后返回的文件信息：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"score":1337,"playerName":"Sean Plott","file":{"__type":"File","group":"group1","filename":"1.xml","url":"M00/01/14/sd2lkds0.xml"}}' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

**Pointer** 类型是在当前对象要指向另一个对象时使用，它包含了 `className` 和 `objectId` 两个作为一个指针正确指向的必填值。

```json
{
    "__type": "Pointer",
    "className": "Game",
    "objectId": "DdUOIIIW"
}
```

指向用户对象的 Pointer 的 `className` 为 `_User`，前面加一个下划线表示开发者不能定义的类名，而且所指的类是系统内置的。

**Relation** 类型被用在多对多的类型上，移动端的库将使用 **BmobRelation** 作为值，它有一个 `className` 字段表示目标对象的类名：

```json
{
    "__type": "Relation",
    "className": "GameScore"
}
```

当使用查询时，Relation 对象的行为很像是 Pointer 的数组，任何操作针对于 Pointer 的数组（除了 include）都可以对 Relation 起作用。

当更多的数据类型被加入的时候，它们都会采用 hashmap 加上一个 `type` 字段的形式，所以你不应该使用 `type` 作为你自己的 JSON 对象的 Key。

### 添加数据

**请求描述**

为了在 [Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 上创建一个新的对象，应该向 class 的 URL 发送一个 POST 请求，其中内容体应该是包含对象本身的 JSON 格式。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>`
- method：POST
- header：（公共 Header）
- body：

```json
{
    "<key1>": "<value1>",
    "<key2>": "<value2>"
}
```

**成功时响应**

- status: `201 Created`
- location: `https://your-api-domain/1/classes/<TableName>/<objectId>`
- body:

```json
{
    "createdAt": "<createDate>",
    "objectId": "<objectId>"
}
```

**例子**

例如，要创建如上例子中说的对象：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"score":1337,"playerName":"Sean Plott","cheatMode":false}' \
    https://your-api-domain/1/classes/GameScore
```

当创建成功时，响应的 HTTP 状态码的返回值是 `201 Created`，而响应的 HTTP 头部中 Location 的值是表示刚创建的该对象的 URL：

```
Status: 201 Created
Location: https://your-api-domain/1/classes/GameScore/e1kXT22L
```

响应的主体是一个 JSON 对象，包含新对象的 `objectId` 和 `createdAt` 时间戳：

```json
{
    "createdAt": "2011-08-20 02:06:57",
    "objectId": "e1kXT22L"
}
```

### 更新数据

#### 普通更新

**请求描述**

为了更改一个对象上已经有的数据，你可以发送一个 PUT 请求到对象相应的 URL 上，只有你指定的 Key 的值才会变更为新值，任何你未指定的 Key 的值都不会更改，所以你可以只更新对象数据的一个子集。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>/<objectId>`
- method：PUT
- header：（公共 Header）
- body：

```json
{
    "<key1>": "<value1>",
    "<key2>": "<value2>"
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "updatedAt": "YYYY-mm-dd HH:ii:ss"
}
```

**例子**

我们来更改我们对象的一个 score 的字段：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"score":73453}' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

返回的 JSON 对象只会包含一个 `updatedAt` 字段，表明更新发生的时间：

```json
{
    "updatedAt": "2011-08-21 18:02:52"
}
```

#### 修改对象的某个值

如果存储的是 JSON 对象还可以通过以下形式，只修改 JSON 对象的特定键值，其 body 为：

```json
{
    "<key1>.<keyOfJson>": "<value1>",
    "<key2>.<keyOfJson>": "<value2>"
}
```

如果你当前行有一列叫 `userAttibute`，保存的是一个 JSON 对象，比如是：`{"name":"John", "gender":"男"}`，那么我们要修改这个对象的 gender 值就可以通过以下方式实现：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"userAttibute.gender":"女"}' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

#### 原子计算器

另外，很多应用可能会有需要计数器的功能，比如某条信息被点赞多少次等。Bmob 提供了非常便捷的方式来保证原子性的修改某一数值字段的值，body 如下，其中 value 的正负均可。

其中请求的 body 为：

```json
{
    "<key1>": { "__op": "Increment", "amount": <value> }
}
```

例如，如果需要让 score 每次增加 1，而并不需要知道其当前的值，可以使用以下请求：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"score":{"__op":"Increment","amount":1}}' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

### 删除数据

**请求描述**

为了在 [Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 上删除一个对象，可以发送一个 DELETE 请求到指定的对象的 URL。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>/<objectId>`
- method：DELETE
- header：（公共 Header）

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**例子**

删除 GameScore 下 objectId 为 `e1kXT22L` 的方法如下：

```bash
curl -X DELETE \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

#### 删除字段的值

**请求描述**

可以在一个对象中删除一个字段，通过接口自定义的 Delete 操作。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>/<objectId>`
- method：PUT
- header：（公共 Header）
- body：

```json
{
    "<key1>": { "__op": "Delete" },
    "<key2>": { "__op": "Delete" }
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "updatedAt": "YYYY-mm-dd HH:ii:ss"
}
```

**例子**

如果要删除 GameScore 中 objectId 为 `e1kXT22L` 记录的 playerName，可进行如下请求：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"playerName":{"__op":"Delete"}}' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

### 批量数据操作

**请求描述**

为了减少因为网络通讯次数太多而带来的时间浪费，Bmob 提供批量（batch）操作，在一个请求中对多个普通对象进行添加（create）、更新（update）、删除（delete）操作，上限为 50 个。在一个批量（batch）请求中每一个操作都有自己对应的方法、路径和主体，这些参数可以代替你通常使用的 HTTP 方法。这些操作会以发送过去的顺序来执行。

**请求**

- url：`https://your-api-domain/1/batch`
- method：POST
- header：（公共 Header）
- body：

```json
{
    "requests": [
        {
            "method": "POST",
            "path": "/1/classes/<TableName>",
            "body": {
                "<key1>": "<value1>",
                "<key2>": "<value2>"
            }
        },
        {
            "method": "PUT",
            "token": "<tokenValue>",
            "path": "/1/classes/<TableName>/<objectId>",
            "body": {
                "<key1>": "<value1>"
            }
        },
        {
            "method": "DELETE",
            "token": "<tokenValue>",
            "path": "/1/classes/<TableName>/<objectId>"
        }
    ]
}
```

> **注意**：`token` 字段在具有 ACL 规则时需要提供。

**成功时响应**

- status: `200 OK`
- body:

```json
[
    {
        "success": {
            "createdAt": "YYYY-mm-dd HH:ii:ss",
            "objectId": "d746635d0b"
        }
    },
    {
        "success": {
            "updatedAt": "YYYY-mm-dd HH:ii:ss"
        }
    },
    {
        "success": {
            "msg": "ok"
        }
    }
]
```

**例子**

比如我们要创建一系列的 GameScore 的对象：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "requests": [
            {
                "method": "POST",
                "path": "/1/classes/GameScore",
                "body": {
                    "score": 1337,
                    "playerName": "Sean Plott"
                }
            },
            {
                "method": "POST",
                "path": "/1/classes/GameScore",
                "body": {
                    "score": 1338,
                    "playerName": "ZeroCool"
                }
            }
        ]
    }' \
    https://your-api-domain/1/batch
```

如果我们要修改用户表的某条记录或者删除某条记录，则用以下方法：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "requests": [
            {
                "method": "PUT",
                "token": "pnktnjyb996sj4p156gjtp4im",
                "path": "/1/users/51e3a334e4b0b3eb44adbe1a",
                "body": {
                    "score": 999999
                }
            },
            {
                "method": "DELETE",
                "token": "pnktnjyb996sj4p156gjtp4im",
                "path": "/1/users/51a8a4d9e4b0d034f6159a35"
            }
        ]
    }' \
    https://your-api-domain/1/batch
```

## 查询

数据的查询可能是每个应用都会频繁使用的，它提供了多样的方法来实现不同条件的查询，同时它的使用也是非常的简单和方便。

### 查询单条数据

**请求描述**

当你创建了一个对象时，你可以通过发送一个 HTTP GET 请求到创建对象成功时返回的 HTTP 请求头中的 Location 的 URL 获取它的内容。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>/<objectId>`（可以加上 include 值，具体形式为：`https://your-api-domain/1/classes/<TableName>/<objectId>?include=game`）
- method：GET
- header：（公共 Header）

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "<key1>": "<value1>",
    "<key2>": "<value2>"
}
```

**例子**

为了得到我们上面创建的对象：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

返回的主体是一个 JSON 对象，它包含所有用户提供的 field，并且加上系统保留的 `createdAt`、`updatedAt` 和 `objectId` 三个 Key 的值：

```json
{
    "score": 1337,
    "playerName": "Sean Plott",
    "cheatMode": false,
    "skills": [
        "pwnage",
        "flying"
    ],
    "createdAt": "2011-08-20 02:06:57",
    "updatedAt": "2011-08-20 02:06:57",
    "objectId": "e1kXT22L"
}
```

当获取的对象有指向其子对象的 Pointer 类型指针 Key 时，你可以加入 include 选项来获取指针指向的子对象。按上面的实例，如果 GameScore 对象有一个 game 的 Key 为 Pointer 类型，并指向了 Game 游戏对象，那么可以通过 GameScore 的 game 这个 Key 来获取指向的一个 Game 对象：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'include=game' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

返回的主体是一个 JSON 对象包含 GameScore 的所有 Key，并有 game 这个 Pointer 的 Key 被扩展为一个 Game 对象：

```json
{
    "score": 1337,
    "playerName": "Sean Plott",
    "cheatMode": false,
    "skills": [
        "pwnage",
        "flying"
    ],
    "game": {
        "type": "Object",
        "className": "Game",
        "name": "愤怒的小鸡"
    },
    "createdAt": "2011-08-20 02:06:57",
    "updatedAt": "2011-08-20 02:06:57",
    "objectId": "e1kXT22L"
}
```

### 查询多条数据

**请求描述**

为了一次获取多个对象，你可以通过发送一个 GET 请求到类的 URL 上，不需要任何 URL 参数。具体如下。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>`
- method：GET
- header：（公共 Header）

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "results": [
        {
            "<key1>": "<value1>",
            "<key2>": "<value2>"
        },
        {
            "<key1>": "<value1>",
            "<key2>": "<value2>"
        }
    ]
}
```

**例子**

下面就是简单地获取所有在 GameScore 类之中的对象：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/1/classes/GameScore
```

返回的值就是一个 JSON 对象包含了 results 字段，它的值就是对象的列表：

```json
{
    "results": [
        {
            "playerName": "Jang Min Chul",
            "updatedAt": "2011-08-19 02:24:17",
            "cheatMode": false,
            "createdAt": "2011-08-19 02:24:17",
            "objectId": "51c3ba67e4b0f0e851c16221",
            "score": 80075
        },
        {
            "playerName": "Sean Plott",
            "updatedAt": "2011-08-21 18:02:52",
            "cheatMode": false,
            "createdAt": "2011-08-20 02:06:57",
            "objectId": "e1kXT22L",
            "score": 73453
        }
    ]
}
```

查询返回的结果无需额外处理，可直接使用。

### 条件查询

条件查询就是在查询所有数据的请求上通过 where 参数的形式对查询对象做出约束，只返回我们期望返回的值。

where 参数的值应该是 JSON 编码过的，就是说，如果你查看真正被发出的 URL 请求，它应该是先被 JSON 编码过，然后又被 URL 编码过。

使用 where 参数最简单的方式就是包含应有的 key 的值。举例说，如果我们想要得到 Lily 的记录，那该请求的 URL 为：

```
https://your-api-domain/1/classes/GameScore?where={"name":"Lily"}
```

这是未经编码前我们看到的 url，我们需要对 URL 进行 URL 编码，编码的结果为：

```
https://your-api-domain/1/classes/GameScore?where=%7B%22name%22:%22Lily%22%7D
```

> **提示**：不同的语言开发环境有不同的 URL 编码接口，如果是使用如 Postman 这类工具来进行测试的，可以使用一些在线的 URL 编解码工具进行编码后再发送请求，这里推荐一个 [http://web.chacuo.net/charseturlencode](http://web.chacuo.net/charseturlencode)

where 的参数值除了上面的准确匹配外，还支持比较运算符的方式，除了给定一个确定值的方式，还可以提供一个 hash 中包含有 key 用于比较，where 参数支持下面一些选项：

| Key          | 操作                     |
| :----------- | :----------------------- |
| `$lt`        | 小于                     |
| `$lte`       | 小于等于                 |
| `$gt`        | 大于                     |
| `$gte`       | 大于等于                 |
| `$ne`        | 不等于                   |
| `$in`        | 包含在数组中             |
| `$nin`       | 不包含在数组中           |
| `$exists`    | 这个 Key 有值           |
| `$select`    | 匹配另一个查询的返回值   |
| `$dontSelect`| 排除另一个查询的返回     |
| `$all`       | 包括所有给定的值         |
| `$regex`     | 匹配 PCRE 表达式        |

作为示例，为了获取 score 得分在 [1000, 3000] 之间的对象，我们需要这样做：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"score":{"$gte":1000,"$lte":3000}}' \
    https://your-api-domain/1/classes/GameScore
```

为了获得 score 得分在 10 以下并且是一个奇数，我们需要这样做：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"score":{"$in":[1,3,5,7,9]}}' \
    https://your-api-domain/1/classes/GameScore
```

为了获得 scoreArray 得分包括数组中所有的值，如 scoreArray 是 [1,3,5,7] 就满足，是 [1,5,10] 就不满足：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"scoreArray":{"$all":[1,3,5]}}' \
    https://your-api-domain/1/classes/GameScore
```

为了获取 playerName 不在列表中的 GameScore 对象们，我们可以：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"playerName":{"$nin":["Jonathan Walsh","Dario Wunsch","Shawn Simon"]}}' \
    https://your-api-domain/1/classes/GameScore
```

为了获取有分数的对象，我们应该用：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"score":{"$exists":true}}' \
    https://your-api-domain/1/classes/GameScore
```

为了获取没有分数的对象，用：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"score":{"$exists":false}}' \
    https://your-api-domain/1/classes/GameScore
```

你还可以使用模糊查询，支持 PCRE 正则表达式：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"playerName":{"$regex":"smile.*"}}' \
    https://your-api-domain/1/classes/GameScore
```

> **注意**：模糊查询只对付费用户开放，付费后可直接使用。

如果您的查询条件某个列值要匹配另一个查询的返回值，举例有一个队伍（Team）保存了每个城市的得分情况且用户表中有一列为用户家乡（hometown），您可以创建一个查询来寻找用户的家乡是得分大于 0.5 的城市的所有运动员，就像这样查询：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"hometown":{"$select":{"query":{"className":"Team","where":{"winPct":{"$gt":0.5}}},"key":"city"}}}' \
    https://your-api-domain/1/users
```

反之查询 Team 中得分小于等于 0.5 的城市的所有运动员，构造查询如下：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"hometown":{"$dontSelect":{"query":{"className":"Team","where":{"winPct":{"$gt":0.5}}},"key":"city"}}}' \
    https://your-api-domain/1/users
```

#### 分页查询

你可以用 limit 和 skip 来做分页，limit 的默认值是 100，企业 pro 版套餐 limit 的最大值为 1000，其它版套餐 limit 的最大值为 500，就是说，为了获取在 400 到 600 之间的对象：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'limit=200' \
    --data-urlencode 'skip=400' \
    https://your-api-domain/1/classes/GameScore
```

#### 排序

你可以用 order 参数指定一个字段来排序，前面加一个负号的前缀表示降序，这样返回的对象会以 score 升序排列：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'order=score' \
    https://your-api-domain/1/classes/GameScore
```

而以下这样返回的对象会以 score 降序排列：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'order=-score' \
    https://your-api-domain/1/classes/GameScore
```

你可以用多个字段进行排序，只要用一个逗号隔开列表就可以，为了获取 GameScore，以 score 的升序和 name 的降序进行排序：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'order=score,-name' \
    https://your-api-domain/1/classes/GameScore
```

### 复合查询

| Key     | 操作                   |
| :------ | :--------------------- |
| `$or`   | 复合查询中的或查询     |
| `$and`  | 复合查询中的与查询     |

如果你想查询对象符合几种查询之一，你可以使用 `$or` 或 `$and` 操作符，带一个 JSON 数组作为它的值。例如，如果你想找到 player 赢了很多或者赢了很少，你可以用如下的方式：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"$or":[{"wins":{"$gt":150}},{"wins":{"$lt":5}}]}' \
    https://your-api-domain/1/classes/Player
```

查询今天内的数据，方式如下：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"$and":[{"createdAt":{"$gte":{"__type":"Date","iso":"2014-07-15 00:00:00"}}},{"createdAt":{"$lte":{"__type":"Date","iso":"2014-07-15 23:59:59"}}}]}' \
    https://your-api-domain/1/classes/Player
```

> **注意**：`createdAt` 和 `updatedAt` 是服务器自动生成的时间，在服务器保存的是精确到微秒值的时间，因此基于时间类型比较时，查询条件的结束时间建议 **加 1 秒** 以确保不遗漏数据。

任何在查询上的其他的约束都会对返回的对象生效，所以你可以用 `$or` 对其他的查询添加约束。

> **注意**：我们不会在 **组合查询的子查询** 中支持非过滤型的约束（例如：limit、skip、sort、include），但最外层的查询中是支持非过滤型约束的。

### 查询结果计数

如果你在使用 limit，或者如果返回的结果很多，你可能想要知道到底有多少对象应该返回，而不用把它们全部获得以后再计数，此时你可以使用 count 参数。举个例子，如果你仅仅是关心一个特定的玩家玩过的游戏数量：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"playerName":"Jonathan Walsh"}' \
    --data-urlencode 'count=1' \
    --data-urlencode 'limit=0' \
    https://your-api-domain/1/classes/GameScore
```

因为请求了 count 而且把 limit 设为了 0，返回的值里面只有计数，results 为空数组集。

```json
{
    "results": [],
    "count": 1337
}
```

如果有一个非 0 的 limit 的话，既会返回正确的 results 也会返回 count 的值。

### 查询指定列

你可以限定返回的字段，通过传入 keys 参数，值为用一个逗号分隔的字段名称列表，为了获取对象只包含 score 和 playerName 字段（还有特殊的内置字段比如 objectId、createdAt 和 updatedAt），请求如下：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'keys=score,playerName' \
    https://your-api-domain/1/classes/GameScore
```

### 统计相关的查询

Bmob 的统计查询，提供以下关键字或其组合的查询操作：

| Key         | 操作                     |
| :---------- | :----------------------- |
| `groupby`   | 分组操作                 |
| `groupcount`| 返回每个分组的总记录     |
| `sum`       | 计算总和                 |
| `average`   | 计算平均值               |
| `max`       | 计算最大值               |
| `min`       | 计算最小值               |
| `having`    | 分组中的过滤条件         |

为避免和用户创建的列名称冲突，Bmob 约定以上统计关键字（sum、max、min）的查询结果值都用 `_(关键字)+首字母大写的列名` 的格式，如计算玩家得分列名称为 score 总和的操作，则返回的结果集会有一个列名为 `_sumScore`。average 返回的列为 `_avg+首字母大写的列名`，有 groupcount 的情形下则返回 `_count`。

以上关键字除了 groupcount 是传 Boolean 值 true 或 false，having 传的是和 where 类似的 json 字符串，但 having 只应该用于过滤分组查询得到的结果集，即 having 只应该包含结果集中的列名如 `{"_sumScore":{"$gt":100}}`，其他关键字必须是字符串而必须是表中包含的列名，多个列名用逗号分隔。

比如，GameScore 表是游戏玩家的信息和得分表，有 playerName（玩家名称）、score（玩家得分）等你自己创建的列，还有 Bmob 的默认列 objectId、createdAt、updatedAt，那么我们现在举例如何使用以上的查询关键字来作这个表的统计。

#### 计算总和

我们要计算 GameScore 表所有玩家的得分总和，sum 后面只能拼接 Number 类型的列名，即要计算哪个列的值的总和，只对 Number 类型有效，多个 Number 列用逗号分隔，则查询如下：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'sum=score' \
    https://your-api-domain/1/classes/GameScore
```

返回内容如下：

```json
[
    {
        "_sumScore": 2398
    }
]
```

#### 分组计算总和

比如我们以创建时间按天统计所有玩家的得分，并按时间降序，groupby 后面只能拼接列名，如果该列是时间类型，则按天分组，其他类型，则按确定值分组：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'sum=score&groupby=createdAt&order=-createdAt' \
    https://your-api-domain/1/classes/GameScore
```

返回内容如下：

```json
[
    {
        "_sumScore": 2398,
        "createdAt": "2014-02-05"
    },
    {
        "_sumScore": 1208,
        "createdAt": "2014-01-01"
    }
]
```

#### 多个分组并计算多个列的总和

比如我们以创建时间按天和按玩家名称分组统计所有玩家的得分1、得分2的总和，并按得分1的总和降序，groupby 后面只能拼接列名，如果该列是时间类型，则按天分组，其他类型，则按确定值分组：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'sum=score1,score2&groupby=createdAt,playerName&order=-_sumscore1' \
    https://your-api-domain/1/classes/GameScore
```

返回内容如下：

```json
[
    {
        "_sumScore1": 399,
        "_sumScore2": 120,
        "playerName": "John",
        "createdAt": "2014-02-05"
    },
    {
        "_sumScore1": 299,
        "_sumScore2": 250,
        "playerName": "Bily",
        "createdAt": "2014-02-05"
    },
    {
        "_sumScore1": 99,
        "_sumScore2": 450,
        "playerName": "John",
        "createdAt": "2014-02-01"
    }
]
```

#### 分组计算总和并只返回满足条件的部分值

比如我们以创建时间按天统计所有玩家的得分，并只返回某天的总得分大于 2000 的记录，并按时间降序，having 是用于过滤部分结果，其中的 `_sumScore` 是 `_sum+首字母大写的列名` 的格式表示是计算这个列的总和的值：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'sum=score&having={"_sumScore":{"$gt": 2000}}&groupby=createdAt&order=-createdAt' \
    https://your-api-domain/1/classes/GameScore
```

返回内容如下：

```json
[
    {
        "_sumScore": 2398,
        "createdAt": "2014-02-05"
    }
]
```

#### 分组计算总和并返回每个分组的记录数

比如我们以创建时间按天统计所有玩家的得分和每一天有多少条玩家的得分记录，并按时间降序：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'sum=score&groupby=createdAt&groupcount=true&order=-createdAt' \
    https://your-api-domain/1/classes/GameScore
```

返回内容如下：

```json
[
    {
        "_sumScore": 2398,
        "_count": 10,
        "createdAt": "2014-02-05"
    },
    {
        "_sumScore": 100,
        "_count": 2,
        "createdAt": "2014-01-01"
    }
]
```

#### 获取不重复的列值

比如我们获取表中所有的唯一 score：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'groupby=score' \
    https://your-api-domain/1/classes/GameScore
```

返回内容如下：

```json
[
    {
        "score": 78
    },
    {
        "score": 89
    }
]
```

#### 其他关键字

average（计算平均值）、max（计算最大值）、min（计算最小值）和 sum 查询语句是类似的，只用把上面的例子中的 sum 替换为相应的 average、max、min 就可以了。

### BQL 查询

我们还提供类 SQL 语法的 BQL 查询语言来查询数据，例如：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'bql=select * from Player limit 0,100 order by name' \
    https://your-api-domain/1/cloudQuery
```

更多请参考 [BQL 详细指南](/other/Other/m_bql/doc/index.html "BQL 详细指南")。

BQL 还支持占位符查询，where 和 limit 子句的条件参数可以使用问号替换，然后通过 `values` 数组传入：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'bql=select * from Player where name=? limit ?,? order by name' \
    --data-urlencode 'values=["dennis", 0, 100]' \
    https://your-api-domain/1/cloudQuery
```

## 数组

为了存储数组型数据，[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 提供了 3 种操作来原子性地更改一个数组字段：

- **Add**：在一个数组字段的后面添加一些指定的对象（包装在一个数组内）
- **AddUnique**：只会在原本数组字段中没有这些对象的情形下才会添加入数组，插入数组的位置不固定的
- **Remove**：从一个数组字段的值内移除指定的数组中的所有对象

### 添加数组数据

**请求描述**

添加数据时添加一个数组字段。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>`
- method：POST
- header：（公共 Header）
- body：

```json
{
    "<key1>": { "__op": "Add", "objects": ["<value1>", "<value2>"] }
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "createdAt": "YYYY-mm-dd HH:ii:ss",
    "objectId": "<objectId>"
}
```

**例子**

给 GameScore 添加一条记录其中一个字段为数组，包含一些技能，可进行如下请求：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"skill":{"__op":"Add","objects":["skill1","skill2"]}}' \
    https://your-api-domain/1/classes/GameScore
```

### 更新数组数据

#### 普通更新

**请求描述**

数组对象生成后，还可以对其进行更新，往数组里面添加内容。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>/<objectId>`
- method：PUT
- header：（公共 Header）
- body：

```json
{
    "<key1>": { "__op": "AddUnique", "objects": ["<value1>", "<value2>"] }
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "updatedAt": "YYYY-mm-dd HH:ii:ss"
}
```

**例子**

如在 GameScore 的 e1kXT22L 再添加两个技能，并且只有在这两个技能不存在时才加入，则可以使用以下请求：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"skills":{"__op":"AddUnique","objects":["flying","kungfu"]}}' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

#### 使用索引和对象 Key 修改数组中的对象

**请求描述**

当数组中存储的是 JSON 对象时，可以使用该请求单独修改 JSON 对象中的某个值。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>/<objectId>`
- method：PUT
- header：（公共 Header）
- body：

```json
{
    "<key1>.<number>.<keyOfJson>": "<value1>",
    "<key2>.<number>.<keyOfJson>": "<value2>"
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "updatedAt": "YYYY-mm-dd HH:ii:ss"
}
```

**例子**

比如你当前行有一列叫用户的工作经验 projectExperiences，是一个 Array 数组列，里面包含了多个对象值：`[{"name":"项目名称","descr":"项目描述","startTime":"开始时间","endTime":"结束时间"}, ...]`

那么我们要修改 projectExperiences 数组中第一个对象的 name 值：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"projectExperiences.0.name":"项目名称2"}' \
    https://your-api-domain/1/users/e1kXT22L
```

### 删除数组数据

**请求描述**

从一个数组字段的值内移除指定的数组中的所有对象。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>/<objectId>`
- method：PUT
- header：（公共 Header）
- body：

```json
{
    "<key1>": { "__op": "Remove", "objects": ["<value1>", "<value2>"] }
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "updatedAt": "YYYY-mm-dd HH:ii:ss"
}
```

**例子**

把 GameScore 里 objectId 为 `e1kXT22L` 对象的技能移除：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"skills":{"__op":"Remove","objects":["flying","kungfu"]}}' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

### 查询数组数据

**请求描述**

查询数组字段中包含特定值或同时包含若干个值的记录。

**请求**

- url：`https://your-api-domain/1/classes/<TableName>`
- method：GET
- params:
  - 查找数组中含有特定值：`where={"<arrayKey>": "<value>"}`
  - 查找数组同时含有若干个值：`where={"<arrayKey>": {"$all": ["<value1>", "<value2>"]}}`
- header：（公共 Header）

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "results": [
        {
            "<key1>": "<value1>",
            "<key2>": "<value2>"
        },
        {
            "<key1>": "<value1>",
            "<key2>": "<value2>"
        }
    ]
}
```

**例子**

例如，可以查找 Key 的数组值中包含有 2 的对象：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"arrayKey":2}' \
    https://your-api-domain/1/classes/RandomObject
```

还同样可以使用 `$all` 操作符来找到类型为数组的 Key 的值中包含有 2、3 和 4 的对象：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"arrayKey":{"$all":[2,3,4]}}' \
    https://your-api-domain/1/classes/RandomObject
```

## 数据关联

### 关联对象

在程序设计中，不同类型的数据之间可能存在某种关系。分别是以下三种：

1. 一对一，比如车队给司机分车，1 个司机对应 1 台车；
2. 一对多，比如 1 个作者会对应多篇贴子；
3. 多对多，比如 1 篇帖子会有多个喜欢的读者，而每个读者也会有多篇喜欢的帖子。

前面的两种关系我们提供 Pointer 类型来表示，而最后一种关系我们使用 Relation 类型来表示。

在下面的讲解中我们可能会使用到以下的两张表，其表结构如下：

**_User**

| 字段     | 类型   | 含义                                         |
| :------- | :----- | :------------------------------------------- |
| objectId | string |                                              |
| username | string | 用户名，用户可以是作者发帖子，也可以是读者发评论 |

**Post**

| 字段     | 类型           | 含义               |
| :------- | :------------- | :----------------- |
| objectId | string         |                    |
| title    | string         | 帖子标题           |
| content  | string         | 帖子内容           |
| author   | Pointer(_User) | 作者               |
| likes    | Relation(_User)| 喜欢帖子的读者     |

### Pointer 的使用

Pointer 可用于表示一对一及一对多的关系。

Pointer 本质类似于指针，使用 `className` 和 `objectId` 来定位具体的对象。具体的操作如下。

#### 添加 Pointer

添加 Pointer 其实与普通的添加对象是一样的，使用的请求也是添加对象的接口，只是其中的 key-value 对中的 value 的格式为：

```json
{
    "__type": "Pointer",
    "className": "<tableName>",
    "objectId": "<objectId>"
}
```

例如，如果我们需要添加一篇帖子，并关联至其作者，可以采用以下请求：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "how to user pointer",
        "user": {
            "__type": "Pointer",
            "className": "_User",
            "objectId": "DdUOIIIW"
        }
    }' \
    https://your-api-domain/1/classes/GameScore
```

#### 删除 Pointer

与删除普通列值一样，例如要删除帖子（Post）的作者，如下：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"author":{"__op":"Delete"}}' \
    https://your-api-domain/1/classes/Post/e1kXT22L
```

#### 修改 Pointer

与修改普通列值一样，只是新的值需要满足 Pointer 的格式，如下：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "title": "how to user pointer",
        "user": {
            "__type": "Pointer",
            "className": "_User",
            "objectId": "<objectId>"
        }
    }' \
    https://your-api-domain/1/classes/Post/e1kXT22L
```

> **注意**：`objectId` 需要替换为新关联作者的实际 objectId。

#### 查询 Pointer

在某些情况之下，你可能需要在一个查询之中返回关联对象的所有值，你可以通过传入字段名称到 include 参数中，多个字段名称用逗号间隔。比如，在查询 Post 时还想将其相关联的 user 对象取出来，如下：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'include=author' \
    https://your-api-domain/1/classes/Post
```

返回的 user 字段的值如下：

```json
{
    "__type": "Object",
    "className": "_User",
    "objectId": "51e3a359e4b015ead4d95ddc",
    "createdAt": "2011-12-06T20:59:34.428Z",
    "updatedAt": "2011-12-06T20:59:34.428Z",
    "otherFields": "willAlsoBeIncluded"
}
```

而没有使用 include 时，返回的 user 字段值则是如下形式：

```json
{
    "__type": "Pointer",
    "className": "_User",
    "objectId": "51e3a359e4b015ead4d95ddc"
}
```

你可以同样做多层的 include，这时要使用 `.` 号。如果你要 include 一条评论（Comment）对应的帖子（Post）的作者（author）：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'order=-createdAt' \
    --data-urlencode 'limit=10' \
    --data-urlencode 'include=post.author' \
    https://your-api-domain/1/classes/Comment
```

如果你要构建一个查询，这个查询要 include 多个 Pointer 类型的 Key，此时用逗号分隔 Key 名称列表即可。

另外，include 还可以只返回指定的 keys，即 Pointer 类型的字段指向的表只返回指定的字段，举例如下：

> **建议**：建议大家使用以下方式，只返回需要的值，性能更好，流量更少。

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'include=post[likes].author[username|email],user[username]' \
    https://your-api-domain/1/classes/Comment
```

post 指向的帖子表只返回 likes 字段，而 author 指向的用户表只返回 username 和 email 字段，user 指向的用户表只返回 username 字段。

#### 约束 Pointer 值查询

在查询当中，我们可以对字符串、数组、数字等进行约束，比如查询 Post 表时，我们可以指定只返回 title 以 "a" 开头的 Post 对象。那么 Pointer 能不能也进行约束呢？如下：

1. 如果约束的是某个特定对象，即知道该对象的 objectId，您可以用一个 `where` 参数查询，自己使用 `__type` 构造一个 Pointer，就像你构造其他数据类型一样。举例说，如果每一条评论（Comment 对象）有一个 Key 叫 post，类型是 Pointer，并且指向了一个具体的帖子（Post 对象，用 objectId 表示一个帖子），那么您可以使用下面的请求获取一个帖子的所有评论：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"post":{"__type":"Pointer","className":"Post","objectId":"1dafb9ed9b"}}' \
    https://your-api-domain/1/classes/Comment
```

2. 如果想要约束关联对象除 objectId 外的其它值，比如我想要返回所有指向的 author 指向的对象，其 username 都为 Lily 的 Post 对象，该如何做呢？我们可以使用 `$inQuery` 来完成，具体如下：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"author":{"$inQuery":{"where":{"username":"Lily"},"className":"_User"}}}' \
    https://your-api-domain/1/classes/Post
```

如果需求是不匹配查询条件的，比较要找 username 不是 Lily 的 Post 对象，只需要将 `$inQuery` 替换成 `$notInQuery` 即可。

### Relation 的使用

Relation 可用于表示多对多的关系。其本质是一个 Pointer 的数组。具体的操作介绍如下。

#### 添加 Relation

添加 Relation 使用的也是添加对象的接口，对应的 key-value 对中的 value 需要满足以下格式：

```json
{
    "<key>": {
        "__op": "AddRelation",
        "objects": [
            {
                "__type": "Pointer",
                "className": "<className>",
                "objectId": "<objectId>"
            },
            {
                "__type": "Pointer",
                "className": "<className>",
                "objectId": "<objectId>"
            }
        ]
    }
}
```

如需要给一个 Post 对象添加两个喜欢该 Post 的读者，可以使用以下方法：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "likes": {
            "__op": "AddRelation",
            "objects": [
                {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": "z0lOxp1X"
                },
                {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": "MTzXDDDG"
                }
            ]
        }
    }' \
    https://your-api-domain/1/classes/Post/z0lOxp12
```

#### 删除 Relation

与普通的更新对象接口一样，只是需要使用特定的格式，具体如下：

```json
{
    "<key>": {
        "__op": "RemoveRelation",
        "objects": [
            {
                "__type": "Pointer",
                "className": "<className>",
                "objectId": "<objectId>"
            },
            {
                "__type": "Pointer",
                "className": "<className>",
                "objectId": "<objectId>"
            }
        ]
    }
}
```

如有读者取消了对某篇帖子的收藏，可以进行如下操作：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "likes": {
            "__op": "RemoveRelation",
            "objects": [
                {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": "z0lOxp1X"
                }
            ]
        }
    }' \
    https://your-api-domain/1/classes/Post/z0lOxp2a
```

#### 查询 Relation

如果我们需要查询喜欢某篇帖子的所有作者，那么可以使用 `$relatedTo`，可以使用以下请求，与 Pointer 不同的是，此处我们直接查询的是 _User 表，`$relatedTo` 跟的是帖子的具体记录。

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"$relatedTo":{"object":{"__type":"Pointer","className":"Post","objectId":"1dafb9ed9b"},"key":"likes"}}' \
    https://your-api-domain/1/users
```

#### 约束 Relation 进行查询

跟 Pointer 一样，我们同样可以使用 `$inQuery` 和 `$notInQuery` 对 Relation 的指向的对象的某些属性进行约束。例如，如果需要找到 Lily 喜欢的所有帖子，可以使用以下请求：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"likes":{"$inQuery":{"where":{"username":"Lily"},"className":"_User"}}}' \
    https://your-api-domain/1/classes/Post
```

## 用户管理

很多跨平台和跨系统的应用都有一个统一的登录流程，[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 通过 REST API 访问用户的账户让你实现该功能。

通常来说，用户这个类的功能与其他的对象是相同的，比如都没有限制模式（Schema Less），User 对象和其他对象不同的是一个用户必须有用户名（username）和密码（password），密码会被自动地加密和存储。[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 强制你 username 和 email 这两个 Key 的值必须是不重复的。

### 属性

Bmob 默认会有几个特定的属性：

- `username`：用户的用户名（必需）
- `password`：用户的密码（必需）
- `email`：用户的电子邮件地址（可选）

### 注册用户

**请求描述**

注册一个新用户与创建一个新的普通对象之间的不同点在于其 username 和 password 字段都是必要的，password 字段会以与其他的字段不一样的方式处理，它在保存时会被加密而且永远不会被返回给任何来自客户端的请求。

在你的应用设置页面中，你可以向 [Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 来请求认证邮件地址，这项设置启用了的话，所有用户在注册时填写 email 这个 Key 的值，并且邮箱有效的情况下，就会向这个邮箱地址发出一封邮件，邮件中会包含一个来自 Bmob 的邮箱验证的链接，当你的用户查收邮件并点击这个链接后，这个用户 emailVerified 的 Key 的值会置为 true，你可以在 emailVerified 字段上查看用户的 email 是否已经通过验证了。

为了注册一个新的用户，需要向 user 路径发送一个 POST 请求，你可以加入一个甚至多个新的字段。

**请求**

- url：`https://your-api-domain/1/users`
- method：POST
- header：（公共 Header）
- body：

```json
{
    "username": "<username>",
    "password": "<password>",
    "<key1>": "<value1>",
    "<key2>": "<value2>"
}
```

**成功时响应**

- status: `201 Created`
- body:

返回的主体是一个 JSON 对象，包含 `objectId`（表示唯一的用户）、`createdAt`（时间戳表示用户注册时间）、`sessionToken`（可以被用来认证更新或删除这名用户信息的请求）。

```json
{
    "createdAt": "YYYY-mm-dd HH:ii:ss",
    "objectId": "<objectId>",
    "sessionToken": "<sessionToken>"
}
```

**例子**

例如，创建一个有家庭电话字段的新用户：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"username":"cooldude6","password":"b_m7!-o8","phone":"415-392-0202"}' \
    https://your-api-domain/1/users
```

其返回值如下：

```json
{
    "createdAt": "2011-11-07 20:58:34",
    "objectId": "Kc3M222J",
    "sessionToken": "pnktnjyb996sj4p156gjtp4im"
}
```

> **注意**：有些时候你可能需要在用户注册时发送一封验证邮件，以确认用户邮箱的真实性。这时，你只需要登录自己的应用管理后台，在设置->邮件设置中把"邮箱验证"功能打开，Bmob 云后端就会在注册时自动发送一封验证邮件给用户。

### 使用手机号码一键注册或登陆

**请求描述**

[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 支持让用户直接输入手机号码进行注册，如果手机号码存在则自动登陆。

**请求**

- url：`https://your-api-domain/1/users`
- method：POST
- header：（公共 Header）
- body：

```json
{
    "mobilePhoneNumber": "<phoneNumber>",
    "smsCode": "<smsCode>",
    "<key1>": "<value1>",
    "<key2>": "<value2>"
}
```

其中 `mobilePhoneNumber` 就是手机号码，而 `smsCode` 是使用 [请求短信验证码 API](http://doc.bmobapp.com/sms/restful/ "请求短信验证码API") 发送到用户手机上的 6 位验证码字符串。如果是新用户且不传入 username，默认用户名将是手机号码。

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "username": "<username>",
    "mobilePhoneNumber": "<mobilePhoneNumber>",
    "mobilePhoneVerified": true,
    "createdAt": "YYYY-mm-dd HH:ii:ss",
    "updatedAt": "YYYY-mm-dd HH:ii:ss",
    "objectId": "<objectId>",
    "sessionToken": "<sessionToken>"
}
```

如果是第一次注册，将默认设置 _User 表的 `mobilePhoneVerified` 属性为 true。

**例子**

创建一个用户如下：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"mobilePhoneNumber":"185xxxxxxxx","smsCode":"6位短信验证码"}' \
    https://your-api-domain/1/users
```

返回值：

```json
{
    "username": "185xxxxxxxx",
    "mobilePhoneNumber": "185xxxxxxxx",
    "mobilePhoneVerified": true,
    "createdAt": "2011-11-07 20:58:34",
    "updatedAt": "2011-11-07 20:58:34",
    "objectId": "Kc3M222J",
    "sessionToken": "pnktnjyb996sj4p156gjtp4im"
}
```

### 登录用户

**请求描述**

你的用户注册之后，你需要让他们用自己的用户名和密码登录，为了做到这一点，发送一个 HTTP POST 请求到 `/1/login`，在请求体中携带 JSON 格式的参数。

另外，username 支持传入 _User 表的 username 或 email 或 mobilePhoneNumber 字段的值，作为登录的扩展功能，以实现邮箱和密码、手机号和密码登录功能。

除了有用户名或邮箱或手机号码和密码登录的功能，Bmob 还支持使用手机号码和验证码一键快速登录的功能，而 `smsCode` 是使用 [请求短信验证码 API](#请求短信验证码) 发送到用户手机上的 6 位验证码字符串。

同时，登录接口也支持 **邮箱 + 验证码** 的方式登录，此时 username 传入邮箱地址，smsCode 使用 [请求邮件验证码 API](#请求邮件验证码) 发送到用户邮箱的验证码。

**请求**

- url：`https://your-api-domain/1/login`
- method：POST
- header：（公共 Header）
- body:

方式一 — 用户名密码登录：

```json
{
    "username": "<username>",
    "password": "<password>"
}
```

> `username` 也可以使用 email 或 mobilePhoneNumber。

方式二 — 手机号验证码登录：

```json
{
    "mobilePhoneNumber": "<phoneNumber>",
    "smsCode": "<smsCode>"
}
```

方式三 — 邮箱验证码登录：

```json
{
    "username": "<email>",
    "smsCode": "<emailCode>"
}
```

> 邮件验证码与短信验证码共用验证接口。

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "username": "<username>",
    "mobilePhoneNumber": "<mobilePhoneNumber>",
    "mobilePhoneVerified": true,
    "createdAt": "YYYY-mm-dd HH:ii:ss",
    "updatedAt": "YYYY-mm-dd HH:ii:ss",
    "objectId": "<objectId>",
    "sessionToken": "<sessionToken>"
}
```

**例子**

使用用户名加密码登陆：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"username":"cooldude6","password":"b_m7!-o8"}' \
    https://your-api-domain/1/login
```

使用手机号加验证码登陆：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"mobilePhoneNumber":"185xxxxxxxx","smsCode":"6位短信验证码"}' \
    https://your-api-domain/1/login
```

使用邮箱加验证码登陆：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"username":"user@example.com","smsCode":"6位邮件验证码"}' \
    https://your-api-domain/1/login
```

### 获取当前用户

**请求描述**

当注册一个用户后，你可以通过发送一个 HTTP GET 请求到用户注册成功时返回的 HTTP 请求头中的 Location 的 URL 获取用户的信息。

**请求**

- url：`https://your-api-domain/1/users/<objectId>`
- method：GET
- header：（公共 Header）

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "username": "<username>",
    "createdAt": "YYYY-mm-dd HH:ii:ss",
    "updatedAt": "YYYY-mm-dd HH:ii:ss",
    "objectId": "<objectId>"
}
```

**例子**

获取 objectId 为 `Kc3M222J` 的用户可以使用以下请求：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/1/users/Kc3M222J
```

### 检查用户的登录是否过期

**请求描述**

当用户登录后，系统会返回用户一个 session token，用这个 API 可以检查这个 session token 是否过期。

**请求**

- url：`https://your-api-domain/1/checkSession/<objectId>`
- method：GET
- header：

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
X-Bmob-Session-Token: Your Session Token
Content-Type: application/json
```

**不过期时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**过期时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "fail"
}
```

**例子**

检查用户 objectId 为 `Kc3M222J` 的 session token 是否过期：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "X-Bmob-Session-Token: Your Session Token" \
    https://your-api-domain/1/checkSession/Kc3M222J
```

### 更新用户

**请求描述**

在通常的情况下，我们都不希望用户去修改自己的数据，但可以通过认证让用户去做这件事，用户必须加入一个 `X-Bmob-Session-Token` 头部来请求这个更新操作，这个 sessionToken 在注册和登录时都会返回。该值的有效期为 7 天。

为了改动一个用户已经有的数据，需要对这个用户的 URL 发送一个 HTTP PUT 请求，任何你没有指定的 key 会保持不变，所以你可以只改动用户信息中的一部分，username 和 password 可以更改，但是新的 username 不能重复。

**请求**

- url：`https://your-api-domain/1/users/<objectId>`
- method：PUT
- header：

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: application/json
X-Bmob-Session-Token: <sessionToken>
```

- body:

```json
{
    "<key1>": "<value1>",
    "<key2>": "<value2>"
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "updatedAt": "YYYY-mm-dd HH:ii:ss"
}
```

**例子**

比如，如果我们想对 cooldude6 的电话做出一些改动，可以采用如下请求：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "X-Bmob-Session-Token: pnktnjyb996sj4p156gjtp4im" \
    -H "Content-Type: application/json" \
    -d '{"phone":"415-369-6201"}' \
    https://your-api-domain/1/users/Kc3M222J
```

> **注意**：在更新用户信息时，如果用户邮箱有变更并且在管理后台打开了邮箱验证选项的话，Bmob 云后端同样会自动发送一封验证邮件给用户。

### 删除用户

**请求描述**

为了在 [Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 上删除一个用户，可以向用户的 URL 上发送一个 DELETE 请求，前提是你必须提供一个 X-Bmob-Session-Token 在 Http 请求头以便认证授权。

当然了，你也可以直接把 MasterKey 传入到 `X-Bmob-Master-Key` 中，这个就可以实现在不需要提供 SessionToken 的情形下更新和删除用户了，但希望只在开发环境下使用，不要把 MasterKey 发布出去。

**请求**

- url：`https://your-api-domain/1/users/<objectId>`
- method：DELETE
- header：

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: application/json
X-Bmob-Session-Token: <sessionToken>
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**例子**

删除 objectId 为 `g7y9tkhB7O` 的用户：

```bash
curl -X DELETE \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "X-Bmob-Session-Token: pnktnjyb996sj4p156gjtp4im" \
    https://your-api-domain/1/users/g7y9tkhB7O
```

### 查询用户

**请求描述**

你可以一次获取多个用户，只要向用户的根 URL 发送一个 GET 请求，没有任何 URL 参数的话，可以简单地列出所有用户。

所有的对普通对象的查询选项都适用于对用户对象的查询，所以可以查看 [查询](#查询) 部分来获取详细信息。

User 表是一个特殊的表，专门用于存储用户对象。在浏览器端，你会看到一个 User 表旁边有一个小人的图标。

**请求**

- url：`https://your-api-domain/1/users`
- method：GET
- header：（公共 Header）

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "results": [
        {
            "username": "<username>",
            "createdAt": "YYYY-mm-dd HH:ii:ss",
            "updatedAt": "YYYY-mm-dd HH:ii:ss",
            "objectId": "<objectId>"
        },
        {
            "username": "<username>",
            "createdAt": "YYYY-mm-dd HH:ii:ss",
            "updatedAt": "YYYY-mm-dd HH:ii:ss",
            "objectId": "<objectId>"
        }
    ]
}
```

**例子**

获取当前用户表的所有用户信息：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/1/users
```

### 密码重置

共提供了 3 种方法，分别是 Email 重置、短信验证码重置、旧密码重置。

#### Email 重置

**请求描述**

你可以使用这项功能，前提是用户将 email 与他们的账户关联起来，如果要重设密码，发送一个 POST 请求到 `/1/requestPasswordReset`，同时在 request 的 body 部分带上 email 字段。

密码重置流程如下：

1. 用户输入他们的电子邮件，请求重置自己的密码。
2. Bmob 向他们的邮箱发送一封包含特殊的密码重置连接的电子邮件，此邮件的模板可在 Bmob 后台中修改。
3. 用户根据向导点击重置密码连接，打开一个特殊的 Bmob 页面，输入一个新的密码。
4. 用户的密码已被重置为新输入的密码。

**请求**

- url：`https://your-api-domain/1/requestPasswordReset`
- method：POST
- header：（公共 Header）
- body:

```json
{
    "email": "<emailAddress>"
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**例子**

重置用户邮箱为 `coolguy@iloveapps.com` 的用户密码：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"email":"coolguy@iloveapps.com"}' \
    https://your-api-domain/1/requestPasswordReset
```

#### 使用短信验证码进行密码重置

**请求描述**

如果用户有绑定了手机号码，就可以通过手机验证码短信来实现使用手机号码找回密码的功能，先调用 [请求短信验证码 API](#请求短信验证码) 会将验证码发送到用户手机上，用户收到验证码并输入后，调用 `PUT /1/resetPasswordBySmsCode/<smsCode>` 来为用户设置新的密码。

**请求**

- url：`https://your-api-domain/1/resetPasswordBySmsCode/<smsCode>`
- method：PUT
- header：（公共 Header）
- body:

```json
{
    "password": "<newPassword>"
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**例子**

以下为短信验证码重置样例：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"password": "testPass"}' \
    https://your-api-domain/1/resetPasswordBySmsCode/123987
```

#### 提供旧密码方式安全修改用户密码

**请求描述**

很多开发者希望让用户输入一次旧密码做一次校验，旧密码正确才可以修改为新密码，因此我们提供了一个单独的 API `PUT /1/updateUserPassword/<objectId>` 来安全地修改用户密码。

> **注意**：仍然需要传入 `X-Bmob-Session-Token`，也就是登录用户才可以修改自己的密码。

**请求**

- url：`https://your-api-domain/1/updateUserPassword/<objectId>`
- method：PUT
- header：

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: application/json
X-Bmob-Session-Token: <sessionToken>
```

- body:

```json
{
    "oldPassword": "<用户的老密码>",
    "newPassword": "<用户的新密码>"
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**例子**

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "X-Bmob-Session-Token: pnktnjyb996sj4p156gjtp4im" \
    -H "Content-Type: application/json" \
    -d '{"oldPassword": "123","newPassword": "456"}' \
    https://your-api-domain/1/updateUserPassword/g7y9tkhB7O
```

> `g7y9tkhB7O` 为当前登录用户的 objectId，`pnktnjyb996sj4p156gjtp4im` 为用户 sessionToken。

### 邮箱验证

设置邮件验证是一个可选的应用设置，这样可以对已经确认过邮件的用户提供一部分保留的体验，邮件验证功能会在用户（User）对象中加入 emailVerified 字段，当一个用户的邮件被新添加或者修改过的话，emailVerified 会默认被设为 false，如果应用设置中开启了邮箱认证功能，[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 会对用户填写的邮箱发送一个链接，这个链接可以把 emailVerified 设置为 true。

emailVerified 字段有 3 种状态可以考虑：

- **true**：用户可以点击邮件中的链接通过 Bmob 来验证地址，一个用户永远不会在新创建这个值的时候出现 emailVerified 为 true。
- **false**：用户（User）对象最后一次被刷新的时候，用户并没有确认过他的邮箱地址，如果你看到 emailVerified 为 false 的话，你可以考虑刷新用户（User）对象。
- **missing**：用户（User）对象已经被创建，但应用设置并没有开启邮件验证功能；或者用户（User）对象没有 email 邮箱。

**请求描述**

发送到用户邮箱验证的邮件会在一周内失效，可以通过调用 `/1/requestEmailVerify` 来强制重新发送。

**请求**

- url：`https://your-api-domain/1/requestEmailVerify`
- method：POST
- header：（公共 Header）
- body:

```json
{
    "email": "<emailAddress>"
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**例子**

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"email":"coolguy@iloveapps.com"}' \
    https://your-api-domain/1/requestEmailVerify
```

### 请求邮件验证码

**请求描述**

发送用于登录或验证的邮件验证码到指定邮箱。该接口与 [请求短信验证码](#请求短信验证码) 类似，区别在于验证码通过邮件方式发送，可用于邮箱 + 验证码登录场景。

验证码验证时与短信验证码共享同一个验证接口 `POST /1/verifySmsCode`。

**请求**

- url：`https://your-api-domain/1/requestEmailCode`
- method：POST
- header：（公共 Header）
- body:

```json
{
    "email": "<emailAddress>"
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**例子**

发送邮件验证码到指定邮箱：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com"}' \
    https://your-api-domain/1/requestEmailCode
```

### 验证短信/邮件验证码

**请求描述**

验证短信或邮件验证码是否正确。该接口同时支持短信验证码和邮件验证码的验证，验证成功后验证码立即过期。

**请求**

- url：`https://your-api-domain/1/verifySmsCode`
- method：POST
- header：（公共 Header）
- body:

```json
{
    "mobilePhoneNumber": "<phoneNumber>",
    "smsCode": "<smsCode>"
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**例子**

验证手机号短信验证码：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"mobilePhoneNumber":"13711161111","smsCode":"123456"}' \
    https://your-api-domain/1/verifySmsCode
```

### 用户账户连接

Bmob 允许你连接你的用户到第三方账户服务系统，比如新浪微博和 QQ，这样就允许您的用户用已经存在的第三方账户直接登录您的 App。通过注册或者更新的用户信息的功能，使用 `authData` 字段来保存第三方服务的授权信息就可以做到。一旦用户关联了某个第三方账户，`authData` 将被存储到您的 Bmob 的用户信息里，并通过登录即可重新获取到。

`authData` 是一个普通的 JSON 对象，它所要求的 key 根据第三方账户服务不同而不同，具体要求见下面。每种情况下，你都需要自己负责完成整个授权过程（一般是通过 OAuth 协议，1.0 或者 2.0）通过连接的 API 来获取授权信息。

新浪微博的 `authData` 内容：

```json
{
    "authData": {
        "weibo": {
            "uid": "123456789",
            "access_token": "2.00ed6eMCV9DWcBcb79e8108f8m1HdE",
            "expires_in": 1564469423540
        }
    }
}
```

腾讯 QQ 的 `authData` 内容：

```json
{
    "authData": {
        "qq": {
            "openid": "2345CA18A5CD6255E5BA185E7BECD222",
            "access_token": "12345678-SM3m2avZxh5cjJmIrAfx4ZYyamdofM7IjU",
            "expires_in": 1382686496
        }
    }
}
```

匿名用户（Anonymous user）的 `authData` 内容：

```json
{
    "anonymous": {
        "id": "random UUID with lowercase hexadecimal digits"
    }
}
```

#### 注册和登录

**请求描述**

使用一个第三方账户连接服务来注册用户并登录，同样使用 POST 请求 `/1/users`，只是需要提供 authData 字段。

**请求**

- url：`https://your-api-domain/1/users`
- method：POST
- header：（公共 Header）
- body:

```json
{
    "authData": {
        "<platform>": {
            "uid": "<uid>",
            "access_token": "<accessToken>",
            "expires_in": "<expiresIn>"
        }
    }
}
```

**成功时响应**

Bmob 会校验提供的 authData 是否有效，并检查是否已经有一个用户连接了这个 authData 服务。如果已经有用户存在并连接了同一个 authData，那么 HTTP 响应头将返回 `200 OK` 和详细信息（包括用户的 sessionToken）：

```
Status: 200 OK
Location: https://your-api-domain/1/users/<objectId>
```

应答的 body 类似：

```json
{
    "username": "<username>",
    "createdAt": "YYYY-mm-dd HH:ii:ss",
    "updatedAt": "YYYY-mm-dd HH:ii:ss",
    "objectId": "<objectId>",
    "sessionToken": "<sessionToken>",
    "authData": {
        "<platform>": {
            "uid": "<uid>",
            "access_token": "<accessToken>",
            "expires_in": "<expiresIn>"
        }
    }
}
```

如果用户还没有连接到这个帐号，则你会收到 `201 Created` 的应答状态码，标识新的用户已经被创建：

```
Status: 201 Created
Location: https://your-api-domain/1/users/<objectId>
```

应答内容包括 objectId、createdAt、sessionToken 以及一个自动生成的随机 username：

```json
{
    "username": "<username>",
    "createdAt": "YYYY-mm-dd HH:ii:ss",
    "objectId": "<objectId>",
    "sessionToken": "<sessionToken>"
}
```

**例子**

例如，使用新浪微博账户注册或者登录用户：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "authData": {
            "weibo": {
                "uid": "123456789",
                "access_token": "2.00ed6eMCV9DWcBcb79e8108f8m1HdE",
                "expires_in": 1564469423540
            }
        }
    }' \
    https://your-api-domain/1/users
```

#### 连接

**请求描述**

连接一个现有的用户到新浪微博或者腾讯 QQ 帐号，可以通过发送一个 PUT 请求附带 authData 字段到以上 Location 返回的用户 URL 做到。

**请求**

- url：`https://your-api-domain/1/users/<objectId>`
- method：PUT
- header：

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: application/json
X-Bmob-Session-Token: <sessionToken>
```

- body:

```json
{
    "authData": {
        "<platform>": {
            "uid": "<uid>",
            "access_token": "<accessToken>",
            "expires_in": "<expiresIn>"
        }
    }
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "username": "<username>",
    "createdAt": "YYYY-mm-dd HH:ii:ss",
    "updatedAt": "YYYY-mm-dd HH:ii:ss",
    "objectId": "<objectId>",
    "sessionToken": "<sessionToken>",
    "authData": {
        "<platform>": {
            "uid": "<uid>",
            "access_token": "<accessToken>",
            "expires_in": "<expiresIn>"
        }
    }
}
```

**例子**

例如，连接一个用户到腾讯 QQ 帐号发起的请求类似这样：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "X-Bmob-Session-Token: pnktnjyb996sj4p156gjtp4im" \
    -H "Content-Type: application/json" \
    -d '{
        "authData": {
            "qq": {
                "openid": "2345CA18A5CD6255E5BA185E7BECD222",
                "access_token": "12345678-SM3m2avZxh5cjJmIrAfx4ZYyamdofM7IjU",
                "expires_in": 1382686496
            }
        }
    }' \
    https://your-api-domain/1/users/Kc3M222J
```

完成连接后，你可以使用匹配的 authData 来认证他们。

#### 断开连接

**请求描述**

断开一个现有用户到某个服务，可以发送一个 PUT 请求设置 authData 中对应的服务为 null 来做到。

**请求**

- url：`https://your-api-domain/1/users/<objectId>`
- method：PUT
- header：

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: application/json
X-Bmob-Session-Token: <sessionToken>
```

- body:

```json
{
    "authData": {
        "<platform>": null
    }
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "username": "<username>",
    "createdAt": "YYYY-mm-dd HH:ii:ss",
    "updatedAt": "YYYY-mm-dd HH:ii:ss",
    "objectId": "<objectId>",
    "sessionToken": "<sessionToken>",
    "authData": {
        "<platform>": null
    }
}
```

**例子**

例如，取消新浪微博关联：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "X-Bmob-Session-Token: pnktnjyb996sj4p156gjtp4im" \
    -H "Content-Type: application/json" \
    -d '{
        "authData": {
            "weibo": null
        }
    }' \
    https://your-api-domain/1/users/Kc3M222J
```

## 文件管理

Bmob 的新版文件采用了 CDN。

### 整个文件上传

**请求描述**

上传一个文件到 CDN。

**请求**

- url：`https://your-api-domain/2/files/<fileName>`（可以选择 BASE64 加密）
- method：POST
- header：

Content-Type 不同类型文件使用不同的值，可以参考：[http://tool.oschina.net/commons](http://tool.oschina.net/commons)

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: <contentType>
```

- body: 相应的文本或者二进制流

**成功时响应**

- status: `200`
- body:

返回的主体是一个 JSON 对象，包含：文件名（filename）、cdn 信息（cdnname）、文件地址（url）。

```json
{
    "filename": "<filename>",
    "url": "<url>",
    "cdn": "<cdnname>"
}
```

**例子**

上传一个 hello.txt 文件实现方法如下（-d 的值是文件内容）：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: text/plain" \
    -d 'Hello, World!' \
    https://your-api-domain/2/files/hello.txt
```

上传当前文件夹下的图片 myPicture.jpg 实现方法如下（--data-binary 的值是文件二进制内容）：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: image/jpeg" \
    --data-binary '@myPicture.jpg' \
    https://your-api-domain/2/files/myPicture.jpg
```

返回的内容，此时使用 `http://bmob-cdn-24.b0.upaiyun.com/2016/04/14/9306f2e74090d668801eac8814b3f56f.jpg` 即可访问：

```json
{
    "filename": "myPicture.jpg",
    "url": "http://bmob-cdn-24.b0.upaiyun.com/2016/04/14/9306f2e74090d668801eac8814b3f56f.jpg",
    "cdn": "upyun"
}
```

上传完成后，你还可以把上传后的文件对象关联到某行记录中，相应的 body 格式为：

```json
{
    "<keyOfFile>": {
        "__type": "File",
        "group": "<groupName>",
        "filename": "<fileName>",
        "url": "<url>"
    }
}
```

例子如下：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"score":73453, "file":{
        "__type": "File",
        "group": "group1",
        "filename": "myPicture.jpg",
        "url": "http://bmob-cdn-24.b0.upaiyun.com/2016/04/14/9306f2e74090d668801eac8814b3f56f.jpg"
    }}' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

### 删除文件

**请求描述**

该接口可删除已经上传的文件。

**请求**

- url：`https://your-api-domain/2/files/<cdnName>/<url>`
  - `cdnName`：上传文件后 body 返回的 cdnname
  - `url`：上传文件后在 body 中返回的 url 除去域名之后的字符串
- method：DELETE
- header：（公共 Header）

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**例子**

如下为删除 jpg 文件的例子：

```bash
curl -X DELETE \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/2/files/upyun/2019/01/09/53a0ff6340b6a7b780c9031d79d8befe.png
```

在上面的例子中要删除的图片为 `http://bmob-cdn-1614.b0.upaiyun.com/2019/01/09/53a0ff6340b6a7b780c9031d79d8befe.png`，截取这个 url 中的 `2019/01/09/53a0ff6340b6a7b780c9031d79d8befe.png` 拼上前面的参数 `https://your-api-domain/2/files/upyun/`，就能得到删除时所使用的 url：`https://your-api-domain/2/files/upyun/2019/01/09/53a0ff6340b6a7b780c9031d79d8befe.png`

如果域名是用 bmobcloud.com 的（例如：`https://bmob-cdn-10.bmobcloud.com/2019/01/09/08d7522240e650f68035e4b79077fe82.png`），根据上面的规则，也同样得到 `https://your-api-domain/2/files/upyun/2019/01/09/08d7522240e650f68035e4b79077fe82.png`

> **注意**：删除文件不会删除文件关联的行记录中的文件列的值，需要自行通过更新行来删除关联。

### 批量删除文件

**请求描述**

该接口可批量删除已经上传的文件。此操作不可逆，已经删除成功的文件不可恢复。

**请求**

- url：`https://your-api-domain/2/cdnBatchDelete`
- method：POST
- header：（公共 Header）
- body:

cdnname 为上传文件时返回的 cdnname，url1、url2 为上传时返回的 url 除去域名后的字符串。

```json
{
    "<cdnname>": ["<url1>", "<url2>"]
}
```

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "msg": "ok"
}
```

**失败时响应**

cdnname 为删除失败的 cdn 名称，url1、url2 为删除失败的 url 地址。

```json
{
    "code": 154,
    "error": "<errorInfo>",
    "fail": {
        "<cdnname>": [
            "<url1>",
            "<url2>"
        ]
    }
}
```

**例子**

如下为删除上传例子中的 jpg 文件：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"upyun":["2019/05/10/7f4dfb73408c97d1805c34481a4da82a.txt","2019/05/10/b5d3431540ac250080379658ae5c800d.txt"]}' \
    https://your-api-domain/2/cdnBatchDelete
```

> **注意**：删除文件不会删除文件关联的行记录中的文件列的值，需要自行通过更新行来删除关联。

## ACL 和角色

数据安全是软件系统中最重要的组成部分，为了更好的保护应用数据的安全，Bmob 在软件架构层面提供了应用层次、表层次、ACL（Access Control List：访问控制列表）、角色管理（Role）四种不同粒度的权限控制的方式，确保用户数据的安全（详细请查看 [Bmob 数据与安全页面](http://docs.bmobapp.com/other/Other/n_datasafety/doc/index.html)，了解 Bmob 如何保护数据安全）。

其中，最灵活的方法是通过 ACL 和角色，它的思路是每一条数据有一个用户和角色的列表，以及这些用户和角色拥有什么样的许可权限。

大多数应用程序需要对不同的数据进行灵活的访问和控制，这就可以使用 Bmob 提供的 ACL 模式来实现。例如：

- 对于私有数据，读写权限可以只局限于数据的所有者。
- 对于一个论坛，会员和版主有写的权限，一般的游客只有读的权限。
- 对于日志数据只有开发者才能够访问，ACL 可以拒绝所有的访问权限。
- 属于一个被授权的用户或者开发者所创建的数据，可以有公共的读的权限，但是写入权限仅限于管理者角色。
- 一个用户发送给另外一个用户的消息，可以只给这些用户赋予读写的权限。

### ACL 的格式

在 Bmob 中，ACL 是按 JSON 对象格式（key-value）来表示的。这个 JSON 对象的 key 是 objectId（用户表某个用户对应的 objectId）或者是 `*`（表示公共的访问权限），ACL 的值是"读和写的权限"，这个 JSON 对象的 key 总是权限名，而这些 key 的值总是 true。

如果您想让一个 id 为 `Kc3M222k` 的用户有读和写一条数据的权限，而且这个数据应该可以被全部人读取的话，这个 ACL 的表达方式如下，只要将该值设置到对应数据的 ACL 字段中即可：

```json
{
    "Kc3M222k": {
        "read": true,
        "write": true
    },
    "*": {
        "read": true
    }
}
```

### 角色和相关操作

在很多情况下，你需要定义一些用户具有某种相同的数据操作权限，而另外一群用户具有另外一种相同的数据操作权限，这时你就可以使用到 Bmob 的角色（对应 Bmob 在 Web 提供的 Role 表、SDK 中的 BmobRole 类）功能，设置不同的用户组不同的操作权限。角色表有三个特殊字段：

- `name`：必须字段，表示角色名称，而且只允许被设置一次（命名必须由字母、空格、减号或者下划线构成）
- `users`：一个指向一系列用户的关系，这些用户会继承角色的权限
- `roles`：一个指向一系列子角色的关系，这些子关系会继承父角色所有的权限

而创建角色、更新角色、删除角色本质就是对 _Role 表进行操作，因为该表是固定的，所以我们将请求的 URL 设置为 `https://your-api-domain/1/roles`，具体操作如下。_Role 表中含 `users` 和 `roles` 字段，其中 `users` 字段指向的是 `_User` 表，在该字段下的用户记录具备该角色的读写权限，而 `roles` 字段指向的是 `_Role` 表，在该字段下的角色记录都将继承该角色的权限。

#### 创建角色

创建一个新角色的方法如下（固定 POST 数据到 `https://your-api-domain/1/roles` 中，且必须提供 `name` 字段）：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Moderators",
        "ACL": {
            "*": {
                "read": true
            }
        }
    }' \
    https://your-api-domain/1/roles
```

如果你要创建一个包括了"用户和子角色"的角色，实现方式如下：

```bash
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "Moderators",
        "ACL": {
            "*": {
                "read": true
            }
        },
        "roles": {
            "__op": "AddRelation",
            "objects": [
                {
                    "__type": "Pointer",
                    "className": "_Role",
                    "objectId": "Fe441wZ5"
                }
            ]
        },
        "users": {
            "__op": "AddRelation",
            "objects": [
                {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": "Kc3M222k"
                }
            ]
        }
    }' \
    https://your-api-domain/1/roles
```

当创建成功后返回 HTTP 如下：

```
Status: 201 Created
Location: https://your-api-domain/1/roles/51e3812D
```

#### 获取角色

获取角色对象的方法如下：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/1/roles/51e3812D
```

响应结果如下：

```json
{
    "createdAt": "2012-04-28 17:41:09",
    "objectId": "51e3812D",
    "updatedAt": "2012-04-28 17:41:09",
    "ACL": {
        "*": {
            "read": true
        },
        "role:Administrators": {
            "write": true
        }
    },
    "name": "Moderators"
}
```

> **注意**：users 和 roles 关系无法在 JSON 结果中看到，您需要使用 `$relatedTo` 操作符来查询。

#### 更新角色

更新角色时，一个很重要的一点是：`name` 字段不可以更改。添加和删除 `users` 和 `roles` 可以通过使用 AddRelation 和 RemoveRelation 操作符进行。

如给 "Moderators" 角色增加 2 个用户，实现如下：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "users": {
            "__op": "AddRelation",
            "objects": [
                {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": "eba635d9"
                },
                {
                    "__type": "Pointer",
                    "className": "_User",
                    "objectId": "51dfb8bd"
                }
            ]
        }
    }' \
    https://your-api-domain/1/roles/51e3812D
```

删除 "Moderators" 的一个子角色的实现如下：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "roles": {
            "__op": "RemoveRelation",
            "objects": [
                {
                    "__type": "Pointer",
                    "className": "_Role",
                    "objectId": "eba635d9"
                }
            ]
        }
    }' \
    https://your-api-domain/1/roles/51e3812D
```

#### 删除角色

删除角色这里有一个需要注意的是：需要传入 `X-Bmob-Session-Token`，即对这条数据有操作权限的用户 SessionToken。实现如下：

```bash
curl -X DELETE \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "X-Bmob-Session-Token: pnktnjyb996sj4p156gjtp4im" \
    https://your-api-domain/1/roles/51e3812D
```

#### 角色的使用

设置一条数据的角色权限，需要在 ACL 中把 Key 的名字设置为 `role:` + 角色名称。如限制一条数据可以被在 "Members" 里的任何人读到，而且可以被它的创建者（objectId 为 `f1766d0b42`）和任何有 "Moderators" 角色的人所修改，实现方式如下：

```json
{
    "f1766d0b42": {
        "write": true
    },
    "role:Members": {
        "read": true
    },
    "role:Moderators": {
        "write": true
    }
}
```

如果这个用户和 "Moderators" 本身就是 "Members" 的子角色和用户，那么，您不必为创建的用户和 "Moderators" 指定读的权限，因为它们都会继承授予 "Members" 的权限。

#### 角色的继承

一个角色可以包含另一个，可以为 2 个角色建立一个父-子关系。这个关系的结果就是任何被授予父角色的权限隐含地被授予子角色。

这样的关系类型通常在用户管理的内容类的应用上比较常见，比如在论坛中，有一些少数的用户是"管理员（Administrators）"，有最高的权限，可以调整系统设置、创建新的论坛等等。另一类用户是"版主（Moderators）"，他们可以对用户发帖的内容进行管理。可见，任何有管理员权限的人都应该有版主的权限。为建立起这种关系，您应该把 "Administrators" 的角色设置为 "Moderators" 的子角色，具体来说就是把 "Administrators" 这个角色加入 "Moderators" 对象的 roles 关系之中，实现如下：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{
        "roles": {
            "__op": "AddRelation",
            "objects": [
                {
                    "__type": "Pointer",
                    "className": "_Role",
                    "objectId": "<AdministratorsRoleObjectId>"
                }
            ]
        }
    }' \
    https://your-api-domain/1/roles/<ModeratorsRoleObjectId>
```

## 地理位置

Bmob 允许用户根据地球的经度和纬度坐标进行基于地理位置的信息查询。你可以在查询中添加一个 GeoPoint 的对象查询。你可以实现轻松查找出离当前用户最接近的信息或地点的功能。

### 创建地理位置对象

在表中添加一个地理位置的列，只需要在对应列值满足以下格式即可：

```json
{
    "<key>": {
        "__type": "GeoPoint",
        "latitude": <latitudeValue>,
        "longitude": <longitudeValue>
    }
}
```

例如，如果需要在 GameScore 的特定对象中加上地理位置，其请求如下：

```bash
curl -X PUT \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"location":{
        "__type": "GeoPoint",
        "latitude": 50.934755,
        "longitude": 24.52065
    }}' \
    https://your-api-domain/1/classes/GameScore/e1kXT22L
```

### 查询地理位置信息

现在你有一系列的对象对应的地理坐标，如果能发现哪些对象离指定的点近就好了，这可以通过 GeoPoint 数据类型加上在查询中使用 `$nearSphere` 做到。查询的 `where` 参数值格式如下：

```json
{
    "<key>": {
        "$nearSphere": {
            "__type": "GeoPoint",
            "latitude": <latitudeValue>,
            "longitude": <longitudeValue>
        }
    }
}
```

例如，获取离用户最近的 10 个地点应该看起来像下面这个样子：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'limit=10' \
    --data-urlencode 'where={
        "location": {
            "$nearSphere": {
                "__type": "GeoPoint",
                "latitude": 30.0,
                "longitude": -20.0
            }
        }
    }' \
    https://your-api-domain/1/classes/PlaceObject
```

这操作会按离纬度 30.0、经度 -20.0 的距离排序返回一系列的结果，第一个就是最近的对象。（注意如果一个特定的 order 参数是给定了的话，它会覆盖按距离排序的结果。）例如，下面是两个上面的查询操作返回的结果：

```json
{
    "results": [
        {
            "location": {
                "__type": "GeoPoint",
                "latitude": 40.0,
                "longitude": -30.0
            },
            "updatedAt": "2011-12-06 22:36:04",
            "createdAt": "2011-12-06 22:36:04",
            "objectId": "e1kXT22L"
        },
        {
            "location": {
                "__type": "GeoPoint",
                "latitude": 60.0,
                "longitude": -20.0
            },
            "updatedAt": "2011-12-06 22:36:26",
            "createdAt": "2011-12-06 22:36:26",
            "objectId": "51e3a2a8e4b015ead4d95dd9"
        }
    ]
}
```

为了限定搜索的最大距离范围，需要加入 `$maxDistanceInMiles`（英里）、`$maxDistanceInKilometers`（公里）或者 `$maxDistanceInRadians`（弧度）参数来限定，如果不加，则默认是 100KM 的半径。比如要找的半径在 10 公里内的话：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={
        "location": {
            "$nearSphere": {
                "__type": "GeoPoint",
                "latitude": 30.0,
                "longitude": -20.0
            },
            "$maxDistanceInKilometers": 10.0
        }
    }' \
    https://your-api-domain/1/classes/PlaceObject
```

同样作查询寻找在一个特定的范围里面的对象也是可以的，为了找到在一个矩形区域里的对象，按下面的格式加入一个约束 `{"$within": {"$box": [southwestGeoPoint, northeastGeoPoint]}}`：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={
        "location": {
            "$within": {
                "$box": [
                    {
                        "__type": "GeoPoint",
                        "latitude": 37.71,
                        "longitude": -122.53
                    },
                    {
                        "__type": "GeoPoint",
                        "latitude": 30.82,
                        "longitude": -122.37
                    }
                ]
            }
        }
    }' \
    https://your-api-domain/1/classes/PizzaPlaceObject
```

**注意事项**

关于地理位置的有一些问题是值得留意的：

1. 每一个表**只能**一个地理位置列，每一个对象**只能**有一个索引指向一个 GeoPoint 对象
2. GeoPoint 的点不能超过规定的范围。纬度的范围应该是在 `-90.0` 到 `90.0` 之间。经度的范围应该是在 `-180.0` 到 `180.0` 之间。如果您添加的经纬度超出了以上范围，将导致程序错误
3. 如果不加任何距离范围限制，则默认是 100 公里的半径范围

## 微信小程序

### 获取用户 openid

**请求描述**

通过微信登录 code 获取用户的 openid 及 sessionToken，用于微信小程序登录或注册。

**请求**

- url：`https://your-api-domain/1/wechatAppv1/<code>`
- method：GET
- header：（公共 Header）
- param：`code` — 微信登录 code

**成功时响应**

- status: `200 OK`
- body:

返回用户信息（如果已注册）或新创建的用户信息：

```json
{
    "authData": {
        "weapp": {
            "expires_in": 7200,
            "openid": "oagfv0IsvzjNqtbi8_qnG2d_wXbU",
            "tempsk": "",
            "sk": "MsxXdUFlGVkI1b0V5OTVmT0ZlUnB2YldRUT09",
            "unionid": "o_8mGw8FyOx45KaTAewhAIDpQo7A"
        }
    },
    "createdAt": "2017-06-29 10:50:06",
    "mobilePhoneNumber": "137xxxxx579",
    "nickName": "magic",
    "objectId": "a415c43787",
    "openid": "oagfv0IsvzjNqtbi8_qnG2d_wXbU",
    "sessionToken": "d39137b0400a31b7801bdaee677e1c19",
    "updatedAt": "2025-04-28 16:26:21",
    "userPic": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoA2XiapDhpzKO7CukcCQFAQqymrLUcuGzPRYTql4gCM8B2ljPS15XogDnWlRpyUibY1jVJUQg0ysBA/132",
    "username": "adc9cee116c056bc"
}
```

> **注意**：openid 在 authData 下面。

**例子**

以下是一个请求样例：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/1/wechatAppv1/${code}
```

### 获取 access_token

**请求描述**

微信 access_token，业务场景：当其他平台需要使用你小程序的 token，并不想与 Bmob 的平台冲突，可以通过此 API 实现。

**请求**

- url：`https://your-api-domain/1/wechatApp/getAccessToken`
- method：GET
- header：（公共 Header）

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "access_token": "91_0ct6NfzQ2eKaM_3_WhrFVx_mUX_i6ZquZji1kB-VdMQO_zdS1qv45SNkH9jDlLjoyAuIURZUELgq5PteB6IfnnYu_VApZb8C3t2YdTbrvv3_GWdvbh0xgHmLet8HZJxxxx"
}
```

**例子**

以下是一个请求样例：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/1/wechatApp/getAccessToken
```

## 获取服务器时间

**请求描述**

有时，App 需要获取服务器的时间，可使用该请求。

**请求**

- url：`https://your-api-domain/1/timestamp`
- method：GET
- header：（公共 Header）

**成功时响应**

- status: `200 OK`
- body:

```json
{
    "timestamp": "<timestamp>",
    "datetime": "YYYY-mm-dd HH:ii:ss（北京时间）"
}
```

**例子**

以下是一个请求样例：

```bash
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://your-api-domain/1/timestamp
```

返回参数如下：

```json
{
    "timestamp": 1437531770,
    "datetime": "2015-07-22 10:22:50"
}
```

`timestamp` 为时间戳，`datetime` 为格式化的日期。

## 错误码

参照 [所有平台错误码列表](/other/error_code/#restapi) 中的 REST API 部分。
