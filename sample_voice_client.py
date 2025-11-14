"""
GramSetu AI - Voice Complaint Sample Client
Demonstrates how to integrate voice complaint functionality
"""

import requests
import json
import os
import sys
from typing import Optional, Dict


class GramSetuVoiceClient:
    """Client for GramSetu AI Voice Complaint API"""
    
    def __init__(self, base_url: str = "http://localhost:5000"):
        """
        Initialize the client
        
        Args:
            base_url: Base URL of the GramSetu AI API
        """
        self.base_url = base_url
        self.api_version = "v1"
        self.api_url = f"{base_url}/api/{self.api_version}"
    
    def check_health(self) -> Dict:
        """
        Check if the API is running
        
        Returns:
            Health status dictionary
        """
        try:
            response = requests.get(f"{self.base_url}/health")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def get_supported_languages(self) -> Dict:
        """
        Get list of supported languages
        
        Returns:
            Dictionary with supported languages
        """
        try:
            response = requests.get(f"{self.api_url}/voice/languages")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def submit_voice_complaint(
        self,
        audio_path: str,
        citizen_id: str,
        language: Optional[str] = None
    ) -> Dict:
        """
        Submit a voice complaint
        
        Args:
            audio_path: Path to the audio file
            citizen_id: Citizen ID
            language: Optional language code (auto-detected if None)
        
        Returns:
            Response dictionary with complaint data
        """
        try:
            # Validate file exists
            if not os.path.exists(audio_path):
                return {
                    "status": "error",
                    "message": f"Audio file not found: {audio_path}"
                }
            
            # Prepare request
            files = {'audio': open(audio_path, 'rb')}
            data = {'citizen_id': citizen_id}
            
            if language:
                data['language'] = language
            
            # Send request
            response = requests.post(
                f"{self.api_url}/voice/upload",
                files=files,
                data=data,
                timeout=60  # 60 second timeout for large files
            )
            
            # Parse response
            result = response.json()
            
            if response.status_code == 201:
                return result
            else:
                return {
                    "status": "error",
                    "message": result.get("message", "Upload failed")
                }
                
        except requests.exceptions.Timeout:
            return {
                "status": "error",
                "message": "Request timeout - file may be too large or server is slow"
            }
        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }
    
    def get_complaint(self, complaint_id: int) -> Dict:
        """
        Get complaint details by ID
        
        Args:
            complaint_id: Complaint ID
        
        Returns:
            Complaint data dictionary
        """
        try:
            response = requests.get(f"{self.api_url}/complaints/{complaint_id}")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"status": "error", "message": str(e)}
    
    def get_all_complaints(self) -> Dict:
        """
        Get all complaints
        
        Returns:
            List of complaints
        """
        try:
            response = requests.get(f"{self.api_url}/complaints")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"status": "error", "message": str(e)}


def print_result(title: str, result: Dict):
    """Pretty print result"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)
    print(json.dumps(result, indent=2, ensure_ascii=False))
    print("=" * 60)


def main():
    """Main demo function"""
    print("\n🎤 GramSetu AI - Voice Complaint Client Demo")
    print("=" * 60)
    
    # Initialize client
    client = GramSetuVoiceClient()
    
    # Check health
    print("\n1️⃣  Checking API health...")
    health = client.check_health()
    if health.get("status") == "healthy":
        print("✅ API is running!")
    else:
        print("❌ API is not responding")
        print_result("Health Check", health)
        return
    
    # Get supported languages
    print("\n2️⃣  Getting supported languages...")
    languages = client.get_supported_languages()
    print_result("Supported Languages", languages)
    
    # Demo voice upload
    print("\n3️⃣  Voice Complaint Submission Demo")
    print("-" * 60)
    
    # Check for sample audio file
    sample_file = "sample_complaint_hindi.mp3"
    
    if not os.path.exists(sample_file):
        print(f"\n⚠️  Sample audio file not found: {sample_file}")
        print("\nTo test voice upload:")
        print("1. Record an audio file (WAV, MP3, etc.)")
        print("2. Save it as 'sample_complaint_hindi.mp3'")
        print("3. Run this script again")
        print("\nOr use gTTS to create a sample:")
        print("  pip install gTTS")
        print("  python -c \"from gtts import gTTS; gTTS('पानी नहीं आ रहा', lang='hi').save('sample_complaint_hindi.mp3')\"")
        
        # Ask for custom file
        print("\n" + "-" * 60)
        audio_path = input("Enter path to audio file (or press Enter to skip): ").strip()
        
        if not audio_path or not os.path.exists(audio_path):
            print("\n⏭️  Skipping voice upload demo")
            return
    else:
        audio_path = sample_file
    
    # Submit voice complaint
    print(f"\n📤 Uploading audio file: {audio_path}")
    
    result = client.submit_voice_complaint(
        audio_path=audio_path,
        citizen_id="DEMO001",
        language="hi"  # Hindi
    )
    
    if result.get("status") == "success":
        print("\n✅ Voice complaint submitted successfully!")
        complaint_data = result.get("data", {})
        
        print("\n📋 Complaint Details:")
        print(f"  ID:        {complaint_data.get('complaint_id')}")
        print(f"  Text:      {complaint_data.get('text')}")
        print(f"  Category:  {complaint_data.get('category')}")
        print(f"  Urgency:   {complaint_data.get('urgency')}")
        print(f"  Language:  {complaint_data.get('language')}")
        print(f"  Valid:     {complaint_data.get('is_valid')}")
        print(f"  Duration:  {complaint_data.get('audio_duration', 0):.1f}s")
        
        print_result("Full Response", result)
    else:
        print("\n❌ Voice complaint submission failed")
        print_result("Error Response", result)
    
    print("\n✨ Demo completed!")
    print("=" * 60)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Demo interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)
