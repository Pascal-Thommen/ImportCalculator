import { useState } from 'react'

export default function Sidebar({ verlauf, aktivId, sprache, t, onSelect, onNeu, onUmbenennen, onLoeschen, onSprache }) {
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const [menuId, setMenuId] = useState(null)

  const beispiele = verlauf.filter(k => k.meta.isBeispiel)
  const eigene     = verlauf.filter(k => !k.meta.isBeispiel)

  const startRename = (k) => { setRenamingId(k.meta.id); setRenameValue(k.meta.name); setMenuId(null) }
  const commitRename = (id) => { if (renameValue.trim()) onUmbenennen(id, renameValue.trim()); setRenamingId(null) }
  const formatDatum = (iso) => {
    try { return new Date(iso).toLocaleDateString('es-PY', { day: '2-digit', month: '2-digit', year: '2-digit' }) }
    catch { return '' }
  }

  const renderItem = (k, readonly = false) => {
    const isActive = k.meta.id === aktivId
    const isRenaming = renamingId === k.meta.id
    const showMenu = menuId === k.meta.id
    return (
      <div key={k.meta.id} className={`group relative rounded-lg mb-0.5 cursor-pointer transition-all ${
        isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
      }`}>
        <div className="flex items-center px-3 py-2" onClick={() => { if (!isRenaming) { onSelect(k.meta.id); setMenuId(null) } }}>
          {isRenaming ? (
            <input autoFocus value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              onBlur={() => commitRename(k.meta.id)}
              onKeyDown={e => { if (e.key === 'Enter') commitRename(k.meta.id); if (e.key === 'Escape') setRenamingId(null) }}
              onClick={e => e.stopPropagation()}
              className="flex-1 text-xs px-1.5 py-0.5 rounded border border-blue-400 text-slate-900 bg-white focus:outline-none" />
          ) : (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{k.meta.name}</div>
              <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>{formatDatum(k.meta.datum)}</div>
            </div>
          )}
          {!readonly && !isRenaming && (
            <button onClick={e => { e.stopPropagation(); setMenuId(showMenu ? null : k.meta.id) }}
              className={`ml-1 w-6 h-6 flex items-center justify-center rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity ${
                isActive ? 'hover:bg-blue-500 text-blue-200' : 'hover:bg-slate-700 text-slate-500'
              }`}>
              ···
            </button>
          )}
        </div>
        {showMenu && (
          <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 min-w-[130px]">
            <button onClick={() => startRename(k)} className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">{t.umbenennen}</button>
            <button onClick={() => { onLoeschen(k.meta.id); setMenuId(null) }} className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50">{t.loeschen}</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="w-60 flex-shrink-0 bg-slate-900 text-white flex flex-col h-screen sticky top-0 overflow-hidden"
      onClick={() => setMenuId(null)}>
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0">IK</div>
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide leading-tight">{t.app_titel}</span>
        </div>
        <button onClick={e => { e.stopPropagation(); onNeu() }}
          className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors">
          {t.neu}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2">
        {beispiele.length > 0 && (
          <div className="mb-2">
            <p className="px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.beispiele}</p>
            {beispiele.map(k => renderItem(k, true))}
          </div>
        )}
        {eigene.length > 0 && (
          <div>
            <p className="px-2 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t.verlauf}</p>
            {eigene.map(k => renderItem(k, false))}
          </div>
        )}
      </div>

      {/* Language */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex gap-1">
          {['DE', 'ES', 'EN'].map(lang => (
            <button key={lang} onClick={() => onSprache(lang)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                sprache === lang ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}>
              {lang}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
