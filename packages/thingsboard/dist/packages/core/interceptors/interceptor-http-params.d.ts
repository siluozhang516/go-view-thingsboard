import { HttpParams } from '../../angular-http';
import { InterceptorConfig } from './interceptor-config';
export declare class InterceptorHttpParams extends HttpParams {
    interceptorConfig: InterceptorConfig;
    constructor(interceptorConfig: InterceptorConfig, params?: {
        [param: string]: string | string[];
    });
}
