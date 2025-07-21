'use client'

import { useState } from 'react'
import { User } from '@/types'

interface AuthComponentProps {
  onAuthSuccess: (user: User) => void
}

export default function AuthComponent({ onAuthSuccess }: AuthComponentProps) {
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'verification'>('email')
  const [error, setError] = useState('')

  const validateEmail = (email: string): boolean => {
    const unipiRegex = /^[a-zA-Z0-9._%+-]+@studenti\.unipi\.it$/
    return unipiRegex.test(email)
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateEmail(email)) {
      setError('Please use a valid @studenti.unipi.it email address')
      return
    }

    setIsLoading(true)

    try {
      // Hardcode backend URL for testing
      const backendUrl = 'https://unipi-chat-app-production.up.railway.app'
      console.log('Backend URL:', backendUrl) // Debug log
      const apiUrl = `${backendUrl}/api/auth/send-verification`
      console.log('Full API URL:', apiUrl) // Debug log
      console.log('Sending request with email:', email) // Debug log
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit', // Try without credentials first
        body: JSON.stringify({ email })
      })

      console.log('Response status:', response.status) // Debug log
      console.log('Response headers:', response.headers) // Debug log

      if (response.ok) {
        const data = await response.json()
        console.log('Success response:', data) // Debug log
        setStep('verification')
      } else {
        const data = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.log('Error response:', data) // Debug log
        setError(data.message || 'Failed to send verification email')
      }
    } catch (error) {
      console.error('Network error details:', error) // Debug log
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!verificationCode.trim()) {
      setError('Please enter the verification code')
      return
    }

    setIsLoading(true)

    try {
      // Hardcode backend URL for testing
      const backendUrl = 'https://unipi-chat-app-production.up.railway.app'
      const apiUrl = `${backendUrl}/api/auth/verify-code`
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit', // Try without credentials first
        body: JSON.stringify({ email, code: verificationCode })
      })

      console.log('Verification response status:', response.status) // Debug log

      if (response.ok) {
        const userData = await response.json()
        console.log('Verification success:', userData) // Debug log
        
        // Create user object
        const user: User = {
          id: userData.userId || Math.random().toString(36).substr(2, 9),
          email: email,
          isVerified: true,
          anonymousName: `Student ${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
          createdAt: new Date()
        }

        onAuthSuccess(user)
      } else {
        const data = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.log('Verification error:', data) // Debug log
        setError(data.message || 'Invalid verification code')
      }
    } catch (error) {
      console.error('Verification network error:', error) // Debug log
      setError('Network error. Please try again.')
      
      // For demo purposes, simulate successful verification if needed
      // Uncomment the following lines if you want to skip verification for testing:
      /*
      console.warn('Simulating successful verification for demo')
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        email: email,
        isVerified: true,
        anonymousName: `Student ${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        createdAt: new Date()
      }
      onAuthSuccess(user)
      */
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {step === 'email' ? 'Verify Your UniPi Email' : 'Enter Verification Code'}
          </h2>
          <p className="text-gray-600 mt-2">
            {step === 'email' 
              ? 'Only verified University of Pisa students can access this chat'
              : `We sent a verification code to ${email}`
            }
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                University Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@studenti.unipi.it"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending verification...
                </span>
              ) : (
                'Send Verification Code'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerificationSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                disabled={isLoading}
                maxLength={6}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to our privacy policy and terms of service.
            All chats are anonymous and ephemeral.
          </p>
        </div>
      </div>
    </div>
  )
}
