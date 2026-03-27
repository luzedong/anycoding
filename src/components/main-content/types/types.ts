import type { Dispatch, SetStateAction } from 'react';
import type { AppTab, Project, ProjectSession } from '../../../types/app';

export type ShellMode = 'system' | 'claude' | 'cursor' | 'codex' | 'gemini' | 'opencode';

export type SessionLifecycleHandler = (sessionId?: string | null) => void;

export type TaskMasterTask = {
  id: string | number;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  details?: string;
  testStrategy?: string;
  parentId?: string | number;
  dependencies?: Array<string | number>;
  subtasks?: TaskMasterTask[];
  [key: string]: unknown;
};

export type TaskReference = {
  id: string | number;
  title?: string;
  [key: string]: unknown;
};

export type TaskSelection = TaskMasterTask | TaskReference;

export type PrdFile = {
  name: string;
  content?: string;
  isExisting?: boolean;
  [key: string]: unknown;
};

export type ShellInstance = {
  id: string;
  mode: ShellMode;
  project: Project;
  session: ProjectSession | null;
  command?: string | null;
  title: string;
  fromHistory: boolean;
};

export type MainContentProps = {
  selectedProject: Project | null;
  selectedSession: ProjectSession | null;
  deletedSessionId?: string | null;
  activeTab: AppTab;
  setActiveTab: Dispatch<SetStateAction<AppTab>>;
  ws: WebSocket | null;
  sendMessage: (message: unknown) => void;
  latestMessage: unknown;
  isMobile: boolean;
  onMenuClick: () => void;
  isLoading: boolean;
  onInputFocusChange: (focused: boolean) => void;
  onSessionActive: SessionLifecycleHandler;
  onSessionInactive: SessionLifecycleHandler;
  onSessionProcessing: SessionLifecycleHandler;
  onSessionNotProcessing: SessionLifecycleHandler;
  processingSessions: Set<string>;
  onReplaceTemporarySession: SessionLifecycleHandler;
  onNavigateToSession: (targetSessionId: string) => void;
  onShowSettings: () => void;
  externalMessageUpdate: number;
  shellProviderSelectionOpen?: boolean;
  onShellProviderSelectionDone?: () => void;
  onShellProviderSelectionOpen?: () => void;
};


export type MainContentHeaderProps = {
  activeTab: AppTab;
  setActiveTab: Dispatch<SetStateAction<AppTab>>;
  selectedProject: Project;
  selectedSession: ProjectSession | null;
  shouldShowTasksTab: boolean;
  isMobile: boolean;
  onMenuClick: () => void;
  shellInstances: ShellInstance[];
  activeShellId: string | null;
  onChangeActiveShell: (id: string) => void;
  onCloseShell: (id: string) => void;
  onCreateShell: (mode: ShellMode) => void;
};

export type MainContentStateViewProps = {
  mode: 'loading' | 'empty';
  isMobile: boolean;
  onMenuClick: () => void;
};

export type MobileMenuButtonProps = {
  onMenuClick: () => void;
  compact?: boolean;
};

export type TaskMasterPanelProps = {
  isVisible: boolean;
};
