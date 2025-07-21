'use client'

import { useState } from 'react'
import { REPORT_REASONS } from '@/types'

interface ReportModalProps {
  onReport: (reason: string) => void
  onCancel: () => void
  partnerName?: string
}

export default function ReportModal({ onReport, onCancel, partnerName }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedReason) return

    setIsSubmitting(true)
    
    const reason = selectedReason === 'other' ? customReason : selectedReason
    
    // Add some delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onReport(reason)
    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Report User</h3>
          <p className="text-gray-600 mt-2">
            Report {partnerName || 'this user'} for inappropriate behavior
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Reason for reporting:
            </label>
            <div className="space-y-2">
              {REPORT_REASONS.map((reason) => (
                <label key={reason.id} className="flex items-start">
                  <input
                    type="radio"
                    name="report-reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-1 h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900">
                      {reason.label}
                    </span>
                    <p className="text-xs text-gray-500">
                      {reason.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === 'other' && (
            <div>
              <label htmlFor="custom-reason" className="block text-sm font-medium text-gray-700 mb-1">
                Please specify:
              </label>
              <textarea
                id="custom-reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Describe the issue..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-700">
              <strong>Important:</strong> False reports may result in account restrictions. 
              Only report genuine violations of our community guidelines.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedReason || isSubmitting || (selectedReason === 'other' && !customReason.trim())}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Report'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
