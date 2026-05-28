# Skills：项目中如何使用 `@bmob-agent-skills/skills`

本文面向开发者，帮助你快速理解 `@bmob-agent-skills/skills` 在项目中的作用、分工和推荐使用方式。

## Skills 是什么

`@bmob-agent-skills/skills` 是一套给 AI 编程助手使用的能力包。它让 AI 在你提到 Bmob 时，自动选择正确的能力路径，减少“答非所问”和平台混用问题。

## 在项目里的角色分工

### 路由入口

- `bmob`：总入口 skill。只要用户提到 Bmob，通常先命中这里，再分流到具体能力。

### MCP 实操能力

- `bmob-mcp`：通过 Bmob MCP Server 在 IDE 里直接做真实操作，比如查表结构、建表、写测试数据、生成代码样板。

### 平台开发能力

- `bmob-database-javascript`：JavaScript/TypeScript 生态（Web、Node、小程序等）。
- `bmob-database-android`：Android 原生（Java/Kotlin）。
- `bmob-database-ios`：iOS 原生（Swift/Objective-C）。
- `bmob-database-restful`：REST API 场景（Python/Go/PHP/C#/Java 后端等）。

### 排障能力

- `bmob-error-codes`：按错误码定位问题原因并给出修复路径。

## 安装方式

### 一键安装全部 skills（推荐）

```bash
npx skills add bmob/agent-skills -y -g
```

### 安装指定 skill

```bash
npx skills add bmob/agent-skills --skill bmob
npx skills add bmob/agent-skills --skill bmob-database-javascript
npx skills add bmob/agent-skills --skill bmob-mcp
```

### 手动复制安装

```bash
git clone https://github.com/bmob/agent-skills.git
cp -r agent-skills/skills/bmob-database-javascript .cursor/skills/
cp -r agent-skills/skills/bmob ~/.claude/skills/
cp -r agent-skills/skills/bmob-mcp ~/.codex/skills/
```

## 触发机制说明

你通常不需要手动“启用” skill。只要在 prompt 中明确提到 Bmob 和任务目标，AI 会自动路由到相应 skill。

示例：

- “使用 Bmob 后端云开发一个羽毛球 VUE 项目”
- “用 bmob 在 Next.js 里实现用户注册登录”
- “Android Kotlin 怎么查询 Bmob 的订单表”
- “给我一段 curl 调用 Bmob 的示例”
- “bmob 报错 9015 怎么修”

## 推荐协作流程（项目实战）

建议按以下顺序使用，稳定性最高：

1. 先用 MCP 获取真实表结构（`bmob-mcp`）。
2. 再由对应平台 skill 生成或改造业务代码。
3. 出错时使用 `bmob-error-codes` 按错误码排查。

这样可以显著减少字段猜测、类型不一致和接口参数错误。

## 典型任务映射

- Vue/React 前端页面与类型定义：优先 `bmob-database-javascript`，并在前面先跑 `bmob-mcp` 拿真实字段。
- Android Kotlin 数据层与列表页：`bmob-database-android`。
- iOS Swift/SwiftUI 模型与表单：`bmob-database-ios`。
- 后端脚本或跨语言服务：`bmob-database-restful`。
- 真实数据表操作：`bmob-mcp`。

## 提问模板（建议直接复用）

```text
请使用 Bmob skills 完成以下任务：
1) 技术栈：<例如 Vue3 + TypeScript>
2) 目标：<例如 登录页面 + Bmob 登录接口对接>
3) 数据来源：请先通过 MCP 获取 <表名> 的真实字段结构
4) 输出要求：给出完整代码、文件拆分、关键注释、异常处理
```

## 最佳实践建议

- 在需求里写清楚平台与语言，避免 AI 混用不同端 SDK。
- 涉及数据库字段时，优先先查真实 schema，再生成代码。
- 对生成结果增加约束（例如“必须可运行”“必须包含校验”）。
- 出现错误码时，不要盲改，先走错误码 skill 进行定位。
