import { useCallback, useRef, useState, useEffect } from 'react';
import { Plus, Terminal } from 'lucide-react';
import type { MainContentHeaderProps, ShellInstance } from '../../types/types';
import SessionProviderLogo from '../../../llm-logo-provider/SessionProviderLogo';
import MobileMenuButton from './MobileMenuButton';
import MainContentTabSwitcher from './MainContentTabSwitcher';
import MainContentTitle from './MainContentTitle';

function getShellDisplayTitle(instance: ShellInstance): string {
  if (instance.session) {
    return instance.session.title || instance.session.summary || instance.session.name || '会话';
  }

  if (instance.mode === 'system') {
    return 'Shell';
  }

  if (instance.mode === 'codex') {
    return 'Codex';
  }
  if (instance.mode === 'cursor') {
    return 'Cursor';
  }
  if (instance.mode === 'gemini') {
    return 'Gemini';
  }
  if (instance.mode === 'opencode') {
    return 'OpenCode';
  }
  return 'Claude';
}

function getShellProvider(instance: ShellInstance): 'claude' | 'codex' | 'cursor' | 'gemini' | 'opencode' | 'system' {
  if (instance.mode === 'system' && !instance.session) {
    return 'system';
  }

  const provider = instance.session?.__provider;
  if (provider === 'codex' || provider === 'cursor' || provider === 'gemini') {
    return provider;
  }

  if (instance.mode === 'codex') {
    return 'codex';
  }
  if (instance.mode === 'cursor') {
    return 'cursor';
  }
  if (instance.mode === 'gemini') {
    return 'gemini';
  }
  if (instance.mode === 'opencode') {
    return 'opencode';
  }

  return 'claude';
}

