import React from "react";
import { colors } from "../config/colors";
function ContactsNav() {
  const styles = {
    contactsNav: {
      width: "250px",
      backgroundColor: colors.secondary,
      height: "100%",
    },
  };

  return (
    <div style={styles.contactsNav}>
      {/* Contacts list will go here */}
    </div>
  );
}

export default ContactsNav;