import React, { useRef, useState, useEffect } from "react";
import { layout } from "../../config/layout";
import Button from "../Button";
import { colors } from "../../config/colors";
import { useFormAutomation } from "../../hooks/useFormAutomation";

function ContactInfo({ contact }) {
  const webviewRef = useRef(null);
  const [isWebviewReady, setIsWebviewReady] = useState(false);
  const { fillForm } = useFormAutomation(webviewRef, isWebviewReady, contact);

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
      backgroundColor: "#e8d7d7",
      display: "flex",
      flexDirection: "column",
    },
    buttonContainer: {
      position: "absolute",
      bottom: "-54px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1,
      display: "flex",
    },
    webview: {
      flex: 1,
      border: "none",
      margin: 0,
      padding: 0,
    }
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
          text="Fill Form"
          color={colors.primary}
          onClick={fillForm}
          disabled={!isWebviewReady}
        />
      </div>
    </div>
  );
}

export default ContactInfo;
