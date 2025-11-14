import 'package:flutter/foundation.dart';

class AppState extends ChangeNotifier {
  bool _isOnline = true;
  bool _isLoading = false;
  String _lastSyncTime = '';

  bool get isOnline => _isOnline;
  bool get isLoading => _isLoading;
  String get lastSyncTime => _lastSyncTime;

  void setOnlineStatus(bool online) {
    _isOnline = online;
    notifyListeners();
  }

  void setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void updateLastSyncTime(String time) {
    _lastSyncTime = time;
    notifyListeners();
  }
}


