import { Subject } from "rxjs";
import { widgetType, SubscriptionInfo, DatasourceType, EntityType, IWidgetSubscription, AliasFilterType, EntityDataPageLink, Timewindow, Datasource, KeyFilter, DataKey, TableEntityData, PageData, DatasourceData, RelationsQueryFilter, AssetSearchQueryFilter, DeviceSearchQueryFilter, EntityViewSearchQueryFilter, EntitySearchQueryFilter, EdgeSearchQueryFilter } from "../../packages/index";
export type FormQueryValue = RelationsQueryFilter & AssetSearchQueryFilter & DeviceSearchQueryFilter & EntityViewSearchQueryFilter & EntitySearchQueryFilter & EdgeSearchQueryFilter;
export type FormValue = {
    type: AliasFilterType;
    entityType: EntityType;
    id?: string;
    entityList?: string[];
    entityNameFilter?: string;
    stateEntityParamName?: string;
    assetNameFilter?: string;
    deviceNameFilter?: string;
    entityViewTypes?: string[];
    entityViewNameFilter?: string;
    edgeTypes?: string[];
    edgeNameFilter?: string;
} & FormQueryValue;
type DataSourceKeys = Pick<SubscriptionInfo, "attributes" | "timeseries" | "alarmFields">;
interface Options {
    timeWindowConfig?: Timewindow;
    datasourceType?: DatasourceType;
    widgetType?: widgetType;
    pageSize?: number | EntityDataPageLink;
}
export interface PublicParams {
    isPage?: boolean;
    widgetType?: widgetType;
    dataKeys?: DataKey[];
    latestDataKeys?: DataKey[];
    keyFilters?: KeyFilter[];
    pageLink: EntityDataPageLink;
    timeWindowConfig?: Timewindow;
}
export declare class EntitySubscriptionService {
    static onDataUpdatedSubject: Subject<IWidgetSubscription>;
    /**
     * 只能订阅 单个实体、实体列表
     * @param form 数据源表单值
     * @param dataKeys 订阅key
     * @param timeWindowConfig 时间
     * @param pageSize 分页
     * @param type 订阅类型
     * @returns
     */
    static subscribeSingleAndListEntityInfo(formState: FormValue, dataKeys: DataSourceKeys, option: Options): import("rxjs").Observable<DatasourceData[]>;
    /**
     * 公共订阅方法
     * @param params
     * @param formState
     * @returns
     */
    static subscribeEntityInfoPublic(formState: FormValue, params: PublicParams): import("rxjs").Observable<DatasourceData[] | PageData<TableEntityData>>;
    /**
     * 创建EntityFilter
     * @param result
     * @param formState
     * @returns
     */
    static createEntityFilter(result: Datasource, formState: FormValue): Datasource;
    static datasourceToEntityData(datasource: Datasource, data: DatasourceData[], dataKeys: Array<DataKey>): TableEntityData;
    /**
     * 组装订阅info
     * @param form
     * @param dataKeys
     * @param type
     * @param pageSize
     * @returns
     */
    static toSubscriptionsInfo(formState: FormValue, dataKeys: DataSourceKeys, type: DatasourceType, pageSize?: number): SubscriptionInfo[];
    /**
     * 根据entityFilter查询对应的属性、遥测
     * @param formState
     * @returns
     */
    static findEntityKeysByQuery(formState: FormValue, attributes?: boolean, timeseries?: boolean): import("rxjs").Observable<import("../../packages/index").EntitiesKeysByQuery>;
}
export {};
