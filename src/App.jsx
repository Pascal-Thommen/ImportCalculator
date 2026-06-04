import { useKalkulation } from './hooks/useKalkulation.js'
import { useT } from './i18n/translations.js'
import Sidebar from './components/layout/Sidebar.jsx'
import MainArea from './components/layout/MainArea.jsx'

export default function App() {
  const kalk = useKalkulation()
  const t = useT(kalk.sprache)

  const handlers = {
    // produkte
    setProduktWaehrung:     kalk.setProduktWaehrung,
    setProduktWechselkurs:  kalk.setProduktWechselkurs,
    updateProduktZeile:     kalk.updateProduktZeile,
    addProduktZeile:        kalk.addProduktZeile,
    removeProduktZeile:     kalk.removeProduktZeile,
    // flete
    setFleteWaehrung:       kalk.setFleteWaehrung,
    setFleteWechselkurs:    kalk.setFleteWechselkurs,
    updateFleteZeile:       kalk.updateFleteZeile,
    addFleteZeile:          kalk.addFleteZeile,
    removeFleteZeile:       kalk.removeFleteZeile,
    // importacion
    updateImportacionZeile: kalk.updateImportacionZeile,
    addImportacionZeile:    kalk.addImportacionZeile,
    removeImportacionZeile: kalk.removeImportacionZeile,
    // nationale
    updateNationaleZeile:   kalk.updateNationaleZeile,
    addNationaleZeile:      kalk.addNationaleZeile,
    removeNationaleZeile:   kalk.removeNationaleZeile,
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        verlauf={kalk.verlauf}
        aktivId={kalk.aktivId}
        sprache={kalk.sprache}
        t={t}
        onSelect={kalk.setAktivId}
        onNeu={kalk.neueKalkulation}
        onUmbenennen={kalk.umbenennen}
        onLoeschen={kalk.loeschen}
        onSprache={kalk.setSprache}
      />
      <MainArea
        kalk={kalk.aktiveKalk}
        t={t}
        handlers={handlers}
      />
    </div>
  )
}
