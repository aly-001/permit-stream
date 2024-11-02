import React from 'react';

const DocumentCard = ({ document, onDownload, onDragStart }) => {
  const handleDragStart = (e) => {
    // Set the drag data for external drops
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a File object from the document data
    const file = new File(
      [''], // Empty content as we just need the metadata for dragging
      document.filename,
      {
        type: 'application/octet-stream',
        lastModified: document.date_created * 1000
      }
    );

    // Add the file to the dataTransfer
    e.dataTransfer.setData('DownloadURL', `application/octet-stream:${document.filename}:${document.download_url}`);
    e.dataTransfer.setData('text/uri-list', document.download_url);
    
    // Call the original onDragStart if provided
    onDragStart && onDragStart(document);
  };

  return (
    <div 
      className="document-card"
      draggable="true"
      onDragStart={handleDragStart}
    >
      <div className="document-info">
        <span className="document-name">{document.filename}</span>
        <div className="document-details">
          <span>{(document.size / 1024 / 1024).toFixed(2)} MB • {document.pages} pages</span>
          <span className="document-date">
            {new Date(document.date_created * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDownload(document.jnid, document.filename)}
        className="download-button"
      >
        Download
      </button>
    </div>
  );
};

export default DocumentCard;