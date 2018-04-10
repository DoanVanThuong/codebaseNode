import * as LRU from 'lru-cache';

interface LRUFactory<K, V> {
    (key: K): PromiseLike<V>;
}

interface LRUCacheOptions<K, V> extends LRU.Options<K, V> {
    factory: LRUFactory<K, V>;
}

export class LRUCache<K, V> {
    private lru: LRU.Cache<K, V>;
    private factory: LRUFactory<K, V>;

    constructor(options: LRUCacheOptions<K, V>) {
        this.lru = LRU(options);
        this.factory = options.factory;
    }

    async get(key: K): Promise<V> {
        let val = this.lru.get(key);
        if (val) { return val; }

        val = await this.factory(key);
        if (val) {
            this.lru.set(key, val);
        }

        return val;
    }

    del(key: K) {
        this.lru.del(key);
    }

    reset() {
        this.lru.reset();
    }
}