import { AggregationType, Interval, TimeInterval, Timewindow } from '../../shared/models/time/time.models';
import { HttpClient } from '../../angular-http';
export declare class TimeService {
    private http;
    private maxDatapointsLimit;
    constructor(http: HttpClient);
    setMaxDatapointsLimit(limit: number): void;
    matchesExistingInterval(min: number, max: number, interval: Interval, useCalendarIntervals?: boolean): boolean;
    getIntervals(min: number, max: number, useCalendarIntervals?: boolean): Array<TimeInterval>;
    boundMinInterval(min: number): number;
    boundMaxInterval(max: number): number;
    boundToPredefinedInterval(min: number, max: number, interval: Interval, useCalendarIntervals?: boolean): Interval;
    boundIntervalToTimewindow(timewindow: number, interval: Interval, aggType: AggregationType): Interval;
    getMaxDatapointsLimit(): number;
    getMinDatapointsLimit(): number;
    avgInterval(timewindow: number): number;
    minIntervalLimit(timewindowMs: number): number;
    maxIntervalLimit(timewindowMs: number): number;
    defaultTimewindow(): Timewindow;
    private toBound;
    private toIntervalBound;
}
