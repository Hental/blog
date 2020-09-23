/*
 * @lc app=leetcode id=146 lang=typescript
 *
 * [146] LRU Cache
 */

// @lc code=start
interface Entry {
  k: number;
  v: number;
  prev: Entry | null;
  next: Entry | null;
}

class LRUCache {
  public readonly map = new Map<number, Entry>();
  public readonly head: Entry & { next: Entry };
  public readonly tail: Entry & { prev: Entry };
  public readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head = {
      next: null,
      prev: null,
      k: -1,
      v: -1,
    } as any;
    this.tail = {
      next: null,
      prev: null,
      k: -1,
      v: -1,
    } as any;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    const entry = this.map.get(key);
    if (entry) {
      this.active(entry);
      return entry.v;
    }
    return -1;
  }

  put(key: number, value: number): void {
    let entry = this.map.get(key);
    if (entry) {
      this.active(entry);
      entry.v = value;
      return;
    }

    if (this.map.size >= this.capacity) {
      const toRemoveEntry = this.head.next;
      if (toRemoveEntry) {
        this.remove(toRemoveEntry);
        this.map.delete(toRemoveEntry.k);
      }
    }

    entry = { k: key, v: value, next: null, prev: null };
    this.setLatest(entry);
    this.map.set(key, entry);
    return;
  }

  active(e: Entry) {
    this.remove(e);
    this.setLatest(e);
  }

  remove(e: Entry) {
    if (e.prev) {
      e.prev.next = e.next;
    }
    if (e.next) {
      e.next.prev = e.prev;
    }
    e.prev = null;
    e.next = null;
  }

  setLatest(entry: Entry) {
    entry.prev = this.tail.prev;
    entry.next = this.tail;
    this.tail.prev.next = entry;
    this.tail.prev = entry;
  }
}

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */
// @lc code=end

describe("146.LRU Cache", () => {
  it("solution", () => {
    const cache = new LRUCache(2);
    cache.put(1, 1);
    cache.put(2, 2);
    expect(cache.get(1)).toBe(1); // returns 1
    cache.put(3, 3); // evicts key 2
    expect(cache.get(2)).toBe(-1); // returns -1 (not found)
    cache.put(4, 4); // evicts key 1
    expect(cache.get(1)).toBe(-1); // returns -1 (not found)
    expect(cache.get(3)).toBe(3); // returns 3
    expect(cache.get(4)).toBe(4); // returns 4
  });

  it('put exist key will active this key', () => {
    const cache = new LRUCache(2);
    cache.put(2, 1);
    cache.put(1, 1);
    cache.put(2, 3);
    cache.put(4, 1);
    expect(cache.get(1)).toBe(-1);
    expect(cache.get(2)).toBe(3);
  });

  it('case', () => {
    const actions = ["LRUCache", "put", "put", "put", "put", "put", "get", "put", "get", "get", "put", "get", "put", "put", "put", "get", "put", "get", "get", "get", "get", "put", "put", "get", "get", "get", "put", "put", "get", "put", "get", "put", "get", "get", "get", "put", "put", "put", "get", "put", "get", "get", "put", "put", "get", "put", "put", "put", "put", "get", "put", "put", "get", "put", "put", "get", "put", "put", "put", "put", "put", "get", "put", "put", "get", "put", "get", "get", "get", "put", "get", "get", "put", "put", "put", "put", "get", "put", "put", "put", "put", "get", "get", "get", "put", "put", "put", "get", "put", "put", "put", "get", "put", "put", "put", "get", "get", "get", "put", "put", "put", "put", "get", "put", "put", "put", "put", "put", "put", "put"];
    const dataSource = [[10], [10, 13], [3, 17], [6, 11], [10, 5], [9, 10], [13], [2, 19], [2], [3], [5, 25], [8], [9, 22], [5, 5], [1, 30], [11], [9, 12], [7], [5], [8], [9], [4, 30], [9, 3], [9], [10], [10], [6, 14], [3, 1], [3], [10, 11], [8], [2, 14], [1], [5], [4], [11, 4], [12, 24], [5, 18], [13], [7, 23], [8], [12], [3, 27], [2, 12], [5], [2, 9], [13, 4], [8, 18], [1, 7], [6], [9, 29], [8, 21], [5], [6, 30], [1, 12], [10], [4, 15], [7, 22], [11, 26], [8, 17], [9, 29], [5], [3, 4], [11, 30], [12], [4, 29], [3], [9], [6], [3, 4], [1], [10], [3, 29], [10, 28], [1, 20], [11, 13], [3], [3, 12], [3, 8], [10, 9], [3, 26], [8], [7], [5], [13, 17], [2, 27], [11, 15], [12], [9, 19], [2, 15], [3, 16], [1], [12, 17], [9, 1], [6, 19], [4], [5], [5], [8, 1], [11, 7], [5, 2], [9, 28], [1], [2, 2], [7, 4], [4, 22], [7, 24], [9, 26], [13, 28], [11, 26]]
    const expectResults = [null, null, null, null, null, null, -1, null, 19, 17, null, -1, null, null, null, -1, null, -1, 5, -1, 12, null, null, 3, 5, 5, null, null, 1, null, -1, null, 30, 5, 30, null, null, null, -1, null, -1, 24, null, null, 18, null, null, null, null, -1, null, null, 18, null, null, -1, null, null, null, null, null, 18, null, null, -1, null, 4, 29, 30, null, 12, -1, null, null, null, null, 29, null, null, null, null, 17, 22, 18, null, null, null, -1, null, null, null, 20, null, null, null, -1, 18, 18, null, null, null, null, 20, null, null, null, null, null, null, null];
    runCase(actions, dataSource, expectResults);
  });
});

function runCase(actions: string[], dataSource: number[][], expectResults: any[]) {
  let i = 0;
  let cache: LRUCache | undefined;
  for (;i < actions.length; i++) {
    const action = actions[i];
    const data = dataSource[i];
    const expectResult = expectResults[i];
    let result: any;
    switch (action) {
      case 'LRUCache':
        cache = new LRUCache(data[0]);
        break;
      case 'put':
        cache?.put(data[0], data[1]);
        break;
      case 'get':
        result = cache?.get(data[0]);
        break;
    }
    if (expectResult !== null) {
      if (result !== expectResult) {
        debugger;
      }
      expect(result).toBe(expectResult)
    }
  }
}
