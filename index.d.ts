declare module 'wumpfetch' {
  import { URL } from 'url';
  import { IncomingMessage, ServerResponse } from 'http';

  export default function w(url: string | ReqOptions, method?: string | ReqOptions): WumpRequest;

  export const version: string;
  export const userAgent: string;

  export function get(url: string | URL | ReqOptions, method?: string | ReqOptions): WumpRequest;
  export function put(url: string | URL | ReqOptions, method?: string | ReqOptions): WumpRequest;
  export function post(url: string | URL | ReqOptions, method?: string | ReqOptions): WumpRequest;
  export function head(url: string | URL | ReqOptions, method?: string | ReqOptions): WumpRequest;
  export function patch(url: string | URL | ReqOptions, method?: string | ReqOptions): WumpRequest;
  export function trace(url: string | URL | ReqOptions, method?: string | ReqOptions): WumpRequest;
  export function connect(url: string | URL | ReqOptions, method?: string | ReqOptions): WumpRequest;
  export function options(url: string | URL | ReqOptions, method?: string | ReqOptions): WumpRequest;

  export function getProfile(name: string): { [x: string]: any };
  export function setProfile(name: string, profileData: { [x: string]: any }): void;
  export function setDefaults(profileData: { [x: string]: any }): void;

  export class WumpRequest {
    public o: {
      m: string;
      url: URL;
      parse: 'json' | 'form';
      follow: boolean;
      streamed: boolean;
      chaining: boolean;
      compressed: boolean;
      timeoutTime: number;
      rHeaders: { [x: string]: string; }
      coreOptions: { [x: string]: any };
      body, json: any;
      data, form: any;
    }
    constructor(url: string | URL | ReqOptions, method?: string | ReqOptions);
    public body(data: any, sendAs?: 'json' | 'form' | 'buffer'): this;
    public path(path: string): this;
    public query(name: string | { [x: string]: string }, value?: string): this;
    public header(name: string | { [x: string]: string }, value?: string): this;
    public option(name: string, value: string): this;
    public timeout(timeout: number): this;
    public stream(): this;
    public compress(): this;
    public send(): Promise<WumpResponse>;
  }

  export class WumpResponse {
    public body: Buffer | { [x: string]: any } | string;
    public coreRes: ServerResponse;
    public headers: { [x: string]: string };
    public statusCode: number;

    constructor(res: any);
    public text(): string;
    public json(): { [x: string]: any };
    public buffer(): Buffer;
    public json<T>(): T;
    public parse(): string | { [x: string]: any };
    private _addChunk(chunk: any): void;
  }

  export interface ReqOptions {
    url?: string | URL;
    parse?: 'json' | 'form';
    method?: string;
    sendDataAs?: 'json' | 'form' | 'buffer';
    chain?: boolean;
    streamed?: boolean;
    compressed?: boolean;
    followRedirects?: boolean;
    timeout?: number;
    headers?: { [x: string]: string };
    coreOptions?: { [x: string]: any };
    body?, json?: any;
    data?, form?: any;
  }
}
