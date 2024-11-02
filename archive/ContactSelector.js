import React, { useState, useEffect } from "react";
import JobNimbusService from "../services/JobNimbusService";
import DocumentCard from "./DocumentCard";

const ContactSelector = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);

  // Initialize service with your API token
  const jobNimbus = new JobNimbusService("m2ud7n7j67nzk6x0");
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await jobNimbus.getContacts();
      setContacts(response.results);
    } catch (err) {
      setError("Failed to load contacts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSelect = async (contactId) => {
    if (!contactId) {
      setSelectedContact(null);
      setDocuments([]);
      return;
    }

    try {
      setLoading(true);
      const contact = await jobNimbus.getContactById(contactId);
      setSelectedContact(contact);

      try {
        const docs = await jobNimbus.getContactDocuments(contactId);
        setDocuments(docs.files || []);
      } catch (docErr) {
        console.log("Documents not available for this contact:", docErr);
        setDocuments([]);
      }
    } catch (err) {
      setError("Failed to load contact details");
      console.error(err);
      setSelectedContact(null);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      setLoading(true);
      const downloadUrl = jobNimbus.getDocumentDownloadUrl(documentId);

      // Fetch with proper authentication
      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${jobNimbus.config.apiToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the blob directly from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download document");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (document) => {
    console.log("Started dragging:", document.filename);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);

    if (files.length > 0 && selectedContact) {
    }
  };

  return (
    <div className="contact-selector">
      <div className="selector-container">
        <label>
          Select a Contact:
          <select
            onChange={(e) => handleContactSelect(e.target.value)}
            disabled={loading}
          >
            <option value="">-- Select Contact --</option>
            {contacts.map((contact) => (
              <option key={contact.jnid} value={contact.jnid}>
                {contact.display_name ||
                  `${contact.first_name} ${contact.last_name}` ||
                  contact.company}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}

      {selectedContact && (
        <div
          className="documents-section"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <h3>
            Documents for{" "}
            {selectedContact.display_name ||
              `${selectedContact.first_name} ${selectedContact.last_name}` ||
              selectedContact.company}
          </h3>
          <div className="documents-grid">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.jnid}
                document={doc}
                onDownload={handleDownload}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        .contact-selector {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .selector-container {
          margin-bottom: 20px;
        }

        select {
          width: 100%;
          padding: 8px;
          margin-top: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .loading {
          text-align: center;
          color: #666;
          margin: 20px 0;
        }

        .error {
          color: red;
          margin: 20px 0;
        }

        .contact-details {
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }

        .details-grid {
          display: grid;
          gap: 8px;
        }

        .detail-row {
          display: grid;
          grid-template-columns: 200px 1fr;
          padding: 8px;
          border-bottom: 1px solid #eee;
        }

        .field-name {
          font-weight: bold;
          color: #333;
        }

        .field-value {
          color: #666;
        }

        .documents-section {
          margin-top: 20px;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .documents-grid {
          display: grid;
          gap: 16px;
          margin-top: 16px;
        }

        .document-card {
          background: white;
          padding: 16px;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .document-info {
          flex-grow: 1;
          margin-right: 16px;
        }

        .document-name {
          font-weight: bold;
          display: block;
          margin-bottom: 8px;
        }

        .document-details {
          color: #666;
          font-size: 0.9em;
        }

        .document-details span {
          display: block;
        }

        .download-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .download-button:hover {
          background-color: #0056b3;
        }

        .drop-zone {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin-top: 20px;
          background: #fff;
          color: #666;
        }

        .documents-section.dragging {
          background: #e9ecef;
        }

        .document-card {
          cursor: grab;
        }

        .document-card:active {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
};

export default ContactSelector;
