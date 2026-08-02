/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Teacher Control Center (教师端) Module
 */

export function renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView) {
  const currentUser = authManager.getCurrentUser();
  const tasks = authManager.getTasks();
  const announcements = authManager.getAnnouncements();
  const allUsers = authManager.getUsers();
  const students = allUsers.filter(u => u.role === 'student');

  container.innerHTML = `
    <div class="teacher-portal-layout">
      <!-- Teacher Navigation Header -->
      <header class="teacher-header">
        <div class="brand-section">
          <div class="brand-logo">集智 JIZHI</div>
          <div class="brand-badge teacher-badge">👩‍🏫 教师控制中心 (Teacher Control Center)</div>
        </div>

        <div class="teacher-info">
          <span>欢迎，<b>${currentUser.name}</b></span>
          <button class="btn-secondary" id="btn-switch-student-preview" style="background:rgba(99,102,241,0.2); border:1px solid #6366f1; color:#a5b4fc; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer;">
            👀 进入学生协作视角
          </button>
          <button class="btn-logout" id="btn-logout" style="background:rgba(239,68,68,0.2); border:1px solid #ef4444; color:#fca5a5; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer;">
            退出登录
          </button>
        </div>
      </header>

      <!-- Main Teacher Dashboard Content -->
      <main class="teacher-content">
        <!-- Left Column: Task Publishing & Group Management -->
        <section class="teacher-left-panel">
          
          <!-- Announcement Broadcaster Card -->
          <div class="card broadcast-card">
            <div class="card-title">
              <span>📢 课堂即时通知广播 (Real-time Broadcaster)</span>
              <span style="font-size:12px; font-weight:normal; color:#a78bfa;">所有学生端实时同步</span>
            </div>
            
            <div style="display:flex; gap:10px; margin-bottom:14px;">
              <input type="text" id="announcement-input" class="chat-input" placeholder="输入广播通知（如：请各组在后10分钟内集中整理【研究问题与假设】）..." style="flex:1;">
              <button id="btn-send-announcement" class="btn-primary" style="width:auto; padding:0 20px;">
                📢 全班广播发布
              </button>
            </div>

            <!-- Historical Announcements Stream -->
            <div style="font-size:12px; color:#cbd5e1; font-weight:600; margin-bottom:6px;">近期广播历史:</div>
            <div class="announcement-history-list" id="ann-history-list">
              ${announcements.map(a => `
                <div class="announcement-item">
                  <span class="ann-time">[${a.time}]</span>
                  <span class="ann-author">${a.author}:</span>
                  <span class="ann-text">${a.text}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Create Task & Manage Groups Card -->
          <div class="card" style="margin-top:16px;">
            <div class="card-title">
              <span>📌 发布新写作任务与组建小组</span>
              <button id="btn-toggle-create-task" style="background:var(--accent-indigo); border:none; color:white; padding:6px 14px; border-radius:6px; font-size:12px; cursor:pointer; font-weight:600;">
                + 发布全新任务
              </button>
            </div>

            <!-- Task List -->
            <div class="task-list-container">
              ${tasks.map(t => `
                <div class="teacher-task-card">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:16px; font-weight:700; color:#38bdf8;">${t.title}</span>
                    <span class="status-badge active">● 协作进行中 (${t.durationMinutes}分钟)</span>
                  </div>
                  <div style="font-size:12px; color:#94a3b8; margin:6px 0;">课程: ${t.course} | 发布时间: ${t.createdAt}</div>
                  <div style="font-size:13px; color:#cbd5e1;">${t.description}</div>

                  <!-- Linked Groups -->
                  <div style="margin-top:12px; padding-top:10px; border-top:1px solid var(--border-glass);">
                    <div style="font-size:12px; font-weight:600; color:#a78bfa; margin-bottom:6px;">已关联教学小组与成员:</div>
                    ${t.groups.map(g => `
                      <div class="group-tag-box">
                        <span style="font-weight:700; color:#f1f5f9;">${g.name}</span>
                        <span style="font-size:11px; color:#06b6d4;">选定主题: ${g.topic}</span>
                        <div style="font-size:11px; color:#94a3b8; margin-top:4px;">
                          小组成员: ${g.members.map(mId => {
                            const u = allUsers.find(x => x.id === mId);
                            return u ? u.name : mId;
                          }).join('、')}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Right Column: Real-time Classroom Monitor & SSRL Analytics -->
        <section class="teacher-right-panel">
          <div class="card">
            <div class="card-title">
              <span>📊 全班各组 SSRL 写作进度与监控看板</span>
              <span style="font-size:12px; color:#34d399;">实时同步更新</span>
            </div>

            <table class="monitor-table">
              <thead>
                <tr>
                  <th>小组名称</th>
                  <th>当前流转阶段</th>
                  <th>总字数</th>
                  <th>贡献度均衡度</th>
                  <th>编辑会议平均分</th>
                  <th>状态预警</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>第1小组 (AI组)</b></td>
                  <td><span class="phase-pill p1">阶段二：学术编辑部</span></td>
                  <td>1,000 字</td>
                  <td>
                    <div style="font-size:11px;">
                      A (42%) | B (31%) | C (27%)
                    </div>
                  </td>
                  <td><span style="color:#f59e0b;">★ 4.0</span></td>
                  <td><span class="alert-tag green">🟢 协作良好</span></td>
                </tr>
                <tr>
                  <td><b>第2小组 (干预组)</b></td>
                  <td><span class="phase-pill p1">阶段二：学术编辑部</span></td>
                  <td>780 字</td>
                  <td>
                    <div style="font-size:11px;">
                      A (60%) | B (30%) | C (10%)
                    </div>
                  </td>
                  <td><span style="color:#f59e0b;">★ 3.0</span></td>
                  <td><span class="alert-tag red">⚠️ 搭便车预警</span></td>
                </tr>
                <tr>
                  <td><b>第3小组 (注意力组)</b></td>
                  <td><span class="phase-pill p2">阶段一：学术拍卖会</span></td>
                  <td>--</td>
                  <td>竞拍投票中</td>
                  <td>--</td>
                  <td><span class="alert-tag yellow">🟡 议题协商中</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  `;

  // Attach Event Listeners
  container.querySelector('#btn-logout').addEventListener('click', () => onLogout());
  container.querySelector('#btn-switch-student-preview').addEventListener('click', () => onSwitchToStudentView());

  const annInput = container.querySelector('#announcement-input');
  const btnSendAnn = container.querySelector('#btn-send-announcement');

  const handlePublishAnn = () => {
    const text = annInput.value.trim();
    if (!text) return;
    authManager.addAnnouncement(text, currentUser.name);
    annInput.value = '';
    renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
  };

  btnSendAnn.addEventListener('click', handlePublishAnn);
  annInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handlePublishAnn();
  });

  const btnCreateTask = container.querySelector('#btn-toggle-create-task');
  btnCreateTask.addEventListener('click', () => {
    const title = prompt('请输入新发布的研究写作任务名称：', '《现代教育技术》期末研究设计方案');
    if (title) {
      const desc = prompt('请输入任务要求描述：', '要求150分钟内完成课题方案编写并参与答辩。');
      authManager.createTask(title, '现代教育技术 2026春', desc || '协作编写任务', [
        {
          id: 'group_' + Date.now(),
          name: '第2小组 (新创建组)',
          topic: '待竞拍确定',
          members: ['u_studentA', 'u_studentB', 'u_studentC']
        }
      ]);
      renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
    }
  });
}
