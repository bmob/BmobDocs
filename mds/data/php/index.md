## 准备工作
本文档是Bmob官方提供的PHP SDK，方便PHP开发人员快速使用Bmob进行后端开发。

【注】运行PHP需要相关运行环境，推荐在5.*以上环境上使用。PHP官方下载地址为：[http://php.net/](http://php.net/) 。

### SDK下载

请到以下的Github地址clone我们的SDK最新代码：[https://github.com/bmob/bmob-php-sdk](https://github.com/bmob/bmob-php-sdk)

### 安装和配置

打开`lib/BmobConfig.class.php`，填写`APPID`（后台获取“应用密钥”中的Application ID）和`RESTKEY`（后台获取“应用密钥”中的REST API Key）相应的值。如下所示：

```
class BmobConfig{
	const APPID = '';       //替换后台"应用密钥"中的Application ID
	const RESTKEY = '';     //后台"应用密钥"中的REST API Key
	const BMOBURL = 'https://api2.bmobapp.com/1/';   //保持不变

}
```

## 运行效果

打开项目中的`test.php`文件，可以看到如何使用PHP SDK相关的方法。

```
<?php
include_once 'lib/BmobObject.class.php';
include_once 'lib/BmobUser.class.php';
try {
	/*
	 *  BmobObject 的例子
	*/
	$bmobObj = new BmobObject("GameScore");
	$res=$bmobObj->create(array("score"=>80,"playerName"=>"game")); //添加对象
	$res=$bmobObj->get("bd89c6bce9"); // 获取id为bd89c6bce9的对象
	$res=$bmobObj->get(); //获取所有对象
	//更新对象bd89c6bce9, 任何您未指定的key都不会更改,所以您可以只更新对象数据的一个子集
	$res=$bmobObj->update("bd89c6bce9", array("score"=>60,"playerName"=>"game"));
	$res=$bmobObj->delete("bd89c6bce9"); //删除对象bd89c6bce9
	//对象的查询,这里是表示查找playerName为"game"的对象，只返回２个结果
	$res=$bmobObj->get("",array('where={"playerName":"game"}','limit=2'));
	//id为bd89c6bce9的field score数值减2
	$res=$bmobObj->increment("bd89c6bce9","score",array(-2));
	//id为bd89c6bce9的field score数值加2
	$res=$bmobObj->increment("bd89c6bce9","score",array(2));

	/*
	 *  BmobUser 的例子
	 */
	$bmobUser = new BmobUser();
	//用户注册, 其中username和password为必填字段
	$res = $bmobUser->register(array("username"=>"cooldude117", "password"=>"p_n7!-e8", "phone"=>"415-392-0202", "email"=>"bmobtest111@126.com"));
	//用户登录, 第一个参数为用户名,第二个参数为密码
	$res = $bmobUser->login("cooldude117","p_n7!-e8");
	// 获取id为415b8fe99a用户的信息
	$res = $bmobUser->get("415b8fe99a");
	$res = $bmobUser->get(); // 获取所有用户的信息
	$res = $bmobUser->update("415b8fe99a", "050391db407114d9801c8f2788c6b25a", array("phone"=>"02011111")); // 更新用户的信息
	// 请求重设密码,前提是用户将email与他们的账户关联起来
	$res = $bmobUser->requestPasswordReset("bmobtest111@126.com");
	// 删除id为415b8fe99a的用户, 第一参数是用户id, 第二个参数为sessiontoken,在用户登录或注册后获取, 必填
	$res = $bmobUser->delete("415b8fe99a", "050391db407114d9801c8f2788c6b25a");

	/*
	 *  BmobCloudCode 的例子
	 */
	//调用名字为getMsgCode的云端代码
	$cloudCode = new BmobCloudCode('getMsgCode');
	//传入参数name，其值为bmob
	$res = $cloudCode->get(array("name"=>"bmob"));


	var_dump($res);

} catch (Exception $e) {
	echo $e;
}
```

## 类库说明

1. BmobConfig

Bmob配置类，使用的时候需要修改里面的配置信息

2. BmobUser

Bmob用户表处理类，负责处理与_User表相关的事情

3. BmobObject

Bmob对象处理类，负责处理云端各种表的数据操作

4. BmobRestClient

Bmob基础类，用于完成REST API请求

5. BmobException

Bmob异常处理类

6. BmobCloudCode

Bmob云端代码调用类

## Bmob官方信息

官方网址：[http://www.bmobapp.com](http://www.bmobapp.com)

问答社区：[http://wenda.bmobapp.com](http://wenda.bmobapp.com)

技术邮箱：support@bmobapp.com

