import { SortOrder } from '../../../shared/models/page/sort-order';
import { PageData } from '../../../shared/models/page/page-data';
export declare const MAX_SAFE_PAGE_SIZE = 2147483647;
export type PageLinkSearchFunction<T> = (entity: T, textSearch: string, searchProperty?: string) => boolean;
export interface PageQueryParam extends Partial<SortOrder> {
    textSearch?: string;
    pageSize?: number;
    page?: number;
    action?: any;
}
export declare function defaultPageLinkSearchFunction(searchProperty?: string): PageLinkSearchFunction<any>;
export declare function sortItems(item1: any, item2: any, property: string, asc: boolean): number;
export declare class PageLink {
    textSearch: string;
    pageSize: number;
    page: number;
    sortOrder: SortOrder;
    constructor(pageSize: number, page?: number, textSearch?: string, sortOrder?: SortOrder);
    nextPageLink(): PageLink;
    toQuery(): string;
    sort(item1: any, item2: any): number;
    filterData<T>(data: Array<T>, searchFunction?: PageLinkSearchFunction<T>): PageData<T>;
    sortDirection(): any;
}
export declare class TimePageLink extends PageLink {
    startTime: number;
    endTime: number;
    constructor(pageSize: number, page?: number, textSearch?: string, sortOrder?: SortOrder, startTime?: number, endTime?: number);
    nextPageLink(): TimePageLink;
    toQuery(): string;
}
