import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const ToggleButton = styled.button`    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px;
    border-radius: 50%;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;

    &:hover {
        background-color: #45a049;
        transform: scale(1.05);
    }

    svg {
        width: 20px;
        height: 20px;
    }

    @media (max-width: 768px) {
        top: 10px;
        right: 10px;
        padding: 10px;
        
        svg {
            width: 18px;
            height: 18px;
        }
    }
`;

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <ToggleButton 
            onClick={toggleTheme} 
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </ToggleButton>
    );
};

export default ThemeToggle;