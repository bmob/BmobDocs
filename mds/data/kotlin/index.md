# bmob-android-data-sdk-kotlin-demo

Kotlin已正式成为Android官方支持开发语言，具体使用可参考：

```
http://kotlinlang.org/docs/reference/android-overview.html
```

由于Kotlin和Java之间具有可互操作性，为方便广大Bmob的Kotlin开发者，特开发此案例，展示如何使用Kotlin来调用Bmob的Android数据服务SDK。

案例地址：
```
https://github.com/bmob/bmob-android-data-sdk-kotlin-demo
```

# 集成
## 开发工具
Android Studio，具体使用可参考：
```
http://www.android-studio.org/
```
## 仓库配置

在项目build.gradle的allprojects-repositories节点下配置：

    maven { url "https://raw.github.com/bmob/bmob-android-sdk/master" }

## 依赖配置

在应用build.gradle的dependencies节点下配置，其中x.y.z为数据服务SDK版本号码：

    implementation 'cn.bmob.android:bmob-sdk:x.y.z'

## 权限注册

在清单文件注册所需权限：

    <!-- 允许联网 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- 获取GSM（2g）、WCDMA（联通3g）等网络状态的信息 -->
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <!-- 获取wifi网络状态的信息 -->
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <!-- 保持CPU 运转，屏幕和键盘灯有可能是关闭的,用于文件上传和下载 -->
    <uses-permission android:name="android.permission.WAKE_LOCK" />
    <!-- 获取sd卡写的权限，用于文件上传和下载 -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <!-- 允许读取手机状态 用于创建BmobInstallation -->
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <!-- 请求安装APK，用于版本更新 -->
    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />


## 初始化
	
在应用主进程中进行代码初始化，BMOB_APP_ID请到应用设置中获取：

    Bmob.initialize(this,Constant.BMOB_APP_ID)



# 数据类型
|Web端类型|支持的Kotlin类型|说明|
|---|---|---|
|Number|Byte、Short、Int、Long、Float、Double |基本数据类型|
|Array|MutableList|数组类型|
|File|BmobFile|Bmob特有类型，用来标识文件类型|
|GeoPoint|BmobGeoPoint|Bmob特有类型，用来标识地理位置|
|Date|BmobDate|Bmob特有类型，用来标识日期类型|
|Pointer|特定对象|Bmob特有类型，用来标识指针类型|
|Relation|BmobRelation|Bmob特有类型，用来标识数据关联|

# 默认表
|Web端表名|支持的Kotlin类型|说明|
|---|---|---|
|_User|BmobUser|用户系统|
|_Role|BmobRole|用户角色|
|_Installation|BmobInstallation|用户设备|
|_Article|用户自定义|图文消息|
|AppVersion|AppVersion|版本升级|
# 增删改查

### 添加一行数据

    /**
     * 新增一条数据
     */
    private fun createOne() {
        var gameScore = GameScore()
        gameScore.playerName = "比目"
        gameScore.score = 89
        gameScore.isPay = false
        /**
         * 请不要给 gameScore.objectId 赋值，数据新增成功后将会自动给此条数据的objectId赋值并返回！
         */
        gameScore.save(object : SaveListener<String>() {
            override fun done(objectId: String?, ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "新增数据成功：$objectId", Toast.LENGTH_LONG).show()
                } else {
                    Log.e("CREATE", "新增数据失败：" + ex.message)
                }
            }
        })
    }



## 更新一条数据

    /**
     * bmob更新一条数据
     */
    private fun updateObject(objectId: String?) {
        var person = Person()
        person.objectId = objectId
        person.name = "更新名字+" + System.currentTimeMillis()
        person.update(object : UpdateListener() {
            override fun done(ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "删除成功", Toast.LENGTH_LONG).show()
                } else {
                    Toast.makeText(mContext, ex.message, Toast.LENGTH_LONG).show()
                }
            }

        })
    }

## 删除一条数据

    /**
     * bmob删除一条数据
     */
    private fun deleteObject(objectId: String?) {
        var person = Person()
        person.objectId = objectId
        person.delete(object : UpdateListener() {
            override fun done(ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "删除成功", Toast.LENGTH_LONG).show()
                } else {
                    Toast.makeText(mContext, ex.message, Toast.LENGTH_LONG).show()
                }
            }
        })
    }

## 查询一条数据

    /**
     * bmob查询单条数据
     */
    private fun getObject(objectId: String?) {
        var bmobQuery: BmobQuery<Person> = BmobQuery()
        bmobQuery.getObject(objectId, object : QueryListener<Person>() {
            override fun done(person: Person?, ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "查询成功", Toast.LENGTH_LONG).show()
                } else {
                    Toast.makeText(mContext, ex.message, Toast.LENGTH_LONG).show()
                }
            }
        })
    }


## 查询多条数据

    /**
     * bmob 查询数据列表
     */
    private fun queryObjects() {
        var bmobQuery: BmobQuery<Person> = BmobQuery()
        bmobQuery.findObjects(object : FindListener<Person>() {
            override fun done(persons: MutableList<Person>?, ex: BmobException?) {

                if (ex == null) {
                    Toast.makeText(mContext, "查询成功", Toast.LENGTH_LONG).show()
                    if (persons != null) {
                        for (person: Person in persons) {
                            Log.e("Person", person.name)
                        }
                    }
                } else {
                    Toast.makeText(mContext, ex.message, Toast.LENGTH_LONG).show()
                }
            }
        })
    }


