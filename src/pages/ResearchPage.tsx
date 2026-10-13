import { useCallback, useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ResearchUnitView from '../components/research/ResearchUnitView';
import { loadResearchUnits } from '../data/research/loader';
import { getAllReviewItems } from '../db/repositories/reviewRepository';
import { useProgress } from '../hooks/useProgress';
import { nextResearchUnit, RESEARCH_SECTION_LABELS, RESEARCH_SECTIONS, unitStatus } from '../services/researchService';
import type { ResearchUnit, ReviewItem } from '../types';

const STATUS_LABELS = { new: '未学習', started: '学習中', done: '完了' } as const;

export default function ResearchPage() {
  const { progress } = useProgress();
  const [units, setUnits] = useState<ResearchUnit[]>([]);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [active, setActive] = useState<ResearchUnit | null>(null);

  const reload = useCallback(async () => {
    const [u, i] = await Promise.all([loadResearchUnits(), getAllReviewItems()]);
    setUnits(u);
    setItems(i);
  }, []);

  useEffect(() => {
    (async () => {
      await reload();
    })();
  }, [reload]);

  if (active) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={() => setActive(null)}>
          ← 一覧に戻る
        </Button>
        <ResearchUnitView
          key={active.id}
          unit={active}
          onComplete={async () => {
            setActive(null);
            await reload();
          }}
        />
      </div>
    );
  }

  const next = nextResearchUnit(units, progress.currentLevel, items);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">研究英語</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          短い研究英文で、英文構造・論理関係・学術表現を学び、自分でも1文書きます。研究目的 → 方法 → 結果 → 考察 → Abstract の順に、基礎レベルから少しずつ発展します。
        </p>
      </div>

      {next && (
        <Card className="border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/40">
          <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">次のおすすめ</p>
          <p className="mt-1 font-medium">
            L{next.level}・{RESEARCH_SECTION_LABELS[next.section]}：{next.titleJa}
          </p>
          <Button className="mt-3 w-full" onClick={() => setActive(next)}>
            始める
          </Button>
        </Card>
      )}

      {RESEARCH_SECTIONS.map((section) => {
        const list = units.filter((u) => u.section === section).sort((a, b) => a.level - b.level);
        if (list.length === 0) return null;
        return (
          <div key={section} className="flex flex-col gap-2">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400">{RESEARCH_SECTION_LABELS[section]}</h2>
            {list.map((u) => {
              const status = unitStatus(u, items);
              const ahead = u.level > progress.currentLevel;
              return (
                <Card key={u.id} onClick={() => setActive(u)} className="cursor-pointer py-3 transition-colors hover:border-indigo-300 dark:hover:border-indigo-700">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      L{u.level}・{u.titleJa}
                    </span>
                    <span className={`shrink-0 text-xs ${status === 'done' ? 'text-green-600' : 'text-slate-400'}`}>
                      {ahead && status === 'new' ? '先取り' : STATUS_LABELS[status]}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
