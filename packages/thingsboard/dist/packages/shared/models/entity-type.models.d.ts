import { TenantId } from './id/tenant-id';
import { BaseData, HasId } from '../../shared/models/base-data';
export declare enum EntityType {
    TENANT = "TENANT",
    TENANT_PROFILE = "TENANT_PROFILE",
    CUSTOMER = "CUSTOMER",
    USER = "USER",
    DASHBOARD = "DASHBOARD",
    ASSET = "ASSET",
    DEVICE = "DEVICE",
    DEVICE_PROFILE = "DEVICE_PROFILE",
    ASSET_PROFILE = "ASSET_PROFILE",
    ALARM = "ALARM",
    RULE_CHAIN = "RULE_CHAIN",
    RULE_NODE = "RULE_NODE",
    EDGE = "EDGE",
    ENTITY_VIEW = "ENTITY_VIEW",
    WIDGETS_BUNDLE = "WIDGETS_BUNDLE",
    WIDGET_TYPE = "WIDGET_TYPE",
    API_USAGE_STATE = "API_USAGE_STATE",
    TB_RESOURCE = "TB_RESOURCE",
    OTA_PACKAGE = "OTA_PACKAGE",
    RPC = "RPC",
    QUEUE = "QUEUE",
    QUEUE_STATS = "QUEUE_STATS",
    NOTIFICATION = "NOTIFICATION",
    NOTIFICATION_REQUEST = "NOTIFICATION_REQUEST",
    NOTIFICATION_RULE = "NOTIFICATION_RULE",
    NOTIFICATION_TARGET = "NOTIFICATION_TARGET",
    NOTIFICATION_TEMPLATE = "NOTIFICATION_TEMPLATE"
}
export declare enum AliasEntityType {
    CURRENT_CUSTOMER = "CURRENT_CUSTOMER",
    CURRENT_TENANT = "CURRENT_TENANT",
    CURRENT_USER = "CURRENT_USER",
    CURRENT_USER_OWNER = "CURRENT_USER_OWNER"
}
export interface EntityTypeTranslation {
    type?: string;
    typePlural?: string;
    list?: string;
    nameStartsWith?: string;
    details?: string;
    add?: string;
    noEntities?: string;
    selectedEntities?: string;
    search?: string;
}
export interface EntityTypeResource<T> {
    helpLinkId: string;
    helpLinkIdForEntity?(entity: T): string;
}
export declare const entityTypeTranslations: Map<EntityType | AliasEntityType, EntityTypeTranslation>;
export declare const entityTypeResources: Map<EntityType, EntityTypeResource<BaseData<HasId>>>;
export declare const baseDetailsPageByEntityType: Map<EntityType, string>;
export interface EntitySubtype {
    tenantId: TenantId;
    entityType: EntityType;
    type: string;
}
