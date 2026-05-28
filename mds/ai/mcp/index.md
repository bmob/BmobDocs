# MCP 的资料：Bmob MCP 使用方式

将 Bmob 的各种能力提供给 Cursor 等 AI 编程 IDE，或其他支持 MCP 的 AI 工具。

## 适用场景

- 在 IDE 内直接读取 Bmob 项目的真实表结构。
- 让 AI 直接执行建表、增删改查等数据操作。
- 让 AI 生成可落地的业务代码、接口调用代码和文档说明。

## 配置前准备

在 [Bmob 控制台](https://www.bmobapp.com/login) 的应用设置中，先获取以下两个值：

- `Application ID`
- `REST API Key`

## 复制配置（Cursor 示例）

将以下配置写入项目级 `.cursor/mcp.json` 或全局 `~/.cursor/mcp.json`：

```json
{
  "mcpServers": {
    "bmob": {
      "url": "http://mcp.bmobapp.com/mcp",
      "headers": {
        "X-Bmob-Application-Id": "<your-application-id>",
        "X-Bmob-REST-API-Key": "<your-rest-api-key>"
      }
    }
  }
}
```

字段说明：

- `X-Bmob-Application-Id`：你的 Bmob 应用唯一标识，在 Bmob 后台获取。
- `X-Bmob-REST-API-Key`：你的 Bmob REST API 密钥，用于接口鉴权，在 Bmob 后台获取。

## 验证是否连通

在 AI IDE 中输入：

```text
列出我 bmob 项目里的所有数据表
```

如果配置正确，AI 会调用 `get_project_tables` 并返回当前应用的真实表结构。

## 常用功能举例

以下能力都可以由 MCP 客户端直接调用，建议结合团队业务自由扩展。

### `generate_code`

用于生成代码、文档、业务实现。

- 帮我用 Vue3 + TypeScript 实现一个登录界面，自动对接 Bmob 登录接口，包含表单校验和登录成功跳转
- 帮我用 React 实现一个注册页面，自动对接注册接口，注册成功后自动登录
- 为"用户"表生成 Vue3 + TypeScript 的类型定义接口，字段带详细注释，可直接用于前端表单校验
- 帮我生成"订单"表的 React TypeScript Props 类型，包含所有字段及类型说明
- 为"商品"表生成 Android Kotlin 的数据类（data class），字段类型和可空性要体现，适配 Room 持久化
- 帮我用 Android Kotlin 实现一个商品列表页，自动拉取商品数据并支持下拉刷新
- 生成"用户反馈"表的 iOS Swift Struct，要求实现 Codable 协议，字段注释齐全
- 帮我用 SwiftUI 实现一个反馈表单页面，填写后自动提交到云端
- 请为"地址"表生成 Objective-C 的 Model 类，包含属性声明和 JSON 映射方法

### `create_table`

用于新建数据表。

- 帮我新建一个"地址"表，包含省、市、区字段
- 新建一个"订单"表，包含订单号、商品名、价格字段
- 创建"用户反馈"表，包含用户ID、反馈内容、提交时间

### `add_single_data`

用于添加一条数据。

- 在"地址"表中添加一条新地址
- 在"订单"表中添加一条新订单
- 在"用户反馈"表中添加一条反馈信息

### `update_single_data`

用于更新一条数据。

- 修改某个地址的详细信息
- 更新某个订单的状态为已发货
- 修改某条用户反馈的内容

### `delete_single_data`

用于删除一条数据。

- 删除"地址"表中的一条无效地址
- 删除"订单"表中的一条已取消订单
- 删除"用户反馈"表中的一条无效反馈

### `get_project_tables`

用于获取所有表结构。

- 查询当前项目下所有数据表
- 获取"订单"表的所有字段信息
- 查看所有表的备注说明

### `query_data`

用于查询表数据（如果你的 MCP 服务端工具命名不同，请以服务端实际工具名为准）。

- 查询"订单"表中所有未发货的订单
- 按用户ID查询"用户反馈"表的最近 10 条
- 统计"商品"表中各分类的数量

## 高质量指令建议

为了让 AI 输出更稳定，建议在提问中明确以下信息：

- 技术栈：例如 `Vue3 + TypeScript`、`React`、`Android Kotlin`、`SwiftUI`。
- 目标对象：表名、字段名、字段类型和约束。
- 业务目标：比如“注册成功后自动登录并跳转首页”。
- 输出要求：例如“给出完整可运行代码、拆分文件路径、附带注释”。

示例模板：

```text
请基于 Bmob MCP，使用 <技术栈> 完成 <业务目标>。
目标表：<表名>，关键字段：<字段列表>。
请输出：1) 完整代码 2) 文件结构 3) 调用流程说明 4) 异常处理方案。
```

## 安全与风险提示

- 当前 MCP 地址为 `http://mcp.bmobapp.com/mcp`，是明文 HTTP，建议仅用于本机开发环境。
- 不要将包含真实密钥的配置文件提交到公开仓库。
- 如果密钥疑似泄露，请立刻到控制台重置 `REST API Key`。

## 常见问题排查

- 配置后无响应：先检查 `Application ID` 和 `REST API Key` 是否复制错误。
- 返回鉴权错误：确认当前密钥属于正在访问的同一个应用。
- 网络连接失败：检查本机网络、代理或防火墙是否拦截 `mcp.bmobapp.com:80`。
