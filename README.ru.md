<div align="center">
  <img src="public/logo.svg" alt="Anycoding" width="64" height="64">
  <h1>Anycoding</h1>
  <p>Десктопный и мобильный UI для <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a>, <a href="https://docs.cursor.com/en/cli/overview">Cursor CLI</a>, <a href="https://developers.openai.com/codex">Codex</a>, <a href="https://geminicli.com/">Gemini-CLI</a> и OpenCode.<br>Этот fork ориентирован на CLI-first workflow: мульти-provider CLI, история CLI по проектам, файлы, Git, MCP и мобильный доступ.</p>
</div>

<p align="center">
  <a href="https://github.com/luzedong/anycoding">GitHub</a> · <a href="https://github.com/luzedong/anycoding/issues">Сообщить об ошибке</a> · <a href="https://www.npmjs.com/package/@luzedong/anycoding">npm</a> · <a href="CONTRIBUTING.md">Участие в разработке</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@luzedong/anycoding"><img src="https://img.shields.io/badge/npm-%40luzedong%2Fanycoding-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm package"></a>
  <a href="https://github.com/luzedong/anycoding"><img src="https://img.shields.io/badge/GitHub-luzedong%2Fanycoding-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository"></a>
</p>

<div align="right"><i><a href="./README.md">English</a> · <b>Русский</b> · <a href="./README.de.md">Deutsch</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a></i></div>

---

## Возможности

- **CLI-first workspace** — интерфейс построен вокруг постоянных CLI-сессий, а не chat-first-сценария
- **Мульти-provider CLIs** — запускайте Claude Code, Codex, Cursor-подобные сессии, Gemini CLI, OpenCode или обычный system CLI из одного UI
- **История CLI по проектам** — у каждого проекта свои CLI-сессии; при возврате восстанавливается нужный workspace
- **Provider-aware создание CLI** — создавайте новые CLI прямо из хедера с правильными provider-иконками
- **Адаптивный дизайн** — работает на десктопе, планшете и телефоне
- **Проводник файлов** — интерактивное дерево файлов с подсветкой синтаксиса и live-редактированием
- **Git Explorer** — просмотр, stage, commit и переключение веток
- **Управление сессиями** — история проектов и session отображается в боковой панели
- **Система плагинов** — расширяйте UI кастомными вкладками, backend-сервисами и интеграциями. [Создать свой →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)
- **Интеграция с TaskMaster AI** *(опционально)* — AI-планирование задач, разбор PRD и автоматизация workflow
- **Совместимость с моделями** — поддерживаются модели Claude, GPT и Gemini (см. [`shared/modelConstants.js`](shared/modelConstants.js))

## Быстрый старт

### Self-Hosted

Попробовать этот fork можно сразу через **npx** (нужен **Node.js** v22+):

```bash
npx @luzedong/anycoding
```

Или установить глобально:

```bash
npm install -g @luzedong/anycoding
anycoding
```

Откройте `http://localhost:3001` — существующие локальные проекты и сессии будут обнаружены автоматически.

### Запуск из исходников

```bash
git clone https://github.com/luzedong/anycoding.git
cd anycoding
npm install
npm run dev
```

### Пакет / ссылки

- npm: [`@luzedong/anycoding`](https://www.npmjs.com/package/@luzedong/anycoding)
- GitHub: [`luzedong/anycoding`](https://github.com/luzedong/anycoding)

---

## Для кого это?

Anycoding и `claudecodeui` — оба open-source UI для локальных agent-сессий, но отличаются по модели взаимодействия по умолчанию, набору провайдеров в README и экосистемным ссылкам.

| | Anycoding | claudecodeui |
|---|---|---|
| **Модель взаимодействия по умолчанию** | CLI-first workspace (provider-aware CLI-вкладки, CLI-история по проектам) | Chat UI + встроенный shell-терминал (по описанию upstream README) |
| **Провайдеры, указанные в README** | Claude Code, Cursor CLI, Codex, Gemini CLI, OpenCode | Claude Code, Cursor CLI, Codex, Gemini CLI |
| **Установка** | `npx @luzedong/anycoding` | `npx @siteboon/claude-code-ui` |
| **Глобальная команда** | `anycoding` | `cloudcli` |
| **Репозиторий / Issues** | `luzedong/anycoding` | `siteboon/claudecodeui` |
| **Имя пакета** | `@luzedong/anycoding` | `@siteboon/claude-code-ui` |
| **Ссылки на CloudCLI Cloud** | Не основной фокус этого репозитория | Официальные ссылки встроены в оригинальный репозиторий |
| **Базовые локальные возможности** | CLI-сессии + Files + Git + MCP + плагины | CLI-сессии + Files + Git + MCP + плагины |
| **Машина должна быть включена (self-hosted)** | Да | Да |

---

## Безопасность и настройка инструментов

**🔒 Важно**: все инструменты Claude Code по умолчанию **отключены**. Это предотвращает автоматический запуск потенциально опасных операций.

### Как включить инструменты

1. **Откройте Tools Settings** — нажмите на иконку шестерёнки в боковой панели
2. **Включайте выборочно** — активируйте только те инструменты, которые действительно нужны
3. **Сохраните настройки** — они сохраняются локально

<div align="center">

![Tools Settings Modal](public/screenshots/tools-modal.png)
*Окно Tools Settings — включайте только нужное*

</div>

---

## Плагины

Этот fork сохраняет систему плагинов. Вы можете добавлять кастомные вкладки со своим frontend UI и, при необходимости, Node.js backend. Устанавливайте плагины из git-репозиториев через **Settings > Plugins** или создавайте свои.

### Доступные плагины

| Plugin | Description |
|---|---|
| **[Project Stats](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** | Показывает количество файлов, строки кода, разбивку по типам файлов, самые большие файлы и недавно изменённые файлы для текущего проекта |
| **[Web Terminal](https://github.com/cloudcli-ai/cloudcli-plugin-terminal)** | Полноценный xterm.js терминал с поддержкой нескольких вкладок |

### Создать свой

**[Plugin Starter Template →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** — форкните этот репозиторий, чтобы создать свой плагин. В нём есть рабочий пример с рендерингом во frontend, live-обновлением контекста и RPC-коммуникацией с backend-сервером.

---

## FAQ

<details>
<summary>Что изменено в этом fork?</summary>

Этот fork сдвигает продукт в сторону CLI-first workflow:

- CLI-вкладки используют иконки по provider
- создание новых CLI стало provider-aware
- каждый проект хранит собственный CLI-workspace
- остатки conversation-search в боковой панели удалены, упор сделан на историю project/session
- имя npm-пакета и ссылки на репозиторий переведены на fork `luzedong`

</details>

<details>
<summary>Можно ли пользоваться с телефона?</summary>

Да. Запустите сервер на своей машине и откройте `[yourip]:port` в браузере внутри той же сети.

</details>

<details>
<summary>Изменения в UI влияют на локальную конфигурацию Claude Code?</summary>

Да. Приложение читает и записывает те же локальные Claude-настройки и project/session-данные, что используют ваши CLI-инструменты.

</details>

---

## Сообщество и поддержка

- **[GitHub Repository](https://github.com/luzedong/anycoding)** — исходный код и релизы
- **[GitHub Issues](https://github.com/luzedong/anycoding/issues)** — баги и предложения
- **[npm Package](https://www.npmjs.com/package/@luzedong/anycoding)** — пакет для установки
- **[Contributing Guide](CONTRIBUTING.md)** — как участвовать в развитии проекта

## Лицензия

GNU General Public License v3.0 — подробности см. в [LICENSE](LICENSE).

## Благодарности

### Built With
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - официальный CLI от Anthropic
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** - официальный CLI от Cursor
- **[Codex](https://developers.openai.com/codex)** - OpenAI Codex
- **[Gemini-CLI](https://geminicli.com/)** - Google Gemini CLI
- **[React](https://react.dev/)** - библиотека интерфейсов
- **[Vite](https://vitejs.dev/)** - быстрый сборщик и dev-сервер
- **[Tailwind CSS](https://tailwindcss.com/)** - utility-first CSS framework
- **[CodeMirror](https://codemirror.net/)** - продвинутый редактор кода
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** *(Optional)* - AI-управление задачами и проектами

<div align="center">
  <strong>Для сообщества Claude Code, Cursor, Codex, Gemini CLI и OpenCode.</strong>
</div>


---

## Безопасность и конфигурация инструментов

**🔒 Важное примечание**: все инструменты Claude Code **по умолчанию отключены**. Это предотвращает автоматический запуск потенциально опасных операций.

### Включение инструментов

Чтобы использовать всю функциональность Claude Code, вам нужно вручную включить инструменты:

1. **Откройте настройки инструментов** - нажмите на иконку шестерёнки в боковой панели
2. **Включайте выборочно** - активируйте только те инструменты, которые вам нужны
3. **Примените настройки** - ваши предпочтения сохраняются локально

<div align="center">

![Tools Settings Modal](public/screenshots/tools-modal.png)
*Интерфейс настройки инструментов — включайте только то, что вам нужно*

</div>

**Рекомендуемый подход**: начните с базовых инструментов и добавляйте остальные по мере необходимости. Эти настройки всегда можно изменить позже.

---

## Плагины

У Anycoding есть система плагинов, которая позволяет добавлять кастомные вкладки со своим frontend UI и (опционально) Node.js бэкендом. Устанавливайте плагины напрямую из git-репозиториев в **Settings > Plugins** или создавайте свои.

### Доступные плагины

| Плагин | Описание |
|---|---|
| **[Project Stats](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** | Показывает количество файлов, строки кода, разбивку по типам файлов, самые большие файлы и недавно изменённые файлы для текущего проекта |

### Создать свой

**[Plugin Starter Template →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** — сделайте форк этого репозитория, чтобы создать свой плагин. В шаблоне есть рабочий пример с рендерингом на фронтенде, live-обновлением контекста и RPC-коммуникацией с бэкенд-сервером.

**[Plugin Documentation →](https://anycoding.ai/docs/plugin-overview)** — полный гайд по plugin API, формату манифеста, модели безопасности и другому.

---
## FAQ

<details>
<summary>Чем это отличается от Claude Code Remote Control?</summary>

Claude Code Remote Control позволяет отправлять сообщения в сессию, которая уже запущена в вашем локальном терминале. Ваша машина должна оставаться включённой, терминал — открытым, а сессии завершаются примерно через 10 минут без сетевого соединения.

Anycoding и Anycoding Cloud расширяют Claude Code, а не работают рядом с ним — ваши MCP-серверы, разрешения, настройки и сессии остаются теми же самыми, что и в нативном Claude Code. Ничего не дублируется и не управляется отдельно.

Вот что это означает на практике:

- **Все ваши сессии, а не одна** — Anycoding автоматически находит каждую сессию из папки `~/.claude`. Remote Control предоставляет только одну активную сессию, чтобы сделать её доступной в мобильном приложении Claude.
- **Ваши настройки — это ваши настройки** — MCP-серверы, права инструментов и конфигурация проекта, изменённые в Anycoding, записываются напрямую в конфиг Claude Code и вступают в силу сразу же, и наоборот.
- **Работает с большим числом агентов** — Claude Code, Cursor CLI, Codex, Gemini CLI и OpenCode, а не только Claude Code.
- **Полноценный UI, а не просто окно чата** — проводник файлов, Git-интеграция, управление MCP и CLI-терминал — всё встроено.
- **Anycoding Cloud работает в облаке** — закройте ноутбук, и агент продолжит работать. Не нужно следить за терминалом и держать машину постоянно активной.

</details>

<details>
<summary>Нужно ли отдельно платить за AI-подписку?</summary>

Да. Anycoding предоставляет среду, а не сам AI. Вы приносите свою подписку Claude, Cursor, Codex или Gemini. Anycoding Cloud начинается от $7/месяц за хостируемую среду поверх этого.

</details>

<details>
<summary>Можно ли пользоваться Anycoding с телефона?</summary>

Да. Для self-hosted запустите сервер на своей машине и откройте `[yourip]:port` в любом браузере в вашей сети. Для Anycoding Cloud откройте сервис с любого устройства — без VPN, проброса портов и дополнительной настройки. Нативное приложение тоже в разработке.

</details>

<details>
<summary>Повлияют ли изменения, сделанные в UI, на мой локальный Claude Code?</summary>

Да, в self-hosted режиме. Anycoding читает и записывает тот же конфиг `~/.claude`, который Claude Code использует нативно. MCP-серверы, добавленные через UI, сразу появляются в Claude Code, и наоборот.

</details>

---

## Сообщество и поддержка

- **[Документация](https://anycoding.ai/docs)** — установка, настройка, возможности и устранение неполадок
- **[GitHub Issues](https://github.com/luzedong/anycoding/issues)** — сообщения об ошибках и запросы новых функций
- **[Руководство для контрибьюторов](CONTRIBUTING.md)** — как участвовать в развитии проекта

## Лицензия

GNU General Public License v3.0 - подробности в файле [LICENSE](LICENSE).

Этот проект open source и бесплатен для использования, модификации и распространения в рамках лицензии GPL v3.

## Благодарности

### Исходный проект
- Этот проект изначально основан на [siteboon/claudecodeui](https://github.com/siteboon/claudecodeui). Спасибо апстрим-мейнтейнерам и контрибьюторам.

### Используется
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - официальный CLI от Anthropic
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** - официальный CLI от Cursor
- **[Codex](https://developers.openai.com/codex)** - OpenAI Codex
- **[Gemini-CLI](https://geminicli.com/)** - Google Gemini CLI
- **[React](https://react.dev/)** - библиотека пользовательских интерфейсов
- **[Vite](https://vitejs.dev/)** - быстрый инструмент сборки и dev-сервер
- **[Tailwind CSS](https://tailwindcss.com/)** - utility-first CSS framework
- **[CodeMirror](https://codemirror.net/)** - продвинутый редактор кода
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** *(опционально)* - AI-управление проектами и планирование задач

<div align="center">
  <strong>Сделано с заботой для сообщества Claude Code, Cursor, Codex, Gemini CLI и OpenCode.</strong>
</div>
