export declare const APP_PREFIX = "TB-";
export declare class LocalStorageService {
    constructor();
    static loadInitialState(): any;
    setItem(key: string, value: any): void;
    getItem(key: string): any;
    removeItem(key: string): void;
}
