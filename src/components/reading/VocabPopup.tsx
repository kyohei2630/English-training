import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import type { VocabularyItem } from '../../types';
import { addWordToReview } from '../../services/reviewService';

interface VocabPopupProps {
  word: VocabularyItem | null;
  materialId: string;
  onClose: () => void;
}

export default function VocabPopup({ word, materialId, onClose }: VocabPopupProps) {
  const [added, setAdded] = useState(false);

  if (!word) return null;

  const handleAdd = async () => {
    await addWordToReview(word, materialId);
    setAdded(true);
  };

  return (
    <Modal open={!!word} onClose={onClose} title={word.word}>
      <div className="flex flex-col gap-3">
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {word.partOfSpeech}
        </span>
        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{word.meaningJa}</p>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <p className="mb-1 text-xs font-medium text-slate-400">例文</p>
          {word.example}
        </div>
        <Button variant={added ? 'secondary' : 'primary'} onClick={handleAdd} disabled={added}>
          {added ? '✓ 復習リストに追加しました' : '復習リストに追加する'}
        </Button>
      </div>
    </Modal>
  );
}
