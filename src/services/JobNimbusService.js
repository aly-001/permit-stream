// JobNimbusService.js
const { ipcRenderer } = window.require('electron');

class JobNimbusService {
  constructor(apiToken) {
    this.config = {
      apiToken,
      baseUrl: 'https://app.jobnimbus.com/api1'
    };
  }

  async request(endpoint, options = {}) {
    try {
      const response = await ipcRenderer.invoke('api-request', {
        url: `${this.config.baseUrl}${endpoint}`,
        options: {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiToken}`
          }
        }
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async getContacts() {
    return this.request('/contacts');
  }

  async getContactById(contactId) {
    return this.request(`/contacts/${contactId}`);
  }

  async getContactDocuments(contactId) {
    return this.request(`/files?grid=document&webui=yes&fields=content_type,filename,jnid,esign,size,pages,date_updated,related,description,date_created,date_file_created,record_type_name,created_by_name,created_by,report&related=${contactId}`);
  }

  getDocumentDownloadUrl(documentId) {
    return `${this.config.baseUrl}/files/${documentId}?download=1`;
  }

  async downloadDocument(documentId, fileName) {
    try {
      const downloadUrl = this.getDocumentDownloadUrl(documentId);
      const filePath = await ipcRenderer.invoke('download-file', {
        url: downloadUrl,
        fileName,
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Accept': '*/*'
        }
      });
      return filePath;
    } catch (error) {
      console.error(`Error downloading document ${fileName}:`, error);
      throw error;
    }
  }

  // New method to download multiple documents for a contact
  async downloadContactDocuments(contactId) {
    try {
      console.time('Total download time');
      const docs = await this.getContactDocuments(contactId);
      if (!docs.files || !docs.files.length) {
        console.timeEnd('Total download time');
        return [];
      }

      const downloadPromises = docs.files.map(async (doc) => {
        try {
          console.time(`Download time for ${doc.filename}`);
          const localPath = await this.downloadDocument(doc.jnid, doc.filename);
          console.timeEnd(`Download time for ${doc.filename}`);
          
          return {
            filename: doc.filename,
            downloadUrl: `file://${localPath}`,
            contentType: doc.content_type,
            localPath
          };
        } catch (error) {
          console.error(`Failed to download document ${doc.filename}:`, error);
          return null;
        }
      });

      const results = await Promise.all(downloadPromises);
      console.timeEnd('Total download time');
      return results.filter(result => result !== null);
    } catch (error) {
      console.error('Failed to download contact documents:', error);
      console.timeEnd('Total download time');
      throw error;
    }
  }
}

export default JobNimbusService;
