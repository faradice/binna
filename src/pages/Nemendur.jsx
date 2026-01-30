import { useState, useMemo } from 'react'
import DataTable from '../components/DataTable'
import ExportButton from '../components/ExportButton'
import { useNemendur } from '../services/hooks'
import { useLanguage } from '../contexts/LanguageContext'

const SVEITARFELAG = 'Bollabyggð' // Núverandi sveitarfélag

export default function Nemendur() {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('allir')

  // Fetch nemendur from API
  const { data: nemendur = [], isLoading, error } = useNemendur()

  const columns = useMemo(() => [
    { key: 'nafn', label: t('nemendur.nafn') },
    { key: 'kennitala', label: t('nemendur.kennitala') },
    { key: 'kyn', label: t('nemendur.kyn') },
    { key: 'argangur', label: t('nemendur.argangur') },
    { key: 'skoli', label: t('nemendur.skoli') },
    { key: 'sveitarfelag', label: `${t('nemendur.sveitarfelag')} (${t('nemendur.heimili').toLowerCase()})` },
    { key: 'sveitarfelag_skola', label: `${t('nemendur.sveitarfelag')} (${t('nemendur.skoli').toLowerCase()})` },
    { key: 'heimili', label: t('nemendur.heimili') },
    { key: 'netfang', label: t('nemendur.netfang') },
  ], [t])

  const tabs = useMemo(() => [
    { id: 'allir', label: t('nemendur.allir') },
    { id: 'heima', label: t('nemendur.iHeimasveitarfelagi') },
    { id: 'i_odru', label: t('nemendur.iSkolaAnnarsStadar') },
    { id: 'ur_odru', label: t('nemendur.urOdruSveitarfelagi') },
  ], [t])

  const filteredNemendur = useMemo(() => {
    switch (activeTab) {
      case 'heima':
        // Búa í sveitarfélaginu OG fara í skóla þar
        return nemendur.filter(
          (n) => n.sveitarfelag === SVEITARFELAG && n.sveitarfelag_skola === SVEITARFELAG
        )
      case 'i_odru':
        // Búa í sveitarfélaginu EN fara í skóla annars staðar
        return nemendur.filter(
          (n) => n.sveitarfelag === SVEITARFELAG && n.sveitarfelag_skola !== SVEITARFELAG
        )
      case 'ur_odru':
        // Búa annars staðar EN fara í skóla í sveitarfélaginu
        return nemendur.filter(
          (n) => n.sveitarfelag !== SVEITARFELAG && n.sveitarfelag_skola === SVEITARFELAG
        )
      default:
        return nemendur
    }
  }, [activeTab, nemendur])

  const getTabCount = (tabId) => {
    switch (tabId) {
      case 'heima':
        return nemendur.filter(
          (n) => n.sveitarfelag === SVEITARFELAG && n.sveitarfelag_skola === SVEITARFELAG
        ).length
      case 'i_odru':
        return nemendur.filter(
          (n) => n.sveitarfelag === SVEITARFELAG && n.sveitarfelag_skola !== SVEITARFELAG
        ).length
      case 'ur_odru':
        return nemendur.filter(
          (n) => n.sveitarfelag !== SVEITARFELAG && n.sveitarfelag_skola === SVEITARFELAG
        ).length
      default:
        return nemendur.length
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Villa við að sækja gögn: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nemendur.titill')}</h1>
          <p className="text-gray-500">{t('nemendur.lysing')}</p>
        </div>
        <ExportButton data={filteredNemendur} columns={columns} filename="nemendur" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${
              activeTab === tab.id
                ? 'text-violet-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
              activeTab === tab.id
                ? 'bg-violet-100 text-violet-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {getTabCount(tab.id)}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
            )}
          </button>
        ))}
      </div>

      <DataTable
        data={filteredNemendur}
        columns={columns}
        searchPlaceholder={t('nemendur.leitaAdNemanda')}
        filters={[
          { key: 'skoli', label: t('nemendur.skoli') },
          { key: 'argangur', label: t('nemendur.argangur') },
          { key: 'kyn', label: t('nemendur.kyn') },
          { key: 'sveitarfelag', label: `${t('nemendur.sveitarfelag')} (${t('nemendur.heimili').toLowerCase()})` },
          { key: 'sveitarfelag_skola', label: `${t('nemendur.sveitarfelag')} (${t('nemendur.skoli').toLowerCase()})` },
        ]}
      />
    </div>
  )
}
