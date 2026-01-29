import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown } from 'lucide-react'
import { exportToCSV, exportToExcel } from '../utils/export'

export default function ExportButton({ data, columns, filename = 'export' }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExportCSV = () => {
    exportToCSV(data, columns, filename)
    setIsOpen(false)
  }

  const handleExportExcel = () => {
    exportToExcel(data, columns, filename)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
      >
        <Download size={20} />
        Flytja út gögn
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
          <button
            onClick={handleExportCSV}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded">CSV</span>
            Fyrir Excel / Power BI
          </button>
          <button
            onClick={handleExportExcel}
            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          >
            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded">XLS</span>
            Excel skjal
          </button>
        </div>
      )}
    </div>
  )
}
