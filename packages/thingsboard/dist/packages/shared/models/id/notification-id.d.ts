import { EntityId } from '../../../shared/models/id/entity-id';
import { EntityType } from '../../../shared/models/entity-type.models';
export declare class NotificationId implements EntityId {
    entityType: EntityType;
    id: string;
    constructor(id: string);
}
