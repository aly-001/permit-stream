class JobNimbusService {
  constructor(apiToken) {
    this.config = {
      apiToken,
      baseURL: 'https://app.jobnimbus.com/api1',
      headers: {
        'Authorization': apiToken,
        'Origin': 'https://webappui.jobnimbus.com',
        'Referer': 'https://webappui.jobnimbus.com/'
      }
    };
  }

  async getDocuments() {
    const params = {
      grid: 'document',
      webui: 'yes',
      fields: 'content_type,filename,jnid,esign,size,pages,date_updated,related,description,date_created,date_file_created,record_type_name,created_by_name,created_by,report',
      related: 'm2uizmvfpfvvur9v2gulyz4',
      size: 0,
    };

    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.config.baseURL}/files?${queryString}`, {
      headers: this.config.headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  getDocumentDownloadUrl(documentId) {
    return `${this.config.baseURL}/files/${documentId}`;
  }
}

export default JobNimbusService;