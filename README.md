# 30分英語トレーニング

毎日約30分、英語がほぼ分からない状態から中学英語→高校英語→一般英語→医療・科学英語→英語論文→TOEICまで段階的に学べる、**完全オフライン動作のPWA英語学習アプリ**です。iPadのホーム画面に追加して、通勤・通学中などインターネット接続がない環境でも学習できます。

## 1. アプリ概要

- **対象**: 英語初心者〜中級者。中学英語の基礎から始め、最終的に医療・研究系の英語論文が読め、TOEICにも対応できる英語力を身につけることを目標とします。
- **1日の流れ**: Home画面の「Start Today's Training」から、`Reading → Grammar → Writing → Review（復習）` を順番に進めるだけ。何を勉強するか毎日考える必要はありません。復習対象が多い日は自動的にReviewの配分時間が延び、他のセクションが短縮されます（`services/dailyPlanner.ts`）。
- **Level構成**（全160日分のカリキュラム、`src/data/levels.ts`）
  | Level | 内容 | 日数 |
  |---|---|---|
  | 1 | 中学英語基礎（be動詞・一般動詞・否定文・疑問文・三単現・過去形など） | 30日 |
  | 2 | 高校基礎英語（現在完了・不定詞・動名詞・受動態・関係詞など） | 30日 |
  | 3 | 一般英語・長文読解（分詞構文・倒置・強調・省略・因果関係など） | 30日 |
  | 4 | 医療・科学英語（解剖・生理・循環器・血行動態など） | 20日 |
  | 5 | Research English（論文のAbstract/Methods/Results/Discussion、学術ライティング） | 30日 |
  | 6 | TOEIC（Part1〜7対応、ビジネス語彙・文法） | 20日 |

  ※Level6とTOEICは並行して学習できます（学習ルート上はLevel5と並行して進めても構いません）。

- **学習カテゴリ**: Grammar（レッスン+問題）／Vocabulary（独立した単語バンク＋動的出題）／Reading（教材+理解度チェック+英文構造解析）／Writing（並べ替え・穴埋め・和文英訳・自由英作文）／TOEIC（Part1〜7＋模擬テスト）／Review（間隔反復による復習）の6カテゴリが、すべて同じ復習エンジン上で管理されます。
- **弱点分析・習熟度管理**: すべての解答（正誤問わず）が記録され、タグ（文法項目・Reading設問タイプ・TOEIC Part・語彙カテゴリなど）ごとの正答率から弱点分野を自動抽出します（Progress画面）。習熟度は「未習得／学習中／習得／定着」の4段階で、少ない回答数だけで「定着」と判定しないようになっています（`services/masteryService.ts`）。
- **完全オフライン・完全無料**: Claude/OpenAI/GeminiなどのAI APIやクラウドDB、ユーザー認証、月額課金は一切使用していません。すべての教材・問題データと採点ロジックはアプリ内に内蔵されており、サーバー通信なしで動作します。

## 2. 技術構成

- **React 19 + TypeScript + Vite** — 静的サイトとしてビルドし、GitHub Pagesにそのままデプロイ可能
- **Tailwind CSS v4** — UIスタイリング
- **react-router-dom（HashRouter）** — GitHub Pagesのサブパス配信でも問題なく動くようハッシュルーティングを採用
- **idb（IndexedDBのラッパー）** — 学習データの永続化（スキーマv2、マイグレーション対応）
- **vite-plugin-pwa** — Service Worker生成・オフラインキャッシュ・Web App Manifest生成
- **tsx** — コンテンツ検証スクリプトの実行用（devDependency）

### ディレクトリ構成

```
src/
├── components/   UIコンポーネント（layout / reading / grammar / vocabulary / writing / toeic / review / progress / common）
├── pages/        画面単位のコンポーネント（Home, Training, Reading, Writing, Vocabulary, Toeic, ToeicMockTest,
│                 ExtraTraining, Review, Progress, Settings）
├── data/         コンテンツデータと定義
│   ├── levels.ts        Level定義（1〜6、日数配分）
│   ├── materials/       Reading教材（level1〜6）
│   ├── questions/       理解度チェック問題（level1〜6）
│   ├── writing/         ライティング問題（level1〜6）
│   ├── grammar/         Grammarレッスン＋問題（level1〜6）
│   ├── vocabulary/      独立したVocabulary語彙バンク（level1〜6）
│   └── toeic/           TOEIC Part1〜7のオリジナル問題
├── db/           IndexedDBアクセス層（repositories 経由でのみDBにアクセスする）
├── services/     学習ロジック（カリキュラム決定・日次プラン・復習スケジューリング・習熟度・弱点分析・
│                 Vocabulary出題生成・Writing採点・TOEICスコア目安・統計）
├── hooks/        Reactカスタムフック
├── types/        型定義
└── utils/        日付処理・ID生成・シャッフルなどの汎用関数

scripts/
└── validate-content.ts   コンテンツ検証スクリプト（`npm run validate-content`）
```

