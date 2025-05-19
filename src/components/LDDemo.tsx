import { useState, useEffect } from 'react';
import { csvToArray } from '../utils/csvUtils';
import { modifiedLevenshteinDistance, levenshteinDistance } from '../algorithms/LevenshteinDistance';

const LDDemo = () => {
    const [query, setQuery] = useState('');
    const [maxDistance, setMaxDistance] = useState(3);
    const [topK, setTopK] = useState(5);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dictionary, setDictionary] = useState<string[]>([]);
    const [useModified, setUseModified] = useState(true);

    useEffect(() => {
        const loadDictionary = async () => {
            try {
                const response = await fetch('/vietnamese_words.csv');
                const text = await response.text();
                const words = csvToArray(text);
                setDictionary(words.filter(Boolean));
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading dictionary:', error);
                setIsLoading(false);
            }
        };

        loadDictionary();
    }, []);    const calculateDistance = (str1: string, str2: string): number => {
        if (useModified) {
            return modifiedLevenshteinDistance(str1, str2);
        } else {
            return levenshteinDistance(str1, str2);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);

        if (value) {
            const results = dictionary
                .map(word => ({
                    word,
                    distance: calculateDistance(value.toLowerCase(), word.toLowerCase())
                }))
                .filter(result => result.distance <= maxDistance)
                .sort((a, b) => a.distance - b.distance)
                .slice(0, topK)
                .map(result => result.word);
            
            setSuggestions(results);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div className="demo-container">
            <div className="control-section">
                <div className="settings-panel">
                    <div className="parameters-control">
                        <div className="control-group">
                            <label className="setting-control">
                                <span>Khoảng cách tối đa:</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={maxDistance}
                                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                                    className="number-input"
                                />
                            </label>
                        </div>
                        <div className="control-group">
                            <label className="setting-control">
                                <span>Số gợi ý (Top-k):</span>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={topK}
                                    onChange={(e) => setTopK(Number(e.target.value))}
                                    className="number-input"
                                />
                            </label>
                        </div>
                        <div className="control-group">
                            <label className="setting-control switch-control">
                                <span>Sử dụng MLD:</span>
                                <input
                                    type="checkbox"
                                    checked={useModified}
                                    onChange={(e) => setUseModified(e.target.checked)}
                                    className="switch-input"
                                />
                                <span className="switch-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="search-input-container">
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Nhập từ cần tìm..."
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
                            <li key={index} className="suggestion-item">                                <div className="suggestion-content">
                                    <span className="word">{word}</span>
                                </div>
                                <div className="suggestion-info">
                                    <span className="distance-info">
                                        {useModified ? 'MLD' : 'LD'}: {calculateDistance(query, word)}
                                    </span>
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

export default LDDemo;