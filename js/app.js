/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Main Controller & Multi-Role App Handler
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
          () => this.switchToTeacherView()
        );
      }
    }, 1000);
  }

  renderMain() {
    const currentUser = this.authManager.getCurrentUser();
    const appEl = document.getElementById('app');

    if (!currentUser) {
      // Unauthenticated -> Show Login Screen
      appEl.className = 'app-login-mode';
      renderLoginView(appEl, this.authManager, (user) => {
        this.renderMain();
      });
      return;
    }

    if (currentUser.role === 'teacher') {
      // Teacher Portal
      appEl.className = 'app-teacher-mode';
      renderTeacherPortal(
        appEl,
        this.authManager,
        this.state,
        () => this.handleLogout(),
        () => {
          // Temporary preview as Student A
          const users = this.authManager.getUsers();
          const studentA = users.find(u => u.email === 'studentA@jizhi.edu');
          if (studentA) {
            localStorage.setItem('jizhi_current_user', JSON.stringify(studentA));
            this.renderMain();
          }
        }
      );
    } else {
      // Student Workspace
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
    }
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
    if (!input || !sendBtn) return;

    const handleSend = () => {
      const text = input.value.trim();
      if (!text) return;

      const currentUser = this.authManager.getCurrentUser();
      const studentCode = currentUser.studentCode || 'A';
      const currentStage = this.state.currentStage;

      this.state.chatLogs[currentStage].push({
        sender: studentCode,
        text: text,
        timestamp: new Date().toLocaleTimeString()
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
        replyText = `🎪 [拍卖师记录]: 收到回复："${userMsg}"。协商结果已同步！`;
      } else if (stage === 'stage2') {
        replyAgent = 'managingEditor';
        replyText = `🤝 [责任编辑]: 已接收讨论！过程协同度与贡献比已实时更新。`;
      } else if (stage === 'stage3') {
        replyAgent = 'neutral';
        replyText = `🟡 [中间委员]: 请小组决定是否在修改稿中落实此反思意见。`;
      }

      this.state.chatLogs[stage].push({
        sender: replyAgent,
        text: replyText,
        timestamp: new Date().toLocaleTimeString()
      });

      renderChat(this.state);
    }, 1000);
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
      () => this.switchToTeacherView()
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
      () => this.switchToTeacherView()
    );

    renderCanvas(this.state, {
      onVote: (propId) => {
        this.state.stage1.votes[this.state.currentUser] = propId;
        this.renderStudentWorkspace();
      },
      onSectionTabChange: (key) => {
        this.state.stage2.activeSection = key;
        this.renderStudentWorkspace();
      },
      onContentChange: (key, newContent) => {
        this.state.stage2.docSections[key].content = newContent;
        let wordsA = this.state.stage2.docSections.background.content.length + this.state.stage2.docSections.questions.content.length;
        let wordsB = this.state.stage2.docSections.literature.content.length;
        let wordsC = this.state.stage2.docSections.method.content.length + this.state.stage2.docSections.reflection.content.length + this.state.stage2.docSections.references.content.length;

        let total = wordsA + wordsB + wordsC || 1;
        this.state.stage2.memberContributions = {
          'A': { words: wordsA, percentage: Math.round((wordsA / total) * 100) },
          'B': { words: wordsB, percentage: Math.round((wordsB / total) * 100) },
          'C': { words: wordsC, percentage: Math.round((wordsC / total) * 100) }
        };
      },
      onOpenCaseModal: () => {
        alert('📖 审稿编辑推送的【研究设计优秀案例】：\n\n示例标题: 《生成式AI感知视角下的协作写作干预实证研究》\n示例范式: 准实验设计，样本量N=120。');
      },
      onOpenMeetingModal: () => {
        this.showMeetingModal();
      },
      onAdoptFeedback: (id) => {
        const item = this.state.stage3.feedbackItems.find(f => f.id === id);
        if (item) {
          const resp = prompt(`请代表小组输入针对【${item.title}】的统一修改方案：`, '已补充说明并纠正维偏差。');
          if (resp) {
            item.status = 'adopted';
            item.response = resp;
            this.renderStudentWorkspace();
          }
        }
      },
      onFinalSubmit: () => {
        alert('🎉 恭喜小组！《协作学习中的“搭便车”现象：基于注意力分配与AI感知视角》最终稿及SSRL评估报告已成功提交至教师端！');
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
        timestamp: new Date().toLocaleTimeString()
      });

      setTimeout(() => {
        this.state.chatLogs.stage2.push({
          sender: 'reviewingEditor',
          text: `📝 【审稿编辑意见】：结合小组提交的 ${selectedStar} 星打分，建议在“研究背景”末尾补充过度句，并明确H1假设的测量量表。`,
          timestamp: new Date().toLocaleTimeString()
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
