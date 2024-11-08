# 環境内コマンドの使い方について
## Docker
### 構築コマンド
```bash
pnpm start:build
```

### ログ確認コマンド
```bash
# backendのログ
pnpm log:back

# frontedのログ
pnpm log:front

# dbのログ
pnpm log:db
```

### コンテナ内に入る
```bash
# backendコンテナの中に入る
pnpm exec:back

# frontnedコンテナの中に入る
pnpm exec:front

# dbコンテナの中に入る
pnpm exec:db
```

### 停止コマンド
```bash
pnpm clean
```

## git
### ブランチ作成
linearを参照して、ブランチを作成
```bash
git switch -c GRA-~~
```

### ブランチチェックアウト
```bash
git switch {ブランチ名}
```

### 基本的なフロー
```bash
# 作業ブランチに移動
git switch GRA-00
# ブランチが作成されていなければ
git switch -c GRA-00


# ファイルを編集
...

# ファイルをステージングする
git add .
# or
git add {特定のファイル名}

# コミットする
git commit
# 選択肢を選ぶ
# 'add:      ➕ 新しいファイルやコードの追加'
# 'feat:     ✨ 新機能の追加'
# 'improve:  🎨 コードの構造/ロジックの改善'
# 'update:   <0001fa79> 軽微な修正'
# 'fix:      🐛 バグ修正'
# 'hotfix:   🚑 緊急バグ修正'
# 'refactor: ♻  リファクタリング'
# 'delete:   🔥 ファイルやコードの削除'
# 'style:    💄 UIやスタイルファイルの追加/更新'
# 'docs:     📝 ドキュメンテーションの追加/更新'
# 'move:     🚚 ファイルやディレクトリの移動'
# 'test:     ✅ テストの追加/更新/合格'
# 'chore:    🔧 設定ファイルの追加/更新'
# 'package:  📦 パッケージの追加/更新'
# 'WIP:      🚧 作業途中'

# コミットメッセージを記述
# 内容の詳細を記述(無ければenter)

# pushする
git push -u origin GRA-00

```
