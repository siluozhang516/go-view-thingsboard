export declare enum Lwm2mSecurityType {
    PSK = "PSK",
    RPK = "RPK",
    X509 = "X509",
    NO_SEC = "NO_SEC"
}
export declare const Lwm2mSecurityTypeTranslationMap: Map<Lwm2mSecurityType, string>;
export declare const Lwm2mPublicKeyOrIdTooltipTranslationsMap: Map<Lwm2mSecurityType, string>;
export declare const Lwm2mClientSecretKeyTooltipTranslationsMap: Map<Lwm2mSecurityType, string>;
export declare const Lwm2mClientKeyTooltipTranslationsMap: Map<Lwm2mSecurityType, string>;
export interface ClientSecurityConfig {
    securityConfigClientMode: Lwm2mSecurityType;
    endpoint: string;
    identity?: string;
    key?: string;
    cert?: string;
}
export interface ServerSecurityConfig {
    securityMode: Lwm2mSecurityType;
    clientPublicKeyOrId?: string;
    clientSecretKey?: string;
}
export interface Lwm2mSecurityConfigModels {
    client: ClientSecurityConfig;
    bootstrap: Array<ServerSecurityConfig>;
}
export declare function getLwm2mSecurityConfigModelsDefault(): Lwm2mSecurityConfigModels;
export declare function getDefaultClientSecurityConfig(securityConfigMode: Lwm2mSecurityType, endPoint?: string): ClientSecurityConfig;
export declare function getDefaultServerSecurityConfig(): ServerSecurityConfig;
