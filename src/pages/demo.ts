import type { Page } from "../ui/types";
import { sampleStore } from "../stores/sample.svelte";

export const demoPage: Page = {
  layout: "centered",
  title: "DAUI Demo Page",
  sections: [
    // Welcome Header
    {
      molecule: "stack",
      direction: "vertical",
      gap: "sm",
      items: [
        { atom: "text", variant: "heading", text: "Declarative UI Framework" },
        { atom: "text", variant: "muted", text: "Pages are data. Rendering is logic." },
      ]
    },

    { atom: "divider", spacing: "lg" },

    // LOGIN CARD EXAMPLE
    {
      organism: "card",
      variant: "elevated",
      visible: () => !sampleStore.isLoggedIn, // Hide when logged in
      header: {
        molecule: "stack",
        items: [
          { atom: "text", variant: "heading", text: "Login" },
          { atom: "text", variant: "muted", text: "Enter your credentials to access the system." },
        ]
      },
      content: [
        {
          molecule: "form",
          id: "login-form",
          onSubmit: sampleStore.login, // Form handles submit event
          fields: [
            {
              atom: "input",
              id: "email",
              label: "Email Address",
              type: "email",
              required: true,
              placeholder: "you@example.com",
              value: () => sampleStore.email,
              onChange: (v) => sampleStore.email = v,
            },
            {
              atom: "input",
              id: "password",
              label: "Password",
              type: "password",
              required: true,
              placeholder: "••••••••",
              value: () => sampleStore.password,
              onChange: (v) => sampleStore.password = v,
            },
            {
              molecule: "stack",
              direction: "horizontal",
              justify: "end",
              items: [
                { atom: "button", text: "Sign In", variant: "primary", submit: true }
              ]
            }
          ],
        }
      ],
      footer: {
        atom: "text",
        variant: "small",
        text: "Don't have an account? Contact support."
      }
    },

    // DASHBOARD (Visible when logged in)
    {
      molecule: "stack",
      gap: "lg",
      visible: () => sampleStore.isLoggedIn,
      items: [
        { 
          atom: "text", 
          variant: "heading", 
          text: () => `Welcome back, ${sampleStore.email}!` 
        },
        
        // Grid Dashboard
        {
          molecule: "grid",
          columns: 2,
          gap: "md",
          items: [
            {
              organism: "card",
              content: [
                { atom: "text", variant: "muted", text: "Total Clicks" },
                { atom: "text", variant: "heading", text: () => sampleStore.count.toString() },
                { atom: "button", text: "+1 Increment", onClick: sampleStore.increment }
              ]
            },
            {
              organism: "card",
              content: [
                { atom: "text", variant: "muted", text: "Account Status" },
                { atom: "text", variant: "heading", text: "Active" },
                { atom: "text", variant: "small", text: "Since 2024-01-01" }
              ]
            }
          ]
        },

        {
          atom: "button",
          text: "Log Out",
          variant: "secondary",
          onClick: sampleStore.logout
        }
      ]
    },

    { atom: "divider", spacing: "lg" },

    // Live Data Binding Example
    {
      organism: "card",
      variant: "outlined",
      header: { atom: "text", text: "Debug / Live Data Binding", variant: "heading" },
      content: [
        {
          molecule: "grid",
          columns: 2,
          items: [
            { atom: "text", variant: "muted", text: "Email State:" },
            { atom: "text", text: () => sampleStore.email || "(empty)" },
            
            { atom: "text", variant: "muted", text: "Password State:" },
            { atom: "text", text: () => sampleStore.password ? "******" : "(empty)" },

            { atom: "text", variant: "muted", text: "Clicks:" },
            { atom: "text", text: () => sampleStore.count.toString() },
          ]
        }
      ]
    }
  ],
};
