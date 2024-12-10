import { BaseData } from '../../shared/models/base-data';
import { TenantId } from '../../shared/models/id/tenant-id';
import { OtaPackageId } from '../../shared/models/id/ota-package-id';
import { DeviceProfileId } from '../../shared/models/id/device-profile-id';
import { HasTenantId } from '../../shared/models/entity.models';
export declare enum ChecksumAlgorithm {
    MD5 = "MD5",
    SHA256 = "SHA256",
    SHA384 = "SHA384",
    SHA512 = "SHA512",
    CRC32 = "CRC32",
    MURMUR3_32 = "MURMUR3_32",
    MURMUR3_128 = "MURMUR3_128"
}
export declare const ChecksumAlgorithmTranslationMap: Map<ChecksumAlgorithm, string>;
export declare enum OtaUpdateType {
    FIRMWARE = "FIRMWARE",
    SOFTWARE = "SOFTWARE"
}
export declare const OtaUpdateTypeTranslationMap: Map<OtaUpdateType, string>;
export interface OtaUpdateTranslation {
    label: string;
    required: string;
    noFound: string;
    noMatching: string;
    hint: string;
}
export declare const OtaUpdateTranslation: Map<OtaUpdateType, OtaUpdateTranslation>;
export interface OtaPagesIds {
    firmwareId?: OtaPackageId;
    softwareId?: OtaPackageId;
}
export interface OtaPackageInfo extends BaseData<OtaPackageId>, HasTenantId {
    tenantId?: TenantId;
    type: OtaUpdateType;
    deviceProfileId?: DeviceProfileId;
    title?: string;
    version?: string;
    tag?: string;
    hasData?: boolean;
    url?: string;
    fileName: string;
    checksum?: string;
    checksumAlgorithm?: ChecksumAlgorithm;
    contentType: string;
    dataSize?: number;
    additionalInfo?: any;
    isURL?: boolean;
}
export interface OtaPackage extends OtaPackageInfo {
    file?: File;
    data: string;
}
