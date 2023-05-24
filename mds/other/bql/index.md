Bmob Query Language（简称 BQL） 是 Bmob 为查询 API 定制的一套类似 SQL 查询语法的子集和变种，主要目的是降低大家学习 Bmob 查询的 API 的成本，可以使用传统的 SQL 语法来查询 Bmob 应用内的数据。

本文档将详细介绍 BQL 的语法和常见用法。

## 介绍及基本语法

最基本的一个查询:

查询某个 class 下的 100 条数据：

```sql
select * from GameScore
```

等价于（以 Android 为例）:

```sql
//查询GameScore的100条数据
BmobQuery<GameScore> query = new BmobQuery<GameScore>();
query.findObjects(context, new FindListener<GameScore>() {
	
	@Override
	public void onSuccess(List<GameScore> object) {
		// TODO Auto-generated method stub
	}
	
	@Override
	public void onError(int code, String msg) {
		// TODO Auto-generated method stub
	}
});
```

select一个完整的语法形式类似这样：

```sql
select [查询字段列表，多个以逗号隔开] from [class 名称]
   [where [条件列表]
   [limit skip,limit
   [order by [排序字段列表] [asc |desc]]]]
```

举例：

```sql

//查询结果只包含 name,playScore 以及内置字段(objectId,createdAt等)
select name,playScore from GameScore

//根据 name 查找
select * from GameScore where name='smile'

//根据 name 和 playScore 同时查找
select * from GameScore where name is exists and playScore > 80 and playScore <= 100

//分页查找，从第 10 条开始向后查找 10 条数据
select * from GameScore limit 10,10

//根据 score 和 name 排序
select * from GameScore order by -playScore,+name

```

`注：当查询的表为系统表（目前系统表有User、Installation、Role）时，需要带上下划线 `_`。`

比如，你想查询的是用户`smile`的信息，则：

```sql

`select * from _User where username= smile`

```

## 查询条件

### 比较查询

查询指定信息的对象，用 `=` 比较符：

```sql
select * from GameScore where name='smile'
```

查询`不等于`指定信息的对象，用`!=`比较符：

```sql
select * from GameScore where name!='smile'
```

也可以用` <> `运算符来表示不等于。


比较日期，使用` date `函数来转换，比如查询特定时间之前创建的对象：

```sql
select * from GameScore where createdAt < date('2015-05-20 00:00:00')

```

date 函数接收的日期格式必须是 `yyyy-MM-dd HH:mm:ss`。更多内置函数请看最后的 `内置函数`。

一些常见的查询运算符：

| Key | Operation | 对应Bmob的查询API |
| :----:  | :----:  | :----:  | 
|  = | 等于 | addWhereEqualTo     | 
|  != 或者 <> | 不等于 | addWhereNotEqualTo     | 
|  < | 小于| addWhereLessThan     | 
|  <= | 小于等于| addWhereLessThanOrEqualTo     | 
|  > | 大于| addWhereGreaterThan     | 
|  >= | 大于等于| addWhereGreaterThanOrEqualTo     | 
|  [not] like | 模糊查询 | addWhereStartsWith或addWhereEndsWith     | 
|  [not] regexp | 正则匹配 | addWhereMatches     | 
|  [not] in(子查询或者数组) | 包含或者不包含 | addWhereMatchesQuery或者addWhereDoesNotMatchQuery     | 
|  is [not] exists | 这个Key有值或者不存在值 | addWhereExists或addWhereDoesNotExists     | 


注：比较运算符可以用在`日期`、`字符串`、`数字`甚至`对象`上。


### 模糊查询

**注:模糊查询只对付费用户开放，付费后可直接使用。**

模糊查询可以使用 `like`，比如查询名字以 smile 开头的对象

```sql
select * from GameScore where name like 'smile%'
```

% 表示模糊匹配的位置占位符。

`like` 本质上是转成` regexp `的正则匹配查询，因此上面的例子还可以写成：

```sql
select * from GameScore where name regexp 'smile.*'
```

否定形式，以`not like` 来查询名字不以 smile 开头的对象：


