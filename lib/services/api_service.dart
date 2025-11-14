import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/complaint.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:5000/api/v1';
  static const Duration timeout = Duration(seconds: 30);
  
  // For logging
  void _logRequest(String method, String endpoint, dynamic body) {
    print('API REQUEST: $method $endpoint');
    if (body != null) print('REQUEST BODY: $body');
  }
  
  void _logResponse(String endpoint, int statusCode, dynamic body) {
    print('API RESPONSE: $endpoint - Status: $statusCode');
    print('RESPONSE BODY: $body');
  }

  // Check if server is reachable
  Future<bool> isServerReachable() async {
    try {
      _logRequest('GET', '$baseUrl/complaints', null);
      final response = await http
          .get(
            Uri.parse('$baseUrl/complaints'),
            headers: {'Content-Type': 'application/json'},
          )
          .timeout(timeout);
      _logResponse('$baseUrl/complaints', response.statusCode, 'Health check');
      return response.statusCode == 200;
    } catch (e) {
      print('Server unreachable: $e');
      return false;
    }
  }

  // Submit a new complaint
  Future<Complaint?> submitComplaint(ComplaintSubmission submission) async {
    try {
      final endpoint = '$baseUrl/complaints';
      _logRequest('POST', endpoint, submission.toJson());
      
      final response = await http
          .post(
            Uri.parse(endpoint),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(submission.toJson()),
          )
          .timeout(timeout);

      final responseData = jsonDecode(response.body);
      _logResponse(endpoint, response.statusCode, responseData);

      if (response.statusCode == 200 && responseData['status'] == 'success') {
        final complaintData = responseData['data'];
        return Complaint.fromJson({
          'id': complaintData['complaint_id'],
          'text': submission.text,
          'category': complaintData['category'],
          'status': complaintData['is_valid'] ? 'Pending' : 'Invalid',
          'createdAt': DateTime.now().toIso8601String(),
          'hash': complaintData['hash'],
          'citizenId': submission.citizenId,
          'urgency': complaintData['urgency'],
        });
      } else {
        throw Exception('Failed to submit complaint: ${responseData['message'] ?? response.statusCode}');
      }
    } on SocketException {
      throw Exception('No internet connection');
    } on HttpException {
      throw Exception('Server error');
    } catch (e) {
      print('Submit complaint error: $e');
      throw Exception('Failed to submit complaint: $e');
    }
  }

  // Update an existing complaint
  Future<bool> updateComplaint(ComplaintUpdate update) async {
    try {
      final endpoint = '$baseUrl/complaints/${update.complaintId}';
      _logRequest('PUT', endpoint, update.toJson());
      
      final response = await http
          .put(
            Uri.parse(endpoint),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode(update.toJson()),
          )
          .timeout(timeout);

      final responseData = jsonDecode(response.body);
      _logResponse(endpoint, response.statusCode, responseData);

      return response.statusCode == 200 && responseData['status'] == 'success';
    } on SocketException {
      throw Exception('No internet connection');
    } on HttpException {
      throw Exception('Server error');
    } catch (e) {
      print('Update complaint error: $e');
      throw Exception('Failed to update complaint: $e');
    }
  }

  // Get dashboard data (list of complaints)
  Future<List<Complaint>> getDashboard({int page = 1, int limit = 20}) async {
    try {
      final endpoint = '$baseUrl/complaints';
      _logRequest('GET', endpoint, null);
      
      final response = await http
          .get(
            Uri.parse(endpoint),
            headers: {'Content-Type': 'application/json'},
          )
          .timeout(timeout);

      final responseData = jsonDecode(response.body);
      _logResponse(endpoint, response.statusCode, 'Dashboard data received');

      if (response.statusCode == 200) {
        final complaintsJson = responseData as List;
        return complaintsJson.map((json) => Complaint.fromJson({
          'id': json['id'],
          'text': json['description'],
          'category': json['category'],
          'status': json['status'],
          'createdAt': json['created_at'],
          'hash': json['hash'],
          'citizenId': json['citizen_id'],
          'urgency': json['urgency'] ?? 'Medium',
          'assignedTo': json['assigned_to'] ?? 'Unassigned',
        })).toList();
      } else {
        throw Exception('Failed to get dashboard: ${response.statusCode}');
      }
    } on SocketException {
      throw Exception('No internet connection');
    } on HttpException {
      throw Exception('Server error');
    } catch (e) {
      print('Get dashboard error: $e');
      throw Exception('Failed to get dashboard: $e');
    }
  }

  // Get citizen information
  Future<Map<String, dynamic>?> getCitizenInfo(String citizenId) async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/citizen/$citizenId'),
            headers: {'Content-Type': 'application/json'},
          )
          .timeout(timeout);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else if (response.statusCode == 404) {
        return null;
      } else {
        throw Exception('Failed to get citizen info: ${response.statusCode}');
      }
    } on SocketException {
      throw Exception('No internet connection');
    } on HttpException {
      throw Exception('Server error');
    } catch (e) {
      throw Exception('Failed to get citizen info: $e');
    }
  }

  // Health check
  Future<Map<String, dynamic>?> getHealthStatus() async {
    try {
      final response = await http
          .get(
            Uri.parse('$baseUrl/health'),
            headers: {'Content-Type': 'application/json'},
          )
          .timeout(timeout);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Health check failed: ${response.statusCode}');
      }
    } on SocketException {
      throw Exception('No internet connection');
    } on HttpException {
      throw Exception('Server error');
    } catch (e) {
      throw Exception('Health check failed: $e');
    }
  }
}


