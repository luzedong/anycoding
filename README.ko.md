<div align="center">
  <img src="public/logo.svg" alt="Anycoding" width="64" height="64">
  <h1>Anycoding</h1>
  <p><a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a>, <a href="https://docs.cursor.com/en/cli/overview">Cursor CLI</a>, <a href="https://developers.openai.com/codex">Codex</a>, <a href="https://geminicli.com/">Gemini-CLI</a>, OpenCode용 데스크톱 및 모바일 UI입니다.<br>이 포크는 CLI-first 워크플로에 맞춰 조정되었으며, 멀티 provider CLI, 프로젝트별 CLI 기록, 파일, Git, MCP, 모바일 접근을 제공합니다.</p>
</div>

<p align="center">
  <a href="https://github.com/luzedong/anycoding">GitHub</a> · <a href="https://github.com/luzedong/anycoding/issues">버그 신고</a> · <a href="https://www.npmjs.com/package/@luzedong/anycoding">npm</a> · <a href="CONTRIBUTING.md">기여 안내</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@luzedong/anycoding"><img src="https://img.shields.io/badge/npm-%40luzedong%2Fanycoding-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm package"></a>
  <a href="https://github.com/luzedong/anycoding"><img src="https://img.shields.io/badge/GitHub-luzedong%2Fanycoding-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository"></a>
</p>

<div align="right"><i><a href="./README.md">English</a> · <a href="./README.ru.md">Русский</a> · <a href="./README.de.md">Deutsch</a> · <b>한국어</b> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a></i></div>

---

## 기능

- **CLI-first 워크스페이스** - chat-first 흐름이 아니라 지속되는 CLI 세션 중심으로 설계
- **멀티 provider CLI** - 하나의 UI에서 Claude Code, Codex, Cursor 계열 세션, Gemini CLI, OpenCode, 일반 system CLI 실행
- **프로젝트별 CLI 기록** - 프로젝트를 전환해도 해당 CLI 워크스페이스를 복원
- **Provider 인식 CLI 생성** - 헤더에서 provider별 CLI을 바로 만들고 해당 아이콘 표시
- **반응형 디자인** - 데스크톱, 태블릿, 모바일 지원
- **파일 탐색기** - 구문 강조와 실시간 편집을 갖춘 인터랙티브 파일 트리
- **Git 탐색기** - 변경 사항 보기, 스테이징, 커밋, 브랜치 전환
- **세션 관리** - 사이드바에서 프로젝트와 session 기록 탐색
- **플러그인 시스템** - 커스텀 탭, 백엔드 서비스, 통합으로 UI 확장. [직접 빌드 →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)
- **TaskMaster AI 통합** *(선택 사항)* - AI 기반 작업 계획, PRD 파싱, 워크플로 자동화
- **모델 호환성** - Claude, GPT, Gemini 계열 모델 지원 (`shared/modelConstants.js` 참고)

## 빠른 시작

### 셀프 호스트

이 포크를 **npx**로 바로 실행할 수 있습니다 (**Node.js** v22+ 필요):

```bash
npx @luzedong/anycoding
```

또는 전역 설치:

```bash
npm install -g @luzedong/anycoding
anycoding
```

`http://localhost:3001`을 열면 기존 로컬 프로젝트와 세션이 자동으로 발견됩니다.

### 소스에서 실행

```bash
git clone https://github.com/luzedong/anycoding.git
cd anycoding
npm install
npm run dev
```

### 패키지 / 링크

