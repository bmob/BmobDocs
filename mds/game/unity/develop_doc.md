## 引入SDK

- 下载 Unity SDK;
- 将 **BmobGameUnitySDKvx.x.x_xxxxxx.unitypackage** Import 到Unity内;


## 初始化SDK

在第一个场景的start方法中对SDK进行初始化，BGSAppKey在BGS游戏官网管理后台的游戏设置 > 应用密钥。

    BmobGame.Init (this, BGSAppKey); // APPID


## 更新帧

选一个贯穿全局的对象，在**Update**方法中调用下句。

    BmobGame.UpdateFrame ();

注意，没有此句，游戏将无法正常运行。


## 注册房间动态监听器

须在加入房间 JoinRoom **之前**注册，才能保证不遗漏房间信息。

    // action: 事件编号，见文档最下方常量的房间动态监听器 action 类型
    // no: 事件所属玩家编号
    // data: 相关数据
    void OnRoomAction(int action, int no, string userId, JSONNode data){
        // TODO 对事件做出相应处理
    }

    this.mRoomActListener = new BmobGame.RoomActionListener (OnRoomAction);// 保存起来，注销时要用
    BmobGame.RegistRoomActListener(this.mRoomActListener);

## 注销房间动态监听器

一般在房间场景销毁时注销房间动态监听器，在进入游戏场景时需要再重新注册此监听。

    void OnDestroy ()
    {
        BmobGame.UnregistRoomActListener (this.mRoomActListener);
    }


##创建房间

创建房间之前一定要先设置 UserId ，否则将失败。（关于UserId，建议使用Bmob数据sdk的用户体系）
playerCount 为需要设定的房间人数。

	BmobGame.UserId = userId;

	// code: 200为成功，否则失败，详见<错误码>
	// err : 错误原因
	// address : 服务器ip地址，JoinRoom时需要传入
	// port : 服务器端口号，JoinRoom时需要传入
	// roomId : 房间号，JoinRoom时需要传入
	// masterKey : 房间管理员密钥
	// joinKey : 房间加入密钥，JoinRoom时需要传入
	void OnCreateRoom(int code, string err, string address, int port, int roomId, string masterKey, string joinKey){
	    // TODO 记录返回的信息
	}

	BmobGame.CreateRoom (this, playerCount, new 					BmobGame.CreateRoomListener (OnCreateRoom));



创建房间成功时，服务器会自动调用云函数 Room.java 的 **onCreate** 方法。


## 销毁房间

房间创建后不用时需要销毁，否则会占用服务器资源，会对其它正常游戏中的房间造成一定的影响。

不推荐从客户端SDK调用此接口销毁房间，而是在云函数判断情况来销毁房间，例如《吃鸡》战斗结束一分钟后房间会自动销毁，以避免客户端异常状况导致房间资源未被释放。

*以下是客户端调用销毁房间方法*

    // code: 200为成功，否则失败，详见<错误码>
    // msg : 详情
    void CallBack(int code, string msg){
        // TODO UI反馈
    }
    BmobGame.DestroyRoom(int roomId, String MasterKey, new BmobGame.OperationListener(CallBack));


销毁房间成功时，会自动调用云函数 Room.java 的 **onDestroy** 方法。

*云函数销毁房间，请参考云函数文档*

##加入房间

加入房间时，需传入创建房间时回调的参数。

    // code: 200为成功，否则失败，详见<错误码>
    // err : 错误原因
    // data : 房间信息 >
    //      玩家编号： data["no"];
    //      玩家数： data["playerCount"];
    //      是否在游戏中： data["isPlaying"];
    //      房间全部玩家信息： JSONArray players = data ["players"].AsArray;
    //          每一个玩家信息包括： 玩家编号：no；玩家id：userId；玩家状态：status，见文档最下方常量的玩家状态类型
    void OnJoinRoom(int code, string err, JSONNode data){
        // TODO 处理、保存房间数据
    }

    // address : 服务器ip地址
    // port : 服务器端口号
    // roomId : 房间号
    // joinKey : 房间加入密钥
    BmobGame.JoinRoom(address, port, roomId, joinKey, new BmobGame.JoinRoomListener (OnJoinRoom))


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
    BmobGame.KickPlayer (string masterKey,int no, new BmobGame.OperationListener(CallBack));


成功踢出该玩家后，所有玩家会在房间动态监听器 **RoomActionListener**收到该事件通知，服务器会自动调用云函数 Player.java 的 **onKicked** 方法。



---

## 发送游戏交互信息

###同步角色状态

