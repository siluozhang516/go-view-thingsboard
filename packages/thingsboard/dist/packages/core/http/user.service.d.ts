import { RequestConfig } from './http-utils';
import { User, UserEmailInfo } from '../../shared/models/user.model';
import { Observable } from 'rxjs';
import { HttpClient } from '../../angular-http';
import { PageLink } from '../../shared/models/page/page-link';
import { PageData } from '../../shared/models/page/page-data';
export declare class UserService {
    private http;
    constructor(http: HttpClient);
    getUsers(pageLink: PageLink, config?: RequestConfig): Observable<PageData<User>>;
    getTenantAdmins(tenantId: string, pageLink: PageLink, config?: RequestConfig): Observable<PageData<User>>;
    getCustomerUsers(customerId: string, pageLink: PageLink, config?: RequestConfig): Observable<PageData<User>>;
    getUsersForAssign(alarmId: string, pageLink: PageLink, config?: RequestConfig): Observable<PageData<UserEmailInfo>>;
    getUser(userId: string, config?: RequestConfig): Observable<User>;
    saveUser(user: User, sendActivationMail?: boolean, config?: RequestConfig): Observable<User>;
    deleteUser(userId: string, config?: RequestConfig): Observable<Object>;
    getActivationLink(userId: string, config?: RequestConfig): Observable<string>;
    sendActivationEmail(email: string, config?: RequestConfig): Observable<Object>;
    setUserCredentialsEnabled(userId: string, userCredentialsEnabled?: boolean, config?: RequestConfig): Observable<any>;
    findUsersByQuery(pageLink: PageLink, config?: RequestConfig): Observable<PageData<UserEmailInfo>>;
}
