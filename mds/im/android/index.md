# 1、BmobNewIM SDK 介绍
> IM SDK 仅供学习交流使用

Android BmobIM SDK v2.0.0开始的版本统称为[BmobNewIM SDK](https://github.com/chaozhouzhang/bmob-newim-demo)，采用全新架构，设计更加合理规范，API更加简单易用，扩展性强。请确保您在使用BmobNewIM SDK之前已经了解此文档，如有疑问请加IM使用交流群[182897507]()咨询。

## 1.1、特点描述
| BmobNewIM SDK 特点     | 描述          |
|------------------------------|--------------------------------|
| 与用户系统解耦| 终端用户聊天的唯一标识是objectId，不再受限于Bmob的用户系统|
| 支持多账号登录、跨平台  |  支持单个设备多个账号登录，支持与iOS互通聊天      | 
| 支持多种格式的富媒体消息| 支持文本、图片、音频和地理位置等多种格式的富媒体消息|
| 允许开发者自定义消息   | 支持开发者自定义消息类型，方便开发者扩展本业务逻辑|                          
| API设计更加合理规范   | 全新的架构设计，API更加简单易用，较BmobOldIM SDK 进一步降低开发者使用成本|  

## 1.2、版本关系
IM SDK 使用Data SDK的BmobFile用于图片、语音等文件消息的发送，因此必须导入特定版本的Data SDK。

| IM SDK 版本     | Data SDK 版本          |
|------------------------------|--------------------------------|
| bmob-im:2.0.1 至 2.0.2| bmob-sdk:3.4.6-0304|  
| bmob-im:2.0.3 至 2.0.4| bmob-sdk:3.4.6|
| bmob-im:2.0.5| bmob-sdk:3.4.7-aar|
| bmob-im:2.0.6 至 2.0.8| bmob-sdk:3.5.5| 
| bmob-im:2.0.9| bmob-sdk:3.5.6|
| bmob-im:2.1.1| bmob-sdk:3.6.3| 
| bmob-im:2.1.4| bmob-sdk:3.7.3| 
| bmob-im:2.1.5| bmob-sdk:3.7.8| 
           
# 2、BmobNewIM SDK 集成
## 2.1、手动集成
### 2.1.1、下载Android BmobNewIM SDK开发包及其Demo
| 下载平台     | 下载地址          |
|------------------------------|--------------------------------|
| Github基于BmobNewIM SDK v2.1.4 的Demo|[bmob-newim-demo](https://github.com/chaozhouzhang/bmob-newim-demo)|
| Bmob基于BmobNewIM SDK v2.0.9 的Demo| [bmob-newim-demo](http://www.bmob.cn/site/sdk#android_im_sdk_tab)|
| Github基于BmobNewIM SDK v2.0.5 的Demo |[bmob-newim-demo ](https://github.com/bodismile/bmob-newim-demo)| 

### 2.1.2、解压Android BmobNewIM SDK开发包
| 文件     | 使用          |
|------------------------------|--------------------------------|
| libs| 外部依赖库，拷贝于工程的libs文件夹下|
| NewIM_V2.x.x_Demo|开发示例，开发环境是Android Studio，功能是陌生人以及好友聊天|
| bmob_im_notification_strings.xml|消息通知的资源文件，拷贝于项目的values文件夹下|

### 2.1.3、在app下的build.gradle文件中设置jni依赖库的目录，设置后点击Sync Now同步配置
```gradle
android {
    sourceSets {
        main.jniLibs.srcDirs = ['libs']
   }
}
```

## 2.2、自动集成
自IM SDK v2.0.5版本开始提供aar格式远程发布包，可以自动集成并结合Data SDK进行开发。

| IM SDK aar格式所包含文件     | Data SDK 版本          |
|------------------------------|--------------------------------|
| BmobNewIM_(版本号)_(发布日期).jar| BmobNewIM的核心SDK|
| androidasync_2.1.6.jar| 用于协议通讯|
| bmob_im_notification_strings.xml|用于消息通知|

### 2.2.1、在Project下的build.gradle文件中添加Bmob的maven仓库地址
```gradle
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:1.3.0'
    }
}

allprojects {
    repositories {
        jcenter()
        //TODO 集成：1.1、配置Bmob的maven仓库地址
                    maven {url 'https://dl.bintray.com/chaozhouzhang/maven' }
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
```

### 2.2.2、在app下的build.gradle文件中添加dependencies外部依赖库，添加后点击Sync Now同步配置
```gradle
	dependencies {
	    implementation fileTree(dir: 'libs', include: ['*.jar'])
		//TODO 集成：1.2、配置IM SDK（bmob-im）版本和Data SDK（bmob-sdk）版本：特定版本的bmob-im依赖特定版本的bmob-sdk
		implementation 'cn.bmob.android:bmob-im:2.1.5@aar'
		implementation 'cn.bmob.android:bmob-sdk:3.7.8'
	}
```


## 2.3、清单配置
### 2.3.1、 添加Bmob_APP_KEY
```xml
    <!--TODO 集成：1.3、配置Bmob平台的应用密钥-->
    <meta-data
        android:name="Bmob_APP_KEY"
        android:value="Bmob平台的Application ID" />
```

### 2.3.2、 添加权限
请注意在Android 6.0版本开始某些权限需要动态获取，详情请看Android Developwers官方文档，[android-6.0-changes](http://developer.android.com/intl/zh-cn/about/versions/marshmallow/android-6.0-changes.html)和[android-7.0-changes](https://developer.android.google.cn/about/versions/nougat/android-7.0-changes.html)。

```xml
 	 <!--TODO 1.4、配置IM SDK需要的权限-->
    <!--网络权限 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- 监听网络的变化 -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
    <!-- 设备休眠 -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <!-- sd卡存储-->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <!--摄像头-->
    <uses-permission android:name="android.permission.CAMERA" />
    <!--录音-->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <!--通知震动-->
    <uses-permission android:name="android.permission.VIBRATE" />

```
### 2.3.3、 添加service、receiver标签：
```xml
   <!--TODO 集成：1.5、配置IM SDK需要的广播和服务-->
  <receiver android:name="cn.bmob.newim.core.ConnectChangeReceiver" >
	    <intent-filter>
	        <action android:name="cn.bmob.action.RECONNECT" />
	        <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
	        <action android:name="android.intent.action.BOOT_COMPLETED" />
	        <action android:name="android.intent.action.USER_PRESENT" />
	    </intent-filter>
  </receiver>
  <service
    android:name="cn.bmob.newim.core.service.BmobIMService"
    android:process=":bmobcore" />
  <service
    android:name="cn.bmob.newim.core.service.NotifyService"
    android:process=":bmobcore" />
  <service android:name="cn.bmob.newim.core.service.ReConnectService" />
  <service android:name="cn.bmob.newim.core.service.HeartBeatService" />
```

## 2.4、代码配置
### 2.4.1、自定义消息接收器
1、请自定义消息接收器继承自`BmobIMMessageHandler`来处理服务器发来的消息和离线消息。

```java
//TODO 集成：1.6、自定义消息接收器处理在线消息和离线消息
public class DemoMessageHandler extends BmobIMMessageHandler{

    @Override
    public void onMessageReceive(final MessageEvent event) {
        //在线消息
    }

    @Override
    public void onOfflineReceive(final OfflineMessageEvent event) {
        //离线消息，每次connect的时候会查询离线消息，如果有，此方法会被调用
    }
}

```

### 2.4.2、初始化BmobNewIM SDK
在Application的onCreate方法中调用`BmobIM.init(context)`，并注册自定义的`DemoMessageHandler`。

```java
//TODO 集成：1.7、自定义Application，并在AndroidManifest.xml中配置
public class BmobIMApplication extends Application{

    @Override
    public void onCreate() {
        super.onCreate();
        //TODO 集成：1.8、初始化IM SDK，并注册消息接收器
        if (getApplicationInfo().packageName.equals(getMyProcessName())){
            BmobIM.init(this);
            BmobIM.registerDefaultMessageHandler(new DemoMessageHandler());
        }
    }

	/**
     * 获取当前运行的进程名
     * @return
     */
    public static String getMyProcessName() {
        try {
            File file = new File("/proc/" + android.os.Process.myPid() + "/" + "cmdline");
            BufferedReader mBufferedReader = new BufferedReader(new FileReader(file));
            String processName = mBufferedReader.readLine().trim();
            mBufferedReader.close();
            return processName;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
```

1. 初始化方法包含了DataSDK的初始化步骤，故无需再初始化DataSDK。
2. 最好判断只有主进程运行的时候才进行初始化，避免资源浪费。


# 3、BmobNewIM SDK 使用
## 3.1、案例流程图
![案例流程图](https://github.com/bmob/Bmob-Dev-docs/blob/master/im/Android/b_developdoc/image/IM.png?raw=true)

## 3.2、用户管理
BmobNewIM SDK只是即时通讯的消息收发渠道，本身并不提供用户系统，开发者可使用BmobSDK提供的用户管理方面功能，也可使用开发者自己的用户系统。

### 3.2.1、Bmob用户系统
1、Demo使用的是Bmob的用户登录系统，一旦有用户注册就会在_User表中生成一条数据。对应流程图中的注册/登录和退出登录。

2、Demo中搜索用户其实就是模糊搜索_User表上的数据，然后用列表展示结果。对应流程图中的搜索用户。

3、Demo中用户信息页面其实就是查询_User表上某条数据的详细信息进行显示，包括objectid，username，avatar等，如果该用户不是自己，则显示成功后可以在用户信息页面进行添加好友和陌生人聊天操作。对应流程图中的个人信息、用户信息。


### 3.2.2、BmobIMUserInfo介绍
BmobNewIM SDK内部会自动创建本地用户表`BmobIMUserInfo`，并对外提供查询、更新、删除等方法供开发者调用来操作本地用户表。

| 属性名     | 属性含义          |
|------------------------------|--------------------------------|
| id | 本地数据库用户表的id值，开发者无需关心 |
| userId| 用户唯一id（Demo中用的是BmobUser的objectId）|         
| name| 用户名 （Demo中是用的是BmobUser的username）|  
| avatar| 用户头像（Demo中是用的是BmobUser的avatar）|



### 3.2.3、更新本地用户信息
以下两种情况需要更新用户信息：
1. 当注册或登录成功并且成功连接到IM服务器后，需要更新下当前用户的信息到本地数据库的用户表中，这样才能通过getUserInfo方法获取到本地的用户信息。
2. 当接收到某人消息的时候，同样需要更新某人的用户信息到本地用户表中，否则在会话界面将默认显示的是用户的userId，也就是Demo中的BmobUser的objectId值。

#### 3.2.3.1、更新单一本地用户信息
```
//TODO 用户管理：2.7、更新本地用户资料，用于在会话页面、聊天页面以及个人信息页面显示
BmobIM.getInstance().updateUserInfo(BmobIMUserInfo info)
```
#### 3.2.3.2、批量更新本地用户信息
```
//TODO 用户管理：2.8、批量更新本地用户信息
BmobIM.getInstance().updateBatchUserInfo(List<BmobIMUserInfo> list)
```

### 3.2.4、获取本地用户信息
BmobNewIM SDK内部会自动创建了一个本地数据库用来存储用户信息，开发者需要先调用`updateUserInfo`更新用户信息到本地数据库中，才能通过`getUserInfo(uid)`获取到本地用户信息。
```
//TODO 用户管理：2.9、获取本地用户信息
BmobIM.getInstance().getUserInfo(String uid)
```

## 3.3、服务器连接
### 3.3.1、连接
登录成功、注册成功或处于登录状态重新打开应用后执行连接IM服务器的操作，调用`connect`方法，需要传入唯一用户标示`clientId`，Demo使用的是Bmob的用户登录系统`objectId`，。

```java
        //TODO 连接：3.1、登录成功、注册成功或处于登录状态重新打开应用后执行连接IM服务器的操作
        User user = BmobUser.getCurrentUser(context,User.class);
        if (!TextUtils.isEmpty(user.getObjectId())) {
            BmobIM.connect(user.getObjectId(), new ConnectListener() {
                @Override
                public void done(String uid, BmobException e) {
                    if (e == null) {
                        //连接成功
                    } else {
                    	 //连接失败
                        toast(e.getMessage());
                    }
                }
            });
        }
```

### 3.3.2、断开连接：
调用`disConnect`方法，客户端会断开与服务器之间的连接，再次聊天需要重新调用`connect`方法完成与服务器之间的连接。
```java
//TODO 连接：3.2、退出登录需要断开与IM服务器的连接
BmobIM.getInstance().disConnect();
```
### 3.3.3、监听服务器连接状态
调用`setOnConnectStatusChangeListener`方法即可监听到当前长链接的连接状态。

```java
//TODO 连接：3.3、监听连接状态，可通过BmobIM.getInstance().getCurrentStatus()来获取当前的长连接状态
BmobIM.getInstance().setOnConnectStatusChangeListener(new ConnectStatusChangeListener() {
                @Override
                public void onChange(ConnectionStatus status) {
                    toast(status.getMsg());
                    Logger.i(BmobIM.getInstance().getCurrentStatus().getMsg());
                }
            });
```

## 3.4、会话
### 3.4.1、创建会话入口
BmobNewIM SDK 采用会话（`BmobIMConversation`）管理消息(`BmobIMMessage`)的方式，即消息的发送、查询和删除等操作均在指定会话下进行，因此需要先获取指定会话信息`BmobIMUserInfo`后创建会话入口`(BmobIMConversation)conversationEntrance`。创建会话入口成功后跳转到聊天页面，根据会话入口获取消息管理`(BmobIMConversation)messageManager`，而后使用消息管理在聊天页面进行消息的发送、查询和删除等操作。


#### 3.4.1.1、创建暂态会话入口
暂态会话不会被保存到本地数据库中，只提供消息发送功能，不提供查询，删除等功能。一般用于`自定义消息的发送`，比如添加好友的请求，在对方还没有同意的情况下，你并不希望在自己的会话列表中显示该会话。

```java
//TODO 会话：4.1、创建一个暂态会话入口，发送添加好友请求，同意好友请求
BmobIMConversation conversationEntrance = BmobIM.getInstance().startPrivateConversation(info, true, null);
```

#### 3.4.1.2、创建常态会话入口
常态会话会被保存到本地数据库中，提供消息发送、查询，删除等功能。
```java
//TODO 会话：4.1、创建一个常态会话入口，好友聊天，陌生人聊天
BmobIMConversation conversationEntrance = BmobIM.getInstance().startPrivateConversation(info, null);
```

### 3.4.2、查询全部会话
```
//TODO 会话：4.2、查询全部会话
BmobIM.getInstance().loadAllConversation()
```
### 3.4.3、查询会话的未读消息数量
#### 3.4.3.1、查询指定会话下的未读消息数量
```
//TODO 会话：4.3、查询指定会话下的未读消息数
BmobIM.getInstance().getUnReadCount(String conversationId)
```
#### 3.4.3.2、查询全部会话的全部未读消息数
```
//TODO 会话：4.4、获取全部会话的未读消息数量
BmobIM.getInstance().getAllUnReadCount();
```

### 3.4.4、删除指定会话
```
//TODO 会话：4.5、删除会话，以下两种方式均可以删除会话
BmobIM.getInstance().deleteConversation(BmobIMConversation c);
BmobIM.getInstance().deleteConversation(String conversationId);
```

### 3.4.5、清空全部会话
```
//TODO 会话：4.6、清空全部会话，一般不会用到此方法
BmobIM.getInstance().clearAllConversation();
```

### 3.4.6、更新会话
```
//TODO 会话：4.7、更新会话资料-如果消息是暂态消息，则不更新会话资料

BmobIM.getInstance().updateConversation(conversation);
```

在与人私聊时，需要更新会话标题和会话图标及用户信息，可调用如下方法在`DemoMessageHandler`的全局消息接收器中进行统一更新。

```java
    /**
     * 更新用户资料和会话资料
     *
     * @param event
     * @param listener
     */
    public void updateUserInfo(MessageEvent event, final UpdateCacheListener listener) {
        final BmobIMConversation conversation = event.getConversation();
        final BmobIMUserInfo info = event.getFromUserInfo();
        final BmobIMMessage msg = event.getMessage();
        String username = info.getName();
        String title = conversation.getConversationTitle();
        //SDK内部将新会话的会话标题用objectId表示，因此需要比对用户名和私聊会话标题，后续会根据会话类型进行判断
        if (!username.equals(title)) {
            UserModel.getInstance().queryUserInfo(info.getUserId(), new QueryUserListener() {
                @Override
                public void done(User s, BmobException e) {
                    if (e == null) {
                        String name = s.getUsername();
                        String avatar = s.getAvatar();
                        conversation.setConversationIcon(avatar);
                        conversation.setConversationTitle(name);
                        info.setName(name);
                        info.setAvatar(avatar);
                        //TODO 会话：2.7、更新用户资料，用于在会话页面、聊天页面以及个人信息页面显示
                        BmobIM.getInstance().updateUserInfo(info);
                        //TODO 会话：4.7、更新会话资料-如果消息是暂态消息，则不更新会话资料
                        if (!msg.isTransient()) {
                            BmobIM.getInstance().updateConversation(conversation);
                        }
                    } else {
                        Logger.e(e);
                    }
                    listener.done(null);
                }
            });
        } else {
            listener.done(null);
        }
    }
```

## 3.5、消息
消息(`BmobIMMessage`)是所有消息的基类，其中`isTransient`属性来标识该条消息是否`自动保存到指定会话的本地数据库中`。

- 设置为`true`，表明是暂态消息，那么这条消息`并不会自动保存到指定会话的本地消息数据库中`，SDK只负责发送和接收。
- 设置为`false`，表明不是暂态消息，那么这条消息`会自动保存到指定会话的本地消息数据库中`，并提供查询和删除操作。

以下BmobNewIM SDK目前支持的消息类型。

| 消息类型     | 消息类名          |
|------------------------------|--------------------------------|
| 文本| BmobIMTextMessage|
| 文件|BmobIMFileMessage|         
| 图像| BmobIMImageMessage|  
| 音频| BmobIMAudioMessage|
| 视频| BmobIMVideoMessage|
| 地理位置| BmobIMLocationMessage| 

### 3.5.1、获取消息管理
BmobNewIM SDK 采用会话（`BmobIMConversation`）管理消息(`BmobIMMessage`)的方式，即消息的发送、查询和删除等操作均在指定会话下进行，因此需要先获取指定会话信息`BmobIMUserInfo`后创建会话入口`(BmobIMConversation)conversationEntrance`。创建会话入口成功后跳转到聊天页面，根据会话入口获取消息管理`(BmobIMConversation)messageManager`，而后使用消息管理在聊天页面进行消息的发送、查询和删除等操作。


```
//TODO 消息：5.1、根据会话入口获取消息管理，在聊天页面以及发送添加好友和同意添加好友请求时使用 
BmobIMConversation messageManager = BmobIMConversation.obtain(BmobIMClient.getInstance(), conversationEntrance);
```

### 3.5.2、查询指定会话的聊天记录
```java
//首次加载，可设置msg为null，下拉刷新的时候，可用消息表的第一个msg作为刷新的起始时间点，默认按照消息时间的降序排列
//TODO 消息：5.2、查询指定会话的消息记录
mConversationManager.queryMessages(msg, limit, new MessagesQueryListener() {
            @Override
            public void done(List<BmobIMMessage> list, BmobException e) {
                sw_refresh.setRefreshing(false);
                if (e == null) {
                    if (null != list && list.size() > 0) {
                        adapter.addMessages(list);
                        adapter.notifyDataSetChanged();
                        layoutManager.scrollToPositionWithOffset(list.size() - 1, 0);
                    }
                } else {
                    toast(e.getMessage() + "(" + e.getErrorCode() + ")");
                }
            }
        });
```

### 3.5.3、删除指定会话的聊天记录
```java
//TODO 消息：5.3、删除指定聊天消息
mConversationManager.deleteMessage(BmobIMMessage msg)

//删除一条或多条聊天消息
mConversationManager.deleteBatchMessage(List<BmobIMMessage> msgs)

//清空该会话下的聊天消息，允许保留会话
mConversationManager.clearMessage(boolean isKeepConversion,MessageListener listener)
```

### 3.5.4、更新指定会话的所有消息为已读状态
可以在聊天页面的`onDestory`方法中调用该方法`更新该会话的的所有消息为已读状态`：
```
//TODO 消息：5.4、更新此会话的所有消息为已读状态
mConversationManager.updateLocalCache();
```

## 3.6、消息发送
### 3.6.1、文本消息
文本消息可以是纯文本，也可以是包含表情的文本消息，通过`BmobIMTextMessage`的`setContent`方法设置内容来构建`BmobIMTextMessage`实例，再调用消息管理`BmobIMConversation`的`sendMessage`方法发送。

```java
    /**
     * 发送文本消息
     */
    private void sendMessage() {
        String text = edit_msg.getText().toString();
        if (TextUtils.isEmpty(text.trim())) {
            toast("请输入内容");
            return;
        }
        //TODO 发送消息：6.1、发送文本消息
        BmobIMTextMessage msg = new BmobIMTextMessage();
        msg.setContent(text);
        //可随意设置额外信息
        Map<String, Object> map = new HashMap<>();
        map.put("level", "1");
        msg.setExtraMap(map);
        mConversationManager.sendMessage(msg, listener);
    }
```

### 3.6.2、图片消息
图片可以是通过系统拍照或本地相册中获取的本地图片地址，也可以使用网络上某个有效的图片地址。
#### 3.6.2.1、发送本地图片
使用系统拍照功能或从本地相册中获取到本地图片地址(`localPath`)，然后调用构造方法`BmobIMImageMessage（String localPath）`来创建`BmobIMImageMessage`实例。

```java
    /**
     * 发送本地图片文件
     */
    public void sendLocalImageMessage() {
        //TODO 发送消息：6.2、发送本地图片消息
        //正常情况下，需要调用系统的图库或拍照功能获取到图片的本地地址，开发者只需要将本地的文件地址传过去就可以发送文件类型的消息
        BmobIMImageMessage image = new BmobIMImageMessage("/storage/emulated/0/netease/cloudmusic/网易云音乐相册/小梦大半_1371091013186741.jpg");
        mConversationManager.sendMessage(image, listener);
    }
```

#### 3.6.2.2、发送远程图片URL
调用BmobIMImageMessage的`setRemoteUrl`方法设置远程图片URL来创建`BmobIMImageMessage`实例。

```java
    /**
     * 直接发送远程图片地址
     */
    public void sendRemoteImageMessage() {
        //TODO 发送消息：6.3、发送远程图片消息
        BmobIMImageMessage image = new BmobIMImageMessage();
        image.setRemoteUrl("https://avatars3.githubusercontent.com/u/11643472?v=4&u=df609c8370b3ef7a567457eafd113b3ba6ba3bb6&s=400");
        mConversationManager.sendMessage(image, listener);
    }
```
### 3.6.3、语音消息
语音可以是通过录制音频得到的本地音频地址，也可以使用网络上某个有效的音频地址。

#### 3.6.3.1、发送本地音频文件：
```java
    /**
     * 发送本地音频文件
     */
    private void sendLocalAudioMessage() {
        BmobIMAudioMessage audio = new BmobIMAudioMessage("此处替换为你本地的音频文件地址");
        //TODO 发送消息：6.4、发送本地音频文件消息
        mConversationManager.sendMessage(audio, listener);
    }
```

#### 3.6.3.2、发送远程音频URL地址
```java
    /**
     * 发送远程音频文件
     */
    private void sendRemoteAudioMessage(){
        //TODO 发送消息：6.5、发送本地音频文件消息
        BmobIMAudioMessage audio = new BmobIMAudioMessage();
        audio.setRemoteUrl("此处替换为你远程的音频文件地址");
        mConversationManager.sendMessage(audio, listener);
    }
```

### 3.6.4、视频消息
视频可以是通过录制视频得到的本地视频地址，也可以使用网络上某个有效的视频地址。

#### 3.6.4.1、发送本地视频文件：
```java
    /**
     * 发送本地视频文件
     */
    private void sendLocalVideoMessage() {
        BmobIMVideoMessage video = new BmobIMVideoMessage("此处替换为你本地的视频文件地址");
        //TODO 发送消息：6.6、发送本地视频文件消息
        mConversationManager.sendMessage(video, listener);
    }
```

#### 3.6.4.2、发送远程视频URL地址
```java
    /**
     * 发送远程视频文件
     */
    private void sendRemoteVideoMessage(){
        //TODO 发送消息：6.7、发送本地音频文件消息
        BmobIMAudioMessage audio = new BmobIMAudioMessage();
        audio.setRemoteUrl("此处替换为你远程的音频文件地址");
        mConversationManager.sendMessage(audio, listener);
    }
```

### 3.6.4、文件消息
文件可以是本地文件地址，也可以使用网络上某个有效的文件地址。
图片、音频、视频文件消息其实都是文件消息，本地文件的发送其实是SDK先把文件上传到服务器，再把文件服务器地址发送给接收方，接收方收到文件地址的消息后再进行下载和显示。而远程文件仅仅只是省去了文件上传这一步骤而已。

#### 3.6.4.1、发送本地文件：
```java
   /**
     * 发送本地文件
     */
    public void sendLocalFileMessage() {
        //TODO 发送消息：6.8、发送本地文件消息
        BmobIMFileMessage file = new BmobIMFileMessage("此处替换为你本地的文件地址");
        mConversationManager.sendMessage(file, listener);
    }
```

#### 3.6.4.2、发送远程文件URL地址
```java
    /**
     * 发送远程文件
     */
    public void sendRemoteFileMessage() {
        //TODO 发送消息：6.9、发送远程文件消息
        BmobIMFileMessage file = new BmobIMFileMessage();
        file.setRemoteUrl("此处替换为你远程的文件地址");
        mConversationManager.sendMessage(file, listener);
    }
```
### 3.6.5、地理位置消息
地理位置可以通过任意地图SDK获取到经纬度，详细地址等信息，然后调用`BmobIMLocationMessage(String address,double latitude,double longitude)`构造方法构建`BmobIMLocationMessage`实例，再调用`BmobIMConversation`的`sendMessage`方法发送。：

```java
    /**
     * 发送地理位置消息
     */
    public void sendLocationMessage() {
        //TODO 发送消息：6.10、发送位置消息
        //测试数据，真实数据需要从地图SDK中获取
        BmobIMLocationMessage location = new BmobIMLocationMessage("广州番禺区", 23.5, 112.0);
        Map<String, Object> map = new HashMap<>();
        map.put("from", "百度地图");
        location.setExtraMap(map);
        mConversationManager.sendMessage(location, listener);
    }
```


## 3.7、自定义消息
### 3.7.1、设置额外信息
有些时候，开发者需要在发送消息时携带一些额外信息，例如`发送方的设备类型、图片的拍摄地点或者音频的来源`等，那么开发者可以通过 `BmobIMExtraMessage.extraMap`属性来解决，任何继承`BmobIMExtraMessage`类的消息均支持设置额外信息。
```
	BmobIMAudioMessage audio =new BmobIMAudioMessage();
	image.setRemoteUrl("远程音频地址");
	//设置音频文件的来源
	Map<String,Object> map =new HashMap<>();
	map.put("from", "优酷");
	//TODO 自定义消息：7.1、给消息设置额外信息
	audio.setExtraMap(map);
	mConversationManager.sendMessage(audio, listener);
```

### 3.7.2、自定义消息类型
如果设置额外信息无法满足开发者的需求，那么开发者也可以自定义自己的消息类型。
1. 继承自`BmobIMExtraMessage`类；
2. 重写`getMsgType`方法，填写自定义的消息类型；
3. 重写`isTransient`方法，定义是否是暂态消息。
```
  //TODO 自定义消息：7.2、自定义消息类型，用于发送添加好友请求
	public class AddFriendMessage extends BmobIMExtraMessage{
	
	    @Override
	    public String getMsgType() {
	        return "add";
	    }
	
	    @Override
	    public boolean isTransient() {
	        return true;
	    }
	
	    public AddFriendMessage(){}
	
	}
```

## 3.8、消息接收
### 3.8.1、自定义消息接收器
#### 3.8.1.1、自定义消息接收器继承自`BmobIMMessageHandler`来处理服务器发来的消息和离线消息。

```java
//TODO 消息接收：8.1、自定义全局消息接收器
public class DemoMessageHandler extends BmobIMMessageHandler{

    private Context context;
    public DemoMessageHandler(Context context) {
        this.context = context;
    }

    @Override
    public void onMessageReceive(final MessageEvent event) {
        //接收处理在线消息
    }

    @Override
    public void onOfflineReceive(final OfflineMessageEvent event) {
        //接收处理离线消息，每次调用connect方法时会查询一次离线消息，如果有，此方法会被调用
    }
}

```
#### 3.8.1.2、单个页面的自定义接收器
使用IM SDK不仅可以使用`BmobIMMessageHandler`方式来注册全局的消息接收器，还可以使用`MessageListHandler`为单个页面注册消息接收器，具体步骤如下：

1. 在`Activity/Fragment`中实现`MessageListHandler`接口；
2. 在`onResume`方法中添加页面消息监听器：`BmobIM.getInstance().addMessageListHandler(this)`；
3. 在`onPause`方法中移除页面消息监听器：`BmobIM.getInstance().removeMessageListHandler(this)`；
4. 在`MessageListHandler`接口的`onMessageReceive`方法中做相关的操作。

具体示例可查看NewIMDemo中的`ChatActivity`类：

```java
//TODO 消息接收：8.2、单个页面的自定义接收器
@Override
public void onMessageReceive(List<MessageEvent> list) {
    //接收处理在线、离线消息
}

```
### 3.8.2、应用内消息接收
SDK内部使用EventBus来进行应用内消息的分发，故在应用内需要接收消息的地方注册和解注册EventBus即可，不过SDK并没有集成EventBus，开发者需要在自己的项目中另外集成EventBus。

SDK内部有两种EventBus事件：`MessageEvent（在线消息）`、`OfflineMessageEvent(离线消息)`。

1、注册EventBus

```
EventBus.getDefault().register(this);

```
2、注销EventBus

```java
EventBus.getDefault().unregister(this);

```

3、处理在线消息

```java
/**聊天消息接收事件
 * @param event
 */
//TODO 消息接收：8.3、通知有在线消息接收
@Subscribe
public void onEventMainThread(MessageEvent event){
    //处理聊天消息
}

```

4、处理离线消息

```java

/**离线消息接收事件
 * @param event
 */
//TODO 消息接收：8.4、通知有离线消息接收
@Subscribe
public void onEventMainThread(OfflineMessageEvent event){
    //处理离线消息
}

```

### 3.8.3、应用外通知栏提醒
`BmobNotificationManager`类提供展示通知栏的方法，你也可以使用自己的展示通知栏方法。

1、多个用户的多条消息合并成一条通知：有XX个联系人发来了XX条消息。
                           
```java
/**显示通知：多个用户的多条消息合并显示一条通知
 * @param event 某个消息事件：包含消息、会话及发送用户的信息
 * @param intent 跳转intent
 */
 //TODO 消息接收：8.5、多个用户的多条消息合并成一条通知：有XX个联系人发来了XX条消息
 BmobNotificationManager.getInstance(context).showNotification(MessageEvent event,Intent pendingIntent);
```
2、自定义通知消息：始终只有一条通知，新消息覆盖旧消息。

```java
 /**显示通知
 * @param largerIcon 通知栏图标 开发者可传应用图标，也可以将聊天头像转成bitmap
 * @param title 标题
 * @param content 内容
 * @param ticker 状态栏上显示的内容
 * @param intent 跳转的intent
 */
 //TODO 消息接收：8.6、自定义通知消息：始终只有一条通知，新消息覆盖旧消息
BmobNotificationManager.getInstance(context).showNotification(Bitmap largerIcon,String title, String content, String ticker,Intent intent);
```

## 3.9、好友管理
BmobNewIM SDK中并没有集成好友管理相关的功能，为了方便开发者建立基于好友之间的聊天模式，在Demo中使用Data SDK新建了`Friend`表来进行好友管理。

```java
/**好友表
 * @author smile
 * @project Friend
 * @date 2016-04-26
 */
//TODO 好友管理：9.1、创建好友表
public class Friend extends BmobObject{
	 //用户
    private User user;
	 //好友
    private User friendUser;
    //getter setter...
}
```

在控制台建表的时候请设置唯一键为user和friendUser唯一，以防出现多次发送请求消息重复添加相同用户为好友的情况。

![设置Friend表唯一键](https://github.com/bmob/Bmob-Dev-docs/blob/master/im/Android/b_developdoc/image/Friend.png?raw=true)

### 3.9.1、获取好友列表
```java
/**
 * 查询好友
 * @param listener
 */
//TODO 好友管理：9.2、查询好友
public void queryFriends(final FindListener<Friend> listener){
    BmobQuery<Friend> query = new BmobQuery<>();
    User user =BmobUser.getCurrentUser(getContext(), User.class);
    query.addWhereEqualTo("user", user);
    query.include("friendUser");
    query.order("-updatedAt");
    query.findObjects(getContext(), new FindListener<Friend>() {
        @Override
        public void onSuccess(List<Friend> list) {
            if (list != null && list.size() > 0) {
                listener.onSuccess(list);
            } else {
                listener.onError(0, "暂无联系人");
            }
        }

        @Override
        public void onError(int i, String s) {
            listener.onError(i, s);
        }
    });
}
```


### 3.9.2、删除好友
```java
/**
 * 删除好友
 * @param f
 * @param listener
 */
//TODO 好友管理：9.3、删除好友
public void deleteFriend(Friend f,DeleteListener listener){
    Friend friend =new Friend();
    friend.delete(getContext(),f.getObjectId(),listener);
}
```

### 3.9.3、添加好友

#### 3.9.3.1、本地数据库存储添加好友请求
Demo中创建了一个`NewFriend`的本地数据库类用来存储所有的添加好友请求。
```java
/**本地的好友请求表
 * @author :smile
 * @project:NewFriend
 * @date :2016-04-26-17:28
 */
//TODO 好友管理：9.4、本地数据库存储添加好友的请求
public class NewFriend implements java.io.Serializable {

    private Long id;
	//用户uid
    private String uid;
	//留言消息
    private String msg;
	//用户名
    private String name;
	//头像
    private String avatar;
	//状态：未读、已读、已添加、已拒绝等
    private Integer status;
	//请求时间
    private Long time;
    
    //getter setter...
}

```
#### 3.9.3.2、自定义添加好友的消息类型
Demo中创建了一个`AddFriendMessage`类来展示如何发送自定义的添加好友请求的消息。

```java
/**添加好友请求-自定义消息类型
 * @author :smile
 * @project:AddFriendMessage
 * @date :2016-01-30-17:28
 */
//TODO 好友管理：9.5、自定义添加好友的消息类型
public class AddFriendMessage extends BmobIMExtraMessage{

    public AddFriendMessage(){}

    @Override
    public String getMsgType() {
		  //自定义一个`add`的消息类型
        return "add";
    }

    @Override
    public boolean isTransient() {
        //设置为true,表明为暂态消息，那么这条消息并不会保存到本地db中，SDK只负责发送出去
        return true;
    }
	
	...

}

```
#### 3.9.3.3、自定义同意添加好友的消息类型
Demo中创建了一个`AgreeAddFriendMessage`类来展示如何发送自定义的同意添加好友请求的消息，并在对方的本地会话表中新增消息类型。

```java
/**同意添加好友请求-仅仅只用于发送同意添加好友的消息
 * @author smile
 * @project AgreeAddFriendMessage
 * @date 2016-03-04-10:41
 */
//TODO 好友管理：9.6、自定义同意添加好友的消息类型
public class AgreeAddFriendMessage extends BmobIMExtraMessage{

    //以下均是从extra里面抽离出来的字段，方便获取
    private String uid;//最初的发送方
    private Long time;
    private String msg;//用于通知栏显示的内容

    @Override
    public String getMsgType() {
        //自定义一个`agree`的消息类型
        return "agree";
    }

    @Override
    public boolean isTransient() {
        //此处将同意添加好友的请求设置为false，为了演示怎样向会话表和消息表中新增一个类型，在对方的会话列表中增加`我通过了你的好友验证请求，我们可以开始聊天了!`这样的类型
        return false;
    }

    //getter setter...

    ...
}

```

### 3.8.4、发送添加好友的请求
```java
    /**
     * 发送添加好友的请求
     */
    //TODO 好友管理：9.7、发送添加好友请求
    private void sendAddFriendMessage() {
        //TODO 会话：4.1、创建一个暂态会话入口，发送好友请求
        BmobIMConversation conversationEntrance = BmobIM.getInstance().startPrivateConversation(info, true, null);
        //TODO 消息：5.1、根据会话入口获取消息管理，发送好友请求
        BmobIMConversation messageManager = BmobIMConversation.obtain(BmobIMClient.getInstance(), conversationEntrance);
        AddFriendMessage msg = new AddFriendMessage();
        User currentUser = BmobUser.getCurrentUser(User.class);
        msg.setContent("很高兴认识你，可以加个好友吗?");//给对方的一个留言信息
        //TODO 这里只是举个例子，其实可以不需要传发送者的信息过去
        Map<String, Object> map = new HashMap<>();
        map.put("name", currentUser.getUsername());//发送者姓名
        map.put("avatar", currentUser.getAvatar());//发送者的头像
        map.put("uid", currentUser.getObjectId());//发送者的uid
        msg.setExtraMap(map);
        messageManager.sendMessage(msg, new MessageSendListener() {
            @Override
            public void done(BmobIMMessage msg, BmobException e) {
                if (e == null) {//发送成功
                    toast("好友请求发送成功，等待验证");
                } else {//发送失败
                    toast("发送失败:" + e.getMessage());
                }
            }
        });
    }
```
### 3.8.5、发送同意添加好友的请求
以下摘自`NewFriendHolder(cn.bmob.imdemo.adapter)`类：

```java
    /**
     * 发送同意添加好友的消息
     */
    //TODO 好友管理：9.8、发送同意添加好友
    private void sendAgreeAddFriendMessage(final NewFriend add, final SaveListener<Object> listener) {
        BmobIMUserInfo info = new BmobIMUserInfo(add.getUid(), add.getName(), add.getAvatar());
        //TODO 会话：4.1、创建一个暂态会话入口，发送同意好友请求
        BmobIMConversation conversationEntrance = BmobIM.getInstance().startPrivateConversation(info, true, null);
        //TODO 消息：5.1、根据会话入口获取消息管理，发送同意好友请求
        BmobIMConversation messageManager = BmobIMConversation.obtain(BmobIMClient.getInstance(), conversationEntrance);
        //而AgreeAddFriendMessage的isTransient设置为false，表明我希望在对方的会话数据库中保存该类型的消息
        AgreeAddFriendMessage msg = new AgreeAddFriendMessage();
        final User currentUser = BmobUser.getCurrentUser(User.class);
        msg.setContent("我通过了你的好友验证请求，我们可以开始 聊天了!");//这句话是直接存储到对方的消息表中的
        Map<String, Object> map = new HashMap<>();
        map.put("msg", currentUser.getUsername() + "同意添加你为好友");//显示在通知栏上面的内容
        map.put("uid", add.getUid());//发送者的uid-方便请求添加的发送方找到该条添加好友的请求
        map.put("time", add.getTime());//添加好友的请求时间
        msg.setExtraMap(map);
        messageManager.sendMessage(msg, new MessageSendListener() {
            @Override
            public void done(BmobIMMessage msg, BmobException e) {
                if (e == null) {//发送成功
                    //TODO 3、修改本地的好友请求记录
                    NewFriendManager.getInstance(context).updateNewFriend(add, Config.STATUS_VERIFIED);
                    listener.done(msg, e);
                } else {//发送失败
                    Logger.e(e.getMessage());
                    listener.done(msg, e);
                }
            }
        });
    }
```

### 3.8.6、接收并处理好友相关的请求

```java
    /**
     * 处理自定义消息类型
     *
     * @param msg
     */
    //TODO 好友管理：9.9、接收并处理好友相关的请求
    private void processCustomMessage(BmobIMMessage msg, BmobIMUserInfo info) {
        //消息类型
        String type = msg.getMsgType();
        //发送页面刷新的广播
        EventBus.getDefault().post(new RefreshEvent());
        //处理消息
        if (type.equals(AddFriendMessage.ADD)) {//接收到的添加好友的请求
            NewFriend friend = AddFriendMessage.convert(msg);
            //本地好友请求表做下校验，本地没有的才允许显示通知栏--有可能离线消息会有些重复
            long id = NewFriendManager.getInstance(context).insertOrUpdateNewFriend(friend);
            if (id > 0) {
                showAddNotify(friend);
            }
        } else if (type.equals(AgreeAddFriendMessage.AGREE)) {//接收到的对方同意添加自己为好友,此时需要做的事情：1、添加对方为好友，2、显示通知
            AgreeAddFriendMessage agree = AgreeAddFriendMessage.convert(msg);
            addFriend(agree.getFromId());//添加消息的发送方为好友
            //这里应该也需要做下校验--来检测下是否已经同意过该好友请求，我这里省略了
            showAgreeNotify(info, agree);
        } else {
            Toast.makeText(context, "接收到的自定义消息：" + msg.getMsgType() + "," + msg.getContent() + "," + msg.getExtra(), Toast.LENGTH_SHORT).show();
        }
    }
```

### 3.8.7、添加到Friend表中
在同意对方和收到对方同意的时候，需要添加好友关系到Friend表中。
#### 3.8.7.1、同意对方的添加好友请求，添加对方为好友发送同意
```java
    /**
     * TODO 好友管理：9.10、添加到好友表中再发送同意添加好友的消息
     *
     * @param add
     * @param listener
     */
    private void agreeAdd(final NewFriend add, final SaveListener<Object> listener) {
        User user = new User();
        user.setObjectId(add.getUid());
        UserModel.getInstance()
                .agreeAddFriend(user, new SaveListener<String>() {
                    @Override
                    public void done(String s, BmobException e) {
                        if (e == null) {
                            //TODO 2、发送同意添加好友的消息
                            sendAgreeAddFriendMessage(add, listener);
                        } else {
                            Logger.e(e.getMessage());
                            listener.done(null, e);
                        }
                    }
                });
    }
```
#### 3.8.7.2、收到对方的同意添加好友请求后，添加对方为好友
```java
   /**
     * TODO 好友管理：9.11、收到同意添加好友后添加好友
     *
     * @param uid
     */
    private void addFriend(String uid) {
        User user = new User();
        user.setObjectId(uid);
        UserModel.getInstance()
                .agreeAddFriend(user, new SaveListener<String>() {
                    @Override
                    public void done(String s, BmobException e) {
                        if (e == null) {
                            Logger.e("success");
                        } else {
                            Logger.e(e.getMessage());
                        }
                    }
                });
    }
```

# 4、BmobNewIM SDK 混淆
## 4.1、NewIM SDK 混淆
```

# 不混淆im sdk
-keep class cn.bmob.newim.**{*;}
-dontwarn cn.bmob.newim.**
# 不混淆greenDao类
-dontwarn de.greenrobot.dao.**
-keep class de.greenrobot.dao.** { *;}
-keepclassmembers class * extends de.greenrobot.dao.AbstractDao {
    public static java.lang.String TABLENAME;
}
-keep class **$Properties
# 不混淆async
-dontwarn com.koushikdutta.async.**
-keep class com.koushikdutta.async.** { *;}
```

# 5、BmobOldIM SDK 回顾
## 5.1、OldIM SDK 回顾
Android BmobIM SDK v2.0.0之前的版本统称为[BmobOldIM SDK](https://github.com/bmob/bmob-android-im-sdk) ，BmobOldIM SDK已经开源但不再进行维护，请开发者集成Android BmobNewIM SDK进行开发。

| BmobOldIM SDK 问题     | 
|--------------------------------|
| 无法自定义消息类型		             | 
| 消息发送受限于BmobPushSDK		    | 
| API设计不够合理规范且不易扩展	    | 
| 聊天消息出现接收延迟或丢失         | 


