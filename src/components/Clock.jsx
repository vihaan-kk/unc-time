import { useState, useEffect } from 'react'
import './Clock.css'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="clock">
      <h1>Current Time</h1>
      <div className="time-display">
        {time.toLocaleTimeString()}
      </div>
      <div className="date-display">
        {time.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </div>
    </div>
  )
}

export default Clock