# 批量数据操作

## 批量新增数据

    /**
     * 批量新增数据
     */
    private fun createBatch() {
        val gameScores = ArrayList<BmobObject>()
        for (i in 0..2) {
            val gameScore = GameScore()
            gameScore.playerName = "运动员$i"
            gameScores.add(gameScore)
        }

        /**
         * 3.5.0版本开始提供
         */
        BmobBatch().insertBatch(gameScores).doBatch(object : QueryListListener<BatchResult>() {
            override fun done(o: List<BatchResult>, e: BmobException?) {
                if (e == null) {
                    for (i in o.indices) {
                        val result = o[i]
                        val ex = result.error
                        if (ex == null) {
                            Log.e("CREATE BATCH", "第" + i + "个数据批量添加成功：" + result.createdAt + "," + result.objectId + "," + result.updatedAt)
                        } else {
                            Log.e("CREATE BATCH", "第" + i + "个数据批量添加失败：" + ex.message + "," + ex.errorCode)
                        }
                    }
                } else {
                    Log.e("CREATE BATCH", "失败：" + e.message + "," + e.errorCode)
                }
            }
        })
    }

## 批量更新数据

    /**
     * 批量更新数据
     */
    private fun updateBatch() {
        val gameScores = ArrayList<BmobObject>()
        val gameScore1 = GameScore()
        gameScore1.objectId = "此处填写已存在的objectId"
        val gameScore2 = GameScore()
        gameScore2.objectId = "此处填写已存在的objectId"
        gameScore2.playerName = "赵大"
        gameScore2.isPay = Boolean.FALSE
        val gameScore3 = GameScore()
        gameScore3.objectId = "此处填写已存在的objectId"
        gameScore3.playerName = "王二"

        gameScores.add(gameScore1)
        gameScores.add(gameScore2)
        gameScores.add(gameScore3)

        /**
         * 从3.5.0版本开始提供
         */
        BmobBatch().updateBatch(gameScores).doBatch(object : QueryListListener<BatchResult>() {

            override fun done(o: List<BatchResult>, ex: BmobException?) {
                if (ex == null) {
                    for (i in o.indices) {
                        val result = o[i]
                        val ex = result.error
                        if (ex == null) {
                            Log.e("UPDATE", "第" + i + "个数据批量更新成功：" + result.updatedAt)
                        } else {
                            Log.e("UPDATE", "第" + i + "个数据批量更新失败：" + ex.message + "," + ex.errorCode)
                        }
                    }
                } else {
                    Log.e("UPDATE", "失败：" + ex.message + "," + ex.errorCode)
                }
            }
        })
    }


## 批量删除操作

    /**
     * 批量删除数据
     */
    private fun deleteBatch() {
        val gameScores = ArrayList<BmobObject>()
        val gameScore1 = GameScore()
        gameScore1.objectId = "此处填写已存在的objectId"
        val gameScore2 = GameScore()
        gameScore2.objectId = "此处填写已存在的objectId"
        val gameScore3 = GameScore()
        gameScore3.objectId = "此处填写已存在的objectId"

        gameScores.add(gameScore1)
        gameScores.add(gameScore2)
        gameScores.add(gameScore3)


        /**
         * 3.5.0版本开始提供
         */
        BmobBatch().deleteBatch(gameScores).doBatch(object : QueryListListener<BatchResult>() {

            override fun done(o: List<BatchResult>, e: BmobException?) {
                if (e == null) {
                    for (i in o.indices) {
                        val result = o[i]
                        val ex = result.error
                        if (ex == null) {
                            Log.e("DELETE BATCH", "第" + i + "个数据批量删除成功")
                        } else {
                            Log.e("DELETE BATCH", "第" + i + "个数据批量删除失败：" + ex.message + "," + ex.errorCode)
                        }
                    }
                } else {
                    Log.e("DELETE BATCH", "失败：" + e.message + "," + e.errorCode)
                }
            }
        })
    }

## 批量新增、更新、删除同步操作

  /**
     * 批量新增、更新、删除同步操作
     */
    private fun doBatch() {

        val batch = BmobBatch()


        //批量添加
        val gameScores = ArrayList<BmobObject>()
        val gameScore = GameScore()
        gameScore.playerName = "张三"
        gameScores.add(gameScore)
        batch.insertBatch(gameScores)

        //批量更新
        val gameScores1 = ArrayList<BmobObject>()
        val gameScore1 = GameScore()
        gameScore1.objectId = "此处填写已经存在的objectId"
        gameScore1.playerName = "李四"
        gameScores1.add(gameScore1)
        batch.updateBatch(gameScores1)

        //批量删除
        val gameScores2 = ArrayList<BmobObject>()
        val gameScore2 = GameScore()
        gameScore2.objectId = "此处填写已经存在的objectId"
        gameScores2.add(gameScore2)
        batch.deleteBatch(gameScores2)

        //从3.5.0版本开始提供
        batch.doBatch(object : QueryListListener<BatchResult>() {

            override fun done(results: List<BatchResult>, ex: BmobException?) {
                if (ex == null) {
                    //返回结果的results和上面提交的顺序是一样的，请一一对应
                    for (i in results.indices) {
                        val result = results[i]
                        if (result.isSuccess) {//只有批量添加才返回objectId
                            Log.e("BATCH", "第" + i + "个成功：" + result.objectId + "," + result.updatedAt)
                        } else {
                            val error = result.error
                            Log.e("BATCH", "第" + i + "个失败：" + error.errorCode + "," + error.message)
                        }
                    }
                } else {
                    Log.e("BATCH", "失败：" + ex.message + "," + ex.errorCode)
                }
            }
        })
    }



