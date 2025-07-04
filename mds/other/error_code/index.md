## AndroidSDK错误码列表

| 错误码 	| 内容 		| 含义		|
|-----------|-----------|-----------|
| 9001		| AppKey is Null, Please initialize BmobSDK. |Application Id为空，请初始化.
| 9002		| Parse data error|解析返回数据出错
| 9003		| upload file error|上传文件出错
| 9004		| upload file failure|文件上传失败
| 9005		| A batch operation can not be more than 50|批量操作只支持最多50条
| 9006		| objectId is null|objectId为空
| 9007		| BmobFile File size must be less than 10M.|文件大小超过10M
| 9008		| BmobFile File does not exist.|上传文件不存在
| 9009		| No cache data.|没有缓存数据
| 9010		| The network is not normal.(Time out)|网络超时
| 9011		| BmobUser does not support batch operations.|BmobUser类不支持批量操作
| 9012		| context is null.|上下文为空
| 9013		| BmobObject Object names(database table name) <br/>format is not correct.|BmobObject（数据表名称）格式不正确
| 9014		| 第三方账号授权失败|第三方账号授权失败
| 9015		| 其他错误均返回此code|其他错误均返回此code
| 9016		| The network is not available,please check your network!|无网络连接，请检查您的手机网络.
| 9017		| 与第三方登录有关的错误，具体请看对应的错误描述|与第三方登录有关的错误，具体请看对应的错误描述
| 9018		| 参数不能为空|参数不能为空
| 9019		| 格式不正确：手机号码、邮箱地址、验证码|格式不正确：手机号码、邮箱地址、验证码
| 9020		|保存CDN信息失败|保存CDN信息失败
| 9021		|permission not defined.You must write android<br/>.permission.WAKE_LOCK  in AndroidManifest.xml "<uses-permission<br/> android:name="android.permission.WAKE_LOCK". |文件上传缺少wakelock权限
| 9022		|upload failure,please retry.|文件上传失败，请重新上传
| 9023		|please call Bmob.initialize to init sdk.|请调用Bmob类的initialize方法去初始化SDK

注：<br>
1. 关于9015错误，是SDK相关方法被调用过程中遇到的异常统一返回的标识，所以反馈问题和提交工单时请务必带上错误描述;
2. 如果您在SDK相关方法的成功回调中，调用您项目中的业务方法抛出异常的话也会被SDK捕获到,亦即先成功回调SDK的操作，后出现9015报错，此时建议检查下您的业务方法的代码，
解决这种看似done方法被回调两次的假象。

## iOSSDK错误码列表
|错误码	|内容	|含义|
|:--	|:--	|:--|
|100	|It is busy...Try it later!|一般是请求服务器的内容有误，如果是查询的话，请检查一下查询条件是否有误.|
|20000	|nil password!|登录或者注册时输入的密码为空.|
|20001	|nil username!|登录或者注册时输入的用户名为空.|
|20002	|connect failed!|请求失败.|
|20003	|none objectid!|更新对象、删除对象、查询单个对象时没有objectid|
|20004	|none object!|查询时，查询结果为空|
|20005	|expired!|缓存查询时，查询时间已过期|
|20006	|cloud function failed!|云端逻辑调用失败|
|20008	|none filename!|上传文件时，文件名为空|
|20009	|none file!|上传文件时，找不到文件|
|20010	|unknow error!|未知错误|
|20011	|none filendata!|上传文件时，文件内容为空|
|20012	|update content is nil!|更新时，更新内容为空|
|20013	|fuction name is nil!|调用云端逻辑时，函数名为空|
|20014	|array is too big!|批量操作时，传入的数组超过界限|
|20015	|nil array!|批量操作时，传入的数组为空|
|20016	|nil push content!|推送时，推送内容为空|
|20017	|init is not finish,please wait a moment|初始化未完成|
|20023	|init fail|初始化失败|
|20024	|format error|批量文件上传时格式错误|
|20025	|nil class name|表名为空|
|20027	|string is nil or equal ""|传的参数有错，一般是传入空字符串造成|
|20028	|Invalid mobile phone number, the format can't be empty or null|非法手机号|
|20029	|Invalid sms code, the format can't be empty or null|非法验证码|
|20030	|File not exist|获取文件url、删除文件时传入的文件名不存在|

