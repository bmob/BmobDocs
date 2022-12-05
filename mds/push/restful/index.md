## 消息推送简介

推送通知是让用户及时被通知、和你的应用保持联系的一种非常棒的方式，你可以快速而有效地通知到所有的用户，下面这个教程将会教你如何使用Bmob来推送消息。

## 安装消息推送服务

每一个Bmob的App被安装在用户的设备上后，如果要使用消息推送功能，Bmob SDK会自动生成一个Installation对象。Installation对象包含了推送所需要的所有信息。举例：一个棒球的App，你可以让用户订阅感兴趣的棒球队，然后及时将这个球队的消息推送给用户 。
你可以使用 REST API，通过请求URL **/1/installations** 对Installation对象进行一系列操作，就像你存储和获取其他的普通对象，如GameScore对象一样。
注意Installation对象一般只在Client SDK中进行修改，但REST API对于大量导入或导出订阅数据的Installation对象是极其有用的。

Installation对象有几个系统默认的特殊字段来帮助你进行定位到设备等管理：
- **badge** : iOS应用中右上角的图标标识，这不会在服务端进行自增，需要开发者自己实现自增统计
- **channels** : 当前这个设备订阅的渠道名称数组
- **timeZone** : 设备所在位置的时区， 如Asia/Shanghai，这个会在每个Installation对象更新时同步（只读）
- **deviceType** : 设备的类型, 值为："ios" 或 "android" (只读)
- **installationId** : Bmob使用的设备唯一号，Android设备是必须的，iOS可选 (只读)
- **deviceToken** : iOS设备由Apple APNS生成的唯一性token标识 (只读)
- **notificationUri** : Windows Phone设备由Windows Push Center生成的唯一性token标识


## 保存 installation

根据设备的不同往设备表中添加不同的值，body格式如下

```
{
  "deviceType": deviceType ("iOS","android", "windows phone")
  "deviceToken": iOS需填
  "installationId":android需填
  "notificationUri":wp需填
}
```

下面将针对具体平台分别举例。

### 保存iOS设备的deviceToken

iOS设备通常使用deviceToken来对一台设备进行惟一标识。

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "deviceType": "ios",
        "deviceToken": "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
      }' \
  https://自己备案域名/1/installations
```

### 保存Android设备的 installationId

对于Android设备，[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台")SDK会自动生成uuid作为installationId保存到 Bmob。 你可以使用以下REST API保存Android设备的installation ID。

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "deviceType": "android",
        "installationId": "12345678-4312-1234-1234-1234567890ab"
      }' \
  https://自己备案域名/1/installations
```

### 保存Windows Phone设备的 notificationUri

对于Windows Phone设备，[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台")SDK会自动从Windows Push Center获取到notificationUri并保存到 Bmob。 你可以使用以下REST API保存Windows Phone设备的notificationUri。

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "deviceType": "windows phone",
        "notificationUri": "https://hk1.notify.live.net/unthrottledthirdparty/01.00/AQHgHh6EuwNtTa1TbwvaAjnmAgAAAAADEAAAAAQUZm52OkZDM0U5RDkxQzIzREJBNDYFBkFTRUEwMQ"
      }' \
  https://自己备案域名/1/installations
```

## 订阅频道和退订

频道列的本质是一个数组，因此其操作与数组一致，具体可查看以下举例。

### 订阅频道

覆盖已订阅的频道：

```
curl -X PUT \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "channels": [
          "Giants",
          "Mets"
        ]
      }' \
  https://自己备案域名/1/installations/mrmBZvsErB
```

订阅一个新频道，不覆盖已订阅的频道：

```
curl -X PUT \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{"channels":{"__op":"AddUnique","objects":["Giants"]}}' \
  https://自己备案域名/1/installations/mrmBZvsErB
```

### 退订频道

```
curl -X PUT \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{"channels":{"__op":"Remove","objects":["Giants"，"Mets"]}}' \
  https://自己备案域名/1/installations/mrmBZvsErB
```

## 推送消息

**请求描述**

使用推送接口可将消息推送至对应设备。

**请求**

- url ： https://自己备案域名/1/push

- method ：POST

- header:

```
X-Bmob-Application-Id: Your Application ID
X-Bmob-REST-API-Key: Your REST API Key
Content-Type: application/json
```

- body: 根据不同的需求进行定制，具体看以下介绍。


### 广播推送消息

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "data": {
          "alert": "Hello From Bmob."
        }
      }' \
  https://自己备案域名/1/push
```

### 组播推送消息
发送给订阅了Giants频道的用户

