// Mission Control store

export interface SystemStatus { name: string; level: number; status: 'nominal' | 'warning' | 'critical'; unit: string; }
export interface CrewMember { id: string; name: string; role: string; status: 'active' | 'resting' | 'eva' | 'medical'; location: string; vitals: { heartRate: number; oxygen: number }; }
export interface Alert { id: string; timestamp: number; type: 'info' | 'warning' | 'error'; system: string; message: string; acknowledged: boolean; }
export interface TelemetryPoint { label: string; value: number; }

const initialSystems: Record<string, SystemStatus> = {
  oxygen: { name: 'Oxygen', level: 94, status: 'nominal', unit: '%' },
  fuel: { name: 'Fuel Reserves', level: 67, status: 'nominal', unit: '%' },
  hull: { name: 'Hull Integrity', level: 100, status: 'nominal', unit: '%' },
  comms: { name: 'Communications', level: 82, status: 'warning', unit: '%' },
  power: { name: 'Power Output', level: 88, status: 'nominal', unit: 'MW' },
  life_support: { name: 'Life Support', level: 96, status: 'nominal', unit: '%' },
};

const initialCrew: CrewMember[] = [
  { id: 'c1', name: 'Commander Chen', role: 'Mission Commander', status: 'active', location: 'Bridge', vitals: { heartRate: 72, oxygen: 98 } },
  { id: 'c2', name: 'Dr. Okonkwo', role: 'Science Officer', status: 'active', location: 'Lab Module', vitals: { heartRate: 68, oxygen: 99 } },
  { id: 'c3', name: 'Engineer Kowalski', role: 'Systems Engineer', status: 'eva', location: 'External - Hull Section 7', vitals: { heartRate: 85, oxygen: 94 } },
  { id: 'c4', name: 'Lt. Yamamoto', role: 'Pilot', status: 'resting', location: 'Quarters', vitals: { heartRate: 58, oxygen: 99 } },
];

const initialAlerts: Alert[] = [
  { id: 'a1', timestamp: Date.now() - 300000, type: 'warning', system: 'Communications', message: 'Signal degradation detected', acknowledged: false },
  { id: 'a2', timestamp: Date.now() - 600000, type: 'info', system: 'Navigation', message: 'Course correction completed', acknowledged: true },
];

class MissionStore {
  systems = $state<Record<string, SystemStatus>>({ ...initialSystems });
  crew = $state<CrewMember[]>([...initialCrew]);
  alerts = $state<Alert[]>([...initialAlerts]);
  powerHistory = $state<TelemetryPoint[]>([{ label: '00:00', value: 85 }, { label: '04:00', value: 87 }, { label: '08:00', value: 92 }, { label: '12:00', value: 88 }, { label: '16:00', value: 86 }, { label: '20:00', value: 88 }, { label: 'Now', value: 88 }]);
  oxygenHistory = $state<TelemetryPoint[]>([{ label: '00:00', value: 96 }, { label: '04:00', value: 95 }, { label: '08:00', value: 94 }, { label: '12:00', value: 95 }, { label: '16:00', value: 93 }, { label: '20:00', value: 94 }, { label: 'Now', value: 94 }]);
  missionDay = $state(142);
  missionName = $state('ARTEMIS-7');
  destination = $state('Europa Station');
  isPolling = $state(false);
  lastUpdate = $state(Date.now());

  get activeAlerts() { return this.alerts.filter(a => !a.acknowledged); }
  get activeCrew() { return this.crew.filter(c => c.status === 'active').length; }
  get crewOnEva() { return this.crew.filter(c => c.status === 'eva').length; }
  get overallStatus(): 'nominal' | 'warning' | 'critical' { const statuses = Object.values(this.systems).map(s => s.status); if (statuses.includes('critical')) return 'critical'; if (statuses.includes('warning')) return 'warning'; return 'nominal'; }

  acknowledgeAlert(id: string) { const alert = this.alerts.find(a => a.id === id); if (alert) alert.acknowledged = true; }
  acknowledgeAllAlerts() { this.alerts.forEach(a => a.acknowledged = true); }

  simulateUpdate() {
    Object.keys(this.systems).forEach(key => {
      const system = this.systems[key];
      const change = (Math.random() - 0.5) * 4;
      system.level = Math.min(100, Math.max(0, system.level + change));
      if (system.level < 20) system.status = 'critical';
      else if (system.level < 50) system.status = 'warning';
      else system.status = 'nominal';
    });
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    this.powerHistory = [...this.powerHistory.slice(1), { label: now, value: this.systems.power.level }];
    this.oxygenHistory = [...this.oxygenHistory.slice(1), { label: now, value: this.systems.oxygen.level }];
    this.crew.forEach(member => { member.vitals.heartRate = Math.round(member.vitals.heartRate + (Math.random() - 0.5) * 6); });
    if (Math.random() < 0.1) {
      this.alerts = [{ id: `a${Date.now()}`, timestamp: Date.now(), type: Math.random() < 0.7 ? 'info' : 'warning', system: ['Navigation', 'Sensors', 'Thermal'][Math.floor(Math.random() * 3)], message: ['Routine diagnostic', 'Minor fluctuation', 'Calibration recommended'][Math.floor(Math.random() * 3)], acknowledged: false }, ...this.alerts.slice(0, 9)];
    }
    this.lastUpdate = Date.now();
  }

  startPolling() { this.isPolling = true; }
  stopPolling() { this.isPolling = false; }
  getStatusBadgeColor(status: 'nominal' | 'warning' | 'critical'): 'green' | 'yellow' | 'red' { switch (status) { case 'nominal': return 'green'; case 'warning': return 'yellow'; case 'critical': return 'red'; } }
  getCrewStatusBadgeColor(status: CrewMember['status']): 'green' | 'yellow' | 'red' | 'blue' | 'gray' { switch (status) { case 'active': return 'green'; case 'resting': return 'blue'; case 'eva': return 'yellow'; case 'medical': return 'red'; default: return 'gray'; } }
  formatTimestamp(ts: number) { const diff = Date.now() - ts; const mins = Math.floor(diff / 60000); if (mins < 1) return 'Just now'; if (mins < 60) return `${mins}m ago`; return `${Math.floor(mins / 60)}h ${mins % 60}m ago`; }
}

export const missionStore = new MissionStore();
