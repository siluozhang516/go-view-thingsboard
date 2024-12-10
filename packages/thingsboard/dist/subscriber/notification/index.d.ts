import { NotificationSubscriber, NotificationWebsocketService } from "../../packages/index";
import { BehaviorSubject, Subscription } from "rxjs";
export declare class NotificationSubscriptionService {
    static notificationSubscriber: NotificationSubscriber;
    static notificationCountSubscriber: NotificationSubscriber;
    static notificationWsService: typeof NotificationWebsocketService;
    static countSubject: BehaviorSubject<number>;
    static countSubscription: Subscription;
    /**
     * 订阅通知数量
     */
    static subscribeCount(): import("rxjs").Observable<number>;
    /**
     * 取消订阅通知数量
     */
    static unsubscribeCount(): void;
    /**
     * 订阅通知消息
     */
    static subscribeMessage(limit?: number): import("rxjs").Observable<import("../../packages/index").Notification[]>;
    /**
     * 取消订阅通知消息
     */
    static unsubscribeMessage: () => void;
}
