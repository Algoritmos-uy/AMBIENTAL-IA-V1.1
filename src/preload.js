const { contextBridge, ipcRenderer } = require('electron');

// Exponer funciones seguras al renderer
contextBridge.exposeInMainWorld('ambientalAPI', {
    send: (channel, data) => {
        // Solo permitir canales seguros
        const validChannels = ['toMain'];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        const validChannels = ['fromMain'];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});