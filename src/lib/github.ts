/** GitHub API 数据类型与抓取工具（构建时调用，失败返回 null 以降级） */

export interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  topics: string[];
}

export interface GithubUser {
  login: string;
  public_repos: number;
  followers: number;
  bio: string | null;
}

/** 用户公开活动事件（每日动态数据源） */
export interface GithubEvent {
  id: string;
  type: string;
  public: boolean;
  repo: { id: number; name: string; url: string };
  actor: { login: string };
  created_at: string;
  payload: {
    action?: string;
    ref?: string;
    ref_type?: string;
    size?: number;
    commits?: { message?: string }[];
    issue?: { title?: string };
    pull_request?: { title?: string; merged?: boolean };
    release?: { tag_name?: string };
    forkee?: { full_name?: string };
  };
}

const BASE = 'https://api.github.com/users/mikulovesuki';

/**
 * GitHub Actions 与本地 .env（可选）均可提供 GITHUB_TOKEN：
 * 有 token 时匿名限流 60 次/小时 → 5000 次/小时，
 * 避免构建时因限流静默降级为旧数据（网站与 GitHub 不同步的根因）。
 */
function headers() {
  const token = process.env.GITHUB_TOKEN || '';
  const h: Record<string, string> = {
    'User-Agent': 'oblivion-personal-site',
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

/** GET + 限流/5xx 时小退避重试 1 次，仍失败返回 null（页面降级为内置数据） */
async function apiGet(url: string): Promise<unknown | null> {
  try {
    let res = await fetch(url, { headers: headers() });
    if (!res.ok && (res.status === 429 || res.status >= 500)) {
      await new Promise((r) => setTimeout(r, 2500));
      res = await fetch(url, { headers: headers() });
    }
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchUser(): Promise<GithubUser | null> {
  const data = await apiGet(BASE);
  return (data as GithubUser | null) ?? null;
}

export async function fetchRepos(): Promise<GithubRepo[] | null> {
  const data = await apiGet(`${BASE}/repos?per_page=100&sort=pushed`);
  return Array.isArray(data) ? (data as GithubRepo[]) : null;
}

/** 并发获取用户信息与仓库列表（两个请求并行，各失败互不影响） */
export async function fetchAll(): Promise<{ user: GithubUser | null; repos: GithubRepo[] | null }> {
  const [user, repos] = await Promise.all([fetchUser(), fetchRepos()]);
  return { user, repos };
}

/** 获取最近公开活动事件（每日动态）；失败返回 null */
export async function fetchRecentEvents(): Promise<GithubEvent[] | null> {
  const data = await apiGet(`${BASE}/events`);
  if (!Array.isArray(data)) return null;
  return (data as GithubEvent[]).filter((e) => e.public !== false);
}

/** 原创仓库（排除 fork） */
export function originalRepos(repos: GithubRepo[]): GithubRepo[] {
  return repos.filter((r) => !r.fork && !r.archived);
}
