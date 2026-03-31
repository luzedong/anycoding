<div align="center">
  <img src="public/logo.svg" alt="Anycoding" width="64" height="64">
  <h1>Anycoding（luzedong fork）</h1>
  <p>面向本地 agent 会话的 CLI-first 桌面与移动端 UI，支持 <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a>、<a href="https://docs.cursor.com/en/cli/overview">Cursor CLI</a>、<a href="https://developers.openai.com/codex">Codex</a>、<a href="https://geminicli.com/">Gemini-CLI</a> 和 <a href="https://opencode.ai/">OpenCode</a>。<br>这个 fork 更偏向 shell-first 工作区，支持多 provider shell、按项目持久化 shell、项目级 shell 历史，以及文件、Git、MCP 与移动端访问。</p>
</div>

<p align="center">
  <a href="https://github.com/luzedong/anycoding">GitHub</a> · <a href="https://github.com/luzedong/anycoding/issues">Bug 报告</a> · <a href="https://www.npmjs.com/package/@luzedong/anycoding">npm</a> · <a href="CONTRIBUTING.md">贡献指南</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@luzedong/anycoding"><img src="https://img.shields.io/badge/npm-%40luzedong%2Fanycoding-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm package"></a>
  <a href="https://github.com/luzedong/anycoding"><img src="https://img.shields.io/badge/GitHub-luzedong%2Fanycoding-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository"></a>
</p>

<div align="right"><i><a href="./README.md">English</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.ko.md">한국어</a> · <b>中文</b> · <a href="./README.ja.md">日本語</a></i></div>

---

## 功能

- **Shell-first 工作区** - 围绕持久化 shell 会话，而不是 chat-first 流程
- **多 provider Shell** - 在同一套 UI 中启动 Claude Code、Codex、Cursor 风格会话、Gemini CLI、OpenCode 或系统 Shell
- **按项目保留 Shell 历史** - 切换项目后可恢复对应 shell 工作区
- **Provider 感知的新建 Shell** - 在头部直接按 provider 创建 shell，并显示对应图标
- **响应式设计** - 支持桌面、平板与移动端
- **文件浏览器** - 交互式文件树，支持语法高亮与实时编辑
- **Git 浏览器** - 查看、暂存并提交改动，也可切换分支
- **会话管理** - 在侧边栏浏览项目与 session 历史
- **插件系统** - 通过自定义标签页、后端服务与集成扩展 UI。[开始构建 →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)
- **TaskMaster AI 集成** *(可选)* - AI 任务规划、PRD 分析与工作流自动化
- **模型兼容性** - 支持 Claude、GPT、Gemini 模型家族（完整列表见 [`shared/modelConstants.js`](shared/modelConstants.js)）

## 快速开始

### 自托管

使用 **npx** 立即运行这个 fork（需要 **Node.js** v22+）：

```bash
npx @luzedong/anycoding
```

或全局安装：

```bash
npm install -g @luzedong/anycoding
anycoding
```

打开 `http://localhost:3001`，系统会自动发现本地已有项目与会话。

### 从源码运行

```bash
git clone https://github.com/luzedong/anycoding.git
cd anycoding
npm install
npm run dev
```

### 打包为 macOS 应用

仓库已内置 Electron 桌面壳，可直接打包为原生 macOS 应用：

```bash
# 本地构建并启动桌面版
npm run desktop:start

# 仅生成本地验证用 .app（速度更快）
npm run desktop:pack:dir

# 生成可分发安装包（dmg + zip）
npm run desktop:pack
```

产物默认输出到 `release/`（例如 `release/mac-arm64/Anycoding.app`）。

### 包与链接

