## 简介

- Bmob平台为您的移动应用提供了一个完整的后端解决方案，我们提供轻量级的SDK开发包，让开发者以最小的配置和最简单的方式使用Bmob平台提供的服务，进而完全消除开发者编写服务器代码以及维护服务器的操作。

- Bmob的JavaScript SDK基于`Backbone.js`框架开发，在使用过程中除`Bmob.view`类需要提供jQuery或者类似JQuery的`$`方法外，不需要再引入其他类库。

## 典型案例

聊天室：[http://chatroom.bmobapp.com](http://chatroom.bmobapp.com) （采用实时数据同步SDK开发，右击可直接查看源码）

## 应用程序
在Bmob平台注册后，每个账户可创建多个应用程序，创建的每个应用程序都有其独自的应用程序ID，此后所有的应用程序将凭其ID进行Bmob SDK的使用。即使只有一个应用程序，也可以以不同的版本进行测试和生产。

## 对象

### 数据对象
Bmob数据存储是建立在`Bmob.Object`基础上的。如记录游戏成绩的`Bmob.Object`示例如下：

```
score: 1337, playerName: "bmob", cheatMode: false
```

这里需要注意的是：

- 键必须是字母或者数字的字符串，值可以是字符串、数字、布尔值或者数组和字典。
- 每一个`Bmob.Object`都是一个特定子类的实例，子类名可以来区分各种数据，如我们可以把记录游戏成绩的类称之为`GameScore`。

### 创建对象

你可以使用`Bmob.Object.extend`方法来创建新的`Bmob.Object`子类，示例代码如下：

```
// 创建Bmob.Object子类
var GameScore = Bmob.Object.extend("GameScore");

// 创建该类的一个实例
var gameScore = new GameScore();

```

如果你想为`Bmob.Object`的子类添加一些实例方法和类方法，示例代码如下：

```
// 为Bmob.Object的子类添加实例方法和类方法
var GameScore = Bmob.Object.extend("GameScore", {
  //实例方法
  gleaterThanOneHundred: function() {
    return this.get("score") > 100;
  }
}, {
  //类方法
  spawn: function(score) {
    var gameScore = new GameScore();
    gameScore.set("score", score);
    return gameScore;
  }
});

var gameScore = GameScore.spawn(200);
alert(gameScore.gleaterThanOneHundred());
```

## 添加数据

添加数据非常简单，任何`Bmob.Object`子类都有`save`方法可以用于将当前对象的内容保存到服务端。示例代码如下：

```
//创建类和实例
var GameScore = Bmob.Object.extend("GameScore");
var gameScore = new GameScore();
gameScore.set("score", 137);
gameScore.set("playerName", "bmob");
gameScore.set("cheatMode", false);
//添加数据，第一个入口参数是null
gameScore.save(null, {
  success: function(gameScore) {
    // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
    alert('添加数据成功，返回的objectId是：' + gameScore.id);
  },
  error: function(gameScore, error) {
    // 添加失败
    alert('添加数据失败，返回错误信息：' + error.description);
  }
});
```

你也可以用如下的示例代码添加数据：

```
var GameScore = Bmob.Object.extend("GameScore");
var gameScore = new GameScore();
// 添加数据，第一个入口参数是Json数据
gameScore.save({
  score: 1337,
  playerName: "bmob",
  cheatMode: false
}, {
  success: function(gameScore) {
    // 添加成功
  },
  error: function(gameScore, error) {
    // 添加失败
  }
});
```

这里有几点需要注意的是:

1. 如果云端数据库中不存在`GameScore`表，Bmob会自动地在你第一次使用它的时候创建。
2. 每个`Bmob.Object`对象都有几个默认的字段是自动创建的：`objectId`是一个对于每一个保存的对象为一个标志；`createdAt`和`updatedAt`表示对象在Bmob中创建和最后一次更改的时间。这些字段的创建和内容是由服务器端自动完成的，在保存`Bmob.Object`之前不会存在。
3. 添加成功后，可以通过`gameScore.createdAt`获取对象的创建时间，通过`gameScore.updatedAt`获取对象的更新时间；可以通过`gameScore.id`获取对象的objectId。


## 查询数据

数据的查询是每个应用都会频繁使用到的，Bmob提供了`Bmob.Object`类，方便大家实现不同条件的查询。

### 查询所有数据

查询某个数据表中的所有数据是非常简单的，只需要使用`Bmob.Query`的`find`方法就可以了，示例代码如下：

```
var GameScore = Bmob.Object.extend("GameScore");
var query = new Bmob.Query(GameScore);
// 查询所有数据
query.find({
  success: function(results) {
    alert("共查询到 " + results.length + " 条记录");
    // 循环处理查询到的数据
    for (var i = 0; i < results.length; i++) {
      var object = results[i];
      alert(object.id + ' - ' + object.get('playerName'));
    }
  },
  error: function(error) {
    alert("查询失败: " + error.code + " " + error.message);
  }
});
```

如果你只想要一个结果，一个更加方便的方法是使用`first`，而不是`find`方法，示例代码如下：

```
var GameScore = Bmob.Object.extend("GameScore");
var query = new Bmob.Query(GameScore);
query.first({
  success: function(object) {
    // 查询成功
  },
  error: function(error) {
    alert("查询失败: " + error.code + " " + error.message);
  }
});
```

**这里需要注意一点的是：**
默认情况下，系统实际上并不会返回所有的数据，而是默认返回10条数据记录，你可以通过setLimit方法设置返回的记录数量。更多细节可[点击查看分页查询](http://docs.bmobapp.com/data/JavaScript/b_developdoc/doc/index.html#分页查询)一节。

### 获取对象的特殊属性

注意，在对象中获取objectId，createdAt，updatedAt的方法分别如下：
obj.id
obj.createdAt
obj.updatedAt

### 查询单条数据

当我们知道某条数据的`objectId`时，就可以根据`objectId`值直接获取单条数据对象，示例代码如下：

```
var GameScore = Bmob.Object.extend("GameScore");
//创建查询对象，入口参数是对象类的实例
var query = new Bmob.Query(GameScore);
//查询单条数据，第一个参数是这条数据的objectId值
query.get("82c3e62d2c", {
  success: function(gameScore) {
    // 查询成功，调用get方法获取对应属性的值
	var score = gameScore.get("score");
	var playerName = gameScore.get("playerName");
	var cheatMode = gameScore.get("cheatMode");
  },
  error: function(object, error) {
    // 查询失败
  }
});
```

### 条件查询

如果要查询某个属性等于某个值，示例代码如下：

```
query.equalTo("playerName", "bmob");
```
如果要查询某个属性不等于某个值，示例代码如下：
```
query.notEqualTo("playerName", "bmob cloud");
```

对查询的属性值进行大小比较的示例代码如下：

```
// score < 50
query.lessThan("score", 50);

// score <= 50
query.lessThanOrEqualTo("score", 50);

// score > 50
query.greaterThan("score", 50);

// score >= 50
query.greaterThanOrEqualTo("score", 50);
```

两条查询语句一起写，就相当于`AND`查询，如下示例代码，查询同时满足`"playerName"="bmob" and "score">100`的数据：

```
query.notEqualTo("playerName", "bmob");
query.greaterThan("score", 100);
```

一个完整的例子：

```
var GameScore = Bmob.Object.extend("GameScore");
var query = new Bmob.Query(GameScore);
query.equalTo("playerName", "bmob");
// 查询所有数据
query.find({
	success: function(results) {
		alert("共查询到 " + results.length + " 条记录");
		// 循环处理查询到的数据
		for (var i = 0; i < results.length; i++) {
		var object = results[i];
		alert(object.id + ' - ' + object.get('playerName'));
		}
	},
	error: function(error) {
		alert("查询失败: " + error.code + " " + error.message);
	}
});
```


### 分页查询

有时，在数据比较多的情况下，你希望查询出的符合要求的所有数据能按照多少条为一页来显示，这时可以使用`limit`方法来限制查询结果的数据条数来进行分页。默认情况下，Limit的值为10，最大有效设置值1000（设置的数值超过1000还是视为1000）。
```
// 返回最多10条数据
query.limit(10);
```
在数据较多的情况下，在`limit`的基础上分页显示数据是比较合理的解决办法，`skip`方法可以做到跳过查询的前多少条数据来实现分页查询的功能。默认情况下`skip`的值为10。

```
query.skip(10); // skip the first 10 results
```

### 结果排序

我们可以对返回的结果进行排序（只支持`number`和`string`类型的排序），示例代码如下：
```
// 对score字段升序排列
query.ascending("score");

// 对score字段降序排列
query.descending("score");
```


### 统计记录数量

如果你只是想统计满足`query`的结果集到底有多条记录，你可以使用`count`方法。如为了获得GameScore表的记录数量，示例代码如下：

```
var GameScore = Bmob.Object.extend("GameScore");
var query = new Bmob.Query(GameScore);
query.count({
  success: function(count) {
    // 查询成功，返回记录数量
    alert("共有 " + count + " 条记录");
  },
  error: function(error) {
    // 查询失败
  }
});

```

### 复杂查询

如果你想查询某一字段值在某一集合中的记录的话，可以使用`containedIn`方法，如获取`"Bmob"、"Codenow"、"JS" `这三位玩家的记录信息，那么示例代码如下：
```
// 第一个参数是字段名称，第二个参数是数组
query.containedIn("playerName", ["Bmob", "Codenow", "JS"]);

```

相反地，你可以使用`notContainedIn`方法来查询在集合外的目标对象。

如果想要查询含有某一特定属性的对象，可以使用`exists`。相对地，如果你想获取没有这一特定属性的对象，你可以使用`doesNotExist`，示例代码如下：
```
// 查询含有score属性的对象
query.exists("score");

// 查询不含有score属性的对象
query.doesNotExist("score");
```

你可以使用`matchesKeyInQuery`方法来进行嵌套的子查询。举例说，如果你有一个类包含了运动队， 而你在用户类中存储了用户的家乡信息，你可以构造一个查询来查找某地的运动队有赢的记录的用户，示例代码如下：
```
var Team = Bmob.Object.extend("Team");
var teamQuery = new Bmob.Query(Team);
teamQuery.greaterThan("winPct", 0.5);
var userQuery = new Bmob.Query(Bmob.User);
userQuery.matchesKeyInQuery("hometown", "city", teamQuery);
userQuery.find({
  success: function(results) {
    // results has the list of users with a hometown team with a winning record
  }
});
```

相对地，可以使用`doesNotMatchKeyInQuery`来获取属性不在子查询结果中的对象。比如为了获得用户的家乡队输了的情况：
```
var Team = Bmob.Object.extend("Team");
var teamQuery = new Bmob.Query(Team);
teamQuery.greaterThan("winPct", 0.5);
var userQuery = new Bmob.Query(Bmob.User);
userQuery.doesNotMatchKeyInQuery("hometown", "city", teamQuery);
userQuery.find({
  success: function(results) {
    // results has the list of users with a hometown team with a winning record
  }
});
```

### 查询指定列

有时候你不想返回所有的字段信息，那么就可以用`select`方法来限定返回的字段。示例代码如下：
```
var GameScore = Bmob.Object.extend("GameScore");
var query = new Bmob.Query(GameScore);
// 只返回score和playerName字段值
query.select("score", "playerName");
query.find().then(function(results) {
  // 返回成功
});
```

**注意：系统默认的字段`objectId`、`createdAt`、`updatedAt`、`ACL`也会返回。**


### 对字符串类型做查询

如果想要查询以某一个特定字符串开头的记录，可以使用`startsWith`方法，示例代码如下：

```
// 查询在playerName字段中以bm开头的记录
var query = new Bmob.Query(GameScore);
query.startsWith("playerName", "bm");
```

### 或查询

你可以使用`Bmob.Query.or`方法操作或查询，示例代码如下：

```
var lotsOfWins = new Bmob.Query(GameScore);
lotsOfWins.greaterThan("score", 150);

var fewWins = new Bmob.Query(GameScore);
fewWins.lessThan("score", 5);

var mainQuery = Bmob.Query.or(lotsOfWins, fewWins);
mainQuery.find({
  success: function(results) {
     // 返回 score > 150 or score < 5 的值
  },
  error: function(error) {
    // 返回失败
  }
});
```

**注意：我们不会在组合查询的子查询中支持非过滤型的条件 (比如:limit,skip,ascending/descending,include)**

## 修改数据

修改数据非常简单，首先需要获取到要更新的`Bmob.Object`对象，修改值后保存数据就可以了，示例代码如下：

```
var GameScore = Bmob.Object.extend("GameScore");
var query = new Bmob.Query(GameScore);

// 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
query.get('3453453453fdsdf', {
    success: function(gameScore) {
      // 回调中可以取得这个 GameScore 对象的一个实例，然后就可以修改它了
      gameScore.set('title', 'test!');
      gameScore.save();

      // The object was retrieved successfully.
    },
    error: function(object, error) {

    }
});
```
或者

```
var GameScore = Bmob.Object.extend("GameScore");
var gameScore = new GameScore();
gameScore.set("cheatMode", true);
gameScore.set("score", 1338);
//添加数据
gameScore.save(null, {
  success: function(gameScore) {
    // 修改数据
    gameScore.set("cheatMode", true);
    gameScore.set("score", 1338);
    gameScore.save();
  }
})
```

如果想更新成功后获取更新后的对象属性，请设置`fetchWhenSave`：

```
 //假设gamescore是已经存在的对象
    gameScore.fetchWhenSave(true);
    gameScore.set("cheatMode", true);
    gameScore.set("score", 1338);
    gameScore.save();
```

## 删除数据

删除数据可以使用`Bmob.Object`的`destroy`方法，示例代码如下：

```
myObject.destroy({
  success: function(myObject) {
    // 删除成功
  },
  error: function(myObject, error) {
    // 删除失败
  }
});

```


### 删除字段

你可以使用`unset`方法在删除一个字段：

```
// 删除playerName字段
myObject.unset("playerName");
myObject.save();
```

## 常见数据类型的操作

```
var number = 42;
var string = "the number is " + number;
var date = new Date();
var array = [string, number];
var object = { number: number, string: string };

var bigObject = new BigObject();
bigObject.set("myNumber", number);
bigObject.set("myString", string);
bigObject.set("myDate", date);
bigObject.set("myArray", array);
bigObject.set("myObject", object);
bigObject.set("myNull", null);
bigObject.save();
```

## 数组操作

### 添加及更新数组
为了帮你存储数组类数据，有三种操作你可以原子性地改动一个数组，这需要一个给定的 key：

- `add`在一个数组的末尾加入一个给定的对象。
- `addUnique`只会把原本不存在的对象加入数组，所以加入的位置没有保证。

比如, 我们想在数组"skills"中加入项目：

```
gameScore.addUnique("skills", "flying");
gameScore.addUnique("skills", "kungfu");
gameScore.save();
```

### 数组查询
对于value是数组的情况，你可以这样查询数组中的值有`2`的情况的对象：

```
// Find objects where the array in arrayKey contains 2.
query.equalTo("arrayKey", 2);
```

你同样可以用下面的方式找到同时包含元素`2、3、4`的数组：
```
// Find objects where the array in arrayKey contains all of the elements 2, 3, and 4.
query.containsAll("arrayKey", [2, 3, 4]);
```

### 删除数组

`remove`在一个数组中删除所有指定的所有实例：

```
var GameScoretest = Bmob.Object.extend("GameScoretest");
var query = new Bmob.Query(GameScoretest);
query.get("bc5da708dc",{
  success: function(gameScore) {
    gameScore.remove("skills","test");
    gameScore.save();
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});
```

## 数据关联

### 添加及修改关联关系
#### 一对一关系和一对多关系

一对一关系和一对多关系都可以通过在一个`Bmob.Object`内保存另一个对象来实现。比如，每一个 Comment都对应了一个Post，创建一个有一个Comment的Post，你可以这样写：

```
// Declare the types.
var Post = Bmob.Object.extend("Post");
var Comment = Bmob.Object.extend("Comment");

// Create the post
var myPost = new Post();
myPost.set("title", "I'm Hungry");
myPost.set("content", "Where should we go for lunch?");

// Create the comment
var myComment = new Comment();
myComment.set("content", "Let's do Sushirrito.");

// Add the post as a value in the comment
myComment.set("parent", myPost);

// This will save both myPost and myComment
myComment.save();
```

Bmob内部会自动处理，调用Comment的`save`方法就可以同时保存两个新对象。

如果是现有对象想要关联到新对象，你同样可以通过只用它们的`objectId`来连接彼此。请注意，不能直接像上面的例子那样将现有对象设置进去，而是必须`new`一个新对象并只设置`id`属性：

```
var post = Bmob.Object.createWithoutData("Post", "320b0395f3");
myComment.set("parent", post);
```

或者：

```
var post = new Post();
post.id = '520c7e1ae4b0a3ac9ebe326a';
myComment.set("parent", post);
```

默认情况下，当获取一个对象时，关联的`Bmob.Object`不会被获取到，这些对象的值不能访问，除非像下面这样获取它们：
```
var post = fetchedComment.get("parent");
post.fetch({
  success: function(post) {
    var title = post.get("title");
  }
});
```

#### 多对多关系

多对多关系是通过`Bmob.Relation`来建模的，这样很像在一个key中存储一个`Bmob.Object`数组，但是你不需要一次性下载关系中的所有对象。这使得`Bmob.Relation`比数组可以更好地扩展到更多对象。例如，一个User可能喜欢很多Post，在这种情况下，你可以把一个用户喜欢的所有Post存为一个Relation，为了将一个Post加入一个User的like列表，你可以：

```
var user = Bmob.User.current();
var relation = user.relation("likes");
relation.add(post);
user.save();
```

你还可以传入一个`Bmob.Object`数组来做`add`和`remove`：
```
relation.add([post1, post2, post3]);
user.save();
```

### 查询关联关系

默认情况下，`relation`关联的对象并不会被下载，你可以通过使用`query`方法返回的`Bmob.Query`对象来获取`Bmob.Object`的列表，例如：
```
relation.query().find({
  success: function(list) {
    // list contains the posts that the current user likes.
  }
});
```

如果你仅仅要一个Post的子集，你可以在`Bmob.Query`中加入更多的条件：
```
var query = relation.query();
query.equalTo("title", "I'm Hungry");
query.find({
  success:function(list) {
    // list contains post liked by the current user which have the title "I'm Hungry".
  }
});
```

如果希望查询结果中包含多个相关联的其他数据类型。你可以使用 include 方 法。例如有个comments，你可能想同时获取它们相关的 post 数据:
```
var query = new Bmob.Query(Comment);

query.include("post");
```

你可以在接下来关于`Bmob.Query`的章节中看到更详细的内容。一个`Bmob.Relation`的行为很像一个`Bmob.Object`数组，所以任何在数组可做的查询操作，也都可以作用在`Bmob.Relation`上。

如果你知道post，想反向查询user，可以通过`Bmob.Relation.reverseQuery`方法：

```
var query = Bmob.Relation.reverseQuery('_User', 'likes', post);
query.find({
  success:function(users) {
   //users是表示喜欢这个post的用户列表。
  }
});
```


### 删除关联关系

你可以从一个`Bmob.Relation`中删除一个post：

```
relation.remove(post);
user.save();
```

你可以在用`save`方法保存前多次调用`add`和`remove`方法：

```
relation.remove(post1);
relation.remove(post2);
user.save();
```

## 原子计数器

许多应用都需要维持一些计数器数据，譬如用来跟踪游戏分数、金币甚至道具的数目等等。Bmob提供了便捷的方式来对任何数字字段进行原子性的增加或者减少：

```
gameScore.increment("score");
gameScore.save();
```

你可以同样传入第二个参数到`increment`方法来指定增加多少，`1`是默认值。


## 文件

### 整个文件上传

上传文件有两种方法：

直接上传文件，例如，我们上传一个内容为"Hello, World!"，名称为"hello.txt"的文件，可用如下的代码：

```
var bytes = "Hello, World!";
var file = new Bmob.File("hello.txt", bytes);
file.save().then(function(obj) {
  //alert(obj.url());
}, function(error) {
  // the save failed.
});
```

最经常的对于HTML5的应用来说，可能需要用html表单和一个文件上传控制器。在现代的浏览器中这很容易，只需要创建一个file input tag来允许用户选择他们磁盘上的文件就可以了。

```
<input type="file" id="profilePhotoFileUpload">
```

然后，在一个处理`click`或其他的函数里，获取对那个文件的一个引用：

```
        var fileUploadControl = $("#profilePhotoFileUpload")[0];
        if (fileUploadControl.files.length > 0) {
        var file = fileUploadControl.files[0];
        var name = "logo.jpg";
        var file = new Bmob.File(name, file);
        file.save();
```

### 文件删除

```
  file.destroy(); //删除文件

```

## 图片处理

提供一些工具接口，方便开发者处理图片。

### 缩微图

提供原图的URL地址和相应的参数， 返回缩微图的URL地址， 具体参数定义如下：

```
mode:模式 0: 指定宽， 高自适应，等比例缩放
     模式 1: 指定高， 宽自适应，等比例缩放
     模式 2: 指定最长边，短边自适应，等比例缩放
     模式 3: 指定最短边，长边自适应，等比例缩放
     模式 4: 指定最大宽高， 等比例缩放
     模式 5: 固定宽高， 居中裁剪
image:原图片url
width:宽度，模式 0, 4, 5必填
height：高度，模式 1, 4, 5必填
longEdge：长边，模式 2必填
shortEdge：短边，模式 3必填
quality：质量，选填, 范围 1-100
outType：输出类型，0:默认，输出url；1:输出base64编码的字符串流
```

调用的代码：

```
Bmob.Image.thumbnail({"image":"http://file.bmobapp.com/M00/01/26/wKgBP1OX9LLVh5gNAAHGYsmKRjk666.jpg","mode":0,"quality":100,"width":100}

  ).then(function(obj) {

  alert("filename:"+obj.filename); //
  alert("url:"+obj.url); //
});

```

如果`outType = 0`返回云端url地址:

```
{
  "filename": "e6c8ac18c9.jpg",
  "group": "group1",
  "url": "M00/01/6E/wKhkA1OGpWKAGdNUAAAjdkbUqo4612.jpg"
}
```

如果 `outType = 1` 返回文件内容的 base64 字符串：

```
{
  "file":"base64的文件内容"
}
```

### 水印图

提供原图的URL地址，水印图的URL地址和相应的参数，返回缩微图的URL地址，具体参数定义如下：

```
image：原图路径
watermark：水印图路径
dissolve:透明度，0-255
distanceX：横轴边距，单位:像素(px)，缺省值为10
distanceY：纵轴边距，单位:像素(px)，缺省值为10
outType：输出类型，0:默认，输出url；1:输出base64编码的字符串流
gravity:水印位置，见下图
```

![](image/anchor.png)

调用的代码：

```
//get image thumbnail
Bmob.Image.watermark({"image":"http://test.com/new/images/banner005.jpg","watermark":"http://test.com/new/images/header2.png","dissolve":100,"gravity":"SouthWest","distanceX":10,"distanceY":10}

  ).then(function(obj) {

  alert("filename:"+obj.filename); //
  alert("url:"+obj.url); //
});

```

如果 `outType = 0` 返回云端url地址:

```
{
  "filename": "e6c8ac18c9.jpg",
  "group": "group1",
  "url": "M00/01/6E/wKhkA1OGpWKAGdNUAAAjdkbUqo4612.jpg"
}
```

如果 `outType = 1` 返回文件内容的 base64 字符串：

```
{
  "file":"base64的文件内容"
}
```

## Promise

除了回调函数之外，每一个在Bmob JavaScript SDK中的异步方法都会返回一个 Promise. 使用 Promise，你的代码可以比原来的嵌套 callback 的方法看起来优雅得多.

### then 方法

每一个`Promise`都有一个叫`then`的方法, 这个方法接受一对`callback`。第一个`callback`在`promise`被解决的时候调用，第二个会在`promise`被拒绝的时候调用。

```
obj.save().then(function(obj) {
  // the object was saved successfully.
}, function(error) {
  // the save failed.
});
```

### 将Promise 组织在一起

`Promise`比较神奇，可以代替多层嵌套方式来解决发送异步请求代码的调用顺序问题。 如果一个`Promise`的回调会返回一个`Promise`，那么第二个`then`里的`callback`在第一个`then`的`callback`没有解决前是不会解决的。

```
var query = new Bmob.Query("Student");
query.descending("gpa");
query.find().then(function(students) {
  students[0].set("valedictorian", true);
  return students[0].save();

}).then(function(valedictorian) {
  return query.find();

}).then(function(students) {
  students[1].set("salutatorian", true);
  return students[1].save();

}).then(function(salutatorian) {
  // Everything is done!

});
```

### 错误处理

如果任意一个在链中的`Promise`返回一个错误的话，所有的成功的`callback`在接下来都会被跳过直到遇到一个处理错误的`callback`。处理`error`的`callback`可以转换`error`或者可以通过返回一个新的`Promise`的方式来处理它。你可以想象成拒绝的`promise`有点像异常，而`error callback`则像是一个`catch`来处理这个异常或者抛出异常。

```
var query = new Bmob.Query("Student");
query.descending("gpa");
query.find().then(function(students) {
  students[0].set("valedictorian", true);
  // Force this callback to fail.
  return Bmob.Promise.error("There was an error.");

}).then(function(valedictorian) {
  // Now this will be skipped.
  return query.find();

}).then(function(students) {
  // This will also be skipped.
  students[1].set("salutatorian", true);
  return students[1].save();
}, function(error) {
  // This error handler WILL be called. error will be "There was an error.".
  // Let's handle the error by returning a new promise.
  return Bmob.Promise.as("Hello!");

}).then(function(hello) {
  // Everything is done!
}, function(error) {
  // This isn't called because the error was already handled.
});
```

通常来说，在正常情况的回调函数链的末尾，加一个错误处理的回调函数会是很方便的做法.

### 创建 Promise

在开始阶段，你可以只用系统（譬如`find`和`save`方法等）返回的`promise`。但在更高级的场景下，你可能需要创建自己的`promise`。在创建了`Promise`之后，你需要调用`resolve`或者`reject`来触发它的`callback`。

```
var successful = new Bmob.Promise();
successful.resolve("The good result.");

var failed = new Bmob.Promise();
failed.reject("An error message.");
```

如果你在创建`promise`的时候就知道它的结果，下面有两个很方便的方法可以使用：

```
var successful = Bmob.Promise.as("The good result.");
var failed = Bmob.Promise.error("An error message.");
```

### 顺序的Promise

```
var query = new Bmob.Query("Comments");
query.equalTo("post", 123);

query.find().then(function(results) {
  // Create a trivial resolved promise as a base case.
  var promise = Bmob.Promise.as();
  _.each(results, function(result) {
    // For each item, extend the promise with a function to delete it.
    promise = promise.then(function() {
      // Return a promise that will be resolved when the delete is finished.
      return result.destroy();
    });
  });
  return promise;

}).then(function() {
  // Every comment was deleted.
});
```

### 并行的Promise

你也可以用`Promise`来并行的进行多个任务，这时需要使用`when`方法。你可以一次同时开始几个操作，使用`Bmob.Promise.when`来创建一个新的`promise`，它会在所有输入的`Promise`被解决之后才被解决。即便一些输入的`promise`失败了，新的`Promise`也会被成功执行。你可以在 `callback`的参数部分检查每一个`promise`的结果，并行地进行操作会比顺序进行更快，但是也会消耗更多的系统资源和带宽。

```
var query = new Bmob.Query("Comments");
query.equalTo("post", 123);

query.find().then(function(results) {
  // Collect one promise for each delete into an array.
  var promises = [];
  _.each(results, function(result) {
    // Start this delete immediately and add its promise to the list.
    promises.push(result.destroy());
  });
  // Return a new promise that is resolved when all of the deletes are finished.
  return Bmob.Promise.when(promises);

}).then(function() {
  // Every comment was deleted.
});
```

### 创建异步方法

有了上面这些工具以后, 就很容易创建你自己的异步方法来返回`promise`了。举例说，你可以创建一个有`promise`版本的`setTimeout`。

```
var delay = function(millis) {
  var promise = new Bmob.Promise();
  setTimeout(function() {
    promise.resolve();
  }, millis);
  return promise;
};

delay(100).then(function() {
  // This ran after 100ms!
});
```

## Collection

一个`Bmob.Collection`就是一个`Bmob.Objects`的有序集合，它和`Backbone.Collection`是兼容的，有相同的特性和功能，你可以通过用一个模型类或者一个特定的`Bmob.Query`来创建一个新的子类。

```
// A Collection containing all instances of TestObject.
var TestCollection = Bmob.Collection.extend({
  model: TestObject
});
var collection = new TestCollection();

// A Collection of TestObjects whose temperature is "hot".
var HotCollection = Bmob.Collection.extend({
  model: TestObject,
  query: (new Bmob.Query(TestObject)).equalTo("temperature", "hot")
});
var collection = new HotCollection();

// The Collection of TestObjects that match a complex query.
var query = new Bmob.Query(TestObject);
query.equalTo("temperature", "hot");
query.greaterThan("degreesF", 100);
var collection = query.collection();
```

### 获取Collection

使用`fetch`方法来获取一个`collection`里的所有元素:

```
var collection = new TestCollection();
collection.fetch({
  success: function(collection) {
    collection.each(function(object) {
      console.warn(object);
    });
  },
  error: function(collection, error) {
    // The collection could not be retrieved.
  }
});
```

### Collection 排序

你可以设定一个`comparator`来对`collection`中的元素进行排序:

```
var collection = new TestCollection();
collection.comparator = function(object) {
  return object.get("temperature");
};
```

### 修改一个 Collection

`Collection`是可变的，你可以访问所有元素，增加或者删除元素：

```
var collection = new TestCollection();

collection.add([
  {"name": "Duke"},
  {"name": "Scarlett"}
]);

// Get the "Duke" Bmob.Object by its sorted position.
var model = collection.at(0);

// Or you can get it by Bmob objectId.
var modelAgain = collection.get(model.id);

// Remove "Duke" from the collection.
collection.remove(model);

// Completely replace all items in the collection.
collection.reset([
  {"name": "Hawk"},
  {"name": "Jane"}
]);
```

## 用户

在许多应用中，都有一个用户账户的概念，用户账户让用户可以用安全的方式访问他们自己的信息。我们提供了一个特殊的用户类叫`Bmob.User`来自动处理有关用户的账户管理的功能。

`Bmob.User`是`Bmob.Object`的一个子类，而且有`Bmob.Object`一样的功能，比如可变的模式、自动的持久化、键值对接口等。所有对`Bmob.Object`有用的方法同样可以作用于`Bmob.User`。`Bmob.User`的不同之处在于`Bmob.User`对于用户的账户有一些特定的功能。

### 属性

`Bmob.User`有一些与`Bmob.Object`不一样的字段:

`username`：用户的用户名（必须提供）
`password`：用户的密码（在注册的时候必须提供）
`email`：用户的 email（可选）
我们会在下面的用例中详细介绍细节

### 注册

通常你的app第一件要做的事情就是让用户进行注册，下面的代码展示了怎样进行通常的注册过程：

```
var user = new Bmob.User();
user.set("username", "my name");
user.set("password", "my pass");
user.set("email", "email@example.com");

// other fields can be set just like with Bmob.Object
user.set("phone", "415-392-0202");

user.signUp(null, {
  success: function(user) {
    // Hooray! Let them use the app now.
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }
});
```

这个调用会异步地在在你的应用中创建一个新的用户。在它这样做之前，它同样会确认用户名和`email`在应用内都是唯一的。同样，我们从不会将用户密码以明文向任何客户端发送。

注意我们使用了`signUp`方法而不是`save`方法，新的`Bmob.User`永远应该使用`signUp`方法来新建。而随后的用户的信息更新可以调用`save`来做。

如果一个`signup`没有成功的话，你应该读取返回的错误对象。最常见的问题是`username`或者`email`已经被其他用户所使用了。你应该清楚地反馈给你的用户，让他们再次用一个不同的用户名来注册。

你也可以使用`email`来作为用户名，只要求你的用户输入他们的`email`但是同时自动填充好`username`属性就可以了，`Bmob.User`会跟原来一样工作，我们会在下面的重设密码环节再次说明这个细节。

### 登录

在你要求你的用户注册之后，当然应该让他们在以后用自己的账户登录进来，你可以使用`logIn`方法来进行登陆：

```
Bmob.User.logIn("myname", "mypass", {
  success: function(user) {
    // Do stuff after successful login.
  },
  error: function(user, error) {
    // The login failed. Check error to see why.
  }
});
```

### 验证 Email

在application设置中启用email验证可以让你的应用给最终用户一些更安全的使用体验，譬如部分功能只开放给验证过邮箱的用户使用等等。Email验证会在`Bmob.User`上加入一个`emailVerified`字段。当一个`Bmob.User`的`email`被设定或者修改后,`emailVerfied`会被设定为`false`。Bmob 会向用户的`email`来发送一个链接，点击这个链接会设置`emailVerified`为`true`：

有三种`emailVerified`状态可以供参考：

1. `true`：用户已经通过点击Bmob发过来的链接来确认邮箱地址. 当用户账户新创建的时候这个值永远不应该是true。
2. `false`：在 `Bmob.User`对象最后一次刷新的时候，用户还是没有确认他们的`email`地址，如果`emailVerified`是false 的话，你应该考虑调用`Bmob.User`的`fetch`方法。
3.  `missing`：`Bmob.User`被创建了，但是当时的`email`验证功能还没有开启, 或者说`Bmob.User`没有email地址。

代码例子如下：

```
//reset password
 Bmob.User.requestEmailVerify("h6k65@126.com", {
  success: function() {
    // Password reset request was sent successfully
  },
  error: function(error) {
    // Show the error message somewhere
    alert("Error: " + error.code + " " + error.message);
  }
});
```

### 当前用户

如果用户每次打开App的时候都要求登录无疑是令人感到厌烦的，你可以通过缓存当前的`Bmob.User`对象来避免这个问题。

无论你使用任何注册或者登录方法，用户都会在`localStorage`中储存，你可以把缓存作为一个`session`对待，并且自动假设用户已经登录了。

```
var currentUser = Bmob.User.current();
if (currentUser) {
    // do stuff with the user
} else {
    // show the signup or login page
}
```

你可以通过`logout`来清除掉当前的用户：

```
Bmob.User.logOut();

var currentUser = Bmob.User.current();  // this will now be null
```

### 用户对象的安全

`Bmob.User`类默认就是受保护的，在`Bmob.User`中保存的数据只能被那个用户所修改。默认地，数据仍然可以被任意客户端所读取。这样就是说，有些`Bmob.User`对象被认证后是可以修改的，其他的仍然是只读的。

特别的，你不能调用`save`或者`delete`方法除非`Bmob.User`经过了认证，就比如调用过了`logIn`或者`signUp`方法，这样保证只有用户能改动他们自身的数据。

下面的代码展示了上面说的安全策略：

```
var user = Bmob.User.logIn("my_username", "my_password", {
  success: function(user) {
    user.set("username", "my_new_username");  // attempt to change username
    user.save(null, {
      success: function(user) {
        // This succeeds, since the user was authenticated on the device

        // Get the user from a non-authenticated method
        var query = new Bmob.Query(Bmob.User);
        query.get(user.objectId, {
          success: function(userAgain) {
            userAgain.set("username", "another_username");
            userAgain.save(null, {
              error: function(userAgain, error) {
                // This will error, since the Bmob.User is not authenticated
              }
            });
          }
        });
      }
    });
  }
});
```

从`Bmob.User.current()`获取的`Bmob.User`总是已经通过验证了的。

如果你需要查看一个`Bmob.User`是否已经认证过了，你可以调用`authenticated`方法，你不需要查看一个认证方法中返回的`Bmob.User`对象是否已经通过验证了。

### 其他对象的安全

和`Bmob.User`相同的安全模型也使用于其他对象。对于任何对象来说，你可以指定哪些用户会被允许读取对象，哪些用户被允许修改对象。为了支持这种安全机制，每一个对象都有一个允许访问列表 (ACL)，是被`Bmob.ACL`类所实现的。

使用一个`Bmob.ACL`最简单的方式是指定一个对象只能被一个单一的用户读或者写。为了创建这样的对象，首先必须有一个已经登录的`Bmob.User`。然后，新的`Bmob.ACL(user)`生成一个`Bmob.ACL`来限定`user`的访问。一个对象的ACL会在对象保存的时候被存储起来，就像其他的属性一样，这样，为了创建一个当前user私有的一个note：

```
var Note = Bmob.Object.extend("Note");
var privateNote = new Note();
privateNote.set("content", "This note is private!");
privateNote.setACL(new Bmob.ACL(Bmob.User.current()));
privateNote.save();
```

这个note只能由当前的用户所访问，但是可以在用户登录的任何设备上访问，只要是相同的用户就可以了。这项功能对于你如果想让用户再任何其他的设备上保存和访问数据十分有用，比如说一个私人的todo list应用。

权限也能在使用者的基础上授予，你可以通过`setReadAccess`和`setWriteAccess`方法独立的向`Bmob.ACL`中添加权限。比如，假设你有一条消息想要发送给一个组里的多个用户，他们中的每一个都有读和写的权限：

```
var Message = Bmob.Object.extend("Message");
var groupMessage = new Message();
var groupACL = new Bmob.ACL();

// userList is an array with the users we are sending this message to.
for (var i = 0; i < userList.length; i++) {
  groupACL.setReadAccess(userList[i], true);
  groupACL.setWriteAccess(userList[i], true);
}

groupMessage.setACL(groupACL);
groupMessage.save();
```

你同样可以对所有的用户授权，只要使用`setPublicReadAccess`和`setPublicWriteAccess`就可以了。这样允许了在一个消息板上发评论的模式，比如，我们要创建一个post只能被它的作者修改，但是可以被所有人读取：

```
var publicPost = new Post();
var postACL = new Bmob.ACL(Bmob.User.current());
postACL.setPublicReadAccess(true);
publicPost.setACL(postACL);
publicPost.save();
```

比如说删除一个对象，但是你没有写的权限这种操作是禁止的，这样会返回一个`Bmob.Error.OBJECT_NOT_FOUND`的错误码，为了安全起见，这样防止了客户端区分出到底有哪些对象被创建了但是无法读取还是根本不存在。

### 重设密码

在现实中只要你引入了密码系统，总会有用户会忘掉他们的密码。在这种情形下，我们的库提供一个让他们安全地重设密码的功能。

为了能让用户重设密码，应该要求用户提供他们的email地址，然后这样调用：

```
 Bmob.User.requestPasswordReset("test@126.com", {
  success: function() {
    // Password reset request was sent successfully
  },
  error: function(error) {
    // Show the error message somewhere
    alert("Error: " + error.code + " " + error.message);
  }
});
```

这样会尝试匹配给定的email和用户的email或者username字段，然后会发送用户的密码重设邮件。由于我们是这样做的，所以你可以选择用户是否拿email作为他们的用户名，或者说用户把email作为用户的另一个信息保存。

密码重设的流程如下:

1. 用户输入email来请求重设他们的密码。
2. Bmob向用户的email地址发送邮件，包含了一个重设密码的链接。
3. 用户点击这个重设密码的链接，会重定向到一个Bmob页面来允许他们重设密码。
4. 用户输入新的密码，他们的密码现在会更新为输入的新密码。

### 查询

为了查询用户，你可以简单的创建一个`Bmob.Query`针对`Bmob.Users`：

```
var query = new Bmob.Query(Bmob.User);
query.equalTo(gender, "female");  // find all the women
query.find({
  success: function(women) {
    // Do stuff
  }
});
```

### 关联

关联一个`Bmob.User`的对象可以很快就见效，比如说，假设你有一个blog程序，为了保存一个用户的新post还有读取他们所有的post。

```
var user = Bmob.User.current();

// Make a new post
var Post = Bmob.Object.extend("Post");
var post = new Post();
post.set("title", "My New Post");
post.set("body", "This is some great content.");
post.set("user", user);
post.save(null, {
  success: function(post) {
    // Find all posts by the current user
    var query = new Bmob.Query(Post);
    query.equalTo("user", user);
    query.find({
      success: function(usersPosts) {
        // userPosts contains all of the posts by the current user.
      }
    });
  }
});
```

## 实时数据平台

### 实时功能简介

Bmob提供了数据实时功能，当开发者监听某个变化事件，例如监听表更新时，表的内容一旦变化，服务器就会通知SDK，SDK提供了相应回调函数来给开发者使用。当然开发者也可以取消相对应的监听，这样就不会收到数据变化的消息了。


**注意！！！运行的html文件应该是在web环境中，不能在本地环境中运行。**
例如，合法的运行环境：http://local.project/appweb/sdk/js/demo/bmobSocketIo.html
无效的本地运行环境：file:///D:/jeff/project/appweb/sdk/js/%E6%95%B0%E6%8D%AE%E5%AE%9E%E6%97%B6%E5%B9%B3%E5%8F%B0/test/bmobSocketIo.html

### 安装实时数据平台的js

一、把下面这行代码加入你的页面中，其中，"bmobSocketIo.js"为实时数据平台的js文件。

```
<script type="text/javascript" src="bmobSocketIo.js"></script>
```

二、接着是加入下面这行代码进行初始化。

```
BmobSocketIo.initialize("你的Application ID");
```

### 订阅事件

#### 订阅表更新的事件

订阅表"GameScore"更新的事件。

```
BmobSocketIo.updateTable("GameScore");
```

#### 订阅行更新的事件

订阅表"GameScore"中行objectId为"3342e40e4f"更新的事件。

```
BmobSocketIo.updateRow("GameScore","3342e40e4f");
```

#### 订阅行删除的事件

订阅表"GameScore"中行objectId为"3342e40e4f"删除的事件。

```
BmobSocketIo.deleteRow("GameScore","1256e40e4f");
```

### 取消订阅事件

#### 取消订阅表更新的事件

取消订阅表"GameScore"更新的事件。

```
BmobSocketIo.unsubUpdateTable("GameScore");
```

#### 取消订阅行更新的事件

取消订阅表"GameScore"中objectId为"3342e40e4f"行更新的事件。

```
BmobSocketIo.unsubUpdateRow("GameScore","3342e40e4f");
```

#### 取消订阅行删除的事件

取消订阅表"GameScore"中objectId为"3342e40e4f"行删除的事件。

```
BmobSocketIo.unsubDeleteRow("GameScore","1256e40e4f");
```

### 监听触发的事件


#### 监听更新表的事件

当订阅了表更新的表数据发送变化时，js中会触发函数onUpdateTable。

tablename为更新的表，data为服务端返回的更新数据。

```
   BmobSocketIo.onUpdateTable = function(tablename,data) {
      //业务逻辑的代码
   };
```

#### 监听行更新的事件

tablename为更新的表，objectId为更新行的objectId，data为服务端返回的更新数据。

```
   BmobSocketIo.onUpdateRow = function(tablename,objectId,data) {
      //业务逻辑的代码
   };
```

#### 监听行删除的事件

tablename为更新的表，objectId为更新行的objectId，data为服务端返回的更新数据。

```
   BmobSocketIo.onDeleteRow = function(tablename,objectId,data) {
      //业务逻辑的代码
   };
```

### demo

在线上演示实时数据平台的一个聊天应用的demo：[chat room demo](http://chatroom.bmobapp.com) ，演示了如何使用实时数据服务实现聊天的功能。

用浏览器打开两个窗口，在其中一个窗口输入`昵称`和`内容`，按`发送`按钮，在另外一个窗口能看到发送的内容。

![](image/chatdemo.jpg)

## ACL和角色

数据安全是软件系统中最重要的组成部分，为了更好的保护应用数据的安全，Bmob在软件架构层面提供了应用层次、表层次、ACL（Access Control List：访问控制列表）、角色管理（Role）四种不同粒度的权限控制的方式，确保用户数据的安全（详细请查看[Bmob数据与安全页面](http://docs.bmobapp.com/other/Other/m_bql/doc/index.html)，了解Bmob如何保护数据安全）。

其中，最灵活的方法是通过ACL和角色，它的思路是每一条数据有一个用户和角色的列表，以及这些用户和角色拥有什么样的许可权限。

大多数应用程序需要对不同的数据进行灵活的访问和控制，这就可以使用Bmob提供的ACL模式来实现。例如：

- 对于私有数据，读写权限可以只局限于数据的所有者。
- 对于一个论坛，会员和版主有写的权限，一般的游客只有读的权限。
- 对于日志数据只有开发者才能够访问，ACL可以拒绝所有的访问权限。
- 属于一个被授权的用户或者开发者所创建的数据，可以有公共的读的权限，但是写入权限仅限于管理者角色。
- 一个用户发送给另外一个用户的消息，可以只给这些用户赋予读写的权限。

### ACL的格式

在Bmob中，ACL是按JSON对象格式（key-value）来表示的。这个JSON对象的key是objectId（用户表某个用户对应的objectId）或者是*(表示公共的访问权限)，ACL 的值是"读和写的权限"，这个JSON对象的key总是权限名，而这些key的值总是true。

如果您想让一个id为"Kc3M222k"的用户有读和写一条数据的权限，而且这个数据应该可以被全部人读取的话，这个ACL的表达方式如下：

```
{
  "Kc3M222k": {
    "read": true,
    "write": true
  },
  "*": {
    "read": true
  }
}
```

### 角色和相关操作

在很多情况下，你需要定义一些用户具有某种相同的数据操作权限，而另外一群用户具有另外一种相同的数据操作权限，这时你就可以使用到Bmob的角色（对应Bmob在Web提供的Role表、SDK中的BmobRole类）功能，设置不同的用户组不同的操作权限。角色表有三个特殊字段：

`name` : 必须字段，表示角色名称,而且只允许被设置一次（命名必须由字母, 空格, 减号或者下划线构成）。

`users` :一个指向一系列用户的关系, 这些用户会继承角色的权限。

`roles` : 一个指向一系列子角色的关系, 这些子关系会继承父角色所有的权限。

### 创建角色

```
var roleACL = new Bmob.ACL();
roleACL.setPublicReadAccess(true);
var role = new Bmob.Role("test", roleACL);
role.save();
```

### 角色对象的安全性


`Bmob.Role`使用和其他Bmob对象一样的ACL权限策略, 除开它需要ACL被显式地设置以外。通常来说，只有用户有极大的权限（比如管理员）才应该被允许创建或者更改Role，所以你应该按这种标准来设定Role的ACL。请注意，如果你给了用户一个`Bmob.Role`一个写权限，这个用户有可能会在这个权限中加入另一个user，或者甚至直接把角色删除掉。

为了创建一个新的`Bmob.Role`，你应该如下写：
```
// By specifying no write privileges for the ACL, we can ensure the role cannot be altered.
var roleACL = new Bmob.ACL();
roleACL.setPublicReadAccess(true);
var role = new Bmob.Role("Administrator", roleACL);
role.save();
```

你可以通过增加"user"和"roles"关系的成员来在`Bmob.Role`中加入用户或者子角色：

```
var role = new Bmob.Role(roleName, roleACL);
for (var i = 0; i < usersToAddToRole.length; i++) {
  role.getUsers().add(usersToAddToRole[i]);
}
for (var i = 0; i < rolesToAddToRole.length; i++) {
  role.getRoles().add(rolesToAddToRole[i]);
}
role.save();
```

**请非常注意一点，注册角色的ACL的时候，它们只能被应该有权限修改它的人修改。**

### 其他对象的安全性

现在你应该已经创建了在你的程序中要使用的一系列的角色，你可以用ACL来定义他们的用户可以拥有的权限，每一个`Bmob.Object`都可以指定一个`Bmob.ACL`，这样提供了哪些用户或者角色应该有权限来读或者写这个对象。

将一个读或者写的权限授予一个角色是很直观的，你可以使用`Bmob.Role`：

```
var moderators = /* Query for some Bmob.Role */;
var wallPost = new Bmob.Object("WallPost");
var postACL = new Bmob.ACL();
postACL.setRoleWriteAccess(moderators, true);
wallPost.setACL(postACL);
wallPost.save();
```

你可以不需要查找这个Role，直接把名字提供给ACL：

```
var wallPost = new Bmob.Object("WallPost");
var postACL = new Bmob.ACL();
postACL.setRoleWriteAccess("Moderators", true);
wallPost.setACL(postACL);
wallPost.save();
```

### 角色继承

就像上面所描述的一样，一个角色可能包含其他的角色，表示两个角色之间的父-子关系，这样做的结果就是任何被授予一个角色的权限都会被隐式地授予这个角 色的所有子角色。

这样的关系很经常会在有用户管理内容的程序之中看到，比如论坛，有一个很少量的用户称为管理员，有最高的权限，比如程序设定、创建新的论坛、设定所有人能看到的内容等等。另一类有一部分类似于"版主" 的用户，这些人有责任保持用户创建的内容是合适的，任何一个"版主"有的权限"管理员"都应该有。为了启用这种关系，你应该使"管理员"成为"版主"的一个子角色。

```
var administrators = /* Your "Administrators" role */;
var moderators = /* Your "Moderators" role */;
moderators.getRoles().add(administrators);
moderators.save();
```

## 地理位置

### 创建地理位置对象

地理位置对象的创建需要用到`Bmob.GeoPoint`类，如创建一个地理位置在纬度40度，经度在-30度的点的示例代码如下：

```
var point = new Bmob.GeoPoint({latitude: 40.0, longitude: -30.0});
```

### 查询地理位置对象

现在你可以有一系列的对象可以做空间坐标查询了，如果能轻松地发现有哪些对象离一个点最近就好了。这样可以通过在`Bmob.Query`中加入一个`near`来做查询，为了获得离用户最近的10个地点列表，可以这样：

```
// location对应Web后台的一个字段名称
var userGeoPoint = userObject.get("location");
// 创建查询
var query = new Bmob.Query(PlaceObject);
// location附近的位置
query.near("location", userGeoPoint);
// 返回10个地点数据
query.limit(10);
// 查询
query.find({
  success: function(placesObjects) {
  }
});
```

在这时`placeObjects`会返回一个按离`userGeoPoint`的距离排序的列表，注意如果一个`ascending()/descending()`给了查询的话，会取代按距离排序这项特性。

为了按距离限制返回的结果，你可以使用`withinMiles`、`withinKilometers`和`withinRadians`。

同样，查询在特定地域的Object是可以的。为了找到用矩形表示的一块地域中的对象，加入`withinGeoBox`来在`Bmob.Query`中加入约束。

```
var southwestOfSF = new Bmob.GeoPoint(37.708813, -122.526398);
var northeastOfSF = new Bmob.GeoPoint(37.822802, -122.373962);

var query = new Bmob.Query(PizzaPlaceObject);
query.withinGeoBox("location", southwestOfSF, northeastOfSF);
query.find({
  success: function(pizzaPlacesInSF) {
    ...
  }
});
```

## 错误代码详细说明

[错误码列表](http://docs.bmobapp.com/data/Restful/g_errorcode/doc/index.html "错误码列表")

