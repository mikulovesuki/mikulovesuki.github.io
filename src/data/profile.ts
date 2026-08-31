/**
 * 自我介绍 —— 网站拥有者自己填写的内容。
 *
 * 修改后保存，刷新页面即可看到（dev 模式热更新）。
 * 想让所有访客看到：本地管理后台编辑并发布，或直接修改此文件后 git push
 * （GitHub Actions 会自动重新构建部署）。
 */
export interface Profile {
  /** 昵称 / 名字 */
  name: string;
  /** 一句话身份标签 */
  headline: string;
  /** 自我介绍正文段落（每段一个字符串） */
  paragraphs: string[];
  /** 当前状态 / 近况（可选，会显示在名字下方） */
  status?: string;
}

export const profile: Profile = {
  name: 'oblivion',
  headline: 'AI 应用开发 · 数值计算 · 数学建模',
  status: '',
  paragraphs: [
    '（这里是自我介绍占位内容。请在 src/data/profile.ts 中修改成你自己的介绍。）',
    '可以写：你的专业与方向、正在做的事情、感兴趣的技术领域、想通过这个网站表达什么。支持多段文字，每段一个字符串。',
  ],
};