# 注册登录

## 用户名密码注册

        /**
         * bmob注册方法
         */
        var user = User()
        user.username = username
        user.setPassword(password)
        user.signUp(object : SaveListener<User>() {
            override fun done(currentUser: User?, ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "注册成功", Toast.LENGTH_LONG).show()
                    startActivity(Intent(mContext, MainActivity::class.java))
                    finish()
                } else {
                    Toast.makeText(mContext, ex.message, Toast.LENGTH_LONG).show()
                }
            }
        })

## 用户名密码登录

        /**
         * bmob登录方法
         */
        var user = User()
        user.username = username
        user.setPassword(password)
        user.login(object : SaveListener<User>() {
            override fun done(currentUser: User?, ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "登录成功", Toast.LENGTH_LONG).show()
                    startActivity(Intent(mContext,MainActivity::class.java))
                    finish()
                } else {
                    Toast.makeText(mContext, ex.message, Toast.LENGTH_LONG).show()
                }
            }
        })
## 修改密码
```
/**
 * 修改密码，必须先登录
 */
private fun resetPassword() {
    BmobUser.updateCurrentUserPassword("旧密码", "新密码", object : UpdateListener() {
        override fun done(e: BmobException?) {
            if (e == null) {
                Snackbar.make(btn_reset, "密码修改成功，可以用新密码进行登录啦", Snackbar.LENGTH_LONG).show()
            } else {
                Snackbar.make(btn_reset, "密码修改失败：${e.message}", Snackbar.LENGTH_LONG).show()
            }
        }
    })
}
```
# 文件管理

## 权限
    /**
     * 适配android6.0 动态申请访问文件权限
     */
    private fun requestPermission() {
        val checkSelfPermission = ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
        if (checkSelfPermission == PackageManager.PERMISSION_GRANTED) {
        } else {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE), REQUEST_WRITE_CODE)
        }
    }

    /**
     * 权限申请回调结果
     */
    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == REQUEST_WRITE_CODE) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED && permissions[0] == Manifest.permission.WRITE_EXTERNAL_STORAGE) {
                Toast.makeText(this, "permission granted", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "permission denied", Toast.LENGTH_SHORT).show()
            }
        }
    }


## 上传单个文件
    /**
     * 通过文件路径上传单个文件
     */
    private fun uploadSingle(path: String?) {
        var file = File(path)
        var bmobFile = BmobFile(file)
        bmobFile.upload(object : UploadFileListener() {
            override fun done(ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "上传成功", Toast.LENGTH_SHORT).show()
                    setFileToTable(bmobFile)
                } else {
                    Toast.makeText(mContext, "上传失败："+ex.message, Toast.LENGTH_SHORT).show()
                }
            }
        })
    }

## 关联线上文件和表字段

    /**
     * 将文件设置到表中
     */
    private fun setFileToTable(bmobFile: BmobFile) {
        var person = Person()
        person.file = bmobFile
        person.save(object : SaveListener<String>() {
            override fun done(objectId: String?, ex: BmobException?) {
                Toast.makeText(mContext, "成功将文件设置到表中", Toast.LENGTH_LONG).show()
            }
        })
    }


## 上传多个文件

	 /**
     * bmob  上传多个文件
     */
    private fun uploadMultiFile() {
        /**
         * 此处修改为你手机的文件路径
         */
        var filePaths:Array<String> = arrayOf("/storage/emulated/0/1.png", "/storage/emulated/0/2.png", "/storage/emulated/0/3.png")
        BmobFile.uploadBatch(filePaths,object : UploadBatchListener {
            override fun onError(code: Int, error: String?) {
                Toast.makeText(mContext, "上传出错：$error",Toast.LENGTH_LONG).show()
            }

            override fun onProgress(curIndex: Int, curPercent: Int, total: Int, totalPercent: Int) {
                Toast.makeText(mContext, "上传进度：$curIndex",Toast.LENGTH_LONG).show()
            }

            override fun onSuccess(bmobFiles: MutableList<BmobFile>?, urls: MutableList<String>?) {
                if (urls != null) {
                    if (urls.size==filePaths.size)
                        Toast.makeText(mContext, "全部上传成功",Toast.LENGTH_LONG).show()
                }
            }
        })
    }

## 删除单个文件

    /**
     * 删除单个文件
     */
    private fun deleteSingleFile(bmobFile: BmobFile?) {
        bmobFile!!.delete(object :UpdateListener(){
            override fun done(ex: BmobException?) {
                if (ex==null){
                    Toast.makeText(mContext, "删除成功", Toast.LENGTH_LONG).show()
                }else{
                    Toast.makeText(mContext, ex.message, Toast.LENGTH_LONG).show()
                }
            }
        })
    }


