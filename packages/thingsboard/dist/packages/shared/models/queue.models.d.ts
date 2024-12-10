import { BaseData } from '../../shared/models/base-data';
import { TenantId } from '../../shared/models/id/tenant-id';
import { QueueId } from '../../shared/models/id/queue-id';
import { HasTenantId } from '../../shared/models/entity.models';
export declare enum ServiceType {
    TB_CORE = "TB_CORE",
    TB_RULE_ENGINE = "TB_RULE_ENGINE",
    TB_TRANSPORT = "TB_TRANSPORT",
    JS_EXECUTOR = "JS_EXECUTOR"
}
export declare enum QueueSubmitStrategyTypes {
    SEQUENTIAL_BY_ORIGINATOR = "SEQUENTIAL_BY_ORIGINATOR",
    SEQUENTIAL_BY_TENANT = "SEQUENTIAL_BY_TENANT",
    SEQUENTIAL = "SEQUENTIAL",
    BURST = "BURST",
    BATCH = "BATCH"
}
export interface QueueStrategyData {
    label: string;
    hint: string;
}
export declare const QueueSubmitStrategyTypesMap: Map<QueueSubmitStrategyTypes, QueueStrategyData>;
export declare enum QueueProcessingStrategyTypes {
    RETRY_FAILED_AND_TIMED_OUT = "RETRY_FAILED_AND_TIMED_OUT",
    SKIP_ALL_FAILURES = "SKIP_ALL_FAILURES",
    SKIP_ALL_FAILURES_AND_TIMED_OUT = "SKIP_ALL_FAILURES_AND_TIMED_OUT",
    RETRY_ALL = "RETRY_ALL",
    RETRY_FAILED = "RETRY_FAILED",
    RETRY_TIMED_OUT = "RETRY_TIMED_OUT"
}
export declare const QueueProcessingStrategyTypesMap: Map<QueueProcessingStrategyTypes, QueueStrategyData>;
export interface QueueInfo extends BaseData<QueueId>, HasTenantId {
    generatedId?: string;
    name: string;
    packProcessingTimeout: number;
    partitions: number;
    consumerPerPartition: boolean;
    pollInterval: number;
    processingStrategy: {
        type: QueueProcessingStrategyTypes;
        retries: number;
        failurePercentage: number;
        pauseBetweenRetries: number;
        maxPauseBetweenRetries: number;
    };
    submitStrategy: {
        type: QueueSubmitStrategyTypes;
        batchSize: number;
    };
    tenantId?: TenantId;
    topic: string;
    additionalInfo: {
        description?: string;
        customProperties?: string;
        duplicateMsgToAllPartitions?: boolean;
    };
}
export interface QueueStatisticsInfo extends Omit<BaseData<QueueId>, 'label'>, HasTenantId {
    queueName: string;
    serviceId: string;
}
