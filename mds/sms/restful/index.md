在一些应用场景下，你可能希望用户验证手机号码后才能进行一些操作，例如充值等。这些操作跟用户系统没有关系，可以通过我们提供的的短信验证API来实现。

每个 Bmob 帐户有 10 条免费额度的短信数量用于测试，超过需要购买短信条数才能继续使用。

默认使用 【元素科技】 作为签名，可以在控制台进行修改。


## 请求短信验证码


**请求描述**

使用特定的模板请求验证码，如果没有在管理后台创建好模板，可使用默认的模板，[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 默认的模板是:  您的验证码为：${code}，该验证码5分钟内有效，请勿泄露于他人！

**请求**

- url ：https://自己备案域名/1/requestSmsCode

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
  https://自己备案域名/1/requestSmsCode
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
  https://自己备案域名/1/requestSmsCode
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
  https://自己备案域名/1/requestSmsCode
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

- url ：https://自己备案域名/1/verifySmsCode/smsCode(用户收到的6位短信验证码)

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
  https://自己备案域名/1/verifySmsCode/876845
```



**注意事项**

关于短信条数的计算规则如下:

1. 实际计算的短信字数 = 模板的内容或自定义短信的内容字数 + 6。加上6是因为默认的签名【比目科技】占了6个字。
2. 实际计算的短信字数在70个字以下算1条。
3. 实际计算的短信字数超过70字的以67字为一条来计算的。也就是135个字数是计算为3条的。
4. 计算得到的短信条数在本条短信发送成功后将会从你的账户剩余的短信条数中扣除。

**短信发送限制规则是1/分钟，5/小时，10/天。即对于一个应用来说，一天给同一手机号发送短信不能超过10条，一小时给同一手机号发送短信不能超过5条，一分钟给同一手机号发送短信不能超过1条**


## 发送通知短信


**请求描述**

找回密码，等相关通知都可以，可以包含金额，卡号，数量，姓名等等  例如：温馨提醒：${conference}会议将在${address}地点，于${time}时间开始，请您准时参加。

**请求**

- url ：https://自己备案域名/1/requestSms

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
  "content": { //对应短信内变量
    "card_number": 10001,  卡号
    "amount": 0.01,  消费金额
    "balance": 19   余额
  }
  "template": templateName(必填)
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
  -d '{
  "mobilePhoneNumber": "13788886579",
  "content": {
    "card_number": 13,
    "amount": 0.01,
    "balance": 19
  },
  "template": "yingxiao"
}' \
  https://自己备案域名/1/requestSms
```

成功返回，短信验证码ID，可用于后面使用查询短信状态接口来查询该短信验证码是否发送成功和是否验证过：

```
{
	"smsId": 1232222
}
```



## 图形验证码

图形验证码是防范短信轰炸最有效的手段。目前只有通过短信模板发送才支持使用图形验证码。

通过下面的接口获取图形验证码：
```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{"width":85,"height":30,"size":4,"ttl":180}' \
  https://自己备案域名/1/requestCaptcha
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
  "captcha_url": "https://自己备案域名/1/captchaImage?secretKey=ad1ef6c1eac9b6e7&token=dtP6cLb3axn0Ho13EvZP"
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
  https://自己备案域名/1/verifyCaptcha
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

## 报备事项

### 一、签名授权说明

国内短信仅支持中国大陆公司授权申请签名。若授权主体为中国香港、中国澳门、中国台湾及境外公司，请联系我们客服

### 二、企业信息

1. **认证方式**：线上提交认证，联系我们客服
2. **选择证件**：企业营业执照
3. **营业证件**：签名归属方的企业营业执照（请提交包含统一社会信用代码的证件照片，支持 jpg、png、gif、jpeg 格式，每张图片不大于 5MB）

### 三、法定代表人信息

1. **选择证件**：身份证
2. **企业法定代表人姓名**：[此处输入法定代表人姓名]
3. **企业法定代表人身份证号码**：[此处输入身份证号码]
4. 身份证有效期
   - 开始时间：
   - 截止时间：若证照有效期为长期时，有效期截止时间可填入：2099 年 12 月 31 日；如遇无法识别或识别错误时，请手工输入实际截止时间。

### 四、重要提示

1. 因监管需求，必须补充在工商侧登记的法定代表人姓名及身份证号码，否则可能会因信息不全而导致报备失败从而无法发送短信。
2. 同一个管理员若申请多个不同的企业资质会导致报备失败，请确认一管一企以提升报备成功率。

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
