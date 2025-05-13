import { useState } from 'react'
import { AlgorithmType } from './types'
import TSTDemo from './components/TSTDemo'
import LDDemo from './components/LDDemo'
import SpellChecker from './components/SpellChecker'
import Team from './components/Team'
import HelpGuide from './components/HelpGuide'
import ThemeToggle from './components/ThemeToggle'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

function App() {
  const [activeAlgorithm, setActiveAlgorithm] = useState<AlgorithmType>('TST')
  const [showSpellChecker, setShowSpellChecker] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const getActiveTab = () => {
    if (showSpellChecker) return 'Spell'
    return activeAlgorithm
  }

  return (
    <ThemeProvider>
      <div className="app">
        <ThemeToggle />
        <header className="app-header">
          <h1>Thuật toán TST và Levenshtein Distance</h1>
          <Team />
        </header>

        <nav className="menu">
          <button 
            className={activeAlgorithm === 'TST' && !showSpellChecker ? 'active' : ''}
            onClick={() => {
              setActiveAlgorithm('TST')
              setShowSpellChecker(false)
            }}
          >
            Ternary Search Tree
          </button>
          <button 
            className={activeAlgorithm === 'LD' && !showSpellChecker ? 'active' : ''}
            onClick={() => {
              setActiveAlgorithm('LD')
              setShowSpellChecker(false)
            }}
          >
            Levenshtein Distance
          </button>
          <button
            className={showSpellChecker ? 'active' : ''}
            onClick={() => setShowSpellChecker(true)}
          >
            Kiểm tra chính tả
          </button>
        </nav>

        <main className="content">
          {!showSpellChecker && (
            <div className="algorithm-description">
              {activeAlgorithm === 'TST' ? (
                <p>
                  Thuật toán Ternary Search Tree (TST) là một cấu trúc dữ liệu hiệu quả 
                  để lưu trữ và tìm kiếm chuỗi, đặc biệt hữu ích cho việc tự động hoàn thành 
                  và gợi ý từ.
                </p>
              ) : (
                <p>
                  Thuật toán Levenshtein Distance đo lường sự khác biệt giữa hai chuỗi 
                  dựa trên số lượng thao tác (thêm, xóa, thay thế) cần thiết để chuyển 
                  đổi từ chuỗi này sang chuỗi khác.
                </p>
              )}
            </div>
          )}
          {showSpellChecker ? (
            <SpellChecker />
          ) : activeAlgorithm === 'TST' ? (
            <TSTDemo />
          ) : (
            <LDDemo />
          )}
        </main>

        <button 
          className="help-button" 
          onClick={() => setShowHelp(true)}
          aria-label="Hiển thị hướng dẫn"
        >
          ?
        </button>

        <HelpGuide 
          isOpen={showHelp} 
          onClose={() => setShowHelp(false)} 
          activeTab={getActiveTab()}
        />
      </div>
    </ThemeProvider>
  )
}

export default App