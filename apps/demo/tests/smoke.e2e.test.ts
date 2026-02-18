import { expect } from "vitest";
import { feature, e2e } from "bdd-vitest";
import { chromium } from "@playwright/test";

const BASE = "http://localhost:5174/declarative-atomic-ui/";

const EXAMPLE_PAGES = [
  "Landing Page",
  "Tools & Effects",
  "$action Demo",
  "$async Demo",
  "Chat",
  "Dashboard",
  "Crypto-Dex",
  "Skydive Logger",
  "Synthesizer",
  "Occult Archive",
  "Mission Control",
  "Code Components",
];

// motion-canvas logger not initialized in headless — not our bug
const KNOWN_ERRORS = [
  "Cannot read properties of undefined (reading 'error')",
];

feature("Showcase", () => {
  e2e("all pages render without console errors", {
    given: ["a browser on the showcase", async () => {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      const errors: string[] = [];
      page.on("pageerror", (err) => {
        if (!KNOWN_ERRORS.some((known) => err.message.includes(known))) {
          errors.push(err.message);
        }
      });
      await page.goto(BASE, { waitUntil: "domcontentloaded" });
      await expect(page.getByRole("heading", { name: "DAUI", exact: true }).isVisible()).resolves.toBe(true);
      return { browser, page, errors };
    }],
    when: ["navigating all pages", async ({ page }) => {
      // Components page — click each tab
      for (const tab of ["Atoms", "Molecules", "Organisms", "Extensions"]) {
        const tabButton = page.getByRole("tab", { name: tab });
        if (await tabButton.isVisible()) {
          await tabButton.click();
          await page.waitForTimeout(300);
        }
      }

      // Motion page
      await page.getByRole("button", { name: "Motion" }).click();
      await page.waitForTimeout(500);

      // Example pages via dropdown
      for (const name of EXAMPLE_PAGES) {
        await page.getByRole("button", { name: /Examples/ }).click();
        const item = page.getByRole("menuitem", { name });
        await item.waitFor({ state: "visible", timeout: 3000 });
        await item.click({ force: true });
        await page.waitForTimeout(500);
      }
    }],
    then: ["no errors occurred", (_, { errors }) => {
      expect(errors).toEqual([]);
    }],
    cleanup: async ({ browser }) => {
      await browser.close();
    },
  });
});
