# BmobSwift SDK 完整示例

本示例创建一个「任务清单」应用，展示 BmobSwift SDK 的核心功能。

## 示例项目结构

```
TodoApp/
├── App/
│   └── TodoApp.swift          # SwiftUI 应用入口
├── Models/
│   ├── TodoItem.swift         # 任务模型
│   └── User.swift             # 用户模型（扩展）
├── ViewModels/
│   ├── AuthViewModel.swift    # 认证视图模型
│   └── TodoViewModel.swift    # 任务视图模型
├── Views/
│   ├── ContentView.swift      # 主内容视图
│   ├── LoginView.swift        # 登录视图
│   ├── TodoListView.swift     # 任务列表
│   └── TodoEditorView.swift   # 任务编辑器
└── Services/
    └── BmobService.swift      # Bmob 服务封装
```

---

## 数据表设计

在 Bmob 控制台创建以下数据表：

### TodoItem 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| title | String | 任务标题（必填） |
| content | String | 任务描述 |
| isCompleted | Boolean | 是否完成 |
| dueDate | Date | 截止日期 |
| priority | Number | 优先级（1-3） |
| author | Pointer<_User> | 创建者 |
| tags | Array | 标签 |

### _User 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| username | String | 用户名 |
| email | String | 邮箱 |
| mobilePhoneNumber | String | 手机号 |
| avatar | File | 头像 |

---

## 代码实现

### 1. 初始化配置

```swift
// App/TodoApp.swift
import SwiftUI
import BmobSDK

@main
struct TodoApp: App {
    @StateObject private var authVM = AuthViewModel()
    
    init() {
        // 初始化 Bmob SDK
        Task {
            do {
                try await Bmob.initialize(appKey: "YOUR_APP_KEY")
                print("Bmob SDK 初始化成功")
            } catch {
                print("初始化失败: \(error)")
            }
        }
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authVM)
        }
    }
}
```

### 2. 模型定义

```swift
// Models/TodoItem.swift
import Foundation
import BmobData

/// 任务数据模型
class TodoItem: BmobObject {
    /// 任务标题
    var title: String? {
        get { self["title"] as? String }
        set { self["title"] = newValue }
    }
    
    /// 任务描述
    var content: String? {
        get { self["content"] as? String }
        set { self["content"] = newValue }
    }
    
    /// 是否完成
    var isCompleted: Bool {
        get { self["isCompleted"] as? Bool ?? false }
        set { self["isCompleted"] = newValue }
    }
    
    /// 截止日期
    var dueDate: Date? {
        get { self["dueDate"] as? Date }
        set { self["dueDate"] = newValue }
    }
    
    /// 优先级（1: 低, 2: 中, 3: 高）
    var priority: Int {
        get { self["priority"] as? Int ?? 1 }
        set { self["priority"] = newValue }
    }
    
    /// 创建者
    var author: BmobPointer? {
        get { self["author"] as? BmobPointer }
        set { self["author"] = newValue }
    }
    
    /// 标签
    var tags: [String]? {
        get { self["tags"] as? [String] }
        set { self["tags"] = newValue }
    }
    
    override init() {
        super.init(className: "TodoItem")
    }
    
    init(title: String, content: String? = nil, priority: Int = 1) {
        super.init(className: "TodoItem")
        self.title = title
        self.content = content
        self.priority = priority
        self.isCompleted = false
    }
}
```

### 3. 认证视图模型

