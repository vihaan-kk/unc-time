import { useState } from 'react'
import Clock from './components/Clock'
import DarkModeToggle from './components/DarkModeToggle'
import './App.css'
import ScheduleUpload from './components/Upload'
import Countdowns from './components/Countdowns'

function App() {
  const [events, setEvents] = useState([])
  const [showSchedule, setShowSchedule] = useState(false)

  return (
    <>
      <DarkModeToggle />
      <div className="app-container">
        <Clock events={events} />
        
        <div className="controls">
          <button onClick={() => setShowSchedule(!showSchedule)} className="toggle-btn">
            {showSchedule ? 'Hide Schedule' : 'Show Schedule'}
          </button>
        </div>

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
