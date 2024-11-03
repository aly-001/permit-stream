import { useEffect, useState } from 'react';
const fs = window.require('fs').promises;

const useDocumentPreloader = (documents) => {
  const [preloadedFiles, setPreloadedFiles] = useState({});
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    const preloadDocuments = async () => {
      if (!documents?.length) {
        setIsPreloading(false);
        return;
      }

      const filePromises = documents.map(async (doc) => {
        try {
          const fileContent = await fs.readFile(doc.localPath);
          return [doc.filename, {
            content: fileContent,
            contentType: doc.contentType
          }];
        } catch (error) {
          console.error(`Failed to preload ${doc.filename}:`, error);
          return null;
        }
      });

      const results = await Promise.all(filePromises);
      const validResults = results.filter(Boolean);
      
      setPreloadedFiles(Object.fromEntries(validResults));
      setIsPreloading(false);
    };

    preloadDocuments();
  }, [documents]);

  return { preloadedFiles, isPreloading };
};

export default useDocumentPreloader;