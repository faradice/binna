import { useState } from 'react'
import {
  School,
  ChevronDown,
  ChevronRight,
  Users,
  X,
  GraduationCap,
  UsersRound,
  Download,
  FileSpreadsheet,
  Check
} from 'lucide-react'
import { useSkolar, useNemendur, useBekkir } from '../services/hooks'
import { useLanguage } from '../contexts/LanguageContext'

export default function Skolar() {
  const { t } = useLanguage()
  const [expandedSchools, setExpandedSchools] = useState({})
  const [expandedGrades, setExpandedGrades] = useState({})
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showExportMenu, setShowExportMenu] = useState(null)
  const [selectedClasses, setSelectedClasses] = useState([])

  // Fetch data from API
  const { data: skolar = [], isLoading: isLoadingSkolar } = useSkolar()
  const { data: nemendur = [], isLoading: isLoadingNemendur } = useNemendur()
  const { data: bekkir = [], isLoading: isLoadingBekkir } = useBekkir()

  const isLoading = isLoadingSkolar || isLoadingNemendur || isLoadingBekkir

  // Toggle class selection
  const toggleClassSelection = (classId, e) => {
    e.stopPropagation()
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    )
  }

  // Clear all selections
  const clearSelections = () => {
    setSelectedClasses([])
  }

  // Get selected classes data
  const getSelectedClassesData = () => {
    return bekkir.filter(b => selectedClasses.includes(b.id))
  }

  // Export students from selected classes
  const exportSelectedStudents = () => {
    const selectedClassesData = getSelectedClassesData()
    let allStudents = []

    selectedClassesData.forEach(cls => {
      const students = cls.pirrindi === 'hopur'
        ? nemendur.filter(n => n.hopar?.includes(cls.id))
        : nemendur.filter(n => n.bekkurId === cls.id)
      allStudents = [...allStudents, ...students]
    })

    // Remove duplicates
    const uniqueStudents = [...new Map(allStudents.map(s => [s.id, s])).values()]

    const headers = [t('nemendur.nafn'), t('nemendur.kennitala'), t('skolar.bekkur'), t('nemendur.kyn'), t('nemendur.heimili')]
    const rows = uniqueStudents.map(s => [s.nafn, s.kennitala, s.bekkur, s.kyn, s.heimili])
    const csv = [headers, ...rows].map(row => row.join(';')).join('\n')

    const classNames = selectedClassesData.map(c => c.nafn).join('_')
    downloadCSV(csv, `${classNames}_nemendur.csv`)
  }

  // Export gender distribution for selected classes
  const exportSelectedGenderDistribution = () => {
    const selectedClassesData = getSelectedClassesData()
    const headers = [t('skolar.bekkur'), t('export.drpigar'), t('export.stulkur'), t('export.pirar'), t('export.pisamtals')]
    const rows = []

    let totalDrpigar = 0, totalStulkur = 0, totalAnnad = 0

    selectedClassesData.forEach(cls => {
      const students = cls.pirrindi === 'hopur'
        ? nemendur.filter(n => n.hopar?.includes(cls.id))
        : nemendur.filter(n => n.bekkurId === cls.id)

      const drpigar = students.filter(s => s.kyn === 'Drengur').length
      const stulkur = students.filter(s => s.kyn === 'Stúlka').length
      const annad = students.filter(s => s.kyn !== 'Drengur' && s.kyn !== 'Stúlka').length
      totalDrpigar += drpigar
      totalStulkur += stulkur
      totalAnnad += annad
      rows.push([cls.nafn, drpigar, stulkur, annad, drpigar + stulkur + annad])
    })

    rows.push([t('export.pisamtals'), totalDrpigar, totalStulkur, totalAnnad, totalDrpigar + totalStulkur + totalAnnad])

    const csv = [headers, ...rows].map(row => row.join(';')).join('\n')
    downloadCSV(csv, `valdir_bekkir_kynjaskipting.csv`)
  }

  // Export counts for selected classes
  const exportSelectedCounts = () => {
    const selectedClassesData = getSelectedClassesData()
    const headers = [t('skolar.bekkur'), t('export.fjoldi')]
    const rows = []

    let total = 0
    selectedClassesData.forEach(cls => {
      const count = cls.pirrindi === 'hopur'
        ? nemendur.filter(n => n.hopar?.includes(cls.id)).length
        : nemendur.filter(n => n.bekkurId === cls.id).length
      total += count
      rows.push([cls.nafn, count])
    })

    rows.push([t('export.pisamtals'), total])

    const csv = [headers, ...rows].map(row => row.join(';')).join('\n')
    downloadCSV(csv, `valdir_bekkir_fjoldi.csv`)
  }

  // CSV export helper
  const downloadCSV = (data, filename) => {
    const BOM = '\uFEFF'
    const csv = BOM + data
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
    URL.revokeObjectURL(link.href)
  }

  // Export student list for a class/group
  const exportStudentList = (students, groupName) => {
    const headers = [t('nemendur.nafn'), t('nemendur.kennitala'), t('skolar.bekkur'), t('nemendur.kyn')]
    const rows = students.map(s => [s.nafn, s.kennitala, s.bekkur, s.kyn])
    const csv = [headers, ...rows].map(row => row.join(';')).join('\n')
    downloadCSV(csv, `${groupName}_nemendur.csv`)
  }

  // Export grade/class counts for a school
  const exportSchoolCounts = (schoolId, schoolName) => {
    const grades = getGradesForSchool(schoolId)

    const headers = [t('skolar.argangur'), t('skolar.bekkur'), t('export.fjoldi')]
    const rows = []

    grades.forEach(grade => {
      const classesInGrade = bekkir.filter(b => b.skoliId === schoolId && b.argangur === grade && b.pirrindi === 'bekkur')
      classesInGrade.forEach(cls => {
        const count = nemendur.filter(n => n.bekkurId === cls.id).length
        rows.push([`${grade}. ${t('skolar.argangur')}`, cls.nafn, count])
      })
    })

    const csv = [headers, ...rows].map(row => row.join(';')).join('\n')
    downloadCSV(csv, `${schoolName}_bekkjafjoldi.csv`)
  }

  // Export gender distribution for a school
  const exportGenderDistribution = (schoolId, schoolName) => {
    const schoolStudents = nemendur.filter(n => n.skoliId === schoolId)
    const grades = getGradesForSchool(schoolId)

    const headers = [t('skolar.argangur'), t('export.drpigar'), t('export.stulkur'), t('export.pirar'), t('export.pisamtals')]
    const rows = []

    let totalDrpigar = 0, totalStulkur = 0, totalAnnad = 0

    grades.forEach(grade => {
      const gradeStudents = schoolStudents.filter(s => s.argangsNumer === grade)
      const drpigar = gradeStudents.filter(s => s.kyn === 'Drengur').length
      const stulkur = gradeStudents.filter(s => s.kyn === 'Stúlka').length
      const annad = gradeStudents.filter(s => s.kyn !== 'Drengur' && s.kyn !== 'Stúlka').length
      totalDrpigar += drpigar
      totalStulkur += stulkur
      totalAnnad += annad
      rows.push([`${grade}. ${t('skolar.argangur')}`, drpigar, stulkur, annad, drpigar + stulkur + annad])
    })

    rows.push([t('export.pisamtals'), totalDrpigar, totalStulkur, totalAnnad, totalDrpigar + totalStulkur + totalAnnad])

    const csv = [headers, ...rows].map(row => row.join(';')).join('\n')
    downloadCSV(csv, `${schoolName}_kynjaskipting.csv`)
  }

  // Export all students for a school
  const exportAllStudents = (schoolId, schoolName) => {
    const schoolStudents = nemendur.filter(n => n.skoliId === schoolId)
    const headers = [t('nemendur.nafn'), t('nemendur.kennitala'), t('skolar.argangur'), t('skolar.bekkur'), t('nemendur.kyn'), t('nemendur.heimili')]
    const rows = schoolStudents.map(s => [s.nafn, s.kennitala, s.argangur, s.bekkur, s.kyn, s.heimili])
    const csv = [headers, ...rows].map(row => row.join(';')).join('\n')
    downloadCSV(csv, `${schoolName}_allir_nemendur.csv`)
  }

  // Toggle school expansion
  const toggleSchool = (schoolId) => {
    setExpandedSchools(prev => ({
      ...prev,
      [schoolId]: !prev[schoolId]
    }))
  }

  // Toggle grade expansion
  const toggleGrade = (schoolId, grade) => {
    const key = `${schoolId}-${grade}`
    setExpandedGrades(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  // Get grades for a school
  const getGradesForSchool = (schoolId) => {
    const schoolBekkir = bekkir.filter(b => b.skoliId === schoolId)
    const grades = [...new Set(schoolBekkir.map(b => b.argangur))].sort((a, b) => a - b)
    return grades
  }

  // Get classes and groups for a school and grade
  const getClassesAndGroups = (schoolId, grade) => {
    return bekkir.filter(b => b.skoliId === schoolId && b.argangur === grade)
  }

  // Get students for a class or group
  const getStudentsForGroup = (groupId, isHopur) => {
    if (isHopur) {
      return nemendur.filter(n => n.hopar?.includes(groupId))
    }
    return nemendur.filter(n => n.bekkurId === groupId)
  }

  // Get student count for a class or group
  const getStudentCount = (groupId, isHopur) => {
    return getStudentsForGroup(groupId, isHopur).length
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('skolar.titill')}</h1>
        <p className="text-gray-700">{t('skolar.lysing')}</p>
      </div>

      {/* School list */}
      <div className="space-y-4">
        {skolar.map(school => {
          const isSchoolExpanded = expandedSchools[school.id]

          return (
            <div key={school.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* School header - clickable */}
              <div className="flex items-center">
                <button
                  onClick={() => toggleSchool(school.id)}
                  className="flex-1 p-4 flex items-center gap-3 hover:bg-gray-50 text-left"
                >
                  {isSchoolExpanded ? (
                    <ChevronDown size={20} className="text-gray-600" />
                  ) : (
                    <ChevronRight size={20} className="text-gray-600" />
                  )}
                  <School size={24} className="text-violet-700" />
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">{school.nafn}</h2>
                    <p className="text-sm text-gray-700">{school.heimilisfang} • {school.nemendafjoldi} {t('nav.nemendur').toLowerCase()}</p>
                  </div>
                </button>

                {/* Export menu */}
                <div className="relative pr-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowExportMenu(showExportMenu === school.id ? null : school.id)
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                    title={t('export.flytjaUt')}
                  >
                    <Download size={20} />
                  </button>

                  {showExportMenu === school.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowExportMenu(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                        <button
                          onClick={() => {
                            exportAllStudents(school.id, school.nafn)
                            setShowExportMenu(null)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left text-sm"
                        >
                          <FileSpreadsheet size={16} className="text-green-600" />
                          <span>{t('export.allirNempidar')}</span>
                        </button>
                        <button
                          onClick={() => {
                            exportSchoolCounts(school.id, school.nafn)
                            setShowExportMenu(null)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left text-sm"
                        >
                          <FileSpreadsheet size={16} className="text-blue-600" />
                          <span>{t('export.bekkjafjoldi')}</span>
                        </button>
                        <button
                          onClick={() => {
                            exportGenderDistribution(school.id, school.nafn)
                            setShowExportMenu(null)
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left text-sm"
                        >
                          <FileSpreadsheet size={16} className="text-violet-600" />
                          <span>{t('export.kynjaskipting')}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Grades - shown when school is expanded */}
              {isSchoolExpanded && (
                <div className="border-t border-gray-200 divide-y divide-gray-100">
                  {getGradesForSchool(school.id).length > 0 ? (
                    getGradesForSchool(school.id).map(grade => {
                      const gradeKey = `${school.id}-${grade}`
                      const isGradeExpanded = expandedGrades[gradeKey]
                      const classesAndGroups = getClassesAndGroups(school.id, grade)

                      return (
                        <div key={grade}>
                          {/* Grade header */}
                          <button
                            onClick={() => toggleGrade(school.id, grade)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left pl-12"
                          >
                            {isGradeExpanded ? (
                              <ChevronDown size={20} className="text-gray-600" />
                            ) : (
                              <ChevronRight size={20} className="text-gray-600" />
                            )}
                            <GraduationCap size={20} className="text-violet-600" />
                            <span className="font-medium text-gray-900">{grade}. {t('skolar.argangur')}</span>
                            <span className="ml-auto text-sm text-gray-600">
                              {classesAndGroups.filter(c => c.pirrindi === 'bekkur').length} {t('skolar.bekkir').toLowerCase()}, {classesAndGroups.filter(c => c.pirrindi === 'hopur').length} {t('skolar.hopar').toLowerCase()}
                            </span>
                          </button>

                          {/* Classes and groups */}
                          {isGradeExpanded && (
                            <div className="pl-20 pr-4 pb-3 space-y-2">
                              {/* Classes */}
                              {classesAndGroups.filter(c => c.pirrindi === 'bekkur').map(bekkur => (
                                <div
                                  key={bekkur.id}
                                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${
                                    selectedClasses.includes(bekkur.id) ? 'bg-violet-50 ring-2 ring-violet-300' : 'bg-gray-50 hover:bg-gray-100'
                                  }`}
                                >
                                  <div
                                    onClick={(e) => toggleClassSelection(bekkur.id, e)}
                                    className={`w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${
                                      selectedClasses.includes(bekkur.id)
                                        ? 'bg-violet-700 border-violet-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                  >
                                    {selectedClasses.includes(bekkur.id) && (
                                      <Check size={14} className="text-white" />
                                    )}
                                  </div>
                                  <button
                                    onClick={() => setSelectedGroup({ ...bekkur, isHopur: false })}
                                    className="flex-1 flex items-center gap-3 text-left"
                                  >
                                    <Users size={18} className="text-blue-600" />
                                    <span className="font-medium text-gray-900">{bekkur.nafn}</span>
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                                      {t('skolar.bekkur')}
                                    </span>
                                    <span className="ml-auto text-sm text-gray-600">
                                      {getStudentCount(bekkur.id, false)} {t('nav.nemendur').toLowerCase()}
                                    </span>
                                  </button>
                                </div>
                              ))}

                              {/* Groups */}
                              {classesAndGroups.filter(c => c.pirrindi === 'hopur').map(hopur => (
                                <div
                                  key={hopur.id}
                                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg ${
                                    selectedClasses.includes(hopur.id) ? 'bg-violet-50 ring-2 ring-violet-300' : 'bg-gray-50 hover:bg-gray-100'
                                  }`}
                                >
                                  <div
                                    onClick={(e) => toggleClassSelection(hopur.id, e)}
                                    className={`w-5 h-5 min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer ${
                                      selectedClasses.includes(hopur.id)
                                        ? 'bg-violet-700 border-violet-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                  >
                                    {selectedClasses.includes(hopur.id) && (
                                      <Check size={14} className="text-white" />
                                    )}
                                  </div>
                                  <button
                                    onClick={() => setSelectedGroup({ ...hopur, isHopur: true })}
                                    className="flex-1 flex items-center gap-3 text-left"
                                  >
                                    <UsersRound size={18} className="text-green-600" />
                                    <span className="font-medium text-gray-900">{hopur.nafn}</span>
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 rounded">
                                      {t('skolar.hopur')}
                                    </span>
                                    <span className="ml-auto text-sm text-gray-600">
                                      {getStudentCount(hopur.id, true)} {t('nav.nemendur').toLowerCase()}
                                    </span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-8 text-center text-gray-600">
                      {t('skolar.engirBekkir')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Floating export bar for selected classes */}
      {selectedClasses.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedClasses.length} {selectedClasses.length === 1 ? t('skolar.bekkur') : t('skolar.bekkir')} {t('common.valdir')}
            </span>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <button
                onClick={exportSelectedStudents}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                <FileSpreadsheet size={16} />
                <span>{t('export.allirNempidar')}</span>
              </button>
              <button
                onClick={exportSelectedCounts}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                <FileSpreadsheet size={16} />
                <span>{t('export.fjoldi')}</span>
              </button>
              <button
                onClick={exportSelectedGenderDistribution}
                className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 text-sm font-medium"
              >
                <FileSpreadsheet size={16} />
                <span>{t('export.kynjaskipting')}</span>
              </button>
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <button
              onClick={clearSelections}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600"
              title={t('common.hreinsa')}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Student modal */}
      {selectedGroup && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSelectedGroup(null)}
            />
            <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  {selectedGroup.isHopur ? (
                    <UsersRound size={24} className="text-green-600" />
                  ) : (
                    <Users size={24} className="text-blue-600" />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedGroup.nafn}</h3>
                    <p className="text-sm text-gray-600">
                      {selectedGroup.isHopur ? t('skolar.nempidarIHop') : t('skolar.nempidarIBekk')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const students = getStudentsForGroup(selectedGroup.id, selectedGroup.isHopur)
                      exportStudentList(students, selectedGroup.nafn)
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                    title={t('export.flytjaUt')}
                  >
                    <Download size={16} />
                    <span>{t('export.flytjaUt')}</span>
                  </button>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                    aria-label={t('skolar.loka')}
                  >
                    <X size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Student list */}
              <div className="overflow-y-auto max-h-[60vh]">
                {getStudentsForGroup(selectedGroup.id, selectedGroup.isHopur).length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{t('nemendur.nafn')}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{t('nemendur.kennitala')}</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">{t('skolar.bekkur')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {getStudentsForGroup(selectedGroup.id, selectedGroup.isHopur).map(student => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                                <span className="text-violet-800 font-semibold text-sm">
                                  {student.nafn.charAt(0)}
                                </span>
                              </div>
                              <span className="font-medium text-gray-900">{student.nafn}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{student.kennitala}</td>
                          <td className="px-4 py-3 text-gray-700">{student.bekkur}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-gray-600">
                    {t('skolar.engirNempidar')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
