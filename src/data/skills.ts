/** 技能分组：用于技能云与关于页 */
export interface SkillGroup {
  id: string;
  /** 分组名 */
  title: string;
  /** 分组图标（simple-icons 名称或自定义 key） */
  icon: string;
  /** 分组描述 */
  desc: string;
  /** 技能条目 */
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'ai',
    title: 'AI 应用开发',
    icon: 'ai',
    desc: '把大模型能力落地成可用的应用与工具',
    skills: [
      'MCP 协议',
      '多 Agent 编排',
      'RAG 混合检索',
      'Function Calling',
      'FastAPI',
      'Vue3 / TypeScript',
      'pytest',
    ],
  },
  {
    id: 'numerical',
    title: '数值计算',
    icon: 'numerical',
    desc: '从算法原理出发，自己实现并验证数值方法',
    skills: [
      'Julia',
      'QR 迭代 / 幂法 / 反幂法',
      '数值积分（梯形 / 辛普森）',
      'Modelica 多体动力学',
      'Mathematica',
      'C++ 模拟退火',
    ],
  },
  {
    id: 'academic',
    title: '学术与工具链',
    icon: 'academic',
    desc: '把研究和写作过程工程化',
    skills: [
      'LaTeX（ctex / Beamer）',
      'Markdown',
      'Git & GitHub Actions',
      'Linux',
      'pandas / NumPy',
    ],
  },
];
