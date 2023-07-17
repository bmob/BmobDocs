Bmob平台为您的移动应用提供了一个完整的后端解决方案，我们提供轻量级的数据服务SDK开发包，让开发者以最少的配置和最简单的方式使用Bmob后端云平台提供的服务，进而完全消除开发者编写服务器代码以及维护服务器的操作。

# 1、数据类型

## 1.1、基本数据类型

BmobObject

|属性|解释|
|-----|-----|
|objectId|数据唯一标志|
|createdAt|数据创建时间|
|updatedAt|数据更新时间|
|ACL|数据控制访问权限|

## 1.2、自定义数据类型
所有自定义的数据类型都继承于基本对象类型BmobObject，一个数据对象对应于Bmob控制台一张数据表中的一条数据。

```
/**
 * Created on 2023/07/08 10:41
 *
 * @author Bmob后端云
 */
public class Category extends BmobObject {


    /**
     * 类别名称
     */
    private String name;

    /**
     * 类别解释
     */
    private String desc;
    /**
     * 类别排名
     */
    private Integer sequence;


    public String getName() {
        return name;
    }

    public Category setName(String name) {
        this.name = name;
        return this;
    }

    public String getDesc() {
        return desc;
    }

    public Category setDesc(String desc) {
        this.desc = desc;
        return this;
    }

    public Integer getSequence() {
        return sequence;
    }

    public Category setSequence(Integer sequence) {
        this.sequence = sequence;
        return this;
    }
}

```

|继承类|例子|解释|
|-----|-----|----|
|自定义类名|Category|对应控制台的表名|
|扩展字段名|name|对应控制台该表的字段名|


## 1.3、特殊数据类型

|类型|解释|功能|
|-----|-----|----|
|BmobUser|对应控制台_User用户表|可以实现用户的注册、登录、短信验证、邮箱验证等功能。|
|BmobInstallation|对应控制台_Installation设备表|可以实现将自定义的消息推送给不同的设备终端等操作。|
|BmobRole|对应控制台_Role角色表|可以配合ACL进行权限访问控制和角色管理。|
|BmobArticle|对应控制台_Article图文消息表|可以进行静态网页加载。|


## 1.4、自定义数据类型中扩展字段的数据类型

Bmob支持的扩展字段数据类型：

|控制台类型|支持的JAVA类型|说明|
|:---|:---|:---|
|String|String|字符串类型|
|Boolean|Boolean|布尔类型|
|Number	 |Integer、Float、Short、Byte、Double、Long、Character|对应数据库的Number类型，要求是封装类|
|Array	 |List|数组类型|
|File  	 |BmobFile|Bmob特有类型，用来标识文件类型|
|GeoPoint|BmobGeoPoint|Bmob特有类型，用来标识地理位置|
|Date    |BmobDate|Bmob特有类型，用来标识日期类型|
|Pointer |特定的继承自BmobObject的对象|Bmob特有类型，用来标识指针类型|
|Relation|BmobRelation|Bmob特有类型，用来标识数据关联|



## 1.5、自定义数据类型的单条数据操作

### 1.5.1、添加一条数据

添加一条类别数据：

```java
/**
 * 新增一个对象
 */
private void save() {
    Category category = new Category();
    category.setName("football");
    category.setDesc("足球");
    category.setSequence(1);
    category.save(new SaveListener<String>() {
        @Override
        public void done(String objectId, BmobException e) {
            if (e == null) {
                mObjectId = objectId;
                Snackbar.make(mBtnSave, "新增成功：" + mObjectId, Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnSave, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```


### 1.5.2、更新数据

更新一条类别数据，根据objectId来更新：

```java
/**
 * 更新一个对象
 */
private void update() {
    Category category = new Category();
    category.setSequence(2);
    category.update(mObjectId, new UpdateListener() {
        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnUpdate, "更新成功", Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnUpdate, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

### 1.5.3、删除数据

删除一条类别数据，根据objectId来删除：

```java
/**
 * 删除一个对象
 */