## 删除多个文件

    /**
     * 删除多个文件
     */
    private fun deleteMultiFiles(urls: Array<String>) {
        BmobFile.deleteBatch(urls,object :DeleteBatchListener(){
            override fun done(deleteUrls: Array<out String>?, ex: BmobException?) {
                if (ex==null){
                    if (urls.size== deleteUrls!!.size){
                        Toast.makeText(mContext, "全部删除成功", Toast.LENGTH_LONG).show()
                    }
                }else{
                    Toast.makeText(mContext, ex.message, Toast.LENGTH_LONG).show()
                }
            }
        })
    }


# 短信

短信功能目前属于按需付费功能，请到应用设置--付费升级中购买短信量。

## 发送短信验证码

        /**
         * bmob发送验证码
         */
        BmobSMS.requestSMSCode(phone, "此处可填写控制台的短信模板名称，如果没有短信模板名称可填写空字符串使用默认模板", object : QueryListener<Int>() {
            override fun done(smsId: Int?, ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "发送成功：$smsId", Toast.LENGTH_LONG).show()
                } else {
                    Toast.makeText(mContext, "发送成失败：$ex.message", Toast.LENGTH_LONG).show()
                }
            }
        })

## 验证短信验证码

        /**
         * bmob验证验证码
         */
        BmobSMS.verifySmsCode(phone,code,object :UpdateListener(){
            override fun done(ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "验证成功", Toast.LENGTH_LONG).show()
                } else {
                    Toast.makeText(mContext, "验证失败：$ex.message", Toast.LENGTH_LONG).show()
                }
            }
        })


# 邮箱

邮箱功能目前属于按需付费功能，请到应用设置--付费升级中购买邮件量。

## 验证激活

发送验证激活邮箱后，如果用户登录了邮箱并且点击了邮件中的激活链接，则可以使用邮箱+密码的方式进行登录。

    /**
     * 发送验证激活邮箱
     */
    private fun sendEmailVerify() {
        val email = input_email.text.toString()
        if (TextUtils.isEmpty(email)){
            Toast.makeText(mContext,"请输入邮箱",Toast.LENGTH_LONG).show()
            return
        }
        BmobUser.requestEmailVerify(email, object : UpdateListener() {
            override fun done(e: BmobException?) {
                if (e == null) {
                    Log.e("sendEmailVerify","请求验证邮件成功，请到" + email + "邮箱中进行激活。")
                } else {
                    Log.e("sendEmailVerify","请求验证邮件失败:" + e.message)
                }
            }
        })
    }

## 重置密码

发送重置密码邮箱后，如果用户登录了邮箱并且点击邮件中的链接进行密码重置，则可以使用邮箱+新密码方式进行登录。


    /**
     * 发送重置密码邮箱
     */
    private fun sendEmailReset() {
        val email = input_email.text.toString()
        if (TextUtils.isEmpty(email)){
            Toast.makeText(mContext,"请输入邮箱",Toast.LENGTH_LONG).show()
            return
        }
        BmobUser.resetPasswordByEmail(email, object : UpdateListener() {
            override fun done(e: BmobException?) {
                if (e == null) {
                    Log.e("sendEmailReset","重置密码邮件成功，请到" + email + "邮箱中进行重置。")
                } else {
                    Log.e("sendEmailReset","失败:" + e.message)
                }
            }
        })
    }

## 邮箱+密码登录


当邮箱通过验证激活后，即可使用邮箱+密码的方式进行登录。

    /**
     * 邮箱+密码登录
     */
    private fun loginEmailPassword() {
        val email = input_email.text.toString()
        if (TextUtils.isEmpty(email)){
            Toast.makeText(mContext,"请输入邮箱",Toast.LENGTH_LONG).show()
            return
        }

        val password = input_password.text.toString()
        if (TextUtils.isEmpty(password)){
            Toast.makeText(mContext,"请输入邮箱",Toast.LENGTH_LONG).show()
            return
        }
        BmobUser.loginByAccount(email, password, object : LogInListener<User>() {
            override fun done(user: User?, ex: BmobException) {
                if (ex == null) {
                    Log.e("loginByAccount","登录成功")
                } else {
                    Log.e("loginByAccount","登录失败："+ex.message)
                }
            }
        })
    }


# 第三方账号


目前第三方账号功能只支持微博、QQ、微信三种社交账号。


## 注册登录

在第三方账号授权成功之后调用。


    /**
     * 1、snsType:只能是三种取值中的一种：weibo、qq、weixin
     * 2、accessToken：接口调用凭证
     * 3、expiresIn：access_token的有效时间
     * 4、userId:用户身份的唯一标识，对应微博授权信息中的uid,对应qq和微信授权信息中的openid
     */
    private fun thirdLoginSignup(snsType: String, accessToken: String, expiresIn: String, userId: String) {
        val authInfo = BmobUser.BmobThirdUserAuth(snsType, accessToken, expiresIn, userId)
        BmobUser.loginWithAuthData(authInfo, object : LogInListener<JSONObject>() {
            override fun done(data: JSONObject?, ex: BmobException?) {
                if (ex == null) {
                    Log.e("loginWithAuthData", "登录注册成功")
                } else {
                    Log.e("loginWithAuthData", "登录注册失败：" + ex.message)
                }
            }
        })
    }



## 账号关联

在第三方账号授权成功之后调用。

    /**
     * 关联第三方账号
     */
    private fun associateThird(snsType: String, accessToken: String, expiresIn: String, userId: String) {
        val authInfo = BmobThirdUserAuth(snsType, accessToken, expiresIn, userId)
        BmobUser.associateWithAuthData(authInfo, object : UpdateListener() {

            override fun done(ex: BmobException?) {
                if (ex == null) {
                    Log.e("associateWithAuthData", "关联成功")
                } else {
                    Log.e("associateWithAuthData", "关联失败：" + ex.message)
                }
            }
        })
    }



