import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ReleaseInfo } from '../../../types/sharedTypes';
import { copyTextToClipboard } from '../../../utils/clipboard';
import type { InstallMode } from '../../../hooks/useVersionCheck';

interface VersionUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  releaseInfo: ReleaseInfo | null;
  currentVersion: string;
  latestVersion: string | null;
  installMode: InstallMode;
}

type DesktopUpdaterSnapshot = {
  supported: boolean;
  status: 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'downloaded' | 'error';
  message: string;
  progressPercent: number;
  availableVersion: string | null;
  downloadedVersion: string | null;
  error: string | null;
};

function formatDesktopUpdaterLog(state: DesktopUpdaterSnapshot) {
  const lines = [`Status: ${state.status}`];

  if (state.availableVersion) {
    lines.push(`Available version: v${state.availableVersion}`);
  }
  if (state.downloadedVersion) {
    lines.push(`Downloaded version: v${state.downloadedVersion}`);
  }
  if (state.status === 'downloading') {
    lines.push(`Progress: ${state.progressPercent.toFixed(1)}%`);
  }
  if (state.message) {
    lines.push(state.message);
  }

  return lines.join('\n');
}

export function VersionUpgradeModal({
  isOpen,
  onClose,
  releaseInfo,
  currentVersion,
  latestVersion,
  installMode,
}: VersionUpgradeModalProps) {
  const { t } = useTranslation('common');
  const upgradeCommand =
    installMode === 'npm' ? t('versionUpdate.npmUpgradeCommand') : 'git checkout main && git pull && npm install';
  const desktopApp = typeof window !== 'undefined' ? window.desktopApp : undefined;
  const desktopUpdater = desktopApp?.updater;
  const isDesktopApp = Boolean(desktopApp?.isDesktop);
  const hasDesktopUpdaterBridge = Boolean(isDesktopApp && desktopUpdater);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateOutput, setUpdateOutput] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [hasStartedUpdate, setHasStartedUpdate] = useState(false);
  const [desktopUpdaterState, setDesktopUpdaterState] = useState<DesktopUpdaterSnapshot | null>(null);
  const desktopUpdateFlowEnabled = Boolean(hasDesktopUpdaterBridge && desktopUpdaterState?.supported);

  useEffect(() => {
    if (!isOpen) {
      setUpdateOutput('');
      setUpdateError('');
      setIsUpdating(false);
      setHasStartedUpdate(false);
      setDesktopUpdaterState(null);
      return;
    }

    if (!hasDesktopUpdaterBridge || !desktopUpdater) return;

    let mounted = true;

    void desktopUpdater.getState().then((state) => {
      if (!mounted) return;
      setDesktopUpdaterState(state);
    });

    const unsubscribe = desktopUpdater.onStateChange((state) => {
      if (!mounted) return;
      setDesktopUpdaterState(state);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [hasDesktopUpdaterBridge, desktopUpdater, isOpen]);

  useEffect(() => {
    if (!desktopUpdateFlowEnabled || !desktopUpdaterState) return;

    const inProgress = desktopUpdaterState.status === 'checking' || desktopUpdaterState.status === 'downloading';
    setIsUpdating(inProgress);

    if (!hasStartedUpdate) return;

    setUpdateOutput(formatDesktopUpdaterLog(desktopUpdaterState));
    setUpdateError(desktopUpdaterState.error || '');
  }, [desktopUpdateFlowEnabled, desktopUpdaterState, hasStartedUpdate]);

  const handleDesktopUpdate = useCallback(async () => {
    if (!desktopUpdater) return;

    setHasStartedUpdate(true);
    setUpdateError('');

    const currentState = await desktopUpdater.getState();
    setDesktopUpdaterState(currentState);

    if (currentState.status === 'downloaded') {
      setUpdateOutput('Update downloaded. Restarting app to install...');
      const result = await desktopUpdater.quitAndInstall();
      if (!result.ok) {
        setUpdateError(result.error || 'Failed to install update');
      }
      return;
    }

    if (currentState.status === 'available') {
      setUpdateOutput('Update available. Downloading update...');
      const result = await desktopUpdater.downloadUpdate();
      if (!result.ok) {
        setUpdateError(result.error || 'Failed to download update');
      }
      return;
    }

    setUpdateOutput('Checking for desktop updates...');
    const result = await desktopUpdater.checkForUpdates();
    if (!result.ok) {
      setUpdateError(result.error || 'Failed to check for updates');
    }
  }, [desktopUpdater]);

  const handleUpdateNow = useCallback(async () => {
    if (isDesktopApp && !desktopUpdateFlowEnabled) {
      const releaseUrl = releaseInfo?.htmlUrl || 'https://github.com/luzedong/anycoding/releases/latest';
      window.open(releaseUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    if (desktopUpdateFlowEnabled) {
      await handleDesktopUpdate();
      return;
    }
  }, [desktopUpdateFlowEnabled, handleDesktopUpdate, isDesktopApp, releaseInfo?.htmlUrl]);

  const canShowUpdateButton = useMemo(() => {
    return isDesktopApp;
  }, [isDesktopApp]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label={t('versionUpdate.ariaLabels.closeModal')}
      />

      <div className="relative mx-4 max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('versionUpdate.title')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{releaseInfo?.title || t('versionUpdate.newVersionReady')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('versionUpdate.currentVersion')}</span>
            <span className="font-mono text-sm text-gray-900 dark:text-white">{currentVersion}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-700 dark:bg-blue-900/20">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('versionUpdate.latestVersion')}</span>
            <span className="font-mono text-sm text-blue-900 dark:text-blue-100">{latestVersion}</span>
          </div>
        </div>

        {releaseInfo?.body && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('versionUpdate.whatsNew')}</h3>
              {releaseInfo?.htmlUrl && (
                <a
                  href={releaseInfo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {t('versionUpdate.viewFullRelease')}
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm text-gray-700 dark:prose-invert dark:text-gray-300">
                {cleanChangelog(releaseInfo.body)}
              </div>
            </div>
          </div>
        )}

        {(updateOutput || updateError) && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('versionUpdate.updateProgress')}</h3>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-700 bg-gray-900 p-4 dark:bg-gray-950">
              <pre className="whitespace-pre-wrap font-mono text-xs text-green-400">{updateOutput}</pre>
            </div>
            {updateError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
                {updateError}
              </div>
            )}
          </div>
        )}

        {!isUpdating && !updateOutput && !desktopUpdateFlowEnabled && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t('versionUpdate.manualUpgrade')}</h3>
            {isDesktopApp ? (
              <>
                <div className="rounded-lg border bg-gray-100 p-3 text-sm text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {t('versionUpdate.viewFullRelease')}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Download the latest installer/package from the GitHub Release page.
                </p>
              </>
            ) : (
              <>
                <div className="rounded-lg border bg-gray-100 p-3 dark:bg-gray-800">
                  <code className="font-mono text-sm text-gray-800 dark:text-gray-200">{upgradeCommand}</code>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Run the command above in your terminal, then restart the service.
                </p>
              </>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            {updateOutput && !(desktopUpdateFlowEnabled && desktopUpdaterState?.status === 'downloaded')
              ? t('versionUpdate.buttons.close')
              : t('versionUpdate.buttons.later')}
          </button>

          {!isDesktopApp && !desktopUpdateFlowEnabled && !updateOutput && (
            <button
              onClick={() => copyTextToClipboard(upgradeCommand)}
              className="flex-1 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              {t('versionUpdate.buttons.copyCommand')}
            </button>
          )}

          {canShowUpdateButton && (
            <button
              onClick={handleUpdateNow}
              disabled={isUpdating}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              {isUpdating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t('versionUpdate.buttons.updating')}
                </>
              ) : (
                isDesktopApp && !desktopUpdateFlowEnabled
                  ? t('versionUpdate.viewFullRelease')
                  : t('versionUpdate.buttons.updateNow')
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const cleanChangelog = (body: string) => {
  if (!body) return '';

  return body
    .replace(/\b[0-9a-f]{40}\b/gi, '')
    .replace(/(?:^|\s|-)([0-9a-f]{7,10})\b/gi, '')
    .replace(/\*\*Full Changelog\*\*:.*$/gim, '')
    .replace(/https?:\/\/github\.com\/[^\/]+\/[^\/]+\/compare\/[^\s)]+/gi, '')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
};
