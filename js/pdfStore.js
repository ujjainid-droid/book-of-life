/* ==========================================================================
   Book of Life / margo - Native IndexedDB PDF Storage Engine
   Stores PDF attachments locally without exhausting localStorage quotas.
   ========================================================================== */

class BolPdfStore {
  constructor() {
    this.dbName = 'BOL_PDF_STORE';
    this.dbVersion = 1;
    this.storeName = 'daily_reports';
    this.db = null;
    this.isReady = false;
    this.initPromise = this.init();
  }

  async init() {
    if (!window.indexedDB) {
      console.warn('IndexedDB not supported in this browser environment.');
      return null;
    }

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isReady = true;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('Failed to open BolPdfStore IndexedDB:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async ensureReady() {
    if (!this.isReady) {
      await this.initPromise;
    }
    if (!this.db) {
      throw new Error('IndexedDB storage is unavailable.');
    }
  }

  /**
   * Format bytes to readable string (e.g., "340 KB", "1.2 MB")
   */
  formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Save a PDF file for a given log date
   * @param {string} dateStr - 'YYYY-MM-DD'
   * @param {File|Blob} file - The uploaded PDF file
   * @param {string} customName - Optional custom title
   * @returns {Promise<Object>} Metadata object for the saved PDF
   */
  async savePdf(dateStr, file, customName = '') {
    await this.ensureReady();

    const id = 'pdf_' + dateStr + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
    const fileName = customName || file.name || `Daily_Report_${dateStr}.pdf`;
    const fileSizeFormatted = this.formatFileSize(file.size);

    // Convert file to ArrayBuffer or store Blob directly
    const buffer = await file.arrayBuffer();

    const record = {
      id: id,
      date: dateStr,
      name: fileName,
      type: file.type || 'application/pdf',
      size: fileSizeFormatted,
      sizeBytes: file.size,
      data: buffer,
      createdAt: Date.now()
    };

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.put(record);

      req.onsuccess = () => {
        resolve({
          id: record.id,
          date: record.date,
          name: record.name,
          size: record.size,
          sizeBytes: record.sizeBytes,
          type: record.type,
          createdAt: record.createdAt
        });
      };

      req.onerror = (e) => {
        console.error('Error saving PDF to IndexedDB:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  /**
   * Retrieve a PDF record by ID and produce an Object URL for viewing
   */
  async getPdf(id) {
    await this.ensureReady();

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], 'readonly');
      const store = tx.objectStore(this.storeName);
      const req = store.get(id);

      req.onsuccess = () => {
        const record = req.result;
        if (!record) {
          resolve(null);
          return;
        }

        const blob = new Blob([record.data], { type: record.type || 'application/pdf' });
        const url = URL.createObjectURL(blob);
        resolve({
          id: record.id,
          date: record.date,
          name: record.name,
          size: record.size,
          blob: blob,
          url: url,
          createdAt: record.createdAt
        });
      };

      req.onerror = (e) => {
        console.error('Error getting PDF from IndexedDB:', e.target.error);
        reject(e.target.error);
      };
    });
  }

  /**
   * Delete a PDF record by ID
   */
  async deletePdf(id) {
    await this.ensureReady();

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], 'readwrite');
      const store = tx.objectStore(this.storeName);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  }

  /**
   * Get all PDF records for a date
   */
  async getPdfsForDate(dateStr) {
    await this.ensureReady();

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], 'readonly');
      const store = tx.objectStore(this.storeName);
      const index = store.index('date');
      const req = index.getAll(dateStr);

      req.onsuccess = () => {
        const list = (req.result || []).map(r => ({
          id: r.id,
          date: r.date,
          name: r.name,
          size: r.size,
          sizeBytes: r.sizeBytes,
          type: r.type,
          createdAt: r.createdAt
        }));
        resolve(list);
      };

      req.onerror = (e) => reject(e.target.error);
    });
  }
}

// Global instance
const pdfStore = new BolPdfStore();
