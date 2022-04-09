
import { EventEmitter } from  "events";

export class TypeCache extends EventEmitter {
    #cache: any;
    #count: number;
    #ttl: number;

    constructor() {
        super();
        this.#cache = {};
        this.#count = 0;
        this.#ttl = Infinity;
        return this;
    }

    get count(): number {
        return this.#count;
    }

    get ttl(): number {
        return this.#ttl;
    }

    set ttl(ttl: number) {
        if (ttl && typeof ttl === "number" && ttl > 0) this.#ttl = ttl;
    }

    keys(): Array<string> {
        return Object.getOwnPropertyNames(this.#cache);
    }

    insert(key: string, value: any, ttl?: number, force?: true): void {
        if (this.exists(key)) {
            if (!force) return;
            clearTimeout(this.#cache[key].timeout);
            this.#count--;
        }
        ttl = (ttl && typeof ttl === "number" && ttl > 0) ? ttl : this.#ttl;
        this.#cache[key] = {
            value: value,
            ttl: ttl,
            timeout: (ttl !== Infinity) ? setTimeout((key: string) => { this.delete(key) }, ttl, key) : undefined,
            added: Date.now(),
            modified: undefined,
            deleted: undefined
        }
        this.#count++;
        this.emit("insert", this.#format(key, this.#cache[key]));
    }

    select(key: string): any {
        if (this.exists(key)) return this.#cache[key].value;
    }

    exists(key: string): boolean {
        return this.#cache.hasOwnProperty(key);
    }

    update(key: string, value: any): void {
        if (this.exists(key)) {
            let before = this.#format(key, Object.assign({}, this.#cache[key]));
            this.#cache[key].value = value;
            this.#cache[key].modified = Date.now();
            let after = this.#format(key, Object.assign({}, this.#cache[key]));
            this.emit("update", { before: before, after: after });
        }
    }

    remaining(key: string): number | void {
        if (this.exists(key)) return this.#cache[key].ttl - (Date.now() - this.#cache[key].added);
    }

    extend(key: string, ttl?: number): void {
        if (this.exists(key)) {
            clearTimeout(this.#cache[key].timeout);
            ttl = (ttl && typeof ttl === "number" && ttl > 0) ? ttl : this.#ttl;
            if (ttl !== Infinity) {
                let remaining = this.#cache[key].ttl - (Date.now() - this.#cache[key].added);
                this.#cache[key].ttl += ttl;
                this.#cache[key].timeout = setTimeout((key: string) => { this.delete(key); }, remaining + ttl, key);
            } else {
                this.#cache[key].ttl = ttl;
            }
        }
    }

    shorten(key: string, ttl: number): void {
        if (this.exists(key) && ttl && typeof ttl === "number" && ttl > 0) {
            if (this.#cache[key].ttl === Infinity) {
                this.#cache[key].ttl = ttl;
                this.#cache[key].timeout = setTimeout((key: string) => {this.delete(key); }, ttl, key);
            } else {
                let remaining = this.#cache[key].ttl - (Date.now() - this.#cache[key].added);
                if (ttl < remaining) {
                    this.#cache[key].ttl -= ttl;
                    clearTimeout(this.#cache[key].timeout);
                    if (remaining !== Infinity) this.#cache[key].timeout = setTimeout((key: string) => { this.delete(key); }, remaining - ttl, key);
                }
            }
        }
    }

    delete(key: string): void {
        if (this.exists(key)) {
            let item =  Object.assign({}, this.#cache[key]);
            item.deleted = Date.now();
            delete this.#cache[key];
            this.#count--;
            this.emit("delete", this.#format(key, item));
        }
    }

    clear(): void {
        for (let key of Object.keys(this.#cache)) {
            this.delete(key);
        }
        this.#cache = {};
        this.#count = 0;
    }

    #format(key: string, object: any): any {
        let item = Object.assign({ key: key.toString() }, object);
        delete item.timeout;
        return item;
    }
}