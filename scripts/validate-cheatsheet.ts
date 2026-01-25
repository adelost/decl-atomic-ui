/**
 * Validates that CHEATSHEET.md contains all discriminators from types.
 *
 * Run: npx tsx scripts/validate-cheatsheet.ts
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Extract discriminators from types file
function getTypesDiscriminators(): { atoms: string[]; molecules: string[]; organisms: string[] } {
  const typesContent = readFileSync(join(ROOT, "src/ui/types/index.ts"), "utf-8");

  const atoms = [...typesContent.matchAll(/atom:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
  const molecules = [...typesContent.matchAll(/molecule:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
  const organisms = [...typesContent.matchAll(/organism:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);

  return {
    atoms: [...new Set(atoms)].sort(),
    molecules: [...new Set(molecules)].sort(),
    organisms: [...new Set(organisms)].sort(),
  };
}

// Extract discriminators from cheatsheet
function getCheatsheetDiscriminators(): { atoms: string[]; molecules: string[]; organisms: string[] } {
  const cheatsheet = readFileSync(join(ROOT, "CHEATSHEET.md"), "utf-8");

  // Find the discriminators section
  const section = cheatsheet.match(/## Valid Discriminators[\s\S]*?```([\s\S]*?)```/);
  if (!section) {
    throw new Error("Could not find 'Valid Discriminators' section in CHEATSHEET.md");
  }

  const content = section[1];

  const atomsMatch = content.match(/ATOMS:\s*([\s\S]*?)(?=MOLECULES:|$)/);
  const moleculesMatch = content.match(/MOLECULES:\s*([\s\S]*?)(?=ORGANISMS:|$)/);
  const organismsMatch = content.match(/ORGANISMS:\s*([\s\S]*?)(?=```|$)/);

  const parse = (str: string | undefined) =>
    (str || "")
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s && !s.includes(":"));

  return {
    atoms: parse(atomsMatch?.[1]).sort(),
    molecules: parse(moleculesMatch?.[1]).sort(),
    organisms: parse(organismsMatch?.[1]).sort(),
  };
}

function diff(name: string, inTypes: string[], inCheatsheet: string[]) {
  const missing = inTypes.filter((d) => !inCheatsheet.includes(d));
  const extra = inCheatsheet.filter((d) => !inTypes.includes(d));

  const errors: string[] = [];
  if (missing.length) errors.push(`  Missing in CHEATSHEET.md: ${missing.join(", ")}`);
  if (extra.length) errors.push(`  Extra in CHEATSHEET.md (not in types): ${extra.join(", ")}`);

  return errors;
}

// Main
const types = getTypesDiscriminators();
const cheatsheet = getCheatsheetDiscriminators();

const errors: string[] = [];

const atomErrors = diff("ATOMS", types.atoms, cheatsheet.atoms);
if (atomErrors.length) errors.push("ATOMS:", ...atomErrors);

const moleculeErrors = diff("MOLECULES", types.molecules, cheatsheet.molecules);
if (moleculeErrors.length) errors.push("MOLECULES:", ...moleculeErrors);

const organismErrors = diff("ORGANISMS", types.organisms, cheatsheet.organisms);
if (organismErrors.length) errors.push("ORGANISMS:", ...organismErrors);

if (errors.length) {
  console.error("❌ CHEATSHEET.md is out of sync with types:\n");
  console.error(errors.join("\n"));
  console.error("\nUpdate CHEATSHEET.md to match src/ui/types/index.ts");
  process.exit(1);
} else {
  console.log("✓ CHEATSHEET.md is in sync with types");
  console.log(`  ${types.atoms.length} atoms, ${types.molecules.length} molecules, ${types.organisms.length} organisms`);
}
