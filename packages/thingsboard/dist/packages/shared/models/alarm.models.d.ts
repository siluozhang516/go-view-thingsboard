import { BaseData } from './base-data';
import { TenantId } from '../../shared/models/id/tenant-id';
import { AlarmId } from '../../shared/models/id/alarm-id';
import { EntityId } from '../../shared/models/id/entity-id';
import { TimePageLink } from '../../shared/models/page/page-link';
import { CustomerId } from '../../shared/models/id/customer-id';
import { AlarmCommentId } from '../../shared/models/id/alarm-comment-id';
import { UserId } from '../../shared/models/id/user-id';
import { AlarmFilter } from '../../shared/models/query/query.models';
import { HasTenantId } from '../../shared/models/entity.models';
export declare enum AlarmsMode {
    ALL = 0,
    ENTITY = 1
}
export declare enum AlarmSeverity {
    CRITICAL = "CRITICAL",
    MAJOR = "MAJOR",
    MINOR = "MINOR",
    WARNING = "WARNING",
    INDETERMINATE = "INDETERMINATE"
}
export declare enum AlarmStatus {
    ACTIVE_UNACK = "ACTIVE_UNACK",
    ACTIVE_ACK = "ACTIVE_ACK",
    CLEARED_UNACK = "CLEARED_UNACK",
    CLEARED_ACK = "CLEARED_ACK"
}
export declare enum AlarmSearchStatus {
    ANY = "ANY",
    ACTIVE = "ACTIVE",
    CLEARED = "CLEARED",
    ACK = "ACK",
    UNACK = "UNACK"
}
export declare const alarmSeverityTranslations: Map<AlarmSeverity, string>;
export declare const alarmStatusTranslations: Map<AlarmStatus, string>;
export declare const alarmSearchStatusTranslations: Map<AlarmSearchStatus, string>;
export declare const alarmSeverityColors: Map<AlarmSeverity, string>;
export interface Alarm extends BaseData<AlarmId>, HasTenantId {
    tenantId: TenantId;
    customerId: CustomerId;
    assigneeId: UserId;
    type: string;
    originator: EntityId;
    severity: AlarmSeverity;
    status: AlarmStatus;
    acknowledged: boolean;
    cleared: boolean;
    startTs: number;
    endTs: number;
    ackTs: number;
    clearTs: number;
    assignTs: number;
    propagate: boolean;
    details?: any;
}
export declare enum AlarmCommentType {
    SYSTEM = "SYSTEM",
    OTHER = "OTHER"
}
export interface AlarmComment extends BaseData<AlarmCommentId> {
    alarmId: AlarmId;
    userId?: UserId;
    type: AlarmCommentType;
    comment: {
        text: string;
        edited?: boolean;
        editedOn?: number;
    };
}
export interface AlarmCommentInfo extends AlarmComment {
    firstName?: string;
    lastName?: string;
    email?: string;
}
export interface AlarmInfo extends Alarm {
    originatorName: string;
    originatorLabel: string;
    assignee: AlarmAssignee;
}
export interface AlarmAssignee {
    firstName: string;
    lastName: string;
    email: string;
}
export declare enum AlarmAssigneeOption {
    noAssignee = "noAssignee",
    currentUser = "currentUser"
}
export interface AlarmDataInfo extends AlarmInfo {
    actionCellButtons?: any[];
    hasActions?: boolean;
    [key: string]: any;
}
export declare const simulatedAlarm: AlarmInfo;
export interface AlarmField {
    keyName: string;
    value: string;
    name: string;
    time?: boolean;
}
export declare const alarmFields: {
    [fieldName: string]: AlarmField;
};
export declare class AlarmQuery {
    affectedEntityId: EntityId;
    pageLink: TimePageLink;
    searchStatus: AlarmSearchStatus;
    status: AlarmStatus;
    fetchOriginator: boolean;
    assigneeId?: UserId;
    constructor(entityId: EntityId, pageLink: TimePageLink, searchStatus: AlarmSearchStatus, status: AlarmStatus, fetchOriginator: boolean, assigneeId?: UserId);
    toQuery(): string;
}
export declare class AlarmQueryV2 {
    affectedEntityId: EntityId;
    pageLink: TimePageLink;
    typeList: string[];
    statusList: AlarmSearchStatus[];
    severityList: AlarmSeverity[];
    assigneeId?: UserId;
    constructor(entityId: EntityId, pageLink: TimePageLink, alarmFilter: AlarmFilter);
    toQuery(): string;
}
