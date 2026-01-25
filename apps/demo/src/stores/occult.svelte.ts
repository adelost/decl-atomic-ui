// Occult Archive store

export interface ForbiddenText {
  id: string;
  name: string;
  author: string;
  origin: string;
  year: string;
  sanityLoss: number;
  dangerLevel: 'Safe' | 'Caution' | 'Dangerous' | 'Forbidden';
  description: string;
  fragmentRead: boolean;
  contents: string[];
}

const forbiddenTexts: ForbiddenText[] = [
  // Lovecraftian Classics
  { id: 'necronomicon', name: 'Necronomicon', author: 'Abdul Alhazred', origin: 'Damascus', year: '730 AD', sanityLoss: 10, dangerLevel: 'Forbidden', description: 'The Book of Dead Names. Contains incantations to summon the Old Ones.', fragmentRead: false, contents: ['That is not dead which can eternal lie', 'And with strange aeons even death may die', 'Yog-Sothoth knows the gate. Yog-Sothoth is the gate.'] },
  { id: 'book-of-eibon', name: 'Book of Eibon', author: 'Eibon of Mhu Thulan', origin: 'Hyperborea', year: 'Prehistoric', sanityLoss: 7, dangerLevel: 'Dangerous', description: 'Ancient sorcerous text from the wizard Eibon, servant of Tsathoggua.', fragmentRead: false, contents: ['From Yuggoth they came, the Mi-Go', 'In the vaults beneath Mount Voormithadreth...'] },
  { id: 'king-in-yellow', name: 'The King in Yellow', author: 'Unknown', origin: 'Carcosa', year: 'Unknown', sanityLoss: 8, dangerLevel: 'Forbidden', description: 'A play in two acts. Reading the second act causes irreversible madness.', fragmentRead: false, contents: ['Have you seen the Yellow Sign?', 'Strange is the night where black stars rise', 'Along the shore the cloud waves break'] },
  { id: 'pnakotic-manuscripts', name: 'Pnakotic Manuscripts', author: 'Great Race of Yith', origin: 'Pnakotus', year: 'Pre-human', sanityLoss: 6, dangerLevel: 'Dangerous', description: 'Records of Earth history before mankind. Written by minds from the future past.', fragmentRead: false, contents: ['The Great Race came from an era beyond conception', 'They traded minds across the gulfs of time'] },
  { id: 'r-lyeh-text', name: "R'lyeh Text", author: 'Unknown Deep One', origin: "R'lyeh", year: 'Before time', sanityLoss: 9, dangerLevel: 'Forbidden', description: 'Describes the sunken city and the dreaming god within.', fragmentRead: false, contents: ["Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn", "In his house at R'lyeh, dead Cthulhu waits dreaming"] },
  // Historical Grimoires
  { id: 'de-vermis-mysteriis', name: 'De Vermis Mysteriis', author: 'Ludvig Prinn', origin: 'Flanders', year: '1542 AD', sanityLoss: 6, dangerLevel: 'Dangerous', description: 'Mysteries of the Worm. Prinn wrote it from a prison cell before his burning.', fragmentRead: false, contents: ['The worms that are beneath shall rise', 'Saracen secrets learned in Syrian tombs...'] },
  { id: 'cultes-des-goules', name: 'Cultes des Goules', author: "Comte d'Erlette", origin: 'France', year: '1702 AD', sanityLoss: 5, dangerLevel: 'Dangerous', description: 'A treatise on grave-robbing and communion with the dead.', fragmentRead: false, contents: ['The ghouls taught me their ways in the charnel grounds', 'To eat of the dead is to know their secrets'] },
  { id: 'unaussprechlichen-kulten', name: 'Unaussprechlichen Kulten', author: 'Friedrich von Junzt', origin: 'Germany', year: '1839 AD', sanityLoss: 5, dangerLevel: 'Caution', description: 'Nameless Cults. Von Junzt vanished after completing this work.', fragmentRead: false, contents: ['In the mountains of Hungary, I found the Black Stone', 'The cult of Ghatanothoa persists in hidden places'] },
  // Safer Reference Texts
  { id: 'seven-cryptical-books', name: 'Seven Cryptical Books of Hsan', author: 'Hsan the Greater', origin: 'Ancient China', year: 'Unknown', sanityLoss: 3, dangerLevel: 'Caution', description: 'Contains protective wards and binding rituals. Essential for defense.', fragmentRead: false, contents: ['The Elder Sign traced thus shall bar the way', 'Against the darkness, light the candles five'] },
  { id: 'sussex-manuscript', name: 'Sussex Manuscript', author: 'Unknown Monk', origin: 'England', year: '1100 AD', sanityLoss: 2, dangerLevel: 'Safe', description: 'A fragmentary Latin translation of older works. Heavily censored.', fragmentRead: false, contents: ['The stars must be right...', 'When the ice recedes, the cities shall rise'] },
  { id: 'celaeno-fragments', name: 'Celaeno Fragments', author: 'Dr. Laban Shrewsbury', origin: 'Celaeno Library', year: '1915 AD', sanityLoss: 4, dangerLevel: 'Caution', description: 'Notes transcribed from the library of the Great Old Ones themselves.', fragmentRead: false, contents: ['The library exists between the stars', 'Hastur dwells near Aldebaran, in the Hyades'] },
  { id: 'liber-ivonis', name: 'Liber Ivonis', author: 'Caius Phillipus Faber', origin: 'Rome', year: '900 AD', sanityLoss: 6, dangerLevel: 'Dangerous', description: 'Latin translation of the Book of Eibon. More accessible, equally dangerous.', fragmentRead: false, contents: ['Tsathoggua slumbers in N\u0027kai', 'The formless spawn serve the Sleeper'] },
];

