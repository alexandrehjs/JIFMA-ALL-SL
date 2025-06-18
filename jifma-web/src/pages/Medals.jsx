import React, { useState, useEffect } from 'react'
import { Medal, Trophy, Award, Crown } from 'lucide-react'
import axios from 'axios'

const Medals = () => {
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMedals()
  }, [])

  const fetchMedals = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/medals')
      setStandings(response.data)
      setError('')
    } catch (error) {
      console.error('Erro ao carregar quadro de medalhas:', error)
      // Fallback para dados mock se a API não estiver disponível
      setStandings([
        {
          team_id: '1',
          team_name: 'Informática',
          gold_medals: 3,
          silver_medals: 1,
          bronze_medals: 2,
          total_medals: 6
        },
        {
          team_id: '2',
          team_name: 'Agropecuária',
          gold_medals: 2,
          silver_medals: 2,
          bronze_medals: 1,
          total_medals: 5
        },
        {
          team_id: '3',
          team_name: 'Administração',
          gold_medals: 1,
          silver_medals: 2,
          bronze_medals: 2,
          total_medals: 5
        },
        {
          team_id: '4',
          team_name: 'Edificações',
          gold_medals: 0,
          silver_medals: 1,
          bronze_medals: 1,
          total_medals: 2
        }
      ])
      setError('Conectado aos dados locais (API indisponível)')
    } finally {
      setLoading(false)
    }
  }

  // Ordenar por ouro, depois prata, depois bronze
  const sortedStandings = [...standings].sort((a, b) => {
    if (a.gold_medals !== b.gold_medals) {
      return b.gold_medals - a.gold_medals
    }
    if (a.silver_medals !== b.silver_medals) {
      return b.silver_medals - a.silver_medals
    }
    return b.bronze_medals - a.bronze_medals
  })

  const getPositionIcon = (position) => {
    switch (position) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <Trophy className="h-6 w-6 text-gray-500" />
    }
  }

  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white'
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando quadro de medalhas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quadro de Medalhas
          </h1>
          <p className="text-xl text-gray-600">
            Classificação geral das equipes no JIFMA 2024
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Pódio - Top 3 */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Pódio</h2>
          <div className="flex justify-center items-end space-x-4 md:space-x-8">
            {sortedStandings.slice(0, 3).map((team, index) => {
              const position = index + 1
              const heights = ['h-32', 'h-40', 'h-28'] // 2º, 1º, 3º
              const orders = [1, 0, 2] // Ordem visual: 2º, 1º, 3º
              const actualIndex = orders.indexOf(index)
              
              return (
                <div key={team.team_id} className={`text-center ${index === 1 ? 'order-2' : index === 0 ? 'order-1' : 'order-3'}`}>
                  <div className={`${getPositionColor(position)} ${heights[actualIndex]} w-24 md:w-32 rounded-t-lg flex flex-col justify-end items-center p-4 shadow-lg`}>
                    <div className="mb-2">
                      {getPositionIcon(position)}
                    </div>
                    <div className="text-lg md:text-xl font-bold">{position}º</div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-bold text-gray-900 text-sm md:text-base">{team.team_name}</h3>
                    <div className="flex justify-center space-x-2 mt-2 text-xs md:text-sm">
                      <span className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>{team.gold_medals}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span>{team.silver_medals}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                        <span>{team.bronze_medals}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tabela Completa */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-blue-600 text-white">
            <h2 className="text-xl font-bold">Classificação Geral</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipe
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span>Ouro</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      <span>Prata</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-4 h-4 bg-amber-600 rounded-full"></div>
                      <span>Bronze</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedStandings.map((team, index) => (
                  <tr key={team.team_id} className={`hover:bg-gray-50 ${index < 3 ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getPositionIcon(index + 1)}
                        <span className="text-lg font-bold text-gray-900">{index + 1}º</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-medium text-gray-900">{team.team_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-2xl font-bold text-yellow-600">{team.gold_medals}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-2xl font-bold text-gray-500">{team.silver_medals}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-2xl font-bold text-amber-600">{team.bronze_medals}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-2xl font-bold text-blue-600">{team.total_medals}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Medal className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total de Medalhas</h3>
            <p className="text-3xl font-bold text-blue-600">
              {sortedStandings.reduce((sum, team) => sum + team.total_medals, 0)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipes Participantes</h3>
            <p className="text-3xl font-bold text-blue-600">{sortedStandings.length}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Líder Atual</h3>
            <p className="text-xl font-bold text-blue-600">
              {sortedStandings.length > 0 ? sortedStandings[0].team_name : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Medals

