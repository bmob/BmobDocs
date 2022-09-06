## v2.4.1(2019-10-11)
1、修复bug

## v2.3.4(2019-06-09)
1、修复bug

## v2.3.0(2018-04-11)
1、去除支付文件

## v2.2.9 (2018-04-08)
1、修复文件上传过大crash的bug

## v2.2.8 (2017-12-08)
1、修复bug

## v2.2.7（2017-12-04）
1、修复bug
2、添加QQ支付

## v2.2.6（2017-11-22）
1、修复bug

## v2.2.5（2017-11-20）
1.修复支付宝功能

## v2.2.4(2017-10-25)
1.修复支付宝功能

## v 2.2.3(2017-09-04)
1、修复bug

## v2.2.2(2017-08-22)
1、修复bitcode问题

## v2.2.1 (2017-07-12)
1、bug修复

## v2.2.0（2017-06-22）
1.bug修复

## v1.0.0（2017-06-05）
1.分离数据模块文件

## V2.1.9 (2017-06-01)
1.修复微信支付

## V2.1.8 (2017-4-22)
1.增加数据迁移，重新设置请求域名

## v2.1.7(2017-3-9)
1.去掉热更新

## V2.1.6 (2017-3-7)
1.Bug 修复

## v2.1.5 (2017-2-17)
1.BmobObject setObject: bug 修复

## v2.1.4 (2017-2-16)
1.bug修复

## v2.1.3 (2017-2-10)
1.修复支付异常回调
2.分离微信支付模块文件

## v2.1.2 (2017-2-8)
1.修改订单查询接口

## v2.1.1 (2017-2-6)
1.添加支付订单信息回调接口
2.修复user类achieve失败的bug

## v2.1.0 (2017-1-20)
1.修复模块重复问题

## v2.0.8 (2017-1-19)
1.添加微信支付功能

## v2.0.7 (2017-1-18)
1.Bug修复

## v2.0.6 (2017-1-17)
1.Bug修复

## v2.0.5 (2017-1-17)
1.Bug修复
2.取消xib，该用纯代码实现支付界面
3.扩展iOS6-iOS7支持

## v2.0.4 (2017-1-14)
1.Bug修复

## v2.0.3 (2017-1-14)
1.Bug修复

## v2.0.2 (2017-1-13)
1.添加支付宝支付

## v2.0.1 (2016-12-05)
1.修复更新个人资料可能会crash的问题

## v2.0.0 (2016-11-25)
1.全面支持https服务

## v1.7.3 (2016-11-9)
1.添加动态更新功能
2.适配新的短信服务

## v1.7.2 (2016-07-18)
1.替换BmobProFile 内部下载的方法，减少SDK的体积
2.修复BmobFile上传后可能name为空的问题
3.修复文件上传内存泄漏的问题

## v1.7.1 (2016-06-08)
1.修改BmobQuery 取消方法错误拼写
2.修改BmobObject objectWithoutDatatWithClassName方法拼写错误
3.BmobObject+subclass 增加+(instancetype)covertWithObject:(BmobObject *)obj; 方便在swift调用
4.修复更新个人资料可能会报用户名已存在的问题
5.修复有ACL导致的更新不成功的问题

## v1.7.0 (2016-04-22)
1.恢复BmobProFile文件下载的功能
2.恢复云端代码同步接口（请在子线程使用），新增+(id)callFunction:(NSString *)function withParameters:(NSDictionary *)parameters error:(NSError **)error;返回错误信息
3.Bmob类新增设置文件上传的授权时间和分片大小
4.BmobInstallation类去掉currentInstallation(命名让人误会)，用installation代替(单纯创建一个BmobInstallation对象).

## v1.6.9 (2016-04-14)
1.文件服务更换为CDN上传,废除新旧文件上传服务
2.新增文件批量删除接口
3.去掉调用云端代码同步的方法
4.BmobUser 设置用户名变为setUsername:(NSString *)username
5.更换网络请求库为NSURLSession
6.修复设置超时时间没有反馈的bug
7.修复某些回调不在主线程的问题

