import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UniPi Chat - Private Student Video Chat',
  description: 'Anonymous video chat platform for University of Pisa students',
  keywords: ['university', 'pisa', 'chat', 'video', 'students', 'anonymous'],
  authors: [{ name: 'UniPi Chat Team' }],
  robots: 'noindex, nofollow', // Keep private
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  )
}