学習ロジック（`services/`）とデータアクセス（`db/`）はUIから分離されており、コンポーネントが直接IndexedDB APIを呼び出すことはありません。

## 3. ローカルでの起動方法

Node.js 20以上を推奨します。

```bash
npm install
npm run dev
```

`http://localhost:5173` で開発サーバーが起動します。

## 4. ビルド方法

```bash
npm run build             # 型チェック → 本番ビルド（dist/ に出力）
npm run preview           # dist/ をローカルで確認（本番ビルド + Service Workerの動作確認用）
npm run lint              # oxlintによる静的解析
npm run validate-content  # コンテンツの整合性チェック（後述）
```

## 5. GitHub Pagesへのデプロイ設定

このプロジェクトは `base: './'`（相対パス）でビルドされ、`HashRouter` でルーティングしているため、**GitHub Pagesのどのサブパス（`https://<ユーザー名>.github.io/<リポジトリ名>/`）でも設定変更なしにそのまま動作します。**

### 初回セットアップ手順

1. このフォルダをGitリポジトリにして、GitHubへpushします。

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
   git push -u origin main
   ```

2. GitHubのリポジトリ画面で **Settings → Pages** を開き、「Build and deployment」の **Source** を `GitHub Actions` に設定します。
3. `main` ブランチにpushすると、`.github/workflows/deploy.yml` が自動的に `npm ci` → `npm run build` → GitHub Pagesへのデプロイを実行します。
4. 数分後、`https://<ユーザー名>.github.io/<リポジトリ名>/` でアプリが公開されます。

以降は `main` ブランチにpushするたびに自動で再デプロイされます。

## 6. iPadへのインストール方法（ホーム画面に追加）

1. iPadのSafariで公開したURL（例: `https://<ユーザー名>.github.io/<リポジトリ名>/`）を開きます。
2. 画面下部（または上部）の共有アイコン（□に↑）をタップします。
3. 「ホーム画面に追加」を選び、名前を確認して「追加」をタップします。
4. ホーム画面にアプリアイコンが追加されます。以後はこのアイコンから起動すると、Safariのアドレスバーなどが表示されない全画面（standalone）モードで動作します。

## 7. オフライン利用方法・動作確認

初回はオンライン状態で一度アプリを開いてください（Service Workerが登録され、必要なファイルがすべて端末にキャッシュされます）。それ以降は機内モードやWi-Fiオフの状態でも、Home / Vocabulary / Reading / Writing / TOEIC / Review / Progress を含むすべての主要機能が動作します。

### オフライン動作の確認方法

1. `npm run build && npm run preview` で本番ビルドを起動し、ブラウザで一度開く（Service Workerが登録されるまで数秒待つ）。
2. ブラウザの開発者ツール → Network タブ → 「Offline」にチェックを入れる（またはOSの機内モードを有効にする）。
3. ページを再読み込みし、各画面が問題なく表示・操作でき、学習履歴がIndexedDBに書き込まれることを確認する。

学習データはすべて端末内のIndexedDBに保存されるため、オフラインでもデータの読み書きに支障はありません。

## 8. 学習データの保存場所（IndexedDB）

すべての学習データはブラウザのIndexedDB（データベース名: `english-training-db`、スキーマv2）に保存されます。

| ストア | 内容 |
|---|---|
| `sessions` | 日ごとの学習セッション（各セクションの完了状況・学習時間・正答数など） |
| `reviewItems` | Grammar/Vocabulary/Reading/Writing/TOEICのすべての解答履歴（正誤・連続正解数・タグ・次回復習日・間隔） |
| `progress` | Level・連続学習日数・総学習時間・カテゴリ別正答率などの累計進捗 |
| `settings` | 文字サイズ・ダークモード・現在のLevel・自由学習モードなどの設定 |
| `toeicResults` | TOEIC模擬テストの結果（Part別正答率・スコア目安・所要時間） |

v1（旧バージョン）のデータはアプリ起動時に自動マイグレーションされ、失われません（`src/db/indexedDB.ts`）。

## 9. 学習データのExport / Import（機種変更時のデータ移行）

Settings画面から以下が行えます。

