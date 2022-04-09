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
    select(key: string): any;
    exists(key: string): boolean;
    update(key: string, value: any): void;
    remaining(key: string): number | void;
    extend(key: string, ttl?: number): void;
    shorten(key: string, ttl: number): void;
    delete(key: string): void;
    clear(): void;
}
