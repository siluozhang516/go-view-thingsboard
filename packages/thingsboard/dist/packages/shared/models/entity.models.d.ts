import { EntityType } from '../../shared/models/entity-type.models';
import { AttributeData } from './telemetry/telemetry.models';
import { EntityId } from '../../shared/models/id/entity-id';
import { DeviceCredentialMQTTBasic } from '../../shared/models/device.models';
import { Lwm2mSecurityConfigModels } from '../../shared/models/lwm2m-security-config.models';
import { TenantId } from '../../shared/models/id/tenant-id';
export interface EntityInfo {
    name?: string;
    label?: string;
    entityType?: EntityType;
    id?: string;
    entityDescription?: string;
}
export interface EntityInfoData {
    id: EntityId;
    name: string;
}
export interface ImportEntityData {
    lineNumber: number;
    name: string;
    type: string;
    label: string;
    gateway: boolean;
    description: string;
    credential: {
        accessToken?: string;
        x509?: string;
        mqtt?: DeviceCredentialMQTTBasic;
        lwm2m?: Lwm2mSecurityConfigModels;
    };
    attributes: {
        server: AttributeData[];
        shared: AttributeData[];
    };
    timeseries: AttributeData[];
}
export interface EdgeImportEntityData extends ImportEntityData {
    secret: string;
    routingKey: string;
}
export interface ImportEntitiesResultInfo {
    create?: {
        entity: number;
    };
    update?: {
        entity: number;
    };
    error?: {
        entity: number;
        errors?: string;
    };
}
export interface EntityField {
    keyName: string;
    value: string;
    name: string;
    time?: boolean;
}
export interface EntitiesKeysByQuery {
    attribute: Array<string>;
    timeseries: Array<string>;
    entityTypes: EntityType[];
}
export declare const entityFields: {
    [fieldName: string]: EntityField;
};
export interface HasTenantId {
    tenantId?: TenantId;
}
