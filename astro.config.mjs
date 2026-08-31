// @ts-nocheck
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { unified } from '@astrojs/markdown-remark';
import { writeFile } from 'node:fs/promises';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { loadEnv } from 'vite';
import { timingSafeEqual } from 'node:crypto';
import {
  loadSiteData,
  getMergedFreeCards,
  getMergedProjects,
  getMergedSkillGroups,
  getMergedTimeline,
} from './src/lib/site-data.ts';

const run = promisify(exec);

/** 常数时间字符串比较（长度不同返回 false，不泄漏 token 长度信息） */
function safeEqualToken(a, b) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * 本地管理 API（仅 dev server 存在）：
 * 站点是纯静态部署（GitHub Pages），构建产物里不能包含需要读取请求头、
 * 执行 git 的服务端路由（Astro 中此类路由必须配合 adapter）。
 * 因此把管理接口实现为 Vite dev 中间件：
 * - dev 模式下拦截 /api/admin（读写数据）与 /api/publish（git 发布）
 * - `astro build` 时没有 dev server，该中间件完全不存在，不影响静态构建
 */
function localAdminApi() {
  return {
    name: 'local-admin-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url || '/', 'http://localhost');
        const isAdmin = url.pathname === '/api/admin';
        const isPublish = url.pathname === '/api/publish';
        if (!isAdmin && !isPublish) return next();

        const sendJson = (s, code, data) => {
          s.statusCode = code;
          s.setHeader('Content-Type', 'application/json; charset=utf-8');
          s.end(JSON.stringify(data));
        };

        // 鉴权：Bearer <token>，token 取自 .env 的 ADMIN_TOKEN，未设置时默认 111
        // 使用常数时间比较，避免通过响应时间差试探 token（timing attack）
        const env = loadEnv(server.config.mode, process.cwd(), '');
        const token = env.ADMIN_TOKEN || '111';
        const sent = (req.headers.authorization || '');
        const valid = sent.startsWith('Bearer ') && safeEqualToken(sent.slice(7), token);
        if (!valid) {
          sendJson(res, 401, { error: '未授权' });
          return;
        }

        const dataFile = () => `${process.cwd()}/src/data/site-data.json`;

        try {
          if (isAdmin && req.method === 'GET') {
            sendJson(res, 200, {
              overrides: loadSiteData(),
              merged: {
                free_cards: getMergedFreeCards(),
                projects: getMergedProjects(),
                skills: getMergedSkillGroups(),
                timeline: getMergedTimeline(),
              },
            });
            return;
          }

          if (isAdmin && req.method === 'POST') {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const text = Buffer.concat(chunks).toString('utf-8');
            let body;
            try {
              body = text ? JSON.parse(text) : {};
            } catch {
              sendJson(res, 400, { error: 'JSON 格式错误' });
              return;
            }
            if (typeof body !== 'object' || body === null || Array.isArray(body)) {
              sendJson(res, 400, { error: '数据格式错误' });
              return;
            }
            await writeFile(dataFile(), JSON.stringify(body, null, 2), 'utf-8');
            sendJson(res, 200, { ok: true, message: '已保存。刷新页面即可看到效果；点「发布」同步到线上。' });
            return;
          }

          if (isPublish && req.method === 'POST') {
            const cwd = process.cwd();
            const { stdout: remote } = await run('git remote -v', { cwd });
            if (!remote.trim()) {
              sendJson(res, 400, {
                error: '尚未配置 git 远程仓库。请先执行：git remote add origin <你的仓库地址> 并 git push -u origin main',
              });
              return;
            }
            await run('git add src/data/site-data.json', { cwd });
            const { stdout: status } = await run('git status --porcelain', { cwd });
            if (!status.trim()) {
              sendJson(res, 200, { ok: true, message: '数据没有变化，无需发布。' });
              return;
            }
            await run('git commit -m "chore: 更新站点数据（管理后台编辑）"', { cwd });
            await run('git push', { cwd });
            sendJson(res, 200, {
              ok: true,
              message: '发布成功！GitHub Actions 正在自动构建，约 1-2 分钟后所有访客可见。',
            });
            return;
          }

          sendJson(res, 405, { error: '方法不允许' });
        } catch (e) {
          const err = e;
          sendJson(res, 500, { error: err.stderr || err.message || String(e) });
        }
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://mikulovesuki.github.io',
  integrations: [mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss(), localAdminApi()],
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: false }]],
    }),
  },
});
