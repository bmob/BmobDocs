# Python客户端SDK

*该SDK从 [Python云函数](https://github.com/bmob/CloudFunction/tree/master/python) 中剥离出来，用于客户端*

*如果部分接口描述不完整，可参考云函数api文档，两者保持高度一致*

## 接入

1. 将 [Python SDK文件](https://github.com/bmob/CloudFunction/tree/master/python/sdk/bmob.py) 下载并添加到项目中
2. 在需要调用bmob的地方，调用 `import bmob` 或 `from bmob import *`
3. 初始化 `Bmob` 对象，如 `b = Bmob("appid", "restkey")`

## 接口

以下均为 `Bmob` 对象的方法：


方法体|返回值|描述
:----:|:----:|:----:
setUserSession(session)|self|设置用户的Session Token
setMasterKey(masterKey)|self|设置应用的Master Key
insert(className, data)|HttpResponse|往数据表中添加一行
remove(className, objectId)|HttpResponse|删除数据表中的一行
update(className, objectId, data)|HttpResponse|更新数据表中的一行
find|HttpResponse|使用查询器查询数据，详细参数见下方
findOne(className, objectId)|HttpResponse|查询数据表中的一行
userSignUp(userData)|HttpResponse|用户注册
userLogin(username, password)|HttpResponse|用户通过账号、密码登陆
userLoginBySMS(mobile, smsCode, userInfo)|HttpResponse|用户通过短信验证码一键注册或登录
userResetPasswordByEmail(email)|HttpResponse|用户请求Email重置密码
userResetPasswordBySMS(smsCode, password)|HttpResponse|用户通过短信验证码重置密码
userResetPasswordByPWD(userId,session,oldPassword,newPassword)|HttpResponse|用户通过旧密码修改新密码
sendCustomSMS(mobile, content)|HttpResponse|发送自定义短信
sendSMSCode(mobile, template)|HttpResponse|发送某模版的短信验证码
verifySMSCode(mobile, smsCode)|HttpResponse|验证短信验证码
payQuery(orderId)|HttpResponse|查询支付订单
cloudCode(funcName, body = None)|HttpResponse|调用云函数
getDBTime()|获取Restful服务器的时间
batch(requests, isTransaction = None)|HttpResponse|批量请求

---


**查询方法** ：

```
b = Bmob("appid", "restkey")
b.find(
	table,
	where = None, # 设置查询条件, dict或BmobQuerier
	limit = None, # 设置最大返回行数，int
	skip = None, # 设置跳过的个数，int
	order = None, # 排序规则，str
	include = None, # 需要返回详细信息的Pointer属性，str
	keys = None, # 需要返回的属性，str
	count = None, # 统计接口: 返回数量，int
	groupby = None, # 统计接口: 根据某列分组，str
	groupcount = None, # 统计接口: 分组后组内统计数量，bool
	min = None, # 统计接口: 获取最小值，str
	max = None, # 统计接口: 获取最大值，str
	sum = None, # 统计接口: 计算总数，str
	average = None, # 统计接口: 计算平均数，str
	having = None, # 统计接口: 分组中的过滤条件，str
	objectId = None # 查询单条数据，str
)
```


## 内置类

### HttpResponse

**类变量**:

变量名|类型|描述
:----:|:----:|:----:
code|int|状态码
status|str|状态信息
headers|dict|返回的头部
stringData|str|返回的数据
jsonData|dict|返回的json数据
queryResults|dict|返回的bmob查询数据
statCount|int|返回的bmob统计数据
err|String|错误信息

**类方法**

方法名|返回类型|描述
:----:|:----:|:----:
updatedAt|str或None|bmob操作更新后的返回值
createdAt|str或None|bmob操作新增后的返回值
objectId|str或None|bmob操作新增后的返回值
msg|str或None|bmob操作删除、验证短信后的返回值

### BmobQuerier

**类方法**: **返回类型均为 `BmobQuerier`** (以链式调用)

方法体|描述
:----:|:----:
addWhereExists(key)|某字段有值
addWhereNotExists(key)|某字段无值
addWhereEqualTo(key, value)|某字段等于
addWhereNotEqualTo(key, value)|某字段不等于
addWhereGreaterThan(key, value)|某字段大于
addWhereGreaterThanOrEqualTo(key, value)|某字段大于等于
addWhereLessThan(key, value)|某字段小于
addWhereLessThanOrEqualTo(key, value)|某字段小于等于
addWhereRelatedTo(table,toObjId,toKey)|在某表作为Relation关联起来的数据
addWhereNear(key,bmobGeoPoint,maxMiles,maxKM,maxRadians)|地理位置在一定范围内
addWhereWithinGeoBox(key,southwest,northeast)|地理位置在矩形范围内
addWhereContainedIn(key,objs)|值在列表内
addWhereNotContainedIn(key,objs)|值不在列表内
addWhereContainsAll(key,objs)|列表包含全部项
addWhereStrContains(key,regex)|String类型模糊查询
addWhereMatchesSelect(key,innerQuery,innerKey,innerTable,isMatch)|某项符合子查询
addWhereInQuery(key,value,className,isIn)|某项包含在子查询


### BmobUpdater

该类的全部静态方法都用于设置insert、update方法的请求内容，**返回类型均为 `dict`**

**静态方法**：

方法体|描述
:----:|:----:
add(key,value,data=None)|往data添加一个键值
increment(key,number,data)|原子计数
arrayAdd(key,value,data)|往Array类型添加项
arrayAddUnique(key,value,data)|往Array类型不重复地添加项
arrayRemove(key,value,data)|删除Array类型的多项
addRelations(key,value,data)|添加多个Relation关系
removeRelations(key,value,data)|移除多个Relation关系


### BmobPointer

构造方法：

```
BmobPointer(className, objectId)
```

### BmobFile

构造方法：

```
BmobFile(url, filename="")
```

### BmobDate

构造方法：

```
BmobDate(timeStamp) # 毫秒
BmobDate(dateStr)
```

### BmobGeoPoint

构造方法：

```
BmobGeoPoint(longitude, latitude)
```

## Tips

- 需要修改请求协议/域名，直接搜索 `self.domain` 修改即可
- 需要输出log，可以修改 `httpRequest` 方法
- 需要兼容python其它版本，或改用其它http库，修改 `httpRequest` 方法
- SDK只有短短300多行，基本上是对 [Restful API](http://doc.bmobapp.com/data/restful/develop_doc/) 的封装，如果需要添加接口，参照该文档即可
- [Python云函数](https://github.com/bmob/CloudFunction/tree/master/python) 运行于云端，可用于编写更安全、更灵活的服务端逻辑


## Demo

可参考 [PythonSDK](https://github.com/bmob/CloudFunction/tree/master/python/sdk/) 文件夹下的其它文件

