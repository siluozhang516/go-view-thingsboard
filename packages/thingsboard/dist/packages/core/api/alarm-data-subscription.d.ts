import { DataKeyType } from '../../shared/models/telemetry/telemetry.models';
import { DatasourceType } from '../../shared/models/widget.models';
import { AlarmDataPageLink, EntityFilter, KeyFilter } from '../../shared/models/query/query.models';
import { SubscriptionTimewindow } from '../../shared/models/time/time.models';
import { AlarmDataListener } from '../../core/api/alarm-data.service';
import { TelemetryWebsocketService } from '../../core/ws/telemetry-websocket.service';
export interface AlarmSubscriptionDataKey {
    name: string;
    type: DataKeyType;
}
export interface AlarmDataSubscriptionOptions {
    datasourceType: DatasourceType;
    dataKeys: Array<AlarmSubscriptionDataKey>;
    entityFilter?: EntityFilter;
    pageLink?: AlarmDataPageLink;
    keyFilters?: Array<KeyFilter>;
    additionalKeyFilters?: Array<KeyFilter>;
    subscriptionTimewindow?: SubscriptionTimewindow;
}
export declare class AlarmDataSubscription {
    private listener;
    private telemetryService;
    private alarmDataSubscriptionOptions;
    private datasourceType;
    private history;
    private realtime;
    private subscriber;
    private alarmDataCommand;
    private pageData;
    private prematureUpdates;
    private alarmIdToDataIndex;
    private subsTw;
    constructor(listener: AlarmDataListener, telemetryService: TelemetryWebsocketService);
    unsubscribe(): void;
    subscribe(): void;
    private resetData;
    private onPageData;
    private onDataUpdate;
}
