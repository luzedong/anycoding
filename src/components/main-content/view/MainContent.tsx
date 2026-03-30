import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FileTree from '../../file-tree/view/FileTree';
import StandaloneShell from '../../standalone-shell/view/StandaloneShell';
import GitPanel from '../../git-panel/view/GitPanel';
import PluginTabContent from '../../plugins/view/PluginTabContent';
import type { MainContentProps, ShellInstance, ShellMode } from '../types/types';
import { useTaskMaster } from '../../../contexts/TaskMasterContext';
import { useTasksSettings } from '../../../contexts/TasksSettingsContext';
import { useEditorSidebar } from '../../code-editor/hooks/useEditorSidebar';
import EditorSidebar from '../../code-editor/view/EditorSidebar';
import type { Project, ProjectSession } from '../../../types/app';
import { TaskMasterPanel } from '../../task-master';
import MainContentHeader from './subcomponents/MainContentHeader';
import MainContentStateView from './subcomponents/MainContentStateView';
import ShellProviderSelection from '../../shell/view/subcomponents/ShellProviderSelection';
import { cn } from '../../../lib/utils';

// Chat-related features are disabled. Main area is now driven by shell/files/git only.

type TaskMasterContextValue = {
  currentProject?: Project | null;
  setCurrentProject?: ((project: Project) => void) | null;
};

type TasksSettingsContextValue = {
  tasksEnabled: boolean;
  isTaskMasterInstalled: boolean | null;
  isTaskMasterReady: boolean | null;
};

function createShellInstance(
  mode: ShellMode,
  project: Project,
  session: ProjectSession | null,
  fromHistory: boolean,
): ShellInstance {
  const baseTitle =
    session?.title ||
    session?.summary ||
    session?.name ||
    (fromHistory ? '会话' : 'Shell');

  const providerPrefixMap: Record<ShellMode, string> = {
    claude: 'Claude',
    cursor: 'Cursor',
    codex: 'Codex',
    gemini: 'Gemini',
    opencode: 'OpenCode',
    system: 'System',
  };
  const providerPrefix = providerPrefixMap[mode];

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    mode,
    project,
    session,
    command: !session && mode === 'opencode' ? 'opencode' : null,
    fromHistory,
    title: session ? `${providerPrefix} · ${baseTitle}` : `${providerPrefix} Shell`,
  };
}

function getShellModeFromSession(session: ProjectSession | null | undefined): ShellMode {
  const provider = session?.__provider;
  if (provider === 'codex') {
    return 'codex';
  }
  if (provider === 'cursor') {
    return 'cursor';
  }
  if (provider === 'gemini') {
    return 'gemini';
  }
  return 'claude';
}

