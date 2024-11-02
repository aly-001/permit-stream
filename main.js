const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');

// Add error handling for @electron/remote
let remoteMain;
try {
  remoteMain = require('@electron/remote/main');
  remoteMain.initialize();
} catch (e) {
  console.error('Failed to initialize @electron/remote:', e);
}

ipcMain.handle('api-request', async (event, { url, options }) => {
  try {
    const response = await new Promise((resolve, reject) => {
      const req = https.request(url, {
        ...options,
        headers: options.headers
      }, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          // Log the raw response for debugging
          console.log('Raw response:', data);
          console.log('Status code:', res.statusCode);

          // Handle authentication failure
          if (res.statusCode === 401) {
            resolve({
              ok: false,
              statusText: data.trim(), // Use the raw error message
              data: null,
              status: 401
            });
            return;
          }

          // For successful responses, try to parse JSON
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const jsonData = JSON.parse(data);
              resolve({
                ok: true,
                statusText: res.statusMessage,
                data: jsonData,
                status: res.statusCode
              });
            } catch (error) {
              resolve({
                ok: false,
                statusText: 'Invalid JSON response',
                data: null,
                status: res.statusCode
              });
            }
          } else {
            // For other error status codes
            resolve({
              ok: false,
              statusText: data.trim() || res.statusMessage,
              data: null,
              status: res.statusCode
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      // Only write body if it exists and method isn't GET
      if (options.body && options.method !== 'GET') {
        req.write(JSON.stringify(options.body));
      }
      
      req.end();
    });

    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      ok: false,
      statusText: error.message,
      data: null,
      status: 500
    };
  }
});

ipcMain.handle('download-file', async (event, { url, headers, filename }) => {
  try {
    const downloadPath = path.join(app.getPath('userData'), 'downloads');
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }

    const filePath = path.join(downloadPath, filename);
    
    return new Promise((resolve, reject) => {
      const req = https.request(url, {
        method: 'GET',
        headers: headers
      }, (res) => {
        if (res.statusCode === 401) {
          reject(new Error('Failed to download: 401'));
          return;
        }

        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download: ${res.statusCode}`));
          return;
        }

        const fileStream = fs.createWriteStream(filePath);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          resolve({
            success: true,
            filePath: filePath,
            error: null
          });
        });

        fileStream.on('error', (err) => {
          fs.unlink(filePath, () => {
            reject(new Error(`File write error: ${err.message}`));
          });
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request error: ${error.message}`));
      });

      req.end();
    });
  } catch (error) {
    console.error('Download Error:', error);
    return {
      success: false,
      filePath: null,
      error: error.message
    };
  }
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
    mainWindow.webContents.openDevTools();
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