```swift
// ViewModels/AuthViewModel.swift
import Foundation
import BmobSDK

@MainActor
class AuthViewModel: ObservableObject {
    @Published var currentUser: BmobUser?
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    init() {
        // 恢复登录状态
        BmobUser.restoreCurrent()
        currentUser = BmobUser.current
    }
    
    // MARK: - 注册
    
    func signUp(username: String, password: String, email: String?) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let user = BmobUser()
            user.username = username
            user.password = password
            if let email = email {
                user.email = email
            }
            
            try await user.signUp()
            currentUser = user
            print("注册成功: \(user.objectId ?? "")")
        } catch {
            errorMessage = "注册失败: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    // MARK: - 登录
    
    func login(username: String, password: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let user = try await BmobUser.login(username: username, password: password)
            currentUser = user
            print("登录成功: \(user.username ?? "")")
        } catch {
            errorMessage = "登录失败: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    // MARK: - 手机号登录
    
    func loginWithPhone(phone: String, smsCode: String) async {
        isLoading = true
        errorMessage = nil
        
        do {
            let user = try await BmobUser.login(mobilePhoneNumber: phone, smsCode: smsCode)
            currentUser = user
            print("手机号登录成功")
        } catch {
            errorMessage = "登录失败: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    // MARK: - 发送验证码
    
    func requestSmsCode(phone: String) async -> Bool {
        do {
            try await BmobSMS.requestSmsCode(mobilePhoneNumber: phone)
            return true
        } catch {
            errorMessage = "发送验证码失败"
            return false
        }
    }
    
    // MARK: - 登出
    
    func logout() {
        BmobUser.logout()
        currentUser = nil
    }
    
    // MARK: - 更新用户信息
    
    func updateProfile(nickname: String?, avatar: BmobFile?) async {
        guard let user = currentUser else { return }
        
        do {
            if let nickname = nickname {
                user["nickname"] = nickname
            }
            if let avatar = avatar {
                user["avatar"] = avatar.fileDict(filename: "avatar.jpg")
            }
            try await user.update()
            currentUser = user
        } catch {
            errorMessage = "更新失败: \(error.localizedDescription)"
        }
    }
}
```

### 4. 任务视图模型

```swift
// ViewModels/TodoViewModel.swift
import Foundation
import BmobSDK

@MainActor
class TodoViewModel: ObservableObject {
    @Published var todos: [TodoItem] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let className = "TodoItem"
    
    // MARK: - 查询任务
    
    func fetchTodos() async {
        isLoading = true
        errorMessage = nil
        
        do {
            let query = BmobQuery(className: className)
                .order(byDescending: "createdAt")
                .limit(50)
            
            todos = try await query.find()
        } catch {
            errorMessage = "获取任务失败: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    // MARK: - 按状态筛选
    
    func fetchTodos(status: TaskStatus) async {
        isLoading = true
        
        do {
            let query = BmobQuery(className: className)
            
            switch status {
            case .pending:
                query.whereKey("isCompleted", equalTo: false)
            case .completed:
                query.whereKey("isCompleted", equalTo: true)
            case .all:
                break
            }
            
            todos = try await query.find()
        } catch {
            errorMessage = "获取任务失败"
        }
        
        isLoading = false
    }
    
    // MARK: - 按优先级筛选
    
    func fetchTodos(priority: Int) async {
        isLoading = true
        
        do {
            let query = BmobQuery(className: className)
                .whereKey("priority", equalTo: priority)
                .order(byDescending: "createdAt")
            
            todos = try await query.find()
        } catch {
            errorMessage = "获取任务失败"
        }
        
        isLoading = false
    }
    
    // MARK: - 创建任务
    
    func createTodo(title: String, content: String?, priority: Int, dueDate: Date?) async -> Bool {
        let todo = TodoItem(title: title, content: content, priority: priority)
        todo.dueDate = dueDate
        todo.isCompleted = false
        
        // 关联当前用户
        if let user = BmobUser.current {
            todo.author = BmobPointer(className: "_User", objectId: user.objectId ?? "")
        }
        
        do {
            try await todo.save()
            todos.insert(todo, at: 0)
            return true
        } catch {
            errorMessage = "创建任务失败"
            return false
        }
    }
    
    // MARK: - 更新任务
    
    func updateTodo(_ todo: TodoItem, title: String? = nil, content: String? = nil, isCompleted: Bool? = nil) async -> Bool {
        if let title = title { todo.title = title }
        if let content = content { todo.content = content }
        if let completed = isCompleted { todo.isCompleted = completed }
        
        do {
            try await todo.update()
            // 刷新列表
            await fetchTodos()
            return true
        } catch {
            errorMessage = "更新任务失败"
            return false
        }
    }
    
    // MARK: - 切换完成状态
    
    func toggleComplete(_ todo: TodoItem) async {
        todo.isCompleted.toggle()
        
        do {
            try await todo.update()
            if let index = todos.firstIndex(where: { $0.objectId == todo.objectId }) {
                todos[index] = todo
            }
        } catch {
            todo.isCompleted.toggle() // 回滚
            errorMessage = "更新失败"
        }
    }
    
    // MARK: - 删除任务
    
    func deleteTodo(_ todo: TodoItem) async -> Bool {
        do {
            try await todo.delete()
            todos.removeAll { $0.objectId == todo.objectId }
            return true
        } catch {
            errorMessage = "删除失败"
            return false
        }
    }
    
    // MARK: - 批量删除已完成
    
    func deleteCompleted() async {
        let completed = todos.filter { $0.isCompleted }
        
        for todo in completed {
            do {
                try await todo.delete()
            } catch {
                continue
            }
        }
        
        todos.removeAll { $0.isCompleted }
    }
    
    // MARK: - 搜索任务
    
    func searchTodos(keyword: String) async {
        isLoading = true
        
        do {
            let query = BmobQuery(className: className)
                .whereKey("title", matchesRegex: keyword)
                .order(byDescending: "createdAt")
            
            todos = try await query.find()
        } catch {
            errorMessage = "搜索失败"
        }
        
        isLoading = false
    }
    
    // MARK: - 获取计数
    
    func getCount() async -> (total: Int, completed: Int) {
        do {
            let allQuery = BmobQuery(className: className)
            let total = try await allQuery.count()
            
            let completedQuery = BmobQuery(className: className)
                .whereKey("isCompleted", equalTo: true)
            let completed = try await completedQuery.count()
            
            return (total, completed)
        } catch {
            return (0, 0)
        }
    }
}

// MARK: - 任务状态枚举

enum TaskStatus {
    case all
    case pending
    case completed
}
```

