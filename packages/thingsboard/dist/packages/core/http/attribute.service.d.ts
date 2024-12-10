import { RequestConfig } from './http-utils';
import { Observable } from 'rxjs';
import { HttpClient } from '../../angular-http';
import { EntityId } from '../../shared/models/id/entity-id';
import { AttributeData, AttributeScope, DataSortOrder, TimeseriesData } from '../../shared/models/telemetry/telemetry.models';
import { AggregationType } from '../../shared/models/time/time.models';
export declare class AttributeService {
    private http;
    constructor(http: HttpClient);
    getEntityAttributes(entityId: EntityId, attributeScope?: AttributeScope, keys?: Array<string>, config?: RequestConfig): Observable<Array<AttributeData>>;
    deleteEntityAttributes(entityId: EntityId, attributeScope: AttributeScope, attributes: Array<AttributeData>, config?: RequestConfig): Observable<any>;
    deleteEntityTimeseries(entityId: EntityId, timeseries: Array<AttributeData>, deleteAllDataForKeys?: boolean, startTs?: number, endTs?: number, rewriteLatestIfDeleted?: boolean, deleteLatest?: boolean, config?: RequestConfig): Observable<any>;
    saveEntityAttributes(entityId: EntityId, attributeScope: AttributeScope, attributes: Array<AttributeData>, config?: RequestConfig): Observable<any>;
    saveEntityTimeseries(entityId: EntityId, timeseriesScope: string, timeseries: Array<AttributeData>, config?: RequestConfig): Observable<any>;
    getEntityTimeseries(entityId: EntityId, keys: Array<string>, startTs: number, endTs: number, limit?: number, agg?: AggregationType, interval?: number, orderBy?: DataSortOrder, useStrictDataTypes?: boolean, config?: RequestConfig): Observable<TimeseriesData>;
    getEntityTimeseriesLatest(entityId: EntityId, keys?: Array<string>, useStrictDataTypes?: boolean, config?: RequestConfig): Observable<TimeseriesData>;
}
