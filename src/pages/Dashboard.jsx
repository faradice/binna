import { School, Users, UserCheck, Briefcase } from 'lucide-react'
import StatCard from '../components/StatCard'
import { skolar, nemendur, adstandendur, starfsmenn } from '../data/mockData'
import { useLanguage } from '../contexts/LanguageContext'

export default function Dashboard() {
  const { t } = useLanguage()
  const totalNemendur = skolar.reduce((sum, s) => sum + s.nemendafjoldi, 0)
  const totalStarfsmenn = skolar.reduce((sum, s) => sum + s.starfsmannafjoldi, 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.titill')}</h1>
        <p className="text-gray-500">{t('dashboard.lysing')}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={t('nav.skolar')}
          value={skolar.length}
          icon={School}
          color="violet"
        />
        <StatCard
          title={t('nav.nemendur')}
          value={totalNemendur}
          icon={Users}
          color="blue"
        />
        <StatCard
          title={t('nav.adstandendur')}
          value={adstandendur.length}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title={t('nav.starfsmenn')}
          value={totalStarfsmenn}
          icon={Briefcase}
          color="purple"
        />
      </div>

      {/* Quick overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('nav.skolar')}</h2>
          <div className="space-y-3">
            {skolar.map((skoli) => (
              <div
                key={skoli.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{skoli.nafn}</p>
                  <p className="text-sm text-gray-500">{skoli.heimilisfang}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{skoli.nemendafjoldi}</p>
                  <p className="text-xs text-gray-500">{t('nav.nemendur').toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('nav.nemendur')}</h2>
          <div className="space-y-3">
            {nemendur.slice(0, 5).map((nemandi) => (
              <div
                key={nemandi.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{nemandi.nafn}</p>
                  <p className="text-sm text-gray-500">{nemandi.skoli}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-violet-100 text-violet-700 rounded">
                  {t('nav.nemendur').slice(0, -2) + 'i'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
