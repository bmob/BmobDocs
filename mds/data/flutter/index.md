# bmob-flutter-sdk
Bmob Flutter SDK

Flutter官方咨询QQ群：788254534


# 1、集成

## 1.1、依赖
依赖配置：
```
dependencies:
  data_plugin: ^0.0.6
```
## 1.2、安装
安装指令：
```
$ flutter packages get
```
## 1.3、导入
导入语句：
```
import 'package:data_plugin/data_plugin.dart';
```
## 1.4、仓库
可以在dart仓库搜索"data_plugin"查看具体信息：
```
https://pub.dartlang.org/
```
安装介绍：
```
https://pub.dartlang.org/packages/data_plugin#-installing-tab-
```

## 1.5、平台
目前涉及到特定平台信息处理的方法只适配了Android外，其他方法均兼容Android、iOS。

## 1.6、参考
源码：
```
https://github.com/bmob/bmob-flutter-sdk/tree/master/data_plugin
```
案例：
```
https://github.com/bmob/bmob-flutter-sdk/tree/master/data_demo
```
# 2、使用

1、初始化

在runApp中进行一下初始化操作：
```
//SDK初始化，masterkey为管理权限密钥，建议在客户端使用时置空
static void initMasterKey(appId, apiKey, masterKey);
```
2、导入源码

Dart要求，在使用具体功能代码的时候需要先导入对应代码的所在源文件。
例如，使用BmobUser前需要导入：
```
import 'package:data_plugin/bmob/table/bmob_user.dart';
```
3、发布库

此SDK插件只用于Bmob数据服务相关的数据操作，与此服务无关的UI以及其他涉及平台功能的操作需要开发者自行编写。Dart允许开发者自己编写相关的UI库以及平台插件，并发布到Dart仓库供所有开发者使用，具体可以参考：
```
https://zhuanlan.zhihu.com/p/60136574
```

## 2.1、数据类型

### 2.1.1、基本数据类型
1、基本数据类型 BmobObject

|属性|解释|
|----|----|
|objectId|数据唯一标志|
|createdAt|数据创建时间|
|updatedAt|数据更新时间|
|ACL|数据访问权限|


2、时间类型 BmobDate

|属性|解释|
|----|----|
|iso|时间|

3、文件类型 BmobFile

|属性|解释|
|----|----|
|url|文件地址|
|filename|文件名称|

4、位置类型 BmobGeoPoint

|属性|解释|
|----|----|
|latitude|纬度|
|longitude|经度|

5、用户类型 BmobUser

继承自BmobObject

|属性|解释|
|----|----|
|username|用户名|
|password|密码
|email|邮箱|
|emailVerified|邮箱是否验证|
|mobilePhoneNumber|手机号码|
|mobilePhoneNumberVerified|手机号码是否验证|

6、设备类型 BmobInstallation

|属性|解释|
|----|----|
|installationId|设备ID|

7、角色类型 BmobRole

|属性|解释|
|----|----|
|name|角色名称|
|roles|子角色|
|users|角色用户|

### 2.1.2、自定义数据类型

1、继承BmobObject

2、进行JSON序列化处理
参考：
```
https://zhuanlan.zhihu.com/p/59932453
```

## 2.2、增删改查一条数据

新增：
```
///保存一条数据
void _saveSingle(BuildContext context) {
  BmobUser bmobUser = BmobUser();
  bmobUser.objectId = "7c7fd3afe1";
  Blog blog = Blog();
  blog.title = "博客标题";
  blog.content = "博客内容";
  blog.author = bmobUser;
  blog.like = 77;
  blog.save(successListener: (BmobSaved data) {
    String message = "创建一条数据成功：${data.objectId} - ${data.createdAt}";
    currentObjectId = data.objectId;
    print(message);
    showSuccess(context, message);
  }, errorListener: (BmobError bmobError) {
    String message = "创建一条数据失败：${bmobError.error}";
    print(message);
    showError(context, message);
  });
}
```

查询：
```
///查询一条数据
void _querySingle(BuildContext context) {
  if (currentObjectId != null) {
    BmobQuery<Blog> bmobQuery = BmobQuery();
    bmobQuery.setInclude("author");
    bmobQuery.queryObject(currentObjectId, successListener: (dynamic data) {
      Blog blog = Blog.fromJson(data);
      print(blog.title);
      showSuccess(context,
          "查询一条数据成功：${blog.title} - ${blog.content} - ${blog.author.username}");
    }, errorListener: (BmobError error) {
      print(error.error);
      showError(context, error.error);
    });
  } else {
    showError(context, "请先新增一条数据");
  }
}
```

