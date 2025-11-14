#!/bin/bash

# GramSetu AI - Voice Complaint Module Setup Script

echo "=========================================="
echo "GramSetu AI - Voice Module Setup"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Python version
echo "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"
echo ""

# Check if FFmpeg is installed
echo "Checking FFmpeg installation..."
if command -v ffmpeg &> /dev/null
then
    ffmpeg_version=$(ffmpeg -version 2>&1 | head -n 1)
    echo -e "${GREEN}✓ FFmpeg is installed${NC}"
    echo "  $ffmpeg_version"
else
    echo -e "${RED}✗ FFmpeg is not installed${NC}"
    echo ""
    echo "Please install FFmpeg:"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "  brew install ffmpeg"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "  sudo apt-get install ffmpeg"
    else
        echo "  Download from: https://ffmpeg.org/download.html"
    fi
    
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        exit 1
    fi
fi

echo ""

# Create necessary directories
echo "Creating directories..."
mkdir -p uploads/audio
mkdir -p logs
echo "✓ Directories created"
echo ""

# Install Python dependencies
echo "Installing Python dependencies..."
echo "This may take a few minutes..."
echo ""

pip3 install -r requirements.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
fi

echo ""

# Download Whisper model (optional, will auto-download on first use)
echo "=========================================="
echo "Whisper Model Setup"
echo "=========================================="
echo ""
echo "Whisper models will be automatically downloaded on first use."
echo "You can pre-download them now (recommended) or skip this step."
echo ""
echo "Available models:"
echo "  1. tiny   (39M)  - Fastest, least accurate"
echo "  2. base   (74M)  - Good balance (recommended)"
echo "  3. small  (244M) - Better accuracy"
echo "  4. medium (769M) - Very good (requires GPU)"
echo "  5. large  (1.5G) - Best quality (requires GPU)"
echo "  6. Skip pre-download"
echo ""

read -p "Select model to download (1-6): " model_choice

case $model_choice in
    1) model_size="tiny" ;;
    2) model_size="base" ;;
    3) model_size="small" ;;
    4) model_size="medium" ;;
    5) model_size="large" ;;
    6) 
        echo "Skipping pre-download"
        model_size=""
        ;;
    *) 
        echo "Invalid choice, using 'base' model"
        model_size="base"
        ;;
esac

if [ ! -z "$model_size" ]; then
    echo ""
    echo "Downloading Whisper model: $model_size"
    echo "This may take a few minutes depending on your internet connection..."
    
    python3 -c "import whisper; whisper.load_model('$model_size')"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Model downloaded successfully${NC}"
    else
        echo -e "${YELLOW}⚠ Model download failed, but will retry on first use${NC}"
    fi
fi

echo ""

# Test installation
echo "=========================================="
echo "Testing Installation"
echo "=========================================="
echo ""

python3 -c "
try:
    import flask
    import whisper
    import pydub
    import speech_recognition
    import langdetect
    print('✓ All core modules imported successfully')
except ImportError as e:
    print(f'✗ Import error: {e}')
    exit(1)
"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Installation test passed${NC}"
else
    echo -e "${RED}✗ Installation test failed${NC}"
    exit 1
fi

echo ""

# Create .env file (optional)
echo "=========================================="
echo "Configuration"
echo "=========================================="
echo ""

if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# GramSetu AI - Voice Module Configuration

# Whisper model size (tiny, base, small, medium, large)
WHISPER_MODEL_SIZE=${model_size:-base}

# Upload settings
UPLOAD_FOLDER=uploads/audio
MAX_AUDIO_SIZE=10485760

# API settings
API_HOST=0.0.0.0
API_PORT=5000

# Logging
LOG_LEVEL=INFO
VOICE_LOG_LEVEL=INFO
EOF
    echo "✓ .env file created"
else
    echo "⚠ .env file already exists, skipping"
fi

echo ""

# Summary
echo "=========================================="
echo "Setup Complete! 🎉"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start the server:"
echo "   python3 app.py"
echo ""
echo "2. Test the voice module:"
echo "   python3 test_voice_complaint.py"
echo ""
echo "3. Read the documentation:"
echo "   cat VOICE_MODULE_README.md"
echo ""
echo "4. API will be available at:"
echo "   http://localhost:5000/api/v1/voice/upload"
echo ""
echo "=========================================="
echo ""

# Offer to start the server
read -p "Start the server now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "Starting GramSetu AI server..."
    echo ""
    python3 app.py
fi
