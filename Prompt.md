I have a working permit filler application. 
The way it works:
- it gathers user data from JobNimbus
- It downloads these files to a local directory on my computer
- It stores the local file paths in the contact object
- Later, when filling the form, it accesses the file paths, and uploads them into the form.

The problem:
- It takes a very long time to call the uploadDocuments function in the form automation hook.
- Probably like 5 seconds per file, or something. Even though the files are pdfs that are like 10-15mb. Should be faster.

What I need you to do
- Deep dive into possible solutions for how to make the automation hook run faster
- Don't be afraid to do radical stuff like have the files load beforehand or something
- It's up to you to figure out what we should change to make the permit filler faster.

I've attached the relevant files below.

Note that this is a react application using express

// hooks/useFormAutomation.js
import { useCallback } from "react";

const { app } = window.require('@electron/remote');
const path = window.require('path');
const fs = window.require('fs');

const DEFAULT_FORM_DATA = {
  site_id: "0020001843127",
  planned_date: {
    month_offset: 3,
    day: 15,
  },
  city: "Calgary",
  postal_code: "T2H 2A8",
  current_energy_consumption: "hello-world",
  projected_energy_production: "hello-world12345",
  energy_source: "Solar",
  generator_type: "Synchronous",
  ac_capacity: "1.23",
  required_documents: [
    "Electrical single-line diagram",
    "Site plan",
    "Inverter specification",
    "Solar panel specifications",
    "Bidirectional meter installation acknowledgement",
  ],
  document_path: "/src/assets/images/my-image.jpg",
  contact: {
    name: "John Doe",
    phone: "9999999999",
    email: "johndoe@trollmail.com",
    preferred_method: "email",
  },
};

