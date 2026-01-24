import type { Page } from "../ui/types";
import { demoStore, members, leaderboard, type Member } from "../stores/demoData.svelte";

export const showcasePage: Page = {
  layout: "centered",
  title: "DAUI Component Showcase",
  sections: [
    // Header
    {
      molecule: "stack",
      direction: "vertical",
      gap: "sm",
      items: [
        { atom: "text", variant: "heading", text: "Component Showcase" },
        { atom: "text", variant: "muted", text: "All DAUI components in action" },
      ]
    },

    { atom: "divider", spacing: "lg" },

    // ==========================================
    // TABLE
    // ==========================================
    {
      organism: "card",
      header: { atom: "text", variant: "heading", text: "Table" },
      content: [
        {
          organism: "table",
          id: "members-table",
          data: () => members,
          columns: [
            { field: "name", header: "Name", sortable: true },
            { field: "email", header: "Email" },
            { field: "role", header: "Role", sortable: true },
            { field: "points", header: "Points", sortable: true },
            {
              field: "active",
              header: "Status",
              render: (val) => ({
                atom: "text",
                text: val ? "Active" : "Inactive",
                variant: val ? "default" : "muted"
              })
            }
          ],
          searchable: true,
          searchKeys: ["name", "email"],
          searchPlaceholder: "Search members...",
          actions: [
            {
              icon: "✏️",
              label: "Edit",
              onClick: (row: Member) => console.log("Edit", row.name)
            },
            {
              icon: "🗑️",
              label: "Delete",
              variant: "danger",
              onClick: async (row: Member) => await demoStore.deleteMember(row.id)
            }
          ],
          emptyText: "No members found"
        }
      ]
    },

    { atom: "divider", spacing: "lg" },

    // ==========================================
    // LIST (Leaderboard)
    // ==========================================
    {
      organism: "card",
      header: { atom: "text", variant: "heading", text: "List (Leaderboard)" },
      content: [
        {
          organism: "list",
          id: "leaderboard",
          items: () => leaderboard.map((member, i) => ({
            key: member.id,
            leading: {
              atom: "text",
              text: `#${i + 1}`,
              variant: i === 0 ? "heading" : "muted"
            },
            content: {
              molecule: "stack",
              direction: "vertical",
              gap: "none",
              items: [
                { atom: "text", text: member.name },
                { atom: "text", text: member.email, variant: "muted" }
              ]
            },
            trailing: {
              atom: "text",
              text: `${member.points} pts`
            },
            data: member
          })),
          onItemClick: (member: Member) => console.log("Clicked", member.name),
          emptyText: "No rankings yet"
        }
      ]
    },

    { atom: "divider", spacing: "lg" },

    // ==========================================
    // SEARCH SELECT
    // ==========================================
    {
      organism: "card",
      header: { atom: "text", variant: "heading", text: "SearchSelect" },
      content: [
        {
          molecule: "search-select",
          id: "member-select",
          label: "Select a member",
          placeholder: "Search by name or email...",
          options: () => demoStore.getMemberOptions(),
          value: () => demoStore.selectedMemberId,
          onChange: (id) => demoStore.selectedMemberId = id
        },
        {
          atom: "text",
          variant: "muted",
          text: () => demoStore.selectedMemberId
            ? `Selected: ${demoStore.selectedMemberId}`
            : "No member selected"
        }
      ]
    },

    { atom: "divider", spacing: "lg" },

    // ==========================================
    // SWITCH & ICON BUTTON
    // ==========================================
    {
      organism: "card",
      header: { atom: "text", variant: "heading", text: "Switch & IconButton" },
      content: [
        {
          molecule: "stack",
          direction: "vertical",
          gap: "md",
          items: [
            {
              atom: "switch",
              id: "dark-mode",
              label: "Dark Mode",
              value: () => demoStore.darkMode,
              onChange: (v) => demoStore.darkMode = v
            },
            {
              atom: "switch",
              id: "notifications",
              label: "Enable Notifications",
              value: () => demoStore.notifications,
              onChange: (v) => demoStore.notifications = v
            },
            {
              atom: "switch",
              id: "auto-save",
              label: "Auto-save",
              value: () => demoStore.autoSave,
              onChange: (v) => demoStore.autoSave = v
            }
          ]
        },
        { atom: "divider", spacing: "md" },
        {
          molecule: "stack",
          direction: "horizontal",
          gap: "sm",
          items: [
            { atom: "icon-button", icon: "📝", label: "Edit", onClick: () => console.log("Edit") },
            { atom: "icon-button", icon: "📋", label: "Copy", onClick: () => console.log("Copy") },
            { atom: "icon-button", icon: "🗑️", label: "Delete", variant: "danger", onClick: () => console.log("Delete") },
            { atom: "icon-button", icon: "⚙️", label: "Settings", variant: "ghost", onClick: () => console.log("Settings") }
          ]
        },
        {
          atom: "text",
          variant: "muted",
          text: () => `Dark: ${demoStore.darkMode}, Notifications: ${demoStore.notifications}, AutoSave: ${demoStore.autoSave}`
        }
      ]
    },

    { atom: "divider", spacing: "lg" },

    // ==========================================
    // GRID LAYOUT
    // ==========================================
    {
      organism: "card",
      header: { atom: "text", variant: "heading", text: "Grid Layout" },
      content: [
        {
          molecule: "grid",
          columns: 3,
          gap: "md",
          items: [
            {
              organism: "card",
              variant: "outlined",
              content: [
                { atom: "text", variant: "muted", text: "Total Members" },
                { atom: "text", variant: "heading", text: "8" }
              ]
            },
            {
              organism: "card",
              variant: "outlined",
              content: [
                { atom: "text", variant: "muted", text: "Active" },
                { atom: "text", variant: "heading", text: "6" }
              ]
            },
            {
              organism: "card",
              variant: "outlined",
              content: [
                { atom: "text", variant: "muted", text: "Total Points" },
                { atom: "text", variant: "heading", text: "10,250" }
              ]
            }
          ]
        }
      ]
    }
  ]
};
