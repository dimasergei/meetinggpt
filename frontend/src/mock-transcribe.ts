import type { TranscriptionResult } from './api/transcribe';

export type { TranscriptionResult };

// Mock transcription for Vite SPA
export async function mockTranscribeAudio(audioFile: File): Promise<TranscriptionResult> {
  // Simulate processing time based on file size
  const processingTime = Math.min(5000, Math.max(2000, audioFile.size / 1000));
  await new Promise(resolve => setTimeout(resolve, processingTime));

  // Generate mock transcription based on file name and size
  const fileName = audioFile.name.toLowerCase();
  let mockText = '';
  
  if (fileName.includes('meeting') || fileName.includes('conference')) {
    mockText = `Good morning everyone, thank you for joining today's meeting. Let's start with the project updates.

    Sarah: The frontend development is progressing well. We've completed the user authentication module and are now working on the dashboard implementation. We should be ready for testing by next Friday.

    John: From the backend team, we've successfully integrated the payment gateway and are currently optimizing the database queries. Performance has improved by 40% since last week.

    Maria: Marketing has prepared the launch campaign materials. We have social media content ready and the email newsletter is scheduled for next Monday. Initial user feedback has been very positive.

    David: Customer support has reported a decrease in ticket volume by 25% after the last UI improvements. User satisfaction scores are at an all-time high of 4.7 out of 5.

    Action items:
    1. Complete frontend testing by Friday - Sarah
    2. Finalize API documentation - John  
    3. Schedule user acceptance testing - Maria
    4. Prepare analytics dashboard - David

    Our next meeting is scheduled for same time next week. Thank you all for your contributions.`;
  } else if (fileName.includes('interview') || fileName.includes('call')) {
    mockText = `Interviewer: Thank you for taking the time to speak with us today. Can you start by telling us about your experience with full-stack development?

    Candidate: Absolutely. I have about 5 years of experience working with modern JavaScript frameworks, particularly React and Node.js. In my current role, I lead a team of 3 developers and we've built several scalable applications serving thousands of users.

    Interviewer: That's impressive. Can you describe a challenging technical problem you've solved recently?

    Candidate: Certainly. We were facing performance issues with our real-time analytics dashboard. I implemented a WebSocket-based solution with data caching and lazy loading, which reduced the initial load time by 60% and improved the overall user experience significantly.

    Interviewer: How do you approach testing and code quality in your projects?

    Candidate: I'm a strong advocate for comprehensive testing. We use Jest for unit testing, Cypress for end-to-end testing, and maintain a code coverage of at least 85%. I also believe in code reviews and pair programming to maintain high quality standards.

    Interviewer: What interests you about this position specifically?

    Candidate: I'm particularly excited about the opportunity to work on AI-powered features and the scale of your platform. The technical challenges you're solving align perfectly with my experience and interests.

    Interviewer: Excellent. Do you have any questions for us?

    Candidate: Yes, I'd love to know more about the team structure and the current technical roadmap for the next 6 months.

    This concludes our interview. We'll be in touch within the week with next steps.`;
  } else {
    mockText = `Welcome to this audio transcription. This is a sample transcription generated to demonstrate the meeting intelligence capabilities.

    The system has processed your audio file and converted it to text using advanced speech recognition technology. The transcription includes speaker identification and timestamp information for easy reference.

    Key features demonstrated:
    - High accuracy speech-to-text conversion
    - Speaker diarization and identification
    - Real-time processing capabilities
    - Multi-language support
    - Custom vocabulary integration

    This mock transcription shows how the system would handle various types of audio content, including meetings, interviews, lectures, and conversations. The actual implementation would use Groq's Whisper-large-v3 model for production-grade accuracy.

    Thank you for testing the MeetingGPT transcription service.`;
  }

  return {
    text: mockText,
    duration: processingTime / 1000,
    confidence: 0.92 + Math.random() * 0.07,
    speakers: [
      {
        id: 'speaker_1',
        name: 'Speaker 1',
        segments: [
          {
            start: 0,
            end: 30,
            text: mockText.split('\n\n')[0] || 'Initial segment'
          }
        ]
      }
    ]
  };
}
