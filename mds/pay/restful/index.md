**注意：目前支付宝无法使用，请用户暂时不要接入，等待官方的恢复公告！**

##  打款需知

1.打款前请先在控制台填写以下信息

![](image/14579272227324.jpg)

2.每月的1、2、16、17号为申请打款时间，15号、月尾日为打款时间，确保用户有半个月的追诉期。Bmob将收取10%手续费。


## 支付回调

如图，可以在支付-支付配置处填入通知url。

![](image/14598448796882.jpg)

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

## 查询订单

**请求描述**

在进行支付请求后会返回 `out_trade_no` 订单号，使用该订单号可以查询订单的支付情况。

**请求**

- url ：https://api2.bmobapp.com/1/pay/out_trade_no

- method ：GET

- header:

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: application/json
```


**成功时响应**

- status: 200 OK

- body:

```
{
	name:订单或商品名称
	body:商品详情
	create_time:调起支付的时间
	out_trade_no:Bmob系统的订单号
	transaction_id:微信或支付宝的系统订单号
	pay_type:WECHATPAY（微信支付）或ALIPAY（支付宝支付）
	total_fee:订单总金额
	trade_state:NOTPAY（未支付）或 SUCCESS（支付成功）
}
```

失败时返回请看 [支付功能相关错误码](/errorcode/index.html?menukey=otherdoc&key=errorcode#index_支付功能相关错误码 "支付功能相关错误码")

**例子**

一个查询例子如下：

```
curl -X GET \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  https://api2.bmobapp.com/1/pay/9f392618f449a71c6fcfdee38d2b29e4
```

其返回值：

```
{
  "name": "商品",
  "body": "商品详情",
  "create_time": "2015-03-24 11:14:58",
  "out_trade_no": "9f392618f449a71c6fcfdee38d2b29e4",
  "transaction_id": "2015061100001000330057820379"
  "pay_type": "WECHATPAY",
  "total_fee": 0.01,
  "trade_state": "NOTPAY",
}
```

## Bmob支付回调
Bmob 加入了支付后页面跳转同步通知页面的URL和异步的通知URL功能，可供开发者在应用的设置页面自行增加。

填写页面跳转同步通知页面的URL(return_url)和异步的通知URL(notify_url)的页面在 应用列表->应用信息->支付设置 。

### Bmob异步通知回调（支持微信和支付宝）

1. 必须保证服务器异步通知页面（notify_url）上无任何字符，如空格、HTML标签、开发系统自带抛出的异常提示信息等；

2. Bmob支付是用POST方式发送异步通知信息，因此该页面中获取参数的方式，如：
request.Form(“out_trade_no”)、$_POST[‘out_trade_no’]；

3. 支付宝主动发起通知，该方式才会被启用；

4.  只有在Bmob的交易管理中存在该笔交易，且发生了交易状态的改变，Bmob才会通过该方式发起服务器通知；

5. 服务器间的交互，不像页面跳转同步通知可以在页面上显示出来，这种交互方式是不可见的；

6. 第一次交易状态改变（即时到账中此时交易状态是交易完成）时，不仅页面跳转同步通知页面会启用，而且服务器异步通知页面也会收到Bmob发来的处理结果通知；

7. 程序执行完后必须打印输出“success”（不包含引号）。如果商户反馈给Bmob的字符不是success这7个字符，Bmob服务器会不断重发通知，直到超过24小时。

8. 一般情况下，24小时以内完成8次通知（通知的间隔频率一般是：2m,10m,10m,1h,2h,6h,15h）；

9. 程序执行完成后，该页面不能执行页面跳转。如果执行页面跳转，Bmob会收不到success字符，会被Bmob服务器判定为该页面程序运行出现异常，而重发处理结果通知；

10. 异步通URL的调试与运行必须在服务器上，即互联网上能访问；

11. 当用户的服务端收到Bmob服务器异步通知的$_POST[‘out_trade_no’]时，应该调起一次查询订单的接口获得订单的状态是1，才能准确的判断该笔订单是成功;

12. 支付成功结果以Bmob后台订单列表或查询订单接口查询到的订单状态为准。




