/**
 * 次要仓库（学习记录 / 竞赛材料）的中文说明与分类。
 * 这些仓库在 GitHub 上大多没有描述，构建时与 API 数据合并后展示。
 */

/** 不从项目页展示的仓库（非原创内容，如社区模板仓库） */
export const excludedRepos = new Set<string>(['GDUT-Beamer-Template-main']);

export interface RepoNote {
  /** 分组标题 */
  group: 'notes' | 'competition';
  /** 展示名（可选，缺省用仓库名） */
  title?: string;
  /** 中文描述 */
  description: string;
  /** 技术标签 */
  tech?: string[];
  /** 是否为此分组的主干（无描述兜底时的占位） */
  isMain?: boolean;
}

export const repoNotes: Record<string, RepoNote> = {
  '-------': {
    group: 'competition',
    title: '数学建模竞赛材料',
    description:
      '国赛 A 题备赛与参赛材料：C++ 实现的模拟退火算法（annealing_experiment / problem3_annealing）、Mathematica 可视化、LaTeX 论文与原始数据。',
    tech: ['C++', 'Mathematica', 'LaTeX'],
  },
  '----': {
    group: 'competition',
    title: '暑期建模集训',
    description:
      '暑期数学建模集训成果：ACF 自相关计算、数据预处理与拟合脚本、论文（LaTeX + PDF）及数据集（讲义里的自编题目材料）。',
    tech: ['Python', 'LaTeX'],
  },
  '---': {
    group: 'notes',
    title: '学习笔记',
    description: 'LaTeX 排版与学习过程中的讲义、笔记与作业材料。',
    tech: ['LaTeX'],
  },
  git_demo: {
    group: 'notes',
    title: 'Git 入门练习',
    description: '学习 Git 工作流时的练习仓库，记录了从零配置、分支与提交的完整过程。',
    tech: ['Git'],
  },
  cs_demo: {
    group: 'notes',
    title: '计算科学课堂演示',
    description: '计算科学课程中的课堂演示与代码实验。',
    tech: ['Python'],
  },
};

/** 兜底描述：仓库无描述且无笔记时的占位文案 */
export function fallbackDescription(repo: string): string {
  return `仓库 ${repo} 的说明待补充。`;
}

/** 兜底分组：未命中的仓库归入学习记录 */
export function fallbackGroup(repo: string): RepoNote {
  return {
    group: 'notes',
    description: fallbackDescription(repo),
  };
}
