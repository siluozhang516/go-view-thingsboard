import { HttpEvent } from "../../angular-http/src/response";
import { HttpHandler } from "../../angular-http/src/backend";
import { HttpRequest } from "../../angular-http/src/request";
import { HttpInterceptor } from "../../angular-http/src/interceptor";
import { Observable } from "rxjs/internal/Observable";
export declare class GlobalHttpInterceptor implements HttpInterceptor {
    private AUTH_SCHEME;
    private AUTH_HEADER_NAME;
    private internalUrlPrefixes;
    private activeRequests;
    private authService;
    constructor();
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    private jwtIntercept;
    private handleRequest;
    private handleResponseError;
    private retryRequest;
    private refreshTokenAndRetry;
    private updateAuthorizationHeader;
    private isInternalUrlPrefix;
    private isTokenBasedAuthEntryPoint;
    private updateLoadingState;
    private getInterceptorConfig;
    private showError;
}
