import React from "react";
import Document from "./Document";

function FileInfo({ documents }) {
  const styles = {
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "15px",
      width: "100%",
    },
  };

  return (
    <div style={styles.grid}>
      {documents?.map((doc, index) => (
        <Document 
          key={index}
          filename={doc.filename}
          type={doc.type}
        />
      ))}
    </div>
  );
}

export default FileInfo;