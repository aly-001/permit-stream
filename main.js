const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const https = require('https');

// Add error handling for @electron/remote
let remoteMain;
try {
  remoteMain = require('@electron/remote/main');
  remoteMain.initialize();
} catch (e) {
  console.error('Failed to initialize @electron/remote:', e);
}

ipcMain.handle('api-request', async (event, { url, options }) => {
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      method: options.method || 'GET',
      headers: options.headers,
    }, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        resolve({
          ok: response.statusCode >= 200 && response.statusCode < 300,
          data: JSON.parse(data),
          statusText: response.statusMessage
        });
      });
    });

    request.on('error', (error) => {
      reject({
        ok: false,
        statusText: error.message
      });
    });

    if (options.body) {
      request.write(JSON.stringify(options.body));
    }
    
    request.end();
  });
});

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webviewTag: true,
            enableRemoteModule: true,
            webSecurity: true,
        }
    });

    if (remoteMain) {
        remoteMain.enable(mainWindow.webContents);
    }

    // Add download handler
    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        item.once('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download completed');
            } else {
                console.log('Download failed');
            }
        });
    });

    // Load the index.html file
    const isDev = process.env.NODE_ENV === 'development';
    mainWindow.loadURL(
        isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'index.html')}`
    );

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
