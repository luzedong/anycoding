<div align="center">
  <img src="public/logo.svg" alt="Anycoding" width="64" height="64">
  <h1>Anycoding (luzedong fork)</h1>
  <p>A CLI-first desktop and mobile UI for local agent sessions with <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a>, <a href="https://docs.cursor.com/en/cli/overview">Cursor CLI</a>, <a href="https://developers.openai.com/codex">Codex</a>, <a href="https://geminicli.com/">Gemini-CLI</a>, and <a href="https://opencode.ai/">OpenCode</a>.<br>This fork is tuned for a CLI-first workspace with persistent CLIs per project, project-aware CLI history, files, Git, MCP, and mobile access.</p>
</div>

<p align="center">
  <a href="https://github.com/luzedong/anycoding">GitHub</a> · <a href="https://github.com/luzedong/anycoding/issues">Bug Reports</a> · <a href="https://www.npmjs.com/package/@luzedong/anycoding">npm</a> · <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@luzedong/anycoding"><img src="https://img.shields.io/badge/npm-%40luzedong%2Fanycoding-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm package"></a>
  <a href="https://github.com/luzedong/anycoding"><img src="https://img.shields.io/badge/GitHub-luzedong%2Fanycoding-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository"></a>
</p>

<div align="right"><i><b>English</b> · <a href="./README.ru.md">Русский</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a></i></div>

---

## Features

- **CLI-first Workspace** - Optimized around persistent CLI sessions instead of a chat-first flow
- **Multi-provider CLIs** - Launch Claude Code, Codex, Cursor-compatible sessions, Gemini CLI, OpenCode, or plain system CLIs from one UI
- **Per-project CLI History** - Each project keeps its own CLIs so switching projects restores the right workspace
- **Provider-aware CLI Creation** - Create new CLIs directly from the header with provider-specific actions and icons
- **Responsive Design** - Works across desktop, tablet, and mobile
- **File Explorer** - Interactive file tree with syntax highlighting and live editing
- **Git Explorer** - View, stage and commit your changes. You can also switch branches
- **Session Management** - Browse project and session history from the sidebar
- **Plugin System** - Extend the UI with custom plugins — add new tabs, backend services, and integrations. [Build your own →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)
- **TaskMaster AI Integration** *(Optional)* - Advanced project management with AI-powered task planning, PRD parsing, and workflow automation
- **Model Compatibility** - Works with Claude, GPT, and Gemini model families (see [`shared/modelConstants.js`](shared/modelConstants.js) for the full list of supported models)

## Screenshots

<div align="center">

![Desktop Workspace](public/screenshots/desktop-main.png)
*Desktop workspace overview*

![CLI Selection](public/screenshots/cli-selection.png)
*Provider-aware CLI selection*

</div>

## Quick Start

### Self-Hosted

Try this fork instantly with **npx** (requires **Node.js** v22+):

```
npx @luzedong/anycoding
```

Or install **globally** for regular use:

```
npm install -g @luzedong/anycoding
anycoding
```

Open `http://localhost:3001` — existing local projects and sessions are discovered automatically.

### From Source

```
git clone https://github.com/luzedong/anycoding.git
cd anycoding
npm install
npm run dev
```

### Build As A macOS App

This repository now includes an Electron desktop wrapper, so you can package it as a native macOS app.

```bash
# Build and run desktop app locally
npm run desktop:start

# Build an unsigned .app bundle (fast local verification)
npm run desktop:pack:dir

# Build distributable archives
npm run desktop:pack
```

Output artifacts are generated under `release/` (for example `release/mac-arm64/Anycoding.app`).

### Package / Links

