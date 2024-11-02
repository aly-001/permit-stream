import React, { useState, useEffect } from 'react';
import JobNimbusService from './JobNimbusService';

const JobNimbusFileDownloader = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize service with your API token
  const jobNimbus = new JobNimbusService('m2ud7n7j67nzk6x0');

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await jobNimbus.getDocuments();
      setDocuments(data);
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      setLoading(true);
      const downloadUrl = jobNimbus.getDocumentDownloadUrl(documentId);

      const response = await fetch(downloadUrl, {
        headers: jobNimbus.config.headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download document');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-list">
      <h2>JobNimbus Documents</h2>
      
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      
      {!loading && documents.length === 0 ? (
        <p>No documents found</p>
      ) : (
        <div className="documents-grid">
          {documents.map((doc) => (
            <div key={doc.jnid} className="document-card">
              <div className="document-info">
                <span className="document-name">{doc.filename}</span>
                <div className="document-details">
                  <span>Type: {doc.content_type}</span>
                  <span>Created: {new Date(doc.date_created).toLocaleDateString()}</span>
                  <span>Size: {Math.round(doc.size / 1024)} KB</span>
                </div>
              </div>
              <button
                className="download-button"
                onClick={() => handleDownload(doc.jnid, doc.filename)}
                disabled={loading}
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .document-list {
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

        .download-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default JobNimbusFileDownloader;
