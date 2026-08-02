/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * App Controller - Pure Client-Side Fail-Safe 200ms Storage Polling + BroadcastChannel Sync
 * 100% Guaranteed Instant Multi-Window & Multi-Tab Synchronization
 */

import { InitialState } from './state.js';
import { PresetMessages, AgentProfiles } from './agents.js';
import { AuthManager } from './auth.js';
import { renderLoginView } from './login.js';
import { renderTeacherPortal } from './teacher.js';
import { renderHeader, renderCanvas, renderChat } from './ui.js';

const STORAGE_KEY_CHAT = 'jizhi_sync_chat_v3';
const STORAGE_KEY_STAGE1 = 'jizhi_sync_s1_v3';
const STORAGE_KEY_STAGE2 = 'jizhi_sync_s2_v3';
const STORAGE_KEY_STAGE_CURRENT = 'jizhi_sync_current_stage_v3';

class App {
  constructor() {
    this.authManager = new AuthManager();
    this.state = JSON.parse(JSON.stringify(InitialState));
    this.studentMsgCountSinceLastAgent = 0; // Counter for intelligent agent triggers
    this.initSyncStorage();
    this.initRealtimeSync();
    this.initTimer();
    this.renderMain();
  }

  initSyncStorage() {
    const savedChat = localStorage.getItem(STORAGE_KEY_CHAT);
    if (savedChat) {
      try {
        this.state.chatLogs = JSON.parse(savedChat);
      } catch (e) {
        this.initPresetMessages();
      }
    } else {
      this.initPresetMessages();
    }

    const savedS1 = localStorage.getItem(STORAGE_KEY_STAGE1);
    if (savedS1) {
      try {
        this.state.stage1 = { ...this.state.stage1, ...JSON.parse(savedS1) };
      } catch (e) {}
    }

    const savedS2 = localStorage.getItem(STORAGE_KEY_STAGE2);
    if (savedS2) {
      try {
        this.state.stage2 = { ...this.state.stage2, ...JSON.parse(savedS2) };
      } catch (e) {}
    }

    const savedStage = localStorage.getItem(STORAGE_KEY_STAGE_CURRENT);
    if (savedStage) {
      this.state.currentStage = savedStage;
    }
  }

