import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleTheme: () => {},
});

export const lightTheme = {
    background: '#ffffff',
    text: '#333333',
    primary: '#4CAF50',
    secondary: '#f0f0f0',
    border: '#ddd',
    error: '#ff6b6b',
    hover: '#45a049'
};

export const darkTheme = {
    background: '#1a1a1a',
    text: '#ffffff',
    primary: '#45a049',
    secondary: '#2d2d2d',
    border: '#404040',
    error: '#ff6b6b',
    hover: '#3d8b40'
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('darkMode');
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <StyledThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);