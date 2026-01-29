import { useMemo } from 'react'
import DataTable from '../components/DataTable'
import ExportButton from '../components/ExportButton'
import { skolar } from '../data/mockData'
import { useLanguage } from '../contexts/LanguageContext'

export default function Skolar() {
  const { t } = useLanguage()

  const columns = useMemo(() => [
    { key: 'nafn', label: t('skolar.nafn') },
    { key: 'nemendafjoldi', label: t('skolar.nemendafjoldi') },
    { key: 'starfsmannafjoldi', label: t('skolar.starfsmannafjoldi') },
    { key: 'skolastjori', label: t('skolar.skolastjori') },
    { key: 'heimilisfang', label: t('skolar.heimilisfang') },
    { key: 'postnumer', label: t('skolar.postnumer') },
    { key: 'simi', label: t('skolar.simi') },
    { key: 'netfang', label: t('skolar.netfang') },
  ], [t])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('skolar.titill')}</h1>
          <p className="text-gray-500">{t('skolar.lysing')}</p>
        </div>
        <ExportButton data={skolar} columns={columns} filename="skolar" />
      </div>

      <DataTable
        data={skolar}
        columns={columns}
        searchPlaceholder={`${t('common.leitaAd')} ${t('nav.skolar').toLowerCase()}...`}
        filters={[
          { key: 'rekstraradili', label: t('skolar.rekstraradili') },
          { key: 'postnumer', label: t('skolar.postnumer') },
        ]}
      />
    </div>
  )
}
