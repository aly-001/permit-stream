import React from "react";
import { colors } from "../../config/colors";
import AppText from "../AppText";

const IndividualContact = ({ contact, isSelected, onClick }) => {
  const styles = {
    contactBox: {
      backgroundColor: isSelected ? colors.primary : colors.pinkGrey,
      padding: "10px",
      margin: "5px",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
  };

  return (
    <div style={styles.contactBox} onClick={onClick}>
      <AppText 
        color={isSelected ? colors.pinkGrey : colors.primary} 
        text={contact.contact.name} 
      />
    </div>
  );
};

export default IndividualContact;
