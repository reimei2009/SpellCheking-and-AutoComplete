export default class TSTNode {
    data: string;
    isEndOfWord: boolean;
    left: TSTNode | null;
    middle: TSTNode | null;
    right: TSTNode | null;

    constructor(data: string) {
        this.data = data;
        this.isEndOfWord = false;
        this.left = null;
        this.middle = null;
        this.right = null;
    }
}