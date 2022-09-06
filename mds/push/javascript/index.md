### 开发文档

向移动设备发送通知消息的示例代码如下：

```
//向订阅了public频道的设备推送通知
Bmob.Push.send({
  channels: [ "Public" ],
  data: {
     alert: "Public message"
  }
});
```

大家可以查看文档：[Bmob消息推送](http://docs.bmobapp.com/push/Restful/b_developdoc/doc/index.html "Bmob移动后端云服务平台") 获取更详细的信息。