## 取消关联

    /**
     * 取消关联
     */
    private fun unAssociateThird(snsType: String) {
        var currentUser: User? = BmobUser.getCurrentUser(User::class.java)
        currentUser?.dissociateAuthData(snsType, object : UpdateListener() {

            override fun done(ex: BmobException?) {
                if (ex == null) {
                    Log.e("dissociateAuthData", "取消关联成功")
                } else {
                    Log.e("dissociateAuthData", "取消关联失败：" + ex.message)
                }
            }
        })
    }



# 版本更新


## 版本更新设置

        //TODO 初始化，当控制台表出现后，注释掉此句
        BmobUpdateAgent.initAppVersion();
        //TODO 设置仅WiFi环境更新
        BmobUpdateAgent.setUpdateOnlyWifi(false);
        //TODO 设置更新监听器
        BmobUpdateAgent.setUpdateListener(new BmobUpdateListener() {

            @Override
            public void onUpdateReturned(int updateStatus, UpdateResponse updateInfo) {
                BmobException e = updateInfo.getException();
                if (e == null) {
                    updateResponse = updateInfo;
                    Toast.makeText(MainActivity.this, "检测更新返回：" + updateInfo.version + "-" + updateInfo.path, Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MainActivity.this, "检测更新返回：" + e.getMessage() + "(" + e.getErrorCode() + ")", Toast.LENGTH_SHORT).show();
                }
            }
        });
        //TODO 设置对话框监听器
        BmobUpdateAgent.setDialogListener(new BmobDialogButtonListener() {

            @Override
            public void onClick(int status) {
                switch (status) {
                    case UpdateStatus.Update:
                        Toast.makeText(MainActivity.this, "点击了立即更新按钮", Toast.LENGTH_SHORT).show();
                        break;
                    case UpdateStatus.NotNow:
                        Toast.makeText(MainActivity.this, "点击了以后再说按钮", Toast.LENGTH_SHORT).show();
                        break;
                    case UpdateStatus.Close:
                        Toast.makeText(MainActivity.this, "点击了对话框关闭按钮", Toast.LENGTH_SHORT).show();
                        break;

                    default:
                        break;
                }
            }
        });



## 动态访问权限

    /**
     * 检查权限
     *
     * @param requestCode
     */
    public void checkStoragePermissions(int requestCode) {
        List<String> permissions = new ArrayList<>();
        int permissionCheckWrite = ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE);
        if (permissionCheckWrite != PackageManager.PERMISSION_GRANTED) {
            permissions.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
        }
        int permissionCheckRead = ContextCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE);
        if (permissionCheckRead != PackageManager.PERMISSION_GRANTED) {
            permissions.add(Manifest.permission.READ_EXTERNAL_STORAGE);
        }
        if (permissions.size() > 0) {
            String[] missions = new String[]{};
            ActivityCompat.requestPermissions(this, permissions.toArray(missions), requestCode);
        } else {
            switch (requestCode) {
                case REQUEST_AUTO:
                    BmobUpdateAgent.update(this);
                    break;
                case REQUEST_CHECK:
                    BmobUpdateAgent.forceUpdate(this);
                    break;
                case REQUEST_SILENT:
                    BmobUpdateAgent.silentUpdate(this);
                    break;
                case REQUEST_DELETE:
                    BmobUpdateAgent.deleteResponse(updateResponse);
                    break;
                default:
                    break;
            }
        }
    }


    /**
     * 检查授权结果
     *
     * @param grantResults
     * @return
     */
    public boolean checkResults(int[] grantResults) {
        if (grantResults == null || grantResults.length < 1) {
            return false;
        }
        for (int result : grantResults) {
            if (result == PackageManager.PERMISSION_DENIED) {
                return false;
            }
        }
        return true;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case REQUEST_AUTO:
                if (checkResults(grantResults)) {
                    BmobUpdateAgent.update(this);
                }
                break;
            case REQUEST_CHECK:
                if (checkResults(grantResults)) {
                    BmobUpdateAgent.forceUpdate(this);
                }
                break;
            case REQUEST_SILENT:
                if (checkResults(grantResults)) {
                    BmobUpdateAgent.silentUpdate(this);
                }
                break;
            case REQUEST_DELETE:
                if (checkResults(grantResults)) {
                    BmobUpdateAgent.deleteResponse(updateResponse);
                }
                break;
            default:
                break;
        }
    }



## 清单文件设置

        <!--数据共享-->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="cn.bmob.kotlin.data"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths"/>
        </provider>

        <activity
            android:name="cn.bmob.v3.update.UpdateDialogActivity"
            android:theme="@android:style/Theme.Translucent.NoTitleBar">
        </activity>



# 数据监听

1、start方法开始连接；

2、onConnectCompleted回调方法后判断是否连接成功，若成功则设置监听内容；

3、onDataChange回调方法返回监听到的更新内容。

