/*
 * @lc app=leetcode.cn id=208 lang=typescript
 *
 * [208] 实现 Trie (前缀树)
 */

// @lc code=start

type TrieNode = {
  val: string;
  kind: 'char' | 'end';
  children: TrieNode[];
}

const createTrieNode = (val: string, kind: TrieNode['kind'] = 'char'): TrieNode => {
  return {
    val,
    kind,
    children: [],
  }
}

const start = 'a'.charCodeAt(0);
const charToIdx = (char: string): number => {
  return char.charCodeAt(0) - start;
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = createTrieNode('');
  }

  insert(word: string): void {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const idx = charToIdx(char);
      if (!node.children[idx]) {
        node.children[idx] = createTrieNode(char);
      }
      node = node.children[idx];
    }
    node.kind = 'end';
  }

  private searchNode(word: string) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const idx = charToIdx(word[i]);
      node = node.children[idx];
      if (!node) {
        return null;
      }
    }

    return node;
  }

  search(word: string): boolean {
    const node = this.searchNode(word);
    return !!node && node.kind === 'end';
  }

  startsWith(prefix: string): boolean {
    const node = this.searchNode(prefix);
    return !!node;
  }
}

/**
 * Your Trie object will be instantiated and called as such:
 * var obj = new Trie()
 * obj.insert(word)
 * var param_2 = obj.search(word)
 * var param_3 = obj.startsWith(prefix)
 */
// @lc code=end


function _testCase() {
  const trie = new Trie();
  trie.insert("apple");
  console.log(trie.search("apple"));   // 返回 True
  console.log(trie.search("app"));     // 返回 False
  console.log(trie.startsWith("app")); // 返回 True
  trie.insert("app");
  console.log(trie.search("app"));     // 返回 True
}

_testCase();
