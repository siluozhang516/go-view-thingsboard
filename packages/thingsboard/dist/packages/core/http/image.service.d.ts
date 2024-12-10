import { HttpClient } from '../../angular-http';
import { PageLink } from '../../shared/models/page/page-link';
import { RequestConfig } from '../../core/http/http-utils';
import { Observable } from 'rxjs';
import { PageData } from '../../shared/models/page/page-data';
import { ImageResourceInfo, ImageResourceType, ImageExportData } from '../../shared/models/resource.models';
export declare class ImageService {
    private http;
    private resourcesService;
    private imagesLoading;
    constructor(http: HttpClient, resourcesService: any);
    uploadImage(file: File, title: string, config?: RequestConfig): Observable<ImageResourceInfo>;
    updateImage(type: ImageResourceType, key: string, file: File, config?: RequestConfig): Observable<ImageResourceInfo>;
    updateImageInfo(imageInfo: ImageResourceInfo, config?: RequestConfig): Observable<ImageResourceInfo>;
    updateImagePublicStatus(imageInfo: ImageResourceInfo, isPublic: boolean, config?: RequestConfig): Observable<ImageResourceInfo>;
    getImages(pageLink: PageLink, includeSystemImages?: boolean, config?: RequestConfig): Observable<PageData<ImageResourceInfo>>;
    getImageInfo(type: ImageResourceType, key: string, config?: RequestConfig): Observable<ImageResourceInfo>;
    getImageDataUrl(imageUrl: string, preview?: boolean, asString?: boolean, emptyUrl?: string): Observable<any | string>;
    private loadImageDataUrl;
    resolveImageUrl(imageUrl: string, preview?: boolean, asString?: boolean, emptyUrl?: string): Observable<any | string>;
    downloadImage(type: ImageResourceType, key: string): Observable<any>;
    deleteImage(type: ImageResourceType, key: string, force?: boolean, config?: RequestConfig): Observable<Object>;
    exportImage(type: ImageResourceType, key: string, config?: RequestConfig): Observable<ImageExportData>;
    importImage(imageData: ImageExportData, config?: RequestConfig): Observable<ImageResourceInfo>;
}
