import { useState, useEffect } from 'react'
import './DarkModeToggle.css'
import darkModeIcon from '../assets/darkmode.svg'
import lightModeIcon from '../assets/lightmode.svg'

function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('darkmode')
    } else {
      document.body.classList.remove('darkmode')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <button className="dark-mode-toggle" onClick={toggleDarkMode}>
      <img src={isDarkMode ? lightModeIcon : darkModeIcon}/>
    </button>
  )
}

export default DarkModeToggle