## v1.6.8 (2016-03-31)
1.修复上一个版本用户可能无法更新资料和实时监控的问题

## v1.6.7 (2016-03-18)
1.修复注销登录后的bug
2.修复请求完成后，偶然会崩溃的的bug

## v1.6.6 (2015-12-23)
1.添加封装的复合查询方法
2.原子计数器支持浮点数
3.修复网络环境较差时出现崩溃bug


## v1.6.5 (2015-10-08)
1.支持bitcode操作；
2.添加从字典初始化BmobObject方法；
3.添加单独修改JSON对象某个key-value对的功能。

## v1.6.4 (2015-08-27)
1.修改注册后没返回objectId的问题

## v1.6.3 (2015-08-24)
1.添加根据旧密码修改新密码接口；
2.添加手机验证码注册时可同时添加新密码或者是其它user列的信息接口；
3.修改上传多个图片时偶然冲突导致上传失败的bug。

## v1.6.2 (2015-08-18)
1.修复缩略图无法返回的问题;
2.修复上传图片时，文件路径有误时应用出错的问题。

## v1.6.1（2015-07-27）
1.修复使用账号密码注册时无法上传手机号的bug；
2.开放获取表结构的接口。

## v1.6.0（2015-07-14）
1.文件上传兼容旧文件系统
1）修改上传文件接口
2）添加获取已经上传文件访问url接口
3）删除已上传文件接口
2.修复子类化bug
3.添加数组查询接口
4.修复文件上传下载接口如果传空block会报错的bug

## v1.5.9（2015-07-01）
1.提供修改超时间接口
2.修复子类化bug
3.修复实时监听bug
4.提供自定义短信内容发送功能

## v1.5.8（2015-06-12）
1.添加短信功能
2.添加BmobObject子类化功能
3.修复缓存查询部分bug
4.修复云端代码无法同步bug
5.第三方登录添加微信登录


## v1.5.7（2015-05-14）
1.添加BQL查询功能
2.开放模糊查询功能

## v1.5.6（2015-05-04）
1.修改文件操作头文件部分注释；
2.修复模拟器下有时无法上传文件的问题。

## v1.5.5（2015-04-24）
1.增加统计查询方法
2.修复部分bug

## v1.5.4 (2015-04-07)
1.增加批量上传方法
BmobFile
+(void)filesUploadBatchWithDataArray:(NSArray *)dataArray
                       progressBlock:(BmobFileBatchProgressBlock)progress
                         resultBlock:(BmobFileBatchResultBlock)block;

BmobFilePro
+(void)uploadFilesWithDatas:(NSArray *)dataArray
                resultBlock:(BmobBatchFileUploadResultBlock)block
                   progress:(BmobIndexAndProgressBlock)progress;
2.修复其他问题

## v1.5.3 (2015-03-05)
1.修复蜂窝网络下可能会出现的使用新版文件上传文件，上传不了的问题
2.修复在某些情况下用户可能无法更新表内容的问题
## v1.5.2 (2015-02-07)
1.兼容1.5.1跟1.5.1之前的版本，即可以监听到通知再调用请求方法，也可以直接调用请求方法

## v1.5.1 (2015-01-23)
1.添加初始化完成后通知kBmobInitSuccessNotification，kBmobInitFailNotification
2.修改更新用户后本地用户可能会为空的问题
注意：
因为1.5.0之后的版本新增了加密功能，所以在还没初始化完成的时候请求接口会出现问题。
故开发者可以监听此通知，获取成功通知的时候再进行其他接口的请求。

## v1.5.0 (2015-01-17)
1.增加数据加密，建议使用新版本
2.BmobProFile添加开启验证后得到的url方法

## v1.4.13(2015-01-05)
1.新增文件管理类BmobProFile，提供多种上传方法等
## v1.4.12(2014-12-25)
1.修复无网络时获取服务器时间出现的问题
## v1.4.11(2014-12-17)
1.修改安全认证方法，注册方式可换回原来的方法,建议使用新版本
 NSString *appKey = @"xxxx";
