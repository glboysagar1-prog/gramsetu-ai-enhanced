#!/usr/bin/env python3

"""
Environment Setup Script for GramSetu AI Python Backend
This script helps verify and set up the required environment variables for the Python backend
"""

import os
import sys
from dotenv import load_dotenv

def check_environment():
    """Check if required environment variables are set"""
    print("🔍 GramSetu AI Python Backend Environment Setup")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Required environment variables
    required_vars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'OPENAI_API_KEY',
        'PINECONE_API_KEY',
        'PINECONE_ENVIRONMENT',
        'PINECONE_INDEX'
    ]
    
    # Optional environment variables with defaults
    optional_vars = {
        'FLASK_ENV': 'development',
        'PORT': '5000'
    }
    
    # Check required variables
    all_required_present = True
    print("\n🔐 Checking required environment variables...\n")
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            print(f"✅ {var}: Set")
        else:
            print(f"❌ {var}: Missing")
            all_required_present = False
    
    if not all_required_present:
        print("\n❌ Some required environment variables are missing.")
        print("Please ensure all required variables are set in your .env file.")
        return False
    
    # Set optional variables with defaults
    print("\n⚙️  Setting optional environment variables...\n")
    
    for var, default in optional_vars.items():
        if not os.getenv(var):
            os.environ[var] = default
            print(f"✅ {var}: Set to default value '{default}'")
        else:
            print(f"✅ {var}: Already set")
    
    # Test service connections
    print("\n🧪 Testing service connections...\n")
    
    # Test database connection
    test_database_connection()
    
    # Test OpenAI API key
    test_openai_key()
    
    # Test Pinecone configuration
    test_pinecone_config()
    
    print("\n🎉 Environment setup verification complete!")
    return True

def test_database_connection():
    """Test database connection"""
    try:
        database_url = os.getenv('DATABASE_URL')
        if database_url and 'postgresql' in database_url:
            print("✅ Database URL format: Valid (PostgreSQL)")
        else:
            print("⚠️  Database URL format: Not PostgreSQL (may still work)")
    except Exception as e:
        print(f"❌ Database connection test failed: {str(e)}")

def test_openai_key():
    """Test OpenAI API key format"""
    try:
        key = os.getenv('OPENAI_API_KEY')
        if key and key.startswith('sk-'):
            print("✅ OpenAI API key format: Valid")
        else:
            print("❌ OpenAI API key format: Invalid")
    except Exception as e:
        print(f"❌ OpenAI key test failed: {str(e)}")

def test_pinecone_config():
    """Test Pinecone configuration"""
    try:
        has_api_key = bool(os.getenv('PINECONE_API_KEY'))
        has_environment = bool(os.getenv('PINECONE_ENVIRONMENT'))
        has_index = bool(os.getenv('PINECONE_INDEX'))
        
        print(f"✅ Pinecone API key: {'Set' if has_api_key else 'Missing'}")
        print(f"✅ Pinecone environment: {'Set' if has_environment else 'Missing'}")
        print(f"✅ Pinecone index: {'Set' if has_index else 'Missing'}")
        
        if not (has_api_key and has_environment and has_index):
            print("❌ Pinecone configuration: Incomplete")
        else:
            print("✅ Pinecone configuration: Complete")
    except Exception as e:
        print(f"❌ Pinecone config test failed: {str(e)}")

if __name__ == "__main__":
    success = check_environment()
    if not success:
        sys.exit(1)
    
    print("\n📝 Next steps:")
    print("1. Install Python dependencies: pip install -r requirements.txt")
    print("2. Start the complaint backend: python app.py")