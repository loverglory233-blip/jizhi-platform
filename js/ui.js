/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * UI Renderer - Proposal Voting Lock & Status Display
 */

import { AgentProfiles } from './agents.js';

export function renderHeader(state, currentUser, announcements, onStageChange, onSpeedChange, onLogout, onSwitchTeacher, onOpenAnnModal) {
  const header = document.getElementById('app-header');
  const elapsedMin = Math.floor(state.timer.elapsedSeconds / 60);
  const remainingMin = Math.max(0, 150 - elapsedMin);
  const unreadAnnCount = announcements ? announcements.filter(a => !a.readStatus || !a.readStatus['group_1']).length : 0;

  header.innerHTML = `
    <div class="brand-section">
      <div class="brand-logo">集智 JIZHI</div>
      <div class="brand-badge">🎓 ${currentUser ? currentUser.name : '学生A'}</div>
    </div>

    <nav class="stage-nav">
      <button class="stage-btn ${state.currentStage === 'stage1' ? 'active' : ''}" data-stage="stage1">
        🎪 阶段一：学术拍卖会 (25m)
      </button>
      <button class="stage-btn ${state.currentStage === 'stage2' ? 'active' : ''}" data-stage="stage2">
        📰 阶段二：学术编辑部 (105m)
      </button>
      <button class="stage-btn ${state.currentStage === 'stage3' ? 'active' : ''}" data-stage="stage3">
        🎓 阶段三：答辩擂台 (20m)
      </button>
    </nav>

    <div class="header-controls">
      <button class="nav-ann-bell-btn ${unreadAnnCount > 0 ? 'has-unread' : ''}" id="btn-header-ann-bell" title="课堂通知">
        🔔 消息 ${unreadAnnCount > 0 ? `<span class="unread-count">${unreadAnnCount}</span>` : ''}
      </button>

      <div class="timer-box">
        ⏱️ ${remainingMin}m
      </div>

      <select class="speed-selector" id="speed-select" title="流速倍率">
        <option value="1" ${state.timer.speed === 1 ? 'selected' : ''}>1x</option>
        <option value="5" ${state.timer.speed === 5 ? 'selected' : ''}>5x</option>
        <option value="10" ${state.timer.speed === 10 ? 'selected' : ''}>10x</option>
      </select>

      <button id="btn-switch-teacher-view" class="header-icon-btn" title="切换至教师端">
        👩‍🏫 教师端
      </button>
      <button id="btn-user-logout" class="header-icon-btn logout" title="退出登录">
        退出
      </button>
    </div>
  `;

  header.querySelectorAll('.stage-btn').forEach(btn => {
    btn.addEventListener('click', () => onStageChange(btn.dataset.stage));
  });

  const speedSelect = header.querySelector('#speed-select');
  speedSelect.addEventListener('change', (e) => onSpeedChange(Number(e.target.value)));

  header.querySelector('#btn-user-logout').addEventListener('click', () => onLogout());
  header.querySelector('#btn-switch-teacher-view').addEventListener('click', () => onSwitchTeacher());
  header.querySelector('#btn-header-ann-bell').addEventListener('click', () => onOpenAnnModal());
}

export function renderCanvas(state, handlers) {
  const canvas = document.getElementById('canvas-panel');

  if (state.currentStage === 'stage1') {
    renderStage1Canvas(canvas, state, handlers);
  } else if (state.currentStage === 'stage2') {
    renderStage2Canvas(canvas, state, handlers);
  } else if (state.currentStage === 'stage3') {
    renderStage3Canvas(canvas, state, handlers);
  }
}

