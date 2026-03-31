<div align="center">
  <img src="public/logo.svg" alt="Claude Code UI" width="64" height="64">
  <h1>Claude Code UI（luzedong fork）</h1>
  <p><a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a>、<a href="https://docs.cursor.com/en/cli/overview">Cursor CLI</a>、<a href="https://developers.openai.com/codex">Codex</a>、<a href="https://geminicli.com/">Gemini-CLI</a>、OpenCode のためのデスクトップ／モバイル UI。<br>この fork は shell-first ワークフロー向けに調整されており、マルチプロバイダ shell、プロジェクト単位の shell 履歴、ファイル、Git、MCP、モバイルアクセスを提供します。</p>
</div>

<p align="center">
  <a href="https://github.com/luzedong/claudecodeui">GitHub</a> · <a href="https://github.com/luzedong/claudecodeui/issues">バグ報告</a> · <a href="https://www.npmjs.com/package/@luzedong/claude-code-ui">npm</a> · <a href="CONTRIBUTING.md">コントリビュート</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@luzedong/claude-code-ui"><img src="https://img.shields.io/badge/npm-%40luzedong%2Fclaude--code--ui-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm package"></a>
  <a href="https://github.com/luzedong/claudecodeui"><img src="https://img.shields.io/badge/GitHub-luzedong%2Fclaudecodeui-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository"></a>
</p>

<div align="right"><i><a href="./README.md">English</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.zh-CN.md">中文</a> · <b>日本語</b></i></div>

---

## 機能

- **Shell-first ワークスペース** - chat-first ではなく永続的な shell セッション中心の設計
- **マルチプロバイダ Shell** - Claude Code、Codex、Cursor 系セッション、Gemini CLI、OpenCode、通常の system shell を 1 つの UI から起動
- **プロジェクトごとの Shell 履歴** - プロジェクトを切り替えると対応する shell ワークスペースを復元
- **プロバイダ対応の新規 Shell 作成** - ヘッダーからプロバイダ別に shell を作成し、対応するアイコンを表示
- **レスポンシブデザイン** - デスクトップ、タブレット、モバイル対応
- **ファイルエクスプローラー** - シンタックスハイライトとライブ編集に対応したインタラクティブなファイルツリー
- **Git エクスプローラー** - 変更の表示、ステージ、コミット、ブランチ切り替え
- **セッション管理** - サイドバーからプロジェクトと session の履歴を参照
- **プラグインシステム** - カスタムタブ、バックエンドサービス、連携を追加して UI を拡張。[自分で構築する →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)
- **TaskMaster AI Integration** *(Optional)* - AI ベースのタスク計画、PRD 解析、ワークフロー自動化
- **モデル互換性** - Claude、GPT、Gemini 系モデルに対応（完全な一覧は [`shared/modelConstants.js`](shared/modelConstants.js) を参照）

## クイックスタート

### セルフホスト

この fork を **npx** ですぐ実行できます（**Node.js** v22+ が必要）：

```bash
npx @luzedong/claude-code-ui
```

またはグローバルインストール：

```bash
npm install -g @luzedong/claude-code-ui
cloudcli
```

`http://localhost:3001` を開くと、既存のローカルプロジェクトとセッションが自動的に検出されます。

### ソースから実行

```bash
git clone https://github.com/luzedong/claudecodeui.git
cd claudecodeui
npm install
npm run dev
```

### パッケージ / リンク

