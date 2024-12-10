import { BaseData, ExportableEntity } from '../../shared/models/base-data';
import { TenantId } from '../../shared/models/id/tenant-id';
import { WidgetTypeId } from '../../shared/models/id/widget-type-id';
import { AggregationType, ComparisonDuration, Timewindow } from '../../shared/models/time/time.models';
import { EntityType } from '../../shared/models/entity-type.models';
import { DataKeyType } from './telemetry/telemetry.models';
import { EntityId } from '../../shared/models/id/entity-id';
import { AlarmFilter, AlarmFilterConfig, EntityDataPageLink, EntityFilter, KeyFilter } from '../../shared/models/query/query.models';
import { Observable } from 'rxjs';
import { Dashboard } from '../../shared/models/dashboard.models';
import { IAliasController } from '../../core/api/widget-api.models';
import { HasTenantId } from '../../shared/models/entity.models';
export declare enum widgetType {
    timeseries = "timeseries",
    latest = "latest",
    rpc = "rpc",
    alarm = "alarm",
    static = "static"
}
export interface WidgetTypeTemplate {
    fullFqn: string;
}
export interface WidgetTypeData {
    name: string;
    icon: string;
    configHelpLinkId: string;
    template: WidgetTypeTemplate;
}
export declare const widgetTypesData: Map<widgetType, WidgetTypeData>;
export interface WidgetResource {
    url: string;
    isModule?: boolean;
}
export interface WidgetActionSource {
    name: string;
    value: string;
    multiple: boolean;
    hasShowCondition?: boolean;
}
export declare const widgetActionSources: {
    [acionSourceId: string]: WidgetActionSource;
};
export interface WidgetTypeDescriptor {
    type: widgetType;
    resources: Array<WidgetResource>;
    templateHtml: string;
    templateCss: string;
    controllerScript: string;
    settingsSchema?: string | any;
    dataKeySettingsSchema?: string | any;
    latestDataKeySettingsSchema?: string | any;
    settingsDirective?: string;
    dataKeySettingsDirective?: string;
    latestDataKeySettingsDirective?: string;
    hasBasicMode?: boolean;
    basicModeDirective?: string;
    defaultConfig: string;
    sizeX: number;
    sizeY: number;
}
export interface WidgetTypeParameters {
    useCustomDatasources?: boolean;
    maxDatasources?: number;
    maxDataKeys?: number;
    datasourcesOptional?: boolean;
    dataKeysOptional?: boolean;
    stateData?: boolean;
    hasDataPageLink?: boolean;
    singleEntity?: boolean;
    hasAdditionalLatestDataKeys?: boolean;
    warnOnPageDataOverflow?: boolean;
    ignoreDataUpdateOnIntervalTick?: boolean;
    processNoDataByWidget?: boolean;
    previewWidth?: string;
    previewHeight?: string;
    embedTitlePanel?: boolean;
    overflowVisible?: boolean;
    hideDataSettings?: boolean;
    defaultDataKeysFunction?: (configComponent: any, configData: any) => DataKey[];
    defaultLatestDataKeysFunction?: (configComponent: any, configData: any) => DataKey[];
    any?: any;
    displayRpcMessageToast?: boolean;
}
export interface WidgetControllerDescriptor {
    widgetTypeFunction?: any;
    settingsSchema?: string | any;
    dataKeySettingsSchema?: string | any;
    latestDataKeySettingsSchema?: string | any;
    typeParameters?: WidgetTypeParameters;
    actionSources?: {
        [actionSourceId: string]: WidgetActionSource;
    };
}
export interface BaseWidgetType extends BaseData<WidgetTypeId>, HasTenantId {
    tenantId: TenantId;
    fqn: string;
    name: string;
    deprecated: boolean;
}
export declare const fullWidgetTypeFqn: (type: BaseWidgetType) => string;
export declare const widgetTypeFqn: (fullFqn: string) => string;
export declare const isValidWidgetFullFqn: (fullFqn: string) => boolean;
export interface WidgetType extends BaseWidgetType {
    descriptor: WidgetTypeDescriptor;
}
export interface WidgetTypeInfo extends BaseWidgetType {
    image: string;
    description: string;
    tags: string[];
    widgetType: widgetType;
}
export interface WidgetTypeDetails extends WidgetType, ExportableEntity<WidgetTypeId> {
    image: string;
    description: string;
    tags: string[];
}
export declare enum DeprecatedFilter {
    ALL = "ALL",
    ACTUAL = "ACTUAL",
    DEPRECATED = "DEPRECATED"
}
export declare enum LegendDirection {
    column = "column",
    row = "row"
}
export declare const legendDirectionTranslationMap: Map<LegendDirection, string>;
export declare enum LegendPosition {
    top = "top",
    bottom = "bottom",
    left = "left",
    right = "right"
}
export declare const legendPositions: LegendPosition[];
export declare const legendPositionTranslationMap: Map<LegendPosition, string>;
export interface LegendConfig {
    position: LegendPosition;
    direction?: LegendDirection;
    sortDataKeys: boolean;
    showMin: boolean;
    showMax: boolean;
    showAvg: boolean;
    showTotal: boolean;
    showLatest: boolean;
}
export declare const defaultLegendConfig: (wType: widgetType) => LegendConfig;
export declare enum ComparisonResultType {
    PREVIOUS_VALUE = "PREVIOUS_VALUE",
    DELTA_ABSOLUTE = "DELTA_ABSOLUTE",
    DELTA_PERCENT = "DELTA_PERCENT"
}
export declare const comparisonResultTypeTranslationMap: Map<ComparisonResultType, string>;
export interface KeyInfo {
    name: string;
    aggregationType?: AggregationType;
    comparisonEnabled?: boolean;
    timeForComparison?: ComparisonDuration;
    comparisonCustomIntervalValue?: number;
    comparisonResultType?: ComparisonResultType;
    label?: string;
    color?: string;
    funcBody?: string;
    postFuncBody?: string;
    units?: string;
    decimals?: number;
}
export declare const dataKeyAggregationTypeHintTranslationMap: Map<AggregationType, string>;
export interface DataKey extends KeyInfo {
    type: DataKeyType;
    pattern?: string;
    settings?: any;
    usePostProcessing?: boolean;
    hidden?: boolean;
    inLegend?: boolean;
    isAdditional?: boolean;
    origDataKeyIndex?: number;
    _hash?: number;
}
export type CellClickColumnInfo = Pick<DataKey, 'name' | 'label'>;
export declare enum DataKeyConfigMode {
    general = "general",
    advanced = "advanced"
}
export declare enum DatasourceType {
    function = "function",
    device = "device",
    entity = "entity",
    entityCount = "entityCount",
    alarmCount = "alarmCount"
}
export declare const datasourceTypeTranslationMap: Map<DatasourceType, string>;
export interface Datasource {
    type?: DatasourceType | any;
    name?: string;
    aliasName?: string;
    dataKeys?: Array<DataKey>;
    latestDataKeys?: Array<DataKey>;
    entityType?: EntityType;
    entityId?: string;
    entityName?: string;
    deviceId?: string;
    entityAliasId?: string;
    filterId?: string;
    unresolvedStateEntity?: boolean;
    dataReceived?: boolean;
    entity?: BaseData<EntityId>;
    entityLabel?: string;
    entityDescription?: string;
    generated?: boolean;
    isAdditional?: boolean;
    origDatasourceIndex?: number;
    pageLink?: EntityDataPageLink;
    keyFilters?: Array<KeyFilter>;
    entityFilter?: EntityFilter;
    alarmFilterConfig?: AlarmFilterConfig;
    alarmFilter?: AlarmFilter;
    dataKeyStartIndex?: number;
    latestDataKeyStartIndex?: number;
    [key: string]: any;
}
export declare const datasourceValid: (datasource: Datasource) => boolean;
export declare enum TargetDeviceType {
    device = "device",
    entity = "entity"
}
export interface TargetDevice {
    type?: TargetDeviceType;
    deviceId?: string;
    entityAliasId?: string;
}
export declare const targetDeviceValid: (targetDevice?: TargetDevice) => boolean;
export declare const datasourcesHasAggregation: (datasources?: Array<Datasource>) => boolean;
export declare const datasourcesHasOnlyComparisonAggregation: (datasources?: Array<Datasource>) => boolean;
export interface FormattedData {
    $datasource: Datasource;
    entityName: string;
    deviceName: string;
    entityId: string;
    entityType: EntityType;
    entityLabel: string;
    entityDescription: string;
    aliasName: string;
    dsIndex: number;
    dsName: string;
    deviceType: string;
    [key: string]: any;
}
export interface ReplaceInfo {
    variable: string;
    valDec?: number;
    dataKeyName: string;
}
export type DataEntry = [number, any, [number, number]?];
export type DataSet = DataEntry[];
export interface IndexedData {
    [id: number]: DataSet;
}
export interface DataSetHolder {
    data: DataSet;
}
export interface DatasourceData extends DataSetHolder {
    datasource: Datasource;
    dataKey: DataKey;
}
export interface LegendKey {
    dataKey: DataKey;
    dataIndex: number;
}
export interface LegendKeyData {
    min: string;
    max: string;
    avg: string;
    total: string;
    latest: string;
    hidden: boolean;
}
export interface LegendData {
    keys: Array<LegendKey>;
    data: Array<LegendKeyData>;
}
export declare enum WidgetActionType {
    openDashboardState = "openDashboardState",
    updateDashboardState = "updateDashboardState",
    openDashboard = "openDashboard",
    custom = "custom",
    customPretty = "customPretty",
    mobileAction = "mobileAction",
    openURL = "openURL"
}
export declare enum WidgetMobileActionType {
    takePictureFromGallery = "takePictureFromGallery",
    takePhoto = "takePhoto",
    mapDirection = "mapDirection",
    mapLocation = "mapLocation",
    scanQrCode = "scanQrCode",
    makePhoneCall = "makePhoneCall",
    getLocation = "getLocation",
    takeScreenshot = "takeScreenshot"
}
export declare const widgetActionTypes: WidgetActionType[];
export declare const widgetActionTypeTranslationMap: Map<WidgetActionType, string>;
export declare const widgetMobileActionTypeTranslationMap: Map<WidgetMobileActionType, string>;
export interface MobileLaunchResult {
    launched: boolean;
}
export interface MobileImageResult {
    imageUrl: string;
}
export interface MobileQrCodeResult {
    code: string;
    format: string;
}
export interface MobileLocationResult {
    latitude: number;
    longitude: number;
}
export type MobileActionResult = MobileLaunchResult & MobileImageResult & MobileQrCodeResult & MobileLocationResult;
export interface WidgetMobileActionResult<T extends MobileActionResult> {
    result?: T;
    hasResult: boolean;
    error?: string;
    hasError: boolean;
}
export interface ProcessImageDescriptor {
    processImageFunction: string;
}
export interface ProcessLaunchResultDescriptor {
    processLaunchResultFunction?: string;
}
export interface LaunchMapDescriptor extends ProcessLaunchResultDescriptor {
    getLocationFunction: string;
}
export interface ScanQrCodeDescriptor {
    processQrCodeFunction: string;
}
export interface MakePhoneCallDescriptor extends ProcessLaunchResultDescriptor {
    getPhoneNumberFunction: string;
}
export interface GetLocationDescriptor {
    processLocationFunction: string;
}
export type WidgetMobileActionDescriptors = ProcessImageDescriptor & LaunchMapDescriptor & ScanQrCodeDescriptor & MakePhoneCallDescriptor & GetLocationDescriptor;
export interface WidgetMobileActionDescriptor extends WidgetMobileActionDescriptors {
    type: WidgetMobileActionType;
    handleErrorFunction?: string;
    handleEmptyResultFunction?: string;
}
export type WidgetActionDescriptor = any;
export declare const actionDescriptorToAction: (descriptor: WidgetActionDescriptor) => any;
export declare const defaultWidgetAction: (setEntityId?: boolean) => any;
export interface WidgetComparisonSettings {
    comparisonEnabled?: boolean;
    timeForComparison?: ComparisonDuration;
    comparisonCustomIntervalValue?: number;
}
export interface DataKeyComparisonSettings {
    showValuesForComparison: boolean;
    comparisonValuesLabel: string;
    color: string;
}
export interface DataKeySettingsWithComparison {
    comparisonSettings?: DataKeyComparisonSettings;
}
export declare const isDataKeySettingsWithComparison: (settings: any) => settings is DataKeySettingsWithComparison;
export interface WidgetSettings {
    [key: string]: any;
}
export declare enum WidgetConfigMode {
    basic = "basic",
    advanced = "advanced"
}
export interface WidgetConfig {
    configMode?: WidgetConfigMode;
    title?: string;
    titleFont?: any;
    titleColor?: string;
    titleIcon?: string;
    showTitle?: boolean;
    showTitleIcon?: boolean;
    iconColor?: string;
    iconSize?: string;
    titleTooltip?: string;
    dropShadow?: boolean;
    enableFullscreen?: boolean;
    useDashboardTimewindow?: boolean;
    displayTimewindow?: boolean;
    timewindow?: Timewindow;
    any?: any;
    desktopHide?: boolean;
    mobileHide?: boolean;
    mobileHeight?: number;
    mobileOrder?: number;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    widgetStyle?: any;
    widgetCss?: string;
    titleStyle?: any;
    units?: string;
    decimals?: number;
    noDataDisplayMessage?: string;
    pageSize?: number;
    actions?: {
        [actionSourceId: string]: Array<WidgetActionDescriptor>;
    };
    settings?: WidgetSettings;
    alarmSource?: Datasource;
    alarmFilterConfig?: AlarmFilterConfig;
    datasources?: Array<Datasource>;
    targetDevice?: TargetDevice;
    [key: string]: any;
}
export interface BaseWidgetInfo {
    id?: string;
    typeFullFqn: string;
    type: widgetType;
}
export interface Widget extends BaseWidgetInfo, ExportableEntity<WidgetTypeId> {
    typeId?: WidgetTypeId;
    sizeX: number;
    sizeY: number;
    row: number;
    col: number;
    config: WidgetConfig;
}
export interface WidgetInfo extends BaseWidgetInfo {
    title: string;
    image?: string;
    description?: string;
    deprecated?: boolean;
}
export interface GroupInfo {
    formIndex: number;
    GroupTitle: string;
}
export interface JsonSchema {
    type: string;
    title?: string;
    properties: {
        [key: string]: any;
    };
    required?: string[];
}
export interface JsonSettingsSchema {
    schema?: JsonSchema;
    form?: any[];
    groupInfoes?: GroupInfo[];
}
export interface WidgetPosition {
    row: number;
    column: number;
}
export interface WidgetSize {
    sizeX: number;
    sizeY: number;
}
export interface IWidgetSettingsComponent {
    aliasController: IAliasController;
    dataKeyCallbacks: any;
    dashboard: Dashboard;
    widget: Widget;
    widgetConfig: any;
    functionScopeVariables: string[];
    settings: WidgetSettings;
    settingsChanged: Observable<WidgetSettings>;
    validateSettings(): boolean;
    [key: string]: any;
}
