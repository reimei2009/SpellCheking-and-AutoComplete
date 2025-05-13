import { useState, useEffect } from 'react';
import TST from '../algorithms/TST';
import { csvToArray } from '../utils/csvUtils';

const TSTDemo = () => {
    const [tst] = useState(new TST());
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [maxSuggestions, setMaxSuggestions] = useState(10);

    useEffect(() => {
        const loadDictionary = async () => {
            try {
                const response = await fetch('/vietnamese_words.csv');
                const text = await response.text();
                const words = csvToArray(text);
                
                words.forEach(word => {
                    if (word) tst.insert(word);
                });
                
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading dictionary:', error);
                setIsLoading(false);
            }
        };

        loadDictionary();
    }, [tst]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);

        if (value.length > 0) {
            const words = tst.getWordsWithPrefix(value);
            setSuggestions(words.slice(0, maxSuggestions));
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="demo-container">
            <div className="control-section">
                <div className="settings-panel">
                    <label className="setting-control">
                        <span>Số lượng từ gợi ý:</span>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={maxSuggestions}
                            onChange={(e) => setMaxSuggestions(Number(e.target.value))}
                            className="number-input"
                        />
                    </label>
                </div>
                <div className="search-input-container">
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Nhập để tìm kiếm..."
                        disabled={isLoading}
                        className="search-input"
                    />
                    <div className="search-icon">🔍</div>
                </div>
            </div>
            
            <div className="results-container">
                {isLoading ? (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        <span>Đang tải từ điển...</span>
                    </div>
                ) : suggestions.length > 0 ? (
                    <ul className="suggestions">
                        {suggestions.map((word, index) => (
                            <li 
                                key={index} 
                                className="suggestion-item"
                                onClick={() => setQuery(word)}
                            >
                                <div className="suggestion-content">
                                    <span className="word">{word}</span>
                                </div>
                                <div className="suggestion-info">
                                    <span className="character-count">{word.length} ký tự</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : query && (
                    <div className="no-results">
                        <span className="no-results-icon">🔍</span>
                        <span>Không tìm thấy kết quả</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TSTDemo;