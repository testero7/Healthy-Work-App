import React, { useState, useEffect } from 'react';
import { FaCog, FaMoon, FaUser, FaArrowRight, FaArrowLeft, FaSun } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Panel() {
  const [expanded, setExpanded] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const togglePanel = () => {
    setExpanded(!expanded);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode ? '1' : '0');
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === '1');
    }
  }, []);

  return (
    <div className={`fixed bottom-0 left-0 right-0 p-4 text-white ${darkMode ? 'bg-gray-800' : 'bg-slate-200'} bg-opacity-50 shadow-lg ${expanded ? 'w-64 h-1/2' : 'w-24 h-1/2'} transition-all duration-300 z-50`}>
      <div className="mb-4">
        <button onClick={togglePanel} className={`flex items-center justify-center w-full h-12 rounded-full ${darkMode ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'} mb-2 ${expanded ? 'flex-row' : 'flex-row-reverse'}`}>
          {expanded ? <FaArrowLeft className="mr-2" /> : <FaArrowRight className="mr-2" />}
          {expanded && <span>Zwiń</span>}
        </button>
        <button onClick={toggleDarkMode} className={`flex items-center justify-center w-full h-12 rounded-full ${darkMode ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'} mb-2 ${!expanded && 'flex-row-reverse'}`}>
          {darkMode ? <FaMoon className="mr-2" /> : <FaSun className="mr-2" />}
          {expanded && <span>{darkMode ? 'Ciemny' : 'Jasny'}</span>}
        </button>
        <Link to="/settings">
          <button className={`flex items-center justify-center w-full h-12 rounded-full ${darkMode ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'} mb-2 ${!expanded && 'flex-row-reverse'}`}>
            <FaCog className="mr-2" />
            {expanded && <span>Ustawienia</span>}
          </button>
        </Link>
        <Link to="/profile">
          <button className={`flex items-center justify-center w-full h-12 rounded-full ${darkMode ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'} mb-2 ${!expanded && 'flex-row-reverse'}`}>
            <FaUser className="mr-2" />
            {expanded && <span>Profil</span>}
          </button>
        </Link>
      </div>
    </div>
  );
}
