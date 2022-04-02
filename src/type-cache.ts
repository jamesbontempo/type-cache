
const { EventEmitter } = require("events");

export class TypeCache extends EventEmitter {
    private _cache: any;
    private _ttl: number;
    private _count: number;

    constructor() {
        super();
        this._cache = {};
        this._ttl = 0;
        this._count = 0;

        return this;
    }

    get count(): number {
        return this._count;
    }

    get ttl(): number {
        return this._ttl;
    }

    set ttl(ttl: number) {
        if (ttl && typeof ttl === "number" && ttl > 0) this._ttl = ttl;
    }

    insert(key: string, value: any, ttl?: number): void {
        ttl = (ttl && typeof ttl === "number" && ttl > 0) ? ttl : 0;
        this._cache[key] = {
            value: value,
            ttl: ttl,
            timeout: (ttl) ? setTimeout(this._delete, ttl, this, key) : undefined,
            added: Date.now()
        }
        this._count++;
        this.emit("insert", this._cache[key]);
    }

    exists(key: string): boolean {
        return this._cache.hasOwnProperty(key);
    }

    select(key: string): any {
        if (this.exists(key)) return this._cache[key].value;
    }

    update(key: string, value: any) {
        if (this.exists(key)) this._cache[key].value = value;
    }

    extend(key: string, ttl = 0): void {
        if (this.exists(key) && ttl && typeof ttl === "number" && ttl >= 0) {
            clearTimeout(this._cache[key].timeout);
            if (ttl > 0) this._cache[key].timeout = setTimeout(this._delete, ttl, this, key);
        }
    }

    delete(key: string): void {
        this._delete(this, key);
    }

    truncate(): TypeCache {
        for (let key of Object.keys(this._cache)) {
            this._delete(this, key);
        }
        this._cache = {};
        this._count = 0;
        return this;
    }

    _delete(cache: TypeCache, key: string): void {
        if (cache.exists(key)) {
            cache.emit("delete", Object.assign({ key: key }, cache._cache[key]));
            delete cache._cache[key];
            cache._count--;
        }
    }
}