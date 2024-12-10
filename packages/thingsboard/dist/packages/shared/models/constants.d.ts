export declare const Constants: {
    serverErrorCode: {
        general: number;
        authentication: number;
        jwtTokenExpired: number;
        tenantTrialExpired: number;
        credentialsExpired: number;
        permissionDenied: number;
        invalidArguments: number;
        badRequestParams: number;
        itemNotFound: number;
        tooManyRequests: number;
        tooManyUpdates: number;
        passwordViolation: number;
    };
    entryPoints: {
        login: string;
        tokenRefresh: string;
        nonTokenBased: string;
    };
};
export declare const serverErrorCodesTranslations: Map<number, string>;
export declare const MediaBreakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    'lt-sm': string;
    'lt-md': string;
    'lt-lg': string;
    'lt-xl': string;
    'gt-xs': string;
    'gt-sm': string;
    'gt-md': string;
    'gt-lg': string;
    'gt-xl': string;
    'md-lg': string;
};
export declare const resolveBreakpoint: (breakpoint: string) => string;
export declare const helpBaseUrl = "https://thingsboard.io";
export declare const docPlatformPrefix = "";
export declare const HelpLinks: {
    linksMap: {
        outgoingMailSettings: string;
        smsProviderSettings: string;
        slackSettings: string;
        securitySettings: string;
        oauth2Settings: string;
        ruleEngine: string;
        ruleNodeCheckRelation: string;
        ruleNodeCheckExistenceFields: string;
        ruleNodeGpsGeofencingFilter: string;
        ruleNodeJsFilter: string;
        ruleNodeJsSwitch: string;
        ruleNodeAssetProfileSwitch: string;
        ruleNodeDeviceProfileSwitch: string;
        ruleNodeCheckAlarmStatus: string;
        ruleNodeMessageTypeFilter: string;
        ruleNodeMessageTypeSwitch: string;
        ruleNodeOriginatorTypeFilter: string;
        ruleNodeOriginatorTypeSwitch: string;
        ruleNodeOriginatorAttributes: string;
        ruleNodeOriginatorFields: string;
        ruleNodeOriginatorTelemetry: string;
        ruleNodeCustomerAttributes: string;
        ruleNodeCustomerDetails: string;
        ruleNodeDeviceAttributes: string;
        ruleNodeRelatedAttributes: string;
        ruleNodeTenantAttributes: string;
        ruleNodeTenantDetails: string;
        ruleNodeChangeOriginator: string;
        ruleNodeTransformMsg: string;
        ruleNodeMsgToEmail: string;
        ruleNodeAssignToCustomer: string;
        ruleNodeUnassignFromCustomer: string;
        ruleNodeClearAlarm: string;
        ruleNodeCreateAlarm: string;
        ruleNodeCreateRelation: string;
        ruleNodeDeleteRelation: string;
        ruleNodeMsgDelay: string;
        ruleNodeMsgGenerator: string;
        ruleNodeGpsGeofencingEvents: string;
        ruleNodeLog: string;
        ruleNodeRpcCallReply: string;
        ruleNodeRpcCallRequest: string;
        ruleNodeSaveAttributes: string;
        ruleNodeSaveTimeseries: string;
        ruleNodeSaveToCustomTable: string;
        ruleNodeRuleChain: string;
        ruleNodeOutputNode: string;
        ruleNodeAwsSns: string;
        ruleNodeAwsSqs: string;
        ruleNodeKafka: string;
        ruleNodeMqtt: string;
        ruleNodeAzureIotHub: string;
        ruleNodeRabbitMq: string;
        ruleNodeRestApiCall: string;
        ruleNodeSendEmail: string;
        ruleNodeSendSms: string;
        ruleNodeMath: string;
        ruleNodeCalculateDelta: string;
        ruleNodeRestCallReply: string;
        ruleNodePushToCloud: string;
        ruleNodePushToEdge: string;
        tenants: string;
        tenantProfiles: string;
        customers: string;
        users: string;
        devices: string;
        deviceProfiles: string;
        assetProfiles: string;
        edges: string;
        assets: string;
        entityViews: string;
        entitiesImport: string;
        rulechains: string;
        lwm2mResourceLibrary: string;
        dashboards: string;
        otaUpdates: string;
        widgetTypes: string;
        widgetsBundles: string;
        widgetsConfig: string;
        widgetsConfigTimeseries: string;
        widgetsConfigLatest: string;
        widgetsConfigRpc: string;
        widgetsConfigAlarm: string;
        widgetsConfigStatic: string;
        queue: string;
        repositorySettings: string;
        autoCommitSettings: string;
        twoFactorAuthentication: string;
        sentNotification: string;
        templateNotifications: string;
        recipientNotifications: string;
        ruleNotifications: string;
        jwtSecuritySettings: string;
        gatewayInstall: string;
    };
};
export interface ValueTypeData {
    name: string;
    icon: string;
}
export declare enum ValueType {
    STRING = "STRING",
    INTEGER = "INTEGER",
    DOUBLE = "DOUBLE",
    BOOLEAN = "BOOLEAN",
    JSON = "JSON"
}
export declare enum DataType {
    STRING = "STRING",
    LONG = "LONG",
    BOOLEAN = "BOOLEAN",
    DOUBLE = "DOUBLE",
    JSON = "JSON"
}
export declare const DataTypeTranslationMap: Map<DataType, string>;
export declare const valueTypesMap: Map<ValueType, ValueTypeData>;
export interface ContentTypeData {
    name: string;
    code: string;
}
export declare enum ContentType {
    JSON = "JSON",
    TEXT = "TEXT",
    BINARY = "BINARY"
}
export declare const contentTypesMap: Map<ContentType, ContentTypeData>;
export declare const hidePageSizePixelValue = 550;
export declare const customTranslationsPrefix = "custom.";
export declare const i18nPrefix = "i18n";
