import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/complaint.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import '../models/app_state.dart';

class CitizenScreen extends StatefulWidget {
  const CitizenScreen({super.key});

  @override
  State<CitizenScreen> createState() => _CitizenScreenState();
}

class _CitizenScreenState extends State<CitizenScreen> {
  final TextEditingController _complaintController = TextEditingController();
  final String _citizenId = '12345'; // Hardcoded as requested
  bool _isSubmitting = false;
  bool _isVoiceMode = false;

  @override
  void dispose() {
    _complaintController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.person, size: 32, color: Color(0xFF1976D2)),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Citizen Portal',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                'ID: $_citizenId',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Consumer<AppState>(
                      builder: (context, appState, child) {
                        return Row(
                          children: [
                            Icon(
                              appState.isOnline ? Icons.wifi : Icons.wifi_off,
                              color: appState.isOnline ? Colors.green : Colors.red,
                              size: 16,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              appState.isOnline ? 'Online' : 'Offline',
                              style: TextStyle(
                                color: appState.isOnline ? Colors.green : Colors.red,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Complaint Input Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Submit Complaint',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Voice/Text Toggle
                    Row(
                      children: [
                        Expanded(
                          child: SegmentedButton<bool>(
                            segments: const [
                              ButtonSegment<bool>(
                                value: false,
                                label: Text('Text Input'),
                                icon: Icon(Icons.keyboard),
                              ),
                              ButtonSegment<bool>(
                                value: true,
                                label: Text('Voice Input'),
                                icon: Icon(Icons.mic),
                              ),
                            ],
                            selected: {_isVoiceMode},
                            onSelectionChanged: (Set<bool> selection) {
                              setState(() {
                                _isVoiceMode = selection.first;
                              });
                              if (_isVoiceMode) {
                                _simulateVoiceInput();
                              }
                            },
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 16),

                    // Complaint Text Field
                    TextField(
                      controller: _complaintController,
                      maxLines: 6,
                      decoration: InputDecoration(
                        hintText: _isVoiceMode
                            ? 'Tap voice button to record complaint...'
                            : 'Describe your complaint in detail...',
                        border: const OutlineInputBorder(),
                        prefixIcon: Icon(
                          _isVoiceMode ? Icons.mic : Icons.edit,
                          color: _isVoiceMode ? Colors.red : Colors.blue,
                        ),
                      ),
                      enabled: !_isVoiceMode,
                    ),

                    const SizedBox(height: 16),

                    // Feature Buttons
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: _simulateLocationTagging,
                            icon: const Icon(Icons.location_on),
                            label: const Text('Add Location'),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: _simulatePhotoUpload,
                            icon: const Icon(Icons.camera_alt),
                            label: const Text('Add Photo'),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton.icon(
                        onPressed: _isSubmitting ? null : _submitComplaint,
                        icon: _isSubmitting
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                ),
                              )
                            : const Icon(Icons.send),
                        label: Text(_isSubmitting ? 'Submitting...' : 'Submit Complaint'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1976D2),
                          foregroundColor: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Recent Complaints Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Recent Complaints',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    FutureBuilder<List<Complaint>>(
                      future: _getRecentComplaints(),
                      builder: (context, snapshot) {
                        if (snapshot.connectionState == ConnectionState.waiting) {
                          return const Center(child: CircularProgressIndicator());
                        } else if (snapshot.hasError) {
                          return Text('Error: ${snapshot.error}');
                        } else if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                          return Column(
                            children: snapshot.data!.take(3).map((complaint) {
                              return Card(
                                margin: const EdgeInsets.only(bottom: 8),
                                child: ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor: _getStatusColor(complaint.status),
                                    child: Text(
                                      complaint.id.toString(),
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 12,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  title: Text(
                                    complaint.text.length > 50
                                        ? '${complaint.text.substring(0, 50)}...'
                                        : complaint.text,
                                    style: const TextStyle(fontSize: 14),
                                  ),
                                  subtitle: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text('Category: ${complaint.category}'),
                                      Text('Status: ${complaint.status}'),
                                    ],
                                  ),
                                  trailing: Chip(
                                    label: Text(complaint.urgency),
                                    backgroundColor: _getUrgencyColor(complaint.urgency),
                                    labelStyle: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                    ),
                                  ),
                                ),
                              );
                            }).toList(),
                          );
                        } else {
                          return const Text('No recent complaints found.');
                        }
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<List<Complaint>> _getRecentComplaints() async {
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final appState = Provider.of<AppState>(context, listen: false);
      
      if (appState.isOnline) {
        return await apiService.getDashboard(limit: 5);
      } else {
        // Return empty list when offline
        return [];
      }
    } catch (e) {
      return [];
    }
  }

  void _simulateVoiceInput() {
    // Simulate voice-to-text conversion
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Voice Input Simulation'),
        content: const Text(
          'This would normally use speech-to-text to convert your voice to text. '
          'For demo purposes, we\'ll simulate this with a sample complaint.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _complaintController.text = 
                  'Water supply has been cut off for 2 days in our area. '
                  'This is urgent as we have no drinking water available.';
            },
            child: const Text('Use Sample'),
          ),
        ],
      ),
    );
  }

  void _simulateLocationTagging() {
    // Simulate geo-tagging
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('📍 Location tagged: Sector 5, Block A (Simulated)'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _simulatePhotoUpload() {
    // Simulate photo upload
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Photo Upload Simulation'),
        content: const Text(
          'This would normally open the camera or gallery to capture/select a photo. '
          'For demo purposes, we\'ll simulate adding a photo description.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              final currentText = _complaintController.text;
              _complaintController.text = 
                  '$currentText\n\n[Photo attached: Evidence of the issue]';
            },
            child: const Text('Add Description'),
          ),
        ],
      ),
    );
  }

  Future<void> _submitComplaint() async {
    if (_complaintController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter your complaint'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      final submission = ComplaintSubmission(
        text: _complaintController.text.trim(),
        citizenId: _citizenId,
      );

      final appState = Provider.of<AppState>(context, listen: false);
      final apiService = Provider.of<ApiService>(context, listen: false);
      final storageService = Provider.of<StorageService>(context, listen: false);

      if (appState.isOnline) {
        // Try to submit online
        try {
          final complaint = await apiService.submitComplaint(submission);
          
          if (complaint != null) {
            _showSuccessMessage(complaint);
            _complaintController.clear();
          }
        } catch (e) {
          // If online submission fails, save offline
          await storageService.saveOfflineComplaint(submission);
          _showOfflineMessage();
        }
      } else {
        // Save offline
        await storageService.saveOfflineComplaint(submission);
        _showOfflineMessage();
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }

  void _showSuccessMessage(Complaint complaint) {
    // Simulate SMS notification
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('📱 SMS Notification (Simulated):'),
            const SizedBox(height: 4),
            Text('Complaint #${complaint.id} submitted successfully!'),
            Text('Category: ${complaint.category}'),
            Text('Status: ${complaint.status}'),
            Text('CRS Score: ${complaint.crsScore}'),
          ],
        ),
        duration: const Duration(seconds: 5),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _showOfflineMessage() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('📱 Complaint saved offline. Will sync when online.'),
        duration: Duration(seconds: 3),
        backgroundColor: Colors.orange,
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'resolved':
        return Colors.green;
      case 'in progress':
        return Colors.blue;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.orange;
    }
  }

  Color _getUrgencyColor(String urgency) {
    switch (urgency.toLowerCase()) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }
}


