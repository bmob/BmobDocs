# BmobSwift SDK 开发文档

## 目录

- [安装与配置](#安装与配置)
- [初始化](#初始化)
- [数据操作](#数据操作)
- [数据查询](#数据查询)
- [用户管理](#用户管理)
- [文件管理](#文件管理)
- [云函数](#云函数)
- [实时数据监听](#实时数据监听)
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
    .package(url: "https://github.com/bmob/BmobSwiftSDK", from: "1.0.8")
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
  pod 'BmobSwiftSDK', '~> 1.0.8'
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

文件经 Bmob 开放接口 `POST /8/files` 上传（请求体为 `{加密JSON}&&{文件Base64}`，鉴权与其它 `/8/*` 业务接口相同），服务端落盘到 CDN；删除使用 `POST /8/delcdnupload`。

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
    print("CDN: \(file.cdn ?? "")")
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
// 使用上传成功后返回的 url（域名以实际 CDN 为准，如 *.bmobpay.com）
guard let url = URL(string: file.url!) else { return }

let (data, _) = try await URLSession.shared.data(from: url)
let image = UIImage(data: data)
```

### 删除文件

```swift
// 优先使用上传后的 BmobFile（含 url / cdn）；也可用 URL 重建
let file = BmobFile(url: uploadedURL, cdn: "aliyun")
try await file?.delete()
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

// 批量删除（传入上传返回的 url 列表）
try await BmobFile.deleteBatch(urls: uploaded.compactMap { $0.url })
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

### 云函数参数注意事项

> **已知行为**：Bmob 服务端会将云函数参数的所有值转为字符串后再传入 `request.body`，因此云函数中 `typeof(param)` 始终为 `"string"`。Int/Bool/Array/Dict 等类型均会被序列化为字符串形式（如 `42`→`"42"`、`true`→`"true"`、`[1,2,3]`→`"[1,2,3]"`）。这是 Bmob 后端的设计行为，非 SDK bug。如需在云函数中使用特定类型，请在云函数内手动解析（如 `parseInt(request.body.name)`、`JSON.parse(request.body.items)`）。

客户端 `params` 可传 Swift 原生类型（`Int`、`Bool`、`[String: Any]` 等），SDK 会正常编码；但云函数侧收到的仍是字符串，编写云函数时请按上述规则解析。

该行为适用于通过 Android、iOS、Swift 等加密客户端 SDK 以 POST 方式调用云函数的场景。

```swift
// 客户端可传多种类型
try await BmobCloud.run(
    function: "updateScore",
    params: [
        "userId": "abc123",
        "score": 42,           // 云函数中 request.body.score === "42"
        "completed": true      // 云函数中 request.body.completed === "true"
    ]
)
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

## 实时数据监听

> 请使用 1.0.8 或更新版本，包含 WebSocket 握手 403 / -1011 修复及空 objectId 回退修复。自定义监听域名接口自 1.0.7 起提供。

实时监听使用与旧版 Objective-C SDK 相同的 Socket.IO 协议，支持表更新、表删除、行更新、行删除。
请先完成 `Bmob.initialize(appKey:)`；SDK 根据下述地址优先级选择实时服务地址，并使用初始化时的 AppKey 建立连接。

### 两步连接与握手兼容

1. 先请求 HTTP/HTTPS 地址 `/socket.io/1/?t=<timestamp>`，获取 `sid:心跳超时:连接超时:websocket`。
2. 使用返回的 SID 连接 `/socket.io/1/websocket/<sid>`，HTTP 对应 `ws://`，HTTPS 对应 `wss://`；主机及端口保持一致。

例如 `http://io.codenow.cn:3010` 先进行 HTTP 握手，再连接 `ws://io.codenow.cn:3010/socket.io/1/websocket/<sid>`。
SDK 自动使用 WebSocket URLRequest 并添加对应的 HTTP/HTTPS `Origin`，兼容旧版实时服务。
出现 `NSURLErrorDomain -1011` 时先升级到 1.0.8；错误日志中的 URL 本身不足以判断问题，应同时检查服务端握手响应（缺少 Origin 时可能返回 403）。

### 自定义监听域名

地址优先级：用户自定义地址 → 初始化响应的 `io` → 默认地址 `http://io.codenow.cn:3010`。

```swift
// 初始化前后均可设置，用 await 保证设置完成后再连接。
try await Bmob.resetIODomain("https://realtime.example.com:443")
```

清除自定义配置，恢复使用服务端 `io`（未返回时使用默认地址）：

```swift
try await Bmob.resetIODomain(nil)
```

支持 `http://`、`https://`、`ws://`、`wss://` 和无协议的 `host:port`（默认 HTTP）。
只传协议、主机及可选端口，SDK 自动拼接 Socket.IO 握手和 WebSocket 路径。
HTTPS/WSS 地址对应 HTTPS 握手及 WSS 连接。地址无效时抛出 `BmobError.invalidParameter`，保留原有配置。
初始化接口不会覆盖用户配置。此设置控制实时监听地址，API 请求域名通过 `Bmob.resetDomain` 独立设置。

已建立的连接在下次连接或自动重连时使用新地址；需立即切换时，先设置地址，再调用
`event.disconnect()`、重新获取 `event.eventStream()`（如有使用），最后 `event.connect()`。

```swift
try await Bmob.resetIODomain("https://next-realtime.example.com")
event.disconnect()
let nextMessages = event.eventStream() // 主动断开已结束旧事件流
// 已登记的订阅会保留，无需重复登记。
event.connect()
for await message in nextMessages {
    print(message.rawValue)
}
```

### AsyncStream 方式

```swift
import BmobSDK

// 在业务对象中保存此实例，直到不再需要监听。
let event = BmobEvent()
try await Bmob.initialize(appKey: "YOUR_APP_KEY")
let messages = event.eventStream()
event.listenTableChange(className: "Post")
event.listenRowChange(.deleteRow, tableName: "Post", objectId: "row-id")
event.connect()

for await message in messages {
    print(message.action ?? "", message.className ?? "", message.objectId ?? "")
    print(message.data ?? [:])
    // UI 更新请回到 MainActor。
}
```

### 监听与取消监听

| 操作 | 方法 |
|------|------|
| 表更新（包含表内行数据变化） | `event.listenTableChange(.updateTable, tableName: "Post")` |
| 表删除 | `event.listenTableChange(.deleteTable, tableName: "Post")` |
| 行更新 | `event.listenRowChange(.updateRow, tableName: "Post", objectId: "row-id")` |
| 行删除 | `event.listenRowChange(.deleteRow, tableName: "Post", objectId: "row-id")` |

取消监听时，使用相同 action、表名及 objectId 调用对应方法：

```swift
event.cancelListenTableChange(.updateTable, tableName: "Post")
event.cancelListenRowChange(.deleteRow, tableName: "Post", objectId: "row-id")
event.disconnect() // 或 stop()
```

现有 `listenTableChange(className:)`、`listenRowChange(className:objectId:)` 默认监听更新，
对应的简写取消方法也只取消更新事件。相同订阅会去重；删除事件需要单独订阅。

### 代理方式与生命周期

也可设置弱引用代理 `event.delegate`，代理对象需由业务方持有。
代理和多个 `eventStream()` 可同时使用，彼此不会覆盖。

```swift
final class RealtimeObserver: BmobEventDelegate {
    func bmobEventDidConnect(_ event: BmobEvent) {
        print("连接已建立")
    }
    func bmobEventCanStartListen(_ event: BmobEvent) {
        print("服务端已就绪，已登记的订阅会自动发送")
    }
    func bmobEvent(_ event: BmobEvent, didReceiveMessage message: BmobEventMessage) {
        print(message.rawValue)
    }
    func bmobEvent(_ event: BmobEvent, didFailWithError error: Error) {
        print(error.localizedDescription)
    }
    func bmobEventDidDisconnect(_ event: BmobEvent, error: Error?) {
        print("连接已断开", error as Any)
    }
}
```

代理回调在主队列执行。`isConnected` 仅在收到服务端连接包后为 true；
服务端发出就绪事件后，SDK 才会发送提前登记的订阅。
消息类型为 `BmobEventMessage`，除 `rawValue` 外其余字段均为可选值：

| 字段 | 含义 |
|------|------|
| `action` | 服务端事件操作名称 |
| `className` | 服务端 `tableName`，也兼容 `className` 字段 |
| `objectId` | 非空的顶层 objectId；未提供或为空字符串时读取 `data.objectId` |
| `data` | 可选的数据字典 |
| `rawValue` | 服务端原始消息字典（非可选） |

默认 `autoReconnect = true`，意外断线后每 5 秒重新握手，并在就绪后恢复仍有效的订阅。
事件流在重连期间保持开启；监听不补发断线期间的变更，需要完整数据时请重新查询。
`autoReconnect = false` 可关闭自动重连。
主动 `disconnect()` 会结束所有事件流并取消重连，保留订阅；再次连接时请新建事件流。
取消单个事件流不会停止连接或其他消费者。`BmobEvent.shared` 提供可选的共享实例。

### 运行 Chat 端到端测试

SDK 源码中的 `Tests/BmobCoreTests/BmobEventChatIntegrationTests.swift` 验证初始化、订阅 `Chat.updateTable`、REST 新增记录及事件内容。
测试用唯一标记区分本次事件，断言 action、表名、objectId、name 和 content，并在结束时删除本次创建的记录；清理失败会报告测试失败。
默认跳过；在 SDK 源码目录提供测试应用的环境变量后运行，不要将真实密钥写入源码或 Git：

```bash
export BMOB_EVENT_CHAT_LIVE_TEST=1
export BMOB_EVENT_APP_KEY="YOUR_APP_KEY"
export BMOB_EVENT_REST_KEY="YOUR_REST_API_KEY"
swift test --filter BmobEventChatIntegrationTests
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

### v1.0.8 (2026-10-21)

- WebSocket 显式使用 WS/WSS 请求并补齐同源 Origin，修复实时握手 HTTP 403 / `NSURLErrorDomain -1011`。
- 顶层 objectId 为空时，回退读取 data.objectId。
- 新增协议映射、请求头、空 objectId 回归测试及可选 Chat 线上端到端测试，自动清理测试记录。

### v1.0.7 (2026-10-21)

- 修复实时数据监听协议，支持表/行更新与删除、退订、断线重连及订阅恢复。
- 修复 AsyncStream，支持多个事件流与代理同时接收消息。
- 新增 `Bmob.resetIODomain(_:)`，可设置自定义监听地址，传 `nil` 恢复自动选择。

### v1.0.2

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