[Bmob registerWithAppKey:appKey];
2.修复云端代码同步方法与异步方法数据格式不一样的问题
## v1.4.10(2014-12-9)
1.增加安全认证的功能，注册应用方式修改为
```
    NSString *appKey = @"xxxx";
#if DEBUG
    [Bmob registerWithAppKey:appKey];
#else
    [Bmob registerWithAppKeyReleaseMode:appKey];
#endif
```
2.文件分片上传功能新增进度的方法。进度的范围为（0.0f-1.0f）
3.新增批量上传的方法
4.BmobQuery新增-(void)whereKeySExists:(NSArray *)keys;
和-(void)whereKeysDoesNotExist:(NSArray *)keys; 方法


## v1.4.9 (2014-10-20)
1.修复openudid冲突的问题
## v1.4.8 (2014-10-11)
1.修复用户更新函数在iOS6下可能出现的崩溃问题
2.修复已知的查询函数可能进入不了block的问题
## v1.4.7 (2014-10-10)
1.修复云端代码的问题
## v1.4.6 (2014-09-22)
修复本地缓存用户，更新后本地基本数据类型不一致的问题
## v1.4.5(2014-09-17)
修复一些问题及优化结构
## v1.4.4(2014-09-12)
修复v1.4.3的一些问题
## v1.4.3(2014-09-04)
1.批量添加批量更新，也能增加特殊类型

## v1.4.2 (2014-08-20)
1.BmobUser 添加获取邮箱是否已验证的方法
2.修复BmobUser有可能更新不成功的问题
## v1.4.1 (2014-08-05)
BmobUser类增加：
1.QQ，新浪微博账号注册登录Bmob的功能
2.关联QQ账号，微博账号功能
3.提供取消关联的功能
## v1.4.0 (2014-07-18)
1、增加数据实时功能，提供多种监听表变化的方法。
2、增加BmobEvent类别，监听事件后，开发者可在代理函数里进行操作。
3、依赖库需要添加多libicucore.dylib
## v1.3.15(2014-07-17)
1、BmobQuery的- (void)getObjectInBackgroundWithId:(NSString *)objectId
                              block:(BmobObjectResultBlock)block
也支持-(void)includeKey:(NSString *)key跟-(void)selectKeys:(NSArray*)keys了
## v1.3.14(2014-07-14)
1、修复2G网络下查询可能会crash的问题
## v1.3.13(2014-6-18)
1、修正一些bug
2、修正缓存查询可能存在的问题
## v1.3.12(2014-6-11)
1、BmobQuery新增自定义查询条件接口：-(void)queryWithAllConstraint:(NSDictionary*)conDictionary;
2、BmobQuery新增取消接口
## v1.3.11(2014-05-28)
1、修复更新可能不成功的问题
## v1.3.10(2014-05-27)
1、BmobFile类添加分片上传的方法
2、添加BmobACL权限和BmobRole角色管理类
3、添加BmobImage图像处理类，提供多种方法处理图像
## v1.3.9(2014-05-21)
1、修复user表有关联关系，用户登录后更新不成功的问题
## v1.3.8 (2014-05-16)
1、修复云端代码同步没返回的bug
2、增加文件上传进度和取消上传函数
3、修复添加SDK出现多个警告的问题
## v1.3.7(2014-04-30)
1、增加BmobInstallation类别，注册需要推送设备。
2、增加BmobPush功能模块，可进行自定义推送。
## v1.3.6(2014-04-23)
1、BmobUser增加邮箱验证接口，只有在web端应用设置里开启邮箱验证才有效
2、增加BmobObjectBatch类，批量修改数据
## v1.3.5(2014-04-18)
1、添加x86_64位、arm64架构
2、添加指针类型，和relation类型
3、添加BmobObject对象列为Number时，可进行原子增加或减少的功能
4、添加BmobRelation类，为BmobObject之类关联关系
5、BmobQuery新增查询约束条件
- (void)whereKey:(NSString *)key matchesQuery:(BmobQuery *)query;
- (void)whereKey:(NSString *)key doesNotMatchQuery:(BmobQuery *)query;
- (void)whereObjectKey:(NSString *)key relatedTo:(BmobObject*)object;

