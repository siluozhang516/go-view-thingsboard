import { NgZone } from "../../inversify/interface";
import { TelemetryPluginCmdsWrapper, TelemetrySubscriber, WebsocketDataMsg } from "../../shared/models/telemetry/telemetry.models";
import { AuthService } from "../../core/auth/auth.service";
import { WebsocketService } from "../../core/ws/websocket.service";
export declare class TelemetryWebsocketService extends WebsocketService<TelemetrySubscriber> {
    protected authService: AuthService;
    protected ngZone: NgZone;
    protected window: Window;
    cmdWrapper: TelemetryPluginCmdsWrapper;
    constructor(authService: AuthService, ngZone: NgZone, window: Window);
    subscribe(subscriber: TelemetrySubscriber): void;
    update(subscriber: TelemetrySubscriber): void;
    unsubscribe(subscriber: TelemetrySubscriber): void;
    processOnMessage(message: WebsocketDataMsg): void;
}
