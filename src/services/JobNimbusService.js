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
    const response = await this.request(`/files?grid=document&webui=yes&fields=content_type,filename,jnid,esign,size,pages,date_updated,related,description,date_created,date_file_created,record_type_name,created_by_name,created_by,report&related=${contactId}`);
    console.log('Documents response:', response);
    return response;
  }

  getDocumentDownloadUrl(documentId) {
    return `${this.config.baseUrl}/files/${documentId}`;
  }
}

export default JobNimbusService;