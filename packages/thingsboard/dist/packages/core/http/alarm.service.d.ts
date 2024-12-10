import { RequestConfig } from './http-utils';
import { Observable } from 'rxjs';
import { HttpClient } from '../../angular-http';
import { PageData } from '../../shared/models/page/page-data';
import { EntityId } from '../../shared/models/id/entity-id';
import { Alarm, AlarmInfo, AlarmQuery, AlarmQueryV2, AlarmSearchStatus, AlarmSeverity, AlarmStatus } from '../../shared/models/alarm.models';
import { EntitySubtype } from '../../shared/models/entity-type.models';
import { PageLink } from '../../shared/models/page/page-link';
export declare class AlarmService {
    private http;
    constructor(http: HttpClient);
    getAlarm(alarmId: string, config?: RequestConfig): Observable<Alarm>;
    getAlarmInfo(alarmId: string, config?: RequestConfig): Observable<AlarmInfo>;
    saveAlarm(alarm: Alarm, config?: RequestConfig): Observable<Alarm>;
    ackAlarm(alarmId: string, config?: RequestConfig): Observable<AlarmInfo>;
    clearAlarm(alarmId: string, config?: RequestConfig): Observable<AlarmInfo>;
    assignAlarm(alarmId: string, assigneeId: string, config?: RequestConfig): Observable<void>;
    unassignAlarm(alarmId: string, config?: RequestConfig): Observable<void>;
    deleteAlarm(alarmId: string, config?: RequestConfig): Observable<boolean>;
    getAlarms(query: AlarmQuery, config?: RequestConfig): Observable<PageData<AlarmInfo>>;
    getAlarmsV2(query: AlarmQueryV2, config?: RequestConfig): Observable<PageData<AlarmInfo>>;
    getAllAlarms(query: AlarmQuery, config?: RequestConfig): Observable<PageData<AlarmInfo>>;
    getAllAlarmsV2(query: AlarmQueryV2, config?: RequestConfig): Observable<PageData<AlarmInfo>>;
    getHighestAlarmSeverity(entityId: EntityId, alarmSearchStatus: AlarmSearchStatus, alarmStatus: AlarmStatus, config?: RequestConfig): Observable<AlarmSeverity>;
    getAlarmTypes(pageLink: PageLink, config?: RequestConfig): Observable<PageData<EntitySubtype>>;
}
