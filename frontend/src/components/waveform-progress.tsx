'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WaveformProgressProps {
  isRecording: boolean
  duration: number
  currentTime: number
  className?: string
}

export function WaveformProgress({ 
  isRecording, 
  duration, 
  currentTime, 
  className 
}: WaveformProgressProps) {
  const [waveformData, setWaveformData] = useState<number[]>([])
  const [audioLevel, setAudioLevel] = useState(0)

  useEffect(() => {
    if (!isRecording) {
      setWaveformData([])
      setAudioLevel(0)
      return
    }

    const interval = setInterval(() => {
      // Generate realistic waveform data
      const newData = Array.from({ length: 50 }, () => {
        const base = Math.random() * 30 + 10
        const variation = Math.sin(Date.now() * 0.001) * 20
        return Math.max(5, Math.min(95, base + variation))
      })
      setWaveformData(newData)
      
      // Simulate audio level changes
      setAudioLevel(Math.random() * 80 + 20)
    }, 50)

    return () => clearInterval(interval)
  }, [isRecording])

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className={cn("relative w-full h-32 bg-muted/20 rounded-lg overflow-hidden", className)}>
      {/* Background grid */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="w-0.5 h-16 bg-muted/40 mx-px"
          />
        ))}
      </div>

      {/* Waveform */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-end h-full w-full px-2">
          {waveformData.map((height, index) => (
            <motion.div
              key={index}
              className="w-1 bg-gradient-to-t from-primary/60 to-primary mx-px rounded-t-full"
              style={{ height: `${height}%` }}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Audio level indicator */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 h-3 rounded-full transition-all duration-150",
                  audioLevel > (i + 1) * 20 ? "bg-primary" : "bg-muted/40"
                )}
              />
            ))}
          </div>
          <Volume2 className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Recording indicator */}
      {isRecording && (
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <motion.div
            className="w-3 h-3 bg-red-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          <span className="text-sm text-red-400 font-medium">Recording</span>
        </div>
      )}

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/40">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Time display */}
      {duration > 0 && (
        <div className="absolute bottom-4 left-4 text-xs text-muted-foreground">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      )}
    </div>
  )
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
