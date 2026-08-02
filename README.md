# 集智 (JIZHI) - 多智能体支持的协作写作平台 (VS Code 专用版)

这是一个基于 **SSRL（共享调节学习）理论** 设计的多智能体支持协作写作平台前端项目。

---

## 🛠️ 如何在 VS Code 中打开与运行

项目目录绝对路径：
`/Users/yun/.gemini/antigravity/scratch/jizhi-platform`

### 方式 1：快捷使用 VS Code Live Server 插件（最推荐 ⚡）
1. 在 VS Code 中点击菜单栏 **文件 (File) -> 打开文件夹 (Open Folder...)**。
2. 选择该项目文件夹 `jizhi-platform`。
3. 在左侧文件树中找到 **`index.html`**，右键选择 **"Open with Live Server"**（需提前安装 Live Server 插件）。
4. 浏览器会自动打开网页进入平台！

---

### 方式 2：使用一键 Python 脚本启动
1. 在 VS Code 的文件列表中找到 **`server.py`**。
2. 右键该文件，选择 **"在终端中运行 Python 文件" (Run Python File in Terminal)**。
3. 脚本会自动为你开启本地服务并弹出浏览器访问 `http://localhost:8000`！

---

### 方式 3：使用 VS Code 内置终端 (Terminal)
1. 在 VS Code 中按 `Ctrl + ~`（或点击菜单 **终端 -> 新建终端**）。
2. 输入以下命令并按回车：
   ```bash
   python3 -m http.server 8000
   ```
3. 在浏览器打开 `http://localhost:8000` 即可！

---

## 📁 目录结构说明

```
jizhi-platform/
├── .vscode/               # VS Code 专属配置文件 (自动关联)
│   ├── launch.json        # 按 F5 直接在 Chrome 调试运行
│   └── settings.json      # Live Server 端口及格式化配置
├── css/
│   └── styles.css         # 极客 Glassmorphic 样式表
├── js/
│   ├── agents.js          # 5 大智能体 Prompt 与回复逻辑
│   ├── app.js             # 主控制器（包含演示快进 1x/5x/10x）
│   ├── state.js           # SSRL 全局状态与文档数据
│   └── ui.js              # 画布与对话面板动态渲染器
├── index.html             # 应用主入口
├── package.json           # 项目包配置文件
└── server.py              # 一键启动 Python 服务器脚本
```
