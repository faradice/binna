import { NavLink, Outlet } from 'react-router-dom'
import {
  School,
  Users,
  UserCheck,
  Briefcase,
  LayoutDashboard,
  Mail,
  FileSpreadsheet,
  CalendarCheck,
  Globe,
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, labelKey: 'nav.yfirlit' },
  { to: '/skolar', icon: School, labelKey: 'nav.skolar' },
  { to: '/nemendur', icon: Users, labelKey: 'nav.nemendur' },
  { to: '/adstandendur', icon: UserCheck, labelKey: 'nav.adstandendur' },
  { to: '/starfsmenn', icon: Briefcase, labelKey: 'nav.starfsmenn' },
  { to: '/vinnuskyrslur', icon: FileSpreadsheet, labelKey: 'nav.vinnuskyrslur' },
  { to: '/astundun', icon: CalendarCheck, labelKey: 'nav.astundun' },
  { to: '/postur', icon: Mail, labelKey: 'nav.fjoldapostur' },
]

export default function Layout() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">{t('common.sveitarfelag')}</h1>
          <p className="text-sm text-gray-500">Bollabyggð</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-violet-50 text-violet-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className="font-medium">{t(item.labelKey)}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Language Switcher */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <Globe size={16} className="text-gray-400" />
            <div className="flex rounded-lg overflow-hidden border border-gray-200">
              <button
                onClick={() => setLanguage('is')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  language === 'is'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                IS
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-violet-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                EN
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-400">Commune v1.0</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
