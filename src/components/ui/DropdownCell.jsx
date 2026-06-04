export default function DropdownCell({ value, options, onChange, className = '' }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={`w-full px-1 py-0.5 text-sm border border-transparent rounded hover:border-gray-300 bg-transparent cursor-pointer focus:outline-none focus:border-blue-400 ${className}`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
