// Export utilities for CSV and Excel

export function exportToCSV(data, columns, filename = 'export') {
  // Create header row
  const headers = columns.map((col) => col.label)

  // Create data rows
  const rows = data.map((item) =>
    columns.map((col) => {
      let value = item[col.key]
      // Handle arrays
      if (Array.isArray(value)) {
        value = value.join('; ')
      }
      // Handle null/undefined
      if (value === null || value === undefined) {
        value = ''
      }
      // Escape quotes and wrap in quotes if contains comma or quote
      value = String(value)
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        value = `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
  )

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n')

  // Add BOM for Excel to recognize UTF-8
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })

  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportToExcel(data, columns, filename = 'export') {
  // For true Excel format, we create an HTML table that Excel can open
  const headers = columns.map((col) => `<th>${escapeHtml(col.label)}</th>`).join('')

  const rows = data.map((item) => {
    const cells = columns.map((col) => {
      let value = item[col.key]
      if (Array.isArray(value)) {
        value = value.join('; ')
      }
      if (value === null || value === undefined) {
        value = ''
      }
      return `<td>${escapeHtml(String(value))}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Sheet1</x:Name>
              <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
    </head>
    <body>
      <table border="1">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body>
    </html>
  `

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.xls`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
