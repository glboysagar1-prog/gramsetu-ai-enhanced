#!/usr/bin/env python3
"""
GramSetu AI - Setup and Testing Script
Automated setup and testing for the backend API
"""

import subprocess
import sys
import os
import time
import requests
import json

def install_dependencies():
    """Install required Python packages"""
    print("Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def test_api_endpoints():
    """Test all API endpoints with sample data"""
    print("\nTesting API endpoints...")
    
    base_url = "http://localhost:5000"
    
    # Test data
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
    
    # Test health check
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed")
        else:
            print("❌ Health check failed")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API. Make sure the server is running.")
        return False
    
    # Test complaint submission
    for i, complaint in enumerate(test_complaints):
        try:
            response = requests.post(f"{base_url}/submit_complaint", json=complaint)
            if response.status_code == 201:
                data = response.json()
                complaint_ids.append(data['complaint_id'])
                print(f"✅ Complaint {i+1} submitted: {data['category']} - {data['urgency']} urgency")
                print(f"   CRS Score: {data['crs_score']}, Valid: {data['is_valid']}, Duplicate: {data['is_duplicate']}")
            else:
                print(f"❌ Complaint {i+1} failed: {response.status_code}")
        except Exception as e:
            print(f"❌ Error submitting complaint {i+1}: {e}")
    
    # Test complaint update
    if complaint_ids:
        try:
            update_data = {
                "id": complaint_ids[0],
                "evidence": "Water tanker provided to affected area",
                "status": "Resolved"
            }
            response = requests.post(f"{base_url}/update_complaint", json=update_data)
            if response.status_code == 200:
                print("✅ Complaint update successful")
            else:
                print("❌ Complaint update failed")
        except Exception as e:
            print(f"❌ Error updating complaint: {e}")
    
    # Test dashboard
    try:
        response = requests.get(f"{base_url}/dashboard")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Dashboard loaded: {data['statistics']['total_complaints']} total complaints")
            print(f"   Pending: {data['statistics']['pending_complaints']}, Duplicates: {data['statistics']['duplicate_complaints']}")
        else:
            print("❌ Dashboard failed")
    except Exception as e:
        print(f"❌ Error loading dashboard: {e}")
    
    # Test citizen info
    try:
        response = requests.get(f"{base_url}/citizen/CIT001")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Citizen info loaded: CRS Score {data['crs_score']}")
        else:
            print("❌ Citizen info failed")
    except Exception as e:
        print(f"❌ Error loading citizen info: {e}")
    
    return True

def main():
    """Main setup function"""
    print("🚀 GramSetu AI - Backend Setup")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    
    print(f"✅ Python {sys.version.split()[0]} detected")
    
    # Install dependencies
    if not install_dependencies():
        sys.exit(1)
    
    print("\n" + "=" * 50)
    print("🎯 Setup Complete!")
    print("\nTo start the server:")
    print("  python app.py")
    print("\nTo test the API:")
    print("  python setup.py --test")
    print("\nAPI will be available at: http://localhost:5000")
    
    # Run tests if requested
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        print("\n" + "=" * 50)
        print("🧪 Running API Tests...")
        print("Make sure the server is running (python app.py)")
        input("Press Enter when server is ready...")
        test_api_endpoints()

if __name__ == "__main__":
    main()


