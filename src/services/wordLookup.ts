import type { Level, VocabularyEntry, VocabularyItem } from '../types';
import type { DictionaryEntry } from '../data/dictionary/enJa';
import { loadAllVocabulary } from '../data/vocabulary/loader';
import { getAllReviewItems } from '../db/repositories/reviewRepository';

/** refId prefix for words the learner registered by hand from the word popover. */
export const CUSTOM_WORD_REF_PREFIX = 'vocab-custom-';
/** refId prefix for words saved from the built-in dictionary (data/dictionary). */
export const DICTIONARY_WORD_REF_PREFIX = 'vocab-dict-';

export type WordSource = 'material' | 'bank' | 'custom' | 'dictionary' | 'compound' | 'unknown';

export interface WordLookupResult {
  /** the word as it appears in the text, punctuation stripped */
  surface: string;
  /** the headword that matched (or the normalized surface when nothing matched) */
  headword: string;
  source: WordSource;
  partOfSpeech?: string;
  meaningJa?: string;
  pronunciation?: string;
  /** the word's own basic example sentence (from the word bank or dictionary), never a passage sentence */
  standardExampleEn?: string;
  standardExampleJa?: string;
  /** phrases the word is commonly used in ("apply for", "depend on") */
  collocations?: readonly string[];
  level?: Level;
  materialItem?: VocabularyItem;
  bankEntry?: VocabularyEntry;
}

// ---------------------------------------------------------------------------
// Tokenizing

export type TextSegment =
  | { kind: 'text'; text: string }
  | { kind: 'word'; text: string; isKey: boolean; /** offset of the word in the source text */ start: number };

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

  const pushPlain = (chunk: string, offset: number) => {
    let last = 0;
    for (const m of chunk.matchAll(WORD_RE)) {
      if (m.index > last) segments.push({ kind: 'text', text: chunk.slice(last, m.index) });
      const isKey = lemmaCandidates(m[0]).some((c) => keyWords.has(c));
      segments.push({ kind: 'word', text: m[0], isKey, start: offset + m.index });
      last = m.index + m[0].length;
    }
    if (last < chunk.length) segments.push({ kind: 'text', text: chunk.slice(last) });
  };

  if (keyPhrases.length === 0) {
    pushPlain(text, 0);
    return segments;
  }

  const sorted = [...keyPhrases].sort((a, b) => b.length - a.length);
  const phraseRe = new RegExp(`\\b(${sorted.map(escapeRegExp).join('|')})\\b`, 'gi');
  let last = 0;
  for (const m of text.matchAll(phraseRe)) {
    if (m.index > last) pushPlain(text.slice(last, m.index), last);
    segments.push({ kind: 'word', text: m[0], isKey: true, start: m.index });
    last = m.index + m[0].length;
  }
  if (last < text.length) pushPlain(text.slice(last), last);
  return segments;
}

