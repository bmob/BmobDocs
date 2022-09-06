### 开发 文档

云函数的调用方法非常简单，如下为调用执行云端方法`test`的实现代码：

```C#
Bmob.Endpoint<Hashtable>("test", (resp, exception) =>
{
	if (exception != null)
	{
		print("调用失败, 失败原因为： " + exception.Message);
		return;
	}

	print("返回对象为： " + resp);
});
```

调用时传递参数：

```C#
IDictionary<String, Object> parameters ＝  new IDictionary<String, Object>{{"name","jay"}};

Bmob.Endpoint<Hashtable>("test", parameters, (resp, exception) =>
    {
        if (exception != null)
        {
            print("调用失败, 失败原因为： " + exception.Message);
            return;
        }

        print("返回对象为： " + resp);
    });
```

相关云函数的编写方式，请参考[云函数开发文档](http://doc.bmobapp.com/cloud_function/web/develop_doc/)。

