## 云函数

相关云函数的编写方式，请参考[云函数开发文档](http://doc.bmobapp.com/cloud_function/web/develop_doc/)

## 运行云函数

在REST API中可以调用云函数。例如，想调用云函数的方法getMsgCode:

```
$cloudCode = new BmobCloudCode('getMsgCode'); //调用名字为getMsgCode的云函数
$res = $cloudCode->get(array("name"=>"bmob")); //传入参数name，其值为bmob
```

