import { BaseData, ExportableEntity } from '../../shared/models/base-data';
import { DeviceId } from './id/device-id';
import { TenantId } from '../../shared/models/id/tenant-id';
import { CustomerId } from '../../shared/models/id/customer-id';
import { DeviceCredentialsId } from '../../shared/models/id/device-credentials-id';
import { EntitySearchQuery } from '../../shared/models/relation.models';
import { DeviceProfileId } from '../../shared/models/id/device-profile-id';
import { RuleChainId } from '../../shared/models/id/rule-chain-id';
import { EntityInfoData, HasTenantId } from '../../shared/models/entity.models';
import { FilterPredicateValue, KeyFilter } from '../../shared/models/query/query.models';
import { TimeUnit } from '../../shared/models/time/time.models';
import { OtaPackageId } from '../../shared/models/id/ota-package-id';
import { DashboardId } from '../../shared/models/id/dashboard-id';
import { DataType } from '../../shared/models/constants';
import { PageLink } from '../../shared/models/page/page-link';
import { EdgeId } from '../../shared/models/id/edge-id';
export declare enum PowerMode {
    PSM = "PSM",
    DRX = "DRX",
    E_DRX = "E_DRX"
}
export declare enum DeviceProfileType {
    DEFAULT = "DEFAULT",
    SNMP = "SNMP"
}
export declare enum DeviceTransportType {
    DEFAULT = "DEFAULT",
    MQTT = "MQTT",
    COAP = "COAP",
    LWM2M = "LWM2M",
    SNMP = "SNMP"
}
export declare enum BasicTransportType {
    HTTP = "HTTP"
}
export type TransportType = BasicTransportType | DeviceTransportType;
export type NetworkTransportType = BasicTransportType | Exclude<DeviceTransportType, DeviceTransportType.DEFAULT>;
export declare enum TransportPayloadType {
    JSON = "JSON",
    PROTOBUF = "PROTOBUF"
}
export declare enum CoapTransportDeviceType {
    DEFAULT = "DEFAULT",
    EFENTO = "EFENTO"
}
export declare enum DeviceProvisionType {
    DISABLED = "DISABLED",
    ALLOW_CREATE_NEW_DEVICES = "ALLOW_CREATE_NEW_DEVICES",
    CHECK_PRE_PROVISIONED_DEVICES = "CHECK_PRE_PROVISIONED_DEVICES",
    X509_CERTIFICATE_CHAIN = "X509_CERTIFICATE_CHAIN"
}
export interface DeviceConfigurationFormInfo {
    hasProfileConfiguration: boolean;
    hasDeviceConfiguration: boolean;
}
export declare const deviceProfileTypeTranslationMap: Map<DeviceProfileType, string>;
export declare const deviceProfileTypeConfigurationInfoMap: Map<DeviceProfileType, DeviceConfigurationFormInfo>;
export declare const deviceTransportTypeTranslationMap: Map<TransportType, string>;
export declare const deviceProvisionTypeTranslationMap: Map<DeviceProvisionType, string>;
export declare const deviceTransportTypeHintMap: Map<TransportType, string>;
export declare const transportPayloadTypeTranslationMap: Map<TransportPayloadType, string>;
export declare const defaultTelemetrySchema: string;
export declare const defaultAttributesSchema: string;
export declare const defaultRpcRequestSchema: string;
export declare const defaultRpcResponseSchema: string;
export declare const coapDeviceTypeTranslationMap: Map<CoapTransportDeviceType, string>;
export declare const deviceTransportTypeConfigurationInfoMap: Map<DeviceTransportType, DeviceConfigurationFormInfo>;
export interface DefaultDeviceProfileConfiguration {
    [key: string]: any;
}
export type DeviceProfileConfigurations = DefaultDeviceProfileConfiguration;
export interface DeviceProfileConfiguration extends DeviceProfileConfigurations {
    type: DeviceProfileType;
}
export interface DefaultDeviceProfileTransportConfiguration {
    [key: string]: any;
}
export interface MqttDeviceProfileTransportConfiguration {
    deviceTelemetryTopic?: string;
    deviceAttributesTopic?: string;
    deviceAttributesSubscribeTopic?: string;
    sparkplug?: boolean;
    sendAckOnValidationException?: boolean;
    transportPayloadTypeConfiguration?: {
        transportPayloadType?: TransportPayloadType;
        enableCompatibilityWithJsonPayloadFormat?: boolean;
        useJsonPayloadFormatForDefaultDownlinkTopics?: boolean;
    };
    [key: string]: any;
}
export interface CoapClientSetting {
    powerMode?: PowerMode | null;
    edrxCycle?: number;
    pagingTransmissionWindow?: number;
    psmActivityTimer?: number;
}
export interface CoapDeviceProfileTransportConfiguration {
    coapDeviceTypeConfiguration?: {
        coapDeviceType?: CoapTransportDeviceType;
        transportPayloadTypeConfiguration?: {
            transportPayloadType?: TransportPayloadType;
            [key: string]: any;
        };
    };
    clientSettings?: CoapClientSetting;
}
export interface Lwm2mDeviceProfileTransportConfiguration {
    [key: string]: any;
}
export interface SnmpDeviceProfileTransportConfiguration {
    timeoutMs?: number;
    retries?: number;
    communicationConfigs?: SnmpCommunicationConfig[];
}
export declare enum SnmpSpecType {
    TELEMETRY_QUERYING = "TELEMETRY_QUERYING",
    CLIENT_ATTRIBUTES_QUERYING = "CLIENT_ATTRIBUTES_QUERYING",
    SHARED_ATTRIBUTES_SETTING = "SHARED_ATTRIBUTES_SETTING",
    TO_DEVICE_RPC_REQUEST = "TO_DEVICE_RPC_REQUEST",
    TO_SERVER_RPC_REQUEST = "TO_SERVER_RPC_REQUEST"
}
export declare const SnmpSpecTypeTranslationMap: Map<SnmpSpecType, string>;
export interface SnmpCommunicationConfig {
    spec: SnmpSpecType;
    mappings: SnmpMapping[];
    queryingFrequencyMs?: number;
}
export interface SnmpMapping {
    oid: string;
    key: string;
    dataType: DataType;
}
export type DeviceProfileTransportConfigurations = DefaultDeviceProfileTransportConfiguration & MqttDeviceProfileTransportConfiguration & CoapDeviceProfileTransportConfiguration & Lwm2mDeviceProfileTransportConfiguration & SnmpDeviceProfileTransportConfiguration;
export interface DeviceProfileTransportConfiguration extends DeviceProfileTransportConfigurations {
    type: DeviceTransportType;
}
export interface DeviceProvisionConfiguration {
    type: DeviceProvisionType;
    provisionDeviceSecret?: string;
    provisionDeviceKey?: string;
    certificateValue?: string;
    certificateRegExPattern?: string;
    allowCreateNewDevicesByX509Certificate?: boolean;
}
export declare const createDeviceProfileConfiguration: (type: DeviceProfileType) => DeviceProfileConfiguration;
export declare const createDeviceConfiguration: (type: DeviceProfileType) => DeviceConfiguration;
export declare const createDeviceProfileTransportConfiguration: (type: DeviceTransportType) => DeviceProfileTransportConfiguration;
export declare const createDeviceTransportConfiguration: (type: DeviceTransportType) => DeviceTransportConfiguration;
export declare enum AlarmConditionType {
    SIMPLE = "SIMPLE",
    DURATION = "DURATION",
    REPEATING = "REPEATING"
}
export declare const AlarmConditionTypeTranslationMap: Map<AlarmConditionType, string>;
export interface AlarmConditionSpec {
    type?: AlarmConditionType;
    unit?: TimeUnit;
    predicate: FilterPredicateValue<number>;
}
export interface AlarmCondition {
    condition: Array<KeyFilter>;
    spec?: AlarmConditionSpec;
}
export declare enum AlarmScheduleType {
    ANY_TIME = "ANY_TIME",
    SPECIFIC_TIME = "SPECIFIC_TIME",
    CUSTOM = "CUSTOM"
}
export declare const AlarmScheduleTypeTranslationMap: Map<AlarmScheduleType, string>;
export interface AlarmSchedule {
    dynamicValue?: {
        sourceAttribute: string;
        sourceType: string;
    };
    type: AlarmScheduleType;
    timezone?: string;
    daysOfWeek?: number[];
    startsOn?: number;
    endsOn?: number;
    items?: CustomTimeSchedulerItem[];
}
export interface CustomTimeSchedulerItem {
    enabled: boolean;
    dayOfWeek: number;
    startsOn: number;
    endsOn: number;
}
interface AlarmRule {
    condition: AlarmCondition;
    alarmDetails?: string;
    dashboardId?: DashboardId;
    schedule?: AlarmSchedule;
}
export { AlarmRule as DeviceProfileAlarmRule };
export declare const alarmRuleValidator: (control: any) => any | null;
export interface DeviceProfileAlarm {
    id: string;
    alarmType: string;
    createRules: {
        [severity: string]: AlarmRule;
    };
    clearRule?: AlarmRule;
    propagate?: boolean;
    propagateToOwner?: boolean;
    propagateToTenant?: boolean;
    propagateRelationTypes?: Array<string>;
}
export declare const deviceProfileAlarmValidator: (control: any) => any | null;
export interface DeviceProfileData {
    configuration: DeviceProfileConfiguration;
    transportConfiguration: DeviceProfileTransportConfiguration;
    alarms?: Array<DeviceProfileAlarm>;
    provisionConfiguration?: DeviceProvisionConfiguration;
}
export interface DeviceProfile extends BaseData<DeviceProfileId>, HasTenantId, ExportableEntity<DeviceProfileId> {
    tenantId?: TenantId;
    name: string;
    description?: string;
    default?: boolean;
    type: DeviceProfileType;
    image?: string;
    transportType: DeviceTransportType;
    provisionType: DeviceProvisionType;
    provisionDeviceKey?: string;
    defaultRuleChainId?: RuleChainId;
    defaultDashboardId?: DashboardId;
    defaultQueueName?: string;
    firmwareId?: OtaPackageId;
    softwareId?: OtaPackageId;
    profileData: DeviceProfileData;
    defaultEdgeRuleChainId?: RuleChainId;
}
export interface DeviceProfileInfo extends EntityInfoData, HasTenantId {
    tenantId?: TenantId;
    type: DeviceProfileType;
    transportType: DeviceTransportType;
    image?: string;
    defaultDashboardId?: DashboardId;
}
export interface DefaultDeviceConfiguration {
    [key: string]: any;
}
export type DeviceConfigurations = DefaultDeviceConfiguration;
export interface DeviceConfiguration extends DeviceConfigurations {
    type: DeviceProfileType;
}
export interface DefaultDeviceTransportConfiguration {
    [key: string]: any;
}
export interface MqttDeviceTransportConfiguration {
    [key: string]: any;
}
export interface CoapDeviceTransportConfiguration {
    powerMode?: PowerMode | null;
    edrxCycle?: number;
    pagingTransmissionWindow?: number;
    psmActivityTimer?: number;
}
export interface Lwm2mDeviceTransportConfiguration {
    powerMode?: PowerMode | null;
    edrxCycle?: number;
    pagingTransmissionWindow?: number;
    psmActivityTimer?: number;
}
export declare enum SnmpDeviceProtocolVersion {
    V1 = "V1",
    V2C = "V2C",
    V3 = "V3"
}
export declare enum SnmpAuthenticationProtocol {
    SHA_1 = "SHA_1",
    SHA_224 = "SHA_224",
    SHA_256 = "SHA_256",
    SHA_384 = "SHA_384",
    SHA_512 = "SHA_512",
    MD5 = "MD%"
}
export declare const SnmpAuthenticationProtocolTranslationMap: Map<SnmpAuthenticationProtocol, string>;
export declare enum SnmpPrivacyProtocol {
    DES = "DES",
    AES_128 = "AES_128",
    AES_192 = "AES_192",
    AES_256 = "AES_256"
}
export declare const SnmpPrivacyProtocolTranslationMap: Map<SnmpPrivacyProtocol, string>;
export interface SnmpDeviceTransportConfiguration {
    host?: string;
    port?: number;
    protocolVersion?: SnmpDeviceProtocolVersion;
    community?: string;
    username?: string;
    securityName?: string;
    contextName?: string;
    authenticationProtocol?: SnmpAuthenticationProtocol;
    authenticationPassphrase?: string;
    privacyProtocol?: SnmpPrivacyProtocol;
    privacyPassphrase?: string;
    engineId?: string;
}
export type DeviceTransportConfigurations = DefaultDeviceTransportConfiguration & MqttDeviceTransportConfiguration & CoapDeviceTransportConfiguration & Lwm2mDeviceTransportConfiguration & SnmpDeviceTransportConfiguration;
export interface DeviceTransportConfiguration extends DeviceTransportConfigurations {
    type: DeviceTransportType;
}
export interface DeviceData {
    configuration: DeviceConfiguration;
    transportConfiguration: DeviceTransportConfiguration;
}
export interface Device extends BaseData<DeviceId>, HasTenantId, ExportableEntity<DeviceId> {
    tenantId?: TenantId;
    customerId?: CustomerId;
    name: string;
    type?: string;
    label: string;
    firmwareId?: OtaPackageId;
    softwareId?: OtaPackageId;
    deviceProfileId?: DeviceProfileId;
    deviceData?: DeviceData;
    additionalInfo?: any;
}
export interface DeviceInfo extends Device {
    customerTitle: string;
    customerIsPublic: boolean;
    deviceProfileName: string;
    active: boolean;
}
export interface DeviceInfoFilter {
    customerId?: CustomerId;
    edgeId?: EdgeId;
    type?: string;
    deviceProfileId?: DeviceProfileId;
    active?: boolean;
}
export declare class DeviceInfoQuery {
    pageLink: PageLink;
    deviceInfoFilter: DeviceInfoFilter;
    constructor(pageLink: PageLink, deviceInfoFilter: DeviceInfoFilter);
    toQuery(): string;
}
export declare enum DeviceCredentialsType {
    ACCESS_TOKEN = "ACCESS_TOKEN",
    X509_CERTIFICATE = "X509_CERTIFICATE",
    MQTT_BASIC = "MQTT_BASIC",
    LWM2M_CREDENTIALS = "LWM2M_CREDENTIALS"
}
export declare const credentialTypeNames: Map<DeviceCredentialsType, string>;
export declare const credentialTypesByTransportType: Map<DeviceTransportType, DeviceCredentialsType[]>;
export interface DeviceCredentials extends BaseData<DeviceCredentialsId> {
    deviceId: DeviceId;
    credentialsType: DeviceCredentialsType;
    credentialsId: string;
    credentialsValue: string;
}
export interface DeviceCredentialMQTTBasic {
    clientId: string;
    userName: string;
    password: string;
}
export declare const getDeviceCredentialMQTTDefault: () => DeviceCredentialMQTTBasic;
export interface DeviceSearchQuery extends EntitySearchQuery {
    deviceTypes: Array<string>;
}
export interface ClaimRequest {
    secretKey: string;
}
export declare enum ClaimResponse {
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
    CLAIMED = "CLAIMED"
}
export interface ClaimResult {
    device: Device;
    response: ClaimResponse;
}
export interface PublishTelemetryCommand {
    http?: {
        http?: string;
        https?: string;
    };
    mqtt: {
        mqtt?: string;
        mqtts?: string | Array<string>;
        docker?: {
            mqtt?: string;
            mqtts?: string | Array<string>;
        };
        sparkplug?: string;
    };
    coap: {
        coap?: string;
        coaps?: string | Array<string>;
        docker?: {
            coap?: string;
            coaps?: string | Array<string>;
        };
    };
    lwm2m?: string;
    snmp?: string;
}
export declare const dayOfWeekTranslations: string[];
export declare const timeOfDayToUTCTimestamp: (date: Date | number) => number;
export declare const utcTimestampToTimeOfDay: (time?: number) => Date;
export declare const getAlarmScheduleRangeText: (startsOn: Date | number, endsOn: Date | number) => string;