function renderStage1Canvas(canvas, state, handlers) {
  const s1 = state.stage1;
  const currentUser = state.currentUser;
  const userHasVoted = s1.hasVoted && s1.hasVoted[currentUser];
  const userVotedProposalId = s1.votes[currentUser];

  // Count total votes cast so far
  const totalVotesCast = Object.values(s1.hasVoted || {}).filter(Boolean).length;

  canvas.innerHTML = `
    <div class="card">
      <div class="card-title">
        <span>💡 竞拍提案面板 (观点+理由)</span>
        <div style="font-size:12px; color:#38bdf8;">
          📊 组内投票进度: <b>${totalVotesCast}/3 人已投票</b> ${userHasVoted ? '<span style="color:#4ade80; margin-left:6px;">(你的投票已锁定)</span>' : ''}
        </div>
      </div>

      <div class="proposals-grid">
        ${s1.proposals.map(p => {
          const isThisVoted = userVotedProposalId === p.id;
          let btnText = '投票支持此提案';
          let btnClass = 'vote-btn';

          if (userHasVoted) {
            if (isThisVoted) {
              btnText = '🔒 已投此提案 (已锁定)';
              btnClass = 'vote-btn active locked';
            } else {
              btnText = '不可修改投票';
              btnClass = 'vote-btn disabled';
            }
          }

          return `
            <div class="proposal-card ${isThisVoted ? 'voted' : ''}">
              <div class="proposal-header">
                <div class="proposal-title">💡 观点: ${p.title}</div>
                <span class="proposal-tag">${p.category}</span>
              </div>
              <div style="font-size:12px; color:#cbd5e1; margin-bottom:8px; background:rgba(15,23,42,0.6); padding:6px; border-radius:4px;">
                <b>理由依据:</b> ${p.rationale}
              </div>
              <div class="metrics-row">
                <span>文献: <b>${p.metrics.literature}</b></span>
                <span>新意: <b>${p.metrics.innovation}</b></span>
                <span>风险: <b>${p.metrics.risk}</b></span>
              </div>
              <button class="${btnClass}" data-id="${p.id}" ${userHasVoted ? 'disabled' : ''}>
                ${btnText}
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Editable Contract Card Section -->
    <div class="contract-card">
      <div class="contract-header">📜 合作学术合约卡片 (提取后学生可修改 & 全员确认)</div>
      
      <div style="font-weight:700; margin-bottom:12px; color:#e2e8f0;">
        确定研究主题: <input type="text" id="contract-topic-input" value="${s1.mergedTitle}" style="width:75%; background:rgba(15,23,42,0.8); border:1px solid #475569; color:#38bdf8; padding:4px 8px; border-radius:4px; font-weight:700;">
      </div>

      <div class="contract-grid">
        <div>
          <div style="font-weight:600; color:#a78bfa; margin-bottom:6px;">⏱️ 150分钟时间分配预估 (分钟):</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:12px; color:#cbd5e1;">
            <label>背景: <input type="number" class="contract-time-input" data-key="background" value="${s1.contract.timeAllocations.background}" style="width:45px; background:#0f172a; color:white; border:1px solid #475569; border-radius:4px; text-align:center;"></label>
            <label>问题: <input type="number" class="contract-time-input" data-key="questions" value="${s1.contract.timeAllocations.questions}" style="width:45px; background:#0f172a; color:white; border:1px solid #475569; border-radius:4px; text-align:center;"></label>
            <label>文献: <input type="number" class="contract-time-input" data-key="literature" value="${s1.contract.timeAllocations.literature}" style="width:45px; background:#0f172a; color:white; border:1px solid #475569; border-radius:4px; text-align:center;"></label>
            <label>方法: <input type="number" class="contract-time-input" data-key="method" value="${s1.contract.timeAllocations.method}" style="width:45px; background:#0f172a; color:white; border:1px solid #475569; border-radius:4px; text-align:center;"></label>
            <label>反思: <input type="number" class="contract-time-input" data-key="reflection" value="${s1.contract.timeAllocations.reflection}" style="width:45px; background:#0f172a; color:white; border:1px solid #475569; border-radius:4px; text-align:center;"></label>
            <label>文献表: <input type="number" class="contract-time-input" data-key="references" value="${s1.contract.timeAllocations.references}" style="width:45px; background:#0f172a; color:white; border:1px solid #475569; border-radius:4px; text-align:center;"></label>
          </div>
        </div>

        <div>
          <div style="font-weight:600; color:#a78bfa; margin-bottom:6px;">👥 成员具体分工编辑:</div>
          <div style="display:flex; flex-direction:column; gap:4px; font-size:12px;">
            <label><b>A (组长)</b>: <input type="text" id="task-a-input" value="${s1.contract.taskAssignments.A}" style="width:75%; background:#0f172a; color:white; border:1px solid #475569; border-radius:4px; padding:2px 6px;"></label>
            <label><b>B (张同学)</b>: <input type="text" id="task-b-input" value="${s1.contract.taskAssignments.B}" style="width:75%; background:#0f172a; color:white; border:1px solid #475569; border-radius:4px; padding:2px 6px;"></label>
            <label><b>C (李同学)</b>: <input type="text" id="task-c-input" value="${s1.contract.taskAssignments.C}" style="width:75%; background:#0f172a; color:white; border:1px solid #475569; border-radius:4px; padding:2px 6px;"></label>
          </div>
        </div>
      </div>

      <div style="margin-top:16px; text-align:center;">
        <button id="btn-confirm-contract" style="background:linear-gradient(135deg, #10b981, #059669); border:none; color:white; padding:10px 24px; border-radius:8px; font-weight:700; cursor:pointer; font-size:14px;">
          ✅ 全员统一确认签署合约并解锁写作
        </button>
      </div>
    </div>
  `;

  canvas.querySelectorAll('.vote-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => handlers.onVote(btn.dataset.id));
  });

  canvas.querySelector('#btn-confirm-contract').addEventListener('click', () => handlers.onConfirmContract());
}

function renderStage2Canvas(canvas, state, handlers) {
  const s2 = state.stage2;

  canvas.innerHTML = `
    <div class="card" style="height:100%; display:flex; flex-direction:column;">
      <div class="card-title">
        <span>📝 统一协作写作长文档大文本框 (大正文一同协作)</span>
        <div style="display:flex; gap:10px;">
          <button id="btn-show-case" style="background:rgba(59,130,246,0.2); border:1px solid #3b82f6; color:#93c5fd; padding:4px 10px; border-radius:6px; font-size:12px; cursor:pointer;">
            📖 查看优秀案例库
          </button>
          <button id="btn-trigger-meeting" style="background:linear-gradient(135deg, #10b981, #059669); border:none; color:white; padding:4px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600;">
            📢 发起【编辑会议】
          </button>
        </div>
      </div>

      <div style="flex:1; margin-top:4px; display:flex; flex-direction:column; gap:6px;">
        <div style="font-size:12px; color:#94a3b8; display:flex; justify-content:space-between;">
          <span>包含模块: 一、背景 | 二、研究问题 | 三、文献 | 四、研究设计 | 五、反思 | 六、参考文献</span>
          <span>整篇实时字数: <b>${s2.unifiedContent.length}</b> 字</span>
        </div>
        
        <textarea class="editor-textarea unified-large-editor" id="main-unified-editor" style="height:360px; font-size:14px; line-height:1.7;">${s2.unifiedContent}</textarea>
      </div>

      <div style="margin-top:14px; background:rgba(15,23,42,0.6); padding:12px; border-radius:8px; border:1px solid var(--border-glass);">
        <div style="font-size:12px; font-weight:600; margin-bottom:8px; color:#cbd5e1; display:flex; justify-content:space-between;">
          <span>📊 小组贡献度统计 (群体感知监控)</span>
          <span>目前总字数: ${s2.unifiedContent.length} 字</span>
        </div>

        <div class="contribution-bar-container">
          <div class="contrib-bars">
            <div class="contrib-segment" style="width:${s2.memberContributions.A.percentage}%; background:#6366f1;"></div>
            <div class="contrib-segment" style="width:${s2.memberContributions.B.percentage}%; background:#06b6d4;"></div>
            <div class="contrib-segment" style="width:${s2.memberContributions.C.percentage}%; background:#f59e0b;"></div>
          </div>
          <div style="display:flex; justify-content:space-around; font-size:11px; color:#94a3b8; margin-top:4px;">
            <span style="color:#818cf8;">● A (组长): ${s2.memberContributions.A.percentage}%</span>
            <span style="color:#22d3ee;">● B (张同学): ${s2.memberContributions.B.percentage}%</span>
            <span style="color:#fbbf24;">● C (李同学): ${s2.memberContributions.C.percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const textarea = canvas.querySelector('#main-unified-editor');
  textarea.addEventListener('input', (e) => handlers.onUnifiedContentChange(e.target.value));

  canvas.querySelector('#btn-show-case').addEventListener('click', () => handlers.onOpenCaseModal());
  canvas.querySelector('#btn-trigger-meeting').addEventListener('click', () => handlers.onOpenMeetingModal());
}

function renderStage3Canvas(canvas, state, handlers) {
  const s3 = state.stage3;

  canvas.innerHTML = `
    <div class="card">
      <div class="card-title">
        <span>🎓 答辩委员会改进意见清单 (组内裁决面板)</span>
        <span style="font-size:12px; color:#38bdf8;">答辩阶段</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        ${s3.feedbackItems.map(item => `
          <div style="background:rgba(15,23,42,0.6); padding:12px; border-radius:8px; border:1px solid ${item.role === 'opponent' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <span style="font-weight:700; color:${item.role === 'opponent' ? '#f87171' : '#4ade80'};">
                ${item.role === 'opponent' ? '🔴 质疑要点' : '🟢 肯定要点'}: ${item.title}
              </span>
              <span style="font-size:11px; padding:2px 8px; border-radius:10px; background:rgba(255,255,255,0.08);">
                状态: ${item.status === 'adopted' ? '✅ 已采纳优化' : item.status === 'acknowledged' ? '👍 已保留确认' : '⏳ 待讨论'}
              </span>
            </div>
            <div style="font-size:13px; color:#cbd5e1; margin-bottom:8px;">${item.content}</div>
            
            ${item.response ? `
              <div style="font-size:12px; color:#94a3b8; background:rgba(30,41,59,0.8); padding:8px; border-radius:6px; border-left:3px solid var(--accent-indigo);">
                <b>小组成员统一裁决回复:</b> ${item.response}
              </div>
            ` : `
              <button class="adopt-btn" data-id="${item.id}" style="background:var(--accent-indigo); border:none; color:white; padding:4px 10px; border-radius:4px; font-size:12px; cursor:pointer;">
                讨论并确认采纳修改
              </button>
            `}
          </div>
        `).join('')}
      </div>
    </div>

    <div class="card" style="margin-top:16px; background:linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.15)); border-color:rgba(16,185,129,0.3);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:700; font-size:16px; color:#34d399;">终稿提交与终极反思</div>
          <div style="font-size:12px; color:#94a3b8;">全员确认裁决后即可点击提交，报告自动呈递给教师端。</div>
        </div>
        <button id="btn-final-submit" style="background:linear-gradient(135deg, #10b981, #059669); border:none; color:white; padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer;">
          🚀 确认提交最终方案
        </button>
      </div>
    </div>
  `;

  canvas.querySelectorAll('.adopt-btn').forEach(btn => {
    btn.addEventListener('click', () => handlers.onAdoptFeedback(btn.dataset.id));
  });

  canvas.querySelector('#btn-final-submit').addEventListener('click', () => handlers.onFinalSubmit());
}

export function renderChat(state, onSendMessage) {
  const stream = document.getElementById('chat-stream');
  if (!stream) return;
  const logs = state.chatLogs[state.currentStage] || [];

  stream.innerHTML = logs.map(msg => {
    const isAgent = AgentProfiles[msg.sender] !== undefined;
    const profile = isAgent ? AgentProfiles[msg.sender] : state.members[msg.sender];
    const avatar = profile ? profile.avatar : '👤';
    const name = profile ? (profile.name || profile.roleTitle) : msg.sender;
    const color = profile ? profile.color : '#94a3b8';

    return `
      <div class="chat-message ${isAgent ? 'agent' : 'user'}">
        <div class="msg-avatar" style="background:${color}22; border:1px solid ${color}; color:${color};">
          ${avatar}
        </div>
        <div class="msg-body">
          <div class="msg-meta">
            <span class="msg-sender" style="color:${color};">${name}</span>
            <span style="font-size:10px; color:#64748b; margin-left:6px;">${msg.timestamp || ''}</span>
          </div>
          <div class="msg-bubble">${msg.text}</div>
        </div>
      </div>
    `;
  }).join('');

  stream.scrollTop = stream.scrollHeight;
}
