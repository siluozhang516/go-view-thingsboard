import { TenantId } from '../../shared/models/id/tenant-id';
import { RpcId } from '../../shared/models/id/rpc-id';
import { DeviceId } from '../../shared/models/id/device-id';
export declare enum RpcStatus {
    QUEUED = "QUEUED",
    DELIVERED = "DELIVERED",
    SUCCESSFUL = "SUCCESSFUL",
    TIMEOUT = "TIMEOUT",
    FAILED = "FAILED",
    SENT = "SENT",
    EXPIRED = "EXPIRED"
}
export declare const rpcStatusColors: Map<RpcStatus, string>;
export declare const rpcStatusTranslation: Map<RpcStatus, string>;
export interface PersistentRpc {
    id: RpcId;
    createdTime: number;
    expirationTime: number;
    status: RpcStatus;
    response: any;
    request: {
        id: string;
        oneway: boolean;
        body: {
            method: string;
            params: string;
        };
        retries: null | number;
    };
    deviceId: DeviceId;
    tenantId: TenantId;
    additionalInfo?: string;
}
export interface PersistentRpcData extends PersistentRpc {
    actionCellButtons?: any[];
    hasActions?: boolean;
}
export interface RequestData {
    method?: string;
    oneWayElseTwoWay?: boolean;
    persistentPollingInterval?: number;
    retries?: number;
    params?: object;
    additionalInfo?: object;
}
