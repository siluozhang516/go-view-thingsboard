import { RequestConfig } from './http-utils';
import { Observable } from 'rxjs';
import { HttpClient } from '../../angular-http';
import { PageLink } from '../../shared/models/page/page-link';
import { PageData } from '../../shared/models/page/page-data';
import { Customer } from '../../shared/models/customer.model';
export declare class CustomerService {
    private http;
    constructor(http: HttpClient);
    getCustomers(pageLink: PageLink, config?: RequestConfig): Observable<PageData<Customer>>;
    getCustomer(customerId: string, config?: RequestConfig): Observable<Customer>;
    saveCustomer(customer: Customer, config?: RequestConfig): Observable<Customer>;
    deleteCustomer(customerId: string, config?: RequestConfig): Observable<Object>;
}