- npm: [`@luzedong/claude-code-ui`](https://www.npmjs.com/package/@luzedong/claude-code-ui)
- GitHub: [`luzedong/claudecodeui`](https://github.com/luzedong/claudecodeui)

---

## どんな人向け？

この fork は、ローカル CLI ツールの上に shell-first な UI を求める開発者向けです。

| | luzedong fork |
|---|---|
| **対象ユーザー** | ローカル agent セッション向けの shell-first UI が欲しい開発者 |
| **アクセス方法** | ブラウザ（`[yourip]:port`） |
| **セットアップ** | `npx @luzedong/claude-code-ui` |
| **マシンの稼働継続** | はい |
| **モバイルアクセス** | 同一ネットワーク内の任意のブラウザ |
| **利用可能なセッション** | ローカルのプロジェクト／session 履歴を自動検出 |
| **対応エージェント** | Claude Code、Cursor CLI、Codex、Gemini CLI、OpenCode |
| **Files / Git / MCP** | UI に内蔵 |
| **パッケージ名** | `@luzedong/claude-code-ui` |

---

## セキュリティとツール設定

**🔒 重要**: Claude Code のツールはデフォルトで **無効** です。これにより、潜在的に危険な操作が自動実行されるのを防ぎます。

### ツールを有効にする

1. **ツール設定を開く** - サイドバーの歯車アイコンをクリック
2. **必要なものだけ有効化** - 必要なツールのみオンにする
3. **設定を保存** - 設定はローカルに保存されます

<div align="center">

![Tools Settings Modal](public/screenshots/tools-modal.png)
*必要なものだけ有効化できる Tools Settings 画面*

</div>

---

## プラグイン

この fork でもプラグインシステムは利用できます。独自 UI を持つカスタムタブや、必要に応じて Node.js バックエンドを追加できます。**Settings > Plugins** から git リポジトリのプラグインを追加するか、自分で作成できます。

### 利用可能なプラグイン

| Plugin | Description |
|---|---|
| **[Project Stats](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** | 現在のプロジェクトについて、ファイル数、コード行数、ファイル種別の内訳、最大ファイル、最近変更されたファイルを表示 |
| **[Web Terminal](https://github.com/cloudcli-ai/cloudcli-plugin-terminal)** | xterm.js ベースのフルターミナル（マルチタブ対応） |

### 自分で作る

**[Plugin Starter Template →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** — このリポジトリを fork して独自プラグインを作れます。フロントエンド描画、ライブコンテキスト更新、バックエンドサーバーへの RPC 通信を含む動作例が入っています。

---

## FAQ

<details>
<summary>この fork の違いは何ですか？</summary>

この fork は製品の重心を shell-first ワークフローに移しています。

- shell タブに provider ごとのアイコンを表示
- 新規 shell 作成が provider-aware
- 各プロジェクトが独自の shell ワークスペースを保持
- サイドバーの conversation search の残骸を削除し、project/session 履歴中心に整理
- npm パッケージ名とリポジトリリンクを `luzedong` fork に変更

</details>

<details>
<summary>スマホでも使えますか？</summary>

はい。サーバーを自分のマシンで起動し、同じネットワーク上のブラウザから `[yourip]:port` を開いてください。

</details>

<details>
<summary>UI からの変更はローカルの Claude Code 設定にも反映されますか？</summary>

はい。アプリは CLI ツールが使うローカルの Claude 設定や project/session データを読み書きします。

</details>

---

## コミュニティ & サポート

- **[GitHub Repository](https://github.com/luzedong/claudecodeui)** — ソースコードとリリース
- **[GitHub Issues](https://github.com/luzedong/claudecodeui/issues)** — バグ報告と機能要望
- **[npm Package](https://www.npmjs.com/package/@luzedong/claude-code-ui)** — インストール可能なパッケージ
- **[Contributing Guide](CONTRIBUTING.md)** — コントリビュート方法

## ライセンス

GNU General Public License v3.0 - 詳細は [LICENSE](LICENSE) を参照してください。

## 謝辞

### Built With
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - Anthropic の公式 CLI
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** - Cursor の公式 CLI
- **[Codex](https://developers.openai.com/codex)** - OpenAI Codex
- **[Gemini-CLI](https://geminicli.com/)** - Google Gemini CLI
- **[React](https://react.dev/)** - UI ライブラリ
- **[Vite](https://vitejs.dev/)** - 高速ビルドツールと開発サーバー
- **[Tailwind CSS](https://tailwindcss.com/)** - ユーティリティファースト CSS
- **[CodeMirror](https://codemirror.net/)** - 高機能コードエディタ
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** *(Optional)* - AI ベースのタスク管理

<div align="center">
  <strong>Claude Code、Cursor、Codex、Gemini CLI、OpenCode コミュニティのために。</strong>
</div>

**🔒 重要なお知らせ** すべての Claude Code ツールは **デフォルトで無効** です。これにより、潜在的に有害な操作が自動的に実行されることを防ぎます。

### ツールの有効化

1. **ツール設定を開く** - サイドバーの歯車アイコンをクリック
2. **必要なツールだけを選んで有効化** - 本当に使うものだけをオンにする
3. **設定を適用** - 設定内容はローカルに保存されます

<div align="center">

![ツール設定モーダル](public/screenshots/tools-modal.png)
*Tools 設定画面 - 必要なものだけを有効にしてください*

</div>

**推奨アプローチ**: まずは基本ツールだけを有効にし、必要に応じて追加してください。これらの設定は後からいつでも調整できます。

---

## プラグイン

CloudCLI にはプラグインシステムがあり、独自のフロントエンド UI と（必要に応じて）Node.js バックエンドを持つカスタムタブを追加できます。プラグインは **Settings > Plugins** から git リポジトリを直接指定してインストールするか、自作できます。

### 利用可能なプラグイン

| プラグイン | 説明 |
|---|---|
| **[Project Stats](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** | 現在のプロジェクトについて、ファイル数、コード行数、ファイル種別の内訳、最大ファイル、最近変更されたファイルを表示 |

### 自作する

**[Plugin Starter Template →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** — このリポジトリを fork して独自プラグインを作れます。フロントエンド描画、ライブコンテキスト更新、バックエンドサーバーへの RPC 通信を含む動作例が入っています。

**[プラグインのドキュメント →](https://cloudcli.ai/docs/plugin-overview)** — プラグイン API、manifest 形式、セキュリティモデルなどの完全ガイド。

---
## FAQ

<details>
<summary>Claude Code Remote Control とはどう違いますか？</summary>

Claude Code Remote Control は、ローカル端末で既に動作しているセッションへメッセージを送れる仕組みです。マシンを起動したままにし、端末も開いたままにする必要があり、ネットワーク接続がない状態が約 10 分続くとセッションがタイムアウトします。

CloudCLI UI と CloudCLI Cloud は、Claude Code の横に別物として存在するのではなく、Claude Code を拡張します — MCP サーバー、権限、設定、セッションは Claude Code がネイティブに使うものと完全に同一です。複製したり、別系統で管理したりしません。

- **すべてのセッションにアクセス** — CloudCLI UI は `~/.claude` フォルダのすべてのセッションを自動検出します。Remote Control は、Claude モバイルアプリで利用可能にするため、1つのアクティブセッションだけを公開します。
- **設定はあなたの設定** — CloudCLI UI で変更した MCP サーバー、ツール権限、プロジェクト構成は、Claude Code の設定に直接書き込まれて即座に反映され、その逆（Claude Code での変更が UI に反映）も同様です。
- **対応エージェントがさらに充実** — Claude Code に加えて Cursor CLI、Codex、Gemini CLI、OpenCode にも対応しています。
- **チャット窓だけではない完全な UI** — ファイルエクスプローラー、Git 統合、MCP 管理、シェル端末などがすべて組み込まれています。
- **CloudCLI Cloud はクラウド上で稼働** — ノートパソコンを閉じてもエージェントは動き続けます。監視が要る端末も、スリープ防止も不要です。

</details>

<details>
<summary>AI のサブスクリプションは別途支払いが必要ですか？</summary>

はい。CloudCLI は環境を提供するものであり、AI は含まれません。Claude、Cursor、Codex、または Gemini のサブスクリプションはご自身でご用意ください。CloudCLI Cloud のホスティング環境はそれに加えて月額 $7 から提供されます。

</details>

<details>
<summary>CloudCLI UI をスマホで使えますか？</summary>

はい。セルフホストの場合は、自身のマシンでサーバーを起動し、ネットワーク内のブラウザで `[yourip]:port` を開いてください。CloudCLI Cloud を使う場合は、任意のデバイスからアクセスできます。VPN もポートフォワーディングも不要で、セットアップも不要です。ネイティブアプリも開発中です。

</details>

<details>
<summary>UI で加えた変更はローカルの Claude Code 設定に影響しますか？</summary>

はい、セルフホストの場合です。CloudCLI UI は Claude Code がネイティブに使う `~/.claude` 設定を読み書きします。UI から追加した MCP サーバーは即座に Claude Code に反映され、その逆も同様です。

</details>

---

## コミュニティとサポート

- **[ドキュメント](https://cloudcli.ai/docs)** — インストール、設定、機能、トラブルシューティング
- **[GitHub Issues](https://github.com/siteboon/claudecodeui/issues)** — バグ報告と機能要望
- **[コントリビューションガイド](CONTRIBUTING.md)** — プロジェクトへの貢献方法

## ライセンス

GNU General Public License v3.0 - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

このプロジェクトはオープンソースであり、GPL v3 ライセンスの下で無料で使用、修正、再配布できます。

## 謝辞

### 使用技術

- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - Anthropic の公式 CLI
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** - Cursor の公式 CLI
- **[Codex](https://developers.openai.com/codex)** - OpenAI Codex
- **[Gemini-CLI](https://geminicli.com/)** - Google Gemini CLI
- **[React](https://react.dev/)** - ユーザーインターフェースライブラリ
- **[Vite](https://vitejs.dev/)** - 高速ビルドツールと開発サーバー
- **[Tailwind CSS](https://tailwindcss.com/)** - ユーティリティファーストの CSS フレームワーク
- **[CodeMirror](https://codemirror.net/)** - 高度なコードエディタ
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** *(オプション)* - AI を活用したプロジェクト管理とタスク計画

## スポンサー
- [Siteboon - AI を活用したウェブサイトビルダー](https://siteboon.ai)
---

<div align="center">
  <strong>Claude Code、Cursor、Codex、Gemini CLI、OpenCode コミュニティのために心を込めて作りました。</strong>
</div>
