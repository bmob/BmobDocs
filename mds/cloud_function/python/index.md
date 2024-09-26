### 开发文档

云函数调用使用 `Bmob` 类的 `functions` 方法，如调用云函数中的 `good` 方法，并传递 `name` 参数到服务器中的示例代码如下：

```python
rs = b.functions('good',body={'name':'Bmob'})
print(rs)
```

如果不需要传递参数，示例代码如下：

```python
rs = b.functions('good',body={})
print(rs)
```

