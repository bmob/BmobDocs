
##引入SDK

下载 **微信小游戏SDK**;
将 **bmobgamesdk** 文件夹 复制到项目中。


##初始化SDK

第一个参数修改为官网获取的 APPID (BGS游戏官网管理后台的游戏设置 > 应用密钥)。
第二个参数可先不填，要在**创建房间**后获得。

    import BGS from '../../js/bmobgamesdk/bgsapi'; //根据你自己的存放路径更改
    var BmobGame = BGS.instance;

    BmobGame.Init('BGS APPID', 'ws://address:port', function (succ, msg) {
      if (succ) {
        // 用bmob小程序sdk进行注册登录
        // _getUser(listener);
      } else{
        // 提醒失败，并给重新init的按钮
      }
    });
 
 
## 注册房间动态监听器
须在加入房间 JoinRoom **之前**注册，才能保证不遗漏房间信息。
    
    // action: 事件编号，见文档最下方常量的房间动态监听器 action 类型 
    // no: 事件所属玩家编号
    // data: 相关数据
    onRoomAction(action, no, data) {
        // TODO 对事件做出相应处理
    }
    
    this.mRoomActListener = this.onRoomAction.bind(this);// 保存起来，注销时要用
    BmobGame.RegistRoomActListener(this.mRoomActListener);


## 注销房间动态监听器
    
一般在房间场景销毁时注销房间动态监听器，在进入游戏场景时需要再重新注册此监听。
    
    BmobGame.UnregistRoomActListener (this.mRoomActListener);
    
    

##创建房间
    
关于UserId，建议使用 **Bmob小游戏sdk** 的用户体系。
playerCount 为需要设定的房间人数。

    var userId =  Bmob.User.current().id;
    BmobGame.CreateRoom(userId, playerCount, function(code, res) {
        if (code == 200) {
          console.log('对战开房成功', res);
          // TODO 创建房间成功，跳转游戏房间页面，别忘了把房间信息roomInfo保存起来
          // 返回结果res内容见下
        } else {
          console.log('对战开房失败 '+code +' > ' , res);
        }
    });
          

    
创建房间成功时，服务器会自动调用云函数 Room.java 的 **onCreate** 方法。

### 获得初始化sdk的第二个参数

创建一个房间，输出这个操作的返回结果，返回结果为

    {
        "address": "a.b.c.d", // 服务器ip
        "roomInfo": {
            "ports": {
                "websocket": efgh // 服务器端口
            },
            "rid": xxx, // 房间id，JoinRoom时需要传入
            "joinKey": yyy // 房间密匙，JoinRoom时需要传入
            "masterKey" : aaa // 房间管理员密钥
        }
    }
这样，你就获得了初始化sdk的第二个参数，是 **ws://a.b.c.d:efgh** 这样的格式   

**注意，在没有已备案域名之前，勾选微信开发者工具的`不检验域名`选项**

## 销毁房间

房间创建后不用时需要销毁，否则会占用服务器资源，会对其它正常游戏中的房间造成一定的影响。

不推荐从客户端SDK调用此接口销毁房间，而是在云函数判断情况来销毁房间，例如《吃鸡》战斗结束一分钟后房间会自动销毁，以避免客户端异常状况导致房间资源未被释放。

*以下是客户端调用销毁房间方法*
    
    // code: 200为成功，否则失败，详见<错误码>
    // msg : 详情
    function CallBack(code, msg){
        // TODO UI反馈
    }
    BmobGame.DestroyRoom(int roomId, String MasterKey, CallBack.bind(this));

销毁房间成功时，会自动调用云函数 Room.java 的 **onDestroy** 方法。

*云函数销毁房间，请参考云函数文档*

##加入房间
    
    // 这里的 roomInfo 就是创建房间时让你保存的 roomInfo
    BmobGame.JoinRoom(that.roomInfo.rid, that.roomInfo.joinKey, userId, BmobGame.get('seatKey'), function(code, data) {
      if (code == 200) {
        common.toast('加入房间成功');
        console.log("房间信息:", data);
        
        let
          playerCount = data.playerCount, // 玩家数
          no = data.no, // 玩家编号
          isPlaying = data.isPlaying, //是否在游戏中
          masterId = data.master, //房主userId
          players = data.players;// 房间全部玩家信息
            // 每一个玩家信息包括： 玩家编号：no；玩家id：userId；玩家状态：status，见文档最下方常量的玩家状态类型
        
        if (data.seatKey)
          BmobGame.set('seatKey', data.seatKey);// 记录玩家座位号
        // TODO 根据返回的房间信息做些保存或处理
        
        return;
      }
      console.log('加入房间失败 '+code + ' > ', data);
    }.bind(this));
    
    
    
