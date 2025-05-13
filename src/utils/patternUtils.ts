/**
 * Pattern detection utilities for Vietnamese text
 */

export interface DetectedPattern {
    type: 'repeated' | 'normal';
    originalWord: string;
    suggestedWord: string;
    pattern: string;
}

/**
 * Removes repeated characters from a word while preserving Vietnamese diacritics
 */
export function removeRepeatedChars(word: string): string {
    // Special handling for Vietnamese characters
    const vietnameseChars = {
        'a': ['a', 'á', 'à', 'ả', 'ã', 'ạ'],
        'ă': ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'],
        'â': ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
        'e': ['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ'],
        'ê': ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
        'i': ['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
        'o': ['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ'],
        'ô': ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ'],
        'ơ': ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
        'u': ['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ'],
        'ư': ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
        'y': ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ']
    };

    // Create reverse mapping for quick lookup
    const charMap = new Map<string, string>();
    Object.entries(vietnameseChars).forEach(([base, variants]) => {
        variants.forEach(variant => {
            charMap.set(variant, base);
        });
    });

    let result = '';
    let lastBase = '';
    
    for (let i = 0; i < word.length; i++) {
        const currentChar = word[i];
        // Get the base character (without diacritics)
        const currentBase = charMap.get(currentChar.toLowerCase()) || currentChar.toLowerCase();
        
        // If this is the first character or different from the last base character
        if (i === 0 || currentBase !== lastBase) {
            result += currentChar;
            lastBase = currentBase;
        }
    }
    
    return result;
}

/**
 * Checks if a word has repeated characters and returns reduced form
 */
export function checkRepeatedChars(word: string): DetectedPattern | null {
    const normalized = removeRepeatedChars(word);
    
    if (normalized !== word) {
        return {
            type: 'repeated',
            originalWord: word,
            suggestedWord: normalized,
            pattern: 'repeated_chars'
        };
    }
    
    return null;
}
