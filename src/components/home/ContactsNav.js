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
      backgroundColor: colors.secondary,
      height: "100%",
    },
    contactsHeader: {
      position: "absolute",
      top: "43px",
      left: 0,
      padding: layout.homeScreenSmallMargin,
    },
  };

  return (
    <>
      <div style={styles.contactsHeader}>
        <HeaderText text="Contacts" />
      </div>
      <div style={styles.contactsNav}>
        {filteredContacts.map((contact) => (
          <IndividualContact 
            key={contact.id}
            contact={contact}
            isSelected={currentContact?.id === contact.id}
            onClick={() => setCurrentContact(contact)}
          />
        ))}
      </div>
    </>
  );
}

export default ContactsNav;
