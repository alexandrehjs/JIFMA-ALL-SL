import React, { useState, useEffect } from 'react'
import { Trophy, Calendar, MapPin, Users, Filter } from 'lucide-react'
import axios from 'axios'

const Results = () => {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSport, setSelectedSport] = useState('all')

  const sports = [
    { id: 'all', name: 'Todas as Modalidades' },
    { id: 'futsal', name: 'Futsal' },
    { id: 'futebol_campo', name: 'Futebol de Campo' },
    { id: 'volei_praia', name: 'Vôlei de Praia' },
    { id: 'volei_quadra', name: 'Vôlei de Quadra' },
    { id: 'handebol', name: 'Handebol' },
    { id: 'basquete', name: 'Basquete' }
  ]

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/games')
      setGames(response.data)
      setError('')
    } catch (error) {
      console.error('Erro ao carregar jogos:', error)
      // Fallback para dados mock se a API não estiver disponível
      setGames([
        {
          game_id: '1',
          sport_name: 'Futsal',
          team1_name: 'Informática',
          team2_name: 'Edificações',
          team1_score: 4,
          team2_score: 2,
          game_date: '2024-12-15T14:00:00',
          location: 'Ginásio Principal',
          status: 'finalizado'
        },
        {
          game_id: '2',
          sport_name: 'Basquete',
          team1_name: 'Agropecuária',
          team2_name: 'Administração',
          team1_score: 78,
          team2_score: 65,
          game_date: '2024-12-15T16:00:00',
          location: 'Quadra Externa',
          status: 'finalizado'
        },
        {
          game_id: '3',
          sport_name: 'Vôlei de Quadra',
          team1_name: 'Informática',
          team2_name: 'Agropecuária',
          team1_score: 3,
          team2_score: 1,
          game_date: '2024-12-14T10:00:00',
          location: 'Ginásio Principal',
          status: 'finalizado'
        },
        {
          game_id: '4',
          sport_name: 'Handebol',
          team1_name: 'Administração',
          team2_name: 'Edificações',
          team1_score: 25,
          team2_score: 22,
          game_date: '2024-12-14T14:00:00',
          location: 'Quadra Externa',
          status: 'finalizado'
        },
        {
          game_id: '5',
          sport_name: 'Futsal',
          team1_name: 'Agropecuária',
          team2_name: 'Administração',
          team1_score: 3,
          team2_score: 1,
          game_date: '2024-12-16T15:00:00',
          location: 'Ginásio Principal',
          status: 'finalizado'
        },
        {
          game_id: '6',
          sport_name: 'Vôlei de Praia',
          team1_name: 'Informática',
          team2_name: 'Edificações',
          team1_score: 2,
          team2_score: 0,
          game_date: '2024-12-16T09:00:00',
          location: 'Quadra de Areia',
          status: 'finalizado'
        },
        {
          game_id: '7',
          sport_name: 'Basquete',
          team1_name: 'Informática',
          team2_name: 'Edificações',
          team1_score: 0,
          team2_score: 0,
          game_date: '2024-12-17T16:00:00',
          location: 'Quadra Externa',
          status: 'agendado'
        },
        {
          game_id: '8',
          sport_name: 'Handebol',
          team1_name: 'Agropecuária',
          team2_name: 'Informática',
          team1_score: 0,
          team2_score: 0,
          game_date: '2024-12-17T18:00:00',
          location: 'Ginásio Principal',
          status: 'agendado'
        }
      ])
      setError('Conectado aos dados locais (API indisponível)')
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
      case 'finalizado':
        return 'bg-green-100 text-green-800'
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800'
      case 'agendado':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'finalizado':
        return 'Finalizado'
      case 'em_andamento':
        return 'Em Andamento'
      case 'agendado':
        return 'Agendado'
      default:
        return 'Indefinido'
    }
  }

  const filteredGames = selectedSport === 'all' 
    ? games 
    : games.filter(game => game.sport_name?.toLowerCase().replace(/\s+/g, '_').replace('ô', 'o') === selectedSport)

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
            <Filter className="h-5 w-5 text-gray-600" />
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
                      <Trophy className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {game.sport_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(game.game_date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{game.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{game.team1_name}</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {game.status === 'finalizado' ? game.team1_score : '-'}
                      </div>
                    </div>

                    <div className="text-center px-4">
                      <div className="text-gray-400 font-bold text-xl">VS</div>
                    </div>

                    <div className="text-center flex-1">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="font-medium text-gray-900">{game.team2_name}</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {game.status === 'finalizado' ? game.team2_score : '-'}
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
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
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

