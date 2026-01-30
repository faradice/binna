import { useMemo } from 'react'
import DataTable from '../components/DataTable'
import ExportButton from '../components/ExportButton'
import { useStarfsmenn } from '../services/hooks'
import { useLanguage } from '../contexts/LanguageContext'

export default function Starfsmenn() {
  const { t } = useLanguage()

  // Fetch starfsmenn from API
  const { data: starfsmenn = [], isLoading, error } = useStarfsmenn()

  const columns = useMemo(() => [
    { key: 'nafn', label: t('starfsmenn.nafn') },
    { key: 'kennitala', label: t('starfsmenn.kennitala') },
    { key: 'stada', label: t('starfsmenn.deild') },
    { key: 'deild', label: t('starfsmenn.deild') },
    { key: 'skoli', label: t('starfsmenn.skoli') },
    { key: 'starfshlutfall', label: t('starfsmenn.starfshlutfall') },
    { key: 'menntun', label: t('starfsmenn.menntun') },
    { key: 'radpinadagur', label: t('starfsmenn.radningardagur') },
    { key: 'heimili', label: t('starfsmenn.heimili') },
    { key: 'netfang', label: t('starfsmenn.netfang') },
    { key: 'simi', label: t('starfsmenn.simi') },
    { key: 'farsimi', label: t('starfsmenn.farsimi') },
  ], [t])

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
          <h1 className="text-2xl font-bold text-gray-800">{t('starfsmenn.titill')}</h1>
          <p className="text-gray-500">{t('starfsmenn.lysing')}</p>
        </div>
        <ExportButton data={starfsmenn} columns={columns} filename="starfsmenn" />
      </div>

      <DataTable
        data={starfsmenn}
        columns={columns}
        searchPlaceholder={t('starfsmenn.leitaAdStarfsmanni')}
        filters={[
          { key: 'skoli', label: t('starfsmenn.skoli') },
          { key: 'stada', label: t('starfsmenn.deild') },
          { key: 'deild', label: t('starfsmenn.deild') },
          { key: 'starfshlutfall', label: t('starfsmenn.starfshlutfall') },
        ]}
      />
    </div>
  )
}
