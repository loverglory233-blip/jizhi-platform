/**
 * JIZHI (集智) Multi-Agent Collaborative Writing Platform
 * Quad-Redundant Real-Time Cloud Sync Engine v6
 * (Supports Chrome, Safari, Edge, Firefox, Incognito Mode & Multi-Device Real-Time Sync)
 * (Zero Backend / Zero server.py Modification Required)
 */

(function() {
  /* ==========================================================================
     1. STATE MANAGEMENT
     ========================================================================== */
  const InitialState = {
    currentStage: 'stage1',
    currentUser: 'A',
    isFinalSubmitted: false,
    timer: {
      elapsedSeconds: 0,
      speed: 1,
      isRunning: true
    },
    members: {
      'A': { id: 'A', name: '李明 (学生A)', roleTitle: '组长 · 论文结构', avatar: '👨‍🎓', color: '#818cf8', studentCode: 'A' },
      'B': { id: 'B', name: '王芳 (学生B)', roleTitle: '组员 · 文献综述', avatar: '👩‍🎓', color: '#22d3ee', studentCode: 'B' },
      'C': { id: 'C', name: '陈强 (学生C)', roleTitle: '组员 · 研究设计', avatar: '🧑‍🎓', color: '#fbbf24', studentCode: 'C' }
    },

    stage1: {
      mergedTitle: '协作学习中的“搭便车”现象：基于注意力分配与AI感知视角',
      votes: { 'A': null, 'B': null, 'C': null },
      hasVoted: { 'A': false, 'B': false, 'C': false },
      proposals: [
        {
          id: 'prop-1',
          author: 'A',
          title: '生成式AI工具对大学生协作学习投入度的影响机制',
          category: '前沿探索',
          rationale: '当前生成式AI在教育中普及迅速，但学生容易产生认知依赖，探索其行为与情感投入机制具有极高的实践教育意义！',
          metrics: { literature: '高', innovation: '极高', risk: '中' }
        },
        {
          id: 'prop-2',
          author: 'B',
          title: '在线协作写作中的“搭便车”现象及其干预策略研究',
          category: '实证干预',
          rationale: '搭便车是小组写作中最突出的痛点，基于群体感知可视化进行干预，理论成熟且有强烈的实证需求。',
          metrics: { literature: '极高', innovation: '中', risk: '低' }
        },
        {
          id: 'prop-3',
          author: 'C',
          title: '短视频使用对大学生课堂注意力持续时间的影响',
          category: '行为心理',
          rationale: '大学生普遍存在短视频带来的注意力碎片化问题，从认知心理学角度切入非常有新意！',
          metrics: { literature: '中', innovation: '高', risk: '高' }
        }
      ],
      contract: {
        isConfirmed: false,
        confirmedMembers: { 'A': false, 'B': false, 'C': false },
        timeAllocations: {
          background: 20,
          questions: 25,
          literature: 30,
          method: 40,
          reflection: 15,
          references: 10
        },
        taskAssignments: {
          'A': '一、研究背景与意义；二、研究问题与假设',
          'B': '三、文献综述与 SSRL 共享调节框架',
          'C': '四、研究设计与方法；五、不足与反思；六、参考文献'
        }
      }
    },

    stage2: {
      unifiedContent: `《协作学习中的“搭便车”现象：基于注意力分配与AI感知视角》

一、研究背景与意义
在高等教育的混合式与在线协作学习场景中，“搭便车”（Free-riding）现象长期困扰着小组学习的质量与公平性。生成式AI技术（如智谱AI、ChatGPT）的引入为协同写作带来了新的可能性，但也引发了关于社会惰化与感知沉溺的新问题。本研究基于共享调节学习（SSRL）理论，旨在探索群体感知可视化对搭便车行为的干预机制。

二、研究问题与假设
H1：显性化群体感知反馈能够显著降低小组写作中的搭便车发生率。
H2：注意力分配透明化在群体感知与认知投入之间起显著的中介作用。

三、文献综述
协作学习中的社会惰化理论表明，当个人贡献难以被感知和评价时，个体的努力程度会下降。SSRL 理论强调通过团队共享目标与过程监控来实现自律。引用 2024 年最新教育技术实证研究，过程性评价能有效改善参与平衡度。

四、研究设计与方法
本研究拟采用准实验设计，选择某高校《现代教育技术》课程 150 名本科生作为研究样本。通过集成化平台实时采集字数贡献比、互动频率与注意力分布，采用 Facione 经典量表进行前后测评价。

五、不足与反思
本研究样本局限于单一专业，未来需扩大样本代表性；同时需防范显性感知带来的评价焦虑。

六、参考文献
[1] Hadley, G., et al. (2024). Socially Shared Regulation in AI-assisted Collaborative Writing. Computers & Education.
[2] Johnson, D. W., & Johnson, R. T. (2019). Cooperation and Competition: Theory and Research.`,
      memberContributions: {
        'A': { words: 462, percentage: 42 },
        'B': { words: 341, percentage: 31 },
        'C': { words: 297, percentage: 27 }
      },
      actionPlan: {
        isGenerated: true,
        items: [
          '修订项① (逻辑与方法): 在“二、研究问题与假设”末尾补齐与“四、研究设计”操作化变量的对应说明。',
          '修订项② (瓶颈突破): 针对【假设与研究设计工具对应不明确】，参照《编辑会议规范与范例模板文件.pdf》补充相关文献引用。',
          '修订项③ (团队协调): 维持当前平衡贡献 (A:42%, B:31%, C:27%)，在后45分钟内重点完成“五、反思”。'
        ]
      }
    },

    stage3: {
      activeTab: 'defense', // 'defense' or 'editor'
      feedbackItems: [
        {
          id: 'fb-1',
          role: 'opponent',
          speaker: '反方委员 Agent',
          title: '显性感知反馈可能诱发评价焦虑的心理负面效应',
          content: '文献中有实证研究表明显性群体感知反馈会引发评价焦虑 (Evaluation Anxiety)，研究假设 H1 是否忽略了这一心理负面效应？',
          neutralGuidance: '🟡 中间委员裁决引导：请团队评估该质疑。你们认为这是应该在正文第四章补充的限制条件，还是可以通过“过程性提示而非结果排名”进行辩护？请讨论并录入结论。',
          status: 'pending',
          response: ''
        },
        {
          id: 'fb-2',
          role: 'opponent',
          speaker: '反方委员 Agent',
          title: '问卷量表维度缺失（未涵盖行为投入与情绪投入）',
          content: '现有研究设计的问卷仅测量了认知投入，缺失了情绪投入与行为投入维度，如何确保测量完整性？',
          neutralGuidance: '🟡 中间委员裁决引导：该质疑涉及测量效度。请团队讨论是否需要在研究设计中将问卷扩展为“认知、情绪、行为”三维量表？',
          status: 'pending',
          response: ''
        },
        {
          id: 'fb-3',
          role: 'proponent',
          speaker: '正方委员 Agent',
          title: 'SSRL 共享调节与 AI 群体感知的切入点极具创新性',
          content: '将注意力分配可视化作为中介变量，巧妙破解了搭便车干预的传统死板局限，理论价值极高。',
          neutralGuidance: '🟡 中间委员裁决引导：正方委员给予了充分肯定。请团队讨论如何在终稿的“六、反思与意义”中进一步深化此理论贡献。',
          status: 'pending',
          response: ''
        }
      ]
    },

    chatLogs: {
      stage1: [],
      stage2: [],
      stage3: []
    }
  };

  /* ==========================================================================
     2. HELPER FUNCTIONS (REAL FILE DOWNLOAD)
     ========================================================================== */
  function downloadFileBlob(filename, textContent = null) {
    const defaultContent = `====================================================\n【集智 JIZHI 平台 - 教学资源文件】\n文件名: ${filename}\n下载时间: ${new Date().toLocaleString()}\n课程名称: 《现代教育技术》期末协作写作研究设计\n====================================================\n\n【文件核心规范摘要】\n1. 结构完整性：论文方案需具备研究背景、问题假设、文献综述、研究设计、反思及参考文献。\n2. 变量操作化：研究假设 H1、H2 需在第四章给出对应的测量量表与操作化说明。\n3. 群体感知：通过可视化字数贡献比与同伴互动进行自律与共享调节 (SSRL)。`;
    const content = textContent || defaultContent;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ==========================================================================
     3. AGENT PROFILES & PRESETS
     ========================================================================== */
  const AgentProfiles = {
    auctioneer: { id: 'auctioneer', name: '拍卖师 Agent', roleTitle: '头脑风暴 · 学术拍卖师', avatar: '🎪', color: '#8b5cf6', stage: 'stage1' },
    managingEditor: { id: 'managingEditor', name: '责任编辑 Agent', roleTitle: '学术编辑部 · 过程学伴', avatar: '🤝', color: '#10b981', stage: 'stage2' },
    reviewingEditor: { id: 'reviewingEditor', name: '审稿编辑 Agent', roleTitle: '学术编辑部 · 专家指导', avatar: '📝', color: '#3b82f6', stage: 'stage2' },
    proponent: { id: 'proponent', name: '正方委员 Agent', roleTitle: '答辩委员会 · 肯定支持者', avatar: '🟢', color: '#22c55e', stage: 'stage3' },
    opponent: { id: 'opponent', name: '反方委员 Agent', roleTitle: '答辩委员会 · 尖锐质疑者', avatar: '🔴', color: '#ef4444', stage: 'stage3' },
    neutral: { id: 'neutral', name: '中间委员 Agent', roleTitle: '答辩委员会 · 裁决引导者', avatar: '🟡', color: '#eab308', stage: 'stage3' }
  };

  const PresetMessages = {
    stage1: [
      { sender: 'auctioneer', text: `🎪 【学术拍卖会启动】各位研究者，欢迎来到学术选题拍卖会！在接下来的 25 分钟里，我们需要共同确定最具学术价值且可行的研究选题，并签署合作合约。\n\n请注意：提交提案时不仅要写明【观点/主题】，更要清晰阐述选择该主题的【学术理由与背景】。请三位学习伙伴在左侧提交各自的提案！`, timestamp: '14:00' },
      { sender: 'A', text: '我提交了【观点】：生成式AI工具对大学生协作学习投入度的影响机制；【理由】：当前生成式AI在教育中普及迅速，但学生容易产生认知依赖，探索其行为与情感投入机制具有极高的实践教育意义！', timestamp: '14:02' },
      { sender: 'B', text: '我提交了【观点】：在线协作写作中的“搭便车”现象及其干预策略研究；【理由】：搭便车是小组写作中最突出的痛点，基于群体感知可视化进行干预，理论成熟且有强烈的实证需求。', timestamp: '14:03' },
      { sender: 'C', text: '我提交了【观点】：短视频使用对大学生课堂注意力持续时间的影响；【理由】：大学生普遍存在短视频带来的注意力碎片化问题，从认知心理学角度切入非常有新意！', timestamp: '14:04' },
      { sender: 'auctioneer', text: `📋 【拍卖师深度鉴定与评估】三件拍品及其理由已收齐！我将从文献成熟度、创新性与实践可行性三方面进行深度鉴定：\n\n1️⃣ 《生成式AI对投入度的影响》（观点+理由）：选题切中前沿，理由充分，但“投入度”涵盖认知、情感、行为三维，概念较大，需要明确具体测量工具；\n2️⃣ 《协作写作搭便车干预》（观点+理由）：经典稳妥，契合本课SSRL主旨，文献极其丰富，但需注意避免落入传统干预范式，需寻找新的中介变量；\n3️⃣ 《短视频对注意力影响》（观点+理由）：极具现实针对性，新意强，但文献较分散，在150分钟内完成严密的实验设计难度较高。\n\n请大家在聊天框中深入讨论各自理由，并在左侧完成单选投票！`, timestamp: '14:06' },
      { sender: 'A', text: '我投票给了《搭便车干预策略研究》，因为文献丰富，150分钟内能做出完整的实验方案。', timestamp: '14:08' },
      { sender: 'B', text: '我也赞成《搭便车干预策略研究》，符合我们课程要求。', timestamp: '14:09' },
      { sender: 'C', text: '我投了《短视频注意力》，不过我也理解搭便车更稳妥。', timestamp: '14:10' },
      { sender: 'auctioneer', text: `🔨 【竞拍投票计票与分歧引导】投票完毕：2票支持《搭便车干预》，1票支持《短视频注意力》。\n\n注意！存在意见分歧！C同学的“注意力分配”切入点非常优秀。建议将“注意力分配”作为搭便车的一个核心成因进行融合。请三位成员在聊天框中沟通，当三人都表达认可同意后，才算正式锁定研究主题！`, timestamp: '14:11' },
      { sender: 'C', text: '我赞成融合！把主题定位《协作学习中的“搭便车”现象：基于注意力分配与AI感知视角》，我认可这个主题！', timestamp: '14:12' },
      { sender: 'A', text: '我也完全认可这个融合主题！', timestamp: '14:13' },
      { sender: 'B', text: '我也同意！三人都已表达认可。', timestamp: '14:14' },
      { sender: 'auctioneer', text: `🔨 【主题确认与分工讨论引导】三名成员已全员表达认可！研究主题正式锁定为：《协作学习中的“搭便车”现象：基于注意力分配与AI感知视角》。\n\n现在请大家在聊天框中明确两件事：1. 150分钟在6个部分中具体怎么分配时间？2. 谁具体负责写哪几个部分？商量好后告诉我，系统将实时抽取生成合约卡片！`, timestamp: '14:15' },
      { sender: 'A', text: '我提议：总共150分钟。研究背景分配20分钟，研究问题25分钟，文献综述30分钟，研究方法40分钟，不足反思15分钟，参考文献10分钟，正好150分钟！', timestamp: '14:17' },
      { sender: 'B', text: '时间分配很合理！分工方面：我负责撰写【文献综述】板块。', timestamp: '14:18' },
      { sender: 'C', text: '那我负责【研究设计与方法】、【不足与反思】和【参考文献】。', timestamp: '14:19' },
      { sender: 'A', text: '剩下的【研究背景与意义】和【研究问题与假设】由我（A组长）负责撰写。', timestamp: '14:20' },
      { sender: 'auctioneer', text: `📜 【从聊天记录中成功抽取合约卡片】收到！拍卖师已从聊天文本中成功提取时间预算（背景20m/问题25m/文献30m/方法40m/反思15m/参考文献10m）与分工名单（A负责背景+问题，B负责文献，C负责方法+反思+参考文献）。\n\n合作卡片已呈递在左侧！大家可以继续在卡片中进行微调修改，三人都点击【全员统一确认】后即可开启阶段二写作！`, timestamp: '14:21' }
    ],
    stage2: [
      { sender: 'managingEditor', text: `🤝 【学术编辑部接管】合作合约已全员签署生效！学术编辑部全面上线。\n\n根据分工：A负责背景与问题，B负责文献，C负责方法反思。目前进入上半程写作（45分钟）。我将实时监控字数贡献比与同伴互动！`, timestamp: '14:25' },
      { sender: 'reviewingEditor', text: `📝 【审稿编辑范例文件推送通知】：各位作者，为了帮助大家顺利开展中途检查，我已呈递了《编辑会议规范与范例模板文件.pdf》（见上方按钮与弹窗文件）。\n\n该范例规范展示了标准学术论文的结构自查指标，请大家在撰写过程中点击查阅参考！`, timestamp: '14:28' },
      { sender: 'A', text: '组员们，我已经把研究背景和 RQ1、RQ2 核心框架写在大正文里了！大家看一下大文本框的“一、研究背景与意义”部分，看看思路顺不顺？', timestamp: '14:32' },
      { sender: 'B', text: '收到！我正在大正文中补充“三、文献综述”里关于 SSRL 共享调节与生成式 AI 结合的部分，引用了 2024 年最新文献。', timestamp: '14:35' },
      { sender: 'reviewingEditor', text: `📝 【审稿编辑实时提问】：查阅到 A 同学在“研究问题”中提出了 RQ1 关于群体感知对搭便车干预的作用。请问 B 同学在文献综述中，是否提供了对应的测量量表来源？`, timestamp: '14:38' },
      { sender: 'C', text: '我正在撰写“四、研究设计与方法”，打算采用准实验设计，样本选 150 名大学生。针对审稿编辑的问题，我们可以在文献里加上 Facione 经典量表！', timestamp: '14:40' },
      { sender: 'managingEditor', text: `⏰ 【过程监控提醒】上半程写作已进行 20 分钟。当前字数贡献比：A (42%)，B (31%)，C (27%)。整篇大正文已达到 1100 字，节奏非常均衡！`, timestamp: '14:45' },
      { sender: 'A', text: '大家太棒了！B 同学，文献部分写完后可以帮忙看下“假设 H1”的文字连贯性吗？', timestamp: '14:48' },
      { sender: 'B', text: '没问题，我已经接入修改了，文字承接得很顺畅！', timestamp: '14:52' },
      { sender: 'C', text: '我也把研究方法部分的自变量控制逻辑写清楚了，A组长可以帮忙检查一下。', timestamp: '14:56' },
      { sender: 'managingEditor', text: `📢 【编辑会议① 触发】上半程45分钟写作节点已到！发起【编辑会议①】——请三位作者在弹窗中进行“内容逻辑、团队分工、瓶颈难点”三维评价，并查阅审稿编辑推送的范例文件！`, timestamp: '15:10' },
      { sender: 'reviewingEditor', text: `📝 【审稿编辑结合范例文件深度反馈】：阅览了组内自评与正文初稿，整体符合《编辑会议规范与范例模板文件.pdf》的基础规范。但发现一个关键逻辑缺陷：在“二、研究问题与假设”中提出的 H2 假设未在“四、研究设计”中给出操作化变量说明。\n\n已自动生成【半程编辑修正清单】置于左侧，请团队在后半程聚焦修正！`, timestamp: '15:15' }
    ],
    stage3: [
      { sender: 'proponent', text: `🟢 【正方委员·正面评价】恭喜研究团队完成方案初稿！从学术创新性来看，本研究将 SSRL 理论、AI 群体感知与注意力分配结合，提出了极具应用价值的假设体系。`, timestamp: '16:10' },
      { sender: 'opponent', text: `🔴 【反方委员·尖锐质疑】作为反方审稿人，我提出两个核心学术质疑：\n1️⃣ 显性感知反馈可能诱发评价焦虑的心理负面效应，如何辩护？\n2️⃣ 问卷仅测量了认知投入，缺失了情绪与行为投入维度，测量效度不足！`, timestamp: '16:13' },
      { sender: 'neutral', text: `🟡 【中间委员·第①条裁决引导 (1/3)】答辩委员会正反方意见已呈递！我将按顺序逐条引导组内开展研讨。\n\n👉 **首先研讨第①条质询**【反方委员: 显性感知反馈可能诱发评价焦虑】：\n请团队评估，你们认为这是应该在正文第四章补充的限制条件，还是可以通过“过程性提示而非结果排名”进行辩护？请讨论并录入结论。`, timestamp: '16:15' },
      { sender: 'A', text: `👨‍🎓 【组员协同研讨例】组员们，中间委员针对反方的【评价焦虑】质疑给了明确方向。我建议在“四、研究设计”中强调我们系统使用的是“过程性协同提示”而非“公开竞争排名”，这样就能有效缓解评价焦虑！`, timestamp: '16:16' },
      { sender: 'B', text: `👩‍🎓 【组员协同研讨例】赞成组长 A 的思路！同时在“五、不足与反思”部分，我们也可以把“防范评价焦虑”明确写为研究的边界限制条件，这样回答反方就很圆满了！`, timestamp: '16:17' },
      { sender: 'C', text: `🧑‍🎓 【组员协同研讨例】同意！我已经在左侧点击【研讨与裁决】录入了咱们组的统一辩护结论。接下来咱们可以点击【返回协作写作大正文】把这段话补全！`, timestamp: '16:18' }
    ]
  };

  /* ==========================================================================
     4. AUTH & DATABASE MANAGER (ENHANCED FOR TEACHER CLASS & GROUP MANAGEMENT)
     ========================================================================== */
  const STORAGE_KEY_USER = 'jizhi_current_user';
  const STORAGE_KEY_USERS_DB = 'jizhi_users_db_v2';
  const STORAGE_KEY_CLASSES = 'jizhi_classes_db';
  const STORAGE_KEY_TASKS = 'jizhi_tasks_db';
  const STORAGE_KEY_ANNOUNCEMENTS = 'jizhi_announcements_db';

  const DefaultClasses = [
    {
      id: 'class_101',
      name: '《现代教育技术》2026春01班',
      code: 'MET-2026-01',
      studentIds: ['u_studentA', 'u_studentB', 'u_studentC'],
      groups: [
        { id: 'group_1', name: '第1小组 (AI与协作写作研究组)', members: ['u_studentA', 'u_studentB', 'u_studentC'], topic: '协作学习中的“搭便车”现象：基于注意力分配与AI感知视角' }
      ]
    }
  ];

  const DefaultUsers = [
    { id: 'u_teacher1', username: 'teacher', email: 'teacher@jizhi.edu', password: '123', name: '张教授 (主讲教师)', role: 'teacher', avatar: '👩‍🏫' },
    { id: 'u_studentA', username: 'liming', email: 'studentA@jizhi.edu', password: '123', name: '李明 (学生A/组长)', role: 'student', studentCode: 'A', avatar: '👨‍🎓', classId: 'class_101', groupId: 'group_1' },
    { id: 'u_studentB', username: 'wangfang', email: 'studentB@jizhi.edu', password: '123', name: '王芳 (学生B/组员)', role: 'student', studentCode: 'B', avatar: '👩‍🎓', classId: 'class_101', groupId: 'group_1' },
    { id: 'u_studentC', username: 'chenqiang', email: 'studentC@jizhi.edu', password: '123', name: '陈强 (学生C/组员)', role: 'student', studentCode: 'C', avatar: '🧑‍🎓', classId: 'class_101', groupId: 'group_1' }
  ];

  const DefaultTasks = [
    {
      id: 'task_001',
      title: '《现代教育技术》期末协作研究设计方案编写',
      classId: 'class_101',
      className: '《现代教育技术》2026春01班',
      durationMinutes: 150,
      startTime: '2026-08-02 20:00',
      deadline: '2026-08-02 22:30',
      status: 'in_progress',
      createdAt: new Date().toLocaleDateString(),
      instructions: '请在150分钟内，以小组为单位完成一份包含研究背景与意义、研究问题与假设、文献综述、研究设计与方法、不足与反思及参考文献的高质量研究方案。',
      resources: [
        { name: '研究设计标准规范与格式指南.pdf', size: '1.8 MB', url: '#' },
        { name: '优秀研究设计案例参考.docx', size: '850 KB', url: '#' }
      ]
    }
  ];

  const DefaultAnnouncements = [
    {
      id: 'ann_001',
      taskId: 'task_001',
      taskTitle: '《现代教育技术》期末协作研究设计方案编写',
      title: '📢 课题提案与时间合约确认提醒',
      content: '请各组在【学术拍卖会】阶段认真讨论课题观点与理由，并共同签署时间分配与分工合约。参考资料已附在下方。',
      attachment: { name: '学术研究设计导引指南.pdf', size: '2.1 MB' },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: '张教授',
      readStatus: { 'group_1': false }
    }
  ];

  class AuthManager {
    constructor() { this.initDatabase(); }
    initDatabase() {
      if (!localStorage.getItem(STORAGE_KEY_USERS_DB)) localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(DefaultUsers));
      if (!localStorage.getItem(STORAGE_KEY_CLASSES)) localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(DefaultClasses));
      if (!localStorage.getItem(STORAGE_KEY_TASKS)) localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(DefaultTasks));
      if (!localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS)) localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(DefaultAnnouncements));
    }
    getUsers() { return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB)) || DefaultUsers; }
    getClasses() { return JSON.parse(localStorage.getItem(STORAGE_KEY_CLASSES)) || DefaultClasses; }
    getTasks() { return JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS)) || DefaultTasks; }
    getAnnouncements() { return JSON.parse(localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS)) || DefaultAnnouncements; }
    getCurrentUser() {
      const sessionData = sessionStorage.getItem(STORAGE_KEY_USER);
      if (sessionData) { try { return JSON.parse(sessionData); } catch (e) {} }
      const localData = localStorage.getItem(STORAGE_KEY_USER);
      return localData ? JSON.parse(localData) : null;
    }
    login(accountInput, password) {
      const users = this.getUsers();
      const query = accountInput.trim().toLowerCase();
      const user = users.find(u => {
        const uName = (u.username || '').toLowerCase();
        const uEmail = (u.email || '').toLowerCase();
        const uCode = (u.studentCode || '').toLowerCase();
        return (uName === query || uEmail === query || uCode === query || ('student' + uCode) === query) && u.password === password;
      });
      if (user) {
        sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: '账号或密码错误 (默认密码均为 123)' };
    }
    logout() {
      sessionStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_USER);
    }

    createClass(className, classCode = null) {
      const classes = this.getClasses();
      const newClass = {
        id: 'class_' + Date.now(),
        name: className || '新教学班',
        code: classCode || ('MET-2026-' + (classes.length + 1).toString().padStart(2, '0')),
        studentIds: [],
        groups: [
          { id: 'group_' + Date.now(), name: '第1小组', members: [], topic: '协作学习中的 AI 干预研究' }
        ]
      };
      classes.unshift(newClass);
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
      if (window.app && window.app.cloudSyncEngine) window.app.cloudSyncEngine.pushSnapshot();
      return newClass;
    }

    createGroup(classId, groupName, topic = '协作学习课题研究') {
      const classes = this.getClasses();
      const cls = classes.find(c => c.id === classId) || classes[0];
      if (cls) {
        if (!cls.groups) cls.groups = [];
        const newGroup = {
          id: 'group_' + Date.now(),
          name: groupName || `第${cls.groups.length + 1}小组`,
          members: [],
          topic: topic
        };
        cls.groups.push(newGroup);
        localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
        if (window.app && window.app.cloudSyncEngine) window.app.cloudSyncEngine.pushSnapshot();
        return newGroup;
      }
    }

    addStudent(name, username, studentCode, classId, groupId, role = 'student') {
      const users = this.getUsers();
      const classes = this.getClasses();
      const cleanUsername = username.trim().toLowerCase();
      const existingIndex = users.findIndex(u => (u.username || '').toLowerCase() === cleanUsername || (u.studentCode && u.studentCode === studentCode));
      const avatars = ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '🎓', '📚', '🌟'];
      const avatar = avatars[users.length % avatars.length];

      const newUser = {
        id: existingIndex !== -1 ? users[existingIndex].id : 'u_student_' + Date.now() + Math.floor(Math.random() * 1000),
        username: cleanUsername,
        email: `${cleanUsername}@jizhi.edu`,
        password: '123', // 默认密码 123
        name: name.trim(),
        role: role === 'teacher' ? 'teacher' : 'student',
        studentCode: (studentCode || cleanUsername).trim(),
        avatar: avatar,
        classId: classId || 'class_101',
        groupId: groupId || 'group_1'
      };

      if (existingIndex !== -1) users[existingIndex] = newUser;
      else users.push(newUser);

      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));

      // Update class & group mapping
      const targetClass = classes.find(c => c.id === newUser.classId) || classes[0];
      if (targetClass) {
        if (!targetClass.studentIds) targetClass.studentIds = [];
        if (!targetClass.studentIds.includes(newUser.id)) targetClass.studentIds.push(newUser.id);

        if (!targetClass.groups) targetClass.groups = [];
        let targetGroup = targetClass.groups.find(g => g.id === newUser.groupId);
        if (!targetGroup && targetClass.groups.length > 0) {
          targetGroup = targetClass.groups[0];
          newUser.groupId = targetGroup.id;
        }
        if (targetGroup) {
          if (!targetGroup.members) targetGroup.members = [];
          if (!targetGroup.members.includes(newUser.id)) targetGroup.members.push(newUser.id);
        }
        localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
      }

      if (window.app && window.app.cloudSyncEngine) window.app.cloudSyncEngine.pushSnapshot();
      return newUser;
    }

    importStudentsBatch(batchText, defaultClassId = 'class_101') {
      const lines = batchText.split('\n').map(l => l.trim()).filter(Boolean);
      let count = 0;
      const classes = this.getClasses();
      let targetClass = classes.find(c => c.id === defaultClassId) || classes[0];

      lines.forEach(line => {
        // Delimited by comma, tab, space, or Chinese comma
        const parts = line.split(/[,，\t\s]+/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          const name = parts[0];
          const username = parts[1];
          const studentCode = parts[2] || username;
          const groupName = parts[3] || '第1小组';
          const roleStr = parts[4] || (parts[3] === '组长' ? '组长' : '组员');

          // Find or create group under targetClass
          if (!targetClass.groups) targetClass.groups = [];
          let targetGroup = targetClass.groups.find(g => g.name === groupName || g.id === groupName);
          if (!targetGroup) {
            targetGroup = {
              id: 'group_' + Date.now() + Math.floor(Math.random() * 1000),
              name: groupName.includes('组') ? groupName : (groupName + '小组'),
              members: [],
              topic: '协作学习课题研究'
            };
            targetClass.groups.push(targetGroup);
          }

          this.addStudent(
            name,
            username,
            studentCode,
            targetClass.id,
            targetGroup.id,
            roleStr.includes('长') ? 'leader' : 'student'
          );
          count++;
        }
      });

      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
      if (window.app && window.app.cloudSyncEngine) window.app.cloudSyncEngine.pushSnapshot();
      return count;
    }

    deleteStudent(userId) {
      let users = this.getUsers();
      users = users.filter(u => u.id !== userId);
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));

      const classes = this.getClasses();
      classes.forEach(c => {
        if (c.studentIds) c.studentIds = c.studentIds.filter(id => id !== userId);
        if (c.groups) {
          c.groups.forEach(g => {
            if (g.members) g.members = g.members.filter(id => id !== userId);
          });
        }
      });
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(classes));
      if (window.app && window.app.cloudSyncEngine) window.app.cloudSyncEngine.pushSnapshot();
    }

    getGroupMembersForWorkspace(groupId = 'group_1') {
      const users = this.getUsers();
      const groupUsers = users.filter(u => u.groupId === groupId && u.role !== 'teacher');
      const colors = ['#818cf8', '#22d3ee', '#fbbf24', '#ec4899', '#34d399', '#f97316', '#a78bfa'];
      const avatars = ['👨‍🎓', '👩‍🎓', '🧑‍🎓', '🎓', '📚', '🌟'];

      const membersObj = {};
      if (groupUsers.length > 0) {
        groupUsers.forEach((u, idx) => {
          const letterCode = u.studentCode && u.studentCode.length === 1 ? u.studentCode.toUpperCase() : String.fromCharCode(65 + idx);
          membersObj[letterCode] = {
            id: letterCode,
            name: u.name,
            roleTitle: (u.studentCode === 'A' || idx === 0) ? '组长 · 论文结构' : `组员 · 合作撰写`,
            avatar: u.avatar || avatars[idx % avatars.length],
            color: colors[idx % colors.length],
            studentCode: letterCode
          };
        });
      } else {
        membersObj['A'] = { id: 'A', name: '李明 (学生A)', roleTitle: '组长 · 论文结构', avatar: '👨‍🎓', color: '#818cf8', studentCode: 'A' };
        membersObj['B'] = { id: 'B', name: '王芳 (学生B)', roleTitle: '组员 · 文献综述', avatar: '👩‍🎓', color: '#22d3ee', studentCode: 'B' };
        membersObj['C'] = { id: 'C', name: '陈强 (学生C)', roleTitle: '组员 · 研究设计', avatar: '🧑‍🎓', color: '#fbbf24', studentCode: 'C' };
      }
      return membersObj;
    }

    createTask(title, classId, instructions, resources = [], startTime = null, deadline = null, durationMinutes = 150) {
      const tasks = this.getTasks();
      const classes = this.getClasses();
      const targetClass = classes.find(c => c.id === classId) || classes[0];
      const now = new Date();
      const defaultStart = startTime ? startTime.replace('T', ' ') : now.toISOString().slice(0, 16).replace('T', ' ');
      let defaultDeadline = deadline ? deadline.replace('T', ' ') : '';
      if (!defaultDeadline) {
        const dObj = new Date(now.getTime() + (parseInt(durationMinutes) || 150) * 60 * 1000);
        defaultDeadline = dObj.toISOString().slice(0, 16).replace('T', ' ');
      }
      const newTask = {
        id: 'task_' + Date.now(),
        title, classId, className: targetClass.name,
        durationMinutes: parseInt(durationMinutes) || 150,
        startTime: defaultStart, deadline: defaultDeadline,
        status: 'in_progress', createdAt: new Date().toLocaleDateString(),
        instructions, resources
      };
      tasks.unshift(newTask);
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
      if (window.app && window.app.cloudSyncEngine) window.app.cloudSyncEngine.pushSnapshot();
      return newTask;
    }
    publishAnnouncement(taskId, title, content, attachment = null) {
      const announcements = this.getAnnouncements();
      const tasks = this.getTasks();
      const task = tasks.find(t => t.id === taskId);
      const newAnn = {
        id: 'ann_' + Date.now(), taskId,
        taskTitle: task ? task.title : '期末协作写作',
        title, content, attachment,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: '张教授', readStatus: { 'group_1': false }
      };
      announcements.unshift(newAnn);
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
      if (window.app && window.app.cloudSyncEngine) window.app.cloudSyncEngine.pushSnapshot();
      return newAnn;
    }
    markAnnouncementRead(annId, groupId = 'group_1') {
      const announcements = this.getAnnouncements();
      const ann = announcements.find(a => a.id === annId);
      if (ann) {
        if (!ann.readStatus) ann.readStatus = {};
        ann.readStatus[groupId] = true;
        localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(announcements));
        if (window.app && window.app.cloudSyncEngine) window.app.cloudSyncEngine.pushSnapshot();
      }
    }
    exportGroupChatLogsToExcel(groupId = 'group_1', chatLogsState = null) {
      const currentChatLogs = chatLogsState || JSON.parse(localStorage.getItem('jizhi_sync_chat_v3')) || {};
      let csvContent = '\uFEFF名字,时间,内容\n';
      const stageNames = { stage1: '阶段一：学术拍卖会', stage2: '阶段二：学术编辑部', stage3: '阶段三：答辩擂台' };
      const users = this.getUsers();
      ['stage1', 'stage2', 'stage3'].forEach(stageKey => {
        const logs = currentChatLogs[stageKey] || [];
        if (logs.length > 0) {
          csvContent += `"[${stageNames[stageKey]}]","",""\n`;
          logs.forEach(msg => {
            let senderDisplayName = msg.sender;
            if (msg.sender === 'A' || msg.sender === 'liming') senderDisplayName = '李明 (学生A/组长)';
            else if (msg.sender === 'B' || msg.sender === 'wangfang') senderDisplayName = '王芳 (学生B/组员)';
            else if (msg.sender === 'C' || msg.sender === 'chenqiang') senderDisplayName = '陈强 (学生C/组员)';
            else if (msg.sender === 'auctioneer') senderDisplayName = '拍卖师 Agent';
            else if (msg.sender === 'managingEditor') senderDisplayName = '责任编辑 Agent';
            else if (msg.sender === 'reviewingEditor') senderDisplayName = '审稿编辑 Agent';
            else if (msg.sender === 'opponent') senderDisplayName = '反方委员 Agent';
            else if (msg.sender === 'proponent') senderDisplayName = '正方委员 Agent';
            else if (msg.sender === 'neutral') senderDisplayName = '中间委员 Agent';
            else {
              const foundUser = users.find(u => u.studentCode === msg.sender || u.username === msg.sender);
              if (foundUser) senderDisplayName = foundUser.name;
            }
            const time = msg.timestamp || '';
            const text = (msg.text || '').replace(/"/g, '""').replace(/\n/g, ' ');
            csvContent += `"${senderDisplayName}","${time}","${text}"\n`;
          });
        }
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `第2小组_学术对话记录表_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  /* ==========================================================================
     5. QUAD-REDUNDANT CROSS-BROWSER & INCOGNITO CLOUD SYNC ENGINE v6 (WITH GROUP ISOLATION)
     ========================================================================== */
  class CloudSyncEngine {
    constructor(app) {
      this.app = app;
      this.lastTimestamp = 0;
      this.isPushing = false;
      this.updateScopeKeys();
      
      this.initWebSocket();
      this.initPolling();
    }

    updateScopeKeys() {
      const user = this.app.authManager.getCurrentUser();
      const groupId = (user && user.groupId) ? user.groupId : 'group_1';
      this.storageKey = `jizhi_cloud_snapshot_v6_${groupId}`;
      this.wsUrl = `wss://free.piesocket.com/v3/jizhi_collaboration_2026_${groupId}?api_key=VCX2aCchvXxCM14N4aOHM6HOqqfZvZWPoBxObmmi&notify_self=1`;
      this.restEndpoints = [
        `https://jizhi-platform-2026-default-rtdb.firebaseio.com/sync_${groupId}.json`,
        `https://api.restful-api.dev/objects/jizhi_room_2026_${groupId}`
      ];
    }

    initWebSocket() {
      try {
        this.ws = new WebSocket(this.wsUrl);
        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data && data.snapshot) {
              this.handleRemoteSync(data.snapshot);
            }
          } catch (e) {}
        };
        this.ws.onclose = () => {
          setTimeout(() => this.initWebSocket(), 3000);
        };
      } catch (e) {}
    }

    initPolling() {
      this.pullFromRest();
      setInterval(() => { this.pullFromRest(); }, 1000);

      if ('BroadcastChannel' in window) {
        try {
          const user = this.app.authManager.getCurrentUser();
          const groupId = (user && user.groupId) ? user.groupId : 'group_1';
          this.bc = new BroadcastChannel(`jizhi_channel_v6_${groupId}`);
          this.bc.onmessage = (e) => {
            if (e.data && e.data.snapshot) {
              this.handleRemoteSync(e.data.snapshot);
            }
          };
        } catch (e) {}
      }

      window.addEventListener('storage', (e) => {
        if (e.key === this.storageKey && e.newValue) {
          try { this.handleRemoteSync(JSON.parse(e.newValue)); } catch (err) {}
        }
      });
    }

    async pullFromRest() {
      try {
        const localRaw = localStorage.getItem(this.storageKey);
        if (localRaw) {
          const localSnap = JSON.parse(localRaw);
          if (localSnap && localSnap.timestamp > this.lastTimestamp) {
            this.handleRemoteSync(localSnap);
          }
        }
      } catch (e) {}

      for (const url of this.restEndpoints) {
        try {
          const res = await fetch(url, { cache: 'no-cache' });
          if (res.ok) {
            const data = await res.json();
            if (data) {
              const snapshot = data.data ? data.data : data;
              if (snapshot && snapshot.timestamp && snapshot.timestamp > this.lastTimestamp) {
                this.handleRemoteSync(snapshot);
                break;
              }
            }
          }
        } catch (e) {}
      }
    }

    async pushSnapshot() {
      this.updateScopeKeys();
      const snapshot = {
        timestamp: Date.now(),
        members: this.app.state.members,
        chatLogs: this.app.state.chatLogs,
        stage1: this.app.state.stage1,
        stage2: this.app.state.stage2,
        stage3: this.app.state.stage3,
        currentStage: this.app.state.currentStage,
        isFinalSubmitted: this.app.state.isFinalSubmitted,
        tasks: this.app.authManager.getTasks(),
        announcements: this.app.authManager.getAnnouncements()
      };

      this.lastTimestamp = snapshot.timestamp;

      try { localStorage.setItem(this.storageKey, JSON.stringify(snapshot)); } catch (e) {}
      if (this.bc) { try { this.bc.postMessage({ snapshot }); } catch (e) {} }

      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try { this.ws.send(JSON.stringify({ snapshot })); } catch (e) {}
      }

      if (!this.isPushing) {
        this.isPushing = true;
        try {
          const user = this.app.authManager.getCurrentUser();
          const groupId = (user && user.groupId) ? user.groupId : 'group_1';
          await fetch(`https://jizhi-platform-2026-default-rtdb.firebaseio.com/sync_${groupId}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(snapshot)
          });
        } catch (e) {
        } finally {
          this.isPushing = false;
        }
      }
    }

    handleRemoteSync(remoteData) {
      if (!remoteData || !remoteData.timestamp) return;
      if (remoteData.timestamp <= this.lastTimestamp && this.lastTimestamp !== 0) return;

      this.lastTimestamp = remoteData.timestamp;
      let updated = false;

      if (remoteData.members) {
        this.app.state.members = remoteData.members;
        updated = true;
      }

      if (remoteData.isFinalSubmitted !== undefined && remoteData.isFinalSubmitted !== this.app.state.isFinalSubmitted) {
        this.app.state.isFinalSubmitted = remoteData.isFinalSubmitted;
        updated = true;
      }

      if (remoteData.chatLogs) {
        ['stage1', 'stage2', 'stage3'].forEach(stg => {
          const localLogs = this.app.state.chatLogs[stg] || [];
          const remoteLogs = remoteData.chatLogs[stg] || [];
          if (remoteLogs.length > localLogs.length) {
            this.app.state.chatLogs[stg] = remoteLogs;
            updated = true;
          }
        });
      }

      if (remoteData.stage1) {
        const s1R = remoteData.stage1;
        const s1L = this.app.state.stage1;
        if (s1R.contract) {
          s1L.contract = s1R.contract;
          updated = true;
        }
        if (s1R.votes) {
          s1L.votes = s1R.votes;
          s1L.hasVoted = s1R.hasVoted;
          updated = true;
        }
      }

      if (remoteData.stage2 && remoteData.stage2.unifiedContent) {
        if (remoteData.stage2.unifiedContent.length !== this.app.state.stage2.unifiedContent.length) {
          this.app.state.stage2.unifiedContent = remoteData.stage2.unifiedContent;
          updated = true;
        }
        if (remoteData.stage2.actionPlan && !this.app.state.stage2.actionPlan) {
          this.app.state.stage2.actionPlan = remoteData.stage2.actionPlan;
          updated = true;
        }
      }

      if (remoteData.stage3 && remoteData.stage3.feedbackItems) {
        this.app.state.stage3.feedbackItems = remoteData.stage3.feedbackItems;
        updated = true;
      }

      if (remoteData.currentStage && remoteData.currentStage !== this.app.state.currentStage) {
        this.app.state.currentStage = remoteData.currentStage;
        updated = true;
      }

      if (updated) {
        localStorage.setItem('jizhi_sync_chat_v3', JSON.stringify(this.app.state.chatLogs));
        localStorage.setItem('jizhi_sync_s1_v3', JSON.stringify(this.app.state.stage1));
        localStorage.setItem('jizhi_sync_s2_v3', JSON.stringify(this.app.state.stage2));
        localStorage.setItem('jizhi_sync_s3_v3', JSON.stringify(this.app.state.stage3));
        localStorage.setItem('jizhi_sync_current_stage_v3', this.app.state.currentStage);
        localStorage.setItem('jizhi_sync_final_submitted', this.app.state.isFinalSubmitted);
        this.app.renderStudentWorkspace();
      }
    }
  }

  /* ==========================================================================
     6. LOGIN VIEW RENDERER
     ========================================================================== */
  function renderLoginView(container, authManager, onLoginSuccess) {
    container.innerHTML = `
      <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px; background:radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 70%, #030712 100%);">
        <div style="background:#1e293b; border:1px solid rgba(255,255,255,0.12); border-radius:20px; width:440px; max-width:95vw; padding:32px; box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);">
          <div style="text-align:center; margin-bottom:28px;">
            <div style="font-size:32px; font-weight:800; background:linear-gradient(135deg, #818cf8, #38bdf8); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">集智 JIZHI</div>
            <div style="font-size:13px; color:#94a3b8; margin-top:6px;">多智能体协同写作与人机共存学习平台</div>
          </div>
          <form id="login-form" style="display:flex; flex-direction:column; gap:18px;">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:13px; font-weight:600; color:#cbd5e1;">账号 (支持拼音用户名: teacher, liming, wangfang, chenqiang)</label>
              <input type="text" id="login-account" class="teacher-input" placeholder="输入 teacher 或 liming / wangfang / chenqiang" value="teacher" required style="width:100%;">
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:13px; font-weight:600; color:#cbd5e1;">密码 (默认 123)</label>
              <input type="password" id="login-password" class="teacher-input" placeholder="输入密码 123" value="123" required style="width:100%;">
            </div>
            <div id="login-error-msg" style="display:none; font-size:12px; color:#f43f5e; background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.3); padding:8px 12px; border-radius:8px;"></div>
            <button type="submit" class="modal-btn submit task-theme" style="width:100%; padding:14px; font-size:15px; border-radius:10px; margin-top:6px;">
              🚀 登录集智平台
            </button>
          </form>
          <div style="margin-top:24px; border-top:1px solid rgba(255,255,255,0.1); padding-top:20px;">
            <div style="font-size:12px; font-weight:700; color:#818cf8; margin-bottom:12px; text-align:center;">
              ⚡ 拼音账号免输入一键快速测试登录
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <button class="quick-login-btn" data-account="teacher" style="background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.3); color:#34d399; padding:10px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer;">👩‍🏫 教师: teacher</button>
              <button class="quick-login-btn" data-account="liming" style="background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3); color:#a5b4fc; padding:10px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer;">👨‍🎓 学生A: liming</button>
              <button class="quick-login-btn" data-account="wangfang" style="background:rgba(6,182,212,0.15); border:1px solid rgba(6,182,212,0.3); color:#22d3ee; padding:10px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer;">👩‍🎓 学生B: wangfang</button>
              <button class="quick-login-btn" data-account="chenqiang" style="background:rgba(245,158,11,0.15); border:1px solid rgba(245,158,11,0.3); color:#fbbf24; padding:10px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer;">🧑‍🎓 学生C: chenqiang</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const form = container.querySelector('#login-form');
    const accountInput = container.querySelector('#login-account');
    const passwordInput = container.querySelector('#login-password');
    const errorMsg = container.querySelector('#login-error-msg');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const res = authManager.login(accountInput.value, passwordInput.value);
      if (res.success) onLoginSuccess();
      else { errorMsg.innerText = res.message; errorMsg.style.display = 'block'; }
    });

    container.querySelectorAll('.quick-login-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const acc = btn.dataset.account;
        const res = authManager.login(acc, '123');
        if (res.success) onLoginSuccess();
      });
    });
  }

  /* ==========================================================================
     7. TEACHER PORTAL RENDERER (CLASS, GROUP & BATCH STUDENT MANAGEMENT)
     ========================================================================== */
  function renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView) {
    const currentUser = authManager.getCurrentUser();
    const tasks = authManager.getTasks();
    const announcements = authManager.getAnnouncements();
    const classes = authManager.getClasses();
    const allUsers = authManager.getUsers();
    const students = allUsers.filter(u => u.role !== 'teacher');

    container.innerHTML = `
      <div class="teacher-portal-layout">
        <header class="teacher-header">
          <div class="brand-section">
            <div class="brand-logo">集智 JIZHI</div>
            <div class="brand-badge teacher-badge">👩‍🏫 教师端管理中心 (全局云同步中 🟢)</div>
          </div>
          <div class="teacher-info">
            <span>班级管理: <b>${classes[0] ? classes[0].name : '现代教育技术班'}</b></span>
            <span>主讲教师: <b>${currentUser.name}</b></span>
            <button id="btn-switch-student-preview" class="header-icon-btn" style="background:rgba(99,102,241,0.2); color:#a5b4fc;">👀 切换至学生协作视角</button>
            <button id="btn-logout" class="header-icon-btn logout">退出登录</button>
          </div>
        </header>

        <main class="teacher-content">
          <section class="teacher-left-panel">

            <!-- 1. 班级与小组成员架构管理卡片 -->
            <div class="card broadcast-card" style="border-top:4px solid #8b5cf6;">
              <div class="card-title">
                <span>🏫 班级/小组架构管理与学生批量导入 (默认密码 123)</span>
                <div style="display:flex; gap:8px;">
                  <button id="btn-open-create-class" class="teacher-action-btn indigo">+ 创建班级</button>
                  <button id="btn-open-create-group" class="teacher-action-btn indigo">+ 创建小组</button>
                  <button id="btn-open-add-student" class="teacher-action-btn green">+ 增加单名学生</button>
                  <button id="btn-open-batch-import" style="background:linear-gradient(135deg, #ec4899, #8b5cf6); border:none; color:white; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; box-shadow:0 0 10px rgba(236,72,153,0.3);">
                    📥 批量导入学生
                  </button>
                </div>
              </div>

              <!-- 班级与小组信息概览 -->
              <div style="margin-bottom:12px; background:rgba(15,23,42,0.6); padding:12px; border-radius:10px; border:1px solid rgba(255,255,255,0.08);">
                <div style="font-size:13px; font-weight:700; color:#38bdf8; margin-bottom:8px; display:flex; justify-content:space-between;">
                  <span>🏫 当前教学班级列表:</span>
                  <span style="color:#cbd5e1; font-size:11px;">共 ${classes.length} 个班级 | 全班 ${students.length} 名学生</span>
                </div>
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                  ${classes.map(c => `
                    <div style="background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3); padding:8px 12px; border-radius:8px; font-size:12px;">
                      <div style="font-weight:700; color:#a5b4fc;">🏫 ${c.name} (${c.code || 'MET'})</div>
                      <div style="color:#94a3b8; font-size:11px; margin-top:2px;">
                        小组数: ${c.groups ? c.groups.length : 0} | 关联组名: ${(c.groups || []).map(g => g.name).join(', ')}
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- 学生名册管理表格 -->
              <div style="max-height:240px; overflow-y:auto; border:1px solid rgba(255,255,255,0.1); border-radius:8px;">
                <table class="monitor-table" style="font-size:12px;">
                  <thead>
                    <tr><th>姓名</th><th>拼音账号(用户名)</th><th>学号/编号</th><th>所属班级与小组</th><th>角色</th><th>默认密码</th><th>操作</th></tr>
                  </thead>
                  <tbody>
                    ${students.map(s => {
                      const cls = classes.find(c => c.id === s.classId) || classes[0];
                      const grp = cls && cls.groups ? cls.groups.find(g => g.id === s.groupId) : null;
                      return `
                        <tr>
                          <td><b>${s.avatar || '👤'} ${s.name}</b></td>
                          <td><span style="color:#38bdf8; font-family:monospace;">${s.username}</span></td>
                          <td>${s.studentCode || s.username}</td>
                          <td><span class="phase-pill p1" style="font-size:10px;">${cls ? cls.name : '01班'} - ${grp ? grp.name : '第1小组'}</span></td>
                          <td>${s.studentCode === 'A' || s.username === 'liming' ? '<b style="color:#fbbf24;">⭐ 组长</b>' : '组员'}</td>
                          <td><span style="color:#34d399; font-family:monospace;">123</span></td>
                          <td><button class="delete-student-btn" data-id="${s.id}" style="background:rgba(239,68,68,0.2); border:1px solid rgba(239,68,68,0.4); color:#f87171; padding:2px 6px; border-radius:4px; font-size:10px; cursor:pointer;">移除</button></td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 2. 课堂任务通知发布卡片 -->
            <div class="card broadcast-card" style="margin-top:16px;">
              <div class="card-title">
                <span>📢 课堂任务即时通知发布 (含文件资源上传 & 小组已读追踪)</span>
                <button id="btn-open-ann-modal" class="teacher-action-btn green">+ 发布新通知 (含随附资源文件)</button>
              </div>
              <div class="announcement-history-list">
                ${announcements.map(a => `
                  <div class="teacher-ann-item">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                      <span style="font-weight:700; color:#38bdf8; font-size:14px;">${a.title}</span>
                      <span style="font-size:11px; color:#94a3b8;">${a.time} | 关联任务: ${a.taskTitle}</span>
                    </div>
                    <div style="font-size:13px; color:#cbd5e1; margin-bottom:6px;">${a.content}</div>
                    ${a.attachment ? `<div style="font-size:12px; color:#a78bfa; background:rgba(139,92,246,0.15); padding:4px 8px; border-radius:4px; display:inline-block; margin-bottom:8px;">📎 随附资源: <b>${a.attachment.name}</b> (${a.attachment.size})</div>` : ''}
                    <div style="font-size:11px; color:#94a3b8; display:flex; gap:12px; border-top:1px dashed rgba(255,255,255,0.1); padding-top:6px;">
                      <span>已读小组: <b style="color:#4ade80;">${a.readStatus && a.readStatus['group_1'] ? '✅ 第1小组 (已读)' : '无'}</b></span>
                      <span>未读小组: <b style="color:#f87171;">${a.readStatus && !a.readStatus['group_1'] ? '⚠️ 第1小组 (未读)' : '无'}</b></span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 3. 课程任务发布卡片 -->
            <div class="card" style="margin-top:16px;">
              <div class="card-title">
                <span>📌 课程任务发布与班级小组关联 (含起止时间控制)</span>
                <button id="btn-open-task-modal" class="teacher-action-btn indigo">+ 发布新写作任务</button>
              </div>
              <div class="task-list-container">
                ${tasks.map(t => `
                  <div class="teacher-task-card">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                      <span style="font-size:16px; font-weight:700; color:#38bdf8;">${t.title}</span>
                      <span class="status-badge active">● 教学班: ${t.className}</span>
                    </div>
                    <div style="font-size:12px; color:#94a3b8; margin:8px 0; display:flex; gap:14px; flex-wrap:wrap; background:rgba(15,23,42,0.6); padding:6px 12px; border-radius:6px; border:1px solid rgba(255,255,255,0.08);">
                      <span>📅 <b>开始时间:</b> <span style="color:#a5b4fc;">${t.startTime || '即时开启'}</span></span>
                      <span>⌛ <b>截止时间:</b> <span style="color:#fca5a5;">${t.deadline || '无硬性限制'}</span></span>
                      <span>⏱️ <b>预估时长:</b> ${t.durationMinutes} 分钟</span>
                    </div>
                    <div style="font-size:14px; color:#f1f5f9; background:rgba(15,23,42,0.8); padding:12px; border-radius:8px; border-left:4px solid var(--accent-indigo); line-height:1.6;">
                      <b style="color:#a5b4fc;">任务说明与要求:</b> ${t.instructions}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>

          <!-- 右侧监控面板 -->
          <section class="teacher-right-panel">
            <div class="card">
              <div class="card-title">
                <span>📊 班级各组写作状态监控与 Excel 记录导出</span>
                <button id="btn-export-all-excel" style="background:linear-gradient(135deg, #10b981, #059669); border:none; color:white; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
                  📊 一键导出 Excel 表格 (名字/时间/内容)
                </button>
              </div>
              <table class="monitor-table">
                <thead>
                  <tr><th>小组名称</th><th>当前阶段</th><th>各成员字数贡献</th><th>编辑会议均分</th><th>通知已读</th><th>提交状态</th><th>操作</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>第1小组 (AI组)</b></td>
                    <td><span class="phase-pill p1">${state.currentStage === 'stage3' ? '阶段三：答辩擂台' : '阶段二：学术编辑部'}</span></td>
                    <td><div style="font-size:11px;">A (42%) | B (31%) | C (27%)</div></td>
                    <td><span style="color:#f59e0b;">★ 4.5</span></td>
                    <td>${announcements[0] && announcements[0].readStatus && announcements[0].readStatus['group_1'] ? '<span style="color:#4ade80;">✅ 已读</span>' : '<span style="color:#f87171;">⚠️ 未读</span>'}</td>
                    <td>${state.isFinalSubmitted ? '<span style="color:#34d399; font-weight:700;">🔒 已提交归档</span>' : '<span style="color:#fbbf24; font-weight:700;">📝 写作研讨中</span>'}</td>
                    <td><button class="export-single-excel-btn" data-group="group_1" style="background:var(--accent-indigo); border:none; color:white; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">导出 Excel</button></td>
                  </tr>
                  <tr>
                    <td><b>第2小组 (提问组)</b></td>
                    <td><span class="phase-pill p2">阶段一：学术拍卖会</span></td>
                    <td>竞拍中</td><td>--</td>
                    <td><span style="color:#f87171;">⚠️ 未读</span></td>
                    <td>未提交</td>
                    <td><button class="export-single-excel-btn" data-group="group_2" style="background:rgba(255,255,255,0.1); border:none; color:#94a3b8; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">导出 Excel</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    `;

    // Event Bindings
    container.querySelector('#btn-logout').addEventListener('click', () => onLogout());
    container.querySelector('#btn-switch-student-preview').addEventListener('click', () => onSwitchToStudentView());

    container.querySelectorAll('.delete-student-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('确认从班级中移除此学生账号？')) {
          authManager.deleteStudent(btn.dataset.id);
          renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
        }
      });
    });

    container.querySelector('#btn-export-all-excel').addEventListener('click', () => {
      authManager.exportGroupChatLogsToExcel('group_1', state.chatLogs);
    });

    container.querySelectorAll('.export-single-excel-btn').forEach(btn => {
      btn.addEventListener('click', () => authManager.exportGroupChatLogsToExcel(btn.dataset.group, state.chatLogs));
    });

    // 1. Modal: 创建新班级
    container.querySelector('#btn-open-create-class').addEventListener('click', () => {
      const name = prompt('请输入新班级名称 (例如: 《现代教育技术》2026春02班):', '《现代教育技术》2026春02班');
      if (name) {
        authManager.createClass(name);
        renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
      }
    });

    // 2. Modal: 创建新小组
    container.querySelector('#btn-open-create-group').addEventListener('click', () => {
      const cls = classes[0];
      const gName = prompt(`在班级【${cls.name}】下创建新小组名称:`, `第${(cls.groups || []).length + 1}小组`);
      if (gName) {
        authManager.createGroup(cls.id, gName);
        renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
      }
    });

    // 3. Modal: 增加单名学生
    container.querySelector('#btn-open-add-student').addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
      const cls = classes[0];
      const groups = cls.groups || [];
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="teacher-modal-card fancy-task-modal" style="width:480px;">
          <div class="teacher-modal-header task-theme-gradient">
            <div class="modal-header-title">
              <div class="modal-icon-badge task">👤</div>
              <div><h3>新增单个学生账号 (默认密码 123)</h3></div>
            </div>
            <button class="modal-close-btn" id="btn-close-single-student">✕</button>
          </div>
          <div class="teacher-modal-body">
            <div class="teacher-form-group">
              <label><span class="req">*</span> 学生真实姓名</label>
              <input type="text" id="modal-std-name" class="teacher-input fancy" placeholder="输入姓名 (例如: 赵强)" value="赵强">
            </div>
            <div class="teacher-form-group">
              <label><span class="req">*</span> 拼音用户名 (登录账号)</label>
              <input type="text" id="modal-std-username" class="teacher-input fancy" placeholder="输入拼音账号 (例如: zhaoqiang)" value="zhaoqiang">
            </div>
            <div class="teacher-form-group">
              <label>学号/编号 (如 D 或 2026004)</label>
              <input type="text" id="modal-std-code" class="teacher-input fancy" placeholder="学号 (例如: D)" value="D">
            </div>
            <div class="form-grid-2">
              <div class="teacher-form-group">
                <label><span class="req">*</span> 所属班级</label>
                <select id="modal-std-class" class="teacher-input fancy">${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}</select>
              </div>
              <div class="teacher-form-group">
                <label><span class="req">*</span> 所属小组</label>
                <select id="modal-std-group" class="teacher-input fancy">${groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('')}</select>
              </div>
            </div>
          </div>
          <div class="teacher-modal-footer">
            <button class="modal-btn cancel" id="btn-cancel-single-std">取消</button>
            <button class="modal-btn submit task-theme" id="btn-submit-single-std">👤 确认添加学生</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => modal.remove();
      modal.querySelector('#btn-close-single-student').addEventListener('click', closeModal);
      modal.querySelector('#btn-cancel-single-std').addEventListener('click', closeModal);
      modal.querySelector('#btn-submit-single-std').addEventListener('click', () => {
        const name = modal.querySelector('#modal-std-name').value.trim();
        const username = modal.querySelector('#modal-std-username').value.trim();
        const code = modal.querySelector('#modal-std-code').value.trim();
        const classId = modal.querySelector('#modal-std-class').value;
        const groupId = modal.querySelector('#modal-std-group').value;
        if (!name || !username) { alert('⚠️ 请输入姓名和登录账号！'); return; }
        authManager.addStudent(name, username, code || username, classId, groupId, 'student');
        closeModal();
        renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
      });
    });

    // 4. Modal: 批量导入学生
    container.querySelector('#btn-open-batch-import').addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
      const cls = classes[0];
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="teacher-modal-card fancy-task-modal" style="width:620px; background:radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0f172a 80%);">
          <div class="teacher-modal-header" style="background:linear-gradient(135deg, rgba(236,72,153,0.3), rgba(139,92,246,0.3));">
            <div class="modal-header-title">
              <div class="modal-icon-badge" style="background:rgba(236,72,153,0.3); color:#f472b6;">📥</div>
              <div>
                <h3>批量导入学生账号与小组划定 (默认密码 123)</h3>
                <p style="font-size:12px; color:#cbd5e1;">支持直接粘贴 Excel/TXT/CSV 多行学生名册数据</p>
              </div>
            </div>
            <button class="modal-close-btn" id="btn-close-batch-modal">✕</button>
          </div>
          <div class="teacher-modal-body">
            <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:10px 14px; margin-bottom:12px; font-size:12px; color:#cbd5e1; line-height:1.6;">
              <b style="color:#34d399;">格式说明：</b> 每一行为一名学生，字段用逗号、空格或 Tab 分隔。<br>
              标准格式: <code style="color:#38bdf8;">姓名, 拼音账号(用户名), 学号, 所属小组名称</code><br>
              示例：<span style="color:#a5b4fc;">赵强, zhaoqiang, D, 第1小组</span>
            </div>

            <div class="teacher-form-group">
              <div style="display:flex; justify-space-between; align-items:center; margin-bottom:6px;">
                <label><span class="req">*</span> 粘贴文本数据</label>
                <button id="btn-fill-demo-data" style="background:rgba(99,102,241,0.2); border:1px solid #6366f1; color:#a5b4fc; padding:2px 8px; border-radius:4px; font-size:11px; cursor:pointer;">⚡ 填充示范数据</button>
              </div>
              <textarea id="modal-batch-text" class="teacher-textarea fancy" style="min-height:140px; font-family:monospace; font-size:13px;" placeholder="粘贴多行数据，例如：&#10;赵强, zhaoqiang, D, 第1小组, 组员&#10;钱丽, qianli, E, 第1小组, 组员&#10;孙伟, sunwei, F, 第2小组, 组长"></textarea>
            </div>
          </div>
          <div class="teacher-modal-footer">
            <button class="modal-btn cancel" id="btn-cancel-batch">取消</button>
            <button class="modal-btn submit task-theme" id="btn-submit-batch-import" style="background:linear-gradient(135deg, #ec4899, #8b5cf6);">
              🚀 批量导入并生成账号
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => modal.remove();
      modal.querySelector('#btn-close-batch-modal').addEventListener('click', closeModal);
      modal.querySelector('#btn-cancel-batch').addEventListener('click', closeModal);

      const batchTextarea = modal.querySelector('#modal-batch-text');
      modal.querySelector('#btn-fill-demo-data').addEventListener('click', () => {
        batchTextarea.value = `赵强, zhaoqiang, D, 第1小组, 组员\n钱丽, qianli, E, 第1小组, 组员\n孙伟, sunwei, F, 第2小组, 组长\n周梅, zhoumei, G, 第2小组, 组员`;
      });

      modal.querySelector('#btn-submit-batch-import').addEventListener('click', () => {
        const text = batchTextarea.value.trim();
        if (!text) { alert('⚠️ 请输入或粘贴学生名册数据！'); return; }
        const count = authManager.importStudentsBatch(text, cls.id);
        alert(`🎉 成功批量导入 ${count} 名学生账号！初始密码统一为 123。`);
        closeModal();
        renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
      });
    });

    // 5. Task & Announcement Modals
    container.querySelector('#btn-open-task-modal').addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="teacher-modal-card fancy-task-modal">
          <div class="teacher-modal-header task-theme-gradient">
            <div class="modal-header-title">
              <div class="modal-icon-badge task">📌</div>
              <div><div class="modal-tag-pill">📌 教学任务管理矩阵 · 起止时间控制</div><h3>发布全新协作写作任务</h3></div>
            </div>
            <button class="modal-close-btn" id="btn-close-task-modal">✕</button>
          </div>
          <div class="teacher-modal-body">
            <div class="form-grid-2">
              <div class="teacher-form-group">
                <label><span class="req">*</span> 关联受众教学班级</label>
                <select id="modal-task-class" class="teacher-input fancy">${classes.map(c => `<option value="${c.id}">🏫 ${c.name}</option>`).join('')}</select>
              </div>
              <div class="teacher-form-group">
                <label><span class="req">*</span> 任务预估时长 (分钟)</label>
                <input type="number" id="modal-task-duration" class="teacher-input fancy" value="150">
                <div class="preset-chip-group">
                  <span class="preset-chip" data-duration="60">⚡ 60m</span>
                  <span class="preset-chip" data-duration="90">⏱️ 90m</span>
                  <span class="preset-chip active" data-duration="150">🌟 150m (标准)</span>
                  <span class="preset-chip" data-duration="180">🔥 180m</span>
                </div>
              </div>
            </div>
            <div class="form-grid-2" style="margin-top:6px;">
              <div class="teacher-form-group">
                <label><span class="req">*</span> 📅 任务开始时间</label>
                <input type="datetime-local" id="modal-task-start" class="teacher-input fancy">
                <div class="preset-chip-group" style="margin-top:4px;"><span class="preset-chip" id="btn-start-now">⚡ 设为当前时间</span></div>
              </div>
              <div class="teacher-form-group">
                <label><span class="req">*</span> ⌛ 任务截止时间 (Deadline)</label>
                <input type="datetime-local" id="modal-task-deadline" class="teacher-input fancy">
                <div class="preset-chip-group" style="margin-top:4px;">
                  <span class="preset-chip" data-addhours="2.5">⏱️ +2.5小时</span>
                  <span class="preset-chip" data-addhours="24">📅 +24小时 (明天)</span>
                  <span class="preset-chip" data-addhours="168">🗓️ +7天 (下周)</span>
                </div>
              </div>
            </div>
            <div class="teacher-form-group" style="margin-top:6px;">
              <label><span class="req">*</span> 写作任务名称</label>
              <input type="text" id="modal-task-title" class="teacher-input fancy" value="《现代教育技术》期末协作研究设计方案编写" placeholder="输入任务名称">
            </div>
            <div class="teacher-form-group">
              <label><span class="req">*</span> 任务详细说明与要求</label>
              <textarea id="modal-task-desc" class="teacher-textarea fancy" placeholder="请输入任务的具体说明与考核标准...">请在150分钟内，以小组为单位完成包含研究背景、研究问题、文献综述、研究设计与方法、不足反思与参考文献的高质量方案编写，并参加期末答辩。</textarea>
            </div>
          </div>
          <div class="teacher-modal-footer">
            <button class="modal-btn cancel" id="btn-cancel-task">取消</button>
            <button class="modal-btn submit task-theme" id="btn-submit-new-task">🚀 确认发布写作任务</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => modal.remove();
      modal.querySelector('#btn-close-task-modal').addEventListener('click', closeModal);
      modal.querySelector('#btn-cancel-task').addEventListener('click', closeModal);

      const startInput = modal.querySelector('#modal-task-start');
      const deadlineInput = modal.querySelector('#modal-task-deadline');
      const formatLocal = (d) => {
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };
      const now = new Date();
      startInput.value = formatLocal(now);
      deadlineInput.value = formatLocal(new Date(now.getTime() + 150 * 60 * 1000));

      modal.querySelector('#btn-start-now').addEventListener('click', () => { startInput.value = formatLocal(new Date()); });
      modal.querySelector('#btn-submit-new-task').addEventListener('click', () => {
        const classId = modal.querySelector('#modal-task-class').value;
        const title = modal.querySelector('#modal-task-title').value.trim();
        const desc = modal.querySelector('#modal-task-desc').value.trim();
        const startTime = startInput.value ? startInput.value.replace('T', ' ') : null;
        const deadline = deadlineInput.value ? deadlineInput.value.replace('T', ' ') : null;
        if (!title || !desc) { alert('⚠️ 请填齐任务标题与说明！'); return; }
        authManager.createTask(title, classId, desc, [{ name: '研究设计指南.pdf', size: '1.5MB' }], startTime, deadline, 150);
        closeModal();
        renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
      });
    });

    container.querySelector('#btn-open-ann-modal').addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
      let uploadedFile = { name: '协作写作问卷测量规范范例.pdf', size: '2.4 MB' };
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="teacher-modal-card fancy-ann-modal">
          <div class="teacher-modal-header ann-theme-gradient">
            <div class="modal-header-title"><div class="modal-icon-badge ann">📢</div><div><h3>发布课堂即时通知 (含教学资源上传)</h3></div></div>
            <button class="modal-close-btn" id="btn-close-ann-modal">✕</button>
          </div>
          <div class="teacher-modal-body">
            <div class="teacher-form-group">
              <label><span class="req">*</span> 关联写作任务</label>
              <select id="modal-ann-task" class="teacher-input fancy">${tasks.map(t => `<option value="${t.id}">📌 ${t.title}</option>`).join('')}</select>
            </div>
            <div class="teacher-form-group">
              <label><span class="req">*</span> 通知标题</label>
              <input type="text" id="modal-ann-title" class="teacher-input fancy" value="📢 教学通知：请及时完成文献与方法衔接" placeholder="输入通知标题">
            </div>
            <div class="teacher-form-group">
              <label><span class="req">*</span> 通知详细内容</label>
              <textarea id="modal-ann-content" class="teacher-textarea fancy" placeholder="输入推送给全班学生的通知正文...">请各组在后10分钟内集中检查【研究问题与假设】，并点击弹窗确认已读。</textarea>
            </div>
            <div class="teacher-form-group">
              <label>📎 随附教学资源文件上传 (点击选择本地文件或保留默认范例)</label>
              <div id="ann-file-dropzone" style="border:2px dashed rgba(139,92,246,0.4); border-radius:10px; padding:14px; text-align:center; background:rgba(139,92,246,0.08); cursor:pointer; transition:all 0.2s;">
                <input type="file" id="modal-ann-file" style="display:none;">
                <div id="ann-file-preview">
                  <span style="font-size:24px;">📁</span>
                  <div style="font-size:13px; color:#a78bfa; font-weight:700; margin-top:4px;">点击上传电脑本地教学文件 (.pdf, .docx, .zip)</div>
                  <div style="font-size:11px; color:#cbd5e1; margin-top:4px;">当前已附资源: <b style="color:#34d399;">协作写作问卷测量规范范例.pdf (2.4 MB)</b></div>
                </div>
              </div>
            </div>
          </div>
          <div class="teacher-modal-footer">
            <button class="modal-btn cancel" id="btn-cancel-ann">取消</button>
            <button class="modal-btn submit ann-theme" id="btn-submit-new-ann">📢 广播发布并推送弹窗</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => modal.remove();
      modal.querySelector('#btn-close-ann-modal').addEventListener('click', closeModal);
      modal.querySelector('#btn-cancel-ann').addEventListener('click', closeModal);

      const fileInput = modal.querySelector('#modal-ann-file');
      const dropzone = modal.querySelector('#ann-file-dropzone');
      const preview = modal.querySelector('#ann-file-preview');

      if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            const sizeMB = (f.size / (1024 * 1024)).toFixed(1) + ' MB';
            uploadedFile = { name: f.name, size: sizeMB };
            preview.innerHTML = `
              <span style="font-size:24px;">✅</span>
              <div style="font-size:13px; color:#34d399; font-weight:700; margin-top:4px;">已上传本地文件: ${f.name}</div>
              <div style="font-size:11px; color:#a5b4fc;">大小: ${sizeMB} | 准备随着通知广播推送给全组</div>
            `;
          }
        });
      }

      modal.querySelector('#btn-submit-new-ann').addEventListener('click', () => {
        const taskId = modal.querySelector('#modal-ann-task').value;
        const title = modal.querySelector('#modal-ann-title').value.trim();
        const content = modal.querySelector('#modal-ann-content').value.trim();
        if (!title || !content) { alert('⚠️ 请填齐通知标题与内容！'); return; }
        authManager.publishAnnouncement(taskId, title, content, uploadedFile);
        closeModal();
        renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
      });
    });
  }

  /* ==========================================================================
     8. UI RENDERER (STUDENT CANVAS & HEADER)
     ========================================================================== */
  function renderHeader(state, currentUser, announcements, onStageChange, onSpeedChange, onLogout, onSwitchTeacher, onOpenAnnModal, onOpenSurveyModal) {
    const header = document.getElementById('app-header');
    const elapsedMin = Math.floor(state.timer.elapsedSeconds / 60);
    const remainingMin = Math.max(0, 150 - elapsedMin);
    const unreadAnnCount = announcements ? announcements.filter(a => !a.readStatus || !a.readStatus['group_1']).length : 0;
    const isFinalSubmitted = state.isFinalSubmitted;

    header.innerHTML = `
      <div class="brand-section">
        <div class="brand-logo">集智 JIZHI</div>
        <div class="brand-badge">🎓 ${currentUser ? currentUser.name : '学生A'} ${isFinalSubmitted ? '<span style="color:#34d399; margin-left:4px;">(🔒 终稿已归档)</span>' : ''}</div>
      </div>
      <nav class="stage-nav">
        <button class="stage-btn ${state.currentStage === 'stage1' ? 'active' : ''}" data-stage="stage1">🎪 阶段一：学术拍卖会 (25m)</button>
        <button class="stage-btn ${state.currentStage === 'stage2' ? 'active' : ''}" data-stage="stage2">📰 阶段二：学术编辑部 (105m)</button>
        <button class="stage-btn ${state.currentStage === 'stage3' ? 'active' : ''}" data-stage="stage3">🎓 阶段三：答辩擂台 (20m)</button>
      </nav>
      <div class="header-controls">
        ${isFinalSubmitted ? `
          <button id="btn-header-survey-link" style="background:linear-gradient(135deg, #8b5cf6, #6366f1); border:none; color:white; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; box-shadow:0 0 10px rgba(139,92,246,0.4);" title="课程评估问卷">
            📋 课程评估问卷
          </button>
        ` : ''}
        <button class="nav-ann-bell-btn ${unreadAnnCount > 0 ? 'has-unread' : ''}" id="btn-header-ann-bell" title="课堂通知">
          🔔 消息 ${unreadAnnCount > 0 ? `<span class="unread-count">${unreadAnnCount}</span>` : ''}
        </button>
        <div class="timer-box">⏱️ ${remainingMin}m</div>
        <select class="speed-selector" id="speed-select" title="流速倍率">
          <option value="1" ${state.timer.speed === 1 ? 'selected' : ''}>1x</option>
          <option value="5" ${state.timer.speed === 5 ? 'selected' : ''}>5x</option>
          <option value="10" ${state.timer.speed === 10 ? 'selected' : ''}>10x</option>
        </select>
        <button id="btn-switch-teacher-view" class="header-icon-btn" title="切换至教师端">👩‍🏫 教师端</button>
        <button id="btn-user-logout" class="header-icon-btn logout" title="退出登录">退出</button>
      </div>
    `;

    header.querySelectorAll('.stage-btn').forEach(btn => {
      btn.addEventListener('click', () => onStageChange(btn.dataset.stage));
    });
    header.querySelector('#speed-select').addEventListener('change', (e) => onSpeedChange(Number(e.target.value)));
    header.querySelector('#btn-user-logout').addEventListener('click', () => onLogout());
    header.querySelector('#btn-switch-teacher-view').addEventListener('click', () => onSwitchTeacher());
    header.querySelector('#btn-header-ann-bell').addEventListener('click', () => onOpenAnnModal());
    const surveyHeaderBtn = header.querySelector('#btn-header-survey-link');
    if (surveyHeaderBtn) surveyHeaderBtn.addEventListener('click', () => onOpenSurveyModal());
  }

  function renderCanvas(state, handlers) {
    const canvas = document.getElementById('canvas-panel');
    if (state.currentStage === 'stage1') renderStage1Canvas(canvas, state, handlers);
    else if (state.currentStage === 'stage2') renderStage2Canvas(canvas, state, handlers);
    else if (state.currentStage === 'stage3') renderStage3Canvas(canvas, state, handlers);
  }

  function renderStage1Canvas(canvas, state, handlers) {
    const s1 = state.stage1;
    const currentUser = state.currentUser;
    const membersList = Object.values(state.members || {});
    const totalMembersCount = membersList.length;
    const confirmedMembers = s1.contract.confirmedMembers || {};
    const confirmedCount = membersList.filter(m => confirmedMembers[m.id]).length;
    const userHasConfirmed = confirmedMembers[currentUser];
    const isContractLocked = s1.contract.isConfirmed || state.isFinalSubmitted;

    const userHasVoted = s1.hasVoted && s1.hasVoted[currentUser];
    const userVotedProposalId = s1.votes ? s1.votes[currentUser] : null;
    const totalVotesCast = Object.values(s1.hasVoted || {}).filter(Boolean).length;

    canvas.innerHTML = `
      ${isContractLocked ? `
        <div style="background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:10px 14px; margin-bottom:12px; font-size:13px; color:#34d399; font-weight:700; display:flex; align-items:center; justify-content:space-between;">
          <span>🔒 阶段一【学术拍卖会】合作合约已全员签署生效并锁定 (可随时返回查阅)</span>
          <span style="font-size:11px; color:#cbd5e1; background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:4px;">全组 ${confirmedCount}/${totalMembersCount} 人已签署</span>
        </div>
      ` : ''}

      <div class="card">
        <div class="card-title">
          <span>💡 竞拍提案面板 (观点+理由) ${isContractLocked ? '<span style="font-size:11px; color:#34d399;">(🔒 已锁定)</span>' : ''}</span>
          <div style="font-size:12px; color:#38bdf8;">
            📊 投票进度: <b>${totalVotesCast}/${totalMembersCount} 人已投票</b> ${userHasVoted ? '<span style="color:#4ade80; margin-left:6px;">(投票已锁定)</span>' : ''}
          </div>
        </div>
        <div class="proposals-grid">
          ${s1.proposals.map(p => {
            const isThisVoted = userVotedProposalId === p.id;
            let btnText = '投票支持此提案';
            let btnClass = 'vote-btn';
            if (isContractLocked || userHasVoted) {
              if (isThisVoted) { btnText = '🔒 已投此提案 (已锁定)'; btnClass = 'vote-btn active locked'; }
              else { btnText = '🔒 投票已锁定'; btnClass = 'vote-btn disabled'; }
            }
            return `
              <div class="proposal-card ${isThisVoted ? 'voted' : ''}">
                <div class="proposal-header">
                  <div class="proposal-title">💡 观点: ${p.title}</div>
                  <span class="proposal-tag">${p.category}</span>
                </div>
                <div style="font-size:12px; color:#cbd5e1; margin-bottom:8px; background:rgba(15,23,42,0.6); padding:8px; border-radius:6px; line-height:1.5;">
                  <b>理由依据:</b> ${p.rationale}
                </div>
                <div class="metrics-row">
                  <span>文献: <b>${p.metrics.literature}</b></span>
                  <span>新意: <b>${p.metrics.innovation}</b></span>
                  <span>风险: <b>${p.metrics.risk}</b></span>
                </div>
                <button class="${btnClass}" data-id="${p.id}" ${isContractLocked || userHasVoted ? 'disabled' : ''}>${btnText}</button>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="contract-card" style="margin-top:16px;">
        <div class="contract-header">📜 合作学术合约卡片 ${isContractLocked ? `<span style="font-size:11px; color:#34d399; margin-left:8px;">(🔒 ${confirmedCount}/${totalMembersCount}全员签署完成 · 归档只读查阅)</span>` : '(依据聊天内容实时提取 · 学生可微调)'}</div>
        <div style="font-size:14px; font-weight:700; margin-bottom:14px; color:#e2e8f0; display:flex; align-items:center; gap:10px;">
          <span style="white-space:nowrap;">确认融合主题:</span>
          <input type="text" id="contract-topic-input" class="large-contract-input" value="${s1.mergedTitle}" ${isContractLocked ? 'disabled readonly style="opacity:0.8; cursor:not-allowed;"' : ''} style="flex:1;">
        </div>
        <div class="contract-grid">
          <div>
            <div style="font-weight:700; color:#a78bfa; margin-bottom:8px; font-size:13px;">⏱️ 从聊天提取的 150分钟时间预算 (分钟):</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:13px; color:#cbd5e1;">
              <label>背景: <input type="number" class="contract-time-input large" data-key="background" value="${s1.contract.timeAllocations.background}" ${isContractLocked ? 'disabled readonly style="opacity:0.8; cursor:not-allowed;"' : ''}></label>
              <label>问题: <input type="number" class="contract-time-input large" data-key="questions" value="${s1.contract.timeAllocations.questions}" ${isContractLocked ? 'disabled readonly style="opacity:0.8; cursor:not-allowed;"' : ''}></label>
              <label>文献: <input type="number" class="contract-time-input large" data-key="literature" value="${s1.contract.timeAllocations.literature}" ${isContractLocked ? 'disabled readonly style="opacity:0.8; cursor:not-allowed;"' : ''}></label>
              <label>方法: <input type="number" class="contract-time-input large" data-key="method" value="${s1.contract.timeAllocations.method}" ${isContractLocked ? 'disabled readonly style="opacity:0.8; cursor:not-allowed;"' : ''}></label>
              <label>反思: <input type="number" class="contract-time-input large" data-key="reflection" value="${s1.contract.timeAllocations.reflection}" ${isContractLocked ? 'disabled readonly style="opacity:0.8; cursor:not-allowed;"' : ''}></label>
              <label>文献表: <input type="number" class="contract-time-input large" data-key="references" value="${s1.contract.timeAllocations.references}" ${isContractLocked ? 'disabled readonly style="opacity:0.8; cursor:not-allowed;"' : ''}></label>
            </div>
          </div>
          <div>
            <div style="font-weight:700; color:#a78bfa; margin-bottom:8px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
              <span>👥 成员具体分工 (由教师端统筹设定):</span>
              ${!isContractLocked ? `<button id="btn-add-team-member" style="background:rgba(99,102,241,0.2); border:1px dashed #6366f1; color:#a5b4fc; padding:2px 8px; border-radius:4px; font-size:11px; cursor:pointer; font-weight:700;">+ 增加小组成员</button>` : ''}
            </div>
            <div style="display:flex; flex-direction:column; gap:10px; font-size:13px;">
              ${membersList.map(m => {
                const taskVal = (s1.contract.taskAssignments && s1.contract.taskAssignments[m.id]) || '';
                return `
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="white-space:nowrap; font-weight:700; color:${m.color || '#818cf8'}; min-width:120px;">${m.avatar || '👤'} ${m.name}:</span>
                    <input type="text" class="large-contract-input task-assignment-input" data-mid="${m.id}" value="${taskVal}" ${isContractLocked ? 'disabled readonly style="opacity:0.8; cursor:not-allowed;"' : ''} style="flex:1;" placeholder="分配具体负责的写作章节与任务">
                    ${!isContractLocked && totalMembersCount > 2 ? `<button class="btn-remove-member" data-mid="${m.id}" style="background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#f87171; border-radius:4px; padding:4px 8px; font-size:11px; cursor:pointer;" title="移除此成员">✕</button>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
        <div style="margin-top:18px; background:rgba(15,23,42,0.7); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px 16px;">
          <div style="font-size:13px; font-weight:700; color:#cbd5e1; margin-bottom:8px; display:flex; justify-content:space-between;">
            <span>📌 组内全员确认签署状态矩阵 (规则：需 ${totalMembersCount}/${totalMembersCount} 人全部点击确认):</span>
            <span style="color:${confirmedCount === totalMembersCount ? '#34d399' : '#fbbf24'}; font-weight:800;">进度: ${confirmedCount}/${totalMembersCount} 人已签署 ${confirmedCount === totalMembersCount ? '🎉 (已归档生效)' : ''}</span>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:10px; font-size:13px;">
            ${membersList.map(m => {
              const isConf = confirmedMembers[m.id];
              return `
                <span style="color:${isConf ? '#34d399' : '#94a3b8'}; border:1px solid ${isConf ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.1)'}; background:${isConf ? 'rgba(52,211,153,0.1)' : 'rgba(0,0,0,0.2)'}; padding:4px 10px; border-radius:6px;">
                  ${m.avatar || '👤'} ${m.name}: <b>${isConf ? '✅ 已确认签署' : '⏳ 未确认'}</b>
                </span>
              `;
            }).join('')}
          </div>
        </div>
        <div style="margin-top:16px; text-align:center;">
          <button id="btn-confirm-contract" ${isContractLocked ? 'disabled' : ''} style="background:${isContractLocked ? 'rgba(16,185,129,0.2)' : userHasConfirmed ? 'rgba(16,185,129,0.3)' : 'linear-gradient(135deg, #10b981, #059669)'}; border:1px solid ${isContractLocked || userHasConfirmed ? '#10b981' : 'transparent'}; color:${isContractLocked ? '#34d399' : 'white'}; padding:12px 28px; border-radius:10px; font-weight:700; cursor:${isContractLocked ? 'not-allowed' : 'pointer'}; font-size:15px;">
            ${isContractLocked ? '🔒 学术合作合约已全员签署生效并锁定 (只读归档查阅)' : userHasConfirmed ? `✅ 我 (${state.members[currentUser] ? state.members[currentUser].name : currentUser}) 已按键确认签署 (${confirmedCount}/${totalMembersCount} 人已完成)` : `✍️ 我以 (${state.members[currentUser] ? state.members[currentUser].name : currentUser}) 身份按键确认签署合约 (已确认 ${confirmedCount}/${totalMembersCount} 人)`}
          </button>
        </div>
      </div>
    `;

    // Bind contract input events
    const topicInput = canvas.querySelector('#contract-topic-input');
    if (topicInput && !isContractLocked) {
      topicInput.addEventListener('input', (e) => {
        s1.mergedTitle = e.target.value;
        if (handlers.onContractChange) handlers.onContractChange();
      });
    }

    canvas.querySelectorAll('.contract-time-input').forEach(input => {
      if (!isContractLocked) {
        input.addEventListener('input', (e) => {
          const key = e.target.dataset.key;
          if (key && s1.contract.timeAllocations) {
            s1.contract.timeAllocations[key] = Number(e.target.value) || 0;
            if (handlers.onContractChange) handlers.onContractChange();
          }
        });
      }
    });

    canvas.querySelectorAll('.task-assignment-input').forEach(input => {
      if (!isContractLocked) {
        input.addEventListener('input', (e) => {
          const mId = e.target.dataset.mid;
          if (mId) {
            if (!s1.contract.taskAssignments) s1.contract.taskAssignments = {};
            s1.contract.taskAssignments[mId] = e.target.value;
            if (handlers.onContractChange) handlers.onContractChange();
          }
        });
      }
    });

    const addBtn = canvas.querySelector('#btn-add-team-member');
    if (addBtn && !isContractLocked) {
      addBtn.addEventListener('click', () => {
        if (handlers.onAddMember) handlers.onAddMember();
      });
    }

    canvas.querySelectorAll('.btn-remove-member').forEach(btn => {
      btn.addEventListener('click', () => {
        if (handlers.onRemoveMember) handlers.onRemoveMember(btn.dataset.mid);
      });
    });

    if (!isContractLocked) {
      canvas.querySelectorAll('.vote-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => handlers.onVote(btn.dataset.id));
      });
      canvas.querySelector('#btn-confirm-contract').addEventListener('click', () => handlers.onConfirmContract());
    }
  }

  function renderStage2Canvas(canvas, state, handlers) {
    const s2 = state.stage2;
    const actionPlan = s2.actionPlan;
    const isStage2MeetingLocked = state.currentStage === 'stage3' || state.isFinalSubmitted;
    const isEditorReadonly = state.isFinalSubmitted;
    const membersList = Object.values(state.members || {});
    const contribs = s2.memberContributions || {};

    canvas.innerHTML = `
      ${isStage2MeetingLocked ? `
        <div style="background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3); border-radius:8px; padding:10px 14px; margin-bottom:10px; font-size:13px; color:#a5b4fc; font-weight:700; display:flex; justify-content:space-between; align-items:center;">
          <span>🔒 阶段二【半程编辑会议】打分与修正清单已完成并锁定 ${isEditorReadonly ? '· 全盘终稿已提交只读查阅' : '· 可随时回看'}</span>
          <span style="font-size:11px; color:#cbd5e1; background:rgba(0,0,0,0.3); padding:4px 8px; border-radius:4px;">归档只读</span>
        </div>
      ` : ''}

      <div class="card" style="height:100%; display:flex; flex-direction:column; padding:20px;">
        <div class="card-title" style="margin-bottom:10px;">
          <span>📝 统一协作写作大文本框 (论文全篇大正文)</span>
          <div style="display:flex; gap:10px;">
            <button id="btn-show-case" style="background:rgba(99,102,241,0.2); border:1px solid #6366f1; color:#a5b4fc; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600;">📥 下载并查阅审稿编辑推送的《范例文件.pdf》</button>
            <button id="btn-trigger-meeting" ${isStage2MeetingLocked ? 'disabled' : ''} style="background:${isStage2MeetingLocked ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #10b981, #059669)'}; border:${isStage2MeetingLocked ? '1px solid rgba(255,255,255,0.15)' : 'none'}; color:${isStage2MeetingLocked ? '#94a3b8' : 'white'}; padding:6px 14px; border-radius:6px; font-size:12px; cursor:${isStage2MeetingLocked ? 'not-allowed' : 'pointer'}; font-weight:700;">
              ${isStage2MeetingLocked ? '🔒 编辑会议已结束' : '📢 发起【编辑会议】'}
            </button>
          </div>
        </div>
        ${actionPlan && actionPlan.isGenerated ? `
          <div style="background:linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1)); border:1px solid rgba(16,185,129,0.3); border-radius:8px; padding:10px 14px; margin-bottom:10px;">
            <div style="font-size:13px; font-weight:700; color:#34d399; margin-bottom:4px;">📋 编辑会议产出：【半程编辑修正清单】(已锁定归档)</div>
            <div style="font-size:12px; color:#cbd5e1; display:flex; flex-direction:column; gap:2px;">
              ${actionPlan.items.map(item => `<div>• ${item}</div>`).join('')}
            </div>
          </div>
        ` : ''}
        <div style="flex:1; display:flex; flex-direction:column; gap:8px; min-height:0;">
          <div style="font-size:12px; color:#94a3b8; display:flex; justify-content:space-between; flex-shrink:0;">
            <span>包含《一、背景》《二、问题假设》《三、文献》《四、方法》《五、反思》《六、参考文献》全篇论文</span>
            <span>整篇实时字数: <b style="color:#38bdf8; font-size:14px;">${s2.unifiedContent.length}</b> 字 ${isEditorReadonly ? '(🔒 终稿只读)' : ''}</span>
          </div>
          <textarea class="editor-textarea unified-large-editor-full" id="main-unified-editor" ${isEditorReadonly ? 'readonly style="opacity:0.85; background:rgba(15,23,42,0.9);"' : ''}>${s2.unifiedContent}</textarea>
        </div>
        <div style="margin-top:14px; background:rgba(15,23,42,0.7); padding:14px; border-radius:10px; border:1px solid var(--border-glass); flex-shrink:0;">
          <div style="font-size:12px; font-weight:600; margin-bottom:8px; color:#cbd5e1; display:flex; justify-content:space-between;">
            <span>📊 小组贡献度统计 (SSRL 群体感知监控)</span>
            <span>总字数: ${s2.unifiedContent.length} 字</span>
          </div>
          <div class="contribution-bar-container">
            <div class="contrib-bars" style="height:14px; border-radius:7px; display:flex; overflow:hidden;">
              ${membersList.map((m) => {
                const c = contribs[m.id] || { percentage: Math.round(100 / membersList.length) };
                return `<div class="contrib-segment" style="width:${c.percentage}%; background:${m.color || '#818cf8'};" title="${m.name}: ${c.percentage}%"></div>`;
              }).join('')}
            </div>
            <div style="display:flex; justify-around; font-size:12px; font-weight:600; color:#cbd5e1; margin-top:6px; flex-wrap:wrap; gap:10px;">
              ${membersList.map((m) => {
                const c = contribs[m.id] || { percentage: Math.round(100 / membersList.length) };
                return `<span style="color:${m.color || '#818cf8'};">● ${m.name}: ${c.percentage}%</span>`;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    if (!isEditorReadonly) {
      canvas.querySelector('#main-unified-editor').addEventListener('input', (e) => handlers.onUnifiedContentChange(e.target.value));
    }
    canvas.querySelector('#btn-show-case').addEventListener('click', () => handlers.onOpenCaseModal());
    if (!isStage2MeetingLocked) {
      canvas.querySelector('#btn-trigger-meeting').addEventListener('click', () => handlers.onOpenMeetingModal());
    }
  }

  function renderStage3Canvas(canvas, state, handlers) {
    const s3 = state.stage3;
    const activeTab = s3.activeTab || 'defense';
    const isFinalSubmitted = state.isFinalSubmitted;

    canvas.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; gap:12px;">
        ${isFinalSubmitted ? `
          <div style="background:linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15)); border:1px solid rgba(168,85,247,0.4); border-radius:12px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; flex-shrink:0; box-shadow:0 4px 14px rgba(0,0,0,0.3);">
            <div>
              <div style="font-size:14px; font-weight:800; color:#c084fc; display:flex; align-items:center; gap:8px;">
                <span>🔒 论文终稿与评估报告已成功归档提交至教师端！</span>
              </div>
              <div style="font-size:12px; color:#cbd5e1; margin-top:3px;">请组内每位成员点击右侧按钮进入【课程协作体验与 SSRL 效果评估问卷】填写界面。</div>
            </div>
            <button id="btn-open-survey-page" style="background:linear-gradient(135deg, #8b5cf6, #6366f1); border:none; color:white; padding:8px 18px; border-radius:8px; font-weight:700; font-size:13px; cursor:pointer; box-shadow:0 4px 12px rgba(139,92,246,0.4); text-shadow:0 1px 2px rgba(0,0,0,0.3);">
              📋 打开问卷填写界面 ↗
            </button>
          </div>
        ` : ''}

        <!-- Stage 3 Navigation Sub-Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(30,41,59,0.8); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:8px 12px; flex-shrink:0;">
          <div style="display:flex; gap:10px;">
            <button id="tab-btn-defense" style="background:${activeTab === 'defense' ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255,255,255,0.08)'}; border:none; color:white; padding:8px 16px; border-radius:8px; font-weight:700; font-size:13px; cursor:pointer;">
              🎓 答辩委员会质询与中间委员引导面板
            </button>
            <button id="tab-btn-editor" style="background:${activeTab === 'editor' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.08)'}; border:none; color:white; padding:8px 16px; border-radius:8px; font-weight:700; font-size:13px; cursor:pointer;">
              📝 返回协作写作大正文 (依据意见修改终稿)
            </button>
          </div>
          <button id="btn-final-submit" ${isFinalSubmitted ? 'disabled' : ''} style="background:${isFinalSubmitted ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #10b981, #059669)'}; border:${isFinalSubmitted ? '1px solid #10b981' : 'none'}; color:${isFinalSubmitted ? '#34d399' : 'white'}; padding:8px 18px; border-radius:8px; font-weight:700; cursor:${isFinalSubmitted ? 'not-allowed' : 'pointer'}; font-size:13px;">
            ${isFinalSubmitted ? '🔒 论文终稿已成功提交 (归档只读)' : '🚀 提交期末论文终稿'}
          </button>
        </div>

        ${activeTab === 'defense' ? `
          <div class="card" style="flex:1; overflow-y:auto; padding:20px;">
            <div class="card-title" style="margin-bottom:14px;">
              <span>🎓 答辩委员会改进意见与组内裁决矩阵 ${isFinalSubmitted ? '<span style="font-size:11px; color:#34d399; margin-left:6px;">(🔒 已提交归档)</span>' : ''}</span>
              <span style="font-size:12px; color:#38bdf8;">正反方提意见 ➔ 中间委员逐条引导 ➔ 学生研讨裁决</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:16px;">
              ${s3.feedbackItems.map((item, idx) => `
                <div style="background:rgba(15,23,42,0.7); padding:16px; border-radius:12px; border:1px solid ${item.role === 'opponent' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}; box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                  <!-- 1. Speaker Header & Title -->
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span style="font-size:18px;">${item.role === 'opponent' ? '🔴' : '🟢'}</span>
                      <span style="font-weight:800; font-size:15px; color:${item.role === 'opponent' ? '#f87171' : '#4ade80'};">质询点 ${idx + 1}: ${item.speaker || (item.role === 'opponent' ? '反方委员 Agent' : '正方委员 Agent')} - ${item.title}</span>
                    </div>
                    <span style="font-size:11px; padding:3px 10px; border-radius:12px; font-weight:700; background:${item.status === 'adopted' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)'}; color:${item.status === 'adopted' ? '#4ade80' : '#fbbf24'}; border:1px solid ${item.status === 'adopted' ? 'rgba(34,197,94,0.4)' : 'rgba(234,179,8,0.4)'};">
                      ${item.status === 'adopted' ? '✅ 已研讨并归档' : '⏳ 待组内研讨裁决'}
                    </span>
                  </div>

                  <!-- 2. Original Critique Content -->
                  <div style="font-size:13px; color:#f1f5f9; background:rgba(30,41,59,0.8); padding:10px 14px; border-radius:8px; margin-bottom:10px; line-height:1.6;">
                    <b>${item.speaker}意见原文:</b> ${item.content}
                  </div>

                  <!-- 3. Intermediate Agent Guidance per Suggestion -->
                  <div style="font-size:13px; color:#fef08a; background:rgba(234,179,8,0.12); border:1px solid rgba(234,179,8,0.3); padding:10px 14px; border-radius:8px; margin-bottom:12px; line-height:1.6;">
                    <b>🟡 中间委员 Agent 针对性引导思考:</b><br>${item.neutralGuidance}
                  </div>

                  <!-- 4. Student Resolution & Button -->
                  ${item.response ? `
                    <div style="font-size:13px; color:#a5b4fc; background:rgba(99,102,241,0.15); border-left:4px solid var(--accent-indigo); padding:10px 14px; border-radius:6px;">
                      <b>👥 组内研讨统一裁决结论:</b> ${item.response}
                    </div>
                  ` : `
                    <button class="discuss-item-btn" data-id="${item.id}" ${isFinalSubmitted ? 'disabled' : ''} style="background:${isFinalSubmitted ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #6366f1, #4f46e5)'}; border:none; color:${isFinalSubmitted ? '#94a3b8' : 'white'}; padding:8px 16px; border-radius:8px; font-size:13px; font-weight:700; cursor:${isFinalSubmitted ? 'not-allowed' : 'pointer'};">
                      ${isFinalSubmitted ? '🔒 已提交只读' : '💬 组内针对此条开展研讨与裁决'}
                    </button>
                  `}
                </div>
              `).join('')}
            </div>
          </div>
        ` : `
          <!-- Unified Editor inside Stage 3 -->
          <div class="card" style="flex:1; display:flex; flex-direction:column; padding:20px;">
            <div class="card-title" style="margin-bottom:10px;">
              <span>📝 论文全篇大正文 ${isFinalSubmitted ? '<span style="font-size:11px; color:#34d399; margin-left:6px;">(🔒 终稿已提交 · 归档只读查阅)</span>' : '(依据答辩意见实时修改终稿)'}</span>
              <span style="font-size:12px; color:#38bdf8;">实时字数: <b>${state.stage2.unifiedContent.length}</b> 字</span>
            </div>
            <textarea class="editor-textarea unified-large-editor-full" id="stage3-unified-editor" ${isFinalSubmitted ? 'readonly style="opacity:0.85; background:rgba(15,23,42,0.9);"' : ''} style="flex:1;">${state.stage2.unifiedContent}</textarea>
          </div>
        `}
      </div>
    `;

    // Event Bindings for Stage 3 Tabs
    const tabDefense = canvas.querySelector('#tab-btn-defense');
    const tabEditor = canvas.querySelector('#tab-btn-editor');
    if (tabDefense) tabDefense.addEventListener('click', () => handlers.onSwitchStage3Tab('defense'));
    if (tabEditor) tabEditor.addEventListener('click', () => handlers.onSwitchStage3Tab('editor'));

    const editorEl = canvas.querySelector('#stage3-unified-editor');
    if (editorEl && !isFinalSubmitted) {
      editorEl.addEventListener('input', (e) => handlers.onUnifiedContentChange(e.target.value));
    }

    if (!isFinalSubmitted) {
      canvas.querySelectorAll('.discuss-item-btn').forEach(btn => {
        btn.addEventListener('click', () => handlers.onDiscussItem(btn.dataset.id));
      });
    }

    const submitBtn = canvas.querySelector('#btn-final-submit');
    if (submitBtn && !isFinalSubmitted) submitBtn.addEventListener('click', () => handlers.onFinalSubmit());

    const surveyBtn = canvas.querySelector('#btn-open-survey-page');
    if (surveyBtn) surveyBtn.addEventListener('click', () => handlers.onOpenSurveyModal());
  }

  function renderChat(state) {
    const stream = document.getElementById('chat-stream');
    if (!stream) return;
    const logs = state.chatLogs[state.currentStage] || [];
    const currentUser = state.currentUser;

    stream.innerHTML = logs.map(msg => {
      const isMe = msg.sender === currentUser;
      const isAgent = AgentProfiles[msg.sender] !== undefined;
      const profile = isAgent ? AgentProfiles[msg.sender] : state.members[msg.sender];
      const avatar = profile ? profile.avatar : '👤';
      const name = profile ? (profile.name || profile.roleTitle) : msg.sender;
      const color = profile ? profile.color : '#94a3b8';

      let formattedText = msg.text || '';
      formattedText = formattedText.replace(/(@[^\s@]+)/g, '<span class="mention-tag">$1</span>');

      return `
        <div class="chat-message ${isMe ? 'me' : 'other'}">
          <div class="msg-avatar" style="background:${color}22; border:1px solid ${color}; color:${color};">${avatar}</div>
          <div class="msg-body">
            <div class="msg-meta">
              <span class="msg-sender" style="color:${color};">${name} ${isMe ? '(我)' : ''}</span>
              <span style="font-size:10px; color:#64748b; margin-left:6px;">${msg.timestamp || ''}</span>
            </div>
            <div class="msg-bubble">${formattedText}</div>
          </div>
        </div>
      `;
    }).join('');
    stream.scrollTop = stream.scrollHeight;
  }

  /* ==========================================================================
     9. APP CONTROLLER
     ========================================================================== */
  const STORAGE_KEY_CHAT = 'jizhi_sync_chat_v3';
  const STORAGE_KEY_STAGE1 = 'jizhi_sync_s1_v3';
  const STORAGE_KEY_STAGE2 = 'jizhi_sync_s2_v3';
  const STORAGE_KEY_STAGE3 = 'jizhi_sync_s3_v3';
  const STORAGE_KEY_STAGE_CURRENT = 'jizhi_sync_current_stage_v3';

  class App {
    constructor() {
      this.authManager = new AuthManager();
      this.state = JSON.parse(JSON.stringify(InitialState));
      this.studentMsgCountSinceLastAgent = 0;
      this.initSyncStorage();
      this.cloudSyncEngine = new CloudSyncEngine(this);
      this.initTimer();
      this.renderMain();
    }

    initSyncStorage() {
      const savedChat = localStorage.getItem(STORAGE_KEY_CHAT);
      if (savedChat) { 
        try { 
          this.state.chatLogs = JSON.parse(savedChat);
          if (!this.state.chatLogs.stage3 || this.state.chatLogs.stage3.length < 5) {
            this.state.chatLogs.stage3 = PresetMessages.stage3;
          }
        } catch (e) { this.initPresetMessages(); } 
      }
      else { this.initPresetMessages(); }

      const savedS1 = localStorage.getItem(STORAGE_KEY_STAGE1);
      if (savedS1) { try { this.state.stage1 = { ...this.state.stage1, ...JSON.parse(savedS1) }; } catch (e) {} }

      const savedS2 = localStorage.getItem(STORAGE_KEY_STAGE2);
      if (savedS2) { try { this.state.stage2 = { ...this.state.stage2, ...JSON.parse(savedS2) }; } catch (e) {} }

      const savedS3 = localStorage.getItem(STORAGE_KEY_STAGE3);
      if (savedS3) { try { this.state.stage3 = { ...this.state.stage3, ...JSON.parse(savedS3) }; } catch (e) {} }

      const savedStage = localStorage.getItem(STORAGE_KEY_STAGE_CURRENT);
      if (savedStage) { this.state.currentStage = savedStage; }

      const savedSubmitted = localStorage.getItem('jizhi_sync_final_submitted');
      if (savedSubmitted === 'true') { this.state.isFinalSubmitted = true; }
    }

    initPresetMessages() {
      ['stage1', 'stage2', 'stage3'].forEach(stage => {
        if (!this.state.chatLogs[stage] || this.state.chatLogs[stage].length === 0) {
          this.state.chatLogs[stage] = PresetMessages[stage] || [];
        }
      });
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(this.state.chatLogs));
    }

    syncChatLogs() {
      localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(this.state.chatLogs));
      if (this.cloudSyncEngine) this.cloudSyncEngine.pushSnapshot();
    }

    syncStage1() {
      localStorage.setItem(STORAGE_KEY_STAGE1, JSON.stringify(this.state.stage1));
      if (this.cloudSyncEngine) this.cloudSyncEngine.pushSnapshot();
    }

    syncStage2() {
      localStorage.setItem(STORAGE_KEY_STAGE2, JSON.stringify(this.state.stage2));
      if (this.cloudSyncEngine) this.cloudSyncEngine.pushSnapshot();
    }

    syncStage3() {
      localStorage.setItem(STORAGE_KEY_STAGE3, JSON.stringify(this.state.stage3));
      localStorage.setItem('jizhi_sync_final_submitted', this.state.isFinalSubmitted);
      if (this.cloudSyncEngine) this.cloudSyncEngine.pushSnapshot();
    }

    syncStageChange(stage) {
      localStorage.setItem(STORAGE_KEY_STAGE_CURRENT, stage);
      if (this.cloudSyncEngine) this.cloudSyncEngine.pushSnapshot();
    }

    initTimer() {
      setInterval(() => {
        const currentUser = this.authManager.getCurrentUser();
        if (currentUser && currentUser.role === 'student' && this.state.timer.isRunning) {
          this.state.timer.elapsedSeconds += 1 * this.state.timer.speed;
          const min = this.state.timer.elapsedSeconds / 60;
          if (min >= 25 && this.state.currentStage === 'stage1') this.switchStage('stage2');
          else if (min >= 130 && this.state.currentStage === 'stage2') this.switchStage('stage3');

          renderHeader(
            this.state, currentUser, this.authManager.getAnnouncements(),
            (s) => this.switchStage(s), (sp) => this.setSpeed(sp),
            () => this.handleLogout(), () => this.switchToTeacherView(),
            () => this.showAnnouncementModal(), () => this.showQuestionnaireModal()
          );
        }
      }, 1000);
    }

    renderMain() {
      const currentUser = this.authManager.getCurrentUser();
      const appEl = document.getElementById('app');

      if (!currentUser) {
        appEl.className = 'app-login-mode';
        renderLoginView(appEl, this.authManager, () => this.renderMain());
        return;
      }

      if (currentUser.role === 'teacher') {
        appEl.className = 'app-teacher-mode';
        renderTeacherPortal(
          appEl, this.authManager, this.state,
          () => this.handleLogout(),
          () => {
            const users = this.authManager.getUsers();
            const studentA = users.find(u => u.username === 'liming' || u.email === 'studentA@jizhi.edu');
            if (studentA) {
              sessionStorage.setItem('jizhi_current_user', JSON.stringify(studentA));
              localStorage.setItem('jizhi_current_user', JSON.stringify(studentA));
              this.renderMain();
            }
          }
        );
      } else {
        const membersList = Object.values(this.state.members || {});
        appEl.className = 'app-student-mode';
        appEl.innerHTML = `
          <header class="app-header" id="app-header"></header>
          <div class="main-content">
            <main class="canvas-panel" id="canvas-panel"></main>
            <aside class="chat-panel">
              <div class="chat-header">
                <div class="chat-title"><span>💬 多智能体协同对话管道 (全域云端实时同步 🟢)</span></div>
                <div class="active-agent-pills">
                  <span class="agent-pill" style="color:#a78bfa; border-color:#8b5cf6;">🎪 拍卖师</span>
                  <span class="agent-pill" style="color:#34d399; border-color:#10b981;">🤝 责任编辑</span>
                  <span class="agent-pill" style="color:#60a5fa; border-color:#3b82f6;">📝 审稿编辑</span>
                </div>
              </div>
              <div class="chat-stream" id="chat-stream"></div>
              <div class="at-mention-menu" id="at-mention-menu" style="display:none;">
                <div class="at-menu-header">👥 提示：选择需要 @ 的同学或 AI 智能体</div>
                <div class="at-menu-list">
                  <div class="at-group-title">👥 小组成员 (${membersList.length}人)</div>
                  ${membersList.map(m => `
                    <div class="at-item" data-mention="@${m.name}">
                      ${m.avatar || '👨‍🎓'} @${m.name} (${m.roleTitle || '组员'})
                    </div>
                  `).join('')}
                  <div class="at-group-title" style="margin-top:6px;">🤖 AI 学术智能体</div>
                  <div class="at-item agent" data-mention="@拍卖师 Agent">🎪 @拍卖师 Agent (选题与竞拍指导)</div>
                  <div class="at-item agent" data-mention="@责任编辑 Agent">🤝 @责任编辑 Agent (分工与过程学伴)</div>
                  <div class="at-item agent" data-mention="@审稿编辑 Agent">📝 @审稿编辑 Agent (学术结构与规范导师)</div>
                  <div class="at-item agent" data-mention="@中间委员 Agent">🟡 @中间委员 Agent (答辩裁决引导)</div>
                </div>
              </div>
              <div class="emoji-bar" id="emoji-bar">
                <span class="emoji-btn" data-emoji="😊">😊</span><span class="emoji-btn" data-emoji="😂">😂</span>
                <span class="emoji-btn" data-emoji="👍">👍</span><span class="emoji-btn" data-emoji="👏">👏</span>
                <span class="emoji-btn" data-emoji="🎉">🎉</span><span class="emoji-btn" data-emoji="💯">💯</span>
                <span class="emoji-btn" data-emoji="🔥">🔥</span><span class="emoji-btn" data-emoji="❤️">❤️</span>
                <span class="emoji-btn" data-emoji="📝">📝</span><span class="emoji-btn" data-emoji="💡">💡</span>
                <span class="emoji-btn" data-emoji="📚">📚</span><span class="emoji-btn" data-emoji="🔍">🔍</span>
                <span class="emoji-btn" data-emoji="📊">📊</span><span class="emoji-btn" data-emoji="🎓">🎓</span>
                <span class="emoji-btn" data-emoji="🎯">🎯</span><span class="emoji-btn" data-emoji="📌">📌</span>
                <span class="emoji-btn" data-emoji="❓">❓</span><span class="emoji-btn" data-emoji="🤔">🤔</span>
                <span class="emoji-btn" data-emoji="💬">💬</span><span class="emoji-btn" data-emoji="🤝">🤝</span>
                <span class="emoji-btn" data-emoji="✅">✅</span><span class="emoji-btn" data-emoji="⚠️">⚠️</span>
                <span class="emoji-btn" data-emoji="🚀">🚀</span><span class="emoji-btn" data-emoji="⚡">⚡</span>
              </div>
              <div class="chat-input-bar">
                <input type="text" class="chat-input modern-spacious-input" id="chat-input" placeholder="输入 @ 提及同学或智能体，或输入学术讨论..." autocomplete="off">
                <button class="send-btn modern-send-btn" id="send-btn" title="发送消息">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </aside>
          </div>
        `;

        this.initStudentEvents();
        this.renderStudentWorkspace();
        this.checkUnreadAnnouncements();
      }
    }

    checkUnreadAnnouncements() {
      const anns = this.authManager.getAnnouncements();
      const unread = anns.find(a => !a.readStatus || !a.readStatus['group_1']);
      if (unread) { setTimeout(() => this.showAnnouncementModal(unread), 800); }
    }

    showAnnouncementModal(targetAnn = null) {
      document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
      const anns = this.authManager.getAnnouncements();
      const ann = targetAnn || (anns.length > 0 ? anns[0] : null);
      if (!ann) { alert('📢 暂无新的课堂通知！'); return; }

      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="student-ann-modal-card">
          <div class="ann-modal-header">
            <div class="ann-header-left">
              <div class="ann-bell-icon">🔔</div>
              <div><div class="ann-badge-tag">📢 课堂即时教学广播通知</div><h3 class="ann-modal-title">${ann.title}</h3></div>
            </div>
            <button class="modal-close-btn" id="btn-close-ann-popup">✕</button>
          </div>
          <div class="ann-modal-body">
            <div class="ann-meta-bar">
              <span>发布教师: <b>${ann.author || '张教授'}</b></span>
              <span>关联任务: <b>${ann.taskTitle || '协作写作'}</b></span>
              <span>发布时间: <b>${ann.time}</b></span>
            </div>
            <div class="ann-content-box">${ann.content}</div>
            ${ann.attachment ? `
              <div class="ann-attachment-card">
                <div class="att-info">
                  <span class="att-icon">📎</span>
                  <div><div class="att-name">${ann.attachment.name}</div><div class="att-size">教学随附资源文件 (${ann.attachment.size})</div></div>
                </div>
                <button class="att-download-btn" id="btn-download-ann-file">📥 下载资源文件</button>
              </div>
            ` : ''}
          </div>
          <div class="ann-modal-footer">
            <button class="ann-confirm-btn" id="btn-read-confirm">✅ 我已阅读并确认 (自动同步至教师端追踪矩阵)</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => document.body.removeChild(modal);
      modal.querySelector('#btn-close-ann-popup').addEventListener('click', closeModal);
      const downloadBtn = modal.querySelector('#btn-download-ann-file');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          downloadFileBlob(ann.attachment.name);
        });
      }
      modal.querySelector('#btn-read-confirm').addEventListener('click', () => {
        this.authManager.markAnnouncementRead(ann.id, 'group_1');
        closeModal();
        this.renderStudentWorkspace();
      });
    }

    showQuestionnaireModal() {
      document.querySelectorAll('.modal-overlay').forEach(el => el.remove());
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="teacher-modal-card fancy-task-modal" style="width:580px; background:radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0f172a 80%); border:1px solid rgba(129,140,248,0.4); box-shadow:0 25px 60px rgba(0,0,0,0.7);">
          <div class="teacher-modal-header" style="background:linear-gradient(135deg, rgba(99,102,241,0.25), rgba(168,85,247,0.25)); border-bottom:1px solid rgba(255,255,255,0.12);">
            <div class="modal-header-title">
              <div class="modal-icon-badge" style="background:rgba(99,102,241,0.3); color:#a5b4fc; font-size:24px;">📋</div>
              <div>
                <div class="modal-tag-pill" style="background:rgba(16,185,129,0.2); color:#34d399; border:1px solid rgba(16,185,129,0.4);">🎉 终稿提交完成 · 最后一环评估</div>
                <h3 style="color:#f8fafc; font-size:18px; margin-top:2px;">《现代教育技术》期末协作学习与 AI 体验问卷</h3>
              </div>
            </div>
            <button class="modal-close-btn" id="btn-close-survey-modal">✕</button>
          </div>
          <div class="teacher-modal-body" style="padding:24px;">
            <div style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:16px; margin-bottom:20px; line-height:1.6; font-size:13px; color:#cbd5e1;">
              <b style="color:#38bdf8;">亲爱的研究者同学：</b><br>
              恭喜你们顺利完成了团队协作论文方案的撰写与答辩！为了持续改进人机协同写作平台的学习体验与 SSRL 共享调节效果，请全组每位成员点击下方链接完成匿名问卷填写。
            </div>

            <div style="background:linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15)); border:1px dashed rgba(168,85,247,0.4); border-radius:14px; padding:20px; text-align:center; margin-bottom:20px;">
              <div style="font-size:14px; font-weight:700; color:#c084fc; margin-bottom:8px;">🔗 课程官方评估问卷专属入口</div>
              <div style="font-size:12px; color:#94a3b8; margin-bottom:14px;">(点击下方按钮将前往第三方问卷平台)</div>
              <a href="https://www.wjx.cn/vm/jizhi_eval_2026.aspx" target="_blank" class="modal-btn submit" style="display:inline-flex; align-items:center; justify-content:center; gap:8px; background:linear-gradient(135deg, #6366f1, #8b5cf6); padding:12px 24px; font-size:14px; text-decoration:none; color:white; border-radius:10px; font-weight:700; box-shadow:0 8px 20px rgba(99,102,241,0.4);">
                🚀 跳转前往填写问卷 (问卷星入口) ↗
              </a>
              <div style="font-size:11px; color:#64748b; margin-top:12px;">问卷直达地址: <span style="color:#a5b4fc;">https://www.wjx.cn/vm/jizhi_eval_2026.aspx</span></div>
            </div>

            <div style="display:flex; align-items:center; gap:10px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:10px; padding:12px 16px;">
              <input type="checkbox" id="chk-survey-done" style="width:18px; height:18px; cursor:pointer;" ${localStorage.getItem('jizhi_survey_completed') === 'true' ? 'checked' : ''}>
              <label for="chk-survey-done" style="font-size:13px; font-weight:700; color:#34d399; cursor:pointer;">
                我已完成问卷填写与提交
              </label>
            </div>
          </div>
          <div class="teacher-modal-footer">
            <button class="modal-btn submit task-theme" id="btn-finish-survey" style="width:100%; font-size:14px; font-weight:700;">✅ 确认并返回项目归档查阅</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => modal.remove();
      modal.querySelector('#btn-close-survey-modal').addEventListener('click', closeModal);
      modal.querySelector('#chk-survey-done').addEventListener('change', (e) => {
        localStorage.setItem('jizhi_survey_completed', e.target.checked ? 'true' : 'false');
      });
      modal.querySelector('#btn-finish-survey').addEventListener('click', () => {
        closeModal();
        this.renderStudentWorkspace();
      });
    }

    handleLogout() { this.authManager.logout(); this.renderMain(); }

    switchToTeacherView() {
      const users = this.authManager.getUsers();
      const teacher = users.find(u => u.role === 'teacher') || users[0];
      sessionStorage.setItem('jizhi_current_user', JSON.stringify(teacher));
      localStorage.setItem('jizhi_current_user', JSON.stringify(teacher));
      this.renderMain();
    }

    initStudentEvents() {
      const input = document.getElementById('chat-input');
      const sendBtn = document.getElementById('send-btn');
      const emojiBar = document.getElementById('emoji-bar');
      const atMentionMenu = document.getElementById('at-mention-menu');
      if (!input || !sendBtn) return;

      if (emojiBar) {
        emojiBar.querySelectorAll('.emoji-btn').forEach(btn => {
          btn.addEventListener('click', () => { input.value += btn.dataset.emoji; input.focus(); });
        });
      }

      input.addEventListener('input', (e) => {
        const val = input.value;
        const lastChar = val.slice(-1);
        if (lastChar === '@' || (val.includes('@') && !val.includes(' '))) atMentionMenu.style.display = 'block';
        else if (!val.includes('@')) atMentionMenu.style.display = 'none';
      });

      atMentionMenu.querySelectorAll('.at-item').forEach(item => {
        item.addEventListener('click', () => {
          const mentionTag = item.dataset.mention;
          const lastAtIndex = input.value.lastIndexOf('@');
          if (lastAtIndex !== -1) input.value = input.value.substring(0, lastAtIndex) + mentionTag + ' ';
          else input.value += mentionTag + ' ';
          atMentionMenu.style.display = 'none';
          input.focus();
        });
      });

      const handleSend = () => {
        const text = input.value.trim();
        if (!text) return;
        const currentUser = this.authManager.getCurrentUser();
        const studentCode = currentUser ? (currentUser.studentCode || 'A') : 'A';
        const currentStage = this.state.currentStage;
        const msgObj = { sender: studentCode, text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        if (!this.state.chatLogs[currentStage]) this.state.chatLogs[currentStage] = [];
        this.state.chatLogs[currentStage].push(msgObj);
        input.value = '';
        atMentionMenu.style.display = 'none';
        this.studentMsgCountSinceLastAgent += 1;
        this.syncChatLogs();
        renderChat(this.state);
        this.triggerAgentReplyIfNeeded(text);
      };

      sendBtn.addEventListener('click', handleSend);
      input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });
    }

    triggerAgentReplyIfNeeded(userMsg) {
      const isExplicitMention = userMsg.includes('@');
      const isMilestoneKeyword = userMsg.includes('分工') || userMsg.includes('确定') || userMsg.includes('结论') || userMsg.includes('方案') || userMsg.includes('意见');
      const hasEnoughDiscussion = this.studentMsgCountSinceLastAgent >= 3;
      if (!isExplicitMention && !isMilestoneKeyword && !hasEnoughDiscussion) return;

      setTimeout(() => {
        const stage = this.state.currentStage;
        let replyAgent = 'reviewingEditor';
        let replyText = '';

        if (userMsg.includes('@中间委员') || userMsg.includes('@中间委员 Agent')) {
          replyAgent = 'neutral';
          replyText = `🟡 【中间委员裁决引导】：收到关注！请团队针对正反方意见做权衡：对于评价焦虑，可通过强调“过程提示”进行辩护；对于量表维度，建议在第四章补充行为与情感投入维度，提高测量完整性！`;
        } else if (userMsg.includes('@审稿编辑') || userMsg.includes('@审稿编辑 Agent')) {
          replyAgent = 'reviewingEditor';
          replyText = `📝 【审稿编辑针对性指导】：收到你的求助问询！关于规范：必须确保“三、文献综述”中提出的学术概念与“四、研究设计与方法”中的测量量表实现 1 对 1 精确匹配！`;
        } else if (userMsg.includes('@责任编辑') || userMsg.includes('@责任编辑 Agent')) {
          replyAgent = 'managingEditor';
          replyText = `🤝 【责任编辑过程学伴回复】：收到 @ 呼叫！目前小组字数分配与协同节奏良好。如果个别组员遇到撰写卡顿，建议组长 A 在大文本框中先列出二级标题子纲。`;
        } else if (userMsg.includes('@拍卖师') || userMsg.includes('@拍卖师 Agent')) {
          replyAgent = 'auctioneer';
          replyText = `🎪 【拍卖师选题顾问回复】：收到 @ 呼叫！针对课题《协作学习中的“搭便车”现象》，建议将重点聚焦在“注意力分配可视化”作为干预中介变量！`;
        } else {
          if (stage === 'stage1') {
            replyAgent = 'auctioneer';
            replyText = `🎪 【拍卖师评估与总结】注意到组内已完成一轮关于选题与任务分工的讨论！建议组员在提案面板中投票并按键确认签署合作学术合约！`;
          } else if (stage === 'stage2') {
            replyAgent = 'reviewingEditor';
            replyText = `📝 【审稿编辑高阶引导】关注到组内针对大正文与文献框架的讨论。在研究设计章节，必须明确自变量（AI干预模式）与因变量（SSRL得分）之间的因果链条！`;
          } else if (stage === 'stage3') {
            replyAgent = 'neutral';
            replyText = `🟡 【中间委员裁决提示】针对辩护意见，请小组在左侧卡片中确认裁决，并切回写作大正文补充限定说明！`;
          }
        }

        this.studentMsgCountSinceLastAgent = 0;
        const agentMsgObj = { sender: replyAgent, text: replyText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        if (!this.state.chatLogs[stage]) this.state.chatLogs[stage] = [];
        this.state.chatLogs[stage].push(agentMsgObj);
        this.syncChatLogs();
        renderChat(this.state);
      }, 1200);
    }

    handleVoteCast(proposalId) {
      if (this.state.stage1.contract.isConfirmed || this.state.isFinalSubmitted) {
        alert('🔒 学术合作合约已签署锁定，不可再更改投票。');
        return;
      }
      const user = this.state.currentUser;
      const s1 = this.state.stage1;
      if (s1.hasVoted && s1.hasVoted[user]) { alert('⚠️ 投票已被锁定！每位成员首次投票后不能再修改选项。'); return; }
      if (!s1.hasVoted) s1.hasVoted = {};
      s1.votes[user] = proposalId;
      s1.hasVoted[user] = true;
      const proposal = s1.proposals.find(p => p.id === proposalId);
      const totalMembersCount = Object.keys(this.state.members).length;
      const votesCastCount = Object.values(s1.hasVoted).filter(Boolean).length;
      const voteMsg = { sender: user, text: `📢 [投票告知]: 我已确认投票支持提案《${proposal ? proposal.title : proposalId}》！（当前全组已集齐 ${votesCastCount}/${totalMembersCount} 票）`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      this.state.chatLogs.stage1.push(voteMsg);
      this.syncStage1();
      this.syncChatLogs();
      if (votesCastCount >= totalMembersCount) {
        setTimeout(() => {
          const tally = {};
          Object.values(s1.votes).forEach(pId => { if (pId) tally[pId] = (tally[pId] || 0) + 1; });
          let summaryText = '🎪 【拍卖师宣布最终计票结果】：全员投票已完毕！\n';
          s1.proposals.forEach(p => { summaryText += `• 《${p.title}》得票: ${tally[p.id] || 0} 票\n`; });
          summaryText += `\n🔨 结果表明：《搭便车干预》高票胜出！注意，建议将“注意力分配视角”融入最终主题中，请组员讨论并更新合作卡片！`;
          const summaryMsg = { sender: 'auctioneer', text: summaryText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          this.state.chatLogs.stage1.push(summaryMsg);
          this.syncChatLogs();
          renderChat(this.state);
        }, 1000);
      }
      this.renderStudentWorkspace();
    }

    switchStage(newStage) {
      this.state.currentStage = newStage;
      this.syncStageChange(newStage);
      this.renderStudentWorkspace();
    }

    setSpeed(newSpeed) {
      this.state.timer.speed = newSpeed;
      const currentUser = this.authManager.getCurrentUser();
      renderHeader(this.state, currentUser, this.authManager.getAnnouncements(), (s) => this.switchStage(s), (sp) => this.setSpeed(sp), () => this.handleLogout(), () => this.switchToTeacherView(), () => this.showAnnouncementModal(), () => this.showQuestionnaireModal());
    }

    renderStudentWorkspace() {
      const currentUser = this.authManager.getCurrentUser();
      const currentGroupId = currentUser && currentUser.groupId ? currentUser.groupId : 'group_1';

      // Load dynamic group members configured by teacher for this group
      const teacherMembers = this.authManager.getGroupMembersForWorkspace(currentGroupId);
      if (teacherMembers && Object.keys(teacherMembers).length > 0) {
        this.state.members = teacherMembers;
      }

      this.state.currentUser = currentUser ? (currentUser.studentCode || 'A') : 'A';

      renderHeader(this.state, currentUser, this.authManager.getAnnouncements(), (s) => this.switchStage(s), (sp) => this.setSpeed(sp), () => this.handleLogout(), () => this.switchToTeacherView(), () => this.showAnnouncementModal(), () => this.showQuestionnaireModal());

      renderCanvas(this.state, {
        onVote: (propId) => { this.handleVoteCast(propId); },
        onRefresh: () => { this.renderStudentWorkspace(); },
        onContractChange: () => {
          this.syncStage1();
        },
        onAddMember: () => {
          const memberCount = Object.keys(this.state.members).length;
          const nextLetter = String.fromCharCode(65 + memberCount);
          const name = prompt(`请输入新增加的小组成员姓名 (例如: 赵强/学生${nextLetter}):`, `赵强 (学生${nextLetter})`);
          if (name) {
            const mId = nextLetter;
            const colors = ['#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#10b981'];
            const chosenColor = colors[(memberCount - 3) % colors.length] || '#ec4899';
            this.state.members[mId] = {
              id: mId,
              name,
              roleTitle: '组员',
              avatar: '🧑‍🎓',
              color: chosenColor,
              studentCode: mId
            };
            if (!this.state.stage1.contract.taskAssignments) this.state.stage1.contract.taskAssignments = {};
            this.state.stage1.contract.taskAssignments[mId] = '负责撰写拓展章节与资料整理';

            if (!this.state.stage1.contract.confirmedMembers) this.state.stage1.contract.confirmedMembers = {};
            this.state.stage1.contract.confirmedMembers[mId] = false;

            if (!this.state.stage1.votes) this.state.stage1.votes = {};
            if (!this.state.stage1.hasVoted) this.state.stage1.hasVoted = {};
            this.state.stage1.votes[mId] = null;
            this.state.stage1.hasVoted[mId] = false;

            this.syncStage1();
            this.renderStudentWorkspace();
          }
        },
        onRemoveMember: (mId) => {
          if (Object.keys(this.state.members).length <= 2) {
            alert('⚠️ 小组人数不能少于 2 人。');
            return;
          }
          if (confirm(`确认移除小组成员 ${this.state.members[mId] ? this.state.members[mId].name : mId}？`)) {
            delete this.state.members[mId];
            if (this.state.stage1.contract.taskAssignments) delete this.state.stage1.contract.taskAssignments[mId];
            if (this.state.stage1.contract.confirmedMembers) delete this.state.stage1.contract.confirmedMembers[mId];
            if (this.state.stage1.votes) delete this.state.stage1.votes[mId];
            if (this.state.stage1.hasVoted) delete this.state.stage1.hasVoted[mId];
            this.syncStage1();
            this.renderStudentWorkspace();
          }
        },
        onConfirmContract: () => {
          if (this.state.stage1.contract.isConfirmed) {
            alert('🔒 学术合作合约已被全员确认签署并锁定！无法二次修改。');
            return;
          }
          const user = this.state.currentUser;
          const s1 = this.state.stage1;
          const totalMembersCount = Object.keys(this.state.members).length;
          if (!s1.contract.confirmedMembers) s1.contract.confirmedMembers = {};
          s1.contract.confirmedMembers[user] = true;
          const confirmedCount = Object.values(this.state.members).filter(m => s1.contract.confirmedMembers[m.id]).length;
          const memberName = this.state.members[user] ? this.state.members[user].name : user;
          const confirmMsg = { sender: user, text: `📢 [合约签署告知]: 我 (${memberName}) 已按键确认签署合作学术合约！（全组确认进度: ${confirmedCount}/${totalMembersCount} 人）`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          this.state.chatLogs.stage1.push(confirmMsg);
          this.syncStage1();
          this.syncChatLogs();
          if (confirmedCount < totalMembersCount) {
            alert(`✅ 你 (${memberName}) 已成功按键确认签署合约！\n\n目前组内签署进度：${confirmedCount}/${totalMembersCount} 人。\n需全组 ${totalMembersCount} 名成员全部按键确认后方可解锁阶段二！`);
          } else {
            s1.contract.isConfirmed = true;
            this.syncStage1();
            this.syncStageChange('stage2');
            setTimeout(() => {
              const finalMsg = { sender: 'auctioneer', text: `🎪 【拍卖师宣布】：恭喜！组内全员 ${totalMembersCount}/${totalMembersCount} 名成员已全部完成按键确认签署！学术合作合约正式生效并锁定，阶段一圆满结束，系统自动解锁【阶段二：学术编辑部】！`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
              this.state.chatLogs.stage1.push(finalMsg);
              this.syncChatLogs();
              alert(`🎉 恭喜！组内 ${totalMembersCount} 位成员全部完成按键确认签署！学术合作合约生效并锁定，系统解锁【阶段二：学术编辑部】！`);
              this.switchStage('stage2');
            }, 600);
          }
          this.renderStudentWorkspace();
        },
        onUnifiedContentChange: (newContent) => {
          if (this.state.isFinalSubmitted) return;
          this.state.stage2.unifiedContent = newContent;
          let total = newContent.length || 1;
          const members = Object.keys(this.state.members);
          const baseContribs = [42, 31, 27, 20, 15];
          let totalWeight = 0;
          members.forEach((mId, idx) => { totalWeight += (baseContribs[idx] || 20); });
          const contribs = {};
          members.forEach((mId, idx) => {
            const weight = baseContribs[idx] || 20;
            const pct = Math.round((weight / totalWeight) * 100);
            const words = Math.round(total * (weight / totalWeight));
            contribs[mId] = { words, percentage: pct };
          });
          this.state.stage2.memberContributions = contribs;
          this.syncStage2();
        },
        onOpenCaseModal: () => {
          downloadFileBlob('编辑会议规范与范例模板文件.pdf');
        },
        onOpenMeetingModal: () => { 
          if (this.state.currentStage === 'stage3' || this.state.isFinalSubmitted) {
            alert('🔒 阶段二半程编辑会议已结束并归档，不可再次发起。你可随时查阅已锁定的【半程编辑修正清单】！');
            return;
          }
          this.showMeetingModal(); 
        },
        onSwitchStage3Tab: (tabKey) => {
          this.state.stage3.activeTab = tabKey;
          this.syncStage3();
          this.renderStudentWorkspace();
        },
        onOpenSurveyModal: () => {
          this.showQuestionnaireModal();
        },
        onDiscussItem: (id) => {
          if (this.state.isFinalSubmitted) {
            alert('🔒 论文终稿已提交，处于全盘只读归档模式！无法再修改研讨结论。');
            return;
          }
          const items = this.state.stage3.feedbackItems;
          const currentIndex = items.findIndex(f => f.id === id);
          const item = items[currentIndex];

          if (item) {
            const resp = prompt(`请代表小组输入针对【${item.title}】的统一裁决方案与修改结论：`, item.response || '已在正文第四章补充限制条件，并扩充情绪与行为投入维度。');
            if (resp) {
              item.status = 'adopted';
              item.response = resp;
              const currentStage = this.state.currentStage;
              const currentUser = this.state.currentUser;
              const discMsg = {
                sender: currentUser,
                text: `📢 [答辩质询研讨结论]: 组内已对质询点 ${currentIndex + 1}【${item.title}】完成裁决并达成共识：“${resp}”！`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              };
              if (!this.state.chatLogs[currentStage]) this.state.chatLogs[currentStage] = [];
              this.state.chatLogs[currentStage].push(discMsg);

              const nextItem = items[currentIndex + 1];

              setTimeout(() => {
                if (nextItem) {
                  const stepNum = currentIndex + 2;
                  const totalSteps = items.length;
                  const neutralMsg = {
                    sender: 'neutral',
                    text: `🟡 【中间委员·第${currentIndex + 1}条已归档 ➔ 开启第${stepNum}条引导 (${stepNum}/${totalSteps})】\n已成功记录第${currentIndex + 1}条裁决结论：“${resp}”！\n\n👉 **接下来请研讨第 ${stepNum} 条质询**【${nextItem.speaker}: ${nextItem.title}】：\n${nextItem.neutralGuidance}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  };
                  this.state.chatLogs[currentStage].push(neutralMsg);
                } else {
                  const finalNeutralMsg = {
                    sender: 'neutral',
                    text: `🎉 【中间委员·全员答辩裁决完毕】恭喜！组内已完成答辩委员会所有 3 条质询与建议的研讨与裁决！\n请团队点击上方【返回协作写作大正文】按钮，将裁决结论落实至论文终稿后提交！`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  };
                  this.state.chatLogs[currentStage].push(finalNeutralMsg);
                }
                this.syncStage3();
                this.syncChatLogs();
                renderChat(this.state);
              }, 800);

              this.syncStage3();
              this.syncChatLogs();
              this.renderStudentWorkspace();
            }
          }
        },
        onFinalSubmit: () => { 
          if (this.state.isFinalSubmitted) {
            alert('🔒 论文终稿已于此前成功提交！目前处于全盘只读归档模式，可随时切页查阅各阶段记录。');
            return;
          }
          const confirmSub = confirm('🚀 确认提交《协作学习中的“搭便车”现象：基于注意力分配与AI感知视角》期末论文终稿？\n\n提交后全篇论文与研讨矩阵将锁定归档不可再修改，提交后将弹窗引导进入课程评估问卷！');
          if (confirmSub) {
            this.state.isFinalSubmitted = true;
            const currentStage = this.state.currentStage;
            const currentUser = this.state.currentUser;
            const submitMsg = {
              sender: currentUser,
              text: `🎉 【期末论文终稿成功提交告知】全组已完成论文终稿与答辩质询归档，方案已锁定并提交至教师端！大家可以随时返回各阶段查阅！`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            if (!this.state.chatLogs[currentStage]) this.state.chatLogs[currentStage] = [];
            this.state.chatLogs[currentStage].push(submitMsg);

            const neutralFinalMsg = {
              sender: 'neutral',
              text: `🏆 【中间委员 Agent 祝贺】热烈祝贺小组圆满完成本期写作任务与答辩！终稿已全盘锁入云端归档库。`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            this.state.chatLogs[currentStage].push(neutralFinalMsg);

            this.syncStage3();
            this.syncChatLogs();
            this.renderStudentWorkspace();
            setTimeout(() => {
              this.showQuestionnaireModal();
            }, 600);
          }
        }
      });

      renderChat(this.state);
    }

    showMeetingModal() {
      const modal = document.createElement('div');
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="teacher-modal-card" style="width:620px;">
          <div class="teacher-modal-header ann-theme">
            <div class="modal-header-title"><span class="modal-icon">📢</span><div><h3>学术编辑部【半程编辑会议】</h3><p>共享调节 3 维评价与半程修正清单生成</p></div></div>
            <button class="modal-close-btn" id="btn-close-meeting">✕</button>
          </div>
          <div class="teacher-modal-body">
            <div style="background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3); border-radius:10px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
              <div><div style="font-size:13px; font-weight:700; color:#a5b4fc;">📎 审稿编辑推送范例文件:</div><div style="font-size:12px; color:#cbd5e1;">《编辑会议规范与范例模板文件.pdf》 (1.8 MB)</div></div>
              <button id="btn-download-case-file" style="background:var(--accent-indigo); border:none; color:white; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer;">📥 下载范例文件</button>
            </div>
            <div class="teacher-form-group" style="margin-top:12px;">
              <label style="font-size:13px; font-weight:700;">🌟 维度 ①：内容逻辑与学术严谨度打分 (点击星级打分)</label>
              <div class="rating-stars" id="star-rating-logic" style="margin:6px 0; font-size:24px; cursor:pointer; user-select:none;">
                <span class="star" data-val="1" style="color:#f59e0b;">★</span>
                <span class="star" data-val="2" style="color:#f59e0b;">★</span>
                <span class="star" data-val="3" style="color:#f59e0b;">★</span>
                <span class="star" data-val="4" style="color:#f59e0b;">★</span>
                <span class="star" data-val="5" style="color:#475569;">★</span>
              </div>
            </div>
            <div class="teacher-form-group">
              <label style="font-size:13px; font-weight:700;">👥 维度 ②：团队分工与参与平衡度打分 (点击星级打分)</label>
              <div class="rating-stars" id="star-rating-balance" style="margin:6px 0; font-size:24px; cursor:pointer; user-select:none;">
                <span class="star" data-val="1" style="color:#f59e0b;">★</span>
                <span class="star" data-val="2" style="color:#f59e0b;">★</span>
                <span class="star" data-val="3" style="color:#f59e0b;">★</span>
                <span class="star" data-val="4" style="color:#f59e0b;">★</span>
                <span class="star" data-val="5" style="color:#f59e0b;">★</span>
              </div>
            </div>
            <div class="teacher-form-group">
              <label style="font-size:13px; font-weight:700;">⚠️ 维度 ③：当前组内面临的最大难点瓶颈</label>
              <select id="meeting-bottleneck-select" class="teacher-input">
                <option value="假设与研究设计工具对应不明确">假设与研究设计工具对应不明确</option>
                <option value="相关文献支撑力度不足">相关文献支撑力度不足</option>
                <option value="时间分配紧张，进度滞后">时间分配紧张，进度滞后</option>
                <option value="章节之间过渡衔接缺乏逻辑">章节之间过渡衔接缺乏逻辑</option>
              </select>
            </div>
            <div class="teacher-form-group">
              <label style="font-size:13px; font-weight:700;">✍️ 组内自评与补充修正说明</label>
              <textarea id="meeting-input-text" class="teacher-textarea" style="min-height:80px;" placeholder="请输入组内自我检讨或需要审稿编辑解答的问题...">背景与问题部分已完成，请审稿编辑评价假设与方法的衔接。</textarea>
            </div>
          </div>
          <div class="teacher-modal-footer">
            <button class="modal-btn cancel" id="btn-cancel-meeting">取消</button>
            <button class="modal-btn submit ann-theme" id="btn-submit-meeting">🚀 提交打分并生成【半程编辑修正清单】</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      const closeModal = () => document.body.removeChild(modal);
      modal.querySelector('#btn-close-meeting').addEventListener('click', closeModal);
      modal.querySelector('#btn-cancel-meeting').addEventListener('click', closeModal);

      modal.querySelector('#btn-download-case-file').addEventListener('click', () => {
        downloadFileBlob('编辑会议规范与范例模板文件.pdf');
      });

      let logicRating = 4;
      let balanceRating = 5;

      modal.querySelectorAll('#star-rating-logic .star').forEach(s => {
        s.addEventListener('click', (e) => {
          logicRating = Number(e.target.dataset.val);
          modal.querySelectorAll('#star-rating-logic .star').forEach(st => {
            const v = Number(st.dataset.val);
            st.style.color = v <= logicRating ? '#f59e0b' : '#475569';
          });
        });
      });

      modal.querySelectorAll('#star-rating-balance .star').forEach(s => {
        s.addEventListener('click', (e) => {
          balanceRating = Number(e.target.dataset.val);
          modal.querySelectorAll('#star-rating-balance .star').forEach(st => {
            const v = Number(st.dataset.val);
            st.style.color = v <= balanceRating ? '#f59e0b' : '#475569';
          });
        });
      });

      modal.querySelector('#btn-submit-meeting').addEventListener('click', () => {
        const bottleneck = modal.querySelector('#meeting-bottleneck-select').value;
        const userText = modal.querySelector('#meeting-input-text').value;
        closeModal();

        this.state.stage2.actionPlan = {
          isGenerated: true,
          items: [
            `修订项① (逻辑与方法): 在“二、研究问题与假设”末尾补齐与“四、研究设计”操作化变量的对应说明。`,
            `修订项② (瓶颈突破): 针对【${bottleneck}】，参照《编辑会议规范与范例模板文件.pdf》补充相关文献引用。`,
            `修订项③ (团队协调): 维持当前平衡贡献 (A:42%, B:31%, C:27%)，在后45分钟内重点完成“五、反思”。`
          ]
        };

        const meetingMsg = { sender: 'managingEditor', text: `📢 【编辑会议① 汇总】：全员完成 3 维打分（逻辑严谨度 ${logicRating}星，分工平衡度 ${balanceRating}星，核心瓶颈：${bottleneck}）。组员自评：“${userText}”。`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        this.state.chatLogs.stage2.push(meetingMsg);
        this.syncStage2();
        this.syncChatLogs();

        setTimeout(() => {
          const feedbackMsg = { sender: 'reviewingEditor', text: `📝 【审稿编辑深度反馈与范例指引】：结合《编辑会议规范与范例模板文件.pdf》中的标准指标，正文整体连贯。针对你们提出的瓶颈：“${bottleneck}”，系统已在锁定的半程清单中展现，请组员按清单逐项修正！`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
          this.state.chatLogs.stage2.push(feedbackMsg);
          this.syncChatLogs();
          renderChat(this.state);
          this.renderStudentWorkspace();
        }, 1200);

        renderChat(this.state);
        this.renderStudentWorkspace();
      });
    }
  }

  // Global Launch
  window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
  });
})();