```sql
select * from GameScore where name not like 'smile%'
```

等价于`not regexp`:

```sql
select * from GameScore where name not regexp 'smile.*'
```

### 值是否存在查询

只返回 name 字段值存在的对象：

```sql
select * from GameScore where name is exists
```
反之，使用 `is not exists`。

### 数组查询

假设`hobby`表示一个人的爱好，其字段类型是List<String>对应服务端的`数组Array`类型，如我们想查询有游泳爱好的人：

```sql
select * from Person where hobby ='游泳'"
```

查询既爱好游泳也爱好看书的人：

```sql
select * from Person where hobby all ('游泳','看书')
```

**注：all 表示数组完全匹配。**


### 地理位置查询

我们可以通过 BQL 进行地理位置查询。

#### 附近的人

使用`near`来查询附近的人

比如我想查询指定地理位置附近的玩家（从近到远排序），假设 `gps` 字段是 `BmobGeoPoint`类型：

```sql
select * from GameScore where gps near [112.934755,24.52065]
```

**注：[112.934755,24.52065] 是经纬度坐标。必须是经度在前，纬度在后**

也可以使用 `geopoint` 函数来创建：

```sql
select * from GameScore where gps near geopoint(112.934755,24.52065)
```

**注：只有在地理位置信息查询里才可以使用 `[longitude, latitude]`这样的语法。在其他查询里将被作为数组类型。**

#### 限定搜索范围

为了限定搜索的最大距离，还可以使用 `max distance 单位`来限定，比如,搜索附近1公里内的人：

```java
select * from GameScore where gps near [112.934755,24.52065] max 1 km

```

**注：单位包括 miles（英里）、radians（弧度），默认是弧度。**

#### 查询矩形范围

如果想查询某个矩形框内的对象，可以使用`within [西南坐标] and [东北坐标]`的语法：

```sql
select * from GameScore where gps within [102.934755,24.52065] and [112.934755,24.52065]
```

### 查询个数

使用 `count` 查询来返回符合查询条件的数目。

比如:查询整张表的记录数：

```sql
select count(*) from GameScore
```

**注：count 不支持distinct等语法。仅限count(*)和count(objectId)**

查询总的记录数并返回得分在10-20之间的游戏分数信息

```sql
select count(*) from GameScore where playScore>10 and where playScore<20
```

查询个数的同时可以返回对象,使用`,`隔开：

```sql
select count(*),* from GameScore
```

也可以返回特定的字段：

比如：查询GameScore表中的总数并返回每条记录的游戏名

```sql
select count(*),game from GameScore

```

### 关系查询

有如下几种方式来查询对象之间的关系数据 

1、如果您想获取对象，而这个对象的一个字段对应了另一个对象, 您可以用一个 `where` 查询, 自己构造一个 `Pointer` 函数, 和其他数据类型一样。

例如： `Weibo`类中有一个`User`（继承自BmobUser）类型的`author`字段表示这条微博的发送方，现在你想查询当前用户发布的所有微博信息，那么可以这样写：

```sql
select include author,* from Weibo where author = pointer('_User', '6720c14c28')
```

`pointer`内置函数接收 className 和 objectId。

2、如果您想获取对象, 这个对象的一个字段指向的对象（必须是BmobPointer类型）是符合另一个查询的, 您可以使用` in `查询。

例如, 假设您有一个 `Weibo` 类和一个 `Comment` 类, 每个`Comment` 都有一个指向它的 `Weibo` 的 weibo字段（BmobPointer类型）, 现在您想查询带有图片的 `Weibo` 的 Comment列表:

```sql
select * from Comment where weibo in (select * from Weibo where image is exists)
```

**注:默认的 limit 是 100 而且最大的 limit 是 1000，这个限制同样适用于内部的查询, 所以对于较大的数据集您可能需要细心地构建查询来获得期望的行为。**

3、如果 `Weibo` 类下有一个`BmobRelation`类型的`comment`字段，它存储了这条微博所有的评论列表。你可以查询到这些评论信息，因为他们都关联到了同一条微博：

