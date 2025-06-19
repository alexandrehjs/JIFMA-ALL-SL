import React, {useState, useEffect} from 'react'
import {
    Users,
    Trophy,
    Calendar,
    Newspaper,
    Medal,
    Settings,
    BarChart3,
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    Search,
    Filter,
    Download,
    Upload,
    RefreshCw
} from 'lucide-react'
import axios from 'axios'
import {string} from "zod";

const AdminPanel = ({onLogout}) => {
    const [activeSection, setActiveSection] = useState('dashboard')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')

    // Estados para diferentes seções
    const [news, setNews] = useState([])
    const [games, setGames] = useState([])
    const [teams, setTeams] = useState([])
    const [sports, setSports] = useState([])
    const [medals, setMedals] = useState([])

    // Estados para modais
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')
    const [editingItem, setEditingItem] = useState(null)

    // Estados para formulários
    const [formData, setFormData] = useState({})

    useEffect(() => {
        loadData()
    }, [activeSection])

    const loadData = async () => {
        setLoading(true)
        try {
            switch (activeSection) {
                case 'dashboard':
                    Promise.all([axios.get('http://localhost:5000/api/news'), axios.get('http://localhost:5000/api/games'), axios.get('http://localhost:5000/api/teams'), axios.get('http://localhost:5000/api/sports'), axios.get('http://localhost:5000/api/medals')]).then(([news, games, teams, sports, medals]) => {
                        setNews(news.data)
                        setGames(games.data)
                        setTeams(teams.data)
                        setSports(sports.data)
                        setMedals(medals.data)
                    })
                    break
                case 'news':
                    let newsResponse = await axios.get('http://localhost:5000/api/news')
                    setNews(newsResponse.data)
                    break
                case 'games':
                    let gamesResponse = await axios.get('http://localhost:5000/api/games')
                    setGames(gamesResponse.data)
                    break
                case 'teams':
                    let teamsResponse = await axios.get('http://localhost:5000/api/teams')
                    setTeams(teamsResponse.data)
                    break
                case 'sports':
                    let sportsResponse = await axios.get('http://localhost:5000/api/sports')
                    setSports(sportsResponse.data)
                    break
                case 'medals':
                    let medalsResponse = await axios.get('http://localhost:5000/api/medals')
                    setMedals(medalsResponse.data)
                    break
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            showMessage('Erro ao carregar dados', 'error')
        } finally {
            setLoading(false)
        }
    }

    const showMessage = (text, type = 'success') => {
        setMessage(text)
        setMessageType(type)
        setTimeout(() => {
            setMessage('')
            setMessageType('')
        }, 3000)
    }

    const openModal = (type, item = null) => {
        setModalType(type)
        console.log(item)
        setEditingItem(item)
        setFormData(item || {})
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setModalType('')
        setEditingItem(null)
        setFormData({})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = localStorage.getItem('jifma_token')
            const config = {
                headers: {Authorization: `Bearer ${token}`}
            }

            let endpoint = ''
            let method = 'post'

            switch (modalType) {
                case 'news':
                    endpoint = editingItem ? `/api/admin/news/${editingItem.news_id}` : '/api/admin/news'
                    method = editingItem ? 'put' : 'post'
                    break
                case 'game':
                    endpoint = editingItem ? `/api/admin/games/${editingItem.game_id}` : '/api/admin/games'
                    method = editingItem ? 'put' : 'post'
                    break
                case 'team':
                    endpoint = editingItem ? `/api/admin/teams/${editingItem.team_id}` : '/api/admin/teams'
                    method = editingItem ? 'put' : 'post'
                    break
                case 'sport':
                    endpoint = editingItem ? `/api/admin/sports/${editingItem.sport_id}` : '/api/admin/sports'
                    method = editingItem ? 'put' : 'post'
                    break
                case 'medal':
                    endpoint = editingItem ? `/api/admin/medals/${editingItem.team_id}` : '/api/admin/medals'
                    method = editingItem ? 'put' : 'post'
                    break
            }

            await axios[method](`http://localhost:5000${endpoint}`, formData, config)

            showMessage(editingItem ? 'Item atualizado com sucesso!' : 'Item criado com sucesso!')
            closeModal()
            loadData()
        } catch (error) {
            console.error('Erro ao salvar:', error)
            showMessage('Erro ao salvar item', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (type, id) => {
        if (!confirm('Tem certeza que deseja excluir este item?')) return

        setLoading(true)
        try {
            const token = localStorage.getItem('jifma_token')
            const config = {
                headers: {Authorization: `Bearer ${token}`}
            }

            let endpoint = ''
            switch (type) {
                case 'news':
                    endpoint = `/api/admin/news/${id}`
                    break
                case 'game':
                    endpoint = `/api/admin/games/${id}`
                    break
                case 'team':
                    endpoint = `/api/admin/teams/${id}`
                    break
                case 'sport':
                    endpoint = `/api/admin/sports/${id}`
                    break
                case 'medal':
                    endpoint = `/api/admin/medals/${id}`
                    break
            }

            await axios.delete(`http://localhost:5000${endpoint}`, config)
            showMessage('Item excluído com sucesso!')
            loadData()
        } catch (error) {
            console.error('Erro ao excluir:', error)
            showMessage('Erro ao excluir item', 'error')
        } finally {
            setLoading(false)
        }
    }

    const renderDashboard = () => (<div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100">Total de Notícias</p>
                        <p className="text-3xl font-bold">{news.length}</p>
                    </div>
                    <Newspaper className="h-12 w-12 text-blue-200"/>
                </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-100">Total de Jogos</p>
                        <p className="text-3xl font-bold">{games.length}</p>
                    </div>
                    <Trophy className="h-12 w-12 text-green-200"/>
                </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-purple-100">Equipes</p>
                        <p className="text-3xl font-bold">{teams.length}</p>
                    </div>
                    <Users className="h-12 w-12 text-purple-200"/>
                </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-orange-100">Modalidades</p>
                        <p className="text-3xl font-bold">{sports.length}</p>
                    </div>
                    <Medal className="h-12 w-12 text-orange-200"/>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h3>
                <div className="space-y-3">
                    <button
                        onClick={() => openModal('news')}
                        className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                        <Plus className="h-5 w-5 text-blue-600"/>
                        <span className="text-blue-700 font-medium">Nova Notícia</span>
                    </button>
                    <button
                        onClick={() => openModal('game')}
                        className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200"
                    >
                        <Plus className="h-5 w-5 text-green-600"/>
                        <span className="text-green-700 font-medium">Novo Jogo</span>
                    </button>
                    <button
                        onClick={() => openModal('team')}
                        className="w-full flex items-center space-x-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200"
                    >
                        <Plus className="h-5 w-5 text-purple-600"/>
                        <span className="text-purple-700 font-medium">Nova Equipe</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Estatísticas Rápidas</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Jogos Finalizados</span>
                        <span className="font-bold text-green-600">
                {games.filter(g => g.status.toLowerCase() === 'finalizado').length}
              </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Jogos Agendados</span>
                        <span className="font-bold text-yellow-600">
                {games.filter(g => g.status.toLowerCase() === 'agendado').length}
              </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Notícias Publicadas</span>
                        <span className="font-bold text-blue-600">{news.length}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>)

    const renderDataTable = (data, type) => {
        if (loading) {
            return (<div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>)
        }

        const getColumns = () => {
            switch (type) {
                case 'news':
                    return ['Título', 'Autor', 'Data', 'Ações']
                case 'games':
                    return ['Modalidade', 'Equipes', 'Placar', 'Data', 'Status', 'Ações']
                case 'teams':
                    return ['Nome', 'Cidade', 'Ações']
                case 'sports':
                    return ['Nome', 'Descrição', 'Tipo', 'Ações']
                case 'medals':
                    return ['Equipe', 'Ouro', 'Prata', 'Bronze', 'Total', 'Ações']
                default:
                    return []
            }
        }

        const renderRow = (item) => {
            switch (type) {
                case 'news':
                    return (<>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                                {new Date(item.publication_date).toLocaleDateString('pt-BR')}
                            </div>
                        </td>
                    </>)
                case 'games':
                    return (<>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.sport_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                                {item.team_a_name} vs {item.team_b_name}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                                {item.score_a == null ? "_" : item.score_a} x {item.score_b == null ? "_" : item.score_b}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                                {new Date(item.game_date).toLocaleDateString('pt-BR')}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === 'Finalizado' ? 'bg-green-100 text-green-800' : item.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {item.status}
                </span>
                        </td>
                    </>)
                case 'teams':
                    return (<>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.city || 'N/A'}</div>
                        </td>
                    </>)
                case 'sports':
                    return (<>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.description || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.type || 'N/A'}</div>
                        </td>
                    </>)
                case 'medals':
                    return (<>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.team_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.gold_medals || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.silver_medals || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.bronze_medals || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{item.total_medals || 'N/A'}</div>
                        </td>
                    </>)
                default:
                    return null
            }
        }

        return (<div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                        Gerenciar {type === 'news' ? 'Notícias' : type === 'games' ? 'Jogos' : type === 'teams' ? 'Equipes' : type === 'medals' ? 'Medalhas' : 'Modalidades'}
                    </h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => loadData()}
                            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                        >
                            <RefreshCw className="h-4 w-4"/>
                            <span>Atualizar</span>
                        </button>
                        <button
                            onClick={() => openModal(type === 'games' ? 'game' : type === 'teams' ? 'team' : type === 'sports' ? 'sport' : type === 'medals' ? 'medal' : type)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                            <Plus className="h-4 w-4"/>
                            <span>Novo</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {getColumns().map((column) => (<th
                            key={column}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            {column}
                        </th>))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item) => (<tr key={item.news_id || item.game_id || item.team_id || item.sport_id}
                                             className="hover:bg-gray-50">
                        {renderRow(item)}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => openModal(type === 'games' ? 'game' : type === 'teams' ? 'team' : type === 'sports' ? 'sport' : type === 'medals' ? 'medal' : type, item)}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    <Edit className="h-4 w-4"/>
                                </button>
                                <button
                                    onClick={() => handleDelete(type === 'games' ? 'game' : type === 'teams' ? 'team' : type === 'sports' ? 'sport' : type === 'medals' ? 'medal' : type, item.news_id || item.game_id || item.team_id || item.sport_id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </button>
                            </div>
                        </td>
                    </tr>))}
                    </tbody>
                </table>
            </div>

            {data.length === 0 && (<div className="text-center py-12">
                <p className="text-gray-500">Nenhum item encontrado.</p>
            </div>)}
        </div>)
    }

    const renderModal = () => {
        if (!showModal) return null

        const getModalTitle = () => {
            const action = editingItem ? 'Editar' : 'Criar'
            switch (modalType) {
                case 'news':
                    return `${action} Notícia`
                case 'game':
                    return `${action} Jogo`
                case 'team':
                    return `${action} Equipe`
                case 'sport':
                    return `${action} Modalidade`
                case 'medal':
                    return `${action} Medalhas`
                default:
                    return action
            }
        }

        const renderFormFields = () => {
            switch (modalType) {
                case 'news':
                    return (<>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                            <input
                                type="text"
                                value={formData.title || ''}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Conteúdo</label>
                            <textarea
                                value={formData.content || ''}
                                onChange={(e) => setFormData({...formData, content: e.target.value})}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
                            <input
                                type="text"
                                value={formData.author || ''}
                                onChange={(e) => setFormData({...formData, author: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">URL da Imagem</label>
                            <input
                                type="url"
                                value={formData.image_url || ''}
                                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </>)
                case 'team':
                    return (<>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Equipe</label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cidade da Equipe</label>
                            <input
                                type="text"
                                value={formData.city || ''}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </>)
                case 'sport':
                    return (<>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da
                                Modalidade</label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                            <select
                                value={formData.type || ''}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Selecione um tipo</option>
                                <option value="Individual">Individual</option>
                                <option value="Coletiva">Coletiva</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </>)
                case 'game':
                    return <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Modalidade</label>
                            <select
                                name="sport_id"
                                value={formData.sport_id || ''}
                                onChange={(e) => setFormData({...formData, sport_id: e.target.value})}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecione uma modalidade</option>
                                {sports.map(sport => (<option key={sport.sport_id} value={sport.sport_id}>
                                    {sport.name}
                                </option>))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Equipe A</label>
                                <select
                                    name="team_a_id"
                                    value={formData.team_a_id || ''}
                                    onChange={(e) => setFormData({...formData, team_a_id: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Selecione equipe A</option>
                                    {teams.map(team => (<option key={team.team_id} value={team.team_id}>
                                        {team.name}
                                    </option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Equipe B</label>
                                <select
                                    name="team_b_id"
                                    value={formData.team_b_id || ''}
                                    onChange={(e) => setFormData({...formData, team_b_id: e.target.value})}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Selecione equipe B</option>
                                    {teams.map(team => (<option key={team.team_id} value={team.team_id}>
                                        {team.name}
                                    </option>))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Data e Hora</label>
                            <input
                                type="datetime-local"
                                name="game_date"
                                value={formData.game_date ? new Date(formData.game_date).toISOString().slice(0, 16) : ''}
                                onChange={(e) => setFormData({...formData, game_date: e.target.value})}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Local</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location || ''}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                name="status"
                                value={formData.status || 'Agendado'}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Agendado">Agendado</option>
                                <option value="Em Andamento">Em Andamento</option>
                                <option value="Finalizado">Finalizado</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Placar Equipe A</label>
                                <input
                                    type="number"
                                    name="score_a"
                                    value={formData.score_a || ''}
                                    onChange={(e) => setFormData({...formData, score_a: e.target.value})}
                                    min={0}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Placar Equipe B</label>
                                <input
                                    type="number"
                                    name="score_b"
                                    value={formData.score_b || ''}
                                    onChange={(e) => setFormData({...formData, score_b: e.target.value})}
                                    min={0}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </>
                case 'medal':
                    return (<>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Equipe</label>
                            <select
                                name="team_a_id"
                                value={formData.team_id || ''}
                                onChange={(e) => setFormData({...formData, team_id: e.target.value})}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                                disabled={!!editingItem}
                            >
                                <option value="">Selecione a equipe</option>
                                {teams.map(team => (<option key={team.team_id} value={team.team_id}>
                                    {team.name}
                                </option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medalhas de Ouro</label>
                            <input
                                type="number"
                                min={0}
                                value={formData.gold_medals || ''}
                                onChange={(e) => setFormData({...formData, gold_medals: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medalhas de
                                Prata</label>
                            <input
                                type="number"
                                min={0}
                                value={formData.silver_medals || ''}
                                onChange={(e) => setFormData({...formData, silver_medals: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Medalhas de
                                Bronze</label>
                            <input
                                type="number"
                                min={0}
                                value={formData.bronze_medals || ''}
                                onChange={(e) => setFormData({...formData, bronze_medals: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </>)
                default:
                    return null
            }
        }

        return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">{getModalTitle()}</h3>
                    <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {renderFormFields()}

                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>)
    }

    const sidebarItems = [{id: 'dashboard', name: 'Dashboard', icon: BarChart3}, {
        id: 'news',
        name: 'Notícias',
        icon: Newspaper
    }, {id: 'games', name: 'Jogos', icon: Trophy}, {id: 'teams', name: 'Equipes', icon: Users}, {
        id: 'sports',
        name: 'Modalidades',
        icon: Medal
    }, {id: 'medals', name: 'Medalhas', icon: Medal}, {id: 'settings', name: 'Configurações', icon: Settings}]

    return (<div className="flex h-screen bg-gray-100">
        {/* Sidebar Melhorado */}
        <div className="w-64 bg-white shadow-xl">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Admin JIFMA</h2>
                <p className="text-sm text-gray-600">Painel de Controle</p>
            </div>

            <nav className="mt-6">
                {sidebarItems.map((item) => {
                    const Icon = item.icon
                    return (<button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${activeSection === item.id ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-700' : 'text-gray-700'}`}
                    >
                        <Icon
                            className={`h-5 w-5 ${activeSection === item.id ? 'text-blue-600' : 'text-gray-500'}`}/>
                        <span className="font-medium">{item.name}</span>
                    </button>)
                })}
            </nav>

            <div className="absolute bottom-0 w-64 p-6 border-t border-gray-200">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                    <X className="h-5 w-5"/>
                    <span className="font-medium">Sair</span>
                </button>
            </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-auto">
            <div className="p-8">
                {/* Mensagens */}
                {message && (<div
                    className={`mb-6 p-4 rounded-lg ${messageType === 'error' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-green-50 border border-green-200 text-green-800'}`}>
                    {message}
                </div>)}

                {/* Conteúdo baseado na seção ativa */}
                {activeSection === 'dashboard' && renderDashboard()}
                {activeSection === 'news' && renderDataTable(news, 'news')}
                {activeSection === 'games' && renderDataTable(games, 'games')}
                {activeSection === 'teams' && renderDataTable(teams, 'teams')}
                {activeSection === 'sports' && renderDataTable(sports, 'sports')}
                {activeSection === 'medals' && renderDataTable(medals, 'medals')}
                {activeSection === 'settings' && (<div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Configurações do Sistema</h3>
                    <p className="text-gray-600">Funcionalidades de configuração em desenvolvimento...</p>
                </div>)}
            </div>
        </div>

        {/* Modal */}
        {renderModal()}
    </div>)
}

export default AdminPanel