- npm: [`@luzedong/anycoding`](https://www.npmjs.com/package/@luzedong/anycoding)
- GitHub: [`luzedong/anycoding`](https://github.com/luzedong/anycoding)

---

## 누구에게 적합한가요?

Anycoding과 `claudecodeui`는 모두 로컬 agent 세션용 오픈소스 UI이지만, 기본 상호작용 모델, README에 명시된 provider 범위, 배포/생태 링크에서 차이가 있습니다.

| | Anycoding | claudecodeui |
|---|---|---|
| **기본 상호작용 모델** | CLI-first 워크스페이스 (provider-aware CLI 탭, 프로젝트별 CLI 기록/워크스페이스) | 채팅 UI + 통합 셸 터미널 (업스트림 README 기준) |
| **README에 명시된 Providers** | Claude Code, Cursor CLI, Codex, Gemini CLI, OpenCode | Claude Code, Cursor CLI, Codex, Gemini CLI |
| **설치** | `npx @luzedong/anycoding` | `npx @siteboon/claude-code-ui` |
| **글로벌 명령어** | `anycoding` | `cloudcli` |
| **저장소 / Issues** | `luzedong/anycoding` | `siteboon/claudecodeui` |
| **패키지명** | `@luzedong/anycoding` | `@siteboon/claude-code-ui` |
| **CloudCLI Cloud 안내 링크** | 이 저장소의 주축 아님 | 공식 안내 링크가 기본 포함 |
| **핵심 로컬 기능** | CLI 세션 + Files + Git + MCP + 플러그인 | CLI 세션 + Files + Git + MCP + 플러그인 |
| **머신 유지 필요(셀프호스트)** | 예 | 예 |

---

## 보안 및 도구 구성

**🔒 중요**: Claude Code 도구는 기본적으로 **비활성화**되어 있습니다. 잠재적으로 위험한 작업이 자동 실행되는 것을 막기 위함입니다.

### 도구 활성화

1. **도구 설정 열기** - 사이드바의 톱니바퀴 아이콘 클릭
2. **필요한 것만 활성화** - 필요한 도구만 켜기
3. **설정 저장** - 설정은 로컬에 저장됨

<div align="center">

![Tools Settings Modal](public/screenshots/tools-modal.png)
*필요한 도구만 활성화할 수 있는 Tools Settings 화면*

</div>

---

## 플러그인

이 포크도 플러그인 시스템을 유지합니다. 자체 프론트엔드 UI와 선택적 Node.js 백엔드를 가진 커스텀 탭을 추가할 수 있습니다. **Settings > Plugins**에서 git 저장소 기반 플러그인을 설치하거나 직접 만들 수 있습니다.

### 사용 가능한 플러그인

| Plugin | Description |
|---|---|
| **[Project Stats](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** | 현재 프로젝트의 파일 수, 코드 줄 수, 파일 유형 분포, 가장 큰 파일, 최근 수정 파일 표시 |
| **[Web Terminal](https://github.com/cloudcli-ai/cloudcli-plugin-terminal)** | 멀티 탭을 지원하는 전체 xterm.js 터미널 |

### 직접 만들기

**[Plugin Starter Template →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** — 이 저장소를 fork 해서 자신만의 플러그인을 만들 수 있습니다. 프론트엔드 렌더링, 실시간 컨텍스트 업데이트, 백엔드 서버와의 RPC 통신 예제가 포함되어 있습니다.

---

## FAQ

<details>
<summary>이 포크는 무엇이 다른가요?</summary>

이 포크는 제품의 중심을 CLI-first 워크플로로 옮겼습니다.

- CLI 탭에 provider별 아이콘 표시
- 새 CLI 생성이 provider-aware
- 각 프로젝트가 자체 CLI 워크스페이스 유지
- 사이드바의 conversation search 잔재를 제거하고 project/session 기록 중심으로 정리
- npm 패키지명과 저장소 링크를 `luzedong` 포크 기준으로 변경

</details>

<details>
<summary>휴대폰에서도 사용할 수 있나요?</summary>

네. 서버를 자신의 머신에서 실행한 뒤, 같은 네트워크의 브라우저에서 `[yourip]:port`를 열면 됩니다.

</details>

<details>
<summary>UI에서 변경한 내용이 로컬 Claude Code 설정에도 반영되나요?</summary>

네. 이 앱은 CLI 도구가 사용하는 로컬 Claude 설정과 project/session 데이터를 읽고 씁니다.

</details>

---

## 커뮤니티 & 지원

- **[GitHub Repository](https://github.com/luzedong/anycoding)** — 소스 코드와 릴리스
- **[GitHub Issues](https://github.com/luzedong/anycoding/issues)** — 버그 신고와 기능 요청
- **[npm Package](https://www.npmjs.com/package/@luzedong/anycoding)** — 설치 가능한 패키지
- **[Contributing Guide](CONTRIBUTING.md)** — 기여 방법

## 라이선스

GNU General Public License v3.0 - 자세한 내용은 [LICENSE](LICENSE)를 참고하세요.

## 감사의 말

### Built With
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - Anthropic 공식 CLI
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** - Cursor 공식 CLI
- **[Codex](https://developers.openai.com/codex)** - OpenAI Codex
- **[Gemini-CLI](https://geminicli.com/)** - Google Gemini CLI
- **[React](https://react.dev/)** - UI 라이브러리
- **[Vite](https://vitejs.dev/)** - 빠른 빌드 도구와 개발 서버
- **[Tailwind CSS](https://tailwindcss.com/)** - 유틸리티 중심 CSS 프레임워크
- **[CodeMirror](https://codemirror.net/)** - 고급 코드 에디터
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** *(Optional)* - AI 기반 작업 관리

<div align="center">
  <strong>Claude Code, Cursor, Codex, Gemini CLI, OpenCode 커뮤니티를 위해.</strong>
</div>

**🔒 중요 공지**: 모든 Claude Code 도구는 **기본적으로 비활성화**되어 있습니다. 이는 잠재적인 유해 작업이 자동 실행되는 것을 방지하기 위한 조치입니다.

### 도구 활성화

1. **도구 설정 열기** - 사이드바의 톱니바퀴 아이콘 클릭
2. **선택적으로 활성화** - 필요한 도구만 켜기
3. **설정 적용** - 선호도는 로컬에 저장됨

<div align="center">

![도구 설정 모달](public/screenshots/tools-modal.png)
*도구 설정 인터페이스 - 필요한 것만 켜세요*

</div>

**권장 방법**: 기본 도구를 먼저 켜고 필요할 때 추가하세요. 언제든지 조정 가능합니다.

---

## 플러그인

Anycoding는 커스텀 탭과 선택적 Node.js 백엔드가 포함된 플러그인 시스템을 제공합니다. Settings > Plugins에서 Git 저장소에서 플러그인을 설치하거나 직접 빌드할 수 있습니다.

### 이용 가능한 플러그인

| 플러그인 | 설명 |
|---|---|
| **[Project Stats](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** | 현재 프로젝트의 파일 수, 코드 줄 수, 파일 유형 분포, 가장 큰 파일, 최근 수정 파일을 표시 |

### 직접 만들기

**[Plugin Starter Template →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** — 이 저장소를 포크하여 플러그인 구축. 프런트엔드 렌더링, 실시간 컨텍스트 업데이트, RPC 통신 예제 포함.

**[플러그인 문서 →](https://anycoding.ai/docs/plugin-overview)** — 플러그인 API, 매니페스트 포맷, 보안 모델 등을 설명.

---

## FAQ

<details>
<summary>Claude Code Remote Control과 어떻게 다른가요?</summary>

Claude Code Remote Control은 이미 로컬 터미널에서 실행 중인 세션으로 메시지를 전송합니다. 이 경우 기계가 켜져 있어야 하고 터미널을 열어 둬야 하며, 네트워크 연결 없이 약 10분 후 타임아웃됩니다.

Anycoding와 Anycoding Cloud는 Claude Code를 확장하며 별도로 존재하지 않습니다 — MCP 서버, 권한, 설정, 세션은 Claude Code에서 그대로 사용됩니다.

- **모든 세션을 다룬다** — Anycoding는 `~/.claude` 폴더에서 모든 세션을 자동 발견합니다. Remote Control은 단일 활성 세션만 노출합니다.
- **설정은 그대로** — Anycoding에서 변경한 MCP, 도구 권한, 프로젝트 설정은 Claude Code에 즉시 반영됩니다.
- **지원 에이전트가 더 많음** — Claude Code, Cursor CLI, Codex, Gemini CLI, OpenCode 지원.
- **전체 UI 제공** — 단일 채팅 창이 아닌 파일 탐색기, Git 통합, MCP 관리 및 셸 터미널 포함.
- **Anycoding Cloud는 클라우드에서 실행** — 노트북을 닫아도 에이전트가 실행됩니다. 터미널을 계속 확인할 필요 없음.

</details>

<details>
<summary>AI 구독을 별도로 결제해야 하나요?</summary>

네. Anycoding는 환경만 제공합니다. Claude, Cursor, Codex, Gemini 구독 비용은 별도로 부과됩니다. Anycoding Cloud는 관리형 환경을 월 $7부터 제공합니다.

</details>

<details>
<summary>Anycoding를 휴대폰에서 사용할 수 있나요?</summary>

네. 셀프 호스트인 경우 기계에서 서버를 실행하고 네트워크의 아무 브라우저에서 `[yourip]:port`를 열면 됩니다. Anycoding Cloud는 어떤 기기에서도 열 수 있으며, 네이티브 앱도 준비 중입니다.

</details>

<details>
<summary>UI에서 변경하면 로컬 Claude Code 설정에 영향을 주나요?</summary>

네, 셀프 호스트에서는 그렇습니다. Anycoding는 Claude Code가 사용하는 동일한 `~/.claude` 설정을 읽고 씁니다. UI에서 추가한 MCP 서버가 Claude Code에 즉시 나타납니다.

</details>

---

## 커뮤니티 및 지원

- **[문서](https://anycoding.ai/docs)** — 설치, 구성, 기능, 문제 해결 안내
- **[GitHub Issues](https://github.com/luzedong/anycoding/issues)** — 버그 보고 및 기능 요청
- **[기여 안내](CONTRIBUTING.md)** — 프로젝트 참여 방법

## 라이선스

GNU General Public License v3.0 - 자세한 내용은 [LICENSE](LICENSE) 파일 참조.

이 프로젝트는 GPL v3 라이선스 하에 오픈 소스로 공개되어 있으며 자유롭게 사용, 수정, 배포할 수 있습니다.

## 감사의 말

### 원본 프로젝트
- 이 프로젝트는 [siteboon/claudecodeui](https://github.com/siteboon/claudecodeui)에서 시작되었습니다. 업스트림 유지관리자와 기여자들께 감사드립니다.

### 사용 기술
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - Anthropic 공식 CLI
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** - Cursor 공식 CLI
- **[Codex](https://developers.openai.com/codex)** - OpenAI Codex
- **[Gemini-CLI](https://geminicli.com/)** - Google Gemini CLI
- **[React](https://react.dev/)** - 사용자 인터페이스 라이브러리
- **[Vite](https://vitejs.dev/)** - 빠른 빌드 도구 및 개발 서버
- **[Tailwind CSS](https://tailwindcss.com/)** - 유틸리티 우선 CSS 프레임워크
- **[CodeMirror](https://codemirror.net/)** - 고급 코드 에디터
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** *(선택사항)* - AI 기반 프로젝트 관리 및 작업 계획

<div align="center">
  <strong>Claude Code, Cursor, Codex, Gemini CLI, OpenCode 커뮤니티를 위해 정성껏 제작되었습니다.</strong>
</div>