- npm: [`@luzedong/anycoding`](https://www.npmjs.com/package/@luzedong/anycoding)
- GitHub: [`luzedong/anycoding`](https://github.com/luzedong/anycoding)

---

## Which option is right for you?

This fork is aimed at developers who want a self-hosted CLI-first UI on top of their local CLI tools.

| | luzedong fork |
|---|---|
| **Best for** | Developers who want a CLI-first UI for local agent sessions |
| **How you access it** | Browser via `[yourip]:port` |
| **Setup** | `npx @luzedong/anycoding` |
| **Machine needs to stay on** | Yes |
| **Mobile access** | Any browser on your network |
| **Sessions available** | Project and session history auto-discovered from local data |
| **Agents supported** | Claude Code, Cursor CLI, Codex, Gemini CLI, OpenCode |
| **Files / Git / MCP** | Built into the UI |
| **Package** | `@luzedong/anycoding` |

---

## Security & Tools Configuration

**🔒 Important Notice**: All Claude Code tools are **disabled by default**. This prevents potentially harmful operations from running automatically.

### Enabling Tools

To use Claude Code's full functionality, you'll need to manually enable tools:

1. **Open Tools Settings** - Click the gear icon in the sidebar
2. **Enable Selectively** - Turn on only the tools you need
3. **Apply Settings** - Your preferences are saved locally

<div align="center">

![Tools Settings Modal](public/screenshots/tools-modal.png)
*Tools Settings interface - enable only what you need*

</div>

**Recommended approach**: Start with basic tools enabled and add more as needed. You can always adjust these settings later.

---

## Plugins

This fork keeps the plugin system, so you can add custom tabs with their own frontend UI and optional Node.js backend. Install plugins from git repos directly in **Settings > Plugins**, or build your own.

### Available Plugins

| Plugin | Description |
|---|---|
| **[Project Stats](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** | Shows file counts, lines of code, file-type breakdown, largest files, and recently modified files for your current project |
| **[Web Terminal](https://github.com/cloudcli-ai/cloudcli-plugin-terminal)** | Full xterm.js terminal with multi-tab support |

### Build Your Own

**[Plugin Starter Template →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** — fork this repo to create your own plugin. It includes a working example with frontend rendering, live context updates, and RPC communication to a backend server.

---

## FAQ

<details>
<summary>What is different in this fork?</summary>

This fork shifts the product toward a CLI-first workflow:

- CLI tabs use provider-aware icons
- new CLI creation is provider-aware
- each project keeps its own CLI workspace
- sidebar conversation-search remnants have been removed in favor of project/session history
- npm package and repository links point to the `luzedong` fork

</details>

<details>
<summary>Can I use it on my phone?</summary>

Yes. Run the server on your machine and open `[yourip]:port` in any browser on your network.

</details>

<details>
<summary>Will changes I make in the UI affect my local Claude Code setup?</summary>

Yes. The app reads from and writes to the same local Claude configuration and project/session data used by your CLI tools.

</details>

---

## Community & Support

- **[GitHub Repository](https://github.com/luzedong/anycoding)** — source code and releases
- **[GitHub Issues](https://github.com/luzedong/anycoding/issues)** — bug reports and feature requests
- **[npm Package](https://www.npmjs.com/package/@luzedong/anycoding)** — installable package
- **[Contributing Guide](CONTRIBUTING.md)** — how to contribute to the project

## License

GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later) — see [LICENSE](LICENSE) for the full text, including additional terms under Section 7.

This project is open source and free to use, modify, and distribute under the AGPL-3.0-or-later license. If you modify this software and run it as a network service, you must make your modified source code available to users of that service.

Anycoding  - (https://anycoding.ai).

## Acknowledgments

### Built With
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - Anthropic's official CLI
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** - Cursor's official CLI
- **[Codex](https://developers.openai.com/codex)** - OpenAI Codex
- **[Gemini-CLI](https://geminicli.com/)** - Google Gemini CLI
- **[React](https://react.dev/)** - User interface library
- **[Vite](https://vitejs.dev/)** - Fast build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[CodeMirror](https://codemirror.net/)** - Advanced code editor
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** *(Optional)* - AI-powered project management and task planning

<div align="center">
  <strong>Made for the Claude Code, Cursor, Codex, Gemini CLI, and OpenCode community.</strong>
</div>
