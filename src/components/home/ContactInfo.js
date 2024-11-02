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
    address: "123 Main St, Anytown, USA",
    site_id: "12345",
    city: "Calgary",
    postal_code: "T2P1J9",
    current_energy_consumption: "1000",
    projected_energy_production: "800",
    energy_source: "Solar",
    generator_type: "Synchronous",
    ac_capacity: "1.23",
    planned_date: { month_offset: 3, day: 15 }
  };

  // Use provided contact or fall back to temp contact
  const displayContact = contact || tempContact;

  const infoFields = [
    { label: "Name", value: displayContact.contact?.name },
    { label: "Phone", value: displayContact.contact?.phone },
    { label: "Email", value: displayContact.contact?.email },
    { label: "Site ID", value: displayContact.site_id },
    { label: "City", value: displayContact.city },
    { label: "Postal Code", value: displayContact.postal_code },
    { label: "Current Energy Consumption", value: `${displayContact.current_energy_consumption} kWh` },
    { label: "Projected Energy Production", value: `${displayContact.projected_energy_production} kWh` },
    { label: "Energy Source", value: displayContact.energy_source },
    { label: "Generator Type", value: displayContact.generator_type },
    { label: "AC Capacity", value: `${displayContact.ac_capacity} kW` },
    { label: "Installation Date", value: `Month Offset: ${displayContact.planned_date?.month_offset}, Day: ${displayContact.planned_date?.day}` },
  ];

  const styles = {
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: colors.blueGrey,
      position: "relative",
    },
    header: {
      padding: layout.homeScreenSmallMargin,
      paddingBottom: 0,
    },
    infoSection: {
      flex: 1,
      overflowY: "auto",
      padding: layout.homeScreenSmallMargin,
      paddingBottom: "80px", // Extra padding to ensure content isn't hidden behind button
    },
    infoRow: {
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
    },
    nextButton: {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 1,
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <HeaderText text="Contact Information" />
      </div>
      
      <div style={styles.infoSection}>
        {infoFields.map((field, index) => (
          <div key={index} style={styles.infoRow}>
            <AppText text={field.label} color={colors.primaryText} size="14px" />
            <AppText 
              text={field.value || "Not provided"} 
              color={colors.secondaryText} 
              size="16px" 
            />
          </div>
        ))}

        {displayContact.required_documents && (
          <div style={styles.infoRow}>
            <AppText text="Required Documents" color={colors.primaryText} size="14px" />
            {displayContact.required_documents.map((doc, index) => (
              <AppText 
                key={index}
                text={`• ${doc}`} 
                color={colors.secondaryText} 
                size="16px" 
              />
            ))}
          </div>
        )}
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
