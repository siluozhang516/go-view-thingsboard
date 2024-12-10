import { SubscriptionTimewindow } from '../../shared/models/time/time.models';
import { Datasource } from '../../shared/models/widget.models';
import { PageData } from '../../shared/models/page/page-data';
import { AlarmData, AlarmDataPageLink, KeyFilter } from '../../shared/models/query/query.models';
import { TelemetryWebsocketService } from '../../core/ws/telemetry-websocket.service';
import { AlarmDataSubscription, AlarmDataSubscriptionOptions } from '../../core/api/alarm-data-subscription';
export interface AlarmDataListener {
    subscriptionTimewindow?: SubscriptionTimewindow;
    alarmSource: Datasource;
    alarmsLoaded: (pageData: PageData<AlarmData>, allowedEntities: number, totalEntities: number) => void;
    alarmsUpdated: (update: Array<AlarmData>, pageData: PageData<AlarmData>) => void;
    alarmDataSubscriptionOptions?: AlarmDataSubscriptionOptions;
    subscription?: AlarmDataSubscription;
}
export declare class AlarmDataService {
    private telemetryService;
    constructor(telemetryService: TelemetryWebsocketService);
    subscribeForAlarms(listener: AlarmDataListener, pageLink: AlarmDataPageLink, keyFilters: KeyFilter[]): void;
    stopSubscription(listener: AlarmDataListener): void;
    private createAlarmSubscriptionOptions;
}
