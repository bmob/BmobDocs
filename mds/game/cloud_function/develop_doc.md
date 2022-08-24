
- BGS的云函数可以完美实现游戏的后端逻辑层，并且有热更新机制，可以随时修改、升级
- 缝合了Bmob数据服务，可以快速进行Bmob数据库的增删查改，其中 `Bmob.class` 的用法与 [Bmob Java云函数](http://doc.bmobapp.com/cloud_function/java/) 的 `modules.oData` 完全一致

主要需要开发者实现的有 `Room.java`、`Player.java`

---

## 开发环境

### IDE

建议使用`Eclipse`，也可以用AS、Sublime等支持Java语言的IDE

### Jar文件

[下载地址](//game.bmobapp.com/static/BmobGameSDKCloud.jar)

### 步骤

1. 在Eclipse创建一个java项目
2. 在该项目下，如果没有的话，创建src、libs文件夹
3. 将从管理后台复制的Room、Player代码，或者demo带的cloud文件夹里的java文件，添加到src文件夹下，包名为**cn.bmob.gamesdk.server.custom**
4. 将下载的Jar文件，拖到libs文件夹下
5. 右键点击项目 > `Build Path` > `Configure Build Path`，左侧选择` Java Build Path`，右侧选项卡选择 `Libraries`，点击 `Add JARs...` ，找到jar文件，保存
6. 在Room.java、Player.java文件内编辑代码，此时就有代码提示了
7. 将两个文件的代码都复制到管理后台后，点击保存(不是复制一个文件点击保存一次)

---

## Room.java

继承自 `RoomBase.class` , 作用是管理、监控房间的生命周期

**以下是类属性** ：

名称|类型|作用
:----:|:----:|:----:
roomId|int|房间id，创建房间时产生，客户端SDK加入房间时需要携带
players|Player[]|该房间内所有玩家，索引为玩家的no，长度为playerCount
playerCount|int|该房间内玩家数
masterId|String|创建房间的玩家id
masterKey|String|销毁/踢出玩家需要携带的key
joinKey|String|加入房间需要携带的key
isPlaying|boolean|该房间是在游戏中还是等待中
startTime|long|该房间的游戏开始时间毫秒数
tcpPort|int|该房间服务器的Tcp端口号
udpPort|int|该房间服务器的Udp端口号
websocketPort|int|该房间服务器的Web Socket端口号
address|String|该房间所在的服务器地址
bigEndian|BigEndian|用于传递int、float、double时编解码的工具对象

**以下是可主动调用的方法** ：

方法名|参数|返回值|作用
:----:|:----:|:----:|:----:
sendToAll|byte[]|boolean|向所有玩家推送消息
sendToAllExcept|byte[],Player|boolean|向某玩家以外的所有玩家推送消息
dispatchGameStart|-|-|让房间游戏开始
dispatchGameOver|-|-|让房间游戏结束
dispatchRoomDestroy|-|-|销毁房间
isStrEmpty|String|boolean|判断String对象是否为空
getTime|-|long|获取当前毫秒
arraycopy|参考System|-|复制数组

**以下是需要Override的生命周期相关监听方法** ：

*这些方法都没有参数，返回值均为void*

方法名|调用时机|使用案例
:----:|:----:|:----:
onCreate|房间被创建时|将房间的 `id`、`joinKey`等保存到 `Bmob数据库`，可进行好友对战、匹配对战
onGameStart|所有玩家均已准备，游戏开始时|初始化物品数量和位置、安全区的位置
onTick|游戏中，以每秒多次的频率调用(取决于每秒帧率配置)|实现安全区、轰炸区等游戏设定，需要加上 `@BmobGameSDKHook` 注解
onDestroy|房间被销毁时|将房间信息从 `Bmob数据库` 删除

---

## Player.java

继承自 `PlayerBase.class` , 作用有：
1. 管理、监控生命周期
2. 修改玩家属性值(editable==false的属性)
3. 监听玩家属性值变动(editable==true的属性)

**以下是类属性** ：

名称|类型|作用
:----:|:----:|:----:
room|Room|房间对象
no|int|玩家在该房间的id，加入房间时分配
roommates|Player[]|该房间内所有玩家，可以用roommates[no]进行索引


**以下是可主动调用的方法** ：

方法名|参数|返回值|作用
:----:|:----:|:----:|:----:
syncToClient|-|void|修改参数结束后，将修改同步到客户端
getStatus|-|int|获取玩家状态，有无人/等待/准备/游戏中/被淘汰/掉线
getUserId|-|String|获取加入房间时传入的用户id
send|byte[]|boolean|向本玩家推送消息
sendToAll|byte[]|boolean|向该房间的所有玩家推送消息
sendToOthers|byte[]|boolean|向本玩家以外的所有玩家推送消息
kick|-|boolean|将本玩家踢出房间
isStrEmpty|String|boolean|判断String对象是否为空
getTime|-|long|获取当前毫秒
arraycopy|参考System|-|复制数组

**以下是需要Override的生命周期相关监听方法** ：

*这些方法都没有参数，返回值均为void*

方法名|调用时机|使用案例
:----:|:----:|:----:
onJoin|玩家加入房间时|操作Bmob数据库
onLeave|玩家主动退出房间时|操作Bmob数据库
onReady|玩家在房间内准备时|-
onUnready|玩家取消准备|-
onGameStart|本轮游戏开始|初始化玩家属性
onTick|游戏开始后以一定频率被调用|更新安全区位置和半径、发送通知，需要加上 `@BmobGameSDKHook` 注解
onGameOver|游戏结束|保存游戏记录到Bmob数据库
onOffline|玩家掉线|可通知其它玩家
onReconn|玩家重连|更新一些自定义数据到本玩家，并通知其它玩家
onKicked|玩家被踢出房间|-

**Player.java 允许自定义Hook方法**

以下可以作为Hook方法
1. 获取属性
2. 修改属性
3. 监听属性变化
4. 处理客户端事件

**这些方法都需要加上 `@BmobGameSDKHook` 注解**

### 获取属性

- 要求该属性的Editable为true，也就是允许客户端修改的属性
- 需用public、native修饰该方法
- 返回类型即为属性类型
- 参数必须为空
- 必须为public方法
- 方法名为"get" + 属性名

例如，需要获取玩家当前的position属性，添加方法：

    @BmobGameSDKHook
    public native float[] getPosition();

### 修改属性

- 要求该属性的Editable为false，也就是不允许客户端修改的属性
- 需用public、native修饰该方法
- 返回类型为void
- 参数有一个，类型为属性类型
- 调用syncToClient后才同步到客户端
- 方法名为"set" + 属性名

例如，如果云函数需要修改玩家的hp属性，需要在 `Player.java` 添加方法：

    @BmobGameSDKHook
    public native void setHp(int hp);

### 监听属性变化

- 要求该属性的Editable为true，也就是允许客户端修改的属性
- 需用public、strictfp修饰该方法
- 返回类型为void
- 参数必须为空
- 需要获取属性值的话，在方法内调用native getXXX方法
- 方法名为"onUpdate_" + 属性名

例如需要监听玩家的position属性变动，添加方法：

    @BmobGameSDKHook
    public strictfp void onUpdate_Position() {
        // TODO 与当前安全区进行计算，是否扣除玩家血量
    }

### 处理客户端行为

- 需用public、strictfp修饰该方法
- 返回类型为void
- 参数必须为byte[]
- 客户端在调用CloudAction方法时，传入的第一个参数作为"行为名"
- 方法名为"onAction_" + 行为名

例如客户端上报击中其它玩家，`Action` 为 `Damage`，云端添加方法

    @BmobGameSDKHook
    public strictfp void onAction_Damage(byte[] damage) {
        // 使用setHp修改被击中玩家的血量，如果<=0，则判定死亡，通知所有用户
    }

---

## Bmob

### 初始化

建议在Room.java文件内，添加一个static代码块进行初始化

```
package cn.bmob.gamesdk.server.custom;

import cn.bmob.gamesdk.server.api.Bmob;

public class Room extends RoomBase {

	static {
		Bmob.init("Bmob AppKey", "Bmob REST API Key");
	}

	...
}

```


### 操作数据库

- 请参考 [Bmob Java云函数](http://doc.bmobapp.com/cloud_function/java/) 的 `modules.oData`

- 示例：在房间创建时，自动往数据库添加房间数据

```
...
public class Room extends RoomBase {
	public volatile String mRoomObjectId;

	@Override
	public void onCreate() {
		mRoomObjectId = Bmob.getInstance().insert("Room", JSON.toJson(//
				"rid", roomId, // 房间Id
				"joinKey", joinKey, // 加入房间需要的Key
				"master", new BmobObject.BmobPointer("_User", masterId), // 房主Pointer类型
				"masterKey", masterKey, // 房主密钥
				"isPublic", false // 房间是否开放匹配，默认不开放
				)).jsonData.getString("objectId");
	}
...
```
