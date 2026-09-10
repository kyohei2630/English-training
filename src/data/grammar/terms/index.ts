/** Eager aggregate — used only by scripts/validate-content.ts. App code must use
 * loader.ts's lazy loadGrammarTerms instead. */
import type { GrammarTerm } from '../../../types';
import { basicTerms } from './basicTerms';
import { sentenceStructureTerms } from './sentenceStructureTerms';
import { grammarPointTerms } from './grammarPointTerms';

export const ALL_GRAMMAR_TERMS: GrammarTerm[] = [...basicTerms, ...sentenceStructureTerms, ...grammarPointTerms];
