### 开发文档

云函数调用使用`Bmob.Cloud.run`方法，如调用云函数中的"test"方法，并传递name参数到服务器中的示例代码如下：

```
Bmob.Cloud.run('test', {"name":"tom"}, {
  success: function(result) {
    alert(result);
  },
  error: function(error) {
  }
})
```

如果不需要传递参数，示例代码如下：

```
Bmob.Cloud.run('test', {}, {
  success: function(result) {
    alert(result);
  },
  error: function(error) {
  }
})
```

