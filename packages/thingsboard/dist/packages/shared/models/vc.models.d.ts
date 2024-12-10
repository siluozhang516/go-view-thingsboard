import { EntityId } from '../../shared/models/id/entity-id';
import { EntityType } from '../../shared/models/entity-type.models';
import { ExportableEntity } from '../../shared/models/base-data';
import { EntityRelation } from '../../shared/models/relation.models';
import { Device, DeviceCredentials } from '../../shared/models/device.models';
import { RuleChain, RuleChainMetaData } from '../../shared/models/rule-chain.models';
export declare const exportableEntityTypes: Array<EntityType>;
export declare const entityTypesWithoutRelatedData: Set<EntityType>;
export interface VersionCreateConfig {
    saveRelations: boolean;
    saveAttributes: boolean;
    saveCredentials: boolean;
}
export declare enum VersionCreateRequestType {
    SINGLE_ENTITY = "SINGLE_ENTITY",
    COMPLEX = "COMPLEX"
}
export interface VersionCreateRequest {
    versionName: string;
    branch: string;
    type: VersionCreateRequestType;
}
export interface SingleEntityVersionCreateRequest extends VersionCreateRequest {
    entityId: EntityId;
    config: VersionCreateConfig;
    type: VersionCreateRequestType.SINGLE_ENTITY;
}
export declare enum SyncStrategy {
    MERGE = "MERGE",
    OVERWRITE = "OVERWRITE"
}
export declare const syncStrategyTranslationMap: Map<SyncStrategy, string>;
export declare const syncStrategyHintMap: Map<SyncStrategy, string>;
export interface EntityTypeVersionCreateConfig extends VersionCreateConfig {
    syncStrategy: SyncStrategy;
    entityIds: string[];
    allEntities: boolean;
}
export interface ComplexVersionCreateRequest extends VersionCreateRequest {
    syncStrategy: SyncStrategy;
    entityTypes: {
        [entityType: string]: EntityTypeVersionCreateConfig;
    };
    type: VersionCreateRequestType.COMPLEX;
}
export declare function createDefaultEntityTypesVersionCreate(): {
    [entityType: string]: EntityTypeVersionCreateConfig;
};
export interface VersionLoadConfig {
    loadRelations: boolean;
    loadAttributes: boolean;
    loadCredentials: boolean;
}
export declare enum VersionLoadRequestType {
    SINGLE_ENTITY = "SINGLE_ENTITY",
    ENTITY_TYPE = "ENTITY_TYPE"
}
export interface VersionLoadRequest {
    versionId: string;
    type: VersionLoadRequestType;
}
export interface SingleEntityVersionLoadRequest extends VersionLoadRequest {
    externalEntityId: EntityId;
    config: VersionLoadConfig;
    type: VersionLoadRequestType.SINGLE_ENTITY;
}
export interface EntityTypeVersionLoadConfig extends VersionLoadConfig {
    removeOtherEntities: boolean;
    findExistingEntityByName: boolean;
}
export interface EntityTypeVersionLoadRequest extends VersionLoadRequest {
    entityTypes: {
        [entityType: string]: EntityTypeVersionLoadConfig;
    };
    type: VersionLoadRequestType.ENTITY_TYPE;
    rollbackOnError: boolean;
}
export declare function createDefaultEntityTypesVersionLoad(): {
    [entityType: string]: EntityTypeVersionLoadConfig;
};
export interface BranchInfo {
    name: string;
    default: boolean;
}
export interface EntityVersion {
    timestamp: number;
    id: string;
    name: string;
    author: string;
}
export interface VersionCreationResult {
    version: EntityVersion;
    added: number;
    modified: number;
    removed: number;
    error: string;
    done: boolean;
}
export interface EntityTypeLoadResult {
    entityType: EntityType;
    created: number;
    updated: number;
    deleted: number;
}
export declare enum EntityLoadErrorType {
    DEVICE_CREDENTIALS_CONFLICT = "DEVICE_CREDENTIALS_CONFLICT",
    MISSING_REFERENCED_ENTITY = "MISSING_REFERENCED_ENTITY",
    RUNTIME = "RUNTIME"
}
export declare const entityLoadErrorTranslationMap: Map<EntityLoadErrorType, string>;
export interface EntityLoadError {
    type: EntityLoadErrorType;
    source: EntityId;
    target: EntityId;
    message?: string;
}
export interface VersionLoadResult {
    result: Array<EntityTypeLoadResult>;
    error: EntityLoadError;
    done: boolean;
}
export interface AttributeExportData {
    key: string;
    lastUpdateTs: number;
    booleanValue: boolean;
    strValue: string;
    longValue: number;
    doubleValue: number;
    jsonValue: string;
}
export interface EntityExportData<E extends ExportableEntity<EntityId>> {
    entity: E;
    entityType: EntityType;
    relations: Array<EntityRelation>;
    attributes: {
        [key: string]: Array<AttributeExportData>;
    };
}
export interface DeviceExportData extends EntityExportData<Device> {
    credentials: DeviceCredentials;
}
export interface RuleChainExportData extends EntityExportData<RuleChain> {
    metaData: RuleChainMetaData;
}
export interface EntityDataDiff {
    currentVersion: EntityExportData<any>;
    otherVersion: EntityExportData<any>;
}
export declare function entityExportDataToJsonString(data: EntityExportData<any>): string;
export interface EntityDataInfo {
    hasRelations: boolean;
    hasAttributes: boolean;
    hasCredentials: boolean;
}