export default function MainContentHeader({
  activeTab,
  setActiveTab,
  selectedProject,
  selectedSession,
  shouldShowTasksTab,
  isMobile,
  onMenuClick,
  shellInstances,
  activeShellId,
  onChangeActiveShell,
  onCloseShell,
  onCreateShell,
}: MainContentHeaderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const closeCreateMenuTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollState]);

  useEffect(() => {
    if (!isCreateMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (createMenuRef.current?.contains(event.target as Node)) {
        return;
      }
      setIsCreateMenuOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCreateMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCreateMenuOpen]);

  useEffect(() => {
    return () => {
      if (closeCreateMenuTimerRef.current) {
        clearTimeout(closeCreateMenuTimerRef.current);
        closeCreateMenuTimerRef.current = null;
      }
    };
  }, []);

  const clearCloseCreateMenuTimer = useCallback(() => {
    if (closeCreateMenuTimerRef.current) {
      clearTimeout(closeCreateMenuTimerRef.current);
      closeCreateMenuTimerRef.current = null;
    }
  }, []);

  const openCreateMenu = useCallback(() => {
    clearCloseCreateMenuTimer();
    setIsCreateMenuOpen(true);
  }, [clearCloseCreateMenuTimer]);

  const scheduleCloseCreateMenu = useCallback(() => {
    clearCloseCreateMenuTimer();
    closeCreateMenuTimerRef.current = setTimeout(() => {
      setIsCreateMenuOpen(false);
      closeCreateMenuTimerRef.current = null;
    }, 120);
  }, [clearCloseCreateMenuTimer]);

  return (
    <div className="pwa-header-safe flex-shrink-0 border-b border-border/60 bg-background px-3 py-1.5 sm:px-4 sm:py-2">
      <div className="flex items-center justify-between gap-3">
        {activeTab === 'shell' ? (
          <div className="relative z-10 flex min-w-0 flex-1 items-center gap-2">
            {isMobile && <MobileMenuButton onMenuClick={onMenuClick} />}

            <div
              className={
                'flex min-w-0 flex-1 items-center gap-2 ' +
                (isCreateMenuOpen ? 'overflow-visible' : 'overflow-x-auto')
              }
            >
              {shellInstances.map((instance) => {
                const isActiveShell = instance.id === activeShellId;
                const displayTitle = getShellDisplayTitle(instance);
                const provider = getShellProvider(instance);

                return (
                  <button
                    key={instance.id}
                    type="button"
                    className={
                      'group inline-flex h-8 items-center gap-2 rounded-full border px-3 text-sm transition-colors ' +
                      (isActiveShell
                        ? 'border-border bg-muted text-foreground'
                        : 'border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground')
                    }
                    onClick={() => onChangeActiveShell(instance.id)}
                  >
                    {provider === 'system' ? (
                      <Terminal className="h-3.5 w-3.5 flex-shrink-0" />
                    ) : (
                      <SessionProviderLogo provider={provider} className="h-3.5 w-3.5 flex-shrink-0" />
                    )}
                    <span className="max-w-[180px] truncate">{displayTitle}</span>
                    <span
                      role="button"
                      tabIndex={0}
                      className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground"
                      onClick={(event) => {
                        event.stopPropagation();
                        onCloseShell(instance.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          event.stopPropagation();
                          onCloseShell(instance.id);
                        }
                      }}
                    >
                      ×
                    </span>
                  </button>
                );
              })}
              <div
                ref={createMenuRef}
                className="relative flex-shrink-0"
                onMouseEnter={openCreateMenu}
                onMouseLeave={scheduleCloseCreateMenu}
              >
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => {
                    clearCloseCreateMenuTimer();
                    setIsCreateMenuOpen((open) => !open);
                  }}
                  title="新建终端"
                  aria-haspopup="menu"
                  aria-expanded={isCreateMenuOpen}
                >
                  <Plus className="h-4 w-4" />
                </button>

                <div
                  className={
                    'absolute left-full top-1/2 z-20 ml-1 flex -translate-y-1/2 items-center gap-1 rounded-full border border-border/70 bg-background/95 p-1 shadow-lg backdrop-blur-sm transition-all ' +
                    (isCreateMenuOpen
                      ? 'pointer-events-auto translate-x-0 opacity-100'
                      : 'pointer-events-none -translate-x-1 opacity-0')
                  }
                >
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => {
                      onCreateShell('claude');
                      setIsCreateMenuOpen(false);
                    }}
                    title="Claude Shell"
                  >
                    <SessionProviderLogo provider="claude" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => {
                      onCreateShell('cursor');
                      setIsCreateMenuOpen(false);
                    }}
                    title="Cursor Shell"
                  >
                    <SessionProviderLogo provider="cursor" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => {
                      onCreateShell('codex');
                      setIsCreateMenuOpen(false);
                    }}
                    title="Codex Shell"
                  >
                    <SessionProviderLogo provider="codex" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => {
                      onCreateShell('gemini');
                      setIsCreateMenuOpen(false);
                    }}
                    title="Gemini Shell"
                  >
                    <SessionProviderLogo provider="gemini" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => {
                      onCreateShell('opencode');
                      setIsCreateMenuOpen(false);
                    }}
                    title="OpenCode Shell"
                  >
                    <SessionProviderLogo provider="opencode" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => {
                      onCreateShell('system');
                      setIsCreateMenuOpen(false);
                    }}
                    title="System Shell"
                  >
                    <Terminal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {isMobile && <MobileMenuButton onMenuClick={onMenuClick} />}
            <MainContentTitle
              activeTab={activeTab}
              selectedProject={selectedProject}
              selectedSession={selectedSession}
              shouldShowTasksTab={shouldShowTasksTab}
            />
          </div>
        )}

        <div className="relative min-w-0 flex-shrink overflow-hidden sm:flex-shrink-0">
          {canScrollLeft && (
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent" />
          )}
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="scrollbar-hide overflow-x-auto"
          >
            <MainContentTabSwitcher
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              shouldShowTasksTab={shouldShowTasksTab}
            />
          </div>
          {canScrollRight && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent" />
          )}
        </div>
      </div>
    </div>
  );
}