修改：
```
///修改一条数据
void _updateSingle(BuildContext context) {
  if (currentObjectId != null) {
    Blog blog = Blog();
    blog.objectId = currentObjectId;
    blog.title = "修改一条数据";
    blog.content = "修改一条数据";
    blog.update(successListener: (BmobUpdated data) {
      print(data.updatedAt);
      showSuccess(context, "修改一条数据成功：${data.updatedAt}");
    }, errorListener: (BmobError error) {
      print(error);
      showError(context, "修改一条数据失败：${error.error}");
    });
  } else {
    showError(context, "请先新增一条数据");
  }
}
```

删除：
```
///删除一条数据
void _deleteSingle(BuildContext context) {
  if (currentObjectId != null) {
    Blog blog = Blog();
    blog.objectId = currentObjectId;
    blog.delete(successListener: (BmobHandled data) {
      currentObjectId = null;
      print(data.msg);
      showSuccess(context, "删除一条数据成功：${data.msg}");
    }, errorListener: (BmobError error) {
      print(error);
      showError(context, "删除一条数据失败：${error.error}");
    });
  } else {
    showError(context, "请先新增一条数据");
  }
}
```
删除字段值：
```
///删除一个字段的值
void _deleteFieldValue(BuildContext context) {
  if (currentObjectId != null) {
    Blog blog = Blog();
    blog.objectId = currentObjectId;
    blog.deleteFieldValue("content",successListener: (BmobUpdated data) {
      print(data.updatedAt);
      showSuccess(context, "删除发布内容成功：${data.updatedAt}");
    }, errorListener: (BmobError error) {
      print(error);
      showError(context, "删除发布内容失败：${error.error}");
    });
  } else {
    showError(context, "请先新增一条数据");
  }
}
```

## 2.3、查询多条数据

等于：
```
//等于条件查询
void _queryWhereEqual(BuildContext context) {
  BmobQuery<Blog> query = BmobQuery();
  query.addWhereEqualTo("title", "博客标题");
  query.queryObjects(successListener: (List<dynamic> data) {
    List<Blog> blogs = data.map((i) => Blog.fromJson(i)).toList();
    for (Blog blog in blogs) {
      if (blog != null) {
        print(blog.objectId);
        print(blog.title);
        print(blog.content);
      }
    }
  }, errorListener: (BmobError error) {
    print(error.error);
    showError(context, error.error);
  });
}
```
不等于：
```
//不等条件查询
void _queryWhereNotEqual(BuildContext context) {
  BmobQuery<Blog> query = BmobQuery();
  query.addWhereNotEqualTo("title", "博客标题");
  query.queryObjects(successListener: (List<dynamic> data) {
    List<Blog> blogs = data.map((i) => Blog.fromJson(i)).toList();
    for (Blog blog in blogs) {
      if (blog != null) {
        print(blog.objectId);
        print(blog.title);
        print(blog.content);
      }
    }
  }, errorListener: (BmobError error) {
    print(error.error);
    showError(context, error.error);
  });
}
```
小于：
```
//小于条件查询
void _queryWhereLess(BuildContext context) {
  BmobQuery<Blog> query = BmobQuery();
  query.addWhereLessThan("like", 80);
  query.queryObjects(successListener: (List<dynamic> data) {
    List<Blog> blogs = data.map((i) => Blog.fromJson(i)).toList();
    for (Blog blog in blogs) {
      if (blog != null) {
        print(blog.objectId);
        print(blog.title);
        print(blog.content);
      }
    }
  }, errorListener: (BmobError error) {
    print(error.error);
    showError(context, error.error);
  });
}
```
小于等于：
```
//小于等于条件查询
void _queryWhereLessEqual(BuildContext context) {
  BmobQuery<Blog> query = BmobQuery();
  query.addWhereLessThanOrEqualTo("like", 77);
  query.queryObjects(successListener: (List<dynamic> data) {
    List<Blog> blogs = data.map((i) => Blog.fromJson(i)).toList();
    for (Blog blog in blogs) {
      if (blog != null) {
        print(blog.objectId);
        print(blog.title);
        print(blog.content);
      }
    }
  }, errorListener: (BmobError error) {
    print(error.error);
    showError(context, error.error);
  });
}
```
大于：
```
//大于条件查询
void _queryWhereLarge(BuildContext context) {
  BmobQuery<Blog> query = BmobQuery();
  query.addWhereGreaterThan("like", 70);
  query.queryObjects(successListener: (List<dynamic> data) {
    List<Blog> blogs = data.map((i) => Blog.fromJson(i)).toList();
    for (Blog blog in blogs) {
      if (blog != null) {
        print(blog.objectId);
        print(blog.title);
        print(blog.content);
      }
    }
  }, errorListener: (BmobError error) {
    print(error.error);
    showError(context, error.error);
  });
}
```
大于等于：
```
//大于等于条件查询
void _queryWhereLargeEqual(BuildContext context) {
  BmobQuery<Blog> query = BmobQuery();
  query.addWhereGreaterThanOrEqualTo("like", 77);
  query.queryObjects(successListener: (List<dynamic> data) {
    List<Blog> blogs = data.map((i) => Blog.fromJson(i)).toList();
    for (Blog blog in blogs) {
      if (blog != null) {
        print(blog.objectId);
        print(blog.title);
        print(blog.content);
      }
    }
  }, errorListener: (BmobError error) {
    print(error.error);
    showError(context, error.error);
  });
}
```
## 2.4、关联操作