加入房间成功时，所有玩家会在房间动态监听器 **RoomActionListener** 收到该事件通知，服务器会自动调用云函数 Player.java 的 **onJoin** 方法。

## 离开房间

    BmobGame.QuitRoom();

离开房间成功时，所有玩家会在房间动态监听器 **RoomActionListener** 收到该事件通知，服务器会自动调用云函数 Player.java 的 **onLeave** 方法。


## 准备

    BmobGame.ReadyAtRoom ();

成功提交准备后，所有玩家会在房间动态监听器 **RoomActionListener**收到该事件通知，服务器会自动调用云函数 Player.java 的 **onReady** 方法。
当房间人满且全部人员都准备后，服务器会自动开始游戏（想主动开始，可调用云函数的 room.dispatchGameStart() 方法）。此时所有玩家会在房间动态监听器 **RoomActionListener**收到该事件通知，云函数 Player.java 的 **onGameStart**会被调用。


## 取消准备

    BmobGame.UnReadyAtRoom ();

成功提交取消准备后，所有玩家会在房间动态监听器 **RoomActionListener**收到该事件通知，服务器会自动调用云函数 Player.java 的 **onUnready** 方法。


## 房主踢人
建议不调用此接口，而是用通知云函数的方式踢出玩家，这样做的好处是可以在踢出时做一些工作，例如重置被踢玩家的属性。
    
    // code: 200为成功，否则失败，详见<错误码>
    // msg : 详情
    void CallBack(int code, string msg){
        // TODO UI反馈
    }
     
    // masterKey : 房间管理员密钥
    // no: 被踢玩家编号
    BmobGame.KickPlayer (string masterKey,int no, CallBack.bind(this));
    

成功踢出该玩家后，所有玩家会在房间动态监听器 **RoomActionListener**收到该事件通知，服务器会自动调用云函数 Player.java 的 **onKicked** 方法。


---------------------------------------------------------------------------


## 发送游戏交互信息

###同步角色状态

将处理事件转发的脚本绑定给本地角色Player，例如将Player的移动、旋转等数据，调用SDK接口同步到服务器。
通过 **BmobGame.OthersGameStatusListener** 能监听到所有玩家的状态。

    // attrName： 配置在游戏管理后台的玩家属性名
    // value： 状态值，类型可以是boolean、int、float、double、boolean[]、int[]、float[]、double[]
    BmobGame.EditMyStatus(string attrName, object value);
 
###发送瞬时信息

 这是玩家之间交互数据，通过 **BmobGame.TransferListener** 能收到其他玩家发送的数据。
 信息为**byte数组**形式，建议把数组的第一位作为自定义的交互事件类型flag，后面的为要交互的数据。
 
    BmobGame.SendTransferToAllExceptSelf(byte[] data);
    
sdk特别提供了把string和byte数组互转的方法
   
    BmobGame.stringToBytes('stringXXX'); // string转byte[]
    BmobGame.bytesToString(data, 0, data.length); // byte[]转string
 
    
    
### 通知云函数

调用云函数代码，action 为云函数中的方法名，content 为传入该云函数方法的参数，byte[]类型。
例如action传入A，则对应云函数 Play.java 中的 onAction_A 方法。
 
    BmobGame.CloudAction(string action, byte[] content);
    
---------------------------------------------------------------
    
    
## 注册游戏运行监听器

    BmobGame.SetGameRuntimeListeners (
        this.onGameInfo.bind(this), // 监听的是在游戏内的行为
        this.onMyStatus.bind(this), // 监听我的角色状态
        this.onOthersStatus.bind(this), //监听角色状态
        this.onTransfer.bind(this), //监听瞬时信息
        this.onCloudNotify.bind(this) //监听云函数通知
    );
批量注册游戏运行监听器，具体每个监听器方法见下方。


### 监听游戏内的行为
返回的是在游戏内的行为，例如掉线、战斗开始、战斗结束等（使用频率较低）
    
    // action：行为类型，见文档最下方常量的游戏内的 action 类型
    // fromNo：信息所属玩家的编号
    // data：类型为 PlayerGameAction_Reconn 时，data传入 startTime 和 playerCount
    onGameInfo(action, no, data) {
        console.log('OnGameInfo:', arguments);
    }

