// Typings for component: "wumpfetch"
// Typings created by auguwu, project made by Wesselgame / PassTheWessel

import { URL } from 'url';

/** The package wumpfetch */
declare namespace w {
    /**
     * Declares a `GET` request
     * @param url The url of the request
     * @returns The request to execute
     */
    export function get(url: string | w.URLOptions): w.WumpRequest;

    /**
     * Declares a `POST` request
     * @param url The url of the request
     * @returns The request to execute
     */
    export function post(url: string | w.URLOptions): w.WumpRequest;

    /**
     * Declares a `PUT` request
     * @param url The url of the request
     * @returns The request class
     */
    export function put(url: string | w.URLOptions): w.WumpRequest;

    /**
     * Declares a `PATCH` request
     * @param url The url
     * @returns The request class
     */
    export function patch(url: string | w.URLOptions): w.WumpRequest;
    
    /**
     * Declares a `CONNECT` request
     * @param url The url
     * @returns The request class
     */
    export function connect(url: string | w.URLOptions): w.WumpRequest;
    
    /**
     * Declares an `OPTIONS` request
     * @param url The url
     * @returns The request class
     */
    export function options(url: string | w.URLOPtions): w.WumpRequest;
    
    /**
     * Declares an `TRACE` request
     * @param url The url
     * @returns The request class
     */
    export function trace(url: string | w.URLOptions): w.WumpRequest;

    /** The request class */
    export class WumpRequest {
        public o: {
            m: string;
            url: URL;
            SDA: any;
            data: any;
            parse: any;
            follow: boolean;
            streamed: boolean;
            compressed: boolean;
            rHeaders: { [x: string]: string; }
            timeoutTime: number;
            coreOptions: object;
        };

        constructor(url: string | wumpfetch.URLOptions, method?: w.URLMethods);
        public query(a: string | object, b?: string): this;
        public body(data: any, SA?: any): this;
        public header(a: string | object, b?: string): this;
        public compress(): this;
        public path(p: string): this;
        public stream(): this;
        public option(n: string, v: string): this;
        public timeout(timeout: number): this;
        public send(): Promise<w.WumpResponse>;
    }

    /** The response class */
    export class WumpResponse {
        public body: any;
        public coreRes: any;
        public headers: { [x: string]: string };
        public statusCode: number;
        constructor(res: any);
        private _addChunk(chunk: any): void;
        public text(): string;
        public json(): NormalObject;
    }

    export type KVObject = { [x: string]: string };
    export type NormalObject = { [x: string]: any };
    export type URLMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | "DELETE" | 'CONNECT' | 'OPTIONS' | 'TRACE';
    // wessel add more options when needed
    export interface URLOptions {
        url: string;
        method: URLMethods;
        data?: NormalObject;
        headers?: KVObject;
    }
}

declare module 'wumpfetch' {
    export function w(url: string | w.URLOptions): w.WumpRequest;
    export = w;
}