export const useFormAutomation = (webviewRef, isWebviewReady, formData = DEFAULT_FORM_DATA) => {
  // log the formData
  console.log("formData", formData);
  const waitForWebview = useCallback(() => {
    return new Promise((resolve) => {
      if (isWebviewReady) {
        resolve();
      } else {
        const checkWebview = setInterval(() => {
          if (isWebviewReady) {
            clearInterval(checkWebview);
            resolve();
          }
        }, 100);
      }
    });
  }, [isWebviewReady]);

  const executeWithTimeout = useCallback(
    async (script, timeout = 5000) => {  // Reduced from 10000
      if (!webviewRef.current) return null;

      try {
        await waitForWebview();
        return await webviewRef.current.executeJavaScript(`
          Promise.race([
            (async () => { 
              try {
                ${script}
              } catch (e) {
                console.error('Script error:', e);
                throw e;
              }
            })(),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout')), ${timeout})
            )
          ])
        `);
      } catch (error) {
        console.error("Script execution error:", error);
        throw error;
      }
    },
    [webviewRef, waitForWebview]
  );

  const clickButtonByText = useCallback(
    (text, sectionId = "") =>
      executeWithTimeout(
        `
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 10;  // Reduced from 20
          function attemptClick() {
            attempts++;
            let searchArea = document;
            if ('${sectionId}') {  // Fix: Pass sectionId as a string literal
              searchArea = document.getElementById('${sectionId}') || document;
            }
            const buttons = Array.from(searchArea.querySelectorAll('button'));
            const button = buttons.find(btn => 
              btn.textContent.toLowerCase().includes('${text.toLowerCase()}')
            );
            if (button) {
              button.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => {
                try {
                  button.click();
                  // Special delay only for site-information section
                  const delay = '${sectionId}' === 'site-information' ? 1000 : 50;
                  setTimeout(() => resolve('Button "${text}" clicked'), delay);
                } catch (e) {
                  reject('Failed to click button "${text}": ' + e);
                }
              }, 50);  // Reduced from 500
            } else if (attempts < maxAttempts) {
              setTimeout(attemptClick, 50);  // Reduced from 500
            } else {
              reject('Button "${text}" not found after maximum attempts');
            }
          }
          attemptClick();
        });
      `,
        5000  // Reduced from 15000
      ),
    [executeWithTimeout]
  );

  const clickRadioButtonById = useCallback(
    (id) =>
      executeWithTimeout(
        `
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 10;  // Reduced from 20
          function attemptClick() {
            attempts++;
            const radioButton = document.getElementById('${id}');
            if (radioButton) {
              radioButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => {
                try {
                  radioButton.click();
                  resolve('Radio button "${id}" clicked');
                } catch (e) {
                  reject('Failed to click radio button "${id}": ' + e);
                }
              }, 50);  // Reduced from 500
            } else if (attempts < maxAttempts) {
              setTimeout(attemptClick, 50);  // Reduced from 500
            } else {
              reject('Radio button "${id}" not found after maximum attempts');
            }
          }
          attemptClick();
        });
      `,
        5000  // Reduced from 15000
      ),
    [executeWithTimeout]
  );

  const fillInputById = useCallback(
    (id, value) =>
      executeWithTimeout(
        `
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 10;  // Reduced from 20
          function attemptFill() {
            attempts++;
            const input = document.getElementById('${id}');
            if (input) {
              input.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => {
                try {
                  const valueSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), 'value').set;
                  valueSetter.call(input, \`${value}\`);
                  const event = new Event('input', { bubbles: true });
                  input.dispatchEvent(event);
                  resolve('Input "${id}" filled');
                } catch (e) {
                  reject('Failed to fill input "${id}": ' + e);
                }
              }, 50);  // Reduced from 500
            } else if (attempts < maxAttempts) {
              setTimeout(attemptFill, 50);  // Reduced from 500
            } else {
              reject('Input "${id}" not found after maximum attempts');
            }
          }
          attemptFill();
        });
      `,
        5000  // Reduced from 15000
      ),
    [executeWithTimeout]
  );

  const openDatePicker = useCallback(
    () =>
      executeWithTimeout(
        `
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 10;  // Reduced from 20
          function attemptOpen() {
            attempts++;
            const dateField = document.querySelector("span[class*='date-time-input_datetime__value']");
            if (dateField) {
              dateField.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => {
                try {
                  dateField.click();
                  resolve('Date picker opened');
                } catch (e) {
                  reject('Failed to open date picker: ' + e);
                }
              }, 50);  // Reduced from 500
            } else if (attempts < maxAttempts) {
              setTimeout(attemptOpen, 50);  // Reduced from 500
            } else {
              reject('Date field not found after maximum attempts');
            }
          }
          attemptOpen();
        });
      `,
        5000  // Reduced from 15000
      ),
    [executeWithTimeout]
  );

  const advanceMonth = useCallback(
    (offset) =>
      executeWithTimeout(
        `
        return new Promise((resolve, reject) => {
          let clicks = 0;
          function clickNext() {
            const nextButton = document.querySelector('.rdtNext');
            if (nextButton) {
              nextButton.click();
              clicks++;
              if (clicks < ${offset}) {
                setTimeout(clickNext, 50);  // Reduced from 500
              } else {
                resolve('Advanced to the desired month');
              }
            } else {
              reject('Next month button not found');
            }
          }
          clickNext();
        });
      `,
        5000  // Reduced from 15000
      ),
    [executeWithTimeout]
  );

  const selectDay = useCallback(
    (day) =>
      executeWithTimeout(
        `
        return new Promise((resolve, reject) => {
          function selectDate() {
            const dayElement = Array.from(document.querySelectorAll('td.rdtDay')).find(td => td.textContent == ${day});
            if (dayElement) {
              dayElement.click();
              resolve('Date selected');
            } else {
              reject('Day element not found');
            }
          }
          selectDate();
        });
      `,
        5000  // Reduced from 15000
      ),
    [executeWithTimeout]
  );

  const clickDropdownAndSelect = useCallback(
    (dropdownClass, optionText) =>
      executeWithTimeout(
        `
        return new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 10;  // Reduced from 20
          function attemptSelect() {
            attempts++;
            const dropdown = document.querySelector('div[class*="${dropdownClass}"]');
            if (dropdown) {
              dropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(() => {
                try {
                  dropdown.click();
                  setTimeout(() => {
                    const option = Array.from(document.querySelectorAll('div.dropdown_dropdown__option__dhutD'))
                      .find(opt => opt.textContent.trim() === '${optionText}');
                    if (option) {
                      option.click();
                      resolve('Option selected');
                    } else {
                      reject('Option not found');
                    }
                  }, 50);  // Reduced from 500
                } catch (e) {
                  reject('Failed to interact with dropdown: ' + e);
                }
              }, 50);  // Reduced from 500
            } else if (attempts < maxAttempts) {
              setTimeout(attemptSelect, 50);  // Reduced from 500
            } else {
              reject('Dropdown not found after maximum attempts');
            }
          }
          attemptSelect();
        });
      `,
        5000  // Reduced from 15000
      ),
    [executeWithTimeout]
  );

  const clickCheckboxById = useCallback(
    (id) =>
      executeWithTimeout(
        `
        return new Promise((resolve, reject) => {
          const checkbox = document.getElementById('${id}');
          if (checkbox) {
            checkbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              try {
                checkbox.click();
                resolve('Checkbox clicked');
              } catch (e) {
                reject('Failed to click checkbox: ' + e);
              }
            }, 50);  // Reduced from 500
          } else {
            reject('Checkbox not found');
          }
        });
      `,
        5000  // Reduced from 15000
      ),
    [executeWithTimeout]
  );

  const downloadDocument = useCallback(async (document) => {
    try {
      // Create downloads directory in app data
      const downloadsPath = path.join(app.getPath('userData'), 'downloads');
      if (!fs.existsSync(downloadsPath)) {
        fs.mkdirSync(downloadsPath);
      }

      const filePath = path.join(downloadsPath, document.filename);
      
      // Download file using ipcRenderer
      await ipcRenderer.invoke('download-file', {
        url: document.downloadUrl,
        filePath: filePath
      });

      return filePath;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }, []);

  const uploadDocuments = useCallback(async () => {
    console.log('Starting document upload process with documents:', formData.documents);
    try {
      for (const document of formData.documents) {
        console.log('Processing document:', {
          filename: document.filename,
          path: document.localPath,
          exists: fs.existsSync(document.localPath)
        });
        
        // Read file content synchronously
        const fileContent = fs.readFileSync(document.localPath);
        console.log('File content read, size:', fileContent.length);

        await executeWithTimeout(
          `
          return new Promise((resolve, reject) => {
            try {
              console.log('Starting file upload in webview');
              const input = document.querySelector('input[type="file"]');
              if (!input) {
                throw new Error('File input element not found');
              }

              // Create a File object from the file content
              const file = new File(
                [new Uint8Array(${JSON.stringify(Array.from(fileContent))})],
                '${document.filename}',
                { type: '${document.contentType}' }
              );

              // Create a DataTransfer object
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              
              // Set the files property
              input.files = dataTransfer.files;

              // Dispatch change event
              const event = new Event('change', { bubbles: true });
              input.dispatchEvent(event);
              
              console.log('File upload completed in webview');
              resolve('File processed: ${document.filename}');
            } catch (e) {
              console.error('Upload error in webview:', e);
              reject(e);
            }
          });
          `, 10000); // Increased timeout for file processing

        console.log(`Successfully processed document: ${document.filename}`);
        // Add a larger delay between uploads
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error('Detailed upload error:', {
        message: error.message,
        stack: error.stack,
        documents: formData.documents
      });
      throw error;
    }
  }, [executeWithTimeout, formData.documents]);

  const clickLargeContinueButton = useCallback(
    () =>
      executeWithTimeout(
        `
        return new Promise((resolve, reject) => {
          const largeButton = document.querySelector('button.button--large.button--primary');
          if (largeButton) {
            largeButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              try {
                largeButton.click();
                resolve('Large continue button clicked');
              } catch (e) {
                reject('Failed to click large continue button: ' + e);
              }
            }, 50);  // Reduced from 500
          } else {
            reject('Large continue button not found');
          }
        });
      `,
        5000  // Reduced from 15000
      ),
    [executeWithTimeout]
  );

  const fillForm = useCallback(async () => {
    try {
      await waitForWebview();

      // Click "I am the unit owner"
      await clickButtonByText("i am the unit owner");

      // Click "I understand" button
      await clickButtonByText("i understand");

      // Enter site ID
      await fillInputById("site_id", formData.site_id);

      // Click lookup button
      await clickButtonByText("look up");

      // Open date picker
      await openDatePicker();

      // Advance months
      await advanceMonth(formData.planned_date.month_offset);

      // Select day
      await selectDay(formData.planned_date.day);

      // Click "Yes" for AUC Rule
      await clickRadioButtonById("project_has_requirement_metYes");

      // Click "No" for existing customer
      await clickRadioButtonById("project_is_existing_customerNo");

      // Click Continue
      await clickButtonByText("Continue");

      // Site Information Section
      await clickDropdownAndSelect("dropdown_dropdown__value", formData.city);
      await fillInputById("postal_code", formData.postal_code);

      // Click Continue within the site-information section
      await clickButtonByText("Continue", "site-information");

      // Usage and Generation Section
      await fillInputById(
        "ann_current_energy_consumption",
        formData.current_energy_consumption
      );
      await fillInputById(
        "projected_ann_energy_production",
        formData.projected_energy_production
      );
      await clickDropdownAndSelect(
        "dropdown_dropdown__value",
        formData.energy_source
      );
      await clickRadioButtonById(formData.generator_type);
      await fillInputById("current_cap_kw", formData.ac_capacity);
      await clickRadioButtonById("has_energy_storage_unitNo");
      await clickRadioButtonById("has_aggregating_multiple_siteNo");
      await clickButtonByText("Continue", "usage-generation");

      // Supporting Documents Section
      for (let i = 0; i < formData.required_documents.length; i++) {
        await clickCheckboxById(`document-checkbox-${i}`);
      }

      // Upload the actual documents instead of dummy image
      await uploadDocuments();
      
      // Note: File upload will need to be handled differently in a WebView
      await clickButtonByText("Continue", "supporting-documents");

      // Compliance Requirements Section
      const complianceIds = [
        "project_has_anti_slandingYes",
        "project_has_ul1741_supplement_complyYes",
        "project_has_microgen_wire_requirementYes",
        "compliance_requirement_met_zone_reqsYes",
        "compliance_requirement_completed_rule007Yes",
        "compliance_requirement_completed_rule012Yes",
        "compliance_requirement_met_env_reqYes",
      ];
      for (const id of complianceIds) {
        await clickRadioButtonById(id);
      }
      await clickRadioButtonById("compliance_requirement_objectionsNo");

      // Click the large continue button specifically
      await clickLargeContinueButton();

      // Contact Information Section
      await fillInputById("customer_name", formData.contact.name);
      await fillInputById("customer_phone", formData.contact.phone);
      await fillInputById("email", formData.contact.email);
      if (formData.contact.preferred_method === "email") {
        await clickCheckboxById("preferred-contact-checkbox-0");
      }
      await clickLargeContinueButton();

      console.log("Form filling steps completed successfully!");
    } catch (error) {
      console.error("Error during form filling:", error);
    }
  }, [
    waitForWebview,
    clickButtonByText,
    fillInputById,
    openDatePicker,
    advanceMonth,
    selectDay,
    clickRadioButtonById,
    clickDropdownAndSelect,
    clickCheckboxById,
    uploadDocuments,
    formData
  ]);

  return { fillForm };
};


// JobNimbusService.js
const { ipcRenderer } = window.require('electron');

class JobNimbusService {
  constructor(apiToken) {
    this.config = {
      apiToken,
      baseUrl: 'https://app.jobnimbus.com/api1'
    };
  }

  async request(endpoint, options = {}) {
    try {
      const response = await ipcRenderer.invoke('api-request', {
        url: `${this.config.baseUrl}${endpoint}`,
        options: {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiToken}`
          }
        }
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async getContacts() {
    return this.request('/contacts');
  }

  async getContactById(contactId) {
    return this.request(`/contacts/${contactId}`);
  }

  async getContactDocuments(contactId) {
    return this.request(`/files?grid=document&webui=yes&fields=content_type,filename,jnid,esign,size,pages,date_updated,related,description,date_created,date_file_created,record_type_name,created_by_name,created_by,report&related=${contactId}`);
  }

  getDocumentDownloadUrl(documentId) {
    return `${this.config.baseUrl}/files/${documentId}?download=1`;
  }

  async downloadDocument(documentId, fileName) {
    try {
      const downloadUrl = this.getDocumentDownloadUrl(documentId);
      const filePath = await ipcRenderer.invoke('download-file', {
        url: downloadUrl,
        fileName,
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Accept': '*/*'
        }
      });
      return filePath;
    } catch (error) {
      console.error(`Error downloading document ${fileName}:`, error);
      throw error;
    }
  }

  // New method to download multiple documents for a contact
  async downloadContactDocuments(contactId) {
    try {
      console.time('Total download time');
      const docs = await this.getContactDocuments(contactId);
      if (!docs.files || !docs.files.length) {
        console.timeEnd('Total download time');
        return [];
      }

      const downloadPromises = docs.files.map(async (doc) => {
        try {
          console.time(`Download time for ${doc.filename}`);
          const localPath = await this.downloadDocument(doc.jnid, doc.filename);
          console.timeEnd(`Download time for ${doc.filename}`);
          
          return {
            filename: doc.filename,
            downloadUrl: `file://${localPath}`,
            contentType: doc.content_type,
            localPath
          };
        } catch (error) {
          console.error(`Failed to download document ${doc.filename}:`, error);
          return null;
        }
      });

      const results = await Promise.all(downloadPromises);
      console.timeEnd('Total download time');
      return results.filter(result => result !== null);
    } catch (error) {
      console.error('Failed to download contact documents:', error);
      console.timeEnd('Total download time');
      throw error;
    }
  }
}

