import React, { useState, useEffect } from "react";
import Document from "./Document";
import HeaderText from "../HeaderText";
import { colors } from "../../config/colors";
import { layout } from "../../config/layout";

const FileSelector = ({ isOpen, onClose, documents, onSelect }) => {
  const [selectedDocs, setSelectedDocs] = useState([]);

  useEffect(() => {
    if (isOpen && documents) {
      setSelectedDocs(documents.filter(doc => doc.selected));
    }
  }, [isOpen, documents]);

  const handleDocumentClick = (doc) => {
    setSelectedDocs((prev) => {
      const isSelected = prev.some((d) => d.filename === doc.filename);
      if (isSelected) {
        return prev.filter((d) => d.filename !== doc.filename);
      }
      return [...prev, doc];
    });
  };

  const handleSelect = () => {
    onSelect(selectedDocs);
    onClose();
  };

  const styles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      background: colors.secondaryBackground,
      padding: layout.homeScreenSmallMargin,
      borderRadius: "8px",
      width: "80%",
      maxWidth: "900px",
      maxHeight: "80vh",
      overflowY: "auto",
    },
    documentsGrid: {
      marginTop: layout.homeScreenSmallMargin,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    documentWrapper: {
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "6px",
      transition: "all 0.2s ease",
    },
    documentWrapperHover: {
      backgroundColor: "#f5f5f5",
    },
    documentWrapperSelected: {
      borderColor: "#007bff",
      backgroundColor: colors.primary,
    },
    modalActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "1rem",
    },
    button: {
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
    },
    cancelButton: {
      backgroundColor: "#e9ecef",
    },
    selectButton: {
      backgroundColor: colors.primary,
      color: "white",
    },
    selectButtonHover: {
      backgroundColor: "#0056b3",
    },
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <HeaderText text="Select Documents" />
        <div style={styles.documentsGrid}>
          {documents?.map((doc, index) => (
            <div
              key={index}
              style={{
                ...styles.documentWrapper,
                ...(selectedDocs.some((d) => d.filename === doc.filename) && styles.documentWrapperSelected),
              }}
              onClick={() => handleDocumentClick(doc)}
            >
              <Document filename={doc.filename} type={doc.type} />
            </div>
          ))}
        </div>
        <div style={styles.modalActions}>
          <button 
            style={{...styles.button, ...styles.cancelButton}} 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            style={{...styles.button, ...styles.selectButton}}
            onClick={handleSelect}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileSelector;
