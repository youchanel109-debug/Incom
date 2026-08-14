import { useCallback, useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import SummaryCard from '../../components/dashboard/SummaryCard'
import IncomeExpenseChart from '../../components/charts/IncomeExpenseChart'
import ExpensesDonutChart from '../../components/charts/ExpensesDonutChart'
import IncomeTable from '../../components/tables/IncomeTable'
import ExpenseTable from '../../components/tables/ExpenseTable'
import SavingsTable from '../../components/tables/SavingsTable'
import { budgetApi } from '../../services/api'
const zeroSummary = { total_income: 0, total_expenses: 0, total_savings: 0, total_custom: 0, net: 0, income_budgeted: 0, expenses_budgeted: 0 }
const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`
export default function Dashboard({ isAdmin, onNavigate, onLogout }) {
  const [month, setMonth] = useState(thisMonth), [summary, setSummary] = useState(zeroSummary), [items, setItems] = useState([]), [error, setError] = useState('')
  const load = useCallback(async () => { try { setError(''); const [nextSummary, nextItems] = await Promise.all([budgetApi.summary(month), budgetApi.items(month)]); setSummary(nextSummary); setItems(nextItems) } catch (e) { setError(`Unable to reach the API: ${e.message}`) } }, [month])
  useEffect(() => { load() }, [load])
  const runMutation = async action => {
    try { setError(''); await action(); await load() }
    catch (e) { setError(`Could not save your budget line: ${e.message}`) }
  }
  const create = item => runMutation(() => budgetApi.create(item))
  const update = (id, item) => runMutation(() => budgetApi.update(id, item))
  const remove = id => runMutation(() => budgetApi.remove(id))
  const byKind = kind => items.filter(item => item.kind === kind)
  return <div className="app-shell min-h-screen animate-bgPulse"><Header month={month} onMonthChange={setMonth} activePage="dashboard" onNavigate={onNavigate} onLogout={onLogout} isAdmin={isAdmin}/><main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 animate-fadeIn">{error && <div className="animate-fadeIn mb-5 rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700 shadow-sm">{error}</div>}<div className="grid gap-5 lg:grid-cols-3"><div className="animate-slideUp" style={{animationDelay:'0s'}}><SummaryCard summary={summary}/></div><div className="animate-slideUp" style={{animationDelay:'0.05s'}}><IncomeExpenseChart summary={summary}/></div><div className="animate-slideUp" style={{animationDelay:'0.1s'}}><ExpensesDonutChart items={byKind('expenses')}/></div></div><div className="mt-6 space-y-6"><IncomeTable items={byKind('income')} onCreate={create} onUpdate={update} onDelete={remove} budgetMonth={month} isAdmin={isAdmin}/><ExpenseTable items={byKind('expenses')} onCreate={create} onUpdate={update} onDelete={remove} budgetMonth={month} isAdmin={isAdmin}/><SavingsTable items={byKind('savings')} onCreate={create} onUpdate={update} onDelete={remove} budgetMonth={month} isAdmin={isAdmin}/></div><Footer/></main></div>
}
