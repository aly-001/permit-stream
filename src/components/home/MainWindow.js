import React from "react";
import { colors } from "../../config/colors";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import { useContacts } from "../../contexts/ContactContext";
import AppText from "../AppText";
import ToggleButton from "../ToggleButton";
import { layout } from "../../config/layout";
import { FaInfo, FaCheck } from 'react-icons/fa';

function MainWindow() {
  const { currentContact, display, setDisplay } = useContacts();
  
  const styles = {
    container: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
    },
    toggleContainer: {
      position: "absolute",
      top: "-54px",
      zIndex: 1,
    },
    displayScreen: {
      flex: 1,
      backgroundColor: colors.pinkGrey,
      width: "100%",
    },
    noSelection: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      color: colors.primaryText,
    }
  };

  if (!currentContact) {
    return (
      <div style={styles.displayScreen}>
        <div style={styles.noSelection}>
          Please select a contact
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.toggleContainer}>
        <ToggleButton
          onToggle={() => setDisplay(display === 'info' ? 'form' : 'info')}
          disabled={false}
          leftIcon={FaInfo}
          rightIcon={FaCheck}
          isLeft={display === 'info'}
        />
      </div>
      <div style={styles.displayScreen}>
        {display === 'form' ? (
          <ContactForm contact={currentContact} />
        ) : (
          <ContactInfo contact={currentContact} onNext={() => setDisplay('form')} />
        )}
      </div>
    </div>
  );
}

export default MainWindow;