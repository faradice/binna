import { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, Filter, X } from 'lucide-react'

export default function DataTable({
  data,
  columns,
  searchPlaceholder = 'Leita...',
  filters = [],
  selectable = false,
  selectedIds = [],
  onSelectionChange = null,
  rowClassName = null,
}) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortDirection, setSortDirection] = useState('asc')
  const [activeFilters, setActiveFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  // Get unique values for each filter column
  const filterOptions = useMemo(() => {
    const options = {}
    filters.forEach((filter) => {
      const uniqueValues = [...new Set(data.map((item) => item[filter.key]).filter(Boolean))]
      options[filter.key] = uniqueValues.sort()
    })
    return options
  }, [data, filters])

  const filteredData = useMemo(() => {
    let result = data

    // Apply search
    if (search) {
      result = result.filter((item) =>
        columns.some((col) => {
          const value = item[col.key]
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(search.toLowerCase())
        })
      )
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) => item[key] === value)
      }
    })

    return result
  }, [data, search, columns, activeFilters])

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortKey, sortDirection])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const clearFilters = () => {
    setActiveFilters({})
  }

  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length

  // Selection helpers
  const allSelected = selectable && sortedData.length > 0 && sortedData.every((item) => selectedIds.includes(item.id))
  const someSelected = selectable && selectedIds.length > 0 && !allSelected

  const toggleSelectAll = () => {
    if (!onSelectionChange) return
    if (allSelected) {
      // Deselect all visible items
      const visibleIds = sortedData.map((item) => item.id)
      onSelectionChange(selectedIds.filter((id) => !visibleIds.includes(id)))
    } else {
      // Select all visible items
      const visibleIds = sortedData.map((item) => item.id)
      const newSelection = [...new Set([...selectedIds, ...visibleIds])]
      onSelectionChange(newSelection)
    }
  }

  const toggleSelectOne = (id) => {
    if (!onSelectionChange) return
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Search and Filter Toggle */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'bg-violet-50 border-violet-300 text-violet-700'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter size={20} />
              Sía
              {activeFilterCount > 0 && (
                <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        {showFilters && filters.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Síur</span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-violet-600 hover:text-violet-800"
                >
                  Hreinsa allar síur
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filters.map((filter) => (
                <div key={filter.key}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    {filter.label}
                  </label>
                  <select
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
                  >
                    <option value="">Allt</option>
                    {filterOptions[filter.key]?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && !showFilters && (
          <div className="flex flex-wrap gap-2 mt-3">
            {Object.entries(activeFilters).map(([key, value]) => {
              if (!value) return null
              const filter = filters.find((f) => f.key === key)
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm"
                >
                  {filter?.label}: {value}
                  <button
                    onClick={() => handleFilterChange(key, undefined)}
                    className="hover:bg-violet-200 rounded-full p-0.5"
                  >
                    <X size={14} />
                  </button>
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-12">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someSelected
                    }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${
                    col.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {col.label}
                    {sortKey === col.key && (
                      sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.map((item, index) => (
              <tr
                key={item.id || index}
                className={`hover:bg-gray-50 transition-colors ${
                  selectable && selectedIds.includes(item.id) ? 'bg-violet-50' : ''
                } ${rowClassName ? rowClassName(item) : ''}`}
              >
                {selectable && (
                  <td className="px-4 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelectOne(item.id)}
                      className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
        {sortedData.length} af {data.length} færslum
      </div>
    </div>
  )
}
