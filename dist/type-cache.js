"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeCache = void 0;
const { EventEmitter } = require("events");
class TypeCache extends EventEmitter {
    constructor() {
        super();
        this._cache = {};
        this._ttl = 0;
        this._count = 0;
        return this;
    }
    get count() {
        return this._count;
    }
    get ttl() {
        return this._ttl;
    }
    set ttl(ttl) {
        if (ttl && typeof ttl === "number" && ttl > 0)
            this._ttl = ttl;
    }
    insert(key, value, ttl) {
        ttl = (ttl && typeof ttl === "number" && ttl > 0) ? ttl : 0;
        this._cache[key] = {
            value: value,
            ttl: ttl,
            timeout: (ttl) ? setTimeout(this._delete, ttl, this, key) : undefined,
            added: Date.now()
        };
        this._count++;
        this.emit("insert", this._cache[key]);
    }
    exists(key) {
        return this._cache.hasOwnProperty(key);
    }
    select(key) {
        if (this.exists(key))
            return this._cache[key].value;
    }
    update(key, value) {
        if (this.exists(key))
            this._cache[key].value = value;
    }
    extend(key, ttl = 0) {
        if (this.exists(key) && ttl && typeof ttl === "number" && ttl >= 0) {
            clearTimeout(this._cache[key].timeout);
            if (ttl > 0)
                this._cache[key].timeout = setTimeout(this._delete, ttl, this, key);
        }
    }
    delete(key) {
        this._delete(this, key);
    }
    truncate() {
        for (let key of Object.keys(this._cache)) {
            this._delete(this, key);
        }
        this._cache = {};
        this._count = 0;
        return this;
    }
    _delete(cache, key) {
        if (cache.exists(key)) {
            cache.emit("delete", Object.assign({ key: key }, cache._cache[key]));
            delete cache._cache[key];
            cache._count--;
        }
    }
}
exports.TypeCache = TypeCache;
//# sourceMappingURL=type-cache.js.map