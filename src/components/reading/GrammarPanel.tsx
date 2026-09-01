import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type { GrammarPoint } from '../../types';
import { addGrammarToReview } from '../../services/reviewService';

interface GrammarPanelProps {
  point: GrammarPoint | null;
  materialId: string;
  onClose: () => void;
}

export default function GrammarPanel({ point, materialId, onClose }: GrammarPanelProps) {
  const [added, setAdded] = useState(false);

  if (!point) return null;

  const handleAdd = async () => {
    await addGrammarToReview(point, materialId);
    setAdded(true);
  };

  return (
    <Modal open={!!point} onClose={onClose} title="文法解説">
      <div className="flex flex-col gap-4">
        <p className="rounded-xl bg-slate-50 p-3 text-base leading-relaxed text-slate-900 dark:bg-slate-800 dark:text-slate-100">
          {point.sentence}
        </p>
        <p className="text-slate-600 dark:text-slate-300">{point.translationJa}</p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-950/40">
            <p className="text-xs font-medium text-blue-500">主語 (S)</p>
            <p className="font-medium text-blue-900 dark:text-blue-200">{point.subject}</p>
          </div>
          <div className="rounded-xl bg-purple-50 p-3 dark:bg-purple-950/40">
            <p className="text-xs font-medium text-purple-500">動詞 (V)</p>
            <p className="font-medium text-purple-900 dark:text-purple-200">{point.verb}</p>
          </div>
          {point.object && (
            <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-950/40">
              <p className="text-xs font-medium text-amber-600">目的語 (O)</p>
              <p className="font-medium text-amber-900 dark:text-amber-200">{point.object}</p>
            </div>
          )}
          {point.modifiers && point.modifiers.length > 0 && (
            <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-800">
              <p className="text-xs font-medium text-slate-500">修飾語</p>
              <p className="font-medium text-slate-700 dark:text-slate-200">{point.modifiers.join(' / ')}</p>
            </div>
          )}
        </div>

        <div>
          <p className="mb-1 text-xs font-medium text-slate-400">文法ポイント</p>
          <ul className="list-inside list-disc text-sm text-slate-600 dark:text-slate-300">
            {point.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>

        <Button variant={added ? 'secondary' : 'primary'} onClick={handleAdd} disabled={added}>
          {added ? '✓ 復習リストに追加しました' : '復習リストに追加する'}
        </Button>
      </div>
    </Modal>
  );
}
