"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TypeCache_cache, _TypeCache_count, _TypeCache_ttl;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeCache = void 0;
const { EventEmitter } = require("events");
class TypeCache extends EventEmitter {
    constructor() {
        super();
        _TypeCache_cache.set(this, void 0);
        _TypeCache_count.set(this, void 0);
        _TypeCache_ttl.set(this, void 0);
        __classPrivateFieldSet(this, _TypeCache_cache, {}, "f");
        __classPrivateFieldSet(this, _TypeCache_count, 0, "f");
        __classPrivateFieldSet(this, _TypeCache_ttl, Infinity, "f");
        return this;
    }
    get count() {
        return __classPrivateFieldGet(this, _TypeCache_count, "f");
    }
    get ttl() {
        return __classPrivateFieldGet(this, _TypeCache_ttl, "f");
    }
    set ttl(ttl) {
        if (ttl && typeof ttl === "number" && ttl > 0)
            __classPrivateFieldSet(this, _TypeCache_ttl, ttl, "f");
    }
    keys() {
        return Object.getOwnPropertyNames(__classPrivateFieldGet(this, _TypeCache_cache, "f"));
    }
    insert(key, value, ttl) {
        var _a;
        ttl = (ttl && typeof ttl === "number" && ttl > 0) ? ttl : __classPrivateFieldGet(this, _TypeCache_ttl, "f");
        __classPrivateFieldGet(this, _TypeCache_cache, "f")[key] = {
            value: value,
            ttl: ttl,
            timeout: (ttl !== Infinity) ? setTimeout((key) => { this.delete(key); }, ttl, key) : undefined,
            added: Date.now()
        };
        __classPrivateFieldSet(this, _TypeCache_count, (_a = __classPrivateFieldGet(this, _TypeCache_count, "f"), _a++, _a), "f");
    }
    exists(key) {
        return __classPrivateFieldGet(this, _TypeCache_cache, "f").hasOwnProperty(key);
    }
    select(key) {
        if (this.exists(key))
            return __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].value;
    }
    update(key, value) {
        if (this.exists(key))
            __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].value = value;
    }
    remaining(key) {
        if (this.exists(key)) {
            return __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].ttl - (Date.now() - __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].added);
        }
    }
    extend(key, ttl) {
        if (this.exists(key)) {
            clearTimeout(__classPrivateFieldGet(this, _TypeCache_cache, "f")[key].timeout);
            ttl = (ttl && typeof ttl === "number" && ttl > 0) ? ttl : __classPrivateFieldGet(this, _TypeCache_ttl, "f");
            if (ttl !== Infinity) {
                let remaining = __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].ttl - (Date.now() - __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].added);
                __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].ttl += ttl;
                __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].timeout = setTimeout((key) => { this.delete(key); }, remaining + ttl, key);
            }
            else {
                __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].ttl = ttl;
            }
        }
    }
    shorten(key, ttl) {
        if (this.exists(key) && ttl && typeof ttl === "number") {
            ttl = Math.abs(ttl);
            let remaining = __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].ttl - (Date.now() - __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].added);
            if (ttl < remaining) {
                __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].ttl -= ttl;
                clearTimeout(__classPrivateFieldGet(this, _TypeCache_cache, "f")[key].timeout);
                if (remaining !== Infinity)
                    __classPrivateFieldGet(this, _TypeCache_cache, "f")[key].timeout = setTimeout((key) => { this.delete(key); }, remaining - ttl, key);
            }
        }
    }
    delete(key) {
        var _a;
        if (this.exists(key)) {
            let item = Object.assign({ key: key.toString() }, __classPrivateFieldGet(this, _TypeCache_cache, "f")[key], { deleted: Date.now() });
            delete item.timeout;
            delete __classPrivateFieldGet(this, _TypeCache_cache, "f")[key];
            __classPrivateFieldSet(this, _TypeCache_count, (_a = __classPrivateFieldGet(this, _TypeCache_count, "f"), _a--, _a), "f");
            this.emit("delete", item);
        }
    }
    truncate() {
        for (let key of Object.keys(__classPrivateFieldGet(this, _TypeCache_cache, "f"))) {
            this.delete(key);
        }
        __classPrivateFieldSet(this, _TypeCache_cache, {}, "f");
        __classPrivateFieldSet(this, _TypeCache_count, 0, "f");
    }
}
exports.TypeCache = TypeCache;
_TypeCache_cache = new WeakMap(), _TypeCache_count = new WeakMap(), _TypeCache_ttl = new WeakMap();
//# sourceMappingURL=type-cache.js.map