# 30分英語トレーニング

毎日約30分、英語の基礎から研究英語（論文が読める・自分の研究を書ける）まで段階的に学べる、**完全オフライン動作のPWA英語学習アプリ**です。iPadのホーム画面に追加して、通勤・通学中などインターネット接続がない環境でも学習できます。

## 1. アプリ概要

- **対象**: 英語初心者〜中級者。中学英語の基礎から始め、最終的に医療・研究系の英語論文が読め、自分の研究内容を英語で書けるようになることを目標とします。
- **1日の流れ**: Home画面の「Start Today's Training」から、`Reading → Understanding（理解度チェック） → Writing → Review（復習）` を順番に進めるだけ。何を勉強するか毎日考える必要はありません。
- **Level構成**（全140日分のカリキュラム）
  | Level | 内容 | 日数 |
  |---|---|---|
  | 1 | 中学英語基礎（be動詞・一般動詞・現在形・過去形など） | 30日 |
  | 2 | 高校基礎（現在完了・不定詞・受動態など） | 30日 |
  | 3 | 一般英文の読解（関係代名詞・分詞・仮定法など） | 30日 |
  | 4 | Medical / Science English（解剖・生理・循環器・血行動態など） | 20日 |
  | 5 | Research English（論文のAbstract/Methods/Resultsなど） | 20日 |
  | 6 | Academic Writing（自分の研究を英語で書く練習） | 10日 |

  ※教材は各Levelにつき数本ずつ収録し、カリキュラム日数分は自動でローテーションして出題されます（教材追加は後述の方法で簡単に増やせます）。

- **完全オフライン・完全無料**: Claude/OpenAI/GeminiなどのAI APIやクラウドDB、ユーザー認証、月額課金は一切使用していません。すべての教材データ・採点ロジックはアプリ内に内蔵されており、サーバー通信なしで動作します。

## 2. 技術構成

- **React 19 + TypeScript + Vite** — 静的サイトとしてビルドし、GitHub Pagesにそのままデプロイ可能
- **Tailwind CSS v4** — UIスタイリング
- **react-router-dom（HashRouter）** — GitHub Pagesのサブパス配信でも問題なく動くようハッシュルーティングを採用
- **idb（IndexedDBのラッパー）** — 学習データの永続化
- **vite-plugin-pwa** — Service Worker生成・オフラインキャッシュ・Web App Manifest生成

### ディレクトリ構成

