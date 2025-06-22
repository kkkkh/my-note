// 定义 Trie 节点接口
interface TrieNode {
  children: { [key: string]: TrieNode };
  isWord: boolean;
}

// 定义 Trie 类
export default class Trie {
  root: TrieNode;

  constructor() {
      this.root = {
          children: {},
          isWord: false
      };
  }

  insert(word: string): void {
      let node: TrieNode = this.root;
      for (const char of word) {
          if (!node.children[char]) {
              node.children[char] = {
                  children: {},
                  isWord: false
              };
          }
          node = node.children[char];
      }
      node.isWord = true;
  }

  search(prefix: string): string[] {
      let node: TrieNode = this.root;
      for (const char of prefix) {
          if (!node.children[char]) {
              return [];
          }
          node = node.children[char];
      }
      return this.collectWords(node, prefix);
  }

  private collectWords(node: TrieNode, prefix: string): string[] {
      const words: string[] = [];
      this.collectWordsHelper(node, prefix, words);
      return words;
  }

  private collectWordsHelper(node: TrieNode, currentWord: string, words: string[]): void {
      if (node.isWord) {
          words.push(currentWord);
      }

      for (const char in node.children) {
          if (node.children.hasOwnProperty(char)) {
              this.collectWordsHelper(node.children[char], currentWord + char, words);
          }
      }
  }
  private collectWords2(node: TrieNode, prefix: string): string[] {
    const words: string[] = [];
    const queue: { node: TrieNode; word: string }[] = [{ node: node, word: prefix }];

    while (queue.length > 0) {
        const { node: currentNode, word: currentWord } = queue.shift();

        if (currentNode.isWord) {
            words.push(currentWord);
        }

        for (const char in currentNode.children) {
            if (currentNode.children.hasOwnProperty(char)) {
                queue.push({ node: currentNode.children[char], word: currentWord + char });
            }
        }
    }

    return words;
}
}

// 示例用法
const wordList: string[] = ['abs', 'arab', 'array', 'arrow', 'boot', 'boss'];
const trie: Trie = new Trie();

for (const word of wordList) {
  trie.insert(word);
}

function searchWords(prefix: string): string[] {
  return trie.search(prefix);
}

// 搜索示例
console.log(searchWords('ar'));   // 输出: [ 'arab', 'array', 'arrow' ]
console.log(searchWords('bo'));   // 输出: [ 'boot', 'boss' ]
console.log(searchWords('a'));    // 输出: [ 'abs', 'arab', 'array', 'arrow' ]
console.log(searchWords('abc'));  // 输出: []
