import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Trophy, Users, Calendar, Target, Award } from 'lucide-react'

const Statistics = () => {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalGoals: 0,
    totalTeams: 0,
    averageScore: 0
  })
  const [teamStats, setTeamStats] = useState([])
  const [sportStats, setSportStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setStats({
        totalGames: 24,
        totalGoals: 156,
        totalTeams: 4,
        averageScore: 6.5
      })

      setTeamStats([
        { name: 'Informática', jogos: 8, vitorias: 6, empates: 1, derrotas: 1, pontos: 19 },
        { name: 'Administração', jogos: 8, vitorias: 5, empates: 2, derrotas: 1, pontos: 17 },
        { name: 'Agropecuária', jogos: 8, vitorias: 3, empates: 1, derrotas: 4, pontos: 10 },
        { name: 'Edificações', jogos: 8, vitorias: 1, empates: 0, derrotas: 7, pontos: 3 }
      ])

      setSportStats([
        { name: 'Futsal', jogos: 6, gols: 42 },
        { name: 'Basquete', jogos: 6, pontos: 468 },
        { name: 'Vôlei Quadra', jogos: 4, sets: 18 },
        { name: 'Handebol', jogos: 4, gols: 98 },
        { name: 'Vôlei Praia', jogos: 2, sets: 8 },
        { name: 'Futebol Campo', jogos: 2, gols: 12 }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando estatísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Estatísticas do JIFMA
          </h1>
          <p className="text-xl text-gray-600">
            Análise completa dos dados dos Jogos Internos
          </p>
        </div>

        {/* Cards de Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalGames}</div>
                <div className="text-gray-600">Jogos Realizados</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalGoals}</div>
                <div className="text-gray-600">Total de Pontos</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.totalTeams}</div>
                <div className="text-gray-600">Equipes Participantes</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">{stats.averageScore}</div>
                <div className="text-gray-600">Média de Pontos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Desempenho das Equipes */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <span>Desempenho das Equipes</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teamStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pontos" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição de Vitórias */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Award className="h-6 w-6 text-green-600" />
              <span>Distribuição de Vitórias</span>
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={teamStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, vitorias }) => `${name}: ${vitorias}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="vitorias"
                >
                  {teamStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estatísticas por Modalidade */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Estatísticas por Modalidade
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sportStats} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="jogos" fill="#10B981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabela Detalhada de Equipes */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              Classificação Detalhada
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900">Posição</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900">Equipe</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-900">Jogos</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-900">Vitórias</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-900">Empates</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-900">Derrotas</th>
                  <th className="text-center py-3 px-6 font-semibold text-gray-900">Pontos</th>
                </tr>
              </thead>
              <tbody>
                {teamStats
                  .sort((a, b) => b.pontos - a.pontos)
                  .map((team, index) => (
                    <tr key={team.name} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-bold text-lg">{index + 1}º</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">{team.name}</td>
                      <td className="py-4 px-6 text-center">{team.jogos}</td>
                      <td className="py-4 px-6 text-center text-green-600 font-semibold">{team.vitorias}</td>
                      <td className="py-4 px-6 text-center text-yellow-600 font-semibold">{team.empates}</td>
                      <td className="py-4 px-6 text-center text-red-600 font-semibold">{team.derrotas}</td>
                      <td className="py-4 px-6 text-center font-bold text-blue-600 text-lg">{team.pontos}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics

