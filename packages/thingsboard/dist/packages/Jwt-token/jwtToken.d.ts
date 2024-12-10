interface JwT {
    decodeToken<T = any>(token: string): T;
    urlBase64Decode(str: string): string;
    b64DecodeUnicode(str: any): void;
    b64decode(str: string): string;
}
export declare class JwtToken implements JwT {
    decodeToken<T = any>(token: string): T;
    urlBase64Decode(str: string): string;
    b64DecodeUnicode(str: any): string;
    b64decode(str: string): string;
}
export {};
