const fs = require('fs');
const path = require('path');

const content = process.argv[2];
if (!content) {
  console.log('用法: node scripts/add-mutter.js "你的碎碎念内容"');
  process.exit(1);
}

const mutterPath = path.join(__dirname, '../content/mutters.json');

let mutters = [];
try {
  mutters = JSON.parse(fs.readFileSync(mutterPath, 'utf-8'));
} catch {
  console.log('创建新的 mutters.json 文件');
}

const newMutter = {
  id: Date.now().toString(),
  content,
  date: new Date().toISOString().replace('T', ' ').substring(0, 16),
};

mutters.unshift(newMutter);
fs.writeFileSync(mutterPath, JSON.stringify(mutters, null, 2), 'utf-8');
console.log('✅ 碎碎念已添加！');
console.log(`📝 内容: ${content}`);
console.log(`🕐 时间: ${newMutter.date}`);
