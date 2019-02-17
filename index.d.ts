import { URL } from 'url';

declare namespace wumpfetch {
    /**
     * Declares a `GET` request
     * @param url The url of the request
     * @returns The request to execute
     */
    export function get(url: string): wumpfetch.WumpRequest;

    /**
     * Declares a `POST` request
     * @param url The url of the request
     * @returns The request to execute
     */
    export function post(url: string): wumpfetch.WumpRequest;

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

        constructor(url: string, method: string);
        public query(a: string | object, b?: string): this;
        public body(data: any, SA: any): this;
        public header(a: string | object, b?: string): this;
        public compress(): this;
        public path(p: string): this;
        public stream(): this;
        public option(n: string, v: string): this;
        public timeout(timeout: number): this;
        public send(): Promise<wumpfetch.WumpResponse>;
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
        public json(): { [x: string]: any };
    }
}

declare module 'wumpfetch' {
    export = wumpfetch;
}
