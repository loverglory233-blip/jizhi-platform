/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Main Controller & App Entry Point
 */

import { InitialState } from './state.js';
import { PresetMessages, AgentProfiles } from './agents.js';
import { renderHeader, renderCanvas, renderChat } from './ui.js';

class App {
  constructor() {
    this.state = JSON.parse(JSON.stringify(InitialState));
    this.initPresetMessages();
    this.initTimer();
    this.initEvents();
    this.render();
  }

  initPresetMessages() {
    // Populate chat logs with preset sequence for demonstration
    ['stage1', 'stage2', 'stage3'].forEach(stage => {
      this.state.chatLogs[stage] = PresetMessages[stage] || [];
    });
  }

  initTimer() {
    setInterval(() => {
      if (this.state.timer.isRunning) {
        this.state.timer.elapsedSeconds += 1 * this.state.timer.speed;
        
        // Auto stage transition check
        const min = this.state.timer.elapsedSeconds / 60;
        if (min >= 25 && this.state.currentStage === 'stage1') {
          // Transition to stage 2
          this.switchStage('stage2');
        } else if (min >= 130 && this.state.currentStage === 'stage2') {
          // Transition to stage 3
          this.switchStage('stage3');
        }

        renderHeader(this.state, (s) => this.switchStage(s), (sp) => this.setSpeed(sp), (u) => this.switchUser(u));
      }
    }, 1000);
  }

  initEvents() {
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    const handleSend = () => {
      const text = input.value.trim();
      if (!text) return;

      const currentStage = this.state.currentStage;
      this.state.chatLogs[currentStage].push({
        sender: this.state.currentUser,
        text: text,
        timestamp: new Date().toLocaleTimeString()
      });

      input.value = '';
      renderChat(this.state);

      // Trigger intelligent agent responses after user sends a message
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
        replyText = `🎪 [拍卖师记录]: 收到来自成员 ${this.state.currentUser} 的反馈："${userMsg}"。协商记录已同步，大家可以随时在左侧确认或更新提案！`;
      } else if (stage === 'stage2') {
        replyAgent = 'managingEditor';
        replyText = `🤝 [责任编辑]: 收到成员 ${this.state.currentUser} 的讨论。写作进度与互动已计入组内过程协同度指标，请继续保持良好交流！`;
      } else if (stage === 'stage3') {
        replyAgent = 'neutral';
        replyText = `🟡 [中间委员]: 针对 ${this.state.currentUser} 的回应，组内其他伙伴意下如何？请决定是否在修改稿中落实。`;
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
    this.render();
  }

  switchUser(newUser) {
    this.state.currentUser = newUser;
    this.render();
  }

  setSpeed(newSpeed) {
    this.state.timer.speed = newSpeed;
    renderHeader(this.state, (s) => this.switchStage(s), (sp) => this.setSpeed(sp), (u) => this.switchUser(u));
  }

  render() {
    renderHeader(
      this.state,
      (s) => this.switchStage(s),
      (sp) => this.setSpeed(sp),
      (u) => this.switchUser(u)
    );

    renderCanvas(this.state, {
      onVote: (propId) => {
        this.state.stage1.votes[this.state.currentUser] = propId;
        this.render();
      },
      onSectionTabChange: (key) => {
        this.state.stage2.activeSection = key;
        this.render();
      },
      onContentChange: (key, newContent) => {
        this.state.stage2.docSections[key].content = newContent;
        // Recalculate word count & contribution percentage
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
        alert('📖 审稿编辑推送的【研究设计优秀案例】：\n\n示例标题: 《生成式AI感知视角下的协作写作干预实证研究》\n示例范式: 准实验设计，样本量N=120，采用SSRL共享调节量表前后测。核心要素包含：清晰的研究假设H1/H2、定量与定性（半结构化访谈）混合研究方法。');
      },
      onOpenMeetingModal: () => {
        this.showMeetingModal();
      },
      onAdoptFeedback: (id) => {
        const item = this.state.stage3.feedbackItems.find(f => f.id === id);
        if (item) {
          const resp = prompt(`请代表小组输入针对【${item.title}】的统一修改方案：`, '已在第二节补充相关说明，纠正了测量维度偏差。');
          if (resp) {
            item.status = 'adopted';
            item.response = resp;
            this.render();
          }
        }
      },
      onFinalSubmit: () => {
        alert('🎉 恭喜小组！《协作学习中的“搭便车”现象：基于注意力分配与AI感知视角》最终稿及SSRL元认知反思报告已成功提交！');
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
          请每位学习伙伴对上半程的写作质量与团队协同度进行打分（1-5星），审稿编辑将在评价后给出针对性修改建议：
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
          <input type="text" id="meeting-input" value="背景部分已完成，需要审稿编辑评估文献综述与假设的衔接。" style="width:100%; padding:8px; border-radius:6px; border:1px solid #475569; background:#0f172a; color:white;">
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

      // Add meeting chat logs
      this.state.chatLogs.stage2.push({
        sender: 'managingEditor',
        text: `📢 【编辑会议】全员已完成打分（平均得分 ${selectedStar} 星）。组员反馈："${userText}"。请审稿编辑给出修改意见！`,
        timestamp: new Date().toLocaleTimeString()
      });

      setTimeout(() => {
        this.state.chatLogs.stage2.push({
          sender: 'reviewingEditor',
          text: `📝 【审稿编辑意见】：结合小组提交的 ${selectedStar} 星打分与最新文档，建议：\n1. 研究背景末尾增加一段过渡引言，点明研究假设H1；\n2. 研究方法部分补充“字数贡献比”的具体干预阈值；\n针对这些问题，请小组开展10分钟针对性修改！`,
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
