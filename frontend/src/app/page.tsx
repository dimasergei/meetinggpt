import React from 'react';
import { ArrowRight, CheckCircle2, Zap, Shield, BarChart3, Globe, Play } from 'lucide-react';

export default function Home() {
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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in-up">
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
          <button className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-semibold text-lg transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] flex items-center gap-2">
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold text-lg backdrop-blur-md transition-all flex items-center gap-2">
            <Play className="w-5 h-5 fill-current" />
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

      {/* 5. FEATURE GRID (Glassmorphism) */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Enterprise Feature {i}</h3>
              <p className="text-gray-400 leading-relaxed">
                Advanced capabilities designed for scale. Full control over your data with granular permissions and audit logs.
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
