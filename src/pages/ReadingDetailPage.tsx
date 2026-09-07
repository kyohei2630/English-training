import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReadingView from '../components/reading/ReadingView';
import UnderstandingQuiz from '../components/reading/UnderstandingQuiz';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { loadMaterialById, loadQuestionsForMaterial } from '../data/reading/loader';
import type { ReadingMaterial, UnderstandingQuestion } from '../types';

export default function ReadingDetailPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const [material, setMaterial] = useState<ReadingMaterial | null | undefined>(undefined);
  const [questions, setQuestions] = useState<UnderstandingQuestion[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null);

  useEffect(() => {
    if (!materialId) {
      setMaterial(null);
      return;
    }
    (async () => {
      const [m, q] = await Promise.all([loadMaterialById(materialId), loadQuestionsForMaterial(materialId)]);
      setMaterial(m ?? null);
      setQuestions(q);
    })();
  }, [materialId]);

  if (material === undefined) {
    return <div className="py-20 text-center text-slate-400">読み込み中...</div>;
  }

  if (!material) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-slate-500">教材が見つかりませんでした。</p>
        <Link to="/reading" className="text-blue-600 underline">
          Reading一覧に戻る
        </Link>
      </div>
    );
  }

  if (result) {
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <p className="text-4xl">✅</p>
        <h1 className="text-xl font-bold">理解度チェック完了</h1>
        <p className="text-lg">
          {result.correct} / {result.total} 問正解
        </p>
        <Button onClick={() => navigate('/reading')}>Reading一覧に戻る</Button>
      </Card>
    );
  }

  if (showQuiz) {
    return (
      <UnderstandingQuiz
        questions={questions}
        level={material.level}
        onComplete={(correct, total) => setResult({ correct, total })}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <ReadingView material={material} />
      {questions.length > 0 && (
        <Button size="lg" onClick={() => setShowQuiz(true)}>
          理解度チェックに進む
        </Button>
      )}
    </div>
  );
}
