import { HttpClient } from '../../angular-http';
import { PageLink } from '../../shared/models/page/page-link';
import { RequestConfig } from '../../core/http/http-utils';
import { Observable } from 'rxjs';
import { PageData } from '../../shared/models/page/page-data';
import { ChecksumAlgorithm, OtaPackage, OtaPackageInfo, OtaUpdateType } from '../../shared/models/ota-package.models';
import { EntityId } from '../../shared/models/id/entity-id';
export declare class OtaPackageService {
    private http;
    constructor(http: HttpClient);
    getOtaPackages(pageLink: PageLink, config?: RequestConfig): Observable<PageData<OtaPackageInfo>>;
    getOtaPackagesInfoByDeviceProfileId(pageLink: PageLink, deviceProfileId: string, type: OtaUpdateType, config?: RequestConfig): Observable<PageData<OtaPackageInfo>>;
    getOtaPackage(otaPackageId: string, config?: RequestConfig): Observable<OtaPackage>;
    getOtaPackageInfo(otaPackageId: string, config?: RequestConfig): Observable<OtaPackageInfo>;
    saveOtaPackage(otaPackage: OtaPackage, config?: RequestConfig): Observable<OtaPackage>;
    saveOtaPackageInfo(otaPackageInfo: OtaPackageInfo, config?: RequestConfig): Observable<OtaPackage>;
    uploadOtaPackageFile(otaPackageId: string, file: File, checksumAlgorithm: ChecksumAlgorithm, checksum?: string, config?: RequestConfig): Observable<any>;
    deleteOtaPackage(otaPackageId: string, config?: RequestConfig): Observable<Object>;
    countUpdateDeviceAfterChangePackage(type: OtaUpdateType, entityId: EntityId, config?: RequestConfig): Observable<number>;
}
