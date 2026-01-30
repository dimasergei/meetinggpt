import asyncio
import uuid
from typing import Dict, List, Any, Optional
import redis.asyncio as redis
import structlog
from datetime import datetime
from enum import Enum

from src.processing.transcriber import MeetingTranscriber
from src.processing.meeting_analyzer import MeetingAnalyzer
from src.core.config import get_settings
from src.core.exceptions import TranscriptionException, AnalysisException

logger = structlog.get_logger()
settings = get_settings()

class ProcessingStage(Enum):
    """Processing stages for meeting analysis"""
    UPLOADED = "uploaded"
    TRANSCRIBING = "transcribing"
    ANALYZING = "analyzing"
    COMPLETED = "completed"
    FAILED = "failed"

class AsyncMeetingProcessor:
    """
    Enterprise multi-stage async meeting processor
    
    - Preserves existing transcription and analysis logic
    - Adds real-time status updates via Redis
    - Implements proper error handling and timeouts
    - Provides detailed progress tracking
    """
    
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.transcriber = MeetingTranscriber(settings.OPENAI_API_KEY)
        self.analyzer = MeetingAnalyzer()
        self.active_jobs = {}
    
    async def start_processing(self, audio_path: str, meeting_title: str = None) -> str:
        """
        Start async meeting processing
        
        Args:
            audio_path: Path to audio file
            meeting_title: Optional meeting title
            
        Returns:
            Job ID for tracking
        """
        job_id = str(uuid.uuid4())
        
        # Initialize job status
        job_status = {
            "job_id": job_id,
            "stage": ProcessingStage.UPLOADED.value,
            "progress": 0,
            "started_at": datetime.utcnow().isoformat(),
            "meeting_title": meeting_title or f"Meeting {job_id[:8]}",
            "audio_path": audio_path,
            "error": None,
            "result": None,
            "estimated_duration": self._estimate_processing_duration(audio_path)
        }
        
        # Store job status
        await self._update_job_status(job_id, job_status)
        
        # Start async processing
        asyncio.create_task(self._process_meeting(job_id, audio_path))
        
        logger.info("meeting_processing_started", job_id=job_id, audio_path=audio_path)
        
        return job_id
    
    async def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get current job status"""
        try:
            status_data = await self.redis.get(f"job:{job_id}")
            if status_data:
                import json
                return json.loads(status_data)
            return None
        except Exception as e:
            logger.error("job_status_retrieval_failed", job_id=job_id, error=str(e))
            return None
    
    async def get_all_jobs(self) -> List[Dict[str, Any]]:
        """Get all job statuses"""
        try:
            job_keys = await self.redis.keys("job:*")
            jobs = []
            
            for key in job_keys:
                job_id = key.decode().split(":")[1]
                status = await self.get_job_status(job_id)
                if status:
                    jobs.append(status)
            
            # Sort by started_at (newest first)
            jobs.sort(key=lambda x: x.get("started_at", ""), reverse=True)
            return jobs
            
        except Exception as e:
            logger.error("all_jobs_retrieval_failed", error=str(e))
            return []
    
    async def _process_meeting(self, job_id: str, audio_path: str):
        """Process meeting through all stages"""
        try:
            # Stage 1: Transcription
            await self._update_stage(job_id, ProcessingStage.TRANSCRIBING, 10)
            transcript_result = await self._transcribe_audio(job_id, audio_path)
            
            # Stage 2: Analysis
            await self._update_stage(job_id, ProcessingStage.ANALYZING, 60)
            analysis_result = await self._analyze_transcript(job_id, transcript_result)
            
            # Stage 3: Completion
            await self._update_stage(job_id, ProcessingStage.COMPLETED, 100)
            
            # Store final result
            final_result = {
                "transcript": transcript_result["transcript"],
                "segments": transcript_result["segments"],
                "analysis": analysis_result,
                "processed_at": datetime.utcnow().isoformat(),
                "processing_time": self._calculate_processing_time(job_id)
            }
            
            await self._store_final_result(job_id, final_result)
            
            logger.info("meeting_processing_completed", job_id=job_id)
            
        except Exception as e:
            logger.error("meeting_processing_failed", job_id=job_id, error=str(e))
            await self._update_stage(job_id, ProcessingStage.FAILED, 0, str(e))
    
    async def _transcribe_audio(self, job_id: str, audio_path: str) -> Dict[str, Any]:
        """Transcribe audio with progress updates"""
        try:
            # Update progress during transcription
            await self._update_progress(job_id, 20, "Starting transcription...")
            
            # Perform transcription (preserving existing logic)
            result = await self.transcriber.transcribe(audio_path)
            
            await self._update_progress(job_id, 50, "Transcription completed")
            
            return result
            
        except Exception as e:
            raise TranscriptionException(f"Transcription failed: {str(e)}")
    
    async def _analyze_transcript(self, job_id: str, transcript_result: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze transcript with progress updates"""
        try:
            # Update progress during analysis
            await self._update_progress(job_id, 70, "Starting analysis...")
            
            # Perform analysis (preserving existing logic)
            result = await self.analyzer.analyze(transcript_result["transcript"])
            
            await self._update_progress(job_id, 90, "Analysis completed")
            
            return result
            
        except Exception as e:
            raise AnalysisException(f"Analysis failed: {str(e)}")
    
    async def _update_stage(self, job_id: str, stage: ProcessingStage, progress: int, error: str = None):
        """Update job stage"""
        try:
            current_status = await self.get_job_status(job_id) or {}
            
            current_status.update({
                "stage": stage.value,
                "progress": progress,
                "updated_at": datetime.utcnow().isoformat(),
                "error": error
            })
            
            if error:
                current_status["failed_at"] = datetime.utcnow().isoformat()
            
            await self._update_job_status(job_id, current_status)
            
            # Broadcast update via pub/sub
            await self._broadcast_status_update(job_id, current_status)
            
        except Exception as e:
            logger.error("stage_update_failed", job_id=job_id, error=str(e))
    
    async def _update_progress(self, job_id: str, progress: int, message: str):
        """Update progress within current stage"""
        try:
            current_status = await self.get_job_status(job_id) or {}
            
            current_status.update({
                "progress": progress,
                "status_message": message,
                "updated_at": datetime.utcnow().isoformat()
            })
            
            await self._update_job_status(job_id, current_status)
            
            # Broadcast update via pub/sub
            await self._broadcast_status_update(job_id, current_status)
            
        except Exception as e:
            logger.error("progress_update_failed", job_id=job_id, error=str(e))
    
    async def _update_job_status(self, job_id: str, status: Dict[str, Any]):
        """Store job status in Redis"""
        try:
            import json
            await self.redis.setex(
                f"job:{job_id}",
                86400 * 7,  # Keep for 7 days
                json.dumps(status)
            )
        except Exception as e:
            logger.error("job_status_update_failed", job_id=job_id, error=str(e))
    
    async def _store_final_result(self, job_id: str, result: Dict[str, Any]):
        """Store final processing result"""
        try:
            import json
            await self.redis.setex(
                f"result:{job_id}",
                86400 * 30,  # Keep for 30 days
                json.dumps(result)
            )
            
            # Update job status with result reference
            current_status = await self.get_job_status(job_id) or {}
            current_status["result"] = f"result:{job_id}"
            current_status["completed_at"] = datetime.utcnow().isoformat()
            await self._update_job_status(job_id, current_status)
            
        except Exception as e:
            logger.error("final_result_storage_failed", job_id=job_id, error=str(e))
    
    async def _broadcast_status_update(self, job_id: str, status: Dict[str, Any]):
        """Broadcast status update via Redis pub/sub"""
        try:
            import json
            message = {
                "type": "status_update",
                "job_id": job_id,
                "status": status,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            await self.redis.publish("meeting_updates", json.dumps(message))
            
        except Exception as e:
            logger.error("status_broadcast_failed", job_id=job_id, error=str(e))
    
    async def get_result(self, job_id: str) -> Optional[Dict[str, Any]]:
        """Get final processing result"""
        try:
            result_data = await self.redis.get(f"result:{job_id}")
            if result_data:
                import json
                return json.loads(result_data)
            return None
        except Exception as e:
            logger.error("result_retrieval_failed", job_id=job_id, error=str(e))
            return None
    
    def _estimate_processing_duration(self, audio_path: str) -> int:
        """Estimate processing duration in seconds"""
        try:
            import os
            file_size = os.path.getsize(audio_path)
            
            # Rough estimation: 1MB = ~2 minutes of processing
            estimated_seconds = (file_size / (1024 * 1024)) * 120
            
            # Add buffer time
            return int(estimated_seconds + 60)
            
        except Exception:
            return 300  # Default 5 minutes
    
    def _calculate_processing_time(self, job_id: str) -> float:
        """Calculate total processing time"""
        try:
            status = self.active_jobs.get(job_id, {})
            if "started_at" in status:
                start_time = datetime.fromisoformat(status["started_at"])
                end_time = datetime.utcnow()
                return (end_time - start_time).total_seconds()
            return 0.0
        except Exception:
            return 0.0
    
    async def cancel_job(self, job_id: str) -> bool:
        """Cancel a processing job"""
        try:
            current_status = await self.get_job_status(job_id)
            if not current_status:
                return False
            
            if current_status["stage"] in [ProcessingStage.COMPLETED.value, ProcessingStage.FAILED.value]:
                return False  # Cannot cancel completed/failed jobs
            
            # Update status to cancelled
            await self._update_stage(job_id, ProcessingStage.FAILED, 0, "Job cancelled by user")
            
            logger.info("job_cancelled", job_id=job_id)
            return True
            
        except Exception as e:
            logger.error("job_cancellation_failed", job_id=job_id, error=str(e))
            return False
    
    async def cleanup_old_jobs(self, days: int = 7):
        """Clean up old job data"""
        try:
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            # Get all jobs
            jobs = await self.get_all_jobs()
            
            cleaned_count = 0
            for job in jobs:
                try:
                    started_at = datetime.fromisoformat(job.get("started_at", ""))
                    if started_at < cutoff_date:
                        # Delete job status and result
                        await self.redis.delete(f"job:{job['job_id']}")
                        await self.redis.delete(f"result:{job['job_id']}")
                        cleaned_count += 1
                except Exception:
                    continue
            
            logger.info("old_jobs_cleaned", count=cleaned_count, days=days)
            
        except Exception as e:
            logger.error("job_cleanup_failed", error=str(e))
