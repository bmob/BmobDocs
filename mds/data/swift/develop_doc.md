# BmobSwift SDK 开发文档

## 目录

- [安装与配置](#安装与配置)
- [初始化](#初始化)
- [数据操作](#数据操作)
- [数据查询](#数据查询)
- [用户管理](#用户管理)
- [文件管理](#文件管理)
- [云函数](#云函数)
- [地理位置](#地理位置)
- [ACL 与安全](#acl-与安全)
- [错误处理](#错误处理)

---

## 安装与配置

### 环境要求

| 项目 | 要求 |
|------|------|
| Xcode | 15.0+ |
| Swift | 5.9+ |
| iOS | 15.0+ |
| macOS | 12.0+ |

### Swift Package Manager

在 `Package.swift` 中添加依赖：

```swift
dependencies: [
    .package(url: "https://github.com/bmob/BmobSwiftSDK", from: "1.0.2")
],
targets: [
    .target(name: "YourApp", dependencies: [
        .product(name: "BmobSDK", package: "BmobSwiftSDK")
    ])
]
```

### CocoaPods

```ruby
# Podfile
platform :ios, '15.0'
use_frameworks!

target 'YourApp' do
  pod 'BmobSwiftSDK', '~> 1.0.2'
end
```

### 模块说明

| 模块 | 功能 | 依赖 |
|------|------|------|
| `BmobCore` | 加密、网络、SDK 初始化 | 无 |
| `BmobData` | 数据 CRUD、查询、ACL | BmobCore |
| `BmobUser` | 用户注册/登录/第三方 | BmobCore + BmobData |
| `BmobFile` | 文件上传/删除/进度 | BmobCore + BmobData |
| `BmobCloud` | 云函数调用 | BmobCore |
| `BmobSDK` | 伞式全量模块 | 以上全部 |

---

## 初始化

### 基础初始化

```swift
import BmobSDK

// AppDelegate.swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions...) {
    Task {
        do {
            try await Bmob.initialize(appKey: "your-application-id")
        } catch {
            print("初始化失败: \(error)")
        }
    }
}

// SwiftUI App
@main
struct MyApp: App {
    init() {
        Task {
            try? await Bmob.initialize(appKey: "your-application-id")
        }
    }
}
```

### 自定义域名（私有云）

```swift
// 在 initialize 之前调用
Bmob.resetDomain("https://your-private-cloud.com")
try await Bmob.initialize(appKey: "your-app-key")
```

### 检查初始化状态

```swift
if await Bmob.isReady {
    // SDK 已就绪
}
```

---

## 数据操作

### 创建数据对象

BmobObject 是所有数据对象的基类：

```swift
// 创建新对象
let note = BmobObject(className: "Note")

// 设置字段（使用下标语法）
note["title"] = "我的笔记"
note["content"] = "这是内容"
note["priority"] = 1
note["isCompleted"] = false
note["tags"] = ["工作", "重要"]
note["metadata"] = ["viewCount": 100, "likeCount": 50]

// 保存
do {
    try await note.save()
    print("创建成功，objectId: \(note.objectId!)")
} catch {
    print("创建失败: \(error)")
}
```

### 保存带关联的对象

```swift
// 创建笔记并关联作者
let note = BmobObject(className: "Note")
note["title"] = "关联文章"
note["author"] = BmobPointer(className: "_User", objectId: "user123")
note["category"] = BmobPointer(className: "Category", objectId: "cat456")

try await note.save()
```

### 批量操作

```swift
// 批量创建
let objects = [
    BmobObject(className: "Note", data: ["title": "笔记1"]),
    BmobObject(className: "Note", data: ["title": "笔记2"]),
    BmobObject(className: "Note", data: ["title": "笔记3"])
]

for object in objects {
    try await object.save()
}

// 批量更新
try await BmobObject.updateBatch(objects)
```

### 内嵌对象

```swift
let person = BmobObject(className: "Person")
person["name"] = "张三"
person["profile"] = [
    "age": 25,
    "city": "北京",
    "occupation": "工程师"
] as [String: Any]

try await person.save()
```

---

## 数据查询

### 基础查询

```swift
// 查询所有记录
let query = BmobQuery(className: "Note")
let results = try await query.find()

// 查询单条
let note = try await query.get(objectId: "abc123")
```

### 条件查询

```swift
let query = BmobQuery(className: "Note")
    .whereKey("status", equalTo: 1)           // 等于
    .whereKey("score", greaterThan: 80)        // 大于
    .whereKey("priority", lessThanOrEqualTo: 3) // 小于等于
    .whereKey("title", notEqualTo: "草稿")      // 不等于

let results = try await query.find()
```

### 常用操作符

| 方法 | 操作符 | 说明 |
|------|--------|------|
| `equalTo(_:)` | `$eq` | 等于 |
| `notEqualTo(_:)` | `$ne` | 不等于 |
| `lessThan(_:)` | `$lt` | 小于 |
| `lessThanOrEqualTo(_:)` | `$lte` | 小于等于 |
| `greaterThan(_:)` | `$gt` | 大于 |
| `greaterThanOrEqualTo(_:)` | `$gte` | 大于等于 |
| `containedIn(_:)` | `$in` | 包含于 |
| `notContainedIn(_:)` | `$nin` | 不包含于 |

```swift
// 数组包含查询
let query = BmobQuery(className: "Note")
    .whereKey("tags", containedIn: ["Swift", "iOS"])

// 字段存在性
let query = BmobQuery(className: "Note")
    .whereKeyExists("publishedAt")
    .whereKeyDoesNotExist("deletedAt")
```

### 模糊查询

```swift
// 正则匹配
let query = BmobQuery(className: "Note")
    .whereKey("title", matchesRegex: ".*入门.*")

// 前缀匹配
let query = BmobQuery(className: "Note")
    .whereKey("title", startsWith: "Swift")

// 后缀匹配
let query = BmobQuery(className: "Note")
    .whereKey("email", endsWith: "@example.com")
```

### 排序

```swift
let query = BmobQuery(className: "Note")
    .order(byDescending: "createdAt")    // 按创建时间降序
    .order(byAscending: "priority")       // 按优先级升序

// 添加多个排序
let query = BmobQuery(className: "Note")
    .order(byDescending: "status")
    .addAscendingOrder("createdAt")
```

### 分页

```swift
let query = BmobQuery(className: "Note")
    .limit(20)    // 每页 20 条
    .skip(40)     // 跳过前 40 条（获取第 3 页）
```

### 字段选择

```swift
// 只返回指定字段
let query = BmobQuery(className: "Note")
    .selectKeys(["title", "createdAt"])
```

### 关联查询

```swift
// 查询时一并返回关联对象
let query = BmobQuery(className: "Note")
    .whereKey("author", equalTo: BmobPointer(className: "_User", objectId: "user123"))
    .includeKey("author")  // 展开作者信息

let results = try await query.find()
// 访问关联对象
if let author = results.first?["author"] as? [String: Any] {
    print("作者: \(author["username"] ?? "")")
}
```

### 组合查询

```swift
// AND 查询
let query1 = BmobQuery(className: "Note").whereKey("status", equalTo: 1)
let query2 = BmobQuery(className: "Note").whereKey("priority", greaterThan: 2)

if let andQuery = BmobQuery.and([query1, query2]) {
    let results = try await andQuery.find()
}

// OR 查询
let query1 = BmobQuery(className: "Note").whereKey("type", equalTo: "work")
let query2 = BmobQuery(className: "Note").whereKey("type", equalTo: "personal")

if let orQuery = BmobQuery.or([query1, query2]) {
    let results = try await orQuery.find()
}
```

### 统计查询

```swift
let query = BmobQuery(className: "Order")
    .selectKeys(["amount"])
    .statistics()
    .groupBy(["category"])

let stats = try await query.statistics()
```

### 计数

```swift
let query = BmobQuery(className: "Note")
    .whereKey("status", equalTo: 1)

let count = try await query.count()
print("符合条件的记录数: \(count)")
```

### 缓存策略

```swift
var query = BmobQuery(className: "Note")
query.cachePolicy = .cacheThenNetwork  // 先取缓存再查网络

let results = try await query.find()
```

---

## 用户管理

### 创建用户

```swift
let user = BmobUser()
user.username = "testuser"
user.password = "password123"
user.email = "test@example.com"
user.mobilePhoneNumber = "13800138000"

try await user.signUp()
```

### 用户登录

```swift
// 用户名密码登录
let user = try await BmobUser.login(username: "testuser", password: "password123")

// 邮箱登录
let user = try await BmobUser.login(account: "test@example.com", password: "password123")

// 手机号验证码登录
let user = try await BmobUser.login(mobilePhoneNumber: "13800138000", smsCode: "123456")
```

### 获取当前用户

```swift
// 恢复本地缓存的用户
BmobUser.restoreCurrent()

if let currentUser = BmobUser.current {
    print("用户名: \(currentUser.username ?? "")")
    print("手机号: \(currentUser.mobilePhoneNumber ?? "")")
    print("Session: \(currentUser.sessionToken ?? "")")
}
```

### 登出

```swift
BmobUser.logout()
```

### 更新用户信息

```swift
if let user = BmobUser.current {
    user["nickname"] = "新昵称"
    user["avatar"] = "https://example.com/avatar.jpg"
    try await user.update()
}
```

### 修改密码

```swift
if let user = BmobUser.current {
    try await user.updatePassword(oldPassword: "old123", newPassword: "new123")
}
```

### 短信相关

```swift
// 请求短信验证码
try await BmobSMS.requestSmsCode(mobilePhoneNumber: "13800138000")

// 手机号一键注册登录
let user = try await BmobUser.signUpOrLogin(mobilePhoneNumber: "13800138000", smsCode: "123456")

// 短信重置密码
try await BmobUser.resetPassword(smsCode: "123456", newPassword: "newPassword")
```

### 邮箱验证

```swift
// 请求邮箱验证
try await BmobUser.requestEmailVerify("user@example.com")

// 检查邮箱是否已验证
if let user = BmobUser.current {
    if user.emailVerified {
        print("邮箱已验证")
    }
}
```

### 第三方登录

```swift
// 微信登录示例
let authData: [String: Any] = [
    "openid": "wechat_openid",
    "access_token": "wechat_access_token",
    "expires_in": 7200
]

let user = try await BmobUser.login(platform: .wechat, authData: authData)

// 绑定第三方账号
try await user.link(platform: .wechat, authData: authData)

// 解绑
try await user.unlink(platform: .wechat)
```

---

## 文件管理

### 上传文件

```swift
import UIKit

// 从 UIImage 上传
guard let image = UIImage(named: "photo"),
      let imageData = image.jpegData(compressionQuality: 0.8) else { return }

let file = BmobFile(data: imageData, filename: "photo.jpg", mimeType: "image/jpeg")

do {
    try await file.upload { progress in
        print("上传进度: \(Int(progress * 100))%")
    }
    print("文件 URL: \(file.url!)")
} catch {
    print("上传失败: \(error)")
}
```

### 从本地路径上传

```swift
let file = BmobFile(filePath: "/path/to/document.pdf")
try await file.upload()
print("文件 URL: \(file.url!)")
```

### 在对象中保存文件

```swift
// 上传文件
let file = BmobFile(data: imageData, filename: "avatar.jpg")
try await file.upload()

// 创建用户并设置头像
let user = BmobUser()
user.username = "newuser"
user.password = "password123"
user["avatar"] = file.fileDict(filename: "avatar.jpg")
try await user.signUp()
```

### 下载文件

```swift
guard let url = URL(string: "https://bmob-cdn-xxx.bmobcloud.com/photo.jpg") else { return }

let (data, _) = try await URLSession.shared.data(from: url)
let image = UIImage(data: data)
```

### 删除文件

```swift
let file = BmobFile(url: "https://bmob-cdn-xxx.bmobcloud.com/photo.jpg")
try await file.delete()
```

### 批量操作

```swift
// 批量上传
let files = [
    BmobFile(data: data1, filename: "file1.jpg"),
    BmobFile(data: data2, filename: "file2.jpg"),
    BmobFile(data: data3, filename: "file3.jpg")
]

let uploaded = try await BmobFile.uploadBatch(files) { progress in
    print("批量上传进度: \(Int(progress * 100))%")
}

// 批量删除
try await BmobFile.deleteBatch(urls: ["url1", "url2", "url3"])
```

---

## 云函数

### 基本调用

```swift
// 无参数调用
let result = try await BmobCloud.run(function: "hello")

// 带参数调用
let result = try await BmobCloud.run(
    function: "greet",
    params: ["name": "World"]
)

// fire-and-forget（不等待返回）
BmobCloud.fire(function: "sendNotification", params: ["userId": "123"])
```

### 类型安全调用

```swift
// 定义返回类型
struct Greeting: Decodable {
    let message: String
    let code: Int
}

let greeting: Greeting = try await BmobCloud.run(
    function: "greet",
    params: ["name": "Swift"]
)
print(greeting.message)
```

### 复杂返回类型

```swift
struct UserList: Decodable {
    let users: [UserInfo]
    let total: Int
}

struct UserInfo: Decodable {
    let objectId: String
    let username: String
    let createdAt: String
}

let result: UserList = try await BmobCloud.run(function: "getUserList")
for user in result.users {
    print("\(user.username)")
}
```

---

## 地理位置

### 创建地理位置

```swift
let location = BmobGeoPoint(latitude: 39.9042, longitude: 116.4074)
```

### 附近查询

```swift
// 附近的人（100km 范围内）
let userLocation = BmobGeoPoint(latitude: 39.9042, longitude: 116.4074)

let query = BmobQuery(className: "User")
    .whereKey("location", nearGeoPoint: userLocation, withinKilometers: 100)
    .limit(20)

let nearbyUsers = try await query.find()
```

### 矩形区域查询

```swift
let southwest = BmobGeoPoint(latitude: 39.8, longitude: 116.3)
let northeast = BmobGeoPoint(latitude: 40.0, longitude: 116.5)

let query = BmobQuery(className: "Store")
    .whereKey("location", withinGeoBox: southwest, northeast: northeast)

let stores = try await query.find()
```

---

## ACL 与安全

### 设置访问权限

```swift
let note = BmobObject(className: "Note")
note["title"] = "私有笔记"
note["content"] = "只有我自己能看"

// 创建 ACL：默认禁止读写
let acl = BmobACL()
acl.setReadAccess(enabled: true, forUserId: BmobUser.current?.objectId ?? "")
acl.setWriteAccess(enabled: true, forUserId: BmobUser.current?.objectId ?? "")

note.acl = acl
try await note.save()
```

### 公共读

```swift
let acl = BmobACL()
acl.setReadAccess(enabled: true, forRole: .public)  // 所有人可读
acl.setWriteAccess(enabled: true, forUserId: BmobUser.current?.objectId ?? "")

note.acl = acl
```

### 角色权限

```swift
let acl = BmobACL()
acl.setReadAccess(enabled: true, forRole: .public)
acl.setReadAccess(enabled: true, forRoleName: "Admin")  // Admin 角色可读
acl.setWriteAccess(enabled: true, forRoleName: "Admin") // Admin 角色可写

note.acl = acl
```

---

## 错误处理

### 错误类型

```swift
enum BmobError: Error {
    case notInitialized
    case invalidParameter(reason: String)
    case networkError(underlying: Error)
    case serverError(code: Int, message: String)
    case authenticationFailed
    case objectNotFound
    case timeout
    case jsonParsingFailed
}
```

### 统一错误处理

```swift
do {
    let user = try await BmobUser.login(username: "test", password: "pass")
} catch let error as BmobError {
    switch error {
    case .authenticationFailed:
        print("用户名或密码错误")
    case .serverError(let code, let message):
        print("服务器错误 \(code): \(message)")
    default:
        print("其他错误: \(error.localizedDescription)")
    }
}
```

---

## 更新日志

### v1.0.2 (最新)

- Bug 修复与性能优化
- 改进网络请求稳定性
- 优化错误处理机制

### v1.0.0 (2026-01-01)

- 全新 Swift 原生 API 设计
- 支持 async/await 并发模型
- 支持 Swift Package Manager 和 CocoaPods
- 完整的数据 CRUD 和查询功能
- 用户系统完整支持
- 文件上传下载管理
- 云函数类型安全调用
- 地理位置查询
- ACL 权限控制
