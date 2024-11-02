const { app, BrowserWindow, ipcMain, dialog, globalShortcut } = require('electron');
const path = require('path');
const https = require('https');
const fs = require('fs');
const installExtension = require('electron-devtools-installer');

// Add error handling for @electron/remote
let remoteMain;
try {
  remoteMain = require('@electron/remote/main');
  remoteMain.initialize();
} catch (e) {
  console.error('Failed to initialize @electron/remote:', e);
}



/// TEMP CODE HANDLER
ipcMain.handle('save-file', async (event, { filename, blob }) => {
  try {
    // Create a downloads directory in the app's user data folder
    const userDataPath = app.getPath('userData');
    const downloadsPath = path.join(userDataPath, 'downloads');
    
    if (!fs.existsSync(downloadsPath)) {
      fs.mkdirSync(downloadsPath, { recursive: true });
    }

    // Create a safe filename
    const safeName = filename.replace(/[^a-z0-9.-]/gi, '_');
    const filePath = path.join(downloadsPath, safeName);

    // Write the file
    fs.writeFileSync(filePath, Buffer.from(blob));

    return { success: true, filePath };
  } catch (error) {
    console.error('Failed to save file:', error);
    throw error;
  }
});
/// TEMP CODE HANDLER

ipcMain.handle('upload-file', async (event, { inputId, filePath, filename }) => {
  try {
    // Read the file from the local path
    const fileContent = await fs.promises.readFile(filePath);
    
    // Send the file content back to the renderer to handle the upload
    event.sender.send('file-content-ready', {
      inputId,
      content: fileContent,
      filename
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error handling file upload:', error);
    throw error;
  }
});

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

ipcMain.handle('download-file', async (event, { url, fileName, headers }) => {
  const downloadsPath = path.join(app.getPath('userData'), 'downloads');
  // Ensure the downloads directory exists
  await fs.promises.mkdir(downloadsPath, { recursive: true });
  
  const filePath = path.join(downloadsPath, fileName);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https.get(url, { headers }, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        resolve(filePath);
      });

      file.on('error', (err) => {
        fs.unlink(filePath, () => reject(err));
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => reject(err));
    });
  });
});

async function installDevTools() {
  try {
    const REACT_DEVELOPER_TOOLS = require('electron-devtools-installer').REACT_DEVELOPER_TOOLS;
    const name = await installExtension(REACT_DEVELOPER_TOOLS);
    console.log(`Added Extension: ${name}`);
  } catch (err) {
    console.log('An error occurred installing DevTools: ', err);
  }
}

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
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));

    // Open DevTools in development mode
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(async () => {
  if (process.env.NODE_ENV === 'development') {
    await installDevTools();
  }
  createWindow();

  // Add keyboard shortcuts
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    // Opens DevTools in the main window
    BrowserWindow.getFocusedWindow().webContents.openDevTools();
  });
});

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
