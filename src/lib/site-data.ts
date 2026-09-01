/**
 * 站点数据叠加层：
 * 默认数据位于 src/data/*.ts，管理员通过 /admin 后台编辑后，
 * 数据写入 src/data/site-data.json，构建时此处合并（覆盖）默认值。
 * —— 这就是"前后端同步"：本地管理后台编辑 -> 数据文件 -> 重新构建部署 -> 全站生效。
 */
import fs from 'node:fs';
import path from 'node:path';
import { projects, type FeaturedProject } from '../data/projects';
import { skillGroups, type SkillGroup } from '../data/skills';
import { timeline, type TimelineItem } from '../data/timeline';

export type { TimelineItem };

/** 单个精选项目的可覆盖字段 */
export interface ProjectOverride {
  tagline?: string;
  description?: string;
  highlights?: string[];
  tech?: string[];
  featured?: boolean;
  period?: string;
  order?: number;
}

/** 单个技能组的可覆盖字段 */
export interface SkillGroupOverride {
  title?: string;
  desc?: string;
  skills?: string[];
  order?: number;
}

/** 时间线条目的可覆盖字段 */
export interface TimelineOverride {
  period?: string;
  title?: string;
  description?: string;
  repos?: string[];
  tag?: TimelineItem['tag'];
  order?: number;
}

/** site-data.json 的完整结构（所有字段可选，缺省回退默认值） */
export interface SiteData {
  projects?: Record<string, ProjectOverride>;
  skills?: Record<string, SkillGroupOverride>;
  timeline?: TimelineOverride[];
}

const DATA_FILE = () => path.join(process.cwd(), 'src', 'data', 'site-data.json');

/** 读取管理员编辑数据；文件不存在或解析失败时返回空对象 */
export function loadSiteData(): SiteData {
  try {
    const file = DATA_FILE();
    if (!fs.existsSync(file)) return {};
    const raw = fs.readFileSync(file, 'utf-8').trim();
    if (!raw) return {};
    return JSON.parse(raw) as SiteData;
  } catch {
    return {};
  }
}

/** 合并后的精选项目（支持顺序调整） */
export function getMergedProjects(): FeaturedProject[] {
  const sd = loadSiteData();
  const list = projects.map((p) => ({ ...p }));
  const overrides = sd.projects ?? {};
  for (const [repo, o] of Object.entries(overrides)) {
    const p = list.find((x) => x.repo === repo);
    if (!p) continue;
    if (o.tagline !== undefined) p.tagline = o.tagline;
    if (o.description !== undefined) p.description = o.description;
    if (o.highlights !== undefined) p.highlights = o.highlights;
    if (o.tech !== undefined) p.tech = o.tech;
    if (o.featured !== undefined) p.featured = o.featured;
    if (o.period !== undefined) p.period = o.period;
  }
  const ordered = list.map((p, i) => ({ p, order: overrides[p.repo]?.order ?? i }));
  ordered.sort((a, b) => a.order - b.order);
  return ordered.map((x) => x.p);
}

/** 合并后的技能组 */
export function getMergedSkillGroups(): SkillGroup[] {
  const sd = loadSiteData();
  const groups = skillGroups.map((g) => ({ ...g, skills: [...g.skills] }));
  for (const [id, o] of Object.entries(sd.skills ?? {})) {
    const g = groups.find((x) => x.id === id);
    if (!g) continue;
    if (o.title !== undefined) g.title = o.title;
    if (o.desc !== undefined) g.desc = o.desc;
    if (o.skills !== undefined) g.skills = o.skills;
  }
  const ordered = groups.map((g, i) => ({ g, order: sd.skills?.[g.id]?.order ?? i }));
  ordered.sort((a, b) => a.order - b.order);
  return ordered.map((x) => x.g);
}

/** 合并后的时间线（管理后台保存时为全量替换） */
export function getMergedTimeline(): TimelineItem[] {
  const sd = loadSiteData();
  if (sd.timeline !== undefined && Array.isArray(sd.timeline)) {
    return sd.timeline.map((t) => ({
      period: t.period ?? '',
      title: t.title ?? '',
      description: t.description ?? '',
      repos: t.repos ?? [],
      tag: t.tag,
    }));
  }
  return timeline.map((t) => ({ ...t }));
}