- **Export（書き出す）**: すべての学習データ（TOEIC結果を含む）をJSONファイルとしてダウンロードします。
- **Import（読み込む）**: 書き出したJSONファイルを選択すると、現在のデータを上書きして復元します（確認ダイアログあり）。旧バージョンのバックアップファイルも読み込めます。
- **初期化**: すべての学習データを削除します（確認ダイアログあり、誤操作防止のため2段階確認）。

iPadを機種変更する場合は、旧端末でExportしたJSONファイルを（AirDropやメールなどで）新端末に送り、新端末のSettings画面からImportしてください。

## 10. コンテンツの追加方法

各コンテンツは `src/data/<種別>/level{1-6}.ts`（TOEICのみ `src/data/toeic/part{1-7}.ts`）にTypeScriptの配列として定義されています。既存のオブジェクトを参考に配列へ追加するだけです。

- **Reading教材**: `src/data/materials/level{1-6}.ts` に `ReadingMaterial` を追加。対応する理解度チェック問題は `src/data/questions/level{1-6}.ts` に `materialId` を合わせて追加します。
- **Writing問題**: `src/data/writing/level{1-6}.ts` に追加（`type` を `reorder` / `fillblank` / `translate` / `free` から選択）。
- **Grammar**: `src/data/grammar/level{1-6}.ts` に `GrammarLesson`（解説）と `GrammarQuestion`（問題、`format` を `choice4` / `truefalse` / `reorder` / `fillblank` / `correct-sentence` / `error-correction` / `ja-to-en` / `structure` から選択）を追加。
- **Vocabulary**: `src/data/vocabulary/level{1-6}.ts` に `VocabularyEntry` を追加するだけで、練習問題（英→日・日→英・文脈問題・類義語・反意語・コロケーション）は `services/vocabularyQuiz.ts` が自動生成します。
- **TOEIC**: `src/data/toeic/part{1-7}.ts` に該当Partの型（`ToeicPart1Question` 〜 `ToeicPart7Question`）を追加。

型定義は `src/types/material.ts` にあるので、TypeScriptの型チェック（`npm run build`時の`tsc -b`）でフォーマットの誤りに気づけます。IDは重複しないように命名してください（例: `grammar_l1_001`, `vocabulary_l4_001`, `toeic_p5_001`）。追加後は `npm run validate-content` でID重複・必須項目・件数を確認できます。

カリキュラムの日数配分（各Levelを何日にするか）は `src/data/levels.ts` の `totalDays` で調整できます。

## 11. コンテンツ検証スクリプト

```bash
npm run validate-content
```

以下を自動チェックします。

- ID重複（種別ごと、および全コンテンツ横断）
- 必須項目の欠落（問題文・選択肢・正解・解説・Vocabularyの必須フィールドなど）
- 不正なlevel / lessonID / TOEIC Part参照
- Vocabularyの単語重複
- 選択肢と正解の矛盾（correctAnswerがchoicesに含まれているか）
- 目標問題数との比較（Grammar 800 / Reading 200 / Writing 200 / Vocabulary 2,000 / TOEIC 70 を目安として、実数と差分を表示）

ID重複・必須項目欠落・矛盾は**エラー**（終了コード1）、目標未達は**警告**（非致命的）として区別して報告します。

## 12. npm scripts 一覧

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 型チェック + 本番ビルド（`dist/`に出力） |
| `npm run preview` | 本番ビルドをローカルで確認 |
| `npm run lint` | oxlintによる静的解析 |
| `npm run validate-content` | コンテンツの整合性・件数チェック |

## 13. 今後の拡張ポイント

- **コンテンツ量の拡充**: 現時点の収録数は本READMEおよびアプリ内Progress画面の実数を参照してください（目標: Grammar 800問 / Reading 200問 / Writing 200問 / Vocabulary 2,000語）。`src/data/` 配下に同じパターンで追加していくことで拡張できます。
- **オンラインAIモード**: 現在はAIを一切使わずに動作する設計ですが、将来的に「Offline Mode」と「Online AI Mode」を切り替えられるようにする余地を残しています（自由英作文のAI添削など）。追加する場合も、AIなしでアプリの主要機能が成立する現在の設計は変更しないでください。
- **音声機能**: リスニング・発音練習（Web Speech APIなど、追加の外部サービス契約が不要な範囲）。
- **バンドルサイズの最適化**: コンテンツ量が増えるとJSバンドルが大きくなるため、レベル単位でのコード分割（dynamic import）を検討する余地があります。
- **英語論文全文読解・自分の研究分野のVocabulary・Abstract作成支援**: Level5の発展として追加できる構造にしてあります。

---

このアプリは外部APIやクラウドサービスを一切使用していないため、公開後は追加費用なく長期的に利用できます。
