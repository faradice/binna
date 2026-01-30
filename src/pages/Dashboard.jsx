import { School, Users, UserCheck, Briefcase, Mail, FileSpreadsheet, CalendarCheck } from 'lucide-react'
import StatCard from '../components/StatCard'
import { skolar, nemendur, adstandendur, starfsmenn } from '../data/mockData'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { t } = useLanguage()
  const { hasAccess, user } = useAuth()

  const totalNemendur = skolar.reduce((sum, s) => sum + s.nemendafjoldi, 0)
  const totalStarfsmenn = skolar.reduce((sum, s) => sum + s.starfsmannafjoldi, 0)

  const getRoleName = (role) => {
    return t(`auth.roles.${role}`)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.titill')}</h1>
        <p className="text-gray-700">{t('dashboard.lysing')}</p>
        {user && (
          <p className="text-sm text-violet-800 mt-1">
            {t('auth.login')}: {user.nafn} ({getRoleName(user.role)})
          </p>
        )}
      </div>

      {/* Stats - show based on role access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {hasAccess('/skolar') && (
          <StatCard
            title={t('nav.skolar')}
            value={skolar.length}
            icon={School}
            color="violet"
          />
        )}
        {hasAccess('/nemendur') && (
          <StatCard
            title={t('nav.nemendur')}
            value={totalNemendur}
            icon={Users}
            color="blue"
          />
        )}
        {hasAccess('/adstandendur') && (
          <StatCard
            title={t('nav.adstandendur')}
            value={adstandendur.length}
            icon={UserCheck}
            color="green"
          />
        )}
        {hasAccess('/starfsmenn') && (
          <StatCard
            title={t('nav.starfsmenn')}
            value={totalStarfsmenn}
            icon={Briefcase}
            color="purple"
          />
        )}
        {hasAccess('/vinnuskyrslur') && (
          <StatCard
            title={t('nav.vinnuskyrslur')}
            value={starfsmenn.length}
            icon={FileSpreadsheet}
            color="orange"
          />
        )}
        {hasAccess('/astundun') && (
          <StatCard
            title={t('nav.astundun')}
            value={`${nemendur.length}`}
            icon={CalendarCheck}
            color="teal"
          />
        )}
        {hasAccess('/postur') && (
          <StatCard
            title={t('nav.fjoldapostur')}
            value={'-'}
            icon={Mail}
            color="pink"
          />
        )}
      </div>

      {/* Quick overview - show based on role */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schools overview - visible to skolaskrifstofa and admin */}
        {hasAccess('/skolar') && (
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
                    <p className="text-sm text-gray-600">{skoli.heimilisfang}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{skoli.nemendafjoldi}</p>
                    <p className="text-xs text-gray-600">{t('nav.nemendur').toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students overview - visible to skolaskrifstofa and admin */}
        {hasAccess('/nemendur') && (
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
                    <p className="text-sm text-gray-600">{nemandi.skoli}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold bg-violet-100 text-violet-800 rounded">
                    {nemandi.argangur}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff overview - visible to starfsmannastjori and admin */}
        {hasAccess('/starfsmenn') && !hasAccess('/nemendur') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('nav.starfsmenn')}</h2>
            <div className="space-y-3">
              {starfsmenn.slice(0, 5).map((starfsm) => (
                <div
                  key={starfsm.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{starfsm.nafn}</p>
                    <p className="text-sm text-gray-600">{starfsm.skoli}</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded">
                    {starfsm.deild}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff by school - for starfsmannastjori */}
        {hasAccess('/starfsmenn') && !hasAccess('/skolar') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('nav.skolar')} - {t('nav.starfsmenn')}</h2>
            <div className="space-y-3">
              {skolar.map((skoli) => (
                <div
                  key={skoli.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">{skoli.nafn}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{skoli.starfsmannafjoldi}</p>
                    <p className="text-xs text-gray-600">{t('nav.starfsmenn').toLowerCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Communications welcome - for samskipti role */}
        {hasAccess('/postur') && !hasAccess('/skolar') && !hasAccess('/starfsmenn') && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('nav.fjoldapostur')}</h2>
            <div className="text-center py-8">
              <Mail size={48} className="mx-auto text-violet-600 mb-4" aria-hidden="true" />
              <p className="text-gray-700 mb-2">{t('postur.lysing')}</p>
              <div className="flex justify-center gap-8 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{starfsmenn.length}</p>
                  <p className="text-sm text-gray-700">{t('postur.starfsmenn')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{adstandendur.length}</p>
                  <p className="text-sm text-gray-700">{t('postur.adstandendur')}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{nemendur.filter(n => n.argangur >= 10).length}</p>
                  <p className="text-sm text-gray-700">{t('postur.nempidarYfir18')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
