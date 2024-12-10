import { BaseData } from '../../shared/models/base-data';
import { TenantId } from '../../shared/models/id/tenant-id';
import { CustomerId } from '../../shared/models/id/customer-id';
import { EdgeId } from '../../shared/models/id/edge-id';
import { EntitySearchQuery } from '../../shared/models/relation.models';
import { RuleChainId } from '../../shared/models/id/rule-chain-id';
import { BaseEventBody } from '../../shared/models/event.models';
import { EventId } from '../../shared/models/id/event-id';
import { HasTenantId } from '../../shared/models/entity.models';
export interface Edge extends BaseData<EdgeId>, HasTenantId {
    tenantId?: TenantId;
    customerId?: CustomerId;
    name: string;
    type: string;
    secret: string;
    routingKey: string;
    label?: string;
    additionalInfo?: any;
    rootRuleChainId?: RuleChainId;
}
export interface EdgeInfo extends Edge {
    customerTitle: string;
    customerIsPublic: boolean;
}
export interface EdgeSearchQuery extends EntitySearchQuery {
    edgeTypes: Array<string>;
}
export declare enum EdgeEventType {
    DASHBOARD = "DASHBOARD",
    ASSET = "ASSET",
    DEVICE = "DEVICE",
    DEVICE_PROFILE = "DEVICE_PROFILE",
    ASSET_PROFILE = "ASSET_PROFILE",
    ENTITY_VIEW = "ENTITY_VIEW",
    ALARM = "ALARM",
    RULE_CHAIN = "RULE_CHAIN",
    RULE_CHAIN_METADATA = "RULE_CHAIN_METADATA",
    EDGE = "EDGE",
    USER = "USER",
    CUSTOMER = "CUSTOMER",
    RELATION = "RELATION",
    TENANT = "TENANT",
    TENANT_PROFILE = "TENANT_PROFILE",
    WIDGETS_BUNDLE = "WIDGETS_BUNDLE",
    WIDGET_TYPE = "WIDGET_TYPE",
    ADMIN_SETTINGS = "ADMIN_SETTINGS",
    OTA_PACKAGE = "OTA_PACKAGE",
    QUEUE = "QUEUE"
}
export declare enum EdgeEventActionType {
    ADDED = "ADDED",
    DELETED = "DELETED",
    UPDATED = "UPDATED",
    POST_ATTRIBUTES = "POST_ATTRIBUTES",
    ATTRIBUTES_UPDATED = "ATTRIBUTES_UPDATED",
    ATTRIBUTES_DELETED = "ATTRIBUTES_DELETED",
    TIMESERIES_UPDATED = "TIMESERIES_UPDATED",
    CREDENTIALS_UPDATED = "CREDENTIALS_UPDATED",
    ASSIGNED_TO_CUSTOMER = "ASSIGNED_TO_CUSTOMER",
    UNASSIGNED_FROM_CUSTOMER = "UNASSIGNED_FROM_CUSTOMER",
    RELATION_ADD_OR_UPDATE = "RELATION_ADD_OR_UPDATE",
    RELATION_DELETED = "RELATION_DELETED",
    RPC_CALL = "RPC_CALL",
    ALARM_ACK = "ALARM_ACK",
    ALARM_CLEAR = "ALARM_CLEAR",
    ALARM_ASSIGNED = "ALARM_ASSIGNED",
    ALARM_UNASSIGNED = "ALARM_UNASSIGNED",
    ASSIGNED_TO_EDGE = "ASSIGNED_TO_EDGE",
    UNASSIGNED_FROM_EDGE = "UNASSIGNED_FROM_EDGE",
    CREDENTIALS_REQUEST = "CREDENTIALS_REQUEST",
    ENTITY_MERGE_REQUEST = "ENTITY_MERGE_REQUEST"
}
export declare enum EdgeEventStatus {
    DEPLOYED = "DEPLOYED",
    PENDING = "PENDING"
}
export declare const edgeEventTypeTranslations: Map<EdgeEventType, string>;
export declare const edgeEventActionTypeTranslations: Map<EdgeEventActionType, string>;
export declare const bodyContentEdgeEventActionTypes: EdgeEventActionType[];
export declare const edgeEventStatusColor: Map<EdgeEventStatus, string>;
export interface EdgeEventBody extends BaseEventBody {
    type: string;
    action: string;
    entityId: string;
}
export interface EdgeEvent extends BaseData<EventId> {
    tenantId: TenantId;
    entityId: string;
    edgeId: EdgeId;
    action: EdgeEventActionType;
    type: EdgeEventType;
    uid: string;
    body: string;
}
export interface EdgeInstructions {
    instructions: string;
}
export declare enum EdgeInstructionsMethod {
    ubuntu = 0,
    centos = 1,
    docker = 2
}
export declare const edgeVersionAttributeKey = "edgeVersion";
export declare enum EdgeConnectionEvent {
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED"
}
export declare const EdgeConnectionEventTranslationMap: Map<EdgeConnectionEvent, string>;
