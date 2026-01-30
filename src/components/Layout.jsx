import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
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
  LogOut,
  Key,
  ChevronDown,
  UserCog,
  Newspaper,
} from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import PasswordModal from './PasswordModal'

const navItems = [
  { to: '/', icon: LayoutDashboard, labelKey: 'nav.yfirlit' },
  { to: '/skolar', icon: School, labelKey: 'nav.skolar' },
  { to: '/nemendur', icon: Users, labelKey: 'nav.nemendur' },
  { to: '/adstandendur', icon: UserCheck, labelKey: 'nav.adstandendur' },
  { to: '/starfsmenn', icon: Briefcase, labelKey: 'nav.starfsmenn' },
  { to: '/vinnuskyrslur', icon: FileSpreadsheet, labelKey: 'nav.vinnuskyrslur' },
  { to: '/astundun', icon: CalendarCheck, labelKey: 'nav.astundun' },
  { to: '/postur', icon: Mail, labelKey: 'nav.fjoldapostur' },
  { to: '/frettir', icon: Newspaper, labelKey: 'nav.frettir' },
]

export default function Layout() {
  const { language, setLanguage, t } = useLanguage()
  const { user, logout, hasAccess } = useAuth()
  const navigate = useNavigate()

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => hasAccess(item.to))

  // Check if user is admin to show Notendur link
  const isAdmin = user?.role === 'admin'

  const getRoleName = (role) => {
    return t(`auth.roles.${role}`)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">{t('common.sveitarfelag')}</h1>
          <p className="text-sm text-gray-700">Bollabyggð</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-violet-100 text-violet-800 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span className="font-medium">{t(item.labelKey)}</span>
                </NavLink>
              </li>
            ))}

            {/* Admin-only: User Management */}
            {isAdmin && (
              <li className="pt-4 mt-4 border-t border-gray-200">
                <NavLink
                  to="/notendur"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-violet-100 text-violet-800 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`
                  }
                >
                  <UserCog size={20} />
                  <span className="font-medium">{t('nav.notendur')}</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* User info and actions */}
        <div className="border-t border-gray-200">
          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <div className="h-10 w-10 bg-violet-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-violet-600 font-medium">
                  {user?.nafn?.charAt(0) || '?'}
                </span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.nafn}
                </p>
                <p className="text-xs text-gray-700 truncate">
                  {user?.role && getRoleName(user.role)}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-600 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 mx-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => {
                    setIsPasswordModalOpen(true)
                    setIsUserMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Key size={16} />
                  <span>{t('auth.changePassword')}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span>{t('auth.logout')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Globe size={16} className="text-gray-600" aria-hidden="true" />
              <div className="flex rounded-lg overflow-hidden border border-gray-300" role="group" aria-label="Language selection">
                <button
                  onClick={() => setLanguage('is')}
                  aria-pressed={language === 'is'}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    language === 'is'
                      ? 'bg-violet-700 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  IS
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  aria-pressed={language === 'en'}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-violet-700 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-600">Commune v1.0</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {/* Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}