```sql
select * from Comment where related comment to pointer('Weibo', '262f6ace1a')
```

基本的查询形式是 `releated <key> to <pointer>`。


4、如果某个字段是 Pointer ，默认查询的时候，只会返回 {__type: 'Pointer', objectId: 'xxxxxx', className:'Weibo'} 这些基本信息，如果希望同时将这个对象的其他信息查询下来，可以使用` include `。


1）、采用 `include <key>` 就可以将某个 `Pointer`字段关联查询出来：

比如查询 `Comment` 同时将 `author`带下来：

```sql
select include author, * from Comment
```

2）、`多个字段要多次 include`:

```sql
select include weibo,include author from Comment
```

3）、还可以支持`嵌套的 include 查询`：

比如 `Weibo` 里还有一个 Pointer 指向 author(表示这条微博是谁发的):

```sql
select include weibo.author,* from Comment
```

### 复合查询

使用 `and` 和 `or`进行复合查询

比如：查询游戏得分在10-15之间的数据,可以使用`and`查询:

```sql
select * from GameScore where playScore>10 and playScore<=15
```

如果你想再加个条件：再查询分数为0的数据，可以使用`or`查询：

```sql
select * from GameScore where playScore>10 and playScore<=15 or playScore=5
```

由于`and`的优先级高于`or`，因此,上面的查询也可以用括号来明确地表示这种优先级：

```sql
select * from GameScore where (playScore>10 and playScore<=15) or playScore=5
```


## 占位符

查询条件`where`和 `limit` 子句支持占位符，也就是可以用问号 ? 替代值，值的列表通过 SDK 提供的方法传入，具体请参考各 SDK 用法。

### 普通查询

例如：

```sql
select * from GameScore where name=? and playScore>? limit ?,?
```

### 内置函数 

占位符查询中用到的内置函数，请看最后的 `占位符查询用到的内置函数`。

例如：

```java

select * from GameScore where createdAt > date(?) and player = pointer(?,?) and gps near geopoint(?,?)

```

**注意：**

**和统计查询有关的`group by`、`order by`、`having`等字句是不支持占位符的。**

`正确`写法：

```java
select sum(playScore),count(*) from GameScore group by game having _sumPlayScore>200
```

`错误`写法：

```java
select sum(playScore),count(*) from GameScore group by ? having ?
```

**注：我们推荐使用占位符的方式来使用 BQL，查询语句可以通过预编译得到缓存，降低 BQL 的转换开销。**


## 限定返回值

通过 `limit` 语句来限定返回结果大小，比如限定返回 10 个：

```sql
select * from GameScore limit 10
```

可以设定从第` m+1 `个元素开始，例如从第 11 个元素（包含）开始往后取 10 个：

```sql
select * from GameScore limit 10,10
```

**注：如果查询语句没有设定 limit ，默认的 limit 是 100 而且最大的 limit 是 1000。**


## 排序

通过 `order` 语句来排序，`order` 语句只能出现在最后，不能在 `where` 和 `limit` 之前。

比如：按照得分降序排列（得分高的在前）：

```sql
select * from GameScore order by playScore desc
```

也可以写成：

```sql
select * from GameScore order by -playScore
```

**注：加号表示升序，减号表示降序。**

多个字段组合排序

比如：得分高的在前（playScore降序），当得分一样的情况下，再按照名称（字母顺序）更小的在前（name升序）：

```sql
select * from GameScore order by -playScore,name
```

同样的语句可以写成：

```sql
select * from GameScore order by playScore,+name desc
```

或者

```sql
select * from GameScore order by -playScore,name asc
```

**注：没有写上明确的加号或者减号的字段，将根据最后的 desc 或者 asc 来决定采用升序还是降序。**


## 统计查询

统计查询只适用于 `Number` 类型的列，支持 `sum` (计算总和), `average` (计算平均值), `max` (计算最大值), `min` (计算最小值)

举几个例子（以sum求和）:

### 计算总和

比如：查询`GameScore`表所有玩家的得分总和:

