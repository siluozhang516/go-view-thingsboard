import { HasTenantId } from '../../shared/models/entity.models';
export interface MobileAppSettings extends HasTenantId {
    useDefaultApp: boolean;
    androidConfig: AndroidConfig;
    iosConfig: IosConfig;
    qrCodeConfig: QRCodeConfig;
    defaultGooglePlayLink: string;
    defaultAppStoreLink: string;
}
export interface AndroidConfig {
    enabled: boolean;
    appPackage: string;
    sha256CertFingerprints: string;
    storeLink: string;
}
export interface IosConfig {
    enabled: boolean;
    appId: string;
    storeLink: string;
}
export interface QRCodeConfig {
    showOnHomePage: boolean;
    badgeEnabled: boolean;
    badgePosition: BadgePosition;
    qrCodeLabelEnabled: boolean;
    qrCodeLabel: string;
}
export interface MobileOSBadgeURL {
    iOS: string;
    android: string;
}
export declare enum BadgePosition {
    RIGHT = "RIGHT",
    LEFT = "LEFT"
}
export declare const badgePositionTranslationsMap: Map<BadgePosition, string>;
