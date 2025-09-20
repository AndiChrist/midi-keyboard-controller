import { Writable } from 'stream';

export class AudioGenerator {
  private sampleRate = 44100;
  private channels = 2;
  private bitDepth = 16;
  private activeTones: Map<number, NodeJS.Timeout> = new Map();

  constructor(private speaker: Writable) {}

  // Konvertiert MIDI-Note zu Frequenz
  private noteToFrequency(note: number): number {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  // Generiert Sinus-Wave für eine bestimmte Frequenz
  private generateSineWave(frequency: number, duration: number, volume: number = 0.3): Buffer {
    const samples = Math.floor(this.sampleRate * duration);
    const buffer = Buffer.allocUnsafe(samples * this.channels * (this.bitDepth / 8));
    
    for (let i = 0; i < samples; i++) {
      const sample = Math.sin(2 * Math.PI * frequency * i / this.sampleRate) * volume * 32767;
      const intSample = Math.floor(sample);
      
      // Stereo (gleicher Wert für beide Kanäle)
      buffer.writeInt16LE(intSample, i * 4);     // Left channel
      buffer.writeInt16LE(intSample, i * 4 + 2); // Right channel
    }
    
    return buffer;
  }

  // Spielt einen Ton für eine MIDI-Note
  public playNote(note: number, velocity: number, duration: number = 0.5): void {
    const frequency = this.noteToFrequency(note);
    const volume = velocity / 127; // Velocity normalisieren (0-1)
    
    console.log(`🎵 Spiele Note ${note} (${frequency.toFixed(1)}Hz) mit Velocity ${velocity}`);
    
    // Stoppe vorherigen Ton falls noch aktiv
    this.stopNote(note);
    
    // Generiere und spiele Audio
    const audioBuffer = this.generateSineWave(frequency, duration, volume);
    this.speaker.write(audioBuffer);
    
    // Automatisch stoppen nach der angegebenen Dauer
    const timeout = setTimeout(() => {
      this.activeTones.delete(note);
    }, duration * 1000);
    
    this.activeTones.set(note, timeout);
  }

  // Stoppt einen bestimmten Ton
  public stopNote(note: number): void {
    const timeout = this.activeTones.get(note);
    if (timeout) {
      clearTimeout(timeout);
      this.activeTones.delete(note);
    }
  }

  // Stoppt alle aktiven Töne
  public stopAll(): void {
    this.activeTones.forEach((timeout) => clearTimeout(timeout));
    this.activeTones.clear();
  }
}