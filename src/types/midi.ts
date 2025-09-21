export interface MidiMessage {
    status: number;
    note: number;
    velocity: number;
    channel: number;
    timestamp: number;
}

export interface KeyInfo {
    note: number;
    noteName: string;
    octave: number;
    velocity: number;
    isPressed: boolean;
}

export interface ControlChangeInfo {
    controller: number;
    value: number;
    channel: number;
    timestamp: number;
}

export enum MidiMessageType {
    NOTE_ON = 0x90,
    NOTE_OFF = 0x80,
    CONTROL_CHANGE = 0xB0,
    PITCH_BEND = 0xE0
}

export type KeyPressHandler = (keyInfo: KeyInfo) => void;
export type ControlChangeHandler = (ccInfo: ControlChangeInfo) => void;