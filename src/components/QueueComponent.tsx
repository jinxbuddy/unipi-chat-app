'use client'

import { QueueStatus } from '@/types'

interface QueueComponentProps {
  queueStatus?: QueueStatus
  onCancel: () => void
}

export default function QueueComponent({ queueStatus, onCancel }: QueueComponentProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Looking for a Partner...
        </h3>
        
        <div className="loading-dots text-gray-600 mb-4">
          Searching for available students<span>.</span><span>.</span><span>.</span>
        </div>

        {queueStatus && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-blue-700 space-y-2">
              <div className="flex justify-between">
                <span>Students in queue:</span>
                <span className="font-semibold">{queueStatus.totalInQueue}</span>
              </div>
              <div className="flex justify-between">
                <span>Your position:</span>
                <span className="font-semibold">#{queueStatus.position}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated wait:</span>
                <span className="font-semibold">~{Math.round(queueStatus.estimatedWaitTime / 60)}min</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="text-sm text-gray-500 mb-4">
            <p>🔍 We&apos;re matching you with another verified UniPi student</p>
            <p>⏱️ Average wait time is 2-3 minutes</p>
          </div>

          <button
            onClick={onCancel}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors"
          >
            Cancel Search
          </button>
        </div>

        {/* Queue Tips */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">While you wait...</h4>
          <div className="text-xs text-gray-500 space-y-1">
            <p>✓ Check your camera and microphone</p>
            <p>✓ Find a quiet, well-lit space</p>
            <p>✓ Prepare conversation topics</p>
          </div>
        </div>
      </div>
    </div>
  )
}