## RESTAPI错误码列表
|HttpResponseCode|错误码|含义|
|:------|:---------|:---------|
|401	|	|unauthorized|
|500	|	|It is busy...Try it later!

当HttpResponseCode的值为401或500时，接口返回的内容格式如下：

```JSON
{
    "error": "unauthorized"
}
```
error为上表中含义的值

当HttpResponseCode的值为400时，接口返回的内容格式如下：

```JSON
{
    "code": 101,
    "error": "object not found for e1kXT22L"
}
```

code为下表中的错误码，error为下表中的内容
以下是HttpResponseCode为404时返回内容的详细说明，信息中的%s，%d，%f将替换为详细的信息或具体的值。

|错误码	|内容	|含义|
|:--	|:--	|:--|
|101	|object not found for %s. OR username or password incorrect|查询的 对象或Class 不存在 或者 登录接口的用户名或密码不正确|
|102	|Invalid key '%s' for find OR Invalid value for key '%s'. OR %s: invalid geopoint object.|查询中的字段名是大小写敏感的，且必须以英文字母开头，有效的字符仅限在英文字母、数字以及下划线。，或查询对应的字段值不匹配，或提供的地理位置格式不正确|
|103	|objectId required. OR classname '%s' must start with a letter.|查询单个对象或更新对象时必须提供objectId 或 非法的 class 名称，class 名称是大小写敏感的，并且必须以英文字母开头，有效的字符仅限在英文字母、数字以及下划线.|
|104	|relation className '%s' not exists.|关联的class名称不存在|
|105	|invalid field name: %s. OR It is a reserved field: %s.|字段名是大小写敏感的，且必须以英文字母开头，有效的字符仅限在英文字母、数字以及下划线 或 字段名是[Bmob](http://www.bmobapp.com/ "Bmob移动后端云服务平台")默认保留的，如objectId,createdAt,updateAt,ACL|
|106	|%s: is not a valid Pointer.|不是一个正确的指针类型|
|107	|invalid json: %s.|输入的json不是正确的json格式|
|107	|This endpoint only supports Content-Type: application/json requests, not %s.|请求只支持Header头部Content-Type值为application/json或application/json; charset=utf-8|
|107	|invalid date: %s.|时间格式不正确|
|107	|ACL shoud be like: {"*":{"read":true},"eAfHB29gP9":{"write":true}}.|ACL应该像这样的{"*":{"read":true},"eAfHB29gP9":{"write":true}}|
|107	|invalid op value|不是正确的__op的值|
|108	|username and password required.|用户名和密码是必需的|
|109	|login data required.|登录信息是必需的，如邮箱和密码时缺少其中一个提示此信息|
|110	|db is moving, please do not use http method POST,PUT,DELETE|数据库正在迁移，请勿使用POST、PUT、DELETE方法|
|111	|invalid type for key '%s', expected '%s', but got '%s'.|传入的字段值与字段类型不匹配|
|112	|requests must be an array.|requests的值必须是数组|
|113	|every request shoud be an object like:{"method": "POST","path": "/1/classes/GameScore","body": {"score": 1337,"playerName": "Sean Plott"}}|requests数组中每个元素应该是一个像这样子的json对象|
|114	|requests array larger than %d|requests数组大于50|
|117	|Latitude must be in [-90, 90]: %f. OR Longitude must be in [-180, 180]: %f.|纬度范围在[-90, 90] 或 经度范围在[-180, 180]|
|118	|param %s is need.|缺少必需的参数|
|120	|Email verify should be opened in your app setup page of bmob|要使用此功能，请在Bmob后台应用设置中打开邮箱认证功能开关|
|121	|api数已超出限制，目前使用的api数:%d，套餐的api数:%d，购买的api数剩余0条|API调用次数超出限制|
|122	|权限验证不通过|用户权限验证失败|
|125	|default value invalid json : %s.|默认值的JSON格式不正确|
|131	|Invalid device token:%s OR Invalid installation ID:%s OR Invalid device type:%s|设备token、安装ID或设备类型无效|
|132	|device token '%s' already exist. OR installation ID '%s' already token.|设备token或安装ID已存在|
|136	|%s cannot be changed by this operation OR deviceToken may not be set for deviceType android|某些属性不能被修改，或Android设备不需要设置deviceToken|
|137	|Clients aren't allowed to perform the %s operation on the installation class.|客户端不允许对installation类执行特定操作|
|138	|%s is read only. OR This app can not op delete in sdk|某些字段是只读的，或应用不能在SDK中执行删除操作|
|139	|Role names must be restricted to alphanumeric characters, dashes(-), underscores(_), and spaces. OR role name '%s' already taken.|角色名称格式限制或角色名已被使用|
|141	|Missing the push data.|推送数据缺失|
|142	|%s shoule be like: 2013-12-04 00:51:13|时间格式应该符合特定格式|
|143	|%s must be a number|必须是数字|
|144	|%s cannot before now|不能是过去的时间|
|145	|file size error|文件大小错误|
|146	|file name must use base64 encode before upload OR file must have suffix|文件名必须使用base64编码或必须有后缀名|
|147	|file offeset error|文件偏移量错误|
|148	|file ctx error|文件上下文错误|
|149	|empty file|空文件|
|150	|file upload error|文件上传错误|
|151	|file delete error:%s|文件删除错误|
|152	|file url empty|文件URL为空|
|153	|file not your owned|不是文件所有者|
|154	|delete all file error|删除所有文件错误|
|155	|%s required|缺少必需的文件相关参数|
|156	|%s not found|文件未找到|
|157	|file url Invalid, please check if you had setting agent of network|文件URL无效，请检查网络代理设置|
|160	|image error|图片错误|
|161	|image mode error|图片模式错误|
|162	|image width error|图片宽度错误|
|163	|image height error|图片高度错误|
|164	|image longEdge error|图片长边错误|
|165	|image shortgEdge error|图片短边错误|
|201	|'%s' missing.|缺少必需的用户信息|
|202	|username '%s' already taken.|用户名已被使用|
|203	|email '%s' already taken.|邮箱已被使用|
|204	|you must provide an email|必须提供邮箱地址|
|205	|no user found with email '%s'. OR no user found with username '%s'.|未找到对应邮箱或用户名的用户|
|206	|无权限操作用户表，应用初始化时，请传入MasterKey|需要MasterKey才能操作用户表|
|207	|code error:%s.|验证码错误|
|208	|authData error OR authData already linked by other user|第三方账号认证数据错误或已被其他用户关联|
|209	|mobilePhoneNumber '%s' already taken.|手机号已被使用|
|210	|old password incorrect.|旧密码不正确|
|211	|用户请先登录，或者用户登录已过期需要重新登录|用户未登录或登录已过期|
|232	|支付服务不可用|支付功能暂不可用|
|233	|该api接口已停用|API接口已停用|
|234	|没有支付权限，请联系bmob工作人员|无支付权限|
|235	|获取支付权限错误:%s|获取支付权限失败|
|236	|请在设置->应用配置中填写相关的信息|需要配置支付相关信息|
|301	|%s OR this api response err:%s|验证错误或API响应错误|
|302	|your app setting '%s'.|应用设置相关错误|
|303	|%s is not for your wechat url.|微信URL不匹配|
|310	|call cloudcode error:%s|调用云代码错误|
|311	|invalid cloudcode name: %s.|云代码名称格式错误|
|312	|请传入云代码|缺少云代码|
|313	|update cloudcode err: %s|更新云代码错误|
|314	|该云端代码不存在，没法删除|云代码不存在|
|315	|删除云端代码错误: %s|删除云代码失败|
|316	|生成云端代码文件错误: %s|生成云代码文件失败|
|317	|调用容器错误: %s|容器调用失败|
|318	|往redis中写入新版云端代码错误: %s OR get cloudcode config error|Redis写入云代码错误或获取云代码配置失败|
|319	|获取云端代码列表错误: %s OR 获取云端代码错误: %s|获取云代码列表或具体云代码失败|
|320	|解析云端代码错误: %s|解析云代码失败|
|321	|保存错误，代码中包含未支持的javascript对象|不支持的JavaScript对象|
|322	|更新云端代码失败: %s|更新Java云代码失败|
|323	|删除云端代码失败: %s|删除Java云代码失败|
|324	|数据钩子错误: %s|数据Hook错误|
|330	|推送服务只有付费才能使用|推送服务需付费使用|
|401	|unique index cannot has duplicate value: %s|唯一索引不能有重复值|
|402	|query where larger than %d bytes.|查询条件超出字节限制|
|501	|you are forbidden.|用户被禁止访问|
|601	|Invalid bql:%s|BQL查询语句错误|
|10001	|%s required.|支付相关参数缺失|
|10002	|order_no not exists. OR order_no not own by your app.|订单号不存在或不属于当前应用|
|10003	|%s.|支付相关错误|
|10004	|shengfu pay err: %s.|盛付通支付错误|
|10005	|shengfu pay add mysql row err: %s.|盛付通支付数据存储错误|
|10006	|该功能仅供专业版以及以上套餐的应用使用。|需要专业版及以上套餐|
|10007	|%s|通用错误信息|
|10008	|%s|应用禁用相关错误|
|10010	|mobile '%s' send message limited.|短信发送达到限制|
|10011	|sdk短信已用完|SDK短信余额不足|
|10012	|实名验证未审核通过 OR 用户redis信息异常 OR 用户状态异常 OR 应用支付截图未审核通过|用户认证或状态相关错误|
|10013	|sms content illegal.|短信内容非法|
|10014	|sms content contain url.|短信内容包含URL|
|10015	|illegal content.|内容非法|
|10016	|deviceId is empty OR restful短信已用完|设备ID为空或RESTful短信用完|
|10017	|your device: %s send sms reach limit|设备发送短信达到限制|
|10018	|smsId:%s not found|短信ID不存在|
|10019	|%s format is not 2006-01-02 15:04:05|时间格式错误|
|10020	|%s must out of 10 minutes from now OR not found apps|时间必须超过当前10分钟或未找到应用|
|10021	|该应用不允许调用自定义短信接口 OR not found app|不允许自定义短信或未找到应用|
|10022	|模板:%s 不存在|短信模板不存在|
|10030	|app name is needed|应用名称必需|
|10031	|create app error|创建应用失败|
|10032	|app name %s is large than 30 characters|应用名称超过30字符|
|10034	|app name %v is not string|应用名称必须是字符串|
|10035	|field: %v value: %v is not right|字段值不正确|
|10037	|create app is limit|创建应用达到限制|
|10038	|update app info error|更新应用信息失败|
|10039	|app name is empty|应用名称为空|
|10040	|not allow sdk create or delete column|不允许SDK创建或删除列|
|10041	|app name can not start with _,limit 20 characters|应用名称不能以_开头且限制20字符|
|10042	|file name can not contain back slash,file name:%s|文件名不能包含反斜杠|
|10050	|new password is empty|新密码为空|
|10051	|new password must string|新密码必须是字符串|
|10052	|update password err:%v|更新密码错误|
|10061	|master key Err|主密钥错误|
|10062	|class name mismatch between %s and %s|类名不匹配|
|10063	|field: %s is reserve|字段名是保留字|
|10064	|field: %s is exists|字段已存在|
|10065	|TargetClass %s need className|目标类需要类名|
|10066	|%s TargetClass %s not exist|目标类不存在|
|10067	|save schemas err|保存数据表结构失败|
|10068	|schemas save field err|保存字段失败|
|10069	|schemas type %s not exist|数据类型不存在|
|10070	|op %s not suppport|不支持的操作|
|10071	|field: %s is not exist|字段不存在|
|10072	|schemas delete field err|删除字段失败|
|10073	|user schema is not permit|不允许修改用户表结构|
|10074	|delete schema err|删除数据表结构失败|
|10075	|unique may already existed|唯一索引可能已存在|
|10076	|Qps beyond the limit: %v,%v,%v OR Cloudcode Qps beyond the limit: %d, %d, %s|QPS超出限制|
|10080	|register validate err: %s|注册验证错误|
|10081	|register err|注册失败|
|10082	|ForgetPwd err|忘记密码操作失败|
|10083	|email '%s' not exist.|邮箱不存在|
|10084	|Since the last backpu less than two hours|距离上次备份不足两小时|
|10085	|Since the last restore less than a day|距离上次恢复不足一天|
|10086	|no backup one|没有备份|
|10090	|cloudcode_is_migration not exist.|云代码迁移标记不存在|
|10091	|set cloudcode docker flag err: %s|设置云代码Docker标记失败|
|10100	|今天微信发送的消息已超过规定的%d次|微信消息发送超出限制|
|10200	|请求过程中网络超时|网络请求超时|
|10210	|应用半小时内超过了请求数限制|应用请求数超出限制|