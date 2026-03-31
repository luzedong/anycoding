<div align="center">
  <img src="public/logo.svg" alt="Claude Code UI" width="64" height="64">
  <h1>Claude Code UI (luzedong fork)</h1>
  <p>Eine Desktop- und Mobile-Oberfläche für <a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a>, <a href="https://docs.cursor.com/en/cli/overview">Cursor CLI</a>, <a href="https://developers.openai.com/codex">Codex</a>, <a href="https://geminicli.com/">Gemini-CLI</a> und OpenCode.<br>Dieser Fork ist auf einen shell-first-Workflow ausgelegt – mit Multi-Provider-Shells, projektbezogener Shell-Historie, Dateien, Git, MCP und mobilem Zugriff.</p>
</div>

<p align="center">
  <a href="https://github.com/luzedong/claudecodeui">GitHub</a> · <a href="https://github.com/luzedong/claudecodeui/issues">Fehler melden</a> · <a href="https://www.npmjs.com/package/@luzedong/claude-code-ui">npm</a> · <a href="CONTRIBUTING.md">Mitwirken</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@luzedong/claude-code-ui"><img src="https://img.shields.io/badge/npm-%40luzedong%2Fclaude--code--ui-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm package"></a>
  <a href="https://github.com/luzedong/claudecodeui"><img src="https://img.shields.io/badge/GitHub-luzedong%2Fclaudecodeui-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub repository"></a>
</p>

<div align="right"><i><a href="./README.md">English</a> · <a href="./README.ru.md">Русский</a> · <b>Deutsch</b> · <a href="./README.ko.md">한국어</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a></i></div>

---

## Funktionen

- **Shell-first-Workspace** – Optimiert für persistente Shell-Sitzungen statt eines chat-first-Ablaufs
- **Multi-Provider-Shells** – Starte Claude Code, Codex, Cursor-kompatible Sessions, Gemini CLI, OpenCode oder eine normale System-Shell in einer Oberfläche
- **Projektbezogene Shell-Historie** – Jedes Projekt behält seine eigenen Shells; beim Zurückwechseln wird der passende Workspace wiederhergestellt
- **Provider-aware Shell-Erstellung** – Neue Shells direkt in der Kopfzeile mit passender Provider-Aktion und passendem Icon erstellen
- **Responsives Design** – Funktioniert auf Desktop, Tablet und Mobilgerät
- **Datei-Explorer** – Interaktiver Dateibaum mit Syntaxhervorhebung und Live-Bearbeitung
- **Git-Explorer** – Änderungen anzeigen, stagen, committen und Branches wechseln
- **Sitzungsverwaltung** – Projekt- und Session-Verlauf über die Sidebar durchsuchen
- **Plugin-System** – Die UI mit eigenen Tabs, Backend-Diensten und Integrationen erweitern. [Eigenes Plugin erstellen →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)
- **TaskMaster AI Integration** *(Optional)* – KI-gestützte Aufgabenplanung, PRD-Parsing und Workflow-Automatisierung
- **Modell-Kompatibilität** – Funktioniert mit Claude-, GPT- und Gemini-Modellen (vollständige Liste in [`shared/modelConstants.js`](shared/modelConstants.js))

## Schnellstart

### Self-Hosted

Diesen Fork sofort mit **npx** ausprobieren (**Node.js** v22+ erforderlich):

```bash
npx @luzedong/claude-code-ui
```

Oder global installieren:

```bash
npm install -g @luzedong/claude-code-ui
cloudcli
```

Öffne `http://localhost:3001` – bestehende lokale Projekte und Sessions werden automatisch erkannt.

### Aus dem Quellcode starten

```bash
git clone https://github.com/luzedong/claudecodeui.git
cd claudecodeui
npm install
npm run dev
```

### Paket / Links

