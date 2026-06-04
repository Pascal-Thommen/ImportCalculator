export default function SummaryField({ label, value, currency = 'PYG', className = '' }) {
  const formatted = currency === 'PYG'
    ? new Intl.NumberFormat('es-PY', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(value || 0))
    : new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{label}:</span>
      <span className="text-sm font-mono font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 min-w-[120px] text-right">
        {formatted}
      </span>
    </div>
  )
}