添加：
```
//添加关联关系
void _addPointer() {
  Blog blog = Blog();
  User user = User();
  user.objectId = "4760e7a143";
  blog.author = user;
  blog.title = "添加关联关系";
  blog.content = "添加帖子对应的作者";
  blog.save(successListener: (BmobSaved bmobSaved) {
    currentObjectId = bmobSaved.objectId;
    print(bmobSaved.objectId);
    DataPlugin.toast("添加成功：\n${bmobSaved.objectId}\n${bmobSaved.createdAt}");
  }, errorListener: (BmobError bmobError) {
    print(bmobError);
    DataPlugin.toast(bmobError.toString());
  });
}
```
解除：
```
//解除关联关系
void _deletePointer() {
  if (currentObjectId == null) {
    DataPlugin.toast("请先添加关联关系");
    return;
  }
  Blog blog = Blog();
  blog.objectId = currentObjectId;
  blog.deleteFieldValue("author", successListener: (BmobUpdated bmobUpdate) {
    print(bmobUpdate.updatedAt);
    DataPlugin.toast(bmobUpdate.updatedAt);
  }, errorListener: (BmobError bmobError) {
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```
修改：
```
//修改关联关系
void _modifyPointer() {
  if (currentObjectId == null) {
    DataPlugin.toast("请先添加关联关系");
    return;
  }
  Blog blog = Blog();
  blog.objectId = currentObjectId;
  User user = User();
  user.objectId = "358f092cb1";
  blog.author = user;
  blog.update(successListener: (BmobUpdated bmobUpdated) {
    print(bmobUpdated.updatedAt);
    DataPlugin.toast(bmobUpdated.updatedAt);
  }, errorListener: (BmobError bmobError) {
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```
查询：
```
//查询关联数据
void _queryPointer() {
  BmobQuery<Blog> query = BmobQuery();
  query.setInclude("author");
  query.queryObjects(successListener: (List<dynamic> data) {
    DataPlugin.toast("查询成功${data.length}");
    List<Blog> blogs = data.map((i) => Blog.fromJson(i)).toList();
    for (Blog blog in blogs) {
      if (blog != null) {
        print(blog.objectId);
        print(blog.title);
        print(blog.content);
        if (blog.author != null) {
          print(blog.author.objectId);
          print(blog.author.username);
        }
      }
    }
  }, errorListener: (BmobError error) {
    print(error.error);
    DataPlugin.toast(error.error);
  });
}
```

## 2.5、位置操作
添加：
```
//添加位置数据
void _addGeoPoint() {
  Blog blog = Blog();
  BmobGeoPoint bmobGeoPoint = BmobGeoPoint();
  bmobGeoPoint.latitude = 12.4445;
  bmobGeoPoint.longitude = 124.122;

  blog.addr = bmobGeoPoint;
  blog.save(successListener: (BmobSaved bmobSaved) {
    print(bmobSaved.objectId);
    DataPlugin.toast(bmobSaved.objectId);
  }, errorListener: (BmobError bmobError) {
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```


## 2.6、时间操作

添加：
```
//添加时间数据
void _addDate() {
  DateTime dateTime = DateTime.now();
  BmobDate bmobDate = BmobDate();
  bmobDate.setDate(dateTime);
  Blog blog = Blog();
  blog.time = bmobDate;
  blog.title = "添加时间类型";
  blog.content = "测试时间类型的请求";
  blog.save(successListener: (BmobSaved bmobSaved){
    print(bmobSaved.objectId);
    DataPlugin.toast(bmobSaved.objectId);
  },errorListener: (BmobError bmobError){
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```

