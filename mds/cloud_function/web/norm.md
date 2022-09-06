好的编码规范是攻城师们要遵循的法则，Bmob云函数希望大家能够养成良好的编码规范。Nodejs的编码规范与其他语言稍微有所不同，这里列举有所区别的地方。

## 关于缩进

缩进，2个space，tab要转为2 space。这是Nodejs源码和module采用的标准，希望大家入乡随俗。

## 关于空格

function关键词和函数名之间有一个空格；调用函数时，函数名和左括号之间没有空格。
```
// 正确
function foo(bar) {...}
foo(bar);
foo(function callback(err, data) {...});
foo(function (err, data) {...});

// 错误
function foo (bar) {...}
foo (bar);
foo(function callback (err, data) {...});
foo(function(err, data) {...});
```

所有其他语法元素与左括号之间，都有一个空格。
```
// 正确
return (a + b);
if (a === 0) {...}
for (var k in map) {...}
while (i > 0) {...}

// 错误
return(a + b);
if(a === 0) {...}
for(var k in map) {...}
while(i > 0) {...}
```
操作符号与参数之间有一个空格；能提高阅读性的空格不能省略。
```
// 正确
var a = 1 + 2;
for (var i = 0, l = items.length; i < l; i++) {...}

//错误
var a=1+2;
for(var i=0,l=items.length;i<l;i++){...}
```

## 关于命名

好的变量与函数命名，可以避免大量的注释。Nodejs推荐使用驼峰式命名：

	函数和变量：functionNamesLikeThis, variableNamesLikeThis
	类名和枚举类型：ClassNamesLikeThis, EnumNamesLikeThis
	类方法：methodNamesLikeThis
	常量：SYMBOLIC_CONSTANTS_LIKE_THIS

## 关于双等号

开发的时候大家请慎重使用==号，有时候结果未必会是您想的那样，请看下面的调试计算结果：

	> 0 == ''
	true
	> 1 == true
	true
	> 2 == true
	false
	> 0 == '0'
	true
	> false == 'false'
	false
	> false == '0'
	true
	> " \t\r\n " == 0
	true

## 关于双引号

使用string时，用单引号替代双引号（写JSON时除外）。
```
//正确
var foo = 'bar';

//错误
var foo = "bar";
```

## 关于大括号位置

```
//正确
if (true) {
  response.end('winning');
}
//错误
if (true)
{
  response.end ('losing');
}
```

## 关于字面表达式的问题

使用字面表达式，用 '{}' ,'[]' 代替 new Array ，new Object，不要使用 string，bool，number 的对象类型，即不要调用 new String ，new Boolean ，new Number。

## Object和Array创建时的逗号问题

Object ，Array 创建，当有多个元素时，注意分行排列时逗号的位置。
```
//正确
var a = ['hello', 'world'];
var b = {
  good: 'code',
  'is generally': 'pretty',
};

//错误
var a = [
  'hello', 'world'
];
var b = {"good": 'code'
  , is generally: 'pretty'
};
```

##  避免使用with与eval

## 关于for-in循环

for-in 循环，仅在 object/hash/map 时使用，绝不要对Array 使用。

## 关于Array数组的问题

不要把Array 当做关联数组或Object 使用,即你不应该用非数字作为Array 的索引（有PHP开发经验的朋友尤其注意这点）。
```
//正确
var a = {};
a.hello = 'shit';
a.foo = 'bar';

//错误
var a = []; // use '{}' instead
a['hello'] = 'shit';
a['foo'] = 'bar';
```

## 关于变量声明

变量声明时，应该每行声明一个，不应该都写在一行。

```
//正确
var name = 'bmob';
var website = 'www.bmobapp.com';

//错误
var name = 'bmob'
  ,website = 'www.bmobapp.com';
```

## 注释规范

注释的规范如下所示：

```
/**
 * 获取文章列表
 * @param {number} num 文章数量.
 * @param {string|date|null} dateTime 发布时间.
 */
var getPosts = function (num, dateTime) {
  // ...
};
```


