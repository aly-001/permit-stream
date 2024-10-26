const { app, BrowserWindow } = require('electron');
const path = require('path');
require('@electron/remote/main').initialize();

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
            enableRemoteModule: true
        }
    });

    // Load the index.html file
    mainWindow.loadFile('index.html');

    // Open DevTools in development mode
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});