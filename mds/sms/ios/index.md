在一些应用场景下，你可能希望用户验证手机号码后才能进行一些操作，例如充值等。这些操作跟用户系统没有关系，可以通过我们提供的的短信验证API来实现。

每个 Bmob 帐户有 10 条免费额度的短信数量用于测试，超过需要购买短信条数才能继续使用。

默认使用 【比目科技】 作为签名，可以在控制台进行修改。

短信服务除了集成成进原来的BmobSDK包外，还另外拆分了一个独立的SDK包，使用前请先导入 `SystemConfiguration.framework`，  `JavaScriptCore.framework` 和 `CoreLocation.framework`，注册方法还是 `[Bmob registerWithAppKey:@""];`。


## 获取短信验证码
如下图所示，在使用获取短信验证码功能前可以先设置好几个模板以用于不同的功能。

![](image/message_1.png)

获取短信验证码可使用以下方法

```
    //请求验证码
    [BmobSMS requestSMSCodeInBackgroundWithPhoneNumber:mobilePhoneNumber andTemplate:@"test" resultBlock:^(int msgId, NSError *error) {
        if (error) {
            NSLog(@"%@",error);
        } else {
            //获得smsID
            NSLog(@"sms ID：%d",msgId);
        }
    }];
```

```
注意，短信模板设置后需要通过审核才能使用，以下情况将使用Bmob设定的默认模板（Bmob 默认的模板是: 您的验证码是%smscode%，有效期为%ttl%分钟。您正在使用%appname%的验证码
）。
1.传入模板名为nil或者@“”;
2.传入不存在的模板；
3.传入的模板未通过审核
```

## 验证短信验证码

验证短信验证码状态

```

    //验证
    [BmobSMS verifySMSCodeInBackgroundWithPhoneNumber:mobilePhoneNumber andSMSCode:smsCode resultBlock:^(BOOL isSuccessful, NSError *error) {
        if (isSuccessful) {
            NSLog(@"%@",@"验证成功，可执行用户请求的操作");
        } else {
            NSLog(@"%@",error);
        }
    }];
    
}

```



注意事项：

关于短信条数的计算规则如下，

1. 实际计算的短信字数 = 模板的内容或自定义短信的内容字数 + 6。加上6是因为默认的签名【比目科技】占了6个字。
2. 实际计算的短信字数在70个字以下算1条。
3. 实际计算的短信字数超过70字的以67字为一条来计算的。也就是135个字数是计算为3条的。
4. 计算得到的短信条数在本条短信发送成功后将会从你的账户剩余的短信条数中扣除。

**短信发送限制规则是1/分钟，5/小时，10/天。即对于一个应用来说，一天给同一手机号发送短信不能超过10条，一小时给同一手机号发送短信不能超过5条，一分钟给同一手机号发送短信不能超过1条。**