import { EntityType } from '../../../shared/models/entity-type.models';
import { AggregationType } from '../time/time.models';
import { Observable } from 'rxjs';
import { EntityId } from '../../../shared/models/id/entity-id';
import { AlarmCountQuery, AlarmData, AlarmDataQuery, EntityCountQuery, EntityData, EntityDataQuery, EntityFilter, EntityKey, TsValue } from '../../../shared/models/query/query.models';
import { PageData } from '../../../shared/models/page/page-data';
import { CmdWrapper, WsService, WsSubscriber } from '../../../shared/models/websocket/websocket.models';
import { TelemetryWebsocketService } from '../../../core/ws/telemetry-websocket.service';
import { Notification } from '../../../shared/models/notification.models';
import { WebsocketService } from '../../../core/ws/websocket.service';
export declare const NOT_SUPPORTED = "Not supported!";
type NgZone = any;
export declare enum DataKeyType {
    timeseries = "timeseries",
    attribute = "attribute",
    function = "function",
    alarm = "alarm",
    entityField = "entityField",
    count = "count"
}
export declare enum LatestTelemetry {
    LATEST_TELEMETRY = "LATEST_TELEMETRY"
}
export declare enum AttributeScope {
    CLIENT_SCOPE = "CLIENT_SCOPE",
    SERVER_SCOPE = "SERVER_SCOPE",
    SHARED_SCOPE = "SHARED_SCOPE"
}
export declare enum TimeseriesDeleteStrategy {
    DELETE_ALL_DATA = "DELETE_ALL_DATA",
    DELETE_ALL_DATA_EXCEPT_LATEST_VALUE = "DELETE_ALL_DATA_EXCEPT_LATEST_VALUE",
    DELETE_LATEST_VALUE = "DELETE_LATEST_VALUE",
    DELETE_ALL_DATA_FOR_TIME_PERIOD = "DELETE_ALL_DATA_FOR_TIME_PERIOD"
}
export type TelemetryType = LatestTelemetry | AttributeScope;
export declare const toTelemetryType: (val: string) => TelemetryType;
export declare const telemetryTypeTranslations: Map<TelemetryType, string>;
export declare const telemetryTypeTranslationsShort: Map<TelemetryType, string>;
export declare const isClientSideTelemetryType: Map<TelemetryType, boolean>;
export declare const timeseriesDeleteStrategyTranslations: Map<TimeseriesDeleteStrategy, string>;
export interface AttributeData {
    lastUpdateTs?: number;
    key: string;
    value: any;
}
export interface TimeseriesData {
    [key: string]: Array<TsValue>;
}
export declare enum DataSortOrder {
    ASC = "ASC",
    DESC = "DESC"
}
export declare enum WsCmdType {
    AUTH = "AUTH",
    ATTRIBUTES = "ATTRIBUTES",
    TIMESERIES = "TIMESERIES",
    TIMESERIES_HISTORY = "TIMESERIES_HISTORY",
    ENTITY_DATA = "ENTITY_DATA",
    ENTITY_COUNT = "ENTITY_COUNT",
    ALARM_DATA = "ALARM_DATA",
    ALARM_COUNT = "ALARM_COUNT",
    NOTIFICATIONS = "NOTIFICATIONS",
    NOTIFICATIONS_COUNT = "NOTIFICATIONS_COUNT",
    MARK_NOTIFICATIONS_AS_READ = "MARK_NOTIFICATIONS_AS_READ",
    MARK_ALL_NOTIFICATIONS_AS_READ = "MARK_ALL_NOTIFICATIONS_AS_READ",
    ALARM_DATA_UNSUBSCRIBE = "ALARM_DATA_UNSUBSCRIBE",
    ALARM_COUNT_UNSUBSCRIBE = "ALARM_COUNT_UNSUBSCRIBE",
    ENTITY_DATA_UNSUBSCRIBE = "ENTITY_DATA_UNSUBSCRIBE",
    ENTITY_COUNT_UNSUBSCRIBE = "ENTITY_COUNT_UNSUBSCRIBE",
    NOTIFICATIONS_UNSUBSCRIBE = "NOTIFICATIONS_UNSUBSCRIBE"
}
export interface WebsocketCmd {
    cmdId: number;
    type: WsCmdType;
}
export interface AuthWsCmd {
    authCmd: AuthCmd;
}
export interface TelemetryPluginCmd extends WebsocketCmd {
    keys: string;
}
export declare abstract class SubscriptionCmd implements TelemetryPluginCmd {
    cmdId: number;
    keys: string;
    entityType: EntityType;
    entityId: string;
    scope?: AttributeScope;
    unsubscribe: boolean;
    abstract type: WsCmdType;
}
export declare class AttributesSubscriptionCmd extends SubscriptionCmd {
    type: WsCmdType;
}
export declare enum IntervalType {
    MILLISECONDS = "MILLISECONDS",
    WEEK = "WEEK",
    WEEK_ISO = "WEEK_ISO",
    MONTH = "MONTH",
    QUARTER = "QUARTER"
}
export declare class TimeseriesSubscriptionCmd extends SubscriptionCmd {
    startTs: number;
    timeWindow: number;
    interval: number;
    limit: number;
    agg: AggregationType;
    type: WsCmdType;
}
export declare class GetHistoryCmd implements TelemetryPluginCmd {
    cmdId: number;
    keys: string;
    entityType: EntityType;
    entityId: string;
    startTs: number;
    endTs: number;
    interval: number;
    limit: number;
    agg: AggregationType;
    type: WsCmdType;
}
export interface EntityHistoryCmd {
    keys: Array<string>;
    startTs: number;
    endTs: number;
    intervalType: IntervalType;
    interval: number;
    timeZoneId: string;
    limit: number;
    agg: AggregationType;
    fetchLatestPreviousPoint?: boolean;
}
export interface LatestValueCmd {
    keys: Array<EntityKey>;
}
export interface TimeSeriesCmd {
    keys: Array<string>;
    startTs: number;
    timeWindow: number;
    intervalType: IntervalType;
    interval: number;
    timeZoneId: string;
    limit: number;
    agg: AggregationType;
    fetchLatestPreviousPoint?: boolean;
}
export interface AggKey {
    id: number;
    key: string;
    agg: AggregationType;
    previousStartTs?: number;
    previousEndTs?: number;
    previousValueOnly?: boolean;
}
export interface AggEntityHistoryCmd {
    keys: Array<AggKey>;
    startTs: number;
    endTs: number;
}
export interface AggTimeSeriesCmd {
    keys: Array<AggKey>;
    startTs: number;
    timeWindow: number;
}
export declare class EntityDataCmd implements WebsocketCmd {
    cmdId: number;
    query?: EntityDataQuery;
    historyCmd?: EntityHistoryCmd;
    latestCmd?: LatestValueCmd;
    tsCmd?: TimeSeriesCmd;
    aggHistoryCmd?: AggEntityHistoryCmd;
    aggTsCmd?: AggTimeSeriesCmd;
    type: WsCmdType;
    isEmpty(): boolean;
}
export declare class EntityCountCmd implements WebsocketCmd {
    cmdId: number;
    query?: EntityCountQuery;
    type: WsCmdType;
}
export declare class AlarmDataCmd implements WebsocketCmd {
    cmdId: number;
    query?: AlarmDataQuery;
    type: WsCmdType;
    isEmpty(): boolean;
}
export declare class AlarmCountCmd implements WebsocketCmd {
    cmdId: number;
    query?: AlarmCountQuery;
    type: WsCmdType;
}
export declare class UnreadCountSubCmd implements WebsocketCmd {
    cmdId: number;
    type: WsCmdType;
}
export declare class UnreadSubCmd implements WebsocketCmd {
    limit: number;
    cmdId: number;
    type: WsCmdType;
    constructor(limit?: number);
}
export declare class MarkAsReadCmd implements WebsocketCmd {
    cmdId: number;
    notifications: string[];
    type: WsCmdType;
    constructor(ids: string[]);
}
export declare class MarkAllAsReadCmd implements WebsocketCmd {
    cmdId: number;
    type: WsCmdType;
}
export declare class EntityDataUnsubscribeCmd implements WebsocketCmd {
    cmdId: number;
    type: WsCmdType;
}
export declare class EntityCountUnsubscribeCmd implements WebsocketCmd {
    cmdId: number;
    type: WsCmdType;
}
export declare class AlarmDataUnsubscribeCmd implements WebsocketCmd {
    cmdId: number;
    type: WsCmdType;
}
export declare class AlarmCountUnsubscribeCmd implements WebsocketCmd {
    cmdId: number;
    type: WsCmdType;
}
export declare class UnsubscribeCmd implements WebsocketCmd {
    cmdId: number;
    type: WsCmdType;
}
export declare class AuthCmd implements WebsocketCmd {
    cmdId: number;
    type: WsCmdType.AUTH;
    token: string;
    constructor(token: string);
}
export declare class TelemetryPluginCmdsWrapper implements CmdWrapper {
    constructor();
    cmds: Array<WebsocketCmd>;
    authCmd: AuthCmd;
    private static popCmds;
    setAuth(token: string): void;
    hasCommands(): boolean;
    clear(): void;
    preparePublishCommands(maxCommands: number): TelemetryPluginCmdsWrapper;
}
export type SubscriptionDataEntry = [number, any, number?];
export interface SubscriptionData {
    [key: string]: SubscriptionDataEntry[];
}
export interface IndexedSubscriptionData {
    [id: number]: SubscriptionDataEntry[];
}
export interface SubscriptionDataHolder {
    data: SubscriptionData;
}
export interface SubscriptionUpdateMsg extends SubscriptionDataHolder {
    subscriptionId: number;
    errorCode: number;
    errorMsg: string;
}
export declare enum CmdUpdateType {
    ENTITY_DATA = "ENTITY_DATA",
    ALARM_DATA = "ALARM_DATA",
    ALARM_COUNT_DATA = "ALARM_COUNT_DATA",
    COUNT_DATA = "COUNT_DATA",
    NOTIFICATIONS_COUNT = "NOTIFICATIONS_COUNT",
    NOTIFICATIONS = "NOTIFICATIONS"
}
export interface CmdUpdateMsg {
    cmdId: number;
    errorCode: number;
    errorMsg: string;
    cmdUpdateType: CmdUpdateType;
}
export interface DataUpdateMsg<T> extends CmdUpdateMsg {
    data?: PageData<T>;
    update?: Array<T>;
}
export interface EntityDataUpdateMsg extends DataUpdateMsg<EntityData> {
    cmdUpdateType: CmdUpdateType.ENTITY_DATA;
}
export interface AlarmDataUpdateMsg extends DataUpdateMsg<AlarmData> {
    cmdUpdateType: CmdUpdateType.ALARM_DATA;
    allowedEntities: number;
    totalEntities: number;
}
export interface EntityCountUpdateMsg extends CmdUpdateMsg {
    cmdUpdateType: CmdUpdateType.COUNT_DATA;
    count: number;
}
export interface AlarmCountUpdateMsg extends CmdUpdateMsg {
    cmdUpdateType: CmdUpdateType.ALARM_COUNT_DATA;
    count: number;
}
export interface NotificationCountUpdateMsg extends CmdUpdateMsg {
    cmdUpdateType: CmdUpdateType.NOTIFICATIONS_COUNT;
    totalUnreadCount: number;
    sequenceNumber: number;
}
export interface NotificationsUpdateMsg extends CmdUpdateMsg {
    cmdUpdateType: CmdUpdateType.NOTIFICATIONS;
    update?: Notification;
    notifications?: Notification[];
    totalUnreadCount: number;
    sequenceNumber: number;
}
export type WebsocketDataMsg = AlarmDataUpdateMsg | AlarmCountUpdateMsg | EntityDataUpdateMsg | EntityCountUpdateMsg | SubscriptionUpdateMsg | NotificationCountUpdateMsg | NotificationsUpdateMsg;
export declare const isEntityDataUpdateMsg: (message: WebsocketDataMsg) => message is EntityDataUpdateMsg;
export declare const isAlarmDataUpdateMsg: (message: WebsocketDataMsg) => message is AlarmDataUpdateMsg;
export declare const isEntityCountUpdateMsg: (message: WebsocketDataMsg) => message is EntityCountUpdateMsg;
export declare const isAlarmCountUpdateMsg: (message: WebsocketDataMsg) => message is AlarmCountUpdateMsg;
export declare const isNotificationCountUpdateMsg: (message: WebsocketDataMsg) => message is NotificationCountUpdateMsg;
export declare const isNotificationsUpdateMsg: (message: WebsocketDataMsg) => message is NotificationsUpdateMsg;
export declare class SubscriptionUpdate implements SubscriptionUpdateMsg {
    subscriptionId: number;
    errorCode: number;
    errorMsg: string;
    data: SubscriptionData;
    constructor(msg: SubscriptionUpdateMsg);
    prepareData(keys: string[]): void;
    updateAttributeData(origData: Array<AttributeData>): Array<AttributeData>;
}
export declare class CmdUpdate implements CmdUpdateMsg {
    cmdId: number;
    errorCode: number;
    errorMsg: string;
    cmdUpdateType: CmdUpdateType;
    constructor(msg: CmdUpdateMsg);
}
export declare class DataUpdate<T> extends CmdUpdate implements DataUpdateMsg<T> {
    data?: PageData<T>;
    update?: Array<T>;
    constructor(msg: DataUpdateMsg<T>);
}
export declare class EntityDataUpdate extends DataUpdate<EntityData> {
    constructor(msg: EntityDataUpdateMsg);
    private static processEntityData;
    prepareData(tsOffset: number): void;
}
export declare class AlarmDataUpdate extends DataUpdate<AlarmData> {
    constructor(msg: AlarmDataUpdateMsg);
    allowedEntities: number;
    totalEntities: number;
    private static processAlarmData;
    prepareData(tsOffset: number): void;
}
export declare class EntityCountUpdate extends CmdUpdate {
    count: number;
    constructor(msg: EntityCountUpdateMsg);
}
export declare class AlarmCountUpdate extends CmdUpdate {
    count: number;
    constructor(msg: AlarmCountUpdateMsg);
}
export declare class NotificationCountUpdate extends CmdUpdate {
    totalUnreadCount: number;
    sequenceNumber: number;
    constructor(msg: NotificationCountUpdateMsg);
}
export declare class NotificationsUpdate extends CmdUpdate {
    totalUnreadCount: number;
    sequenceNumber: number;
    update?: Notification;
    notifications?: Notification[];
    constructor(msg: NotificationsUpdateMsg);
}
export declare class TelemetrySubscriber extends WsSubscriber {
    private telemetryService;
    protected zone?: NgZone;
    private dataSubject;
    private entityDataSubject;
    private alarmDataSubject;
    private entityCountSubject;
    private alarmCountSubject;
    private tsOffset;
    data$: Observable<SubscriptionUpdate>;
    entityData$: Observable<EntityDataUpdate>;
    alarmData$: Observable<AlarmDataUpdate>;
    entityCount$: Observable<EntityCountUpdate>;
    alarmCount$: Observable<AlarmCountUpdate>;
    static createEntityAttributesSubscription(telemetryService: TelemetryWebsocketService, entityId: EntityId, attributeScope: TelemetryType, zone: NgZone, keys?: string[]): TelemetrySubscriber;
    static createEntityFilterLatestSubscription(telemetryService: TelemetryWebsocketService, entityFilter: EntityFilter, zone: NgZone, latestKeys?: EntityKey[]): TelemetrySubscriber;
    constructor(telemetryService: TelemetryWebsocketService, zone?: NgZone);
    complete(): void;
    setTsOffset(tsOffset: number): boolean;
    onData(message: SubscriptionUpdate): void;
    onEntityData(message: EntityDataUpdate): void;
    onAlarmData(message: AlarmDataUpdate): void;
    onEntityCount(message: EntityCountUpdate): void;
    onAlarmCount(message: AlarmCountUpdate): void;
    attributeData$(): Observable<Array<AttributeData>>;
}
export declare class NotificationSubscriber extends WsSubscriber {
    private websocketService;
    protected zone?: NgZone;
    private notificationCountSubject;
    private notificationsSubject;
    messageLimit: number;
    notificationCount$: Observable<number>;
    notifications$: Observable<Notification[]>;
    static createNotificationCountSubscription(websocketService: WebsocketService<WsSubscriber>, zone: NgZone): NotificationSubscriber;
    static createNotificationsSubscription(websocketService: WebsocketService<WsSubscriber>, zone: NgZone, limit?: number): NotificationSubscriber;
    static createMarkAsReadCommand(websocketService: WebsocketService<WsSubscriber>, ids: string[]): NotificationSubscriber;
    static createMarkAllAsReadCommand(websocketService: WebsocketService<WsSubscriber>): NotificationSubscriber;
    constructor(websocketService: WsService<any>, zone?: NgZone);
    onNotificationCountUpdate(message: NotificationCountUpdate): void;
    complete(): void;
    onNotificationsUpdate(message: NotificationsUpdate): void;
}
export {};
