/**
 * Grammar tags are internal IDs: they key weakness analysis, review selection, drills and the
 * Theory <-> Practice link, and are stored on every answered ReviewItem. What the learner sees is
 * the label below (falling back to the ID itself, which for most tags is already readable Japanese).
 *
 * LEGACY_TAG_IDS maps spellings that were once used for the same grammar point to its ID, so
 * records saved with an old spelling are grouped with the new ones (see DB v5 upgrade and
 * canonicalTag, which is also applied when reading).
 */
export const GRAMMAR_TAG_LABELS: Record<string, string> = {
  'there-is-are': 'There is / There are',
};

export const LEGACY_TAG_IDS: Record<string, string> = {
  'There is/are': 'there-is-are',
};

export function canonicalTag(tag: string): string;
export function canonicalTag(tag: string | undefined): string | undefined;
export function canonicalTag(tag: string | undefined): string | undefined {
  return tag === undefined ? undefined : (LEGACY_TAG_IDS[tag] ?? tag);
}

export function tagLabel(tag: string): string {
  const id = canonicalTag(tag);
  return GRAMMAR_TAG_LABELS[id] ?? id;
}
