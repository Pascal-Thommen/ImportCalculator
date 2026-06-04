import { useState } from 'react'

export default function Sidebar({ verlauf, aktivId, sprache, t, onSelect, onNeu, onUmbenennen, onLoeschen, onSprache }) {
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [menuId, setMenuId] = useState(null)

  const beispiele = verlauf.filter(k => k.meta.isBeispiel)
  const eigene     = verlauf.filter(k => !k.meta.isBeispiel)

  const startRename = (k) => {
    setRenamingId(k.meta.id)
    setRenameValue(k.meta.name)
    setMenuId(null)
  }

  const commitRename = (id) => {
    if (renameValue.trim()) onUmbenennen(id, renameValue.trim())
    setRenamingId(null)
  }

  const formatDatum = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: '2-digit' })
    } catch { return '' }
  }

  const renderItem = (k, readonly = false) => {
    const isActive = k.meta.id === aktivId
    const isRenaming = renamingId === k.meta.id
    const showMenu = menuId === k.meta.id

    return (
      <div
        key={k.meta.id}
        className={`group relative rounded-lg mb-1 cursor-pointer transition-colors ${
          isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <div
          className="flex items-center px-2 py-1.5"
          onClick={() => { if (!isRenaming) { onSelect(k.meta.id); setMenuId(null) } }}
        >
          {isRenaming ? (
            <input
              autoFocus
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onBlur={() => commitRename(k.meta.id)}
              onKeyDown={e => {
                if (e.key === 'Enter') commitRename(k.meta.id)
                if (e.key === 'Escape') setRenamingId(null)
              }}
              onClick={e => e.stopPropagation()}
              className="flex-1 text-xs px-1 py-0.5 rounded border border-blue-300 text-gray-800 bg-white focus:outline-none"
            />
          ) : (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{k.meta.name}</div>
              <div className={`text-xs ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>
                {formatDatum(k.meta.datum)}
              </div>
            </div>
          )}
          {!readonly && !isRenaming && (
            <button
              onClick={e => { e.stopPropagation(); setMenuId(showMenu ? null : k.meta.id) }}
              className={`ml-1 px-1 py-0.5 rounded text-xs opacity-0 group-hover:opacity-100 ${
                isActive ? 'text-blue-200 hover:text-white hover:bg-blue-500' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200'
              }`}
            >
              ···
            </button>
          )}
        </div>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
            <button onClick={() => startRename(k)} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">
              {t.umbenennen}
            </button>
            <button onClick={() => { onLoeschen(k.meta.id); setMenuId(null) }} className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
              {t.loeschen}
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <aside
      className="w-52 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0"
      onClick={() => setMenuId(null)}
    >
      <div className="p-3 border-b border-gray-200">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{t.app_titel}</div>
        <button
          onClick={e => { e.stopPropagation(); onNeu() }}
          className="w-full py-1.5 px-3 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t.neu}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {beispiele.length > 0 && (
          <div className="mb-3">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">{t.beispiele}</div>
            {beispiele.map(k => renderItem(k, true))}
          </div>
        )}
        {eigene.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">{t.verlauf}</div>
            {eigene.map(k => renderItem(k, false))}
          </div>
        )}
      </div>
      <div className="p-3 border-t border-gray-200">
        <div className="flex gap-1 justify-center">
          {['DE', 'ES', 'EN'].map(lang => (
            <button
              key={lang}
              onClick={() => onSprache(lang)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                sprache === lang ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
