import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YouTube Analytics Pro - Analisa Channel & Video YouTube',
  description: 'Platform analitik YouTube lengkap untuk menganalisa performa channel, video, trending, SEO, dan kompetitor',
  keywords: 'youtube analytics, youtube statistics, video analysis, channel analytics, youtube seo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
