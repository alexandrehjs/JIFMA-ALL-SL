import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Trophy, Calendar, Info, Medal, Newspaper, BarChart3, Settings, TrendingUp } from 'lucide-react'
// import Logo from "../assets/bira_logo_center.svg"
import Logo from "../assets/jifma-logo.svg"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Início', href: '/', icon: Trophy },
    { name: 'Notícias', href: '/noticias', icon: Newspaper },
    { name: 'Resultados', href: '/resultados', icon: BarChart3 },
    { name: 'Medalhas', href: '/medalhas', icon: Medal },
    { name: 'Tabela', href: '/tabela', icon: Calendar },
    { name: 'Sobre', href: '/sobre', icon: Info },
    // { name: 'Estatísticas', href: '/estatisticas', icon: TrendingUp },
    // { name: 'Admin', href: '/admin', icon: Settings },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} width={60}/>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">JIFMA</h1>
              <p className="text-xs text-gray-600">Etapa Estadual</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

