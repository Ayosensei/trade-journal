import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { UndoProvider } from './context/UndoContext'
import { ThemeProvider } from './context/ThemeContext'
import { JournalProvider } from './context/JournalContext'
import { GoalsProvider } from './context/GoalsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DataProvider>
        <UndoProvider>
          <ThemeProvider>
            <JournalProvider>
              <GoalsProvider>
                <App />
              </GoalsProvider>
            </JournalProvider>
          </ThemeProvider>
        </UndoProvider>
      </DataProvider>
    </AuthProvider>
  </StrictMode>,
)