function MainContent({
  selectedProject,
  selectedSession,
  deletedSessionId,
  activeTab,
  setActiveTab,
  isMobile,
  onMenuClick,
  isLoading,
  shellProviderSelectionOpen,
  onShellProviderSelectionDone,
  onShellProviderSelectionOpen,
}: MainContentProps) {
  const { currentProject, setCurrentProject } = useTaskMaster() as TaskMasterContextValue;
  const { tasksEnabled, isTaskMasterInstalled } = useTasksSettings() as TasksSettingsContextValue;

  const shouldShowTasksTab = Boolean(tasksEnabled && isTaskMasterInstalled);

  const {
    editingFile,
    editorWidth,
    editorExpanded,
    hasManualWidth,
    resizeHandleRef,
    handleFileOpen,
    handleCloseEditor,
    handleToggleEditorExpand,
    handleResizeStart,
  } = useEditorSidebar({
    selectedProject,
    isMobile,
  });

  const [shellInstances, setShellInstances] = useState<ShellInstance[]>([]);
  const [activeShellIdByProject, setActiveShellIdByProject] = useState<Record<string, string | null>>({});
  const [lastAutoFocusSessionKey, setLastAutoFocusSessionKey] = useState<string | null>(null);
  const [lastHandledDeletedSessionId, setLastHandledDeletedSessionId] = useState<string | null>(null);
  const shellTerminateHandlersRef = useRef<Record<string, (() => void) | undefined>>({});

  const currentProjectName = selectedProject?.name ?? null;
  const visibleShellInstances = useMemo(() => {
    if (!currentProjectName) {
      return [];
    }
    return shellInstances.filter((instance) => instance.project.name === currentProjectName);
  }, [currentProjectName, shellInstances]);

  const activeShellId = currentProjectName ? activeShellIdByProject[currentProjectName] ?? null : null;

  const handleChangeActiveShell = useCallback(
    (id: string) => {
      if (!currentProjectName) {
        return;
      }
      setActiveShellIdByProject((prev) => ({ ...prev, [currentProjectName]: id }));
    },
    [currentProjectName],
  );

  const handleCreateShell = useCallback(
    (mode: ShellMode) => {
      if (!selectedProject) {
        return;
      }

      setShellInstances((prev) => {
        const newInstance = createShellInstance(mode, selectedProject, null, false);
        setActiveShellIdByProject((activePrev) => ({
          ...activePrev,
          [selectedProject.name]: newInstance.id,
        }));
        return [...prev, newInstance];
      });

      if (typeof window !== 'undefined') {
        try {
          const provider = mode === 'system' || mode === 'opencode' ? 'claude' : mode;
          window.localStorage.setItem('selected-provider', provider);
        } catch {
          // ignore
        }
      }

      onShellProviderSelectionDone?.();
    },
    [onShellProviderSelectionDone, selectedProject],
  );

  const registerShellTerminateHandler = useCallback((shellId: string, terminate: (() => void) | null) => {
    if (terminate) {
      shellTerminateHandlersRef.current[shellId] = terminate;
      return;
    }
    delete shellTerminateHandlersRef.current[shellId];
  }, []);

  // Keep TaskMaster's current project in sync with selection.
  useEffect(() => {
    const selectedProjectName = selectedProject?.name;
    const currentTaskProjectName = currentProject?.name;

    if (selectedProject && selectedProjectName !== currentTaskProjectName) {
      setCurrentProject?.(selectedProject);
    }
  }, [selectedProject, currentProject?.name, setCurrentProject]);

  // Ensure active tab falls back to shell when tasks tab is unavailable.
  useEffect(() => {
    if (!shouldShowTasksTab && activeTab === 'tasks') {
      setActiveTab('shell');
    }
  }, [shouldShowTasksTab, activeTab, setActiveTab]);

  // When selecting a project without a concrete session, open shell-type chooser.
  useEffect(() => {
    if (!selectedProject) {
      return;
    }

    if (selectedSession) {
      return;
    }

    const projectShells = shellInstances.filter(
      (instance) => instance.project.name === selectedProject.name,
    );

    if (projectShells.length === 0) {
      onShellProviderSelectionOpen?.();
    }
  }, [
    onShellProviderSelectionOpen,
    selectedProject,
    selectedProject?.name,
    selectedSession,
    shellInstances,
  ]);

  useEffect(() => {
    if (!deletedSessionId || deletedSessionId === lastHandledDeletedSessionId) {
      return;
    }

    const nextShellInstances = shellInstances.filter((instance) => instance.session?.id !== deletedSessionId);
    const removedShellIds = new Set(
      shellInstances
        .filter((instance) => instance.session?.id === deletedSessionId)
        .map((instance) => instance.id),
    );

    if (removedShellIds.size === 0) {
      setLastHandledDeletedSessionId(deletedSessionId);
      return;
    }

    setShellInstances(nextShellInstances);
    setActiveShellIdByProject((prev) => {
      const next = { ...prev };
      Object.entries(prev).forEach(([projectName, activeId]) => {
        if (!activeId || !removedShellIds.has(activeId)) {
          return;
        }

        const fallbackShell = nextShellInstances.find((instance) => instance.project.name === projectName);
        next[projectName] = fallbackShell?.id ?? null;
      });
      return next;
    });
    setLastHandledDeletedSessionId(deletedSessionId);
  }, [deletedSessionId, lastHandledDeletedSessionId, shellInstances]);

  // Restore a valid active shell when returning to a project.
  useEffect(() => {
    if (!selectedProject || visibleShellInstances.length === 0) {
      return;
    }

    setActiveShellIdByProject((prev) => {
      const currentActiveId = prev[selectedProject.name];
      if (currentActiveId && visibleShellInstances.some((instance) => instance.id === currentActiveId)) {
        return prev;
      }

      return {
        ...prev,
        [selectedProject.name]: visibleShellInstances[0]?.id ?? null,
      };
    });
  }, [selectedProject, visibleShellInstances]);

  // When a session is selected from history, create or focus a shell instance for that session.
  useEffect(() => {
    if (!selectedProject || !selectedSession) {
      setLastAutoFocusSessionKey(null);
      return;
    }

    const sessionKey = `${selectedProject.name}:${selectedSession.id}:${selectedSession.__provider || 'claude'}`;
    if (lastAutoFocusSessionKey === sessionKey) {
      return;
    }

    setShellInstances((prev) => {
      const existing = prev.find(
        (instance) =>
          instance.project.name === selectedProject.name &&
          instance.session &&
          instance.session.id === selectedSession.id,
      );

      if (existing) {
        setActiveShellIdByProject((activePrev) => ({
          ...activePrev,
          [selectedProject.name]: existing.id,
        }));
        return prev;
      }

      const mode = getShellModeFromSession(selectedSession);
      const newInstance = createShellInstance(mode, selectedProject, selectedSession, true);
      setActiveShellIdByProject((activePrev) => ({
        ...activePrev,
        [selectedProject.name]: newInstance.id,
      }));
      return [...prev, newInstance];
    });
    setLastAutoFocusSessionKey(sessionKey);
  }, [
    lastAutoFocusSessionKey,
    selectedProject,
    selectedSession,
    selectedProject?.name,
    selectedSession?.id,
    selectedSession?.__provider,
  ]);

  const handleCloseShell = useCallback(
    (id: string) => {
      if (!currentProjectName) {
        return;
      }

      const terminate = shellTerminateHandlersRef.current[id];
      if (terminate) {
        try {
          terminate();
        } catch {
          // ignore
        }
        delete shellTerminateHandlersRef.current[id];
      }

      setShellInstances((prev) => {
        const currentProjectInstances = prev.filter((instance) => instance.project.name === currentProjectName);
        const index = currentProjectInstances.findIndex((instance) => instance.id === id);
        if (index === -1) return prev;

        const nextProjectInstances = [
          ...currentProjectInstances.slice(0, index),
          ...currentProjectInstances.slice(index + 1),
        ];

        setActiveShellIdByProject((activePrev) => ({
          ...activePrev,
          [currentProjectName]:
            activePrev[currentProjectName] !== id
              ? activePrev[currentProjectName] ?? null
              : nextProjectInstances[Math.min(index, nextProjectInstances.length - 1)]?.id ?? null,
        }));

        return prev.filter((instance) => instance.id !== id);
      });
    },
    [currentProjectName],
  );

  if (isLoading) {
    return <MainContentStateView mode="loading" isMobile={isMobile} onMenuClick={onMenuClick} />;
  }

  if (!selectedProject) {
    return <MainContentStateView mode="empty" isMobile={isMobile} onMenuClick={onMenuClick} />;
  }

  return (
    <div className="flex h-full flex-col">
      <MainContentHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedProject={selectedProject}
        selectedSession={selectedSession}
        shouldShowTasksTab={shouldShowTasksTab}
        isMobile={isMobile}
        onMenuClick={onMenuClick}
        shellInstances={visibleShellInstances}
        activeShellId={activeShellId}
        onChangeActiveShell={handleChangeActiveShell}
        onCloseShell={handleCloseShell}
        onCreateShell={handleCreateShell}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className={cn(
            'flex min-h-0 min-w-[200px] flex-1 flex-col overflow-hidden',
            editorExpanded && 'hidden',
          )}
        >
          {/* Chat tab has been removed. Default view is shell. */}

          {activeTab === 'files' && (
            <div className="h-full overflow-hidden">
              <FileTree selectedProject={selectedProject} onFileOpen={handleFileOpen} />
            </div>
          )}

          {activeTab === 'shell' && (
            <div className="flex h-full w-full flex-col overflow-hidden">
              <div className="flex-1">
                {shellProviderSelectionOpen && (
                  <ShellProviderSelection onSelect={handleCreateShell} />
                )}

                {!shellProviderSelectionOpen && (
                  <div className="relative h-full w-full overflow-hidden">
                    {visibleShellInstances.map((instance) => {
                      const isActiveShell = instance.id === activeShellId;
                      return (
                        <div
                          key={instance.id}
                          className={cn(
                            'absolute inset-0 h-full w-full overflow-hidden',
                            isActiveShell ? 'visible' : 'invisible pointer-events-none',
                          )}
                        >
                          <StandaloneShell
                            project={instance.project}
                            session={instance.session}
                            command={instance.command ?? null}
                            showHeader={false}
                            isActive={isActiveShell && activeTab === 'shell'}
                            isPlainShell={(instance.mode === 'system' || instance.mode === 'opencode') && !instance.session}
                            mode={instance.mode}
                            onRegisterTerminate={(terminate) => {
                              registerShellTerminateHandler(instance.id, terminate);
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'git' && (
            <div className="h-full overflow-hidden">
              <GitPanel selectedProject={selectedProject} isMobile={isMobile} onFileOpen={handleFileOpen} />
            </div>
          )}

          {shouldShowTasksTab && <TaskMasterPanel isVisible={activeTab === 'tasks'} />}

          <div className={cn('h-full overflow-hidden', activeTab === 'preview' ? 'block' : 'hidden')} />

          {activeTab.startsWith('plugin:') && (
            <div className="h-full overflow-hidden">
              <PluginTabContent
                pluginName={activeTab.replace('plugin:', '')}
                selectedProject={selectedProject}
                selectedSession={selectedSession}
              />
            </div>
          )}
        </div>

        <EditorSidebar
          editingFile={editingFile}
          isMobile={isMobile}
          editorExpanded={editorExpanded}
          editorWidth={editorWidth}
          hasManualWidth={hasManualWidth}
          resizeHandleRef={resizeHandleRef}
          onResizeStart={handleResizeStart}
          onCloseEditor={handleCloseEditor}
          onToggleEditorExpand={handleToggleEditorExpand}
          projectPath={selectedProject.path}
          fillSpace={activeTab === 'files'}
        />
      </div>
    </div>
  );
}

export default React.memo(MainContent);
