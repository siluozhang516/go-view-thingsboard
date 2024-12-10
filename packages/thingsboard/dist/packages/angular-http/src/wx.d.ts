import { Observable } from 'rxjs';
import { HttpBackend } from './backend';
import { HttpContextToken } from './context';
import { HttpRequest } from './request';
import { HttpEvent } from './response';
/** Use this token to pass additional `wx.uploadFile()` parameter */
export declare const WX_UPLOAD_FILE_TOKEN: HttpContextToken<{
    filePath?: string;
    fileName?: string;
    timeout?: number;
    baseUrl?: string;
}>;
/** Use this token to pass additional `wx.downloadFile()` parameter */
export declare const WX_DOWNLOAD_FILE_TOKEN: HttpContextToken<{
    filePath?: string;
    timeout?: number;
}>;
/** Use this token to pass additional `wx.request()` parameter */
export declare const WX_REQUSET_TOKEN: HttpContextToken<{
    enableCache?: boolean;
    enableHttp2?: boolean;
    enableQuic?: boolean;
    timeout?: number;
    baseUrl?: string;
}>;
export declare class WxHttpBackend implements HttpBackend {
    handle(request: HttpRequest<any>): Observable<HttpEvent<any>>;
    /**
     * wx upload file
     * @param request
     */
    private upload;
    /**
     * wx download file
     * @param request
     */
    private download;
    /**
     * wx http request
     * @param request
     */
    private request;
    private buildHeaders;
}
