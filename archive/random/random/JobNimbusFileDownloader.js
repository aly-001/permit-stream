import React, { useState, useEffect } from "react";
import JobNimbusService from "./JobNimbusService";
import { ipcRenderer } from 'electron';

const JobNimbusFileDownloader = () => {
  const [contacts, setContacts] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadedFiles, setDownloadedFiles] = useState({});
  const [localFiles, setLocalFiles] = useState({});

  const jobNimbus = new JobNimbusService("m2ud7n7j67nzk6x0");

  useEffect(() => {
    console.log('Component mounted, initiating document load');
    loadAllDocuments();
  }, []);

  const loadAllDocuments = async () => {
    console.log('Starting loadAllDocuments');
    try {
      setLoading(true);
      const contactsResponse = await jobNimbus.getContacts();
      console.log('Contacts fetched:', contactsResponse.results.length, 'contacts');
      setContacts(contactsResponse.results);

      const allDocs = [];
      for (const contact of contactsResponse.results) {
        console.log(`Fetching documents for contact: ${contact.jnid}`);
        try {
          const docs = await jobNimbus.getContactDocuments(contact.jnid);
          console.log(`Retrieved ${docs.files?.length || 0} documents for contact ${contact.jnid}`);
          if (docs.files) {
            const docsWithContact = docs.files.map(doc => ({
              ...doc,
              contactName: contact.display_name || `${contact.first_name} ${contact.last_name}` || contact.company
            }));
            allDocs.push(...docsWithContact);
          }
        } catch (docErr) {
          console.error(`Failed to get documents for contact ${contact.jnid}:`, docErr);
        }
      }
      console.log('Total documents retrieved:', allDocs.length);
      setDocuments(allDocs);
    } catch (err) {
      console.error('Failed to load documents:', err);
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    console.log(`Starting download for document ${documentId} (${fileName})`);
    try {
      setLoading(true);
      const downloadUrl = jobNimbus.getDocumentDownloadUrl(documentId);
      console.log('Download URL generated:', downloadUrl);

      console.log('Initiating download through IPC');
      const localPath = await ipcRenderer.invoke('download-file', {
        url: downloadUrl,
        fileName,
        headers: {
          Authorization: `Bearer ${jobNimbus.config.apiToken}`,
        }
      });
      console.log('File downloaded successfully to:', localPath);

      setLocalFiles(prev => ({
        ...prev,
        [documentId]: localPath
      }));

      return localPath;
    } catch (err) {
      console.error('Download failed:', err);
      setError(`Failed to download document: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadAllDocuments = async () => {
    console.log('Starting batch download of all documents');
    setLoading(true);
    try {
      const downloadPromises = documents.map(doc => {
        console.log(`Queueing download for ${doc.filename} (${doc.jnid})`);
        return handleDownload(doc.jnid, doc.filename);
      });
      const results = await Promise.all(downloadPromises);
      console.log('Batch download completed:', results);
    } catch (err) {
      console.error('Batch download failed:', err);
      setError(`Failed to download all documents: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-downloader">
      {loading && <div className="loading">Loading documents...</div>}
      {error && <div className="error">{error}</div>}

      <div className="documents-grid">
        {documents.map((doc) => (
          <div key={doc.jnid} className="document-card">
            <div className="document-info">
              <span className="document-name">{doc.filename}</span>
              <div className="document-details">
                <span>{(doc.size / 1024 / 1024).toFixed(2)} MB • {doc.pages} pages</span>
                <span className="document-date">
                  {new Date(doc.date_created * 1000).toLocaleDateString()}
                </span>
                <span className="contact-name">Contact: {doc.contactName}</span>
              </div>
            </div>
            <div className="document-actions">
              <button
                onClick={() => handleDownload(doc.jnid, doc.filename)}
                className="download-button"
              >
                Download
              </button>
              {localFiles[doc.jnid] && (
                <div className="file-path">
                  Local file: {localFiles[doc.jnid]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .file-downloader {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .loading, .error {
          text-align: center;
          margin: 20px 0;
        }

        .error {
          color: red;
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

        .contact-name {
          font-style: italic;
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
      `}</style>
    </div>
  );
};

export default JobNimbusFileDownloader;
