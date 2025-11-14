# GramSetu AI - Flutter Mobile App

A comprehensive Flutter mobile application for the GramSetu AI National Governance Intelligence Network, featuring offline-first architecture with citizen complaint submission and field worker management capabilities.

## 🚀 Features

### Level 1 - Citizen Portal
- **Complaint Submission**: Text-based complaint input with voice simulation
- **Offline Support**: Complaints saved locally when offline, synced when online
- **Smart Features**: 
  - Voice-to-text simulation
  - Geo-tagging simulation
  - Photo upload simulation
- **Real-time Feedback**: SMS-style notifications for complaint status
- **CRS Integration**: Citizen Rating System score display

### Level 2 - Field Worker Portal
- **Complaint Management**: View and manage all complaints
- **Status Updates**: Update complaint status with evidence
- **Photo Evidence**: Simulate photo evidence capture
- **Filtering**: Filter complaints by status (Pending, In Progress, Resolved, Rejected)
- **Statistics**: Real-time complaint statistics dashboard
- **Offline Updates**: Save updates offline, sync when online

### Core Features
- **Offline-First Architecture**: Works seamlessly offline with automatic sync
- **Material Design**: Clean, modern UI following Material Design principles
- **Real-time Sync**: Automatic data synchronization when online
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **State Management**: Provider-based state management for reactive UI

## 🛠️ Tech Stack

- **Framework**: Flutter 3.0+
- **Language**: Dart
- **State Management**: Provider
- **HTTP Client**: http package
- **Local Storage**: SharedPreferences + SQLite (sqflite)
- **Location**: Geolocator (simulated)
- **Voice**: Speech-to-text (simulated)
- **Images**: Image picker (simulated)

## 📱 App Structure

```
lib/
├── main.dart                 # App entry point with navigation
├── models/
│   ├── app_state.dart       # Global app state management
│   └── complaint.dart       # Complaint data models
├── services/
│   ├── api_service.dart     # Backend API integration
│   └── storage_service.dart # Offline storage management
└── screens/
    ├── citizen_screen.dart      # Citizen complaint submission
    └── field_worker_screen.dart # Field worker management
```

## 🚀 Quick Start

### Prerequisites
- Flutter SDK 3.0 or higher
- Dart SDK 3.0 or higher
- Android Studio / VS Code with Flutter extensions
- Backend API running on `http://localhost:5000`

### Installation

1. **Install Dependencies**
   ```bash
   flutter pub get
   ```

2. **Run the App**
   ```bash
   flutter run
   ```

3. **For Web (Optional)**
   ```bash
   flutter run -d chrome
   ```

## 📋 API Integration

The app integrates with the Flask backend API at `http://localhost:5000`:

### Endpoints Used
- `POST /submit_complaint` - Submit new complaints
- `POST /update_complaint` - Update complaint status
- `GET /dashboard` - Retrieve complaint list
- `GET /health` - Health check

### Offline Behavior
- **Complaints**: Saved locally when offline, synced when online
- **Updates**: Field worker updates saved offline, synced when online
- **Sync Status**: Visual indicators show online/offline status

## 🎯 User Flows

### Citizen Flow
1. **Open App** → Citizen tab selected by default
2. **Enter Complaint** → Type or use voice simulation
3. **Add Context** → Location and photo simulation
4. **Submit** → Complaint processed with AI categorization
5. **Receive Feedback** → SMS-style notification with complaint ID

### Field Worker Flow
1. **Open App** → Switch to Field Worker tab
2. **View Complaints** → Filter by status, see statistics
3. **Select Complaint** → Expand to see full details
4. **Update Status** → Add evidence, change status
5. **Notify Citizen** → SMS simulation sent to citizen

## 🔧 Configuration

### API Configuration
Update the base URL in `lib/services/api_service.dart`:
```dart
static const String baseUrl = 'http://your-server:5000';
```

### Citizen ID
The citizen ID is hardcoded as `'12345'` in `citizen_screen.dart` as requested.

