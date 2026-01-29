import { useMemo } from 'react'
import DataTable from '../components/DataTable'
import ExportButton from '../components/ExportButton'
import { adstandendur } from '../data/mockData'
import { useLanguage } from '../contexts/LanguageContext'

export default function Adstandendur() {
  const { t } = useLanguage()

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
    { key: 'vinnustadur', label: t('adstandendur.vinnustadur') },
    { key: 'vinnusimi', label: t('adstandendur.vinnusimi') },
    {
      key: 'nemendur',
      label: t('adstandendur.nempidar'),
      render: (value) => value?.join(', ') || '-',
    },
  ], [t])

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