```sql
select sum(playScore) from GameScore
```
### 分组计算总和

比如：按玩家分组，获取每个玩家的总得分：

```sql
select sum(playScore) from GameScore group by name
```
### 添加过滤条件

比如 按玩家分组，获取每个玩家的总得分，并且总得分大于100的：

```sql
select sum(playScore) from GameScore group by name having _sumPlayScore > 100
```
### 统计分组记录数

同时支持返回每个组用于计算总和的总数：

```sql
select sum(playScore),count(*) from GameScore group by name having _sumPlayScore > 100
```

**注：**

**1、查询语句中含有`sum`或 `group by`的时候不支持返回表中的其他列，只返回group by后面接的列名、sum的列名为 `(_sum+(首字母大写的列名))` 以及有count(*)会返回的 `_count`等数据。所以只应该用于统计的功能时候使用。**


**2、其他关键字和sum的使用类似，只需要以上的`sum`换为`average`,`max`, `min`，其中`average`返回的平均值列名为：`(_avg+(首字母大写的列名))`。**


## 内置函数介绍

BQL提供了一些`内置函数`来方便地创建 `pointer`、`geopoint`、`date`、`file`等类型：

### 基本BQL查询用到的内置函数

| Key | Operation | 
| :----:  | :----:  |
| date('yyyy-MM-dd HH:mm:ss') | 创建日期类型 | 
| pointer(className,objectId) | 创建 Pointer | 
| geopoint(经度，维度) | 创建 GeoPoint | 
| file(filename,url) | 创建 file 类型 | 
| current_timestamp() | 创建当前日期 | 

----------

### 占位符查询用到的内置函数

如果使用占位符查询，比较特殊，其内置函数的形式如下

| Key | Operation | 
| :----:  | :----:  |
| date(?) | 创建日期类型 | 
| pointer(?,?) | 创建 Pointer | 
| geopoint(?,?) | 创建 GeoPoint | 
| file(?,?) | 创建 file 类型 | 

----------

举例子（以Android为例）：

1、Date类型：

```sql
String dateString = "2015-05-12";  
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
Date date  = null;
try {
	date = sdf.parse(dateString);
} catch (ParseException e) {
}  
String sql = "select * from GameScore where createdAt < date('"+new BmobDate(date).getDate()+"')"
```

等价于：（以下是REST API文档中定义的创建`Date类型`的JSON对象）

```sql
select * from GameScore where createdAt < {'__type': 'Date','iso': '"+new BmobDate(date).getDate()+"'}
```

2、Pointer类型：

```sql
User user = BmobUser.getCurrentUser(this, User.class);
String sql = select * from GameScore where player = pointer('_User', "+"'"+user.getObjectId()+"')

```

等价于：（以下是REST API文档中定义的创建`Pointer类型`的JSON对象）

```sql
select * from GameScore where player = {'__type':'Pointer','className':'_User','objectId':'"+user.getObjectId()+"'}
```

3、GeoPoint类型

```sql
select * from GameScore where gps = geopoint(112.934755,24.52065)
```

等价于：（以下是REST API文档中定义的创建`GeoPoint类型`的JSON对象）

```sql
select * from GameScore where gps = {'__type':'GeoPoint','latitude':24.52065,'longitude':112.934755}
```

**注：**

**1、如果不使用`内置函数`，你也使用 [Rest API文档](http://doc.bmobapp.com/data/restful/develop_doc/)定义的 JSON 对象来创建特定类型,不过这样写相对来说比较繁琐。**

**2、占位符查询中如果要用到内置函数，其形式必须为上述列出的，最后的可变参数会自动替换类型中的`?`。**


## 性能和建议

BQL 最终还是转换成 [Rest API文档](http://doc.bmobapp.com/data/restful/develop_doc/) 里查询部分提到的各种 where 条件，因为多了一层转换，理论上会比直接使用 where 查询慢一点。并且 BQL 对长度有所限制，要求在 4096 字节以内。

此外，我们推荐查询语句都采用占位符的方式，使用占位符的查询语句将有机会被缓存复用，避免重复解释的开销。

