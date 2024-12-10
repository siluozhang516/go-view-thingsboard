import { BaseData } from "./base-data";
import { CustomerId } from "./id/customer-id";
import { SchedulerEventId } from "./id/scheduler-id";
import { TenantId } from "./id/tenant-id";
export interface SchedulerEvent extends BaseData<SchedulerEventId> {
    tenantId?: TenantId;
    customerId?: CustomerId;
    name?: string;
    type?: string;
    schedule?: any;
    configuration?: any;
    additionalInfo?: any;
}
