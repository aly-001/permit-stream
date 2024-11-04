import React, { useRef, useState, useEffect } from "react";
import { layout } from "../../config/layout";
import Button from "../Button";
import { colors } from "../../config/colors";
import { useFormAutomation } from "../../hooks/useFormAutomation";
import { useContacts } from "../../contexts/ContactContext";

function ContactInfo({ contact }) {
  const webviewRef = useRef(null);
  const [isWebviewReady, setIsWebviewReady] = useState(false);
  const [hasFilledForm, setHasFilledForm] = useState(false);
  const { fillForm } = useFormAutomation(webviewRef, isWebviewReady, contact);
  const { handleContactComplete } = useContacts();

  // Setup webview event handlers
  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.addEventListener("dom-ready", () => {
        console.log("Webview DOM ready");
        setIsWebviewReady(true);
      });
    }
  }, []);

  const styles = {
    container: {
      flex: 1,
      height: "100%",
      backgroundColor: colors.secondaryBackground, 
      display: "flex",
      flexDirection: "column",
    },
    buttonContainer: {
      position: "absolute",
      bottom: "-66px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1,
      display: "flex",
      gap: "10px",
    },
    webview: {
      flex: 1,
      border: "none",
      margin: 0,
      padding: 0,
    }
  };

  const handleFillForm = () => {
    fillForm();
    setHasFilledForm(true);
  };

  return (
    <div style={styles.container}>
      <webview
        ref={webviewRef}
        src="https://www.enmax.com/helping-power-your-project/start-a-project/connect-a-micro-generator"
        style={styles.webview}
        nodeintegration="true"
        webpreferences="contextIsolation=false"
      />

      <div style={styles.buttonContainer}>
        <Button
          text={hasFilledForm ? "Refill Form" : "Fill Form"}
          color={hasFilledForm ? colors.primary : "white"}
          backgroundColor={hasFilledForm ? "white" : colors.primary}
          textColor={hasFilledForm ? colors.primary : "white"}
          onClick={handleFillForm}
          disabled={!isWebviewReady}
        />
        {hasFilledForm && (
          <Button
            text="Mark as Done"
            backgroundColor={colors.primary}
            onClick={() => handleContactComplete(contact.id)}
            disabled={!isWebviewReady}
          />
        )}
      </div>
    </div>
  );
}

export default ContactInfo;
