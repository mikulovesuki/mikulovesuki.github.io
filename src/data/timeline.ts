/** 时间线：个人学习与项目轨迹（不含任何获奖声明） */
export interface TimelineItem {
  period: string;
  title: string;
  description: string;
  /** 关联仓库（可选） */
  repos?: string[];
  tag?: 'learning' | 'competition' | 'project';
}

export const timeline: TimelineItem[] = [
  {
    period: '2025.04',
    title: '注册 GitHub',
    description: '开始记录学习与项目，把“做过的东西”沉淀成可追溯的仓库。',
    tag: 'learning',
  },
  {
    period: '2025.06',
    title: 'LaTeX 与 Git 入门',
    description: '系统学习 LaTeX 排版与 Git 工作流，养成为文档和代码写 README 的习惯。',
    repos: ['Latex-learn', 'git_demo'],
    tag: 'learning',
  },
  {
    period: '2025.07 – 2025.09',
    title: '数学建模竞赛参赛',
    description:
      '暑期建模 + 国赛 A 题备赛：用 C++ 实现模拟退火算法求解优化问题，Mathematica 做数据可视化，LaTeX 撰写完整论文，完整走了一遍“建模—求解—验证—写作”流程。',
    repos: ['-------'],
    tag: 'competition',
  },
  {
    period: '2026.05 – 2026.06',
    title: '数值计算课程项目',
    description:
      '两个“从零实现”项目：Julia 实现带位移 QR 迭代 / 幂法 / 反幂法求解特征值；基于 Modelica 仿真数据用数值积分分析机械臂能耗。',
    repos: ['matrix-eigenvalue-methods', 'robot-arm-energy-analysis'],
    tag: 'project',
  },
  {
    period: '2026.06 – 2026.08',
    title: 'AI 应用开发',
    description:
      '三个月内完成三个完整项目：数学论文 RAG 问答 → 多 Agent 智能旅行规划 → MCP 视觉能力服务器，每项都配齐测试、CI 与完整文档。',
    repos: ['math-rag-assistant', 'intelligent-travel-assistant', 'mimo-vision-mcp'],
    tag: 'project',
  },
];
