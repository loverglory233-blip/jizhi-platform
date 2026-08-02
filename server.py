#!/usr/bin/env python3
"""
集智 (JIZHI) - VS Code 一键本地服务器启动脚本
在 VS Code 中右键此文件，点击 "Run Python File in Terminal" 即可运行！
"""
import http.server
import socketserver
import webbrowser
import os

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

if __name__ == "__main__":
    print(f"🚀 集智多智能体平台正在启动...")
    print(f"📍 项目本地根目录: {DIRECTORY}")
    print(f"🌐 访问地址: http://localhost:{PORT}")
    print("💡 提示: 按 Ctrl+C 可停止服务器\n")
    
    # 自动打开浏览器
    webbrowser.open(f"http://localhost:{PORT}")
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止运行。")