## v1.3.4（2014-04-10）
1、Bmob.h 引入头文件
```
#import "BmobObject.h"
#import "BmobFile.h"
#import "BmobGeoPoint.h"
#import "BmobQuery.h"
#import "BmobUser.h"
#import "BmobCloud.h"
#import "BmobConfig.h"
```
## v1.3.3（2014-04-08）
1、增加组合查询并操作跟或操作
## v1.3.2(2014-04-06)
1、修复[BmobUser getCurrentObject]与 之前版本不兼容的问题
## v1.3.1(2014-04-04)
1、修复BmobFile url的相关bug
2、增加BmobQuery约束条件：
//  设置查询后要返回的key
-(void)selectKeys:(NSArray*)keys;
//指定的key的值是存在的
- (void)whereKeyExists:(NSString *)key;
// 指定的key的值是不存在的
- (void)whereKeyDoesNotExist:(NSString *)key;

## v1.3.0
1、修复BmobUser无法重置密码的bug
## v1.2.91
1、修正一些bug
## v1.2.9
1、Bmob类增加获取服务器时间接口
## v1.2.8
1、修复登陆失败后没返回错误信息
## v1.2.7(2014-03-05)
1、修复上传文件失败的bug
2、修复BmobObject 函数-(void)setObject:(id)obj forKey:(NSString*)aKey;obj为nil时，crash的问题
3、修复某些字符无法保存的问题
4、修复BmobFile 路径没有文件时crash的问题
5、BmobFile增加saveInBackground方法
## v1.2.6(2014-03-03)
1、修复添加NSDate类型失败的问题

2、BmobObject类添加-(void)saveAllWithDictionary:(NSDictionary*)dic;方法，支持批量添加数据


## v1.2.5
(2014-02-25)
1.修复在非主线程block没回调的问题


## v1.2.4
(2014-02-24)
1、使用自带访问网络的类替代部分第三方库，有base64、jsonkit、asihttprequest，减少冲突

2、调用BmobObject 的saveInBackground和saveInBackgroundWithResultBlock函数后，回填objectId，createdAt,updatedAt等


## v1.2.3（2014-02-14）
1.修复BmobUser 更新属性后本地没更新的bug

2.修改地理位置查询，排序结果从近到远，而不是根据updateAt降序排序




## v1.2.2（2014-01-12）
1.优化初始化函数

## v1.2.1（2014-01-02）
1.新增云端代码功能
2.优化性能，减少冗余

## v1.2.0（2013-12-02）
1.更改静态库为framework，减少体积
2.调整调用函数，更稳定更便捷
3.增加完善部分错误信息回调接口

## v1.1.7(2013-11-27)
1.解决打包出现的bug
2.优化相关回调函数

## v1.1.6(2013-11-26)
1、增加稳定性，优化代码结构

2、BmobQuery增加查询用户函数+(BmobQuery*)queryForUser;

3、新增加密码重置功能

4、新增用户登陆功能，登陆成功返回个人信息
5、新增接口请求数据统计

## v1.1.5(2013-11-06)
1、修复在循环中使用BmobQuery:- (void)getObjectInBackgroundWithId:(NSString *)objectId
                              block:(BmobObjectResultBlock)block;
遇到的问题



## v1.1.4(2013-10-29)

1、新增Count查询功能

2、新增地理位置查询功能

3、修改BmobGeo类初始化方法与web端显示不一致的问题



## v1.1.3(2013-10-17)
1.修复BmobObject取特殊类型属性错误的bug
2.修复上传时会更新createdAt的问题

## v1.1.2(2013-10-11)

1、修复BmobObject类updatedAt、createdAt类型问题


## v1.1.1(2013-10-09)
1、对网络传输的优化



## v1.1.0(2013-09-22)
1、BmobFile类添加了初始化方法：-(id)initWithClassName:(NSString *)className withFileData:(NSData*)data;可以直接上传二进制数据；
2、修复了BmobQuery类中- (void)findObjectsInBackgroundWithBlock:(BmobObjectArrayResultBlock)block;得到的数组中的对象不能更新的bug；


