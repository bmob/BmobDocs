# 短信服务 Android 开发文档

------

除了与用户相关的包括一键注册，手机号码登录等操作外，Bmob 还推出了单独的短信验证码服务。 在实际的应用中，开发者希望能够通过短信验证的方式来与用户进行某些重要操作的确认，你就可以在用户验证过手机号码的前提下，使用 Bmob 提供的短信验证码服务。

每个 Bmob 帐户有 30 条免费 (分别为SDK短信 15 条、RestApi短信 15 条) 的短信用于测试。超出免费条数后，需要购买短信条数才能继续使用。

默认使用 【比目科技】 作为签名，可以在控制台创建自定义短信模板进行修改。

下面是使用方法：

## SMS初始化

SMS功能位于Bmob Data SDK，请参考数据服务文档导入即可。

## 请求发送短信验证码

通过 `requestSMSCode` 方式给绑定手机号的该用户发送指定短信模板的短信验证码：

```java
/**
 * TODO template 如果是自定义短信模板，此处替换为你在控制台设置的自定义短信模板名称；如果没有对应的自定义短信模板，则使用默认短信模板。
 */
BmobSMS.requestSMSCode(phone, "DataSDK", new QueryListener<Integer>() {
    @Override
    public void done(Integer smsId, BmobException e) {
        if (e == null) {
            mTvInfo.append("发送验证码成功，短信ID：" + smsId + "\n");
        } else {
            mTvInfo.append("发送验证码失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
        }
    }
});

```

短信默认模板：

    您的验证码是`%smscode%`，有效期为`%ttl%`分钟。您正在使用`%appname%`的验证码。【比目科技】

**注意：**

- `模板名称`：模板名称需要开发者在应用的管理后台进行短信模板的添加工作，具体：`短信服务`->`短信模板`,之后点击创建即可,具体请看下图：

![](image/sms.png)


- 只有审核通过之后的自定义短信模板才可以被使用，如果自定义的短信模板其状态显示`审核中`或者`审核失败`,再调用该方法则会以`默认模板`来发送验证码。


- 模板中不能有【】和 [] ，否则审核不通过；

- 如果你提交的短信模板无法发送，则有可能包含一些敏感监控词，具体可去Github下载  [短信关键字监控参考文档](https://github.com/bmob/bmob-public-docs/blob/master/%E7%9F%AD%E4%BF%A1%E5%85%B3%E9%94%AE%E5%AD%97%E7%9B%91%E6%8E%A7%E5%8F%82%E8%80%83%E6%96%87%E6%A1%A3.doc) 来查看提交内容是否合法。

- 一天一个应用给同一手机号发送的短信不能超过10条，否则会报`10010`错误，其他错误码可查看：[短信功能相关错误码](http://doc.bmobapp.com/other/error_code/#_2) 。

### 验证验证码

通过`verifySmsCode`方式可验证该短信验证码：

```java
BmobSMS.verifySmsCode(phone, code, new UpdateListener() {
    @Override
    public void done(BmobException e) {
        if (e == null) {
            mTvInfo.append("验证码验证成功，您可以在此时进行绑定操作！\n");
            User user = BmobUser.getCurrentUser(User.class);
            user.setMobilePhoneNumber(phone);
            user.setMobilePhoneNumberVerified(true);
            user.update(new UpdateListener() {
                @Override
                public void done(BmobException e) {
                    if (e == null) {
                        mTvInfo.append("绑定手机号码成功");
                    } else {
                        mTvInfo.append("绑定手机号码失败：" + e.getErrorCode() + "-" + e.getMessage());
                    }
                }
            });
        } else {
            mTvInfo.append("验证码验证失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
        }
    }
});
```

**注意事项：**

- 实际计算的短信字数 = 模板的内容或自定义短信的内容字数 + 6。加上6是因为默认的签名【比目科技】占了6个字。
- 实际计算的短信字数在70个字以下算1条。
- 实际计算的短信字数超过70字的以67字为一条来计算的。也就是135个字数是计算为3条的。
- 计算得到的短信条数在本条短信发送成功后将会从你的账户剩余的短信条数中扣除。
- 短信发送限制规则是1/分钟，5/小时，10/天。即对于一个应用来说，一天给同一手机号发送短信不能超过10条，一小时给同一手机号发送短信不能超过5条，一分钟给同一手机号发送短信不能超过1条。


