import { useState, useRef, useEffect } from 'react'

export default function EditableCell({ value, onChange, type = 'text', className = '', align = 'right', placeholder = '' }) {
  const [editing, setEditing] = useState(false)
  const [raw, setRaw] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const display = type === 'number'
    ? (value === 0 ? '0' : (value || '').toLocaleString('es-PY'))
    : (value || '')

  const startEdit = () => {
    setRaw(type === 'number' ? (value === 0 ? '' : String(value)) : (value || ''))
    setEditing(true)
  }

  const commit = () => {
    if (type === 'number') {
      const parsed = parseFloat(raw.replace(/[^\d.-]/g, ''))
      onChange(isNaN(parsed) ? 0 : parsed)
    } else {
      onChange(raw)
    }
    setEditing(false)
  }

  const onKey = (e) => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') setEditing(false)
  }

  const alignClass = align === 'right' ? 'text-right' : 'text-left'

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type === 'number' ? 'text' : 'text'}
        value={raw}
        onChange={e => setRaw(e.target.value)}
        onBlur={commit}
        onKeyDown={onKey}
        placeholder={placeholder}
        className={`w-full px-1 py-0.5 border border-blue-400 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 ${alignClass} ${className}`}
      />
    )
  }

  return (
    <div
      onClick={startEdit}
      className={`w-full px-1 py-0.5 text-sm cursor-text rounded hover:bg-blue-50 min-h-[1.5rem] ${alignClass} ${className}`}
    >
      {display || <span className="text-gray-300">{placeholder}</span>}
    </div>
  )
}
