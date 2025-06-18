import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import News from './pages/News'
import Results from './pages/Results'
import Medals from './pages/Medals'
import Schedule from './pages/Schedule'
import Statistics from './pages/Statistics'
import Admin from './pages/Admin'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/noticias" element={<News />} />
            <Route path="/resultados" element={<Results />} />
            <Route path="/medalhas" element={<Medals />} />
            <Route path="/tabela" element={<Schedule />} />
            <Route path="/estatisticas" element={<Statistics />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