```
 curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "where":{
          "channels":["Giants"]
        },
        "data": {
          "alert": "Hello From Bmob."
        }
      }' \
  https://自己备案域名/1/push
```

 或者更简便的方式

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "channels":["Giants"],
        "data": {
          "alert": "Hello From Bmob."
        }
      }' \
  https://自己备案域名/1/push
```

### 多播推送消息

#### 推送给不活跃的用户

```
  curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "where":{
            "updatedAt":{
                "$lt":{"__type":"Date","iso":"2012-01-29 11:33:53"}
              }
        },
        "data": {
            "alert": "Hello From Bmob."
        }
      }' \
  https://自己备案域名/1/push
```

#### 根据查询条件做推送

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "where": {
          "scores": true
        },
        "data": {
          "alert": "Willie Hayes injured by own pop fly."
        }
      }' \
  https://自己备案域名/1/push
```

请注意，where 条件查询的都是 installations 表。这里是假设 installations 表存储了 scores 的布尔属性，你可以像查询普通对象一样构造where查询

#### 根据平台做推送

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID" \
  -H "X-Bmob-REST-API-Key: Your REST API Key" \
  -H "Content-Type: application/json" \
  -d '{
        "where": {
          "deviceType": "android"
        },
        "data": {
          "alert": "Your suitcase has been filled with tiny robots!"
        }
      }' \
  https://自己备案域名/1/push
```

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID" \
  -H "X-Bmob-REST-API-Key: Your REST API Key" \
  -H "Content-Type: application/json" \
  -d '{
        "where": {
          "deviceType": "ios"
        },
        "data": {
          "alert": "Your suitcase has been filled with tiny apples!"
        }
      }' \
  https://自己备案域名/1/push
```

Windows Phone平台的推送分三种格式：

a.推送Raw通知(**默认**)：

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID" \
  -H "X-Bmob-REST-API-Key: Your REST API Key" \
  -H "Content-Type: application/json" \
  -d '{
        "where": {
          "deviceType": "windows phone"
        },
        "data": {
           "alert": "Your suitcase has been filled with tiny windows phone!",
           "wpAlert": "TextBoxValue2"
        }
      }' \
  https://自己备案域名/1/push
```

b.推送Toast通知：

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID" \
  -H "X-Bmob-REST-API-Key: Your REST API Key" \
  -H "Content-Type: application/json" \
  -d '{
        "where": {
          "deviceType": "windows phone"
        },
        "data": {
          "alert": "Your suitcase has been filled with tiny apples!",
          "wpAlert": "TextBoxSubTitle",
          "wp": 2
        }
      }' \
  https://自己备案域名/1/push
```

c.推送磁贴通知：

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID" \
  -H "X-Bmob-REST-API-Key: Your REST API Key" \
  -H "Content-Type: application/json" \
  -d '{
        "where": {
          "deviceType": "windows phone"
        },
        "data": {
          "alert": "Your suitcase has been filled with tiny apples!",
          "backgroundImage": "backgroundImage",
          "count":"1",
          "backBackgroundImage": "backBackgroundImage",
          "backTitle":"backTitle",
          "backContent":"backContent",
          "wp": 1
        }
      }' \
  https://自己备案域名/1/push
```

#### 根据地理信息位置做推送

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "where": {
          "user": {
            "$inQuery": {
              "location": {
                "$nearSphere": {
                  "__type": "GeoPoint",
                  "latitude": 30.0,
                  "longitude": -20.0
                },
                "$maxDistanceInMiles": 1.0
              }
            }
          }
        },
        "data": {
          "alert": "Free hotdogs at the bmob concession stand!"
        }
      }' \
  https://自己备案域名/1/push
```

上面的例子假设 installation 有个 user 属性指向_User 表的记录，并且用户有个 location 属性是 GeoPoint 类型，我们就可以根据地理信息位置做推送。

### 点播推送消息

发送给Android单个客户端

```
  curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "where":{
            "installationId":"57234d4c-752f-4e78-81ad-a6d14048020d"
        },
        "data": {
          "alert": "Hello From Bmob."
        }
      }' \
  https://自己备案域名/1/push
```

发送给iOS单个客户端

```
  curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "where":{
            "deviceToken":"abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
         },
        "data": {
          "aps":{"alert":"cashi","badge":1,"sound":"default"}
        }
      }' \
  https://自己备案域名/1/push
```

发送给Windows Phone单个客户端Toast通知

