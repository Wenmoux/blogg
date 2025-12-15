# 更新日志

## [2025-12-15] - 功能大更新

### ✨ 新增功能

#### 1. 标签系统
- **标签云页面** (`/tags`)
  - 显示所有标签及对应文章数量
  - 按文章数量降序排列
  - 支持自定义标签颜色
  - 点击标签跳转到筛选页面

- **标签筛选页面** (`/tags/[tag]`)
  - 显示包含特定标签的所有文章
  - 显示标签颜色和文章计数
  - 返回标签云导航
  - 动态路由支持

- **标签颜色系统**
  - 支持 7 种预设颜色：blue, green, red, yellow, purple, pink, gray
  - 在 frontmatter 中配置：`标签名 (颜色)`
  - 首页、标签云、标签筛选页统一样式

#### 2. 碎碎念（Mutter）
- **时间线展示** (`/mutter`)
  - 渐变色时间轴（蓝→紫→粉）
  - 圆点标记每条碎碎念
  - 卡片式内容展示
  - 悬停动画效果

- **JSON 数据存储**
  - 数据文件：`content/mutters.json`
  - 支持 id、内容、时间字段
  - 按时间倒序自动排列

- **快速添加脚本**
  - 命令：`npm run mutter "你的内容"`
  - 自动生成时间戳
  - 自动添加到列表顶部

#### 3. 书架（Books）
- **MD3 设计风格卡片** (`/books`)
  - 响应式网格布局（手机 1 列 / 平板 2 列 / 桌面 3 列）
  - 封面图片缩放动画
  - 评分角标（星星图标）
  - 书名、作者、简介展示
  - 阅读完成时间标记
  - 点击跳转外部链接

- **JSON 数据配置**
  - 数据文件：`content/books.json`
  - 支持字段：id, title, author, cover, description, rating, link, finishedDate

#### 4. Slug 化 URL
- **自定义短链接**
  - 博客路由从 `[name]` 改为 `[slug]`
  - 支持在 frontmatter 中自定义 slug
  - URL 更简洁友好

- **文件格式兼容**
  - 新格式：`slug.md`
  - 旧格式：`[name]-[date].md`
  - 两种格式完全兼容

- **Frontmatter 元数据增强**
  - 新增字段：title, slug, description, cover, tags, categories
  - 标签支持字符串或颜色对象
  - 自动解析 YAML 数组

### 🔧 核心改进

#### Blog 接口增强
```typescript
interface Blog {
  name: string;
  slug: string;        // 新增
  title: string;       // 新增
  date: string;
  content: string;
  description?: string; // 新增
  cover?: string;      // 新增
  tags?: Array<string | { name: string; color: string }>; // 新增
  categories?: string[]; // 新增
}
```

#### 首页博客列表
- 显示文章标题（title）而非文件名
- 时间和标签在同一行显示
- 标签支持自定义颜色
- 标签图标美化

#### 文章详情页
- 使用 slug 作为路由参数
- 显示标题、描述、封面
- 元数据优化（SEO）

### 📦 新增文件

```
blogg-main/
├── src/
│   ├── actions/
│   │   ├── mutter/action.ts    # 碎碎念数据处理
│   │   └── book/action.ts      # 书籍数据处理
│   ├── app/(layout)/
│   │   ├── tags/
│   │   │   ├── page.tsx        # 标签云页面
│   │   │   └── [tag]/page.tsx  # 标签筛选页面
│   │   ├── mutter/page.tsx     # 碎碎念页面
│   │   └── books/page.tsx      # 书架页面
│   └── components/
│       └── blog-list.tsx       # 增强标签显示
├── scripts/
│   └── add-mutter.js           # 添加碎碎念脚本
└── content/
    ├── mutters.json            # 碎碎念数据
    └── books.json              # 书籍数据
```

### 🎨 UI/UX 改进
- Material Design 3 设计语言
- 响应式布局优化
- 暗色模式完整支持
- 悬停动画和过渡效果
- 统一配色系统

### 🚀 导航栏更新
1. 首页
2. **标签** ⭐ 新增
3. **书架** ⭐ 新增
4. **碎碎念** ⭐ 新增
5. 关于
6. 友链
7. 聊天
8. 待做

### 🔨 技术栈
- Next.js 15.3.6
- React 19
- TypeScript 5
- Tailwind CSS 4
- Server Components
- Dynamic Routing
- ISR (revalidate: 60s)

### 📝 开发规范
- ✅ 禁止使用 `any` 类型
- ✅ if 语句必须使用花括号
- ✅ 类型谓词正确使用
- ✅ 换行符统一为 LF
- ✅ 代码格式化：Prettier
- ✅ 代码检查：ESLint

---

## 使用说明

详见 [使用说明文档](./docs/USAGE.md)
