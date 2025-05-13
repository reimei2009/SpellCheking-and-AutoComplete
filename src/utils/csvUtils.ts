export async function loadCSV(filePath: string): Promise<string[]> {
    try {
        const response = await fetch(filePath);
        const text = await response.text();
        const lines = text.split('\n');
        
        // Skip header row and get the first column (correct words)
        return lines
            .slice(1)
            .map(line => {
                const columns = line.split(',');
                return columns[0].trim().replace(/"/g, '');
            })
            .filter(word => word.length > 0);
    } catch (error) {
        console.error('Error loading dictionary:', error);
        return [];
    }
}

export const csvToArray = (csvContent: string): string[] => {
    return csvContent
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean); // Remove empty lines
};