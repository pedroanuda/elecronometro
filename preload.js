const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld('electronAPI', {
    handlePlayOrPause: (callback) => ipcRenderer.on("playOrPause", callback),
    handleStop: (callback) => ipcRenderer.on("stop", callback),
    sendSignals: (callback) => ipcRenderer.invoke("signals", callback),
    openContextMenu: (params) => ipcRenderer.invoke("context-menu", params),
    closeAboutWindow: (callback) => ipcRenderer.invoke("close-about-window", callback)
});
