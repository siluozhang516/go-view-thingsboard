import { EntityId } from './id/entity-id';
import { HasUUID } from './id/has-uuid';
export declare type HasId = EntityId | HasUUID;
export interface BaseData<T extends HasId> {
    createdTime?: number;
    id?: T;
    name?: string;
    label?: string;
}
export declare function sortEntitiesByIds<I extends HasId, T extends BaseData<I>>(entities: T[], entityIds: string[]): T[];
export interface ExportableEntity<T extends EntityId> {
    externalId?: T;
}
export declare function hasIdEquals(id1: HasId, id2: HasId): boolean;
