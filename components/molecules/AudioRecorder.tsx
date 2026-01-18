"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Mic, Square, Loader2 } from "lucide-react"

interface AudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = React.useState(false)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [timer, setTimer] = React.useState(0)
  
  // Simulation refs
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = () => {
    setIsRecording(true)
    setTimer(0)
    
    // Simulate recording timer
    intervalRef.current = setInterval(() => {
      setTimer(prev => prev + 1)
    }, 1000)
  }

  const stopRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    setIsRecording(false)
    setIsProcessing(true)
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      // Return a dummy blob for now since this is UI only
      if (onRecordingComplete) {
        onRecordingComplete(new Blob([], { type: 'audio/webm' }))
      }
    }, 1500)
  }

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 border-2 border-dashed rounded-xl bg-slate-50 dark:bg-slate-900/50">
      
      {/* Visualizer Placeholder */}
      <div className="h-16 flex items-end justify-center space-x-1">
        {isRecording ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i}
              className="w-1.5 bg-primary rounded-full animate-pulse"
              style={{ 
                height: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s` 
              }}
            />
          ))
        ) : (
          <div className="text-muted-foreground text-sm font-medium">
            {isProcessing ? "Processing audio..." : "Tap microphone to record"}
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="text-3xl font-mono font-bold tabular-nums tracking-wider text-slate-700 dark:text-slate-200">
        {formatTime(timer)}
      </div>

      {/* Control Button */}
      <Button
        size="lg"
        variant={isRecording ? "destructive" : "default"}
        className={`h-16 w-16 rounded-full shadow-lg transition-all duration-200 ${
          isRecording ? "scale-110 ring-4 ring-red-500/20" : "hover:scale-105"
        }`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="h-8 w-8 animate-spin" />
        ) : isRecording ? (
          <Square className="h-6 w-6 fill-current" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground">
        {isRecording ? "Recording in progress..." : "Maximum duration: 2 minutes"}
      </p>
    </div>
  )
}
