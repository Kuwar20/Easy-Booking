import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from 'react-icons/fa';

const DarkMode: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        // Check localStorage for the dark mode state
        const savedDarkMode = localStorage.getItem('darkMode');
        return savedDarkMode === 'true' || false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        // Save the dark mode state to localStorage
        localStorage.setItem('darkMode', darkMode.toString());
    }, [darkMode]);

    return (
        <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 transition-colors duration-300"
        >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-700" />}
        </button>
    );
};

export default DarkMode;