export default JobNimbusService;


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
  await fs.promises.mkdir(downloadsPath, { recursive: true });
  
  const filePath = path.join(downloadsPath, fileName);

  return new Promise((resolve, reject) => {
    const makeRequest = (requestUrl) => {
      const file = fs.createWriteStream(filePath);
      
      const request = https.get(requestUrl, { headers }, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          makeRequest(response.headers.location);
          return;
        }

        // Check if the response is successful
        if (response.statusCode !== 200) {
          file.close();
          fs.unlink(filePath, () => {
            reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
          });
          return;
        }

        // Pipe the response directly to the file
        response
          .pipe(file)
          .on('finish', () => {
            file.close(() => resolve(filePath));
          })
          .on('error', (err) => {
            file.close();
            fs.unlink(filePath, () => reject(err));
          });
      });

      request.on('error', (err) => {
        file.close();
        fs.unlink(filePath, () => reject(err));
      });
    };

    makeRequest(url);
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


// ContactContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import JobNimbusService from "../services/JobNimbusService";

const ContactContext = createContext();

const processContact = async (rawContact, jobNimbusService) => {
  const plannedDate = calculatePlannedDate(
    rawContact["Est Install Date"] || rawContact.cf_date_1
  );

  // Fetch and download documents for the contact
  let documents = [];
  try {
    documents = await jobNimbusService.downloadContactDocuments(
      rawContact.jnid
    );
  } catch (error) {
    console.error(
      `Failed to fetch documents for contact ${rawContact.jnid}:`,
      error
    );
  }

  return {
    id: rawContact.recid,
    site_id: rawContact.Site_ID || rawContact.cf_string_11 || "",
    planned_date: plannedDate,
    city: rawContact.city || "cat",
    postal_code: rawContact.zip || "cat",
    current_energy_consumption:
      rawContact.Consumption_Kwh?.toString() ||
      rawContact.cf_double_2?.toString() ||
      "",
    projected_energy_production:
      rawContact.Production_kWh?.toString() ||
      rawContact.cf_double_3?.toString() ||
      "",
    energy_source: "Solar",
    generator_type: "Synchronous",
    ac_capacity:
      rawContact.KW_DC?.toString() || rawContact.cf_double_4?.toString() || "",
    required_documents: [
      "Electrical single-line diagram",
      "Site plan",
      "Inverter specification",
      "Solar panel specifications",
      "Bidirectional meter installation acknowledgement",
    ],
    documents: documents,
    contact: {
      name: rawContact.display_name || "cat",
      phone:
        rawContact.home_phone ||
        rawContact.mobile_phone ||
        rawContact.work_phone ||
        "",
      email: rawContact.email || "cat",
      preferred_method: "email",
    },
  };
};

