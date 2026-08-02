/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * UI Rendering and Component Handler
 */

import { AgentProfiles } from './agents.js';

export function renderHeader(state, onStageChange, onSpeedChange, onUserChange) {
  const header = document.getElementById('app-header');
  const elapsedMin = Math.floor(state.timer.elapsedSeconds / 60);
  const remainingMin = Math.max(0, 150 - elapsedMin);

  header.innerHTML = `
    <div class="brand-section">
      <div class="brand-logo">集智 JIZHI</div>
      <div class="brand-badge">SSRL 多智能体写作</div>
    </div>

    <div class="stage-nav">
      <button class="stage-btn ${state.currentStage === 'stage1' ? 'active' : ''}" data-stage="stage1">
        🎪 阶段一：学术拍卖会 (25m)
      </button>
      <button class="stage-btn ${state.currentStage === 'stage2' ? 'active' : ''}" data-stage="stage2">
        📰 阶段二：学术编辑部 (105m)
      </button>
      <button class="stage-btn ${state.currentStage === 'stage3' ? 'active' : ''}" data-stage="stage3">
        🎓 阶段三：答辩擂台 (20m)
      </button>
    </div>

    <div class="header-controls">
      <div class="timer-box">
        ⏱️ 剩余: ${remainingMin} 分钟
      </div>
      <select class="speed-selector" id="speed-select">
        <option value="1" ${state.timer.speed === 1 ? 'selected' : ''}>1x 正常流速</option>
        <option value="5" ${state.timer.speed === 5 ? 'selected' : ''}>5x 快进</option>
        <option value="10" ${state.timer.speed === 10 ? 'selected' : ''}>10x 演示模式</option>
      </select>
      <div class="user-switcher">
        <span style="font-size:11px; color:#94a3b8;">切换视角:</span>
        <button class="user-avatar-btn ${state.currentUser === 'A' ? 'active' : ''}" data-user="A">👨‍🎓 A</button>
        <button class="user-avatar-btn ${state.currentUser === 'B' ? 'active' : ''}" data-user="B">👩‍🎓 B</button>
        <button class="user-avatar-btn ${state.currentUser === 'C' ? 'active' : ''}" data-user="C">🧑‍🎓 C</button>
      </div>
    </div>
  `;

  // Attach Listeners
  header.querySelectorAll('.stage-btn').forEach(btn => {
    btn.addEventListener('click', () => onStageChange(btn.dataset.stage));
  });

  header.querySelectorAll('.user-avatar-btn').forEach(btn => {
    btn.addEventListener('click', () => onUserChange(btn.dataset.user));
  });

  const speedSelect = header.querySelector('#speed-select');
  speedSelect.addEventListener('change', (e) => onSpeedChange(Number(e.target.value)));
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
  const currentVote = s1.votes[state.currentUser];

  canvas.innerHTML = `
    <div class="card">
      <div class="card-title">
        <span>💡 竞拍提案面板 (提案与估值)</span>
        <span style="font-size:12px; font-weight:normal; color:#94a3b8;">当前提案数: ${s1.proposals.length}</span>
      </div>

      <div class="proposals-grid">
        ${s1.proposals.map(p => `
          <div class="proposal-card ${currentVote === p.id ? 'voted' : ''}">
            <div class="proposal-header">
              <div class="proposal-title">${p.title}</div>
              <span class="proposal-tag">${p.category}</span>
            </div>
            <div style="font-size:12px; color:#cbd5e1; margin-bottom:8px;">${p.rationale}</div>
            <div class="metrics-row">
              <span>文献: <b>${p.metrics.literature}</b></span>
              <span>新意: <b>${p.metrics.innovation}</b></span>
              <span>风险: <b>${p.metrics.risk}</b></span>
            </div>
            <button class="vote-btn ${currentVote === p.id ? 'active' : ''}" data-id="${p.id}">
              ${currentVote === p.id ? '✓ 已投票支持' : '投票此提案'}
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Contract Card Section -->
    <div class="contract-card">
      <div class="contract-header">📜 合作学术合约卡片 (全员签署生效)</div>
      
      <div style="font-weight:700; margin-bottom:12px; color:#e2e8f0;">
        核心研究主题: <span style="color:#38bdf8;">${s1.mergedTitle}</span>
      </div>

      <div class="contract-grid">
        <div>
          <div style="font-weight:600; color:#a78bfa; margin-bottom:6px;">⏱️ 150分钟时间分配预算:</div>
          <ul style="padding-left:18px; color:#cbd5e1;">
            <li>背景与意义: ${s1.contract.timeAllocations.background}m</li>
            <li>研究问题: ${s1.contract.timeAllocations.questions}m</li>
            <li>文献综述: ${s1.contract.timeAllocations.literature}m</li>
            <li>研究方法: ${s1.contract.timeAllocations.method}m</li>
            <li>不足与反思: ${s1.contract.timeAllocations.reflection}m</li>
            <li>参考文献: ${s1.contract.timeAllocations.references}m</li>
          </ul>
        </div>

        <div>
          <div style="font-weight:600; color:#a78bfa; margin-bottom:6px;">👥 成员任务具体分工:</div>
          <ul style="padding-left:18px; color:#cbd5e1;">
            <li><b>A (组长)</b>: ${s1.contract.taskAssignments.A.join('、')}</li>
            <li><b>B (张同学)</b>: ${s1.contract.taskAssignments.B.join('、')}</li>
            <li><b>C (李同学)</b>: ${s1.contract.taskAssignments.C.join('、')}</li>
          </ul>
        </div>
      </div>

      <div class="sign-status">
        <span class="sign-badge">✅ 学生A (已签署)</span>
        <span class="sign-badge">✅ 学生B (已签署)</span>
        <span class="sign-badge">✅ 学生C (已签署)</span>
      </div>
    </div>
  `;

  // Attach Vote Listener
  canvas.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', () => handlers.onVote(btn.dataset.id));
  });
}

function renderStage2Canvas(canvas, state, handlers) {
  const s2 = state.stage2;
  const activeSecKey = s2.activeSection;
  const activeSec = s2.docSections[activeSecKey];

  canvas.innerHTML = `
    <div class="card" style="height:100%; display:flex; flex-direction:column;">
      <div class="card-title">
        <span>📝 协作文档在线编辑器 (${activeSec.title})</span>
        <div style="display:flex; gap:10px;">
          <button id="btn-show-case" style="background:rgba(59,130,246,0.2); border:1px solid #3b82f6; color:#93c5fd; padding:4px 10px; border-radius:6px; font-size:12px; cursor:pointer;">
            📖 查看优秀案例库
          </button>
          <button id="btn-trigger-meeting" style="background:linear-gradient(135deg, #10b981, #059669); border:none; color:white; padding:4px 12px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600;">
            📢 发起【编辑会议】
          </button>
        </div>
      </div>

      <div class="doc-nav-tabs">
        ${Object.keys(s2.docSections).map(key => `
          <div class="doc-tab ${key === activeSecKey ? 'active' : ''}" data-key="${key}">
            ${s2.docSections[key].title}
          </div>
        `).join('')}
      </div>

      <div style="flex:1; margin-top:12px; display:flex; flex-direction:column; gap:10px;">
        <div style="font-size:12px; color:#94a3b8; display:flex; justify-content:space-between;">
          <span>负责成员: <b>${state.members[activeSec.assignedTo].name}</b></span>
          <span>预估时长: ${activeSec.targetTime}m</span>
        </div>
        
        <textarea class="editor-textarea" id="main-editor">${activeSec.content}</textarea>
      </div>

      <!-- Real-time Contribution Stats -->
      <div style="margin-top:14px; background:rgba(15,23,42,0.6); padding:12px; border-radius:8px; border:1px solid var(--border-glass);">
        <div style="font-size:12px; font-weight:600; margin-bottom:8px; color:#cbd5e1; display:flex; justify-space-between;">
          <span>📊 小组贡献度统计 (群体感知)</span>
          <span>总字数: ${s2.memberContributions.A.words + s2.memberContributions.B.words + s2.memberContributions.C.words} 字</span>
        </div>

        <div class="contribution-bar-container">
          <div class="contrib-bars">
            <div class="contrib-segment" style="width:${s2.memberContributions.A.percentage}%; background:#6366f1;"></div>
            <div class="contrib-segment" style="width:${s2.memberContributions.B.percentage}%; background:#06b6d4;"></div>
            <div class="contrib-segment" style="width:${s2.memberContributions.C.percentage}%; background:#f59e0b;"></div>
          </div>
          <div style="display:flex; justify-content:space-around; font-size:11px; color:#94a3b8; margin-top:4px;">
            <span style="color:#818cf8;">● A: ${s2.memberContributions.A.words}字 (${s2.memberContributions.A.percentage}%)</span>
            <span style="color:#22d3ee;">● B: ${s2.memberContributions.B.words}字 (${s2.memberContributions.B.percentage}%)</span>
            <span style="color:#fbbf24;">● C: ${s2.memberContributions.C.words}字 (${s2.memberContributions.C.percentage}%)</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach Listeners
  canvas.querySelectorAll('.doc-tab').forEach(tab => {
    tab.addEventListener('click', () => handlers.onSectionTabChange(tab.dataset.key));
  });

  const textarea = canvas.querySelector('#main-editor');
  textarea.addEventListener('input', (e) => handlers.onContentChange(activeSecKey, e.target.value));

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
            <div style="display:flex; justify-space-between; align-items:center; margin-bottom:6px;">
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

    <!-- Final Submission Card -->
    <div class="card" style="margin-top:16px; background:linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.15)); border-color:rgba(16,185,129,0.3);">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:700; font-size:16px; color:#34d399;">终稿提交与终极反思</div>
          <div style="font-size:12px; color:#94a3b8;">全员确认裁决后即可点击提交，并填写包含任务、过程、元认知的SSRL量表。</div>
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
          </div>
          <div class="msg-bubble">${msg.text}</div>
        </div>
      </div>
    `;
  }).join('');

  stream.scrollTop = stream.scrollHeight;
}
