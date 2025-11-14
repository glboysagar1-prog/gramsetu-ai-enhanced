#!/bin/bash

# GramSetu AI Backend API Test Script

BASE_URL="http://localhost:5000"
echo "Testing GramSetu AI Backend API at $BASE_URL"
echo "============================================"
echo ""

# Test 1: Signup
echo "1. Testing POST /api/auth/signup"
SIGNUP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser'$(date +%s)'",
    "email": "test'$(date +%s)'@example.com",
    "password": "password123"
  }')

echo "Response: $SIGNUP_RESPONSE"
TOKEN=$(echo "$SIGNUP_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token extracted: ${TOKEN:0:50}..."
echo ""

# Test 2: Login
echo "2. Testing POST /api/auth/login"
LOGIN_EMAIL=$(echo "$SIGNUP_RESPONSE" | grep -o '"email":"[^"]*' | cut -d'"' -f4)
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'$LOGIN_EMAIL'",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"
echo ""

# Test 3: Upload File
echo "3. Testing POST /api/files/upload"
UPLOAD_RESPONSE=$(curl -s -X POST "$BASE_URL/api/files/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test-document.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000
  }')

echo "Response: $UPLOAD_RESPONSE"
echo ""

# Test 4: Get Files
echo "4. Testing GET /api/files"
FILES_RESPONSE=$(curl -s -X GET "$BASE_URL/api/files" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $FILES_RESPONSE"
echo ""

# Test 5: Get Analytics (with dummy data)
echo "5. Testing GET /api/analytics?dummy=true"
ANALYTICS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/analytics?dummy=true" \
  -H "Authorization: Bearer $TOKEN")

echo "Response: $ANALYTICS_RESPONSE"
echo ""

# Test 6: Test without auth (should fail)
echo "6. Testing GET /api/files without auth (should fail with 401)"
UNAUTH_RESPONSE=$(curl -s -X GET "$BASE_URL/api/files")
echo "Response: $UNAUTH_RESPONSE"
echo ""

echo "============================================"
echo "All tests completed!"
