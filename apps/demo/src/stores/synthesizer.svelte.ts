// Synthesizer Lab store

export type WaveformType = 'sine' | 'saw' | 'square' | 'triangle';
export type FilterType = 'lp12' | 'lp24' | 'hp12' | 'bp';
export type EffectName = 'reverb' | 'delay' | 'chorus' | 'distortion';

export interface Preset { id: string; name: string; category: 'Bass' | 'Lead' | 'Pad' | 'FX' | 'Keys'; author: string; rating: number; cpu: 'Low' | 'Medium' | 'High'; }
export interface Effect { id: string; name: string; type: string; settings: string; enabled: boolean; }

export const presets: Preset[] = [
  { id: 'p1', name: 'Blade Runner Pad', category: 'Pad', author: 'Vangelis', rating: 4.9, cpu: 'Medium' },
  { id: 'p2', name: '303 Acid Bass', category: 'Bass', author: 'Roland', rating: 4.8, cpu: 'Low' },
  { id: 'p3', name: 'Jump Brass', category: 'Lead', author: 'Oberheim', rating: 4.5, cpu: 'Low' },
  { id: 'p4', name: 'Stranger Things', category: 'Pad', author: 'Moog', rating: 4.7, cpu: 'High' },
  { id: 'p5', name: 'Sub Drop', category: 'FX', author: 'Community', rating: 4.2, cpu: 'Medium' },
  { id: 'p6', name: 'Classic Rhodes', category: 'Keys', author: 'Fender', rating: 4.6, cpu: 'Low' },
];

export const effectsChain: Effect[] = [
  { id: 'e1', name: 'Reverb', type: 'Hall', settings: '2.5s decay', enabled: true },
  { id: 'e2', name: 'Delay', type: 'Sync', settings: '1/4 note, 40%', enabled: true },
  { id: 'e3', name: 'Chorus', type: 'Ensemble', settings: 'Slow, wide', enabled: false },
  { id: 'e4', name: 'Distortion', type: 'Tube', settings: 'Warm', enabled: false },
];

class SynthesizerStore {
  oscillator = $state({ waveform: 'saw' as WaveformType, octave: 0, detune: 0, sync: false });
  filter = $state({ type: 'lp24' as FilterType, cutoff: 1000, resonance: 25, envAmount: 50 });
  envelope = $state({ attack: 10, decay: 100, sustain: 70, release: 300 });
  master = $state({ volume: 80, pan: 0 });
  effects = $state({ reverb: { enabled: true }, delay: { enabled: true }, chorus: { enabled: false }, distortion: { enabled: false } });
  bypassed = $state(false);
  saveModalOpen = $state(false);
  clippingModalOpen = $state(false);
  clippingAmount = $state(0);
  selectedPresetId = $state('');
  patchName = $state('');
  patchCategory = $state('pad');
  patchNotes = $state('');
  patchPublic = $state(false);

  loadPreset(id: string) { console.log('Loading preset:', id); this.selectedPresetId = id; }
  savePatch() { console.log('Saving patch'); this.saveModalOpen = false; }
  checkClipping() { if (this.master.volume > 90) { this.clippingAmount = (this.master.volume - 90) * 0.5; this.clippingModalOpen = true; } }
  normalizeVolume() { this.master.volume = 80; this.clippingModalOpen = false; }
  toggleEffect(effect: EffectName) { this.effects[effect].enabled = !this.effects[effect].enabled; }
  randomize() {
    const waveforms: WaveformType[] = ['sine', 'saw', 'square', 'triangle'];
    this.oscillator.waveform = waveforms[Math.floor(Math.random() * 4)];
    this.filter.cutoff = Math.floor(Math.random() * 19980) + 20;
    this.filter.resonance = Math.floor(Math.random() * 100);
    this.envelope.attack = Math.floor(Math.random() * 1000);
    this.envelope.decay = Math.floor(Math.random() * 1000);
    this.envelope.sustain = Math.floor(Math.random() * 100);
    this.envelope.release = Math.floor(Math.random() * 2000);
  }
}

export const synthStore = new SynthesizerStore();
