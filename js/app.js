/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Main Controller - Voting Lock, Instant Vote Chat Notifications & Auctioneer Tally Sync
 */

import { InitialState } from './state.js';
import { PresetMessages } from './agents.js';
import { AuthManager } from './auth.js';
import { renderLoginView } from './login.js';
import { renderTeacherPortal } from './teacher.js';
import { renderHeader, renderCanvas, renderChat } from './ui.js';

class App {
  constructor() {
    this.authManager = new AuthManager();
    this.state = JSON.parse(JSON.stringify(InitialState));
    this.initPresetMessages();
    this.initTimer();
    this.renderMain();
  }

  initPresetMessages() {
    ['stage1', 'stage2', 'stage3'].forEach(stage => {
      this.state.chatLogs[stage] = PresetMessages[stage] || [];
    });
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
          const studentA = users.find(u => u.email === 'studentA@jizhi.edu');
          if (studentA) {
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

            <div class="emoji-bar" id="emoji-bar" style="padding:4px 16px; background:rgba(15,23,42,0.4); display:flex; gap:8px; border-top:1px solid rgba(255,255,255,0.08);">
              <span class="emoji-btn" data-emoji="😊" style="cursor:pointer; font-size:16px;">😊</span>
              <span class="emoji-btn" data-emoji="👍" style="cursor:pointer; font-size:16px;">👍</span>
              <span class="emoji-btn" data-emoji="🎉" style="cursor:pointer; font-size:16px;">🎉</span>
              <span class="emoji-btn" data-emoji="📝" style="cursor:pointer; font-size:16px;">📝</span>
              <span class="emoji-btn" data-emoji="💡" style="cursor:pointer; font-size:16px;">💡</span>
              <span class="emoji-btn" data-emoji="❓" style="cursor:pointer; font-size:16px;">❓</span>
              <span class="emoji-btn" data-emoji="💯" style="cursor:pointer; font-size:16px;">💯</span>
              <span class="emoji-btn" data-emoji="👏" style="cursor:pointer; font-size:16px;">👏</span>
            </div>

            <div class="chat-input-bar">
              <input type="text" class="chat-input" id="chat-input" placeholder="在小组/智能体协同频道中发言..." autocomplete="off">
              <button class="send-btn" id="send-btn" title="发送消息">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
    const anns = this.authManager.getAnnouncements();
    const ann = targetAnn || (anns.length > 0 ? anns[0] : null);
    if (!ann) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box" style="border-color:#10b981; box-shadow:0 0 30px rgba(16,185,129,0.3);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="color:#34d399; font-size:18px;">${ann.title}</h3>
          <span style="font-size:11px; color:#94a3b8;">${ann.time} | 来自: ${ann.author}</span>
        </div>

        <div style="font-size:14px; color:#f8fafc; line-height:1.6; background:rgba(15,23,42,0.8); padding:14px; border-radius:8px; margin-bottom:14px; border:1px solid rgba(255,255,255,0.1);">
          ${ann.content}
        </div>

        ${ann.attachment ? `
          <div style="background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.3); padding:10px; border-radius:8px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:13px; color:#a5b4fc;">📎 附件资源: <b>${ann.attachment.name}</b> (${ann.attachment.size})</span>
            <button onclick="alert('📥 已成功下载教师随附学习资源：${ann.attachment.name}')" style="background:var(--accent-indigo); border:none; color:white; padding:4px 10px; border-radius:4px; font-size:12px; cursor:pointer;">
              下载资源
            </button>
          </div>
        ` : ''}

        <button class="btn-primary" id="btn-read-confirm" style="background:linear-gradient(135deg, #10b981, #059669); font-size:14px; font-weight:700;">
          ✅ 我已阅读并确认 (已读状态将自动同步至教师端)
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btn-read-confirm').addEventListener('click', () => {
      this.authManager.markAnnouncementRead(ann.id, 'group_1');
      document.body.removeChild(modal);
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
    localStorage.setItem('jizhi_current_user', JSON.stringify(teacher));
    this.renderMain();
  }

  initStudentEvents() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const emojiBar = document.getElementById('emoji-bar');
    if (!input || !sendBtn) return;

    if (emojiBar) {
      emojiBar.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          input.value += btn.dataset.emoji;
          input.focus();
        });
      });
    }

    const handleSend = () => {
      const text = input.value.trim();
      if (!text) return;

      const currentUser = this.authManager.getCurrentUser();
      const studentCode = currentUser.studentCode || 'A';
      const currentStage = this.state.currentStage;

      this.state.chatLogs[currentStage].push({
        sender: studentCode,
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      input.value = '';
      renderChat(this.state);
      this.triggerAgentReply(text);
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  triggerAgentReply(userMsg) {
    setTimeout(() => {
      const stage = this.state.currentStage;
      let replyAgent = 'auctioneer';
      let replyText = '';

      if (stage === 'stage1') {
        replyAgent = 'auctioneer';
        replyText = `🎪 【拍卖师评估记录】收到观点补充："${userMsg}"。提问：你们认为该方案的核心限制条件是什么？系统已将补充理由更新至合作卡片中。`;
      } else if (stage === 'stage2') {
        replyAgent = 'reviewingEditor';
        replyText = `📝 【审稿编辑高阶引导】关注到成员针对：“${userMsg}” 的讨论。请注意：在研究设计章节，必须明确自变量（AI干预模式）与因变量（SSRL得分）之间的因果链条，切勿直接贴出答案。`;
      } else if (stage === 'stage3') {
        replyAgent = 'neutral';
        replyText = `🟡 【中间委员裁决提示】针对意见：“${userMsg}”，请小组在修改稿中补充一段限定说明，并统一确认。`;
      }

      this.state.chatLogs[stage].push({
        sender: replyAgent,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      renderChat(this.state);
    }, 1000);
  }

  handleVoteCast(proposalId) {
    const user = this.state.currentUser;
    const s1 = this.state.stage1;

    if (s1.hasVoted && s1.hasVoted[user]) {
      alert('⚠️ 投票已被锁定！每位成员首次投票后不能再修改选项。');
      return;
    }

    // Record Vote and Lock
    if (!s1.hasVoted) s1.hasVoted = {};
    s1.votes[user] = proposalId;
    s1.hasVoted[user] = true;

    const proposal = s1.proposals.find(p => p.id === proposalId);
    const memberName = this.state.members[user] ? this.state.members[user].name : user;

    // Count Total Votes Cast
    const votesCastCount = Object.values(s1.hasVoted).filter(Boolean).length;

    // 1. Post Vote Notification in Chat Box
    this.state.chatLogs.stage1.push({
      sender: user,
      text: `📢 [投票告知]: 我已确认投票支持提案《${proposal ? proposal.title : proposalId}》！（当前全组已集齐 ${votesCastCount}/3 票）`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // 2. If All 3 Voted, Trigger Auctioneer Final Tally Announcement
    if (votesCastCount >= 3) {
      setTimeout(() => {
        // Calculate Tally
        const tally = {};
        Object.values(s1.votes).forEach(pId => {
          if (pId) tally[pId] = (tally[pId] || 0) + 1;
        });

        let summaryText = '🎪 【拍卖师宣布最终计票结果】：全员投票已完毕！\n';
        s1.proposals.forEach(p => {
          summaryText += `• 《${p.title}》得票: ${tally[p.id] || 0} 票\n`;
        });
        summaryText += `\n🔨 结果表明：《搭便车干预》高票胜出！注意，C同学支持《短视频注意力》，建议将“注意力分配视角”融入最终主题中，请组员讨论并更新合作卡片！`;

        this.state.chatLogs.stage1.push({
          sender: 'auctioneer',
          text: summaryText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        renderChat(this.state);
      }, 1000);
    }

    this.renderStudentWorkspace();
  }

  switchStage(newStage) {
    this.state.currentStage = newStage;
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
        this.state.stage1.contract.isConfirmed = true;
        alert('🎉 全员统一确认成功！学术合作卡片已生效，系统自动解锁阶段二：学术编辑部！');
        this.switchStage('stage2');
      },
      onUnifiedContentChange: (newContent) => {
        this.state.stage2.unifiedContent = newContent;
        let total = newContent.length || 1;
        this.state.stage2.memberContributions = {
          'A': { words: Math.round(total * 0.42), percentage: 42 },
          'B': { words: Math.round(total * 0.31), percentage: 31 },
          'C': { words: Math.round(total * 0.27), percentage: 27 }
        };
      },
      onOpenCaseModal: () => {
        alert('📖 审稿编辑推送的【研究设计优秀范例】：\n\n标题: 《生成式AI感知视角下的协作写作干预实证研究》\n范式: 准实验设计，样本量N=150。采用SSRL共享调节量表进行前后测评估，重点包含：明确的研究假设、自变量控制与混合定量定性分析。');
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
      <div class="modal-box">
        <h3 style="color:#10b981; margin-bottom:12px;">📢 发起学术编辑部【编辑会议】</h3>
        <p style="font-size:13px; color:#cbd5e1; margin-bottom:16px;">
          请每位学习伙伴对上半程的写作质量进行打分（1-5星）：
        </p>

        <div class="rating-stars" id="star-rating">
          <span class="star active" data-val="1">★</span>
          <span class="star active" data-val="2">★</span>
          <span class="star active" data-val="3">★</span>
          <span class="star active" data-val="4">★</span>
          <span class="star" data-val="5">★</span>
        </div>

        <div style="margin-bottom:16px;">
          <label style="font-size:12px; color:#94a3b8; display:block; margin-bottom:6px;">组内自评与困惑点说明:</label>
          <input type="text" id="meeting-input" value="背景部分已完成，请审稿编辑评价文献与假设衔接。" style="width:100%; padding:8px; border-radius:6px; border:1px solid #475569; background:#0f172a; color:white;">
        </div>

        <button class="btn-primary" id="btn-submit-meeting">提交打分并获取审稿意见</button>
      </div>
    `;

    document.body.appendChild(modal);

    let selectedStar = 4;
    modal.querySelectorAll('.star').forEach(s => {
      s.addEventListener('click', (e) => {
        selectedStar = Number(e.target.dataset.val);
        modal.querySelectorAll('.star').forEach(st => {
          st.classList.toggle('active', Number(st.dataset.val) <= selectedStar);
        });
      });
    });

    modal.querySelector('#btn-submit-meeting').addEventListener('click', () => {
      document.body.removeChild(modal);
      const userText = modal.querySelector('#meeting-input').value;

      this.state.chatLogs.stage2.push({
        sender: 'managingEditor',
        text: `📢 【编辑会议】全员打分完成（均分 ${selectedStar} 星）。组员评价："${userText}"。请审稿编辑反馈！`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      setTimeout(() => {
        this.state.chatLogs.stage2.push({
          sender: 'reviewingEditor',
          text: `📝 【审稿编辑深度反馈】：结合打分（${selectedStar}星），正文结构的逻辑连贯性良好。重点改进提示：在“二、研究问题与假设”末尾增加一段承上启下的过渡句，并明确 H1 假设的量表来源。审稿编辑只做引导，请团队自行讨论修改！`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        renderChat(this.state);
      }, 1200);

      renderChat(this.state);
    });
  }
}

// Global Launch
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
