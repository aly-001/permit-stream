import React from "react";
import { colors } from "../../config/colors";
import { layout } from "../../config/layout";
import HeaderText from "../HeaderText";
import IndividualContact from "./IndividualContact";
import { useContacts } from "../../contexts/ContactContext";

function ContactsNav() {
  const { filteredContacts, setCurrentContact, currentContact } = useContacts();
  // console.log('ContactsNav render - filteredContacts:', filteredContacts);
  
  const styles = {
    contactsNav: {
      width: layout.sizes.contactNavWidth,
      backgroundColor: colors.secondaryBackground,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: layout.mainBorderRadius,
    },
    contactsHeader: {
      padding: layout.homeScreenSmallMargin,
      flexShrink: 0,
    },
    contactsList: {
      flex: 1,
      overflowY: "auto",
    }
  };

  return (
    
    <div style={styles.contactsNav}>
      <div style={styles.contactsList}>
        {filteredContacts.map((contact) => (
          <IndividualContact 
            key={contact.id}
            contact={contact}
            isSelected={currentContact?.id === contact.id}
            onClick={() => setCurrentContact(contact)}
          />
        ))}
      </div>
    </div>
  );
}

export default ContactsNav;
