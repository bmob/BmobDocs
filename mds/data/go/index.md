## 准备工作

### SDK下载

go get github.com/bmob/bmob-go-sdk


## 运行效果

打开项目中的`examples/main.go`文件，可以看到如何使用Go SDK相关的方法。

```
package main

import (
	"log"

	"github.com/bmob/bmob-go-sdk"
)

var (
	appConfig = bmob.RestConfig{"",
		""}
)

type TestData struct {
	Score string
	//data  DataType
}

type MyRes struct {
	bmob.RestResponse
	bmob.ImageResponse
}

type TestDataRes struct {
	TestData
	MyRes
}

func main() {
	a := bmob.RestResponse{}
	log.Println(a)
	log.Println("****************************************")
	var respDst = TestDataRes{}

	header, err := bmob.DoRestReq(appConfig,
		bmob.RestRequest{
			bmob.BaseReq{
				"GET",
				bmob.ApiRestURL("GameScore") + "/",
				""},
			"application/json",
			nil},
		&respDst)
	if err == nil {
		log.Println(header)
		log.Println(respDst)
	} else {
		log.Panic(err)
	}

	log.Println("****************************************")
}
```

## 类库说明

* RestConfig - Bmob配置类，使用的时候需要修改里面的配置信息

* 数据类型 - 封装了Bmob预定义的数据类型，用户可在此基础上进行定制，在users.go等文件里定义

* DoRestRequest - Bmob基础方法，用于完成REST API请求

## Bmob官方信息

官方网址：[http://www.bmobapp.com](http://www.bmobapp.com)

问答社区：[http://wenda.bmobapp.com](http://wenda.bmobapp.com)

技术邮箱：support@bmobapp.com


