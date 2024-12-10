import { NgZone } from "../../inversify/interface";
export type CancelAnimationFrame = () => void;
export declare class RafService {
    private window;
    private ngZone;
    private readonly rafFunction;
    private readonly rafSupported;
    constructor(window: Window, ngZone: NgZone);
    raf(frameCallback: () => void, runInZone?: boolean): CancelAnimationFrame;
}
