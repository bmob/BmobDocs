
## 注册

[官网](https://game.bmob.cn)

## 下载

从 [Demo下载页面](https://game.bmob.cn/download) 中，选择自己所擅长平台，挑选一个感兴趣的Demo
    
每个Demo包含以下内容：

- README.md文件，是游戏设定的概述，以及管理后台的相关配置
- project文件夹，是Cocos Creator游戏项目
- cloud文件夹，包含了Room.java和Player.java文件

## 配置

[管理后台](https://game.bmob.cn/console)

请根据Demo的READ.md文件内容，在管理后台配置游戏，包括人数、是否中途加入等等

### 游戏属性

请根据Demo的READ.md文件内容，在管理后台配置玩家在游戏内需要同步的属性

*以飞机大战为例*：

|名称|类型|最大值|长度|export|editable|备注|
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
isdead|boolean|-|-|true|false|玩家是否已被淘汰
position|int[]|65535|2|true|true|玩家x、y轴位置
score|int|65535|-|true|false|玩家分数

点击 **发布** 

![Attr](https://bmob-cdn-14496.b0.upaiyun.com/2018/04/10/969d75ac40a48def80e1aaab031db534.jpg)

----

### 云函数

在 游戏设置 > 云函数 里，将下载的 **cloud** 文件夹内的 **Player.java**、**Room.java** 文件内容分别复制进去，都复制后再点击 **发布**

*此时可能提示`已经被睡眠，不下发更新指令`，也是更新云函数成功的表现*


![Cloud](https://bmob-cdn-14496.b0.upaiyun.com/2018/04/10/f052c8d34011d16c8095bcf9cc6af519.jpg)

----

### 服务器

在 服务器 标签页里，**启用** 一台服务器

*此时可能提示`服务器未处于睡眠状态`，也是启用成功的表现*

*示例图是启用中的服务器，所以显示按钮为睡眠*

![Server](https://bmob-cdn-14496.b0.upaiyun.com/2018/04/10/e94ef77840c4c89380026a27ed36d695.jpg)

----

### AppKey

游戏设置 > 应用密钥 > AppKey

![AppKey](https://bmob-cdn-14496.b0.upaiyun.com/2018/04/10/9e583f0140450b708063a0f598bdc99c.jpg)

## 项目

- 将下载的 `zip文件` 解压，在Cocos导入项目
- 修改 `/assets/scripts/BgsDemo_Lobby.js` 找到 **Bgs.Init** 这一行，第`一`个参数修改为官网获取的 **AppKey**
- 运行游戏，打开network抓包，创建一个房间，查看这个操作的返回结果，返回结果为

        {
            "address": "a.b.c.d", // 服务器ip
            "roomInfo": {
                "ports": {
                    "websocket": efgh // 服务器端口
                },
                "rid": xxx, // 房间id
                "joinKey": yyy // 房间密匙
            }
        }
- 修改 `/assets/scripts/BgsDemo_Lobby.js` 找到 **Bgs.Init** 这一行，第`二`个参数修改为 **ws://a.b.c.d:efgh**  这样的格式
- 现在就可以运行游戏了，加入刚刚创建的房间，或者再次创建房间(通过rid、joinKey加入同一个房间)
- 生成二维码/发布体验版，测试多设备联网玩


