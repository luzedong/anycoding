import { useCallback, useEffect, useRef, useState } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { WebglAddon } from '@xterm/addon-webgl';
import { Terminal } from '@xterm/xterm';
import type { Project } from '../../../types/app';
import {
  CODEX_DEVICE_AUTH_URL,
  TERMINAL_INIT_DELAY_MS,
  createTerminalOptions,
  TERMINAL_THEME_DARK,
  TERMINAL_THEME_LIGHT,
  TERMINAL_RESIZE_DELAY_MS,
} from '../constants/constants';
import { copyTextToClipboard } from '../../../utils/clipboard';
import { isCodexLoginCommand } from '../utils/auth';
import { sendSocketMessage } from '../utils/socket';
import { ensureXtermFocusStyles } from '../utils/terminalStyles';
import { useTheme } from '../../../contexts/ThemeContext';
import { api } from '../../../utils/api';

type UseShellTerminalOptions = {
  terminalContainerRef: RefObject<HTMLDivElement>;
  terminalRef: MutableRefObject<Terminal | null>;
  fitAddonRef: MutableRefObject<FitAddon | null>;
  wsRef: MutableRefObject<WebSocket | null>;
  selectedProject: Project | null | undefined;
  selectedSessionId?: string | null;
  minimal: boolean;
  isRestarting: boolean;
  initialCommandRef: MutableRefObject<string | null | undefined>;
  isPlainShellRef: MutableRefObject<boolean>;
  authUrlRef: MutableRefObject<string>;
  copyAuthUrlToClipboard: (url?: string) => Promise<boolean>;
  closeSocket: () => void;
};

type UseShellTerminalResult = {
  isInitialized: boolean;
  clearTerminalScreen: () => void;
  disposeTerminal: () => void;
};

type UploadFilesResponse = {
  error?: string;
  files?: Array<{ name?: string }>;
};

