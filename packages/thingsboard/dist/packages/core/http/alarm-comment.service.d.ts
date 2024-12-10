import { RequestConfig } from './http-utils';
import { Observable } from 'rxjs';
import { HttpClient } from '../../angular-http';
import { PageLink } from '../../shared/models/page/page-link';
import { PageData } from '../../shared/models/page/page-data';
import { AlarmComment, AlarmCommentInfo } from '../../shared/models/alarm.models';
export declare class AlarmCommentService {
    private http;
    constructor(http: HttpClient);
    saveAlarmComment(alarmId: string, alarmComment: AlarmComment, config?: RequestConfig): Observable<AlarmComment>;
    getAlarmComments(alarmId: string, pageLink: PageLink, config?: RequestConfig): Observable<PageData<AlarmCommentInfo>>;
    deleteAlarmComments(alarmId: string, commentId: string, config?: RequestConfig): Observable<void>;
}
