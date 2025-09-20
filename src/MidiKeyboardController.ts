import * as midi from 'midi';
import Speaker = require('speaker');
import chalk from 'chalk';
import { MidiMessage, KeyInfo, KeyPressHandler } from './types/midi';
import { MidiUtils } from './utils/midiUtils';
import { AudioGenerator } from './audio/AudioGenerator';

export class MidiKeyboardController {
    private input: midi.Input;
    private audioGenerator: AudioGenerator;
    private keyHandlers: Map<number, KeyPressHandler> = new Map();
    private pressedKeys: Set<number> = new Set();

    constructor() {
        this.input = new midi.Input();

        // Audio-Setup
        const speaker = new Speaker({
            channels: 2,
            bitDepth: 16,
            sampleRate: 44100
        });

        this.audioGenerator = new AudioGenerator(speaker);
        this.setupMidiInput();
    }

    // Initialisiert MIDI-Input
    private setupMidiInput(): void {
        this.input.on('message', (deltaTime: number, message: number[]) => {
            this.handleMidiMessage(message);
        });

        // Fehlerbehandlung
        this.input.on('error', (error: Error) => {
            console.error(chalk.red('❌ MIDI Fehler:'), error.message);
        });
    }

    // Verarbeitet eingehende MIDI-Messages
    private handleMidiMessage(rawMessage: number[]): void {
        const midiMsg = MidiUtils.parseMidiMessage(rawMessage);
        if (!midiMsg || !MidiUtils.isNoteEvent(midiMsg.status)) return;

        const isPressed = MidiUtils.isNoteOn(midiMsg.status, midiMsg.velocity);
        const keyInfo = MidiUtils.createKeyInfo(midiMsg, isPressed);

        // Status-Update
        if (isPressed) {
            this.pressedKeys.add(midiMsg.note);
            console.log(chalk.green(`🎹 Taste gedrückt: ${keyInfo.noteName} (Note: ${keyInfo.note}, Velocity: ${keyInfo.velocity})`));

            // Audio abspielen
            this.audioGenerator.playNote(midiMsg.note, midiMsg.velocity);
        } else {
            this.pressedKeys.delete(midiMsg.note);
            console.log(chalk.yellow(`🎹 Taste losgelassen: ${keyInfo.noteName}`));

            // Audio stoppen
            this.audioGenerator.stopNote(midiMsg.note);
        }

        // Handler für spezifische Tasten aufrufen
        this.callKeyHandler(keyInfo);
    }

    // Ruft registrierte Handler für eine Taste auf
    private callKeyHandler(keyInfo: KeyInfo): void {
        const handler = this.keyHandlers.get(keyInfo.note);
        if (handler) {
            try {
                handler(keyInfo);
            } catch (error) {
                console.error(chalk.red(`❌ Fehler in Key-Handler für Note ${keyInfo.note}:`), error);
            }
        }
    }

    // Registriert Handler für bestimmte MIDI-Noten
    public onKey(note: number, handler: KeyPressHandler): void {
        this.keyHandlers.set(note, handler);
        console.log(chalk.blue(`🔧 Handler registriert für Note ${note} (${MidiUtils.noteToName(note)})`));
    }

    // Entfernt Handler für eine Note
    public removeKeyHandler(note: number): void {
        this.keyHandlers.delete(note);
        console.log(chalk.gray(`🗑️  Handler entfernt für Note ${note}`));
    }

    // Listet verfügbare MIDI-Eingänge auf
    public listMidiInputs(): void {
        console.log(chalk.cyan('\n📋 Verfügbare MIDI-Eingänge:'));
        const portCount = this.input.getPortCount();

        if (portCount === 0) {
            console.log(chalk.red('❌ Keine MIDI-Eingänge gefunden!'));
            console.log(chalk.yellow('💡 Stellen Sie sicher, dass Ihr MIDI-Keyboard angeschlossen ist.'));
            return;
        }

        for (let i = 0; i < portCount; i++) {
            const portName = this.input.getPortName(i);
            console.log(chalk.white(`  ${i}: ${portName}`));
        }
    }

    // Verbindet mit MIDI-Eingang
    public connect(portIndex?: number): boolean {
        try {
            const portCount = this.input.getPortCount();

            if (portCount === 0) {
                console.log(chalk.red('❌ Keine MIDI-Eingänge verfügbar!'));
                return false;
            }

            // Auto-detect AKAI oder verwende ersten Port
            let selectedPort = portIndex ?? 0;

            if (portIndex === undefined) {
                // Suche nach AKAI-Gerät
                for (let i = 0; i < portCount; i++) {
                    const portName = this.input.getPortName(i).toLowerCase();
                    if (portName.includes('akai') || portName.includes('mpk')) {
                        selectedPort = i;
                        break;
                    }
                }
            }

            const portName = this.input.getPortName(selectedPort);
            this.input.openPort(selectedPort);

            console.log(chalk.green(`✅ Verbunden mit: ${portName}`));
            console.log(chalk.blue('🎹 Bereit für MIDI-Input! Drücken Sie Tasten auf Ihrem Keyboard.'));

            return true;
        } catch (error) {
            console.error(chalk.red('❌ Verbindungsfehler:'), error);
            return false;
        }
    }

    // Trennt MIDI-Verbindung
    public disconnect(): void {
        try {
            this.input.closePort();
            this.audioGenerator.stopAll();
            console.log(chalk.yellow('🔌 MIDI-Verbindung getrennt'));
        } catch (error) {
            console.error(chalk.red('❌ Fehler beim Trennen:'), error);
        }
    }

    // Zeigt aktuell gedrückte Tasten an
    public showPressedKeys(): string[] {
        return Array.from(this.pressedKeys).map(note => MidiUtils.noteToName(note));
    }

    // Cleanup beim Beenden
    public cleanup(): void {
        this.disconnect();
        this.keyHandlers.clear();
        this.pressedKeys.clear();
    }
}
