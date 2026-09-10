/** Eager aggregate — used only by scripts/validate-content.ts (a Node-side script
 * that is never bundled into the app). App code must use loader.ts's lazy
 * loadGrammarTheoryLevel instead, or this defeats the per-level code splitting. */
import type { GrammarTheory } from '../../../types';
import { level1GrammarTheory } from './level1';
import { level2GrammarTheory } from './level2';
import { level3GrammarTheory } from './level3';
import { level4GrammarTheory } from './level4';
import { level5GrammarTheory } from './level5';

export const ALL_GRAMMAR_THEORY: GrammarTheory[] = [
  ...level1GrammarTheory,
  ...level2GrammarTheory,
  ...level3GrammarTheory,
  ...level4GrammarTheory,
  ...level5GrammarTheory,
];
