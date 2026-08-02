/**
 * Jizhi (集智) Multi-Agent Collaborative Writing Platform
 * Authentication & Login Modal View
 */

export function renderLoginView(container, authManager, onLoginSuccess) {
  container.innerHTML = `
    <div class="login-page-overlay">
      <div class="login-card-box">
        <div class="login-brand-header">
          <div class="login-logo">集智 JIZHI</div>
          <div class="login-subtitle">多智能体支持的在线协作写作平台 (SSRL 支撑)</div>
        </div>

        <!-- Role Tabs -->
        <div class="login-tabs">
          <button class="login-tab-btn active" data-tab="login">账号登录</button>
          <button class="login-tab-btn" data-tab="register">注册新账号</button>
        </div>

        <!-- Login Form -->
        <form class="login-form" id="form-login">
          <div class="form-group">
            <label>登录邮箱 / 账号</label>
            <input type="email" id="login-email" class="form-control" value="teacher@jizhi.edu" required placeholder="请输入注册邮箱 (例: teacher@jizhi.edu)">
          </div>

          <div class="form-group">
            <label>密码</label>
            <input type="password" id="login-password" class="form-control" value="123" required placeholder="请输入密码">
          </div>

          <div id="login-error-msg" class="error-msg" style="display:none;"></div>

          <button type="submit" class="btn-primary" style="margin-top:10px; padding:12px; font-size:15px; font-weight:700;">
            🚀 登录平台
          </button>
        </form>

        <!-- Register Form -->
        <form class="login-form" id="form-register" style="display:none;">
          <div class="form-group">
            <label>姓名</label>
            <input type="text" id="reg-name" class="form-control" placeholder="请输入你的姓名 (例: 张老师 / 李同学)" required>
          </div>

          <div class="form-group">
            <label>注册邮箱</label>
            <input type="email" id="reg-email" class="form-control" placeholder="请输入邮箱" required>
          </div>

          <div class="form-group">
            <label>设置密码</label>
            <input type="password" id="reg-password" class="form-control" placeholder="设置登录密码" required>
          </div>

          <div class="form-group">
            <label>角色身份</label>
            <select id="reg-role" class="form-control" style="background:#0f172a; color:white;">
              <option value="student">🎓 学生端 (Student)</option>
              <option value="teacher">👩‍🏫 教师端 (Teacher)</option>
            </select>
          </div>

          <div id="reg-error-msg" class="error-msg" style="display:none;"></div>

          <button type="submit" class="btn-primary" style="margin-top:10px; padding:12px; font-size:15px; font-weight:700;">
            ✅ 完成注册并登录
          </button>
        </form>

        <!-- Quick Demo Switcher Section -->
        <div class="demo-accounts-section">
          <div style="font-size:12px; color:#94a3b8; margin-bottom:8px; text-align:center;">💡 快捷体验演示账号 (一键登录):</div>
          <div class="demo-btn-grid">
            <button class="demo-login-btn" data-email="teacher@jizhi.edu" data-pass="123">
              👩‍🏫 教师端 (张教授)
            </button>
            <button class="demo-login-btn" data-email="studentA@jizhi.edu" data-pass="123">
              👨‍🎓 学生A (李明/组长)
            </button>
            <button class="demo-login-btn" data-email="studentB@jizhi.edu" data-pass="123">
              👩‍🎓 学生B (王芳/组员)
            </button>
            <button class="demo-login-btn" data-email="studentC@jizhi.edu" data-pass="123">
              🧑‍🎓 学生C (陈强/组员)
            </button>
          </div>
        </div>

      </div>
    </div>
  `;

  // Attach Event Listeners for Tabs
  const loginTab = container.querySelector('[data-tab="login"]');
  const regTab = container.querySelector('[data-tab="register"]');
  const loginForm = container.querySelector('#form-login');
  const regForm = container.querySelector('#form-register');

  loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    regTab.classList.remove('active');
    loginForm.style.display = 'block';
    regForm.style.display = 'none';
  });

  regTab.addEventListener('click', () => {
    regTab.classList.add('active');
    loginTab.classList.remove('active');
    regForm.style.display = 'block';
    loginForm.style.display = 'none';
  });

  // Login Submit
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = container.querySelector('#login-email').value.trim();
    const pass = container.querySelector('#login-password').value.trim();
    const res = authManager.login(email, pass);
    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      const errBox = container.querySelector('#login-error-msg');
      errBox.style.display = 'block';
      errBox.textContent = res.message;
    }
  });

  // Register Submit
  regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = container.querySelector('#reg-name').value.trim();
    const email = container.querySelector('#reg-email').value.trim();
    const pass = container.querySelector('#reg-password').value.trim();
    const role = container.querySelector('#reg-role').value;
    const res = authManager.register(name, email, pass, role);
    if (res.success) {
      onLoginSuccess(res.user);
    } else {
      const errBox = container.querySelector('#reg-error-msg');
      errBox.style.display = 'block';
      errBox.textContent = res.message;
    }
  });

  // Demo Login Buttons
  container.querySelectorAll('.demo-login-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const email = btn.dataset.email;
      const pass = btn.dataset.pass;
      const res = authManager.login(email, pass);
      if (res.success) {
        onLoginSuccess(res.user);
      }
    });
  });
}