### Offline Storage
- **SharedPreferences**: Stores offline complaints and updates
- **Sync Keys**: 
  - `offline_complaints` - Pending complaint submissions
  - `offline_updates` - Pending complaint updates
  - `last_sync_time` - Last successful sync timestamp

## 🎨 UI Features

### Material Design
- **Color Scheme**: Blue primary color (#1976D2)
- **Typography**: Roboto font family
- **Components**: Cards, Chips, Bottom Navigation
- **Responsive**: Adapts to different screen sizes

### Interactive Elements
- **Voice Input**: Simulated speech-to-text with sample data
- **Location Tagging**: Simulated GPS coordinates
- **Photo Upload**: Simulated camera/gallery access
- **Status Updates**: Real-time status change notifications

### Visual Feedback
- **Loading States**: Circular progress indicators
- **Success Messages**: Green snackbars with SMS simulation
- **Error Handling**: Red snackbars with error details
- **Offline Indicators**: Orange messages for offline actions

## 📊 Data Models

### Complaint Model
```dart
class Complaint {
  final int? id;
  final String text;
  final String category;
  final String urgency;
  final String citizenId;
  final int crsScore;
  final String hash;
  final String timestamp;
  final String status;
  final String? evidence;
  final bool isDuplicate;
  final bool isValid;
}
```

### Offline Storage
- **ComplaintSubmission**: Text and citizen ID for offline complaints
- **ComplaintUpdate**: ID, evidence, and status for offline updates
- **Sync Status**: Tracks which items need synchronization

## 🔄 Sync Mechanism

### Automatic Sync
- **Trigger**: Manual sync button in app bar
- **Process**: 
  1. Check online status
  2. Sync offline complaints
  3. Sync offline updates
  4. Update last sync time
- **Feedback**: Success/error messages with details

### Conflict Resolution
- **Server Priority**: Server data takes precedence
- **Retry Logic**: Failed syncs are retried on next sync
- **Data Integrity**: Hash verification for complaint integrity

## 🧪 Testing

### Manual Testing
1. **Online Mode**: Submit complaints, verify API integration
2. **Offline Mode**: Submit complaints, verify local storage
3. **Sync Mode**: Test sync functionality with offline data
4. **Error Handling**: Test network failures and API errors

### Test Scenarios
- Submit complaint online → Verify immediate processing
- Submit complaint offline → Verify local storage
- Sync offline data → Verify server integration
- Update complaint status → Verify citizen notification
- Network failure → Verify graceful degradation

## 🚨 Error Handling

### Network Errors
- **No Connection**: Graceful fallback to offline mode
- **Server Error**: User-friendly error messages
- **Timeout**: Automatic retry with exponential backoff

### Data Errors
- **Invalid Input**: Form validation with helpful messages
- **Sync Failures**: Retry mechanism with user notification
- **Storage Errors**: Fallback to memory storage

## 🔒 Security Features

### Data Protection
- **Input Validation**: Client-side validation for all inputs
- **Secure Storage**: Encrypted local storage for sensitive data
- **API Security**: HTTPS support (when configured)

### Privacy
- **Local Data**: All offline data stored locally
- **No Tracking**: No user tracking or analytics
- **Data Control**: Users control their own data

## 📈 Performance

### Optimization
- **Lazy Loading**: Complaints loaded on demand
- **Caching**: Local caching for offline access
- **Efficient Updates**: Only changed data is synced

### Memory Management
- **Disposal**: Proper disposal of controllers and streams
- **Image Handling**: Optimized image loading and caching
- **State Management**: Efficient state updates with Provider

## 🛣️ Future Enhancements

### Planned Features
- [ ] Real voice-to-text integration
- [ ] Actual camera integration
- [ ] Push notifications
- [ ] Advanced filtering and search
- [ ] Offline maps integration
- [ ] Multi-language support

### Technical Improvements
- [ ] Unit and widget tests
- [ ] Integration tests
- [ ] Performance monitoring
- [ ] Crash reporting
- [ ] Analytics integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check the Flutter documentation
- Review the API integration guide
- Test with the provided backend API
- Create an issue in the repository

---

**GramSetu AI Flutter App** - Empowering citizens and field workers through intelligent mobile technology.


