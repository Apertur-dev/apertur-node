import { EventEmitter } from "events";
export interface AperturEventEmitter extends EventEmitter {
    on(event: "connected", listener: (data: {
        sessionId: string;
    }) => void): this;
    on(event: "image:ready", listener: (data: any) => void): this;
    on(event: "image:delivering", listener: (data: any) => void): this;
    on(event: string, listener: (data: any) => void): this;
}
export declare class Events {
    private readonly baseUrl;
    constructor(baseUrl: string);
    subscribe(uuid: string): AperturEventEmitter;
}
