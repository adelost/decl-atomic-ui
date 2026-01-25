// Demo data for testing DAUI components

export interface Member {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member' | 'guest';
  points: number;
  active: boolean;
  joinedAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// Members data
export const members: Member[] = [
  {
    id: '1',
    name: 'Anna Andersson',
    email: 'anna@example.com',
    role: 'admin',
    points: 1250,
    active: true,
    joinedAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Björn Berg',
    email: 'bjorn@example.com',
    role: 'member',
    points: 890,
    active: true,
    joinedAt: '2023-03-22',
  },
  {
    id: '3',
    name: 'Cecilia Carlsson',
    email: 'cecilia@example.com',
    role: 'member',
    points: 2100,
    active: true,
    joinedAt: '2022-11-08',
  },
  {
    id: '4',
    name: 'David Dahl',
    email: 'david@example.com',
    role: 'guest',
    points: 150,
    active: false,
    joinedAt: '2024-01-02',
  },
  {
    id: '5',
    name: 'Eva Eriksson',
    email: 'eva@example.com',
    role: 'member',
    points: 720,
    active: true,
    joinedAt: '2023-06-14',
  },
  {
    id: '6',
    name: 'Fredrik Falk',
    email: 'fredrik@example.com',
    role: 'member',
    points: 1890,
    active: true,
    joinedAt: '2022-08-30',
  },
  {
    id: '7',
    name: 'Greta Grön',
    email: 'greta@example.com',
    role: 'admin',
    points: 3200,
    active: true,
    joinedAt: '2021-05-11',
  },
  {
    id: '8',
    name: 'Henrik Hall',
    email: 'henrik@example.com',
    role: 'guest',
    points: 50,
    active: false,
    joinedAt: '2024-02-28',
  },
];

// Products data
export const products: Product[] = [
  { id: 'p1', name: 'Laptop Pro', price: 12999, category: 'Electronics', inStock: true },
  { id: 'p2', name: 'Wireless Mouse', price: 299, category: 'Electronics', inStock: true },
  { id: 'p3', name: 'Office Chair', price: 2499, category: 'Furniture', inStock: false },
  { id: 'p4', name: 'Standing Desk', price: 4999, category: 'Furniture', inStock: true },
  { id: 'p5', name: 'Monitor 27"', price: 3499, category: 'Electronics', inStock: true },
  { id: 'p6', name: 'Keyboard', price: 899, category: 'Electronics', inStock: true },
];

// Leaderboard (sorted by points)
export const leaderboard = [...members].filter((m) => m.active).sort((a, b) => b.points - a.points);

// Demo store with reactive state
class DemoStore {
  // Settings
  darkMode = $state(false);
  notifications = $state(true);
  autoSave = $state(true);

  // Selected member for SearchSelect
  selectedMemberId = $state('');

  // Chart demo settings
  chartSmooth = $state(true);
  chartData = [
    { label: 'Jan 1', value: 1200 },
    { label: 'Jan 2', value: 900 },
    { label: 'Jan 3', value: 1400 },
    { label: 'Jan 4', value: 1100 },
    { label: 'Jan 5', value: 1800 },
    { label: 'Jan 6', value: 1500 },
    { label: 'Jan 7', value: 2000 },
    { label: 'Jan 8', value: 1700 },
    { label: 'Jan 9', value: 2200 },
    { label: 'Jan 10', value: 1900 },
    { label: 'Jan 11', value: 2400 },
    { label: 'Jan 12', value: 2100 },
    { label: 'Jan 13', value: 2600 },
    { label: 'Jan 14', value: 2300 },
  ];

  // Get member options for SearchSelect
  getMemberOptions() {
    return members.map((m) => ({
      value: m.id,
      label: m.name,
      subtitle: m.email,
    }));
  }

  // Simulate async data loading
  async loadMembersAsync(): Promise<Member[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return members;
  }

  // Simulate delete action
  async deleteMember(id: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Deleted member:', id);
  }
}

export const demoStore = new DemoStore();