4、数据监听目前属于按需付费，请到应用设置--付费升级中购买。

    private fun startListen() {
        val rtd = BmobRealTimeData()
        rtd.start(object : ValueEventListener {
            override fun onDataChange(data: JSONObject) {
                Log.d("onDataChange", "(" + data.optString("action") + ")" + "数据：" + data)
                val action = data.optString("action")
                if (action == BmobRealTimeData.ACTION_UPDATETABLE) {
                    //TODO 如果监听表更新
                    val data = data.optJSONObject("data")
                    Toast.makeText(mContext, "监听到更新：" + data.optString("name") + "-" + data.optString("content"), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onConnectCompleted(ex: Exception) {
                if (ex == null) {
                    Log.i("onConnectCompleted", "连接情况：" + if (rtd.isConnected) "已连接" else "未连接")
                    if (rtd.isConnected) {
                        //TODO 如果已连接，设置监听动作为：监听Chat表的更新
                        rtd.subTableUpdate("Chat")
                    }
                } else {
                    Log.e("onConnectCompleted", "连接出错：" + ex.message)
                }
            }
        })
    }


# ACL

新增一条帖子数据，并且置当前用户可写，设置所有人可读。


    /**
     * ACL控制一条数据的访问权限
     */
    private fun aclAccess() {
        val user = BmobUser.getCurrentUser(User::class.java)

        val acl = BmobACL()    //创建一个ACL对象
        acl.setPublicReadAccess(true)  // 设置所有人可读的权限
        acl.setWriteAccess(user, true)   // 设置当前用户可写的权限

        val post = Post()
        post.author = user
        post.title="ACL"
        post.content="ACL控制访问权限"
        post.save(object : SaveListener<String>(){
            override fun done(objectId: String?, ex: BmobException?) {
                if (ex == null) {
                    Log.e("ACL", "保存成功")
                } else {
                    Log.e("ACL", "保存失败：" + ex.message)
                }
            }
        })
    }




# 角色



    /**
     * BmobRole：角色访问管理权限
     */
    private fun roleAccess() {
        //创建公司某用户的工资对象
        val wage = Wage()
        wage.wage= 10000.0

        //这里创建四个用户对象，分别为老板、人事小张、出纳小谢和自己
        val boss: BmobUser? =null
        val hr_zhang: BmobUser? =null
        val hr_luo: BmobUser? =null
        val cashier_xie: BmobUser? =null
        val me: BmobUser? =null

        //创建HR和Cashier两个用户角色（这里为了举例BmobRole的使用，将这段代码写在这里，正常情况下放在员工管理界面会更合适）
        val hr = BmobRole("HR")
        val cashier = BmobRole("Cashier")

        //将hr_zhang和hr_luo归属到hr角色中
        hr.users.add(hr_zhang)
        hr.users.add(hr_luo)
        //保存到云端角色表中（web端可以查看Role表）
        hr.save(object :SaveListener<String> (){
            override fun done(objectId: String?, ex: BmobException?) {
                if (ex == null) {
                    Log.e("ROLE", "保存成功")
                } else {
                    Log.e("ROLE", "保存失败：" + ex.message)
                }
            }
        })

        //将cashier_xie归属到cashier角色中
        cashier.users.add(cashier_xie)
        //保存到云端角色表中（web端可以查看Role表）
        cashier.save(object :SaveListener<String> (){
            override fun done(objectId: String?, ex: BmobException?) {
                if (ex == null) {
                    Log.e("ROLE", "保存成功")
                } else {
                    Log.e("ROLE", "保存失败：" + ex.message)
                }
            }
        })

        //创建ACL对象
        val acl = BmobACL()
        acl.setReadAccess(boss, true) // 假设老板只有一个, 设置读权限
        acl.setReadAccess(me, true) // 给自己设置读权限
        acl.setRoleReadAccess(hr, true) // 给hr角色设置读权限
        acl.setRoleReadAccess(cashier, true) // 给cashier角色设置读权限

        acl.setWriteAccess(boss, true) // 设置老板拥有写权限
        acl.setRoleWriteAccess(hr, true) // 设置hr角色拥有写权限

        //设置工资对象的ACL
        wage.acl = acl
        wage.save(object :SaveListener<String>(){
            override fun done(objectId: String?, ex: BmobException?) {
                if (ex == null) {
                    Log.e("ROLE", "保存成功")
                } else {
                    Log.e("ROLE", "保存失败：" + ex.message)
                }
            }
        })
    }


# 数组

### 添加数组
```
/**
 * 添加数组
 */
private fun addArray() {
    val user = BmobUser.getCurrentUser(User::class.java)
    if (user==null){
        Snackbar.make(btn_array_add,"请先登录",Snackbar.LENGTH_LONG).show()
        return
    }
    user.add("hobbies", "唱歌")
    user.update(object :UpdateListener(){
        override fun done(e: BmobException?) {
            if(e==null){
                Log.i("bmob","更新成功")
            }else{
                Log.i("bmob","更新失败："+e.message)
            }  
        }
    })
}
```

### 更新数组

```
/**
 * 更新数组
 */
private fun updateArray() {
    val user = BmobUser.getCurrentUser(User::class.java)
    if (user == null) {
        Snackbar.make(btn_array_add, "请先登录", Snackbar.LENGTH_LONG).show()
        return
    }
    user.setValue("hobbies.0", "爬山")
    user.update(object : UpdateListener() {
        override fun done(e: BmobException?) {
            if (e == null) {
                Snackbar.make(btn_array_add, "更新成功", Snackbar.LENGTH_LONG).show()
            } else {
                Snackbar.make(btn_array_add, "更新失败：" + e.message, Snackbar.LENGTH_LONG).show()
            }
        }
    })
}

```

### 删除数组

```
/**
 * 删除数组
 */
private fun deleteArray() {
    val user = BmobUser.getCurrentUser(User::class.java)
    if (user == null) {
        Snackbar.make(btn_array_add, "请先登录", Snackbar.LENGTH_LONG).show()
        return
    }
    user.removeAll("hobbies", Arrays.asList("阅读", "唱歌", "游泳"))
    user.update(object : UpdateListener() {

        override fun done(e: BmobException?) {
            if (e == null) {
                Log.i("bmob", "成功")
            } else {
                Log.i("bmob", "失败：" + e.message)
            }
        }
    })
}

```


# 位置

    /**
     * 查询矩形范围内的用户
     */
    private fun queryRectangle() {
        val query = BmobQuery<User>()
        val southwestOfSF = BmobGeoPoint(112.934755, 24.52065)
        val northeastOfSF = BmobGeoPoint(116.627623, 40.143687)
        query.addWhereWithinGeoBox("location", southwestOfSF, northeastOfSF)
        query.findObjects(object : FindListener<User>() {
            override fun done(persons: List<User>, ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "查询成功", Toast.LENGTH_LONG).show()
                } else {
                    Toast.makeText(mContext, "查询失败：${ex.message}", Toast.LENGTH_LONG).show()
                }
            }
        })
    }


    /**
     * 查询指定距离范围内的用户
     */
    private fun queryDistance() {
        val query = BmobQuery<User>()
        val southwestOfSF = BmobGeoPoint(112.934755, 24.52065)
        //查询指定坐标指定半径内的用户
        query.addWhereWithinRadians("location", southwestOfSF, 10.0)
        query.findObjects(object : FindListener<User>() {
            override fun done(persons: List<User>, ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "查询成功", Toast.LENGTH_LONG).show()
                } else {
                    Toast.makeText(mContext, "查询失败：${ex.message}", Toast.LENGTH_LONG).show()
                }
            }
        })
    }


    /**
     * 查询最接近某个坐标的用户
     */
    private fun queryShortest() {
        val query = BmobQuery<User>()
        val location = BmobGeoPoint(112.934755, 24.52065)
        query.addWhereNear("location", location)
        query.setLimit(10)
        query.findObjects(object : FindListener<User>() {
            override fun done(persons: List<User>, ex: BmobException?) {
                if (ex == null) {
                    Toast.makeText(mContext, "查询成功", Toast.LENGTH_LONG).show()
                } else {
                    Toast.makeText(mContext, "查询失败：${ex.message}", Toast.LENGTH_LONG).show()
                }
            }
        })
    }


