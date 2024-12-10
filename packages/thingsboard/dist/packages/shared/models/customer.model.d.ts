import { CustomerId } from '../../shared/models/id/customer-id';
import { ContactBased } from '../../shared/models/contact-based.model';
import { TenantId } from './id/tenant-id';
import { ExportableEntity } from '../../shared/models/base-data';
import { HasTenantId } from '../../shared/models/entity.models';
export interface Customer extends ContactBased<CustomerId>, HasTenantId, ExportableEntity<CustomerId> {
    tenantId: TenantId;
    title: string;
    additionalInfo?: any;
}
export interface ShortCustomerInfo {
    customerId: CustomerId;
    title: string;
    public: boolean;
}
