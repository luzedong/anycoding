const path = require('path');
const net = require('net');
const { spawn, execFileSync } = require('child_process');
const { app, BrowserWindow, shell } = require('electron');

const DEFAULT_PORT = Number(process.env.SERVER_PORT) || 3001;
const HOST = '127.0.0.1';
const SERVER_READY_TIMEOUT_MS = 30_000;

let mainWindow = null;
let serverProcess = null;
let serverPort = DEFAULT_PORT;
let isQuitting = false;

function isPackagedApp() {
  return app.isPackaged;
}

function getAppRoot() {
  if (isPackagedApp()) {
    return path.join(process.resourcesPath, 'app.asar');
  }
  return path.resolve(__dirname, '..');
}

function getServerEntry() {
  return path.join(getAppRoot(), 'server', 'index.js');
}

function isPortAvailable(port, host = HOST) {
  return new Promise((resolve) => {
    const tester = net
      .createServer()
      .once('error', () => resolve(false))
      .once('listening', () => {
        tester.close(() => resolve(true));
      })
      .listen(port, host);
  });
}

async function findAvailablePort(startPort, attempts = 20) {
  for (let i = 0; i < attempts; i += 1) {
    const candidate = startPort + i;
    // eslint-disable-next-line no-await-in-loop
    const available = await isPortAvailable(candidate);
    if (available) {
      return candidate;
    }
  }
  throw new Error(`No free port found between ${startPort} and ${startPort + attempts - 1}`);
}

function waitForServerReady(port, timeoutMs = SERVER_READY_TIMEOUT_MS) {
  const url = `http://${HOST}:${port}/health`;
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const check = async () => {
      if (!serverProcess) {
        reject(new Error('Server process not running'));
        return;
      }

      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (response.ok) {
          resolve();
          return;
        }
      } catch {
        // Retry until timeout
      }

      if (Date.now() - start >= timeoutMs) {
        reject(new Error(`Server health check timed out after ${timeoutMs}ms: ${url}`));
        return;
      }

      setTimeout(check, 300);
    };

    void check();
  });
}

function getPreferredShell() {
  const envShell = process.env.SHELL;
  if (envShell && typeof envShell === 'string' && envShell.trim()) {
    return envShell.trim();
  }
  return process.platform === 'darwin' ? '/bin/zsh' : '/bin/bash';
}

function loadLoginShellEnvironment() {
  if (process.platform === 'win32') return {};

  try {
    const shell = getPreferredShell();
    const output = execFileSync(shell, ['-ilc', 'env -0'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 1024 * 1024 * 5,
    });

    const loadedEnv = {};
    for (const record of output.split('\0')) {
      if (!record) continue;
      const separatorIndex = record.indexOf('=');
      if (separatorIndex <= 0) continue;
      const key = record.slice(0, separatorIndex);
      const value = record.slice(separatorIndex + 1);
      loadedEnv[key] = value;
    }

    return loadedEnv;
  } catch (error) {
    console.warn('[desktop] Failed to load login shell environment:', error.message || error);
    return {};
  }
}

async function startServerProcess() {
  if (serverProcess) return;

  serverPort = await findAvailablePort(DEFAULT_PORT);

  const serverEntry = getServerEntry();
  const loginShellEnv = loadLoginShellEnvironment();
  const env = {
    ...process.env,
    ...loginShellEnv,
    HOST,
    SERVER_PORT: String(serverPort),
    ELECTRON_RUN_AS_NODE: '1',
  };

  serverProcess = spawn(process.execPath, [serverEntry], {
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  serverProcess.stdout.on('data', (chunk) => {
    process.stdout.write(`[server] ${chunk.toString()}`);
  });

  serverProcess.stderr.on('data', (chunk) => {
    process.stderr.write(`[server] ${chunk.toString()}`);
  });

  serverProcess.once('exit', (code, signal) => {
    const exitedUnexpectedly = !isQuitting;
    serverProcess = null;

    if (exitedUnexpectedly) {
      const reason = signal ? `signal ${signal}` : `code ${code}`;
      console.error(`[desktop] Server exited unexpectedly (${reason})`);
      app.quit();
    }
  });

  await waitForServerReady(serverPort);
}

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.cjs');

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    show: false,
    title: 'Claude Code UI',
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      spellcheck: false,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const appUrl = `http://${HOST}:${serverPort}`;

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(appUrl)) {
      return { action: 'allow' };
    }
    void shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(appUrl)) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });

  void mainWindow.loadURL(appUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function stopServerProcess() {
  if (!serverProcess) return;

  await new Promise((resolve) => {
    const proc = serverProcess;

    const finalize = () => {
      resolve();
    };

    proc.once('exit', finalize);
    proc.kill('SIGTERM');

    setTimeout(() => {
      if (serverProcess) {
        proc.kill('SIGKILL');
      }
    }, 5000);
  });
}

async function bootstrap() {
  const lock = app.requestSingleInstanceLock();
  if (!lock) {
    app.quit();
    return;
  }

  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (!mainWindow) {
      createWindow();
    }
  });

  app.on('before-quit', () => {
    isQuitting = true;
  });

  app.on('will-quit', async (event) => {
    if (serverProcess) {
      event.preventDefault();
      await stopServerProcess();
      app.quit();
    }
  });

  try {
    await startServerProcess();
    createWindow();
  } catch (error) {
    console.error('[desktop] Failed to start desktop app:', error);
    app.quit();
  }
}

void app.whenReady().then(bootstrap);
