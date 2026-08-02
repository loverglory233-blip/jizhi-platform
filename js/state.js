/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Global State Management - Voting Lock & Voting Notification Tracking
 */

export const InitialState = {
  // Global App State
  currentStage: 'stage1', // 'stage1' | 'stage2' | 'stage3'
  currentUser: 'A', // 'A' | 'B' | 'C'
  timer: {
    elapsedSeconds: 0,
    totalSeconds: 150 * 60,
    speed: 1,
    isRunning: true
  },
  
  // Group Members
  members: {
    'A': { name: '李明 (学生A/组长)', color: '#6366f1', avatar: '👨‍🎓' },
    'B': { name: '王芳 (学生B/组员)', color: '#06b6d4', avatar: '👩‍🎓' },
    'C': { name: '陈强 (学生C/组员)', color: '#f59e0b', avatar: '🧑‍🎓' }
  },

  // Stage 1: Brainstorming (Academic Auction)
  stage1: {
    step: 1,
    proposals: [
      { 
        id: 'p1', 
        author: 'A', 
        title: '生成式AI工具对大学生协作学习投入度的影响机制研究', 
        rationale: '当前生成式AI普及迅速，但学生容易产生认知依赖，探索其行为与情感投入机制对促进高阶思维有重要价值。', 
        category: '前沿探索', 
        metrics: { literature: '丰富', innovation: '高', risk: '中' } 
      },
      { 
        id: 'p2', 
        author: 'B', 
        title: '在线协作写作中的“搭便车”现象及其干预策略研究', 
        rationale: '搭便车是小组写作中最突出的实践痛点，基于群体感知可视化开展干预，理论成熟且有强烈的实证需求。', 
        category: '经典稳妥', 
        metrics: { literature: '极丰富', innovation: '中', risk: '低' } 
      },
      { 
        id: 'p3', 
        author: 'C', 
        title: '短视频使用对大学生课堂注意力持续时间的影响', 
        rationale: '大学生普遍存在注意力碎片化问题，从认知心理学角度切入非常有新意。', 
        category: '跨界探求', 
        metrics: { literature: '较分散', innovation: '极高', risk: '高' } 
      }
    ],
    // Voting Lock & Status per member
    votes: { 'A': 'p2', 'B': 'p2', 'C': null },
    hasVoted: { 'A': true, 'B': true, 'C': false }, // Locked once voted
    mergedTitle: '协作学习中的“搭便车”现象：基于注意力分配与AI感知视角',
    contract: {
      topic: '协作学习中的“搭便车”现象：基于注意力分配与AI感知视角',
      timeAllocations: {
        background: 20,
        questions: 25,
        literature: 30,
        method: 40,
        reflection: 15,
        references: 10
      },
      taskAssignments: {
        'A': '研究背景与意义、研究问题与假设',
        'B': '文献综述',
        'C': '研究设计与方法、不足与反思、参考文献'
      },
      isConfirmed: false,
      signed: { 'A': true, 'B': true, 'C': true }
    }
  },

  // Stage 2: Collaborative Writing (Unified Large Document Editor)
  stage2: {
    unifiedContent: `《协作学习中的“搭便车”现象：基于注意力分配与AI感知视角》研究设计方案

一、研究背景与意义
随着生成式人工智能（Generative AI）在高等教育中的迅速普及，在线协作学习（Collaborative Learning）已成为培养大学生批判性思维与高阶认知能力的重要手段。然而，在真实写作场景中，“搭便车”（Free-riding）现象屡见不鲜，导致部分成员参与度低、团队责任感稀释。同时，智能手机与短视频的流行加剧了学生的注意力碎片化问题。本研究旨在探讨基于注意力分配与AI群体感知的协作写作干预机制，以期提升共享调节学习（SSRL）效率。

二、研究问题与假设
基于上述背景，本研究提出以下核心研究问题与假设：
RQ1：在多智能体支持的在线协作写作中，群体感知可视化如何影响“搭便车”者的参与度？
RQ2：不同的智能体介入模式（过程引导 vs 认知干预）对小组共享反思质量有何差异？
H1：实时字数与发言贡献比的可视化反馈能显著降低小组成员的消极怠工行为。
H2：具有“质疑方”角色的多智能体测评机制能显著增强学生在修改阶段的再调节行为。

三、文献综述
1. 共享调节学习（SSRL）理论框架：Hadwin等（2018）指出，SSRL强调学习者在共同目标下建立共享的任务感知、过程监控与元认知反思。
2. 生成式AI与多智能体技术：吴欧等（2024）总结了大语言模型多智能体在教育中的角色演进，指出智能学伴与评估智能体的协同能有效提升人机机人混合临场感。
3. 搭便车干预机制：姚佳佳等（2023）实证研究表明，可视化互动界面对同伴对话反馈具有显著促进作用。

四、研究设计与方法
本研究采用准实验设计（Quasi-experimental Design），将150名大学生随机分为实验组（多智能体支持协作写作）与对照组（标准在线协作写作），开展为期150分钟的实验。
变量测量：
1. 过程性数据：系统自动记录文本贡献字数比、聊天发言频次、编辑会议打分；
2. 批判性思维与SSRL量表：采用Facione（1990）Delphi报告量表进行前后测评估；
3. 半结构化访谈：每组选取4名代表进行6-8分钟追问。

五、研究设计的不足与反思
1. 样本范围局限：受限于单次课程实验，长期的迁移效应尚待追踪。
2. 智能体响应延迟：在高并发讨论场景下，大模型的API响应速度需要进一步调优。

六、参考文献
[1] Hadwin, A., et al. (2018). Self-regulated, co-regulated, and socially shared regulation of learning.
[2] 吴永和, 姜元昊, 等. (2024). 大语言模型支持的多智能体：技术路径、教育应用与未来展望[J]. 开放教育研究.
[3] 欧阳璠, 付宏杰. (2025). 多智能体支持论证式协作知识建构: ABCKC-AI系统设计与准实验评估[J]. 远程教育杂志.`,

    memberContributions: {
      'A': { words: 520, percentage: 42 },
      'B': { words: 380, percentage: 31 },
      'C': { words: 330, percentage: 27 }
    }
  },

  // Stage 3: Defense & Reflection
  stage3: {
    feedbackItems: [
      { id: 'f1', role: 'opponent', title: '文献矛盾质疑', content: '你们假设AI提升学习投入，但文献中有3篇研究表明显性感知会导致评价焦虑，请问如何解释此矛盾？', status: 'adopted', response: '已在文献综述第二节补充辩证分析，区分了不同提示词支架下的投入与焦虑差异。' },
      { id: 'f2', role: 'opponent', title: '问卷维度完整性', content: '问卷目前仅包含认知维度，缺失了情感投入与行为投入维度，如何处理？', status: 'adopted', response: '已在研究设计中将问卷扩充为认知、情感、行为三维综合测量表。' },
      { id: 'f3', role: 'opponent', title: '统计效力质疑', content: '150人的样本量是否做过事先的 Power Analysis 统计效力计算？', status: 'pending', response: '' },
      { id: 'f4', role: 'proponent', title: '创新点肯定', content: '将SSRL共享调节与学术拍卖会模式结合，设计富有创意且逻辑严密。', status: 'acknowledged', response: '感谢肯定，保留该核心设计。' }
    ]
  },

  // Chat Logs
  chatLogs: {
    stage1: [],
    stage2: [],
    stage3: []
  }
};
