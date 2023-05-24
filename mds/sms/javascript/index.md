短信服务的API集成在BmobSDK中，因此不熟悉的朋友在使用前先可以了解一下BmobSDK的集成[JS 快速入门](http://doc.bmobapp.com/data/wechat_app_new/rm/)

在一些应用场景下，你可能希望用户验证手机号码后才能进行一些操作，例如充值等。这些操作跟用户系统没有关系，可以通过我们提供的的短信验证API来实现。

每个 [Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 帐户有 10 个免费额度的短信数量，超过需要购买短信条数才能继续使用。

为了保障短信的下发速度和送达率，[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 为所有用户申请了一致的独享通道，默认使用 **【云验证】** 作为签名，且不可更改。


## 请求短信验证码
如果没有在管理后台创建好模板，可使用默认的模板，[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 默认的模板是: **您的验证码是%smscode%，有效期为%ttl%分钟。您正在使用%appname%的验证码**

使用默认的模板请求短信验证码：
```
Bmob.Sms.requestSmsCode({"mobilePhoneNumber": "131xxxxxxxx"} ).then(function(obj) {
  alert("smsId:"+obj.smsId); //
}, function(err){
  alert("发送失败:"+err);
});
```

成功返回，短信验证码ID，可用于后面使用查询短信状态接口来查询该短信验证码是否发送成功和是否验证过：
```
{
	"smsId": 1232222
}
```

如果你已经在 [Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台") 后台设置了自己的模板，并已经是审核通过了，则可以使用自己的模板给用户的手机号码发送短信验证码了：
```
Bmob.Sms.requestSmsCode({"mobilePhoneNumber": "131xxxxxxxx", "template":"注册模板"} ).then(function(obj) {
  alert("smsId:"+obj.smsId); //
}, function(err){
  alert("发送失败:"+err);
});
```

成功返回，短信验证码ID，可用于后面使用查询短信状态接口来查询该短信验证码是否发送成功和是否验证过：
```
{
	"smsId": 1232222
}
```

## 验证短信验证码

通过以下接口，你可以验证用户输入的验证码是否是有效的：
```
Bmob.Sms.verifySmsCode("131xxxxxxxx", 125466).then(function(obj) {
  alert("msg:"+obj.msg); //
}, function(err){
  alert("发送失败:"+err);
});
```

成功返回以下JSON，表明验证码验证通过：
```
{
	"msg":"ok"
}
```