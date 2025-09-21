#!/usr/bin/env node

import chalk from 'chalk';
import { MidiKeyboardController } from './MidiKeyboardController';
import { KeyInfo, ControlChangeInfo } from './types/midi';

console.log(chalk.blue.bold('\n🎹 MIDI Keyboard Controller gestartet\n'));

const controller = new MidiKeyboardController();

// Beispiel: Handler für spezifische Tasten registrieren
// C4 (Note 60) - Mittleres C
controller.onKey(60, (keyInfo: KeyInfo) => {
    if (keyInfo.isPressed) {
        console.log(chalk.magenta(`🎯 Spezielle Funktion für C4 ausgeführt! Velocity: ${keyInfo.velocity}`));
        // Hier könnten Sie Ihre eigene Funktionalität einfügen
    }
});

// D4 (Note 62)
controller.onKey(62, (keyInfo: KeyInfo) => {
    if (keyInfo.isPressed) {
        console.log(chalk.cyan(`🚀 D4 gedrückt - Custom Aktion ausgeführt!`));
        // Beispiel: Hier könnte eine andere Funktion aufgerufen werden
    }
});

// E4 (Note 64)
controller.onKey(64, (keyInfo: KeyInfo) => {
    if (keyInfo.isPressed) {
        console.log(chalk.green(`✨ E4 Taste - Noch eine Custom Funktion!`));
        // Ihre eigene Logik hier...
    }
});

// Handler für die Drehregler (AKAI MPK Mini Standard CCs)
// Knob 1 (normalerweise CC1)
controller.onControlChange(1, (ccInfo: ControlChangeInfo) => {
    console.log(chalk.magenta(`🎛️  Knob 1 - Volume Control: ${ccInfo.value}/127`));
    // Beispiel: Lautstärke anpassen
    // audioSystem.setVolume(ccInfo.value / 127);
});

// Knob 2 (normalerweise CC2)
controller.onControlChange(2, (ccInfo: ControlChangeInfo) => {
    const percent = Math.round((ccInfo.value / 127) * 100);
    console.log(chalk.cyan(`🎛️  Knob 2 - Filter Cutoff: ${percent}%`));
    // Beispiel: Filter-Parameter anpassen
});

// Knob 3 (normalerweise CC3)
controller.onControlChange(3, (ccInfo: ControlChangeInfo) => {
    console.log(chalk.yellow(`🎛️  Knob 3 - Resonance: ${ccInfo.value}`));
    // Beispiel: Resonanz-Parameter
});

// Knob 4 (normalerweise CC4)
controller.onControlChange(4, (ccInfo: ControlChangeInfo) => {
    const normalized = ccInfo.value / 127;
    console.log(chalk.green(`🎛️  Knob 4 - Pan: ${normalized > 0.5 ? 'Right' : 'Left'} (${Math.abs(0.5 - normalized).toFixed(2)})`));
    // Beispiel: Pan-Position
});

// Knob 5 (normalerweise CC5)
controller.onControlChange(5, (ccInfo: ControlChangeInfo) => {
    console.log(chalk.blue(`🎛️  Knob 5 - Attack: ${ccInfo.value}/127`));
    // Beispiel: ADSR Attack-Parameter
});

// Knob 6 (normalerweise CC6)
controller.onControlChange(6, (ccInfo: ControlChangeInfo) => {
    console.log(chalk.magenta(`🎛️  Knob 6 - Decay: ${ccInfo.value}/127`));
    // Beispiel: ADSR Decay-Parameter
});

// Knob 7 (normalerweise CC7 - Master Volume)
controller.onControlChange(7, (ccInfo: ControlChangeInfo) => {
    const percent = Math.round((ccInfo.value / 127) * 100);
    console.log(chalk.red(`🎛️  Knob 7 - Master Volume: ${percent}%`));
    // Beispiel: Master-Lautstärke
});

// Knob 8 (normalerweise CC8)
controller.onControlChange(8, (ccInfo: ControlChangeInfo) => {
    console.log(chalk.gray(`🎛️  Knob 8 - Sustain: ${ccInfo.value}/127`));
    // Beispiel: ADSR Sustain-Parameter
});

// MIDI-Eingänge auflisten
controller.listMidiInputs();

// Mit MIDI-Keyboard verbinden
if (controller.connect()) {
    console.log(chalk.green('\n✅ Erfolgreiche Verbindung! Testen Sie Ihr Keyboard.'));
    console.log(chalk.yellow('💡 Drücken Sie C4, D4 oder E4 für spezielle Aktionen.'));
    console.log(chalk.blue('🎛️  Drehen Sie die Knöpfe 1-8 für Controller-Events.'));
    console.log(chalk.gray('⏹️  Drücken Sie Ctrl+C zum Beenden.\n'));

    // Zeige aktuelle Controller-Werte alle 10 Sekunden (optional)
    setInterval(() => {
        const ccValues = controller.getAllControllerValues();
        if (ccValues.size > 0) {
            console.log(chalk.dim('\n📊 Aktuelle Controller-Werte:'));
            ccValues.forEach((value, ccNumber) => {
                const percent = Math.round((value / 127) * 100);
                console.log(chalk.dim(`   CC${ccNumber}: ${value}/127 (${percent}%)`));
            });
        }
    }, 10000);

} else {
    console.log(chalk.red('\n❌ Verbindung fehlgeschlagen!'));
    console.log(chalk.yellow('💡 Überprüfungen:'));
    console.log(chalk.white('   1. Ist das MIDI-Keyboard angeschlossen?'));
    console.log(chalk.white('   2. Läuft: aconnect -l (zeigt MIDI-Geräte)'));
    console.log(chalk.white('   3. Sind die erforderlichen Pakete installiert?'));
    process.exit(1);
}

// Graceful shutdown
process.on('SIGINT', () => {
    console.log(chalk.yellow('\n\n🛑 Beende Anwendung...'));
    controller.cleanup();
    console.log(chalk.green('✅ Cleanup abgeschlossen. Auf Wiedersehen!'));
    process.exit(0);
});

process.on('SIGTERM', () => {
    controller.cleanup();
    process.exit(0);
});

// Keep process alive
process.stdin.resume();