import { useState } from 'react'
import { X } from 'lucide-react'

export default function LineItemModal({ mode, initial, budgetMonth, onSave, onClose }) {
  const [form, setForm] = useState({
    category_name: initial?.category_name || '',
    description: initial?.description || '',
    actual: initial?.actual ?? '0',
    notes: initial?.notes || '',
    budget_month: initial?.budget_month || budgetMonth || '',
  })

  const set = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const submit = e => {
    e.preventDefault()
    if (!form.category_name.trim()) return
    onSave({
      category_name: form.category_name,
      description: form.description,
      actual: Number(form.actual),
      notes: form.notes,
      budget_month: form.budget_month,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn" onClick={onClose}>
      <form
        onClick={e => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl animate-scaleIn"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">{mode === 'edit' ? 'Edit' : 'Add'} Line Item</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Category</label>
            <input autoFocus value={form.category_name} onChange={set('category_name')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Date</label>
            <input type="date" value={form.budget_month} onChange={set('budget_month')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
            <input value={form.description} onChange={set('description')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Actual</label>
            <input type="number" step="0.01" min="0" value={form.actual} onChange={set('actual')} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Notes</label>
            <textarea value={form.notes} onChange={set('notes')} rows={2} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">{mode === 'edit' ? 'Save' : 'Create'}</button>
        </div>
      </form>
    </div>
  )
}
