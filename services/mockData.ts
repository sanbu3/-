import { Novel, Chapter, Category } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: '玄幻奇幻', novel_count: 120, description: '东方玄幻与西方奇幻' },
  { id: 2, name: '武侠仙侠', novel_count: 85, description: '传统武侠与修真' },
  { id: 3, name: '都市言情', novel_count: 200, description: '现代都市生活' },
  { id: 4, name: '历史军事', novel_count: 45, description: '架空历史与战争' },
  { id: 5, name: '科幻灵异', novel_count: 60, description: '未来科技与神秘' },
];

export const MOCK_NOVELS: Novel[] = [
  {
    id: 1,
    title: "斗破苍穹",
    clean_title: "斗破苍穹",
    author: "天蚕土豆",
    category: "玄幻奇幻",
    word_count: 5320000,
    chapter_count: 1620,
    file_path: "/books/dp.txt",
    file_size: 1024000,
    encoding: "utf-8",
    is_corrupted: false,
    summary: "这里是属于斗气的世界，没有花俏艳丽的魔法，有的，仅仅是繁衍到巅峰的斗气！",
    tags: "热血,升级,爽文",
    created_at: "2023-01-01 12:00:00",
    updated_at: "2025-12-14 10:00:00"
  },
  {
    id: 2,
    title: "诡秘之主",
    clean_title: "诡秘之主",
    author: "爱潜水的乌贼",
    category: "玄幻奇幻",
    word_count: 4800000,
    chapter_count: 1400,
    file_path: "/books/gmzz.txt",
    file_size: 980000,
    encoding: "utf-8",
    is_corrupted: false,
    summary: "蒸汽与机械的浪潮中，谁能触及非凡？历史和黑暗的迷雾里，又是谁在耳语？",
    tags: "克苏鲁,蒸汽朋克,群像",
    created_at: "2023-02-15 09:30:00",
    updated_at: "2025-12-10 16:20:00"
  },
  {
    id: 3,
    title: "凡人修仙传",
    clean_title: "凡人修仙传",
    author: "忘语",
    category: "武侠仙侠",
    word_count: 7200000,
    chapter_count: 2400,
    file_path: "/books/frxxz.txt",
    file_size: 1500000,
    encoding: "utf-8",
    is_corrupted: false,
    summary: "一个普通山村小子，偶然下进入到当地江湖小门派，成了一名记名弟子。他以这样身份，如何在门派中立足,如何以平庸的资质进入到修仙者的行列，从而笑傲三界之中！",
    tags: "凡人流,修真,慢热",
    created_at: "2023-03-10 14:00:00",
    updated_at: "2025-12-01 08:00:00"
  },
  {
    id: 4,
    title: "三体",
    clean_title: "三体",
    author: "刘慈欣",
    category: "科幻灵异",
    word_count: 900000,
    chapter_count: 36,
    file_path: "/books/st.txt",
    file_size: 200000,
    encoding: "utf-8",
    is_corrupted: false,
    summary: "文化大革命如火如荼进行的同时。军方探寻外星文明的绝秘计划“红岸工程”取得了突破性进展。但在按下发射键的那一刻，历经劫难的叶文洁没有意识到，她彻底改变了人类的命运。",
    tags: "硬科幻,外星文明,人性",
    created_at: "2023-04-01 11:11:11",
    updated_at: "2025-11-20 09:00:00"
  }
];

export const MOCK_CHAPTERS: Record<number, Chapter[]> = {
  1: Array.from({ length: 50 }, (_, i) => ({
    id: 1000 + i,
    novel_id: 1,
    chapter_number: i + 1,
    title: `第${i + 1}章 斗之气，三段！`,
    content: `
      "斗之气，三段！"
      
      望着测验魔石碑上面闪亮得甚至有些刺眼的五个大字，少年面无表情，唇角有着一抹自嘲，紧握的手掌，因为大力，而导致略微尖锐的指甲深深的刺进了掌心之中，带来一阵阵钻心的疼痛...
      
      (这里是模拟的数据库内容。在真实环境中，这里会显示从 chapters 表中读取的 content 字段。)
      
      萧炎苦涩地笑了笑，落寞地转身，孤单的身影，与周围喧哗的世界显得格格不入。
      
      "萧炎，斗之气，三段！级别：低级！" 测验魔石碑之旁，一位中年男子，看了一眼碑上所显示出来的信息，语气漠然的将之公布了出来...
      
      人群中顿时一片哗然。
    `.repeat(20), // Repeat content to simulate length
    word_count: 3000,
    created_at: new Date().toISOString()
  })),
  2: Array.from({ length: 50 }, (_, i) => ({
    id: 2000 + i,
    novel_id: 2,
    chapter_number: i + 1,
    title: `第${i + 1}章 绯红`,
    content: `
      痛！
      
      好痛！
      
      头好痛！
      
      光怪陆离的梦境如同潮水般退去，周明瑞猛地惊醒，大口大口地喘息着。
      
      他环顾四周，发现自己正处于一个陌生的房间里。煤气灯昏黄的光芒照亮了陈旧的书桌和书架。
      
      (这里是模拟的数据库内容。在真实环境中，这里会显示从 chapters 表中读取的 content 字段。)
    `.repeat(20),
    word_count: 2500,
    created_at: new Date().toISOString()
  }))
};
