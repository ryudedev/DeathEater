#!/usr/bin/env node

const inquirer = require('inquirer').default; // .default を追加
const { execSync } = require('child_process');

async function createPullRequest() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Pull Requestのタイトルを入力してください:',
    },
    {
      type: 'input',
      name: 'overview',
      message: 'Pull Requestの概要を入力してください:',
    },
    {
      type: 'editor',
      name: 'changes',
      message: '変更内容を入力してください（リスト形式で複数行を記述してください）:',
    },
    {
      type: 'input',
      name: 'relatedIssues',
      message: '関連するIssue番号を入力してください (例: #123), なければEnter:',
    },
    {
      type: 'confirm',
      name: 'screenshot',
      message: 'スクリーンショットを含めますか？',
      default: false,
    },
    {
      type: 'input',
      name: 'branch',
      message: '作成元のブランチを入力してください (例: feature-branch):',
    },
  ]);

  // Pull Requestのテンプレート
  const body = `
## 概要
${answers.overview}

## 変更内容
${answers.changes}

${answers.relatedIssues ? `## 関連するIssue\n- ${answers.relatedIssues}` : ''}

${answers.screenshot ? '## スクリーンショット\nスクリーンショットをここに追加してください。\n' : ''}

## 確認項目
- [ ] 正常に動作することを確認
- [ ] ユニットテストがすべてパスすること
- [ ] UIに変更がある場合は、デザインが要件通りであること
`;

  const command = `gh pr create --title "${answers.title}" --body "${body}" --base main --head ${answers.branch}`;
  execSync(command, { stdio: 'inherit' });
}

createPullRequest();
