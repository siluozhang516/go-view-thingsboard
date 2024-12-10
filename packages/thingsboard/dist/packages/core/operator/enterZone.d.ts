import { MonoTypeOperatorFunction, Observable, Operator, Subscriber } from 'rxjs';
export type EnterZoneSignature<T> = (zone: {
    run: (fn: any) => any;
}) => Observable<T>;
export declare function enterZone<T>(zone: {
    run: (fn: any) => any;
}): MonoTypeOperatorFunction<T>;
export declare class EnterZoneOperator<T> implements Operator<T, T> {
    private zone;
    constructor(zone: {
        run: (fn: any) => any;
    });
    call(subscriber: Subscriber<T>, source: any): any;
}
