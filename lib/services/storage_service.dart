import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/complaint.dart';
import 'api_service.dart';

class StorageService {
  static const String _offlineComplaintsKey = 'offline_complaints';
  static const String _offlineUpdatesKey = 'offline_updates';
  static const String _lastSyncKey = 'last_sync_time';

  // Save complaint for offline sync
  Future<void> saveOfflineComplaint(ComplaintSubmission submission) async {
    final prefs = await SharedPreferences.getInstance();
    final offlineComplaints = await getOfflineComplaints();
    
    offlineComplaints.add({
      'text': submission.text,
      'citizen_id': submission.citizenId,
      'timestamp': DateTime.now().toIso8601String(),
      'synced': false,
    });
    
    await prefs.setString(_offlineComplaintsKey, jsonEncode(offlineComplaints));
  }

  // Get offline complaints
  Future<List<Map<String, dynamic>>> getOfflineComplaints() async {
    final prefs = await SharedPreferences.getInstance();
    final complaintsJson = prefs.getString(_offlineComplaintsKey);
    
    if (complaintsJson != null) {
      final List<dynamic> complaints = jsonDecode(complaintsJson);
      return complaints.cast<Map<String, dynamic>>();
    }
    
    return [];
  }

  // Save complaint update for offline sync
  Future<void> saveOfflineUpdate(ComplaintUpdate update) async {
    final prefs = await SharedPreferences.getInstance();
    final offlineUpdates = await getOfflineUpdates();
    
    offlineUpdates.add({
      'id': update.id,
      'evidence': update.evidence,
      'status': update.status,
      'timestamp': DateTime.now().toIso8601String(),
      'synced': false,
    });
    
    await prefs.setString(_offlineUpdatesKey, jsonEncode(offlineUpdates));
  }

  // Get offline updates
  Future<List<Map<String, dynamic>>> getOfflineUpdates() async {
    final prefs = await SharedPreferences.getInstance();
    final updatesJson = prefs.getString(_offlineUpdatesKey);
    
    if (updatesJson != null) {
      final List<dynamic> updates = jsonDecode(updatesJson);
      return updates.cast<Map<String, dynamic>>();
    }
    
    return [];
  }

  // Sync offline complaints with server
  Future<void> syncOfflineComplaints(ApiService apiService) async {
    final offlineComplaints = await getOfflineComplaints();
    final prefs = await SharedPreferences.getInstance();
    
    final List<Map<String, dynamic>> syncedComplaints = [];
    
    for (final complaint in offlineComplaints) {
      if (!complaint['synced']) {
        try {
          final submission = ComplaintSubmission(
            text: complaint['text'],
            citizenId: complaint['citizen_id'],
          );
          
          await apiService.submitComplaint(submission);
          
          // Mark as synced
          complaint['synced'] = true;
          complaint['sync_timestamp'] = DateTime.now().toIso8601String();
          
          syncedComplaints.add(complaint);
        } catch (e) {
          // Keep unsynced if failed
          syncedComplaints.add(complaint);
        }
      } else {
        syncedComplaints.add(complaint);
      }
    }
    
    // Update storage
    await prefs.setString(_offlineComplaintsKey, jsonEncode(syncedComplaints));
    
    // Update last sync time
    await prefs.setString(_lastSyncKey, DateTime.now().toIso8601String());
  }

  // Sync offline updates with server
  Future<void> syncOfflineUpdates(ApiService apiService) async {
    final offlineUpdates = await getOfflineUpdates();
    final prefs = await SharedPreferences.getInstance();
    
    final List<Map<String, dynamic>> syncedUpdates = [];
    
    for (final update in offlineUpdates) {
      if (!update['synced']) {
        try {
          final complaintUpdate = ComplaintUpdate(
            id: update['id'],
            evidence: update['evidence'],
            status: update['status'],
          );
          
          await apiService.updateComplaint(complaintUpdate);
          
          // Mark as synced
          update['synced'] = true;
          update['sync_timestamp'] = DateTime.now().toIso8601String();
          
          syncedUpdates.add(update);
        } catch (e) {
          // Keep unsynced if failed
          syncedUpdates.add(update);
        }
      } else {
        syncedUpdates.add(update);
      }
    }
    
    // Update storage
    await prefs.setString(_offlineUpdatesKey, jsonEncode(syncedUpdates));
    
    // Update last sync time
    await prefs.setString(_lastSyncKey, DateTime.now().toIso8601String());
  }

  // Get last sync time
  Future<String?> getLastSyncTime() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_lastSyncKey);
  }

  // Clear all offline data (for testing)
  Future<void> clearOfflineData() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_offlineComplaintsKey);
    await prefs.remove(_offlineUpdatesKey);
    await prefs.remove(_lastSyncKey);
  }

  // Get sync status
  Future<Map<String, int>> getSyncStatus() async {
    final offlineComplaints = await getOfflineComplaints();
    final offlineUpdates = await getOfflineUpdates();
    
    final unsyncedComplaints = offlineComplaints.where((c) => !c['synced']).length;
    final unsyncedUpdates = offlineUpdates.where((u) => !u['synced']).length;
    
    return {
      'unsynced_complaints': unsyncedComplaints,
      'unsynced_updates': unsyncedUpdates,
    };
  }
}


