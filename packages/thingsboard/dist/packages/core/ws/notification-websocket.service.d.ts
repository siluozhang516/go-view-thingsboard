import { NgZone } from "../../inversify/interface";
import { TelemetrySubscriber, WebsocketDataMsg } from "../../shared/models/telemetry/telemetry.models";
import { TelemetryWebsocketService } from "../../core/ws/telemetry-websocket.service";
import { AuthService } from "../../core/auth/auth.service";
import { WebsocketService } from "../../core/ws/websocket.service";
export declare class NotificationWebsocketService extends WebsocketService<TelemetrySubscriber> {
    private telemetryWebsocketService;
    protected authService: AuthService;
    protected ngZone: NgZone;
    protected window: Window;
    constructor(telemetryWebsocketService: TelemetryWebsocketService, authService: AuthService, ngZone: NgZone, window: Window);
    subscribe(subscriber: TelemetrySubscriber): void;
    update(subscriber: TelemetrySubscriber): void;
    unsubscribe(subscriber: TelemetrySubscriber): void;
    processOnMessage(message: WebsocketDataMsg): void;
}
