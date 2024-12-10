import { RequestConfig } from './http-utils';
import { Observable } from 'rxjs';
import { HttpClient } from '../../angular-http';
import { TimePageLink } from '../../shared/models/page/page-link';
import { PageData } from '../../shared/models/page/page-data';
import { AuditLog } from '../../shared/models/audit-log.models';
import { EntityId } from '../../shared/models/id/entity-id';
export declare class AuditLogService {
    private http;
    constructor(http: HttpClient);
    getAuditLogs(pageLink: TimePageLink, config?: RequestConfig): Observable<PageData<AuditLog>>;
    getAuditLogsByCustomerId(customerId: string, pageLink: TimePageLink, config?: RequestConfig): Observable<PageData<AuditLog>>;
    getAuditLogsByUserId(userId: string, pageLink: TimePageLink, config?: RequestConfig): Observable<PageData<AuditLog>>;
    getAuditLogsByEntityId(entityId: EntityId, pageLink: TimePageLink, config?: RequestConfig): Observable<PageData<AuditLog>>;
}
