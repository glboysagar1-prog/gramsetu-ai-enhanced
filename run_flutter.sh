#!/bin/bash

# GramSetu AI - Flutter App Runner
# Quick start script for the Flutter mobile app

echo "🚀 Starting GramSetu AI Flutter App..."
echo "====================================="

# Check if Flutter is installed
if ! command -v flutter &> /dev/null; then
    echo "❌ Flutter is not installed. Please install Flutter SDK."
    echo "   Visit: https://flutter.dev/docs/get-started/install"
    exit 1
fi

# Check Flutter version
flutter_version=$(flutter --version | head -n 1)
echo "✅ $flutter_version detected"

# Check if we're in a Flutter project
if [ ! -f "pubspec.yaml" ]; then
    echo "❌ Not in a Flutter project directory"
    exit 1
fi

# Get dependencies
echo "📦 Getting Flutter dependencies..."
flutter pub get

# Check for connected devices
echo "🔍 Checking for connected devices..."
flutter devices

# Ask user to choose device
echo ""
echo "Available options:"
echo "1. Run on connected device/emulator"
echo "2. Run on web browser"
echo "3. Run on desktop (if supported)"
echo ""

read -p "Choose option (1-3): " choice

case $choice in
    1)
        echo "📱 Running on connected device/emulator..."
        flutter run
        ;;
    2)
        echo "🌐 Running on web browser..."
        flutter run -d chrome
        ;;
    3)
        echo "🖥️ Running on desktop..."
        flutter run -d macos
        ;;
    *)
        echo "❌ Invalid option. Running on default device..."
        flutter run
        ;;
esac


