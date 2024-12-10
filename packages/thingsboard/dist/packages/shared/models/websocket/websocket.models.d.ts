import { NgZone } from '../../../inversify/interface';
import { WebsocketCmd } from '../../..//shared/models/telemetry/telemetry.models';
import { Subject } from 'rxjs';
export interface WsService<T extends WsSubscriber> {
    subscribe(subscriber: T): any;
    update(subscriber: T): any;
    unsubscribe(subscriber: T): any;
}
export declare abstract class CmdWrapper {
    abstract setAuth(token: string): any;
    abstract hasCommands(): boolean;
    abstract clear(): void;
    abstract preparePublishCommands(maxCommands: number): CmdWrapper;
    [key: string]: WebsocketCmd | any;
}
export declare abstract class WsSubscriber {
    protected wsService: WsService<WsSubscriber>;
    protected zone?: NgZone;
    protected reconnectSubject: Subject<void>;
    subscriptionCommands: Array<WebsocketCmd>;
    reconnect$: import("rxjs").Observable<void>;
    protected constructor(wsService: WsService<WsSubscriber>, zone?: NgZone);
    subscribe(): void;
    update(): void;
    unsubscribe(): void;
    complete(): void;
    onReconnected(): void;
}
