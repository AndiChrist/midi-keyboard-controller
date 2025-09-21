import { MidiMessage, KeyInfo, MidiMessageType, ControlChangeInfo } from '../types/midi';

// Note-Namen Mapping
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Standard AKAI MPK Mini CC-Mappings (kann variieren je nach Firmware)
const AKAI_KNOB_CC_MAP = {
    1: 'Knob 1',
    2: 'Knob 2',
    3: 'Knob 3',
    4: 'Knob 4',
    5: 'Knob 5',
    6: 'Knob 6',
    7: 'Knob 7',
    8: 'Knob 8'
};

export class MidiUtils {
    // Parsed MIDI-Message aus Raw-Bytes
    static parseMidiMessage(message: number[]): MidiMessage | null {
        if (message.length < 3) return null;

        const [status, note, velocity] = message;
        const channel = status & 0x0F;

        return {
            status,
            note,
            velocity,
            channel,
            timestamp: Date.now()
        };
    }

    // Parsed Control Change Message
    static parseControlChange(message: number[]): ControlChangeInfo | null {
        if (message.length < 3) return null;

        const [status, controller, value] = message;
        const channel = status & 0x0F;

        return {
            controller,
            value,
            channel,
            timestamp: Date.now()
        };
    }

    // Konvertiert MIDI-Note zu lesbarem Namen
    static noteToName(note: number): string {
        const octave = Math.floor(note / 12) - 1;
        const noteName = NOTE_NAMES[note % 12];
        return `${noteName}${octave}`;
    }

    // Gibt den Namen des AKAI Knobs zurück
    static getKnobName(ccNumber: number): string {
        return AKAI_KNOB_CC_MAP[ccNumber as keyof typeof AKAI_KNOB_CC_MAP] || `CC ${ccNumber}`;
    }

    // Erstellt KeyInfo aus MIDI-Message
    static createKeyInfo(midiMsg: MidiMessage, isPressed: boolean): KeyInfo {
        return {
            note: midiMsg.note,
            noteName: this.noteToName(midiMsg.note),
            octave: Math.floor(midiMsg.note / 12) - 1,
            velocity: midiMsg.velocity,
            isPressed
        };
    }

    // Prüft ob Message ein Note-Event ist
    static isNoteEvent(status: number): boolean {
        const messageType = status & 0xF0;
        return messageType === MidiMessageType.NOTE_ON || messageType === MidiMessageType.NOTE_OFF;
    }

    // Prüft ob Message ein Control Change Event ist
    static isControlChange(status: number): boolean {
        const messageType = status & 0xF0;
        return messageType === MidiMessageType.CONTROL_CHANGE;
    }

    // Prüft ob es ein Note-On Event ist (mit Velocity > 0)
    static isNoteOn(status: number, velocity: number): boolean {
        const messageType = status & 0xF0;
        return messageType === MidiMessageType.NOTE_ON && velocity > 0;
    }

    // Prüft ob es ein Note-Off Event ist
    static isNoteOff(status: number, velocity: number): boolean {
        const messageType = status & 0xF0;
        return messageType === MidiMessageType.NOTE_OFF ||
            (messageType === MidiMessageType.NOTE_ON && velocity === 0);
    }

    // Konvertiert CC-Wert (0-127) zu Prozent
    static ccValueToPercent(value: number): number {
        return Math.round((value / 127) * 100);
    }

    // Konvertiert Prozent zu CC-Wert (0-127)
    static percentToCcValue(percent: number): number {
        return Math.round((percent / 100) * 127);
    }
}