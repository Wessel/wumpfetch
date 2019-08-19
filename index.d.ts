declare module 'wumpfetch' {
    import { URL } from 'url';
    import { IncomingMessage, ServerResponse } from 'http';

    export const userAgent: string;
    export const version: string;
    export const defaults: URLOptions;
    export function setDefaults(data: URLOptions): void;
    export function getProfile(name: string): URLOptions;
    export function setProfile(name: string, data: URLOptions): URLOptions;
    export function get(url: string | URLOptions, method?: URLMethod | MethodOptions): WumpRequest;
    export function post(url: string | URLOptions, method?: URLMethod | MethodOptions): WumpRequest;
    export function put(url: string | URLOptions, method?: URLMethod | MethodOptions): WumpRequest;
    export function patch(url: string | URLOptions, method?: URLMethod | MethodOptions): WumpRequest;
    export function connect(url: string | URLOptions, method?: URLMethod | MethodOptions): WumpRequest;
    export function options(url: string | URLOptions, method?: URLMethod | MethodOptions): WumpRequest;
    export function trace(url: string | URLOptions, method?: URLMethod | URLOptions): WumpRequest;
    export class WumpRequest {
        public o: {
            m: string;
            url: URL;
            data: any;
            parse: any;
            follow: boolean;
            streamed: boolean;
            chaining: boolean;
            compressed: boolean;
            rHeaders: { [x: string]: string; }
            timeoutTime: number;
            coreOptions: object;
        };
        constructor(url: string | URLOptions, method?: URLMethod | MethodOptions);
        public query(a: string | object, b?: string): this;
        public body(data: any, SA?: any): this;
        public header(a: string | object, b?: string): this;
        public compress(): this;
        public path(p: string): this;
        public stream(): this;
        public option(n: string, v: string): this;
        public timeout(timeout: number): this;
        public send(): Promise<WumpResponse>;
    }
    export class WumpResponse {
        public body: Buffer | string;
        public coreRes: ServerResponse;
        public headers: { [x: string]: string };
        public statusCode: number;
        constructor(res: any);
        private _addChunk(chunk: any): void;
        public text(): string;
        public json(): NormalObject;
        public json<T>(): T;
    }
    export type KVObject = { [x: string]: string };
    export type NormalObject = { [x: string]: any };
    export type URLMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | "DELETE" | 'CONNECT' | 'OPTIONS' | 'TRACE';
    export interface URLOptions {
        url: string;
        method: URLMethod;
        data?: NormalObject;
        headers?: KVObject;
        parse?: 'json' | 'buffer' | 'form';
        core?: NormalObject;
        timeout?: number;
        compressed?: boolean;
        streamed?: boolean;
        followRedirects?: any;
        chain?: boolean;
    }
    export interface MethodOptions {
        data?: NormalObject;
        headers?: KVObject;
        chain?: boolean;
        parse?: 'json' | 'buffer' | 'form';
        core?: NormalObject;
        timeout?: number;
        compressed?: boolean;
        streamed?: boolean;
        followRedirects?: any;
    }
    export interface ProfileData {
        data?: NormalObject;
        headers?: KVObject;
        parse?: 'json' | 'buffer' | 'form';
        core?: NormalObject;
        timeout?: number;
        compressed?: boolean;
        streamed?: boolean;
        followRedirects?: any;
        chain?: boolean;
    }
    export default function w(url: string | URLOptions, method?: URLMethod | MethodOptions): WumpRequest;
}