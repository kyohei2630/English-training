import { Link } from 'react-router-dom';
import Card from '../common/Card';
import type { AssessmentResult, AssessmentSection } from '../../types';
import {
  ABILITY_AREA_LABELS,
  ASSESSMENT_SECTION_LABELS,
  compareAssessments,
  type AssessmentComparison,
  type SectionComparison,
  changeInPoints,
  formatRate,
  isMeasured,
  MIN_SAMPLES,
  type AbilityRow,
  type Rate,
} from '../../services/abilityService';
import { formatDateJa } from '../../utils/date';

function Cell({ rate }: { rate: Rate }) {
  const measured = isMeasured(rate);
  return (
    <td className={`px-1 py-2 text-center ${measured ? 'font-bold' : 'text-xs text-slate-400'}`}>
      {formatRate(rate)}
      {measured && <span className="block text-[10px] font-normal text-slate-400">{rate.total}問</span>}
    </td>
  );
}

export function AbilityProfileCard({ rows }: { rows: AbilityRow[] }) {
  const writing = rows.find((r) => r.area === 'writing');
  return (
    <Card>
      <h2 className="mb-1 text-sm font-bold text-slate-500 dark:text-slate-400">実力プロファイル</h2>
      <p className="mb-3 text-xs text-slate-400">
        既習＝前に解いた問題、初見＝初めて見た問題（実力確認を含む）、遅延復習＝1週間以上あけて解いた問題。{MIN_SAMPLES}問未満は「未確認」です。同じ問題の正解をくり返しても初見・遅延の値は上がりません。
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-500">
              <th className="py-1 text-left font-medium">分野</th>
              <th className="px-1 font-medium">既習</th>
              <th className="px-1 font-medium">初見</th>
              <th className="px-1 font-medium">遅延復習</th>
              <th className="px-1 font-medium">初見の変化</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const change = changeInPoints(r.unseenRecent, r.unseenPrevious);
              return (
                <tr key={r.area} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="py-2 text-left">{ABILITY_AREA_LABELS[r.area]}</td>
                  <Cell rate={r.practiced} />
                  <Cell rate={r.unseen} />
                  <Cell rate={r.delayed} />
                  <td className="px-1 py-2 text-center text-xs">
                    {change === undefined ? (
                      <span className="text-slate-400">未確認</span>
                    ) : (
                      <span className={change >= 0 ? 'text-green-600' : 'text-rose-600'}>
                        {change >= 0 ? '+' : ''}
                        {change}pt
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {writing && (
        <p className="mt-3 text-xs text-slate-500">
          英作文の内訳：自動判定 {formatRate(writing.autoGraded)}／自己評価 {formatRate(writing.selfGraded)}
          （自由記述はアプリで採点できないため、自己評価は参考値です）
        </p>
      )}
      <p className="mt-1 text-xs text-slate-400">初見の変化＝直近4週間とその前の4週間の初見正答率の差（このバージョン以降の記録から計算）。</p>
    </Card>
  );
}


/** Change from the previous assessment: a plain 前回比 only when both were taken under the same
 * conditions; otherwise marked 参考 with the reasons, never shown as an equal comparison. */
export function ChangeBadge({ comparison }: { comparison?: SectionComparison }) {
  if (!comparison) return null;
  const { change, comparable } = comparison;
  const sign = change >= 0 ? '+' : '';
  return comparable ? (
    <span className={`ml-2 text-xs ${change >= 0 ? 'text-green-600' : 'text-rose-600'}`}>
      前回比 {sign}
      {change}pt
    </span>
  ) : (
    <span className="ml-2 text-xs font-normal text-slate-400">
      参考 {sign}
      {change}pt（比較精度は限定的）
    </span>
  );
}

/** Why some changes are only indicative, and how the difficulty is estimated. */
export function ComparisonNotes({ comparison, notes }: { comparison: AssessmentComparison | null; notes?: string[] }) {
  const reasons = comparison
    ? [...comparison.overall, ...Object.entries(comparison.sections).flatMap(([k, c]) => (c?.reasons ?? []).map((r) => `${ASSESSMENT_SECTION_LABELS[k as AssessmentSection]}: ${r}`))]
    : [];
  return (
    <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500">
      {reasons.length > 0 && (
        <div>
          <p className="font-medium">前回との比較が参考値になる理由</p>
          <ul className="list-inside list-disc">
            {reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}
      {notes && notes.length > 0 && (
        <div>
          <p className="font-medium">今回の出題構成について</p>
          <ul className="list-inside list-disc">
            {notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      )}
      <p>
        問題の難易度（基礎・標準・応用）は、問題文・選択肢・必要な知識・解答の手順から推定した暫定値です。解答データで検証した難易度ではありません。
      </p>
    </div>
  );
}

export function AssessmentHistoryCard({ results, nextDate, due }: { results: AssessmentResult[]; nextDate?: string; due: boolean }) {
  const comparison = compareAssessments(results);
  const recent = results.slice(-4).reverse();
  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400">4週間ごとの実力確認</h2>
        <Link to="/assessment" className="text-xs text-blue-600 dark:text-blue-400">
          {due ? '受ける →' : '詳細 →'}
        </Link>
      </div>
      {results.length === 0 ? (
        <p className="text-sm text-slate-500">まだ受けていません。最初の結果が、今後の変化を比べる基準になります。</p>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {recent.map((r, idx) => (
              <div key={r.id}>
                <p className="mb-1 text-xs text-slate-500">
                  {formatDateJa(r.date)}・Level {r.level}・初見 {Math.round(r.unseenRatio * 100)}%
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(ASSESSMENT_SECTION_LABELS) as AssessmentSection[]).map((k) => {
                    const s = r.sections[k];
                    if (!s) return null;
                    return (
                      <span key={k} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs dark:bg-slate-800">
                        {ASSESSMENT_SECTION_LABELS[k]} {s.correct}/{s.total}
                        {idx === 0 && <ChangeBadge comparison={comparison?.sections[k]} />}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <ComparisonNotes comparison={comparison} notes={results.at(-1)?.selectionNotes} />
          {!due && nextDate && <p className="mt-3 text-xs text-slate-400">次回: {formatDateJa(nextDate)}</p>}
        </>
      )}
    </Card>
  );
}
