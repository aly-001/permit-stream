import React from "react";
import { colors } from "../../config/colors";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import { useContacts } from "../../contexts/ContactContext";
import AppText from "../AppText";
import ToggleButton from "../ToggleButton";
import { layout } from "../../config/layout";
import { FaInfo, FaCheck } from 'react-icons/fa';
import Button from "../Button";

function MainWindow() {
  const { currentContact, display, setDisplay } = useContacts();
  
  const styles = {
    container: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      height: "100%",
    },
    toggleAndButtonContainer: {
      position: "absolute",
      top: "-54px",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    },
    nextButton: {
      position: "absolute",
      bottom: "-66px",
      zIndex: 1,  
      marginTop: "30px",
    },
    displayScreen: {
      flex: 1,
      backgroundColor: colors.secondaryBackground,
      width: "100%",
      height: "100%",
      overflow: "hidden",
      borderRadius: layout.mainBorderRadius,
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
      <div style={styles.toggleAndButtonContainer}>
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
          <ContactInfo contact={currentContact} />
        )}
      </div>
      {display === 'info' && (
          <div style={styles.nextButton}>
            <Button
              text="Next"
              color={"white"}
              backgroundColor={colors.primary}
              onClick={() => setDisplay('form')}
              disabled={false}
            />
        </div>
      )}
    </div>
  );
}

export default MainWindow;