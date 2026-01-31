import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3, Globe, Play, Video, Brain, MessageSquare, Target, Clock, Users, FileText, Mic, MicOff } from 'lucide-react';
import { mockTranscribeAudio, type TranscriptionResult } from './mock-transcribe';

interface Transcript {
  id: string;
  speaker: string;
  text: string;
  timestamp: Date;
}

interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
}

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<Transcript[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [summary, setSummary] = useState('');
  const [metrics, setMetrics] = useState({
    accuracy: 99.9,
    meetingsAnalyzed: 10420,
    timeSaved: 85
  });

  const sampleTranscript: Transcript[] = [
    { id: '1', speaker: 'Sarah', text: 'Welcome everyone to today\'s product planning meeting.', timestamp: new Date() },
    { id: '2', speaker: 'John', text: 'I think we should focus on the user feedback from last quarter.', timestamp: new Date() },
    { id: '3', speaker: 'Sarah', text: 'Great point. Let\'s review the key pain points first.', timestamp: new Date() },
    { id: '4', speaker: 'Mike', text: 'The main issue seems to be with the onboarding flow.', timestamp: new Date() },
    { id: '5', speaker: 'John', text: 'I agree. We need to simplify the registration process.', timestamp: new Date() }
  ];

  const sampleActionItems: ActionItem[] = [
    { id: '1', text: 'Redesign user onboarding flow', assignee: 'Design Team', priority: 'high', dueDate: '2024-02-15' },
    { id: '2', text: 'Analyze user feedback data', assignee: 'John', priority: 'medium', dueDate: '2024-02-10' },
    { id: '3', text: 'Create implementation timeline', assignee: 'Sarah', priority: 'high', dueDate: '2024-02-08' }
  ];

  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsTranscribing(true);
    setTranscriptionResult(null);

    try {
      const result = await mockTranscribeAudio(file);
      setTranscriptionResult(result);
      
      // Convert transcription result to transcript format
      const lines = result.text.split('\n').filter(line => line.trim());
      const newTranscript: Transcript[] = lines.map((line, index) => ({
        id: `transcript_${index}`,
        speaker: result.speakers?.[0]?.name || 'Speaker',
        text: line.trim(),
        timestamp: new Date(Date.now() + index * 1000)
      }));
      
      setTranscript(newTranscript);
      
      // Generate action items from transcription
      const actionItems = extractActionItems(result.text);
      setActionItems(actionItems);
      
      // Generate summary
      setSummary(generateSummary(result.text));
      
    } catch (error) {
      console.error('Transcription failed:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const extractActionItems = (text: string): ActionItem[] => {
    const actionRegex = /(\d+\.\s*)(.+?)(?:\s*-\s*(.+?))?(?:\s*by\s*(.+?))?(?:\s*due\s*(.+?))?$/gim;
    const items: ActionItem[] = [];
    let match;

    while ((match = actionRegex.exec(text)) !== null) {
      items.push({
        id: `action_${items.length + 1}`,
        text: match[2]?.trim() || 'Action item',
        assignee: match[4]?.trim() || 'Unassigned',
        priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        dueDate: match[5]?.trim() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }

    // If no action items found, create some defaults
    if (items.length === 0) {
      items.push(
        {
          id: 'action_1',
          text: 'Review meeting notes and follow up on discussed topics',
          assignee: 'Team Lead',
          priority: 'high',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          id: 'action_2',
          text: 'Schedule follow-up meeting to review progress',
          assignee: 'Coordinator',
          priority: 'medium',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      );
    }

    return items;
  };

  const generateSummary = (text: string): string => {
    const sentences = text.split('.').filter(s => s.trim().length > 0);
    if (sentences.length === 0) return 'Meeting transcription completed.';
    
    return `Meeting covered key topics including ${sentences.slice(0, 3).join('. ').toLowerCase()}. Key discussions focused on important action items and next steps for the team.`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setTranscript(sampleTranscript);
    setActionItems(sampleActionItems);
    setSummary('The team discussed improving user onboarding based on Q4 feedback. Key focus areas include simplifying registration and addressing pain points in the current flow. Action items were assigned to redesign the onboarding experience.');
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return (
    <main className="min-h-screen bg-[#0A0E27] text-white overflow-hidden relative selection:bg-blue-500/30 font-sans">
      
      {/* 1. ATMOSPHERE (The "Enterprise" Glow) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* 2. NAVBAR (Floating Glass) */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-8 py-3 flex items-center gap-12 shadow-2xl">
          <div className="font-bold text-xl tracking-tighter bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            MeetingGPT
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            {['Product', 'Solutions', 'Enterprise', 'Pricing'].map((item) => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full text-sm font-medium transition-all border border-white/5">
            Sign In
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION (The Big Structure) */}
      <div className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          AI Transcription Engine
        </div>

        {/* HEADLINE */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent max-w-5xl">
          Intelligent Meeting Analysis
        </h1>

        {/* SUBTITLE */}
        <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Transform your meetings with AI-powered transcription, intelligent summaries, and actionable insights that drive productivity.
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-6 mb-20">
          <button 
            onClick={isRecording ? stopRecording : startRecording}
            className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-semibold text-lg transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] flex items-center gap-2"
          >
            {isRecording ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Demo
              </>
            )}
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold text-lg backdrop-blur-md transition-all flex items-center gap-2">
            <Video className="w-5 h-5" />
            Watch Demo
          </button>
        </div>

        {/* 4. THE METRIC GLASS BAR (The EnterpriseRAG Signature) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10">
            <div className="text-5xl font-bold text-white mb-2 tracking-tight">99.9%</div>
            <div className="text-sm font-medium text-blue-200/60 uppercase tracking-widest">Accuracy</div>
          </div>
          
          <div className="relative flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-white/10">
            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2 tracking-tight">10k+</div>
            <div className="text-sm font-medium text-blue-200/60 uppercase tracking-widest">Meetings</div>
          </div>
          
          <div className="relative flex flex-col items-center justify-center p-4">
            <div className="text-5xl font-bold text-white mb-2 tracking-tight">85%</div>
            <div className="text-sm font-medium text-blue-200/60 uppercase tracking-widest">Time Saved</div>
          </div>
        </div>

      </div>

      {/* 5. MEETING ANALYSIS DEMO */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Live Meeting Analysis
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience real-time transcription and intelligent meeting insights.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Transcription */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Live Transcription</h3>
              <div className="flex items-center gap-2">
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-sm text-red-400">Recording</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transcript.length === 0 ? (
                <div className="text-center py-12">
                  <Mic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {isRecording ? 'Listening for speech...' : 'Start recording to see transcription'}
                  </p>
                </div>
              ) : (
                transcript.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-blue-400">{item.speaker}</span>
                        <span className="text-xs text-gray-400">
                          {item.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-300">{item.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Items */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Action Items</h3>
              <Target className="w-5 h-5 text-orange-400" />
            </div>
            
            <div className="space-y-3">
              {actionItems.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  Action items will appear here
                </p>
              ) : (
                actionItems.map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                        item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-gray-400">{item.dueDate}</span>
                    </div>
                    <p className="text-sm text-white mb-2">{item.text}</p>
                    <p className="text-xs text-gray-400">Assigned to: {item.assignee}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AI Summary */}
        {summary && (
          <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">AI Summary</h3>
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-gray-300 leading-relaxed">{summary}</p>
          </div>
        )}
      </div>

      {/* 6. FEATURE GRID (Glassmorphism) */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Real-time Transcription</h3>
            <p className="text-gray-400 leading-relaxed">
              Get accurate, real-time transcription of your meetings with industry-leading accuracy.
            </p>
          </div>

          <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Smart Summaries</h3>
            <p className="text-gray-400 leading-relaxed">
              Intelligent summaries that capture key decisions, action items, and insights automatically.
            </p>
          </div>

          <div className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Action Item Extraction</h3>
            <p className="text-gray-400 leading-relaxed">
              Never miss a follow-up with automatic action item detection and assignment tracking.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
