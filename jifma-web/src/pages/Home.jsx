import React from 'react'
import {Link} from 'react-router-dom'
import {Trophy, Calendar, Users, MapPin, ArrowRight, Zap, Target, Award, BarChart3} from 'lucide-react'

const Home = () => {
    const sports = [
        {name: 'Futsal', icon: '⚽', color: 'from-green-400 to-green-600'},
        {name: 'Futebol de Campo', icon: '🏈', color: 'from-blue-400 to-blue-600'},
        {name: 'Vôlei de Praia', icon: '🏐', color: 'from-yellow-400 to-orange-500'},
        {name: 'Vôlei de Quadra', icon: '🏐', color: 'from-purple-400 to-purple-600'},
        {name: 'Handebol', icon: '🤾', color: 'from-red-400 to-red-600'},
        {name: 'Basquete', icon: '🏀', color: 'from-orange-400 to-orange-600'},
    ]

    const quickStats = [
        {label: 'Equipes', value: '4', icon: Users, color: 'text-blue-600'},
        {label: 'Modalidades', value: '6', icon: Trophy, color: 'text-green-600'},
        {label: 'Jogos', value: '24', icon: Calendar, color: 'text-purple-600'},
        {label: 'Participantes', value: '50+', icon: Target, color: 'text-orange-600'},
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section
                className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0">
                    <div
                        className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
                    <div
                        className="absolute top-32 right-20 w-16 h-16 bg-yellow-400 opacity-20 rounded-full animate-bounce"></div>
                    <div
                        className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400 opacity-15 rounded-full animate-ping"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <div className="animate-bounce">
                            <Trophy className="h-16 w-16 mx-auto mb-6 text-yellow-400"/>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                            JIFMA Polo 3 2025
                        </h1>

                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Jogos Internos do IFMA Polo 3
                        </p>

                        <div
                            className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-lg mb-8">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5"/>
                                <span>Julho 2025</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5"/>
                                <span>Campus Caxias</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5"/>
                                <span>6 Modalidades</span>
                            </div>
                        </div>

                        <div>
                            <Link
                                to="/noticias"
                                className="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-blue-900 font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                            >
                                <span>Ver Últimas Notícias</span>
                                <ArrowRight size={20}/>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {quickStats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <div
                                    key={index}
                                    className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
                                >
                                    <Icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`}/>
                                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Modalidades */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Modalidades Esportivas
                        </h2>
                        <p className="text-xl text-gray-600">
                            Seis modalidades emocionantes para você acompanhar
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {sports.map((sport, index) => (
                            <Link
                                to={{
                                    pathname: "/resultados",
                                    search: `?modalidade=${sport.name.toLowerCase()}`
                                }}
                                key={index}
                                className={`bg-gradient-to-br ${sport.color} rounded-xl p-6 text-center text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
                            >
                                <div className="text-4xl mb-4 hover:scale-110 transition-transform duration-300">
                                    {sport.icon}
                                </div>
                                <h3 className="text-lg font-semibold">
                                    {sport.name}
                                </h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Zap className="h-16 w-16 mx-auto mb-6 text-yellow-400"/>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Acompanhe Todos os Resultados
                        </h2>
                        <p className="text-xl mb-8 text-blue-100">
                            Fique por dentro de tudo que acontece no JIFMA Polo 3 2025
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link
                                to="/resultados"
                                className="inline-flex items-center space-x-2 bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                            >
                                <BarChart3 size={20}/>
                                <span>Ver Resultados</span>
                            </Link>
                            <Link
                                to="/medalhas"
                                className="inline-flex items-center space-x-2 bg-yellow-500 text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
                            >
                                <Award size={20}/>
                                <span>Quadro de Medalhas</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home

