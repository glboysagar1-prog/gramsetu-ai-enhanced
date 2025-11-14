/**
 * Custom hook for handling offline complaint submission in GramSetu AI
 */
import { useState, useEffect } from 'react';
import offlineComplaintService from '../services/offlineComplaintService';
import { createComplaint } from '../services/complaintService';

const useOfflineComplaint = (authToken) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check pending sync items on mount
    checkPendingSyncCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for pending sync items
  const checkPendingSyncCount = async () => {
    try {
      const pendingItems = await offlineComplaintService.getPendingSyncItems();
      setPendingSyncCount(pendingItems.length);
    } catch (error) {
      console.error('Error checking pending sync count:', error);
    }
  };

  // Submit complaint with offline support
  const submitComplaintWithOfflineSupport = async (complaintData) => {
    if (isOnline && authToken) {
      try {
        // Try to submit directly
        const result = await createComplaint(complaintData, authToken);
        
        // If successful, check if there are pending items to sync
        await syncPendingComplaints();
        
        return { success: true, data: result };
      } catch (error) {
        // If online submission fails, save for later sync
        console.warn('Online submission failed, saving for later sync:', error);
        const offlineComplaint = await offlineComplaintService.queueForSync(complaintData);
        await checkPendingSyncCount();
        return { success: true, data: offlineComplaint, offline: true };
      }
    } else {
      // Save offline
      const offlineComplaint = await offlineComplaintService.queueForSync(complaintData);
      await checkPendingSyncCount();
      return { success: true, data: offlineComplaint, offline: true };
    }
  };

  // Sync pending complaints
  const syncPendingComplaints = async () => {
    if (!isOnline || !authToken) return;

    try {
      const pendingItems = await offlineComplaintService.getPendingSyncItems();
      
      for (const item of pendingItems) {
        try {
          // Skip items that have failed too many times
          if (item.attemptCount >= 3) {
            console.warn('Skipping item with too many failed attempts:', item.id);
            continue;
          }

          // Try to submit
          await createComplaint({
            text: item.text,
            citizen_id: item.citizen_id,
            category: item.category,
            urgency: item.urgency
          }, authToken);

          // If successful, remove from queue
          await offlineComplaintService.removeFromSyncQueue(item.id);
          console.log('Successfully synced complaint:', item.id);
        } catch (error) {
          console.warn('Failed to sync complaint, incrementing attempt count:', item.id, error);
          // Increment attempt count
          await offlineComplaintService.updateSyncAttempt(item.id, item.attemptCount + 1);
        }
      }

      // Update pending count
      await checkPendingSyncCount();
    } catch (error) {
      console.error('Error syncing pending complaints:', error);
    }
  };

  // Manually trigger sync
  const triggerSync = async () => {
    if (isOnline) {
      await syncPendingComplaints();
    }
  };

  return {
    isOnline,
    pendingSyncCount,
    submitComplaintWithOfflineSupport,
    syncPendingComplaints,
    triggerSync
  };
};

export default useOfflineComplaint;