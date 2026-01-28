/**
 * Page type definitions - Top-level page structure
 */
import type { Callback } from './base';
import type { Atom } from './atoms';
import type { Molecule } from './molecules';
import type { Organism } from './organisms';

/** A section can be any atom, molecule, or organism */
export type Section = Atom | Molecule | Organism;

/** Keyboard shortcut definition for page-level actions */
export interface KeyboardShortcut {
  /** Single key ('s', 'Space', 'Escape') or sequence ('↑↑↓↓←→←→') */
  keys: string;
  /** Modifier keys for single-key shortcuts */
  modifiers?: ('ctrl' | 'shift' | 'alt' | 'meta')[];
  /** Action to execute */
  action: Callback;
  /** Description for help/tooltip */
  description?: string;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  /** Only trigger once (useful for easter eggs) */
  once?: boolean;
}

/** Page definition */
export interface Page {
  layout: 'centered' | 'full' | 'sidebar';
  title: string;
  sections: Section[];
  /** Page-level keyboard shortcuts */
  shortcuts?: KeyboardShortcut[];
}