export function useShellTerminal({
  terminalContainerRef,
  terminalRef,
  fitAddonRef,
  wsRef,
  selectedProject,
  selectedSessionId = null,
  minimal,
  isRestarting,
  initialCommandRef,
  isPlainShellRef,
  authUrlRef,
  copyAuthUrlToClipboard,
  closeSocket,
}: UseShellTerminalOptions): UseShellTerminalResult {
  const { isDarkMode } = useTheme();
  const [isInitialized, setIsInitialized] = useState(false);
  const resizeTimeoutRef = useRef<number | null>(null);
  const selectedProjectKey = selectedProject?.fullPath || selectedProject?.path || '';
  const hasSelectedProject = Boolean(selectedProject);

  const shellQuote = useCallback((value: string) => {
    if (value.length === 0) {
      return "''";
    }
    return `'${value.replace(/'/g, `'\\''`)}'`;
  }, []);

  const getUploadBucket = useCallback(() => {
    if (selectedSessionId && selectedSessionId.trim().length > 0) {
      return selectedSessionId.replace(/[\\/:*?"<>|]/g, '_');
    }
    return new Date().toISOString().slice(0, 10);
  }, [selectedSessionId]);

  const writeUploadNotice = useCallback(
    (message: string, level: 'info' | 'error' = 'info') => {
      if (!terminalRef.current) {
        return;
      }

      const color = level === 'error' ? '\x1b[31m' : '\x1b[36m';
      terminalRef.current.writeln(`\r\n${color}[Upload] ${message}\x1b[0m`);
    },
    [terminalRef],
  );

  const buildFallbackFileName = useCallback((file: File, index: number) => {
    const mimeType = file.type || '';
    const extension = mimeType.startsWith('image/')
      ? mimeType.split('/')[1]?.replace(/[^a-zA-Z0-9]/g, '') || 'png'
      : 'bin';
    return `clipboard-file-${Date.now()}-${index}.${extension}`;
  }, []);

  const uploadFilesAndInsertPaths = useCallback(
    async (rawFiles: File[]) => {
      if (!selectedProject?.name) {
        return;
      }

      if (!rawFiles.length) {
        return;
      }

      const targetPath = `.anycoding/uploads/${getUploadBucket()}`;
      const normalizedFiles = rawFiles.map((file, index) => {
        const fallbackName = buildFallbackFileName(file, index);
        const normalizedName = (file.name || fallbackName).replace(/\\/g, '/').replace(/^\/+/, '');

        return {
          relativePath: normalizedName,
          file: new File([file], normalizedName.split('/').pop() || fallbackName, {
            type: file.type,
            lastModified: file.lastModified,
          }),
        };
      });

      const formData = new FormData();
      formData.append('targetPath', targetPath);
      formData.append(
        'relativePaths',
        JSON.stringify(normalizedFiles.map((entry) => entry.relativePath)),
      );
      normalizedFiles.forEach((entry) => {
        formData.append('files', entry.file);
      });

      writeUploadNotice(`Uploading ${normalizedFiles.length} file(s) to ${targetPath}`);

      const response = await api.uploadFiles(selectedProject.name, formData);
      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const data = (await response.json()) as UploadFilesResponse;
          if (data?.error && typeof data.error === 'string') {
            errorMessage = data.error;
          }
        } catch {
          // ignore
        }
        throw new Error(errorMessage);
      }

      const result = (await response.json()) as UploadFilesResponse;
      const uploadedFiles = Array.isArray(result?.files) ? result.files : [];
      const uploadPaths = uploadedFiles
        .map((file: { name?: string }) => file?.name)
        .filter((name: string | undefined): name is string => typeof name === 'string' && name.length > 0)
        .map((name: string) => `./${targetPath}/${name}`);

      if (uploadPaths.length > 0) {
        sendSocketMessage(wsRef.current, {
          type: 'input',
          data: `${uploadPaths.map(shellQuote).join(' ')} `,
        });
      }

      writeUploadNotice(
        uploadPaths.length > 0
          ? `Uploaded ${uploadPaths.length} file(s)`
          : 'No files uploaded',
      );
    },
    [
      buildFallbackFileName,
      getUploadBucket,
      selectedProject?.name,
      shellQuote,
      wsRef,
      writeUploadNotice,
    ],
  );

  useEffect(() => {
    ensureXtermFocusStyles();
  }, []);

  const clearTerminalScreen = useCallback(() => {
    if (!terminalRef.current) {
      return;
    }

    terminalRef.current.clear();
    terminalRef.current.write('\x1b[2J\x1b[H');
  }, [terminalRef]);

  const disposeTerminal = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.dispose();
      terminalRef.current = null;
    }

    fitAddonRef.current = null;
    setIsInitialized(false);
  }, [fitAddonRef, terminalRef]);

  useEffect(() => {
    const terminalContainer = terminalContainerRef.current;
    if (!terminalContainer || !hasSelectedProject || isRestarting || terminalRef.current) {
      return;
    }

    const nextTerminal = new Terminal(createTerminalOptions(isDarkMode));
    terminalRef.current = nextTerminal;

    const nextFitAddon = new FitAddon();
    fitAddonRef.current = nextFitAddon;
    nextTerminal.loadAddon(nextFitAddon);

    // Avoid wrapped partial links in compact login flows.
    if (!minimal) {
      nextTerminal.loadAddon(new WebLinksAddon());
    }

    try {
      nextTerminal.loadAddon(new WebglAddon());
    } catch {
      console.warn('[Shell] WebGL renderer unavailable, using Canvas fallback');
    }

    nextTerminal.open(terminalContainer);

    const copyTerminalSelection = async () => {
      const selection = nextTerminal.getSelection();
      if (!selection) {
        return false;
      }

      return copyTextToClipboard(selection);
    };

    const handleTerminalCopy = (event: ClipboardEvent) => {
      if (!nextTerminal.hasSelection()) {
        return;
      }

      const selection = nextTerminal.getSelection();
      if (!selection) {
        return;
      }

      event.preventDefault();

      if (event.clipboardData) {
        event.clipboardData.setData('text/plain', selection);
        return;
      }

      void copyTextToClipboard(selection);
    };

    terminalContainer.addEventListener('copy', handleTerminalCopy);

    nextTerminal.attachCustomKeyEventHandler((event) => {
      const activeAuthUrl = isCodexLoginCommand(initialCommandRef.current)
        ? CODEX_DEVICE_AUTH_URL
        : authUrlRef.current;

      if (
        event.type === 'keydown' &&
        minimal &&
        isPlainShellRef.current &&
        activeAuthUrl &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        event.key?.toLowerCase() === 'c'
      ) {
        event.preventDefault();
        event.stopPropagation();
        void copyAuthUrlToClipboard(activeAuthUrl);
        return false;
      }

      if (
        event.type === 'keydown' &&
        (event.ctrlKey || event.metaKey) &&
        event.key?.toLowerCase() === 'c' &&
        nextTerminal.hasSelection()
      ) {
        event.preventDefault();
        event.stopPropagation();
        void copyTerminalSelection();
        return false;
      }

      return true;
    });

    const handleTerminalPaste = (event: ClipboardEvent) => {
      const clipboardData = event.clipboardData;
      if (!clipboardData) {
        return;
      }

      const filesFromItems = Array.from(clipboardData.items || [])
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file): file is File => Boolean(file));
      const filesFromClipboard = Array.from(clipboardData.files || []);

      const clipboardFiles = [...filesFromItems, ...filesFromClipboard].filter((file, index, all) => {
        const key = `${file.name}:${file.size}:${file.type}:${file.lastModified}`;
        return all.findIndex((candidate) => {
          const candidateKey = `${candidate.name}:${candidate.size}:${candidate.type}:${candidate.lastModified}`;
          return candidateKey === key;
        }) === index;
      });

      if (clipboardFiles.length > 0) {
        event.preventDefault();
        event.stopPropagation();

        void uploadFilesAndInsertPaths(clipboardFiles).catch((error) => {
          console.error('[Shell] Clipboard upload failed:', error);
          writeUploadNotice(
            error instanceof Error ? error.message : 'Upload failed',
            'error',
          );
        });
        return;
      }

      const text = clipboardData.getData('text');
      if (text) {
        event.preventDefault();
        event.stopPropagation();
        sendSocketMessage(wsRef.current, {
          type: 'input',
          data: text,
        });
        return;
      }

      writeUploadNotice('Clipboard has no uploadable file. Try drag-and-drop for PDF/files.', 'error');
    };

    const handleTerminalDragOver = (event: DragEvent) => {
      if (!event.dataTransfer) {
        return;
      }

      const hasFiles = Array.from(event.dataTransfer.items || []).some(
        (item) => item.kind === 'file',
      );
      if (!hasFiles) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'copy';
    };

    const handleTerminalDrop = (event: DragEvent) => {
      if (!event.dataTransfer) {
        return;
      }

      const files = Array.from(event.dataTransfer.files || []);
      if (!files.length) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      void uploadFilesAndInsertPaths(files).catch((error) => {
        console.error('[Shell] Drag upload failed:', error);
        writeUploadNotice(
          error instanceof Error ? error.message : 'Upload failed',
          'error',
        );
      });
    };

    terminalContainer.addEventListener('paste', handleTerminalPaste, true);
    terminalContainer.addEventListener('dragover', handleTerminalDragOver);
    terminalContainer.addEventListener('drop', handleTerminalDrop);

    window.setTimeout(() => {
      const currentFitAddon = fitAddonRef.current;
      const currentTerminal = terminalRef.current;
      if (!currentFitAddon || !currentTerminal) {
        return;
      }

      currentFitAddon.fit();
      sendSocketMessage(wsRef.current, {
        type: 'resize',
        cols: currentTerminal.cols,
        rows: currentTerminal.rows,
      });
    }, TERMINAL_INIT_DELAY_MS);

    setIsInitialized(true);

    const dataSubscription = nextTerminal.onData((data) => {
      sendSocketMessage(wsRef.current, {
        type: 'input',
        data,
      });
    });

    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = window.setTimeout(() => {
        const currentFitAddon = fitAddonRef.current;
        const currentTerminal = terminalRef.current;
        if (!currentFitAddon || !currentTerminal) {
          return;
        }

        currentFitAddon.fit();
        sendSocketMessage(wsRef.current, {
          type: 'resize',
          cols: currentTerminal.cols,
          rows: currentTerminal.rows,
        });
      }, TERMINAL_RESIZE_DELAY_MS);
    });

    resizeObserver.observe(terminalContainer);

    return () => {
      terminalContainer.removeEventListener('copy', handleTerminalCopy);
      terminalContainer.removeEventListener('paste', handleTerminalPaste, true);
      terminalContainer.removeEventListener('dragover', handleTerminalDragOver);
      terminalContainer.removeEventListener('drop', handleTerminalDrop);
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current !== null) {
        window.clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = null;
      }
      dataSubscription.dispose();
      closeSocket();
      disposeTerminal();
    };
  }, [
    isDarkMode,
    authUrlRef,
    closeSocket,
    copyAuthUrlToClipboard,
    disposeTerminal,
    fitAddonRef,
    initialCommandRef,
    isPlainShellRef,
    isRestarting,
    minimal,
    hasSelectedProject,
    selectedProjectKey,
    selectedSessionId,
    terminalContainerRef,
    terminalRef,
    uploadFilesAndInsertPaths,
    wsRef,
    writeUploadNotice,
  ]);

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    terminalRef.current.options.theme = isDarkMode
      ? TERMINAL_THEME_DARK
      : TERMINAL_THEME_LIGHT;
  }, [isDarkMode, terminalRef]);

  return {
    isInitialized,
    clearTerminalScreen,
    disposeTerminal,
  };
}