```
  curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "where":{
            "notificationUri":"https://hk1.notify.live.net/unthrottledthirdparty/01.00/AQHgHh6EuwNtTa1TbwvaAjnmAgAAAAADEAAAAAQUZm52OkZDM0U5RDkxQzIzREJBNDYFBkFTRUEwMQ"
         },
        "data": {
          "alert": "Hello From bmob",
          "wpAlert": "bmob",
          "wp": 2
        }
      }' \
  https://自己备案域名/1/push
```

## 发送选项设置

推送通知不仅仅可以用来发送消息，iOS中，推送内容还可以包含要播放的声音和要显示的badge数字值,还可以定制任何你想发送的内容，对于Android，你甚至可以指定Intent应用于接收消息，对于时效有要求的消息你还可以设置一个消息过期时间。

### 定制你的通知

如果你想发送更多的消息，你可以在data的字典对象中设置其他字段，下面这些保留的字段有其特殊的意义：
- **alert** : 通知的消息内容
- **badge** : (仅iOS)一个数字值将会高亮显示在应用图标的右上角。
- **sound** : (仅iOS)应用绑定包中的声音
- **content-available** : (仅iOS)如果你的应用是新闻类的，或者你的应用正在使用iOS7的Remote Notification Background Mode，设定这个值为1将会触发离线下载功能。
- **action** : (仅Android)接收到推送消息时应用Intent，如果没有指定title或alert，Intent将被应用，但是没有通知呈现给用户。
- **title** : (仅Android)这个值将显示在系统通知栏
- **wp** : (仅Windows Phone)通知类型 0-Raw(默认) 1-Toast 2-磁贴
- **wpAlert** : (仅Windows Phone)这个值将在Raw 和 Toast两种通知中有用，相对alert，作为子标题
- **backgroundImage** : (仅Windows Phone)通知类型wp=2，磁贴类通知中有用
- **count** : (仅Windows Phone)通知类型wp=2，磁贴类通知中有用
- **backBackgroundImage** : (仅Windows Phone)通知类型wp=2，磁贴类通知中有用
- **backTitle** : (仅Windows Phone)通知类型wp=2，磁贴类通知中有用
- **backContent** : (仅Windows Phone)通知类型wp=2，磁贴类通知中有用

例如，推送一条通知，将当前的badge值设置为一个数字值,并且播放iOS设备上定制的音乐，对于Android用户，将在系统通知栏中显示特殊的标题，其请求如下：

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID" \
  -H "X-Bmob-REST-API-Key: Your REST API Key" \
  -H "Content-Type: application/json" \
  -d '{
        "channels": [
          "Mets"
        ],
        "data": {
          "alert": "The Mets scored! The game is now tied 1-1.",
          "badge": 10,
          "sound": "cheering.caf",
          "title": "Mets Score!"
        }
      }' \
  https://自己备案域名/1/push
```

当然，你也可以在data字典对象中定制自己的字段来推送消息，但推送到消息不显示在 Andoid 系统的通知栏中，而是执行应用程序预定义的逻辑，Android或iOS的接收消息文档中对此有说明，iOS只有当用户从通知中打开应用，才能访问data的数据，Android将提供这个数据在action Intent应用之后将提供这个数据,

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID" \
  -H "X-Bmob-REST-API-Key: Your REST API Key" \
  -H "Content-Type: application/json" \
  -d '{
        "channels": [
          "Indians"
        ],
        "data": {
          "action": "com.example.UPDATE_STATUS",
          "alert": "Ricky Vaughn was injured in last night's game!",
          "name": "Vaughn",
          "newsItem": "Man bites dog"
        }
      }' \
  https://自己备案域名/1/push
```

### 设置消息过期时间

过期时间，可以是绝对时间：

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "expiration_time": "2013-12-04 00:51:13",
        "data": {
          "alert": "Season tickets on sale until December  4, 2013"
        }
      }' \
  https://自己备案域名/1/push
```

也可以是相对时间（根据push_time做定期推送，从push_time时间开始算起，直到expiration_interval时间后过期），下面的请求表示消息将在2012-01-28 00:51:13这个时间点开始推送，直到7天后过期:

```
curl -X POST \
  -H "X-Bmob-Application-Id: Your Application ID"          \
  -H "X-Bmob-REST-API-Key: Your REST API Key"        \
  -H "Content-Type: application/json" \
  -d '{
        "push_time": "2012-01-28 00:51:13",
        "expiration_interval": 518400,
        "data": {
          "alert": "Season tickets on sale until December  4, 2013"
        }
      }' \
  https://自己备案域名/1/push
```


