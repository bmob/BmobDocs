
## 创建应用

登录账号进入bmob后台后，点击后台界面左上角“创建应用”，在弹出框输入你应用的名称，然后确认，你就拥有了一个等待开发的应用。

![](image/rumen_chuangjian.png)

## 获取应用密钥

选择你要开发的应用，进入该应用

![](image/rumen_miyue_1.png)

在跳转页面，进入设置/应用密钥，点击复制，即可得到`Application ID` 和 ` Rest api key `

![](image/rumen_miyue_2.png)

## 安装

在命令行中执行下面的代码安装`bmobpy`包：

```pip
pip install bmobpy
```

## 初始化

创建python脚本文件，引入Bmob和创建Bmob对象进行初始化，代码如下：

```python
# 引入Bmob
from bmobpy import *

# 新建Bmob对象
b = Bmob("你的application id", "你的rest api key") 
```

其中，`application id`和`rest api key`是你在Bmob控制台上创建的应用密钥信息。

我们对AI的所有操作，都围绕着 `Bmob类` 进行。

### 连接AI服务

在正式发送对话给AI服务之前，首先要先连接AI服务，代码如下：

```python
b.connectAI()
```

### 发送对话

```python
b.chat('1+1等于多少？')
```

Bmob.chat方法还支持多会话模式，比如，多人模式的情况下，我们还可以通过第二个参数session进行区分，示例代码如下：

```python
b.chat('1+1等于多少？',session='firstman')
```

其中，session可以是用户的昵称\ID等等。

Bmob.chat方法会自动把对话记录保存在内存中，每次和AI交互的时候，都会讲上下文传递给AI。如果我们希望自定义上下文，可以使用下面的方法：

```python
context = [
    {"content": "从现在开始，你是一名教师，名字叫张三，和你聊天的人叫李四，请认真扮演好教师的角色", "role": "system"},
    {"content": "张老师好", "role": "user"},
    {"content": "李同学，你好啊", "role": "assistant"},
    {"content": "老师，什么是地球？", "role": "user"},
    {"content": "地球就是我们生活的家园", "role": "assistant"},
]
b.chat2(context)

```

上面的代码中，`system`角色通常用来携带系统的prompt信息，`user`表示用户，也就是提问者，`assistant`表示AI。

### 关闭AI服务

```python
b.closeAI()
```

### 完整示例代码

示例代码效果如下：

![](image/4.png)

```python
from bmob import *

b = Bmob("application id", "rest api key")
b.connectAI()

for i in range(10):
    txt = input('请提问：')
    print(b.chat(txt))

b.closeAI()

```