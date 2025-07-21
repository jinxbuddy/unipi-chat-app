'use client'

import { ChatState } from '@/types'

interface ControlsComponentProps {
  chatState: ChatState
  onStartChat: () => void
  onEndChat: () => void
  onSkipUser: () => void
  onReport: () => void
}

export default function ControlsComponent({ 
  chatState, 
  onStartChat, 
  onEndChat, 
  onSkipUser, 
  onReport 
}: ControlsComponentProps) {
  
  const isIdle = chatState.status === 'idle'
  const isConnected = chatState.status === 'connected'
  const isConnecting = chatState.status === 'connecting'

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Chat Controls</h3>
      
      <div className="space-y-4">
        {isIdle && (
          <button
            onClick={onStartChat}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
              </svg>
              Start Chat
            </span>
          </button>
        )}

        {(isConnected || isConnecting) && (
          <div className="space-y-3">
            <button
              onClick={onEndChat}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                End Chat
              </span>
            </button>

            {isConnected && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onSkipUser}
                  className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-colors font-medium text-sm"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                    </svg>
                    Skip
                  </span>
                </button>

                <button
                  onClick={onReport}
                  className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 transition-colors font-medium text-sm"
                >
                  <span className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                    </svg>
                    Report
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Chat Status Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {isIdle && (
              <p>Ready to connect with a fellow UniPi student</p>
            )}
            {isConnecting && (
              <p>Establishing secure connection...</p>
            )}
            {isConnected && (
              <div>
                <p className="font-medium text-green-600">
                  Connected to {chatState.partnerName}
                </p>
                <p className="text-xs mt-1">
                  Connection is encrypted and anonymous
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              className="text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded hover:bg-gray-200 transition-colors"
              onClick={() => {/* Toggle camera */}}
            >
              📹 Camera
            </button>
            <button
              className="text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded hover:bg-gray-200 transition-colors"
              onClick={() => {/* Toggle microphone */}}
            >
              🎤 Mic
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
