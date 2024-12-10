import { AliasInfo, IAliasController, StateControllerHolder, StateEntityInfo } from './widget-api.models';
import { Observable, Subject } from 'rxjs';
import { Datasource, TargetDevice } from '../../shared/models/widget.models';
import { EntityService } from '../../core/http/entity.service';
import { UtilsService } from '../../core/services/utils.service';
import { EntityAliases } from '../../shared/models/alias.models';
import { EntityInfo } from '../../shared/models/entity.models';
import { Filter, FilterInfo, Filters, KeyFilter } from '../../shared/models/query/query.models';
import { TranslateService } from '../../inversify/interface';
export declare class AliasController implements IAliasController {
    private utils;
    private entityService;
    private translate;
    private stateControllerHolder;
    private origEntityAliases;
    private origFilters;
    entityAliasesChangedSubject: Subject<string[]>;
    entityAliasesChanged: Observable<Array<string>>;
    filtersChangedSubject: Subject<string[]>;
    filtersChanged: Observable<Array<string>>;
    private entityAliasResolvedSubject;
    entityAliasResolved: Observable<string>;
    entityAliases: EntityAliases;
    filters: Filters;
    userFilters: Filters;
    resolvedAliases: {
        [aliasId: string]: AliasInfo;
    };
    resolvedAliasesObservable: {
        [aliasId: string]: Observable<AliasInfo>;
    };
    resolvedAliasesToStateEntities: {
        [aliasId: string]: StateEntityInfo;
    };
    constructor(utils: UtilsService, entityService: EntityService, translate: TranslateService, stateControllerHolder: StateControllerHolder, origEntityAliases: EntityAliases, origFilters: Filters);
    updateEntityAliases(newEntityAliases: EntityAliases): void;
    updateFilters(newFilters: Filters): void;
    updateAliases(aliasIds?: Array<string>): void;
    dashboardStateChanged(): void;
    setAliasUnresolved(aliasId: string): void;
    getEntityAliases(): EntityAliases;
    getFilters(): Filters;
    getFilterInfo(filterId: string): FilterInfo;
    getKeyFilters(filterId: string): Array<KeyFilter>;
    getEntityAliasId(aliasName: string): string;
    getAliasInfo(aliasId: string): Observable<AliasInfo>;
    resolveSingleEntityInfo(aliasId: string): Observable<EntityInfo>;
    resolveSingleEntityInfoForDeviceId(deviceId: string): Observable<EntityInfo>;
    resolveSingleEntityInfoForTargetDevice(targetDevice: TargetDevice): Observable<EntityInfo>;
    private resolveDatasource;
    resolveAlarmSource(alarmSource: Datasource): Observable<Datasource>;
    resolveDatasources(datasources: Array<Datasource>, singleEntity?: boolean, pageSize?: number): Observable<Array<Datasource>>;
    getInstantAliasInfo(aliasId: string): AliasInfo;
    updateCurrentAliasEntity(aliasId: string, currentEntity: EntityInfo): void;
    updateUserFilter(filter: Filter): void;
}
