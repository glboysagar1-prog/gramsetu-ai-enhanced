"""
GramSetu AI - Voice Complaint Module Test Script

Test the voice complaint functionality with sample data
"""

import requests
import json
import os
from pathlib import Path


# Configuration
API_BASE_URL = "http://localhost:5000/api/v1"
TEST_CITIZEN_ID = "TEST001"


def test_health_check():
    """Test if the API is running"""
    print("\n" + "="*50)
    print("Testing API Health Check...")
    print("="*50)
    
    try:
        response = requests.get(f"{API_BASE_URL.replace('/api/v1', '')}/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_voice_service_status():
    """Test voice service availability"""
    print("\n" + "="*50)
    print("Testing Voice Service Status...")
    print("="*50)
    
    try:
        response = requests.get(f"{API_BASE_URL}/voice/test")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_supported_languages():
    """Test getting supported languages"""
    print("\n" + "="*50)
    print("Testing Supported Languages...")
    print("="*50)
    
    try:
        response = requests.get(f"{API_BASE_URL}/voice/languages")
        print(f"Status Code: {response.status_code}")
        data = response.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if response.status_code == 200 and data['status'] == 'success':
            print(f"\n✅ Found {data['data']['count']} supported languages")
            return True
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_voice_upload(audio_file_path: str, language: str = None):
    """
    Test voice complaint upload
    
    Args:
        audio_file_path: Path to audio file
        language: Optional language code
    """
    print("\n" + "="*50)
    print(f"Testing Voice Upload: {audio_file_path}")
    print("="*50)
    
    if not os.path.exists(audio_file_path):
        print(f"❌ Audio file not found: {audio_file_path}")
        print("\nTo test voice upload, you need to:")
        print("1. Record an audio file (WAV, MP3, etc.)")
        print("2. Save it in the project directory")
        print("3. Update the path in this script")
        return False
    
    try:
        # Prepare form data
        files = {
            'audio': open(audio_file_path, 'rb')
        }
        
        data = {
            'citizen_id': TEST_CITIZEN_ID
        }
        
        if language:
            data['language'] = language
        
        # Upload
        print(f"Uploading audio file...")
        response = requests.post(
            f"{API_BASE_URL}/voice/upload",
            files=files,
            data=data
        )
        
        print(f"Status Code: {response.status_code}")
        result = response.json()
        print(f"Response: {json.dumps(result, indent=2)}")
        
        if response.status_code == 201 and result['status'] == 'success':
            print("\n✅ Voice complaint successfully processed!")
            complaint_data = result['data']
            print(f"\nComplaint Details:")
            print(f"  ID: {complaint_data['complaint_id']}")
            print(f"  Text: {complaint_data['text']}")
            print(f"  Category: {complaint_data['category']}")
            print(f"  Urgency: {complaint_data['urgency']}")
            print(f"  Language: {complaint_data['language']}")
            print(f"  Valid: {complaint_data['is_valid']}")
            return True
        else:
            print(f"\n❌ Upload failed")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def test_text_complaint():
    """Test traditional text complaint for comparison"""
    print("\n" + "="*50)
    print("Testing Text Complaint (for comparison)...")
    print("="*50)
    
    try:
        complaint_data = {
            "text": "Pani nahi aa raha hai do din se",
            "citizen_id": TEST_CITIZEN_ID
        }
        
        response = requests.post(
            f"{API_BASE_URL}/complaints",
            json=complaint_data
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def create_sample_audio():
    """
    Create a sample audio file using text-to-speech (requires additional packages)
    This is optional and for demonstration purposes
    """
    print("\n" + "="*50)
    print("Creating Sample Audio File...")
    print("="*50)
    
    try:
        # Try to use gTTS (Google Text-to-Speech) if available
        from gtts import gTTS
        
        # Sample complaint text in Hindi
        text = "Pani ki supply do din se band hai. Kripya jaldi se is samasya ka samadhan karein."
        
        # Create audio
        tts = gTTS(text=text, lang='hi')
        output_path = "sample_complaint_hindi.mp3"
        tts.save(output_path)
        
        print(f"✅ Sample audio created: {output_path}")
        print(f"Text: {text}")
        return output_path
        
    except ImportError:
        print("⚠️  gTTS not installed. Install with: pip install gTTS")
        print("Alternatively, you can record your own audio file.")
        return None
    except Exception as e:
        print(f"❌ Error creating sample audio: {e}")
        return None


def run_all_tests():
    """Run all tests"""
    print("\n" + "🚀 " + "="*48)
    print("GramSetu AI - Voice Complaint Module Test Suite")
    print("="*50)
    
    results = []
    
    # Test 1: Health check
    results.append(("Health Check", test_health_check()))
    
    # Test 2: Voice service status
    results.append(("Voice Service Status", test_voice_service_status()))
    
    # Test 3: Supported languages
    results.append(("Supported Languages", test_supported_languages()))
    
    # Test 4: Text complaint (baseline)
    results.append(("Text Complaint", test_text_complaint()))
    
    # Test 5: Voice upload (if audio file exists)
    audio_file = "sample_complaint_hindi.mp3"
    
    if not os.path.exists(audio_file):
        print(f"\n⚠️  Audio file not found: {audio_file}")
        print("Attempting to create sample audio...")
        audio_file = create_sample_audio()
    
    if audio_file and os.path.exists(audio_file):
        results.append(("Voice Upload (Hindi)", test_voice_upload(audio_file, 'hi')))
    else:
        print("\n⚠️  Skipping voice upload test (no audio file)")
        results.append(("Voice Upload", None))
    
    # Print summary
    print("\n" + "="*50)
    print("Test Summary")
    print("="*50)
    
    for test_name, result in results:
        if result is True:
            status = "✅ PASS"
        elif result is False:
            status = "❌ FAIL"
        else:
            status = "⚠️  SKIP"
        print(f"{test_name:30s} {status}")
    
    print("="*50)
    
    # Calculate pass rate
    passed = sum(1 for _, r in results if r is True)
    total = sum(1 for _, r in results if r is not None)
    
    if total > 0:
        pass_rate = (passed / total) * 100
        print(f"\nPass Rate: {passed}/{total} ({pass_rate:.1f}%)")
    
    print("\n" + "="*50)


if __name__ == "__main__":
    print("\n🎯 Starting Voice Complaint Module Tests...")
    print("Make sure the Flask server is running (python app.py)")
    
    input("\nPress Enter to continue...")
    
    run_all_tests()
    
    print("\n✨ Tests completed!")
