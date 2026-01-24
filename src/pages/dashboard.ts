import type { Page } from "../ui/types";
import { dashboardStore } from "../stores/dashboard.svelte";

/**
 * Dashboard Demo Page
 *
 * This entire dashboard is defined declaratively in ~120 lines.
 * No .svelte files, no JSX, no template logic - just typed data.
 */
export const dashboardPage: Page = {
  layout: "full",
  sections: [
    // ==========================================
    // HEADER
    // ==========================================
    {
      molecule: "stack",
      direction: "horizontal",
      justify: "between",
      align: "center",
      padding: "md",
      items: [
        {
          molecule: "stack",
          direction: "vertical",
          gap: "none",
          items: [
            { atom: "text", variant: "heading", text: "Dashboard" },
            { atom: "text", variant: "muted", text: "Welcome back! Here's what's happening." }
          ]
        },
        {
          atom: "button",
          text: "+ Add Member",
          variant: "primary",
          onClick: () => dashboardStore.openAddModal()
        }
      ]
    },

    // ==========================================
    // STAT CARDS
    // ==========================================
    {
      molecule: "grid",
      columns: 4,
      gap: "md",
      padding: "md",
      items: [
        {
          molecule: "stat-card",
          title: "Total Members",
          value: () => dashboardStore.stats.totalMembers,
          change: { value: 12, label: "from last month" },
          icon: "users"
        },
        {
          molecule: "stat-card",
          title: "Active Now",
          value: () => dashboardStore.stats.activeNow,
          change: { value: 8, label: "from yesterday" },
          icon: "activity"
        },
        {
          molecule: "stat-card",
          title: "Total Revenue",
          value: () => `$${dashboardStore.stats.revenue.toLocaleString()}`,
          change: { value: 23, label: "from last month" },
          icon: "dollar-sign"
        },
        {
          molecule: "stat-card",
          title: "Conversion Rate",
          value: () => `${dashboardStore.stats.conversion}%`,
          change: { value: -2, label: "from last week" },
          icon: "trending-up"
        }
      ]
    },

    // ==========================================
    // TABS WITH CONTENT
    // ==========================================
    {
      molecule: "tabs",
      id: "main-tabs",
      activeTab: () => dashboardStore.activeTab,
      onTabChange: (tab) => dashboardStore.activeTab = tab,
      tabs: [
        {
          id: "overview",
          label: "Overview",
          icon: "📊",
          content: [
            // Charts Row
            {
              molecule: "grid",
              columns: 2,
              gap: "md",
              items: [
                {
                  organism: "card",
                  header: { atom: "text", variant: "heading", text: "Visitor Trends" },
                  content: [
                    {
                      atom: "chart",
                      id: "visitor-trends",
                      type: "area",
                      data: () => dashboardStore.visitorData,
                      height: 200,
                      // Uses --chart-1 by default
                      showGrid: true,
                      showLabels: true
                    }
                  ]
                },
                {
                  organism: "card",
                  header: { atom: "text", variant: "heading", text: "Revenue" },
                  content: [
                    {
                      atom: "chart",
                      id: "revenue-chart",
                      type: "bar",
                      data: () => dashboardStore.revenueData,
                      height: 200,
                      color: "hsl(var(--chart-2))",
                      showGrid: true,
                      showLabels: true
                    }
                  ]
                }
              ]
            },
            // Activity Row
            {
              molecule: "grid",
              columns: 2,
              gap: "md",
              items: [
                // Recent Activity
                {
                  organism: "card",
                  header: { atom: "text", variant: "heading", text: "Recent Activity" },
                  content: [
                    {
                      organism: "list",
                      id: "recent-activity",
                      items: () => dashboardStore.recentActivity.map(activity => ({
                        key: activity.id,
                        leading: { atom: "icon", name: activity.icon, size: "md", class: "text-muted-foreground" },
                        content: {
                          molecule: "stack",
                          direction: "vertical",
                          gap: "none",
                          items: [
                            { atom: "text", text: activity.title },
                            { atom: "text", text: activity.time, variant: "muted" }
                          ]
                        }
                      })),
                      emptyText: "No recent activity"
                    }
                  ]
                },
                // Top Members
                {
                  organism: "card",
                  header: { atom: "text", variant: "heading", text: "Top Members" },
                  content: [
                    {
                      organism: "list",
                      id: "top-members",
                      items: () => dashboardStore.topMembers.map((member, i) => ({
                        key: member.id,
                        leading: { atom: "text", text: `#${i + 1}`, variant: i === 0 ? "heading" : "muted" },
                        content: { atom: "text", text: member.name },
                        trailing: { atom: "text", text: `${member.points} pts`, variant: "muted" },
                        data: member
                      })),
                      emptyText: "No members yet"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "members",
          label: "Members",
          icon: "👥",
          content: [
            {
              organism: "table",
              id: "members-table",
              data: () => dashboardStore.members,
              columns: [
                { field: "name", header: "Name", sortable: true },
                { field: "email", header: "Email" },
                { field: "role", header: "Role", sortable: true },
                { field: "points", header: "Points", sortable: true },
                {
                  field: "status",
                  header: "Status",
                  render: (val) => ({
                    atom: "text",
                    text: val as string,
                    variant: val === "Active" ? "default" : "muted"
                  })
                }
              ],
              searchable: true,
              searchKeys: ["name", "email"],
              searchPlaceholder: "Search members...",
              actions: [
                { icon: "✏️", label: "Edit", onClick: (row) => dashboardStore.editMember(row) },
                { icon: "🗑️", label: "Delete", variant: "danger", onClick: (row) => dashboardStore.deleteMember(row) }
              ],
              emptyText: "No members found"
            }
          ]
        },
        {
          id: "settings",
          label: "Settings",
          icon: "⚙️",
          content: [
            {
              organism: "card",
              content: [
                {
                  molecule: "stack",
                  direction: "vertical",
                  gap: "lg",
                  items: [
                    { atom: "text", variant: "heading", text: "Preferences" },
                    {
                      atom: "switch",
                      id: "dark-mode",
                      label: "Dark Mode",
                      value: () => dashboardStore.settings.darkMode,
                      onChange: (v) => dashboardStore.settings.darkMode = v
                    },
                    {
                      atom: "switch",
                      id: "notifications",
                      label: "Email Notifications",
                      value: () => dashboardStore.settings.notifications,
                      onChange: (v) => dashboardStore.settings.notifications = v
                    },
                    {
                      atom: "switch",
                      id: "auto-refresh",
                      label: "Auto-refresh Data",
                      value: () => dashboardStore.settings.autoRefresh,
                      onChange: (v) => dashboardStore.settings.autoRefresh = v
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // ==========================================
    // ADD MEMBER MODAL
    // ==========================================
    {
      organism: "modal",
      id: "add-member-modal",
      title: "Add New Member",
      size: "md",
      open: () => dashboardStore.addModalOpen,
      onClose: () => dashboardStore.closeAddModal(),
      content: [
        {
          molecule: "form",
          id: "add-member-form",
          onSubmit: (data) => dashboardStore.addMember(data),
          fields: [
            {
              atom: "input",
              id: "name",
              label: "Full Name",
              placeholder: "Enter full name",
              required: true
            },
            {
              atom: "input",
              id: "email",
              label: "Email Address",
              type: "email",
              placeholder: "Enter email",
              required: true
            }
          ]
        }
      ],
      footer: [
        { atom: "button", text: "Cancel", variant: "secondary", onClick: () => dashboardStore.closeAddModal() },
        { atom: "button", text: "Add Member", variant: "primary", submit: true }
      ]
    }
  ]
};
