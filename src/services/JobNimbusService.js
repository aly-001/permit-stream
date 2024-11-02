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
          method: options.method || 'GET',
          ...options,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiToken}`,
            'Accept': 'application/json'
          }
        }
      });
      
      console.log('API Response:', response);

      if (response.status === 401) {
        throw new Error('Authentication failed - please check your API token');
      }
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }
      
      return response.data;
    } catch (error) {
      console.error('JobNimbusService Error:', error);
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
    console.log(`Fetching documents for contact ID: ${contactId}`);
    const timestamp = Date.now();
    const response = await this.request('/files', {
      method: 'GET',
      params: {
        grid: 'document',
        webui: 'yes',
        fields: 'content_type,filename,jnid,esign,size,pages,date_updated,related,description,date_created,date_file_created,record_type_name,created_by_name,created_by,report',
        related: contactId,
        size: 0,
        _: timestamp
      }
    });
    console.log('~~~~~~~Documents response:', response);
    return response;
  }

  getDocumentDownloadUrl(documentId) {
    return `${this.config.baseUrl}/files/${documentId}?download=1`;
  }

  async downloadDocument(documentId, filename) {
    try {
      console.log(`Attempting to download: ${filename} (ID: ${documentId})`);
      const downloadUrl = this.getDocumentDownloadUrl(documentId);
      console.log('Download URL:', downloadUrl);

      const result = await ipcRenderer.invoke('download-file', {
        url: downloadUrl,
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Accept': '*/*'
        },
        filename: filename
      });

      if (!result.success) {
        throw new Error(`Failed to download: ${result.error}`);
      }

      return result.filePath;
    } catch (error) {
      console.error(`Error downloading document ${filename}:`, error);
      throw error;
    }
  }
}

export default JobNimbusService;