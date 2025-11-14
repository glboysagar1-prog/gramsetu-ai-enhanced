/**
 * Offline Complaint Service for GramSetu AI
 * Handles storing complaints when offline and syncing when online
 */

class OfflineComplaintService {
  constructor() {
    this.dbName = 'GramSetuAI';
    this.dbVersion = 1;
    this.db = null;
    this.init();
  }

  /**
   * Initialize IndexedDB database
   */
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('Database error:', event.target.error);
        reject(event.target.error);
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('Database initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create complaints store
        if (!db.objectStoreNames.contains('complaints')) {
          const store = db.createObjectStore('complaints', { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('status', 'status', { unique: false });
          console.log('Complaints store created');
        }

        // Create sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const store = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('attemptCount', 'attemptCount', { unique: false });
          console.log('Sync queue store created');
        }
      };
    });
  }

  /**
   * Save complaint locally when offline
   * @param {Object} complaintData - Complaint data to save
   * @returns {Promise<Object>} Saved complaint
   */
  async saveOfflineComplaint(complaintData) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['complaints'], 'readwrite');
      const store = transaction.objectStore('complaints');

      const complaint = {
        ...complaintData,
        id: Date.now(), // Temporary ID
        timestamp: new Date().toISOString(),
        status: 'pending',
        offline: true
      };

      const request = store.add(complaint);

      request.onsuccess = () => {
        console.log('Complaint saved offline:', complaint);
        resolve(complaint);
      };

      request.onerror = (event) => {
        console.error('Error saving complaint offline:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  /**
   * Add complaint to sync queue
   * @param {Object} complaintData - Complaint data to sync
   * @returns {Promise<Object>} Queued complaint
   */
  async queueForSync(complaintData) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');

      const queueItem = {
        ...complaintData,
        id: Date.now(), // Temporary ID
        timestamp: new Date().toISOString(),
        attemptCount: 0,
        lastAttempt: null
      };

      const request = store.add(queueItem);

      request.onsuccess = () => {
        console.log('Complaint queued for sync:', queueItem);
        resolve(queueItem);
      };

      request.onerror = (event) => {
        console.error('Error queuing complaint for sync:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  /**
   * Get all pending complaints from sync queue
   * @returns {Promise<Array>} Pending complaints
   */
  async getPendingSyncItems() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error getting pending sync items:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  /**
   * Remove item from sync queue after successful sync
   * @param {number} id - ID of item to remove
   * @returns {Promise<void>}
   */
  async removeFromSyncQueue(id) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('Item removed from sync queue:', id);
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error removing item from sync queue:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  /**
   * Update attempt count for sync item
   * @param {number} id - ID of item to update
   * @param {number} attemptCount - New attempt count
   * @returns {Promise<void>}
   */
  async updateSyncAttempt(id, attemptCount) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');

      const request = store.get(id);

      request.onsuccess = (event) => {
        const item = event.target.result;
        if (item) {
          item.attemptCount = attemptCount;
          item.lastAttempt = new Date().toISOString();
          
          const updateRequest = store.put(item);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = (event) => reject(event.target.error);
        } else {
          reject(new Error('Item not found'));
        }
      };

      request.onerror = (event) => {
        console.error('Error updating sync attempt:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  /**
   * Get all offline complaints
   * @returns {Promise<Array>} Offline complaints
   */
  async getOfflineComplaints() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['complaints'], 'readonly');
      const store = transaction.objectStore('complaints');
      
      // Get only offline complaints
      const index = store.index('status');
      const request = index.getAll('pending');

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error getting offline complaints:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  /**
   * Clear all offline complaints (after successful sync)
   * @returns {Promise<void>}
   */
  async clearOfflineComplaints() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['complaints'], 'readwrite');
      const store = transaction.objectStore('complaints');
      
      // Clear all pending complaints
      const index = store.index('status');
      const request = index.openCursor('pending');

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          console.log('Offline complaints cleared');
          resolve();
        }
      };

      request.onerror = (event) => {
        console.error('Error clearing offline complaints:', event.target.error);
        reject(event.target.error);
      };
    });
  }
}

// Export singleton instance
const offlineComplaintService = new OfflineComplaintService();
export default offlineComplaintService;