# 关联关系

## 一对一关联

### 添加一对一关系
```
/**
 * 发布帖子
 */
private fun publishPost() {
    val content = input_post.text.toString()
    if (TextUtils.isEmpty(content)) {
        Toast.makeText(mContext, "请输入内容", Toast.LENGTH_LONG).show()
        return
    }

    val user = BmobUser.getCurrentUser(User::class.java)
    if(user==null) {
        Toast.makeText(mContext, "请先登录", Toast.LENGTH_LONG).show()
        return
    }
    val post = Post()
    post.content = content
    post.author = user
    post.save(object : SaveListener<String>() {
        override fun done(objectId: String?, ex: BmobException?) {
            if (ex == null) {
                Toast.makeText(mContext, "发布成功", Toast.LENGTH_LONG).show()
                finish()
            } else {
                Toast.makeText(mContext, "发布失败：${ex.message}", Toast.LENGTH_LONG).show()
            }
        }
    })
}

```
### 查询一对一关系

        val user = BmobUser.getCurrentUser<User>(User::class.java)
        val query = BmobQuery<Post>()
        query.addWhereEqualTo("author", user)  // 查询当前用户的所有帖子
        query.order("-updatedAt")
        query.include("author")// 希望在查询帖子信息的同时也把发布人的信息查询出来
        query.findObjects(object : FindListener<Post>() {

            override fun done(posts: List<Post>, e: BmobException?) {
                if (e == null) {
                    Log.i("bmob", "成功")
                } else {
                    Log.i("bmob", "失败：" + e.message)
                }
            }
        })



## 一对多关联

### 添加一对多关系

```
/**
 * 
 */
private fun addComment(objectId: String?) {
    val user = BmobUser.getCurrentUser<User>(User::class.java)
    val content = input_comment_content.text.toString()
    val post = Post()
    post.objectId = objectId
    val comment = Comment()
    comment.content = content
    comment.user = user
    comment.post = post
    comment.save(object : SaveListener<String>() {

        override fun done(objectId: String, e: BmobException?) {
            if (e == null) {
                Snackbar.make(btn_add_comment, "评论发表成功", Snackbar.LENGTH_LONG).show()
            } else {
                Snackbar.make(btn_add_comment, "评论发表失败：" + e.message, Snackbar.LENGTH_LONG).show()
            }
        }

    })
}

```
### 查询一对多关系

