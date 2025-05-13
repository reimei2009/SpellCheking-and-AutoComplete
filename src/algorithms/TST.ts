import TSTNode from './TSTNode';

export default class TST {
    private root: TSTNode | null = null;

    insert(word: string): void {
        if (!word) return;
        this.root = this.insertRecursive(this.root, word, 0);
    }

    private insertRecursive(node: TSTNode | null, word: string, index: number): TSTNode {
        if (!node) {
            node = new TSTNode(word[index]);
        }

        if (word[index] < node.data) {
            node.left = this.insertRecursive(node.left, word, index);
        } else if (word[index] > node.data) {
            node.right = this.insertRecursive(node.right, word, index);
        } else {
            if (index < word.length - 1) {
                node.middle = this.insertRecursive(node.middle, word, index + 1);
            } else {
                node.isEndOfWord = true;
            }
        }

        return node;
    }

    search(word: string): boolean {
        if (!word) return false;
        const node = this.searchNode(this.root, word, 0);
        return !!node && node.isEndOfWord;
    }

    private searchNode(node: TSTNode | null, word: string, index: number): TSTNode | null {
        if (!node) return null;

        if (word[index] < node.data) {
            return this.searchNode(node.left, word, index);
        } else if (word[index] > node.data) {
            return this.searchNode(node.right, word, index);
        } else {
            if (index === word.length - 1) {
                return node;
            }
            return this.searchNode(node.middle, word, index + 1);
        }
    }

    getWordsWithPrefix(prefix: string): string[] {
        const result: string[] = [];
        if (!prefix) return result;

        const node = this.searchPrefix(this.root, prefix, 0);
        if (!node) return result;

        if (node.isEndOfWord) {
            result.push(prefix);
        }

        this.collectWords(node.middle, prefix, result);
        return result;
    }

    private searchPrefix(node: TSTNode | null, prefix: string, index: number): TSTNode | null {
        if (!node) return null;

        if (prefix[index] < node.data) {
            return this.searchPrefix(node.left, prefix, index);
        } else if (prefix[index] > node.data) {
            return this.searchPrefix(node.right, prefix, index);
        } else {
            if (index === prefix.length - 1) {
                return node;
            }
            return this.searchPrefix(node.middle, prefix, index + 1);
        }
    }

    private collectWords(node: TSTNode | null, currentPrefix: string, result: string[]): void {
        if (!node) return;

        this.collectWords(node.left, currentPrefix, result);

        const newPrefix = currentPrefix + node.data;
        if (node.isEndOfWord) {
            result.push(newPrefix);
        }

        this.collectWords(node.middle, newPrefix, result);
        this.collectWords(node.right, currentPrefix, result);
    }

    suggestSimilarWords(inputWord: string, maxDistance: number): string[] {
        const result: string[] = [];
        this.traverseAndCompare(this.root, "", inputWord, result, maxDistance);
        return result;
    }

    private traverseAndCompare(
        node: TSTNode | null, 
        currentWord: string, 
        targetWord: string, 
        result: string[], 
        maxDistance: number
    ): void {
        if (!node) return;

        this.traverseAndCompare(node.left, currentWord, targetWord, result, maxDistance);

        const newWord = currentWord + node.data;
        if (node.isEndOfWord) {
            const distance = this.levenshteinDistance(newWord, targetWord);
            if (distance <= maxDistance) {
                result.push(newWord);
            }
        }

        this.traverseAndCompare(node.middle, newWord, targetWord, result, maxDistance);
        this.traverseAndCompare(node.right, currentWord, targetWord, result, maxDistance);
    }

    private levenshteinDistance(str1: string, str2: string): number {
        const dp: number[][] = Array(str1.length + 1)
            .fill(0)
            .map(() => Array(str2.length + 1).fill(0));

        for (let i = 0; i <= str1.length; i++) {
            for (let j = 0; j <= str2.length; j++) {
                if (i === 0) {
                    dp[i][j] = j;
                } else if (j === 0) {
                    dp[i][j] = i;
                } else {
                    dp[i][j] = Math.min(
                        dp[i - 1][j] + 1,
                        dp[i][j - 1] + 1,
                        dp[i - 1][j - 1] + (str1[i - 1] !== str2[j - 1] ? 1 : 0)
                    );
                }
            }
        }

        return dp[str1.length][str2.length];
    }
}