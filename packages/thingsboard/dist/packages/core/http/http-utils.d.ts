import { InterceptorHttpParams } from '../interceptors/interceptor-http-params';
import { HttpHeaders } from '../../angular-http';
export interface RequestConfig {
    ignoreLoading?: boolean;
    ignoreErrors?: boolean;
    resendRequest?: boolean;
}
export declare function defaultHttpOptionsFromConfig(config?: RequestConfig): {
    headers: HttpHeaders;
    params: InterceptorHttpParams;
};
export declare function defaultHttpOptions(ignoreLoading?: boolean, ignoreErrors?: boolean, resendRequest?: boolean): {
    headers: HttpHeaders;
    params: InterceptorHttpParams;
};
export declare function defaultHttpUploadOptions(ignoreLoading?: boolean, ignoreErrors?: boolean, resendRequest?: boolean): {
    params: InterceptorHttpParams;
};
