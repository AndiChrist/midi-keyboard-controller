// Type definitions for missing modules

declare module 'midi' {
    export class Input {
        constructor();
        getPortCount(): number;
        getPortName(portNumber: number): string;
        openPort(portNumber: number): void;
        openVirtualPort(portName: string): void;
        closePort(): void;
        on(event: 'message', callback: (deltaTime: number, message: number[]) => void): void;
        on(event: 'error', callback: (error: Error) => void): void;
        removeListener(event: string, callback: Function): void;
    }

    export class Output {
        constructor();
        getPortCount(): number;
        getPortName(portNumber: string): string;
        openPort(portNumber: number): void;
        openVirtualPort(portName: string): void;
        closePort(): void;
        sendMessage(message: number[]): void;
    }
}

declare module 'speaker' {
    import { Writable } from 'stream';

    interface SpeakerOptions {
        channels?: number;
        bitDepth?: number;
        sampleRate?: number;
        signed?: boolean;
        float?: boolean;
        samplesPerFrame?: number;
    }

    class Speaker extends Writable {
        constructor(options?: SpeakerOptions);
        readonly channels: number;
        readonly bitDepth: number;
        readonly sampleRate: number;
        readonly signed: boolean;
        readonly float: boolean;
        readonly samplesPerFrame: number;
    }

    export = Speaker;
}