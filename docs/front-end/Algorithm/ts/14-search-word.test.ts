import Trie from './14-search-word';
describe('Trie 前缀搜索', () => {
    let trie: Trie;
    const wordList = ['abs', 'arab', 'array', 'arrow', 'boot', 'boss'];

    beforeEach(() => {
        trie = new Trie();
        for (const word of wordList) {
            trie.insert(word);
        }
    });

    it('能正确插入和搜索单词', () => {
        expect(trie.search('ar')).toEqual(['arab', 'array', 'arrow']);
        expect(trie.search('bo')).toEqual(['boot', 'boss']);
        expect(trie.search('a')).toEqual(['abs', 'arab', 'array', 'arrow']);
        expect(trie.search('abc')).toEqual([]);
    });

    it('插入新单词后能被搜索到', () => {
        trie.insert('book');
        expect(trie.search('bo')).toEqual(['boot', 'book' ,'boss']);
        expect(trie.search('boo')).toEqual(['boot', 'book']);
    });

    it('搜索空字符串返回所有单词', () => {
        // Trie 没有实现全部遍历，这里只测试空字符串是否返回所有单词
        const allWords = trie.search('');
        expect(allWords.sort()).toEqual(wordList.slice().sort());
    });

    it('搜索不存在的前缀返回空数组', () => {
        expect(trie.search('zzz')).toEqual([]);
        expect(trie.search('arrr')).toEqual([]);
    });

    it('可以插入和搜索单字符单词', () => {
        trie.insert('a');
        expect(trie.search('a')).toContain('a');
    });
});

