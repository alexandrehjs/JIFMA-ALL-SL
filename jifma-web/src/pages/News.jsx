import React, { useState, useEffect } from 'react'
import { Newspaper, Clock, User, Search } from 'lucide-react'
import axios from 'axios'

const News = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/news')
      setNews(response.data)
      setError('')
    } catch (error) {
      console.error('Erro ao carregar notícias:', error)
      // Fallback para dados mock se a API não estiver disponível
      setNews([
        {
          news_id: '1',
          title: 'Abertura dos Jogos JIFMA 2024',
          content: 'A cerimônia de abertura dos Jogos Internos do IFMA Campus Caxias aconteceu com grande sucesso, marcando o início de uma semana repleta de competições esportivas entre os cursos técnicos.',
          author: 'Coordenação JIFMA',
          created_at: '2024-12-15T08:00:00',
          image_url: null
        },
        {
          news_id: '2',
          title: 'Informática vence primeira partida de Futsal',
          content: 'A equipe do curso de Informática estreou com vitória nos jogos de futsal, vencendo a equipe de Edificações por 4 a 2 em partida emocionante no ginásio principal.',
          author: 'Redação JIFMA',
          created_at: '2024-12-15T14:30:00',
          image_url: null
        },
        {
          news_id: '3',
          title: 'Basquete: Agropecuária surpreende e vence Administração',
          content: 'Em jogo disputado ponto a ponto, a equipe de Agropecuária conseguiu uma vitória importante sobre Administração por 78 a 65, mostrando grande evolução técnica.',
          author: 'Redação JIFMA',
          created_at: '2024-12-15T16:45:00',
          image_url: null
        },
        {
          news_id: '4',
          title: 'Vôlei de Quadra: Informática mantém invencibilidade',
          content: 'A equipe de Informática venceu mais uma partida no vôlei de quadra, desta vez contra Agropecuária por 3 sets a 1, mantendo-se na liderança da modalidade.',
          author: 'Redação JIFMA',
          created_at: '2024-12-14T10:15:00',
          image_url: null
        },
        {
          news_id: '5',
          title: 'Handebol: Administração conquista primeira vitória',
          content: 'Após duas derrotas consecutivas, a equipe de Administração conseguiu sua primeira vitória no handebol, vencendo Edificações por 25 a 22 em partida equilibrada.',
          author: 'Redação JIFMA',
          created_at: '2024-12-14T14:20:00',
          image_url: null
        },
        {
          news_id: '6',
          title: 'Programação do final de semana definida',
          content: 'A coordenação dos jogos divulgou a programação completa do final de semana, com destaque para as finais de algumas modalidades que acontecerão no domingo.',
          author: 'Coordenação JIFMA',
          created_at: '2024-12-13T18:00:00',
          image_url: null
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

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando notícias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Notícias do JIFMA
          </h1>
          <p className="text-xl text-gray-600">
            Fique por dentro de todas as novidades dos Jogos Internos
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">{error}</p>
          </div>
        )}

        {/* Barra de Pesquisa */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Pesquisar notícias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista de Notícias */}
        <div className="space-y-6">
          {filteredNews.map((item) => (
            <article
              key={item.news_id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                  <Newspaper className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {item.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              Nenhuma notícia encontrada para "{searchTerm}".
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default News