- npm: [`@luzedong/claude-code-ui`](https://www.npmjs.com/package/@luzedong/claude-code-ui)
- GitHub: [`luzedong/claudecodeui`](https://github.com/luzedong/claudecodeui)

---

## Für wen ist das gedacht?

Dieser Fork richtet sich an Entwickler:innen, die eine self-hosted shell-first-Oberfläche über ihren lokalen CLI-Tools möchten.

| | luzedong fork |
|---|---|
| **Am besten für** | Entwickler:innen mit Bedarf an einer shell-first-UI für lokale Agent-Sessions |
| **Zugriff** | Browser via `[deineIP]:port` |
| **Setup** | `npx @luzedong/claude-code-ui` |
| **Rechner muss laufen** | Ja |
| **Mobiler Zugriff** | Jeder Browser im Netzwerk |
| **Verfügbare Sessions** | Lokale Projekt- und Session-Historie wird automatisch erkannt |
| **Unterstützte Agents** | Claude Code, Cursor CLI, Codex, Gemini CLI, OpenCode |
| **Dateien / Git / MCP** | In die UI integriert |
| **Paketname** | `@luzedong/claude-code-ui` |

---

## Sicherheit & Tool-Konfiguration

**🔒 Wichtig**: Alle Claude-Code-Tools sind standardmäßig **deaktiviert**. So werden potenziell gefährliche Operationen nicht automatisch ausgeführt.

### Tools aktivieren

1. **Tool-Einstellungen öffnen** – Klicke auf das Zahnrad in der Sidebar
2. **Gezielt aktivieren** – Nur die Tools einschalten, die du brauchst
3. **Speichern** – Einstellungen werden lokal gesichert

<div align="center">

![Tools Settings Modal](public/screenshots/tools-modal.png)
*Tools Settings – aktiviere nur, was du wirklich brauchst*

</div>

---

## Plugins

Dieser Fork behält das Plugin-System bei. Du kannst eigene Tabs mit Frontend-UI und optionalem Node.js-Backend hinzufügen. Installiere Plugins direkt aus Git-Repositories unter **Settings > Plugins** oder baue dein eigenes.

### Verfügbare Plugins

| Plugin | Beschreibung |
|---|---|
| **[Project Stats](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** | Zeigt Dateianzahl, Codezeilen, Dateityp-Aufschlüsselung, größte Dateien und zuletzt geänderte Dateien des aktuellen Projekts |
| **[Web Terminal](https://github.com/cloudcli-ai/cloudcli-plugin-terminal)** | Vollwertiges xterm.js-Terminal mit Multi-Tab-Unterstützung |

### Eigenes Plugin bauen

**[Plugin-Starter-Vorlage →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** – Forke dieses Repository, um dein eigenes Plugin zu erstellen. Enthält ein funktionierendes Beispiel mit Frontend-Rendering, Live-Kontext-Updates und RPC-Kommunikation zu einem Backend-Server.

---

## FAQ

<details>
<summary>Was ist in diesem Fork anders?</summary>

Dieser Fork verschiebt den Schwerpunkt auf einen shell-first-Workflow:

- Shell-Tabs verwenden provider-spezifische Icons
- Neue Shells werden provider-aware erstellt
- Jedes Projekt behält seinen eigenen Shell-Workspace
- Reste der Conversation-Suche in der Sidebar wurden entfernt, zugunsten von Projekt-/Session-Verlauf
- npm-Paketname und Repository-Links zeigen auf den `luzedong`-Fork

</details>

<details>
<summary>Kann ich es auf dem Handy nutzen?</summary>

Ja. Starte den Server auf deinem Rechner und öffne `[deineIP]:port` in einem Browser im selben Netzwerk.

</details>

<details>
<summary>Wirken sich Änderungen in der UI auf meine lokale Claude-Code-Konfiguration aus?</summary>

Ja. Die App liest und schreibt dieselben lokalen Claude-Konfigurations- sowie Projekt-/Session-Daten wie deine CLI-Tools.

</details>

---

## Community & Support

- **[GitHub Repository](https://github.com/luzedong/claudecodeui)** — Quellcode und Releases
- **[GitHub Issues](https://github.com/luzedong/claudecodeui/issues)** — Fehlerberichte und Feature-Wünsche
- **[npm Package](https://www.npmjs.com/package/@luzedong/claude-code-ui)** — installierbares Paket
- **[Contributing Guide](CONTRIBUTING.md)** — Mitwirken am Projekt

## Lizenz

GNU General Public License v3.0 – Details siehe [LICENSE](LICENSE).

## Danksagung

### Built With
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - Offizielle CLI von Anthropic
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** - Offizielle CLI von Cursor
- **[Codex](https://developers.openai.com/codex)** - OpenAI Codex
- **[Gemini-CLI](https://geminicli.com/)** - Google Gemini CLI
- **[React](https://react.dev/)** - UI-Bibliothek
- **[Vite](https://vitejs.dev/)** - Schnelles Build-Tool und Dev-Server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first-CSS-Framework
- **[CodeMirror](https://codemirror.net/)** - Leistungsfähiger Code-Editor
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** *(Optional)* - KI-gestützte Projekt- und Aufgabenplanung

<div align="center">
  <strong>Für die Claude-Code-, Cursor-, Codex-, Gemini-CLI- und OpenCode-Community.</strong>
</div>


---

## Sicherheit & Tool-Konfiguration

**🔒 Wichtiger Hinweis**: Alle Claude Code Tools sind **standardmäßig deaktiviert**. Dies verhindert, dass potenziell schädliche Operationen automatisch ausgeführt werden.

### Tools aktivieren

Um den vollen Funktionsumfang von Claude Code zu nutzen, müssen Tools manuell aktiviert werden:

1. **Tool-Einstellungen öffnen** – Klicke auf das Zahnrad-Symbol in der Seitenleiste
2. **Selektiv aktivieren** – Nur die benötigten Tools einschalten
3. **Einstellungen übernehmen** – Deine Einstellungen werden lokal gespeichert

<div align="center">

![Tool-Einstellungen Modal](public/screenshots/tools-modal.png)
*Tool-Einstellungen – nur aktivieren, was benötigt wird*

</div>

**Empfohlene Vorgehensweise**: Mit grundlegenden Tools starten und bei Bedarf weitere hinzufügen. Die Einstellungen können jederzeit angepasst werden.

---

## Plugins

CloudCLI verfügt über ein Plugin-System, mit dem benutzerdefinierte Tabs mit eigener Frontend-UI und optionalem Node.js-Backend hinzugefügt werden können. Plugins können direkt in **Einstellungen > Plugins** aus Git-Repos installiert oder selbst entwickelt werden.

### Verfügbare Plugins

| Plugin | Beschreibung |
|---|---|
| **[Project Stats](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** | Zeigt Dateianzahl, Codezeilen, Dateityp-Aufschlüsselung, größte Dateien und zuletzt geänderte Dateien des aktuellen Projekts |

### Eigenes Plugin erstellen

**[Plugin-Starter-Vorlage →](https://github.com/cloudcli-ai/cloudcli-plugin-starter)** – Forke dieses Repository, um ein eigenes Plugin zu erstellen. Es enthält ein funktionierendes Beispiel mit Frontend-Rendering, Live-Kontext-Updates und RPC-Kommunikation zu einem Backend-Server.

**[Plugin-Dokumentation →](https://cloudcli.ai/docs/plugin-overview)** – Vollständige Anleitung zur Plugin-API, zum Manifest-Format, zum Sicherheitsmodell und mehr.

---
## FAQ

<details>
<summary>Wie unterscheidet sich das von Claude Code Remote Control?</summary>

Claude Code Remote Control ermöglicht es, Nachrichten an eine bereits im lokalen Terminal laufende Sitzung zu senden. Der Rechner muss eingeschaltet bleiben, das Terminal muss offen bleiben, und Sitzungen laufen nach etwa 10 Minuten ohne Netzwerkverbindung ab.

CloudCLI UI und CloudCLI Cloud erweitern Claude Code, anstatt neben ihm zu laufen – MCP-Server, Berechtigungen, Einstellungen und Sitzungen sind exakt dieselben, die Claude Code nativ verwendet. Nichts wird dupliziert oder separat verwaltet.

Das bedeutet in der Praxis:

- **Alle Sitzungen, nicht nur eine** – CloudCLI UI erkennt automatisch jede Sitzung aus dem `~/.claude`-Ordner. Remote Control stellt nur die einzelne aktive Sitzung bereit, um sie in der Claude Mobile App verfügbar zu machen.
- **Deine Einstellungen sind deine Einstellungen** – MCP-Server, Tool-Berechtigungen und Projektkonfiguration, die in CloudCLI UI geändert werden, werden direkt in die Claude Code-Konfiguration geschrieben und treten sofort in Kraft – und umgekehrt.
- **Funktioniert mit mehr Agents** – Claude Code, Cursor CLI, Codex, Gemini CLI und OpenCode, nicht nur Claude Code.
- **Vollständige UI, nicht nur ein Chat-Fenster** – Datei-Explorer, Git-Integration, MCP-Verwaltung und ein Shell-Terminal sind alle eingebaut.
- **CloudCLI Cloud läuft in der Cloud** – Laptop zuklappen, der Agent läuft weiter. Kein Terminal zu überwachen, kein Rechner, der laufen muss.

</details>

<details>
<summary>Muss ich ein KI-Abonnement separat bezahlen?</summary>

Ja. CloudCLI stellt die Umgebung bereit, nicht die KI. Du bringst dein eigenes Claude-, Cursor-, Codex- oder Gemini-Abonnement mit. CloudCLI Cloud beginnt bei $7/Monat für die gehostete Umgebung zusätzlich dazu.

</details>

<details>
<summary>Kann ich CloudCLI UI auf meinem Smartphone nutzen?</summary>

Ja. Bei Self-Hosted: Server auf dem eigenen Rechner starten und `[deineIP]:port` in einem beliebigen Browser im Netzwerk öffnen. Bei CloudCLI Cloud: Von jedem Gerät aus öffnen – kein VPN, keine Portweiterleitung, keine Einrichtung. Eine native App ist ebenfalls in Entwicklung.

</details>

<details>
<summary>Wirken sich Änderungen in der UI auf mein lokales Claude Code-Setup aus?</summary>

Ja, bei Self-Hosted. CloudCLI UI liest aus und schreibt in dieselbe `~/.claude`-Konfiguration, die Claude Code nativ verwendet. MCP-Server, die über die UI hinzugefügt werden, erscheinen sofort in Claude Code und umgekehrt.

</details>

---

## Community & Support

- **[Dokumentation](https://cloudcli.ai/docs)** — Installation, Konfiguration, Funktionen und Fehlerbehebung
- **[GitHub Issues](https://github.com/siteboon/claudecodeui/issues)** — Fehlerberichte und Feature-Anfragen
- **[Beitragsrichtlinien](CONTRIBUTING.md)** — So kannst du zum Projekt beitragen

## Lizenz

GNU General Public License v3.0 – siehe [LICENSE](LICENSE)-Datei für Details.

Dieses Projekt ist Open Source und kann unter der GPL v3-Lizenz kostenlos genutzt, modifiziert und verteilt werden.

## Danksagungen

### Erstellt mit
- **[Claude Code](https://docs.anthropic.com/en/docs/claude-code)** - Anthropics offizielle CLI
- **[Cursor CLI](https://docs.cursor.com/en/cli/overview)** - Cursors offizielle CLI
- **[Codex](https://developers.openai.com/codex)** - OpenAI Codex
- **[Gemini-CLI](https://geminicli.com/)** - Google Gemini CLI
- **[React](https://react.dev/)** - UI-Bibliothek
- **[Vite](https://vitejs.dev/)** - Schnelles Build-Tool und Dev-Server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS-Framework
- **[CodeMirror](https://codemirror.net/)** - Erweiterter Code-Editor
- **[TaskMaster AI](https://github.com/eyaltoledano/claude-task-master)** *(Optional)* - KI-gestütztes Projektmanagement und Aufgabenplanung


### Sponsoren
- [Siteboon - KI-gestützter Website-Builder](https://siteboon.ai)
---

<div align="center">
  <strong>Mit Sorgfalt für die Claude Code-, Cursor-, Codex-, Gemini-CLI- und OpenCode-Community erstellt.</strong>
</div>
