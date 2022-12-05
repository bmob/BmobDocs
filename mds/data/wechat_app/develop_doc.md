## 简介

- Bmob平台为您的移动应用提供了一个完整的后端解决方案，我们提供轻量级的SDK开发包，让开发者以最小的配置和最简单的方式使用Bmob平台提供的服务，进而完全消除开发者编写服务器代码以及维护服务器的操作。




## 应用程序
在Bmob平台注册后，每个账户可创建多个应用程序，创建的每个应用程序都有其独自的应用程序ID，此后所有的应用程序将凭其ID进行Bmob SDK的使用。即使只有一个应用程序，也可以以不同的版本进行测试和生产。

## 对象

### 数据对象
Bmob数据存储是建立在`Bmob.Object`基础上的。如写日记的`Bmob.Object`示例如下：

```
title: "I am title", content: "I am content"
```

这里需要注意的是：anchor

- 键必须是字母或者数字的字符串，值可以是字符串、数字、布尔值或者数组和字典。
- 每一个`Bmob.Object`都是一个特定子类的实例，子类名可以来区分各种数据，如我们可以把写日记的类称之为`diary`。

### 创建对象

你可以使用`Bmob.Object.extend`方法来创建新的`Bmob.Object`子类，示例代码如下：

```

	// 创建Bmob.Object子类
	var Diary = Bmob.Object.extend("diary");

	// 创建该类的一个实例
	var diary = new Diary();

```

如果你想为`Bmob.Object`的子类添加一些实例方法和类方法，示例代码如下：

```

	// 为Bmob.Object的子类添加实例方法和类方法
	var Diary = Bmob.Object.extend("diary", {
	  //实例方法
	  gleaterThanOneHundred: function() {
	    return this.get("title");
	  }
	}, {
	  //类方法
	  spawn: function(title) {
	    var diary = new Diary();
	    diary.set("title", title);
	    return diary;
	  }
	});

	var diary = Diary.spawn("hello world");
	console.log(diary.gleaterThanOneHundred());
```

## 使用图文素材
图文素材，类似微信的图文素材，经常被用在活动、广告、详细说明等情况。
使用图文素材系统会生成一个`_Article` 的数据表。如需取出图文素材的数据，只需跟普通表一样操作即可。




###增加一篇图文
```

   var Diary = Bmob.Object.extend("_Article");
      var diary = new Diary();
      diary.set("title","hello");
      diary.set("content","hello world");
      //添加数据，第一个入口参数是null
      diary.save(null, {
        success: function(result) {
          // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
            console.log("创建成功, objectId:"+result.id);
        },
        error: function(result, error) {
          // 添加失败
          console.log('创建失败');

        }
      });

```

### 静态文件
为了满足应用各类需求，保存的内容会生成一个HTML文件，存在您的文件中，如应用支持显示HTML，可直接显示，或者url内容转发到朋友圈。

ps:最近小程序也推出了显示H5页面，如果需要使用，可开通FTP功能自己管理应用的文件空间。


## 下载域名

由于最近微信封了~~*.upaiyun.com~~	域名，如果你没做文件下载功能，只是显示图片，可以不填写。如果你需要做下载功能，在应用设置里面，可以开启独立域名， 开启后，填写到微信平台就好了，当然有时候你想用自己的域名，也是可以的，可以工单联系我们。

## 客服消息
使用nodejs云函数可以对其他平台接口进行服务端开发，具体开发请参考微信官方文档。

## WebSocket
一个微信小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会创建失败。WebSocket可以做一些实时数据功能，比如聊天室，你画我猜之类的游戏。具体文档参考 **JavaScript->实时数据平台**

## 小程序token接口
微信access_token，业务场景,当其他平台需要使用你小程序的token，并不想与Bmob的平台冲突，可以通过此API实现
```
curl --request GET \
  --url https://自己备案域名/1/wechatApp/getAccessToken \
  --header 'content-type: application/json' \
  --header 'x-bmob-application-id: ' \
  --header 'x-bmob-rest-api-key: ' \
```

## 微信主人通知接口
微信主动推送通知，业务场景：比如你有APP，有人下单了，或者有人留言了。你可以收到微信推送通知。



支持2种调用方法
1.小程序
2.REST API

1.小程序`Bmob.sendMasterMessage`调用主人通知接口
```

成功后发送主人模板消息，这个只需把openid改正确即可接收到， Bmob后端云公众号回复openid
          var temp = {
            "touser": "Bmob公众号回复，openid 得到",
            "template_id": "-ERkPwp0ntimqH39bggQc_Pj55a18CYLpj-Ert8-c8Y",
            "url": "https://www.bmobapp.com/",
            "data": {
              "first": {
                "value": "您好，REST API 失效，请登录控制台查看。",
                "color": "#c00"
              },
              "keyword1": {
                "value": "REST API 失效"
              },
              "keyword2": {
                "value": "2017-07-03 16:13:01"
              },
              "keyword3": {
                "value": "高"
              },
              "remark": {
                "value": "如果您十分钟内再次收到此信息，请及时处理。"
              }
            }
          }
          console.log(temp);
          Bmob.sendMasterMessage(temp).then(function (obj) {
            console.log('发送成功');
            console.log(obj);
          }, function (err) {
            console.log(err);
          });

```




2.REST API调用方式

```
curl --request POST \
  --url http://自己备案域名/1/wechatApp/notifyMsg \
  --header 'content-type: application/json' \
  --header 'x-bmob-application-id: ' \
  --header 'x-bmob-rest-api-key: ' \
  --data '{
   "touser": "Bmob公众号回复，openid 得到",
   "template_id":"-ERkPwp0ntimqH39bggQc_Pj55a18CYLpj-Ert8-c8Y",
   "url": "http://www.bmobapp.com/",
   "data": {
       "first": {
           "value": "您好，REST API 失效，请登录控制台查看。",
           "color": "#c00"
       },
       "keyword1": {
           "value": "REST API 失效"
       },
       "keyword2": {
           "value": "2017-07-03 16:13:01"
       },
       "keyword3": {
           "value": "高"
       },
       "remark": {
           "value": "如果您十分钟内再次收到此信息，请及时处理。"
       }
   }}'


```

PS:`openid` 关注Bmob后端云公众平台回复`openid`

开放3个模板：
1.新订单通知（template_id：K9-6_Ayj4MLC2yvwY60-cq18tngJHAlqDfsOvv3D7a8
）
```
{{first.DATA}}

提交时间：{{tradeDateTime.DATA}}
订单类型：{{orderType.DATA}}
客户信息：{{customerInfo.DATA}}
{{orderItemName.DATA}}：{{orderItemData.DATA}}
{{remark.DATA}}
```

2.系统报警通知（template_id：-ERkPwp0ntimqH39bggQc_Pj55a18CYLpj-Ert8-c8Y
）
```
{{first.DATA}}
系统名称：{{keyword1.DATA}}
报警时间：{{keyword2.DATA}}
报警级别：{{keyword3.DATA}}
{{remark.DATA}}
```

3.购买成功通知（template_id：Mbk3kYqRGkL98ch6Lie4XSXtOsxXj2SC0SRQXd89G1Y
）
```
您好，您已购买成功。

商品信息：{{name.DATA}}
{{remark.DATA}}
```

4.审核结果通知（template_id：aNNNmi7WK4kohleWhCkDRKJiHOZnIpkrhXx5XPx4dx0
）
```
{{first.DATA}}
账号名称：{{keyword1.DATA}}
审核状态：{{keyword2.DATA}}
审核时间：{{keyword3.DATA}}
{{remark.DATA}}
```

ps：目前每个应用，每天有100条的免费额度，如需更多，可以工单联系我们

## 生成小程序二维码
生成推广二维码非常简单，比如你是传统企业，你可以为你店里每件衣服生成一个二维码，用户扫描直接可以付款定位到那件衣服，如果你是餐厅老板，客户在桌子上扫描二维码可以定位那张桌子。如果你是互联网企业，你可以发布二维码到朋友圈，可以定位到是谁推荐了这个用户，这个用户上级是谁，等等。Bmob封装了生成二维码函数，以下示例代码。

Bmob.generateCode 参数列表

| 键 | 值 |参数说明 |
| ------------ | ------------- | ------------ |
| path | pages/index/index | 页面路径，支持参数 |
| width | 430  | 二维码宽度，这个参数微信规定不能少于180 |
| interface | a\b\c  | 对应微信二维码abc方案 |
| scene | Bmob  | 微信B方案才需要此值 |
| type | 0/1  | 默认0，返回二维码base64数据.如果为1则服务端返回为二维码网络路径 |

