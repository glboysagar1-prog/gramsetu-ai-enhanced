#!/bin/bash
# Stress Test Script for GramSetu AI Backend
# Uses autocannon for HTTP load testing

# Colors for output
RED='\033[0:31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  GramSetu AI - Stress Test Suite${NC}"
echo -e "${GREEN}=====================================${NC}"

# Check if autocannon is installed
if ! command -v autocannon &> /dev/null
then
    echo -e "${YELLOW}Installing autocannon...${NC}"
    npm install -g autocannon
fi

# Configuration
API_URL="${API_URL:-http://localhost:5000}"
DURATION="${DURATION:-30}"
CONNECTIONS="${CONNECTIONS:-10}"
PIPELINING="${PIPELINING:-1}"

echo -e "\n${YELLOW}Test Configuration:${NC}"
echo "API URL: $API_URL"
echo "Duration: ${DURATION}s"
echo "Concurrent connections: $CONNECTIONS"
echo "Pipelining: $PIPELINING"

# Test 1: Health Check Endpoint
echo -e "\n${GREEN}[Test 1/5] Health Check Endpoint${NC}"
autocannon -c $CONNECTIONS -d $DURATION "$API_URL/healthz"

# Test 2: Dashboard Analytics (Most Critical)
echo -e "\n${GREEN}[Test 2/5] Dashboard Analytics (Citizen Role)${NC}"
autocannon -c $CONNECTIONS -d $DURATION \
  -H "Authorization: Bearer test_token_citizen" \
  "$API_URL/api/dashboard?role=citizen"

# Test 3: Complaint Submission (POST)
echo -e "\n${GREEN}[Test 3/5] Complaint Submission${NC}"
autocannon -c 5 -d 20 -m POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token_citizen" \
  -b '{"text":"Test complaint for load testing","category":"Water","urgency":"Medium"}' \
  "$API_URL/api/complaints"

# Test 4: AI Chat Endpoint
echo -e "\n${GREEN}[Test 4/5] AI Chat Assistant${NC}"
autocannon -c 5 -d 20 -m POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test_token_state" \
  -b '{"message":"Which district needs fund allocation?","role":"state"}' \
  "$API_URL/api/ai/chat"

# Test 5: Analytics with Time Range
echo -e "\n${GREEN}[Test 5/5] Analytics with Filters${NC}"
autocannon -c $CONNECTIONS -d 20 \
  -H "Authorization: Bearer test_token_district" \
  "$API_URL/api/analytics?role=district&timeRange=30d"

# Summary
echo -e "\n${GREEN}=====================================${NC}"
echo -e "${GREEN}  Stress Test Completed!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "\n${YELLOW}Results Summary:${NC}"
echo "Check above output for:"
echo "  - Requests/sec (target: >100 for health, >50 for dashboard)"
echo "  - Latency p99 (target: <500ms for dashboard)"
echo "  - Error rate (target: <1%)"
echo ""
echo -e "${YELLOW}Performance Thresholds:${NC}"
echo "  ✓ Excellent: >100 req/s, <200ms p99"
echo "  ✓ Good: >50 req/s, <500ms p99"
echo "  ⚠ Acceptable: >20 req/s, <1000ms p99"
echo "  ✗ Poor: <20 req/s, >1000ms p99"
echo ""

# Optional: Generate HTML report
if command -v autocannon-reporter &> /dev/null; then
    echo -e "${GREEN}Generating HTML report...${NC}"
    echo "Report will be available at: ./stress-test-report.html"
fi

echo -e "\n${GREEN}Done!${NC}"
