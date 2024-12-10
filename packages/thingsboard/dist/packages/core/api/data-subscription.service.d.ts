import { WidgetSubscriptionContext, IWidgetSubscription, WidgetSubscriptionCallbacks, SubscriptionInfo } from "./widget-api.models";
import { TimeService } from "../services/time.service";
import { DeviceService } from "../http/device.service";
import { EntityDataService } from "./entity-data.service";
import { AlarmDataService } from "./alarm-data.service";
import { Observable } from "rxjs/internal/Observable";
import { DataKey, Datasource, DatasourceData, DatasourceType, TargetDevice, widgetType } from "../../shared/models/widget.models";
import { KeyFilter, EntityDataPageLink, EntityFilter, AlarmDataPageLink, AlarmData } from "../../shared/models/query/query.models";
import { EntityService } from "../http/entity.service";
import { Aggregation, FixedWindow, HistoryWindow, RealtimeWindow, Timewindow } from "../../shared/models/time/time.models";
import { UtilsService } from "../services/utils.service";
import { HttpClient } from "../../angular-http";
import { TranslateService } from "../../inversify/interface";
import { RafService } from "../services/raf.service";
import { EntityId, TelemetryType, AttributeData, PageData } from "../..";
import { TelemetryWebsocketService } from "../ws/telemetry-websocket.service";
export interface TableEntityData {
    entityId: string;
    entityName: string;
    entityLabel?: string;
    entityType?: string;
    [key: string]: any;
}
export interface ResolvedDatasource {
    type?: DatasourceType | any;
    dataKeys?: Array<DataKey>;
    pageLink?: EntityDataPageLink;
    keyFilters?: Array<KeyFilter>;
    entityFilter?: EntityFilter;
}
export declare class DataSubscriptionService {
    private utils;
    private timeService;
    private deviceService;
    private entityDataService;
    private alarmDataService;
    private rafService;
    private translate;
    private http;
    private entityService;
    private telemetryService;
    stDiffObservable: Observable<number>;
    constructor(utils: UtilsService, timeService: TimeService, deviceService: DeviceService, entityDataService: EntityDataService, alarmDataService: AlarmDataService, rafService: RafService, translate: TranslateService, http: HttpClient, entityService: EntityService, telemetryService: TelemetryWebsocketService);
    createEntityAttributesSubscription(entityId: EntityId, attributeScope: TelemetryType, keys?: string[]): Observable<AttributeData[]>;
    createSubscriptionContext(): WidgetSubscriptionContext;
    createDefaultSubscription(widgetOption: WidgetOption): Observable<any>;
    createSubscriptionFromInfo(widgetOption: WidgetOption, subscriptionsInfo: Array<SubscriptionInfo>, subscribe?: boolean): Observable<IWidgetSubscription>;
    private createSubscription;
    private datasourceToEntityData;
    subscribeForLatestTelemetry(entityId: EntityId, keys?: string[]): Observable<AttributeData[]>;
    subscribeForLatestPaginatedData(entityFilter: EntityFilter, dataKeys: DataKey[], pageLink: EntityDataPageLink, keyFilters?: KeyFilter[]): Observable<PageData<TableEntityData>>;
    subscribeForHistoryPaginatedData(entityFilter: EntityFilter, dataKeys: DataKey[], pageLink: EntityDataPageLink, history: HistoryWindow, keyFilters?: KeyFilter[]): Observable<DatasourceData[]>;
    subscribeForRealtimePaginatedData(entityFilter: EntityFilter, dataKeys: DataKey[], pageLink: EntityDataPageLink, realtime: RealtimeWindow, keyFilters?: KeyFilter[]): Observable<DatasourceData[]>;
    subscribeForPaginatedData(widgetType1: widgetType, datasource: Datasource, pageLink: EntityDataPageLink, keyFilters: KeyFilter[], timeWindowConfig?: Timewindow): Observable<IWidgetSubscription>;
    subscribeForHistoryTimeseries(entityFilter: EntityFilter, pageLink: EntityDataPageLink, dataKeys: DataKey[], historyWindow: HistoryWindow, aggregation: Aggregation): Observable<PageData<TableEntityData>>;
    subscribeForRealtimeTimeseries(entityFilter: EntityFilter, pageLink: EntityDataPageLink, dataKeys: DataKey[], realtimeWindow: RealtimeWindow, aggregation: Aggregation): Observable<PageData<TableEntityData>>;
    subscribeForTimeseriesWithTimewindow(entityFilter: EntityFilter, pageLink: EntityDataPageLink, dataKeys: DataKey[], timeWindowConfig?: Timewindow): Observable<PageData<TableEntityData>>;
    subscribeData(widgetType1: widgetType, datasource: Datasource, timeWindowConfig?: Timewindow): Observable<IWidgetSubscription>;
    sendOneWayCommand(deviceId: string, method: string, params?: any, timeout?: number, persistent?: boolean, persistentPollingInterval?: number, retries?: number, additionalInfo?: any, requestUUID?: string): Observable<any>;
    sendTwoWayCommand(deviceId: string, method: string, params?: any, timeout?: number, persistent?: boolean, persistentPollingInterval?: number, retries?: number, additionalInfo?: any, requestUUID?: string): Observable<any>;
    private subscribeForAlarms;
    subscribeForLatestPaginatedAlarmsData(entityFilter: EntityFilter, pageLink: AlarmDataPageLink, keyFilters: KeyFilter[]): Observable<{
        pageData: PageData<AlarmData>;
        update?: AlarmData[];
    }>;
    subscribeForHistoryPaginatedAlarmsData(entityFilter: EntityFilter, pageLink: AlarmDataPageLink, keyFilters: KeyFilter[], fixedWindow: FixedWindow): Observable<{
        pageData: PageData<AlarmData>;
        update?: AlarmData[];
    }>;
    subscribeForRealtimePaginatedAlarmsData(entityFilter: EntityFilter, pageLink: AlarmDataPageLink, keyFilters: KeyFilter[], realtimeWindowMs: number): Observable<{
        pageData: PageData<AlarmData>;
        update?: AlarmData[];
    }>;
    getServerTimeDiff(): Observable<number>;
}
export interface WidgetOption {
    type: widgetType;
    targetDevice?: TargetDevice;
    hasDataPageLink: boolean;
    datasources?: Array<Datasource>;
    alarmSource?: Datasource;
    pageSize?: number;
    timeWindowConfig?: Timewindow;
    callbacks?: WidgetSubscriptionCallbacks;
}
