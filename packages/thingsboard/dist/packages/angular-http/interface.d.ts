import { HttpHandler, HttpBackend } from "./src/backend";
import { Observable } from "rxjs";
import { HttpEvent } from "./src/response";
import { HttpRequest } from "./src/request";
import { HttpInterceptor } from "./src/interceptor";
export declare class DOCUMENT {
    constructor();
}
export declare class XhrFactory {
    build(): XMLHttpRequest;
}
export declare class HttpInterceptingHandler implements HttpHandler {
    private backend;
    private httpInterceptors;
    private chain;
    constructor(backend: HttpBackend, httpInterceptors: HttpInterceptor[]);
    handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}
