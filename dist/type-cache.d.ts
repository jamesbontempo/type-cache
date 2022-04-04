/// <reference types="node" />
import { EventEmitter } from "events";
export declare class TypeCache extends EventEmitter {
    #private;
    constructor();
    get count(): number;
    get ttl(): number;
    set ttl(ttl: number);
    keys(): Array<string>;
    insert(key: string, value: any, ttl?: number): void;
    exists(key: string): boolean;
    select(key: string): any;
    update(key: string, value: any): void;
    remaining(key: string): number | void;
    extend(key: string, ttl?: number): void;
    shorten(key: string, ttl: number): void;
    delete(key: string): void;
    truncate(): void;
}
