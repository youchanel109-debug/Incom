import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import LineItemModal from '../modals/LineItemModal'

const money = value => `$${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const fmtDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function BudgetTable({ title, kind, color, items, onCreate, onUpdate, onDelete, budgetMonth, isAdmin }) {
  const [modal, setModal] = useState(null)

  const handleSave = async data => {
    const isEdit = modal?.mode === 'edit'
    if (isEdit) await onUpdate(modal.item.id, data)
    else await onCreate({ ...data, kind })
    setModal(null)
  }

  return (
    <>
      <section className="animate-slideUp overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className={`flex items-center justify-between px-5 py-3 ${color}`}>
          <h2 className="font-bold tracking-wide text-white">{title}</h2>
          <button onClick={() => setModal({ mode: 'add' })} className="inline-flex items-center gap-1 rounded bg-white/20 px-2.5 py-1 text-sm font-semibold text-white transition-colors hover:bg-white/30">
            <Plus size={16} />Add line
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>{['Category', 'Date', 'Description', 'Actual', 'Notes', ''].map(h => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length ? items.map((item, i) => (
                <tr key={item.id} className="animate-slideUp hover:bg-slate-50" style={{ animationDelay: `${i * 0.05}s` }}>
                  <td className="px-4 py-3 font-medium text-slate-800">{item.category_name}</td>
                  <td className="px-4 py-3 text-slate-600">{fmtDate(item.budget_month)}</td>
                  <td className="px-4 py-3 text-slate-600">{item.description}</td>
                  <td className="px-4 py-3">{money(item.actual)}</td>
                  <td className="max-w-48 px-4 py-3 text-slate-500">{item.notes}</td>
                  <td className="px-4 py-3">
                    <button aria-label="Edit line" onClick={() => setModal({ mode: 'edit', item })} className="mr-2 text-slate-500 transition-colors hover:text-indigo-600">
                      <Pencil size={16} />
                    </button>
                    {isAdmin && (
                      <button aria-label="Delete line" onClick={() => confirm('Delete this line?') && onDelete(item.id)} className="text-slate-500 transition-colors hover:text-rose-600">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-400">No {title.toLowerCase()} entries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {modal && <LineItemModal mode={modal.mode} initial={modal.item} budgetMonth={budgetMonth} onSave={handleSave} onClose={() => setModal(null)} />}
    </>
  )
}