### 监听我的角色状态
读取服务器同步的数据，例如可通知我的分数。

    // changedAttr： json类型，我变化的属性值列表
    // status： 状态值
    onMyStatus(changedAttr, myStatus) {
        console.log('onMyStatus:', arguments);
        if (changedAttr.score) {
            let score ＝myStatus.score ;
        }
    }
    
### 监听角色状态
 读取服务器同步的数据，例如可渲染其它玩家的位置。
    
    // fromNo：信息所属玩家的编号
    // changedAttr： json类型，更改的属性值列表
    // status： 状态值
    onOthersStatus(fromNo, changedAttr, hisStatus) {
        console.log('On other status:', arguments);
        if (changedAttr.position) {
            let x = hisStatus.position[0],
                y = hisStatus.position[1];
        }
    }

### 监听瞬时信息
获取其它玩家发送的瞬时信息，作出相应处理。
    
    // fromNo：信息所属玩家的编号
    // data：发送过来的数据，一般定第一位为flag
    onTransfer(fromNo, data) {
        let flag = data.shift();// 发送时把第一位作为了flag
        Debug.Log ("Get transfer data flag = " + flag + " & len = " + data.Length + " & from: " + no);
        // TODO 根据flag做出相应处理
    }
    
    
### 监听云函数通知

    //对收到云函数通知的处理,notify为byte[]
    void onCloudNotify(notify){
        console.log('onCloudNotify: ' + notify[0]);
        switch (notify.shift()) {
            case 1:
                // TODO 对相应flag做出相应处理
                console.log(Bgs.bytesToString(notify, 0, notify.length));
                break;
        }
    }

顺便一提，仅当云函数调用以下方法时，客户端才会通过 BmobGame.CloudNotifyListener 收到通知。

    player.send
    player.sendToAll
    player.sendToOthers
    
    room.sendToAll
    room.sendToAllExcept(content, player)



## 注销游戏运行监听器
    
一般在游戏场景销毁时，注销游戏运行监听器。
   
    BmobGame.StopGameRuntimeListener (); 

--- 

## 注册游戏掉线监听器
    
    void onOffline ()
    {
        // TODO 进行掉线通知及处理
    }
    this.mOfflineListener = this.onOffline.bind(this);// 保存起来，注销时要用
    BmobGame.RegistOfflineListener (this.mOfflineListener);
    
    

## 注销游戏掉线监听器
    
一般在游戏场景销毁时，注销游戏掉线监听器。

    BmobGame.UnregistOfflineListener (this.mOfflineListener); // 注销游戏掉线监听
  

----
## 附录

###房间逻辑流程图
![此处输入图片的描述](http://bmob-cdn-15075.b0.upaiyun.com/2018/05/21/2812fc16409b2ab18070b26e228a91d2.png)

### 常量

#### 房间动态监听器 action 类型

名称|含义|备注
:--:|:--:|:--:
PlayerRoomAction_Join|玩家加入
PlayerRoomAction_Leave|玩家离开
PlayerRoomAction_Offline|玩家掉线
PlayerRoomAction_Reconn|玩家重连
PlayerRoomAction_Ready|玩家准备
PlayerRoomAction_Unready|玩家取消准备
PlayerRoomAction_Kicked|玩家被踢出
PlayerRoomAction_GameOver|游戏结束，云函数调用room.dispatchGameOver()时
RoomAction_Start|房间满人且全部已准备时|data传入当前时间，单位毫秒：data ["nowTime"]

#### 玩家状态类型

名称|含义
:--:|:--:
PlayerStatus_NoBody|该位置上尚无玩家
PlayerStatus_Waitting|该位置上有玩家，在等待中，尚未准备
PlayerStatus_Ready|该位置上有玩家，已经准备了
PlayerStatus_Playing|该位置上有玩家，已经在游戏中
PlayerStatus_GameOut|该位置上有玩家，已经在游戏中被淘汰
PlayerStatus_Offline|该位置上有玩家，已经在游戏中，但是掉线了

####游戏内的 action 类型

名称|含义
:--:|:--:
PlayerGameAction_Offline|玩家游戏中掉线
PlayerGameAction_Reconn|玩家游戏中重连
PlayerGameAction_GameLose|玩家失败
