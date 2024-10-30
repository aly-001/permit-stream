import React from "react";
import { colors } from "../../config/colors";
import HeaderText from "../HeaderText";
import { layout } from "../../config/layout";
import AppText from "../AppText";
import Button from "../Button";

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
      backgroundColor: colors.blueGrey,
      position: "relative",
    },
    infoSection: {
      marginTop: "20px",
    },
    infoRow: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
    },
    nextButton: {
      position: "absolute",
      bottom: "-54px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1,
    }
  };

  return (
    <div style={styles.container}>
      <HeaderText text={displayContact.name} />
      
      <div style={styles.infoSection}>
        <div style={styles.infoRow}>
          <AppText text="Phone" color={colors.primaryText} size="14px" />
          <AppText text={displayContact.phone} color={colors.secondaryText} size="16px" />
        </div>

        <div style={styles.infoRow}>
          <AppText text="Email" color={colors.primaryText} size="14px" />
          <AppText text={displayContact.email} color={colors.secondaryText} size="16px" />
        </div>

        <div style={styles.infoRow}>
          <AppText text="Address" color={colors.primaryText} size="14px" />
          <AppText text={displayContact.address} color={colors.secondaryText} size="16px" />
        </div>
      </div>

      <div style={styles.nextButton}>
        <Button
          text="Next"
          color={colors.primary}
          onClick={onNext}
          disabled={false}
        />
      </div>
    </div>
  );
}

export default ContactInfo;
