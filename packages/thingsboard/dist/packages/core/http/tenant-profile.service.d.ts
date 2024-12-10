import { HttpClient } from '../../angular-http';
import { PageLink } from '../../shared/models/page/page-link';
import { RequestConfig } from './http-utils';
import { Observable } from 'rxjs';
import { PageData } from '../../shared/models/page/page-data';
import { TenantProfile } from '../../shared/models/tenant.model';
import { EntityInfoData } from '../../shared/models/entity.models';
export declare class TenantProfileService {
    private http;
    constructor(http: HttpClient);
    getTenantProfiles(pageLink: PageLink, config?: RequestConfig): Observable<PageData<TenantProfile>>;
    getTenantProfile(tenantProfileId: string, config?: RequestConfig): Observable<TenantProfile>;
    saveTenantProfile(tenantProfile: TenantProfile, config?: RequestConfig): Observable<TenantProfile>;
    deleteTenantProfile(tenantProfileId: string, config?: RequestConfig): Observable<Object>;
    setDefaultTenantProfile(tenantProfileId: string, config?: RequestConfig): Observable<TenantProfile>;
    getDefaultTenantProfileInfo(config?: RequestConfig): Observable<EntityInfoData>;
    getTenantProfileInfo(tenantProfileId: string, config?: RequestConfig): Observable<EntityInfoData>;
    getTenantProfileInfos(pageLink: PageLink, config?: RequestConfig): Observable<PageData<EntityInfoData>>;
    getTenantProfilesByIds(tenantProfileIds: Array<string>, config?: RequestConfig): Observable<Array<EntityInfoData>>;
}
