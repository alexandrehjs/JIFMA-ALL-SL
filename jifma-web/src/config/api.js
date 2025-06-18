// Configuração da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://lnh8imcdj15y.manus.space'

export const api = {
  baseURL: API_BASE_URL,
  endpoints: {
    news: `${API_BASE_URL}/api/news`,
    sports: `${API_BASE_URL}/api/sports`,
    teams: `${API_BASE_URL}/api/teams`,
    games: `${API_BASE_URL}/api/games`,
    medals: `${API_BASE_URL}/api/medals`
  }
}

export default api

