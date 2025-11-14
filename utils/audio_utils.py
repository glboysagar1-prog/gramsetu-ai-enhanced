"""
GramSetu AI - Audio Utilities
Helper functions for audio file handling and validation
"""

import os
import mimetypes
from pathlib import Path
from typing import Tuple, Optional
import logging

logger = logging.getLogger(__name__)


def validate_audio_format(file_path: str) -> Tuple[bool, str]:
    """
    Validate if file is a valid audio format
    
    Args:
        file_path: Path to the audio file
    
    Returns:
        Tuple of (is_valid, message)
    """
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            return False, "File not found"
        
        # Get file extension
        extension = Path(file_path).suffix.lower()
        
        # Supported audio formats
        audio_extensions = ['.wav', '.mp3', '.ogg', '.m4a', '.flac', '.webm', '.aac']
        
        if extension not in audio_extensions:
            return False, f"Unsupported format: {extension}"
        
        # Check MIME type
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type and not mime_type.startswith('audio/'):
            return False, f"Invalid MIME type: {mime_type}"
        
        return True, "Valid audio file"
        
    except Exception as e:
        return False, f"Validation error: {str(e)}"


def get_audio_info(file_path: str) -> dict:
    """
    Get audio file metadata
    
    Args:
        file_path: Path to the audio file
    
    Returns:
        Dictionary with audio metadata
    """
    try:
        from pydub import AudioSegment
        
        audio = AudioSegment.from_file(file_path)
        
        return {
            'duration_seconds': len(audio) / 1000,
            'channels': audio.channels,
            'sample_rate': audio.frame_rate,
            'sample_width': audio.sample_width,
            'file_size_bytes': os.path.getsize(file_path),
            'format': Path(file_path).suffix.lstrip('.')
        }
        
    except Exception as e:
        logger.error(f"Error getting audio info: {str(e)}")
        return {}


def convert_to_wav(input_path: str, output_path: Optional[str] = None) -> str:
    """
    Convert audio file to WAV format
    
    Args:
        input_path: Path to input audio file
        output_path: Optional output path (auto-generated if None)
    
    Returns:
        Path to WAV file
    """
    try:
        from pydub import AudioSegment
        
        # Load audio
        audio = AudioSegment.from_file(input_path)
        
        # Generate output path if not provided
        if output_path is None:
            output_path = str(Path(input_path).with_suffix('.wav'))
        
        # Export as WAV
        audio.export(output_path, format='wav')
        
        logger.info(f"Converted {input_path} to {output_path}")
        return output_path
        
    except Exception as e:
        logger.error(f"Conversion error: {str(e)}")
        raise


def estimate_transcription_time(file_path: str) -> float:
    """
    Estimate time required for transcription
    
    Args:
        file_path: Path to audio file
    
    Returns:
        Estimated time in seconds
    """
    try:
        info = get_audio_info(file_path)
        duration = info.get('duration_seconds', 0)
        
        # Whisper typically processes at ~0.3x real-time on CPU
        # So 10 seconds of audio takes ~3 seconds to process
        estimated_time = duration * 0.3
        
        return max(estimated_time, 1.0)  # Minimum 1 second
        
    except Exception as e:
        logger.error(f"Estimation error: {str(e)}")
        return 10.0  # Default estimate


def cleanup_temp_files(directory: str, max_age_hours: int = 24):
    """
    Clean up old temporary audio files
    
    Args:
        directory: Directory to clean
        max_age_hours: Maximum age of files to keep (in hours)
    """
    try:
        import time
        
        if not os.path.exists(directory):
            return
        
        current_time = time.time()
        max_age_seconds = max_age_hours * 3600
        
        for filename in os.listdir(directory):
            file_path = os.path.join(directory, filename)
            
            if os.path.isfile(file_path):
                file_age = current_time - os.path.getmtime(file_path)
                
                if file_age > max_age_seconds:
                    try:
                        os.remove(file_path)
                        logger.info(f"Removed old temp file: {filename}")
                    except Exception as e:
                        logger.warning(f"Failed to remove {filename}: {e}")
        
    except Exception as e:
        logger.error(f"Cleanup error: {str(e)}")
