import { useState, useEffect } from 'react'
import './Clock.css'

function Clock({ events = [] }) {
  const [now, setNow] = useState(new Date())
  const [status, setStatus] = useState({ type: 'free', message: '', subMessage: '' })

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    updateStatus()
  }, [now, events])

  function updateStatus() {
    if (!events || events.length === 0) {
      setStatus({ 
        type: 'free', 
        message: now.toLocaleTimeString(), 
        subMessage: now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) 
      })
      return
    }

    // Helper to parse time string "2:30 pm" to minutes from midnight
    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(/(?=[ap]m)/i)
      let [hours, minutes] = time.split(':').map(Number)
      if (modifier.toLowerCase() === 'pm' && hours < 12) hours += 12
      if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0
      return hours * 60 + minutes
    }

    const currentDay = now.getDay() // 0=Sun, 1=Mon, etc.
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const dayMap = { 'Mo': 1, 'Tu': 2, 'We': 3, 'Th': 4, 'Fr': 5, 'Sa': 6, 'Su': 0 }

    // Check if currently in class
    const currentClass = events.find(event => {
      if (!event.days || !event.startTime || !event.endTime) return false
      
      // Check if today is one of the class days
      const isToday = Object.entries(dayMap).some(([dayStr, dayNum]) => 
        event.days.includes(dayStr) && dayNum === currentDay
      )
      
      if (!isToday) return false

      const start = parseTime(event.startTime)
      const end = parseTime(event.endTime)
      
      return currentMinutes >= start && currentMinutes < end
    })

    if (currentClass) {
      const endMinutes = parseTime(currentClass.endTime)
      const diffMinutes = endMinutes - currentMinutes
      const diffSeconds = (endMinutes * 60) - (Math.floor(now.getTime() / 1000) % (24 * 3600))
      
      const endTime = new Date(now)
      const [endH, endM] = currentClass.endTime.split(/(?=[ap]m)/i)[0].split(':').map(Number)
      const isPM = currentClass.endTime.toLowerCase().includes('pm')
      let targetH = endH
      if (isPM && targetH < 12) targetH += 12
      if (!isPM && targetH === 12) targetH = 0
      endTime.setHours(targetH, endM, 0, 0)
      
      const diff = endTime - now
      const m = Math.floor(diff / 60000)
      const s = Math.floor((diff % 60000) / 1000)

      setStatus({
        type: 'class',
        message: `${m}m ${s}s`,
        subMessage: `Current: ${currentClass.name}`
      })
      return
    }

    // Find next class
    let nextClass = null
    let minDiff = Infinity

    events.forEach(event => {
      if (!event.days || !event.startTime) return

      // Check occurrences in the next 7 days
      for (let i = 0; i < 7; i++) {
        const checkDate = new Date(now)
        checkDate.setDate(now.getDate() + i)
        const checkDay = checkDate.getDay()

        const isClassDay = Object.entries(dayMap).some(([dayStr, dayNum]) => 
          event.days.includes(dayStr) && dayNum === checkDay
        )

        if (isClassDay) {
          const [time, modifier] = event.startTime.split(/(?=[ap]m)/i)
          let [h, m] = time.split(':').map(Number)
          if (modifier.toLowerCase() === 'pm' && h < 12) h += 12
          if (modifier.toLowerCase() === 'am' && h === 12) h = 0
          
          checkDate.setHours(h, m, 0, 0)
          
          const diff = checkDate - now
          if (diff > 0 && diff < minDiff) {
            minDiff = diff
            nextClass = { ...event, targetDate: checkDate }
          }
        }
      }
    })

    if (nextClass) {
      const diff = nextClass.targetDate - now
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)

      setStatus({
        type: 'free',
        message: `${h}h ${m}m ${s}s`,
        subMessage: `Next: ${nextClass.name}`
      })
    } else {
      setStatus({
        type: 'free',
        message: 'No upcoming classes',
        subMessage: now.toLocaleTimeString()
      })
    }
  }

  return (
    <div className={`clock ${status.type}`}>
      <h1>{events.length === 0 ? 'The University of North Carolina at Chapel Hill' : (status.type === 'class' ? 'Class Ends In' : (status.message === 'No upcoming classes' ? 'Free Time' : 'Next Class In'))}</h1>
      <div className="time-display" style={{ fontSize: status.message.length > 15 ? '3rem' : '5rem' }}>
        {status.message}
      </div>
      <div className="date-display">
        {status.subMessage}
      </div>
    </div>
  )
}

export default Clock
