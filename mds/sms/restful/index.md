在一些应用场景下，你可能希望用户验证手机号码后才能进行一些操作，例如充值等。这些操作跟用户系统没有关系，可以通过我们提供的的短信验证API来实现。

每个 Bmob 帐户有 10 条免费额度的短信数量用于测试，超过需要购买短信条数才能继续使用。

默认使用 【比目科技】 作为签名，可以在控制台进行修改。


## 请求短信验证码


**请求描述**

使用特定的模板请求验证码，如果没有在管理后台创建好模板，可使用默认的模板，[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 默认的模板是: **您的验证码是%smscode%，有效期为%ttl%分钟。您正在使用%appname%的验证码**

**请求**

- url ：https://api2.bmobapp.com/1/requestSmsCode

- method ：POST

- header:

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: application/json
```

- body:

```
{
  "mobilePhoneNumber": phoneNum,
  "template": templateName(选填，需先在管理后台创建)
}
```

**成功时响应**

- status: 200 OK

- body:

```
{
	"smsId": smsId（可用于后面使用查询短信状态接口来查询该条短信是否发送成功）
}
```

**例子**

使用默认的模板请求短信验证码：

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{"mobilePhoneNumber": "186xxxxxxxx"}' \
  https://api2.bmobapp.com/1/requestSmsCode
```

成功返回，短信验证码ID，可用于后面使用查询短信状态接口来查询该短信验证码是否发送成功和是否验证过：

```
{
	"smsId": 1232222
}
```

如果你已经在 [Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 后台设置了自己的模板，并已经是审核通过了，则可以使用自己的模板给用户的手机号码发送短信验证码了：

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{"mobilePhoneNumber": "186xxxxxxxx", "template":"注册模板"}' \
  https://api2.bmobapp.com/1/requestSmsCode
```

成功返回，短信验证码ID，可用于后面使用查询短信状态接口来查询该短信验证码是否发送成功和是否验证过：

```
{
	"smsId": 1232222
}
```

如果在模板中设置了需要启用图形验证码才能发送短信，则通过下面的请求传入validate_token（关于validate_token，请看本章节的图形验证码）：

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{"mobilePhoneNumber": "186xxxxxxxx", "template":"注册模板", "validate_token":"3fdgfs223"}' \
  https://api2.bmobapp.com/1/requestSmsCode
```

成功返回，短信验证码ID，可用于后面使用查询短信状态接口来查询该短信验证码是否发送成功和是否验证过：

```
{
	"smsId": 1232222
}
```

## 验证短信验证码

**请求描述**

通过以下接口，你可以验证用户输入的验证码是否是有效。

**请求**

- url ：https://api2.bmobapp.com/1/verifySmsCode/smsCode(用户收到的6位短信验证码)

- method ：POST

- header:

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: application/json
```

- body:

```
{
  "mobilePhoneNumber": phoneNum
}
```

**成功时响应**

- status: 200 OK

- body:

```
{
	"msg":"ok"
}
```

**例子**

例如，要验证 `186xxxxxxxx` 号码输入的 `876845` 验证码是否正确可使用以下请求：

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{"mobilePhoneNumber": "186xxxxxxxx"}' \
  https://api2.bmobapp.com/1/verifySmsCode/876845
```



**注意事项**

关于短信条数的计算规则如下:

1. 实际计算的短信字数 = 模板的内容或自定义短信的内容字数 + 6。加上6是因为默认的签名【比目科技】占了6个字。
2. 实际计算的短信字数在70个字以下算1条。
3. 实际计算的短信字数超过70字的以67字为一条来计算的。也就是135个字数是计算为3条的。
4. 计算得到的短信条数在本条短信发送成功后将会从你的账户剩余的短信条数中扣除。

**短信发送限制规则是1/分钟，5/小时，10/天。即对于一个应用来说，一天给同一手机号发送短信不能超过10条，一小时给同一手机号发送短信不能超过5条，一分钟给同一手机号发送短信不能超过1条**

## 图形验证码

图形验证码是防范短信轰炸最有效的手段。目前只有通过短信模板发送才支持使用图形验证码。

通过下面的接口获取图形验证码：
```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{"width":85,"height":30,"size":4,"ttl":180}' \
  https://api2.bmobapp.com/1/requestCaptcha
```

其中：

|参数名|参数类型|默认|说明
|-----|-----|----|----|
|width|number|85|图形验证码展示区域的宽度，单位：像素，有效值范围：60-200|
|height|number|30|图形验证码展示区域的高度，单位：像素，有效值范围：30-100|
|size|number|4|验证码的字符长度，有效值范围：3-6|
|ttl|number|60|验证码有效期，单位：秒，有效值范围：60-180|

返回值如下：

```
{
  "captcha_token": "dtP6cLb3axn0Ho13EvZP",
  "captcha_url": "https://api2.bmobapp.com/1/captchaImage?secretKey=ad1ef6c1eac9b6e7&token=dtP6cLb3axn0Ho13EvZP"
}
```

|参数名称|说明
|-----|-----|
|captcha_token|供 verifyCaptcha 校验使用|
|captcha_url|图形验证码的图片地址|

获取了图形验证码后，需要使用对应的验证接口来校验：

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{"captcha_code": "1110","captcha_token": "R23423dsfd"}' \
  https://api2.bmobapp.com/1/verifyCaptcha
```

其中：

|参数名|说明
|-----|----|
|captcha_code|用户输入的图形验证码|
|captcha_token|requestCaptcha 返回的 captcha_token|

验证成功会返回：

```
{ "validate_token": "发送短信的二次凭证"}
```

发送短信模板验证码的时候，把这个validate_token参数带上即可

## 购买事项

### 购买方法

短信条数只能输入整数，且不能少于1000条

![短信计费模式][1]

进入账号控制台，选择应用--> 短信 --> 点击充值即可。

### 发票事宜

购买金额满100可提供发票，1000元以内的到付，1000以上（含1000）包邮。

登录后台提交工单，提供购买服务的订单号和开票信息。

**个人**

发票抬头、邮寄地址、联系人及电话

**企业**

公司名称、统一社会信用代码、开户行及账号、邮寄地址、联系人及电话


  [1]: http://bmob-file-service-t.b0.upaiyun.com/Doc_File/jfms.png
