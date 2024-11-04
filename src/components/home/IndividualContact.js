import React from "react";
import { colors } from "../../config/colors";
import AppText from "../AppText";
import { useContacts } from "../../contexts/ContactContext";

const IndividualContact = ({ contact, isSelected, onClick }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { setDisplay } = useContacts();

  const handleClick = () => {
    setDisplay("info");
    onClick();
  };

  const styles = {
    contactBox: {
      backgroundColor: isSelected
        ? colors.tertiaryBackground
        : isHovered
          ? colors.primaryBackground
          : colors.contactDeselected,
      padding: "15px",
      margin: "10px",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
    },
  };

  return (
    <div 
      style={styles.contactBox} 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AppText 
        color={colors.primaryText} 
        text={contact.contact.name} 
      />
    </div>
  );
};

export default IndividualContact;
