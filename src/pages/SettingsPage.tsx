import { useRef, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useSettings } from '../hooks/useSettings';
import { LEVELS } from '../data/levels';
import { buildExportBundle, downloadExportBundle, importExportBundle, ImportValidationError } from '../services/exportImport';
import { deleteAllSessions } from '../db/repositories/sessionRepository';
import { deleteAllReviewItems } from '../db/repositories/reviewRepository';
import { deleteAllToeicResults } from '../db/repositories/toeicResultRepository';
import { resetProgress } from '../db/repositories/progressRepository';
import { CONTENT_STATS } from '../data/contentStats.generated';
import type { Level } from '../types';

export default function SettingsPage() {
  const { settings, update } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmImportText, setConfirmImportText] = useState<string | null>(null);

  const handleExport = async () => {
    const bundle = await buildExportBundle();
    const filename = `english-training-backup-${bundle.exportedAt.slice(0, 10)}.json`;
    downloadExportBundle(bundle, filename);
    setMessage('学習データを書き出しました。');
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const text = await file.text();
    setConfirmImportText(text);
  };

  const runImport = async () => {
    if (!confirmImportText) return;
    try {
      await importExportBundle(confirmImportText);
      setMessage('学習データを読み込みました。ホーム画面などを再度開くと反映されます。');
    } catch (err) {
      setMessage(err instanceof ImportValidationError ? err.message : '読み込みに失敗しました。');
    } finally {
      setConfirmImportText(null);
    }
  };

  const runReset = async () => {
    await Promise.all([deleteAllSessions(), deleteAllReviewItems(), deleteAllToeicResults(), resetProgress()]);
    setConfirmReset(false);
    setMessage('学習データを初期化しました。');
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Settings</h1>

      {message && (
        <div className="rounded-xl bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">{message}</div>
      )}

      <Card>
        <h2 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">表示</h2>
        <div className="mb-4 flex items-center justify-between">
          <span>ダークモード</span>
          <button
            onClick={() => update({ darkMode: !settings.darkMode })}
            className={`tap-target h-8 w-14 rounded-full p-1 transition-colors ${settings.darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
            aria-label="ダークモード切り替え"
            role="switch"
            aria-checked={settings.darkMode}
          >
            <span className={`block h-6 w-6 rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : ''}`} />
          </button>
        </div>
        <div>
          <p className="mb-2 text-sm">文字サイズ</p>
          <div className="flex gap-2">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <button
                key={size}
                onClick={() => update({ fontSize: size })}
                className={`tap-target flex-1 rounded-xl border py-2 text-sm font-medium ${
                  settings.fontSize === size
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                {size === 'sm' ? '小' : size === 'md' ? '中' : '大'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">学習設定</h2>
        <p className="mb-2 text-sm">現在のLevel</p>
        <div className="grid grid-cols-3 gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.level}
              onClick={() => update({ currentLevel: l.level as Level })}
              className={`tap-target rounded-xl border py-2 text-sm font-medium ${
                settings.currentLevel === l.level
                  ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              Level {l.level}
            </button>
          ))}
        </div>

        <div className="mb-4 mt-4 flex items-center justify-between">
          <div>
            <span>自由学習モード</span>
            <p className="text-xs text-slate-400">OFFの場合はおすすめ学習ルートに沿った順番を案内します（レベルは常に自由に選べます）</p>
          </div>
          <button
            onClick={() => update({ freeStudyMode: !settings.freeStudyMode })}
            className={`tap-target h-8 w-14 shrink-0 rounded-full p-1 transition-colors ${settings.freeStudyMode ? 'bg-blue-600' : 'bg-slate-300'}`}
            aria-label="自由学習モード切り替え"
            role="switch"
            aria-checked={!!settings.freeStudyMode}
          >
            <span className={`block h-6 w-6 rounded-full bg-white transition-transform ${settings.freeStudyMode ? 'translate-x-6' : ''}`} />
          </button>
        </div>

        <p className="mb-2 mt-4 text-sm">1日の学習目標時間（分）</p>
        <input
          type="number"
          min={5}
          max={120}
          value={settings.dailyGoalMinutes}
          onChange={(e) => update({ dailyGoalMinutes: Number(e.target.value) || 30 })}
          className="w-full rounded-xl border border-slate-300 p-3 dark:border-slate-600 dark:bg-slate-900"
        />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">コンテンツ数</h2>
        <ul className="grid grid-cols-2 gap-2 text-sm">
          <li className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>Grammar</span><span className="font-bold">{CONTENT_STATS.grammar.total}</span>
          </li>
          <li className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>Vocabulary</span><span className="font-bold">{CONTENT_STATS.vocabulary.total}</span>
          </li>
          <li className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>Reading（教材）</span><span className="font-bold">{CONTENT_STATS.readingMaterials.total}</span>
          </li>
          <li className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>Reading（設問）</span><span className="font-bold">{CONTENT_STATS.readingQuestions.total}</span>
          </li>
          <li className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>Writing</span><span className="font-bold">{CONTENT_STATS.writing.total}</span>
          </li>
          <li className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>TOEIC</span><span className="font-bold">{CONTENT_STATS.toeic.total}</span>
          </li>
        </ul>
        <p className="mt-2 text-xs text-slate-400">
          合計 {CONTENT_STATS.grammar.total + CONTENT_STATS.vocabulary.total + CONTENT_STATS.readingMaterials.total + CONTENT_STATS.readingQuestions.total + CONTENT_STATS.writing.total + CONTENT_STATS.toeic.total} 件
          （{new Date(CONTENT_STATS.generatedAt).toLocaleDateString('ja-JP')} 時点）
        </p>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-bold text-slate-500 dark:text-slate-400">データ管理</h2>
        <div className="flex flex-col gap-2">
          <Button variant="secondary" onClick={handleExport}>
            学習データをExport（書き出す）
          </Button>
          <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
            学習データをImport（読み込む）
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileSelected} />
          <Button variant="danger" onClick={() => setConfirmReset(true)}>
            学習データを初期化する
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmReset}
        title="学習データを初期化しますか？"
        message={'この操作は取り消せません。\nすべての学習履歴・復習データ・進捗が削除されます。'}
        confirmLabel="初期化する"
        danger
        onConfirm={runReset}
        onCancel={() => setConfirmReset(false)}
      />

      <ConfirmDialog
        open={!!confirmImportText}
        title="学習データを読み込みますか？"
        message={'現在の学習データはすべて上書きされます。\nこの操作は取り消せません。'}
        confirmLabel="読み込む"
        danger
        onConfirm={runImport}
        onCancel={() => setConfirmImportText(null)}
      />
    </div>
  );
}
