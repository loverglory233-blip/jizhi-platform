/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Clean Standalone Bundle - Pure Production Build (No Mock Data)
 */
(function() {
  'use strict';

  // --- 1. Agents Module ---
  const AgentProfiles = {
    auctioneer: {
      id: 'auctioneer',
      name: '拍卖师 Agent',
      roleTitle: '头脑风暴 · 学术拍卖师',
      avatar: '🎪',
      color: '#8b5cf6',
      stage: 'stage1',
      description: '指导原则：深入剖析提案的学术价值与潜在风险，促成观点与理由的交融，绝不直接帮学生指定选题或替代决策。'
    },
    managingEditor: {
      id: 'managingEditor',
      name: '责任编辑 Agent',
      roleTitle: '学术编辑部 · 过程学伴',
      avatar: '🤝',
      color: '#10b981',
      stage: 'stage2',
      description: '指导原则：聚焦协作流转与过程监控，实时追踪字数均衡度与同伴互动，适时触发编辑会议，调节团队情绪。'
    },
    reviewingEditor: {
      id: 'reviewingEditor',
      name: '审稿编辑 Agent',
      roleTitle: '学术编辑部 · 专家指导',
      avatar: '📝',
      color: '#0284c7',
      stage: 'stage2',
      description: '指导原则：聚焦高阶认知调节，采用苏格拉底式提问引导结构衔接，提供案例参照，绝不直接替学生撰写任何正文段落。'
    },
    proponent: {
      id: 'proponent',
      name: '正方委员 Agent',
      roleTitle: '答辩委员会 · 肯定支持者',
      avatar: '🟢',
      color: '#16a34a',
      stage: 'stage3',
      description: '指导原则：强化元认知反思中的正面强化，从学术价值、结构严密性与理论结合度肯定优势，增强团队效能感。'
    },
    opponent: {
      id: 'opponent',
      name: '反方委员 Agent',
      roleTitle: '答辩委员会 · 尖锐质疑者',
      avatar: '🔴',
      color: '#dc2626',
      stage: 'stage3',
      description: '指导原则：暴露深层逻辑漏洞与文献矛盾，提出关于变量测量与统计效力的学术质疑，驱动再调节。'
    },
    neutral: {
      id: 'neutral',
      name: '中间委员 Agent',
      roleTitle: '答辩委员会 · 裁决引导者',
      avatar: '🟡',
      color: '#d97706',
      stage: 'stage3',
      description: '指导原则：不偏不倚，将判断权与抗辩权推还给学生群体，引导学生评估哪些质疑需吸纳修改、哪些需书面回应。'
    }
  };

  const PresetMessages = {
    stage1: [
      { 
        sender: 'auctioneer', 
        text: '🎪 【学术拍卖会启动】各位研究者，欢迎进入阶段一【学术拍卖会】！\n\n在接下来的 25 分钟里，请小组成员在左侧点击【+ 提交我的选题提案】，写明你们各自的【研究观点/主题】与选择该主题的【学术理由依据】。\n\n提案提交后，拍卖师将实时为你们进行学术价值鉴定并开启组内竞拍投票与合作合约签署！', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    stage2: [
      { 
        sender: 'managingEditor', 
        text: '🤝 【学术编辑部接管】学术合作合约已全员签署生效！学术编辑部全面上线。\n\n请大家在大文本框中分工协作撰写方案。我将全程实时监控全组成员的字数贡献比与协同节奏，并在半程节点协助大家召开【编辑会议】！', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      { 
        sender: 'reviewingEditor', 
        text: '📝 【审稿编辑认知支架】各位作者，在撰写过程中请务必注意研究问题（RQ）与研究假设（H）之间的逻辑演绎，以及自变量与测量量表的匹配。\n\n提示：审稿编辑提供结构引导与思考提问，绝不替代大家撰写正文，遇到问题可随时在聊天区 @审稿编辑！', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    stage3: [
      { 
        sender: 'proponent', 
        text: '🟢 【正方委员·肯定支持】恭喜研究团队完成研究设计方案！正方审稿专家已就绪，我们将从学术创新性、方案严密性与理论结合度进行评审。', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      { 
        sender: 'opponent', 
        text: '🔴 【反方委员·学术质询】反方审稿专家已审阅大家的初稿，请针对左侧提出的学术质询与方法局限开展组内答辩与论证防御！', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      { 
        sender: 'neutral', 
        text: '🟡 【中间委员·裁决引导】请作者团队在左侧【组内裁决面板】逐项讨论：哪些质疑属于必须在正文中吸纳修改的漏洞？哪些属于可以保留并做出书面抗辩的限定条件？请记录裁决意见并修改终稿！', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  };

  // --- 2. Initial Clean State ---
  const InitialState = {
    currentStage: 'stage1',
    currentUser: 'A',
    timer: {
      elapsedSeconds: 0,
      totalSeconds: 150 * 60,
      speed: 1,
      isRunning: true
    },
    members: {
      'A': { id: 'liming', studentCode: 'A', name: '李明 (学生A/组长)', color: '#0284c7', avatar: '👨‍🎓' },
      'B': { id: 'wangfang', studentCode: 'B', name: '王芳 (学生B/组员)', color: '#059669', avatar: '👩‍🎓' },
      'C': { id: 'chenqiang', studentCode: 'C', name: '陈强 (学生C/组员)', color: '#7c3aed', avatar: '🧑‍🎓' }
    },
    stage1: {
      step: 1,
      proposals: [],
      votes: {},
      hasVoted: {},
      mergedTitle: '',
      contract: {
        topic: '',
        timeAllocations: {
          background: 20,
          questions: 25,
          literature: 30,
          method: 40,
          reflection: 15,
          references: 10
        },
        taskAssignments: { 'A': '', 'B': '', 'C': '' },
        isConfirmed: false,
        confirmedMembers: { 'A': false, 'B': false, 'C': false }
      }
    },
    stage2: {
      unifiedContent: '<h1>《研究设计方案》</h1><p><b>一、研究背景与意义</b></p><p>（请在此处阐述研究背景、现实痛点、理论价值与实践意义...）</p><p><br></p><p><b>二、研究问题与假设</b></p><p>（请在此处明确核心研究问题 RQ 与待检验的研究假设 H...）</p><p><br></p><p><b>三、文献综述</b></p><p>（请在此处梳理相关领域理论基础、国内外研究现状及已有研究局限...）</p><p><br></p><p><b>四、研究设计与方法</b></p><p>（请在此处详细说明实验设计、研究对象与样本、变量定义及测量工具量表...）</p><p><br></p><p><b>五、研究设计的不足与反思</b></p><p>（请在此处反思当前设计的潜在局限、威胁内部/外部效度的因素与改进预案...）</p><p><br></p><p><b>六、参考文献</b></p><p>（请在此处列出引用的学术文献规范条目...）</p>',
      memberContributions: {
        'A': { words: 0, percentage: 33 },
        'B': { words: 0, percentage: 33 },
        'C': { words: 0, percentage: 34 }
      },
      memberTypedCounts: { 'A': 0, 'B': 0, 'C': 0 },
      actionPlan: { isGenerated: false, items: [] }
    },
    stage3: {
      feedbackItems: [],
      finalSubmitted: false,
      finalSubmissionTime: null
    },
    activePresences: {},
    chatLogs: { stage1: [], stage2: [], stage3: [] }
  };

  // --- 3. Export global bundle ---
  window.JIZHI_CONFIG = {
    AgentProfiles,
    PresetMessages,
    InitialState
  };
})();