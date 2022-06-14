
## 注册

[官网](https://game.bmob.cn)

## 下载

从 [Demo下载页面](https://game.bmob.cn/download) 中，选择自己所擅长平台，挑选一个感兴趣的Demo
    
每个Demo包含以下内容：

- README.md文件，是游戏设定的概述，以及管理后台的相关配置
- project文件夹，是unitypackage
- cloud文件夹，包含了Room.java和Player.java文件
## 配置

[管理后台](https://game.bmob.cn/console)

### 游戏属性

先在 游戏设置 > 游戏属性 里，添加3个属性

名称|类型|最大值|长度|export|editable|备注
:--:|:--:|:--:|:--:|:--:|:--:|:--:
isdead|boolean|-|-|true|false|玩家是否已被淘汰
position|int[]|65535|2|true|true|玩家x、y轴位置
score|int|65535|-|true|false|玩家分数

点击 **发布** 

![Attr](https://bmob-cdn-14496.bmobpay.com/2018/04/10/969d75ac40a48def80e1aaab031db534.jpg)

----

### 云函数

在 游戏设置 > 云函数 里，将下载的 **cloud** 文件夹内的 **Player.java**、**Room.java** 文件内容分别复制进去，都复制后再点击 **发布**

*此时可能提示`已经被睡眠，不下发更新指令`，也是更新云函数成功的表现*


![Cloud](https://bmob-cdn-14496.bmobpay.com/2018/04/10/f052c8d34011d16c8095bcf9cc6af519.jpg)

----

### 服务器

在 服务器 标签页里，**启用** 一台服务器

*此时可能提示`服务器未处于睡眠状态`，也是启用成功的表现*

*示例图是启用中的服务器，所以显示按钮为睡眠*

![Server](https://bmob-cdn-14496.bmobpay.com/2018/04/10/e94ef77840c4c89380026a27ed36d695.jpg)

----

### AppKey

游戏设置 > 应用密钥 > AppKey

![AppKey](https://bmob-cdn-14496.bmobpay.com/2018/04/10/9e583f0140450b708063a0f598bdc99c.jpg)

## 项目

- 创建一个2D Unity项目，然后双击打开下载的`unitypackage`文件，导入所有资源
- 在Project视窗，搜索Scene，将这些场景分别打开，在 `Build Setting` 里分别 `Add` 进去
    

名称|备注
:--:|:--:
BgsDemoLobbyScene|大厅场景
BgsDemoRoomScene|房间场景
GameScene|游戏场景


- 打开 `BgsDemoLobbyScene`场景，找到`Main Camera` > `Bgs Demo Lobby Controller` > `BGS App Key`，修改为官网获取的 **AppKey**
- 现在就可以运行游戏了，入口为大厅场景。试着创建房间，会返回RoomId和JoinKey，是作为多个玩家加入同一个房间的凭证
- 打包游戏，测试多设备联网玩

![Unity](https://bmob-cdn-14496.bmobpay.com/2018/04/10/f5f5576b4045a2d6809e9b693518a6b8.jpg)
