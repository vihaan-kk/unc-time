import './DarkModeToggle.css'
import darkModeIcon from '../assets/darkmode.svg'
import lightModeIcon from '../assets/lightmode.svg'

function DarkModeToggle({ isDarkMode, toggleDarkMode }) {
  return (
    <button className="dark-mode-toggle" onClick={toggleDarkMode}>
      <img src={isDarkMode ? lightModeIcon : darkModeIcon}/>
    </button>
  )
}

export default DarkModeToggle
