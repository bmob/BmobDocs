# Java云函数

- 云函数是一段部署在服务端的代码片段，采用 java 或 node.js 进行编写，然后部署运行在Bmob服务器
- 通过云函数可以解决很多复杂的业务逻辑，从此无需将要将大量的数据发送到移动设备上做计算处理
- 只需将这些计算都交由服务端运算处理，最后移动客户端仅仅需要接收云函数运算处理返回的数据结果就可以了
- 通过更新云函数代码片段，客户端无需更新，便满足业务改动的需求。这样云函数便有更多的灵活性和自主性

## 调用方法

云函数提供了以下几种方式提供调用：

调用方式|所需信息|优点
:----:|:----:|:----:
SDK|AppId|交互自带加密,接入快速
RestApi|AppId、RestKey|所有平台适用，通用性强
Http请求|Secret Key|所有平台适用，可用浏览器打开


### Restful API

1. 调用 `api.bmobapp.com` ，与调用NodeJS版云函数的方式 **完全相同**。这种方式下，服务器会 **自动判断语言**，但 **限制 `Method` 为 `Post` 且 `Content-Type` 为 `application/json`**

2. 调用 `javacloud.bmobapp.com` ，调用方式基本相同，这种方式 **仅可调用Java云函数**，但 **不限制 `Method` 和 `Content-Type`**

		// 使用Appid + RestKey请求api.bmobapp.com域名(自动判断语言)
		curl -X POST \
			-H "X-Bmob-Application-Id: Your Application ID" \
			-H "X-Bmob-REST-API-Key: Your REST API Key" \
			-H "Content-Type: application/json" \
			-d '{"name": "zwr"}' \
			https://api.bmobapp.com/1/functions/[function name]

		// 使用Appid + RestKey请求javacloud.bmobapp.com域名(仅支持Java云函数)
		curl -X [method] \
		    -H "X-Bmob-Application-Id: Your Application ID" \
		    -H "X-Bmob-REST-API-Key: Your REST API Key" \
		    -d '[body]' \
		    https://javacloud.bmobapp.com/1/functions/[function name]

		// 使用Master Key请求
		curl -X [method] \
		    -H "X-Bmob-Master-Key: Your Master Key" \
		    -d '[body]' \
		    https://javacloud.bmobapp.com/1/functions/[function name]

### Http请求

		// 使用Secret Key请求
		curl -X [method] \
		    -H "header key: header value" \
		    -d '[body]' \
		    https://javacloud.bmobapp.com/[secret key]/[function name]

		// 或者直接用浏览器打开，即GET请求
	    https://javacloud.bmobapp.com/[secret key]/[function name]?k1=v1&k2=v2

	    // 当直接进入 https://javacloud.bmobapp.com/[secret key] 时，会触发 index 方法
	    // 当 function name 不存在是，会触发 notfound 方法


---

以下是Bmob各种SDK调用Java云函数的方法，与调用NodeJS版云函数的方式 **完全相同**

### Android SDK

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

### 微信小程序

		Bmob.Cloud.run('test', {'name': 'zwr'}).then(function (result) {
			console.log("Succeed: ");
			console.log(result);
		}, function (error) {
			console.log("Failed: ");
			console.log(error);
		});

### iOS SDK

		[BmobCloud callFunctionInBackground:@"funcName" withParameters:nil block:^(id object, NSError *error) {
			if (error) {
			  NSLog(@"Failed: %@",[error description]);
			}else{
				NSLog(@"Succeed: %@",object);
			}
		}] ;


### C# SDK

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

### PHP SDK

		$cloudCode = new BmobCloudCode('test'); //调用名字为test的云函数
		$res = $cloudCode->get(array("name"=>"zwr")); //传入参数name，其值为zwr

### JavaScript

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

## 日志

- 可在Bmob后台根据时间、日志级别、内容关键字、方法名搜索想要的日志
- 每个应用拥有最大10m的日志空间，循环写入
- 高级用户有实时日志功能


## 代码规范

