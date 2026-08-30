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

const HEADERS = {
  'User-Agent': 'oblivion-personal-site',
  Accept: 'application/vnd.github+json',
};

const BASE = 'https://api.github.com/users/mikulovesuki';

export async function fetchUser(): Promise<GithubUser | null> {
  try {
    const res = await fetch(BASE, { headers: HEADERS });
    if (!res.ok) return null;
    return (await res.json()) as GithubUser;
  } catch {
    return null;
  }
}

export async function fetchRepos(): Promise<GithubRepo[] | null> {
  try {
    const res = await fetch(`${BASE}/repos?per_page=100&sort=pushed`, { headers: HEADERS });
    if (!res.ok) return null;
    return (await res.json()) as GithubRepo[];
  } catch {
    return null;
  }
}

/** 原创仓库（排除 fork） */
export function originalRepos(repos: GithubRepo[]): GithubRepo[] {
  return repos.filter((r) => !r.fork && !r.archived);
}
