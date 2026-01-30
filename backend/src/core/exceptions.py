from typing import Any, Dict, Optional
from fastapi import HTTPException, status
import structlog

logger = structlog.get_logger()

class MeetingGPTException(Exception):
    """Base exception for MeetingGPT"""
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        self.message = message
        self.details = details or {}
        super().__init__(message)

class TranscriptionException(MeetingGPTException):
    """Raised when transcription fails"""
    pass

class AnalysisException(MeetingGPTException):
    """Raised when meeting analysis fails"""
    pass

class ValidationException(MeetingGPTException):
    """Raised when input validation fails"""
    pass

class RateLimitException(MeetingGPTException):
    """Raised when rate limit is exceeded"""
    pass

def create_http_exception(
    status_code: int,
    detail: str,
    headers: Optional[Dict[str, str]] = None
) -> HTTPException:
    """Create standardized HTTP exception"""
    logger.error(
        "http_exception",
        status_code=status_code,
        detail=detail,
        headers=headers
    )
    return HTTPException(status_code=status_code, detail=detail, headers=headers)
