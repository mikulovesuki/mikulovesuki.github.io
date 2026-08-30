# oblivion · math × AI

个人网站：AI 应用开发（MCP / RAG / 多 Agent）与数值计算的实践记录。

## 技术栈

- [Astro](https://astro.build) — 静态站点框架（零 JS 默认，SEO 友好）
- [Tailwind CSS 4](https://tailwindcss.com) — 暗色学术极客主题
- MDX + KaTeX — 博客支持数学公式渲染
- GitHub API — 构建时自动同步项目 star 数 / 更新时间（失败时降级为内置数据）

## 站点结构

| 路径 | 说明 |
| --- | --- |
| `/` | 首页：终端 Hero、精选项目、技能云、成长轨迹 |
| `/projects/` | 全部原创项目（GitHub API 动态数据 + 手写中文介绍） |
| `/blog/` | 技术博客（MDX + KaTeX 公式 + RSS） |
| `/about/` | 关于我：经历、技能、联系方式 |
| `/rss.xml` | RSS 订阅 |

## 本地开发

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器 http://localhost:4321
npm run check      # TypeScript 类型检查
npm run build      # 生产构建 → dist/
npm run preview    # 预览构建产物
```

## 部署（GitHub Pages）

1. 在 GitHub 创建名为 `mikulovesuki.github.io` 的仓库（必须是你的主页仓库，大小写不敏感）
2. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
3. 推送 `main` 分支，`.github/workflows/deploy.yml` 会自动构建并部署
4. 访问 `https://mikulovesuki.github.io`

若改为部署到项目仓库路径（如 `mikulovesuki.github.io/profile`），需同步修改：

- `astro.config.mjs` 中 `site` 字段
- 新增 `base: '/profile'`
- 仓库 Settings → Pages → Source 选择 **GitHub Actions**

## 内容维护

- **项目数据**：`src/data/projects.ts`（精选项目的中文介绍、技术标签、量化成果）
- **次要仓库说明**：`src/data/repoNotes.ts`
- **博客文章**：`src/content/blog/*.mdx`（frontmatter 含 title / description / pubDate / tags）
- **技能与时间线**：`src/data/skills.ts`、`src/data/timeline.ts`
- **站点全局信息**：`src/config.ts`（站点名、简介、联系方式）

## 致谢

基于 [Astro](https://astro.build) 与 [Tailwind CSS](https://tailwindcss.com) 构建。
