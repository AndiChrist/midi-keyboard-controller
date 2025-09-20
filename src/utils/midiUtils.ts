import { MidiMessage, KeyInfo, MidiMessageType } from '../types/midi';

// Note-Namen Mapping
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

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

  // Konvertiert MIDI-Note zu lesbarem Namen
  static noteToName(note: number): string {
    const octave = Math.floor(note / 12) - 1;
    const noteName = NOTE_NAMES[note % 12];
    return `${noteName}${octave}`;
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
}