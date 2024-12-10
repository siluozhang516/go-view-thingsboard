export interface UserSettings {
    openedMenuSections?: string[];
    notDisplayConnectivityAfterAddDevice?: boolean;
    notDisplayInstructionsAfterAddEdge?: boolean;
    includeBundleWidgetsInExport?: boolean;
}
export declare const initialUserSettings: UserSettings;
export declare enum UserSettingsType {
    GENERAL = "GENERAL",
    QUICK_LINKS = "QUICK_LINKS",
    DOC_LINKS = "DOC_LINKS",
    DASHBOARDS = "DASHBOARDS",
    GETTING_STARTED = "GETTING_STARTED"
}
export interface DocumentationLink {
    icon: string;
    name: string;
    link: string;
}
export interface DocumentationLinks {
    links?: DocumentationLink[];
}
export interface QuickLinks {
    links?: string[];
}
export interface GettingStarted {
    maxSelectedIndex?: number;
    lastSelectedIndex?: number;
}
export interface AbstractUserDashboardInfo {
    id: string;
    title: string;
    starred: boolean;
}
export interface LastVisitedDashboardInfo extends AbstractUserDashboardInfo {
    lastVisited: number;
}
export interface StarredDashboardInfo extends AbstractUserDashboardInfo {
    starredAt: number;
}
export interface UserDashboardsInfo {
    last: Array<LastVisitedDashboardInfo>;
    starred: Array<StarredDashboardInfo>;
}
export declare enum UserDashboardAction {
    VISIT = "VISIT",
    STAR = "STAR",
    UNSTAR = "UNSTAR"
}
