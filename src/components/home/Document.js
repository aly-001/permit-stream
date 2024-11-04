import React from "react";
import { colors } from "../../config/colors";
import AppText from "../AppText";

function Document({ filename, type }) {
  const styles = {
    container: {
      backgroundColor: colors.primaryBackground,
      padding: "12px",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      cursor: "pointer",
      transition: "transform 0.2s ease",
      "&:hover": {
        transform: "scale(1.02)",
      },
    },
  };

  return (
    <div style={styles.container}>
      <AppText 
        text={filename} 
        color={colors.primaryText} 
        size="14px" 
      />
      <AppText 
        text={type || "PDF"} 
        color={colors.primaryText} 
        size="12px" 
      />
    </div>
  );
}

export default Document;
