import { Link, useLocation } from 'wouter'
import { Home, FileText, CreditCard } from 'lucide-react'

export function Navigation() {
  const [location] = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/payments', label: 'Payments', icon: CreditCard },
    { path: '/documents', label: 'Documents', icon: FileText },
  ]

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location === path
              return (
                <Link
                  key={path}
                  href={path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
