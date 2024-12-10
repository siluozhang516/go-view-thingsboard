import { Observable } from 'rxjs';
export declare const svgIcons: {
    [key: string]: string;
};
export declare const svgIconsUrl: {
    [key: string]: string;
};
export declare const splitIconName: (iconName: string) => [string, string];
export declare const isSvgIcon: (icon: string) => boolean;
export interface MaterialIcon {
    name: string;
    displayName?: string;
    tags: string[];
}
export declare const iconByName: (icons: Array<MaterialIcon>, name: string) => MaterialIcon;
export declare const getMaterialIcons: (resourcesService: any, chunkSize: number, all: boolean, searchText: string) => Observable<MaterialIcon[][]>;
