# 📋 Voice Complaint Module - Example Outputs

This document shows real-world examples of the JSON output from the voice complaint module.

---

## Example 1: Hindi Water Complaint (High Urgency)

**Audio Input**: 5-second recording in Hindi  
**Spoken Text**: "Pani nahi aa raha hai do din se"  
**Translation**: "Water is not coming for two days"

### API Response:
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0001",
    "text": "Pani nahi aa raha hai do din se",
    "category": "Water",
    "urgency": "High",
    "language": "Hindi",
    "timestamp": "2025-10-22T14:22:31Z",
    "hash": "a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3",
    "is_valid": true,
    "is_duplicate": false,
    "crs_score": 102,
    "audio_duration": 5.2,
    "keywords": ["pani", "nahi", "raha", "din"]
  }
}
```

---

## Example 2: Tamil Health Complaint (High Urgency)

**Audio Input**: 7-second recording in Tamil  
**Spoken Text**: "அரசு மருத்துவமனையில் மருத்துவர் இல்லை"  
**Translation**: "No doctor in government hospital"

### API Response:
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0002",
    "text": "அரசு மருத்துவமனையில் மருத்துவர் இல்லை",
    "category": "Health",
    "urgency": "High",
    "language": "Tamil",
    "timestamp": "2025-10-22T15:30:45Z",
    "hash": "b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6",
    "is_valid": true,
    "is_duplicate": false,
    "crs_score": 104,
    "audio_duration": 7.1,
    "keywords": ["மருத்துவமனையில்", "மருத்துவர்", "இல்லை"]
  }
}
```

---

## Example 3: Gujarati Electricity Complaint (Medium Urgency)

**Audio Input**: 6-second recording in Gujarati  
**Spoken Text**: "બે દિવસથી વીજળી જતી રહે છે"  
**Translation**: "Electricity keeps going for two days"

### API Response:
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0003",
    "text": "બે દિવસથી વીજળી જતી રહે છે",
    "category": "Electricity",
    "urgency": "Medium",
    "language": "Gujarati",
    "timestamp": "2025-10-22T16:15:22Z",
    "hash": "c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7",
    "is_valid": true,
    "is_duplicate": false,
    "crs_score": 106,
    "audio_duration": 6.3,
    "keywords": ["દિવસથી", "વીજળી", "રહે"]
  }
}
```

---

## Example 4: English Road Complaint (Medium Urgency)

**Audio Input**: 8-second recording in English  
**Spoken Text**: "The main road has many potholes, please repair it"

### API Response:
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0004",
    "text": "The main road has many potholes, please repair it",
    "category": "Road",
    "urgency": "Medium",
    "language": "English",
    "timestamp": "2025-10-22T17:00:10Z",
    "hash": "d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8",
    "is_valid": true,
    "is_duplicate": false,
    "crs_score": 108,
    "audio_duration": 8.5,
    "keywords": ["road", "potholes", "repair", "please"]
  }
}
```

---

## Example 5: Bengali Sanitation Complaint (High Urgency)

**Audio Input**: 6-second recording in Bengali  
**Spoken Text**: "আবর্জনা সংগ্রহ হচ্ছে না, জরুরি সাহায্য চাই"  
**Translation**: "Garbage is not being collected, need urgent help"

### API Response:
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0005",
    "text": "আবর্জনা সংগ্রহ হচ্ছে না, জরুরি সাহায্য চাই",
    "category": "Sanitation",
    "urgency": "High",
    "language": "Bengali",
    "timestamp": "2025-10-22T18:20:55Z",
    "hash": "e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9",
    "is_valid": true,
    "is_duplicate": false,
    "crs_score": 110,
    "audio_duration": 6.8,
    "keywords": ["আবর্জনা", "সংগ্রহ", "জরুরি", "সাহায্য"]
  }
}
```

---

## Example 6: Invalid Complaint (Spam Detection)

**Audio Input**: 4-second recording  
**Spoken Text**: "Weather is very hot today"

### API Response:
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0006",
    "text": "Weather is very hot today",
    "category": "Other",
    "urgency": "Medium",
    "language": "English",
    "timestamp": "2025-10-22T19:10:30Z",
    "hash": "f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0",
    "is_valid": false,
    "is_duplicate": false,
    "crs_score": 90,
    "audio_duration": 4.2,
    "keywords": ["weather", "very", "today"]
  }
}
```

**Note**: CRS score decreased from 100 to 90 due to invalid complaint.

---

## Example 7: Duplicate Complaint Detection

**Audio Input**: 5-second recording in Hindi  
**Spoken Text**: "Pani nahi aa raha hai do din se" (Same as Example 1)