const calculatePlannedDate = (timestamp) => {
  if (!timestamp) return { month_offset: 3, day: 15 };

  const currentDate = new Date();
  const installDate = new Date(timestamp * 1000);

  let monthOffset =
    (installDate.getFullYear() - currentDate.getFullYear()) * 12 +
    (installDate.getMonth() - currentDate.getMonth());

  monthOffset = monthOffset < 0 ? 3 : monthOffset;

  return {
    month_offset: monthOffset,
    day: installDate.getDate(),
  };
};

export function ContactProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [currentContact, setCurrentContact] = useState(null);
  const [display, setDisplay] = useState("info");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  const jobNimbusService = new JobNimbusService("m2ud7n7j67nzk6x0");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await jobNimbusService.getContacts();
        console.log("Raw Contact Data:", response.results);

        // Process contacts sequentially to avoid overwhelming the system
        const processedContacts = [];
        for (const contact of response.results) {
          const processedContact = await processContact(
            contact,
            jobNimbusService
          );
          processedContacts.push(processedContact);
        }

        const sortedContacts = processedContacts.sort(
          (a, b) => b.date_created - a.date_created
        );
        setContacts(sortedContacts);
        setFilteredContacts(sortedContacts);
        console.log("Sorted Contacts:", sortedContacts);
        setCurrentContact(sortedContacts[0]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(
      (contact) =>
        contact.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  return (
    <ContactContext.Provider
      value={{
        contacts,
        filteredContacts,
        setContacts,
        currentContact,
        setCurrentContact,
        display,
        setDisplay,
        loading,
        error,
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContacts must be used within a ContactProvider");
  }
  return context;
}


Give this a shot and let me know what you come up with! Thanks a lot.