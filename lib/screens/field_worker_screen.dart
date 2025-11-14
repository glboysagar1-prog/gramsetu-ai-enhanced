import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/complaint.dart';
import '../services/api_service.dart';
import '../services/storage_service.dart';
import '../models/app_state.dart';

class FieldWorkerScreen extends StatefulWidget {
  const FieldWorkerScreen({super.key});

  @override
  State<FieldWorkerScreen> createState() => _FieldWorkerScreenState();
}

class _FieldWorkerScreenState extends State<FieldWorkerScreen> {
  List<Complaint> _complaints = [];
  bool _isLoading = false;
  String _selectedStatus = 'Pending';
  final TextEditingController _evidenceController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadComplaints();
  }

  @override
  void dispose() {
    _evidenceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          // Header Card
          Card(
            margin: const EdgeInsets.all(16.0),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.work, size: 32, color: Color(0xFF1976D2)),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Field Worker Portal',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              'Complaint Management System',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Consumer<AppState>(
                        builder: (context, appState, child) {
                          return Column(
                            children: [
                              Icon(
                                appState.isOnline ? Icons.wifi : Icons.wifi_off,
                                color: appState.isOnline ? Colors.green : Colors.red,
                                size: 20,
                              ),
                              Text(
                                appState.isOnline ? 'Online' : 'Offline',
                                style: TextStyle(
                                  color: appState.isOnline ? Colors.green : Colors.red,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Status Filter
                  Row(
                    children: [
                      const Text('Filter by Status: '),
                      Expanded(
                        child: DropdownButton<String>(
                          value: _selectedStatus,
                          isExpanded: true,
                          items: const [
                            DropdownMenuItem(value: 'All', child: Text('All')),
                            DropdownMenuItem(value: 'Pending', child: Text('Pending')),
                            DropdownMenuItem(value: 'In Progress', child: Text('In Progress')),
                            DropdownMenuItem(value: 'Resolved', child: Text('Resolved')),
                            DropdownMenuItem(value: 'Rejected', child: Text('Rejected')),
                          ],
                          onChanged: (value) {
                            setState(() {
                              _selectedStatus = value!;
                            });
                            _loadComplaints();
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Statistics Row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              children: [
                Expanded(
                  child: _buildStatCard('Total', _complaints.length.toString(), Colors.blue),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildStatCard(
                    'Pending', 
                    _complaints.where((c) => c.status == 'Pending').length.toString(), 
                    Colors.orange
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildStatCard(
                    'Resolved', 
                    _complaints.where((c) => c.status == 'Resolved').length.toString(), 
                    Colors.green
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Complaints List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _complaints.isEmpty
                    ? const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.inbox, size: 64, color: Colors.grey),
                            SizedBox(height: 16),
                            Text(
                              'No complaints found',
                              style: TextStyle(fontSize: 18, color: Colors.grey),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _loadComplaints,
                        child: ListView.builder(
                          padding: const EdgeInsets.symmetric(horizontal: 16.0),
                          itemCount: _complaints.length,
                          itemBuilder: (context, index) {
                            final complaint = _complaints[index];
                            return _buildComplaintCard(complaint);
                          },
                        ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _loadComplaints,
        child: const Icon(Icons.refresh),
        tooltip: 'Refresh Complaints',
      ),
    );
  }

  Widget _buildStatCard(String title, String value, Color color) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              title,
              style: const TextStyle(fontSize: 12),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildComplaintCard(Complaint complaint) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12.0),
      child: ExpansionTile(
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
          complaint.text.length > 60
              ? '${complaint.text.substring(0, 60)}...'
              : complaint.text,
          style: const TextStyle(fontWeight: FontWeight.w500),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Row(
              children: [
                Chip(
                  label: Text(complaint.category),
                  backgroundColor: Colors.blue[100],
                  labelStyle: const TextStyle(fontSize: 10),
                ),
                const SizedBox(width: 8),
                Chip(
                  label: Text(complaint.urgency),
                  backgroundColor: _getUrgencyColor(complaint.urgency),
                  labelStyle: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'Status: ${complaint.status} | CRS: ${complaint.crsScore}',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Complaint Details
                _buildDetailRow('Complaint ID', complaint.id.toString()),
                _buildDetailRow('Citizen ID', complaint.citizenId),
                _buildDetailRow('Category', complaint.category),
                _buildDetailRow('Urgency', complaint.urgency),
                _buildDetailRow('Status', complaint.status),
                _buildDetailRow('CRS Score', complaint.crsScore.toString()),
                _buildDetailRow('Submitted', _formatTimestamp(complaint.timestamp)),
                _buildDetailRow('Hash', '${complaint.hash.substring(0, 20)}...'),
                
                if (complaint.evidence != null && complaint.evidence!.isNotEmpty)
                  _buildDetailRow('Evidence', complaint.evidence!),

                const SizedBox(height: 16),

                // Action Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _showUpdateDialog(complaint),
                        icon: const Icon(Icons.edit),
                        label: const Text('Update'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () => _simulatePhotoEvidence(complaint),
                        icon: const Icon(Icons.camera_alt),
                        label: const Text('Add Photo'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.w500,
                fontSize: 12,
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  void _showUpdateDialog(Complaint complaint) {
    _evidenceController.clear();
    _selectedStatus = complaint.status;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Update Complaint #${complaint.id}'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Status Dropdown
              DropdownButtonFormField<String>(
                initialValue: _selectedStatus,
                decoration: const InputDecoration(
                  labelText: 'Status',
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: 'Pending', child: Text('Pending')),
                  DropdownMenuItem(value: 'In Progress', child: Text('In Progress')),
                  DropdownMenuItem(value: 'Resolved', child: Text('Resolved')),
                  DropdownMenuItem(value: 'Rejected', child: Text('Rejected')),
                ],
                onChanged: (value) {
                  setState(() {
                    _selectedStatus = value!;
                  });
                },
              ),

              const SizedBox(height: 16),

              // Evidence Text Field
              TextField(
                controller: _evidenceController,
                maxLines: 4,
                decoration: const InputDecoration(
                  labelText: 'Evidence/Notes',
                  hintText: 'Add evidence, notes, or resolution details...',
                  border: OutlineInputBorder(),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _updateComplaint(complaint);
            },
            child: const Text('Update'),
          ),
        ],
      ),
    );
  }

  void _simulatePhotoEvidence(Complaint complaint) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add Photo Evidence'),
        content: const Text(
          'This would normally open the camera to capture a photo of the issue or resolution. '
          'For demo purposes, we\'ll simulate adding photo evidence.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _evidenceController.text = 'Photo evidence: [Simulated image of issue/resolution]';
              _showUpdateDialog(complaint);
            },
            child: const Text('Add Photo'),
          ),
        ],
      ),
    );
  }

  Future<void> _updateComplaint(Complaint complaint) async {
    try {
      final update = ComplaintUpdate(
        id: complaint.id!,
        evidence: _evidenceController.text.trim().isEmpty ? null : _evidenceController.text.trim(),
        status: _selectedStatus,
      );

      final appState = Provider.of<AppState>(context, listen: false);
      final apiService = Provider.of<ApiService>(context, listen: false);
      final storageService = Provider.of<StorageService>(context, listen: false);

      if (appState.isOnline) {
        try {
          final success = await apiService.updateComplaint(update);
          if (success) {
            _showUpdateSuccessMessage(complaint);
            _loadComplaints(); // Refresh the list
          }
        } catch (e) {
          // If online update fails, save offline
          await storageService.saveOfflineUpdate(update);
          _showOfflineUpdateMessage();
        }
      } else {
        // Save offline
        await storageService.saveOfflineUpdate(update);
        _showOfflineUpdateMessage();
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error updating complaint: $e'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _showUpdateSuccessMessage(Complaint complaint) {
    // Simulate SMS notification to citizen
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('📱 SMS Notification Sent (Simulated):'),
            const SizedBox(height: 4),
            Text('Complaint #${complaint.id} status updated to: $_selectedStatus'),
            Text('Citizen ID: ${complaint.citizenId}'),
          ],
        ),
        duration: const Duration(seconds: 4),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _showOfflineUpdateMessage() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('📱 Update saved offline. Will sync when online.'),
        duration: Duration(seconds: 3),
        backgroundColor: Colors.orange,
      ),
    );
  }

  Future<void> _loadComplaints() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final appState = Provider.of<AppState>(context, listen: false);

      if (appState.isOnline) {
        final complaints = await apiService.getDashboard(limit: 50);
        
        // Filter by status if not "All"
        if (_selectedStatus != 'All') {
          _complaints = complaints.where((c) => c.status == _selectedStatus).toList();
        } else {
          _complaints = complaints;
        }
      } else {
        // When offline, show empty list or cached data
        _complaints = [];
      }
    } catch (e) {
      // Handle error - could show cached data or empty state
      _complaints = [];
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
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

  String _formatTimestamp(String timestamp) {
    try {
      final dateTime = DateTime.parse(timestamp);
      return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
    } catch (e) {
      return timestamp;
    }
  }
}


