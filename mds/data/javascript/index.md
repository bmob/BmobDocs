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

获取Application ID和REST API Key后，下载SDK。


## 安装BmobSDK

一、把下面这行代码加入你的页面中，其中，"bmob-min.js"为SDK文件：

```
<script src="bmob-min.js"></script>
```




二、接着是加入下面这行代码进行初始化

```
Bmob.initialize("你的Application ID", "你的REST API Key");

```

## 添加一行数据

添加数据
```
    var GameScore = Bmob.Object.extend("GameScore");
    var gameScore = new GameScore();
    gameScore.set("score", 1337);
    gameScore.save(null, {
      success: function(object) {
        alert("create object success, object id:"+object.id);
      },
      error: function(model, error) {
        alert("create object fail");
      }
    });
```

## 获取一行数据

```
    var GameScore = Bmob.Object.extend("GameScore");
    var query = new Bmob.Query(GameScore);
    query.get("4edc3f6ee9", {
      success: function(object) {
        // The object was retrieved successfully.
        alert(object.get("score"));
      },
      error: function(object, error) {
        alert("query object fail");
      }
    });
```

## 修改一行数据

```
    var GameScore = Bmob.Object.extend("GameScore");
    var query = new Bmob.Query(GameScore);
    query.get("4edc3f6ee9", {
      success: function(object) {
        // The object was retrieved successfully.
        object.set("score", 1338);
        object.save(null, {
          success: function(objectUpdate) {
            alert("create object success, object score:"+objectUpdate.get("score"));
          },
          error: function(model, error) {
            alert("create object fail");
          }
        });
      },
      error: function(object, error) {
        alert("query object fail");
      }
    });
```

## 删除一行数据

```
    var GameScore = Bmob.Object.extend("GameScore");
    var query = new Bmob.Query(GameScore);
    query.get("4edc3f6ee9", {
      success: function(object) {
        // The object was retrieved successfully.
        object.destroy({
          success: function(deleteObject) {
          alert("delete success");
          },
          error: function(GameScoretest, error) {
          alert("delete fail");
          }
        });
      },
      error: function(object, error) {
        alert("query object fail");
      }
    });
```


## 源码下载

[快速入门相关源码下载](http://www.bmobapp.com/static/bmob_jssdk_quickstart.zip "快速入门相关源码下载")



