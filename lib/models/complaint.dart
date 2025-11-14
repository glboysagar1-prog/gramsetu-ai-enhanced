
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

  Complaint({
    this.id,
    required this.text,
    required this.category,
    required this.urgency,
    required this.citizenId,
    required this.crsScore,
    required this.hash,
    required this.timestamp,
    required this.status,
    this.evidence,
    required this.isDuplicate,
    required this.isValid,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      id: json['id'],
      text: json['text'] ?? '',
      category: json['category'] ?? '',
      urgency: json['urgency'] ?? 'Medium',
      citizenId: json['citizen_id'] ?? '',
      crsScore: json['crs_score'] ?? 100,
      hash: json['hash'] ?? '',
      timestamp: json['timestamp'] ?? '',
      status: json['status'] ?? 'Pending',
      evidence: json['evidence'],
      isDuplicate: json['is_duplicate'] ?? false,
      isValid: json['is_valid'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'text': text,
      'category': category,
      'urgency': urgency,
      'citizen_id': citizenId,
      'crs_score': crsScore,
      'hash': hash,
      'timestamp': timestamp,
      'status': status,
      'evidence': evidence,
      'is_duplicate': isDuplicate,
      'is_valid': isValid,
    };
  }

  Complaint copyWith({
    int? id,
    String? text,
    String? category,
    String? urgency,
    String? citizenId,
    int? crsScore,
    String? hash,
    String? timestamp,
    String? status,
    String? evidence,
    bool? isDuplicate,
    bool? isValid,
  }) {
    return Complaint(
      id: id ?? this.id,
      text: text ?? this.text,
      category: category ?? this.category,
      urgency: urgency ?? this.urgency,
      citizenId: citizenId ?? this.citizenId,
      crsScore: crsScore ?? this.crsScore,
      hash: hash ?? this.hash,
      timestamp: timestamp ?? this.timestamp,
      status: status ?? this.status,
      evidence: evidence ?? this.evidence,
      isDuplicate: isDuplicate ?? this.isDuplicate,
      isValid: isValid ?? this.isValid,
    );
  }

  @override
  String toString() {
    return 'Complaint(id: $id, text: $text, category: $category, status: $status)';
  }
}

class ComplaintSubmission {
  final String text;
  final String citizenId;

  ComplaintSubmission({
    required this.text,
    required this.citizenId,
  });

  Map<String, dynamic> toJson() {
    return {
      'text': text,
      'citizen_id': citizenId,
    };
  }
}

class ComplaintUpdate {
  final int id;
  final String? evidence;
  final String status;

  ComplaintUpdate({
    required this.id,
    this.evidence,
    required this.status,
  });

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'evidence': evidence,
      'status': status,
    };
  }
}


