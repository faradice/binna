import { useState, useMemo, useRef } from 'react'
import { Send, Users, UserCheck, Briefcase, School, Check, AlertCircle, Paperclip, X, FileText, Image, File } from 'lucide-react'
import { skolar, nemendur, adstandendur, starfsmenn } from '../data/mockData'
import RichTextEditor from '../components/RichTextEditor'
import { useLanguage } from '../contexts/LanguageContext'

// Get unique árgangur values
const argangar = [...new Set(nemendur.map((n) => n.argangur))].sort()

export default function Postur() {
  const { t } = useLanguage()
  const [motttakandaTegund, setMotttakandaTegund] = useState('starfsmenn')

  const motttakendaTegundir = useMemo(() => [
    { id: 'starfsmenn', label: t('postur.starfsmenn'), icon: Briefcase },
    { id: 'adstandendur', label: t('postur.adstandendur'), icon: UserCheck },
    { id: 'nemendur', label: t('postur.nempidarYfir18'), icon: Users },
  ], [t])
  const [valdirSkolar, setValdirSkolar] = useState([])
  const [valdirArgangar, setValdirArgangar] = useState([])
  const [efni, setEfni] = useState('')
  const [texti, setTexti] = useState('')
  const [sendingStada, setSendingStada] = useState(null)
  const [error, setError] = useState(null)
  const [vidheng, setVidheng] = useState([])
  const fileInputRef = useRef(null)

  // Get recipients based on selection
  const motttakendur = useMemo(() => {
    if (valdirSkolar.length === 0) return []

    let result = []

    switch (motttakandaTegund) {
      case 'starfsmenn':
        result = starfsmenn.filter((s) => valdirSkolar.includes(s.skoli))
        break
      case 'nemendur':
        result = nemendur.filter((n) => {
          const skoliMatch = valdirSkolar.includes(n.skoli)
          const argangurMatch = valdirArgangar.length === 0 || valdirArgangar.includes(n.argangur)
          return skoliMatch && argangurMatch
        })
        break
      case 'adstandendur':
        // Get nemendur first, then find their aðstandendur
        const filteredNemendur = nemendur.filter((n) => {
          const skoliMatch = valdirSkolar.includes(n.skoli)
          const argangurMatch = valdirArgangar.length === 0 || valdirArgangar.includes(n.argangur)
          return skoliMatch && argangurMatch
        })
        const nemendurNofn = filteredNemendur.map((n) => n.nafn)
        result = adstandendur.filter((a) =>
          a.nemendur.some((n) => nemendurNofn.includes(n))
        )
        break
      default:
        result = []
    }

    return result
  }, [motttakandaTegund, valdirSkolar, valdirArgangar])

  const toggleSkoli = (skoliNafn) => {
    setValdirSkolar((prev) =>
      prev.includes(skoliNafn)
        ? prev.filter((s) => s !== skoliNafn)
        : [...prev, skoliNafn]
    )
  }

  const toggleArgangur = (argangur) => {
    setValdirArgangar((prev) =>
      prev.includes(argangur)
        ? prev.filter((a) => a !== argangur)
        : [...prev, argangur]
    )
  }

  const veljaAllaSkola = () => {
    setValdirSkolar(skolar.map((s) => s.nafn))
  }

  const hreinssaSkola = () => {
    setValdirSkolar([])
  }

  const veljaAllaArganga = () => {
    setValdirArgangar([...argangar])
  }

  const hreinssaArganga = () => {
    setValdirArgangar([])
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    const newVidheng = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    }))
    setVidheng((prev) => [...prev, ...newVidheng])
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  // Remove attachment
  const removeVidheng = (id) => {
    setVidheng((prev) => prev.filter((v) => v.id !== id))
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Get icon for file type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return Image
    if (type.includes('pdf') || type.includes('document')) return FileText
    return File
  }

  // Check if editor has content (not just empty paragraph)
  const hasContent = texti && texti !== '<p></p>' && texti.replace(/<[^>]*>/g, '').trim().length > 0

  const handleSend = async () => {
    if (motttakendur.length === 0 || !efni || !hasContent) {
      setError('Vinsamlegast fylltu út alla reiti og veldu móttakendur')
      return
    }

    setError(null)
    setSendingStada('sending')

    // Simulate sending (email útfærsla kemur seinna)
    setTimeout(() => {
      setSendingStada('sent')
      setTimeout(() => {
        setSendingStada(null)
        setEfni('')
        setTexti('')
        setVidheng([])
      }, 2000)
    }, 1000)
  }

  const showArgangar = motttakandaTegund === 'nemendur' || motttakandaTegund === 'adstandendur'

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('postur.titill')}</h1>
        <p className="text-gray-500">{t('postur.lysing')}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Selection */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recipient type */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">{t('postur.viditakendategund')}</h3>
            <div className="space-y-2">
              {motttakendaTegundir.map((tegund) => (
                <button
                  key={tegund.id}
                  onClick={() => {
                    setMotttakandaTegund(tegund.id)
                    setValdirArgangar([])
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    motttakandaTegund === tegund.id
                      ? 'bg-violet-50 text-violet-700 border-2 border-violet-300'
                      : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <tegund.icon size={20} />
                  <span className="font-medium">{tegund.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* School selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{t('postur.veljaSkola')}</h3>
              <div className="flex gap-2">
                <button
                  onClick={veljaAllaSkola}
                  className="text-xs text-violet-600 hover:text-violet-800"
                >
                  {t('common.veljaAlla')}
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={hreinssaSkola}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {t('common.hreinsa')}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {skolar.map((skoli) => (
                <label
                  key={skoli.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
                    valdirSkolar.includes(skoli.nafn)
                      ? 'bg-violet-50 border-2 border-violet-300'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={valdirSkolar.includes(skoli.nafn)}
                    onChange={() => toggleSkoli(skoli.nafn)}
                    className="w-4 h-4 text-violet-600 rounded focus:ring-violet-500"
                  />
                  <School size={18} className="text-gray-400" />
                  <div className="flex-1">
                    <span className="font-medium text-gray-700">{skoli.nafn}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({skoli.nemendafjoldi} nem.)
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Grade selection - only for nemendur and aðstandendur */}
          {showArgangar && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{t('postur.veljaArganga')}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={veljaAllaArganga}
                    className="text-xs text-violet-600 hover:text-violet-800"
                  >
                    {t('common.veljaAlla')}
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={hreinssaArganga}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    {t('common.hreinsa')}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                {t('postur.allirArgangar')}
              </p>
              <div className="flex flex-wrap gap-2">
                {argangar.map((argangur) => (
                  <button
                    key={argangur}
                    onClick={() => toggleArgangur(argangur)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      valdirArgangar.includes(argangur)
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {argangur}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column - Email composition */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipients preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Móttakendur</h3>
              <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                {motttakendur.length} {motttakendur.length === 1 ? 'móttakandi' : 'móttakendur'}
              </span>
            </div>
            {motttakendur.length > 0 ? (
              <div className="max-h-32 overflow-y-auto">
                <div className="flex flex-wrap gap-2">
                  {motttakendur.map((m) => (
                    <span
                      key={m.id}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      title={m.netfang}
                    >
                      {m.nafn}
                      <span className="ml-1 text-gray-400 text-xs">({m.netfang})</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                Veldu skóla til að sjá móttakendur
              </p>
            )}
          </div>

          {/* Email form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Tölvupóstur</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('postur.efni')}
                </label>
                <input
                  type="text"
                  value={efni}
                  onChange={(e) => setEfni(e.target.value)}
                  placeholder={t('postur.efniPlaceholder')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('postur.texti')}
                </label>
                <RichTextEditor
                  value={texti}
                  onChange={setTexti}
                  placeholder="Sláðu inn texta pósts..."
                />
              </div>

              {/* Attachments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('postur.vidhengi')}
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 text-sm text-violet-600 hover:text-violet-800"
                  >
                    <Paperclip size={16} />
                    {t('postur.baetaVidVidhengi')}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                {vidheng.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                    {vidheng.map((v) => {
                      const FileIcon = getFileIcon(v.type)
                      return (
                        <div
                          key={v.id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <FileIcon size={20} className="text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">{v.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(v.size)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeVidheng(v.id)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                    <Paperclip className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-sm text-gray-500">
                      {t('postur.engaVidhengi')}
                    </p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 text-sm text-violet-600 hover:text-violet-800"
                    >
                      {t('postur.baetaVidVidhengi')}
                    </button>
                  </div>
                )}

              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSend}
                  disabled={motttakendur.length === 0 || !efni || !hasContent || sendingStada === 'sending'}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    motttakendur.length === 0 || !efni || !hasContent || sendingStada === 'sending'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : sendingStada === 'sent'
                      ? 'bg-green-600 text-white'
                      : 'bg-violet-600 text-white hover:bg-violet-700'
                  }`}
                >
                  {sendingStada === 'sending' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ...
                    </>
                  ) : sendingStada === 'sent' ? (
                    <>
                      <Check size={20} />
                      Sent!
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      {t('postur.sendaPosta')} ({motttakendur.length} {t('postur.viditakpidar')})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
