// hooks/useFormAutomation.js
import { useCallback } from "react";

const FORM_DATA = {
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

export const useFormAutomation = (webviewRef, isWebviewReady) => {
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

  /// LOTS MORE CODE REMOVED

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
    uploadImage,
  ]);

  return { fillForm };
};
