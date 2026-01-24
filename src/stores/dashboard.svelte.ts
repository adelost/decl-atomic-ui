// Dashboard store - reactive state for the dashboard demo

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  status: string;
}

interface Activity {
  id: string;
  icon: string;
  title: string;
  time: string;
}

class DashboardStore {
  // Stats
  stats = $state({
    totalMembers: 2847,
    activeNow: 127,
    revenue: 45231,
    conversion: 12.5
  });

  // Active tab
  activeTab = $state("overview");

  // Settings
  settings = $state({
    darkMode: false,
    notifications: true,
    autoRefresh: false
  });

  // Modal state
  addModalOpen = $state(false);

  // Members data
  members = $state<Member[]>([
    { id: "1", name: "Anna Andersson", email: "anna@example.com", role: "Admin", points: 2840, status: "Active" },
    { id: "2", name: "Björn Berg", email: "bjorn@example.com", role: "Member", points: 1920, status: "Active" },
    { id: "3", name: "Cecilia Carlsson", email: "cecilia@example.com", role: "Member", points: 3200, status: "Active" },
    { id: "4", name: "David Dahl", email: "david@example.com", role: "Guest", points: 450, status: "Inactive" },
    { id: "5", name: "Eva Eriksson", email: "eva@example.com", role: "Member", points: 1650, status: "Active" },
    { id: "6", name: "Fredrik Falk", email: "fredrik@example.com", role: "Member", points: 2100, status: "Active" },
    { id: "7", name: "Greta Grön", email: "greta@example.com", role: "Admin", points: 4500, status: "Active" },
    { id: "8", name: "Henrik Hall", email: "henrik@example.com", role: "Guest", points: 120, status: "Inactive" },
  ]);

  // Top members (derived from members, sorted by points)
  get topMembers() {
    return [...this.members]
      .filter(m => m.status === "Active")
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
  }

  // Recent activity
  recentActivity = $state<Activity[]>([
    { id: "1", icon: "user-plus", title: "New member joined: Erik Ekberg", time: "2 minutes ago" },
    { id: "2", icon: "banknote", title: "Payment received: $125.00", time: "15 minutes ago" },
    { id: "3", icon: "trophy", title: "Goal reached: 100 active members", time: "1 hour ago" },
    { id: "4", icon: "send", title: "Newsletter sent to 2,500 subscribers", time: "3 hours ago" },
    { id: "5", icon: "star", title: "New 5-star review received", time: "5 hours ago" },
  ]);

  // Chart data - visitor stats over time
  visitorData = [
    { label: "Jan 1", value: 1200 },
    { label: "Jan 2", value: 1850 },
    { label: "Jan 3", value: 1400 },
    { label: "Jan 4", value: 2100 },
    { label: "Jan 5", value: 1900 },
    { label: "Jan 6", value: 2400 },
    { label: "Jan 7", value: 2800 },
    { label: "Jan 8", value: 2200 },
    { label: "Jan 9", value: 2600 },
    { label: "Jan 10", value: 3100 },
    { label: "Jan 11", value: 2900 },
    { label: "Jan 12", value: 3400 },
    { label: "Jan 13", value: 3200 },
    { label: "Jan 14", value: 3800 },
  ];

  // Revenue chart data
  revenueData = [
    { label: "Jan", value: 4500 },
    { label: "Feb", value: 5200 },
    { label: "Mar", value: 4800 },
    { label: "Apr", value: 6100 },
    { label: "May", value: 5900 },
    { label: "Jun", value: 7200 },
  ];

  // Actions
  openAddModal() {
    this.addModalOpen = true;
  }

  closeAddModal() {
    this.addModalOpen = false;
  }

  addMember(data: Record<string, unknown>) {
    const newMember: Member = {
      id: String(Date.now()),
      name: String(data.name || ""),
      email: String(data.email || ""),
      role: "Member",
      points: 0,
      status: "Active"
    };
    this.members = [...this.members, newMember];
    this.stats.totalMembers += 1;
    this.closeAddModal();
    console.log("Added member:", newMember);
  }

  editMember(member: Member) {
    console.log("Edit member:", member);
    // Would open edit modal in real app
  }

  async deleteMember(member: Member) {
    // Simulate async delete
    await new Promise(resolve => setTimeout(resolve, 500));
    this.members = this.members.filter(m => m.id !== member.id);
    this.stats.totalMembers -= 1;
    console.log("Deleted member:", member);
  }
}

export const dashboardStore = new DashboardStore();