将处理事件转发的脚本绑定给本地角色Player，例如将Player的移动、旋转等数据，调用SDK接口同步到服务器。
通过 **BmobGame.OthersGameStatusListener** 能监听到所有玩家的状态。

    // name： 配置在游戏管理后台的玩家属性名
    // value： 状态值，类型可以是boolean、int、float、double、boolean[]、int[]、float[]、double[]
    BmobGame.EditMyStatus(string name, object value);

###发送瞬时信息

 这是玩家之间交互数据，通过 **BmobGame.TransferListener** 能收到其他玩家发送的数据。
 信息为byte数组形式，建议把数组的第一位作为自定义的交互事件类型flag，后面的为要交互的数据。

    BmobGame.SendTransferToAllExceptSelf(byte[] bs);


​
​
### 通知云函数

调用云函数代码，action 为云函数中的方法名，content 为传入该云函数方法的参数，byte[]类型。
例如action传入A，则对应云函数 Play.java 中的 onAction_A 方法。

    BmobGame.CloudAction(string action, byte[] content);

-----------------------------------------------------------------


## 注册游戏运行监听器

    BmobGame.SetGameRuntimeListeners (
        new BmobGame.GameInfoListener (OnGameInfo), // 监听的是在游戏内的行为
        new BmobGame.MyGameStatusListener (OnMyGameStatus), // 监听我的角色状态
        new BmobGame.OthersGameStatusListener (OnOthersGameStatus), //监听角色状态
        new BmobGame.TransferListener (OnTransfer), //监听瞬时信息
        new BmobGame.CloudNotifyListener (OnCloudNotify) //监听云函数通知
    );
批量注册游戏运行监听器，具体每个监听器方法见下方。

### 监听游戏内的行为
返回的是在游戏内的行为，例如掉线、战斗开始、战斗结束等（使用频率较低）

    // action：行为类型，见文档最下方常量的游戏内的 action 类型
    // fromNo：信息所属玩家的编号
    // data：类型为 PlayerGameAction_Reconn 时，data传入 startTime 和 playerCount
    void OnGameInfo (int action, int fromNo, string userId, JSONNode data)
    {
        Debug.Log ("Receive game info: no[" + no + "] userid[" + userId + "], action = " + action);
    }

### 监听我的角色状态
读取服务器同步的数据，例如可通知我的死活、分数。

    // attrNames： 我变化的属性值列表
    // status： 状态值
    void OnMyGameStatus (ArrayList attrNames, Hashtable status)
    {
        if (attrNames.Contains ("isdead")) {
            if ((bool)(status ["isdead"])) {
                Debug.Log ("当前玩家已经死亡，状态通知及时");
            }
        }
        if (attrNames.Contains ("score")) {
            SharedValues_Script.Score = (int)(status ["score"]);
        }
    }

### 监听角色状态
 读取服务器同步的数据，例如可渲染其它玩家的位置、角度。

    // fromNo：信息所属玩家的编号
    // attrNames： 更改的属性值列表
    // status： 状态值
    void OnOthersGameStatus (int fromNo, ArrayList attrNames, Hashtable status)
    {
        Debug.Log ("Player[" + no + "] game status is changed: " + status.Count);

        if(attrNames.Contains("position")){
            float[] position = status ["position"] as float[];
            mOtherPlayers [no].GetComponent<Player2Movement> ().MoveTo (position [0], position [1]) ;
        }
        if(attrNames.Contains("rotation")){
            float y = (float)(status ["rotation"]);
            mOtherPlayers [no].GetComponent<Player2Movement> ().TurnTo (y) ;
        }
    }

### 监听瞬时信息
获取其它玩家发送的瞬时信息，作出相应处理。

    // fromNo：信息所属玩家的编号
    // data：发送过来的数据，一般定第一位为flag
    void OnTransfer (int fromNo, byte[] data)
    {
        Debug.Log ("Get transfer data flag = " + data[0] + " & len = " + data.Length + " & from: " + fromNo);
        // TODO 根据flag做出相应处理
    }

### 监听云函数通知

    //对收到云函数通知的处理,notify为byte[]
    void OnCloudNotify(byte[] notify){
        Debug.log('onCloudNotify: ' + notify[0]);
        // TODO 对相应flag做出相应处理
    }

顺便一提，仅当云函数调用以下方法时，客户端才会通过 BmobGame.CloudNotifyListener 收到通知。

    player.send
    player.sendToAll
    player.sendToOthers

    room.sendToAll
    room.sendToAllExcept(content, player)


## 注销游戏运行监听器

一般在游戏场景销毁时，注销游戏运行监听器。

    void OnDestroy ()
    {
        BmobGame.StopGameRuntimeListener ();
    }

---


## 注册游戏掉线监听器

    void OnOffline ()
    {
        // TODO 进行掉线通知及处理
    }
    this.mOfflineListener = new BmobGame.OfflineListener (OnOffline);// 保存起来，注销时要用
    BmobGame.RegistOfflineListener (this.mOfflineListener);


