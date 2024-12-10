import { HttpClient } from "../../angular-http";
import { RequestConfig } from "./http-utils";
import { Observable } from "rxjs";
import { PageLink } from "../../shared/models/page/page-link";
import { SchedulerEvent } from "../../shared/models/schedulerEvent.models";
export declare class SchedulerService {
    private http;
    constructor(http: HttpClient);
    getAllSchedulerEvents(edgeId: string, config?: RequestConfig): Observable<any>;
    assignSchedulerEventToEdge(edgeId: string, schedulerEventId: string, config?: RequestConfig): Observable<any>;
    unassignSchedulerEventFromEdge(edgeId: string, schedulerEventId: string, config?: RequestConfig): Observable<any>;
    getEdgeSchedulerEvents(edgeId: string, pageLink: PageLink, config?: RequestConfig): Observable<any>;
    saveSchedulerEvent(schedulerEvent: SchedulerEvent, config?: RequestConfig): Observable<any>;
    getSchedulerEventById(schedulerEventId: string, config?: RequestConfig): Observable<any>;
    deleteSchedulerEvent(schedulerEventId: string, config?: RequestConfig): Observable<any>;
    getSchedulerEventInfoById(schedulerEventId: string, config?: RequestConfig): Observable<any>;
    getSchedulerEventsByIds(schedulerEventIds: string[], config?: RequestConfig): Observable<any>;
    getSchedulerEvents(type: string, config?: RequestConfig): Observable<any>;
}