class OccultStore {
  maxSanity = 100;
  currentSanity = $state(100);
  texts = $state<ForbiddenText[]>([...forbiddenTexts]);
  selectedText = $state<ForbiddenText | null>(null);
  readingModalOpen = $state(false);
  warningModalOpen = $state(false);
  pendingText = $state<ForbiddenText | null>(null);
  dangerFilter = $state<string>('all');
  searchQuery = $state('');

  get sanityPercent() { return Math.round((this.currentSanity / this.maxSanity) * 100); }
  get sanityStatus(): 'stable' | 'shaken' | 'disturbed' | 'broken' { if (this.sanityPercent > 75) return 'stable'; if (this.sanityPercent > 50) return 'shaken'; if (this.sanityPercent > 25) return 'disturbed'; return 'broken'; }
  get sanityColor(): 'success' | 'warning' | 'danger' | 'primary' { if (this.sanityPercent > 75) return 'success'; if (this.sanityPercent > 50) return 'warning'; return 'danger'; }
  get filteredTexts() { return this.texts.filter(t => { const matchesSearch = this.searchQuery === '' || t.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || t.author.toLowerCase().includes(this.searchQuery.toLowerCase()); const matchesDanger = this.dangerFilter === 'all' || t.dangerLevel === this.dangerFilter; return matchesSearch && matchesDanger; }); }

  dangerOptions = [{ value: 'all', label: 'All Texts' }, { value: 'Safe', label: 'Safe' }, { value: 'Caution', label: 'Caution' }, { value: 'Dangerous', label: 'Dangerous' }, { value: 'Forbidden', label: 'Forbidden' }];

  attemptRead(text: ForbiddenText) { this.pendingText = text; this.warningModalOpen = true; }
  confirmRead() {
    if (!this.pendingText) return;
    const text = this.pendingText;
    this.warningModalOpen = false;
    const loss = text.sanityLoss * (Math.random() * 0.5 + 0.75);
    this.currentSanity = Math.max(0, this.currentSanity - Math.round(loss));
    const idx = this.texts.findIndex(t => t.id === text.id);
    if (idx !== -1) this.texts[idx].fragmentRead = true;
    this.selectedText = text;
    this.readingModalOpen = true;
    this.pendingText = null;
  }
  cancelRead() { this.warningModalOpen = false; this.pendingText = null; }
  closeReading() { this.readingModalOpen = false; this.selectedText = null; }
  restSanity() { this.currentSanity = Math.min(this.maxSanity, this.currentSanity + 10); }
  setDangerFilter(filter: string) { this.dangerFilter = filter; }
  setSearch(query: string) { this.searchQuery = query; }
  getDangerBadgeColor(level: ForbiddenText['dangerLevel']): 'green' | 'yellow' | 'red' | 'blue' | 'gray' {
    switch (level) { case 'Safe': return 'green'; case 'Caution': return 'yellow'; case 'Dangerous': return 'red'; case 'Forbidden': return 'red'; default: return 'gray'; }
  }
}

export const occultStore = new OccultStore();
