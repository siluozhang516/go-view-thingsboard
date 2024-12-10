export interface SortOrder {
    property: string;
    direction: Direction;
}
export declare enum Direction {
    ASC = "ASC",
    DESC = "DESC"
}
export declare function sortOrderFromString(strSortOrder: string): SortOrder;