获取服务器时间：
```
//获取服务器时间
void _getServerTime() {
  BmobDateManager.getServerTimestamp(successListener: (ServerTime serverTime) {
    print(serverTime);
    DataPlugin.toast("${serverTime.timestamp}\n${serverTime.datetime}");
  }, errorListener: (BmobError bmobError) {
    print(bmobError);
    DataPlugin.toast(bmobError.toString());
  });
}
```

## 2.7、文件操作

上传文件，Android在上传前需先允许文件访问权限，可以使用SDK自带的文件选择器。
```
//上传文件，上传文件涉及到android的文件访问权限，调用此方法前需要开发者们先适配好应用在各个android版本的权限管理。
void _uploadFile(String path) {
  if(path==null){
    DataPlugin.toast("请先选择文件");
    return;
  }
  DataPlugin.toast("上传中，请稍候……");
  File file = new File(path);
  BmobFileManager.upload(file, successListener: (BmobFile bmobFile) {
    _bmobFile = bmobFile;
    _url = bmobFile.url;
    print("${bmobFile.cdn}\n${bmobFile.url}\n${bmobFile.filename}");
    DataPlugin.toast(
        "上传成功：${bmobFile.cdn}\n${bmobFile.url}\n${bmobFile.filename}");
  }, errorListener: (BmobError bmobError) {
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```
添加已上传文件到表中：
```
//添加文件到表中
void _addFile(BmobFile bmobFile) {
  if(bmobFile==null){
    DataPlugin.toast("请先上传文件");
    return;
  }
  Blog blog = Blog();
  blog.pic = bmobFile;
  blog.save(successListener: (BmobSaved bmobSaved) {
    print(bmobSaved.objectId);
    DataPlugin.toast("添加成功："+bmobSaved.objectId);
  }, errorListener: (BmobError bmobError) {
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```
下载已上传文件：
```
//下载文件，直接使用dio下载，下载文件涉及到android的文件访问权限，调用此方法前需要开发者们先适配好应用在各个android版本的权限管理。
void _downloadFile(String url, String path) async {
  if(url==null){
    DataPlugin.toast("请先上传文件");
    return;
  }
  Dio dio = Dio();
  Response<dynamic> response = await dio.download(url, path);
  print(response.toString());
  print(response.data);

  DataPlugin.toast("下载结束");
}
```
删除已上传文件：
```
//删除文件
void _deleteFile(String url) {
  if(url==null){
    DataPlugin.toast("请先上传文件");
    return;
  }
  BmobFileManager.delete(url, successListener: (BmobHandled bmobHandled) {
    print(bmobHandled.msg);
    DataPlugin.toast("删除成功："+bmobHandled.msg);
  }, errorListener: (BmobError bmobError) {
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```
## 2.8、用户操作
登录：
```
void _login(BuildContext context) {
  print({'邮箱': _email, '密码': _password});
  BmobUser bmobUserRegister = BmobUser();
  bmobUserRegister.username = _email;
  bmobUserRegister.password = _password;
  bmobUserRegister.login(successListener: (BmobUser data) {
    print("用户登录成功：" + data.username);

    showSuccess(context, "登录成功："+data.username);
  }, errorListener: (BmobError bmobError) {
    print("用户登录失败：" + bmobError.error);
  });
}
```
注册：
```
void _register() {
  print({'手机号': _email, '密码': _password});
  BmobUser bmobUserRegister = BmobUser();
  bmobUserRegister.username = _email;
  bmobUserRegister.password = _password;
  bmobUserRegister.register(successListener: (BmobRegistered data) {
    String message = "用户注册成功：" + data.objectId;
    print(message);
    showResult(context, "success", message);
  }, errorListener: (BmobError bmobError) {
    String message = "用户注册失败：" + bmobError.error;
    print(message);
    showResult(context, "error", message);
  });
}

```
## 2.9、角色操作
添加角色：
```
void _saveRole() {
  BmobRole bmobRole =BmobRole();
  bmobRole.name ="teacher";
  User user = User();
  user.setObjectId("f06590e3c2");
  BmobRelation bmobRelation = BmobRelation();
  bmobRelation.add(user);
  bmobRole.setUsers(bmobRelation);
  bmobRole.save(successListener: (BmobSaved bmobSaved) {
    print(bmobSaved.objectId);
    DataPlugin.toast(bmobSaved.objectId);
  }, errorListener: (BmobError bmobError) {
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```

## 2.10、数据访问权限操作