```
/**
 * 查询帖子的所有评论
 */
private fun queryComment(objectId: String?) {
    val query = BmobQuery<Comment>()
    val post = Post()
    //用此方式可以构造一个BmobPointer对象。只需要设置objectId就行
    post.objectId = objectId
    query.addWhereEqualTo("post", BmobPointer(post))
    //希望同时查询该评论的发布者的信息，以及该帖子的作者的信息，这里用到上面`include`的并列对象查询和内嵌对象的查询
    query.include("user,post.author")
    query.findObjects(object :FindListener<Comment>(){
        override fun done(comments: MutableList<Comment>?, ex: BmobException?) {

            if (ex == null) {
                Snackbar.make(btn_add_comment, "评论发表成功", Snackbar.LENGTH_LONG).show()
            } else {
                Snackbar.make(btn_add_comment, "评论发表失败：" + ex.message, Snackbar.LENGTH_LONG).show()
            }
        }

    })
}
```

## 多对多关联

### 添加多对多关系

```
/**
 * 喜欢该帖子
 */
private fun like(objectId: String?) {
    val user = BmobUser.getCurrentUser<User>(User::class.java)
    if (user != null) {
        Snackbar.make(btn_like, "请先登录", Snackbar.LENGTH_LONG).show()
        return
    }
    val post = Post()
    post.objectId = objectId
    //将当前用户添加到Post表中的likes字段值中，表明当前用户喜欢该帖子
    val relation = BmobRelation()
    //将当前用户添加到多对多关联中
    relation.add(user)
    //多对多关联指向`post`的`likes`字段
    post.likes = relation
    post.update(object : UpdateListener() {
        override fun done(e: BmobException?) {
            if (e == null) {
                Snackbar.make(btn_like, "多对多关联添加成功", Snackbar.LENGTH_LONG).show()
            } else {
                Snackbar.make(btn_like, "多对多关联添加失败：" + e.message, Snackbar.LENGTH_LONG).show()
            }
        }
    })
}
```

### 查询多对多关系

```
/**
 * 查询喜欢该帖子的所有用户
 */
private fun likes(objectId: String?) {
    // 查询喜欢这个帖子的所有用户，因此查询的是用户表
    val query = BmobQuery<User>()
    val post = Post()
    post.objectId = objectId
    //likes是Post表中的字段，用来存储所有喜欢该帖子的用户
    query.addWhereRelatedTo("likes", BmobPointer(post))
    query.findObjects(object : FindListener<User>() {
        override fun done(users: List<User>, e: BmobException?) {
            if (e == null) {
                Snackbar.make(btn_likes, "查询成功：" + users.size, Snackbar.LENGTH_LONG).show()
            } else {
                Snackbar.make(btn_likes, "查询失败：" + e.message, Snackbar.LENGTH_LONG).show()
            }
        }
    })
}

```

### 删除多对多关系

```
/**
 * 取消喜欢该帖子
 */
private fun unlike(objectId: String?) {
    val post = Post()
    post.objectId = objectId
    val user = BmobUser.getCurrentUser<User>(User::class.java!!)
    val relation = BmobRelation()
    relation.remove(user)
    post.likes = relation
    post.update(object : UpdateListener() {

        override fun done(e: BmobException?) {
            if (e == null) {
                Snackbar.make(btn_unlike, "关联关系删除成功", Snackbar.LENGTH_LONG).show()
            } else {
                Snackbar.make(btn_likes, "关联关系删除失败：" + e.message, Snackbar.LENGTH_LONG).show()
            }
        }

    })
}

```

# 服务器时间
考虑到安全问题，要求客户端的时间必须是正常时间，否则会返回"sdk time error"错误，如果出现此问题，可以先获取服务器时间，再设置好客户端时间后重新请求。
```
/**
 * 获取服务器时间
 */
private fun getBmobServerTime() {
    Bmob.getServerTime(object : QueryListener<Long>() {
        override fun done(time: Long, e: BmobException?) {
            if (e == null) {
                val formatter = SimpleDateFormat("yyyy-MM-dd HH:mm")
                val times = formatter.format(Date(time * 1000L))
                Snackbar.make(btn_get_server_time,"当前服务器时间为:$times",Snackbar.LENGTH_LONG).show()
            } else {
                Snackbar.make(btn_get_server_time,"获取服务器时间失败:" + e.message,Snackbar.LENGTH_LONG).show()
            }
        }
    })
}
```
# 表结构

## 获取单表结构
```
/**
 * 获取某张表的表结构
 */
private fun getTable(table: String?) {
    Bmob.getTableSchema(table, object : QueryListener<BmobTableSchema>() {

        override fun done(schema: BmobTableSchema, ex: BmobException?) {
            if (ex == null) {
                Log.i("bmob", "获取指定表的表结构信息成功：" + schema.className + "-" + schema.fields.toString())
            } else {
                Log.i("bmob", "获取指定表的表结构信息失败:" + ex.localizedMessage + "(" + ex.errorCode + ")")
            }
        }
    })
}

```
## 获取所有表结构
```
/**
 * 获取所有表结构
 */
private fun getAllTable() {

    Bmob.getAllTableSchema(object : QueryListListener<BmobTableSchema>() {

        override fun done(schemas: List<BmobTableSchema>?, ex: BmobException?) {
            if (ex == null && schemas != null && schemas.isNotEmpty()) {
                Log.i("bmob", "获取所有表结构信息成功")
            } else {
                Log.i("bmob", "获取所有表结构信息失败：" + ex!!.localizedMessage + "(" + ex.errorCode + ")")
            }
        }
    })
}
```


