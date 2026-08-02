/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Authentication, User Roles & Local Storage Persistence
 */

const STORAGE_KEY_USER = 'jizhi_current_user';
const STORAGE_KEY_USERS_DB = 'jizhi_users_db';
const STORAGE_KEY_TASKS = 'jizhi_tasks_db';
const STORAGE_KEY_ANNOUNCEMENTS = 'jizhi_announcements';

// Initial Seed Users
const DefaultUsers = [
  { id: 'u_teacher1', email: 'teacher@jizhi.edu', password: '123', name: '张教授 (课程主讲)', role: 'teacher', avatar: '👩‍🏫' },
  { id: 'u_studentA', email: 'studentA@jizhi.edu', password: '123', name: '学生A (李明/组长)', role: 'student', studentCode: 'A', avatar: '👨‍🎓' },
  { id: 'u_studentB', email: 'studentB@jizhi.edu', password: '123', name: '学生B (王芳/组员)', role: 'student', studentCode: 'B', avatar: '👩‍🎓' },
  { id: 'u_studentC', email: 'studentC@jizhi.edu', password: '123', name: '学生C (陈强/组员)', role: 'student', studentCode: 'C', avatar: '🧑‍🎓' }
];

// Initial Tasks & Groups
const DefaultTasks = [
  {
    id: 'task_001',
    title: '《现代教育技术》课程期末研究设计方案协作编写',
    course: '现代教育技术 2026春',
    durationMinutes: 150,
    status: 'in_progress', // 'draft' | 'in_progress' | 'completed'
    createdAt: new Date().toLocaleDateString(),
    description: '请在150分钟内，以小组为单位完成一份包含研究背景、研究问题、文献综述、研究设计、不足反思与参考文献的高质量研究方案。',
    groups: [
      {
        id: 'group_1',
        name: '第1小组 (AI与协作写作研究组)',
        topic: '协作学习中的“搭便车”现象：基于注意力分配与AI感知视角',
        members: ['u_studentA', 'u_studentB', 'u_studentC']
      }
    ]
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
    if (!localStorage.getItem(STORAGE_KEY_TASKS)) {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(DefaultTasks));
    }
    if (!localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS)) {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify([
        { id: 'ann_1', text: '📢 [教师通知]: 欢迎同学们进入集智多智能体平台！请组长先在“学术拍卖会”阶段确认研究方案选题。', time: '14:00', author: '张教授' }
      ]));
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_USERS_DB)) || DefaultUsers;
  }

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
      email,
      password,
      name,
      role, // 'teacher' | 'student'
      avatar: role === 'teacher' ? '👨‍🏫' : '🎓',
      studentCode: role === 'student' ? 'A' : null
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY_USERS_DB, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    return { success: true, user: newUser };
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY_USER);
  }

  // Task & Group Management
  getTasks() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_TASKS)) || DefaultTasks;
  }

  createTask(title, course, description, groupsData) {
    const tasks = this.getTasks();
    const newTask = {
      id: 'task_' + Date.now(),
      title,
      course,
      durationMinutes: 150,
      status: 'in_progress',
      createdAt: new Date().toLocaleDateString(),
      description,
      groups: groupsData || []
    };
    tasks.unshift(newTask);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    return newTask;
  }

  // Announcements
  getAnnouncements() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS)) || [];
  }

  addAnnouncement(text, authorName = '教师') {
    const list = this.getAnnouncements();
    const newAnn = {
      id: 'ann_' + Date.now(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: authorName
    };
    list.unshift(newAnn);
    localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(list));
    return newAnn;
  }
}
