/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Clean Chat Log CSV Exporter (Only Chat Stream Dialogue, Excludes System Logs)
 */

const STORAGE_KEY_USER = 'jizhi_current_user';
const STORAGE_KEY_USERS_DB = 'jizhi_users_db';
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
      {
        id: 'group_1',
        name: '第1小组 (AI与协作写作研究组)',
        members: ['u_studentA', 'u_studentB', 'u_studentC'],
        topic: '协作学习中的“搭便车”现象：基于注意力分配与AI感知视角'
      },
      {
        id: 'group_2',
        name: '第2小组 (生成式AI提问教学组)',
        members: [],
        topic: '待定课题'
      }
    ]
  }
];

const DefaultUsers = [
  { id: 'u_teacher1', email: 'teacher@jizhi.edu', password: '123', name: '张教授 (主讲教师)', role: 'teacher', avatar: '👩‍🏫' },
  { id: 'u_studentA', email: 'studentA@jizhi.edu', password: '123', name: '李明 (学生A/组长)', role: 'student', studentCode: 'A', avatar: '👨‍🎓', classId: 'class_101', groupId: 'group_1' },
  { id: 'u_studentB', email: 'studentB@jizhi.edu', password: '123', name: '王芳 (学生B/组员)', role: 'student', studentCode: 'B', avatar: '👩‍🎓', classId: 'class_101', groupId: 'group_1' },
  { id: 'u_studentC', email: 'studentC@jizhi.edu', password: '123', name: '陈强 (学生C/组员)', role: 'student', studentCode: 'C', avatar: '🧑‍🎓', classId: 'class_101', groupId: 'group_1' }
];

const DefaultTasks = [
  {
    id: 'task_001',
    title: '《现代教育技术》期末协作研究设计方案编写',
    classId: 'class_101',
    className: '《现代教育技术》2026春01班',
    durationMinutes: 150,
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
    readStatus: { 'group_1': false, 'group_2': false }
  }
];

export class AuthManager {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    if (!localStorage.getItem(STORAGE_KEY_USERS_DB)) {
      localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(DefaultUsers));
    }
    if (!localStorage.getItem(STORAGE_KEY_CLASSES)) {
      localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(DefaultClasses));
    }
    if (!localStorage.getItem(STORAGE_KEY_TASKS)) {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(DefaultTasks));
    }
    if (!localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS)) {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(DefaultAnnouncements));
    }
  }

  getUsers() { return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB)) || DefaultUsers; }
  getClasses() { return JSON.parse(localStorage.getItem(STORAGE_KEY_CLASSES)) || DefaultClasses; }
  getTasks() { return JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS)) || DefaultTasks; }
  getAnnouncements() { return JSON.parse(localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS)) || DefaultAnnouncements; }

  getCurrentUser() {
    const data = localStorage.getItem(STORAGE_KEY_USER);
    return data ? JSON.parse(data) : null;
  }

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: '账号或密码错误，请核对后重试！' };
  }

  register(name, email, password, role) {
    const users = this.getUsers();
    if (users.some(u => u.email === email)) {
      return { success: false, message: '该邮箱已被注册，请直接登录！' };
    }

    const newUser = {
      id: 'u_' + Date.now(),
      email, password, name, role,
      avatar: role === 'teacher' ? '👨‍🏫' : '🎓',
      studentCode: role === 'student' ? 'A' : null,
      classId: 'class_101', groupId: 'group_1'
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }

  logout() { localStorage.removeItem(STORAGE_KEY_USER); }

  createTask(title, classId, instructions, resourcesList) {
    const tasks = this.getTasks();
    const classes = this.getClasses();
    const targetClass = classes.find(c => c.id === classId) || classes[0];

    const newTask = {
      id: 'task_' + Date.now(),
      title, classId: targetClass.id, className: targetClass.name,
      durationMinutes: 150, status: 'in_progress', createdAt: new Date().toLocaleDateString(),
      instructions, resources: resourcesList || [{ name: '研究设计指导文件.pdf', size: '1.2MB' }]
    };

    tasks.unshift(newTask);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    return newTask;
  }

  publishAnnouncement(taskId, title, content, attachmentObj) {
    const annList = this.getAnnouncements();
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId) || tasks[0];

    const newAnn = {
      id: 'ann_' + Date.now(),
      taskId: task.id, taskTitle: task.title, title, content,
      attachment: attachmentObj || { name: '补充教学参考资料.pdf', size: '1.5MB' },
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: '教师端', readStatus: { 'group_1': false, 'group_2': false }
    };

    annList.unshift(newAnn);
    localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(newAnn));
    return newAnn;
  }

  markAnnouncementRead(annId, groupId = 'group_1') {
    const annList = this.getAnnouncements();
    const ann = annList.find(a => a.id === annId);
    if (ann) {
      if (!ann.readStatus) ann.readStatus = {};
      ann.readStatus[groupId] = true;
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(annList));
    }
  }

  /**
   * Pure Chat Dialogue Log Exporter for Excel (.csv)
   * Strictly exports 3 columns: [名字, 时间, 内容] from the chat stream dialogs
   */
  exportGroupChatLogsToExcel(groupId, chatLogs) {
    let csvContent = '\uFEFF'; // UTF-8 BOM
    csvContent += `"名字","时间","内容"\n`;

    const nameMapping = {
      'A': '李明 (学生A/组长)',
      'B': '王芳 (学生B/组员)',
      'C': '陈强 (学生C/组员)',
      'auctioneer': '拍卖师 Agent',
      'managingEditor': '责任编辑 Agent',
      'reviewingEditor': '审稿编辑 Agent',
      'proponent': '正方委员 Agent',
      'opponent': '反方委员 Agent',
      'neutral': '中间委员 Agent'
    };

    ['stage1', 'stage2', 'stage3'].forEach(stageKey => {
      const logs = chatLogs[stageKey] || [];
      logs.forEach(msg => {
        // Exclude system logs/noise if any, keeping purely chat dialogues
        if (msg.sender && msg.text) {
          const name = nameMapping[msg.sender] || msg.sender;
          const time = msg.timestamp || '14:00';
          const content = (msg.text || '').replace(/"/g, '""');

          csvContent += `"${name}","${time}","${content}"\n`;
        }
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `第1小组_纯聊天记录表格_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
