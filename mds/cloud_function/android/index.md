### 开发文档
云函数的API集成在BmobSDK中，因此不熟悉的朋友在使用前先可以了解一下BmobSDK的集成[Android 快速入门](http://doc.bmobapp.com/data/android/)

很多时候，单纯的前端代码是不能完成全部事情的，一些重要和复杂的业务逻辑还是希望能够在服务端中执行。比如：对比较大量的比赛数据进行排序，对某个网站进行资料采集和处理，获取用户的IP信息，等等。Bmob不仅提供了云端存储，还开放了云端的业务逻辑代码功能，也就是云函数。

相关云函数的使用，大家可以参考[云函数开发文档](http://doc.bmobapp.com/cloud_function/web/develop_doc/)

云函数的执行有多种方法：

- 定时任务（直接在Web管理后台中设定）；
- RestApi调用（参考[云函数REST API开发文档](http://doc.bmobapp.com/cloud_function/restful/)）；
- SDK调用。

其中，在SDK中调用云函数的方法如下：
```java
AsyncCustomEndpoints ace = new AsyncCustomEndpoints();
//第一个参数是上下文对象，第二个参数是云函数的方法名称，第三个参数是上传到云函数的参数列表（JSONObject cloudCodeParams），第四个参数是回调类
ace.callEndpoint(cloudCodeName, params, new CloudCodeListener() {
	@Override
    public void done(Object object, BmobException e) {
        if (e == null) {
            String result = object.toString();
            } else {
            Log.e(TAG, " " + e.getMessage());
            }
         }
});
```

