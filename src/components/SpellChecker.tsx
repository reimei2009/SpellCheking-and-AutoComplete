import { useState, useEffect, useCallback } from 'react';
import TST from '../algorithms/TST';
import { csvToArray } from '../utils/csvUtils';
import { findSimilarWords } from '../algorithms/LevenshteinDistance';
import { checkRepeatedChars } from '../utils/patternUtils';

interface Word {
    text: string;
    isCorrect: boolean;
    suggestions?: string[];
    distance?: number;
    pattern?: {
        type: 'repeated' | 'normal';
        suggestedWord: string;
    };
}

const SpellChecker = () => {
    const [tst] = useState(new TST());
    const [dictionary, setDictionary] = useState<string[]>([]);
    const [text, setText] = useState('');
    const [words, setWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedWord, setSelectedWord] = useState<number | null>(null);
    const [maxSuggestions] = useState(5);
    const [maxDistance] = useState(2);

    useEffect(() => {
        const loadDictionary = async () => {
            try {
                const response = await fetch('/vietnamese_words.csv');
                const csvText = await response.text();
                const dict = csvToArray(csvText);
                console.log('Loaded dictionary with', dict.length, 'words');
                setDictionary(dict.filter(word => word && word.trim()));
                
                dict.forEach(word => {
                    if (word && word.trim()) {
                        tst.insert(word.trim());
                    }
                });
                
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading dictionary:', error);
                setIsLoading(false);
            }
        };

        loadDictionary();
    }, [tst]);

    const checkWord = useCallback((word: string): Word => {
        // Skip empty words
        if (!word.trim()) {
            return { text: word, isCorrect: true };
        }

        // First check for repeated characters
        const repeatedPattern = checkRepeatedChars(word);
        if (repeatedPattern) {
            // Kiểm tra xem từ sau khi bỏ ký tự lặp có trong từ điển không
            const normalizedExists = tst.search(repeatedPattern.suggestedWord);
            if (normalizedExists) {
                return {
                    text: word,
                    isCorrect: false,
                    suggestions: [repeatedPattern.suggestedWord], // Ưu tiên gợi ý này đầu tiên
                    pattern: {
                        type: 'repeated',
                        suggestedWord: repeatedPattern.suggestedWord
                    }
                };
            }
        }

        // If word exists in dictionary, it's correct
        if (tst.search(word)) {
            return { text: word, isCorrect: true };
        }

        // Get all suggestions using MLD
        let suggestions = findSimilarWords(word, dictionary, maxDistance, true);

        // If we found a repeated pattern, prioritize its suggestion
        if (repeatedPattern) {
            suggestions = suggestions.sort((a, b) => {
                if (a.word === repeatedPattern.suggestedWord) return -1;
                if (b.word === repeatedPattern.suggestedWord) return 1;
                return a.distance - b.distance;
            });
        }

        return {
            text: word,
            isCorrect: false,
            suggestions: suggestions.slice(0, maxSuggestions).map(s => s.word),
            distance: suggestions.length > 0 ? suggestions[0].distance : undefined,
            pattern: repeatedPattern ? {
                type: 'repeated',
                suggestedWord: repeatedPattern.suggestedWord
            } : undefined
        };
    }, [dictionary, tst, maxDistance, maxSuggestions]);

    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = event.target.value;
        setText(newText);

        if (!newText.trim()) {
            setWords([]);
            return;
        }

        const tokens = newText.split(/\s+/).filter(token => token.length > 0);
        const checkedWords = tokens.map(checkWord);
        setWords(checkedWords);
        setSelectedWord(null);
    }, [checkWord]);

    const handleSuggestionClick = (index: number, suggestion: string) => {
        const newWords = [...words];
        newWords[index] = { text: suggestion, isCorrect: true };
        setWords(newWords);

        const tokens = text.split(/\s+/);
        tokens[index] = suggestion;
        setText(tokens.join(' '));
        setSelectedWord(null);
    };

    // Add new function to handle "Fix All" action
    const handleFixAllRepeated = useCallback(() => {
        const newWords = [...words];
        const newText = words.map((word, idx) => {
            if (word.pattern?.type === 'repeated') {
                newWords[idx] = { 
                    text: word.pattern.suggestedWord, 
                    isCorrect: true 
                };
                return word.pattern.suggestedWord;
            }
            return word.text;
        }).join(' ');

        setWords(newWords);
        setText(newText);
        setSelectedWord(null);
    }, [words]);

    // Count repeated character errors
    const repeatedErrorCount = words.filter(w => w.pattern?.type === 'repeated').length;

    return (
        <div className="spell-checker">
            <div className="editor-section">
                <textarea
                    className="text-editor"
                    value={text}
                    onChange={handleTextChange}
                    placeholder="Nhập văn bản để kiểm tra chính tả..."
                    disabled={isLoading}
                />
            </div>

            <div className="preview-section">
                <div className="text-preview">
                    <div className="highlighted-text">
                        {words.map((word, index) => (
                            <span
                                key={index}
                                className={`word-container ${selectedWord === index ? 'selected' : ''}`}
                                onClick={() => setSelectedWord(index)}
                            >
                                <span 
                                    className={`word ${!word.isCorrect ? 'incorrect' : ''} ${word.pattern?.type === 'repeated' ? 'repeated' : ''}`}
                                    data-tooltip={
                                        word.pattern?.type === 'repeated'
                                            ? `Phát hiện ký tự lặp: "${word.text}" → "${word.pattern.suggestedWord}"`
                                            : word.isCorrect ? undefined : 'Click để xem gợi ý'
                                    }
                                >
                                    {word.text}
                                </span>
                                {index < words.length - 1 && ' '}
                            </span>
                        ))}
                    </div>
                </div>

                {selectedWord !== null && words[selectedWord] && !words[selectedWord].isCorrect && (
                    <div className="suggestions-panel">
                        <div className="suggestions-header">
                            <h3>
                                {words[selectedWord].pattern?.type === 'repeated'
                                    ? 'Sửa lỗi ký tự lặp:'
                                    : 'Gợi ý:'}
                            </h3>
                            {words[selectedWord].pattern?.type === 'repeated' && repeatedErrorCount > 1 && (
                                <button 
                                    className="fix-all-button"
                                    onClick={handleFixAllRepeated}
                                    title={`Sửa tất cả ${repeatedErrorCount} từ có ký tự lặp`}
                                >
                                    Sửa tất cả ({repeatedErrorCount})
                                </button>
                            )}
                        </div>
                        <ul className="suggestions-list">
                            {words[selectedWord].suggestions?.map((suggestion, idx) => (
                                <li
                                    key={idx}
                                    className={`suggestion-item ${words[selectedWord].pattern?.type === 'repeated' ? 'repeated' : ''}`}
                                    onClick={() => handleSuggestionClick(selectedWord, suggestion)}
                                >
                                    {suggestion}
                                    {words[selectedWord].pattern?.type === 'repeated' && suggestion === words[selectedWord].pattern.suggestedWord && (
                                        <small className="pattern-hint">Đã loại bỏ ký tự lặp</small>
                                    )}
                                </li>
                            )) || <li>Không có gợi ý phù hợp</li>}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpellChecker;