设置数据公共访问权限：
```
void _saveDataAndPublicAcl() {
  Blog blog = Blog();
  blog.title = "帖子标题";
  User user = User();
  user.setObjectId("f06590e3c2");
  blog.author = user;
  blog.content = "帖子内容";
  BmobAcl bmobAcl = BmobAcl();
  bmobAcl.setPublicReadAccess(true);
  blog.setAcl(bmobAcl);
  blog.save(successListener: (BmobSaved bmobSaved) {
    print(bmobSaved.objectId);
    DataPlugin.toast(bmobSaved.objectId);
  }, errorListener: (BmobError bmobError) {
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```
设置某用户对该数据的访问权限：
```
void _saveDataAndUserAcl() {
  Blog blog = Blog();
  blog.title = "帖子标题";
  User user = User();
  user.setObjectId("f06590e3c2");
  blog.author = user;
  blog.content = "帖子内容";
  BmobAcl bmobAcl = BmobAcl();
  bmobAcl.addRoleReadAccess(user.getObjectId(),true);
  blog.setAcl(bmobAcl);
  blog.save(successListener: (BmobSaved bmobSaved) {
    print(bmobSaved.objectId);
    DataPlugin.toast(bmobSaved.objectId);
  }, errorListener: (BmobError bmobError) {
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```
设置某角色对该数据的访问权限：
```
void _saveDataAndRoleAcl() {
  Blog blog = Blog();
  blog.title = "帖子标题";
  User user = User();
  user.setObjectId("f06590e3c2");
  blog.author = user;
  blog.content = "帖子内容";
  BmobAcl bmobAcl = BmobAcl();
  bmobAcl.addRoleReadAccess("teacher",true);
  blog.setAcl(bmobAcl);
  blog.save(successListener: (BmobSaved bmobSaved) {
    print(bmobSaved.objectId);
    DataPlugin.toast(bmobSaved.objectId);
  }, errorListener: (BmobError bmobError) {
    print(bmobError.toString());
    DataPlugin.toast(bmobError.toString());
  });
}
```

## 2.11、设备操作
获取设备ID：
```
//获取设备ID，与原生交互
Future _getInstallationId(BuildContext context) async {
  String installationId = await BmobInstallationManager.getInstallationId();
  print(installationId);
  DataPlugin.toast(installationId);
}
```
初始化设备信息：
```
//初始化设备，与原生交互
void _initInstallation(BuildContext context) {
  BmobInstallationManager.init(
      successCallback: (BmobInstallation bmobInstallation) {
    print(bmobInstallation.toJson());
    DataPlugin.toast(bmobInstallation.toJson().toString());
  }, errorCallback: (BmobError error) {
    print(error.toJson());
  });
}

```


## 2.12、短信操作

发送短信验证码：
```
///发送短信验证码：需要手机号码
void _sendSms(BuildContext context) {
  print({'手机号码': _phoneNumber, '验证码': _smsCode});
  BmobSms bmobSms = BmobSms();
  bmobSms.template = "";
  bmobSms.mobilePhoneNumber = _phoneNumber;
  bmobSms.sendSms(successListener: (BmobSent data) {
    showSuccess(context, "发送成功:" + data.smsId.toString());
  }, errorListener: (BmobError error) {
    print(error.error);
    showError(context, error.error);
  });
}
```
验证短信验证码：
```
///验证短信验证码：需要手机号码和验证码
void _verifySmsCode(BuildContext context) {
  BmobSms bmobSms = BmobSms();
  bmobSms.mobilePhoneNumber = _phoneNumber;
  bmobSms.verifySmsCode(_smsCode, successListener: (BmobHandled data) {
    showSuccess(context, "验证成功："+data.msg);
  }, errorListener: (BmobError error) {
    showError(context, error.error);
  });
}

```

## 2.13、数据监听

```
///数据监听
void _listen() {
  RealTimeDataManager.getInstance().listen(
      onConnected: (Client client) {
        print("监听数据连接成功，开始订阅消息！");
        client.subTableUpdate("Blog");
      },
      onDisconnected: () {
        print("监听数据断开连接");
      },
      onDataChanged: (Change data) {
        Blog blog = Blog.fromJson(data.data);
        print("监听到数据变化："+blog.toJson().toString());
      },
      onError: (error) {
        print("监听数据发送错误："+error.toString());
      });
}
```

监听成功后的订阅动作：

|方法|解释|
|---|---|
|subTableUpdate|订阅表更新|
|subTableDelete|订阅表删除|
|subRowUpdate|订阅行更新|
|subRowDelete|订阅行删除|