## 注销游戏掉线监听器

一般在游戏场景销毁时，注销游戏掉线监听器。

    void OnDestroy ()
    {
        BmobGame.UnregistOfflineListener (this.mOfflineListener);
    }

----

## Http接口管理房间

### 创建房间


- `Url`:  **https://gameapi.bmobapp.com/client/room?oper=create**
- `Headers`:
```
	X-BGS-VER = 1
    X-BGS-ID = 官网后台-应用密钥-AppKey
    Content-Type: application/json
```

- `Body`:

```
    {
        "userId": "房主Id",
        "playerCount": 房间人数
    }
```

- 返回值：

```
成功：
    {
        "code": 200,
        "data": {
            "address": "服务器地址",
            "roomInfo": {
                "joinKey": "加入房间需要的key",
                "masterKey": "销毁房间、踢人需要的key",
                "ports": {
                    "tcp": tcp通信端口,
                    "udp": udp通信端口,
                    "websocket": web socket通信端口
                },
                "rid": 房间号
            }
        }
    }
失败：
	{
        "code": xxx,
        "data": "错误原因"
	}
```


### 销毁房间

请求到
- `Url`:  **https://gameapi.bmobapp.com/client/room?oper=destroy**
- `Headers`:
```
	X-BGS-VER = 1
    X-BGS-ID = 官网后台-应用密钥-AppKey
    Content-Type: application/json
```

- `Body`:

```
    {
        "roomId": 房间号,
        "userId": "房主Id",
        "address": "创建房间时返回的服务器地址",
        "masterKey": "创建房间时返回的房间masterKey"
    }
```

- 返回值：

```
成功：
	{
        "code": 200,
        "data": "OK"
	}
失败：
	{
        "code": xxx,
        "data": "错误原因"
	}
```


### 踢出玩家

请求到
- `Url`:  **https://gameapi.bmobapp.com/client/room?oper=kick**
- `Headers`:
```
	X-BGS-VER = 1
	X-BGS-ID = 官网后台-应用密钥-AppKey
	Content-Type: application/json
```

- `Body`:

```
    {
        "roomId": 房间号,
        "userId": "房主Id",
        "address": "创建房间时返回的服务器地址",
        "masterKey": "创建房间时返回的房间masterKey",
        "playerNo": 需要踢出的玩家的座位号
    }
```

- 返回值：

```
成功：
	{
        "code": 200,
        "data": "OK"
	}
失败：
	{
        "code": xxx,
        "data": "错误原因"
	}
```



## 附录

### 房间逻辑流程图
![此处输入图片的描述](http://bmob-cdn-15075.b0.upaiyun.com/2018/05/21/2812fc16409b2ab18070b26e228a91d2.png)

### 常量

#### 房间动态监听器 action 类型

|           名称            |                     含义                      |                     备注                     |
| :-----------------------: | :-------------------------------------------: | :------------------------------------------: |
|   PlayerRoomAction_Join   |                   玩家加入                    |                                              |
|  PlayerRoomAction_Leave   |                   玩家离开                    |                                              |
| PlayerRoomAction_Offline  |                   玩家掉线                    |                                              |
|  PlayerRoomAction_Reconn  |                   玩家重连                    |                                              |
|  PlayerRoomAction_Ready   |                   玩家准备                    |                                              |
| PlayerRoomAction_Unready  |                 玩家取消准备                  |                                              |
|  PlayerRoomAction_Kicked  |                  玩家被踢出                   |                                              |
| PlayerRoomAction_GameOver | 游戏结束，云函数调用room.dispatchGameOver()时 |                                              |
|     RoomAction_Start      |            房间满人且全部已准备时             | data传入当前时间，单位毫秒：data ["nowTime"] |

#### 玩家状态类型

|         名称          |                   含义                   |
| :-------------------: | :--------------------------------------: |
|  PlayerStatus_NoBody  |             该位置上尚无玩家             |
| PlayerStatus_Waitting |    该位置上有玩家，在等待中，尚未准备    |
|  PlayerStatus_Ready   |        该位置上有玩家，已经准备了        |
| PlayerStatus_Playing  |       该位置上有玩家，已经在游戏中       |
| PlayerStatus_GameOut  |    该位置上有玩家，已经在游戏中被淘汰    |
| PlayerStatus_Offline  | 该位置上有玩家，已经在游戏中，但是掉线了 |


#### 游戏内的 action 类型

|           名称            |      含义      |
| :-----------------------: | :------------: |
| PlayerGameAction_Offline  | 玩家游戏中掉线 |
|  PlayerGameAction_Reconn  | 玩家游戏中重连 |
| PlayerGameAction_GameLose |    玩家失败    |
