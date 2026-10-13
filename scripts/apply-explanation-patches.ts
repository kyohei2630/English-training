/**
 * Applies explanation / question fixes to the question data files:
 * - scripts/explanationPatches.ts — reinforcement of short explanations (appended, 2026-10)
 * - scripts/auditPatches.ts — content audit fixes (append, or replace where inaccurate)
 * Safe to run again: text already applied is left as is. A file is only written after every
 * patch for it applied and validated (answer among the choices, (正解) at the answer).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { EXPLANATION_PATCHES } from './explanationPatches';
import { GRAMMAR_AUDIT_PATCHES, READING_AUDIT_PATCHES, type AuditPatch } from './auditPatches';

/** A string literal from our own data files, single- or double-quoted. */
const LITERAL = String.raw`'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"`;
const unquote = (lit: string): string => new Function(`return ${lit}`)();
const quote = (s: string) => `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

function readField(block: string, field: string): string | undefined {
  const m = new RegExp(`\\b${field}: (${LITERAL}),`).exec(block);
  return m ? unquote(m[1]) : undefined;
}

function setField(block: string, field: string, value: string, insertAfter = 'explanation'): string {
  const re = new RegExp(`\\b${field}: (?:${LITERAL}),`);
  if (re.test(block)) return block.replace(re, () => `${field}: ${quote(value)},`);
  return block.replace(new RegExp(`\\b${insertAfter}: (?:${LITERAL}),`), (m) => `${m}\n    ${field}: ${quote(value)},`);
}

function readChoices(block: string): string[] {
  const m = /choices: \[([^\]]*)\]/.exec(block);
  return m ? [...m[1].matchAll(new RegExp(LITERAL, 'g'))].map((x) => unquote(x[0])) : [];
}

function applyPatch(id: string, block: string, patch: AuditPatch & { whyOthersWrong?: string[] }): string {
  if (patch.question !== undefined) block = setField(block, 'question', patch.question);
  if (patch.choices) block = block.replace(/choices: \[[^\]]*\],/, () => `choices: [${patch.choices!.map(quote).join(', ')}],`);
  if (patch.correctAnswer !== undefined) block = setField(block, 'correctAnswer', patch.correctAnswer);
  if (patch.translationJa !== undefined) block = setField(block, 'translationJa', patch.translationJa);
  if (patch.explanation !== undefined) block = setField(block, 'explanation', patch.explanation);
  if (patch.replaceInExplanation) {
    const [from, to] = patch.replaceInExplanation;
    const current = readField(block, 'explanation')!;
    if (current.includes(from)) block = setField(block, 'explanation', current.replace(from, to));
    else if (!current.includes(to)) throw new Error(`${id}: text to replace not found`);
  }
  if (patch.add) {
    const current = readField(block, 'explanation');
    if (current === undefined) throw new Error(`${id}: explanation not found`);
    if (!current.includes(patch.add)) block = setField(block, 'explanation', `${current}${patch.add}`);
  }

  const choices = readChoices(block);
  const correct = readField(block, 'correctAnswer');
  if (correct !== undefined && choices.length > 0 && !choices.includes(correct)) throw new Error(`${id}: correctAnswer not among choices`);
  if (patch.whyOthersWrong) {
    if (choices.length !== patch.whyOthersWrong.length) throw new Error(`${id}: whyOthersWrong length != choices`);
    if (correct !== undefined && choices[patch.whyOthersWrong.indexOf('(正解)')] !== correct) throw new Error(`${id}: (正解) is not at the correct answer`);
    const arr = `whyOthersWrong: [\n${patch.whyOthersWrong.map((w) => `      ${quote(w)},`).join('\n')}\n    ],`;
    if (/whyOthersWrong: \[[\s\S]*?\],/.test(block)) block = block.replace(/whyOthersWrong: \[[\s\S]*?\],/, () => arr);
    else block = block.replace(new RegExp(`explanation: (?:${LITERAL}),`), (m) => `${m}\n    ${arr}`);
  }
  return block;
}

function applyToFiles(paths: string[], patches: Record<string, AuditPatch>): number {
  let applied = 0;
  const remaining = new Set(Object.keys(patches));
  for (const path of paths) {
    let src = readFileSync(path, 'utf8');
    for (const [id, patch] of Object.entries(patches)) {
      const start = src.indexOf(`id: '${id}',`);
      if (start === -1) continue;
      remaining.delete(id);
      const end = src.indexOf('\n  },', start);
      src = src.slice(0, start) + applyPatch(id, src.slice(start, end), patch) + src.slice(end);
      applied++;
    }
    writeFileSync(path, src);
  }
  if (remaining.size > 0) throw new Error(`not found: ${[...remaining].join(', ')}`);
  return applied;
}

const levels = [1, 2, 3, 4, 5, 6];
const reinforcement = Object.fromEntries(Object.entries(EXPLANATION_PATCHES).map(([id, p]) => [id, { reason: '解説の補強', ...p }]));
console.log(`reinforced ${applyToFiles(levels.map((l) => `src/data/grammar/level${l}.ts`), reinforcement)} grammar explanations`);
console.log(`audit fixes: ${applyToFiles(levels.map((l) => `src/data/grammar/level${l}.ts`), GRAMMAR_AUDIT_PATCHES)} grammar questions`);
console.log(`audit fixes: ${applyToFiles(levels.map((l) => `src/data/questions/level${l}.ts`), READING_AUDIT_PATCHES)} reading questions`);
