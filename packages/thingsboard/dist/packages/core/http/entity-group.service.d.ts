import { RequestConfig } from "./http-utils";
import { Observable } from "rxjs";
import { HttpClient } from "../../angular-http";
import { EntityType } from "../../shared/models/entity-type.models";
import { PageLink } from "../../shared/models/public-api";
export interface saveEntityGroup<T> {
    [x: string]: any;
    additionalInfo?: {
        description: string;
        [x: string]: any;
    };
    customerId?: string;
    name: string;
    type?: EntityType;
}
export declare class EntityGroupService {
    private http;
    constructor(http: HttpClient);
    getEntityGroup<T>(entityType: EntityType, config?: RequestConfig): Observable<T>;
    saveEntityGroup<T>(saveEntityGroup: saveEntityGroup<T>, config?: RequestConfig): Observable<saveEntityGroup<T>>;
    getEntityCustomerList<T>(customerId: string, params?: any, config?: RequestConfig): Observable<T>;
    getCustomerGroup<T>(entityType: EntityType, type: EntityType, customerId: string, params?: any, config?: RequestConfig): Observable<T>;
    getEntityGroupList<T>(GroupId: string, params?: any, config?: RequestConfig): Observable<T>;
    getEntityGroupUserList<T>(GroupId: string, pageLink: PageLink, config?: RequestConfig): Observable<T>;
    delEntityGroup<T>(GroupId: string, config?: RequestConfig): Observable<T>;
    getEntityGroupsByPage<T>(entityType: EntityType, pageLink: PageLink, config?: RequestConfig): Observable<T>;
}
