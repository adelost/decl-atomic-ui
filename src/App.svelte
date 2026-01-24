<script lang="ts">
  import PageRenderer from "./ui/renderer/PageRenderer.svelte";
  import MotionCanvasTest from "./MotionCanvasTest.svelte";
  import { demoPage } from "./pages/demo";
  import { showcasePage } from "./pages/showcase";
  import { dashboardPage } from "./pages/dashboard";
  import "./app.css";

  let currentPage = $state<"dashboard" | "demo" | "showcase" | "motion">("dashboard");

  const pages = {
    dashboard: dashboardPage,
    demo: demoPage,
    showcase: showcasePage
  };
</script>

<nav class="page-nav">
  <div class="nav-brand">DAUI</div>
  <div class="nav-links">
    <button
      class:active={currentPage === "dashboard"}
      onclick={() => currentPage = "dashboard"}
    >
      Dashboard
    </button>
    <button
      class:active={currentPage === "showcase"}
      onclick={() => currentPage = "showcase"}
    >
      Components
    </button>
    <button
      class:active={currentPage === "demo"}
      onclick={() => currentPage = "demo"}
    >
      Login Demo
    </button>
    <button
      class:active={currentPage === "motion"}
      onclick={() => currentPage = "motion"}
    >
      Motion Canvas
    </button>
  </div>
</nav>

{#if currentPage === "motion"}
  <MotionCanvasTest />
{:else}
  <PageRenderer page={pages[currentPage]} />
{/if}

<style>
  .page-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    background: hsl(var(--background, 0 0% 100%));
    border-bottom: 1px solid hsl(var(--border, 240 5.9% 90%));
  }

  .nav-brand {
    font-size: 1.25rem;
    font-weight: 700;
    color: hsl(var(--foreground, 240 10% 3.9%));
    letter-spacing: -0.025em;
  }

  .nav-links {
    display: flex;
    gap: 0.25rem;
  }

  .nav-links button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.375rem;
    background: transparent;
    color: hsl(var(--muted-foreground, 240 3.8% 46.1%));
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .nav-links button:hover {
    background: hsl(var(--muted, 240 4.8% 95.9%));
    color: hsl(var(--foreground, 240 10% 3.9%));
  }

  .nav-links button.active {
    background: hsl(var(--primary, 240 5.9% 10%));
    color: hsl(var(--primary-foreground, 0 0% 98%));
  }
</style>
