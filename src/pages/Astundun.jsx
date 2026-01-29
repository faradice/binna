import { useState, useMemo } from 'react'
import { Download, BarChart3, Table2, AlertTriangle, Filter } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import DataTable from '../components/DataTable'
import { exportToCSV, exportToExcel } from '../utils/export'
import { astundun, skolar } from '../data/mockData'
import { useLanguage } from '../contexts/LanguageContext'

const ABSENCE_THRESHOLD = 10 // Flag students with >10% absence
const COLORS = ['#8b5cf6', '#f97316', '#22c55e', '#ef4444']

export default function Astundun() {
  const { t } = useLanguage()
  const [view, setView] = useState('table') // 'table' or 'charts'
  const [selectedSkoli, setSelectedSkoli] = useState('allir')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false)

  // Columns with translations
  const columns = useMemo(() => [
    {
      key: 'nafn',
      label: t('astundun.nafn'),
      render: (value, item) => (
        <div className="flex items-center gap-2">
          {item.isFlagged && (
            <span className="flex items-center justify-center w-5 h-5 bg-red-100 rounded-full" title={t('astundun.flaggadir')}>
              <AlertTriangle size={12} className="text-red-600" />
            </span>
          )}
          <span className={item.isFlagged ? 'font-medium text-red-700' : ''}>{value}</span>
        </div>
      ),
    },
    { key: 'kennitala', label: t('astundun.kennitala') },
    { key: 'skoli', label: t('astundun.skoli') },
    { key: 'argangur', label: t('astundun.argangur') },
    { key: 'manudur', label: t('astundun.manudur') },
    { key: 'fjarvistir', label: t('astundun.fjarvistir') },
    { key: 'seint', label: t('astundun.seint') },
    { key: 'leyfi', label: t('astundun.leyfi') },
    { key: 'veikindi', label: t('astundun.veikindi') },
    { key: 'pirindarTimar', label: t('astundun.kennslustundir') },
    { key: 'pirindarTimarMaett', label: t('astundun.maett') },
    {
      key: 'fjarvistarHlutfall',
      label: t('astundun.fjarveraProsen'),
      render: (value, item) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-medium ${
            item.isFlagged
              ? 'bg-red-100 text-red-800'
              : value > 5
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {value}%
        </span>
      ),
    },
  ], [t])

  // Add absence percentage to data
  const dataWithPercentage = useMemo(() => {
    return astundun.map((record) => {
      const fjarvistarHlutfall =
        record.pirindarTimar > 0
          ? (((record.pirindarTimar - record.pirindarTimarMaett) / record.pirindarTimar) * 100).toFixed(1)
          : 0
      return {
        ...record,
        fjarvistarHlutfall: parseFloat(fjarvistarHlutfall),
        isFlagged: parseFloat(fjarvistarHlutfall) > ABSENCE_THRESHOLD,
      }
    })
  }, [])

  // Filter data by school and flagged status
  const filteredData = useMemo(() => {
    let data = dataWithPercentage
    if (selectedSkoli !== 'allir') {
      data = data.filter((a) => a.skoli === selectedSkoli)
    }
    if (showOnlyFlagged) {
      data = data.filter((a) => a.isFlagged)
    }
    return data
  }, [selectedSkoli, showOnlyFlagged, dataWithPercentage])

  // Aggregate data for charts
  const chartData = useMemo(() => {
    const skoliData = {}

    filteredData.forEach((record) => {
      const key = selectedSkoli === 'allir' ? record.skoli : record.manudur
      if (!skoliData[key]) {
        skoliData[key] = {
          name: key,
          fjarvistir: 0,
          seint: 0,
          leyfi: 0,
          veikindi: 0,
        }
      }
      skoliData[key].fjarvistir += record.fjarvistir
      skoliData[key].seint += record.seint
      skoliData[key].leyfi += record.leyfi
      skoliData[key].veikindi += record.veikindi
    })

    return Object.values(skoliData)
  }, [filteredData, selectedSkoli])

  // Summary data for pie chart
  const summaryData = useMemo(() => {
    const totals = filteredData.reduce(
      (acc, record) => ({
        fjarvistir: acc.fjarvistir + record.fjarvistir,
        seint: acc.seint + record.seint,
        leyfi: acc.leyfi + record.leyfi,
        veikindi: acc.veikindi + record.veikindi,
      }),
      { fjarvistir: 0, seint: 0, leyfi: 0, veikindi: 0 }
    )

    return [
      { name: t('astundun.fjarvistir'), value: totals.fjarvistir },
      { name: t('astundun.seint'), value: totals.seint },
      { name: t('astundun.leyfi'), value: totals.leyfi },
      { name: t('astundun.veikindi'), value: totals.veikindi },
    ]
  }, [filteredData, t])

  // Stats cards data
  const stats = useMemo(() => {
    const totals = summaryData.reduce((acc, item) => acc + item.value, 0)
    const uniqueStudents = new Set(filteredData.map((r) => r.nemandaId)).size
    const avgPerStudent = uniqueStudents > 0 ? (totals / uniqueStudents).toFixed(1) : 0
    const flaggedStudents = new Set(
      filteredData.filter((r) => r.isFlagged).map((r) => r.nemandaId)
    ).size

    return {
      totals,
      uniqueStudents,
      avgPerStudent,
      flaggedStudents,
      fjarvistir: summaryData.find((s) => s.name === t('astundun.fjarvistir'))?.value || 0,
      seint: summaryData.find((s) => s.name === t('astundun.seint'))?.value || 0,
      leyfi: summaryData.find((s) => s.name === t('astundun.leyfi'))?.value || 0,
      veikindi: summaryData.find((s) => s.name === t('astundun.veikindi'))?.value || 0,
    }
  }, [summaryData, filteredData, t])

  const handleExportCSV = () => {
    exportToCSV(filteredData, columns, 'astundun')
    setShowExportMenu(false)
  }

  const handleExportExcel = () => {
    exportToExcel(filteredData, columns, 'astundun')
    setShowExportMenu(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('astundun.titill')}</h1>
          <p className="text-gray-500">{t('astundun.lysing')}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* School filter */}
          <select
            value={selectedSkoli}
            onChange={(e) => setSelectedSkoli(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="allir">{t('common.allirSkolar')}</option>
            {skolar.map((skoli) => (
              <option key={skoli.id} value={skoli.nafn}>
                {skoli.nafn}
              </option>
            ))}
          </select>

          {/* Flagged filter toggle */}
          <button
            onClick={() => setShowOnlyFlagged(!showOnlyFlagged)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              showOnlyFlagged
                ? 'bg-red-100 text-red-700 border border-red-300'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <AlertTriangle size={18} />
            {showOnlyFlagged ? t('astundun.flaggadirBtn') : t('astundun.synaFlaggada')}
          </button>

          {/* View toggle */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('table')}
              className={`flex items-center gap-2 px-3 py-2 ${
                view === 'table'
                  ? 'bg-violet-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Table2 size={18} />
              {t('astundun.tafla')}
            </button>
            <button
              onClick={() => setView('charts')}
              className={`flex items-center gap-2 px-3 py-2 ${
                view === 'charts'
                  ? 'bg-violet-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 size={18} />
              {t('astundun.grof')}
            </button>
          </div>

          {/* Export */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              <Download size={20} />
              {t('common.flyjaUt')}
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
                    <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded">
                      CSV
                    </span>
                    {t('common.fyrirExcel')}
                  </button>
                  <button
                    onClick={handleExportExcel}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      XLS
                    </span>
                    {t('common.excelSkjal')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">{t('astundun.nempidar')}</p>
          <p className="text-2xl font-bold text-gray-800">{stats.uniqueStudents}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">{t('astundun.medaltalNem')}</p>
          <p className="text-2xl font-bold text-gray-800">{stats.avgPerStudent}</p>
        </div>
        <div
          className={`rounded-xl shadow-sm border p-4 cursor-pointer transition-colors ${
            showOnlyFlagged
              ? 'bg-red-100 border-red-300'
              : 'bg-white border-red-200 hover:bg-red-50'
          }`}
          onClick={() => setShowOnlyFlagged(!showOnlyFlagged)}
        >
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertTriangle size={14} />
            {t('astundun.flaggadir')}
          </p>
          <p className="text-2xl font-bold text-red-700">{stats.flaggedStudents}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-violet-200 p-4 bg-violet-50">
          <p className="text-sm text-violet-600">{t('astundun.fjarvistir')}</p>
          <p className="text-2xl font-bold text-violet-700">{stats.fjarvistir}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4 bg-orange-50">
          <p className="text-sm text-orange-600">{t('astundun.seint')}</p>
          <p className="text-2xl font-bold text-orange-700">{stats.seint}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 bg-green-50">
          <p className="text-sm text-green-600">{t('astundun.leyfi')}</p>
          <p className="text-2xl font-bold text-green-700">{stats.leyfi}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 bg-red-50">
          <p className="text-sm text-red-600">{t('astundun.veikindi')}</p>
          <p className="text-2xl font-bold text-red-700">{stats.veikindi}</p>
        </div>
      </div>

      {view === 'table' ? (
        <DataTable
          data={filteredData}
          columns={columns}
          searchPlaceholder={t('astundun.leitaAdNemanda')}
          filters={[
            { key: 'skoli', label: t('astundun.skoli') },
            { key: 'argangur', label: t('astundun.argangur') },
            { key: 'manudur', label: t('astundun.manudur') },
          ]}
          rowClassName={(item) => (item.isFlagged ? 'bg-red-50' : '')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedSkoli === 'allir' ? t('astundun.eftirSkolum') : t('astundun.eftirManudum')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fjarvistir" name={t('astundun.fjarvistir')} fill="#8b5cf6" />
                <Bar dataKey="seint" name={t('astundun.seint')} fill="#f97316" />
                <Bar dataKey="leyfi" name={t('astundun.leyfi')} fill="#22c55e" />
                <Bar dataKey="veikindi" name={t('astundun.veikindi')} fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('astundun.hlutfoll')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={summaryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {summaryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary table by school */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('astundun.samantektEftirSkolum')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      {t('astundun.skoli')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      {t('astundun.fjarvistir')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      {t('astundun.seint')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      {t('astundun.leyfi')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      {t('astundun.veikindi')}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                      {t('astundun.samtals')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {skolar.map((skoli) => {
                    const skoliRecords = astundun.filter(
                      (a) => a.skoli === skoli.nafn
                    )
                    const totals = skoliRecords.reduce(
                      (acc, r) => ({
                        fjarvistir: acc.fjarvistir + r.fjarvistir,
                        seint: acc.seint + r.seint,
                        leyfi: acc.leyfi + r.leyfi,
                        veikindi: acc.veikindi + r.veikindi,
                      }),
                      { fjarvistir: 0, seint: 0, leyfi: 0, veikindi: 0 }
                    )
                    const total =
                      totals.fjarvistir +
                      totals.seint +
                      totals.leyfi +
                      totals.veikindi

                    return (
                      <tr key={skoli.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {skoli.nafn}
                        </td>
                        <td className="px-4 py-3 text-right text-violet-600">
                          {totals.fjarvistir}
                        </td>
                        <td className="px-4 py-3 text-right text-orange-600">
                          {totals.seint}
                        </td>
                        <td className="px-4 py-3 text-right text-green-600">
                          {totals.leyfi}
                        </td>
                        <td className="px-4 py-3 text-right text-red-600">
                          {totals.veikindi}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">
                          {total}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
