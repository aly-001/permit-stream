import React from "react";
import ContactsNav from "../components/home/ContactsNav";
import MainWindow from "../components/home/MainWindow";
import { colors } from "../config/colors";
import { layout } from "../config/layout";

function HomeScreen() {
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
      backgroundColor: colors.primary,
      padding: layout.homeScreenSmallMargin,
      paddingTop: layout.homeScreenLargeMargin,
      paddingBottom: layout.homeScreenLargeMargin,
    },
    rightSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    }
  };

  return (
    <div style={styles.mainContainer}>
      <ContactsNav />
      <div style={{width: layout.homeScreenSmallMargin}}></div>
      <div style={styles.rightSection}>
        <MainWindow />
      </div>
    </div>
  );
}

export default HomeScreen;
