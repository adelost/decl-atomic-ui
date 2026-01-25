// Skydive Logger store

export interface Jump {
  id: string;
  date: string;
  location: string;
  dropzone: string;
  altitude: number;
  type: 'Solo' | 'Tandem' | 'AFF' | 'Formation' | 'Wingsuit' | 'Tracking';
  aircraft: string;
  freefallTime: number;
  canopyTime: number;
  exitType: 'Stable' | 'Backflip' | 'Gainer' | 'Tracking';
  weather: 'Clear' | 'Cloudy' | 'Windy' | 'Overcast';
  notes: string;
}

export interface GearCheck { id: string; name: string; checked: boolean; critical: boolean; }

const jumpLog: Jump[] = [
  { id: '1', date: '2024-01-15', location: 'Sweden', dropzone: 'Skåne Fallskärm', altitude: 4000, type: 'Solo', aircraft: 'Cessna 208', freefallTime: 60, canopyTime: 240, exitType: 'Stable', weather: 'Clear', notes: 'Perfect conditions.' },
  { id: '2', date: '2024-01-12', location: 'Sweden', dropzone: 'Gothenburg Skydive', altitude: 4200, type: 'Formation', aircraft: 'Twin Otter', freefallTime: 65, canopyTime: 220, exitType: 'Tracking', weather: 'Cloudy', notes: '4-way formation.' },
  { id: '3', date: '2024-01-08', location: 'Spain', dropzone: 'Skydive Empuriabrava', altitude: 4500, type: 'Wingsuit', aircraft: 'Casa 212', freefallTime: 120, canopyTime: 180, exitType: 'Stable', weather: 'Clear', notes: 'First wingsuit!' },
];

const defaultGear: GearCheck[] = [
  { id: 'g1', name: 'Main canopy packed', checked: false, critical: true },
  { id: 'g2', name: 'Reserve packed', checked: false, critical: true },
  { id: 'g3', name: 'AAD activated', checked: false, critical: true },
  { id: 'g4', name: 'Chest strap secured', checked: false, critical: true },
  { id: 'g5', name: 'Leg straps secured', checked: false, critical: true },
  { id: 'g6', name: 'Handles checked', checked: false, critical: true },
  { id: 'g7', name: 'Altimeter working', checked: false, critical: true },
  { id: 'g8', name: 'Helmet secured', checked: false, critical: false },
  { id: 'g9', name: 'Goggles clean', checked: false, critical: false },
];

class SkydiveStore {
  jumps = $state<Jump[]>([...jumpLog]);
  gearChecklist = $state<GearCheck[]>([...defaultGear]);
  addJumpModalOpen = $state(false);
  newJump = $state<Partial<Jump>>({ date: new Date().toISOString().split('T')[0], type: 'Solo', exitType: 'Stable', weather: 'Clear', altitude: 4000, freefallTime: 60, canopyTime: 240 });

  get totalJumps() { return this.jumps.length; }
  get totalFreefallTime() { return this.jumps.reduce((sum, j) => sum + j.freefallTime, 0); }
  get totalCanopyTime() { return this.jumps.reduce((sum, j) => sum + j.canopyTime, 0); }
  get averageAltitude() { return this.jumps.length ? Math.round(this.jumps.reduce((sum, j) => sum + j.altitude, 0) / this.jumps.length) : 0; }
  get gearReadyPercent() { return Math.round((this.gearChecklist.filter(g => g.checked).length / this.gearChecklist.length) * 100); }
  get criticalItemsReady() { return this.gearChecklist.filter(g => g.critical).every(g => g.checked); }

  jumpTypeOptions = [{ value: 'Solo', label: 'Solo' }, { value: 'Tandem', label: 'Tandem' }, { value: 'AFF', label: 'AFF' }, { value: 'Formation', label: 'Formation' }, { value: 'Wingsuit', label: 'Wingsuit' }, { value: 'Tracking', label: 'Tracking' }];
  exitTypeOptions = [{ value: 'Stable', label: 'Stable' }, { value: 'Backflip', label: 'Backflip' }, { value: 'Gainer', label: 'Gainer' }, { value: 'Tracking', label: 'Tracking' }];
  weatherOptions = [{ value: 'Clear', label: 'Clear' }, { value: 'Cloudy', label: 'Cloudy' }, { value: 'Windy', label: 'Windy' }, { value: 'Overcast', label: 'Overcast' }];

  openAddJumpModal() { this.addJumpModalOpen = true; }
  closeAddJumpModal() { this.addJumpModalOpen = false; }
  addJump(data: Record<string, unknown>) {
    const jump: Jump = { id: String(Date.now()), date: String(data.date || ''), location: String(data.location || ''), dropzone: String(data.dropzone || ''), altitude: Number(data.altitude || 4000), type: (data.type as Jump['type']) || 'Solo', aircraft: String(data.aircraft || ''), freefallTime: Number(data.freefallTime || 60), canopyTime: Number(data.canopyTime || 240), exitType: (data.exitType as Jump['exitType']) || 'Stable', weather: (data.weather as Jump['weather']) || 'Clear', notes: String(data.notes || '') };
    this.jumps = [jump, ...this.jumps];
    this.closeAddJumpModal();
  }
  toggleGearItem(id: string) { const item = this.gearChecklist.find(g => g.id === id); if (item) item.checked = !item.checked; }
  resetGearChecklist() { this.gearChecklist.forEach(g => g.checked = false); }
  formatTime(seconds: number) { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`; }
}

export const skydiveStore = new SkydiveStore();
