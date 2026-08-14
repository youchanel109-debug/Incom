import { useState } from 'react'
import { FileText, Download, User, LogOut } from 'lucide-react'
import DateRangeModal from '../modals/DateRangeModal'

export default function Header({ month, onMonthChange, activePage, onNavigate, onLogout }) {
  const [showDateRangeModal, setShowDateRangeModal] = useState(false)

  const navButton = (pageName, label) => <button type="button" onClick={() => onNavigate(pageName)} className={`rounded-full px-4 py-2 text-sm font-semibold transition duration-200 ${activePage === pageName ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
    {label}
  </button>

  const handleReportDateConfirm = (startDate, endDate) => {
    setShowDateRangeModal(false)
    window.open(`/report.html?startDate=${startDate}&endDate=${endDate}`, '_blank')
  }

  return <>
    <header className="animate-slideDown flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Custom Budget</h1>
        <p className="text-sm text-slate-500">Your budget, your rules</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <User size={16} className="text-slate-500" />
          <span className="text-sm text-slate-600">Budget</span>
        </div>
        {navButton('dashboard', 'Dashboard')}
        {navButton('profile', 'Profile')}
        <input aria-label="Date" type="date" value={month} onChange={e => onMonthChange(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm transition duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"/>
        <button type="button" onClick={() => setShowDateRangeModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-slate-700">
          <FileText size={16}/>View Report
        </button>
        <a href={`/report.html?month=${month}&format=pdf`} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50">
          <Download size={16}/>PDF
        </a>
        <a href={`/report.html?month=${month}&format=png`} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-50">
          <Download size={16}/>PNG
        </a>
        <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-50">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>

    <DateRangeModal 
      isOpen={showDateRangeModal} 
      onClose={() => setShowDateRangeModal(false)}
      onConfirm={handleReportDateConfirm}
    />
  </>
}
