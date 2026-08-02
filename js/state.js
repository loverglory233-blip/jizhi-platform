/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * State Management Module
 */

export const InitialState = {
  // Global App State
  currentStage: 'stage1', // 'stage1' | 'stage2' | 'stage3'
  currentUser: 'A', // 'A' (我/组长) | 'B' (张同学) | 'C' (李同学)
  timer: {
    elapsedSeconds: 0,
    totalSeconds: 150 * 60, // 150 minutes
    speed: 1, // 1x, 5x, 10x
    isRunning: true
  },
  
  // Group Members Info
  members: {
    'A': { name: '学生A (我/组长)', color: '#6366f1', avatar: '👨‍🎓' },
    'B': { name: '学生B (张同学)', color: '#06b6d4', avatar: '👩‍🎓' },
    'C': { name: '学生C (李同学)', color: '#f59e0b', avatar: '🧑‍🎓' }
  },

  // Stage 1: Brainstorming (Academic Auction)
  stage1: {
    step: 1, // 1: Proposal, 2: Valuation, 3: Voting & Negotiation, 4: Contracting
    proposals: [
      { id: 'p1', author: 'A', title: '生成式AI工具对大学生协作学习投入度的影响机制机制研究', rationale: '探索LLM在小组写作中的认知与情感投入', category: '新颖方向', metrics: { literature: '丰富', innovation: '高', risk: '中' } },
      { id: 'p2', author: 'B', title: '在线协作写作中的“搭便车”现象及其干预策略研究', rationale: '研究基于群体感知的消极协作干预', category: '经典稳妥', metrics: { literature: '极丰富', innovation: '中', risk: '低' } },
      { id: 'p3', author: 'C', title: '短视频使用对大学生课堂注意力持续时间的影响', rationale: '聚焦认知神经与行为观察', category: '跨界探求', metrics: { literature: '较分散', innovation: '极高', risk: '高' } }
    ],
    votes: { 'A': 'p2', 'B': 'p2', 'C': 'p3' },
    negotiationMerged: true,
    mergedTitle: '协作学习中的“搭便车”现象：基于注意力分配与AI感知视角',
    contract: {
      topic: '协作学习中的“搭便车”现象：基于注意力分配与AI感知视角',
      timeAllocations: {
        background: 20,
        questions: 25,
        literature: 30,
        method: 40,
        reflection: 15,
        references: 10,
        buffer: 10
      },
      taskAssignments: {
        'A': ['研究背景与意义', '研究问题与假设'],
        'B': ['文献综述'],
        'C': ['研究设计与方法', '不足与反思', '参考文献']
      },
      signed: { 'A': true, 'B': true, 'C': true }
    }
  },

  // Stage 2: Collaborative Writing (Academic Editorial Board)
  stage2: {
    activeSection: 'background',
    editorCooldownSeconds: 0, // Reviewing Editor Cooldown
    meeting1Done: false,
    meeting2Done: false,
    meetingModalOpen: false,
    currentMeeting: 1, // 1 or 2
    meetingRatings: {
      1: { 'A': 4, 'B': 3, 'C': 4, feedbackText: '背景部分逻辑顺畅，但文献衔接需要增强。' },
      2: { 'A': 5, 'B': 4, 'C': 4, feedbackText: '整体质量达标，研究方法补充了验证指标。' }
    },
    docSections: {
      background: {
        title: '一、研究背景与意义',
        targetTime: 20,
        assignedTo: 'A',
        content: `随着生成式人工智能（Generative AI）在高等教育中的迅速普及，在线协作学习（Collaborative Learning）已经成为培养大学生批判性思维与高阶认知能力的重要手段。然而，在真实协作写作场景中，“搭便车”（Free-riding）现象屡见不鲜，导致部分成员参与度低、团队责任感稀释。同时，智能手机与短视频的流行加剧了学生的注意力碎片化问题。本研究旨在探讨基于注意力分配与AI群体感知的协作写作干预机制，以期提升共享调节学习（SSRL）效率。`,
        history: []
      },
      questions: {
        title: '二、研究问题与假设',
        targetTime: 25,
        assignedTo: 'A',
        content: `基于上述背景，本研究提出以下核心研究问题与假设：
RQ1：在多智能体支持的在线协作写作中，群体感知可视化如何影响“搭便车”者的参与度？
RQ2：不同的智能体介入模式（过程引导 vs 认知干预）对小组共享反思质量有何差异？
H1：实时字数与发言贡献比的可视化反馈能显著降低小组成员的消极怠工行为。
H2：具有“质疑方”角色的多智能体测评机制能显著增强学生在修改阶段的再调节行为。`,
        history: []
      },
      literature: {
        title: '三、文献综述',
        targetTime: 30,
        assignedTo: 'B',
        content: `1. 共享调节学习（SSRL）理论框架：Hadwin等（2018）指出，SSRL强调学习者在共同目标下建立共享的任务感知、过程监控与元认知反思。
2. 生成式AI与多智能体技术：吴永和等（2024）总结了大语言模型多智能体在教育中的角色演进，指出智能学伴与评估智能体的协同能有效提升人机机人混合临场感。
3. 搭便车干预机制：姚佳佳等（2023）实证研究表明，可视化互动界面对同伴对话反馈具有显著促进作用。`,
        history: []
      },
      method: {
        title: '四、研究设计与方法',
        targetTime: 40,
        assignedTo: 'C',
        content: `本研究采用准实验设计（Quasi-experimental Design），将150名大学生随机分为实验组（多智能体支持协作写作）与对照组（标准在线协作写作），开展为期150分钟的实验。
变量测量：
1. 过程性数据：系统自动记录文本贡献字数比、聊天发言频次、编辑会议打分；
2. 批判性思维与SSRL量表：采用Facione（1990）Delphi报告量表进行前后测评估；
3. 半结构化访谈：每组选取4名代表进行6-8分钟追问。`,
        history: []
      },
      reflection: {
        title: '五、研究设计的不足与反思',
        targetTime: 15,
        assignedTo: 'C',
        content: `1. 样本范围局限：受限于单次课程实验，长期的迁移效应尚待追踪。
2. 智能体响应延迟：在高并发讨论场景下，大模型的API响应速度需要进一步调优。`,
        history: []
      },
      references: {
        title: '六、参考文献',
        targetTime: 10,
        assignedTo: 'C',
        content: `[1] Hadwin, A., et al. (2018). Self-regulated, co-regulated, and socially shared regulation of learning.
[2] 吴永和, 姜元昊, 等. (2024). 大语言模型支持的多智能体：技术路径、教育应用与未来展望[J]. 开放教育研究.
[3] 欧阳璠, 付宏杰. (2025). 多智能体支持论证式协作知识建构: ABCKC-AI系统设计与准实验评估[J]. 远程教育杂志.`,
        history: []
      }
    },
    memberContributions: {
      'A': { words: 420, percentage: 42 },
      'B': { words: 310, percentage: 31 },
      'C': { words: 270, percentage: 27 }
    }
  },

  // Stage 3: Defense & Reflection (Defense Arena)
  stage3: {
    feedbackItems: [
      { id: 'f1', role: 'opponent', title: '文献矛盾质疑', content: '你们假设AI提升学习投入，但文献中有3篇研究结论与之相反，请问如何解释此矛盾？', status: 'adopted', response: '已在文献综述第二节补充辩证分析，区分了不同提示词支架下的投入差异。' },
      { id: 'f2', role: 'opponent', title: '问卷维度完整性', content: '问卷目前仅包含认知维度，缺失了情感投入与行为投入维度，如何处理？', status: 'adopted', response: '已在研究设计中将问卷扩充为认知、情感、行为三维综合测量表。' },
      { id: 'f3', role: 'opponent', title: '统计效力质疑', content: '150人的样本量是否做过事先的 Power Analysis 统计效力计算？', status: 'pending', response: '' },
      { id: 'f4', role: 'proponent', title: '创新点肯定', content: '将SSRL共享调节与学术拍卖会模式结合，设计富有创意且逻辑严密。', status: 'acknowledged', response: '感谢肯定，保留该核心设计。' }
    ],
    reflectionAnswers: {
      taskUnderstanding: 5,
      processCoordination: 4,
      metacognitiveReflection: 5
    },
    finalSubmitted: false
  },

  // Chat Log Repository per stage
  chatLogs: {
    stage1: [],
    stage2: [],
    stage3: []
  }
};
