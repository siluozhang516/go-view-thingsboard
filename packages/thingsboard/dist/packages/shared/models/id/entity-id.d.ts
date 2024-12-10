import { AliasEntityType, EntityType } from '../../../shared/models/entity-type.models';
import { HasUUID } from '../../../shared/models/id/has-uuid';
export interface EntityId extends HasUUID {
    entityType: EntityType | AliasEntityType;
}
export declare function entityIdEquals(entityId1: EntityId, entityId2: EntityId): boolean;
