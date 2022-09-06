## 简介

Bmob平台为您的移动应用提供了一个完整的后端解决方案，我们提供轻量级的SDK开发包，让开发者以最小的配置和最简单的方式使用Bmob平台提供的服务，进而完全消除开发者编写服务器代码以及维护服务器的操作。
Go SDK封装了Bmob REST API API，但并不包含功能封装，如果需要调用具体的功能，请参考官方REST API API开发文档[http://docs.bmobapp.com/data/Restful/b_developdoc/doc/index.html](http://docs.bmobapp.com/data/Restful/b_developdoc/doc/index.html)

## 快速入门

建议您在阅读本开发文档之前，先阅读我们提供的 [go快速入门文档](https://github.com/bmob/bmob-go-sdk/tree/master/doc_quickstart)，便于您后续的开发。


## 应用程序
在Bmob平台注册后，每个账户可创建多个应用程序，创建的每个应用程序有各自的Application ID，应用程序将凭其Application ID使用Bmob SDK。

## 应用安全

请大家在使用Bmob开发应用程序之前，仔细阅读“数据与安全”的文档：[http://docs.bmobapp.com/other/Other/m_bql/doc/index.html](http://docs.bmobapp.com/other/Other/m_bql/doc/index.html)

## 数据类型
除了JSON标准里定义的数据类型外，还支持Bmob自定义的数据类型：[http://docs.bmobapp.com/data/Restful/b_developdoc/doc/index.html#对象](http://docs.bmobapp.com/data/Restful/b_developdoc/doc/index.html#对象)
这些类型操作相关的基本数据结构在types.go中定义，由于JSON是schema-less的，你可以只填充必要的字段来完成操作

## REST API请求
一次典型的REST API请求如下：
```
  header, err := bmob.DoRestReq(appConfig,
    bmob.RestRequest{
      bmob.BaseReq{
        "GET",
        bmob.ApiRestURL("GameScore") + "/",
        ""},
      "application/json",
      nil},
    &respDst}
  if err == nil {
    log.Println(header}
    log.Println(respDst}
  } else {
    log.Panic(err}
  }
```
参数：
* appConfig - 保存了APP相关的key等信息
* RestRequest - 使用Bmob REST API API 所需的信息： {方法， url， sessionToken}， 数据类型， body
* respDst - 用于保存解析后的response
返回值：
* header - http.Header， 请求返回的标准HTTP头
* err - 错误信息

```
curl -X GET \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -G \
    --data-urlencode 'where={"createdAt":{"$gte":{"__type":"Date","iso":"2011-08-21 18:02:52"}}}' \
    https://api2.bmobapp.com/1/classes/GameScore
```

再一次请求中，你需要指定的HTTP方法，URL，sessionToken等均可以在BaseReq中指定，
APP验证需要的KEY等在RestConfig中指定
数据段则在转成[]byte类型后传入
上传不同类型的格式时，需要指定编码格式，默认为text/plain，


## 数据对象

Bmob请求格式化数据时，body为JSON格式，用户可以自定义需要的字段，但是由于返回的数据会附加Bmob预定义的字段，所以需要单独处理。 SDK中采取的写法如下：
```
type TestDataType struct {
  Score string
  data  DataType
}

type TestDataRes struct {
  TestData
  bmob.RestResponse
}
```
通过继承自定义的Response结构体，我们可以同时解析返回的数据里的用户定义数据和系统定义数据。

RestResponse包含了解析最常用的请求响应所需的字段，如果需要其他解析其他请求的响应，可以继承SDK中提供的相应的结构体，如ImageResponse

```
type MyRes struct {
  bmob.RestResponse
  bmob.ImageResponse
}
```
这个结构体可以解析标准的REST API响应和Image请求相关的响应

