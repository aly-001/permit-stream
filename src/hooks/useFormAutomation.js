// hooks/useFormAutomation.js
import { useCallback } from "react";
import { app } from '@electron/remote';
import path from 'path';
import fs from 'fs';

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
    console.log('Uploading documents:', formData.documents);
    return executeWithTimeout(`
      return new Promise(async (resolve, reject) => {
        try {
          const fileInput = document.querySelector('input[type="file"]');
          if (!fileInput) {
            throw new Error('File input not found');
          }

          fileInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          const dataTransfer = new DataTransfer();
          const documents = ${JSON.stringify(formData.documents)};
          
          for (const doc of documents) {
            if (!doc.localPath) {
              console.warn('Skipping document ' + doc.filename + ' - no local path');
              continue;
            }
            
            const file = await fetch('file://' + doc.localPath)
              .then(res => res.blob())
              .then(blob => new File([blob], doc.filename));
            dataTransfer.items.add(file);
          }
          
          fileInput.files = dataTransfer.files;
          fileInput.dispatchEvent(new Event('change', { bubbles: true }));
          
          resolve('Files uploaded');
        } catch (e) {
          reject('Failed to upload files: ' + e);
        }
      });
    `, 10000);
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