更多微信官方小程序码介绍 [微信官方小程序码介绍](https://mp.weixin.qq.com/debug/wxadoc/dev/api/qrcode.html "微信官方小程序码介绍")


```


formSubmit: function (event) {
        var path = event.detail.value.path; //路径
        var width = event.detail.value.width; //宽度
        var that = this;
        Bmob.generateCode({ "path": path, "width": width }).then(function (obj) {
            console.log(obj);
            that.setData({
                imageBytes: obj.imageBytes  //二维码示例, 这里也可以返回二维码URL，请看上面参数
            })

        }, function (err) {

            //失败
        });
    }

```



## 小程序分享群Id

有些时候，我们小程序需要把内容分享到微信群，统计每个微信群有多少用户来查看了此信息。可以使用此接口，下面是微信官方的2个说法

* #####当用户成功地将小程序页面分享到微信群的时候，小程序的回调中可以获取分享目标的微信群 ID。
* #####当用户从微信群进入小程序页面的时候，小程序启动时可以获取用户进入小程序的渠道群聊 ID。


```

Page({
  onLoad () {
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
  },
  // 其他的页面函数、生命周期函数等
  onShareAppMessage() {
    return {
      title: '页面分享标题',
      path: '/pages/path/to/target',
      success(res){
        console.log(res.shareTickets);
                wx.getShareInfo({
          shareTicket: res.shareTickets,
          complete(res) {

            //内部调用云函数
            var currentUser = Bmob.User.current();
            var data = { "objectId": currentUser.id, "encryptedData": res.encryptedData, "iv": res.iv};
            console.log(data);

            // console.log(data);
            Bmob.Cloud.run('getOpenGId', data).then(function (obj) {
              // var res = JSON.parse(obj)
              console.log(obj)
            }, function (err) {
              console.log(err)
            });

          }
        })


      }
    }
  }
}

```
* ##### 页面只要加上这2个函数，即可实现转发到群功能，这里主要讲下解密群ID。


解密群ID主要是通过云逻辑来实现，这里添加一个`getOpenGId` 逻辑。你也可以复制腾讯官方提供的nodejs里面的代码

```

function onRequest(request, response, modules) {
    var objectId = request.body.objectId;
    var db = modules.oData;
    var crypto = modules.crypto;
    db.findOne({
        "table": "_User",
        //表名
        "objectId": objectId //记录的objectId
    },
    function(err, data) {
        //回调函数
        var data = JSON.parse(data);
        var sessionkey = data.authData.weapp.session_key;   //微信最新版本改版，此id是由前端发送过来
        var encryptedData = request.body.encryptedData;
        var iv = request.body.iv
        var groupid = groupIdParse(modules, sessionkey, encryptedData, iv) response.end(groupid);

    });

    function groupIdParse(modules, sessionKey, encryptedData, iv) {
        var crypto = modules.oCrypto;
        var sessionKey = new Buffer(sessionKey, 'base64'); //new Base64().decode(sessionKey);
        encryptedData = new Buffer(encryptedData, 'base64'); //new Base64().decode(encryptedData);
        iv = new Buffer(iv, 'base64'); //new Base64().decode(iv)
        var result = '';
        try {
            // 解密
            var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
            // 设置自动 padding 为 true，删除填充补位
            decipher.setAutoPadding(true) var decoded = decipher.update(encryptedData, 'binary', 'utf8') decoded += decipher.final('utf8') result = decoded;
            // decoded = JSON.parse(decoded)
        } catch(err) {
            throw new Error('Illegal Buffer123' + err)
        }
        //  if (decoded.watermark.appid !== this.appId) {
        //     //  throw new Error('Illegal Buffer')
        // }
        return result;
    }

}
```


解密返回数据：`{"openGId":"GLfcX0ber2CAPtXng-ac4g8zyNmk","watermark":{"timestamp":1496720764,"appid":"wx77d6b7031c1e4763"}}
`


如果你的应用功能出现解密报错，你可以写死传过来的三个变量，示例：
```
var sessionKey="xTlW5jfSUP3Kx0vC5PJbmw==";
    var encryptedData="SLvbzyuyck7384tlGjXwI5Meb2LydIhUGvwerwsvJhws1EJb7LnFPX1MfRcTyF8Bfj0ZRP8wu8XR+7hmTqgdQx11nOlJA0RawSoTJNYmy9kfYQsdqTq5EX0rRH8VozPURnTrjM9EGbfqaN6EetI/aQ==";
    var iv="7/TqHciNjSi3cdFFxr97ww==";

    var groupid=groupIdParse(modules,sessionKey,encryptedData,iv)
    var jsongid=JSON.parse(groupid);
    response.end(groupid);
    return;
```



## 小程序模板消息
小程序模板消息首先是通过获取`access_token`来发送。access_token有效期2小时。

* ##### 模板消息支持2种方式调用。
* 1.REST API
* 2.小程序

REST API
```
curl -X POST \
  http://自己备案域名/1/wechatApp/SendWeAppMessage \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'x-bmob-application-id: XXX' \
  -H 'x-bmob-rest-api-key: XXX' \
  -d '{
     "touser": "osr4I0WBS4kZuD_5P-_-bxbSobTg",
        "template_id": "omTTRD3pAMiAGKmyKo15Ifc2U_wLr6oWRZOifnTngvQ",
        "page": "index",
        "form_id":"3a8c5659469c9a582c8fd65054ea5307",
        "data": {
          "keyword1": {
            "value": "SDK测试内容",
            "color": "#173177"
          },
      "keyword2": {
          "value": "2015年01月05日 12:30"
      },
      "keyword3": {
          "value": "Bmob科技"
      }
    }
    ,"emphasis_keyword": ""
}'
```

REST API主要用在一些特殊情况，例如审核后给用户发送一个通知，定时发通知等这种要配合云逻辑或自己服务端来使用。


小程序内部调用比较常用，使用门槛低
```
var currentUser = Bmob.User.current();
var temp = {
    "touser": currentUser.get("openid"),
    "template_id": "B-2GcobfYnptevxY8G3SdA72YLYGZpOoJO_FEHlouWg",
    "page": "",
    "form_id": formId,
    "data": {
        "keyword1": {
            "value": "SDK测试内容",
            "color": "#173177"
        },
        "keyword2": {
            "value": "199.00"
        },
        "keyword3": {
            "value": "123456789"
        },
        "keyword4": {
            "value": "2015年01月05日 12:30"
        },
        "keyword5": {
            "value": "恭喜您支付成功，如有疑问请反馈与我"
        }
    },
    "emphasis_keyword": "keyword1.DATA"
}
Bmob.sendMessage(temp).then(function(obj) {
    console.log('发送成功')
},
function(err) {
  console.log(err)
});


```


## 小程序短信验证码
方法调用与JavaScript一致，查看JavaScript 短信文档 [请求短信验证码](https://docs.bmobapp.com/sms/JavaScript/b_developdoc/doc/index.html#请求短信验证码 "请求短信验证码")


## 小程序支付
小程序支付使用先在控制台填写商户号、商户支付密钥，发起请求获取微信需要的字段，这里用Bmob.Pay.wechatPay获取`nonceStr`,`packages`,`orderId`等相关信息。然后 wx.requestPayment弹窗支付页面，里面处理成功失败。 （Bmob的接口都是独立的，任何平台小程序都可以使用，只需要你的小程序微信商户平台开通了都支持。目前小程序支付Bmob平台不收取任何手续费，只要是Bmob平台付费会员都可使用。）


```
var openId = wx.getStorageSync('openid');
//传参数金额，名称，描述,openid
    Bmob.Pay.wechatPay(0.01, '哇哈哈1瓶', '哇哈哈饮料，杭州生产', openId).then(function (resp) {
      console.log(resp);

      that.setData({
        loading: true,
        dataInfo: resp
      })

      //服务端返回成功
      var timeStamp = resp.timestamp,
        nonceStr = resp.noncestr,
        packages = resp.package,
        orderId = resp.out_trade_no,//订单号，如需保存请建表保存。
        sign = resp.sign;

      //打印订单号
      console.log(orderId);

      //发起支付
      wx.requestPayment({
        'timeStamp': timeStamp,
        'nonceStr': nonceStr,
        'package': packages,
        'signType': 'MD5',
        'paySign': sign,
        'success': function (res) {
          //付款成功,这里可以写你的业务代码
          console.log(res);
        },
        'fail': function (res) {
          //付款失败
          console.log('付款失败');
          console.log(res);
        }
      })

    }, function (err) {
      console.log('服务端返回失败');
      console.log(err);
    });



```

## 小程序退款

 **参数说明：**

| 参数       | 类型   | 必填 | 说明     |
| ---------- | ------ | ---- | -------- |
| order_no   | string | 是   | 订单号   |
| refund_fee | float  | 是   | 退款金额 |
| desc       | string | 是   | 退款备注 |

**请求示例：**

```
var res = {
        "order_no": "3a94dad09cef0697c87c58befc7jsapi",
        "refund_fee": 0.1,
        "desc": "退款",
      }
    Bmob.refund(res).then(function (obj) {
      console.log(obj)
    },
      function (err) {
        console.log('失败了', err)
      });
```



## 小程序付款到零钱

**简介：**

付款到零钱目前已经支持，常见使用场景是用户小程序里面提现，由于此接口用的人少，如需要使用可提交工单联系工作人员。

**注意事项：**

此功能先看下自己微信支付支付有开通，默认是没开通的，微信18年的开通条件是

开通条件
需同时满足两个条件，才有开通该功能入口：
1、T+0 （T日结算至基本账户），结算商户需满足两个条件：1、入驻满90天，2、截止今日往回推30天连续不间断保持有交易。
2、其余结算周期的商户无限制，可立即前往【商户平台】->【产品中心】申请开通。
注：连续30天交易无金额限制，请保持正常交易。

## 添加数据

添加数据非常简单，任何`Bmob.Object`子类都有`save`方法可以用于将当前对象的内容保存到服务端。示例代码如下：

```

	//创建类和实例
	var Diary = Bmob.Object.extend("diary");
	var diary = new Diary();
	diary.set("title","hello");
	diary.set("content","hello world");
	//添加数据，第一个入口参数是null
	diary.save(null, {
		success: function(result) {
		  // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
			console.log("日记创建成功, objectId:"+result.id);
		},
		error: function(result, error) {
		  // 添加失败
		  console.log('创建日记失败');

		}
	});
```

你也可以用如下的示例代码添加数据：

```

	var Diary = Bmob.Object.extend("diary");
	var diary = new Diary();
	// 添加数据，第一个入口参数是Json数据
	diary.save({
	  title: "hello",
	  content: "hello world"
	}, {
	  success: function(result) {
	    // 添加成功
	  },
	  error: function(result, error) {
	    // 添加失败
	  }
	});
```

这里有几点需要注意的是:

1. 如果云端数据库中不存在`diary`表，Bmob会自动地在你第一次使用它的时候创建。
2. 每个`Bmob.Object`对象都有几个默认的字段是自动创建的：`objectId`是一个对于每一个保存的对象为一个标志；`createdAt`和`updatedAt`表示对象在Bmob中创建和最后一次更改的时间。这些字段的创建和内容是由服务器端自动完成的，在保存`Bmob.Object`之前不会存在。
3. 添加成功后，可以通过`result.createdAt`获取对象的创建时间，通过`result.updatedAt`获取对象的更新时间；可以通过`result.id`获取对象的objectId。


## 查询数据

数据的查询是每个应用都会频繁使用到的，Bmob提供了`Bmob.Object`类，方便大家实现不同条件的查询。

### 查询所有数据

查询某个数据表中的所有数据是非常简单的，只需要使用`Bmob.Query`的`find`方法就可以了，示例代码如下：

```
var Diary = Bmob.Object.extend("diary");
var query = new Bmob.Query(Diary);
// 查询所有数据
query.find({
  success: function(results) {
    console.log("共查询到 " + results.length + " 条记录");
    // 循环处理查询到的数据
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      console.log(object.id + ' - ' + object.get('title'));
    }
  },
  error: function(error) {
    console.log("查询失败: " + error.code + " " + error.message);
  }
});
```

如果你只想要一个结果，一个更加方便的方法是使用`first`，而不是`find`方法，示例代码如下：

```
var Diary = Bmob.Object.extend("diary");
var query = new Bmob.Query(Diary);
query.first({
  success: function(object) {
    // 查询成功
  },
  error: function(error) {
    console.log("查询失败: " + error.code + " " + error.message);
  }
});
```

**这里需要注意一点的是：**
默认情况下，系统实际上并不会返回所有的数据，而是默认返回10条数据记录，你可以通过setLimit方法设置返回的记录数量。更多细节可[点击查看分页查询](https://docs.bmobapp.com/data/wechatApp/b_developdoc/doc/index.html#分页查询)一节。

### 获取对象的特殊属性

注意，在对象中获取objectId，createdAt，updatedAt的方法分别如下：
obj.id
obj.createdAt
obj.updatedAt




### 查询单条数据

当我们知道某条数据的`objectId`时，就可以根据`objectId`值直接获取单条数据对象，示例代码如下：

```
var Diary = Bmob.Object.extend("diary");
//创建查询对象，入口参数是对象类的实例
var query = new Bmob.Query(Diary);
//查询单条数据，第一个参数是这条数据的objectId值
query.get("82c3e62d2c", {
  success: function(result) {
    // 查询成功，调用get方法获取对应属性的值
	var title = result.get("title");
	var content = result.get("content");
  },
  error: function(object, error) {
    // 查询失败
  }
});
```

### 条件查询

如果要查询某个属性等于某个值，示例代码如下：

```
query.equalTo("title", "bmob");
```
如果要查询某个属性不等于某个值，示例代码如下：
```
query.notEqualTo("title", "bmob sdk");
```

如果要模糊查询某个值，示例代码如下（模糊查询目前只提供给付费套餐会员使用）：
```
query.equalTo("title", { "$regex": "" + k + ".*" });
```

查询大于某个日期的数据，示例代码如下
```
query.equalTo("dateTime", {"$gte":{"__type":"Date","iso":"2011-08-21 18:02:52"}});
```

查询今天内的数据，方式如下:
```
query.equalTo("$and",[{"createdAt":{"$gte":{"__type":"Date","iso":"2014-07-15 00:00:00"}}},{"createdAt":{"$lte":{"__type":"Date","iso":"2014-07-15 23:59:59"}}}]);
```

对查询的属性值进行大小比较的示例代码如下：

```
// score < 50
query.lessThan(列名称, 50);

// score <= 50
query.lessThanOrEqualTo(列名称, 50);

// score > 50
query.greaterThan(列名称, 50);

// score >= 50
query.greaterThanOrEqualTo(列名称, 50);
```

两条查询语句一起写，就相当于`AND`查询，如下示例代码，查询同时满足`"playerName"="bmob" and "score">100`的数据：

```
query.notEqualTo("title", "bmob");
query.greaterThan(列名称, 100);
```

一个完整的例子：

```
var Diary = Bmob.Object.extend("diary");
var query = new Bmob.Query(Diary);
query.equalTo("title", "hello");
// 查询所有数据
query.find({
	success: function(results) {
		console.log("共查询到 " + results.length + " 条记录");
		// 循环处理查询到的数据
		for (var i = 0; i < results.length; i++) {
		var object = results[i];
		console.log(object.id + ' - ' + object.get('title'));
		}
	},
	error: function(error) {
		console.log("查询失败: " + error.code + " " + error.message);
	}
});
```


### 分页查询

有时，在数据比较多的情况下，你希望查询出的符合要求的所有数据能按照多少条为一页来显示，这时可以使用`limit`方法来限制查询结果的数据条数来进行分页。默认情况下，Limit的值为10，最大有效设置值1000（设置的数值超过1000还是视为1000）。
```
// 返回最多10条数据
query.limit(10);
```
在数据较多的情况下，在`limit`的基础上分页显示数据是比较合理的解决办法，`skip`方法可以做到跳过查询的前多少条数据来实现分页查询的功能。默认情况下`skip`的值为10。

```
query.skip(10); // skip the first 10 results
```

### 结果排序

我们可以对返回的结果进行排序（只支持`number`，`date`，`string`类型的排序），示例代码如下：
```
// 对score字段升序排列
query.ascending(列名称);

// 对score字段降序排列
query.descending(列名称);
```


### 统计记录数量

如果你只是想统计满足`query`的结果集到底有多条记录，你可以使用`count`方法。如为了获得diary表的记录数量，示例代码如下：

```
var Diary = Bmob.Object.extend("diary");
var query = new Bmob.Query(Diary);
query.count({
  success: function(count) {
    // 查询成功，返回记录数量
    console.log("共有 " + count + " 条记录");
  },
  error: function(error) {
    // 查询失败
  }
});

```

### 复杂查询

如果你想查询某一字段值在某一集合中的记录的话，可以使用`containedIn`方法，如获取`"Bmob"、"hello"、"sure" `三条标题为这的记录信息，那么示例代码如下：
```
// 第一个参数是字段名称，第二个参数是数组
query.containedIn("title", ["Bmob", "hello", "sure"]);

```

相反地，你可以使用`notContainedIn`方法来查询在集合外的目标对象。

如果想要查询含有某一特定属性的对象，可以使用`exists`。相对地，如果你想获取没有这一特定属性的对象，你可以使用`doesNotExist`，示例代码如下：
```
// 查询含有title属性的对象
query.exists("title");

// 查询不含有title属性的对象
query.doesNotExist("title");
```

你可以使用`matchesKeyInQuery`方法来进行嵌套的子查询。举例说，如果你有一个类包含了用户心情， 而你在用户类中存储了用户的详细信息，你可以构造一个查询来查找被点赞次数超过5次的用户信息，示例代码如下：
```
var Diary = Bmob.Object.extend("diary");
var DiaryQuery = new Bmob.Query(Diary);
DiaryQuery.greaterThan("isLike",5);
var userQuery = new Bmob.Query(Bmob.User);
userQuery.matchesKeyInQuery("phone", "nickname", DiaryQuery);
userQuery.find({
  success: function(results) {
    // results has the list of users with all user with record
  }
});
```

相对地，可以使用`doesNotMatchKeyInQuery`来获取属性不在子查询结果中的对象。比如为了获得用户的日记被点赞不超过5次的情况：
```
var Diary = Bmob.Object.extend("diary");
var DiaryQuery = new Bmob.Query(Diary);
DiaryQuery.greaterThan("isLike",5);
var userQuery = new Bmob.Query(Bmob.User);
userQuery.doesNotMatchKeyInQuery("phone", "nickname", DiaryQuery);
userQuery.find({
  success: function(results) {

  }
});
```

### 查询指定列

有时候你不想返回所有的字段信息，那么就可以用`select`方法来限定返回的字段。示例代码如下：
```
var Diary = Bmob.Object.extend("diary");
var query = new Bmob.Query(Diary);
// 只返回select的字段值
query.select("title");
query.find().then(function(results) {
  // 返回成功
});
```

**注意：系统默认的字段`objectId`、`createdAt`、`updatedAt`、`ACL`也会返回。**


### 对字符串类型做查询

如果想要查询以某一个特定字符串开头的记录，可以使用`startWith`方法，示例代码如下：

```
// 查询在title字段中以he开头的记录
var query = new Bmob.Query(Diary);
query.startsWith("title", "he");
```

### 或查询

你可以使用`Bmob.Query.or`方法操作或查询，示例代码如下：

```
var query1 = new Bmob.Query(Diary);
query1.greaterThan("isLike", 150);

var query2 = new Bmob.Query(Diary);
query2.lessThan("isLike", 5);

var mainQuery = Bmob.Query.or(query1, query2);
mainQuery.find({
  success: function(results) {
     // 返回 isLike > 150 or isLike < 5 的值
  },
  error: function(error) {
    // 返回失败
  }
});
```

**注意：我们不会在组合查询的子查询中支持非过滤型的条件 (比如:limit,skip,ascending/descending,include)**



### 统计相关的查询
Bmob的统计查询，提供以下关键字或其组合的查询操作：

| Key        | Operation |
| :----:  | :----:  |
| groupby     | 分组操作 |
| groupcount     | 返回每个分组的总记录 |
| sum     | 计算总和 |
| average     | 计算平均值 |
| max     | 计算最大值 |
| min     | 计算最小值 |
| having     | 分组中的过滤条件 |


为避免和用户创建的列名称冲突，Bmob约定以上统计关键字（sum, max, min)的查询结果值都用 `_(关键字)+首字母大写的列名` 的格式，如计算玩家得分列名称为score总和的操作，则返回的结果集会有一个列名为_sumScore。average返回的列为 `_avg+首字母大写的列名` ，有groupcount的情形下则返回_count。

以上关键字除了groupcount是传Boolean值true或false，having传的是和where类似的json字符串，但having只应该用于过滤分组查询得到的结果集，即having只应该包含结果集中的列名如 `{"_sumScore":{"$gt":100}}` ，其他关键字必须是字符串而必须是表中包含的列名，多个列名用,分隔。


比如，GameScore表是游戏玩家的信息和得分表，有playerName(玩家名称)、score(玩家得分)等你自己创建的列，还有Bmob的默认列objectId, createdAt, updatedAt,那么我们现在举例如何使用以上的查询关键字来作这个表的统计。

#### 计算总和
我们要计算GameScore表所有玩家的得分总和，sum后面只能拼接Number类型的列名，即要计算哪个列的值的总和，只对Number类型有效，多个Number列用,分隔，则查询如下：

```
query._extraOptions = {"sum":"score"};
```

返回内容如下：

```
[
	{
		"_sumScore": 2398
	}
]

```



## 修改数据

修改数据非常简单，首先需要获取到要更新的`Bmob.Object`对象，修改值后保存数据就可以了，示例代码如下：

```
var Diary = Bmob.Object.extend("diary");
var query = new Bmob.Query(Diary);

// 这个 id 是要修改条目的 objectId，你在
 这个存储并成功时可以获取到，请看前面的文档
query.get('3453453453', {
    success: function(result) {
      // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
      result.set('title', 'test!');
      result.save();

      // The object was retrieved successfully.
    },
    error: function(object, error) {

    }
});
```
或者

```
var Diary = Bmob.Object.extend("diary");
var Diary = new Diary();
Diary.set("title", "111");
Diary.set("content", "222");
//添加数据
Diary.save(null, {
  success: function(result) {
    // 修改数据
    result.set("title", "111");
    result.set("content", "222");
    result.save();
  }
})
```

如果想更新成功后获取更新后的对象属性，请设置`fetchWhenSave`：

```
 //假设result是已经存在的对象
    result.fetchWhenSave(true);
    result.set("title", "111");
    result.set("content", "222");
    result.save();
```

## 删除数据

删除数据可以使用`Bmob.Object`的`destroy`方法，示例代码如下：

```
myObject.destroy({
  success: function(myObject) {
    // 删除成功
  },
  error: function(myObject, error) {
    // 删除失败
  }
});

```

批量删除对象的示例代码如下：

```
//单个请求每次最多删除50条。
 var query = new Bmob.Query('diary');
 query.equalTo("title", "后端云");
          query.find().then(function (todos) {
            return Bmob.Object.destroyAll(todos);
          }).then(function (todos) {
            console.log(todos);
            // 删除成功
          }, function (error) {
            // 异常处理
          });
```

如果你想将查询出来的对象都删除，或者删除符合查询条件的所有对象，可以调用`destroyAll`方法，示例代码如下：

```
query.destroyAll({
   success: function(){
      //删除成功
   },
   error: function(err){
      // 删除失败
   }
   });
```

### 删除字段

你可以使用`unset`方法在删除一个字段：

```
// 删除playerName字段
myObject.unset("title");
myObject.save();
```

## 常见数据类型的操作

```
var number = 42;
var string = "the number is " + number;
var date = new Date();
var array = [string, number];
var object = { number: number, string: string };

var bigObject = new BigObject();
bigObject.set("myNumber", number);
bigObject.set("myString", string);
bigObject.set("myDate", date);
bigObject.set("myArray", array);
bigObject.set("myObject", object);
bigObject.set("myNull", null);
bigObject.save();
```

## 数组操作

### 添加及更新数组
为了帮你存储数组类数据，有三种操作你可以原子性地改动一个数组，这需要一个给定的 key：

- `add`在一个数组的末尾加入一个给定的对象。
- `addUnique`只会把原本不存在的对象加入数组，所以加入的位置没有保证。

比如, 我们想在数组"DiaryType"中加入日记类型：

```
Diary.addUnique("DiaryType", "public");
Diary.addUnique("DiaryType", "secret");
Diary.save();
```

### 数组查询
对于value是数组的情况，你可以这样查询数组中的值有`2`的情况的对象：

```
// Find objects where the array in DiaryType contains public.
query.equalTo("DiaryType","public");
```

你同样可以用下面的方式找到同时包含元素`2、3、4`的数组：
```
// Find objects where the array in DiaryType contains all of the elements public,secret.
query.containsAll("DiaryType", ["public","secret"]);
```

### 删除数组

`remove`在一个数组中删除所有指定的所有实例：

```
var Diary = Bmob.Object.extend("diary");
var query = new Bmob.Query(Diary);
query.get("bc5da708dc",{
  success: function(result) {
    result.remove("DiaryType","public");
    result.save();
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});
```

##批量操作

### 批量更新示例

```

把Todo表title所有为Bmob的更新为Bmob后端云
var query = new bmob.Query('Todo');
query.equalTo("title", "bmob");
query.find().then(function(todos) {
    todos.forEach(function(todo) {
        todo.set('title', "Bmob后端云");
    });
    return bmob.Object.saveAll(todos);
}).then(function(todos) {
    // 更新成功
},
function(error) {
    // 异常处理
});

```

## 批量增删改

```
var objects = []; // 构建一个本地的 bmob.Object 对象数组
// 批量创建（更新）
bmob.Object.saveAll(objects).then(function(objects) {
    // 成功
},
function(error) {
    // 异常处理
});
// 批量删除
bmob.Object.destroyAll(objects).then(function() {
    // 成功
},
function(error) {
    // 异常处理
});
// 批量获取
bmob.Object.fetchAll(objects).then(function(objects) {
    // 成功
},
function(error) {
    // 异常处理
});
```

### 批量删除示例

```
    var objects = new Array()
    objects.push({ "id": "1e9b9a093e", "className": "diary" })

    // 批量删除
    Bmob.Object.destroyAll(objects).then(function () {
      // 成功
    },
      function (error) {
        // 异常处理
      });
```



### 批量增加更新示例

```
// 创建Bmob.Object子类
    var Diary = Bmob.Object.extend("diary");
    var objects = new Array();
    for (var i = 0; i < 5; i++) {
      // 创建该类的一个实例
      var diary = new Diary();
      diary.set('title', 'aaaa')
      diary.set('content', 'dfdfdjjj')
      objects.push(diary)
    }

    // 批量创建（更新）
    Bmob.Object.saveAll(objects).then(function (objects) {
      // 成功
      console.log("批量更新成功", objects);
    },
      function (error) {
        // 异常处理
        console.log("异常处理");
      });

      修改传
      diary.set('objectId', 'ba74dc1f09')
```



## 数据关联

### 添加及修改关联关系
#### 一对一关系和一对多关系

一对一关系和一对多关系都可以通过在一个`Bmob.Object`内保存另一个对象来实现。比如，每一个 Comment都对应了一个Post，创建一个有一个Comment的Post，你可以这样写：

```

// Declare the types.
var Post = Bmob.Object.extend("Post");
var Comment = Bmob.Object.extend("Comment");

// Create the post
var myPost = new Post();
myPost.set("title", "I'm Hungry");
myPost.set("content", "Where should we go for lunch?");

// Create the comment
var myComment = new Comment();
myComment.set("content", "Let's do Sushirrito.");

// Add the post as a value in the comment
myComment.set("parent", myPost);

// This will save both myPost and myComment
myComment.save();

```

Bmob内部会自动处理，调用Comment的`save`方法就可以同时保存两个新对象。

如果是现有对象想要关联到新对象，你同样可以通过只用它们的`objectId`来连接彼此。请注意，不能直接像上面的例子那样将现有对象设置进去，而是必须`new`一个新对象并只设置`id`属性：

```
var post = Bmob.Object.createWithoutData("Post", "320b0395f3");
myComment.set("parent", post);
```

或者：

```
var post = new Post();
post.id = '520c7e1ae4b0a3ac9ebe326a';
myComment.set("parent", post);
```






如果希望查询结果中包含多个相关联的其他数据类型。你可以使用 include 方 法。例如有个comments，你可能想同时获取它们相关的 post 数据:

```
var query = new Bmob.Query(Comment);

query.include("post");

```



可以这样获取include对象的属性:
```
obj.get("inloudeObj").field
```

查出用户发表的日志示例

```
 	var objectId,that=this;
    var currentUser = Bmob.User.current();
    objectId = currentUser.id;

    var Diary = Bmob.Object.extend("diary");
    var query = new Bmob.Query(Diary);
    var isme = new Bmob.User();
    isme.id = objectId;		//当前用户的objectId
    query.equalTo("own", isme);
    query.descending('createdAt');	//排序
    query.include("own");  //own 字段名称，类型 Pointer

    // 查询所有数据
    query.limit(that.data.limit);
    query.find({
      success: function (results) {
        that.setData({
          diaryList: results
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    });
```

wxml文件调用

```
<view class="weui-media-box weui-media-box_text" wx:for="{{diaryList}}" wx:key="diaryItem">
日志标题：
{{item.title}}
用户表的日志作者：
{{item.own.nickName}}
</view>

```



## 原子计数器

许多应用都需要维持一些计数器数据，譬如用来跟踪心情被点赞数目等等。Bmob提供了便捷的方式来对任何数字字段进行原子性的增加或者减少：

```
Diary.increment("isLike");
Diary.save();
```

你可以同样传入第二个参数到`increment`方法来指定增加多少，`1`是默认值。


## 文件上传

### 文件上传

文件上传，例如，我们从本地上传一张图片到服务器，名称为"1.jpg"，可用以下代码：

在js中添加以下代码：
```
wx.chooseImage({
  count: 1, // 默认9
  sizeType: [ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  success: function (res) {
      var tempFilePaths = res.tempFilePaths;
      if(tempFilePaths.length>0){
          var name="1.jpg";//上传的图片的别名，建议可以用日期命名
          var file=new Bmob.File(name,tempFilePaths);
          file.save().then(function(res){
            console.log(res.url());
          },function(error){
            console.log(error);
          })
      }

  }
})

#### PS： 特别注意的是 `tempFilePaths` 是微信返回的数组。

```
### 图片批量上传
图片批量上传，我们只需要for循环一下上面的就好，一下示例代码。
```
upImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        wx.showNavigationBarLoading()
        that.setData({
          loading: false
        })
        var urlArr = new Array();
        // var urlArr={};
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        var imgLength = tempFilePaths.length;
        if (imgLength > 0) {
          var newDate = new Date();
          var newDateStr = newDate.toLocaleDateString();

          var j = 0;
		  //如果想顺序变更，可以for (var i = imgLength; i > 0; i--)
          for (var i = 0; i < imgLength; i++) {
            var tempFilePath = [tempFilePaths[i]];
            var extension = /\.([^.]*)$/.exec(tempFilePath[0]);
            if (extension) {
              extension = extension[1].toLowerCase();
            }
            var name = newDateStr + "." + extension;//上传的图片的别名

            var file = new Bmob.File(name, tempFilePath);
            file.save().then(function (res) {
              wx.hideNavigationBarLoading()
              var url = res.url();
              console.log("第" + i + "张Url" + url);

              urlArr.push({ "url": url });
              j++;
              console.log(j, imgLength);
              // if (imgLength == j) {
              //   console.log(imgLength, urlArr);
              //如果担心网络延时问题，可以去掉这几行注释，就是全部上传完成后显示。
                showPic(urlArr, that)
              // }

            }, function (error) {
              console.log(error)
            });

          }




        }

      }
    })
  }
})



//上传完成后显示图片
function showPic(urlArr, t) {
  t.setData({
    loading: true,
    urlArr: urlArr
  })
}

```

### 文件删除
```
var path;
path = "http://bmob-cdn-9200.b0.upaiyun.com/2017/04/25/f24b9ef540f1aeb680ebe01ba8543d9f.png";
var s = new Bmob.Files.del(path).then(function(res) {
    if (res.msg == "ok") {
        console.log('删除成功');
    }
},
function(error) {
    console.log(error)
});
```


## 图片处理

新版文件服务由第三方厂商又拍云提供，只需要在文件上传成功返回的url后面拼接特定参数即可实现缩放，缩略图，加水印等效果，[如图](http://bmob-cdn-9200.b0.upaiyun.com/2017/04/25/f24b9ef540f1aeb680ebe01ba8543d9f.png!/scale/80/watermark/text/5rC05Y2wCg==)，具体可参考[这里](http://docs.upyun.com/cloud/image/) 。


## Promise

除了回调函数之外，每一个在Bmob JavaScript SDK中的异步方法都会返回一个 Promise. 使用 Promise，你的代码可以比原来的嵌套 callback 的方法看起来优雅得多.

### then 方法

每一个`Promise`都有一个叫`then`的方法, 这个方法接受一对`callback`。第一个`callback`在`promise`被解决的时候调用，第二个会在`promise`被拒绝的时候调用。

```
obj.save().then(function(obj) {
  // the object was saved successfully.
}, function(error) {
  // the save failed.
});
```

### 将Promise 组织在一起

`Promise`比较神奇，可以代替多层嵌套方式来解决发送异步请求代码的调用顺序问题。 如果一个`Promise`的回调会返回一个`Promise`，那么第二个`then`里的`callback`在第一个`then`的`callback`没有解决前是不会解决的。

```
var query = new Bmob.Query("Student");
query.descending("gpa");
query.find().then(function(students) {
  students[0].set("valedictorian", true);
  return students[0].save();

}).then(function(valedictorian) {
  return query.find();

}).then(function(students) {
  students[1].set("salutatorian", true);
  return students[1].save();

}).then(function(salutatorian) {
  // Everything is done!

});
```

### 错误处理

如果任意一个在链中的`Promise`返回一个错误的话，所有的成功的`callback`在接下来都会被跳过直到遇到一个处理错误的`callback`。处理`error`的`callback`可以转换`error`或者可以通过返回一个新的`Promise`的方式来处理它。你可以想象成拒绝的`promise`有点像异常，而`error callback`则像是一个`catch`来处理这个异常或者抛出异常。

```
var query = new Bmob.Query("Student");
query.descending("gpa");
query.find().then(function(students) {
  students[0].set("valedictorian", true);
  // Force this callback to fail.
  return Bmob.Promise.error("There was an error.");

}).then(function(valedictorian) {
  // Now this will be skipped.
  return query.find();

}).then(function(students) {
  // This will also be skipped.
  students[1].set("salutatorian", true);
  return students[1].save();
}, function(error) {
  // This error handler WILL be called. error will be "There was an error.".
  // Let's handle the error by returning a new promise.
  return Bmob.Promise.as("Hello!");

}).then(function(hello) {
  // Everything is done!
}, function(error) {
  // This isn't called because the error was already handled.
});
```

通常来说，在正常情况的回调函数链的末尾，加一个错误处理的回调函数会是很方便的做法.

### 创建 Promise

在开始阶段，你可以只用系统（譬如`find`和`save`方法等）返回的`promise`。但在更高级的场景下，你可能需要创建自己的`promise`。在创建了`Promise`之后，你需要调用`resolve`或者`reject`来触发它的`callback`。

```
var successful = new Bmob.Promise();
successful.resolve("The good result.");

var failed = new Bmob.Promise();
failed.reject("An error message.");
```

如果你在创建`promise`的时候就知道它的结果，下面有两个很方便的方法可以使用：

```
var successful = Bmob.Promise.as("The good result.");
var failed = Bmob.Promise.error("An error message.");
```

### 顺序的Promise

```
var query = new Bmob.Query("Comments");
query.equalTo("post", 123);

query.find().then(function(results) {
  // Create a trivial resolved promise as a base case.
  var promise = Bmob.Promise.as();
  _.each(results, function(result) {
    // For each item, extend the promise with a function to delete it.
    promise = promise.then(function() {
      // Return a promise that will be resolved when the delete is finished.
      return result.destroy();
    });
  });
  return promise;

}).then(function() {
  // Every comment was deleted.
});
```

### 并行的Promise

你也可以用`Promise`来并行的进行多个任务，这时需要使用`when`方法。你可以一次同时开始几个操作，使用`Bmob.Promise.when`来创建一个新的`promise`，它会在所有输入的`Promise`被解决之后才被解决。即便一些输入的`promise`失败了，新的`Promise`也会被成功执行。你可以在 `callback`的参数部分检查每一个`promise`的结果，并行地进行操作会比顺序进行更快，但是也会消耗更多的系统资源和带宽。

```
var query = new Bmob.Query("Comments");
query.equalTo("post", 123);

query.find().then(function(results) {
  // Collect one promise for each delete into an array.
  var promises = [];
  _.each(results, function(result) {
    // Start this delete immediately and add its promise to the list.
    promises.push(result.destroy());
  });
  // Return a new promise that is resolved when all of the deletes are finished.
  return Bmob.Promise.when(promises);

}).then(function() {
  // Every comment was deleted.
});
```

### 创建异步方法

有了上面这些工具以后, 就很容易创建你自己的异步方法来返回`promise`了。举例说，你可以创建一个有`promise`版本的`setTimeout`。

```
var delay = function(millis) {
  var promise = new Bmob.Promise();
  setTimeout(function() {
    promise.resolve();
  }, millis);
  return promise;
};

delay(100).then(function() {
  // This ran after 100ms!
});
```

## Collection

一个`Bmob.Collection`就是一个`Bmob.Objects`的有序集合，它和`Backbone.Collection`是兼容的，有相同的特性和功能，你可以通过用一个模型类或者一个特定的`Bmob.Query`来创建一个新的子类。

```
// A Collection containing all instances of TestObject.
var TestCollection = Bmob.Collection.extend({
  model: TestObject
});
var collection = new TestCollection();

// A Collection of TestObjects whose temperature is "hot".
var HotCollection = Bmob.Collection.extend({
  model: TestObject,
  query: (new Bmob.Query(TestObject)).equalTo("temperature", "hot")
});
var collection = new HotCollection();

// The Collection of TestObjects that match a complex query.
var query = new Bmob.Query(TestObject);
query.equalTo("temperature", "hot");
query.greaterThan("degreesF", 100);
var collection = query.collection();
```

### 获取Collection

使用`fetch`方法来获取一个`collection`里的所有元素:

```
var collection = new TestCollection();
collection.fetch({
  success: function(collection) {
    collection.each(function(object) {
      console.warn(object);
    });
  },
  error: function(collection, error) {
    // The collection could not be retrieved.
  }
});
```

### Collection 排序

你可以设定一个`comparator`来对`collection`中的元素进行排序:

```
var collection = new TestCollection();
collection.comparator = function(object) {
  return object.get("temperature");
};
```

### 修改一个 Collection

`Collection`是可变的，你可以访问所有元素，增加或者删除元素：

```
var collection = new TestCollection();

collection.add([
  {"name": "Duke"},
  {"name": "Scarlett"}
]);

// Get the "Duke" Bmob.Object by its sorted position.
var model = collection.at(0);

// Or you can get it by Bmob objectId.
var modelAgain = collection.get(model.id);

// Remove "Duke" from the collection.
collection.remove(model);

// Completely replace all items in the collection.
collection.reset([
  {"name": "Hawk"},
  {"name": "Jane"}
]);
```

## 用户

在许多应用中，都有一个用户账户的概念，用户账户让用户可以用安全的方式访问他们自己的信息。我们提供了一个特殊的用户类叫`Bmob.User`来自动处理有关用户的账户管理的功能。

`Bmob.User`是`Bmob.Object`的一个子类，而且有`Bmob.Object`一样的功能，比如可变的模式、自动的持久化、键值对接口等。所有对`Bmob.Object`有用的方法同样可以作用于`Bmob.User`。`Bmob.User`的不同之处在于`Bmob.User`对于用户的账户有一些特定的功能。


### 属性

`Bmob.User`有一些与`Bmob.Object`不一样的字段:
`username`：用户的用户名（必须提供）
`password`：用户的密码（在注册的时候必须提供）
`email`：用户的 email（可选）
`userData`：每个微信用户的唯一标识，包括用户openId、expires_in、session_key（可选,自行创建，Object类型）
我们会在下面的用例中详细介绍细节

### 注册一

**登录注册集合类，接口默认第一次注册，否则返回用户信息**

首先要在_User表新建一个用来存用户唯一标识的字段，例如：userData(Object类型)，然后在js中插入以下代码：

V3.5 版本优化上面代码登陆只需在app.js 加入2行代码

```
onLaunch: function() {
    var user = new Bmob.User() //实例化用户对象
    user.auth()
  },
```

> 2018-5-10号以后微信废除了`wx.getUserInfo` 方法，如需数据库保存用户昵称与头像，请看微信官方就教程更新到用户表。

### 注册二

**使用用户账号密码进行注册**

通常你的app第一件要做的事情就是让用户进行注册，这里把用户密码设置为`Openid`，下面的代码展示了怎样进行微信注册的过程（包括获取用户的唯一标识）：

首先要在_User表新建一个用来存用户唯一标识的字段，例如：userData(Object类型)，然后在js中插入以下代码：

```
wx.login({
  success: function(res) {
    if (res.code) {
		Bmob.User.requestOpenId(res.code, {//获取userData(根据个人的需要，如果需要获取userData的需要在应用密钥中配置你的微信小程序AppId和AppSecret，且在你的项目中要填写你的appId)
          success: function(userData) {
			  wx.getUserInfo({
				  success: function(result) {
				    var userInfo = result.userInfo
				    var nickName = userInfo.nickName

					var user = new Bmob.User();//开始注册用户
            		user.set("username", nickName);
            		user.set("password", userData.openid);//因为密码必须提供，但是微信直接登录小程序是没有密码的，所以用openId作为唯一密码
					user.set("userData", userData);
            		user.signUp(null, {
                		success: function(res) {
	                      console.log("注册成功!");
		                },
		                error: function(userData, error) {
		                  console.log(error)
		                }
		            });
				  }
			  })
          },
          error: function(error) {
              // Show the error message somewhere
              console.log("Error: " + error.code + " " + error.message);
          }
      });

    } else {
      console.log('获取用户登录态失败！' + res.errMsg)
    }
  }
});
```

这个调用会异步地在在你的应用中创建一个新的用户。在它这样做之前，它同样会确认用户名和`email`在应用内都是唯一的。同样，我们从不会将用户密码以明文向任何客户端发送。

注意我们使用了`signUp`方法而不是`save`方法，新的`Bmob.User`永远应该使用`signUp`方法来新建。而随后的用户的信息更新可以调用`save`来做。

如果一个`signup`没有成功的话，你应该读取返回的错误对象。最常见的问题是`username`或者`email`已经被其他用户所使用了。你应该清楚地反馈给你的用户，让他们再次用一个不同的用户名来注册。

你也可以使用`email`来作为用户名，只要求你的用户输入他们的`email`但是同时自动填充好`username`属性就可以了，`Bmob.User`会跟原来一样工作，我们会在下面的重设密码环节再次说明这个细节。

>



### 登录（自有账户密码登录，适合APP迁移过来的用户）

如果你要求你的用户用你自己设计的注册页面注册后，当然应该让他们在以后用自己的账户登录进来，你可以使用`logIn`方法来进行登陆：

```
Bmob.User.logIn("myname", "mypass", {
  success: function(user) {
    // Do stuff after successful login.
  },
  error: function(user, error) {
    // The login failed. Check error to see why.
  }
});
```

### 验证 Email

在application设置中启用email验证可以让你的应用给最终用户一些更安全的使用体验，譬如部分功能只开放给验证过邮箱的用户使用等等。Email验证会在`Bmob.User`上加入一个`emailVerified`字段。当一个`Bmob.User`的`email`被设定或者修改后,`emailVerfied`会被设定为`false`。Bmob 会向用户的`email`来发送一个链接，点击这个链接会设置`emailVerified`为`true`：

有三种`emailVerified`状态可以供参考：

1. `true`：用户已经通过点击Bmob发过来的链接来确认邮箱地址. 当用户账户新创建的时候这个值永远不应该是true。
2. `false`：在 `Bmob.User`对象最后一次刷新的时候，用户还是没有确认他们的`email`地址，如果`emailVerified`是false 的话，你应该考虑调用`Bmob.User`的`fetch`方法。
3.  `missing`：`Bmob.User`被创建了，但是当时的`email`验证功能还没有开启, 或者说`Bmob.User`没有email地址。

代码例子如下：console.log

```
//reset password
 Bmob.User.requestEmailVerify("h6k65@126.com", {
  success: function() {
    // Password reset request was sent successfully
  },
  error: function(error) {
    // Show the error message somewhere
    console.log("Error: " + error.code + " " + error.message);
  }
});
```

### 当前用户

如果用户每次打开App的时候都要求登录无疑是令人感到厌烦的，你可以通过缓存当前的`Bmob.User`对象来避免这个问题。

无论你使用任何注册或者登录方法，用户都会在`localStorage`中储存，你可以把缓存作为一个`session`对待，并且自动假设用户已经登录了。

```
var currentUser = Bmob.User.current();
if (currentUser) {
    // do stuff with the user
} else {
    // show the signup or login page
}
```

你可以通过`logout`来清除掉当前的用户：

```
Bmob.User.logOut();

var currentUser = Bmob.User.current();  // this will now be null
```

### 修改当前用户信息

修改本地缓存信息

```
var User = Bmob.Object.extend("_User");
var query = new Bmob.Query(User);
// 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
query.get(objectId, {
  success: function (result) {
    // 回调中可以取得这个 diary 对象的一个实例，然后就可以修改它了
    result.set('mobilePhoneNumber', phone);
    result.save().then(function (res) {
      // 修改本地缓存
      var currentUser = Bmob.User.current();
      if (currentUser) {
        currentUser.set("mobilePhoneNumber", phone);
        Bmob.User._saveCurrentUser(currentUser);
      }
      // The object was retrieved successfully.
      common.showTip("修改手机号成功", "success", function () {
        setTimeout(function () {
          wx.navigateBack();
        }, 1000)
      });
    }, function (err) {
      // The object was retrieved successfully.
      console.log(err)
    });
  })
})
```



### 用户对象的安全

`Bmob.User`类默认就是受保护的，在`Bmob.User`中保存的数据只能被那个用户所修改。默认地，数据仍然可以被任意客户端所读取。这样就是说，有些`Bmob.User`对象被认证后是可以修改的，其他的仍然是只读的。

特别的，你不能调用`save`或者`delete`方法除非`Bmob.User`经过了认证，就比如调用过了`logIn`或者`signUp`方法，这样保证只有用户能改动他们自身的数据。

下面的代码展示了上面说的安全策略：

```
var user = Bmob.User.logIn("my_username", "my_password", {
  success: function(user) {
    user.set("username", "my_new_username");  // attempt to change username
    user.save(null, {
      success: function(user) {
        // This succeeds, since the user was authenticated on the device

        // Get the user from a non-authenticated method
        var query = new Bmob.Query(Bmob.User);
        query.get(user.objectId, {
          success: function(userAgain) {
            userAgain.set("username", "another_username");
            userAgain.save(null, {
              error: function(userAgain, error) {
                // This will error, since the Bmob.User is not authenticated
              }
            });
          }
        });
      }
    });
  }
});
```

从`Bmob.User.current()`获取的`Bmob.User`总是已经通过验证了的。

如果你需要查看一个`Bmob.User`是否已经认证过了，你可以调用`authenticated`方法，你不需要查看一个认证方法中返回的`Bmob.User`对象是否已经通过验证了。

### 其他对象的安全

和`Bmob.User`相同的安全模型也使用于其他对象。对于任何对象来说，你可以指定哪些用户会被允许读取对象，哪些用户被允许修改对象。为了支持这种安全机制，每一个对象都有一个允许访问列表 (ACL)，是被`Bmob.ACL`类所实现的。

使用一个`Bmob.ACL`最简单的方式是指定一个对象只能被一个单一的用户读或者写。为了创建这样的对象，首先必须有一个已经登录的`Bmob.User`。然后，新的`Bmob.ACL(user)`生成一个`Bmob.ACL`来限定`user`的访问。一个对象的ACL会在对象保存的时候被存储起来，就像其他的属性一样，这样，为了创建一个当前user私有的一个note：

```
var Note = Bmob.Object.extend("Note");
var privateNote = new Note();
privateNote.set("content", "This note is private!");
privateNote.setACL(new Bmob.ACL(Bmob.User.current()));
privateNote.save();
```

这个note只能由当前的用户所访问，但是可以在用户登录的任何设备上访问，只要是相同的用户就可以了。这项功能对于你如果想让用户再任何其他的设备上保存和访问数据十分有用，比如说一个私人的todo list应用。

权限也能在使用者的基础上授予，你可以通过`setReadAccess`和`setWriteAccess`方法独立的向`Bmob.ACL`中添加权限。比如，假设你有一条消息想要发送给一个组里的多个用户，他们中的每一个都有读和写的权限：

```
var Message = Bmob.Object.extend("Message");
var groupMessage = new Message();
var groupACL = new Bmob.ACL();

// userList is an array with the users we are sending this message to.
for (var i = 0; i < userList.length; i++) {
  groupACL.setReadAccess(userList[i], true);
  groupACL.setWriteAccess(userList[i], true);
}

groupMessage.setACL(groupACL);
groupMessage.save();
```

你同样可以对所有的用户授权，只要使用`setPublicReadAccess`和`setPublicWriteAccess`就可以了。这样允许了在一个消息板上发评论的模式，比如，我们要创建一个post只能被它的作者修改，但是可以被所有人读取：

```
var publicPost = new Post();
var postACL = new Bmob.ACL(Bmob.User.current());
postACL.setPublicReadAccess(true);
publicPost.setACL(postACL);
publicPost.save();
```

比如说删除一个对象，但是你没有写的权限这种操作是禁止的，这样会返回一个`Bmob.Error.OBJECT_NOT_FOUND`的错误码，为了安全起见，这样防止了客户端区分出到底有哪些对象被创建了但是无法读取还是根本不存在。

### 重设密码

在现实中只要你引入了密码系统，总会有用户会忘掉他们的密码。在这种情形下，我们的库提供一个让他们安全地重设密码的功能。

为了能让用户重设密码，应该要求用户提供他们的email地址，然后这样调用：

```
 Bmob.User.requestPasswordReset("test@126.com", {
  success: function() {
    // Password reset request was sent successfully
  },
  error: function(error) {
    // Show the error message somewhere
    console.log("Error: " + error.code + " " + error.message);
  }
});
```

这样会尝试匹配给定的email和用户的email或者username字段，然后会发送用户的密码重设邮件。由于我们是这样做的，所以你可以选择用户是否拿email作为他们的用户名，或者说用户把email作为用户的另一个信息保存。

密码重设的流程如下:

1. 用户输入email来请求重设他们的密码。
2. Bmob向用户的email地址发送邮件，包含了一个重设密码的链接。
3. 用户点击这个重设密码的链接，会重定向到一个Bmob页面来允许他们重设密码。
4. 用户输入新的密码，他们的密码现在会更新为输入的新密码。

### 查询

为了查询用户，你可以简单的创建一个`Bmob.Query`针对`Bmob.Users`：

```
var query = new Bmob.Query(Bmob.User);
query.equalTo(gender, "female");  // find all the women
query.find({
  success: function(women) {
    // Do stuff
  }
});
```

### 关联

关联一个`Bmob.User`的对象可以很快就见效，比如说，假设你有一个blog程序，为了保存一个用户的新post还有读取他们所有的post。

```
var user = Bmob.User.current();

// Make a new post
var Post = Bmob.Object.extend("Post");
var post = new Post();
post.set("title", "My New Post");
post.set("body", "This is some great content.");
post.set("user", user);
post.save(null, {
  success: function(post) {
    // Find all posts by the current user
    var query = new Bmob.Query(Post);
    query.equalTo("user", user);
    query.find({
      success: function(usersPosts) {
        // userPosts contains all of the posts by the current user.
      }
    });
  }
});
```

## ACL和角色

数据安全是软件系统中最重要的组成部分，为了更好的保护应用数据的安全，Bmob在软件架构层面提供了应用层次、表层次、ACL（Access Control List：访问控制列表）、角色管理（Role）四种不同粒度的权限控制的方式，确保用户数据的安全（详细请查看[Bmob数据与安全页面](http://doc.bmobapp.com/other/data_safety/)，了解Bmob如何保护数据安全）。

其中，最灵活的方法是通过ACL和角色，它的思路是每一条数据有一个用户和角色的列表，以及这些用户和角色拥有什么样的许可权限。

大多数应用程序需要对不同的数据进行灵活的访问和控制，这就可以使用Bmob提供的ACL模式来实现。例如：

- 对于私有数据，读写权限可以只局限于数据的所有者。
- 对于一个论坛，会员和版主有写的权限，一般的游客只有读的权限。
- 对于日志数据只有开发者才能够访问，ACL可以拒绝所有的访问权限。
- 属于一个被授权的用户或者开发者所创建的数据，可以有公共的读的权限，但是写入权限仅限于管理者角色。
- 一个用户发送给另外一个用户的消息，可以只给这些用户赋予读写的权限。

### ACL的格式

在Bmob中，ACL是按JSON对象格式（key-value）来表示的。这个JSON对象的key是objectId（用户表某个用户对应的objectId）或者是*(表示公共的访问权限)，ACL 的值是"读和写的权限"，这个JSON对象的key总是权限名，而这些key的值总是true。

如果您想让一个id为"Kc3M222k"的用户有读和写一条数据的权限，而且这个数据应该可以被全部人读取的话，这个ACL的表达方式如下：

```
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

在很多情况下，你需要定义一些用户具有某种相同的数据操作权限，而另外一群用户具有另外一种相同的数据操作权限，这时你就可以使用到Bmob的角色（对应Bmob在Web提供的Role表、SDK中的BmobRole类）功能，设置不同的用户组不同的操作权限。角色表有三个特殊字段：

`name` : 必须字段，表示角色名称,而且只允许被设置一次（命名必须由字母, 空格, 减号或者下划线构成）。

`users` :一个指向一系列用户的关系, 这些用户会继承角色的权限。

`roles` : 一个指向一系列子角色的关系, 这些子关系会继承父角色所有的权限。

### 创建角色

```
var roleACL = new Bmob.ACL();
roleACL.setPublicReadAccess(true);
var role = new Bmob.Role("test", roleACL);
role.save();
```

### 角色对象的安全性


`Bmob.Role`使用和其他Bmob对象一样的ACL权限策略, 除开它需要ACL被显式地设置以外。通常来说，只有用户有极大的权限（比如管理员）才应该被允许创建或者更改Role，所以你应该按这种标准来设定Role的ACL。请注意，如果你给了用户一个`Bmob.Role`一个写权限，这个用户有可能会在这个权限中加入另一个user，或者甚至直接把角色删除掉。

为了创建一个新的`Bmob.Role`，你应该如下写：
```
// By specifying no write privileges for the ACL, we can ensure the role cannot be altered.
var roleACL = new Bmob.ACL();
roleACL.setPublicReadAccess(true);
var role = new Bmob.Role("Administrator", roleACL);
role.save();
```

你可以通过增加"user"和"roles"关系的成员来在`Bmob.Role`中加入用户或者子角色：

```
var role = new Bmob.Role(roleName, roleACL);
for (var i = 0; i < usersToAddToRole.length; i++) {
  role.getUsers().add(usersToAddToRole[i]);
}
for (var i = 0; i < rolesToAddToRole.length; i++) {
  role.getRoles().add(rolesToAddToRole[i]);
}
role.save();
```

**请非常注意一点，注册角色的ACL的时候，它们只能被应该有权限修改它的人修改。**

### 其他对象的安全性

现在你应该已经创建了在你的程序中要使用的一系列的角色，你可以用ACL来定义他们的用户可以拥有的权限，每一个`Bmob.Object`都可以指定一个`Bmob.ACL`，这样提供了哪些用户或者角色应该有权限来读或者写这个对象。

将一个读或者写的权限授予一个角色是很直观的，你可以使用`Bmob.Role`：

```
var moderators = /* Query for some Bmob.Role */;
var wallPost = new Bmob.Object("WallPost");
var postACL = new Bmob.ACL();
postACL.setRoleWriteAccess(moderators, true);
wallPost.setACL(postACL);
wallPost.save();
```

你可以不需要查找这个Role，直接把名字提供给ACL：

```
var wallPost = new Bmob.Object("WallPost");
var postACL = new Bmob.ACL();
postACL.setRoleWriteAccess("Moderators", true);
wallPost.setACL(postACL);
wallPost.save();
```

### 角色继承

就像上面所描述的一样，一个角色可能包含其他的角色，表示两个角色之间的父-子关系，这样做的结果就是任何被授予一个角色的权限都会被隐式地授予这个角 色的所有子角色。

这样的关系很经常会在有用户管理内容的程序之中看到，比如论坛，有一个很少量的用户称为管理员，有最高的权限，比如程序设定、创建新的论坛、设定所有人能看到的内容等等。另一类有一部分类似于"版主" 的用户，这些人有责任保持用户创建的内容是合适的，任何一个"版主"有的权限"管理员"都应该有。为了启用这种关系，你应该使"管理员"成为"版主"的一个子角色。

```
var administrators = /* Your "Administrators" role */;
var moderators = /* Your "Moderators" role */;
moderators.getRoles().add(administrators);
moderators.save();
```

## 地理位置

### 创建地理位置对象

地理位置对象的创建需要用到`Bmob.GeoPoint`类，如创建一个地理位置在纬度40度，经度在-30度的点的示例代码如下：

```
var point = new Bmob.GeoPoint({latitude: 40.0, longitude: -30.0});
```

### 查询地理位置对象

现在你可以有一系列的对象可以做空间坐标查询了，如果能轻松地发现有哪些对象离一个点最近就好了。这样可以通过在`Bmob.Query`中加入一个`near`来做查询，为了获得离用户最近的10个地点列表，可以这样：

```
// location对应Web后台的一个字段名称
var userGeoPoint = userObject.get("location");
// 创建查询
var query = new Bmob.Query(PlaceObject);
// location附近的位置
query.near("location", userGeoPoint);
// 返回10个地点数据
query.limit(10);
// 查询
query.find({
  success: function(placesObjects) {
  }
});
```

在这时`placeObjects`会返回一个按离`userGeoPoint`的距离排序的列表，注意如果一个`ascending()/descending()`给了查询的话，会取代按距离排序这项特性。

为了按距离限制返回的结果，你可以使用`withinMiles`、`withinKilometers`和`withinRadians`。

同样，查询在特定地域的Object是可以的。为了找到用矩形表示的一块地域中的对象，加入`withinGeoBox`来在`Bmob.Query`中加入约束。

```
var southwestOfSF = new Bmob.GeoPoint(37.708813, -122.526398);
var northeastOfSF = new Bmob.GeoPoint(37.822802, -122.373962);

var query = new Bmob.Query(PizzaPlaceObject);
query.withinGeoBox("location", southwestOfSF, northeastOfSF);
query.find({
  success: function(pizzaPlacesInSF) {
    ...
  }
});
```


一个完整的示例效果如下

```
//当前用户位置，40.0改为微信获取到的位置
var point = new Bmob.GeoPoint({latitude: 40.0, longitude: -30.0});
query.withinKilometers("locationGeo", point, 3000);  //位置周围3000米的数据
```

## 小程序使用云逻辑
端逻辑调用使用Bmob.Cloud.run方法，如调用云函数中的"test"方法，并传递name参数到服务器中的示例代码如下：

```
Bmob.Cloud.run('test', {"name":"tom"}, {
  success: function(result) {
    console.log(result);
  },
  error: function(error) {
  }
})
```

如果不需要传递参数，示例代码如下：
```
Bmob.Cloud.run('test', {}, {
  success: function(result) {
    console.log(result);
  },
  error: function(error) {
  }
})
```
