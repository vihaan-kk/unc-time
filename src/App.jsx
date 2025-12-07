import { useState, useEffect } from 'react'
import Clock from './components/Clock'
import DarkModeToggle from './components/DarkModeToggle'
import './App.css'
import ScheduleUpload from './components/Upload'
import Countdowns from './components/Countdowns'
import calendarLight from './assets/calendarlight.svg'
import calendarDark from './assets/calendardark.svg'

function App() {
  const [events, setEvents] = useState([])
  const [showSchedule, setShowSchedule] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('darkmode')
    } else {
      document.body.classList.remove('darkmode')
    }
  }, [isDarkMode])

  return (
    <>
      <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
      <div className="app-container">
        <Clock events={events} />
        
        <button onClick={() => setShowSchedule(!showSchedule)} className="toggle-btn">
          <img src={isDarkMode ? calendarDark : calendarLight} alt="Toggle Schedule" />
        </button>

        {showSchedule && (
          <div className="schedule-section">
            <ScheduleUpload onScheduleParsed={setEvents} />
            <Countdowns events={events} />
          </div>
        )}
      </div>
    </>
  )
}

export default App
