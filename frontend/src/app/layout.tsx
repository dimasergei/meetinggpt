import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const fontBody = Inter({ subsets: ['latin'], variable: '--font-body' })
const fontMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'MeetingGPT - AI-Powered Meeting Intelligence',
  description: 'Transform your meetings into actionable insights with AI-powered transcription and analysis.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${fontBody.className} ${fontBody.variable} ${fontMono.variable} bg-[#0A0E27] text-white overflow-x-hidden`}>{children}</body>
    </html>
  )
}
