const { app } = window.require('electron');
const path = window.require('path');
const fs = window.require('fs');

class FileManager {
    constructor() {
        this.baseDir = path.join(app.getPath('userData'), 'documents');
        this.ensureDirectoryExists(this.baseDir);
    }

    ensureDirectoryExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    getFilePath(contactId, filename) {
        const contactDir = path.join(this.baseDir, contactId);
        this.ensureDirectoryExists(contactDir);
        return path.join(contactDir, filename);
    }

    async fileExists(contactId, filename) {
        const filePath = this.getFilePath(contactId, filename);
        try {
            await fs.promises.access(filePath);
            return true;
        } catch {
            return false;
        }
    }

    getLocalPath(contactId, filename) {
        return this.getFilePath(contactId, filename);
    }
}

export default FileManager;
