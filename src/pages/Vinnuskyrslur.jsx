import { useState, useMemo } from 'react'
import { Download, CheckSquare, Square } from 'lucide-react'
import DataTable from '../components/DataTable'
import { exportToCSV, exportToExcel } from '../utils/export'
import { vinnuskyrslur } from '../data/mockData'
import { useLanguage } from '../contexts/LanguageContext'

// Columns grouped by category
const grunnupplysingar = [
  { key: 'nafnSkola', label: 'Skóli' },
  { key: 'kennitalaSkola', label: 'Kt. skóla' },
  { key: 'nafn', label: 'Nafn' },
  { key: 'kennitala', label: 'Kennitala' },
  { key: 'starfsheitiLauna', label: 'Starfsheiti' },
]

const radpinaOgLaun = [
  { key: 'radpinahlutfall', label: 'Ráðn.hlutfall %' },
  { key: 'launahlutfall', label: 'Launahlutfall %' },
  { key: 'launaflokkur', label: 'Launaflokkur' },
  { key: 'grunrodun', label: 'Grunnröðun' },
  { key: 'personualag', label: 'Persónuálag' },
  { key: 'afslattur', label: 'Afsláttur' },
  { key: 'afslAlls', label: 'Afsl. alls' },
]

const menntunOgReynsla = [
  { key: 'profLeyfisbrief', label: 'Próf/Leyfisbréf' },
  { key: 'leidbeinandi', label: 'Leiðbeinandi' },
  { key: 'simenntun', label: 'Símenntun' },
  { key: 'simenntunFerEftir', label: 'Símenntun fer eftir' },
  { key: 'kennsluferill', label: 'Kennsluferill' },
  { key: 'stjornunarreynsla', label: 'Stjórnunarreynsla' },
]

const kennsla = [
  { key: 'allsKennsla', label: 'Alls kennsla' },
  { key: 'almennKennsla', label: 'Almenn kennsla' },
  { key: 'onnurKennsla', label: 'Önnur kennsla' },
  { key: 'serkennsla', label: 'Sérkennsla' },
  { key: 'sertaekSerkennsla', label: 'Sértæk sérkennsla' },
  { key: 'serdeild', label: 'Sérdeild' },
  { key: 'nybuakennsla', label: 'Nýbúakennsla' },
  { key: 'taknmalssvid', label: 'Táknmálssvið' },
  { key: 'tonmennt', label: 'Tónmennt' },
]

const yfirvinna = [
  { key: 'allsYfirvinna', label: 'Alls yfirvinna' },
  { key: 'yfirvinnaAlls', label: 'Yfirvinna alls' },
]

const columnGroups = [
  { id: 'grunnupplysingar', label: 'Grunnupplýsingar', columns: grunnupplysingar },
  { id: 'radpinaOgLaun', label: 'Ráðning og laun', columns: radpinaOgLaun },
  { id: 'menntunOgReynsla', label: 'Menntun og reynsla', columns: menntunOgReynsla },
  { id: 'kennsla', label: 'Kennsla', columns: kennsla },
  { id: 'yfirvinna', label: 'Yfirvinna', columns: yfirvinna },
]

const allColumns = [
  ...grunnupplysingar,
  ...radpinaOgLaun,
  ...menntunOgReynsla,
  ...kennsla,
  ...yfirvinna,
]

export default function Vinnuskyrslur() {
  const { t } = useLanguage()
  const [activeGroups, setActiveGroups] = useState(['grunnupplysingar', 'radpinaOgLaun'])
  const [selectedIds, setSelectedIds] = useState([])
  const [showExportMenu, setShowExportMenu] = useState(false)

  const toggleGroup = (groupId) => {
    setActiveGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((g) => g !== groupId)
        : [...prev, groupId]
    )
  }

  const visibleColumns = columnGroups
    .filter((group) => activeGroups.includes(group.id))
    .flatMap((group) => group.columns)

  // Get data to export (selected or all)
  const dataToExport = useMemo(() => {
    if (selectedIds.length === 0) return vinnuskyrslur
    return vinnuskyrslur.filter((item) => selectedIds.includes(item.id))
  }, [selectedIds])

  const handleExportCSV = () => {
    exportToCSV(dataToExport, allColumns, 'vinnuskyrslur')
    setShowExportMenu(false)
  }

  const handleExportExcel = () => {
    exportToExcel(dataToExport, allColumns, 'vinnuskyrslur')
    setShowExportMenu(false)
  }

  const selectAll = () => {
    setSelectedIds(vinnuskyrslur.map((item) => item.id))
  }

  const clearSelection = () => {
    setSelectedIds([])
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('vinnuskyrslur.titill')}</h1>
          <p className="text-gray-500">{t('vinnuskyrslur.lysing')}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Selection info and actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 rounded-lg">
              <CheckSquare size={16} className="text-violet-600" />
              <span className="text-sm font-medium text-violet-700">
                {selectedIds.length} {t('common.valdir')}
              </span>
              <button
                onClick={clearSelection}
                className="text-xs text-violet-600 hover:text-violet-800 underline ml-1"
              >
                {t('common.hreinsa')}
              </button>
            </div>
          )}

          <button
            onClick={selectAll}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Square size={16} />
            {t('common.veljaAlla')}
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Download size={20} />
              {t('common.flyjaUt')} {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    onClick={handleExportCSV}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded">CSV</span>
                    {t('common.fyrirExcel')}
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">XLS</span>
                    {t('common.excelSkjal')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Column group toggles */}
      <div className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{t('vinnuskyrslur.synaDalkaflokka')}</h3>
        <div className="flex flex-wrap gap-2">
          {columnGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => toggleGroup(group.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeGroups.includes(group.id)
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {group.label}
              <span className="ml-1 text-xs opacity-75">({group.columns.length})</span>
            </button>
          ))}
        </div>
      </div>

      <DataTable
        data={vinnuskyrslur}
        columns={visibleColumns}
        searchPlaceholder={t('vinnuskyrslur.leitaIVinnuskyrslu')}
        filters={[
          { key: 'nafnSkola', label: 'Skóli' },
          { key: 'launaflokkur', label: 'Launaflokkur' },
          { key: 'starfsheitiLauna', label: 'Starfsheiti' },
          { key: 'grunrodun', label: 'Grunnröðun' },
        ]}
        selectable={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  )
}
