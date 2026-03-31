export {};

type DesktopUpdaterStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'not-available'
  | 'downloading'
  | 'downloaded'
  | 'error';

type DesktopUpdaterState = {
  supported: boolean;
  status: DesktopUpdaterStatus;
  message: string;
  progressPercent: number;
  availableVersion: string | null;
  downloadedVersion: string | null;
  error: string | null;
};

type DesktopUpdaterResult = {
  ok: boolean;
  error?: string;
};

type DesktopAppApi = {
  platform: NodeJS.Platform;
  isDesktop: boolean;
  updater?: {
    getState: () => Promise<DesktopUpdaterState>;
    checkForUpdates: () => Promise<DesktopUpdaterResult>;
    downloadUpdate: () => Promise<DesktopUpdaterResult>;
    quitAndInstall: () => Promise<DesktopUpdaterResult>;
    onStateChange: (callback: (state: DesktopUpdaterState) => void) => () => void;
  };
};

declare global {
  interface Window {
    desktopApp?: DesktopAppApi;
    __ROUTER_BASENAME__?: string;
    refreshProjects?: () => void | Promise<void>;
    openSettings?: (tab?: string) => void;
  }

  interface EventSourceEventMap {
    result: MessageEvent;
    progress: MessageEvent;
    done: MessageEvent;
  }
}
