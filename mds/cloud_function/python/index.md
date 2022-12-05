# Python云函数

- 云函数是一段部署在服务端的代码片段，采用 java、python或node.js 进行编写，然后部署运行在Bmob服务器
- 通过云函数可以解决很多复杂的业务逻辑，从此无需将要将大量的数据发送到移动设备上做计算处理
- 只需将这些计算都交由服务端运算处理，最后移动客户端仅仅需要接收云函数运算处理返回的数据结果就可以了
- 通过更新云函数代码片段，客户端无需更新，便满足业务改动的需求。这样云函数便有更多的灵活性和自主性

## 调用方法

- 前提是需要在 [https://www.bmobapp.com](https://www.bmobapp.com) 注册账号、创建应用

Python云函数允许以以下方式调用：

- Http直接请求
- REST API接口
- Android SDK
- iOS SDK、
- 微信小程序
- 微信小游戏
- C# SDK
- 快应用
- PHP SDK
- JavaScript
- ...


调用方式|所需信息|优点
:----:|:----:|:----:
SDK|AppId|交互自带加密,接入快速
RestApi|AppId、RestKey|所有平台适用，通用性强
Http请求|Secret Key|所有平台适用，可用浏览器打开



### REST API API

1. 调用 `api.bmobapp.com` ，与调用Java、NodeJS版云函数的方式 **完全相同**。这种方式下，服务器会 **自动判断语言**，但 **限制 `Method` 为 `Post` 且 `Content-Type` 为 `application/json`**

2. 调用 `pycloud.bmobapp.com` ，调用方式基本相同，这种方式 **仅可调用Python云函数**，但 **不限制 `Method` 和 `Content-Type`**

```
# 使用Appid + RestKey请求自己备案域名域名(自动判断语言)
curl -X POST \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -H "Content-Type: application/json" \
    -d '{"name": "zwr"}' \
    https://自己备案域名/1/functions/[function name]

# 使用Appid + RestKey请求pycloud.bmobapp.com域名(仅支持Python云函数)
curl -X [method] \
    -H "X-Bmob-Application-Id: Your Application ID" \
    -H "X-Bmob-REST-API-Key: Your REST API Key" \
    -d '[body]' \
    https://pycloud.bmobapp.com/1/functions/[function name]

# 使用Master Key请求
curl -X [method] \
    -H "X-Bmob-Master-Key: Your Master Key" \
    -d '[body]' \
    https://pycloud.bmobapp.com/1/functions/[function name]
```

### Http请求

```
# 使用Secret Key请求
curl -X [method] \
    -H "header key: header value" \
    -d '[body]' \
    https://pycloud.bmobapp.com/[sectet key]/[function name]

# 或者直接用浏览器打开，即GET请求
https://pycloud.bmobapp.com/[sectet key]/[function name]?k1=v1&k2=v2
```

---

以下是Bmob各种SDK调用Python云函数的方法，与调用Java、NodeJS版云函数的方式 **完全相同**

### Android SDK

```
AsyncCustomEndpoints ace = new AsyncCustomEndpoints();
ace.callEndpoint(Context, String funcName, JSONObject params, new CloudCodeListener() {
    @Override
    public void done(Object object, BmobException e) {
        if (e == null)
            Log.e(TAG, "Succeed: " + object);
        else
            Log.e(TAG, "Failed: " + e);
    }
});
```

### 微信小程序

```
Bmob.Cloud.run('test', {'name': 'zwr'}).then(function (result) {
    console.log("Succeed: ");
    console.log(result);
}, function (error) {
    console.log("Failed: ");
    console.log(error);
});
```

### iOS SDK

```
[BmobCloud callFunctionInBackground:@"funcName" withParameters:nil block:^(id object, NSError *error) {
    if (error) {
      NSLog(@"Failed: %@",[error description]);
    }else{
        NSLog(@"Succeed: %@",object);
    }
}] ;
```


### C# SDK

```
IDictionary<String, Object> parameters ＝  new IDictionary<String, Object>{{"name","zwr"}};
Bmob.Endpoint<Hashtable>("test", parameters, (resp, exception) =>
{
    if (exception == null)
    {
        print("Succeed: " + resp);
    }
    else
    {
        print("Failed: " + exception.Message);
    }
});
```

### PHP SDK

```
$cloudCode = new BmobCloudCode('test'); //调用名字为test的云函数
$res = $cloudCode->get(array("name"=>"zwr")); //传入参数name，其值为zwr
```

### JavaScript

```
Bmob.Cloud.run('test', {"name":"tom"}, {
    success: function(result) {
        console.log("Succeed: ");
        console.log(result);
    },
    error: function(error) {
        console.log("Failed: ");
        console.log(error);
    }
});
```


## 工具

Github页面如下：

[https://github.com/bmob/CloudFunction/tree/master/python/](https://github.com/bmob/CloudFunction/tree/master/python/)

- `exec目录` 下提供了 `macos`、`linux`、`windows 64位`等平台的`可执行文件`，以供开发者快速进行代码的上传、修改、同步到本地和删除
- `samples目录` 提供了案例


## 代码规范

- python云函数必须遵循以下格式：

```
def onRequest(request, response, modules):
    # 上面这个方法声明，不允许任何修改
    # 这里使用Python编写云函数
```

- 代码不能包含以下关键字：(保存代码时有错误提醒)

```
import
exit
eval
...
```

- 如果在业务场景中需要用到被禁止使用的关键字，例如查询"import"表，可用"imp"+"ort"的形式拼接出来
- 如果除了内置模块(见下方)之外有需要使用的原生模块或著名模块，请提交工单申请开通
- 云函数执行完毕后，必须用response.send方法返回响应数据，否则会被当做超时，多次超时可能会被暂停使用


## 方法参数

### request对象

onRequest方法参数中 `request` 包含了本次请求的全部信息：

名称|类型|获取方法|示例
:----:|:----:|:----:|:----:
路径Path|str|request.getPath()|/xxxxxxxxxxxxxxxx/test1
方法Method|str|request.getMethod()|POST
请求头Headers|dict|request.getHeaders()|{"User-Agent":["Chorme"]}
请求体Body|str|request.getBody()|[98, 109, 111, 98]
Get参数|dict|request.getQueryParams()|{"page": "1"}
Body内参数|dict|request.getParams()|{"username": "zwr"}
单个请求头|str|request.getHeader(String key)|request.getHeader("User-Agent") = "Chrome"
单个Get参数|str|request.getQueryParam(String key)|request.getQueryParam("page") = "1"

### response对象

- onRequest方法参数中 `response` 用于响应请求，返回数据
- Response对象仅有名为 `send` 的方法

```
response.send(res = "", statusCode = 200, statusMsg = "OK", headers = None)
```

以下是参数说明：

名称|类型|意义
:----:|:----:|:----:
res|object|返回的内容
statusCode|int|返回的Http响应状态码，例如200、404
statusMsg|str|返回的Http响应状态，例如OK、NotFound
headers|dict|返回的头部信息，例如{"Content-Type": "text/plain; charset=UTF-8"}

- 示例

```
# 1. 直接返回字符串
response.send("Hello world--Bmob");
# 2. 返回404错误
response.send("Error", 404, "NotFound");
# 3. 返回中文字符串，需要返回包含charset的header
response.send(
    "你好，比目",
    200,
    "OK",
    {
        "Content-Type": "text/plain; charset=UTF-8"
    }
);
```

### modules对象

- onRequest方法参数中 `modules` 提供第三方模块供开发者调用：

模块名|获取方式|作用
:----:|:----:|:----:
Bmob数据库操作|modules.oData|封装了Bmob的大多数api，以供开发者进行快速的业务逻辑开发

#### Bmob数据操作

以下均为 `modules.oData` 的方法：


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
getDBTime()|获取REST API服务器的时间
batch(requests, isTransaction = None)|HttpResponse|批量请求

---


**查询方法** ：

```
modules.oData.find(
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

### 原生模块

#### json

- json.dumps
- json.loads
- ...

#### math

- math.log
- math.sin
- ...

#### base64

- base64.b64decode
- base64.b64encode
- ...

#### re

- re.findall
- re.split
- ...

#### time

- time.mktime
- time.strftime
- time.strptime
- ...

## 示例

案例主要放在了Github: **[BmobPython云函数案例](https://github.com/bmob/CloudFunction/tree/master/python/samples)**


##注意事项


- 如果你编写的Python云函数经常发生运行超时、上下行超流量、滥用内存等现象，官方将会自动封停你的云函数功能，修改后向客服申请方可继续使用

- 如果某接口调用频率较高，超过默认并发量，则会直接返回错误，解决方法：

```
1. 修改客户端代码，降低请求频率
2. 修改云函数，提高代码质量和效率，减少网络请求相关的超时时长，尽快结束工作
3. 联系客服单独配置机器，随你怎么折腾
```

- 如果需要接受更大的请求体，或返回更大的结果，请购买更高的配置
- 如果你不习惯在Web端编辑代码，使用 [同步工具](https://github.com/bmob/CloudFunction/tree/master/python/exec) 是一个不错的选择
-