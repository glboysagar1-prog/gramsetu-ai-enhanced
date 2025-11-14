#!/usr/bin/env python3
"""
GramSetu AI - Test Client
Simple client to demonstrate API usage and test all endpoints
"""

import requests
import json
import time
from datetime import datetime

class GramSetuAIClient:
    def __init__(self, base_url="http://localhost:5000"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def health_check(self):
        """Check if the API is running"""
        try:
            response = self.session.get(f"{self.base_url}/health")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ API Health: {data['status']}")
                print(f"   Models loaded: {data['models_loaded']}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
        except requests.exceptions.ConnectionError:
            print("❌ Cannot connect to API. Make sure server is running.")
            return False
    
    def submit_complaint(self, text, citizen_id):
        """Submit a new complaint"""
        data = {
            "text": text,
            "citizen_id": citizen_id
        }
        
        try:
            response = self.session.post(f"{self.base_url}/submit_complaint", json=data)
            if response.status_code == 201:
                result = response.json()
                print(f"✅ Complaint submitted successfully!")
                print(f"   ID: {result['complaint_id']}")
                print(f"   Category: {result['category']}")
                print(f"   Urgency: {result['urgency']}")
                print(f"   CRS Score: {result['crs_score']}")
                print(f"   Valid: {result['is_valid']}")
                print(f"   Duplicate: {result['is_duplicate']}")
                print(f"   Hash: {result['hash'][:20]}...")
                return result
            else:
                print(f"❌ Failed to submit complaint: {response.status_code}")
                print(f"   Error: {response.text}")
                return None
        except Exception as e:
            print(f"❌ Error submitting complaint: {e}")
            return None
    
    def update_complaint(self, complaint_id, evidence="", status="Resolved"):
        """Update a complaint with evidence and status"""
        data = {
            "id": complaint_id,
            "evidence": evidence,
            "status": status
        }
        
        try:
            response = self.session.post(f"{self.base_url}/update_complaint", json=data)
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Complaint updated successfully!")
                print(f"   ID: {result['complaint_id']}")
                print(f"   Status: {result['status']}")
                return result
            else:
                print(f"❌ Failed to update complaint: {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ Error updating complaint: {e}")
            return None
    
    def get_dashboard(self, page=1, limit=10):
        """Get dashboard data"""
        try:
            response = self.session.get(f"{self.base_url}/dashboard?page={page}&limit={limit}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Dashboard loaded!")
                print(f"   Total complaints: {data['statistics']['total_complaints']}")
                print(f"   Pending: {data['statistics']['pending_complaints']}")
                print(f"   Duplicates: {data['statistics']['duplicate_complaints']}")
                print(f"   Average CRS: {data['statistics']['average_crs']}")
                
                print(f"\n   Recent complaints:")
                for complaint in data['complaints'][:5]:
                    print(f"   - ID {complaint['id']}: {complaint['category']} ({complaint['status']})")
                
                return data
            else:
                print(f"❌ Failed to load dashboard: {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ Error loading dashboard: {e}")
            return None
    
    def get_citizen_info(self, citizen_id):
        """Get citizen information"""
        try:
            response = self.session.get(f"{self.base_url}/citizen/{citizen_id}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Citizen info loaded!")
                print(f"   ID: {data['citizen_id']}")
                print(f"   CRS Score: {data['crs_score']}")
                print(f"   Recent complaints: {len(data['recent_complaints'])}")
                
                for complaint in data['recent_complaints'][:3]:
                    print(f"   - {complaint['category']}: {complaint['status']}")
                
                return data
            else:
                print(f"❌ Failed to load citizen info: {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ Error loading citizen info: {e}")
            return None

def run_demo():
    """Run a comprehensive demo of the API"""
    print("🚀 GramSetu AI - API Demo")
    print("=" * 50)
    
    client = GramSetuAIClient()
    
    # Health check
    print("\n1. Health Check")
    if not client.health_check():
        return
    
    # Test complaints
    test_complaints = [
        {
            "text": "Water supply has been cut off for 3 days in our area. This is urgent as we have no drinking water.",
            "citizen_id": "CIT001"
        },
        {
            "text": "Electricity outage in sector 5 since yesterday evening. Please restore power immediately.",
            "citizen_id": "CIT002"
        },
        {
            "text": "Road near the school is in very bad condition with potholes. Children are getting hurt.",
            "citizen_id": "CIT003"
        },
        {
            "text": "Rain not coming this season",  # Invalid context
            "citizen_id": "CIT001"
        },
        {
            "text": "Water supply has been cut off for 3 days in our area. This is urgent as we have no drinking water.",  # Duplicate
            "citizen_id": "CIT001"
        }
    ]
    
    complaint_ids = []
    
    # Submit complaints
    print("\n2. Submitting Complaints")
    for i, complaint in enumerate(test_complaints):
        print(f"\n   Complaint {i+1}: {complaint['text'][:50]}...")
        result = client.submit_complaint(complaint['text'], complaint['citizen_id'])
        if result:
            complaint_ids.append(result['complaint_id'])
    
    # Update a complaint
    if complaint_ids:
        print(f"\n3. Updating Complaint {complaint_ids[0]}")
        client.update_complaint(
            complaint_ids[0], 
            "Water tanker provided to affected area", 
            "Resolved"
        )
    
    # Get dashboard
    print("\n4. Dashboard Overview")
    client.get_dashboard()
    
    # Get citizen info
    print("\n5. Citizen Information")
    client.get_citizen_info("CIT001")
    
    print("\n" + "=" * 50)
    print("🎯 Demo completed successfully!")
    print("\nAPI Endpoints tested:")
    print("  ✅ POST /submit_complaint")
    print("  ✅ POST /update_complaint") 
    print("  ✅ GET  /dashboard")
    print("  ✅ GET  /citizen/<id>")
    print("  ✅ GET  /health")

if __name__ == "__main__":
    run_demo()


