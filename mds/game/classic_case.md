## 吃鸡游戏
### 步骤

1. 要看懂此案例，首先，你得有一定的`Unity`开发功底，以及入门级的`Java`语法;
2. 访问 Unity 的 [Asset Store](https://assetstore.unity.com/) 下载一个射击类游戏项目，并且 `Import` 到 Unity 内;
3. 将 `BmobGame_UnitySDK_vx.x.x_xxxxxx.unitypackage` Import 到Unity内;
4. 修改SDK，将游戏开始跳转的 Scene 改为你下载的射击类游戏 Demo Scene;
5. 在 Demo Scene 进行SDK的初始化，绑定 `delegate` 用于处理各种通知;
6. 将本地角色 `LocalPlayer` 的移动、面向角度、姿态(卧倒/下蹲/持有手枪/持有步枪)等数据，调用SDK接口同步到服务器;
7. 将 `LocalPlayer` 的瞬时动作(如开火/跳跃/换弹匣、拾取物品等Pose)通过SDK接口直接发送到其它玩家;
8. 击中其它玩家时，将事件详情通知到服务器云端代码，包括所用武器、击中身体部位、对方的id;
9. 读取服务器同步的数据，修改 `LocalPlayer` 的血量、击杀数、名次，并渲染其它玩家的位置、角度、姿态。获取其它玩家直接发送的瞬时动作，操作Animator;
10. 在 `BGS官网` 登录管理后台，创建游戏，修改 `服务器运行配置` ，包括 `每秒帧率`(默认60Hz)、`房间最多玩家数` (2个或以上);
11. 修改 `玩家属性配置`，设置各个属性的名称、类型、长度、值域、由云端/客户端编辑、其它玩家是否可见等。下方有 `PUBG` 的玩家属性例子;
12. 打开 `Eclipse` 或 `Android Studio`，创建Java项目，导入 `BmobGame_JavaCloud_vx.x.x_xxxxxx.jar`，并创建 `Player.java` 和 `Room.java`，分别继承自 `PlayerBase.class` 和 `RoomBase.class` 后，编写游戏逻辑代码。下方有案例;
13. 打包运行游戏，就可以多人同时在线对战啦~

### 开发体验

但是在基于客户端基本完工的情况下，接入BGS，把它从一个单机游戏变成了多人联网游戏，仅花费1小时。马上就可以多人开黑啦。


---

#### 运行效果

[Demo测试运行视频 (B站无广告传送门) ](https://www.bilibili.com/video/av20272527/)

*超清/720P模式观看体验更好哦*


<iframe height=498 width=1020 src='//player.youku.com/embed/XMzQzNDYyODkzNg==' frameborder=0 'allowfullscreen'></iframe>

可以说除了动作不完善之外，联网射击对战游戏基本上的要素都具备啦

---

### 玩家属性配置

玩家的属性有以下几种类型：

类型|使用案例
:----:|:----:
boolean|是否无敌状态
int|血量、分数
float|2D游戏的面朝角度
double|吟唱读条进度
boolean[]|各种持续姿态
int[]|物品栏、外观项
float[]|角色位置、3D游戏的面朝角度
double[]|高物理精度游戏的部分参数

*当属性类型为 `int`、 `int[]`时，需要指定最大值 `max`，以便服务器优化同步效率*

*当属性类型为 `xxx[]` 时，需要指定数组长度 `count`，以便服务器优化同步效率*

---

每个玩家属性还有 `export`、`editable` 两个开关，默认都为false，以下是这两个开关的描述:

**Export** :

值|效果|使用案例
:----:|:----:|:----:
true|该玩家属性对所有玩家开放|位置、角度、姿态、外观项
false|该玩家属性仅本玩家可获取| `PUBG`的血量、击杀数等

**Editable** :

值|效果|使用案例
:----:|:----:|:----:
true|该值由客户端进行修改，服务器只读|位置、角度、姿态
false|该值由服务器进行修改，客户端只读| `PUBG`的血量、击杀数等

*一个属性不能同时 Export==false 且 Editable==True，因为这种属性往往不需要经过网络*

---

以下是 `PUBG` 的推荐玩家属性配置


名称|类型|最大值/数组长度|Export|Editable|描述
:----:|:----:|:----:|:----:|:----:|:----:
hp|int|100 / -|false|false|血量
score|int|100 / -|false|false|击杀数
position|float[]|- / 3|true|true|位置
rotation|float[]|- / 3|true|true|角度
surface|int[]|255 / 8|true|true|外观件
knapsack|int[]|65535 / 255|false|false|物品栏

		案例中的 knapsack(背包)，设计原理是index为物品id，对应数字为物品个数
		例如游戏中共有3种道具，分别是枪、子弹、手雷，我们定它们的id分别为0、1、2
		那么knapsack为[1,8,4]意味着这个玩家有 1把枪、8颗子弹、4颗手雷
		
		这个属性之所以Editable为false，是为了防止客户端外挂可以随意编辑生成道具
		取而代之的是客户端发送拾取、消耗、丢弃道具的指令到云端代码，经由合法性判断后操作该属性、同步到客户端
		
---		


### 云端代码

- BGS的云端代码可以完美实现游戏的后端逻辑层，并且有热更新机制，可以随时修改、升级
- 缝合了Bmob数据服务，可以快速进行Bmob数据库的增删查改，其中 `Bmob.class` 的用法与 [Bmob Java云函数](http://doc.bmob.cn/cloud_function/java/) 的 `modules.oData` 完全一致

主要需要开发者实现的有 `Room.java`、`Player.java`

---

#### **Room.java**

继承自 `RoomBase.class` , 作用是管理、监控房间的生命周期

**以下是类属性** ：

名称|类型|作用
:----:|:----:|:----:
roomId|int|房间id，创建房间时产生，客户端SDK加入房间时需要携带
players|Player.class[]|该房间内所有玩家
playerCount|int|该房间内玩家数
masterId|String|创建房间的玩家id
masterKey|String|销毁/踢出玩家需要携带的key
joinKey|String|加入房间需要携带的key
isPlaying|boolean|该房间是在游戏中还是等待中
startTime|long|该房间的游戏开始时间毫秒数

**以下是可主动调用的方法** ：

方法名|参数|返回值|作用
:----:|:----:|:----:|:----:
dispatchGameOver|-|-|让房间游戏结束
sendToAll|byte[]|boolean|向所有玩家推送消息
sendToAllExcept|byte[],Player|boolean|向某玩家以外的所有玩家推送消息

**以下是需要Override的生命周期相关监听方法** ：

*这些方法都没有参数，返回值均为void*

方法名|调用时机|使用案例
:----:|:----:|:----:
onCreate|房间被创建时|将房间的 `id`、`joinKey`等保存到 `Bmob数据库`，可进行好友对战、匹配对战
onGameStart|所有玩家均已准备，游戏开始时|初始化物品数量和位置、安全区的位置
onTick|游戏中，以每秒多次的频率调用(取决于每秒帧率配置)|实现安全区、轰炸区等游戏设定
onDestroy|房间被销毁时|将房间信息从 `Bmob数据库` 删除


---

#### **Player.java**

继承自 `PlayerBase.class` , 作用有：
1. 管理、监控玩家的行为和生命周期
2. 修改玩家属性值(editable==false的属性)
3. 监听玩家属性值变动(editable==true的属性)

**以下是类属性** ：

名称|类型|作用
:----:|:----:|:----:
room|Room|房间对象
no|int|玩家在该房间的id，加入房间时分配
roommates|Player.class[]|该房间内所有玩家，可以用roommates[no]进行索引


**以下是可主动调用的方法** ：

方法名|参数|返回值|作用
:----:|:----:|:----:|:----:
syncToClient|-|void|修改参数结束后，将修改同步到客户端
getStatus|-|int|获取玩家状态，有无人/等待/准备/游戏中/被淘汰/掉线
getUserId|-|String|加入房间时传入的用户id
send|byte[]|boolean|向本玩家推送消息
sendToAll|byte[]|boolean|向该房间的所有玩家推送消息
sendToOthers|byte[]|boolean|向本玩家以外的所有玩家推送消息
kick|-|boolean|将本玩家踢出房间

**以下是需要Override的生命周期相关监听方法** ：

*这些方法都没有参数，返回值均为void*

方法名|调用时机|使用案例
:----:|:----:|:----:
onJoin|玩家加入房间时|操作Bmob数据库
onLeave|玩家主动退出房间时|操作Bmob数据库
onReady|玩家在房间内准备时|-
onUnready|玩家取消准备|-
onGameStart|本轮游戏开始|初始化玩家属性
onTick|游戏开始后以一定频率被调用|更新安全区位置和半径、发送通知
onGameOver|游戏结束|保存游戏记录到Bmob数据库
onOffline|玩家掉线|可通知其它玩家
onReconn|玩家重连|更新一些自定义数据到本玩家，并通知其它玩家
onKicked|玩家被踢出房间|-

**Player.java 允许自定义 获取属性方法、修改属性方法、监听属性方法**

例如，如果云端代码需要修改玩家的hp属性，需要在 `Player.java` 添加方法：

	@BmobGameSDKHook
	public native void setHp(int hp);
	
如果需要获取玩家的position属性，添加方法：

	@BmobGameSDKHook
	public native float[] getPosition();

需要监听玩家的position属性变动，添加方法：

	@BmobGameSDKHook
	strictfp void onUpdate_Position() {
		// TODO 与当前安全区进行计算，是否扣除玩家血量
	}
	
需要处理客户端的 `Action`, 如客户端上报击中其它玩家，`Action` 为 `Damage`，添加方法

	@BmobGameSDKHook
	public void onAction_Damage(byte[] damage) {
		// 使用setHp修改被击中玩家的血量，如果<=0，则判定死亡，通知所有用户
	}
	
	
	
	
### 代码节选

- Room.java的代码很简单，只在房间创建、开始、销毁等时候进行Bmob数据库的操作

![Room.java](//bmob-cdn-14496.b0.upaiyun.com/2018/03/02/edb9d14640f45beb801d0f9b53bb3008.png "Room.java")

---

- Player.java的代码承担了大多数的游戏逻辑，例如下面是某玩家上报击中另一个玩家时的处理器


![Player.java](//bmob-cdn-14496.b0.upaiyun.com/2018/03/02/e3ecabaa40bd942a8077829cd35b44f1.jpg "Player.java")

---

- Unity内代码(属性同步)

![Player.cs](//bmob-cdn-14496.b0.upaiyun.com/2018/03/02/08b21c594085329e80d4b4ddf483561f.png "Player.cs")

##打怪游戏改造
### 准备一个单机的Unity游戏 ###

> 访问 Unity 的 [Asset Store](https://assetstore.unity.com/)下载游戏项目，并且Import到 Unity 内。

本文选择了一款可爱的射击打怪游戏：[Survival Shooter Tutorial](https://assetstore.unity.com/packages/essentials/tutorial-projects/survival-shooter-tutorial-40756)

![游戏图片](//bmob-cdn-13250.b0.upaiyun.com/2018/03/09/460f8bb94008d8358000b5549955ba18.jpg)

项目导入后的样子：
![项目图片](//bmob-cdn-13250.b0.upaiyun.com/2018/03/09/082832c6407fa5778057916ba7ccc6a8.png)

 
 绍项目结构简介：

 -  场景上的摆设物体都包括在**Environment**上，比如图上的闹钟、柜子等，它们的**Layer**都设置为了**Shootable**字段，代码在玩家开激光枪、激光碰撞检测时检测到Shootable为Layer的物体才会触发碰撞事件。
    
 - 怪物的生成由**EnemyManage**来控制，能够管理何种怪物在哪个出生点按什么时间间隔出生。

 - 怪物主要由三个脚本来管理，分别是**EnemyHealth.cs**（管理怪物的hp，被玩家射击到时扣血，血量小于等于0时死掉）、**EnemyMovement.cs**（管理怪物的移动，用UnityEngine.AI.NavMeshAgent，把玩家的坐标设为目的地，这样怪物会按设置的行走速度自动走向玩家位置）和**EnemyAttack.cs**（管理怪物的自动攻击，按一定的时间间隔进行发招）。

 - 玩家也主要由三个脚本来管理，分别是**PlayerHealth.cs**（管理玩家的hp，主要是收到怪物攻击时掉血）、**PlayerMovement.cs**（管理玩家的移动，当键盘按wsad时上下左右的移动）和**PlayerShooting.cs**（管理玩家的射击动作，当鼠标左键点击时对玩家枪口面对的方向发出激光Ray，如果在范围内碰撞检测到了怪物则对怪物进行扣血）。

更详细更完整的细节请看Unity官方的教程
 

----------

### 开始改造 ###

> 将玩家角色(和角色控制器)克隆一份，去掉主动操作行为，添加被动展现方法。

可以在上一步骤中看到项目中只有一个玩家Player，要改造成联网的游戏就需要多个玩家，所以作者把场景中的Player物体克隆一份，命名为Player2，当然控制它的脚本也不能少，克隆克隆克隆！

![](//bmob-cdn-13250.b0.upaiyun.com/2018/03/09/585f4a93406d440680223e33d0e2e3a2.png)

 1. Player2Health.cs：
   因为Player2Health控制的是其他玩家的血量，所以把玩家收到怪物攻击时减的血量设为0，让其他玩家的血量不受本地控制。
 2. Player2Movement.cs：
    删掉根据键盘的操作引起的移动，加上传入数据时的操作角色移动方法。
    
    
    ```
    //  移动到相应坐标
    public void MoveTo(float x, float z){
        playerRigidbody.MovePosition (new Vector3(x, playerRigidbody.position.y,z));
        Animating (x, z);
    }

    //  旋转到相应角度
    public void TurnTo(float y){
        transform.eulerAngles = new Vector3 (0, y, 0);
    }
    ```
    
    
 3. Player2Shooting.cs：
 删掉根据鼠标的操作引起的射击，加上传入射击指令时的方法，考虑到网络延时原因，是否射中怪物的判断不由这里判断，这个射击方法给怪物的伤害要设置为0，仅显示出UI效果。

以上改好后再把对应的脚本替换掉原脚本放到Player2物体上，将物体拖进Project一栏中，这样物体就变成预设物体，可以随时调用啦。除了克隆、修改玩家之外，还需要修改一些细节：

 - 更改怪物的移动方式：
上面我们有提到怪物是根据玩家的位置来自动寻路的，那现在有两个玩家了怎么办呢？根据玩游戏的经验告诉我们，怪物会跟着离他更近的玩家走哟。下面贴出代码：
   
```
// UnityEngine.AI.NavMeshAgent nav;
// nav = GetComponent <UnityEngine.AI.NavMeshAgent> ();
void Update ()
{
    // If the enemy and the player have health left...
    if(enemyHealth.currentHealth > 0)
    {
        Vector3 enemyPosition = transform.position, 
                tempPosition;
        float minDist = float.MaxValue, 
                tempFloat;
        Vector3 target = Vector3.zero;
        for (int i = 0; i < targetHealths.Length; i++) {
            if (targetHealths [i].currentHealth > 0) {
                tempPosition = trackTargets [i].position;
                tempFloat = Vector3.Distance (enemyPosition, tempPosition);
                if (tempFloat < minDist) {
                    minDist = tempFloat;
                    target = tempPosition;
                }
            }
        }
        if (minDist != float.MaxValue) {
            // ... set the destination of the nav mesh agent to the player.
            nav.SetDestination (target);
        }
    }
    // Otherwise...
    else
    {
        // ... disable the nav mesh agent.
        nav.enabled = false;
    }
}
```

 - 更改怪物受到伤害减血的触发方式：
上面提到，其他玩家射击到怪物的事件不能在我这里减血，那么怪物的血量怎么控制呢，我把EnemyManager.cs的脚本改了下，把生成的每个怪物都命名，当检测到射击时，把我伤害的怪物的名称发送给其他玩家，就能同步好每个怪物的血量了。

### 结合Bmob Game Sdk ###

 1. 访问 [BGS官网](https://game.bmob.cn/)，注册账号并下载 Unity SDK、GameCloud SDK;
 2. 将 BmobGame_UnitySDK_vx.x.x_xxxxxx.unitypackage Import 到Unity内;
 3. 修改SDK，将游戏开始跳转的 Scene 改为本游戏的场景"_Complete-Game/_Complete-Game";

 
 ```
    SceneManager.LoadSceneAsync ("_Complete-Game/_Complete-Game");
 ```
 
 

 4. 在 Demo Scene 进行SDK的初始化，绑定 delegate 用于处理各种通知;
 5. 将处理事件转发的脚本绑定给本地角色Player，将Player的移动、旋转、hp等数据，调用SDK接口同步到服务器;

 
 ```
    void Update ()
    {
        BmobGame.UpdateFrame ();
        if (isOver)
            return;
        Vector3 position = transform.position;

        BmobGame.EditMyStatus ("position", new float[]{ position.x, position.z });
        BmobGame.EditMyStatus ("rotation", transform.eulerAngles.y);
        BmobGame.EditMyStatus ("hp", GetComponent<PlayerHealthBase>().currentHealth<0?0:GetComponent<PlayerHealthBase>().currentHealth);
    }
 ```


 6. 将 Player 的瞬时动作射击、射中的怪物名通过transfer接口直接发送到其他玩家;

 
 ```
    // Game_BmobSDKTest里面SendFireEvent和SendDamageEvent方法，
    // 都是把传来的参数转成byte数组（数组第一位设为事件类别），
    // 通过transfer接口传递数组给其他玩家：BmobGame.SendTransferToAllExceptSelf (notify);
 
    // Game_BmobSDKTest mBGS;
    // mBGS = GetComponentInParent<Game_BmobSDKTest> ();
    
    // 把发射起点、角度、长度，用transfer接口传
    mBGS.SendFireEvent (transform.position.x, transform.position.z, transform.eulerAngles.y, range);
    
    // 把射中的怪物名发送出去，用transfer接口传
    mBGS.SendDamageEvent (shootHit.collider.name);
 ```
 
 

 7. 读取服务器同步的数据，渲染其它玩家的位置、角度。获取其它玩家直接发送的瞬时动作，作出射击和射中某个怪物的处理;

 
  ```
  //对收到其他玩家信息的处理
  void OnOthersGameStatus (int no, ArrayList attrNames, Hashtable status)
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
        if(attrNames.Contains("hp")){
            int hp = (int)(status ["hp"]);
            mOtherPlayers [no].GetComponent<Player2Health> ().currentHealth = hp;
        }
    }
    
    //对收到transfer接口的信息的处理
    void OnTransfer (int fromNo, byte[] data)
    {
        Debug.Log ("Get transfer data flag = " + data[0] + " & len = " + data.Length + " & from: " + fromNo);
        switch(data[0]){
        case 1:
            ReceiveFireEvent (fromNo, data);//开火事件
            break;
        case 2:
            ReceiveDamageEvent (fromNo, data);//击中怪物事件
            break;
        }
        Debug.Log ("Player[" + fromNo + "] transfer: " + data [0] + ", len = " + data.Length);
    }
    
    //对收到云端通知的处理
    void OnCloudNotifyJson(string jsonStr){
        Debug.Log ("Handle cloud notify: " + jsonStr);
        JSONNode json = JSON.Parse (jsonStr);
        if (json == null) {
            return;
        }
        string a = json ["action"];
        if (a == null || a.Length == 0) {
            return;
        }
        if ("gameover".Equals (a)) {
            // 游戏结束，3秒后回到房间
            Invoke ("BackToRoom", 3);
        }
    }
 ```



 8. 在 BGS官网 登录管理后台，创建游戏，修改服务器运行配置，包括：每秒帧率(默认60Hz)、房间最多玩家数 (2个或以上);
 9. 修改 玩家属性配置，设置各个属性的名称、类型、长度、值域、由云端/客户端编辑、其它玩家是否可见等。我这里仅有hp、position和rotation。
```
"player": {                         // 玩家的相关信息
    "attributes": {                 // 玩家在游戏内的属性，下面的都是示例，实际情况由开发者自定义
        "hp": {                     // 玩家的HP    
            "type": "int",          // HP属性类型为数字
            "max": 101              // HP的上限，int类型的属性，都可以设置其max，设置得越紧密，运行效率越高
        },
        "position": {
            "type": "float[]",
            "count": 2,
            "editable": true,
            "export": true
        },
        "rotation": {
            "type": "float",
            "editable": true,
            "export": true
        }
    }
}
```

10 . 打开 Eclipse 或 Android Studio，创建Java项目，导入 BmobGame_JavaCloud_vx.x.x_xxxxxx.jar，并创建 Player.java 和 Room.java，分别继承自 PlayerBase.class 和 RoomBase.class 后，编写游戏逻辑代码。

**Player.java :**

```
package cn.bmob.gamesdk.server.custom;

import cn.bmob.gamesdk.server.api.BmobGameSDKHook;
import cn.bmob.gamesdk.server.api.JSON;
import cn.bmob.gamesdk.server.api.PlayerBase;

public class Player extends PlayerBase {
    @BmobGameSDKHook
    public native int getHp();

    @BmobGameSDKHook
    public strictfp void onUpdate_Hp() {
        for (Player p : roommates)
            if (p.getHp() != 0)
                return;
        gameOver();
    }

    private final void gameOver() {
        sendToAll(JSON.toJson("action", "gameover").toString().getBytes());
        room.dispatchGameOver();
    }
}

```


**Room.java :**


```
package cn.bmob.gamesdk.server.custom;

import cn.bmob.gamesdk.server.api.RoomBase;

public class Room extends RoomBase{
}
```

11 . 打包运行游戏，就可以多人同时在线对战啦~



##五子棋/象棋匹配对战##

如何在1小时内将单机下棋游戏改造成多人联网实时对战小游戏

![小程序二维码](//bmob-cdn-12841.b0.upaiyun.com/2018/05/04/ef8b1dd640626c6080af0508497c8c96.png)

----------



### 1.获取 [比目游戏云服务](//game.bmob.cn) (下称 官网)的账号；

### 2. 在官网下载 **微信小游戏SDK**，导入到原有的单机下棋项目中；

### 3. 初始化sdk，第一个参数修改为官网获取的 AppKey，第二个参数可先不填，要做第四个步骤获得。 
    
    import BGS from '../../js/bmobgamesdk/bgsapi';//根据你自己的存放路径更改
    let model = BGS.instance;

    model.Init('3f729baax0', 'ws://139.159.220.251:29175', function (succ, msg) {
      if (succ) {
        // 用bmob小程序sdk进行登录注册
        // _getUser(listener);
      } else{
        // 提醒失败，并给重新init的按钮
      }
    });
        
        
### 4. 创建房间，获得Bgs.instance.Init的第二个参数 ### 
    
    import BGS from '../../js/bmobgamesdk/bgsapi';//根据你自己的存放路径更改
    let model = BGS.instance;
    
    var userId =  Bmob.User.current().id;
    model.CreateRoom(userId, 2, function(isOK, res) {
            console.log("res >", res);
            if (isOK) {
              var roomInfo = res.roomInfo;
              console.log('对战开房成功', _data);
              // 创建房间成功，跳转游戏房间页面，别忘了把房间信息roomInfo传递过去
            } else {
              common.showModal('对战开房失败，' + res);
            }
          });

运行游戏，打开network抓包，创建一个房间，查看这个操作的返回结果，返回结果为

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
这样，你就获得了初始化sdk的第二个参数，是 **ws://a.b.c.d:efgh** 这样的格式     


### 5. 加入房间，初始化监听器

    import BGS from '../../js/bmobgamesdk/bgsapi';//根据你自己的存放路径更改
    let model = BGS.instance;
    
    if (this.isConnected)
      return;
    t('连接房间');
    this.mRoomActListener = this.onRoomAction.bind(this);
    this.mOfflineListener = this.onOffline.bind(this);
    model.RegistRoomActListener(this.mRoomActListener);// 注册系统通知监听，详细参考官网下载的demo
    model.RegistOfflineListener(this.mOfflineListener);// 注册掉线通知监听

    let emptyFun = function() {};
    model.SetGameRuntimeListeners(
      emptyFun,//这三个监听器本游戏中没有涉及
      emptyFun,
      emptyFun,
      this.onTransfer.bind(this),// 玩家间交互信息的监听器
      this.onCloudNotify.bind(this)//云端代码通知的监听器
    );
    
    // 加入房间
    // 这里的roomData就是创建房间时让你保存的roomInfo啦
    model.JoinRoom(that.roomData.rid, that.roomData.joinKey, userId, model.get('seatKey'), function(isOK, data) {
      if (isOK) {
        common.toast('加入房间成功');
        console.log("房间信息:", data);
        
        let
          playerCount = data.playerCount,
          no = data.no,
          isPlaying = data.isPlaying,
          players = data.players,
          masterId = data.master;
        
        // 根据返回的房间信息做些保存或处理，这里不详细写出来，大家根据自己的情况灵活变通...
        
        if (data.seatKey)
          model.set('seatKey', data.seatKey);
        that.isConnected = true;

        return;
      }
        
      //加入房间失败
      if (data.indexOf("204") > -1)
        data = "房间已关闭";
      else if (data.indexOf("206") > -1)
        data = "房间已满员";
      else if (data.indexOf("201") > -1)
        data = "未知错误";
      else if (data.indexOf("203") > -1)
        data = "没有登陆";
      else if (data.indexOf("208") > -1)
        data = "游戏中";
      else if (data.indexOf("204") > -1)
        data = "房间不存在";
      else if (data.indexOf("202") > -1)
        data = "参数错误";

      console.log('加入房间失败:', data);
    }.bind(this));
    
    // 收到客户端的回调
    onTransfer(no, res) {
        console.log("收到客户端的回调:" + no, res)
        let flag = res.shift();
        switch (flag) {
          case 1: // 下棋
            t('收到客户端的下棋数据');
            t(res);
            break;
          case 2: // 被请求悔棋
            // ...
            
        }
    },
    // 收到云端代码服务端的回调
    onCloudNotify(notify) {
       notify = JSON.parse(model.bytesToString(notify, 0, notify.length));
       console.log("收到服务器的回调:", notify);
      // ...
    },


### 6. 实现下棋数据的实时交互
    
    // 玩家之间交互数据，上面的onTransfer会收到对方发送的
    // 要以byte数组形式，一般把数组的第一位作为自定义交互类型flag，后面的为要交互的数据
    model.SendTransferToAllExceptSelf([1, ...]);
    
    // sdk特别提供了把string和byte数组互转的方法
    model.stringToBytes('string'); // string转byte[]
    model.model.bytesToString(bs, 0, bs.length); // byte[]转string
    
    // 调用云端代码，参数为云端代码方法名
    model.CloudAction('Ready');
    

### 7. 实现云端代码逻辑

打开 Eclipse 或 Android Studio，创建Java项目，导入 BmobGame_JavaCloud_vx.x.x_xxxxxx.jar，并创建 Player.java 和 Room.java，分别继承自 PlayerBase.class 和 RoomBase.class 后，编写游戏逻辑代码。写好后提交到官网管理后台的**云函数**处。
这两个java文件的编写主要查看[另一篇教程][2]。



### 8. 离开房间

      //生命周期函数--监听页面卸载
      onUnload: function() {
        if (this.isConnected) {
          // model.SendTransferToAllExceptSelf([4]);// 向对方发送离开信息
          model.UnregistOfflineListener(this.mOfflineListener);
          model.StopGameRuntimeListener();
          this.mOfflineListener = null;
          model.QuitRoom();
        }
     ｝
     


----------

## 贪吃蛇大作战


如果以下方式无法开始游戏

- 由于开发时间仓促，如果游戏出现逻辑性问题，那才是正常的
- 如果有时候进不去游戏，或者创建房间失败，可能是游戏正在维护，也可能是因为已经终止内测
- 如果你还是很想反馈bug，请联系客服QQ：2093289624


### 链接

[Hydra对战](http://game.bmob.cn/static/demo/hydra/index.html)

### 二维码

![Hydra对战](https://bmob-cdn-18902.b0.upaiyun.com/2018/05/08/ba758ddd40f3db0a80c26394ff31254b.png)

