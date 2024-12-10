import { BaseData, ExportableEntity, HasId } from '../../shared/models/base-data';
import { TenantId } from '../../shared/models/id/tenant-id';
import { TbResourceId } from '../../shared/models/id/tb-resource-id';
import { HasTenantId } from '../../shared/models/entity.models';
export declare enum ResourceType {
    LWM2M_MODEL = "LWM2M_MODEL",
    PKCS_12 = "PKCS_12",
    JKS = "JKS",
    JS_MODULE = "JS_MODULE"
}
export declare const ResourceTypeMIMETypes: Map<ResourceType, string>;
export declare const ResourceTypeExtension: Map<ResourceType, string>;
export declare const ResourceTypeTranslationMap: Map<ResourceType, string>;
export interface TbResourceInfo<D> extends Omit<BaseData<TbResourceId>, 'name' | 'label'>, HasTenantId, ExportableEntity<TbResourceId> {
    tenantId?: TenantId;
    resourceKey?: string;
    title?: string;
    resourceType: ResourceType;
    fileName: string;
    public: boolean;
    publicResourceKey?: string;
    descriptor?: D;
}
export type ResourceInfo = TbResourceInfo<any>;
export interface Resource extends ResourceInfo {
    data: string;
    name?: string;
}
export interface ImageDescriptor {
    mediaType: string;
    width: number;
    height: number;
    size: number;
    etag: string;
    previewDescriptor: ImageDescriptor;
}
export interface ImageResourceInfo extends TbResourceInfo<ImageDescriptor> {
    link?: string;
    publicLink?: string;
}
export interface ImageResource extends ImageResourceInfo {
    base64?: string;
}
export interface ImageExportData {
    mediaType: string;
    fileName: string;
    title: string;
    resourceKey: string;
    public: boolean;
    publicResourceKey: string;
    data: string;
}
export type ImageResourceType = 'tenant' | 'system';
export type ImageReferences = {
    [entityType: string]: Array<BaseData<HasId> & HasTenantId>;
};
export interface ImageResourceInfoWithReferences extends ImageResourceInfo {
    references: ImageReferences;
}
export interface ImageDeleteResult {
    image: ImageResourceInfo;
    success: boolean;
    imageIsReferencedError?: boolean;
    error?: any;
    references?: ImageReferences;
}
export declare const toImageDeleteResult: (image: ImageResourceInfo, e?: any) => ImageDeleteResult;
export declare const imageResourceType: (imageInfo: ImageResourceInfo) => ImageResourceType;
export declare const TB_IMAGE_PREFIX = "tb-image;";
export declare const IMAGES_URL_REGEXP: RegExp;
export declare const IMAGES_URL_PREFIX = "/api/images";
export declare const PUBLIC_IMAGES_URL_PREFIX = "/api/images/public";
export declare const IMAGE_BASE64_URL_PREFIX = "data:image/";
export declare const removeTbImagePrefix: (url: string) => string;
export declare const removeTbImagePrefixFromUrls: (urls: string[]) => string[];
export declare const prependTbImagePrefix: (url: string) => string;
export declare const prependTbImagePrefixToUrls: (urls: string[]) => string[];
export declare const isImageResourceUrl: (url: string) => boolean;
export declare const extractParamsFromImageResourceUrl: (url: string) => {
    type: ImageResourceType;
    key: string;
};
export declare const isBase64DataImageUrl: (url: string) => boolean;
export declare const NO_IMAGE_DATA_URI = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
