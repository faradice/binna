import { useMemo } from 'react'
import DataTable from '../components/DataTable'
import ExportButton from '../components/ExportButton'
import { useAdstandendur } from '../services/hooks'
import { useLanguage } from '../contexts/LanguageContext'

export default function Adstandendur() {
  const { t } = useLanguage()

  // Fetch adstandendur from API
  const { data: adstandendur = [], isLoading, error } = useAdstandendur()

  const columns = useMemo(() => [
    { key: 'nafn', label: t('adstandendur.nafn') },
    { key: 'kennitala', label: t('adstandendur.kennitala') },
    { key: 'tengsl', label: t('adstandendur.tengsl') },
    { key: 'forsja', label: t('adstandendur.forsja') },
    { key: 'adaltengilid', label: t('adstandendur.adaltengilidir') },
    { key: 'heimili', label: t('adstandendur.heimili') },
    { key: 'simi', label: t('adstandendur.simi') },
    { key: 'farsimi', label: t('adstandendur.farsimi') },
    { key: 'netfang', label: t('adstandendur.netfang') },
    { key: 'vinnusimi', label: t('adstandendur.vinnusimi') },
    {
      key: 'barn1',
      label: `${t('adstandendur.nempidar')} 1`,
      render: (_, row) => row.nemendur?.[0] || '-',
    },
    {
      key: 'barn2',
      label: `${t('adstandendur.nempidar')} 2`,
      render: (_, row) => row.nemendur?.[1] || '-',
    },
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
          <h1 className="text-2xl font-bold text-gray-800">{t('adstandendur.titill')}</h1>
          <p className="text-gray-500">{t('adstandendur.lysing')}</p>
        </div>
        <ExportButton data={adstandendur} columns={columns} filename="adstandendur" />
      </div>

      <DataTable
        data={adstandendur}
        columns={columns}
        searchPlaceholder={t('adstandendur.leitaAdAdstandanda')}
        filters={[
          { key: 'tengsl', label: t('adstandendur.tengsl') },
          { key: 'forsja', label: t('adstandendur.forsja') },
          { key: 'adaltengilid', label: t('adstandendur.adaltengilidir') },
        ]}
      />
    </div>
  )
}
