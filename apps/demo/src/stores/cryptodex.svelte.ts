// Crypto-Dex store

export interface Cryptid {
  id: string;
  name: string;
  type: 'Beast' | 'Sea' | 'Air' | 'Humanoid' | 'Reptile';
  region: string;
  description: string;
  stats: { stealth: number; strength: number; speed: number; intelligence: number };
  status: 'Confirmed' | 'Unconfirmed' | 'Legendary' | 'Hoax';
  sightings: number;
  lastSeen: string;
}

const cryptids: Cryptid[] = [
  // Folklore Classics
  { id: 'bigfoot', name: 'Bigfoot', type: 'Humanoid', region: 'Pacific Northwest, USA', description: 'Large, hairy, bipedal humanoid. Known for distinctive footprints and elusive behavior in dense forests.', stats: { stealth: 90, strength: 85, speed: 60, intelligence: 70 }, status: 'Unconfirmed', sightings: 10000, lastSeen: '2024-01-15' },
  { id: 'kraken', name: 'Kraken', type: 'Sea', region: 'Scandinavian Waters', description: 'Colossal cephalopod capable of dragging ships to the depths. Tentacles span hundreds of meters.', stats: { stealth: 70, strength: 100, speed: 40, intelligence: 50 }, status: 'Legendary', sightings: 847, lastSeen: '1930-06-22' },
  { id: 'mothman', name: 'Mothman', type: 'Air', region: 'Point Pleasant, West Virginia', description: 'Winged humanoid with glowing red eyes. Sightings often precede disasters.', stats: { stealth: 85, strength: 50, speed: 95, intelligence: 80 }, status: 'Unconfirmed', sightings: 127, lastSeen: '2017-09-14' },
  { id: 'chupacabra', name: 'Chupacabra', type: 'Beast', region: 'Puerto Rico / Latin America', description: 'Spiny-backed creature that drains livestock of blood. Razor-sharp fangs.', stats: { stealth: 80, strength: 40, speed: 75, intelligence: 30 }, status: 'Unconfirmed', sightings: 2400, lastSeen: '2023-08-03' },
  { id: 'nessie', name: 'Loch Ness Monster', type: 'Sea', region: 'Scottish Highlands', description: 'Long-necked aquatic creature. Possible plesiosaur survivor from the Mesozoic era.', stats: { stealth: 95, strength: 70, speed: 50, intelligence: 60 }, status: 'Hoax', sightings: 1093, lastSeen: '2024-01-02' },
  { id: 'yeti', name: 'Yeti', type: 'Humanoid', region: 'Himalayan Mountains', description: 'The Abominable Snowman. Adapted to extreme cold at high altitudes.', stats: { stealth: 85, strength: 90, speed: 55, intelligence: 65 }, status: 'Unconfirmed', sightings: 560, lastSeen: '2019-04-11' },
  { id: 'jersey-devil', name: 'Jersey Devil', type: 'Air', region: 'Pine Barrens, New Jersey', description: 'Winged biped with hooves and forked tail. Born of a curse in 1735.', stats: { stealth: 75, strength: 45, speed: 85, intelligence: 40 }, status: 'Legendary', sightings: 2000, lastSeen: '2015-10-31' },
  { id: 'wendigo', name: 'Wendigo', type: 'Humanoid', region: 'Great Lakes / Canada', description: 'Malevolent spirit of winter hunger. Those who taste human flesh become one.', stats: { stealth: 100, strength: 75, speed: 90, intelligence: 85 }, status: 'Legendary', sightings: 89, lastSeen: '2021-12-21' },
  // Additional Cryptids
  { id: 'thunderbird', name: 'Thunderbird', type: 'Air', region: 'North American Plains', description: 'Enormous avian creature from Native American legend. Wingspan exceeds 20 feet.', stats: { stealth: 60, strength: 80, speed: 100, intelligence: 55 }, status: 'Legendary', sightings: 340, lastSeen: '2018-07-04' },
  { id: 'mokele-mbembe', name: 'Mokele-mbembe', type: 'Sea', region: 'Congo River Basin', description: 'Living dinosaur of African swamps. Resembles a sauropod. Extremely territorial.', stats: { stealth: 65, strength: 95, speed: 35, intelligence: 40 }, status: 'Unconfirmed', sightings: 156, lastSeen: '2020-03-18' },
  { id: 'fresno-nightcrawler', name: 'Fresno Nightcrawler', type: 'Humanoid', region: 'Fresno, California', description: 'Bizarre bipedal entity with no upper body. Captured on security cameras.', stats: { stealth: 95, strength: 10, speed: 50, intelligence: 20 }, status: 'Unconfirmed', sightings: 12, lastSeen: '2011-03-28' },
  { id: 'bunyip', name: 'Bunyip', type: 'Sea', region: 'Australian Outback', description: 'Amphibious creature lurking in billabongs. Part seal, part dog, all nightmare.', stats: { stealth: 80, strength: 70, speed: 45, intelligence: 35 }, status: 'Legendary', sightings: 289, lastSeen: '2019-11-02' },
  // Sci-Fi Inspired (Generic Names)
  { id: 'desert-titan', name: 'Desert Titan', type: 'Beast', region: 'Deep Desert Regions', description: 'Colossal annelid dwelling beneath sand dunes. Attracted to rhythmic vibrations.', stats: { stealth: 40, strength: 100, speed: 80, intelligence: 25 }, status: 'Confirmed', sightings: 47, lastSeen: '2024-01-10' },
  { id: 'xeno-stalker', name: 'Xeno-Stalker', type: 'Reptile', region: 'Unknown Origin', description: 'Parasitic organism with acidic blood. Extremely adaptive. Avoid at all costs.', stats: { stealth: 95, strength: 85, speed: 90, intelligence: 75 }, status: 'Confirmed', sightings: 8, lastSeen: '2023-12-25' },
];

class CryptodexStore {
  searchQuery = $state('');
  selectedType = $state<string>('all');
  selectedStatus = $state<string>('all');
  selectedCryptid = $state<Cryptid | null>(null);
  detailModalOpen = $state(false);

  get filteredCryptids(): Cryptid[] {
    return cryptids.filter((c) => {
      const matchesSearch = this.searchQuery === '' || c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || c.region.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.selectedType === 'all' || c.type === this.selectedType;
      const matchesStatus = this.selectedStatus === 'all' || c.status === this.selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  typeOptions = [{ value: 'all', label: 'All Types' }, { value: 'Beast', label: 'Beast' }, { value: 'Sea', label: 'Sea Creature' }, { value: 'Air', label: 'Flying' }, { value: 'Humanoid', label: 'Humanoid' }, { value: 'Reptile', label: 'Reptile' }];
  statusOptions = [{ value: 'all', label: 'All Status' }, { value: 'Confirmed', label: 'Confirmed' }, { value: 'Unconfirmed', label: 'Unconfirmed' }, { value: 'Legendary', label: 'Legendary' }, { value: 'Hoax', label: 'Hoax' }];

  openDetail(cryptid: Cryptid) { this.selectedCryptid = cryptid; this.detailModalOpen = true; }
  closeDetail() { this.detailModalOpen = false; this.selectedCryptid = null; }
  setSearch(query: string) { this.searchQuery = query; }
  setType(type: string) { this.selectedType = type; }
  setStatus(status: string) { this.selectedStatus = status; }
}

export const cryptodexStore = new CryptodexStore();
