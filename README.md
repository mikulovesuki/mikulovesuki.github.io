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
| `/` | 首页：终端 Hero、精选项目、每日动态（GitHub 活动）、技能云、成长轨迹 |
| `/projects/` | 全部原创项目（GitHub API 动态数据 + 手写中文介绍） |
| `/blog/` | 技术博客（MDX + KaTeX 公式 + RSS） |
| `/about/` | 自我介绍：内容在 `src/data/profile.ts` 中填写 |
| `/admin/` | 站点管理后台（仅本地开发可用，见下） |
| `/rss.xml` | RSS 订阅 |

## 本地开发

```bash
npm install        # 安装依赖
```

双击 `start.bat` 一键启动（自动打开浏览器 http://localhost:4321），双击 `stop.bat` 一键关闭；

或使用命令行：

```bash
npm run dev        # 开发服务器 http://localhost:4321
npm run check      # TypeScript 类型检查
npm run build      # 生产构建 → dist/
npm run preview    # 预览构建产物
```

## 部署与自动同步（GitHub Pages）

### 部署（GitHub Actions，push 即发布）

1. 在 GitHub 创建名为 `mikulovesuki.github.io` 的仓库（必须是你的主页仓库，大小写不敏感）
2. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
3. 推送 `main` 分支，`.github/workflows/deploy.yml` 会自动构建并部署
4. 访问 `https://mikulovesuki.github.io`

若改为部署到项目仓库路径（如 `mikulovesuki.github.io/profile`），需同步修改：

- `astro.config.mjs` 中 `site` 字段
- 新增 `base: '/profile'`
- 仓库 Settings → Pages → Source 选择 **GitHub Actions**

### 「GitHub 发布自动同步到网站」的原理

```
你在 GitHub 上 push（或在本地后台点「发布到线上」）
   → GitHub Actions 自动构建
       → 构建时用 GITHUB_TOKEN（Actions 自动注入，限流 5000/小时）拉取你的仓库 / star 数据
       → 合并管理后台数据 src/data/site-data.json
   → 部署到 GitHub Pages，约 1–2 分钟后全站更新
```

- 新仓库、star 数、更新时间都会随每次 push 自动更新到网站
- 构建失败（如 GitHub API 临时不可用）时自动降级为内置数据，页面始终可用
- 本地 `npm run dev` 时也建议在 `.env` 配置 `GITHUB_TOKEN` 拉取自己的数据（可选）：

## 内容维护

- **项目数据**：`src/data/projects.ts`（精选项目的中文介绍、技术标签、量化成果）
- **次要仓库说明**：`src/data/repoNotes.ts`
- **自我介绍**：`src/data/profile.ts`（自我介绍正文，直接编辑该文件）
- **博客文章**：`src/content/blog/*.mdx`（frontmatter 含 title / description / pubDate / tags）
- **技能与时间线**：`src/data/skills.ts`、`src/data/timeline.ts`
- **站点全局信息**：`src/config.ts`（站点名、简介、联系方式）

## 站点管理后台（拖拽编辑卡片）

打开 `http://localhost:4321/admin`（页脚有「⚙ 管理」入口），输入管理密码即可可视化编辑全站卡片：

- **精选项目 / 技能组 / 时间线**：支持编辑与拖拽排序（每日动态为 GitHub 活动自动同步，不可编辑）

工作方式（前后端同步）：

1. **密码**：默认为 `111`，建议在 `.env` 中设置 `ADMIN_TOKEN` 覆盖（`cp .env.example .env` 后修改，重启 dev server 生效）
2. **保存**：编辑后点「保存」（或 Ctrl+S），数据写入 `src/data/site-data.json`，本地页面立即生效
3. **发布**：点「发布到线上」自动执行 git 提交并推送（需先配置 git 远程仓库），GitHub Actions 重新构建后所有访客可见——**与直接 push 同等效果**

> 注意：管理后台仅在本地开发模式（`start.bat` / `npm run dev`）可用；线上静态页面不含管理接口。

## 装饰素材（二次元主题）

- **`src/components/RightSidebar.astro`**：全站右侧栏（≥lg 双栏显示），含作者卡 / 公告 / 最新文章 / 标签云 / 目录（目录由 JS 扫描当前页 h2/h3 生成，带滚动高亮）；公告文案直接编辑该文件
- **`public/img/`**：站点装饰图（已压缩优化）
  - `hero-dusk.jpg` — 首页横幅背景（黄昏雨景）
  - `angel-clouds.jpg` — 关于页横幅（天使云海）
  - `pool-night.jpg` — 项目页横幅（霓虹泳池）
  - `mascot-chibi.jpg` — 关于页 Q 版头像（蓝鲸女仆）
- **`public/favicon.png`** — 站点图标（同上 Q 版头像脸部裁剪）
- 替换方式：直接覆盖 `public/img/` 下同名文件，或在 `picture/` 放新图后参照 `src/pages/about.astro`、`src/pages/projects.astro`、`src/styles/global.css`（`.hero-sky`）中的引用写法接入
- 建议尺寸：横幅宽 ≥ 1200px，Q 版头像方形裁切即可；大图先用图片工具压缩（参考现有文件 ~300KB）

## 致谢

基于 [Astro](https://astro.build) 与 [Tailwind CSS](https://tailwindcss.com) 构建。
