/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Multi-Agent Definitions and Dialogue Generator Module
 */

export const AgentProfiles = {
  auctioneer: {
    id: 'auctioneer',
    name: '拍卖师 Agent',
    roleTitle: '头脑风暴 · 学术拍卖师',
    avatar: '🎪',
    color: '#8b5cf6',
    stage: 'stage1',
    description: '负责提案鉴定、竞拍引导、争议协商与合约卡片自动签发。'
  },
  managingEditor: {
    id: 'managingEditor',
    name: '责任编辑 Agent',
    roleTitle: '学术编辑部 · 过程学伴',
    avatar: '🤝',
    color: '#10b981',
    stage: 'stage2',
    description: '聚焦过程调节：实时监控字数贡献比，催促进度与定时发起编辑会议。'
  },
  reviewingEditor: {
    id: 'reviewingEditor',
    name: '审稿编辑 Agent',
    roleTitle: '学术编辑部 · 专家指导',
    avatar: '📝',
    color: '#3b82f6',
    stage: 'stage2',
    description: '聚焦认知调节：推送优秀范例、在关键节点给与结构化反馈，具备15分钟冷却机制。'
  },
  proponent: {
    id: 'proponent',
    name: '正方委员 Agent',
    roleTitle: '答辩委员会 · 肯定支持者',
    avatar: '🟢',
    color: '#22c55e',
    stage: 'stage3',
    description: '强化优势：肯定研究的创新点与结构规范，增强团队效能感。'
  },
  opponent: {
    id: 'opponent',
    name: '反方委员 Agent',
    roleTitle: '答辩委员会 · 尖锐质疑者',
    avatar: '🔴',
    color: '#ef4444',
    stage: 'stage3',
    description: '暴露漏洞：提出逻辑漏洞、方法缺陷与文献矛盾，驱动再调节。'
  },
  neutral: {
    id: 'neutral',
    name: '中间委员 Agent',
    roleTitle: '答辩委员会 · 裁决引导者',
    avatar: '🟡',
    color: '#eab308',
    stage: 'stage3',
    description: '推回选择权：不站队，引导小组成员探讨“哪些批评值得采纳”。'
  }
};

export const PresetMessages = {
  stage1: [
    { sender: 'auctioneer', text: '🎪 欢迎来到学术拍卖会！在接下来的25分钟里，我们将共同选定研究主题并签署合作合约。请三位学习伙伴在左侧提交你最感兴趣的研究提案。', delay: 500 },
    { sender: 'A', text: '我已经提交了关于“生成式AI工具对学习投入度影响”的提案！', delay: 1500 },
    { sender: 'B', text: '我提交的是“在线协作写作中的搭便车现象干预”。', delay: 2500 },
    { sender: 'C', text: '我填了“短视频对课堂注意力的影响”。', delay: 3500 },
    { sender: 'auctioneer', text: '📋 三件拍品已收齐！我已完成初步鉴定：\n1️⃣ AI与学习投入：文献极丰富，但易撞题；\n2️⃣ 协作搭便车：经典稳妥，符合本课SSRL主旨；\n3️⃣ 短视频注意力：极具新意但文献较分散。\n请大家在左侧完成投票！', delay: 4500 },
    { sender: 'auctioneer', text: '🔨 投票结果：2票选“协作搭便车”，1票选“短视频注意力”。请注意！C提出了不同的方向。C，你愿不愿意把“注意力分配”作为“搭便车”的一个核心原因进行融合？', delay: 6000 },
    { sender: 'C', text: '这个融合思路很棒！我们可以研究“基于注意力分配与AI感知视角的搭便车干预”。', delay: 7500 },
    { sender: 'A', text: '赞成！这样既有经典理论支持，又很有新意！', delay: 8500 },
    { sender: 'auctioneer', text: '🔨 锤定！主题已锁定为《协作学习中的“搭便车”现象：基于注意力分配与AI感知视角》。现在，请大家商讨150分钟的时间分配与6个模块的分工，随后我将签发【合作合约卡片】。', delay: 9500 }
  ],

  stage2: [
    { sender: 'managingEditor', text: '🤝 合约已生效！学术编辑部全面接管。A负责背景与问题，B负责文献，C负责方法、反思与参考文献。现在开始上半程写作（45分钟）。', delay: 500 },
    { sender: 'reviewingEditor', text: '📝 【案例展示】各位作者，在动笔之前，可以参考右侧优秀示例库中的《研究设计范例》，注意研究问题必须与实证方法相呼应。', delay: 1500 },
    { sender: 'A', text: '我在背景里把生成式AI和搭便车结合起来写了，B你看看文献部分怎么接。', delay: 3000 },
    { sender: 'managingEditor', text: '⏰ 进度提醒：上半程写作已过去20分钟。实时监测显示 A (42%)，B (31%)，C (27%)。大家配合非常高效！保持势头。', delay: 5000 },
    { sender: 'managingEditor', text: '📢 【编辑会议① 触发】上半程时间到！请三位作者在弹窗中对目前的写作质量与过程进行星级评价（1-5星）。', delay: 7000 },
    { sender: 'reviewingEditor', text: '📝 【审稿意见①】看了大家完成的前三部分，背景与逻辑很清晰。但“研究问题与假设”中的H2假设缺少明确的测量工具说明，请在方法部分补充。', delay: 9000 }
  ],

  stage3: [
    { sender: 'proponent', text: '🟢 【正方委员】恭喜组员完成方案！整体来看，该研究将SSRL理论与AI感知机制紧密结合，研究问题具体且富有现实教育价值。', delay: 500 },
    { sender: 'opponent', text: '🔴 【反方委员】我有三个尖锐质疑：\n1. 文献中有3篇结论与你们的假设相反，如何解释？\n2. 问卷缺失情感与行为维度！\n3. 150人样本做过Power Analysis统计效力分析吗？', delay: 2000 },
    { sender: 'neutral', text: '🟡 【中间委员】正反方意见都很客观。请小组在左侧看板讨论：反方的三个质疑，哪些需要必须修改，哪些只需书面回应？请做出统一裁决！', delay: 3500 },
    { sender: 'A', text: '反方的第1和第2点确实是我们忽略的，我建议立刻在修改稿里补充！第3点我们可以作为研究限制说明。', delay: 5000 }
  ]
};
