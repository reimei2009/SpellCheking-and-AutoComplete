// Character groups for Modified Levenshtein Distance
const CHAR_GROUPS = [
    new Set(['O', 'D', 'Q']),
    new Set(['o', 'd', 'q']),
    new Set(['I', 'J', 'L', 'T']),
    new Set(['U', 'V', 'Ư']),
    new Set(['u', 'v', 'ư']),
    new Set(['F', 'P']),
    new Set(['C', 'G']),
    new Set(['đ', 'd']),
    new Set(['ê', 'e', 'é', 'è', 'ẹ']),
    new Set(['ô', 'o', 'ó', 'ò', 'ọ']),
    new Set(['ư', 'u', 'ú', 'ù', 'ụ']),
    new Set(['á', 'a', 'à', 'ả', 'ã', 'ạ'])
];

const CHAR_TO_GROUP: { [key: string]: number } = {};
CHAR_GROUPS.forEach((group, idx) => {
    group.forEach(char => {
        CHAR_TO_GROUP[char] = idx;
    });
});

// Get substitution cost for Modified Levenshtein Distance
function getSubstitutionCost(c1: string, c2: string): number {
    // Nếu hai ký tự giống nhau hoàn toàn
    if (c1 === c2) return 0;

    // Lấy nhóm của từng ký tự
    const group1 = CHAR_TO_GROUP[c1.toLowerCase()];
    const group2 = CHAR_TO_GROUP[c2.toLowerCase()];

    // Nếu cả hai ký tự đều thuộc cùng một nhóm
    if (group1 !== undefined && group2 !== undefined && group1 === group2) {
        return 0.4;
    }

    // Nếu không thuộc trường hợp nào trên
    return 1;
}

// Modified Levenshtein Distance
export function modifiedLevenshteinDistance(s1: string, s2: string, threshold: number = Infinity): number {
    if (s1.length < s2.length) {
        [s1, s2] = [s2, s1];
    }

    if (s2.length === 0) {
        return s1.length;
    }

    const dp: number[][] = Array.from({ length: s1.length + 1 }, () => 
        Array(s2.length + 1).fill(0)
    );

    // Initialize first row and column
    for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
    for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

    // Fill the matrix
    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            const cost = getSubstitutionCost(s1[i-1], s2[j-1]);
            dp[i][j] = Math.min(
                dp[i-1][j] + 1,           // deletion
                dp[i][j-1] + 1,           // insertion
                dp[i-1][j-1] + cost       // substitution
            );

            if (dp[i][j] > threshold) {
                return Infinity;
            }
        }
    }

    return dp[s1.length][s2.length];
}

// Find similar words based on LD or MLD
export function findSimilarWords(
    target: string,
    wordList: string[],
    maxDistance: number,
    useModified: boolean = true
): { word: string; distance: number }[] {
    const results = wordList
        .map(word => ({
            word,
            distance: useModified 
                ? modifiedLevenshteinDistance(target.toLowerCase(), word.toLowerCase(), maxDistance)
                : levenshteinDistance(target.toLowerCase(), word.toLowerCase())
        }))
        .filter(result => result.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);

    return results;
}

// Calculate similarity percentage
export function calculateSimilarity(distance: number, maxLength: number): number {
    return Math.max(0, Math.min(100, (1 - distance / maxLength) * 100));
}

// Print DP table for visualization
export function printMLDDPTable(s1: string, s2: string): string[][] {
    const m = s2.length;
    const n = s1.length;
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    // Initialize first row and column
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 0; i <= m; i++) dp[i][0] = i;

    // Fill the matrix
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = getSubstitutionCost(s2[i-1], s1[j-1]);
            dp[i][j] = Math.min(
                dp[i-1][j] + 1,
                dp[i][j-1] + 1,
                dp[i-1][j-1] + cost
            );
        }
    }

    // Format the table for display
    const table: string[][] = [];
    const header = [''].concat([...s1].map(char => char === ' ' ? '␣' : char));
    table.push(header);

    for (let i = 0; i <= m; i++) {
        const row = [i === 0 ? ' ' : s2[i-1] === ' ' ? '␣' : s2[i-1]];
        row.push(...dp[i].map(val => val.toFixed(1)));
        table.push(row);
    }

    return table;
}

// Standard Levenshtein Distance (kept for comparison)
export function levenshteinDistance(s1: string, s2: string): number {
    if (s1.length < s2.length) {
        [s1, s2] = [s2, s1];
    }

    if (s2.length === 0) {
        return s1.length;
    }

    let previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);
    
    for (let i = 0; i < s1.length; i++) {
        const currentRow = [i + 1];
        
        for (let j = 0; j < s2.length; j++) {
            const insertions = previousRow[j + 1] + 1;
            const deletions = currentRow[j] + 1;
            const substitutions = previousRow[j] + (s1[i] !== s2[j] ? 1 : 0);
            currentRow.push(Math.min(insertions, deletions, substitutions));
        }
        
        previousRow = currentRow;
    }

    return previousRow[previousRow.length - 1];
}