import type { Level, VocabularyEntry, VocabularyItem } from '../types';
import { loadAllVocabulary } from '../data/vocabulary/loader';
import { getAllReviewItems } from '../db/repositories/reviewRepository';

/** refId prefix for words the learner registered by hand from the word popover. */
export const CUSTOM_WORD_REF_PREFIX = 'vocab-custom-';

export type WordSource = 'material' | 'bank' | 'custom' | 'unknown';

export interface WordLookupResult {
  /** the word as it appears in the text, punctuation stripped */
  surface: string;
  /** the headword that matched (or the normalized surface when nothing matched) */
  headword: string;
  source: WordSource;
  partOfSpeech?: string;
  meaningJa?: string;
  pronunciation?: string;
  exampleEn?: string;
  exampleJa?: string;
  level?: Level;
  materialItem?: VocabularyItem;
  bankEntry?: VocabularyEntry;
}

// ---------------------------------------------------------------------------
// Tokenizing

export type TextSegment = { kind: 'text'; text: string } | { kind: 'word'; text: string; isKey: boolean };

// Latin letters only, so Japanese text in mixed passages stays plain. Keeps contractions
// (don't, it's) and hyphenated compounds (well-known) together as one token.
const WORD_RE = /[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)*(?:-[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['’][A-Za-zÀ-ÖØ-öø-ÿ]+)*)*/g;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Splits a paragraph into tappable words and the plain text (spaces, punctuation, numbers)
 * between them. Multi-word key phrases ("look forward to") stay together as one tappable unit. */
export function tokenizeText(text: string, keyWords: ReadonlySet<string>, keyPhrases: readonly string[]): TextSegment[] {
  const segments: TextSegment[] = [];

  const pushPlain = (chunk: string) => {
    let last = 0;
    for (const m of chunk.matchAll(WORD_RE)) {
      if (m.index > last) segments.push({ kind: 'text', text: chunk.slice(last, m.index) });
      const isKey = lemmaCandidates(m[0]).some((c) => keyWords.has(c));
      segments.push({ kind: 'word', text: m[0], isKey });
      last = m.index + m[0].length;
    }
    if (last < chunk.length) segments.push({ kind: 'text', text: chunk.slice(last) });
  };

  if (keyPhrases.length === 0) {
    pushPlain(text);
    return segments;
  }

  const sorted = [...keyPhrases].sort((a, b) => b.length - a.length);
  const phraseRe = new RegExp(`\\b(${sorted.map(escapeRegExp).join('|')})\\b`, 'gi');
  let last = 0;
  for (const m of text.matchAll(phraseRe)) {
    if (m.index > last) pushPlain(text.slice(last, m.index));
    segments.push({ kind: 'word', text: m[0], isKey: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) pushPlain(text.slice(last));
  return segments;
}

// ---------------------------------------------------------------------------
// Base-form normalization

const IRREGULAR: Record<string, string> = {
  am: 'be', is: 'be', are: 'be', was: 'be', were: 'be', been: 'be', being: 'be',
  has: 'have', had: 'have', having: 'have', does: 'do', did: 'do', done: 'do',
  went: 'go', gone: 'go', goes: 'go', made: 'make', took: 'take', taken: 'take',
  came: 'come', saw: 'see', seen: 'see', got: 'get', gotten: 'get', gave: 'give', given: 'give',
  found: 'find', thought: 'think', told: 'tell', became: 'become', left: 'leave', felt: 'feel',
  brought: 'bring', began: 'begin', begun: 'begin', kept: 'keep', held: 'hold', wrote: 'write',
  written: 'write', stood: 'stand', heard: 'hear', meant: 'mean', met: 'meet', ran: 'run',
  paid: 'pay', sat: 'sit', spoke: 'speak', spoken: 'speak', led: 'lead', grew: 'grow', grown: 'grow',
  lost: 'lose', fell: 'fall', fallen: 'fall', sent: 'send', built: 'build', understood: 'understand',
  drew: 'draw', drawn: 'draw', broke: 'break', broken: 'break', spent: 'spend', rose: 'rise',
  risen: 'rise', drove: 'drive', driven: 'drive', bought: 'buy', wore: 'wear', worn: 'wear',
  chose: 'choose', chosen: 'choose', sought: 'seek', taught: 'teach', caught: 'catch',
  fought: 'fight', threw: 'throw', thrown: 'throw', ate: 'eat', eaten: 'eat', knew: 'know',
  known: 'know', sold: 'sell', slept: 'sleep', woke: 'wake', woken: 'wake', forgot: 'forget',
  forgotten: 'forget', flew: 'fly', flown: 'fly', drank: 'drink', drunk: 'drink', sang: 'sing',
  swam: 'swim', hid: 'hide', hidden: 'hide', shook: 'shake', shaken: 'shake', laid: 'lay',
  lain: 'lie', dealt: 'deal', fed: 'feed', bore: 'bear', born: 'bear', struck: 'strike', won: 'win',
  children: 'child', men: 'man', women: 'woman', feet: 'foot', teeth: 'tooth', mice: 'mouse',
  geese: 'goose', lives: 'life', leaves: 'leaf', wives: 'wife', knives: 'knife', halves: 'half',
  analyses: 'analysis', hypotheses: 'hypothesis', criteria: 'criterion', phenomena: 'phenomenon',
  data: 'datum', bacteria: 'bacterium', better: 'good', best: 'good', worse: 'bad', worst: 'bad',
};

const DOUBLED_END = /([b-df-hj-np-tv-z])\1$/;

/** Ordered lookup candidates for a token: the word itself first, then likely base forms
 * (plural / 3rd-person -s, -ed, -ing, comparatives, -ly, irregular forms). Exported for
 * highlighting; candidates are guesses, so an exact surface match always wins. */
export function lemmaCandidates(raw: string): string[] {
  const w = raw
    .toLowerCase()
    .replace(/’/g, "'")
    .replace(/^[^a-zà-öø-ÿ]+|[^a-zà-öø-ÿ]+$/g, '')
    .replace(/'s$/, '')
    .replace(/s'$/, 's');
  const out: string[] = [w];
  const add = (s: string) => {
    if (s.length >= 2 && !out.includes(s)) out.push(s);
  };
  const addStem = (stem: string) => {
    add(stem);
    add(stem + 'e');
    if (DOUBLED_END.test(stem)) add(stem.slice(0, -1));
  };

  if (IRREGULAR[w]) add(IRREGULAR[w]);

  if (w.endsWith('ies')) add(w.slice(0, -3) + 'y');
  if (/(ches|shes|sses|xes|zes|oes)$/.test(w)) add(w.slice(0, -2));
  if (w.endsWith('s') && !w.endsWith('ss')) add(w.slice(0, -1));

  if (w.endsWith('ied')) add(w.slice(0, -3) + 'y');
  if (w.endsWith('ed')) addStem(w.slice(0, -2));
  if (w.endsWith('ing')) addStem(w.slice(0, -3));

  if (w.endsWith('iest')) add(w.slice(0, -4) + 'y');
  else if (w.endsWith('est')) addStem(w.slice(0, -3));
  if (w.endsWith('ier')) add(w.slice(0, -3) + 'y');
  else if (w.endsWith('er')) addStem(w.slice(0, -2));

  if (w.endsWith('ily')) add(w.slice(0, -3) + 'y');
  else if (w.endsWith('ly')) add(w.slice(0, -2));

  return out;
}

// ---------------------------------------------------------------------------
// Dictionary lookup

let bankIndex: Promise<Map<string, VocabularyEntry[]>> | null = null;

function getBankIndex(): Promise<Map<string, VocabularyEntry[]>> {
  bankIndex ??= loadAllVocabulary()
    .then((all) => {
      const map = new Map<string, VocabularyEntry[]>();
      for (const e of all) {
        const key = e.word.toLowerCase();
        const list = map.get(key);
        if (list) list.push(e);
        else map.set(key, [e]);
      }
      return map;
    })
    .catch((err) => {
      bankIndex = null; // allow a retry on the next tap (e.g. a chunk failed to load offline)
      throw err;
    });
  return bankIndex;
}

/** Starts loading the word bank in the background so the first lookup is quick. */
export function preloadWordBank(): void {
  getBankIndex().catch(() => {});
}

interface CustomWord {
  meaningJa: string;
  exampleEn?: string;
}

async function getCustomWords(): Promise<Map<string, CustomWord>> {
  const items = await getAllReviewItems();
  const map = new Map<string, CustomWord>();
  for (const item of items) {
    if (item.refId.startsWith(CUSTOM_WORD_REF_PREFIX)) {
      map.set(item.refId.slice(CUSTOM_WORD_REF_PREFIX.length), { meaningJa: item.answerText, exampleEn: item.explanation });
    }
  }
  return map;
}

export interface WordLookupOptions {
  /** the current material's key vocabulary, searched before the word bank */
  materialVocabulary?: readonly VocabularyItem[];
  /** when a word is in several levels of the bank, prefer this one */
  preferredLevel?: Level;
}

/** Looks a tapped word up, trying each base-form candidate in turn against
 * 1) the material's vocabulary, 2) the app-wide word bank, 3) words the learner registered. */
export async function lookupWord(surface: string, options: WordLookupOptions = {}): Promise<WordLookupResult> {
  const [bank, custom] = await Promise.all([
    getBankIndex().catch(() => new Map<string, VocabularyEntry[]>()),
    getCustomWords(),
  ]);
  const material = new Map((options.materialVocabulary ?? []).map((v) => [v.word.toLowerCase(), v]));

  const tryCandidates = (candidates: string[]): WordLookupResult | null => {
    for (const c of candidates) {
      const item = material.get(c);
      if (item) {
        return {
          surface,
          headword: item.word,
          source: 'material',
          partOfSpeech: item.partOfSpeech,
          meaningJa: item.meaningJa,
          exampleEn: item.example,
          materialItem: item,
        };
      }
      const entries = bank.get(c);
      if (entries) {
        const entry = entries.find((e) => e.level === options.preferredLevel) ?? entries[0];
        return {
          surface,
          headword: entry.word,
          source: 'bank',
          partOfSpeech: entry.partOfSpeech,
          meaningJa: entry.meaningJa,
          pronunciation: entry.pronunciation,
          exampleEn: entry.exampleEn,
          exampleJa: entry.exampleJa,
          level: entry.level,
          bankEntry: entry,
        };
      }
      const mine = custom.get(c);
      if (mine) {
        return { surface, headword: c, source: 'custom', meaningJa: mine.meaningJa, exampleEn: mine.exampleEn };
      }
    }
    return null;
  };

  const candidates = lemmaCandidates(surface);
  const found =
    tryCandidates(candidates) ??
    // Hyphenated compound with no entry of its own: fall back to its last part (well-known → known).
    (surface.includes('-') ? tryCandidates(lemmaCandidates(surface.split('-').at(-1)!)) : null);
  return found ?? { surface, headword: candidates[0], source: 'unknown' };
}

/** The review-deck refId a looked-up word is (or would be) saved under. Material words reuse the
 * Reading bookmark format and bank words their bank id, so review can quiz them as real questions. */
export function reviewRefIdFor(result: WordLookupResult, materialId?: string): string {
  if (result.materialItem && materialId) return `vocab-${materialId}-${result.materialItem.word}`;
  if (result.bankEntry) return result.bankEntry.id;
  return `${CUSTOM_WORD_REF_PREFIX}${result.headword.toLowerCase()}`;
}

export const PART_OF_SPEECH_JA: Record<string, string> = {
  noun: '名詞',
  verb: '動詞',
  adjective: '形容詞',
  adverb: '副詞',
  preposition: '前置詞',
  conjunction: '接続詞',
  pronoun: '代名詞',
  phrase: '熟語',
  'phrasal verb': '句動詞',
  'modal verb': '助動詞',
};
