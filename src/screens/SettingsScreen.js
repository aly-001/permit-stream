import React from "react";
import { colors } from "../config/colors";
import { layout } from "../config/layout";

function SettingsScreen() {
  const styles = {
    mainContainer: {
      display: "flex",
      height: "100%",
      width: "calc(100% - 60px)",
      position: "fixed",
      top: 0,
      left: "60px",
      right: 0,
      bottom: 0,
      overflow: "hidden",
      backgroundColor: colors.primaryBackground,
      padding: layout.homeScreenSmallMargin,
      paddingTop: layout.homeScreenLargeMargin,
      paddingBottom: layout.homeScreenLargeMargin,
    },
  };

  return (
    <div style={styles.mainContainer}>
      <h1 style={{ color: colors.primaryText }}>Settings</h1>
    </div>
  );
}

export default SettingsScreen;