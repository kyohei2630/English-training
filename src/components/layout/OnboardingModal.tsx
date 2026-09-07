import Modal from '../common/Modal';
import Button from '../common/Button';
import { useSettings } from '../../hooks/useSettings';

export default function OnboardingModal() {
  const { settings, loading, update } = useSettings();

  if (loading || settings.hasSeenOnboarding) return null;

  const dismiss = () => update({ hasSeenOnboarding: true });

  return (
    <Modal open onClose={dismiss} title="ようこそ">
      <div className="flex flex-col gap-4 text-sm">
        <p className="text-base font-medium">
          このアプリは、基礎英語からTOEIC、さらに英語論文を読む力まで段階的に伸ばします。
        </p>
        <ol className="list-decimal space-y-1 pl-5 text-slate-600 dark:text-slate-300">
          <li>Level 1〜3で中学・高校英語の基礎を固めます</li>
          <li>Level 4〜5で医療・科学英語、論文英語を学びます</li>
          <li>Level 6のTOEIC対策と並行して、論文を読む力を仕上げます</li>
        </ol>
        <p className="text-slate-500 dark:text-slate-400">
          毎日「今日の30分トレーニング」を進めるだけで、自動的に最適な内容が用意されます。
          設定画面から自由学習モードに切り替えることもできます。
        </p>
        <Button size="lg" onClick={dismiss}>
          はじめる
        </Button>
      </div>
    </Modal>
  );
}
