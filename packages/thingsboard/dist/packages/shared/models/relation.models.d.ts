import { EntityId } from '../../shared/models/id/entity-id';
import { EntityType } from '../../shared/models/entity-type.models';
export declare const CONTAINS_TYPE = "Contains";
export declare const MANAGES_TYPE = "Manages";
export declare const RelationTypes: string[];
export declare enum RelationTypeGroup {
    COMMON = "COMMON",
    ALARM = "ALARM",
    DASHBOARD = "DASHBOARD",
    RULE_CHAIN = "RULE_CHAIN",
    RULE_NODE = "RULE_NODE"
}
export declare enum EntitySearchDirection {
    FROM = "FROM",
    TO = "TO"
}
export declare const entitySearchDirectionTranslations: Map<EntitySearchDirection, string>;
export declare const directionTypeTranslations: Map<EntitySearchDirection, string>;
export interface RelationEntityTypeFilter {
    relationType: string;
    entityTypes: Array<EntityType>;
    negate?: boolean;
}
export interface RelationsSearchParameters {
    rootId: string;
    rootType: EntityType;
    direction: EntitySearchDirection;
    relationTypeGroup?: RelationTypeGroup;
    maxLevel?: number;
    fetchLastLevelOnly?: boolean;
}
export interface EntityRelationsQuery {
    parameters: RelationsSearchParameters;
    filters: Array<RelationEntityTypeFilter>;
}
export interface EntitySearchQuery {
    parameters: RelationsSearchParameters;
    relationType: string;
}
export interface EntityRelation {
    from: EntityId;
    to: EntityId;
    type: string;
    typeGroup: RelationTypeGroup;
    additionalInfo?: any;
}
export interface EntityRelationInfo extends EntityRelation {
    fromName: string;
    toEntityTypeName?: string;
    toName: string;
    fromEntityTypeName?: string;
    entityURL?: string;
}
