#!/usr/bin/env node

import chalk from 'chalk';
import { MidiKeyboardController } from './MidiKeyboardController';
import { KeyInfo } from './types/midi';

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

// MIDI-Eingänge auflisten
controller.listMidiInputs();

// Mit MIDI-Keyboard verbinden
if (controller.connect()) {
  console.log(chalk.green('\n✅ Erfolgreiche Verbindung! Testen Sie Ihr Keyboard.'));
  console.log(chalk.yellow('💡 Drücken Sie C4, D4 oder E4 für spezielle Aktionen.'));
  console.log(chalk.gray('⏹️  Drücken Sie Ctrl+C zum Beenden.\n'));
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