```
src/
├── components/   UIコンポーネント（layout / reading / writing / review / progress / common）
├── pages/        画面単位のコンポーネント（Home, Training, Reading, Writing, Review, Progress, Settings）
├── data/         教材データ（materials / questions / writing）とLevel定義
├── db/           IndexedDBアクセス層（repositories 経由でのみDBにアクセスする）
├── services/      学習ロジック（カリキュラム決定・復習スケジューリング・採点・統計）
├── hooks/        Reactカスタムフック
├── types/        型定義
└── utils/        日付処理・ID生成などの汎用関数
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
npm run build      # dist/ に静的ファイルを出力（型チェック → ビルド）
npm run preview    # dist/ をローカルで確認（本番ビルド + Service Workerの動作確認用）
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

初回はオンライン状態で一度アプリを開いてください（Service Workerが登録され、必要なファイルがすべて端末にキャッシュされます）。それ以降は機内モードやWi-Fiオフの状態でも、Home / Reading / Writing / Review / Progress を含むすべての主要機能が動作します。

### オフライン動作の確認方法

1. `npm run build && npm run preview` で本番ビルドを起動し、ブラウザで一度開く（Service Workerが登録されるまで数秒待つ）。
2. ブラウザの開発者ツール → Network タブ → 「Offline」にチェックを入れる（またはOSの機内モードを有効にする）。
3. ページを再読み込みし、Home / Reading / Writing / Review / Progress の各画面が問題なく表示・操作できることを確認する。

学習データはすべて端末内のIndexedDBに保存されるため、オフラインでもデータの読み書きに支障はありません。

## 8. 学習データの保存場所（IndexedDB）

すべての学習データはブラウザのIndexedDB（データベース名: `english-training-db`）に保存されます。

| ストア | 内容 |
|---|---|
| `sessions` | 日ごとの学習セッション（各セクションの完了状況・学習時間・正答数など） |
| `reviewItems` | 復習対象（単語・文法・読解・英作文）と次回復習日・間隔 |
| `progress` | Level・連続学習日数・総学習時間・正答率などの累計進捗 |
| `settings` | 文字サイズ・ダークモード・現在のLevelなどの設定 |

## 9. 学習データのExport / Import（機種変更時のデータ移行）

Settings画面から以下が行えます。

- **Export（書き出す）**: すべての学習データをJSONファイルとしてダウンロードします。
- **Import（読み込む）**: 書き出したJSONファイルを選択すると、現在のデータを上書きして復元します（確認ダイアログあり）。
- **初期化**: すべての学習データを削除します（確認ダイアログあり、誤操作防止のため2段階確認）。

iPadを機種変更する場合は、旧端末でExportしたJSONファイルを（AirDropやメールなどで）新端末に送り、新端末のSettings画面からImportしてください。

## 10. 教材の追加方法

教材は `src/data/materials/level{1-6}.ts` にTypeScriptの配列として定義されています。新しい教材を追加する場合は、既存のオブジェクトを参考に配列へ1件追加するだけです。

```typescript
// src/data/materials/level1.ts
export const level1Materials: ReadingMaterial[] = [
  // ...既存の教材
  {
    id: 'l1-007',              // 他と重複しないID
    level: 1,
    category: 'daily',
    title: 'A New Topic',
    topic: 'Daily Life',
    estimatedMinutes: 3,
    content: ['英文1段落目...', '英文2段落目...'],
    vocabulary: [
      { word: 'example', partOfSpeech: 'noun', meaningJa: '例', example: 'This is an example.' },
    ],
    grammarPoints: [
      {
        sentence: 'This is an example.',
        translationJa: 'これは例です。',
        subject: 'This', verb: 'is', object: 'an example',
        notes: ['be動詞の基本文型'],
      },
    ],
  },
];
```

理解度チェック問題は対応する `src/data/questions/level{1-6}.ts` に、`materialId` を上で追加した教材の `id` に合わせて追加します。ライティング問題は `src/data/writing/level{1-6}.ts` に追加します（`type` を `reorder` / `fillblank` / `translate` / `free` から選択）。

型定義は `src/types/material.ts` にあるので、TypeScriptの型チェック（`npm run build`時の`tsc -b`）でフォーマットの誤りに気づけます。コード本体（コンポーネントやロジック）を変更する必要はありません。

カリキュラムの日数配分（各Levelを何日にするか）は `src/data/levels.ts` の `totalDays` で調整できます。

## 11. npm scripts 一覧

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバーを起動 |
| `npm run build` | 型チェック + 本番ビルド（`dist/`に出力） |
| `npm run preview` | 本番ビルドをローカルで確認 |
| `npm run lint` | oxlintによる静的解析 |

## 12. 今後の拡張ポイント

- **教材の追加**: 各Levelとも現状は数本ずつの収録です。上記「教材の追加方法」に沿ってTypeScriptファイルへ追加していくことで、140日分のフルカリキュラムに拡張できます。
- **オンラインAIモード**: 現在はAIを一切使わずに動作する設計ですが、将来的に「Offline Mode」と「Online AI Mode」を切り替えられるようにする余地を残しています（自由英作文のAI添削など）。追加する場合も、AIなしでアプリの主要機能が成立する現在の設計は変更しないでください。
- **音声機能**: リスニング・発音練習（Web Speech APIなど、追加の外部サービス契約が不要な範囲）。
- **語彙・文法の複雑な誤答分析**: 現在は正誤の自己申告ベースの間隔反復（1→3→7→14→30日）ですが、誤答パターンの分析を高度化する余地があります。
- **教材のインポート/エクスポート機能**: 現状はTypeScriptファイルへの直接追記ですが、JSON形式での教材インポートUIを追加すると非エンジニアでも教材を増やせるようになります。

---

このアプリは外部APIやクラウドサービスを一切使用していないため、公開後は追加費用なく長期的に利用できます。