### API Response:
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0007",
    "text": "Pani nahi aa raha hai do din se",
    "category": "Water",
    "urgency": "High",
    "language": "Hindi",
    "timestamp": "2025-10-22T20:05:15Z",
    "hash": "g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1",
    "is_valid": true,
    "is_duplicate": true,
    "duplicate_of": 1,
    "crs_score": 97,
    "audio_duration": 5.1,
    "keywords": ["pani", "nahi", "raha", "din"]
  }
}
```

**Note**: Detected as duplicate of complaint ID 1. CRS score decreased by 5 points (102 → 97).

---

## Example 8: Multiple Language Detection

**Audio Input**: 10-second recording with code-mixing  
**Spoken Text**: "Sir, pani supply band hai, please check karo"

### API Response:
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0008",
    "text": "Sir, pani supply band hai, please check karo",
    "category": "Water",
    "urgency": "High",
    "language": "Hindi",
    "timestamp": "2025-10-22T21:15:40Z",
    "hash": "h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2",
    "is_valid": true,
    "is_duplicate": false,
    "crs_score": 112,
    "audio_duration": 10.2,
    "keywords": ["pani", "supply", "band", "check", "karo"]
  }
}
```

---

## Example 9: Education Complaint

**Audio Input**: 7-second recording in Marathi  
**Spoken Text**: "शाळेत शिक्षक नाहीत, मुले घरी बसली आहेत"  
**Translation**: "No teachers in school, children are sitting at home"

### API Response:
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0009",
    "text": "शाळेत शिक्षक नाहीत, मुले घरी बसली आहेत",
    "category": "Education",
    "urgency": "High",
    "language": "Marathi",
    "timestamp": "2025-10-23T09:30:20Z",
    "hash": "i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3",
    "is_valid": true,
    "is_duplicate": false,
    "crs_score": 114,
    "audio_duration": 7.6,
    "keywords": ["शाळेत", "शिक्षक", "नाहीत", "मुले"]
  }
}
```

---

## Example 10: Agriculture Complaint

**Audio Input**: 9-second recording in Punjabi  
**Spoken Text**: "ਫਸਲ ਦੀ ਸਬਸਿਡੀ ਨਹੀਂ ਮਿਲੀ, ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ"  
**Translation**: "Crop subsidy not received, please help"

### API Response:
```json
{
  "status": "success",
  "data": {
    "complaint_id": "GSAI-2025-0010",
    "text": "ਫਸਲ ਦੀ ਸਬਸਿਡੀ ਨਹੀਂ ਮਿਲੀ, ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ",
    "category": "Agriculture",
    "urgency": "Medium",
    "language": "Punjabi",
    "timestamp": "2025-10-23T10:45:35Z",
    "hash": "j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4",
    "is_valid": true,
    "is_duplicate": false,
    "crs_score": 116,
    "audio_duration": 9.3,
    "keywords": ["ਫਸਲ", "ਸਬਸਿਡੀ", "ਮਿਲੀ", "ਮਦਦ"]
  }
}
```

---

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `complaint_id` | string | Unique identifier (format: GSAI-YYYY-NNNN) |
| `text` | string | Transcribed text from audio |
| `category` | string | AI-classified category (Water, Health, etc.) |
| `urgency` | string | Urgency level (Low, Medium, High) |
| `language` | string | Detected language name |
| `timestamp` | string | ISO 8601 timestamp (UTC) |
| `hash` | string | SHA256 hash for blockchain audit |
| `is_valid` | boolean | Whether complaint is valid (spam detection) |
| `is_duplicate` | boolean | Whether complaint is duplicate |
| `duplicate_of` | integer | ID of original complaint (if duplicate) |
| `crs_score` | integer | Citizen Rating System score |
| `audio_duration` | float | Audio length in seconds |
| `keywords` | array | Extracted keywords from text |

---

## Status Codes

| Code | Status | Description |
|------|--------|-------------|
| 201 | Created | Complaint successfully processed |
| 400 | Bad Request | Missing required fields or invalid data |
| 500 | Internal Error | Server error during processing |

---

## Error Response Example

**Scenario**: No audio file provided

```json
{
  "status": "error",
  "message": "No audio file provided"
}
```

**Scenario**: File too large

```json
{
  "status": "error",
  "message": "File size exceeds maximum limit of 10.0 MB"
}
```

**Scenario**: Unsupported format

```json
{
  "status": "error",
  "message": "Invalid file type. Allowed: wav, mp3, ogg, m4a, flac, webm"
}
```

---

## CRS Score Tracking

| Action | Score Change |
|--------|-------------|
| Valid complaint | +2 |
| Invalid complaint | -10 |
| Duplicate complaint | -5 |
| Initial score | 100 |
| Minimum score | 0 |
| Maximum score | 100 |

---

**Note**: All timestamps are in UTC timezone. The `complaint_id` format is `GSAI-YEAR-NUMBER` where NUMBER is zero-padded to 4 digits.
