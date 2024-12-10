import { HasUUID } from '../../shared/models/id/has-uuid';
export interface OAuth2Info {
    enabled: boolean;
    edgeEnabled: boolean;
    oauth2ParamsInfos: OAuth2ParamsInfo[];
}
export interface OAuth2ParamsInfo {
    clientRegistrations: OAuth2RegistrationInfo[];
    domainInfos: OAuth2DomainInfo[];
    mobileInfos: OAuth2MobileInfo[];
}
export interface OAuth2DomainInfo {
    name: string;
    scheme: DomainSchema;
}
export interface OAuth2MobileInfo {
    pkgName: string;
    appSecret: string;
}
export declare enum DomainSchema {
    HTTP = "HTTP",
    HTTPS = "HTTPS",
    MIXED = "MIXED"
}
export declare const domainSchemaTranslations: Map<DomainSchema, string>;
export declare enum MapperConfigType {
    BASIC = "BASIC",
    CUSTOM = "CUSTOM",
    GITHUB = "GITHUB",
    APPLE = "APPLE"
}
export declare enum TenantNameStrategy {
    DOMAIN = "DOMAIN",
    EMAIL = "EMAIL",
    CUSTOM = "CUSTOM"
}
export declare enum PlatformType {
    WEB = "WEB",
    ANDROID = "ANDROID",
    IOS = "IOS"
}
export declare const platformTypeTranslations: Map<PlatformType, string>;
export interface OAuth2ClientRegistrationTemplate extends OAuth2RegistrationInfo {
    comment: string;
    createdTime: number;
    helpLink: string;
    name: string;
    providerId: string;
    id: HasUUID;
}
export interface OAuth2RegistrationInfo {
    loginButtonLabel: string;
    loginButtonIcon: string;
    clientId: string;
    clientSecret: string;
    accessTokenUri: string;
    authorizationUri: string;
    scope: string[];
    platforms: PlatformType[];
    jwkSetUri?: string;
    userInfoUri: string;
    clientAuthenticationMethod: ClientAuthenticationMethod;
    userNameAttributeName: string;
    mapperConfig: MapperConfig;
    additionalInfo: string;
}
export declare enum ClientAuthenticationMethod {
    BASIC = "BASIC",
    POST = "POST"
}
export interface MapperConfig {
    allowUserCreation: boolean;
    activateUser: boolean;
    type: MapperConfigType;
    basic?: MapperConfigBasic;
    custom?: MapperConfigCustom;
}
export interface MapperConfigBasic {
    emailAttributeKey: string;
    firstNameAttributeKey?: string;
    lastNameAttributeKey?: string;
    tenantNameStrategy: TenantNameStrategy;
    tenantNamePattern?: string;
    customerNamePattern?: string;
    defaultDashboardName?: string;
    alwaysFullScreen?: boolean;
}
export interface MapperConfigCustom {
    url: string;
    username?: string;
    password?: string;
}
export interface OAuth2ClientInfo {
    name: string;
    icon?: string;
    url: string;
}
