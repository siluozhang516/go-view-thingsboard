export interface MaterialColorItem {
    value: string;
    group: string;
    label: string;
    isDark: boolean;
}
export declare const materialColorPalette: {
    [palette: string]: {
        [spectrum: string]: string;
    };
};
export declare const materialColors: MaterialColorItem[];
