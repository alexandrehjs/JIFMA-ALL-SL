import React, {useState, useEffect} from 'react'
import {Trophy, Calendar, MapPin, Users, Filter} from 'lucide-react'
import axios from 'axios'
import {useLocation, useSearchParams} from "react-router-dom";
import api from '@/config/api';

const Results = () => {
    const [games, setGames] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedSport, setSelectedSport] = useState('all')

    const sportsDefault = [
        {id: 'all', name: 'Todas as Modalidades'},
    ]

    const [sports, setSports] = useState([sportsDefault])

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const sportSearch = searchParams.get('modalidade');
        setSelectedSport(sportSearch ? sportSearch.toLowerCase() : "all");
        fetchGames()
    }, [])

    const fetchGames = async () => {
        try {
            setLoading(true)
            const response = await axios.get(`${api.baseURL}/api/games`)
            const sportResponse = await axios.get(`${api.baseURL}/api/sports`)
            const newSports = sportResponse.data.map((item) => ({
                'id': item.name.toLowerCase(),
                'name': item.name
            }))
            setSports([...sportsDefault, ...newSports])
            setGames(response.data)
            setError('')
        } catch (error) {
            console.error('Erro ao carregar jogos:', error)
            setError('Erro ao carregar os dados, tente recarregar a página!')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'Finalizado':
                return 'bg-green-100 text-green-800'
            case 'Em Andamento':
                return 'bg-blue-100 text-blue-800'
            case 'Agendado':
                return 'bg-yellow-100 text-yellow-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'Finalizado':
                return 'Finalizado'
            case 'Em Andamento':
                return 'Em Andamento'
            case 'Agendado':
                return 'Agendado'
            default:
                return 'Indefinido'
        }
    }

    const filteredGamesFunction = () => {
        const gamesFilter = games.filter(game => game.sport_name?.toLowerCase() === selectedSport)
        if (selectedSport === 'all' || gamesFilter.length === 0) {
            return games
        }
        return gamesFilter
    }
    const filteredGames = filteredGamesFunction()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando resultados...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Resultados dos Jogos
                    </h1>
                    <p className="text-xl text-gray-600">
                        Acompanhe os resultados de todas as modalidades do JIFMA
                    </p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">{error}</p>
                    </div>
                )}

                {/* Filtro por Modalidade */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Filter className="h-5 w-5 text-gray-600"/>
                        <span className="text-gray-700 font-medium">Filtrar por modalidade:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {sports.map((sport) => (
                            <button
                                key={sport.id}
                                onClick={() => setSelectedSport(sport.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                                    selectedSport === sport.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            >
                                {sport.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista de Resultados */}
                <div className="space-y-6">
                    {filteredGames.map((game) => (
                        <div
                            key={game.game_id}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Trophy className="h-5 w-5 text-blue-600"/>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {game.sport_name}
                                            </h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <Calendar className="h-4 w-4"/>
                                                    <span>{formatDate(game.game_date)}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="h-4 w-4"/>
                                                    <span>{game.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                                        <div className="text-center flex-1">
                                            <div className="flex items-center justify-center space-x-2 mb-2">
                                                <Users className="h-4 w-4 text-gray-600"/>
                                                <span className="font-medium text-gray-900">{game.team_a_name}</span>
                                            </div>
                                            <div className="text-2xl font-bold text-blue-600">
                                                {game.status === 'Finalizado' || game.status === 'Em Andamento' ? game.score_a : '-'}
                                            </div>
                                        </div>

                                        <div className="text-center px-4">
                                            <div className="text-gray-400 font-bold text-xl">VS</div>
                                        </div>

                                        <div className="text-center flex-1">
                                            <div className="flex items-center justify-center space-x-2 mb-2">
                                                <Users className="h-4 w-4 text-gray-600"/>
                                                <span className="font-medium text-gray-900">{game.team_b_name}</span>
                                            </div>
                                            <div className="text-2xl font-bold text-blue-600">
                                                {game.status === 'Finalizado' || game.status === 'Em Andamento' ? game.score_b : '-'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-0 md:ml-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(game.status)}`}>
                    {getStatusText(game.status)}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredGames.length === 0 && (
                    <div className="text-center py-12">
                        <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4"/>
                        <p className="text-gray-500 text-lg">
                            Nenhum resultado encontrado para a modalidade selecionada.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Results

