## 注册Bmob帐号
在网址栏输入www.bmobapp.com或者在百度输入Bmob进行搜索，打开Bmob官网后，点击右上角的“注册”，在跳转页面填入你的姓名、邮箱、设置密码，确认后到你的邮箱激活Bmob账户，你就可以用Bmob轻松开发应用了。

![](image/rumen_zhuce.png)

## 网站后台创建应用

登录账号进入bmob后台后，点击后台界面左上角“创建应用”，在弹出框输入你应用的名称，然后确认，你就拥有了一个等待开发的应用。

![](image/rumen_chuangjian.png)

## 获取应用密钥和下载SDK

选择你要开发的应用，进入该应用

![](image/rumen_miyue_1.png)

在跳转页面，进入设置/应用密钥，点击复制，即可得到Application ID

![](image/rumen_miyue_2.png)


获取Application ID后，下载SDK，开发者可以根据自己的需求选择相应的iOS SDK 或Android SDK，点击下载即可。

![](image/xiazai.png)

## 安装BmobSDK

### 直接添加类库方式使用BmobSDK

1)将BmobSDK引入项目:

在你的XCode项目工程中，添加BmobSDK.framework

2)添加使用的系统framework:

在你的XCode工程中Project ->TARGETS -> Build Phases->Link Binary With Libraries引入CoreLocation.framework、Security.framework、CoreGraphics.framework、MobileCoreServices.framework、CFNetwork.framework、CoreTelephony.framework、SystemConfiguration.framework、libz.1.2.5.tbd、libicucore.tbd、libsqlite3.tbd、libc++.tbd、photos.framework

### 使用CocoaPods安装BmobSDK

如何使用CocoaPods安装BmobSDK可查看 [我们提供的文档](https://github.com/bmob/Bmob-iOS-SDK)


## 设置应用的BmobKey
在你的XCode工程中的AppDelegate.m文件中创建应用Key，填入申请的授权Key（SDK使用的是应用密钥里的Application ID），示例如下：

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions{
  [Bmob resetDomain:@"https://open.cctvcloud.cn"];
	[Bmob registerWithAppKey:@"申请的Application ID"];
	return YES;
}
```
这里需要注意的是，`open.cctvcloud.cn`是Bmob提供的测试域名，只有`1000`次的测试请求，正式上线后需要使用自己的备案域名。

也可以在在main.m文件中，引入头文件 `#import <BmobSDK/Bmob.h>`

```
int main(int argc, char * argv[])
{

    @autoreleasepool {
       [Bmob resetDomain:@"https://open.cctvcloud.cn"];
    	 NSString *appKey = @"申请的Application ID";
   		 [Bmob registerWithAppKey:appKey];

       return UIApplicationMain(argc, argv, nil, NSStringFromClass([AppDelegate     				class]));
	}
}
```

## 添加一行数据

```
//往GameScore表添加一条playerName为小明，分数为78的数据
BmobObject *gameScore = [BmobObject objectWithClassName:@"GameScore"];
[gameScore setObject:@"小明" forKey:@"playerName"];
[gameScore setObject:@78 forKey:@"score"];
[gameScore setObject:[NSNumber numberWithBool:YES] forKey:@"cheatMode"];
[gameScore saveInBackgroundWithResultBlock:^(BOOL isSuccessful, NSError *error) {
	//进行操作
}];
```

## 获取一行数据

```
//查找GameScore表
BmobQuery   *bquery = [BmobQuery queryWithClassName:@"GameScore"];
//查找GameScore表里面id为0c6db13c的数据
[bquery getObjectInBackgroundWithId:@"0c6db13c" block:^(BmobObject *object,NSError *error){
  if (error){
          //进行错误处理
  }else{
        //表里有id为0c6db13c的数据
      if (object) {
            //得到playerName和cheatMode
          NSString *playerName = [object objectForKey:@"playerName"];
          BOOL cheatMode = [[object objectForKey:@"cheatMode"] boolValue];
          NSLog(@"%@----%i",playerName,cheatMode);
      }
  }
}];
```

## 修改一行数据

```
//查找GameScore表
BmobQuery   *bquery = [BmobQuery queryWithClassName:@"GameScore"];
//查找GameScore表里面id为0c6db13c的数据
[bquery getObjectInBackgroundWithId:@"0c6db13c" block:^(BmobObject *object,NSError *error){
  //没有返回错误
  if (!error) {
      //对象存在
      if (object) {
			BmobObject *obj1 = [BmobObject objectWithoutDatatWithClassName:object.className objectId:object.objectId];
      	   //设置cheatMode为YES
          [obj1 setObject:[NSNumber numberWithBool:YES] forKey:@"cheatMode"];
          //异步更新数据
          [obj1 updateInBackground];
      }
  }else{
    //进行错误处理
  }
}];
```

## 删除一行数据

```
BmobQuery *bquery = [BmobQuery queryWithClassName:@"GameScore"];
[bquery getObjectInBackgroundWithId:@"0c6db13c" block:^(BmobObject *object, NSError *error){
    if (error) {
        //进行错误处理
    }
    else{
        if (object) {
            //异步删除object
            [object deleteInBackground];
        }
    }
}];
```

## 源码下载

案例教程和源码是快速入门的最简单方法，Bmob也为大家准备了相关的[案例教程和源码](https://github.com/bmob/bmob-ios-demo)，欢迎大家下载和查看。