### 5. 主内容视图

```swift
// Views/ContentView.swift
import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authVM: AuthViewModel
    
    var body: some View {
        Group {
            if authVM.currentUser != nil {
                TodoListView()
            } else {
                LoginView()
            }
        }
    }
}
```

### 6. 登录视图

```swift
// Views/LoginView.swift
import SwiftUI

struct LoginView: View {
    @EnvironmentObject var authVM: AuthViewModel
    
    @State private var username = ""
    @State private var password = ""
    @State private var email = ""
    @State private var isSignUp = false
    @State private var phone = ""
    @State private var smsCode = ""
    
    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Picker("登录方式", selection: $isSignUp) {
                        Text("账号密码").tag(false)
                        Text("手机验证码").tag(true)
                    }
                    .pickerStyle(.segmented)
                }
                
                if isSignUp {
                    Section("注册信息") {
                        TextField("用户名", text: $username)
                            .textContentType(.username)
                            .autocapitalization(.none)
                        
                        SecureField("密码", text: $password)
                            .textContentType(.password)
                        
                        TextField("邮箱（可选）", text: $email)
                            .textContentType(.emailAddress)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)
                    }
                } else {
                    Section("账号密码登录") {
                        TextField("用户名", text: $username)
                            .textContentType(.username)
                            .autocapitalization(.none)
                        
                        SecureField("密码", text: $password)
                            .textContentType(.password)
                    }
                    
                    Section("手机号登录") {
                        TextField("手机号", text: $phone)
                            .keyboardType(.phonePad)
                        
                        HStack {
                            TextField("验证码", text: $smsCode)
                                .keyboardType(.numberPad)
                            
                            Button("获取验证码") {
                                Task {
                                    await authVM.requestSmsCode(phone: phone)
                                }
                            }
                            .disabled(phone.count < 11)
                        }
                    }
                }
                
                if let error = authVM.errorMessage {
                    Section {
                        Text(error)
                            .foregroundColor(.red)
                    }
                }
                
                Section {
                    Button(action: performAuth) {
                        if authVM.isLoading {
                            ProgressView()
                        } else {
                            Text(isSignUp ? "注册" : "登录")
                        }
                    }
                    .disabled(authVM.isLoading || !isFormValid)
                }
            }
            .navigationTitle("任务清单")
        }
    }
    
    private var isFormValid: Bool {
        if isSignUp {
            return !username.isEmpty && !password.isEmpty
        } else {
            return (!username.isEmpty && !password.isEmpty) || (!phone.isEmpty && !smsCode.isEmpty)
        }
    }
    
    private func performAuth() {
        Task {
            if isSignUp {
                await authVM.signUp(username: username, password: password, email: email.isEmpty ? nil : email)
            } else {
                if !username.isEmpty {
                    await authVM.login(username: username, password: password)
                } else {
                    await authVM.loginWithPhone(phone: phone, smsCode: smsCode)
                }
            }
        }
    }
}
```

### 7. 任务列表视图

