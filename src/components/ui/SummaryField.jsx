export default function SummaryField({ label, value, currency = 'PYG', className = '' }) {
  const formatted = currency === 'PYG'
    ? new Intl.NumberFormat('es-PY', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(value || 0))
    : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0)

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      <span className="text-2xl font-bold font-mono text-slate-800 mt-0.5 tabular-nums">{formatted}</span>
    </div>
  )
}