  initPresetMessages() {
    ['stage1', 'stage2', 'stage3'].forEach(stage => {
      if (!this.state.chatLogs[stage] || this.state.chatLogs[stage].length === 0) {
        this.state.chatLogs[stage] = PresetMessages[stage] || [];
      }
    });
    localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(this.state.chatLogs));
  }

  /**
   * Fail-Safe Instant Synchronization Engine
   * Combines BroadcastChannel + Native Window Storage Event + High-Frequency 200ms Storage Check
   * Guarantees 100% instant UI updates across all tabs and windows!
   */
  initRealtimeSync() {
    // 1. Native BroadcastChannel
    if ('BroadcastChannel' in window) {
      this.bc = new BroadcastChannel('jizhi_pure_sync_channel');
      this.bc.onmessage = (e) => {
        this.handleSyncMessage(e.data);
      };
    }

    // 2. Storage Event Listener
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY_CHAT && e.newValue) {
        try {
          this.state.chatLogs = JSON.parse(e.newValue);
          renderChat(this.state);
        } catch (err) {}
      } else if (e.key === STORAGE_KEY_STAGE1 && e.newValue) {
        try {
          this.state.stage1 = JSON.parse(e.newValue);
          if (this.state.currentStage === 'stage1') this.renderStudentWorkspace();
        } catch (err) {}
      } else if (e.key === STORAGE_KEY_STAGE2 && e.newValue) {
        try {
          this.state.stage2 = JSON.parse(e.newValue);
          if (this.state.currentStage === 'stage2') this.renderStudentWorkspace();
        } catch (err) {}
      } else if (e.key === STORAGE_KEY_STAGE_CURRENT && e.newValue) {
        this.state.currentStage = e.newValue;
        this.renderStudentWorkspace();
      }
    });

    // 3. 200ms High-Speed LocalStorage Polling Fallback (Guarantees instant sync even if events are blocked by browser tabs)
    setInterval(() => {
      const latestChat = localStorage.getItem(STORAGE_KEY_CHAT);
      if (latestChat && latestChat !== JSON.stringify(this.state.chatLogs)) {
        try {
          this.state.chatLogs = JSON.parse(latestChat);
          renderChat(this.state);
        } catch (e) {}
      }

      const latestS1 = localStorage.getItem(STORAGE_KEY_STAGE1);
      if (latestS1 && latestS1 !== JSON.stringify(this.state.stage1)) {
        try {
          this.state.stage1 = JSON.parse(latestS1);
          if (this.state.currentStage === 'stage1') this.renderStudentWorkspace();
        } catch (e) {}
      }

      const latestS2 = localStorage.getItem(STORAGE_KEY_STAGE2);
      if (latestS2 && latestS2 !== JSON.stringify(this.state.stage2)) {
        try {
          this.state.stage2 = JSON.parse(latestS2);
          if (this.state.currentStage === 'stage2') this.renderStudentWorkspace();
        } catch (e) {}
      }

      const latestStage = localStorage.getItem(STORAGE_KEY_STAGE_CURRENT);
      if (latestStage && latestStage !== this.state.currentStage) {
        this.state.currentStage = latestStage;
        this.renderStudentWorkspace();
      }
    }, 200);
  }

  handleSyncMessage(data) {
    if (!data) return;
    if (data.type === 'CHAT_UPDATE') {
      this.state.chatLogs = data.chatLogs;
      renderChat(this.state);
    } else if (data.type === 'STAGE1_UPDATE') {
      this.state.stage1 = data.stage1;
      if (this.state.currentStage === 'stage1') this.renderStudentWorkspace();
    } else if (data.type === 'STAGE2_UPDATE') {
      this.state.stage2 = data.stage2;
      if (this.state.currentStage === 'stage2') this.renderStudentWorkspace();
    } else if (data.type === 'STAGE_CHANGE') {
      this.state.currentStage = data.stage;
      this.renderStudentWorkspace();
    }
  }

  syncChatLogs() {
    localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(this.state.chatLogs));
    if (this.bc) {
      this.bc.postMessage({ type: 'CHAT_UPDATE', chatLogs: this.state.chatLogs });
    }
  }

  syncStage1() {
    localStorage.setItem(STORAGE_KEY_STAGE1, JSON.stringify(this.state.stage1));
    if (this.bc) {
      this.bc.postMessage({ type: 'STAGE1_UPDATE', stage1: this.state.stage1 });
    }
  }

  syncStage2() {
    localStorage.setItem(STORAGE_KEY_STAGE2, JSON.stringify(this.state.stage2));
    if (this.bc) {
      this.bc.postMessage({ type: 'STAGE2_UPDATE', stage2: this.state.stage2 });
    }
  }

  syncStageChange(stage) {
    localStorage.setItem(STORAGE_KEY_STAGE_CURRENT, stage);
    if (this.bc) {
      this.bc.postMessage({ type: 'STAGE_CHANGE', stage });
    }
  }

  initTimer() {
    setInterval(() => {
      const currentUser = this.authManager.getCurrentUser();
      if (currentUser && currentUser.role === 'student' && this.state.timer.isRunning) {
        this.state.timer.elapsedSeconds += 1 * this.state.timer.speed;
        
        const min = this.state.timer.elapsedSeconds / 60;
        if (min >= 25 && this.state.currentStage === 'stage1') {
          this.switchStage('stage2');
        } else if (min >= 130 && this.state.currentStage === 'stage2') {
          this.switchStage('stage3');
        }

        renderHeader(
          this.state,
          currentUser,
          this.authManager.getAnnouncements(),
          (s) => this.switchStage(s),
          (sp) => this.setSpeed(sp),
          () => this.handleLogout(),
          () => this.switchToTeacherView(),
          () => this.showAnnouncementModal()
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
        appEl,
        this.authManager,
        this.state,
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
      appEl.className = 'app-student-mode';
      appEl.innerHTML = `
        <header class="app-header" id="app-header"></header>
        <div class="main-content">
          <main class="canvas-panel" id="canvas-panel"></main>
          <aside class="chat-panel">
            <div class="chat-header">
              <div class="chat-title">
                <span>💬 多智能体协同对话管道</span>
              </div>
              <div class="active-agent-pills">
                <span class="agent-pill" style="color:#a78bfa; border-color:#8b5cf6;">🎪 拍卖师</span>
                <span class="agent-pill" style="color:#34d399; border-color:#10b981;">🤝 责任编辑</span>
                <span class="agent-pill" style="color:#60a5fa; border-color:#3b82f6;">📝 审稿编辑</span>
              </div>
            </div>

            <div class="chat-stream" id="chat-stream"></div>

            <!-- @ Mention Popover Dropdown Menu -->
            <div class="at-mention-menu" id="at-mention-menu" style="display:none;">
              <div class="at-menu-header">👥 提示：选择需要 @ 的同学或 AI 智能体</div>
              <div class="at-menu-list">
                <div class="at-group-title">👥 小组成员</div>
                <div class="at-item" data-mention="@李明(学生A/组长)">👨‍🎓 @李明 (学生A/组长)</div>
                <div class="at-item" data-mention="@王芳(学生B/组员)">👩‍🎓 @王芳 (学生B/组员)</div>
                <div class="at-item" data-mention="@陈强(学生C/组员)">🧑‍🎓 @陈强 (学生C/组员)</div>
                
                <div class="at-group-title" style="margin-top:6px;">🤖 AI 学术智能体</div>
                <div class="at-item agent" data-mention="@拍卖师 Agent">🎪 @拍卖师 Agent (选题与竞拍指导)</div>
                <div class="at-item agent" data-mention="@责任编辑 Agent">🤝 @责任编辑 Agent (分工与过程学伴)</div>
                <div class="at-item agent" data-mention="@审稿编辑 Agent">📝 @审稿编辑 Agent (学术结构与规范导师)</div>
                <div class="at-item agent" data-mention="@反方委员 Agent">🔴 @反方委员 Agent (答辩质疑推演)</div>
              </div>
            </div>

            <!-- Expanded 24 Emoji Picker Bar -->
            <div class="emoji-bar" id="emoji-bar">
              <span class="emoji-btn" data-emoji="😊">😊</span>
              <span class="emoji-btn" data-emoji="😂">😂</span>
              <span class="emoji-btn" data-emoji="👍">👍</span>
              <span class="emoji-btn" data-emoji="👏">👏</span>
              <span class="emoji-btn" data-emoji="🎉">🎉</span>
              <span class="emoji-btn" data-emoji="💯">💯</span>
              <span class="emoji-btn" data-emoji="🔥">🔥</span>
              <span class="emoji-btn" data-emoji="❤️">❤️</span>
              <span class="emoji-btn" data-emoji="📝">📝</span>
              <span class="emoji-btn" data-emoji="💡">💡</span>
              <span class="emoji-btn" data-emoji="📚">📚</span>
              <span class="emoji-btn" data-emoji="🔍">🔍</span>
              <span class="emoji-btn" data-emoji="📊">📊</span>
              <span class="emoji-btn" data-emoji="🎓">🎓</span>
              <span class="emoji-btn" data-emoji="🎯">🎯</span>
              <span class="emoji-btn" data-emoji="📌">📌</span>
              <span class="emoji-btn" data-emoji="❓">❓</span>
              <span class="emoji-btn" data-emoji="🤔">🤔</span>
              <span class="emoji-btn" data-emoji="💬">💬</span>
              <span class="emoji-btn" data-emoji="🤝">🤝</span>
              <span class="emoji-btn" data-emoji="✅">✅</span>
              <span class="emoji-btn" data-emoji="⚠️">⚠️</span>
              <span class="emoji-btn" data-emoji="🚀">🚀</span>
              <span class="emoji-btn" data-emoji="⚡">⚡</span>
            </div>

            <!-- Redesigned Spacious & Modern Chat Input Bar -->
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
    if (unread) {
      setTimeout(() => this.showAnnouncementModal(unread), 800);
    }
  }

  showAnnouncementModal(targetAnn = null) {
    document.querySelectorAll('.modal-overlay').forEach(el => el.remove());

    const anns = this.authManager.getAnnouncements();
    const ann = targetAnn || (anns.length > 0 ? anns[0] : null);
    if (!ann) {
      alert('📢 暂无新的课堂通知！');
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="student-ann-modal-card">
        <div class="ann-modal-header">
          <div class="ann-header-left">
            <div class="ann-bell-icon">🔔</div>
            <div>
              <div class="ann-badge-tag">📢 课堂即时教学广播通知</div>
              <h3 class="ann-modal-title">${ann.title}</h3>
            </div>
          </div>
          <button class="modal-close-btn" id="btn-close-ann-popup">✕</button>
        </div>

        <div class="ann-modal-body">
          <div class="ann-meta-bar">
            <span>发布教师: <b>${ann.author || '张教授'}</b></span>
            <span>关联任务: <b>${ann.taskTitle || '协作写作'}</b></span>
            <span>发布时间: <b>${ann.time}</b></span>
          </div>

          <div class="ann-content-box">
            ${ann.content}
          </div>

          ${ann.attachment ? `
            <div class="ann-attachment-card">
              <div class="att-info">
                <span class="att-icon">📎</span>
                <div>
                  <div class="att-name">${ann.attachment.name}</div>
                  <div class="att-size">教学随附资源文件 (${ann.attachment.size})</div>
                </div>
              </div>
              <button class="att-download-btn" onclick="alert('📥 已成功下载教学随附资源：${ann.attachment.name}')">
                📥 下载资源
              </button>
            </div>
          ` : ''}
        </div>

        <div class="ann-modal-footer">
          <button class="ann-confirm-btn" id="btn-read-confirm">
            ✅ 我已阅读并确认 (自动同步至教师端追踪矩阵)
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => document.body.removeChild(modal);
    modal.querySelector('#btn-close-ann-popup').addEventListener('click', closeModal);

    modal.querySelector('#btn-read-confirm').addEventListener('click', () => {
      this.authManager.markAnnouncementRead(ann.id, 'group_1');
      closeModal();
      this.renderStudentWorkspace();
    });
  }

  handleLogout() {
    this.authManager.logout();
    this.renderMain();
  }

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
    const atMenu = document.getElementById('at-mention-menu');
    if (!input || !sendBtn) return;

    if (emojiBar) {
      emojiBar.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          input.value += btn.dataset.emoji;
          input.focus();
        });
      });
    }

    input.addEventListener('input', (e) => {
      const val = input.value;
      const lastChar = val.slice(-1);
      if (lastChar === '@' || (val.includes('@') && !val.includes(' '))) {
        atMenu.style.display = 'block';
      } else if (!val.includes('@')) {
        atMenu.style.display = 'none';
      }
    });

    atMenu.querySelectorAll('.at-item').forEach(item => {
      item.addEventListener('click', () => {
        const mentionTag = item.dataset.mention;
        const lastAtIndex = input.value.lastIndexOf('@');
        if (lastAtIndex !== -1) {
          input.value = input.value.substring(0, lastAtIndex) + mentionTag + ' ';
        } else {
          input.value += mentionTag + ' ';
        }
        atMenu.style.display = 'none';
        input.focus();
      });
    });

    const handleSend = () => {
      const text = input.value.trim();
      if (!text) return;

      const currentUser = this.authManager.getCurrentUser();
      const studentCode = currentUser ? (currentUser.studentCode || 'A') : 'A';
      const currentStage = this.state.currentStage;

      const msgObj = {
        sender: studentCode,
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (!this.state.chatLogs[currentStage]) {
        this.state.chatLogs[currentStage] = [];
      }
      this.state.chatLogs[currentStage].push(msgObj);

      input.value = '';
      atMenu.style.display = 'none';

      this.studentMsgCountSinceLastAgent += 1;

      this.syncChatLogs();
      renderChat(this.state);
      this.triggerAgentReplyIfNeeded(text);
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  /**
   * Smart AI Agent Trigger Logic (智能体智能触发逻辑)
   * Rules:
   * 1. Direct @ Mentions -> Agent replies immediately.
   * 2. Un-@mentioned Messages -> Agent DOES NOT reply to every single message!
   *    Triggers only after students have sent 3+ discussion messages OR when milestone keywords (分工, 确定, 结论, 方案) are used.
   */
  triggerAgentReplyIfNeeded(userMsg) {
    const isExplicitMention = userMsg.includes('@');
    const isMilestoneKeyword = userMsg.includes('分工') || userMsg.includes('确定') || userMsg.includes('结论') || userMsg.includes('方案') || userMsg.includes('意见');
    const hasEnoughDiscussion = this.studentMsgCountSinceLastAgent >= 3;

    // Do NOT reply to simple short chatter unless @mentioned or enough discussion accumulated
    if (!isExplicitMention && !isMilestoneKeyword && !hasEnoughDiscussion) {
      return;
    }

    setTimeout(() => {
      const stage = this.state.currentStage;
      let replyAgent = 'reviewingEditor';
      let replyText = '';

      if (userMsg.includes('@审稿编辑') || userMsg.includes('@审稿编辑 Agent')) {
        replyAgent = 'reviewingEditor';
        replyText = `📝 【审稿编辑针对性指导】：收到你的求助问询！在写作过程中，关于《编辑会议规范与范例模板文件.pdf》提倡的规范：必须确保“三、文献综述”中提出的学术概念与“四、研究设计与方法”中的测量量表（如 FacioneSSR框架）实现 1 对 1 精确匹配。只提供结构建议，请组员自行讨论填补具体文本！`;
      } else if (userMsg.includes('@责任编辑') || userMsg.includes('@责任编辑 Agent')) {
        replyAgent = 'managingEditor';
        replyText = `🤝 【责任编辑过程学伴回复】：收到 @ 呼叫！目前小组字数分配与协同节奏良好（A:42%, B:31%, C:27%）。如果个别组员遇到撰写卡顿，建议组长 A 在大文本框中先列出二级标题子纲，协助同伴拆解任务。`;
      } else if (userMsg.includes('@拍卖师') || userMsg.includes('@拍卖师 Agent')) {
        replyAgent = 'auctioneer';
        replyText = `🎪 【拍卖师选题顾问回复】：收到 @ 呼叫！针对课题《协作学习中的“搭便车”现象：基于注意力分配与AI感知视角》，建议将重点聚焦在“注意力分配可视化”作为干预中介变量，以提升学术新意与可操作性！`;
      } else if (userMsg.includes('@反方委员') || userMsg.includes('@反方委员 Agent')) {
        replyAgent = 'opponent';
        replyText = `🔴 【反方委员预演提醒】：收到 @ 呼叫！提前提醒团队：在答辩阶段我将重点攻防“150人样本量的 G*Power 统计效力分析”以及“显性感知是否会诱发评价焦虑”。请务必在正文第四与第五章做好学术防御准备！`;
      } else {
        // Smart automatic milestone reply (only triggered after full round of discussion!)
        if (stage === 'stage1') {
          replyAgent = 'auctioneer';
          replyText = `🎪 【拍卖师评估与总结】注意到组内已完成一轮关于选题与任务分工的讨论！建议组员在提案面板中投票并按键确认签署合作学术合约！`;
        } else if (stage === 'stage2') {
          replyAgent = 'reviewingEditor';
          replyText = `📝 【审稿编辑高阶引导】关注到组内针对大正文与文献框架的讨论。请参考《编辑会议规范与范例模板文件.pdf》，在研究设计章节，必须明确自变量（AI干预模式）与因变量（SSRL得分）之间的因果链条！`;
        } else if (stage === 'stage3') {
          replyAgent = 'neutral';
          replyText = `🟡 【中间委员裁决提示】针对意见，请小组在修改稿中补充一段限定说明，并在左侧确认采纳！`;
        }
      }

      // Reset discussion counter after agent intervention
      this.studentMsgCountSinceLastAgent = 0;

      const agentMsgObj = {
        sender: replyAgent,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (!this.state.chatLogs[stage]) this.state.chatLogs[stage] = [];
      this.state.chatLogs[stage].push(agentMsgObj);

      this.syncChatLogs();
      renderChat(this.state);
    }, 1200);
  }

  handleVoteCast(proposalId) {
    const user = this.state.currentUser;
    const s1 = this.state.stage1;

    if (s1.hasVoted && s1.hasVoted[user]) {
      alert('⚠️ 投票已被锁定！每位成员首次投票后不能再修改选项。');
      return;
    }

    if (!s1.hasVoted) s1.hasVoted = {};
    s1.votes[user] = proposalId;
    s1.hasVoted[user] = true;

    const proposal = s1.proposals.find(p => p.id === proposalId);
    const votesCastCount = Object.values(s1.hasVoted).filter(Boolean).length;

    const voteMsg = {
      sender: user,
      text: `📢 [投票告知]: 我已确认投票支持提案《${proposal ? proposal.title : proposalId}》！（当前全组已集齐 ${votesCastCount}/3 票）`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.state.chatLogs.stage1.push(voteMsg);
    this.syncStage1();
    this.syncChatLogs();

    if (votesCastCount >= 3) {
      setTimeout(() => {
        const tally = {};
        Object.values(s1.votes).forEach(pId => {
          if (pId) tally[pId] = (tally[pId] || 0) + 1;
        });

        let summaryText = '🎪 【拍卖师宣布最终计票结果】：全员投票已完毕！\n';
        s1.proposals.forEach(p => {
          summaryText += `• 《${p.title}》得票: ${tally[p.id] || 0} 票\n`;
        });
        summaryText += `\n🔨 结果表明：《搭便车干预》高票胜出！注意，C同学支持《短视频注意力》，建议将“注意力分配视角”融入最终主题中，请组员讨论并更新合作卡片！`;

        const summaryMsg = {
          sender: 'auctioneer',
          text: summaryText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
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
    renderHeader(
      this.state,
      currentUser,
      this.authManager.getAnnouncements(),
      (s) => this.switchStage(s),
      (sp) => this.setSpeed(sp),
      () => this.handleLogout(),
      () => this.switchToTeacherView(),
      () => this.showAnnouncementModal()
    );
  }

  renderStudentWorkspace() {
    const currentUser = this.authManager.getCurrentUser();
    this.state.currentUser = currentUser ? (currentUser.studentCode || 'A') : 'A';

    renderHeader(
      this.state,
      currentUser,
      this.authManager.getAnnouncements(),
      (s) => this.switchStage(s),
      (sp) => this.setSpeed(sp),
      () => this.handleLogout(),
      () => this.switchToTeacherView(),
      () => this.showAnnouncementModal()
    );

    renderCanvas(this.state, {
      onVote: (propId) => {
        this.handleVoteCast(propId);
      },
      onRefresh: () => {
        this.renderStudentWorkspace();
      },
      onConfirmContract: () => {
        const user = this.state.currentUser;
        const s1 = this.state.stage1;
        if (!s1.contract.confirmedMembers) {
          s1.contract.confirmedMembers = { 'A': false, 'B': false, 'C': false };
        }

        s1.contract.confirmedMembers[user] = true;
        const confirmedCount = Object.values(s1.contract.confirmedMembers).filter(Boolean).length;
        const memberName = this.state.members[user] ? this.state.members[user].name : user;

        const confirmMsg = {
          sender: user,
          text: `📢 [合约签署告知]: 我 (${memberName}) 已按键确认签署合作学术合约！（全组确认进度: ${confirmedCount}/3 人）`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        this.state.chatLogs.stage1.push(confirmMsg);
        this.syncStage1();
        this.syncChatLogs();

        if (confirmedCount < 3) {
          alert(`✅ 你 (${memberName}) 已成功按键确认签署合约！\n\n目前组内签署进度：${confirmedCount}/3 人。\n需全组 3 名成员全部按键确认后方可解锁阶段二！\n\n💡 提示：在 VS Code 中新建一个 Simple Browser 窗口或右键标签页，登录 wangfang 或 chenqiang 按键确认即可体验多窗口实时同步！`);
        } else {
          s1.contract.isConfirmed = true;
          this.syncStage1();
          this.syncStageChange('stage2');
          setTimeout(() => {
            const finalMsg = {
              sender: 'auctioneer',
              text: `🎪 【拍卖师宣布】：恭喜！组内全员 3/3 名成员已全部完成按键确认签署！学术合作合约正式生效，阶段一圆满结束，系统自动解锁【阶段二：学术编辑部】！`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            this.state.chatLogs.stage1.push(finalMsg);
            this.syncChatLogs();
            alert('🎉 恭喜！组内 3 位成员全部完成按键确认签署！学术合作合约生效，系统解锁【阶段二：学术编辑部】！');
            this.switchStage('stage2');
          }, 600);
        }

        this.renderStudentWorkspace();
      },
      onUnifiedContentChange: (newContent) => {
        this.state.stage2.unifiedContent = newContent;
        let total = newContent.length || 1;
        this.state.stage2.memberContributions = {
          'A': { words: Math.round(total * 0.42), percentage: 42 },
          'B': { words: Math.round(total * 0.31), percentage: 31 },
          'C': { words: Math.round(total * 0.27), percentage: 27 }
        };
        this.syncStage2();
      },
      onOpenCaseModal: () => {
        alert('📖 审稿编辑推送的【编辑会议规范与范例模板文件.pdf】：\n\n标题: 《生成式AI感知视角下的协作写作干预实证研究》\n规范指引: 准实验设计，样本量N=150。采用SSRL共享调节量表进行前后测评估，重点包含：明确的研究假设、自变量控制与混合定量定性分析。');
      },
      onOpenMeetingModal: () => {
        this.showMeetingModal();
      },
      onAdoptFeedback: (id) => {
        const item = this.state.stage3.feedbackItems.find(f => f.id === id);
        if (item) {
          const resp = prompt(`请代表小组输入针对【${item.title}】的统一裁决方案：`, '已补充说明并纠正维偏差。');
          if (resp) {
            item.status = 'adopted';
            item.response = resp;
            this.renderStudentWorkspace();
          }
        }
      },
      onFinalSubmit: () => {
        alert('🚀 恭喜小组！《协作学习中的“搭便车”现象：基于注意力分配与AI感知视角》最终方案与评估报告已提交至教师端！');
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
          <div class="modal-header-title">
            <span class="modal-icon">📢</span>
            <div>
              <h3>学术编辑部【半程编辑会议】</h3>
              <p>共享调节 3 维评价与半程修正清单生成</p>
            </div>
          </div>
          <button class="modal-close-btn" id="btn-close-meeting">✕</button>
        </div>

        <div class="teacher-modal-body">
          <div style="background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3); border-radius:10px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:13px; font-weight:700; color:#a5b4fc;">📎 审稿编辑推送范例文件:</div>
              <div style="font-size:12px; color:#cbd5e1;">《编辑会议规范与范例模板文件.pdf》 (1.8 MB)</div>
            </div>
            <button onclick="alert('📖 已打开审稿编辑推送的《编辑会议规范与范例模板文件.pdf》')" style="background:var(--accent-indigo); border:none; color:white; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer;">
              查阅范例文件
            </button>
          </div>

          <div class="teacher-form-group">
            <label style="font-size:13px;">🌟 维度 ①：内容逻辑与学术严谨度打分 (1-5星)</label>
            <div class="rating-stars" id="star-rating-logic" style="margin:4px 0;">
              <span class="star active" data-val="1">★</span>
              <span class="star active" data-val="2">★</span>
              <span class="star active" data-val="3">★</span>
              <span class="star active" data-val="4">★</span>
              <span class="star" data-val="5">★</span>
            </div>
          </div>

          <div class="teacher-form-group">
            <label style="font-size:13px;">👥 维度 ②：团队分工与参与平衡度打分 (1-5星)</label>
            <div class="rating-stars" id="star-rating-balance" style="margin:4px 0;">
              <span class="star active" data-val="1">★</span>
              <span class="star active" data-val="2">★</span>
              <span class="star active" data-val="3">★</span>
              <span class="star active" data-val="4">★</span>
              <span class="star active" data-val="5">★</span>
            </div>
          </div>

          <div class="teacher-form-group">
            <label style="font-size:13px;">⚠️ 维度 ③：当前组内面临的最大难点瓶颈</label>
            <select id="meeting-bottleneck-select" class="teacher-input">
              <option value="假设与研究设计工具对应不明确">假设与研究设计工具对应不明确</option>
              <option value="相关文献支撑力度不足">相关文献支撑力度不足</option>
              <option value="时间分配紧张，进度滞后">时间分配紧张，进度滞后</option>
              <option value="章节之间过渡衔接缺乏逻辑">章节之间过渡衔接缺乏逻辑</option>
            </select>
          </div>

          <div class="teacher-form-group">
            <label style="font-size:13px;">✍️ 组内自评与补充修正说明</label>
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

    let logicRating = 4;
    let balanceRating = 5;

    modal.querySelectorAll('#star-rating-logic .star').forEach(s => {
      s.addEventListener('click', (e) => {
        logicRating = Number(e.target.dataset.val);
        modal.querySelectorAll('#star-rating-logic .star').forEach(st => {
          st.classList.toggle('active', Number(st.dataset.val) <= logicRating);
        });
      });
    });

    modal.querySelectorAll('#star-rating-balance .star').forEach(s => {
      s.addEventListener('click', (e) => {
        balanceRating = Number(e.target.dataset.val);
        modal.querySelectorAll('#star-rating-balance .star').forEach(st => {
          st.classList.toggle('active', Number(st.dataset.val) <= balanceRating);
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

      const meetingMsg = {
        sender: 'managingEditor',
        text: `📢 【编辑会议① 汇总】：全员完成 3 维打分（逻辑严谨度 ${logicRating}星，分工平衡度 ${balanceRating}星，核心瓶颈：${bottleneck}）。组员自评：“${userText}”。`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      this.state.chatLogs.stage2.push(meetingMsg);
      this.syncStage2();
      this.syncChatLogs();

      setTimeout(() => {
        const feedbackMsg = {
          sender: 'reviewingEditor',
          text: `📝 【审稿编辑深度反馈与范例指引】：结合《编辑会议规范与范例模板文件.pdf》中的标准指标，正文整体连贯。针对你们提出的瓶颈：“${bottleneck}”，系统已在锁定的半程清单中展现，请组员按清单逐项修正！`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
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
