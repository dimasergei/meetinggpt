export interface TranscriptionResult {
  text: string;
  duration: number;
  confidence: number;
  speakers?: Array<{
    id: string;
    name: string;
    segments: Array<{
      start: number;
      end: number;
      text: string;
    }>;
  }>;
}

export async function transcribeAudio(audioFile: File): Promise<TranscriptionResult> {
  try {
    const formData = new FormData();
    formData.append('audio', audioFile);

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  }
}
