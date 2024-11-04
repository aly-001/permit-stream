import React from "react";
import { colors } from "../../config/colors";
import HeaderText from "../HeaderText";
import { layout } from "../../config/layout";
import AppText from "../AppText";
import FileInfo from "./FileInfo";
import FileSelector from "./FileSelector";
import { useState } from "react";
import { useContacts } from "../../contexts/ContactContext";

function ContactInfo({ contact }) {
  const { setCurrentContact } = useContacts();
  const [isFileSelectOpen, setIsFileSelectOpen] = useState(false);

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
    { label: "City", value: displayContact.city },
    { label: "Postal Code", value: displayContact.postal_code },
    { label: "Energy Source", value: displayContact.energy_source },
    { label: "Current Energy Consumption (kWh)", value: displayContact.current_energy_consumption },
    { label: "Projected Energy Production (kWh)", value: displayContact.projected_energy_production },
    { label: "AC Capacity (kW)", value: displayContact.ac_capacity },
    { 
      label: "Planned Installation Date", 
      value: displayContact.planned_date ? 
        `In ${displayContact.planned_date.month_offset} months, day ${displayContact.planned_date.day}` : 
        undefined 
    },
  ];

  const styles = {
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: colors.secondaryBackground,
      position: "relative",
      overflow: "hidden",
    },
    header: {
      padding: layout.homeScreenSmallMargin,
      paddingBottom: "10px",
      flexShrink: 0,
    },
    scrollableSection: {
      flex: 1,
      overflowY: "auto",
      padding: layout.homeScreenSmallMargin,
      paddingBottom: "100px",
    },
    infoRow: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "15px",
    },
    fieldContainer: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      gap: "8px",
    },
    editButton: {
      padding: "5px 10px",
      marginLeft: "10px",
      backgroundColor: colors.primaryBackground,
      border: "none",
      borderRadius: "4px",
      color: "white",
      cursor: "pointer",
    },
    documentTitle: {
      marginBottom: "10px",
    },
  };

  const handleDocumentSelect = (selectedDocs) => {
    setCurrentContact(current => ({
      ...current,
      selectedDocuments: selectedDocs
    }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <HeaderText text="Contact Information" />
      </div>
      
      <div style={styles.scrollableSection}>
        {infoFields.map((field, index) => (
          <div key={index} style={styles.infoRow}>
            <div style={styles.fieldContainer}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <AppText text={field.label} color={colors.primaryText} size="14px" />
                <button style={styles.editButton}>Edit</button>
              </div>
              <AppText 
                text={field.value || "Not provided"} 
                color={colors.secondaryText} 
                size="16px" 
              />
            </div>
          </div>
        ))}

        {displayContact.selectedDocuments && displayContact.selectedDocuments.length > 0 && (
          <div style={styles.section}>
            <div style={styles.documentTitle}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <AppText text="Documents" color={colors.primaryText} size="14px" />
                <button 
                  style={styles.editButton}
                  onClick={() => setIsFileSelectOpen(true)}
                >
                  Edit
                </button>
              </div>
            </div>
            <FileInfo documents={displayContact.selectedDocuments} />
          </div>
        )}
      </div>

      <FileSelector
        isOpen={isFileSelectOpen}
        onClose={() => setIsFileSelectOpen(false)}
        documents={displayContact.allDocuments || []}
        onSelect={handleDocumentSelect}
      />
    </div>
  );
}

export default ContactInfo;