```swift
// Views/TodoListView.swift
import SwiftUI

struct TodoListView: View {
    @EnvironmentObject var authVM: AuthViewModel
    @StateObject private var viewModel = TodoViewModel()
    
    @State private var selectedFilter: TaskStatus = .all
    @State private var showingAddSheet = false
    @State private var searchText = ""
    
    var body: some View {
        NavigationStack {
            VStack {
                // 筛选器
                Picker("筛选", selection: $selectedFilter) {
                    Text("全部").tag(TaskStatus.all)
                    Text("待完成").tag(TaskStatus.pending)
                    Text("已完成").tag(TaskStatus.completed)
                }
                .pickerStyle(.segmented)
                .padding()
                .onChange(of: selectedFilter) { _, newValue in
                    Task {
                        await viewModel.fetchTodos(status: newValue)
                    }
                }
                
                if viewModel.isLoading && viewModel.todos.isEmpty {
                    ProgressView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if viewModel.todos.isEmpty {
                    ContentUnavailableView(
                        "暂无任务",
                        systemImage: "checkmark.circle",
                        description: Text("点击 + 按钮创建新任务")
                    )
                } else {
                    List {
                        ForEach(filteredTodos, id: \.objectId) { todo in
                            TodoRowView(todo: todo, viewModel: viewModel)
                        }
                        .onDelete(perform: deleteTodos)
                    }
                    .listStyle(.insetGrouped)
                    .refreshable {
                        await viewModel.fetchTodos(status: selectedFilter)
                    }
                }
            }
            .navigationTitle("任务清单")
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button("登出") {
                        authVM.logout()
                    }
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { showingAddSheet = true }) {
                        Image(systemName: "plus")
                    }
                }
            }
            .sheet(isPresented: $showingAddSheet) {
                TodoEditorView(viewModel: viewModel)
            }
            .task {
                await viewModel.fetchTodos(status: selectedFilter)
            }
        }
    }
    
    private var filteredTodos: [TodoItem] {
        if searchText.isEmpty {
            return viewModel.todos
        }
        return viewModel.todos.filter {
            $0.title?.localizedCaseInsensitiveContains(searchText) == true
        }
    }
    
    private func deleteTodos(at offsets: IndexSet) {
        for index in offsets {
            let todo = filteredTodos[index]
            Task {
                await viewModel.deleteTodo(todo)
            }
        }
    }
}

// MARK: - 任务行视图

struct TodoRowView: View {
    let todo: TodoItem
    @ObservedObject var viewModel: TodoViewModel
    
    var body: some View {
        HStack(spacing: 12) {
            // 完成状态按钮
            Button(action: {
                Task {
                    await viewModel.toggleComplete(todo)
                }
            }) {
                Image(systemName: todo.isCompleted ? "checkmark.circle.fill" : "circle")
                    .font(.title2)
                    .foregroundColor(todo.isCompleted ? .green : .gray)
            }
            .buttonStyle(.plain)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(todo.title ?? "")
                    .font(.headline)
                    .strikethrough(todo.isCompleted)
                    .foregroundColor(todo.isCompleted ? .secondary : .primary)
                
                if let content = todo.content, !content.isEmpty {
                    Text(content)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }
                
                HStack(spacing: 8) {
                    // 优先级标签
                    priorityBadge
                    
                    // 截止日期
                    if let dueDate = todo.dueDate {
                        Text(dueDate, style: .date)
                            .font(.caption)
                            .foregroundColor(dueDate < Date() ? .red : .secondary)
                    }
                }
            }
        }
        .padding(.vertical, 4)
    }
    
    private var priorityBadge: some View {
        let (text, color) = priorityInfo
        return Text(text)
            .font(.caption2)
            .padding(.horizontal, 8)
            .padding(.vertical, 2)
            .background(color.opacity(0.2))
            .foregroundColor(color)
            .cornerRadius(4)
    }
    
    private var priorityInfo: (String, Color) {
        switch todo.priority {
        case 3: return ("高优", .red)
        case 2: return ("中优", .orange)
        default: return ("低优", .green)
        }
    }
}
```

### 8. 任务编辑器视图