- npm: [`@luzedong/anycoding`](https://www.npmjs.com/package/@luzedong/anycoding)
- GitHub: [`luzedong/anycoding`](https://github.com/luzedong/anycoding)

---

## 哪个选项更适合你？

这个 fork 面向希望在本地 CLI 工具之上使用 shell-first UI 的开发者。

| | luzedong fork |
|---|---|
| **适合对象** | 需要本地 agent 会话 shell-first UI 的开发者 |
| **访问方式** | 浏览器通过 `[yourip]:port` 访问 |
| **安装方式** | `npx @luzedong/anycoding` |
| **机器需保持开机** | 是 |
| **移动端访问** | 网络内任意浏览器 |
| **可用会话** | 自动发现本地项目与 session 历史 |
| **支持 Agents** | Claude Code、Cursor CLI、Codex、Gemini CLI、OpenCode |
| **Files / Git / MCP** | UI 内置 |
| **包名** | `@luzedong/anycoding` |

**🔒 重要提示**: 所有 Claude Code 工具默认**禁用**，可防止潜在的有害操作自动运行。

### 启用工具

1. **打开工具设置** - 点击侧边栏齿轮图标
2. **选择性启用** - 仅启用所需工具
3. **应用设置** - 偏好设置保存在本地

<div align="center">

![工具设置弹窗](public/screenshots/tools-modal.png)
*工具设置界面 - 只启用你需要的内容*

</div>

**推荐做法**: 先启用基础工具，再根据需要添加其他工具。随时可以调整。

---

## 插件

Anycoding 配备插件系统，允许你添加带自定义前端 UI 和可选 Node.js 后端的选项卡。在 Settings > Plugins 中直接从 Git 仓库安装插件，或自行开发。

### 可用插件

| 插件 | 描述 |
|---|---|
| **[Project Stats](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** | 展示当前项目的文件数、代码行数、文件类型分布、最大文件以及最近修改的文件 |

### 自行构建

**[Plugin Starter Template →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** — Fork 该仓库以构建自己的插件。示例包括前端渲染、实时上下文更新和 RPC 通信。

**[插件文档 →](https://anycoding.ai/docs/plugin-overview)** — 提供插件 API、清单格式、安全模型等完整指南。

---

## 常见问题

<details>
<summary>与 Claude Code Remote Control 有何不同？</summary>

Claude Code Remote Control 让你发送消息到本地终端中已经运行的会话。该方式要求你的机器保持开机，终端保持开启，断开网络后约 10 分钟会话会超时。

Anycoding 与 Anycoding Cloud 是对 Claude Code 的扩展，而非旁观 — MCP 服务器、权限、设置、会话与 Claude Code 完全一致。

- **覆盖全部会话** — Anycoding 会自动扫描 `~/.claude` 文件夹中的每个会话。Remote Control 只暴露当前活动的会话。
- **设置统一** — 在 Anycoding 中修改的 MCP、工具权限等设置会立即写入 Claude Code。
- **支持更多 Agents** — Claude Code、Cursor CLI、Codex、Gemini CLI。
- **完整 UI** — 除了聊天界面，还包括文件浏览器、Git 集成、MCP 管理和 Shell 终端。
- **Anycoding Cloud 保持运行于云端** — 关闭本地设备也不会中断代理运行，无需监控终端。

</details>

<details>
<summary>需要额外购买 AI 订阅吗？</summary>

需要。Anycoding 只提供环境。你仍需自行获取 Claude、Cursor、Codex 或 Gemini 订阅。Anycoding Cloud 从 $7/月起提供托管环境。

</details>

<details>
<summary>能在手机上使用 Anycoding 吗？</summary>

可以。自托管时，在你的设备上运行服务器，然后在网络中的任意浏览器打开 `[yourip]:port`。Anycoding Cloud 可从任意设备访问，内置原生应用也在开发中。

</details>

<details>
<summary>UI 中的更改会影响本地 Claude Code 配置吗？</summary>

会的。自托管模式下，Anycoding 读取并写入 Claude Code 使用的 `~/.claude` 配置。通过 UI 添加的 MCP 服务器会立即在 Claude Code 中可见。

</details>

---

## 社区与支持

- **[文档](https://anycoding.ai/docs)** — 安装、配置、功能与故障排除指南
- **[GitHub Issues](https://github.com/luzedong/anycoding/issues)** — 报告 Bug 与建议功能
- **[贡献指南](CONTRIBUTING.md)** — 如何参与项目贡献

## 许可证

GNU 通用公共许可证 v3.0 - 详见 [LICENSE](LICENSE) 文件。

该项目为开源软件，在 GPL v3 许可证下可自由使用、修改与分发。

## 致谢

### 使用技术
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - Anthropic 官方 CLI
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** - Cursor 官方 CLI
- **[Codex](https://developers.openai.com/codex)** - OpenAI Codex
- **[Gemini-CLI](https://geminicli.com/)** - Google Gemini CLI
- **[React](https://react.dev/)** - 用户界面库
- **[Vite](https://vitejs.dev/)** - 快速构建工具与开发服务器
- **[Tailwind CSS](https://tailwindcss.com/)** - 实用先行 CSS 框架
- **[CodeMirror](https://codemirror.net/)** - 高级代码编辑器
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** *(可选)* - AI 驱动的项目管理与任务规划

### 赞助商
- [Siteboon - AI powered website builder](https://siteboon.ai)
---

<div align="center">
  <strong>为 Claude Code、Cursor、Codex、Gemini CLI 和 OpenCode 社区精心打造。</strong>
</div>
