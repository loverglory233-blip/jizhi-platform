/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Teacher Portal - Class Management & Excel CSV Chat Log Exporter (3 Columns: 名字, 时间, 内容)
 */

export function renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView) {
  const currentUser = authManager.getCurrentUser();
  const tasks = authManager.getTasks();
  const announcements = authManager.getAnnouncements();
  const classes = authManager.getClasses();

  container.innerHTML = `
    <div class="teacher-portal-layout">
      <!-- Teacher Header -->
      <header class="teacher-header">
        <div class="brand-section">
          <div class="brand-logo">集智 JIZHI</div>
          <div class="brand-badge teacher-badge">👩‍🏫 教师端管理中心</div>
        </div>

        <div class="teacher-info">
          <span>班级管理: <b>${classes[0] ? classes[0].name : '现代教育技术班'}</b></span>
          <span>主讲教师: <b>${currentUser.name}</b></span>
          <button id="btn-switch-student-preview" style="background:rgba(99,102,241,0.2); border:1px solid #6366f1; color:#a5b4fc; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer;">
            👀 切换至学生协作视角
          </button>
          <button id="btn-logout" style="background:rgba(239,68,68,0.2); border:1px solid #ef4444; color:#fca5a5; padding:6px 12px; border-radius:6px; font-size:12px; cursor:pointer;">
            退出登录
          </button>
        </div>
      </header>

      <!-- Main Content Grid -->
      <main class="teacher-content">
        <!-- Left Panel: Announcements & Task Management -->
        <section class="teacher-left-panel">
          
          <div class="card broadcast-card">
            <div class="card-title">
              <span>📢 课堂任务即时通知发布 (含文件资源 & 已读追踪)</span>
              <button id="btn-open-ann-modal" style="background:linear-gradient(135deg, #10b981, #059669); border:none; color:white; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
                + 发布新通知 (含资源)
              </button>
            </div>

            <div class="announcement-history-list">
              ${announcements.map(a => `
                <div class="teacher-ann-item">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <span style="font-weight:700; color:#38bdf8; font-size:14px;">${a.title}</span>
                    <span style="font-size:11px; color:#94a3b8;">${a.time} | 关联任务: ${a.taskTitle}</span>
                  </div>
                  <div style="font-size:13px; color:#cbd5e1; margin-bottom:6px;">${a.content}</div>
                  
                  ${a.attachment ? `
                    <div style="font-size:12px; color:#a78bfa; background:rgba(139,92,246,0.15); padding:4px 8px; border-radius:4px; display:inline-block; margin-bottom:8px;">
                      📎 附件资源: <b>${a.attachment.name}</b> (${a.attachment.size})
                    </div>
                  ` : ''}

                  <div style="font-size:11px; color:#94a3b8; display:flex; gap:12px; border-top:1px dashed rgba(255,255,255,0.1); padding-top:6px;">
                    <span>已读小组: <b style="color:#4ade80;">${a.readStatus && a.readStatus['group_1'] ? '✅ 第1小组 (已读)' : '无'}</b></span>
                    <span>未读小组: <b style="color:#f87171;">${a.readStatus && !a.readStatus['group_1'] ? '⚠️ 第1小组 (未读)' : '无'}</b></span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="card" style="margin-top:16px;">
            <div class="card-title">
              <span>📌 课程任务发布与班级小组关联</span>
              <button id="btn-open-task-modal" style="background:var(--accent-indigo); border:none; color:white; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
                + 发布新写作任务
              </button>
            </div>

            <div class="task-list-container">
              ${tasks.map(t => `
                <div class="teacher-task-card">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:16px; font-weight:700; color:#38bdf8;">${t.title}</span>
                    <span class="status-badge active">● 教学班: ${t.className}</span>
                  </div>
                  <div style="font-size:12px; color:#94a3b8; margin:6px 0;">时长: ${t.durationMinutes} 分钟 | 发布时间: ${t.createdAt}</div>
                  <div style="font-size:13px; color:#cbd5e1; background:rgba(15,23,42,0.6); padding:8px; border-radius:6px; border-left:3px solid var(--accent-indigo);">
                    <b>任务说明:</b> ${t.instructions}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Right Panel: Real-time Group Monitor & Excel Chat Export -->
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
                <tr>
                  <th>小组名称</th>
                  <th>当前阶段</th>
                  <th>各成员字数贡献</th>
                  <th>编辑会议均分</th>
                  <th>通知已读</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>第1小组 (AI组)</b></td>
                  <td><span class="phase-pill p1">阶段二：学术编辑部</span></td>
                  <td>
                    <div style="font-size:11px;">
                      A (42%) | B (31%) | C (27%)
                    </div>
                  </td>
                  <td><span style="color:#f59e0b;">★ 4.0</span></td>
                  <td>
                    ${announcements[0] && announcements[0].readStatus && announcements[0].readStatus['group_1'] 
                      ? '<span style="color:#4ade80;">✅ 已读</span>' 
                      : '<span style="color:#f87171;">⚠️ 未读</span>'}
                  </td>
                  <td>
                    <button class="export-single-excel-btn" data-group="group_1" style="background:var(--accent-indigo); border:none; color:white; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">
                      导出 Excel
                    </button>
                  </td>
                </tr>
                <tr>
                  <td><b>第2小组 (提问组)</b></td>
                  <td><span class="phase-pill p2">阶段一：学术拍卖会</span></td>
                  <td>竞拍中</td>
                  <td>--</td>
                  <td><span style="color:#f87171;">⚠️ 未读</span></td>
                  <td>
                    <button class="export-single-excel-btn" data-group="group_2" style="background:rgba(255,255,255,0.1); border:none; color:#94a3b8; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">
                      导出 Excel
                    </button>
                  </td>
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

  // Export to Excel CSV
  const exportBtn = container.querySelector('#btn-export-all-excel');
  exportBtn.addEventListener('click', () => {
    authManager.exportGroupChatLogsToExcel('group_1', state.chatLogs);
  });

  container.querySelectorAll('.export-single-excel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      authManager.exportGroupChatLogsToExcel(btn.dataset.group, state.chatLogs);
    });
  });

  // Task Creation Modal
  container.querySelector('#btn-open-task-modal').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box">
        <h3 style="color:#38bdf8; margin-bottom:14px;">📌 发布全新写作任务</h3>
        
        <div class="form-group">
          <label>选择班级</label>
          <select id="modal-task-class" class="form-control" style="background:#0f172a; color:white;">
            ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>任务名称</label>
          <input type="text" id="modal-task-title" class="form-control" value="《现代教育技术》期末协作研究设计" required>
        </div>

        <div class="form-group">
          <label>任务详细说明与要求</label>
          <textarea id="modal-task-desc" class="form-control" style="height:80px;">请在150分钟内完成课题提案、统一契约、协作编写大正文并参与答辩。</textarea>
        </div>

        <div style="display:flex; gap:10px; margin-top:16px;">
          <button class="btn-primary" id="btn-submit-new-task">确认发布任务</button>
          <button id="btn-cancel-task" style="background:rgba(255,255,255,0.1); border:none; color:white; padding:10px; border-radius:6px; cursor:pointer;">取消</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#btn-cancel-task').addEventListener('click', () => document.body.removeChild(modal));
    modal.querySelector('#btn-submit-new-task').addEventListener('click', () => {
      const classId = modal.querySelector('#modal-task-class').value;
      const title = modal.querySelector('#modal-task-title').value;
      const desc = modal.querySelector('#modal-task-desc').value;

      authManager.createTask(title, classId, desc, [{ name: '指南.pdf', size: '1.5MB' }]);
      document.body.removeChild(modal);
      renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
    });
  });

  // Announcement Modal
  container.querySelector('#btn-open-ann-modal').addEventListener('click', () => {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box">
        <h3 style="color:#10b981; margin-bottom:14px;">📢 发布即时通知 (含文件资源 & 学生弹窗提醒)</h3>
        
        <div class="form-group">
          <label>关联任务</label>
          <select id="modal-ann-task" class="form-control" style="background:#0f172a; color:white;">
            ${tasks.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}
          </select>
        </div>

        <div class="form-group">
          <label>通知标题</label>
          <input type="text" id="modal-ann-title" class="form-control" value="📢 教学通知：请及时完成文献与方法衔接" required>
        </div>

        <div class="form-group">
          <label>通知详细内容</label>
          <textarea id="modal-ann-content" class="form-control" style="height:80px;">请各组在后10分钟内集中检查【研究问题与假设】，并点击弹窗确认已读。</textarea>
        </div>

        <div class="form-group">
          <label>发布随附文件资源 (可选)</label>
          <input type="text" id="modal-ann-file" class="form-control" value="协作写作问卷测量规范范例.pdf">
        </div>

        <div style="display:flex; gap:10px; margin-top:16px;">
          <button class="btn-primary" id="btn-submit-new-ann" style="background:linear-gradient(135deg, #10b981, #059669);">广播发布通知并弹窗推送</button>
          <button id="btn-cancel-ann" style="background:rgba(255,255,255,0.1); border:none; color:white; padding:10px; border-radius:6px; cursor:pointer;">取消</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#btn-cancel-ann').addEventListener('click', () => document.body.removeChild(modal));
    modal.querySelector('#btn-submit-new-ann').addEventListener('click', () => {
      const taskId = modal.querySelector('#modal-ann-task').value;
      const title = modal.querySelector('#modal-ann-title').value;
      const content = modal.querySelector('#modal-ann-content').value;
      const fileName = modal.querySelector('#modal-ann-file').value;

      authManager.publishAnnouncement(taskId, title, content, { name: fileName, size: '2.4MB' });
      document.body.removeChild(modal);
      renderTeacherPortal(container, authManager, state, onLogout, onSwitchToStudentView);
    });
  });
}
