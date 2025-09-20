# MIDI Keyboard Controller

Ein TypeScript-Projekt zum Empfangen von MIDI-Events von einem AKAI MPK Mini (oder anderen MIDI-Keyboards) unter Ubuntu Linux.

## 🚀 Features

- **MIDI-Event Empfang**: Erkennt Tastendruck und -loslassen
- **Audio-Wiedergabe**: Spielt Töne basierend auf gedrückten Tasten
- **Custom Handler**: Registriere eigene Funktionen für spezifische Tasten
- **Farbige Konsolen-Ausgabe**: Übersichtliche Logging-Ausgaben
- **Auto-Detection**: Findet automatisch AKAI-Geräte

## 📋 Voraussetzungen

### Ubuntu System-Pakete:
```bash
sudo apt update
sudo apt install alsa-utils build-essential libasound2-dev
```

### MIDI-Device prüfen:
```bash
aconnect -l
# oder
amidi -l
```

### Node.js (Version 16+):
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 🔧 Installation

1. **Projekt-Verzeichnis erstellen:**
```bash
mkdir midi-keyboard-controller
cd midi-keyboard-controller
```

2. **Dateien kopieren** (alle Artifacts in die entsprechenden Verzeichnisse)

3. **Dependencies installieren:**
```bash
npm install
```

4. **TypeScript kompilieren:**
```bash
npm run build
```

## 🎹 Verwendung

### Entwicklungsmodus:
```bash
npm run dev
```

### Production-Modus:
```bash
npm start
```

### Watch-Modus (automatisches Kompilieren):
```bash
npm run watch
# In anderem Terminal:
npm start
```

## 🎯 Custom Handler hinzufügen

```typescript
// In src/index.ts
controller.onKey(60, (keyInfo: KeyInfo) => {
  if (keyInfo.isPressed) {
    console.log('C4 gedrückt - Meine Custom Funktion!');
    // Ihre Logik hier...
  }
});
```

### MIDI-Noten Referenz:
- C4 (Mittleres C): Note 60
- D4: Note 62
- E4: Note 64
- F4: Note 65
- G4: Note 67
- A4: Note 69
- B4: Note 71

## 🔍 Troubleshooting

### Keine MIDI-Geräte gefunden:
```bash
# ALSA MIDI-Ports auflisten
aconnect -l

# Raw MIDI-Geräte anzeigen
amidi -l

# ALSA-Services neustarten
sudo systemctl restart alsa-state
```

### Permissions-Probleme:
```bash
# User zur Audio-Gruppe hinzufügen
sudo usermod -a -G audio $USER
# Neuanmeldung erforderlich
```

### Build-Fehler:
```bash
# Native Dependencies neu kompilieren
npm rebuild

# Node-gyp global installieren
sudo npm install -g node-gyp
```

## 📁 Projekt-Struktur

```
midi-keyboard-controller/
├── src/
│   ├── types/
│   │   └── midi.ts           # TypeScript Definitionen
│   ├── utils/
│   │   └── midiUtils.ts      # MIDI Utility-Funktionen
│   ├── audio/
│   │   └── AudioGenerator.ts # Audio-Synthese
│   ├── MidiKeyboardController.ts # Haupt-Controller
│   └── index.ts              # Entry Point
├── dist/                     # Kompilierte JavaScript-Dateien
├── package.json
├── tsconfig.json
└── README.md
```

## 🎵 Nächste Schritte

1. **Erweiterte Audio-Synthese**: Verschiedene Wellenformen (Sawtooth, Square, etc.)
2. **MIDI-Controller**: Support für Knobs und Fader
3. **Preset-System**: Speichern und Laden von Key-Mappings
4. **Web-Interface**: Browser-basierte Konfiguration
5. **Externe APIs**: Integration mit anderen Services

## 📝 Lizenz

MIT License