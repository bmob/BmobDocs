## 简介

Android支付SDK接口是Bmob为广大开发人员提供的统一、正规的收费手段，让没有企业认证的个人开发者，也能通过支付宝和微信向用户收费。该文档可以让您快速为自己的应用接入Bmob的支付功能。下图为使用支付的流程。

![](image/flow.png)

## 使用需知

使用Bmob支付组件前，请认真阅读[Bmob服务协议](http://www.bmobapp.com/service)。

对于以下两种情况，开发者需要特别注意：

1.违反服务协议，特别是含有以下内容的应用：

**1）封建迷信和/或淫秽、色情、下流的信息或教唆犯罪的信息；**
**2）博彩有奖、赌博游戏、“私服”、“外挂”等非法互联网出版活动；**

Bmob平台有权进行独立判断并采取技术手段予以删除、屏蔽或断开链接。同时，本平台有权视用户的行为性质，采取包括但不限于暂停或终止服务，限制、冻结或终止本平台网站账号的使用，追究法律责任等措施。

2.应用遇到过多的用户投诉，如应用的使用者支付了相关款项，但是该应用却没有提供相应的服务。本平台有权限制或冻结该应用支付收入的所有款项，并保留追究法律责任的权利。

3.**Bmob将在每笔交易中收取10%服务费。**

##  打款需知

1.打款前请先在控制台填写以下信息

![](image/14579272227324.jpg)



2.每月的1、2、16、17号为申请打款时间，15号、月尾日为打款时间，确保用户有半个月的追诉期。

## 支持平台

目前安卓的支付支持支付宝和微信支付。

## 启用须知

 - 在Bmob账号管理平台进行身份认证，以保证资金安全，否则无法使用支付等功能。
 - 提交申请时，开发者的联系方式至少要有两种(邮箱，电话，QQ)，方便后续支付弹出的订单页面展示，如下
![](http://i.imgur.com/TmoXagK.png)


 - 如有任何疑问或者建议，欢迎加入Bmob支付的技术支持QQ群：273080081(1群)，521591577(2群)

## 支付接口快速入门

- 添加相关文件

  	1 将下载的支付SDK的libs目录添加到项目下，包括<BmobPay_v3.x.x_xxxxxx.jar>和<xxx/libbmobwpay.so>，so文件按项目需求添加(这个版本不需要支付宝jar包)

  	2 将下载的支付SDK的assets目录添加到项目下，包括<payassets.db>和<bp.db>，其中bp.db其实是apk文件，是微信支付插件

- 在您项目的AndroidManifest.xml中添加以下权限:

		<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

- 修改混淆规则

	    -libraryjars libs/BmobPay_v3.x.x_xxxxxx.jar
		-keepclasseswithmembers class c.b.** { *; }
		-keep interface c.b.PListener{ *; }
		-keep interface c.b.QListener{ *; }

- 添加下免责Activity(注意这个是在运行时加载的类,可以忽略IDE给出的红色标识)

	    <activity android:name="cn.bmob.pay.v3.act.PayAct" />

- 在您的应用程序主Application的onCreate中调用如下方法：
  （Application ID在后台应用管理的 数据浏览->应用信息->应用密钥->Application ID，如果appKey为空或者混淆规则不正确，会抛出IllegalArgumentException异常,因为init是异步的，越早初始化越好）

    	BP.init("你的Application ID");
**注意：新版的支付SDK不能被数据服务SDK的初始化方法取代了，无论您是否使用了Bmob数据服务SDK，都要进行支付SDK的初始化**

- 发起支付调用，请使用如下方法：
```
	/**
	 * 第4个参数为支付方式：BP.PayType_Alipay(支付宝)、BP.PayType_Wechat(微信)、BP.PayType_QQ(QQ)
	 */
	BP.pay("商品名称", "商品描述", 0.02, BP.PayType_Alipay,, new Plistener(){...});
```
- 在需要调用订单查询的地方，调用如下方法(微信订单和支付宝订单通用)：
```
	BP.query("订单id", new QListener(){...});
```
## 类库说明

**c.b.BP**

- BP.pay(String title, String descript, double money, int payType, Plistener listener)

|类型|名称|说明|
|---|---|---|
|String|title|商品的名称,请注意不要有违禁字眼,可以为空<p>只允许中文、数字、英文和下划线、英文破折号，否则过滤|
|String|descript|商品的详情描述,请注意不要有违禁字眼,可以为空<p>只允许中文、数字、英文和下划线、英文破折号，否则过滤|
|double|price|商品的价格,建议测试用0.02|
|Int|payType|支付方式：BP.PayType_Alipay(支付宝)、BP.PayType_Wechat(微信)、BP.PayType_QQ(QQ)|
|Plistener|listener|支付结果监听类c.b.PListener<p>有成功、失败、未知结果、返回订单号等方法|

**注意**

**支付时返回的信息都未必可靠，一切以查询订单返回的信息为准**

	调用微信支付，要安装插件(如果没有安装,会监听器的fail方法会返回-3错误码)，插件在SDK文档的plugin文件夹下，demo有通过assets安装的示例

- BP.query(String orderId, QListener listener)

|类型|名称|说明|
|---|---|---|
|String|orderId|支付订单号,不可为空|
|OrderQueryListener|listener|查询结果监听类c.b.QListener<p>有成功、失败等方法|

- ！！！ForceFree方法已经弃用(开发者需自己控制用户多次点击支付产生多个订单的问题)
- ForceFree()

	当上一次支付操作尚未完成时,如果BmobPay对象发起再次请求,PayListener会回调fail方法返回并10777错误码,以免生成多个订单<p>
	如果使用过程中出现了阻塞(比如异常强制关闭支付插件页面,会导致一直不能再发起请求，这是小概率事件),则调用此方法进行BmobPay的重置<p>
	仅对下一次请求生效,而不是永久消除限制

**c.b.PListener**

- orderId(String orderId)

	无论支付成功与否,只要成功产生了请求,就返回订单号,请自行保存以便以后查询

- succeed()

	支付成功,保险起见请调用查询方法确认结果

- fail(int code, String reason)

	支付失败,有可能是用户中断支付,也有可能是网络问题<p>返回10777时说明上次操作尚未完成,拒绝多次请求以免生成多个订单(可用BP.ForceFree()方法强制取消一次限制)<p>支付宝支付时6001为用户主动中断支付操作</p>微信支付返回-2时为用户主动中断操作,返回-3为未安装Bmob支付插件.apk</p>(如果多次出现异常请向Bmob工作人员反馈)

- unknow()

	因为网络等问题,不能确认是否支付成功,请稍后手动查询(小概率事件)



**c.b.QListener**

- succeed(String status)

	**查询成功(并不是说支付成功),返回的status有NOTPAY和SUCCESS两种可能**

- fail(int code, String reason)

	查询失败,有可能是网络问题,也有可能是订单号错误



## 支付服务
关于如何使用支付功能，请查看 [Android支付SDK](/androidpay/index.html?menukey=fast_start&key=start_android_pay "Android支付SDK") 或 [iOS支付SDK](/iospay/index.html?menukey=fast_start&key=start_ios_pay "iOS支付SDK")。RestAPI目前只提供了查询订单的功能。

## 查询订单

    curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    https://api2.bmobapp.com/1/pay/Bmob系统生成的订单号

成功返回以下JSON, 失败时返回请看 [支付功能相关错误码](/errorcode/index.html?menukey=otherdoc&key=errorcode#支付功能相关错误码 "支付功能相关错误码")

    {
    "name": "商品",
    "body": "商品详情",
    "create_time": "2015-03-24 11:14:58",
    "out_trade_no": "9f392618f449a71c6fcfdee38d2b29e4",
    "transaction_id": "2015061100001000330057820379"
    "pay_type": "WECHATPAY",
    "total_fee": 0.01,
    "trade_state": "NOTPAY"
    }

返回的信息简单描述如下：

- name           : 订单或商品名称
- body-商品详情
- create_time    : 调起支付的时间
- out_trade_no   : Bmob系统的订单号
- transaction_id : 微信或支付宝的系统订单号
- pay_type       : WECHATPAY（微信支付）或ALIPAY（支付宝支付）
- total_fee      : 订单总金额
- trade_state    : NOTPAY（未支付）或 SUCCESS（支付成功）

## 支付回调

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

## 新版支付v3.1.1(20170111)的更新提示
- ForceFree方法已经弃用，开发者需自己控制用户多次点击支付产生多个订单的问题
- 这一版本的SDK将会在支付的过程中呈现一个中间页面，这个页面负责引导用户的支付流程，带来的影响是：
	1)可以不用在pay的回调里调用BP.query进行查询，因为这个页面会确定用户的支付结果(试用demo.apk进行体验)
	2)可以不用在你自己的app内提供责任说明的页面
- 支付宝支付需要用户手机已经安装支付宝，微信支付仍然需要安装插件
- 市面上还流传小部分内存很吃紧的老款手机，在打开支付宝或者微信的时候可能导致你自己的app被系统杀掉，这种情况可以通过在后台填写<支付结果的异步通知URL>解决，结合云端代码来使用(详情见云端代码文档)
- 不用再针对小米手机获取订单时9015的问题添加额外的代码，微信支付插件不用网络权限，但在部分手机可能还是需要用户手动开启<允许微信支付插件被其它app调起>的权限
- 新版支付SDK对Unity支持的解决方法:
	- 新版支付SDK需要so文件，Unity3d开发者如果没有处理过类似情况，可以这样做：
	- 将SDK中libs文件夹下，除了/armeabi、/armeabi-v7a、x86以外的文件夹删掉(jar文件需要保留)，然后把libs文件夹放在Plugins/Android/下。也就是最后会有 Plugins/Android/libs/armeabi/bmobwpay.so文件

## 其他
- 混淆规则如下:

		-libraryjars libs/BmobPay_v3.x.x_xxxxxx.jar
		-keepclasseswithmembers class c.b.** { *; }
		-keep interface c.b.PListener{ *; }
		-keep interface c.b.QListener{ *; }

- 在[Bmob财务管理平台](http://www.bmobapp.com/finance/info "Bmob财务管理平台")订单管理处，金额从小数点后第三位开始不显示，比如支付了0.01元实收0.00，其实是0.0095
- 如果用户的手机有“应用锁”功能（即点击应用后跳出系统设定的解锁界面，如小米、360、腾讯管家都可能有该功能），则可能会导致支付中断（支付宝返回6001，微信返回-2），这是微信和支付宝SDK出于安全考虑设置的，请建议用户出现该问题时先关掉支付宝钱包或微信的应用锁
- 由于微信SDK的限制，无法判断微信是否已登陆用户，**如果未登陆用户，监听器的fail方法可能不被调用**，请开发者们提醒自己的用户确保微信已登陆
- 如果支付宝已经选定了支付用的账户（或银行卡），但是支付失败，用户的支付宝账号会保留该订单，有可能从支付宝官网、支付宝钱包APP再次发起支付，在开发过程中请注意这种事情的处理情况
- 如果请求支付的页面为横屏，微信支付页面可能出现抽风现象（卡顿甚至重启），是因为微信出现莫名Bug不停开启新支付页面导致内存爆满，解决方法：在AndroidManifest.xml中将com.bmob.pay.tool.PayActivity设为强制竖屏（上方有示例），并尽可能将自己调用的Activity也设置为竖屏









