'use client'

import { useState, useEffect } from 'react'
import AuthComponent from '@/components/AuthComponent'
import ChatInterface from '@/components/ChatInterface'
import { useSocket } from '@/hooks/useSocket'
import { User } from '@/types'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const socket = useSocket()

  useEffect(() => {
    // Check if user is already authenticated
    const savedUser = localStorage.getItem('unipi-chat-user')
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Failed to parse saved user:', error)
        localStorage.removeItem('unipi-chat-user')
      }
    }
  }, [])

  const handleAuthSuccess = (userData: User) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('unipi-chat-user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('unipi-chat-user')
    if (socket) {
      socket.disconnect()
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            UniPi Chat 🎓
          </h1>
          <p className="text-gray-600 text-lg">
            Private video chat for University of Pisa students
          </p>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              🔒 <strong>Anonymous & Secure</strong> - Only verified @studenti.unipi.it emails allowed
            </p>
          </div>
        </div>

        {/* Main Content */}
        {!isAuthenticated ? (
          <AuthComponent onAuthSuccess={handleAuthSuccess} />
        ) : (
          <ChatInterface 
            user={user} 
            socket={socket} 
            onLogout={handleLogout}
          />
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Made with ❤️ for University of Pisa students | 
            <span className="ml-2">Privacy-first • GDPR compliant</span>
          </p>
        </div>
      </div>
    </main>
  )
}
