import { AliasFilterType, EntityFilters } from '../../../shared/models/alias.models';
import { EntityId } from '../../../shared/models/id/entity-id';
import { DataKeyType } from '../../../shared/models/telemetry/telemetry.models';
import { EntityInfo } from '../../../shared/models/entity.models';
import { DataKey, Datasource } from '../../../shared/models/widget.models';
import { PageData } from '../../../shared/models/page/page-data';
import { TranslateService } from '../../../inversify/interface';
import { AlarmInfo, AlarmSearchStatus, AlarmSeverity } from '../alarm.models';
import { UserId } from '../id/user-id';
import { Direction } from '../../../shared/models/page/sort-order';
export declare enum EntityKeyType {
    ATTRIBUTE = "ATTRIBUTE",
    CLIENT_ATTRIBUTE = "CLIENT_ATTRIBUTE",
    SHARED_ATTRIBUTE = "SHARED_ATTRIBUTE",
    SERVER_ATTRIBUTE = "SERVER_ATTRIBUTE",
    TIME_SERIES = "TIME_SERIES",
    ENTITY_FIELD = "ENTITY_FIELD",
    ALARM_FIELD = "ALARM_FIELD",
    CONSTANT = "CONSTANT",
    COUNT = "COUNT"
}
export declare const entityKeyTypeTranslationMap: Map<EntityKeyType, string>;
export declare function entityKeyTypeToDataKeyType(entityKeyType: EntityKeyType): DataKeyType;
export declare function dataKeyTypeToEntityKeyType(dataKeyType: DataKeyType): EntityKeyType;
export interface EntityKey {
    type: EntityKeyType;
    key: string;
}
export declare function dataKeyToEntityKey(dataKey: DataKey): EntityKey;
export declare enum EntityKeyValueType {
    STRING = "STRING",
    NUMERIC = "NUMERIC",
    BOOLEAN = "BOOLEAN",
    DATE_TIME = "DATE_TIME"
}
export interface EntityKeyValueTypeData {
    name: string;
    icon: string;
}
export declare const entityKeyValueTypesMap: Map<EntityKeyValueType, EntityKeyValueTypeData>;
export declare function entityKeyValueTypeToFilterPredicateType(valueType: EntityKeyValueType): FilterPredicateType;
export declare function createDefaultFilterPredicateInfo(valueType: EntityKeyValueType, complex: boolean): KeyFilterPredicateInfo;
export declare function createDefaultFilterPredicateUserInfo(): KeyFilterPredicateUserInfo;
export declare function createDefaultFilterPredicate(valueType: EntityKeyValueType, complex: boolean): KeyFilterPredicate;
export declare function getDynamicSourcesForAllowUser(allow: boolean): DynamicValueSourceType[];
export declare enum FilterPredicateType {
    STRING = "STRING",
    NUMERIC = "NUMERIC",
    BOOLEAN = "BOOLEAN",
    COMPLEX = "COMPLEX"
}
export declare enum StringOperation {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    STARTS_WITH = "STARTS_WITH",
    ENDS_WITH = "ENDS_WITH",
    CONTAINS = "CONTAINS",
    NOT_CONTAINS = "NOT_CONTAINS",
    IN = "IN",
    NOT_IN = "NOT_IN"
}
export declare const stringOperationTranslationMap: Map<StringOperation, string>;
export declare enum NumericOperation {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL",
    GREATER = "GREATER",
    LESS = "LESS",
    GREATER_OR_EQUAL = "GREATER_OR_EQUAL",
    LESS_OR_EQUAL = "LESS_OR_EQUAL"
}
export declare const numericOperationTranslationMap: Map<NumericOperation, string>;
export declare enum BooleanOperation {
    EQUAL = "EQUAL",
    NOT_EQUAL = "NOT_EQUAL"
}
export declare const booleanOperationTranslationMap: Map<BooleanOperation, string>;
export declare enum ComplexOperation {
    AND = "AND",
    OR = "OR"
}
export declare const complexOperationTranslationMap: Map<ComplexOperation, string>;
export declare enum DynamicValueSourceType {
    CURRENT_TENANT = "CURRENT_TENANT",
    CURRENT_CUSTOMER = "CURRENT_CUSTOMER",
    CURRENT_USER = "CURRENT_USER",
    CURRENT_DEVICE = "CURRENT_DEVICE"
}
export declare const dynamicValueSourceTypeTranslationMap: Map<DynamicValueSourceType, string>;
export declare const inheritModeForDynamicValueSourceType: DynamicValueSourceType[];
export interface DynamicValue<T> {
    sourceType: DynamicValueSourceType;
    sourceAttribute: string;
    inherit?: boolean;
}
export interface FilterPredicateValue<T> {
    defaultValue: T;
    userValue?: T;
    dynamicValue?: DynamicValue<T>;
}
export interface StringFilterPredicate {
    type: FilterPredicateType.STRING;
    operation: StringOperation;
    value: FilterPredicateValue<string>;
    ignoreCase: boolean;
}
export interface NumericFilterPredicate {
    type: FilterPredicateType.NUMERIC;
    operation: NumericOperation;
    value: FilterPredicateValue<number>;
}
export interface BooleanFilterPredicate {
    type: FilterPredicateType.BOOLEAN;
    operation: BooleanOperation;
    value: FilterPredicateValue<boolean>;
}
export interface BaseComplexFilterPredicate<T extends KeyFilterPredicate | KeyFilterPredicateInfo> {
    type: FilterPredicateType.COMPLEX;
    operation: ComplexOperation;
    predicates: Array<T>;
}
export type ComplexFilterPredicate = BaseComplexFilterPredicate<KeyFilterPredicate>;
export type ComplexFilterPredicateInfo = BaseComplexFilterPredicate<KeyFilterPredicateInfo>;
export type KeyFilterPredicate = StringFilterPredicate | NumericFilterPredicate | BooleanFilterPredicate | ComplexFilterPredicate | ComplexFilterPredicateInfo;
export interface KeyFilterPredicateUserInfo {
    editable: boolean;
    label: string;
    autogeneratedLabel: boolean;
    order?: number;
}
export interface KeyFilterPredicateInfo {
    keyFilterPredicate: KeyFilterPredicate;
    userInfo: KeyFilterPredicateUserInfo;
}
export interface KeyFilter {
    key: EntityKey;
    valueType: EntityKeyValueType;
    value?: string | number | boolean;
    predicate: KeyFilterPredicate;
}
export interface KeyFilterInfo {
    key: EntityKey;
    valueType: EntityKeyValueType;
    value?: string | number | boolean;
    predicates: Array<KeyFilterPredicateInfo>;
}
export interface FilterInfo {
    filter: string;
    editable: boolean;
    keyFilters: Array<KeyFilterInfo>;
}
export interface FiltersInfo {
    datasourceFilters: {
        [datasourceIndex: number]: FilterInfo;
    };
}
export declare function keyFiltersToText(translate: TranslateService, datePipe: any, keyFilters: Array<KeyFilter>): string;
export declare function keyFilterToText(translate: TranslateService, datePipe: any, keyFilter: KeyFilter, parentComplexOperation?: ComplexOperation): string;
export declare function keyFilterPredicateToText(translate: TranslateService, datePipe: any, keyFilter: KeyFilter, keyFilterPredicate: KeyFilterPredicate, parentComplexOperation?: ComplexOperation): string;
export declare function keyFilterInfosToKeyFilters(keyFilterInfos: Array<KeyFilterInfo>): Array<KeyFilter>;
export declare function keyFiltersToKeyFilterInfos(keyFilters: Array<KeyFilter>): Array<KeyFilterInfo>;
export declare function filterInfoToKeyFilters(filter: FilterInfo): Array<KeyFilter>;
export declare function keyFilterPredicateInfoToKeyFilterPredicate(keyFilterPredicateInfo: KeyFilterPredicateInfo): KeyFilterPredicate;
export declare function keyFilterPredicateToKeyFilterPredicateInfo(keyFilterPredicate: KeyFilterPredicate): KeyFilterPredicateInfo;
export declare function isFilterEditable(filter: FilterInfo): boolean;
export declare function isKeyFilterInfoEditable(keyFilterInfo: KeyFilterInfo): boolean;
export declare function isPredicateInfoEditable(predicateInfo: KeyFilterPredicateInfo): boolean;
export interface UserFilterInputInfo {
    label: string;
    valueType: EntityKeyValueType;
    info: KeyFilterPredicateInfo;
}
export declare function filterToUserFilterInfoList(filter: Filter, translate: TranslateService): any;
export declare function keyFilterInfoToUserFilterInfoList(keyFilterInfo: KeyFilterInfo, translate: TranslateService): any[];
export declare function predicateInfoToUserFilterInfoList(key: EntityKey, valueType: EntityKeyValueType, predicateInfo: KeyFilterPredicateInfo, translate: TranslateService): any;
export declare function generateUserFilterValueLabel(key: string, valueType: EntityKeyValueType, operation: StringOperation | BooleanOperation | NumericOperation, translate: TranslateService): string;
export interface Filter extends FilterInfo {
    id: string;
}
export interface Filters {
    [id: string]: Filter;
}
export interface EntityFilter extends EntityFilters {
    type?: AliasFilterType;
}
export interface EntityDataSortOrder {
    key: EntityKey;
    direction: Direction;
}
export interface EntityDataPageLink {
    pageSize: number;
    page: number;
    textSearch?: string;
    sortOrder?: EntityDataSortOrder;
    dynamic?: boolean;
}
export interface AlarmFilter {
    startTs?: number;
    endTs?: number;
    timeWindow?: number;
    typeList?: Array<string>;
    statusList?: Array<AlarmSearchStatus>;
    severityList?: Array<AlarmSeverity>;
    searchPropagatedAlarms?: boolean;
    assigneeId?: UserId;
}
export interface AlarmFilterConfig extends AlarmFilter {
    assignedToCurrentUser?: boolean;
}
export declare const alarmFilterConfigEquals: (filter1?: AlarmFilterConfig, filter2?: AlarmFilterConfig) => boolean;
export type AlarmCountQuery = EntityCountQuery & AlarmFilter;
export type AlarmDataPageLink = EntityDataPageLink & AlarmFilter;
export declare function entityDataPageLinkSortDirection(pageLink: EntityDataPageLink): any;
export declare function createDefaultEntityDataPageLink(pageSize: number): EntityDataPageLink;
export declare const singleEntityDataPageLink: EntityDataPageLink;
export declare const singleEntityFilterFromDeviceId: (deviceId: string) => EntityFilter;
export interface EntityCountQuery {
    entityFilter: EntityFilter;
    keyFilters?: Array<KeyFilter>;
}
export interface AbstractDataQuery<T extends EntityDataPageLink> extends EntityCountQuery {
    pageLink: T;
    entityFields?: Array<EntityKey>;
    latestValues?: Array<EntityKey>;
}
export interface EntityDataQuery extends AbstractDataQuery<EntityDataPageLink> {
}
export interface AlarmDataQuery extends AbstractDataQuery<AlarmDataPageLink> {
    alarmFields?: Array<EntityKey>;
}
export interface TsValue {
    ts: number;
    value: string;
    count?: number;
}
export interface ComparisonTsValue {
    current?: TsValue;
    previous?: TsValue;
}
export interface EntityData {
    entityId: EntityId;
    latest: {
        [entityKeyType: string]: {
            [key: string]: TsValue;
        };
    };
    timeseries: {
        [key: string]: Array<TsValue>;
    };
    aggLatest?: {
        [id: number]: ComparisonTsValue;
    };
}
export interface AlarmData extends AlarmInfo {
    entityId: string;
    latest: {
        [entityKeyType: string]: {
            [key: string]: TsValue;
        };
    };
}
export declare function entityPageDataChanged(prevPageData: PageData<EntityData>, nextPageData: PageData<EntityData>): boolean;
export declare const entityInfoFields: EntityKey[];
export declare function entityDataToEntityInfo(entityData: EntityData): EntityInfo;
export declare function updateDatasourceFromEntityInfo(datasource: Datasource, entity: EntityInfo, createFilter?: boolean): void;