private void delete() {
    Category category = new Category();
    category.delete(mObjectId, new UpdateListener() {
        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnDelete, "删除成功", Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnDelete, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}

```


### 1.5.4、查询一条数据

BmobQuery查询一条类别数据，根据objectId来查询：


```
/**
 * 查询一个对象
 */
private void query() {
    BmobQuery<Category> bmobQuery = new BmobQuery<>();
    bmobQuery.getObject(mObjectId, new QueryListener<Category>() {
        @Override
        public void done(Category category, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnQuery, "查询成功：" + category.getName(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnQuery, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```


## 1.6、自定义数据类型的批量数据操作
为了提供更稳定的服务，后端启用了QPS限制，推荐采用批量数据操作来替换在循环里多次提交请求的操作，否则会返回QPS达到限制的报错。

 1. 批量操作每次只支持最大50条记录的操作。
 2. 批量操作不支持对User表的操作。

BmobBatch：

|方法|功能|
|-----|-----|
|insertBatch|批量添加数据，并返回所添加数据的objectId字段|
|updateBatch|批量更新数据|
|deleteBatch|批量删除数据|
|doBatch|批量添加、批量更新、批量删除同时操作|


### 1.6.1、批量添加

```java
/**
 * 新增多条数据
 */
private void save() {
    List<BmobObject> categories = new ArrayList<>();
    for (int i = 0; i < 3; i++) {
        Category category = new Category();
        category.setName("category" + i);
        category.setDesc("类别" + i);
        category.setSequence(i);
        categories.add(category);
    }
    new BmobBatch().insertBatch(categories).doBatch(new QueryListListener<BatchResult>() {

        @Override
        public void done(List<BatchResult> results, BmobException e) {
            if (e == null) {
                for (int i = 0; i < results.size(); i++) {
                    BatchResult result = results.get(i);
                    BmobException ex = result.getError();
                    if (ex == null) {
                        Snackbar.make(mBtnSave, "第" + i + "个数据批量添加成功：" + result.getCreatedAt() + "," + result.getObjectId() + "," + result.getUpdatedAt(), Snackbar.LENGTH_LONG).show();
                    } else {
                        Snackbar.make(mBtnSave, "第" + i + "个数据批量添加失败：" + ex.getMessage() + "," + ex.getErrorCode(), Snackbar.LENGTH_LONG).show();

                    }
                }
            } else {
                Snackbar.make(mBtnSave, "失败：" + e.getMessage() + "," + e.getErrorCode(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}

```

### 1.6.2、批量更新

```java
/**
 * 更新多条数据
 */
private void update() {

    List<BmobObject> categories = new ArrayList<>();

    Category category = new Category();
    category.setObjectId("此处填写对应的需要修改数据的objectId");
    category.setName("name" + System.currentTimeMillis());
    category.setDesc("类别" + System.currentTimeMillis());

    Category category1 = new Category();
    category1.setObjectId("此处填写对应的需要修改数据的objectId");
    category1.setName("name" + System.currentTimeMillis());
    category1.setDesc("类别" + System.currentTimeMillis());

    Category category2 = new Category();
    category2.setObjectId("此处填写对应的需要修改数据的objectId");
    category2.setName("name" + System.currentTimeMillis());
    category2.setDesc("类别" + System.currentTimeMillis());

    categories.add(category);
    categories.add(category1);
    categories.add(category2);

    new BmobBatch().updateBatch(categories).doBatch(new QueryListListener<BatchResult>() {

        @Override
        public void done(List<BatchResult> results, BmobException e) {
            if (e == null) {
                for (int i = 0; i < results.size(); i++) {
                    BatchResult result = results.get(i);
                    BmobException ex = result.getError();
                    if (ex == null) {
                        Snackbar.make(mBtnUpdate, "第" + i + "个数据批量更新成功：" + result.getCreatedAt() + "," + result.getObjectId() + "," + result.getUpdatedAt(), Snackbar.LENGTH_LONG).show();
                    } else {
                        Snackbar.make(mBtnUpdate, "第" + i + "个数据批量更新失败：" + ex.getMessage() + "," + ex.getErrorCode(), Snackbar.LENGTH_LONG).show();

                    }
                }
            } else {
                Snackbar.make(mBtnUpdate, "失败：" + e.getMessage() + "," + e.getErrorCode(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}

```

### 1.6.3、批量删除

```Java
/**
 * 删除多条数据
 */
private void delete() {
    List<BmobObject> categories = new ArrayList<>();

    Category category = new Category();
    category.setObjectId("此处填写对应的需要删除数据的objectId");

    Category category1 = new Category();
    category1.setObjectId("此处填写对应的需要删除数据的objectId");

    Category category2 = new Category();
    category2.setObjectId("此处填写对应的需要删除数据的objectId");

    categories.add(category);
    categories.add(category1);
    categories.add(category2);

    new BmobBatch().deleteBatch(categories).doBatch(new QueryListListener<BatchResult>() {

        @Override
        public void done(List<BatchResult> results, BmobException e) {
            if (e == null) {
                for (int i = 0; i < results.size(); i++) {
                    BatchResult result = results.get(i);
                    BmobException ex = result.getError();
                    if (ex == null) {
                        Snackbar.make(mBtnDelete, "第" + i + "个数据批量删除成功：" + result.getCreatedAt() + "," + result.getObjectId() + "," + result.getUpdatedAt(), Snackbar.LENGTH_LONG).show();
                    } else {
                        Snackbar.make(mBtnDelete, "第" + i + "个数据批量删除失败：" + ex.getMessage() + "," + ex.getErrorCode(), Snackbar.LENGTH_LONG).show();

                    }
                }
            } else {
                Snackbar.make(mBtnDelete, "失败：" + e.getMessage() + "," + e.getErrorCode(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}

```

### 1.6.4、批量添加、批量更新、批量删除同时操作

```Java
/**
 * 同时新增、更新、删除多条数据
 */
private void saveUpdateDelete() {
    BmobBatch batch = new BmobBatch();

    //批量添加
    List<BmobObject> categoriesSave = new ArrayList<>();
    for (int i = 0; i < 3; i++) {
        Category category = new Category();
        category.setName("category" + i);
        category.setDesc("类别" + i);
        category.setSequence(i);
        categoriesSave.add(category);
    }


    //批量更新
    List<BmobObject> categoriesUpdate = new ArrayList<>();
    Category categoryUpdate = new Category();
    categoryUpdate.setObjectId("此处填写对应的需要修改数据的objectId");
    categoryUpdate.setName("name" + System.currentTimeMillis());
    categoryUpdate.setDesc("类别" + System.currentTimeMillis());
    Category categoryUpdate1 = new Category();
    categoryUpdate1.setObjectId("此处填写对应的需要修改数据的objectId");
    categoryUpdate1.setName("name" + System.currentTimeMillis());
    categoryUpdate1.setDesc("类别" + System.currentTimeMillis());
    Category categoryUpdate2 = new Category();
    categoryUpdate2.setObjectId("此处填写对应的需要修改数据的objectId");
    categoryUpdate2.setName("name" + System.currentTimeMillis());
    categoryUpdate2.setDesc("类别" + System.currentTimeMillis());
    categoriesUpdate.add(categoryUpdate);
    categoriesUpdate.add(categoryUpdate1);
    categoriesUpdate.add(categoryUpdate2);


    //批量删除
    List<BmobObject> categoriesDelete = new ArrayList<>();
    Category categoryDelete = new Category();
    categoryDelete.setObjectId("此处填写对应的需要删除数据的objectId");
    Category categoryDelete1 = new Category();
    categoryDelete1.setObjectId("此处填写对应的需要删除数据的objectId");
    Category categoryDelete2 = new Category();
    categoryDelete2.setObjectId("此处填写对应的需要删除数据的objectId");
    categoriesDelete.add(categoryDelete);
    categoriesDelete.add(categoryDelete1);
    categoriesDelete.add(categoryDelete2);


    //执行批量操作
    batch.insertBatch(categoriesSave);
    batch.updateBatch(categoriesUpdate);
    batch.deleteBatch(categoriesDelete);
    batch.doBatch(new QueryListListener<BatchResult>() {

        @Override
        public void done(List<BatchResult> results, BmobException e) {
            if (e == null) {
                //返回结果的results和上面提交的顺序是一样的，请一一对应
                for (int i = 0; i < results.size(); i++) {
                    BatchResult result = results.get(i);
                    BmobException ex = result.getError();
                    //只有批量添加才返回objectId
                    if (ex == null) {
                        Snackbar.make(mBtnSaveUpdateDelete, "第" + i + "个数据批量操作成功：" + result.getCreatedAt() + "," + result.getObjectId() + "," + result.getUpdatedAt(), Snackbar.LENGTH_LONG).show();
                    } else {
                        Snackbar.make(mBtnSaveUpdateDelete, "第" + i + "个数据批量操作失败：" + ex.getMessage() + "," + ex.getErrorCode(), Snackbar.LENGTH_LONG).show();
                    }
                }
            } else {
                Snackbar.make(mBtnSaveUpdateDelete, "失败：" + e.getMessage() + "," + e.getErrorCode(), Snackbar.LENGTH_LONG).show();
            }
        }
    });

}

```

### 1.6.5、查询多条数据

BmobQuery查询多条类别数据：

```
/**
 * 查询多条数据
 */
private void query() {
    BmobQuery<Category> bmobQuery = new BmobQuery<>();
    bmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> categories, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnQuery, "查询成功：" + categories.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnQuery, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

### 1.6.6 同步查询数据

如果希望同步获取数据，即发起请求数据之后，线程一直在等待云端返回数据，那么你的代码应该写成这样：  

```java

new Thread(new Runnable() {
    public void run() {
        //以下是同步操作的过程
        Class<Category> clzz = Category.class;
        BmobQuery<Category> query = new BmobQuery<>();
        try {
            //同步获取Category表的数据
            List<Category> resultList =  query.findObjectsSync(clzz);
            for (int i=0;i<resultList.size();i++){
                // 这里可以遍历返回的数据
            }
        } catch (BmobException e) {
            System.out.print(e.getMessage());
        }
    }
}).start();

```

这里需要注意的是，因为网络请求会阻塞主线程，所以同步获取数据的方法也要放在子线程中运行，否则会发生异常。

# 2、用户系统

用户基类BmobUser，拥有注册、登录、修改密码、重置密码、短信操作、邮箱操作、第三方操作等功能。

## 2.1、用户基类
### 2.1.1、默认属性

BmobUser继承BmobObject，有默认属性：

|属性|说明|
|----|----|
|username|用户名/账号/用户唯一标志，可以是邮箱、手机号码、第三方平台的用户唯一标志|
|password|用户密码|
|email|用户邮箱|
|emailVerified|用户邮箱认证状态|
|mobilePhoneNumber|用户手机号码|
|mobilePhoneNumberVerified|用户手机号码认证状态|


### 2.1.2、自定义用户类型

如果你的用户需要其他属性，如性别、年龄、头像等，则需要继承BmobUser类进行自定义扩展。

```java
/**
 * Created on 2018/11/22 18:01
 *
 * @author zhangchaozhou
 */
public class User extends BmobUser {


    /**
     * 昵称
     */
    private String nickname;

    /**
     * 国家
     */

    private String country;

    /**
     * 得分数
     */
    private Integer score;


    /**
     * 抢断次数
     */
    private Integer steal;


    /**
     * 犯规次数
     */
    private Integer foul;


    /**
     * 失误个数
     */
    private Integer fault;


    /**
     * 年龄
     */
    private Integer age;


    /**
     * 性别
     */
    private Integer gender;


    /**
     * 用户当前位置
     */
    private BmobGeoPoint address;


    /**
     * 头像
     */
    private BmobFile avatar;


    /**
     * 别名
     */
    private List<String> alias;


    public String getNickname() {
        return nickname;
    }

    public User setNickname(String nickname) {
        this.nickname = nickname;
        return this;
    }

    public String getCountry() {
        return country;
    }

    public User setCountry(String country) {
        this.country = country;
        return this;
    }

    public Integer getScore() {
        return score;
    }

    public User setScore(Integer score) {
        this.score = score;
        return this;
    }

    public Integer getSteal() {
        return steal;
    }

    public User setSteal(Integer steal) {
        this.steal = steal;
        return this;
    }

    public Integer getFoul() {
        return foul;
    }

    public User setFoul(Integer foul) {
        this.foul = foul;
        return this;
    }

    public Integer getFault() {
        return fault;
    }

    public User setFault(Integer fault) {
        this.fault = fault;
        return this;
    }

    public Integer getAge() {
        return age;
    }

    public User setAge(Integer age) {
        this.age = age;
        return this;
    }

    public Integer getGender() {
        return gender;
    }

    public User setGender(Integer gender) {
        this.gender = gender;
        return this;
    }

    public BmobGeoPoint getAddress() {
        return address;
    }

    public User setAddress(BmobGeoPoint address) {
        this.address = address;
        return this;
    }

    public BmobFile getAvatar() {
        return avatar;
    }

    public User setAvatar(BmobFile avatar) {
        this.avatar = avatar;
        return this;
    }

    public List<String> getAlias() {
        return alias;
    }

    public User setAlias(List<String> alias) {
        this.alias = alias;
        return this;
    }
}

```

## 2.2、用户系统的普通操作
### 2.2.1、账号密码注册

```java
/**
 * 账号密码注册
 */
private void signUp(final View view) {
    final User user = new User();
    user.setUsername("" + System.currentTimeMillis());
    user.setPassword("" + System.currentTimeMillis());
    user.setAge(18);
    user.setGender(0);
    user.signUp(new SaveListener<User>() {
        @Override
        public void done(User user, BmobException e) {
            if (e == null) {
                Snackbar.make(view, "注册成功", Snackbar.LENGTH_LONG).show();
            } else {
                Snackbar.make(view, "尚未失败：" + e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

### 2.2.2、账号密码登录

```java
/**
 * 账号密码登录
 */
private void login(final View view) {
    final User user = new User();
    //此处替换为你的用户名
    user.setUsername("username");
    //此处替换为你的密码
    user.setPassword("password");
    user.login(new SaveListener<User>() {
        @Override
        public void done(User bmobUser, BmobException e) {
            if (e == null) {
                User user = BmobUser.getCurrentUser(User.class);
                Snackbar.make(view, "登录成功：" + user.getUsername(), Snackbar.LENGTH_LONG).show();
            } else {
                Snackbar.make(view, "登录失败：" + e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```java
/**
 * 账号密码登录
 */
private void loginByAccount(final View view) {
    //此处替换为你的用户名密码
    BmobUser.loginByAccount("username", "password", new LogInListener<User>() {
        @Override
        public void done(User user, BmobException e) {
            if (e == null) {
                Snackbar.make(view, "登录成功：" + user.getUsername(), Snackbar.LENGTH_LONG).show();
            } else {
                Snackbar.make(view, "登录失败：" + e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

### 2.2.3、判断当前是否有用户登录

```java
if (BmobUser.isLogin()) {
    User user = BmobUser.getCurrentUser(User.class);
    Snackbar.make(view, "已经登录：" + user.getUsername(), Snackbar.LENGTH_LONG).show();
} else {
    Snackbar.make(view, "尚未登录", Snackbar.LENGTH_LONG).show();
}
```

### 2.2.4、获取当前用户以及用户属性

获取缓存的用户信息，缓存的有效期为7天。

```java
if (BmobUser.isLogin()) {
    User user = BmobUser.getCurrentUser(User.class);
    Snackbar.make(view, "当前用户：" + user.getUsername() + "-" + user.getAge(), Snackbar.LENGTH_LONG).show();
    String username = (String) BmobUser.getObjectByKey("username");
    Integer age = (Integer) BmobUser.getObjectByKey("age");
    Snackbar.make(view, "当前用户属性：" + username + "-" + age, Snackbar.LENGTH_LONG).show();
} else {
    Snackbar.make(view, "尚未登录，请先登录", Snackbar.LENGTH_LONG).show();
}
```

### 2.2.5、同步本地缓存的用户信息



同步控制台数据到缓存中：

```java

   /**
 * 同步控制台数据到缓存中
 * @param view
 */
private void fetchUserInfo(final View view) {
    BmobUser.fetchUserInfo(new FetchUserInfoListener<BmobUser>() {
        @Override
        public void done(BmobUser user, BmobException e) {
            if (e == null) {
                final BmobUser bUser = BmobUser.getCurrentUser();
                Snackbar.make(view, "更新用户本地缓存信息成功："+bUser.getUsername(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("error",e.getMessage());
                Snackbar.make(view, "更新用户本地缓存信息失败：" + e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });

    // 当继承了BmobUser扩展了自定义属性时，FetchUserInfoListener中请使用自定义的类名
    BmobUser.fetchUserInfo(new FetchUserInfoListener<MyUser>() {
        @Override
        public void done(MyUser user, BmobException e) {
            if (e == null) {
                final MyUser myUser = BmobUser.getCurrentUser(MyUser.class);
                Snackbar.make(view, "更新用户本地缓存信息成功："+myUser.getUsername()+"-"+myUser.getAge(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("error",e.getMessage());
                Snackbar.make(view, "更新用户本地缓存信息失败：" + e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```
获取控制台最新JSON数据，不同步到缓存中：

```Java
/**
 * 获取控制台最新JSON数据
 * @param view
 */
private void fetchUserJsonInfo(final View view) {
    BmobUser.fetchUserJsonInfo(new FetchUserInfoListener<String>() {
        @Override
        public void done(String json, BmobException e) {
            if (e == null) {
                Log.e("success",json);
                Snackbar.make(view, "获取控制台最新数据成功："+json, Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("error",e.getMessage());
                Snackbar.make(view, "获取控制台最新数据失败：" + e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}

```

### 2.2.6、更新用户信息

在更新用户信息时，如果用户邮箱有变更并且在管理后台打开了邮箱验证选项的话，Bmob云后端同样会自动发一封邮件验证信息给用户。

```java
/**
 * 更新用户操作并同步更新本地的用户信息
 */
private void updateUser(final View view) {
    final User user = BmobUser.getCurrentUser(User.class);
    user.setAge(20);
    user.update(new UpdateListener() {
        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(view, "更新用户信息成功：" + user.getAge(), Snackbar.LENGTH_LONG).show();
            } else {
                Snackbar.make(view, "更新用户信息失败：" + e.getMessage(), Snackbar.LENGTH_LONG).show();
                Log.e("error", e.getMessage());
            }
        }
    });
}

```


### 2.2.7、查询用户
查询用户和查询普通对象一样，只需指定BmobUser类或自定义用户类即可，如下：
```java
/**
 * 查询用户表
 */
private void queryUser(final View view) {
    BmobQuery<User> bmobQuery = new BmobQuery<>();
    bmobQuery.findObjects(new FindListener<User>() {
        @Override
        public void done(List<User> object, BmobException e) {
            if (e == null) {
                Snackbar.make(view, "查询成功", Snackbar.LENGTH_LONG).show();
            } else {
                Snackbar.make(view, "查询失败：" + e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}

```


### 2.2.8、提供旧密码修改密码

若用户已登录，可以提供旧密码修改密码：

```java
/**
 * 提供旧密码修改密码
 */
private void updatePassword(final View view){
    //TODO 此处替换为你的旧密码和新密码
    BmobUser.updateCurrentUserPassword("oldPwd", "newPwd", new UpdateListener() {
        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(view, "查询成功", Snackbar.LENGTH_LONG).show();
            } else {
                Snackbar.make(view, "查询失败：" + e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

### 2.2.9、退出登录

退出登录，同时清除缓存用户对象。

```java
BmobUser.logOut();
```


## 2.3、用户系统的邮箱操作

需在应用的设置->邮件设置中开启“邮箱验证”功能，Bmob云后端才会在邮箱注册时发出一封验证邮件给用户，默认开启。

邮件功能是按需付费，可以在应用的设置->套餐升级中购买邮件的数量。


### 2.3.1、邮箱密码登录

邮箱验证通过后，用户可以使用邮箱和密码进行登录：

```java
/**
 * 邮箱+密码登录
 */
private void loginByEmailPwd() {
    //TODO 此处替换为你的邮箱和密码
    BmobUser.loginByAccount("email","password", new LogInListener<User>() {

        @Override
        public void done(User user, BmobException e) {
            if (e == null) {
                Snackbar.make(mIvAvatar, user.getUsername() + "-" + user.getAge() + "-" + user.getObjectId() + "-" + user.getEmail(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mIvAvatar, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

### 2.3.2、邮箱验证
邮件验证功能会在用户(User)对象中加入emailVerified字段，当一个用户的邮件被新添加或者修改过的话，emailVerified会被默认设为false，如果应用设置中开启了邮箱认证功能，Bmob会对用户填写的邮箱发送一个链接，这个链接可以把emailVerified设置为true.

emailVerified 字段有 3 种状态可以考虑：

|状态|解释|
|----|----|
|true|已验证。|
|false|未验证，可以刷新用户对象更新此状态为最新状态。|
|missing|用户对象已经被创建，但应用设置并没有开启邮件验证功能；或者用户对象没有email邮箱。|



### 2.3.3、发送邮箱验证邮件

发送给用户的邮箱验证邮件会在一周内失效：

```java
/**
 * 发送验证邮件
 */
private void emailVerify() {
    //TODO 此处替换为你的邮箱
    final String email = "email";
    BmobUser.requestEmailVerify(email, new UpdateListener() {

        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(mIvAvatar, "请求验证邮件成功，请到" + email + "邮箱中进行激活账户。", Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mIvAvatar, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

### 2.3.4、邮箱重置密码

开发者只需要求用户输入注册时的电子邮件地址即可：

```java
/**
 * 邮箱重置密码
 */
private void resetPasswordByEmail() {
    //TODO 此处替换为你的邮箱
    final String email = "email";
    BmobUser.resetPasswordByEmail(email, new UpdateListener() {

        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(mIvAvatar, "重置密码请求成功，请到" + email + "邮箱进行密码重置操作", Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mIvAvatar, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

邮箱重置密码的流程如下：

1. 用户输入他们的电子邮件，请求重置自己的密码。
2. Bmob向他们的邮箱发送一封包含特殊的密码重置链接的电子邮件。
3. 用户根据向导点击重置密码连接，打开一个特殊的Bmob页面，根据提示他们可以输入一个新的密码。
4. 用户的密码已被重置为新输入的密码。


## 2.4、用户系统的手机号操作

### 2.4.1、手机号码和密码登录

在手机号码被验证后，用户可以使用该手机号码和密码进行登录操作：

```java
/**
 * 手机号码密码登录
 */
private void loginByPhone(){
    //TODO 此处替换为你的手机号码和密码
    BmobUser.loginByAccount("phone", "password", new LogInListener<User>() {

        @Override
        public void done(User user, BmobException e) {
            if(user!=null){
                if (e == null) {
                    mTvInfo.append("短信登录成功：" + user.getObjectId() + "-" + user.getUsername());
                } else {
                    mTvInfo.append("短信登录失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
                }
            }
        }
    });
}
```


### 2.4.2、手机号码和短信验证码登录

在手机号码被验证后，用户可以使用该手机号码和短信验证码进行登录操作：

1、先请求登录操作的短信验证码，使用方式详见[短信开发文档](http://doc.bmobapp.com/sms/android/)：

```java
/**
 * TODO template 如果是自定义短信模板，此处替换为你在控制台设置的自定义短信模板名称；如果没有对应的自定义短信模板，则使用默认短信模板，默认模板名称为空字符串""。
 *
 * TODO 应用名称以及自定义短信内容，请使用不会被和谐的文字，防止发送短信验证码失败。
 *
 */
BmobSMS.requestSMSCode(phone, "", new QueryListener<Integer>() {
    @Override
    public void done(Integer smsId, BmobException e) {
        if (e == null) {
            mTvInfo.append("发送验证码成功，短信ID：" + smsId + "\n");
        } else {
            mTvInfo.append("发送验证码失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
        }
    }
});
```

2、然后进行手机号码和短信验证码登录:

```java
/**
 * TODO 此API需要在用户已经注册并验证的前提下才能使用
 */
BmobUser.loginBySMSCode(phone, code, new LogInListener<BmobUser>() {
    @Override
    public void done(BmobUser bmobUser, BmobException e) {
        if (e == null) {
            mTvInfo.append("短信登录成功：" + bmobUser.getObjectId() + "-" + bmobUser.getUsername());
            startActivity(new Intent(UserLoginSmsActivity.this, UserMainActivity.class));
        } else {
            mTvInfo.append("短信登录失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
        }
    }
});
```

### 2.4.3、手机号码一键注册或登录

手机号码一键注册或登录：


1、先请求登录或注册操作的短信验证码：

```java
/**
 * TODO template 如果是自定义短信模板，此处替换为你在控制台设置的自定义短信模板名称；如果没有对应的自定义短信模板，则使用默认短信模板，默认模板名称为空字符串""。
 *
 * TODO 应用名称以及自定义短信内容，请使用不会被和谐的文字，防止发送短信验证码失败。
 *
 */
BmobSMS.requestSMSCode(phone, "", new QueryListener<Integer>() {
    @Override
    public void done(Integer smsId, BmobException e) {
        if (e == null) {
            mTvInfo.append("发送验证码成功，短信ID：" + smsId + "\n");
        } else {
            mTvInfo.append("发送验证码失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
        }
    }
});
```

2、然后进行一键注册或登录:

```java
BmobUser.signOrLoginByMobilePhone(phone, code, new LogInListener<BmobUser>() {
    @Override
    public void done(BmobUser bmobUser, BmobException e) {
        if (e == null) {
            mTvInfo.append("短信注册或登录成功：" + bmobUser.getUsername());
            startActivity(new Intent(UserSignUpOrLoginSmsActivity.this, UserMainActivity.class));
        } else {
            mTvInfo.append("短信注册或登录失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
        }
    }
});

```
3、如果想在一键注册或登录的同时保存其他字段的数据：

```java
/**
 * 一键注册或登录的同时保存其他字段的数据
 * @param phone
 * @param code
 */
private void signOrLogin(String phone,String code) {
    User user = new User();
    //设置手机号码（必填）
    user.setMobilePhoneNumber(phone);
    //设置用户名，如果没有传用户名，则默认为手机号码
    user.setUsername(phone);
    //设置用户密码
    user.setPassword("");
    //设置额外信息：此处为年龄
    user.setAge(18);
    user.signOrLogin(code, new SaveListener<MyUser>() {

        @Override
        public void done(MyUser user,BmobException e) {
            if (e == null) {
                mTvInfo.append("短信注册或登录成功：" + user.getUsername());
                startActivity(new Intent(UserSignUpOrLoginSmsActivity.this, UserMainActivity.class));
            } else {
                mTvInfo.append("短信注册或登录失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
            }
        }
    });
}
```

### 2.4.4、绑定/解绑手机号码

如果已有用户系统，需要为用户绑定/解绑手机号：

1、发送短信验证码：

```
/**
 * TODO template 如果是自定义短信模板，此处替换为你在控制台设置的自定义短信模板名称；如果没有对应的自定义短信模板，则使用默认短信模板，默认模板使用空字符串""。
 */
BmobSMS.requestSMSCode(phoneInput, "DataSDK", new QueryListener<Integer>() {
    @Override
    public void done(Integer smsId, BmobException e) {
        if (e == null) {
            mTvInfo.append("发送验证码成功，短信ID：" + smsId + "\n");
        } else {
            mTvInfo.append("发送验证码失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
        }
    }
});
```
2、验证短信验证码，验证成功后更新用户的手机号码和手机号码的验证状态：
```
BmobSMS.verifySmsCode(phone, code, new UpdateListener() {
    @Override
    public void done(BmobException e) {
        if (e == null) {
            mTvInfo.append("验证码验证成功，您可以在此时进行绑定操作！\n");
            User user = BmobUser.getCurrentUser(User.class);
            user.setMobilePhoneNumber(phone);
            //绑定
            user.setMobilePhoneNumberVerified(true);
            //解绑
            //user.setMobilePhoneNumberVerified(false);
            user.update(new UpdateListener() {
                @Override
                public void done(BmobException e) {
                    if (e == null) {
                        mTvInfo.append("绑定/解绑手机号码成功");
                    } else {
                        mTvInfo.append("绑定/解绑手机号码失败：" + e.getErrorCode() + "-" + e.getMessage());
                    }
                }
            });
        } else {
            mTvInfo.append("验证码验证失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
        }
    }
});

```

### 2.4.5、手机号码重置密码
如果用户已经验证过手机号码或者使用过手机号码注册或登录，也可以通过手机号码来重置用户密码:

1、请求重置密码操作的短信验证码：

```java
/**
 * TODO template 如果是自定义短信模板，此处替换为你在控制台设置的自定义短信模板名称；如果没有对应的自定义短信模板，则使用默认短信模板，模板名称为空字符串""。
 */
BmobSMS.requestSMSCode(phone, "DataSDK", new QueryListener<Integer>() {
    @Override
    public void done(Integer smsId, BmobException e) {
        if (e == null) {
            mTvInfo.append("发送验证码成功，短信ID：" + smsId + "\n");
        } else {
            mTvInfo.append("发送验证码失败：" + e.getErrorCode() + "-" + e.getMessage() + "\n");
        }
    }
});
```

2、然后执行验证码的密码重置操作：

```java
BmobUser.resetPasswordBySMSCode(code, newPassword, new UpdateListener() {
    @Override
    public void done(BmobException e) {
        if (e == null) {
            mTvInfo.append("重置成功");
        } else {
            mTvInfo.append("重置失败：" + e.getErrorCode() + "-" + e.getMessage());
        }
    }
});
```

## 2.5、用户系统的第三方操作

Bmob提供了第三方平台登陆的功能，目前支持`新浪微博`、`QQ账号`、`微信账号`的登陆，此功能与第三方开放平台的SDK解藕。

BmobThirdUserAuth的各参数解释：

|参数|解释|
|----|----|
|snsType|固定值：weibo或qq或weixin|
|accessToken|接口调用凭证，由第三方平台返回取得|
|expiresIn|access_token的有效时间，由第三方平台返回取得|
|userId|用户身份的唯一标识，由第三方平台返回取得，对应微博授权信息中的uid，对应qq和微信授权信息中的openid|


### 2.5.1、应用场景

第三方账号登陆目前适应以下两种应用场景：

`一、没有Bmob账号，希望使用第三方账号一键注册或登陆Bmob账号`

如果开发者希望用户使用第三方平台的账号注册或登录Bmob的用户体系，则推荐的步骤如下：

1、第三方平台授权，开发者需自行根据第三方平台文档提出的授权方法完成账号授权并得到授权信息

2、调用Bmob提供的`loginWithAuthData（BmobV3.3.9版本提供）`方法，并自行构造`BmobThirdUserAuth（第三方授权信息）`对象，调用成功后，在Bmob的User表中会产生一条记录。


`二、已有Bmob账号，希望与第三方账号进行关联`

如果已使用Bmob的用户体系（假设用户A已登录），希望和第三方平台进行关联，则推荐的步骤如下：

1、第三方平台授权，开发者需自行根据第三方平台文档提出的授权方法完成账号授权并得到授权信息

2、调用`associateWithAuthData`方法，并自行构造`BmobThirdUserAuth(第三方授权信息)`对象，调用成功后，你就会在后台的用户A的authData这个字段下面看到提交的授权信息。


### 2.5.2、第三方平台一键注册或登录

假设你已通过上述提供的文档完成相应平台的授权并得到对应的授权信息，则可以这样来完成一键注册或登陆操作：

```java

/**
 * 第三方平台一键注册或登录
 * @param snsType
 * @param accessToken
 * @param expiresIn
 * @param userId
 */
private void thirdSingupLogin(String snsType, String accessToken, String expiresIn, String userId) {
    BmobUser.BmobThirdUserAuth authInfo = new BmobUser.BmobThirdUserAuth(snsType, accessToken, expiresIn, userId);
    BmobUser.loginWithAuthData(authInfo, new LogInListener<JSONObject>() {
        @Override
        public void done(JSONObject user, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnThirdSignupLogin, "第三方平台一键注册或登录成功", Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnThirdSignupLogin, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

### 2.5.3、关联第三方平台



```java
/**
 * 第三方平台关联
 * @param snsType
 * @param accessToken
 * @param expiresIn
 * @param userId
 */
private void associate(String snsType, String accessToken, String expiresIn, String userId){
    BmobUser.BmobThirdUserAuth authInfo = new BmobUser.BmobThirdUserAuth(snsType,accessToken, expiresIn, userId);
    BmobUser.associateWithAuthData(authInfo, new UpdateListener() {

        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnThirdSignupLogin, "第三方平台关联成功", Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnThirdSignupLogin, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}

```

### 2.5.4、解除第三方平台关联

```java

/**
 * 取消第三方平台关联
 * @param snsType
 */
private void unAssociate(String snsType) {
    BmobUser.dissociateAuthData(snsType,new UpdateListener() {

        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnThirdSignupLogin, "第三方平台关联成功", Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                if (e.getErrorCode()==208){
                    Snackbar.make(mBtnThirdSignupLogin, "你没有关联该账号", Snackbar.LENGTH_LONG).show();
                }else {
                    Snackbar.make(mBtnThirdSignupLogin, e.getMessage(), Snackbar.LENGTH_LONG).show();
                }
            }
        }
    });
}
```


### 2.5.5、微博登陆相关文档

1、[移动客户端接入文档](http://open.weibo.com/wiki/%E7%A7%BB%E5%8A%A8%E5%AE%A2%E6%88%B7%E7%AB%AF%E6%8E%A5%E5%85%A5)：此文档请着重查阅其中的`SDK接入流程`。

2、[新浪微博AndroidSDK快速入门](https://github.com/sinaweibosdk/weibo_android_sdk)，请详细查看`README`文档,其介绍了完整的集成流程。

3、[新浪微博常见问题](https://github.com/sinaweibosdk/weibo_android_sdk/blob/master/%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98%20FAQ.md#5-%E5%85%B3%E4%BA%8E%E6%8E%88%E6%9D%83)：在新浪微博授权过程中出现问题，请查看此文档，一般出现频率较高的错误有：

`sso package and sign error`- 平台上填写的包名和签名不正确。请仔细检查，一般最需要检查的是`签名`，签名需要使用微博提供的获取签名的工具[（app_signatures.apk）](https://github.com/sinaweibosdk/weibo_android_sdk/blob/master/app_signatures.apk)。

`redirect_uri_mismatch`     - 请确保你在weibo平台上填写的授权回调地址与代码中写的授权回调地址(RedirectURI)一样。

### 2.5.6、QQ登陆相关文档

1、如何使用SDK，请参见 [腾讯开放平台Android_SDK使用说明](http://wiki.open.qq.com/wiki/mobile/Android_SDK%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)。

2、如何调用具体API，请参见 [API调用说明](http://wiki.open.qq.com/wiki/Android_API%E8%B0%83%E7%94%A8%E8%AF%B4%E6%98%8E)。

3、常见问题汇总，请参见[问题汇总说明](http://bbs.open.qq.com/thread-6159767-1-1.html)。

### 2.5.7、微信登陆相关文档

1、[Android接入指南](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&lang=zh_CN&token=a6350e5290b2fee66bf0a98f02d7ddc7a655ddce)：这里主要介绍的是微信sdk的集成步骤

2、[微信登陆开发指南](https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&lang=zh_CN&token=a6350e5290b2fee66bf0a98f02d7ddc7a655ddce)：在`移动应用开发`->`微信登录功能`->`移动应用微信登录开发指南`。主要介绍微信OAuth2.0授权登录的流程。


# 3、数据关联

## 3.1、关联关系描述

在程序设计中，不同类型的数据之间可能存在某种关系。
比如：帖子和作者的关系，一篇帖子只属于某个作者，这是`一对一的关系`。
比如：帖子和评论的关系，一条评论只属于某一篇帖子，而一篇帖子对应有很多条评论，这是`一对多的关系`。
比如：学生和课程的关系，一个学生可以选择很多课程，一个课程也可以被很多学生所选择，这是`多对多的关系`。

Bmob提供了`Pointer（一对一、一对多）`和`Relation（多对多）`两种数据类型来解决这种业务需求。

## 3.2、关联关系案例详解
由于关联关系讲解起来比较复杂，以下用一个简单的案例来说明在Bmob中是如何使用关联关系的。

用户发表帖子，同时又可对帖子进行评论留言，在这个场景中涉及到三个表：用户表（`_User`）、帖子表（`Post`）、评论表（`Comment`）,以下是各个表的字段：

`_User`字段如下：

|字段|类型|含义|
|:---|:---|:---|
|objectId|String|用户ID|
|username|String|用户名(可以既发帖子又发评论)|
|age|Integer|年龄|

`Post`字段如下：

|字段|类型|含义|
|:---|:---|:---|
|objectId|String|帖子ID|
|title|String|帖子标题|
|content|String|帖子内容|
|author|Pointer|帖子作者|
|likes|Relation|喜欢帖子的读者|

`Comment`字段如下：

|字段|类型|含义|
|:---|:---|:---|
|objectId|String|评论ID|
|content|String|评论内容|
|post|Pointer|评论对应的帖子|
|author|Pointer|评论该帖子的人|

#### Web端创建关联字段
如果你需要在Web端创建上述表的话，那么当选择的字段类型为`Pointer或Relation`时，会提示你选择该字段所指向或关联的数据表。

如下图所示：

![图1 创建关联字段](image/createline.png)

#### 创建数据对象

```java

/**
 * @author zhangchaozhou
 */
public class Post extends BmobObject {

    /**
     * 帖子标题
     */
    private String title;

    /**
     * 帖子内容
     */
    private String content;

    /**
     * 发布者
     */
    private User author;
    /**
     * 图片
     */
    private BmobFile image;

    /**
     * 一对多关系：用于存储喜欢该帖子的所有用户
     */
    private BmobRelation likes;


    public String getTitle() {
        return title;
    }

    public Post setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getContent() {
        return content;
    }

    public Post setContent(String content) {
        this.content = content;
        return this;
    }

    public User getAuthor() {
        return author;
    }

    public Post setAuthor(User author) {
        this.author = author;
        return this;
    }

    public BmobFile getImage() {
        return image;
    }

    public Post setImage(BmobFile image) {
        this.image = image;
        return this;
    }

    public BmobRelation getLikes() {
        return likes;
    }

    public Post setLikes(BmobRelation likes) {
        this.likes = likes;
        return this;
    }
}


```

```java
/**
 * @author zhangchaozhou
 */
public class Comment extends BmobObject {

    /**
     * 评论内容
     */
    private String content;

    /**
     * 评论的用户
     */
    private User user;

    /**
     * 所评论的帖子
     */
    private Post post;


    public String getContent() {
        return content;
    }

    public Comment setContent(String content) {
        this.content = content;
        return this;
    }

    public User getUser() {
        return user;
    }

    public Comment setUser(User user) {
        this.user = user;
        return this;
    }

    public Post getPost() {
        return post;
    }

    public Comment setPost(Post post) {
        this.post = post;
        return this;
    }
}
```

**注：**

**1、类名要和数据表名保持一致。**

**2、MyUser属性对应为Pointer的指针类型。**

以下举例均假定A用户已注册并登陆

![图1](image/userA.png)

### 一对一关系

**用户发表帖子，一篇帖子也只能属于某个用户，那么帖子和用户之间的关系是`一对一关系`，建议使用`Pointer`类型来表示。**

`Pointer`本质上可以看成是我们将一个指向某条记录的指针记录下来，我们查询时可以通过该指针来获得其指向的关联对象。

用户A写了一篇帖子，需要在`Post`表中生成一条记录，并将该帖子关联到用户A这条记录，表明该帖子是A所发表的。

示例如下：

#### 添加一对一关联

```java
/**
 * 添加一对一关联，当前用户发布帖子
 */
private void savePost() {
    if (BmobUser.isLogin()){
        Post post = new Post();
        post.setTitle("帖子标题");
        post.setContent("帖子内容");
        //添加一对一关联，用户关联帖子
        post.setAuthor(BmobUser.getCurrentUser(User.class));
        post.save(new SaveListener<String>() {
            @Override
            public void done(String s, BmobException e) {
                if (e == null) {
                    Snackbar.make(mFabAddPost, "发布帖子成功：" + s, Snackbar.LENGTH_LONG).show();
                } else {
                    Log.e("BMOB", e.toString());
                    Snackbar.make(mFabAddPost, e.getMessage(), Snackbar.LENGTH_LONG).show();
                }
            }
        });
    }else {
        Snackbar.make(mFabAddPost, "请先登录", Snackbar.LENGTH_LONG).show();
    }
}
```


#### 查询一对一关联
查询当前用户所发表的所有帖子：

```java
/**
 * 查询一对一关联，查询当前用户发表的所有帖子
 */
private void queryPostAuthor() {

    if (BmobUser.isLogin()) {
        BmobQuery<Post> query = new BmobQuery<>();
        query.addWhereEqualTo("author", BmobUser.getCurrentUser(User.class));
        query.order("-updatedAt");
        //包含作者信息
        query.include("author");
        query.findObjects(new FindListener<Post>() {

            @Override
            public void done(List<Post> object, BmobException e) {
                if (e == null) {
                    Snackbar.make(mFabAddPost, "查询成功", Snackbar.LENGTH_LONG).show();
                } else {
                    Log.e("BMOB", e.toString());
                    Snackbar.make(mFabAddPost, e.getMessage(), Snackbar.LENGTH_LONG).show();
                }
            }

        });
    } else {
        Snackbar.make(mFabAddPost, "请先登录", Snackbar.LENGTH_LONG).show();
    }

```


#### 更新一对一关联

将某帖子的作者修改成其他用户：

```java
/**
 * 修改一对一关联，修改帖子和用户的关系
 */
private void updatePostAuthor() {
    User user = new User();
    user.setObjectId("此处填写你需要关联的用户");
    Post post = new Post();
    post.setObjectId("此处填写需要修改的帖子");
    //修改一对一关联，修改帖子和用户的关系
    post.setAuthor(user);
    post.update(new UpdateListener() {
        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(mFabAddPost, "修改帖子成功", Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mFabAddPost, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

#### 删除一对一关联
如果你想和`ESIt3334`这个帖子解除关联关系，可以这样：

```java
/**
 * 删除一对一关联，解除帖子和用户的关系
 */
private void removePostAuthor() {
    Post post = new Post();
    post.setObjectId("此处填写需要修改的帖子");
    //删除一对一关联，解除帖子和用户的关系
    post.remove("author");
    post.update(new UpdateListener() {
        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(mFabAddPost, "修改帖子成功", Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mFabAddPost, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

删除成功后，在后台的`Post`表中，你就会看到`ESIt3334`这个帖子的`author`字段的值已经被置空了。

![图1](image/postdelete.png)

### 一对多关系
**一条评论只能属于某一篇帖子，一篇帖子可以有很多用户对其进行评论，那么帖子和评论之间的关系就是`一对多关系`，推荐使用`pointer`类型来表示**。

因为使用方法和上面的一对一关联基本相同，只是查询一对多关联的时候有些区别，故只举添加和查询两个例子：


#### 添加一对多关联
将评论和帖子进行关联，并同时和当前用户进行关联，表明是当前用户对该帖子进行评论，示例如下：

```java
MyUser user = BmobUser.getCurrentUser(MyUser.class);
Post post = new Post();
post.setObjectId("ESIt3334");
final Comment comment = new Comment();
comment.setContent(content);
comment.setPost(post);
comment.setUser(user);
comment.save(new SaveListener<String>() {

	@Override
	public void done(String objectId,BmobException e) {
		if(e==null){
			Log.i("bmob","评论发表成功");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}

});

```

#### 查询一对多关联

我想`查询出某个帖子（objectId为ESIt3334）的所有评论,同时将该评论的作者的信息也查询出来`，那么可以使用`addWhereEqualTo`方法进行查询：

```java
BmobQuery<Comment> query = new BmobQuery<Comment>();
//用此方式可以构造一个BmobPointer对象。只需要设置objectId就行
Post post = new Post();
post.setObjectId("ESIt3334");
query.addWhereEqualTo("post",new BmobPointer(post));
//希望同时查询该评论的发布者的信息，以及该帖子的作者的信息，这里用到上面`include`的并列对象查询和内嵌对象的查询
query.include("user,post.author");
query.findObjects(new FindListener<Comment>() {

	@Override
	public void done(List<Comment> objects,BmobException e) {
		...
	}
});

```

注：`addWhereEqualTo`对`BmobPonter`类型的一对多的关联查询是`BmobSDKV3.3.8`开始支持的，因此使用时，请更新SDK版本。


### 多对多关系

**一个帖子可以被很多用户所喜欢，一个用户也可能会喜欢很多帖子，那么可以使用`Relation`类型来表示这种`多对多关联关系`**。

`Relation`本质上可以理解为其存储的是一个对象，而这个对象中存储的是多个指向其它记录的指针。

#### 添加多对多关联

```java
MyUser user = BmobUser.getCurrentUser(MyUser.class);
Post post = new Post();
post.setObjectId("ESIt3334");
//将当前用户添加到Post表中的likes字段值中，表明当前用户喜欢该帖子
BmobRelation relation = new BmobRelation();
//将当前用户添加到多对多关联中
relation.add(user);
//多对多关联指向`post`的`likes`字段
post.setLikes(relation);
post.update(new UpdateListener() {
	@Override
	public void done(BmobException e) {
		if(e==null){
			Log.i("bmob","多对多关联添加成功");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}

});

```
添加成功后，在后台的`Post`表中就能查看到`likes`字段已经生成并对应到了`_User`

![图1](image/relation.png)

点击红框中的`关联关系`按钮后，可查看刚才所添加的喜欢该帖子的用户A：

#### 查询多对多关联

如果希望`查询喜欢该帖子（objectId为ESIt3334）的所有用户`,那么就需要用到`addWhereRelatedTo`方法进行多对多关联查询。

示例代码：

```java
// 查询喜欢这个帖子的所有用户，因此查询的是用户表
BmobQuery<MyUser> query = new BmobQuery<MyUser>();
Post post = new Post();
post.setObjectId("ESIt3334");
//likes是Post表中的字段，用来存储所有喜欢该帖子的用户
query.addWhereRelatedTo("likes", new BmobPointer(post));
query.findObjects(new FindListener<MyUser>() {

	@Override
	public void done(List<MyUser> object,BmobException e) {
		if(e==null){
			Log.i("bmob","查询个数："+object.size());
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}

});

```

#### 修改多对多关联

如果`用户B也喜欢该帖子（objectId为ESIt3334）`，此时需要为该帖子(Post)的`likes`字段多添加一个用户,示例如下：

```java
Post post = new Post();
post.setObjectId("ESIt3334");
//将用户B添加到Post表中的likes字段值中，表明用户B喜欢该帖子
BmobRelation relation = new BmobRelation();
//构造用户B
MyUser user = new MyUser();
user.setObjectId("aJyG2224");
//将用户B添加到多对多关联中
relation.add(user);
//多对多关联指向`post`的`likes`字段
post.setLikes(relation);
post.update(new UpdateListener() {

	@Override
	public void done(BmobException e) {
		if(e==null){
			Log.i("bmob","用户B和该帖子关联成功");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}

});

```

修改成功后，你在点击该帖子的`likes`字段下面的`关联关系`按钮展开后，可查看刚才所添加的喜欢该帖子的用户B：

![图1](image/updaterelation.png)


#### 删除多对多关联


如果`想对该帖子进行取消喜欢的操作`，此时，需要删除之前的多对多关联，具体代码：

```java
Post post = new Post();
post.setObjectId("83ce274594");
MyUser user = BmobUser.getCurrentUser(MyUser.class);
BmobRelation relation = new BmobRelation();
relation.remove(user);
post.setLikes(relation);
post.update(new UpdateListener() {

	@Override
	public void done(BmobException e) {
		if(e==null){
			Log.i("bmob","关联关系删除成功");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}

});

```

**1 例子中的Comment和Post表请大家注意下在后端控制台建表的数据类型是Pointer还是Relation 否则返回类型不匹配的`111`错误，表的结构和字段类型如下：**
![Post](image/Post.png)
![Comment](image/Comment.png)
**2 为方便大家了解学习，我们提供了一个关于数据关联的Demo，下载地址是：https://github.com/bmob/RelationDemo**






# 4、数据查询

数据的查询可能是每个应用都会频繁使用到的，BmobSDK中提供了`BmobQuery`类，它提供了多样的方法来实现不同条件的查询，同时它的使用也是非常的简单和方便的。

**注：**
2 v3.5.2开始可以对查询条件等提供链式调用的写法，如下：</br>
```java
BmobQuery<Book> query = new BmobQuery<>();
        query.setLimit(8).setSkip(1).order("-createdAt")
                .findObjects(new FindListener<Book>() {
                    @Override
                    public void done(List<Book> object, BmobException e) {
                        if (e == null) {
                            // ...
                        } else {
                            // ...
                        }
                    }
                });
```

### 查询条件

在查询的使用过程中，基于不同条件的查询是非常常见的，BmobQuery同样也支持不同条件的查询。

#### 比较查询


|方法|功能|
|-----|-----|
|addWhereEqualTo|等于|
|addWhereNotEqualTo|不等于|
|addWhereLessThan|小于|
|addWhereLessThanOrEqualTo|小于等于|
|addWhereGreaterThan|大于|
|addWhereGreaterThanOrEqualTo|大于等于|

```
/**
 * name为football的类别
 */
private void equal() {
    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereEqualTo("name", "football");
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```
```
/**
 * name不为football的类别
 */
private void notEqual() {
    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereNotEqualTo("name", "football");
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```
/**
 * sequence小于10的类别
 */
private void less() {
    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereLessThan("sequence", 10);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```
/**
 * sequence小于等于10的类别
 */
private void lessEqual() {
    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereLessThanOrEqualTo("sequence", 10);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```
/**
 * sequence大于10的类别
 */
private void large() {
    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereGreaterThan("sequence", 10);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```
/**
 * sequence大于等于10的类别
 */
private void largeEqual() {
    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereGreaterThanOrEqualTo("sequence", 10);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

#### 子查询

如果你想查询匹配几个不同值的数据，如：要查询“Barbie”,“Joe”,“Julia”三个人的成绩时，你可以使用`addWhereContainedIn`方法来实现。

```java
String[] names = {"Barbie", "Joe", "Julia"};
query.addWhereContainedIn("playerName", Arrays.asList(names));
```

相反，如果你想查询排除“Barbie”,“Joe”,“Julia”这三个人的其他同学的信息，你可以使用`addWhereNotContainedIn`方法来实现。

```java
String[] names = {"Barbie", "Joe", "Julia"};
query.addWhereNotContainedIn("playerName", Arrays.asList(names));
```

#### 时间查询

```java
/**
 * 某个时间
 */
private void equal() throws ParseException {
    String createdAt = "2018-11-23 10:30:00";
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date createdAtDate = sdf.parse(createdAt);
    BmobDate bmobCreatedAtDate = new BmobDate(createdAtDate);


    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereEqualTo("createdAt", bmobCreatedAtDate);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```java
/**
 * 某个时间外
 */
private void notEqual() throws ParseException {
    String createdAt = "2018-11-23 10:30:00";
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date createdAtDate = sdf.parse(createdAt);
    BmobDate bmobCreatedAtDate = new BmobDate(createdAtDate);


    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereNotEqualTo("createdAt", bmobCreatedAtDate);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```java
/**
 * 某个时间前
 */
private void less() throws ParseException {
    String createdAt = "2018-11-23 10:30:00";
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date createdAtDate = sdf.parse(createdAt);
    BmobDate bmobCreatedAtDate = new BmobDate(createdAtDate);


    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereLessThan("createdAt", bmobCreatedAtDate);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```java
/**
 * 某个时间及以前
 */
private void lessEqual() throws ParseException {
    String createdAt = "2018-11-23 10:30:00";
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date createdAtDate = sdf.parse(createdAt);
    BmobDate bmobCreatedAtDate = new BmobDate(createdAtDate);


    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereLessThanOrEqualTo("createdAt", bmobCreatedAtDate);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```java
/**
 * 某个时间后
 */
private void large() throws ParseException {
    String createdAt = "2018-11-23 10:30:00";
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date createdAtDate = sdf.parse(createdAt);
    BmobDate bmobCreatedAtDate = new BmobDate(createdAtDate);


    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereGreaterThan("createdAt", bmobCreatedAtDate);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```java
/**
 * 某个时间及以后
 */
private void largeEqual() throws ParseException {
    String createdAt = "2018-11-23 10:30:00";
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date createdAtDate = sdf.parse(createdAt);
    BmobDate bmobCreatedAtDate = new BmobDate(createdAtDate);


    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.addWhereGreaterThanOrEqualTo("createdAt", bmobCreatedAtDate);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```


```java
/**
 * 期间
 */
private void duration() throws ParseException {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    String createdAtStart = "2018-11-23 10:29:59";
    Date createdAtDateStart = sdf.parse(createdAtStart);
    BmobDate bmobCreatedAtDateStart = new BmobDate(createdAtDateStart);

    String createdAtEnd = "2018-11-23 10:30:01";
    Date createdAtDateEnd = sdf.parse(createdAtEnd);
    BmobDate bmobCreatedAtDateEnd = new BmobDate(createdAtDateEnd);


    BmobQuery<Category> categoryBmobQueryStart = new BmobQuery<>();
    categoryBmobQueryStart.addWhereGreaterThanOrEqualTo("createdAt", bmobCreatedAtDateStart);
    BmobQuery<Category> categoryBmobQueryEnd = new BmobQuery<>();
    categoryBmobQueryEnd.addWhereLessThanOrEqualTo("createdAt", bmobCreatedAtDateEnd);
    List<BmobQuery<Category>> queries = new ArrayList<>();
    queries.add(categoryBmobQueryStart);
    queries.add(categoryBmobQueryEnd);


    BmobQuery<Category> categoryBmobQuery = new BmobQuery<>();
    categoryBmobQuery.and(queries);
    categoryBmobQuery.findObjects(new FindListener<Category>() {
        @Override
        public void done(List<Category> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnEqual, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnEqual, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

#### 数组查询

对于字段类型为数组的情况，需要查找字段中的数组值是否有被包含的对象，可以使用`addWhereContainsAll`方法：

查询有A和B别名的用户：
```java
/**
 * 包含所有
 */
private void containAll() {
    BmobQuery<User> userBmobQuery = new BmobQuery<>();
    String[] alias = new String[]{"A", "B"};
    userBmobQuery.addWhereContainsAll("alias", Arrays.asList(alias));
    userBmobQuery.findObjects(new FindListener<User>() {
        @Override
        public void done(List<User> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnContain, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnContain, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

#### 模糊查询

对字符串值的模糊查询 比如 查询包含字符串的值，有几种方法。

你可以使用任何正确的正则表达式来检索相匹配的值，使用`addWhereMatches`方法：

```java
query.addWhereMatches(("username", "^[A-Z]\\d");
```

还可以使用如下方法：

```java
//查询username字段的值含有“sm”的数据
query.addWhereContains("username", "sm");

//查询username字段的值是以“sm“字开头的数据
query.whereStartsWith("username", "sm");

// 查询username字段的值是以“ile“字结尾的数据
query.whereEndsWith("username", "ile");
```

**注:模糊查询只对付费用户开放，付费后可直接使用。**

#### 列值是否存在

如果你想查询某个列的值存在，那么可以使用`addWhereExists`方法：

```java
//查询username有值的数据
query.addWhereExists("username");
```

如果想查询某个列的值不存在，则可以用`addWhereDoesNotExists`方法

```java
//查询username字段没有值的数据
query.addWhereDoesNotExists("username");
```

#### 分页查询

有时，在数据比较多的情况下，你希望查询出的符合要求的所有数据能按照多少条为一页来显示，这时可以使用`setLimit`方法来限制查询结果的数据条数来进行分页。

默认情况下，Limit的值为`100`，最大有效设置值`500`（设置的数值超过500还是视为500）。

```java
query.setLimit(10); // 限制最多10条数据结果作为一页
```

在数据较多的情况下，在`setLimit`的基础上分页显示数据是比较合理的解决办法。
`setSKip`方法可以做到跳过查询的前多少条数据来实现分页查询的功能。默认情况下Skip的值为10。

```java
query.setSkip(10); // 忽略前10条数据（即第一页数据结果）
```

**大家也可以直接下载我们提供的Demo源码（[https://github.com/bmob/bmob-android-demo-paging](https://github.com/bmob/bmob-android-demo-paging)），查看如何使用分页查询，结合ListView开发下拉刷新查看更多内容的应用。**

#### 排序

对应数据的排序，如数字或字符串，你可以使用升序或降序的方式来控制查询数据的结果顺序：

```java
// 根据score字段升序显示数据
query.order("score");
// 根据score字段降序显示数据
query.order("-score");
// 多个排序字段可以用（，）号分隔
query.order("-score,createdAt");
```
**说明：多个字段排序时，先按第一个字段进行排序，再按第二个字段进行排序，依次进行。**

### 复合查询

#### 与查询(and)

有些查询需要使用到复合“与”的查询条件，例如：你想查询出Person表中年龄在6-29岁之间且姓名以"y"或者"e"结尾的人，那么，可以采用and查询，示例代码如下：

```java
//查询年龄6-29岁之间的人，每一个查询条件都需要New一个BmobQuery对象
//--and条件1
BmobQuery<Person> eq1 = new BmobQuery<Person>();
eq1.addWhereLessThanOrEqualTo("age", 29);//年龄<=29
//--and条件2
BmobQuery<Person> eq2 = new BmobQuery<Person>();
eq2.addWhereGreaterThanOrEqualTo("age", 6);//年龄>=6

//查询姓名以"y"或者"e"结尾的人--这个需要使用到复合或查询（or）
//--and条件3
BmobQuery<Person> eq3 = new BmobQuery<Person>();
eq3.addWhereEndsWith("name", "y");
BmobQuery<Person> eq4 = new BmobQuery<Person>();
eq4.addWhereEndsWith("name", "e");
List<BmobQuery<Person>> queries = new ArrayList<BmobQuery<Person>>();
queries.add(eq3);
queries.add(eq4);
BmobQuery<Person> mainQuery = new BmobQuery<Person>();
BmobQuery<Person> or = mainQuery.or(queries);

//最后组装完整的and条件
List<BmobQuery<Person>> andQuerys = new ArrayList<BmobQuery<Person>>();
andQuerys.add(eq1);
andQuerys.add(eq2);
andQuerys.add(or);
//查询符合整个and条件的人
BmobQuery<Person> query = new BmobQuery<Person>();
query.and(andQuerys);
query.findObjects(new FindListener<Person>() {
    @Override
	public void done(List<Person> object, BmobException e) {
		if(e==null){
			toast("查询年龄6-29岁之间，姓名以'y'或者'e'结尾的人个数："+object.size());
		}else{
			Log.i("bmob","失败："+e.getMessage()+","+e.getErrorCode());
		}
	}
});
```

#### 或查询(or)

有些情况，在查询的时候需要使用到复合的“或”的查询条件。例如，你想查出 Person 表中 age 等于 29 或者 age 等于 6 的人，可以这样：

```java
BmobQuery<Person> eq1 = new BmobQuery<Person>();
eq1.addWhereEqualTo("age", 29);
BmobQuery<Person> eq2 = new BmobQuery<Person>();
eq2.addWhereEqualTo("age", 6);
List<BmobQuery<Person>> queries = new ArrayList<BmobQuery<Person>>();
queries.add(eq1);
queries.add(eq2);
BmobQuery<Person> mainQuery = new BmobQuery<Person>();
mainQuery.or(queries);
mainQuery.findObjects(new FindListener<Person>() {
	@Override
	public void done(List<Person> object, BmobException e) {
		if(e==null){
			toast("查询年龄6-29岁之间，姓名以'y'或者'e'结尾的人个数："+object.size());
		}else{
			Log.i("bmob","失败："+e.getMessage()+","+e.getErrorCode());
		}
	}
});
```

你还可以在此基础上添加更多的约束条件到新创建的 BmobQuery 对象上，表示一个 and 查询操作。

### 查询结果计数

如果你只是想统计满足查询对象的数量，你并不需要获取所有匹配对象的具体数据信息，可以直接使用`count`替代`findObjects`。例如，查询一个特定玩家玩的游戏场数：

```java
BmobQuery<GameSauce> query = new BmobQuery<GameSauce>();
query.addWhereEqualTo("playerName", "Barbie");
query.count(GameSauce.class, new CountListener() {
	@Override
	public void done(Integer count, BmobException e) {
		if(e==null){
			toast("count对象个数为："+count);
		}else{
			Log.i("bmob","失败："+e.getMessage()+","+e.getErrorCode());
		}
	}
});
```

### 查询指定列

有的时候，一张表的数据列比较多，而我们只想查询返回某些列的数据时，我们可以使用BmobQuery对象提供的`addQueryKeys`方法来实现。如下所示：

```java
//只返回Person表的objectId这列的值
BmobQuery<Person> bmobQuery = new BmobQuery<Person>();
bmobQuery.addQueryKeys("objectId");
bmobQuery.findObjects(new FindListener<Person>() {
	@Override
	public void done(List<Person> object, BmobException e) {
		if(e==null){
			toast("查询成功：共" + object.size() + "条数据。");
         	//注意：这里的Person对象中只有指定列的数据。
		}else{
			Log.i("bmob","失败："+e.getMessage()+","+e.getErrorCode());
		}
	}
});
```

指定多列时用`,`号分隔每列，如：`addQueryKeys("objectId,name,age")`;

### 统计查询

Bmob为开发者提供了以下关键字或其组合的统计查询操作，分别用于计算`总和、平均值、最大值、最小值`，同时支持分组和过滤条件。

|方法名|参数说明|方法说明|
|:---|:---|:---|
|sum|String[] sumKeys（多个列名）|求某列或多列的和|
|average|String[] aveKeys（多个列名）|求某列或多列的平均值|
|max|String[] maxKeys（多个列名）|求某列或多列的最大值|
|min|String[] minKeys（多个列名）|求某列或多列的最小值|
|groupby|String[] groupKeys（多个列名）|分组|
|having|HashMap map(键（String）值(Object)对的形式)|分组的过滤条件|
|setHasGroupCount|boolean hasCount|是否返回每个分组的记录数|

注：
1、为避免和用户创建的列名称冲突，Bmob约定以上查询返回的字段采用`_(关键字)+首字母大写的列名` 的格式：
例：
计算用户表（_User）中列名为score的总和，那么返回的结果集会有一个列名为`_sumScore`，
若设置了setHasGroupCount（true）,则结果集中会返回`_count`。
2、因为返回格式不固定，故使用`findStatistics`来专门处理统计查询。
```java
/**
 * TODO 不带groupby的查询结果，统计全部。
 * [{
 * 	"_avgFault": 1.625,
 * 	"_avgFoul": 3.75,
 * 	"_avgScore": 25.75,
 * 	"_avgSteal": 2,
 * 	"_count": 79,
 * 	"_maxFault": 3,
 * 	"_maxFoul": 6,
 * 	"_maxScore": 53,
 * 	"_maxSteal": 4,
 * 	"_minFault": 1,
 * 	"_minFoul": 2,
 * 	"_minScore": 11,
 * 	"_minSteal": 1,
 * 	"_sumFault": 13,
 * 	"_sumFoul": 30,
 * 	"_sumScore": 206,
 * 	"_sumSteal": 16
 * }]
 */
/**
 * TODO 带groupby的查询结果，根据country分组统计。
 * [{
 * "_avgFault": 1.6666666666666667,
 * "_avgFoul": 2.3333333333333335,
 * "_avgScore": 25.666666666666668,
 * "_avgSteal": 1.3333333333333333,
 * "_count": 3,
 * "_maxFault": 2,
 * "_maxFoul": 3,
 * "_maxScore": 53,
 * "_maxSteal": 2,
 * "_minFault": 1,
 * "_minFoul": 2,
 * "_minScore": 12,
 * "_minSteal": 1,
 * "_sumFault": 5,
 * "_sumFoul": 7,
 * "_sumScore": 77,
 * "_sumSteal": 4,
 * "country": "china"
 * }, {
 * "_avgFault": 2,
 * "_avgFoul": 4.5,
 * "_avgScore": 22,
 * "_avgSteal": 2.5,
 * "_count": 2,
 * "_maxFault": 3,
 * "_maxFoul": 5,
 * "_maxScore": 23,
 * "_maxSteal": 3,
 * "_minFault": 1,
 * "_minFoul": 4,
 * "_minScore": 21,
 * "_minSteal": 2,
 * "_sumFault": 4,
 * "_sumFoul": 9,
 * "_sumScore": 44,
 * "_sumSteal": 5,
 * "country": "usa"
 * }, {
 * "_avgFault": 1.3333333333333333,
 * "_avgFoul": 4.666666666666667,
 * "_avgScore": 28.333333333333332,
 * "_avgSteal": 2.3333333333333335,
 * "_count": 3,
 * "_maxFault": 2,
 * "_maxFoul": 6,
 * "_maxScore": 43,
 * "_maxSteal": 4,
 * "_minFault": 1,
 * "_minFoul": 2,
 * "_minScore": 11,
 * "_minSteal": 1,
 * "_sumFault": 4,
 * "_sumFoul": 14,
 * "_sumScore": 85,
 * "_sumSteal": 7,
 * "country": "uk"
 * }, {
 * "_avgFault": null,
 * "_avgFoul": null,
 * "_avgScore": null,
 * "_avgSteal": null,
 * "_count": 71,
 * "_maxFault": null,
 * "_maxFoul": null,
 * "_maxScore": null,
 * "_maxSteal": null,
 * "_minFault": null,
 * "_minFoul": null,
 * "_minScore": null,
 * "_minSteal": null,
 * "_sumFault": 0,
 * "_sumFoul": 0,
 * "_sumScore": 0,
 * "_sumSteal": 0,
 * "country": null
 * }]
 */

/**
 * TODO 带groupby和having的查询结果
 * [{
 * 	"_avgFault": 1.3333333333333333,
 * 	"_avgFoul": 4.666666666666667,
 * 	"_avgScore": 28.333333333333332,
 * 	"_avgSteal": 2.3333333333333335,
 * 	"_count": 3,
 * 	"_maxFault": 2,
 * 	"_maxFoul": 6,
 * 	"_maxScore": 43,
 * 	"_maxSteal": 4,
 * 	"_minFault": 1,
 * 	"_minFoul": 2,
 * 	"_minScore": 11,
 * 	"_minSteal": 1,
 * 	"_sumFault": 4,
 * 	"_sumFoul": 14,
 * 	"_sumScore": 85,
 * 	"_sumSteal": 7,
 * 	"country": "uk"
 * }]
 */

/**
 * “group by”从字面意义上理解就是根据“by”指定的规则对数据进行分组，所谓的分组就是将一个“数据集”划分成若干个“小区域”，然后针对若干个“小区域”进行数据处理。
 * where 子句的作用是在对查询结果进行分组前，将不符合where条件的行去掉，即在分组之前过滤数据，where条件中不能包含聚组函数，使用where条件过滤出特定的行。
 * having 子句的作用是筛选满足条件的组，即在分组之后过滤数据，条件中经常包含聚组函数，使用having 条件过滤出特定的组，也可以使用多个分组标准进行分组。
 *
 * @throws JSONException
 */
private void statistics() throws JSONException {
    BmobQuery<User> bmobQuery = new BmobQuery<>();
    //总和
    bmobQuery.sum(new String[]{"score", "steal", "foul", "fault"});
    //平均值
    bmobQuery.average(new String[]{"score", "steal", "foul", "fault"});
    //最大值
    bmobQuery.max(new String[]{"score", "steal", "foul", "fault"});
    //最小值
    bmobQuery.min(new String[]{"score", "steal", "foul", "fault"});
    //是否返回所统计的总条数
    bmobQuery.setHasGroupCount(true);
    //根据所给列分组统计
    bmobQuery.groupby(new String[]{"country"});
    //对统计结果进行过滤
    HashMap<String, Object> map = new HashMap<>(1);
    JSONObject jsonObject = new JSONObject();
    jsonObject.put("$gt", 28);
    map.put("_avgScore", jsonObject);
    bmobQuery.having(map);
    //开始统计查询
    bmobQuery.findStatistics(User.class, new QueryListener<JSONArray>() {
        @Override
        public void done(JSONArray jsonArray, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnStatistics, "查询成功：" + jsonArray.length(), Snackbar.LENGTH_LONG).show();
                try {
                    JSONObject jsonObject = jsonArray.getJSONObject(0);
                    int sum = jsonObject.getInt("_sumScore");
                    Snackbar.make(mBtnStatistics, "sum：" + sum, Snackbar.LENGTH_LONG).show();
                } catch (JSONException e1) {
                    e1.printStackTrace();
                }
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnStatistics, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}

```

### 缓存查询

缓存查询通常是将查询结果缓存在磁盘上。
当用户的设备处于离线状态时，就可以从缓存中获取数据来显示。
或者在应用界面刚刚启动，从网络获取数据还未得到结果时，先使用缓存数据来显示。
这样可以让用户不必在按下某个按钮后进行枯燥的等待。
默认的查询操作是没有启用缓存的，开发者可以使用`setCachePolicy`方法来启用缓存功能。
例如：优先从缓存获取数据，如果获取失败再从网络获取数据。

```java
bmobQuery.setCachePolicy(CachePolicy.CACHE_ELSE_NETWORK);	// 先从缓存获取数据，如果没有，再从网络获取。
bmobQuery.findObjects(new FindListener<Person>() {
	@Override
	public void done(List<Person> object,BmobException e) {
		if(e==null){
			toast("查询成功：共"+object.size()+"条数据。");
		}else{
			toast("查询失败："+msg);
		}
	}

});
```

#### 缓存策略

Bmob SDK提供了几种不同的缓存策略，以适应不同应用场景的需求：

- `IGNORE_CACHE`     :只从网络获取数据，且不会将数据缓存在本地，这是默认的缓存策略。
- `CACHE_ONLY`        :只从缓存读取数据，如果缓存没有数据会导致一个BmobException,可以忽略不处理这个BmobException.
- `NETWORK_ONLY`      :只从网络获取数据，同时会在本地缓存数据。
- `NETWORK_ELSE_CACHE`:先从网络读取数据，如果没有，再从缓存中获取。
- `CACHE_ELSE_NETWORK`:先从缓存读取数据，如果没有，再从网络获取。
- `CACHE_THEN_NETWORK`:先从缓存取数据，无论结果如何都会再次从网络获取数据。也就是说会产生2次调用。

**建议的做法：**
**第一次进入应用的时候，设置其查询的缓存策略为`CACHE_ELSE_NETWORK`,当用户执行上拉或者下拉刷新操作时，设置查询的缓存策略为`NETWORK_ELSE_CACHE`。**

#### 缓存方法

如果需要操作缓存内容，可以使用BmobQuery提供的方法做如下操作：

- 检查是否存在当前查询条件的缓存数据

```java
boolean isInCache = query.hasCachedResult(Class<?> clazz);
```

**注：缓存和查询条件有关，此方法必须放在所有的查询条件（where、limit、order、skip、include等）都设置完之后，否则会得不到缓存数据。**

- 清除当前查询的缓存数据

```java
query.clearCachedResult(Class<?> clazz);
```

- 清除所有查询结果的缓存数据

```java
BmobQuery.clearAllCachedResults(Class<?> clazz);
```

- 设置缓存的最长时间（以毫秒为单位）

```java
query.setMaxCacheAge(TimeUnit.DAYS.toMillis(1));//此表示缓存一天
```

示例如下：

```java
BmobQuery<Person> query	 = new BmobQuery<Person>();
query.addWhereEqualTo("age", 25);
query.setLimit(10);
query.order("createdAt");
//判断是否有缓存，该方法必须放在查询条件（如果有的话）都设置完之后再来调用才有效，就像这里一样。
boolean isCache = query.hasCachedResult(Person.class);
if(isCache){--此为举个例子，并不一定按这种方式来设置缓存策略
	query.setCachePolicy(CachePolicy.CACHE_ELSE_NETWORK);	// 如果有缓存的话，则设置策略为CACHE_ELSE_NETWORK
}else{
	query.setCachePolicy(CachePolicy.NETWORK_ELSE_CACHE);	// 如果没有缓存的话，则设置策略为NETWORK_ELSE_CACHE
}
query.findObjects(new FindListener<Person>() {

	@Override
	public void done(List<Person> object,BmobException e) {
		if(e==null){
			toast("查询成功：共"+object.size()+"条数据。");
		}else{
			toast("查询失败："+msg);
		}
	}
});
```

**注：**
**1、只有当缓存查询的条件一模一样时才会获取到缓存到本地的缓存数据。**
**2、设置的默认的最大缓存时长为5小时。**

### BQL查询

`Bmob Query Language`（简称 BQL） 是 Bmob 自 `BmobSDKV3.3.7` 版本开始，为查询 API 定制的一套类似 SQL 查询语法的子集和变种，主要目的是降低大家学习 Bmob 查询API 的成本，可以使用传统的 SQL 语法来查询 Bmob 应用内的数据。

具体的 BQL 语法，请参考 [Bmob Query Language 详细指南](http://doc.bmobapp.com/other/bql/)。

#### 基本BQL查询

可以通过以下方法来进行SQL查询：
例如：需要查询所有的游戏得分记录

```java
String bql ="select * from GameScore";//查询所有的游戏得分记录
new BmobQuery<GameScore>().doSQLQuery(bql,new SQLQueryListener<GameScore>(){

	@Override
	public void done(BmobQueryResult<GameScore> result, BmobException e) {
		if(e ==null){
			List<GameScore> list = (List<GameScore>) result.getResults();
			if(list!=null && list.size()>0){
				...
			}else{
				Log.i("smile", "查询成功，无数据返回");
			}
		}else{
			Log.i("smile", "错误码："+e.getErrorCode()+"，错误描述："+e.getMessage());
		}
	}
});
```

上面的示例也等价于(`此方法自BmobV3.3.8版本提供`)：

```java
//查询所有的游戏得分记录
String bql ="select * from GameScore";
BmobQuery<GameScore> query=new BmobQuery<GameScore>();
//设置查询的SQL语句
query.setSQL(bql);
query.doSQLQuery(new SQLQueryListener<GameScore>(){

	@Override
	public void done(BmobQueryResult<GameScore> result, BmobException e) {
		if(e ==null){
			List<GameScore> list = (List<GameScore>) result.getResults();
			if(list!=null && list.size()>0){
				...
			}else{
				Log.i("smile", "查询成功，无数据返回");
			}
		}else{
			Log.i("smile", "错误码："+e.getErrorCode()+"，错误描述："+e.getMessage());
		}
	}
});
```


如果需要查询个数，则可以这样：

```java
String bql = "select count(*),* from GameScore";//查询GameScore表中总记录数并返回所有记录信息
new BmobQuery<GameScore>().doSQLQuery(bql, new SQLQueryListener<GameScore>(){

	@Override
	public void done(BmobQueryResult<GameScore> result, BmobException e) {
		if(e ==null){
			int count = result.getCount();//这里得到符合条件的记录数
			List<GameScore> list = (List<GameScore>) result.getResults();
			if(list.size()>0){
				...
			}else{
				Log.i("smile", "查询成功，无数据");
			}
		}else{
			Log.i("smile", "错误码："+e.getErrorCode()+"，错误描述："+e.getMessage());
		}
	}
});
```

注：当查询的表为系统表（目前系统表有User、Installation、Role）时，需要带上下划线 `_`。

比如，你想查询的是用户`smile`的信息，则：

```sql
select * from _User where username = smile
```

#### 统计BQL查询

由于统计查询的结果是不定的，故BQL提供了另外一种查询方法来进行统计查询，可以使用`doStatisticQuery`方法来进行：

```java
//按照姓名分组求和,并将结果按时间降序排列
String bql = "select sum(playScore) from GameScore group by name order by -createdAt";
new BmobQuery<GameScore>().doStatisticQuery(bql,new QueryListener<JSONArray>(){

	@Override
	public void done(Object result, BmobException e) {
		if(e ==null){
			JSONArray ary = (JSONArray) result;
			if(ary!=null){//开发者需要根据返回结果自行解析数据
				...
			}else{
				showToast("查询成功，无数据");
			}
		}else{
			Log.i("smile", "错误码："+e.getErrorCode()+"，错误描述："+e.getMessage());
		}
	}
});
```

#### 占位符查询

在更多的时候，一个查询语句中间会有很多的值是可变值，为此，我们也提供了类似 Java JDBC 里的 `PreparedStatement` 使用占位符查询的语法结构。

##### 普通查询

```java
String bql="select * from GameScore where player = ? and game = ?";//查询玩家1的地铁跑酷的GameScore信息
new BmobQuery<GameScore>().doSQLQuery(bql,new SQLQueryListener<GameScore>(){

	@Override
	public void done(BmobQueryResult<GameScore> result, BmobException e) {
		if(e ==null){
			List<GameScore> list = (List<GameScore>) result.getResults();
			if(list!=null && list.size()>0){
				...
			}else{
				Log.i("smile", "查询成功，无数据返回");
			}
		}else{
			Log.i("smile", "错误码："+e.getErrorCode()+"，错误描述："+e.getMessage());
		}
	}
},"玩家1","地铁跑酷");
```

最后的可变参数 `玩家1` 和 `地铁跑酷` 会自动替换查询语句中的问号位置（按照问号的先后出现顺序）。

上面的示例也等价于如下代码（`此方法自BmobV3.3.8版本提供`）：

```java
String bql="select * from GameScore where player = ? and game = ?";
BmobQuery<GameScore> query=new BmobQuery<GameScore>();
//设置SQL语句
query.setSQL(bql);
//设置占位符参数
query.setPreparedParams(new Object[]{"玩家1","地铁跑酷"});
query.doSQLQuery(new SQLQueryListener<GameScore>(){

	@Override
	public void done(BmobQueryResult<GameScore> result, BmobException e) {
		if(e ==null){
			List<GameScore> list = (List<GameScore>) result.getResults();
			if(list!=null && list.size()>0){
				...
			}else{
				Log.i("smile", "查询成功，无数据返回");
			}
		}else{
			Log.i("smile", "错误码："+e.getErrorCode()+"，错误描述："+e.getMessage());
		}
	}
});
```

##### 内置函数

对于包含`内置函数`的占位符查询，比较特殊，请使用[`Bmob Query Language 详细指南`](http://doc.bmobapp.com/other/bql/)中的`内置函数`中占位符查询用到的内置函数列出的形式进行查询操作：

举例：我想查询当前用户在2015年5月12日之后，在特定地理位置附近的游戏记录，可以这样：

```java
String sql = "select * from GameScore where createdAt > date(?) and player = pointer(?,?) and gps near geopoint(?,?)";
new BmobQuery<GameScore>().doSQLQuery(sql,new SQLQueryListener<GameScore>(){

	@Override
	public void done(BmobQueryResult<GameScore> result, BmobException e) {
		if(e ==null){
			List<GameScore> list = (List<GameScore>) result.getResults();
			if(list!=null && list.size()>0){
				...
			}else{
				Log.i("smile", "查询成功，无数据返回");
			}
		}else{
			Log.i("smile", "错误码："+e.getErrorCode()+"，错误描述："+e.getMessage());
		}
	}
},"2015-05-12 00:00:00","_User",user.getObjectId(),112.934755,24.52065);
```

**注**
**1、我们更推荐使用占位符语法，理论上会降低 BQL 转换的性能开销；**
**2、最后的可变参数会自动替换查询语句中的问号位置（按照问号的先后出现顺序），有多少个问号，最后的可变参数就应该有多少个；**
**3、同样的，统计查询也支持占位符,只需要将`doSQLQuery`替换成`doStatisticQuery`方法即可；**
**4、只有查询条件`where``limit`子句支持占位符查询，和统计查询有关的`group by`、`order by`、`having`等字句是不支持占位符的。**

例如：
`正确`查询：

```java
//按照游戏名进行分组并获取总得分数大于200的统计信息，同时统计各分组的记录数
String bql = "select sum(playScore),count(*) from GameScore group by game having _sumPlayScore>200";
new BmobQuery<GameScore>().doStatisticQuery(bql,new StatisticQueryListener(){

	@Override
	public void done(Object result, BmobException e) {
		...
	}
});
```

`错误`查询：

```java
String bql = "select sum(playScore),count(*) from GameScore group by ? having ?";
new BmobQuery<GameScore>().doStatisticQuery(bql,new StatisticQueryListener(){

	@Override
	public void done(Object result, BmobException e) {
		...
	}
},"game","_sumPlayScore>200");
```

#### BQL缓存查询

BQL查询同步支持`缓存查询`，只需要调用BmobQuery的`setCachePolicy`方法设置缓存策略即可，`建议使用如下方式进行BQL缓存查询`：

```java
String sql = "select * from GameScore order by playScore,signScore desc";
BmobQuery<GameScore> query = new BmobQuery<GameScore>();
//设置sql语句
query.setSQL(sql);
//判断此查询本地是否存在缓存数据
boolean isCache = query.hasCachedResult(GameScore.class);
if(isCache){
	query.setCachePolicy(CachePolicy.CACHE_ELSE_NETWORK);	// 如果有缓存的话，则设置策略为CACHE_ELSE_NETWORK
}else{
	query.setCachePolicy(CachePolicy.NETWORK_ELSE_CACHE);	// 如果没有缓存的话，则设置策略为NETWORK_ELSE_CACHE
}
query.doSQLQuery(new SQLQueryListener<GameScore>(){

	@Override
	public void done(BmobQueryResult<GameScore> result, BmobException e) {
		if(e ==null){
			Log.i("smile", "查询到："+result.getResults().size()+"符合条件的数据");
		}else{
			Log.i("smile", "错误码："+e.getErrorCode()+"，错误描述："+e.getMessage());
		}
	}
});
```

**注：**
**doSQLQuery目前有三种查询方式进行SQL查询，分别是：**
**1、doSQLQuery（Context context,SQLQueryListener<T> listener)**
**2、doSQLQuery（Context context, String bql, SQLQueryListener<T> listener)----基本BQL查询**
**3、doSQLQuery（Context context, String bql, SQLQueryListener<T> listener,Object... params)----占位符查询**
**只有`第一种查询方式`才能和`query.hasCachedResult(context,class)`或者`query.clearCachedResult(context,class)`并列使用。**
**建议使用`第一种查询方式`进行BQL缓存查询。**

### include用法


在某些情况下，你想在一个查询内获取`Pointer`类型的关联对象。

比如上述示例中，如果希望在查询帖子信息的同时也把该帖子的作者的信息查询出来，可以使用`include`方法

```java
query.include("author");
```

你可以使用`,`号(逗号)操作符来`include并列查询`两个对象

比如，查询评论表的同时将该评论用户的信息和所评论的帖子信息也一并查询出来（因为Comment表有两个`Pointer类型`的字段），那么可以这样做：

```java
query.include("user,post");
```

但不能如下的做法：

```java
query.include("user");
query.include("post");
```

你同时还可以使用 `. `号（英语句号）操作符来进行`include中的内嵌对象查询`


比如，你想在查询评论信息的同时将该评论`Comment`对应的帖子`post`以及该帖子的作者信息`author`一并查询出来，你可以这样做：

```java
query.include("post.author");
```

另外，include还可以指定返回的字段：

```java
query.include("post[likes].author[username|email]");
```
其中，post和author都是Pointer类型，post指向的表只返回likes字段，author指向的表只返回username和email字段。


**注：include的查询对象只能为BmobPointer类型，而不能是BmobRelation类型。**


### 内部查询


如果你在查询某个对象列表时，它们的某个字段是BmobObject类型，并且这个BmobObject匹配一个不同的查询，这种情况下可使用`addWhereMatchesQuery`方法。

请注意，默认的 limit 限制 100 也同样作用在内部查询上。因此如果是大规模的数据查询，你可能需要仔细构造你的查询对象来获取想要的行为。

例如：**查询带有图片的帖子的评论列表**:

```java
BmobQuery<Comment> query = new BmobQuery<Comment>();
BmobQuery<Post> innerQuery = new BmobQuery<Post>();
innerQuery.addWhereExists("image", true);
// 第一个参数为评论表中的帖子字段名post
// 第二个参数为Post字段的表名，也可以直接用"Post"字符串的形式
// 第三个参数为内部查询条件
query.addWhereMatchesQuery("post", "Post", innerQuery);
query.findObjects(new FindListener<Comment>() {

	@Override
	public void done(List<Comment> object,BmobException e) {
		if(e==null){
			Log.i("bmob","成功");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}
});
```

反之，不想匹配某个子查询，你可以使用`addWhereDoesNotMatchQuery`方法。

比如**查询不带图片的帖子的评论列表**：

```java
BmobQuery<Comment> query = new BmobQuery<Comment>();
BmobQuery<Post> innerQuery = new BmobQuery<Post>();
innerQuery.addWhereExists("image", true);
// 第一个参数为评论表中的帖子字段名post
// 第二个参数为Post字段的表名，也可以直接用"Post"字符串的形式
// 第三个参数为内部查询条件
query.addWhereDoesNotMatchQuery("post", "Post", innerQuery);
query.findObjects(new FindListener<Comment>() {
	@Override
	public void done(List<Comment> object,BmobException e) {
		if(e==null){
			Log.i("bmob","成功");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}
});
```

**注：**

`当查询的表为系统表（目前系统表有User、Installation、Role）时，需要带上下划线 `_`。`

比如，你想查询出用户`smile`和`smile`好友的所有帖子，则可以这样：

```sql

BmobQuery<User> innerQuery = new BmobQuery<User>();
String[] friendIds={"ssss","aaaa"};//好友的objectId数组
innerQuery.addWhereContainedIn("objectId", Arrays.asList(friendIds));
//查询帖子
BmobQuery<Post> query = new BmobQuery<Post>();
`query.addWhereMatchesQuery("author", "_User", innerQuery);`
query.findObjects(new FindListener<Post>() {
	@Override
	public void done(List<Post> object,BmobException e) {
		if(e==null){
			Log.i("bmob","成功");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}
});
```

# 5、数组操作
对于数组类型数据，BmobSDK提供了3种操作来原子性地修改一个数组字段的值：

 - **add、addAll** 在一个数组字段的后面添加一些指定的对象(包装在一个数组内)
 - **addUnique、addAllUnique** 只会在原本数组字段中没有这些对象的情形下才会添加入数组，插入数组的位置随机
 - **removeAll** 从一个数组字段的值内移除指定数组中的所有对象

举例子：

```java
public class Person extends BmobObject {
	private List<String> hobbys;		// 爱好-对应服务端Array类型：String类型的集合
	private List<BankCard> cards;	    // 银行卡-对应服务端Array类型:Object类型的集合
	...
	getter、setter方法
}

其中BankCard类结构如下：
public class BankCard{
	private String cardNumber;
	private String bankName;
	public BankCard(String bankName, String cardNumber){
		this.bankName = bankName;
		this.cardNumber = cardNumber;
	}
	...
	getter、setter方法
}
```

### 添加数组数据

给`Person`对象中的数组类型字段添加数据,有以下两种方式：

#### 使用add、addAll添加

```java
Person p = new Person();
p.setObjectId("d32143db92");
//添加String类型的数组
p.add("hobbys", "唱歌");	                            // 添加单个String
//p.addAll("hobbys", Arrays.asList("游泳", "看书"));	// 添加多个String
//添加Object类型的数组
p.add("cards",new BankCard("工行卡", "工行卡账号"))   //添加单个Object
List<BankCard> cards =new ArrayList<BankCard>();
for(int i=0;i<2;i++){
	cards.add(new BankCard("建行卡"+i, "建行卡账号"+i));
}
//p.addAll("cards", cards);						    //添加多个Object值
p.update(new UpdateListener() {

	@Override
	public void done(BmobException e) {
		if(e==null){
			Log.i("bmob","更新成功");
		}else{
			Log.i("bmob","更新失败："+e.getMessage());
		}
	}

});
```

** 注：此类方法不管这些数据之前是否已添加过，都会再次添加。**

#### 使用addUnique、addAllUnique添加

```java
Person p = new Person();
p.setObjectId("d32143db92");
//添加String类型的数组
p.addUnique("hobbys", "唱歌");	                            // 添加单个String
//p.addAllUnique("hobbys", Arrays.asList("游泳", "看书"));	// 添加多个String
//添加Object类型的数组
p.addUnique("cards",new BankCard("工行卡", "工行卡账号"))     //添加单个Object
List<BankCard> cards =new ArrayList<BankCard>();
for(int i=0;i<2;i++){
	cards.add(new BankCard("建行卡"+i, "建行卡账号"+i));
}
//p.addAllUnique("cards", cards);						    //添加多个Object
p.update(new UpdateListener() {

	@Override
	public void done(BmobException e) {
		if(e==null){
			Log.i("bmob","成功");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}

});
```

** 注： 只有在这些数据之前未添加过的情况下才会被添加。**

### 更新数组数据

数组更新比较特殊，自`V3.4.4`版本开始提供`BmobObject`的`setValue`方法来更新数组，例：

```java
Person p2 = new Person();
//更新String类型数组中的值
p2.setValue("hobbys.0","爬山");                             //将hobbys中第一个位置的爱好（上面添加成功的唱歌）修改为爬山
//更新Object类型数组中的某个位置的对象值(0对应集合中第一个元素)
p2.setValue("cards.0", new BankCard("中行", "中行卡号"));    //将cards中第一个位置银行卡修改为指定BankCard对象
//更新Object类型数组中指定对象的指定字段的值
//	p2.setValue("cards.0.bankName", "农行卡");				//将cards中第一个位置的银行卡名称修改为农行卡
//	p2.setValue("cards.1.cardNumber", "农行卡账号");			//将cards中第二个位置的银行卡账号修改为农行卡账号
p2.update(objectId, new UpdateListener() {
	@Override
	public void done(BmobException e) {
		if(e==null){
			Log.i("bmob","成功");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}
});
```

### 删除数组数据

同理我们也可以使用removeAll从数组字段中移除某些值：

```java
Person p = new Person();
p.removeAll("hobby", Arrays.asList("阅读","唱歌","游泳"));
p.update(new UpdateListener() {

	@Override
	public void done(BmobException e) {
		if(e==null){
			Log.i("bmob","成功");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}
});
```

### 查询数组数据

对于字段类型为数组的情况，可以以数组字段中包含有xxx的数据为条件进行查询：

```java
BmobQuery<Person> query = new BmobQuery<Person>();
String [] hobby = {"阅读","唱歌"};
query.addWhereContainsAll("hobby", Arrays.asList(hobby));
query.findObjects(new FindListener<Person>() {

	@Override
	public void done(List<Person> object,BmobException e) {
		if(e==null){
			Log.i("bmob","查询成功：共" + object.size() + "条数据。");
		}else{
			Log.i("bmob","失败："+e.getMessage());
		}
	}

});
```

## 类名和表名的关系

- Bmob官方推荐类名和表名完全一致的映射使用方式， 即如，上面的GameScore类，它在后台对应的表名也是GameScore（区分大小写）。
- 如果你希望表名和类名并不相同，如表名为T_a_b，而类名还是GameScore，那么你可以使用BmobObject提供的setTableName("表名")的方法，

示例代码如下：

```java
//这时候实际操作的表是T_a_b
public class GameScore extends BmobObject{
	private String playerName;
	private Integer score;
	private Boolean isPay;
    private BmobFile pic;

	public GameScore() {
		this.setTableName("T_a_b");
	}

	public String getPlayerName() {
		return playerName;
	}
	//其他方法，见上面的代码
}
```
当然了，除了在构造函数中直接调用setTableName方法之外，你还可以在GameScore的实例中动态调用setTableName方法。

### 查询自定义表名的数据

如果您使用了setTableName方法来自定义表名，那么在对该表进行数据查询的时候必须使用以下方法。`需要注意的是查询的结果是JSONArray,需要自行解析JSONArray中的数据`。

```java
/**
 * 查询数据
 */
public void queryData(){
	BmobQuery query =new BmobQuery("Person");
	query.addWhereEqualTo("age", 25);
	query.setLimit(2);
	query.order("createdAt");
	//v3.5.0版本提供`findObjectsByTable`方法查询自定义表名的数据
	query.findObjectsByTable(new QueryListener<JSONArray>() {
		@Override
		public void done(JSONArray ary, BmobException e) {
			if(e==null){
				Log.i("bmob","查询成功："+ary.toString());
			}else{
				Log.i("bmob","失败："+e.getMessage()+","+e.getErrorCode());
			}
		}
	});
}
```

**自定义表名情况下的更新、删除数据和普通的更新、删除数据方式一样，没有变化。为方便大家了解学习，我们提供了一个关于自定义表名情况下增删改查数据的Demo，下载地址是：[https://github.com/bmob/bmob-android-demo-dynamic-tablename](https://github.com/bmob/bmob-android-demo-dynamic-tablename)。**



**自`V3.4.4`版本开始，SDK提供了另一种方法来更新数据，通过调用`Bmobobject`类中的`setValue（key，value）`方法，只需要传入key及想要更新的值即可**

举例，说明如下：

```java
public class Person extends BmobObject {
	private BmobUser user;	//BmobObject类型
	private BankCard cards;	//Object类型
	private Integer age;	//Integer类型
	private Boolean gender; //Boolean类型
	...
	getter、setter方法
}

其中BankCard类结构如下：

public class BankCard{
	private String cardNumber;
	private String bankName;
	public BankCard(String bankName, String cardNumber){
		this.bankName = bankName;
		this.cardNumber = cardNumber;
	}
	...
	getter、setter方法
}

```

```java
Person p2=new Person();
//更新BmobObject的值
//	p2.setValue("user", BmobUser.getCurrentUser(this, MyUser.class));
//更新Object对象
p2.setValue("bankCard",new BankCard("农行", "农行账号"));
//更新Object对象的值
//p2.setValue("bankCard.bankName","建行");
//更新Integer类型
//p2.setValue("age",11);
//更新Boolean类型
//p2.setValue("gender", true);
p2.update(objectId, new UpdateListener() {

	@Override
	public void done(BmobException e) {
		if(e==null){
			Log.i("bmob","更新成功");
		}else{
			Log.i("bmob","更新失败："+e.getMessage()+","+e.getErrorCode());
		}
	}

});

```

**注意：修改数据只能通过objectId来修改，目前不提供查询条件方式的修改方法。**

### 原子计数器

很多应用可能会有计数器功能的需求，比如文章点赞的功能，如果大量用户并发操作，用普通的更新方法操作的话，会存在数据不一致的情况。

为此，Bmob提供了原子计数器来保证原子性的修改某一**数值字段**的值。注意：原子计数器只能对应用于Web后台的Number类型的字段，即JavaBeans数据对象中的Integer对象类型（**不要用int类型**）。

```java
gameScore.increment("score"); // 分数递增1
gameScore.update(updateListener);
```

您还可以通过`increment(key, amount)`方法来递增或递减任意幅度的数字

```java
gameScore.increment("score", 5); // 分数递增5
//gameScore.increment("score", -5); // 分数递减5
gameScore.update(updateListener);
```




### 删除字段的值

你可以在一个对象中删除一个字段的值，通过`remove`操作：

```java
GameScore gameScore = new GameScore();
gameScore.setObjectId("dd8e6aff28");
gameScore.remove("score");	// 删除GameScore对象中的score字段
gameScore.update(new UpdateListener() {
	@Override
	public void done(BmobException e) {
		if(e==null){
			Log.i("bmob","成功");
		}else{
			Log.i("bmob","失败："+e.getMessage()+","+e.getErrorCode());
		}
	}
});
```














# 7、图文消息

2017年下半年开始，后端云提供了素材管理模块，控制台文件浏览功能合并到了该模块下；

![](image/Unl4dwy.png)

### 适用场景
1. 如果您的应用是需要展示很多图文消息或文章，可以用这里编辑来实现富文本信息的存储和编辑管理；
2. 以往上传文件缺少了一些关联信息如文件描述之类的需要额外建表，来实现文件和描述信息的关联，这里可以一并解决；
### 使用方法
1. 后端控制台新建`图文信息`并编辑后会新增一个_Article表，表中的关键字段有url,title,content，分别代表图文信息网页的url地址,标题和网页源码，也能实时编辑。
2. 客户端的使用，可以查询_Article表，既可以拿到url用webview组件加载，也可以用Android SDK中的TextView结合Html类解析html标签并展示。


```
/**
 * 查询图文消息
 */
private void queryArticle() {
    BmobQuery<BmobArticle> bmobArticleBmobQuery = new BmobQuery<>();
    bmobArticleBmobQuery.findObjects(new FindListener<BmobArticle>() {
        @Override
        public void done(List<BmobArticle> object, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnQueryArticle, "查询成功：" + object.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Snackbar.make(mBtnQueryArticle, "查询失败：" + e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```


# 8、文件管理

`BmobFile`可以让你的应用程序将文件存储到服务器中，常见的文件类型都可以实现存储：比如图像文件、影像文件、音乐文件和任何其他二进制数据。

**注：**

1、以下均为SDK对文件进行操作的方法，如果你想在Web端对文件进行操作，请查看我们的[帮助文档](http://doc.bmobapp.com/other/common_problem/)中的`如何在Web后台上传文件`解答。

2、自 `BmobSDKv3.4.6` 开始，文件服务需要注意以下几个方面：

- **SDK内部集成CDN文件服务，删除`BmobProFile`的相关代码，并不再提供新旧文件管理的功能，但上传的方法名不变**；

- **新增了文件下载`(download)`和批量删除CDN文件`(deleteBatch)`的方法**；

- **2016年7月,旧版SDK中的新旧文件管理的上传方法将停止服务，之前通过旧版SDK中的新旧文件管理上传的文件仍可下载，请大家及时更新SDK**；

- **之前使用了`BmobProFile中`的`upload`方法上传的文件，开发者可以直接在文件的url地址后面增加："?t=2&a="+ 你的accessKey，那么拼接后的文件是可以直接用来访问并下载的。**；

```xml
	举个例子：

	如果之前通过新版文件管理的上传方法得到的文件url地址：
	http://newfile.codenow.cn:8080/a272a1aac5274f7085f140de9db94635.png，

	那么签名后的可访问的文件地址为：
	http://newfile.codenow.cn:8080/a272a1aac5274f7085f140de9db94635.png?t=2&a=你的accessKey。
```
- **无法查看accessKey**。因为已经废除新旧文件管理功能，所以在开发者管理后台的设置-->应用密钥中已无法查看accessKey，而之前开发者所使用的accessKey继续有效。

3、CDN文件服务需要`okhttp-2.4.0、okio-1.4.0`及`WAKE_LOCK`权限，请导入okhttp相关jar包并在`AndroidManifest.xml`类的`manifest`标签下添加如下权限，否则会造成调用上传/下载文件的方法无反应。

```xml
	<!--保持CPU 运转，屏幕和键盘灯有可能是关闭的,用于文件上传和下载 -->
	<uses-permission android:name="android.permission.WAKE_LOCK" />
```

### 创建文件对象

创建文件对象方式如下：

```java
String picPath = "sdcard/temp.jpg";
BmobFile bmobFile = new BmobFile(new File(picPath));
```

### 上传单一文件

文件分片上传的方法非常简单，示例代码如下：

```java
String picPath = "sdcard/temp.jpg";
BmobFile bmobFile = new BmobFile(new File(picPath));
bmobFile.uploadblock(new UploadFileListener() {

	@Override
	public void done(BmobException e) {
		if(e==null){
			//bmobFile.getFileUrl()--返回的上传文件的完整地址
			toast("上传文件成功:" + bmobFile.getFileUrl());
		}else{
			toast("上传文件失败：" + e.getMessage());
		}

	}

	@Override
	public void onProgress(Integer value) {
		// 返回的上传进度（百分比）
	}
});
```


#### 设置文件分片上传时每片大小

自`BmobSDKv3.4.6`开始,新增`BmobConfig`类，允许开发者设置`查询超时时间`及`文件分片上传时的每片大小`。建议在`Application`类的`onCreate`方法中调用。

示例代码如下:

```java

public class BmobApplication extends Application {

	@Override
	public void onCreate() {
		super.onCreate();
		//设置BmobConfig
		BmobConfig config =new BmobConfig.Builder()
		//请求超时时间（单位为秒）：默认15s
		.setConnectTimeout(30)
		//文件分片上传时每片的大小（单位字节），默认512*1024
		.setBlockSize(500*1024)
		.build();
		Bmob.getInstance().initConfig(config);
	}
}

```

### 批量上传文件

自`BmobSDKv3.2.7`开始,新增批量上传文件的方法；

自`BmobSDKv3.4.6`开始,文件批量上传的静态方法由`Bmob`转移至`BmobFile`类,建议调用`BmobFile.uploadBatch`方法。

示例代码如下：

```java
//详细示例可查看BmobExample工程中BmobFileActivity类
String filePath_mp3 = "/mnt/sdcard/testbmob/test1.png";
String filePath_lrc = "/mnt/sdcard/testbmob/test2.png";
final String[] filePaths = new String[2];
filePaths[0] = filePath_mp3;
filePaths[1] = filePath_lrc;
BmobFile.uploadBatch(filePaths, new UploadBatchListener() {

	@Override
	public void onSuccess(List<BmobFile> files,List<String> urls) {
		//1、files-上传完成后的BmobFile集合，是为了方便大家对其上传后的数据进行操作，例如你可以将该文件保存到表中
		//2、urls-上传文件的完整url地址
		if(urls.size()==filePaths.length){//如果数量相等，则代表文件全部上传完成
			//do something
		}
	}

	@Override
	public void onError(int statuscode, String errormsg) {
		ShowToast("错误码"+statuscode +",错误描述："+errormsg);
	}

	@Override
	public void onProgress(int curIndex, int curPercent, int total,int totalPercent) {
		//1、curIndex--表示当前第几个文件正在上传
		//2、curPercent--表示当前上传文件的进度值（百分比）
		//3、total--表示总的上传文件数
		//4、totalPercent--表示总的上传进度（百分比）
	}
});
```

**注：**

**1、有多少个文件上传，onSuccess方法就会执行多少次;**

**2、通过onSuccess回调方法中的files或urls集合的大小与上传的总文件个数比较，如果一样，则表示全部文件上传成功。**


### 下载文件

自`BmobSDKv3.4.6`版本,SDK提供了文件的下载方法`download`，并且允许开发者设置下载文件的存储路径。

**注：下载方法并不局限于下载通过BmobSDK上传的文件，也就是说只要提供一个文件url地址，也可以调用下载方法的。**

下载文件的步骤：

1、先获取BmobFile对象实例，可以是查询数据时返回的BmobFile，也可以自行构建BmobFile对象：

- 通过查询数据时返回的BmobFile，示例代码如下：

```java

bmobQuery.findObjects(new FindListener<GameScore>() {
	@Override
	public void done(List<GameScore> object,BmobException e) {
		if(e==null){
			for (GameScore gameScore : object) {
				BmobFile bmobfile = gameScore.getPic();
		       if(file!= null){
					//调用bmobfile.download方法
	           }
			}
		}else{
			toast("查询失败："+e.getMessage());
		}
	}
});

```

- 通过如下构造方法构造BmobFile对象：

需求：如果你想下载一个远程图片地址，那么就需要使用下面的构造方法构造一个BmobFile对象（其中group可为空）

```java
/**
 * @param fileName 文件名(必填)
 * @param group 组名（选填）
 * @param url  完整url地址（必填）
 * 注：必须要有文件名和文件的完整url地址，group可为空
 */
public BmobFile(String fileName,String group,String url){
	this.filename = fileName;
	this.group=group;
	this.url = url;
}

```

示例代码如下：

```java

BmobFile bmobfile =new BmobFile("xxx.png","","http://bmob-cdn-2.b0.upaiyun.com/2016/04/12/58eeed852a7542cb964600c6cc0cd2d6.png")；

```

2、然后调用`bmobfile.download`方法下载文件:

有两种下载方法：

 - `download(DownloadFileListener listener)`：此方法会将文件下载到当前应用的默认缓存目录中，以getFilename()得到的值为文件名

 - `download(File savePath, DownloadFileListener listener)`：此方法允许开发者指定文件存储目录和文件名


示例代码如下：

```java
private void downloadFile(BmobFile file){
	//允许设置下载文件的存储路径，默认下载文件的目录为：context.getApplicationContext().getCacheDir()+"/bmob/"
	File saveFile = new File(Environment.getExternalStorageDirectory(), file.getFilename());
	file.download(saveFile, new DownloadFileListener() {

		@Override
		public void onStart() {
			toast("开始下载...");
		}

		@Override
		public void done(String savePath,BmobException e) {
			if(e==null){
				toast("下载成功,保存路径:"+savePath);
			}else{
				toast("下载失败："+e.getErrorCode()+","+e.getMessage());
			}
		}

		@Override
		public void onProgress(Integer value, long newworkSpeed) {
			Log.i("bmob","下载进度："+value+","+newworkSpeed);
		}

	});
}


```
### 删除文件

`BmobSDKv3.4.6`中删除文件的接口，`只能删除通过CDN文件服务（v3.4.6开始采用CDN文件服务）上传的文件`。不兼容之前的新旧文件管理，但使用方法不变。

示例代码如下：

```java
BmobFile file = new BmobFile();
file.setUrl(url);//此url是上传文件成功之后通过bmobFile.getUrl()方法获取的。
file.delete(new UpdateListener() {

	@Override
	public void done(BmobException e) {
		if(e==null){
			toast("文件删除成功");
		}else{
			toast("文件删除失败："+e.getErrorCode()+","+e.getMessage());
		}
	}
});

```

### 批量删除文件

自 `BmobSDKv3.4.6` 版本，SDK提供了文件的批量删除接口`deleteBatch，且只能删除通过CDN文件服务（v3.4.6开始采用CDN文件服务）上传的文件`。

示例代码如下：

```java
//此url必须是上传文件成功之后通过bmobFile.getUrl()方法获取的。
String[] urls =new String[]{url};
BmobFile.deleteBatch(urls, new DeleteBatchListener() {

	@Override
	public void done(String[] failUrls, BmobException e) {
		if(e==null){
			toast("全部删除成功");
		}else{
			if(failUrls!=null){
				toast("删除失败个数："+failUrls.length+","+e.toString());
			}else{
				toast("全部文件删除失败："+e.getErrorCode()+","+e.toString());
			}
		}
	}
});

```
为方便大家理解文件服务的使用，Bmob提供了一个文件上传的案例和源码，大家可以到[示例和教程中查看和下载](http://doc.bmobapp.com/data/android/example/)。

**注：**

**1、文件的批量上传是BmobSDK_v3.2.7版本才提供的功能，如需使用，请更新版本;**
**2、文件的下载和批量删除是BmobSDK_v3.4.6才提供的功能，如需使用，请更新版本。**

# 9、数据监听

**数据监听按需收费，请开发者到【应用设置-套餐升级-数据监听】中开通此功能**

### 开始连接
```java
RealTimeDataManager.getInstance().start(new RealTimeDataListener() {
            @Override
            public void onConnectCompleted(Client client, Exception e) {
                if (e == null) {
                    System.out.println("数据监听：已连接");
                    // 监听表
                    client.subTableUpdate(tableName);
                    // 监听表中的某行
                    // client.subRowUpdate(tableName,objectId);
                    Toast.makeText(RealTimeDataActivity.this, "已连接", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(RealTimeDataActivity.this, "连接出错：" + e.getMessage() , Toast.LENGTH_SHORT).show();
                }
            }
            @Override
            public void onDataChange(Client client, JSONObject jsonObject) {
                //更新动作
                String action = jsonObject.optString("action");
                if (action.equals(Client.ACTION_UPDATE_TABLE)) {
                    //更新内容
                    JSONObject data = jsonObject.optJSONObject("data");
                    Toast.makeText(RealTimeDataActivity.this, "监听到更新：" + data.optString("name") + "-" + data.optString("content"), Toast.LENGTH_SHORT).show();
                } else if (Client.ACTION_UPDATE_ROW.equals(action)) {
                    // 监听的行更新数据
                    JSONObject data = jsonObject.optJSONObject("data");
                }
            }
            @Override
            public void onDisconnectCompleted(Client client) {
                System.out.println(client.toString()+"已断开");
            }
        });
```

`start`方法中的`RealTimeDataListener`参数用于监听连接成功和数据变化的回调。当有数据变化时会通过onDataChange回调方法反馈到客户端。开发者只需要处理得到的data就可以了。

**注：**

**1、监听器不支持UI线程，在监听回调中请不要直接操作UI；**

**2、如果你要监听User、Installation等系统表的话，表名前需要加上“_”，例如：_User**

# 10、数据安全

## ACL和角色

数据安全是软件系统中最重要的组成部分，为了更好的保护应用数据的安全，Bmob在软件架构层面提供了应用层次、表层次、ACL（Access Control List：访问控制列表）、角色管理（Role）四种不同粒度的权限控制的方式，确保用户数据的安全（详细请查看[Bmob数据与安全页面](http://doc.bmobapp.com/other/data_safety/)，了解Bmob如何保护数据安全）。

其中，最灵活的方法是通过ACL和角色，它的思路是每一条数据有一个用户和角色的列表，以及这些用户和角色拥有什么样的许可权限。

大多数应用程序需要对不同的数据进行灵活的访问和控制，这就可以使用Bmob提供的ACL模式来实现。例如：

- 对于私有数据，读写权限可以只局限于数据的所有者。
- 对于一个论坛，会员和版主有写的权限，一般的游客只有读的权限。
- 对于日志数据只有开发者才能够访问，ACL可以拒绝所有的访问权限。
- 属于一个被授权的用户或者开发者所创建的数据，可以有公共的读的权限，但是写入权限仅限于管理者角色。
- 一个用户发送给另外一个用户的消息，可以只给这些用户赋予读写的权限。



BmobACL和BmobUser的权限设置：

|方法|解释|
|----|----|
|setReadAccess(String userId, boolean allowed)|设置哪个用户是否可读|
|setReadAccess(BmobUser user, boolean allowed)|设置哪个用户是否可读|
|setWriteAccess(String userId, boolean allowed)|设置哪个用户是否可写|
|setWriteAccess(BmobUser user, boolean allowed)|设置哪个用户是否可写|

BmobACL和BmobRole的权限设置：

|方法|解释|
|----|----|
|setRoleReadAccess(String roleName, boolean allowed)|设置哪种角色是否可读|
|setRoleReadAccess(BmobRole role, boolean allowed)|设置哪种角色是否可读|
|setRoleWriteAccess(String roleName, boolean allowed)|设置哪种角色是否可写|
|setRoleWriteAccess(BmobRole role, boolean allowed)|设置哪种角色是否可写|

BmobACL和所有用户的权限设置：

|方法|解释|
|----|----|
|setPublicReadAccess(boolean allowed)|设置所有用户是否可读|
|setPublicWriteAccess(boolean allowed)|设置所有用户是否可读|

### 默认访问权限
在没有显示指定的情况下，每一个BmobObject(表)中的ACL(列)属性的默认值是所有人可读可写的。在客户端想要修改这个权限设置，只需要简单调用BmobACL的setPublicReadAccess方法和setPublicWriteAccess方法，即：

```java
/**
 * 设置发布的帖子对所有用户的访问控制权限
 */
private void publicAcl() {
    User user = BmobUser.getCurrentUser(User.class);
    if (user == null) {
        Snackbar.make(mBtnAclPublic, "请先登录", Snackbar.LENGTH_LONG).show();
    } else {
        Post post = new Post();
        post.setAuthor(user);
        post.setContent("content" + System.currentTimeMillis());
        post.setTitle("title" + System.currentTimeMillis());
        BmobACL bmobACL = new BmobACL();
        //设置此帖子为所有用户不可写
        bmobACL.setPublicWriteAccess(false);
        //设置此帖子为所有用户可读
        bmobACL.setPublicReadAccess(true);
        post.setACL(bmobACL);
        post.save(new SaveListener<String>() {
            @Override
            public void done(String s, BmobException e) {
                if (e == null) {
                    Snackbar.make(mBtnAclPublic, "发布帖子成功", Snackbar.LENGTH_LONG).show();
                } else {
                    Snackbar.make(mBtnAclPublic, e.getMessage(), Snackbar.LENGTH_LONG).show();
                }
            }
        });
    }

}


```

注意：可读可写是默认的权限，不需要写额外的代码。

### 指定用户的访问权限
假如你想实现一个分享日志类的应用时，这可能会需要针对不同的日志设定不同的访问权限。比如，公开的日志，发布者有更改和修改的权限，其他用户只有读的权限，那么可用如下代码实现：

```java
/**
 * 设置发布的帖子对当前用户的访问控制权限
 */
private void userAcl() {
    User user = BmobUser.getCurrentUser(User.class);
    if (user == null) {
        Snackbar.make(mBtnAclPublic, "请先登录", Snackbar.LENGTH_LONG).show();
    } else {
        Post post = new Post();
        post.setAuthor(user);
        post.setContent("content" + System.currentTimeMillis());
        post.setTitle("title" + System.currentTimeMillis());
        BmobACL bmobACL = new BmobACL();
        //设置此帖子为当前用户可写
        bmobACL.setReadAccess(user, true);
        //设置此帖子为所有用户可读
        bmobACL.setPublicReadAccess(true);
        post.setACL(bmobACL);
        post.save(new SaveListener<String>() {
            @Override
            public void done(String s, BmobException e) {
                if (e == null) {
                    Snackbar.make(mBtnAclPublic, "发布帖子成功", Snackbar.LENGTH_LONG).show();
                } else {
                    Snackbar.make(mBtnAclPublic, e.getMessage(), Snackbar.LENGTH_LONG).show();
                }
            }
        });
    }
}



```
有时，用户想发表一篇不公开的日志，这种情况只有发布者才对这篇日志拥有读写权限，相应的代码如下：
```java
Blog blog = new Blog();
blog.setTitle("一个人的秘密");
blog.setContent("这是blog的具体内容");

BmobACL acl = new BmobACL();  //创建ACL对象
acl.setReadAccess(BmobUser.getCurrentUser(), true); // 设置当前用户可写的权限
acl.setWriteAccess(BmobUser.getCurrentUser(), true); // 设置当前用户可写的权限

blog.setACL(acl);    //设置这条数据的ACL信息
blog.save(new SaveListener<String>() {

	@Override
	public void done(String objectId, BmobException e) {
		...
	}
});
```

### 角色管理
上面的指定用户访问权限虽然很方便，但是对于有些应用可能会有一定的局限性。比如一家公司的工资系统，员工和公司的出纳们只拥有工资的读权限，而公司的人事和老板才拥有全部的读写权限。要实现这种功能，你也可以通过设置每个用户的ACL权限来实现，如下：
```java
/**
 * 设置发布的帖子对某种角色的访问控制权限
 */
private void roleAcl() {
    User user = BmobUser.getCurrentUser(User.class);
    if (user == null) {
        Snackbar.make(mBtnAclPublic, "请先登录", Snackbar.LENGTH_LONG).show();
    } else {
        Post post = new Post();
        post.setAuthor(user);
        post.setContent("content" + System.currentTimeMillis());
        post.setTitle("title" + System.currentTimeMillis());
        BmobACL bmobACL = new BmobACL();
        //设置此帖子为当前用户可写
        bmobACL.setWriteAccess(user, true);
        //设置此帖子为某种角色可读
        bmobACL.setRoleReadAccess("female", true);
        post.setACL(bmobACL);
        post.save(new SaveListener<String>() {
            @Override
            public void done(String s, BmobException e) {
                if (e == null) {
                    Snackbar.make(mBtnAclPublic, "发布帖子成功", Snackbar.LENGTH_LONG).show();
                } else {
                    Snackbar.make(mBtnAclPublic, e.getMessage(), Snackbar.LENGTH_LONG).show();
                }
            }
        });
    }
}

```


### 角色之间的从属关系
下面我们来说一下角色与角色之间的从属关系。用一个例子来说明下：一个互联网企业有移动部门，部门中有不同的小组，如Android开发组和IOS开发组。每个小组只拥有自己小组的代码读写权限，但这两个小组同时拥有核心库代码的读权限。
```java
/**
 * 查询某角色是否存在
 *
 * @param roleName
 */
private void queryRole(final String roleName) {
    BmobQuery<BmobRole> bmobRoleBmobQuery = new BmobQuery<>();
    bmobRoleBmobQuery.addWhereEqualTo("name", roleName);
    bmobRoleBmobQuery.findObjects(new FindListener<BmobRole>() {
        @Override
        public void done(List<BmobRole> list, BmobException e) {
            if (e == null) {
                if (list.size() > 0) {
                    //已存在该角色
                    addUser2Role(list.get(0));
                } else {
                    //不存在该角色
                    BmobRole bmobRole = new BmobRole(roleName);
                    saveRoleAndAddUser2Role(bmobRole);
                }
            } else {
                Snackbar.make(mBtnQueryRole, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });

}
```

```java
/**
 * 保存某个角色并保存用户到该角色中
 *
 * @param bmobRole
 */
private void saveRoleAndAddUser2Role(BmobRole bmobRole) {

    User user = BmobUser.getCurrentUser(User.class);
    if (user == null) {
        Snackbar.make(mBtnQueryRole, "请先登录", Snackbar.LENGTH_LONG).show();
    } else {
        bmobRole.getUsers().add(user);
        bmobRole.save(new SaveListener<String>() {
            @Override
            public void done(String s, BmobException e) {
                if (e == null) {
                    Toast.makeText(BmobRoleActivity.this, "角色用户添加成功", Toast.LENGTH_SHORT).show();
                } else {
                    Snackbar.make(mBtnQueryRole, e.getMessage(), Snackbar.LENGTH_LONG).show();
                }
            }
        });
    }

}
```
```java
/**
 * 添加用户到某个角色中
 *
 * @param bmobRole
 */
private void addUser2Role(BmobRole bmobRole) {
    User user = BmobUser.getCurrentUser(User.class);
    if (user == null) {
        Snackbar.make(mBtnQueryRole, "请先登录", Snackbar.LENGTH_LONG).show();
    } else {
        bmobRole.getUsers().add(user);
        bmobRole.update(new UpdateListener() {
            @Override
            public void done(BmobException e) {
                if (e == null) {
                    Toast.makeText(BmobRoleActivity.this, "角色用户添加成功", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(BmobRoleActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}
```
```java
/**
 * 把用户从某个角色中移除
 *
 * @param bmobRole
 */
private void removeUserFromRole(BmobRole bmobRole) {
    User user = BmobUser.getCurrentUser(User.class);
    if (user == null) {
        Snackbar.make(mBtnQueryRole, "请先登录", Snackbar.LENGTH_LONG).show();
    } else {
        bmobRole.getUsers().remove(user);
        bmobRole.update(new UpdateListener() {
            @Override
            public void done(BmobException e) {
                if (e == null) {
                    Toast.makeText(BmobRoleActivity.this, "角色用户添加成功", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(BmobRoleActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
                }
            }
        });
    }
}
```


### ACL案例源码

我们为大家提供一个ACL相关的案例源码，大家可以点击下载：[https://github.com/bmob/bmob-android-demo-acl](https://github.com/bmob/bmob-android-demo-acl)
## 应用安全

请大家在使用Bmob开发应用程序之前，仔细阅读[数据与安全](http://doc.bmobapp.com/other/data_safety/)的文档。
# 11、地理位置

Bmob允许用户根据地球的经度和纬度坐标进行基于地理位置的信息查询。通过在BmobObject的查询中添加一个BmobGeoPoint的对象查询，你就可以实现轻松查找出离当前用户最接近的信息或地点的功能。


```java
public class User extends BmobUser {
    /**
     * 用户当前位置
     */
    private BmobGeoPoint address;
}
```

### 创建地理位置对象

首先需要创建一个BmobGeoPoint对象。例如，创建一个东经116.39727786183357度，北纬39.913768382429105度的BmobGeoPoint对象：
```java
/**
 * 更新当前用户地理位置信息
 */
private void updateLocation() {
    //TODO 在实际应用中，此处利用实时定位替换为真实经纬度数据
    final BmobGeoPoint bmobGeoPoint = new BmobGeoPoint(116.39727786183357, 39.913768382429105);
    final User user = BmobUser.getCurrentUser(User.class);
    user.setAddress(bmobGeoPoint);
    user.update(new UpdateListener() {
        @Override
        public void done(BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnUpdateLocation, "更新成功：" + user.getAddress().getLatitude() + "-" + user.getAddress().getLongitude(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnUpdateLocation, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

### 查询地理位置信息


```java
/**
 * 获取当前用户的地理位置信息
 */
private void getLocation() {
    User user = BmobUser.getCurrentUser(User.class);
    if (user != null) {
        Snackbar.make(mBtnUpdateLocation, "查询成功：" + user.getAddress().getLatitude() + "-" + user.getAddress().getLongitude(), Snackbar.LENGTH_LONG).show();
    } else {
        Snackbar.make(mBtnUpdateLocation, "请先登录", Snackbar.LENGTH_LONG).show();
    }
}
```

```java
/**
 * 查询最接近某个坐标的用户
 */
private void queryNear() {
    BmobQuery<User> query = new BmobQuery<>();
    BmobGeoPoint location = new BmobGeoPoint(112.934755, 24.52065);
    query.addWhereNear("address", location);
    query.setLimit(10);
    query.findObjects(new FindListener<User>() {

        @Override
        public void done(List<User> users, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnUpdateLocation, "查询成功：" + users.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnUpdateLocation, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```
```java
/**
 * 查询指定坐标指定半径内的用户
 */
private void queryWithinRadians() {
    BmobQuery<User> query = new BmobQuery<>();
    BmobGeoPoint address = new BmobGeoPoint(112.934755, 24.52065);
    query.addWhereWithinRadians("address", address, 10.0);
    query.findObjects(new FindListener<User>() {

        @Override
        public void done(List<User> users, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnUpdateLocation, "查询成功：" + users.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnUpdateLocation, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```
```java
/**
 * 查询指定坐标指定英里范围内的用户
 */
private void queryWithinMiles() {
    BmobQuery<User> query = new BmobQuery<>();
    BmobGeoPoint address = new BmobGeoPoint(112.934755, 24.52065);
    query.addWhereWithinMiles("address", address, 10.0);
    query.findObjects(new FindListener<User>() {

        @Override
        public void done(List<User> users, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnUpdateLocation, "查询成功：" + users.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnUpdateLocation, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```java
/**
 * 查询指定坐标指定公里范围内的用户
 */
private void queryWithinKilometers() {
    BmobQuery<User> query = new BmobQuery<>();
    BmobGeoPoint address = new BmobGeoPoint(112.934755, 24.52065);
    query.addWhereWithinKilometers("address", address, 10);
    query.findObjects(new FindListener<User>() {

        @Override
        public void done(List<User> users, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnUpdateLocation, "查询成功：" + users.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnUpdateLocation, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

```java
/**
 * 查询矩形范围内的用户
 */
private void queryBox() {
    BmobQuery<User> query = new BmobQuery<>();
    //TODO 西南点，矩形的左下角坐标
    BmobGeoPoint southwestOfSF = new BmobGeoPoint(112.934755, 24.52065);
    //TODO 东别点，矩形的右上角坐标
    BmobGeoPoint northeastOfSF = new BmobGeoPoint(116.627623, 40.143687);
    query.addWhereWithinGeoBox("address", southwestOfSF, northeastOfSF);
    query.findObjects(new FindListener<User>() {

        @Override
        public void done(List<User> users, BmobException e) {
            if (e == null) {
                Snackbar.make(mBtnUpdateLocation, "查询成功：" + users.size(), Snackbar.LENGTH_LONG).show();
            } else {
                Log.e("BMOB", e.toString());
                Snackbar.make(mBtnUpdateLocation, e.getMessage(), Snackbar.LENGTH_LONG).show();
            }
        }
    });
}
```

**注意事项**

1. **每个BmobObject数据对象中只能有一个BmobGeoPoint对象**。

2. 地理位置的点不能超过规定的范围。`纬度的范围`应该是在`-90.0到90.0`之间。`经度的范围`应该是在`-180.0到180.0`之间。如果您添加的经纬度超出了以上范围，将导致程序错误。






# 12、其他功能

### 获取服务器时间

在Bmob对象中提供了一个静态方法，用于获取服务器时间。
```java
Bmob.getServerTime(new QueryListener<Long>() {

	@Override
	public void done(long time,BmobException e) {
		if(e==null){
			SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
			String times = formatter.format(new Date(time * 1000L));
			Log.i("bmob","当前服务器时间为:" + times);
		}else{
			Log.i("bmob","获取服务器时间失败:" + e.getMessage());
		}
	}

});
```

### 自动更新组件

Bmob为大家提供了应用的自动更新组件，使用这个组件可以快速方便实现应用的自动升级功能。
详细的使用操作可以参考文档：[自动更新组件文档](http://doc.bmobapp.com/data/android/auto_update/)

### 表结构

自`V3.4.2`版本开始，SDK提供了`获取表结构信息`方法,具体示例如下：

#### 获取特定表的结构

```java
Bmob.getTableSchema("待查询的表名", new QueryListener<BmobTableSchema>() {

	@Override
	public void done(BmobTableSchema schema, BmobException ex) {
		if(ex==null){
			Log.i("bmob", "获取指定表的表结构信息成功："+schema.getClassName()+"-"+schema.getFields().toString());
		}else{
			Log.i("bmob", "获取指定表的表结构信息失败:" + ex.getLocalizedMessage()+"("+ex.getErrorCode()+")");
		}
	}
});

```

#### 获取所有表的结构
```java

Bmob.getAllTableSchema(context, new QueryListListener<BmobTableSchema>() {

	@Override
	public void done(List<BmobTableSchema> schemas, BmobException ex) {
		if(ex==null && schemas!=null && schemas.size()>0){
			Log.i("bmob", "获取所有表结构信息成功");
		}else{
			Log.i("bmob","获取所有表结构信息失败："+ex.getLocalizedMessage()+"("+ex.getErrorCode()+")");
		}
	}
});

```

#### 返回数据说明
注：`BmobTableSchema`参数说明：

其中

`className`：表示表名

`fields`   ： 是Map<String, Map<String,Object>>类型，里面包含了对应表的所有列的属性，

其fields内部结构如下：

>{"列1":Map,"列2":Map, ...}

而Map的结构为：

>{"type":"typeName","targetClass":"tableName"}

其中 `type` 指的是该列的类型， 而 `targetClass` 指的是指向的表名，只有在 type 为 Pointer 或者 Relation 时才有值。

具体json格式如下,仅供参考：

```java
 {
	className: "Post",
	fields: {
	  ACL: {
	    type: "Object"
	  },
	  author: {
	    targetClass: "_User",
	    type: "Pointer"
	  },
	  content: {
	    type: "String"
	  },
	  createdAt: {
	    type: "Date"
	  },
	  objectId: {
	    type: "String"
	  },
	  updatedAt: {
	    type: "Date"
	  }
	}
 }

```

# 13、SDK错误码列表

Android SDK的错误码都是以`9`开头的，其他错误码请点击查看：[错误码文档](http://doc.bmobapp.com/other/error_code/)。


|错误码|内容|含义|
|-----|----|----|
|9001|AppKey is Null, Please initialize BmobSDK.|Application Id为空，请初始化。|
|9002|Parse data error|解析返回数据出错|
|9003|upload file error|上传文件出错|
|9004|upload file failure|文件上传失败|
|9005|A batch operation can not be more than 50|批量操作只支持最多50条|
|9006|objectId is null|objectId为空|
|9007|BmobFile File size must be less than 10M.|文件大小超过10M|
|9008|BmobFile File does not exist.|上传文件不存在|
|9009|No cache data.|没有缓存数据|
|9010|The network is not normal.(Time out)|网络超时|
|9011|BmobUser does not support batch operations.|BmobUser类不支持批量操作|
|9012|context is null.|上下文为空|
|9013|BmobObject Object names(database table name) format is not correct.|BmobObject（数据表名称）格式不正确|
|9014||第三方账号授权失败|
|9015||其他错误均返回此code|
|9016|The network is not available,please check your network!|无网络连接，请检查您的手机网络。|
|9017||与第三方登录有关的错误，具体请看对应的错误描述|
|9018||参数不能为空|
|9019||格式不正确：手机号码、邮箱地址、验证码|



# 14、混淆打包

使用了BmobSDK的应用在混淆过程中，需注意以下几点：

1、`不要混淆BmobSDK的代码`，Bmob Android SDK本身进行了代码混淆；

2、任何继承自`BmobObject、BmobUser`的JavaBean及`在上述JavaBean中定义的Object属性类`都不要混淆，否则gson将无法将数据解析成具体对象；

3、确保`rx`、`okhttp3 okio`、`gson`及`org.apache.http.legacy.jar`包均不要混淆。

确保文件 `proguard-rules.pro` 文件中存在如下的脚本：

```xml
# keep BmobSDK
-dontwarn cn.bmob.v3.**
-keep class cn.bmob.v3.** {*;}

# 确保JavaBean不被混淆-否则gson将无法将数据解析成具体对象
-keep class * extends cn.bmob.v3.BmobObject {
    *;
}


```
# 15、域名备案和重置

从v3.6.7开始，数据服务SDK新增了能重新设置请求域名的API，需要在初始化SDK前调用：
```Java
Bmob.resetDomain("http://你在Bmob控制台绑定的SDK域名/8/");
```
其中，参数为`你在Bmob控制台绑定的SDK域名`，调用后的所有请求都指向新的域名。


关于域名重置和备案，请直接参考：[重置域名设置](http://doc.bmobapp.com/other/domain/)


# 16、海外加速

在应用设置-套餐升级，购买了海外节点加速功能的用户，可以提高海外访问速度。


# 17、版本兼容
### Android 6.0
- 添加对Apache的HTTP-client支持
Android6.0版本开始移除了对Apache的HTTP Client的支持，需要在`app`的`build.gradle`文件添加配置:

```gradle
android {
	useLibrary 'org.apache.http.legacy'
}
```

### Android P 网络配置
在 res 下新建一个 xml 目录，然后创建一个名为 network_security_config.xml 文件 ，该文件内容如下：
```
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true" />
</network-security-config>
```
然后在 AndroidManifest.xml application 标签内应用上面的xml配置：
```
    <application
        android:networkSecurityConfig="@xml/network_security_config">
    </application>
```