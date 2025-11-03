const { app, BrowserWindow, Menu, MenuItem, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'img', 'icon.ico'), // Ruta corregida: img dentro de src
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile(path.join(__dirname, '..', 'index.html')); // Asegura la ruta correcta al index.html

    // Menú contextual personalizado
    mainWindow.webContents.on('context-menu', (event, params) => {
        const menu = new Menu();
        menu.append(new MenuItem({
            label: 'Copiar',
            role: 'copy',
            enabled: params.editFlags.canCopy
        }));
        menu.append(new MenuItem({
            label: 'Pegar',
            role: 'paste',
            enabled: params.editFlags.canPaste
        }));
        menu.append(new MenuItem({
            label: 'Seleccionar todo',
            role: 'selectAll'
        }));
        menu.popup({ window: mainWindow });
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});