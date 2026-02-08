import { beforeEach, expect, vi } from "vitest";
import { feature, unit } from "bdd-vitest";
import {
  cn,
  executeCallback,
  registerIntent,
  clearIntents,
  emit,
} from "../src/utils";
import { register, getComponent, clearRegistry, registerComponent } from "../src/registry";

beforeEach(() => {
  clearRegistry();
  clearIntents();
});

// -- Helpers --

const Stub = (name: string) => ({ name });

function mockWindow() {
  const target = new EventTarget();
  const orig = globalThis.window;
  globalThis.window = Object.assign(target, { CustomEvent }) as unknown as Window &
    typeof globalThis;
  return { target, restore: () => { globalThis.window = orig; } };
}

// -- Tests --

feature("cn()", () => {
  unit("merges and resolves conflicting tailwind classes", {
    when: ["merging conflicting widths", () => cn("w-full p-4", "w-1/2")],
    then: ["last wins, others kept", (r) => expect(r).toBe("p-4 w-1/2")],
  });
});

feature("Intent System", () => {
  unit("function callback returns result directly", {
    when: ["executing a function", () => executeCallback(() => 42)],
    then: ["returns its result", (r) => expect(r).toBe(42)],
  });

  unit("intent callback dispatches to registered handler", {
    given: ["a registered handler", () => {
      registerIntent("cart.add", (p) => `added:${p?.productId}`);
    }],
    when: ["executing intent", () =>
      executeCallback({ action: "cart.add", payload: { productId: "123" } }),
    ],
    then: ["handler processes payload", (r) => expect(r).toBe("added:123")],
  });

  unit("missing intent handler warns and returns undefined", {
    given: ["console.warn spied on", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
    }],
    when: ["executing unknown intent", () =>
      executeCallback({ action: "unknown.action" }),
    ],
    then: ["returns undefined and warned", (r) => {
      expect(r).toBeUndefined();
      expect(console.warn).toHaveBeenCalledOnce();
    }],
    cleanup: () => vi.restoreAllMocks(),
  });

  unit("clearIntents removes all handlers", {
    given: ["a handler registered then cleared", () => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      registerIntent("test.action", () => "handled");
      clearIntents();
    }],
    when: ["executing cleared intent", () =>
      executeCallback({ action: "test.action" }),
    ],
    then: ["returns undefined", (r) => expect(r).toBeUndefined()],
    cleanup: () => vi.restoreAllMocks(),
  });
});

feature("Component Registry", () => {
  unit("register + getComponent round-trips", {
    given: ["a preset registered", () => {
      const stubs = { button: Stub("Button"), form: Stub("Form"), table: Stub("Table") };
      register({
        atoms: { button: stubs.button },
        molecules: { form: stubs.form },
        organisms: { table: stubs.table },
      });
      return stubs;
    }],
    when: ["looking up each", () => ({
      button: getComponent("atom", "button"),
      form: getComponent("molecule", "form"),
      table: getComponent("organism", "table"),
    })],
    then: ["returns same references", (r, stubs) => {
      expect(r.button).toBe(stubs.button);
      expect(r.form).toBe(stubs.form);
      expect(r.table).toBe(stubs.table);
    }],
  });

  unit("override takes precedence over preset", {
    given: ["a preset and override for same component", () => {
      const override = Stub("Override");
      register({ atoms: { button: Stub("Preset") } });
      registerComponent("atom", "button", override);
      return { override };
    }],
    when: ["getting button", () => getComponent("atom", "button")],
    then: ["returns override reference", (r, ctx) => expect(r).toBe(ctx.override)],
  });

  unit("unknown component returns undefined", {
    when: ["getting nonexistent component", () => getComponent("atom", "nope")],
    then: ["returns undefined", (r) => expect(r).toBeUndefined()],
  });

  unit("clearRegistry resets presets and overrides", {
    given: ["a populated registry then cleared", () => {
      register({ atoms: { button: Stub("Button") } });
      registerComponent("molecule", "form", Stub("Form"));
      clearRegistry();
    }],
    when: ["looking up cleared components", () => ({
      button: getComponent("atom", "button"),
      form: getComponent("molecule", "form"),
    })],
    then: ["all undefined", (r) => {
      expect(r.button).toBeUndefined();
      expect(r.form).toBeUndefined();
    }],
  });
});

feature("emit()", () => {
  unit("dispatches prefixed CustomEvent with detail", {
    given: ["a mock window with event listener", () => {
      const captured: { type: string; detail: unknown }[] = [];
      const win = mockWindow();
      win.target.addEventListener("daui:confetti", (e) => {
        captured.push({ type: e.type, detail: (e as CustomEvent).detail });
      });
      return { captured, restore: win.restore };
    }],
    when: ["emitting event", () => emit("confetti", { count: 50 })],
    then: ["event has prefix and detail", (_r, ctx) => {
      expect(ctx.captured).toEqual([{ type: "daui:confetti", detail: { count: 50 } }]);
    }],
    cleanup: (ctx) => ctx.restore(),
  });

  unit("SSR-safe when window is undefined", {
    given: ["window temporarily removed", () => {
      const orig = globalThis.window;
      // @ts-expect-error -- simulating SSR
      delete globalThis.window;
      return { orig };
    }],
    when: ["emitting without window", () => {
      emit("ssr-test", { x: 1 });
      return "ok";
    }],
    then: ["no error thrown", (r) => expect(r).toBe("ok")],
    cleanup: (ctx) => { globalThis.window = ctx.orig; },
  });
});
