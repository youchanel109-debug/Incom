import React, { useState } from 'react'
import { X } from 'lucide-react'

export default function DateRangeModal({ isOpen, onClose, onConfirm, initialStartDate, initialEndDate }) {
  if (!isOpen) return null

  const today = new Date().toISOString().split('T')[0]
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  const defaultStart = startOfMonth.toISOString().split('T')[0]

  const [startDate, setStartDate] = useState(initialStartDate || defaultStart)
  const [endDate, setEndDate] = useState(initialEndDate || today)
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates')
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date')
      return
    }
    onConfirm(startDate, endDate)
  }

  const handleQuickSelect = (days) => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - days)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
    setError('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="animate-scaleIn rounded-xl bg-white p-6 shadow-xl" style={{ maxWidth: '400px', width: '90%' }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Select Date Range</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value)
                setError('')
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value)
                setError('')
              }}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">Quick Select:</p>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleQuickSelect(7)}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                1 Week
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(14)}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                2 Weeks
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(30)}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                1 Month
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect(90)}
                className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
              >
                3 Months
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            View Report
          </button>
        </div>
      </div>
    </div>
  )
}
