import httpx
from typing import List, Dict

class MeetingTranscriber:
    """
    Transcribe audio with speaker diarization
    
    Uses OpenAI Whisper + pyannote for speakers
    """
    
    def __init__(self, openai_api_key: str):
        self.api_key = openai_api_key
    
    async def transcribe(self, audio_path: str) -> Dict:
        """
        Transcribe meeting audio
        
        Returns:
            {
                "transcript": "full text",
                "segments": [
                    {"speaker": "Speaker 1", "text": "...", "timestamp": "0:00"}
                ]
            }
        """
        # 1. Transcribe with Whisper
        async with httpx.AsyncClient() as client:
            with open(audio_path, "rb") as f:
                response = await client.post(
                    "https://api.openai.com/v1/audio/transcriptions",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    files={"file": f},
                    data={"model": "whisper-1", "response_format": "verbose_json"},
                )
        
        data = response.json()
        
        # 2. Add speaker labels (simplified - use pyannote in production)
        segments = self._add_speakers(data["segments"])
        
        return {
            "transcript": data["text"],
            "segments": segments,
        }
    
    def _add_speakers(self, segments: List[Dict]) -> List[Dict]:
        """Add speaker labels to segments"""
        # In production, use pyannote.audio for diarization
        # This is simplified for demo
        return [
            {
                **seg,
                "speaker": f"Speaker {(i % 3) + 1}",
            }
            for i, seg in enumerate(segments)
        ]
