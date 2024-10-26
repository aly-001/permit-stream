// utils/webviewHelpers.js
export const createWebviewPromise = (condition, maxAttempts = 20, interval = 500) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    function attemptOperation() {
      attempts++;
      const result = condition();
      
      if (result.success) {
        setTimeout(() => {
          try {
            result.action();
            resolve(result.message || 'Operation successful');
          } catch (e) {
            reject(`Failed to execute action: ${e}`);
          }
        }, 500);
      } else if (attempts < maxAttempts) {
        setTimeout(attemptOperation, interval);
      } else {
        reject(`Operation failed after ${maxAttempts} attempts`);
      }
    }
    
    attemptOperation();
  });
};

export const waitForWebview = (isReady) => {
  return new Promise((resolve) => {
    if (isReady) {
      resolve();
    } else {
      const checkWebview = setInterval(() => {
        if (isReady) {
          clearInterval(checkWebview);
          resolve();
        }
      }, 100);
    }
  });
};

export const executeWithTimeout = async (webviewRef, script, timeout = 10000, isWebviewReady) => {
  if (!webviewRef.current) return null;

  try {
    await waitForWebview(isWebviewReady);
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
};
