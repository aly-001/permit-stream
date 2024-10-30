import React from "react";
import { layout } from "../../config/layout";
import Button from "../Button";
import { colors } from "../../config/colors";


function ContactInfo({ contact, onNext }) {
  // Temporary contact for development
  const tempContact = {
    name: "John Doe",
    phone: "123-456-7890",
    email: "john.doe@example.com",
    address: "123 Main St, Anytown, USA"
  };

  // Use provided contact or fall back to temp contact
  const displayContact = contact || tempContact;

  const styles = {
    container: {
      flex: 1,
      height: "100%",
      padding: layout.homeScreenSmallMargin,
      backgroundColor: "#e8d7d7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonContainer: {
      position: "absolute",
      bottom: "-54px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1,
      display: "flex",
      gap: "10px",  // Space between buttons
    }
  };

  return (
    <div style={styles.container}>
      <div>PERMIT FORM for {displayContact.name}</div>

      <div style={styles.buttonContainer}>
        <Button
          text="Fill Form"
          color={colors.primary}
          onClick={() => {/* Add your fill form handler here */}}
          disabled={false}
        />
      </div>
    </div>
  );
}

export default ContactInfo;
