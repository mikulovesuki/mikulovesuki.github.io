/** 项目分类 */
export type ProjectCategory = 'ai' | 'numerical';

/** 精选项目：手动编写的中文介绍（GitHub API 数据在构建时与之合并） */
export interface FeaturedProject {
  /** 仓库名（与 GitHub repo 对齐） */
  repo: string;
  /** 展示名 */
  name: string;
  /** 一句话亮点（卡片标题下的副标题） */
  tagline: string;
  /** 中文详细介绍 */
  description: string;
  /** 量化成果 / 技术要点 */
  highlights: string[];
  /** 技术标签 */
  tech: string[];
  /** 分类 */
  category: ProjectCategory;
  /** 是否首页精选（置顶展示） */
  featured: boolean;
  /** 时间周期 */
  period: string;
}

export const projects: FeaturedProject[] = [
  {
    repo: 'mimo-vision-mcp',
    name: 'mimo-vision-mcp',
    tagline: '用 MCP 给文本 LLM 装上眼睛',
    description:
      '一个 MCP server，把视觉模型（小米 MiMo-V2.5）的图像理解能力暴露给不具备多模态能力的文本 LLM。图片数据本身不经过文本模型——文本模型负责“调度”，视觉模型负责“看”，MCP 把两者接起来。',
    highlights: [
      '支持本地路径 / URL / base64 多种图片输入，多图与格式自动识别',
      '内置 WebUI 配置面板：一键启动脚本自动装环境、开浏览器，零命令行门槛',
      '自动按模型选择 API 协议（chat / responses），配置实时热加载',
      'GitHub Actions CI + 单元测试，MIT 开源',
    ],
    tech: ['Python', 'MCP', 'FastMCP', 'FastAPI', 'CI', 'MiMo-V2.5'],
    category: 'ai',
    featured: true,
    period: '2026.08',
  },
  {
    repo: 'intelligent-travel-assistant',
    name: 'intelligent-travel-assistant',
    tagline: '多 Agent 协作的智能旅行规划系统',
    description:
      '输入目的地、日期与偏好，四个专职 Agent（景点 / 天气 / 酒店 / 规划）协作生成包含景点、餐饮、住宿、天气与预算的完整行程，支持高德地图可视化、行程编辑与 PDF 导出。',
    highlights: [
      '确定性流水线编排（asyncio.gather 并行执行）替代单 Agent 巨型提示词',
      '通过官方 MCP SDK 连接高德 MCP 服务器，工具自动展开 + 最小工具白名单',
      '前后端双端契约单一来源：openapi.json + openapi-typescript 自动生成类型',
      'pytest 编排单测 + API 契约集成测试；结构化错误码前端友好提示',
    ],
    tech: ['Python', 'FastAPI', 'Vue3', 'TypeScript', 'MCP', 'DeepSeek', 'AMap'],
    category: 'ai',
    featured: true,
    period: '2026.08',
  },
  {
    repo: 'math-rag-assistant',
    name: 'math-rag-assistant',
    tagline: '数学论文的混合检索问答系统',
    description:
      '针对数学论文“公式密集、术语精确、中英混排”的检索难点，构建 Markdown 感知分块 → 双语向量化 → BM25 + 向量混合检索 → 流式增强生成的完整 RAG 管线。',
    highlights: [
      'bge-small-zh 双语向量 + jieba 分词 BM25 关键词通道，α 加权分数融合',
      '分块器维护章节标题栈，回答引用精确到章节（如 §3.1 Scaled Dot-Product Attention）',
      '修复 rank_bm25 在恰好半数文档出现时 idf 退化为 0 的隐藏缺陷',
      '索引版本校验、模型懒加载；27 个 pytest 用例离线可跑',
    ],
    tech: ['Python', 'RAG', 'BM25', 'Sentence-Transformers', 'DeepSeek', 'Gradio'],
    category: 'ai',
    featured: true,
    period: '2026.07',
  },
  {
    repo: 'matrix-eigenvalue-methods',
    name: 'matrix-eigenvalue-methods',
    tagline: 'Julia 从零实现矩阵特征值数值算法',
    description:
      '不调用现成特征值例程，用 Julia 从零实现带位移 QR 迭代法、幂法与反幂法，设计收敛判据与子块收缩策略，并与 LinearAlgebra.eigvals 对比验证精度。',
    highlights: [
      '对称 / 上三角 / 含重根矩阵上相对误差达 1e-8 ~ 1e-9',
      '特征向量残差 ‖Ax − λx‖ 均在 1e-10 量级',
      '完整算法推导与数值验证实验报告（LaTeX）',
    ],
    tech: ['Julia', '数值线性代数', 'LaTeX'],
    category: 'numerical',
    featured: true,
    period: '2026.06',
  },
  {
    repo: 'robot-arm-energy-analysis',
    name: 'robot-arm-energy-analysis',
    tagline: '三自由度机械臂能耗分析与数值积分',
    description:
      '以 Modelica 三自由度机械臂多体动力学仿真数据为对象，用 Julia 实现梯形公式与辛普森公式计算不同运动频率下的能耗积分，揭示能耗随速度的非线性增长规律。',
    highlights: [
      '以 2 万区间辛普森积分为基准，两种公式误差均 < 0.03%',
      '频率从 0.2 升到 0.5 Hz，能耗非线性增长 297%，0.3 Hz 为性价比平衡点',
      'Modelica 模型 + 4 工况仿真数据 + 实验报告全套产出',
    ],
    tech: ['Julia', '数值积分', 'Modelica', '动力学仿真', 'LaTeX'],
    category: 'numerical',
    featured: false,
    period: '2026.06',
  },
];

/** 按分类取项目 */
export function projectsByCategory(category: ProjectCategory) {
  return projects.filter((p) => p.category === category);
}

/** 首页精选 */
export function featuredProjects() {
  return projects.filter((p) => p.featured);
}

/** 项目仓库名集合：用于 GitHub API 合并时标注“精选” */
export const featuredRepoNames = new Set(projects.map((p) => p.repo));