- java云函数必须遵循以下格式：

		public static void onRequest(final Request request, final Response response, final Modules modules) throws Throwable {
		// 上面这个方法体，不允许任何修改
		// 这里使用Java编写云函数
		// 最后一个字符必须是 }
		}

- 代码不能包含以下关键字：(保存代码时有错误提醒)

   Class
   	File
   	System
   	...

- 需要获取当前毫秒时，可用 `getTime()` 、`new java.util.Date().getTime()` 替代 `System.currentTimeMillis()`
- 如果确实需要用到被禁止使用的关键字，例如查询"File"表，可用"F"+"ile"的形式拼接
- 不可包含`/**/`注释，如需注释，请用 `//`
- 仅可写一个Java的方法，不能写多个方法、类变量、静态变量等
- 云函数执行完毕后，必须用response.send方法返回响应数据，否则会被当做超时，多次超时可能会被暂停使用

## 工具

Github页面如下：

[https://github.com/bmob/BmobJavaCloud](https://github.com/bmob/BmobJavaCloud)

- `libs目录` 下提供了 `Bmob-JavaCloud-Apis_xxx.jar` 以供开发者使用IDE(ecplise、as)开发时参考
- `exec目录` 下提供了 `macos`、`linux`、`windows 64位`等平台的`可执行文件`，以供开发者快速进行代码的上传、修改、同步到本地和删除
- `samples目录` 提供了案例
- `doc目录` 下提供了文档

## 方法参数

### Request对象

onRequest方法参数中 `Request request` 包含了本次请求的全部信息：

名称|类型|获取方法|示例
:----:|:----:|:----:|:----:
路径Path|String|request.getPath()|/xxxxxxxxxxxxxxxx/test1
方法Method|String|request.getMethod()|POST
请求头Headers|JSONObject|request.getHeaders()|{"User-Agent":["Chorme"]}
请求体Body|byte[]|request.getBody()|[98, 109, 111, 98]
Get参数|JSONObject|request.getQueryParams()|{"page": "1"}
Body内参数|JSONObject|request.getParams()|{"username": "zwr"}
单个请求头|String|request.getHeader(String key)|request.getHeader("User-Agent") = "Chrome"
单个Get参数|String|request.getQueryParam(String key)|request.getQueryParam("page") = "1"

### Response对象

- onRequest方法参数中 `Response response` 用于响应请求，返回数据
- Response对象主要内容是 `send` 方法，参数不同共有4种重载形式(Overloading):

1. send(Object res)
2. send(Object res, int statusCode)
3. send(Object res, int statusCode, String statusMsg)
4. send(Object res, int statusCode, String statusMsg, JSONObject headers)

以下是参数说明：

名称|类型|意义
:----:|:----:|:----:
res|Object|返回的内容：如果为byte[]类型直接返回；否则会返回res.toString("UTF-8")
statusCode|int|返回的Http响应状态码，例如200、404
statusMsg|String|返回的Http响应状态，例如OK、NotFound
headers|JSONObject|返回的头部信息，采用String-String的格式，例如{"Content-Type": "text/plain; charset=UTF-8"}

- 示例

		// 1. 直接返回字符串
		response.send("Hello world--Bmob");
		// 2. 返回404错误
		response.send("Error", 404, "NotFound");
		// 3. 返回中文字符串，需要返回包含charset的header
		response.send(
			"你好，比目",
			200,
			"OK",
			JSON.toJson("Content-Type", "text/plain; charset=UTF-8")
		);

---

181206更新：

支持响应跨域请求

```
// 在send方法被调用之前调用
response.setAllowCross(
	boolean isAllow,
	String host,
	String contentType,
	String[] methods,
	String[] allowHeaders,
	String[] exposeHeaders
);
```


### Modules对象

- onRequest方法参数中 `Modules modules` 提供了几个模块供开发者调用：

模块名|获取方式|作用
:----:|:----:|:----:
Bmob数据库操作|modules.oData|封装了Bmob的大多数api，以供开发者进行快速的业务逻辑开发，详见下文 `<Bmob数据操作>`
内存操作|modules.oMemory|提供了一定内存空间给开发者快速读写，详见下文 `<内存操作>`
日志输出|modules.oLog|提供了几个级别的日志输出，以便调试，详见下文 `<日志输出>`
持久化操作|modules.oPersistence|利用系统IO进行数据持久层操作，可用于静态网页，详见下文`<持久化>`
Http请求|modules.oHttp|发起http的各种请求，如POST、GET等，详见下文`<Http请求>`
游戏平台操作|modules.oGame|从云函数对Bmob Game SDK进行房间、玩家管理，详见下文`<游戏平台操作>`
微信接口|modules.oWechat|目前提供了几个方法，用于小程序客服交互，详见下文 `<微信接口>`

#### Bmob数据操作

以下均为 `modules.oData` 的方法：


方法体|返回值|描述
:----:|:----:|:----:
setTimeout(int)|this|设置超时时间(单位:毫秒)，与云函数超时无关
setHeader(String...)|this|设置请求头
setHeader(JSONObject)|this|设置请求头
setUserSession(String)|this|设置用户的Session Token
setMasterKey(String)|this|设置应用的Master Key
insert(String table,JSONObject data)|HttpResponse|往数据表中添加一行
remove(String table,String objectId)|HttpResponse|删除数据表中的一行
update(String table,String objectId,JSONObject data)|HttpResponse|更新数据表中的一行
find(Querier)|HttpResponse|使用查询器查询数据
findOne(String table,String objectId)|HttpResponse|查询数据表中的一行
uploadfile(String fileName,bytes[] bytes)|HttpResponse|上传一个文件
uploadfile(String fileName,bytes[] bytes,String contentType)|HttpResponse|上传一个文件，并指定格式
deletefile(String cdnName,String url)|HttpResponse|删除文件
deletefiles(JSONObject)|HttpResponse|批量删除文件
bql(String,Object...)|HttpResponse|使用BQL查询
userSignUp(JSONObject)|HttpResponse|用户注册
userLogin(String username,String password|HttpResponse|用户通过账号、密码登陆
userLoginBySMS(String mobile, String smsCode,JSONObject userInfo)|HttpResponse|用户通过短信验证码一键注册或登录
userResetPasswordByEmail(String email)|HttpResponse|用户请求Email重置密码
userResetPasswordBySMS(String smsCode,String password)|HttpResponse|用户通过短信验证码重置密码
userResetPasswordByPWD(String userId,String session, String oldPassword, String newPassword)|HttpResponse|用户通过旧密码修改新密码
sendCustomSMS(String mobile, String content)|HttpResponse|发送自定义短信
sendSMSCode(String mobile, String template)|HttpResponse|发送某模版的短信验证码
verifySMSCode(String mobile, String smsCode)|HttpResponse|验证短信验证码
payQuery(String orderId)|HttpResponse|查询支付订单
cloudCode(String funcName, JSONObject body)|HttpResponse|调用云函数
push(JSONObject body)|HttpResponse|向客户端推送消息
roleInsert(JSONObject data)|HttpResponse|ACL:创建角色
roleFindOne(String roleId)|HttpResponse|ACL:查询角色
roleUpdate(String roleId, JSONObject data)|HttpResponse|ACL:修改角色
roleDelete(String roleId)|HttpResponse|ACL:删除角色
getDBTime()|HttpResponse|获取Restful服务器的时间
batch(JSONArray requests)|HttpResponse|批量请求


#### 内存操作

- `modules.oMemory` 提供了内存操作，可以进行快速的缓存读写，
- **内存随时可能被重置(暂无持久化功能)**，所以在使用的时候，最好结合Base64、Bmob数据库来使用
- 若使用得当，可以提高效率、减少Bmob api请求压力。
- 内存块是以 **应用为单位** 分配的，也就是允许一个应用下 **跨Java云函数** 同时进行读写
- 目前内存大小统一为 **64kb/App**(有可能变动)，可以通过 `modules.oMemory.MemorySize` 获取
- 下面的方法除 `clean` 之外，分为 `当作byte数组` 和 `当作Map` 使用两种方式，这两种方式 **不能混用** ，如果你的应用选择将内存转为Map类型使用，就不能再用byte数组类型的接口操作内存，否则会出现异常
- 以下均为 `modules.oMemory` 的方法

   // 把内存当作byte数组使用，往内存写byte数组
   	// buff: 写入内容
   	// buffOffset: 写入内容内偏移值
   	// memoryOffset: 内存偏移值
   	// length: 写入长度
   	// return 是否写入成功(超出授予的内存大小，即返回失败)
   	public native boolean write(byte[] buff, int buffOffset, int memoryOffset,
   			int length);

   	// 把内存当作byte数组使用，读取内存
   	public native boolean read(byte[] buff, int memoryOffset, int buffOffset,
   			int length);

   	// 把内存当作byte数组使用，读取内存
   	// return 越界时返回null，没有写入过返回 new byte[length]
   	public native byte[] read(int memoryOffset, int length);

   	// 清理内存
   	public native void clean();

   	// 把内存当作Map类型操作，写入键值对
   	public native boolean putMap(String key, Serializable value);

   	// 把内存当作Map类型操作，写入追加Map
   	public native boolean putMap(Map<String, Serializable> kvs);

   	// 把内存当作Map类型操作，获取一个值
   	public native <T extends Serializable> T getMap(String key);

   	// 把内存当作Map类型操作，覆盖写入Map
   	public native boolean writeMap(Map<String, Serializable> kvs);

   	// 把内存当作Map类型操作，读取整个Map
   	public native Map<String, Serializable> readMap();

   	// 把内存当作Map类型操作, 写入一个byte
   	public native boolean writeByte(int index, byte b);

   	// 把内存当作Map类型操作, 读取一个byte
   	public native byte readByte(int index);


   ​

#### 日志输出


以下均为 `modules.oLog` 的方法：

		// 设置需要输出的日志级别
		// Level_All = 0
		// Level_Debug = 1
		// Level_Warn = 2
		// Level_Error = 3
		modules.oLog.level = modules.oLog.Level_All // 全部都会输出
		modules.oLog.level = modules.oLog.Level_Warn // 仅输出Warn和Error
		modules.oLog.level = modules.oLog.Level_Error // 仅Error级别日志

		modules.oLog.d(Object) // 输出Debug级别日志
		modules.oLog.w(Object) // 输出Warn级别日志
		modules.oLog.e(Object) // 输出Error级别日志
		modules.oLog.debug(String,Object...) // 格式化输出Debug级别日志
		modules.oLog.warn(String,Object...) // 格式化输出Warn级别日志
		modules.oLog.error(String,Object...) // 格式化输出Error级别日志

### 持久化

*请注意，此处的持久化不同于利用Bmob数据库，是一种非可靠的、利用系统IO实现的数据持久化管理*

*在不同负载环境下，或使用超出额度时，均可能会造成数据被清空*

*利用该模块，你可以轻松实现前端代码的部署，例如单页h5应用、vue项目等，且不会造成数据库api数的增加*

`modules.oPersistence` 只有两个方法:

```
// 获取一个持久化项
// 参数为路径，举例：
// ("index.html")
// ("web/html/index.html")
// ("web","html","index.html")
// ("web","html/js","index.js")
// 返回 PersistenceItem 对象，可进行IO操作，返回null说明发生错误，可能是额度达到上限或路径非法

PersistenceItem modules.oPersistence.get(...)


// 获取持久化的结构
JSONObject modules.oPersistence.getStruct()
/* 返回值举例：
	{
		"index.html": 123, // 项对应的是length
		"web": { // 层级对应的是Object
			"html": {
				"index.html": 456
			},
			"js": {
				"index.js": 789
			},
			"config": 123
		}
	}
*/
```

**PersistenceItem**

可进行持久化操作的项，可进行读、写、删除、获取空间大小等

方法:

```
// 获取大小
long size();

// 写入
boolean write(byte[] data)

// 写入，是否追加
boolean write(byte[] data, boolean append);

// 读取
public final native boolean read(byte[] buff);

// 读取，跳过字节数
public final native boolean read(byte[] buff, long skip);

// 删除该项
public final native boolean delete();

// 将zip文件内容解压到持久化空间
public final native boolean unzip(byte[] data);
public final native boolean unzip(java.io.InputStream is);

// 将持久化空间的所有文件打包成zip文件
public final native byte[] zip();
public final native boolean zip(java.io.OutputStream os);

```


*目前云函数普通用户有以下限制：50个持久化项、单项大小不超过10Mb、总大小不超过10Mb、每次云函数执行周期内可读写各1次*

*如需提高以上额度或取消限制，请联系官方客服*


### Http请求

以下均为`modules.oHttp`对象的方法


```
// get请求一个网址
HttpResponse get(String url);

// post发起一次请求
HttpResponse post(String url, String contentType, byte[] data);

// post发起Json请求
HttpResponse post(String url, JSONObject jsonData);

// post发起Form请求
HttpResponse post(String url, Map<String, String> formData);

// 发起任意http请求
HttpResponse request(String url, String method, JSONObject headers, byte[] data, int timeout);
```


*目前云函数普通用户有以下限制：每次云函数执行周期内可进行1次请求*

*如需提高以上额度或取消限制，请联系官方客服*


### 游戏平台操作

**该模块用于配合 [Bmob游戏SDK](https://game.bmobapp.com) 使用，可执行例如定期清理房间、踢出玩家、获取游戏参数等操作**

以下均为`modules.oGame`对象的方法


```
// 初始化
init(String bgsId, int version);

// 创建房间
HttpResponse createRoom(String hostUserId, int playerCount);

// 销毁房间
HttpResponse destroyRoom(String hostUserId, String slaveAddress, int roomId, String roomMasterKey);

// 踢出玩家
HttpResponse kick(String hostUserId, String slaveAddress, int roomId, String roomMasterKey, int kickingPlayerNo);

// 获取游戏配置
HttpResponse getConf();
```


#### 微信接口

- 推荐将小程序的appid、app secret在Bmob后台设置，由Bmob进行AccessToken的生命周期管理
- 以下均为 `modules.oWechat` 的方法

		// 设置当前的AccessToken
		setAccessToken(String)

		// 设置小程序的key，不推荐调用，推荐在Bmob后台设置
		initWechatApp(String appId, String appSecret)

		// 获取当前的AccessToken
		// 如果通过调用initWechatApp方法设置了小程序参数，则直接从微信接口获取，请注意自行保存并管理有效期，以避免频繁获取
		// 如果未调用initWechatApp，则从Bmob平台获取
		getAccessToken()
		getAccessToken(boolean useCache) // 参数为false时不使用缓存

		// 发送消息给小程序的用户
		// type可以为text、image、link
		// msg为String或JSON，请参考Demo和微信官方文档
		sendWechatAppMsg(String openId, String type, Object msg)

		// 判断是否从微信发送的请求
		// 实际上就是封装了判断signature是否等于SHA1(sort(timestamp,nonce,token))
		isWechatRequest(String token, Request request)


## 内置类

### HttpResponse

**类变量**:

变量名|类型|描述
:----:|:----:|:----:
err|String|错误信息
res|ResponseStatus|请求状态(见下表)
data|byte[]|返回的数据
stringData|String|返回的数据转String格式
jsonData |JSONObject|返回的数据转JSON格式

### ResponseStatus


**类变量**:

变量名|类型|描述
:----:|:----:|:----:
code|int|状态码
status|String|状态描述
headers|JSONObject|返回的Http头部

### Querier

**类方法**: **返回类型均为 `Querier`** (以链式调用)

方法体|描述
:----:|:----:
\<init\>(String table)|构造方法，传入表名
limit(int)|设置最大返回行数
skip(int)|设置跳过的个数
order(String)|排序规则
keys(String)|需要返回的属性
include(String)|需要返回详细信息的Pointer属性
where(JSONObject)|设置查询条件
addWhere(JSONObject)|添加条件
and(Querier)|and复合查询
or(Querier)|or复合查询
addWhereExists(String)|某字段有值
addWhereNotExists(String)|某字段无值
addWhereExists(String,boolean)|某字段有/无值
addWhereEqualTo(String,Object)|某字段等于
addWhereNotEqualTo(String,Object)|某字段不等于
addWhereGreaterThan(String,Object)|某字段大于
addWhereGreaterThanOrEqualTo(String,Object)|某字段大于等于
addWhereLessThan(String,Object)|某字段小于
addWhereLessThanOrEqualTo(String,Object)|某字段小于等于
addWhereRelatedTo(String table,toObjId,toKey)|在某表作为Relation关联起来的数据
addWhereNear(String,BmobGeoPoint,double maxMiles, double maxKM, double maxRadians)|地理位置在一定范围内
addWhereWithinGeoBox(String,BmobGeoPoint,BmobGeoPoint)|地理位置在矩形范围内
addWhereContainedIn(String key, Object... objs)|值在列表内
addWhereContainedInArray(String key,JSONArray arr)|值在列表内
addWhereNotContainedIn(String key,Object... objs)|值不在列表内
addWhereNotContainedInArray(String key,JSONArray arr)|值不在列表内
addWhereContainsAll(String key, Object... objs)|列表包含全部项
addWhereContainsAllInArray(String key,JSONArray arr)|列表包含全部项
addWhereStrContains(String key, String keyWord)|String类型模糊查询
addWhereMatchesQuery(String key,JSONObject innerQuery, String innerKey)|某项符合子查询
addWhereDoesNotMatchQuery(String key,JSONObject innerQuery, String innerKey)|某项不符合子查询
addWhereMatchesQuery(String key,Querier innerQuery, String innerKey)|某项符合子查询
addWhereDoesNotMatchQuery(String key,Querier innerQuery, String innerKey)|某项不符合子查询
addWhereInQuery(String key, JSONObject inQuery)|某项包含在子查询
addWhereNotInQuery(String key,JSONObject inQuery)|某项不包含在子查询
addWhereInQuery(String key, Querier querier)|某项包含在子查询
addWhereNotInQuery(String key, Querier querier)|某项不包含在子查询
count(int)|统计接口: 返回数量
groupby(String)|统计接口: 根据某列分组
groupcount(boolean)|统计接口: 分组后组内统计数量
sum(String)|统计接口: 计算总数
average(String)|统计接口: 计算平均数
max(String)|统计接口: 获取最大值
min(String)|统计接口: 获取最小值
having|统计接口: 分组中的过滤条件

### BmobUpdater

该类的全部静态方法都用于设置insert、update方法的请求内容，**返回类型均为 `JSONObject`**

**静态方法**：

方法体|描述
:----:|:----:
add(JSONObject data,String key,Object value)|往data添加一个键值
increment(JSONObject data,String key,Number number)|原子计数
arrayAdd(JSONObject data,String key,Object obj)|往Array类型添加一项
arrayAddAll(JSONObject data,String key,JSONArray objects)|往Array类型添加多项
arrayAddUnique(JSONObject data,String key,Object obj)|往Array类型不重复地添加一项
arrayAddAllUnique(JSONObject data,String key,JSONArray objects)|往Array类型不重复地添加多项
arrayRemoveAll(JSONObject data,String key,JSONArray objects)|删除Array类型的多项
addRelations(JSONObject data, String key,BmobPointer...pointers)|添加多个Relation关系
removeRelations(JSONObject data, String key,BmobPointer...pointers)|移除多个Relation关系

### JSON

静态方法：

		String stringify(JSONObject m)
		String stringify(JSONArray m)
		JSONObject parse(String s)
		JSONArray parseArray(String s)
		JSONObject setJson(JSONObject json, Object... kNvs)
		JSONArray append(JSONArray array, Object... objs)
		JSONArray toArray(Object... objs)
		JSONObject strsToJson(String... kNvs)
		JSONObject toJson(Object... kNvs)
		boolean sort(List array, String keys)
		boolean clean(Map json, String rules);


### JSONObject

类方法：

		int size()
		boolean isEmpty()
		boolean containsKey(Object key)
		boolean containsValue(Object value)
		Object get(Object key)
		Object put(String key, Object value)
		Object remove(Object key)
		void clear()
		Set<String> keySet()
		BigInteger getBigInteger(String key)
		BigDecimal getBigDecimal(String key)
		Boolean getBoolean(String key)
		boolean getBooleanValue(String key)
		Byte getByte(String key)
		byte getByteValue(String key)
		Date getDate(String key)
		Double getDouble(String key)
		double getDoubleValue(String key)
		Float getFloat(String key)
		float getFloatValue(String key)
		Integer getInteger(String key)
		int getIntValue(String key)
		JSONArray getJSONArray(String key)
		JSONObject getJSONObject(String key)
		Long getLong(String key)
		long getLongValue(String key)
		Short getShort(String key)
		short getShortValue(String key)
		String getString(String key)


### JSONArray

类方法：

		int size()
		boolean isEmpty()
		boolean contains(Object o)
		boolean add(Object e)
		boolean remove(Object o)
		boolean containsAll(Collection<?> c)
		boolean addAll(Collection<? extends Object> c)
		boolean addAll(int index, Collection<? extends Object> c)
		boolean removeAll(Collection<?> c)
		boolean retainAll(Collection<?> c)
		void clear()
		Object get(int index)
		Object set(int index, Object element)
		void add(int index, Object element)
		Object remove(int index)
		BigInteger getBigInteger(int index)
		BigDecimal getBigDecimal(int index)
		Boolean getBoolean(int index)
		boolean getBooleanValue(int index)
		Byte getByte(int index)
		byte getByteValue(int index)
		Date getDate(int index)
		Double getDouble(int index)
		double getDoubleValue(int index)
		Float getFloat(int index)
		float getFloatValue(int index)
		Integer getInteger(int index)
		int getIntValue(int index)
		JSONArray getJSONArray(int index)
		JSONObject getJSONObject(int index)
		Long getLong(int index)
		long getLongValue(int index)
		Short getShort(int index)
		short getShortValue(int index)
		String getString(int index)

### BmobPointer

构造方法：

		BmobPointer(String className, String objectId)

### Bmobfile

构造方法：

		Bmobfile(String filename, String url)

### BmobDate

构造方法：

		BmobDate(String timeStamp)
		BmobDate(long millSec)

### BmobGeoPoint

构造方法：

		BmobGeoPoint(double longitude, double latitude)

静态方法：

		double CalcuDistance(double lat1, double lng1, double lat2, double lng2)

### AES

静态方法：

		byte[] aes(byte[] str, byte[] key, byte[] iv, boolean eOd, String keyAlgorithm, String cipherAlgorithm)
		byte[] Encode(byte[] content, byte[] key, byte[] iv)
		byte[] Decode(byte[] content, byte[] key, byte[] iv)


### Base64

静态方法：

		String Encode(byte[] data)
		byte[] Decode(String str)

### Hex

静态方法：

		String Encode(byte[] data)
		byte[] Decode(String str)

### Email

构造方法：

		// host: 邮件服务商的地址，例如qq邮箱为smtp.qq.com
		// port: 邮件服务商的端口号，例如qq邮箱为465
		// email: 用于发送邮件的邮箱地址
		// password: 邮箱密码，请注意很多邮件服务商不允许直接使用登陆密码，需要另外申请
		Email(String host, int port, String email, String password)


### 类变量


		// 修改邮件的发送方名称
		String username


### 类方法

		// email: 接受方的邮件地址
		// title: 邮件标题
		// body: 邮件内容
		// 返回值的jsonData.getIntValue("code") == 200时为发送成功
		HttpResponse send(String email, String title, String body)


### Crypto

静态方法：

		String Encode(String algorithm, String content)
		String Encode(String algorithm, byte[] bytes)
		byte[] EncodeToBytes(String algorithm, byte[] bytes)
		String Bytes2Hex(byte bytes[])
		String Bytes2Hex(byte bytes[], int offset, int length)


### GZip

静态方法：

		byte[] Decode(byte[] bytes)
		byte[] Encode(byte[] bytes)


### MD5

静态方法：

		String Encode(String content)
		String Encode(byte[] bytes)
		byte[] EncodeToBytes(byte[] bytes)

### RSA

请注意，别忘了要写类的全称，例如 `java.security.PrivateKey`，否则编译失败

静态方法：

		java.security.KeyPair GenerateKeys()
		java.security.PrivateKey ParsePrivateKey(byte[] keyBytes)
		java.security.PublicKey ParsePublicKey(byte[] keyBytes)

		// 下面4个方法，都可以再添加一个String参数，传入算法
		// 默认的算法为：加解密[RSA/ECB/PKCS1Padding], 签名[SHA1WithRSA]
		byte[] Encode(PublicKey pubKey, byte[] content)
		byte[] Decode(PrivateKey priKey, byte[] content)
		byte[] Sign(PrivateKey priKey, byte[] content)
		boolean Verify(PublicKey pubKey, byte[] content, byte[] sign)


### SHA1

静态方法：

		String Encode(String content)
		String Encode(byte[] bytes)
		byte[] EncodeToBytes(byte[] bytes)


## 内置方法

		long getTime() // 获取当前毫秒
		String fmt(String, Object...) // 格式化
		JSON.toJson(Object...) // Json化
		JSONObject JSON.parse(String) // String转JSONObject
		JSONArray JSON.parseArray(String) // String转JSONArray
		boolean isStrEmpty(String) // 判断字符串是否为空
		arraycopy(Object from, int fromOffset, Object to, int toOffset, int length) // 复制数组内容


​
## 示例

案例主要放在了Github: **[Bmob云函数案例](https://github.com/bmob/BmobJavaCloud/tree/master/samples)**



- **场景1**:

  用户在app提交了反馈，参数有"userObjectId"、"title"、"content"、"type"，需要保存到FeedBack表

  	JSONObject params = request.getParams();
  	String title = params.getString("title");
  	String content = params.getString("content");
  	String userId = params.getString("userObjectId");
  	int type = params.getIntValue("type");

  	JSONObject data = JSON.toJson(
  		"title", title,
  		"content", content,
  		"type", type
  	);
  	BmobUpdater.add(
  		data,
  		"user",
  		new BmobPointer("_User", userId)
  	);

  	response.send(
  		modules.oData.insert(
  			"Feedback",
  			data
  		).stringData
  	);

- **场景2**:

	查询Feedback表中，type为1、title字段不为空，且创建时间在12小时以内的最新10条数据，并只需要反馈content和对应user的用户名

		Querier q = new Querier("Feedback")
						.limit(10)
						.include("user")
						.order("-createdAt");
		q.addWhereEqualTo("type", 1);
		q.addWhereExists("title");
		q.addWhereGreaterThanOrEqualTo("createdAt",
			new BmobDate(getTime() - 12 * 60 * 60 * 1000)
		);
		HttpResponse res = modules.oData.find(q);
		JSONArray feedbacks = res.jsonData.getJSONArray("results");
		if (feedbacks == null)// 请求有错误，直接返回全部内容
			response.send(res.data);
		else {
			JSONArray arr = new JSONArray();
			for (int i = 0, l = feedbacks.size(); i < l; i++) {
				JSONObject fb = feedbacks.getJSONObject(i);
				JSONObject user = fb.getJSONObject("user");
				arr.add(
					JSON.toJson(
						"username",
						user == null ? null : user.getString("username"),
						"content",
						fb.getString("content")
					)
				);
			}
			response.send(JSON.toJson("results", arr));
		}


##注意事项


- 如果你编写的Java云函数经常发生运行超时、上下行超流量、滥用内存等现象，官方将会自动封停你的云函数功能，修改后向客服申请方可继续使用

- 如果某接口调用频率较高，超过默认并发量，则会直接返回错误，解决方法：

		1.修改客户端代码，降低请求频率
		2.修改云函数，提高代码质量和效率，减少网络请求相关的超时时长，尽快结束工作
		3.购买更高的并发配置

- 如果需要接受更大的请求体，或返回更大的结果，请购买更高的配置
- 如果你用 `eclipse` 等IDE开发，使用 [同步工具](https://github.com/bmob/BmobJavaCloud/tree/master/exec) 是一个不错的选择