// Sentence ends: . ! ? (plus closing quotes / brackets) before whitespace, or a line break.
const SENTENCE_END_RE = /[.!?]+["”’)\]]*(?=\s|$)|\n/g;
const ABBREVIATIONS = new Set(['mr', 'mrs', 'ms', 'dr', 'st', 'vs', 'etc', 'e.g', 'i.e', 'no', 'fig', 'approx', 'u.s', 'jr', 'sr', 'inc', 'ltd', 'co', 'dept', 'ave']);

/** The sentence of `text` that contains the character at `index` — used as the word's
 * in-context example. A period is not a sentence end before a lowercase word (3 p.m. on Monday)
 * or after an abbreviation (Dr. Kim, e.g.) or an initial (J. Smith). */
export function extractSentence(text: string, index: number): string {
  let start = 0;
  for (const m of text.matchAll(SENTENCE_END_RE)) {
    if (m[0].startsWith('.')) {
      if (/^\s+[a-z]/.test(text.slice(m.index + m[0].length))) continue;
      const before = /([A-Za-z.]+)$/.exec(text.slice(0, m.index))?.[1].toLowerCase();
      if (before && (before.length === 1 || ABBREVIATIONS.has(before))) continue;
    }
    const end = m.index + m[0].length;
    if (end > index) return text.slice(start, end).trim();
    start = end;
  }
  return text.slice(start).trim();
}

// ---------------------------------------------------------------------------
// Base-form normalization

const IRREGULAR: Record<string, string> = {
  am: 'be', is: 'be', are: 'be', was: 'be', were: 'be', been: 'be', being: 'be',
  has: 'have', had: 'have', having: 'have', does: 'do', did: 'do', done: 'do', doing: 'do',
  went: 'go', gone: 'go', goes: 'go', made: 'make', took: 'take', taken: 'take', said: 'say',
  came: 'come', saw: 'see', seen: 'see', got: 'get', gotten: 'get', gave: 'give', given: 'give',
  found: 'find', thought: 'think', told: 'tell', became: 'become', left: 'leave', felt: 'feel',
  brought: 'bring', began: 'begin', begun: 'begin', kept: 'keep', held: 'hold', wrote: 'write',
  written: 'write', stood: 'stand', heard: 'hear', meant: 'mean', met: 'meet', ran: 'run',
  paid: 'pay', sat: 'sit', spoke: 'speak', spoken: 'speak', led: 'lead', grew: 'grow', grown: 'grow',
  lost: 'lose', fell: 'fall', fallen: 'fall', sent: 'send', built: 'build', understood: 'understand',
  drew: 'draw', drawn: 'draw', showed: 'show', shown: 'show', broke: 'break', broken: 'break', spent: 'spend', rose: 'rise',
  risen: 'rise', drove: 'drive', driven: 'drive', bought: 'buy', wore: 'wear', worn: 'wear',
  chose: 'choose', chosen: 'choose', sought: 'seek', taught: 'teach', caught: 'catch',
  fought: 'fight', threw: 'throw', thrown: 'throw', ate: 'eat', eaten: 'eat', knew: 'know',
  known: 'know', sold: 'sell', slept: 'sleep', woke: 'wake', woken: 'wake', forgot: 'forget',
  forgotten: 'forget', flew: 'fly', flown: 'fly', drank: 'drink', drunk: 'drink', sang: 'sing',
  sung: 'sing', swam: 'swim', hid: 'hide', hidden: 'hide', shook: 'shake', shaken: 'shake',
  laid: 'lay', lain: 'lie', lying: 'lie', dying: 'die', tying: 'tie', dealt: 'deal', fed: 'feed',
  bore: 'bear', born: 'bear', struck: 'strike', won: 'win', underwent: 'undergo', undergone: 'undergo',
  arose: 'arise', arisen: 'arise', rode: 'ride', ridden: 'ride', hung: 'hang', stuck: 'stick',
  swept: 'sweep', bent: 'bend', bled: 'bleed', dug: 'dig', fled: 'flee', froze: 'freeze',
  frozen: 'freeze', lent: 'lend', overcame: 'overcome', stole: 'steal', stolen: 'steal',
  strove: 'strive', striven: 'strive', tore: 'tear', torn: 'tear', withdrew: 'withdraw',
  withdrawn: 'withdraw', blew: 'blow', blown: 'blow', forgave: 'forgive', forgiven: 'forgive',
  mistook: 'mistake', proven: 'prove', rang: 'ring', rung: 'ring', sank: 'sink', sunk: 'sink',
  shone: 'shine', shrank: 'shrink', sprang: 'spring', swung: 'swing', woven: 'weave',
  children: 'child', men: 'man', women: 'woman', feet: 'foot', teeth: 'tooth', mice: 'mouse',
  geese: 'goose', lives: 'life', leaves: 'leaf', wives: 'wife', knives: 'knife', halves: 'half',
  analyses: 'analysis', hypotheses: 'hypothesis', criteria: 'criterion', phenomena: 'phenomenon',
  data: 'datum', bacteria: 'bacterium', better: 'good', best: 'good', worse: 'bad', worst: 'bad',
};

const DOUBLED_END = /([b-df-hj-np-tv-z])\1$/;

/** Ordered lookup candidates for a token: the word itself first, then likely base forms
 * (plural / 3rd-person -s/-es, -ed, -ing, comparatives -er/-est, -ly, irregular forms).
 * Candidates are guesses, so lookups try them in order and an exact surface match wins. */
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
  // stem + "e" goes first: used → use (not "us"), hoping → hope (not "hop").
  const addStem = (stem: string) => {
    add(stem + 'e');
    add(stem);
    if (DOUBLED_END.test(stem)) add(stem.slice(0, -1));
  };

  if (IRREGULAR[w]) add(IRREGULAR[w]);

  if (w.endsWith('ies')) add(w.slice(0, -3) + 'y');
  // plain -s before -es: uses → use (not "us"), cases → case; then boxes → box, gases → gas.
  if (w.endsWith('s') && !w.endsWith('ss')) add(w.slice(0, -1));
  if (/(ches|shes|sses|xes|zes|ses|oes)$/.test(w)) add(w.slice(0, -2));

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
let dictionary: Promise<Record<string, DictionaryEntry>> | null = null;

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

/** The built-in English → Japanese dictionary, loaded on demand as its own chunk. */
export function getDictionary(): Promise<Record<string, DictionaryEntry>> {
  dictionary ??= import('../data/dictionary/enJa')
    .then((m) => m.EN_JA_DICTIONARY)
    .catch((err) => {
      dictionary = null;
      throw err;
    });
  return dictionary;
}

/** Starts loading the word bank and dictionary in the background so the first lookup is quick. */
export function preloadWordBank(): void {
  getBankIndex().catch(() => {});
  getDictionary().catch(() => {});
}

interface CustomWord {
  meaningJa: string;
  partOfSpeech?: string;
}

async function getCustomWords(): Promise<Map<string, CustomWord>> {
  const items = await getAllReviewItems();
  const map = new Map<string, CustomWord>();
  for (const item of items) {
    if (item.refId.startsWith(CUSTOM_WORD_REF_PREFIX)) {
      map.set(item.refId.slice(CUSTOM_WORD_REF_PREFIX.length), {
        meaningJa: item.word?.meaningJa ?? item.answerText,
        partOfSpeech: item.word?.partOfSpeech,
      });
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

/** First sense of a dictionary meaning, for compact compound glosses: "走る、運営する" → "走る". */
function firstSense(meaning: string): string {
  return meaning.split(/[、（(]/)[0];
}

/** Looks a tapped word up, trying each base-form candidate in turn against 1) the material's
 * vocabulary, 2) the app-wide word bank, 3) words the learner registered, 4) the built-in
 * dictionary. A hyphenated compound with no entry of its own is glossed part by part. */
export async function lookupWord(surface: string, options: WordLookupOptions = {}): Promise<WordLookupResult> {
  const [bank, custom, dict] = await Promise.all([
    getBankIndex().catch(() => new Map<string, VocabularyEntry[]>()),
    getCustomWords(),
    getDictionary().catch((): Record<string, DictionaryEntry> => ({})),
  ]);
  const material = new Map((options.materialVocabulary ?? []).map((v) => [v.word.toLowerCase(), v]));

  const pickBank = (entries: VocabularyEntry[]) => entries.find((e) => e.level === options.preferredLevel) ?? entries[0];

  /** The headword's standard example and collocations: the word bank's entry first, then the
   * built-in dictionary (each source may fill in what the other lacks). */
  const standardOf = (headword: string): Pick<WordLookupResult, 'standardExampleEn' | 'standardExampleJa' | 'collocations'> => {
    const key = headword.toLowerCase();
    const bankEntries = bank.get(key);
    const b = bankEntries && pickBank(bankEntries);
    const d = Object.hasOwn(dict, key) ? dict[key] : undefined;
    const [en, ja] = b?.exampleEn ? [b.exampleEn, b.exampleJa] : [d?.[2], d?.[3]];
    const collocations = b?.collocations?.length ? b.collocations : d?.[4];
    return { standardExampleEn: en, standardExampleJa: ja, collocations };
  };

  const find = (word: string): WordLookupResult | null => {
    for (const c of lemmaCandidates(word)) {
      const item = material.get(c);
      if (item) {
        const standard = standardOf(item.word);
        return {
          surface,
          headword: item.word,
          source: 'material',
          partOfSpeech: item.partOfSpeech,
          meaningJa: item.meaningJa,
          ...standard,
          // the material's own example is a general sentence too, but has no translation
          standardExampleEn: standard.standardExampleEn ?? item.example,
          materialItem: item,
        };
      }
      const entries = bank.get(c);
      if (entries) {
        const entry = pickBank(entries);
        return {
          surface,
          headword: entry.word,
          source: 'bank',
          partOfSpeech: entry.partOfSpeech,
          meaningJa: entry.meaningJa,
          pronunciation: entry.pronunciation,
          ...standardOf(entry.word),
          level: entry.level,
          bankEntry: entry,
        };
      }
      const mine = custom.get(c);
      if (mine) return { surface, headword: c, source: 'custom', ...mine, ...standardOf(c) };
      const entry = Object.hasOwn(dict, c) ? dict[c] : undefined;
      if (entry) return { surface, headword: c, source: 'dictionary', partOfSpeech: entry[0], meaningJa: entry[1], ...standardOf(c) };
    }
    return null;
  };

  const found = find(surface);
  if (found) return found;

  const headword = lemmaCandidates(surface)[0];
  if (surface.includes('-')) {
    const parts = surface.split('-').map((p) => ({ part: p, result: find(p) }));
    if (parts.some((p) => p.result)) {
      return {
        surface,
        headword,
        source: 'compound',
        meaningJa: parts
          .map(({ part, result }) => (result?.meaningJa ? `${part}（${firstSense(result.meaningJa)}）` : part))
          .join(' ＋ '),
      };
    }
  }
  return { surface, headword, source: 'unknown' };
}

/** The review-deck refId a looked-up word is (or would be) saved under. Material words reuse the
 * Reading bookmark format and bank words their bank id, so review can quiz them as real questions. */
export function reviewRefIdFor(result: WordLookupResult, materialId?: string): string {
  if (result.materialItem && materialId) return `vocab-${materialId}-${result.materialItem.word}`;
  if (result.bankEntry) return result.bankEntry.id;
  if (result.source === 'custom' || result.source === 'unknown') return `${CUSTOM_WORD_REF_PREFIX}${result.headword.toLowerCase()}`;
  return `${DICTIONARY_WORD_REF_PREFIX}${result.headword.toLowerCase()}`;
}

export interface StandardExample {
  standardExampleEn?: string;
  standardExampleJa?: string;
  collocations?: readonly string[];
}

/** A word's standard example as plain text — "example\n訳\nコロケーション: a / b" — the form
 * saved as a review item's explanation and shown after answering. */
export function formatStandardExample({ standardExampleEn, standardExampleJa, collocations }: StandardExample): string {
  return [
    standardExampleEn,
    standardExampleJa,
    collocations?.length ? `コロケーション: ${collocations.join(' / ')}` : undefined,
  ]
    .filter(Boolean)
    .join('\n');
}

/** Character ranges of `sentence` that are a form of `headword`, for highlighting the word in an
 * example: inflected forms (accepted → accept), phrases word by word ("looking forward to" for
 * "look forward to"; placeholders like "-ing" are skipped) and parts of hyphenated compounds
 * ("water-resistant" for "resistant"). */
export function findWordInSentence(sentence: string, headword: string): Array<[start: number, end: number]> {
  const targets = headword.toLowerCase().split(/\s+/).filter((p) => /^[a-z]/.test(p));
  if (targets.length === 0) return [];
  // Words of the sentence, with hyphenated compounds also split into their parts.
  const tokens: Array<{ start: number; end: number; lemmas: string[] }> = [];
  for (const m of sentence.matchAll(WORD_RE)) {
    tokens.push({ start: m.index, end: m.index + m[0].length, lemmas: lemmaCandidates(m[0]) });
    if (targets.length === 1 && m[0].includes('-')) {
      let offset = m.index;
      for (const part of m[0].split('-')) {
        tokens.push({ start: offset, end: offset + part.length, lemmas: lemmaCandidates(part) });
        offset += part.length + 1;
      }
    }
  }
  const ranges: Array<[number, number]> = [];
  for (let i = 0; i + targets.length <= tokens.length; i++) {
    if (targets.every((t, k) => tokens[i + k].lemmas.includes(t))) {
      ranges.push([tokens[i].start, tokens[i + targets.length - 1].end]);
      if (targets.length === 1) continue;
      i += targets.length - 1;
    }
  }
  return ranges;
}

export const PART_OF_SPEECH_JA: Record<string, string> = {
  noun: '名詞',
  verb: '動詞',
  adjective: '形容詞',
  adverb: '副詞',
  preposition: '前置詞',
  conjunction: '接続詞',
  pronoun: '代名詞',
  article: '冠詞',
  determiner: '限定詞',
  auxiliary: '助動詞',
  interjection: '間投詞',
  number: '数詞',
  'proper noun': '固有名詞',
  abbreviation: '略語',
  prefix: '接頭辞',
  phrase: '熟語',
  'phrasal verb': '句動詞',
  'modal verb': '助動詞',
};
