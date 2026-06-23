# BmobSwift SDK 快速入门

BmobSwift SDK 是 Bmob 后端云的全新 Swift SDK，专为 Swift 现代并发模型设计。支持 iOS 15+ 和 macOS 12+，通过 async/await 提供简洁优雅的 API。

## 环境要求

- **Xcode**: 15.0+
- **Swift**: 5.9+
- **iOS**: 15.0+
- **macOS**: 12.0+

## 安装

### Swift Package Manager (推荐)

在 Xcode 中：

1. **File → Add Package Dependencies…**
2. 输入仓库 URL: `https://github.com/bmob/BmobSwiftSDK`
3. 选择版本规则（推荐最新版本 `Up to Next Major Version: 1.0.2`）
4. 勾选 `BmobSDK` 模块，点击 `Add Package`

在 `Package.swift` 中：

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

# 伞式集成
pod 'BmobSwiftSDK', '~> 1.0.2'

# 按需集成
pod 'BmobSwiftSDK/Core'    # 仅核心网络层
pod 'BmobSwiftSDK/Data'    # 数据 CRUD + 查询
pod 'BmobSwiftSDK/User'    # 用户管理
pod 'BmobSwiftSDK/File'    # 文件管理
pod 'BmobSwiftSDK/Cloud'   # 云函数
```

## 初始化

```swift
import BmobSDK

@main
struct YourApp: App {
    init() {
        Task {
            do {
                try await Bmob.initialize(appKey: "your-app-key")
                print("Bmob SDK 初始化成功")
            } catch {
                print("初始化失败: \(error)")
            }
        }
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
```

> **提示**: AppKey 可在 [Bmob 控制台](https://www.bmobapp.com) → 应用设置 → 应用密钥中找到。

## 基础 CRUD

### 创建数据

```swift
let note = BmobObject(className: "Note")
note["title"] = "我的第一条笔记"
note["content"] = "Hello Bmob!"
note["score"] = 100

do {
    try await note.save()
    print("保存成功，objectId: \(note.objectId!)")
} catch {
    print("保存失败: \(error)")
}
```

### 查询数据

```swift
// 查询所有
let query = BmobQuery(className: "Note")
let results = try await query.find()

// 条件查询
let query = BmobQuery(className: "Note")
    .whereKey("score", greaterThan: 80)
    .order(byDescending: "createdAt")
    .limit(10)
let results = try await query.find()
```

### 更新数据

```swift
let note = BmobObject(className: "Note", data: ["objectId": "abc123"])
note["content"] = "更新后的内容"

try await note.update()
```

### 删除数据

```swift
let note = BmobObject(className: "Note", data: ["objectId": "abc123"])
try await note.delete()
```

## 用户系统

### 注册与登录

```swift
// 注册
let user = BmobUser()
user.username = "testuser"
user.password = "password123"
try await user.signUp()

// 登录
let user = try await BmobUser.login(username: "testuser", password: "password123")

// 手机号验证码登录
let user = try await BmobUser.login(mobilePhoneNumber: "13800138000", smsCode: "123456")
```

### 获取当前用户

```swift
if let current = BmobUser.current {
    print("当前用户: \(current.username ?? "")")
}
```

## 下一步

- [详细开发文档](develop_doc.md) - 完整的 API 使用指南
- [数据查询指南](develop_doc.md#数据查询) - 高级查询语法
- [用户管理](develop_doc.md#用户管理) - 第三方登录、短信验证
- [文件管理](develop_doc.md#文件管理) - 上传、下载、删除
- [云函数](develop_doc.md#云函数调用) - 类型安全的云函数调用
