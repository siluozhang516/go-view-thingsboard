import { RequestConfig } from './http-utils';
import { Observable } from 'rxjs';
import { HttpClient } from '../../angular-http';
import { EntityRelation, EntityRelationInfo, EntityRelationsQuery } from '../../shared/models/relation.models';
import { EntityId } from '../../shared/models/id/entity-id';
export declare class EntityRelationService {
    private http;
    constructor(http: HttpClient);
    saveRelation(relation: EntityRelation, config?: RequestConfig): Observable<EntityRelation>;
    deleteRelation(fromId: EntityId, relationType: string, toId: EntityId, config?: RequestConfig): Observable<Object>;
    deleteRelations(entityId: EntityId, config?: RequestConfig): Observable<Object>;
    getRelation(fromId: EntityId, relationType: string, toId: EntityId, config?: RequestConfig): Observable<EntityRelation>;
    findByFrom(fromId: EntityId, config?: RequestConfig): Observable<Array<EntityRelation>>;
    findInfoByFrom(fromId: EntityId, config?: RequestConfig): Observable<Array<EntityRelationInfo>>;
    findByFromAndType(fromId: EntityId, relationType: string, config?: RequestConfig): Observable<Array<EntityRelation>>;
    findByTo(toId: EntityId, config?: RequestConfig): Observable<Array<EntityRelation>>;
    findInfoByTo(toId: EntityId, config?: RequestConfig): Observable<Array<EntityRelationInfo>>;
    findByToAndType(toId: EntityId, relationType: string, config?: RequestConfig): Observable<Array<EntityRelation>>;
    findByQuery(query: EntityRelationsQuery, config?: RequestConfig): Observable<Array<EntityRelation>>;
    findInfoByQuery(query: EntityRelationsQuery, config?: RequestConfig): Observable<Array<EntityRelationInfo>>;
}
