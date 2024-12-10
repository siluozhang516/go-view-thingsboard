import { HttpClient } from '../../angular-http';
import { PageLink } from '../../shared/models/page/page-link';
import { RequestConfig } from '../../core/http/http-utils';
import { Observable } from 'rxjs';
import { PageData } from '../../shared/models/page/page-data';
import { Resource, ResourceInfo, ResourceType } from '../../shared/models/resource.models';
export declare class ResourceService {
    private http;
    constructor(http: HttpClient);
    getResources(pageLink: PageLink, resourceType?: ResourceType, config?: RequestConfig): Observable<PageData<ResourceInfo>>;
    getTenantResources(pageLink: PageLink, config?: RequestConfig): Observable<PageData<ResourceInfo>>;
    getResource(resourceId: string, config?: RequestConfig): Observable<Resource>;
    getResourceInfo(resourceId: string, config?: RequestConfig): Observable<ResourceInfo>;
    saveResources(resources: Resource[], config?: RequestConfig): Observable<Resource[]>;
    saveResource(resource: Resource, config?: RequestConfig): Observable<Resource>;
    deleteResource(resourceId: string, config?: RequestConfig): Observable<Object>;
}
