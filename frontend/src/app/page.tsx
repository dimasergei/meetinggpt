'use client'

import { motion } from 'framer-motion'
import { Zap, Brain, MessageSquare, Target } from 'lucide-react'

export default function MeetingGPT() {
  return (
    <main className="min-h-screen bg-[#0A0E27] text-white overflow-hidden relative selection:bg-blue-500/30">
      {/* 1. Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f6,transparent)] opacity-20" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      </div>

      {/* 2. Floating Navbar */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/5 backdrop-blur-lg border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl">
        <span className="font-bold text-lg tracking-tight">MeetingGPT</span>
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="#" className="hover:text-white transition">Features</a>
          <a href="#" className="hover:text-white transition">Pricing</a>
        </div>
        <button className="bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full text-sm transition">Sign In</button>
      </nav>

      {/* 3. Hero Section (Centered) */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center z-10">
        {/* Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8 animate-fade-in-up"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Powered by Advanced AI
        </motion.div>
        
        {/* H1 Headline - HUGE */}
        <motion.h1 
          className="text-7xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Intelligent Meeting Analysis
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Transform your meetings with AI-powered transcription, intelligent summaries, and actionable insights.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
            Start Free Trial
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold backdrop-blur transition-all">
            View Documentation
          </button>
        </motion.div>

        {/* 4. The "EnterpriseRAG" Metric Bar (Floating Glass) */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {/* Metric 1 */}
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">99.9%</div>
            <div className="text-sm text-blue-200/60 uppercase tracking-wider">Transcription Accuracy</div>
          </div>
          {/* Metric 2 */}
          <div className="text-center border-x border-white/5">
            <div className="text-4xl font-bold text-blue-400 mb-1">10k+</div>
            <div className="text-sm text-blue-200/60 uppercase tracking-wider">Meetings Analyzed</div>
          </div>
          {/* Metric 3 */}
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">85%</div>
            <div className="text-sm text-blue-200/60 uppercase tracking-wider">Time Saved</div>
          </div>
        </motion.div>
      </section>

      {/* 5. Feature Grid (Below Hero) */}
      <section className="px-6 max-w-7xl mx-auto pb-24 grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Zap,
            title: "Real-time Transcription",
            description: "Get accurate, real-time transcription of your meetings with industry-leading accuracy and speed."
          },
          {
            icon: Brain,
            title: "Smart Summaries",
            description: "Intelligent summaries that capture key decisions, action items, and insights automatically."
          },
          {
            icon: Target,
            title: "Action Item Extraction",
            description: "Never miss a follow-up with automatic action item detection and assignment tracking."
          }
        ].map((feature, i) => (
          <motion.div 
            key={i} 
            className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 + i * 0.1 }}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </section>
    </main>
  )
}