```swift
// Views/TodoEditorView.swift
import SwiftUI

struct TodoEditorView: View {
    @Environment(\.dismiss) private var dismiss
    @ObservedObject var viewModel: TodoViewModel
    
    @State private var title = ""
    @State private var content = ""
    @State private var priority = 1
    @State private var hasDueDate = false
    @State private var dueDate = Date()
    
    var body: some View {
        NavigationStack {
            Form {
                Section("任务信息") {
                    TextField("标题", text: $title)
                    
                    TextField("描述（可选）", text: $content, axis: .vertical)
                        .lineLimit(3...6)
                }
                
                Section("优先级") {
                    Picker("优先级", selection: $priority) {
                        Text("低").tag(1)
                        Text("中").tag(2)
                        Text("高").tag(3)
                    }
                    .pickerStyle(.segmented)
                }
                
                Section("截止日期") {
                    Toggle("设置截止日期", isOn: $hasDueDate)
                    
                    if hasDueDate {
                        DatePicker("日期", selection: $dueDate, displayedComponents: [.date, .hourAndMinute])
                    }
                }
            }
            .navigationTitle("新建任务")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("取消") {
                        dismiss()
                    }
                }
                
                ToolbarItem(placement: .confirmationAction) {
                    Button("保存") {
                        Task {
                            let success = await viewModel.createTodo(
                                title: title,
                                content: content.isEmpty ? nil : content,
                                priority: priority,
                                dueDate: hasDueDate ? dueDate : nil
                            )
                            if success {
                                dismiss()
                            }
                        }
                    }
                    .disabled(title.isEmpty)
                }
            }
        }
    }
}
```

### 9. 文件上传示例

```swift
// Services/FileUploadExample.swift

/// 上传用户头像
func uploadAvatar(image: UIImage) async -> BmobFile? {
    guard let imageData = image.jpegData(compressionQuality: 0.8) else {
        return nil
    }
    
    do {
        let file = BmobFile(data: imageData, filename: "avatar.jpg")
        
        try await file.upload { progress in
            print("上传进度: \(Int(progress * 100))%")
        }
        
        return file
    } catch {
        print("上传失败: \(error)")
        return nil
    }
}

/// 上传任务附件
func uploadAttachment(fileURL: URL) async -> String? {
    guard let file = BmobFile(filePath: fileURL.path) else {
        return nil
    }
    
    do {
        try await file.upload()
        return file.url
    } catch {
        print("上传失败: \(error)")
        return nil
    }
}
```

### 10. 云函数调用示例

```swift
// Services/CloudFunctionExample.swift

/// 定义云函数返回类型
struct Statistics: Decodable {
    let totalTasks: Int
    let completedTasks: Int
    let completionRate: Double
}

/// 获取用户任务统计
func getUserStatistics() async {
    do {
        let stats: Statistics = try await BmobCloud.run(
            function: "getTaskStatistics",
            params: ["userId": BmobUser.current?.objectId ?? ""]
        )
        
        print("总任务: \(stats.totalTasks)")
        print("已完成: \(stats.completedTasks)")
        print("完成率: \(Int(stats.completionRate * 100))%")
    } catch {
        print("获取统计失败: \(error)")
    }
}

/// 批量完成提醒
func sendTaskReminders() async {
    // fire-and-forget，不阻塞
    BmobCloud.fire(
        function: "sendTaskReminders",
        params: ["type": "daily"]
    )
}
```

### 11. 地理位置示例

```swift
// Services/GeoExample.swift

/// 获取附近的任务（按位置分组）
func fetchNearbyTasks(location: (latitude: Double, longitude: Double)) async {
    let userLocation = BmobGeoPoint(
        latitude: location.latitude,
        longitude: location.longitude
    )
    
    do {
        let query = BmobQuery(className: "TodoItem")
            .whereKey("location", nearGeoPoint: userLocation, withinKilometers: 10)
            .limit(20)
        
        let tasks = try await query.find()
        print("附近任务数量: \(tasks.count)")
    } catch {
        print("查询失败: \(error)")
    }
}
```

---

## 运行效果

```
┌─────────────────────────────┐
│         任务清单        [登出]│
├─────────────────────────────┤
│ [全部] [待完成] [已完成]      │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ ● 高优任务 1          ○ │ │
│ │   这是任务描述...        │ │
│ │   2026-01-15           │ │
│ ├─────────────────────────┤ │
│ │ ○ 中优任务 2          ○ │ │
│ │   任务描述...           │ │
│ │   2026-01-20           │ │
│ └─────────────────────────┘ │
│                        [+] │
└─────────────────────────────┘
```

---

## 源码下载

完整的示例项目源码可在 GitHub 获取：

- [BmobSwift TodoApp 示例](https://github.com/bmob/BmobSwiftSDK)

## 更多示例

| 示例 | 说明 |
|------|------|
| [BmobSwiftSDK](https://github.com/bmob/BmobSwiftSDK) | 官方 SDK 仓库 |
| [BmobSwift Demo](https://github.com/bmob/bmob-swift-demo) | 综合示例 |
