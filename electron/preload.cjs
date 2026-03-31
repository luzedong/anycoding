const { contextBridge, ipcRenderer } = require('electron');

function onDesktopUpdaterStateChange(callback) {
  if (typeof callback !== 'function') {
    return () => {};
  }

  const listener = (_event, state) => {
    callback(state);
  };

  ipcRenderer.on('desktop-updater:state', listener);
  return () => {
    ipcRenderer.removeListener('desktop-updater:state', listener);
  };
}

contextBridge.exposeInMainWorld('desktopApp', {
  platform: process.platform,
  isDesktop: true,
  updater: {
    getState: () => ipcRenderer.invoke('desktop-updater:get-state'),
    checkForUpdates: () => ipcRenderer.invoke('desktop-updater:check'),
    downloadUpdate: () => ipcRenderer.invoke('desktop-updater:download'),
    quitAndInstall: () => ipcRenderer.invoke('desktop-updater:quit-and-install'),
    onStateChange: onDesktopUpdaterStateChange,
  },
});
