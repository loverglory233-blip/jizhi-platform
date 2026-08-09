#!/usr/bin/env python3
"""
Jizhi (集智) Multi-Agent Collaborative Writing Platform
High-Performance Multi-Threaded Real-Time Sync Server (Port 8088)
"""

import http.server
import socketserver
import json
import os
import time
import threading
from queue import Queue

PORT = 8088
DIR = os.path.dirname(os.path.abspath(__file__))

# Active SSE client queues: { groupId: set(queue1, queue2, ...) }
SSE_CLIENTS = {}
SSE_LOCK = threading.Lock()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIR, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # ⚡ 禁用 JS/CSS 强缓存，确保每次 git push 部署后浏览器刷新 100% 获取最新代码
        if self.path.endswith(('.js', '.css')):
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
        elif self.path.endswith(('.png', '.jpg', '.ico', '.woff2')):
            self.send_header('Cache-Control', 'public, max-age=86400')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # ⚡ SSE (Server-Sent Events) 毫秒级长连接推送通道
        if '/api/stream' in self.path:
            groupId = 'group_1'
            if 'groupId=' in self.path:
                groupId = self.path.split('groupId=')[1].split('&')[0]

            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.end_headers()

            q = Queue()
            with SSE_LOCK:
                if groupId not in SSE_CLIENTS:
                    SSE_CLIENTS[groupId] = set()
                SSE_CLIENTS[groupId].add(q)

            try:
                # 建立连接心跳
                self.wfile.write(b': ping\n\n')
                self.wfile.flush()

                while True:
                    try:
                        msg = q.get(timeout=25)
                        self.wfile.write(f'data: {msg}\n\n'.encode('utf-8'))
                        self.wfile.flush()
                    except Exception:
                        # 定时心跳保持长连接不中断
                        self.wfile.write(b': ping\n\n')
                        self.wfile.flush()
            except (ConnectionResetError, BrokenPipeError, Exception):
                pass
            finally:
                with SSE_LOCK:
                    if groupId in SSE_CLIENTS:
                        SSE_CLIENTS[groupId].discard(q)
            return

        if '/api/snapshot' in self.path:
            groupId = 'group_1'
            if 'groupId=' in self.path:
                groupId = self.path.split('groupId=')[1].split('&')[0]
            db_file = os.path.join(DIR, f'db_{groupId}.json')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            if os.path.exists(db_file):
                with open(db_file, 'r', encoding='utf-8') as f:
                    self.wfile.write(f.read().encode('utf-8'))
            else:
                self.wfile.write(b'{"timestamp":0}')
            return

        super().do_GET()

    def do_POST(self):
        # 🚀 直连 GitHub 原生 Webhook 自动部署接口 (8088 端口原生支持)
        if '/api/webhook' in self.path or '/webhook' in self.path:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(b'{"status":"ok","message":"Webhook received"}')
            def do_git_pull():
                import subprocess
                try:
                    subprocess.run(['git', 'config', '--global', '--add', 'safe.directory', DIR], check=False)
                    subprocess.run(['git', 'fetch', '--all'], cwd=DIR, check=False)
                    res = subprocess.run(['git', 'reset', '--hard', 'origin/main'], cwd=DIR, capture_output=True, text=True, check=False)
                    print(f"✅ GitHub Webhook 触发代码自动重置更新: {res.stdout.strip()}", flush=True)
                except Exception as e:
                    print(f"❌ Webhook 自动拉取失败: {e}", flush=True)
            threading.Thread(target=do_git_pull).start()
            return

        if '/api/snapshot' in self.path:
            groupId = 'group_1'
            if 'groupId=' in self.path:
                groupId = self.path.split('groupId=')[1].split('&')[0]
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length)
            db_file = os.path.join(DIR, f'db_{groupId}.json')
            try:
                data = json.loads(body.decode('utf-8'))
                body_str = body.decode('utf-8')
                with open(db_file, 'w', encoding='utf-8') as f:
                    f.write(body_str)

                # ⚡ 收到数据更新时，瞬间向所有已连线设备广播推送到界面（<50ms）
                with SSE_LOCK:
                    if groupId in SSE_CLIENTS:
                        dead_queues = set()
                        for q in list(SSE_CLIENTS[groupId]):
                            try:
                                q.put_nowait(body_str)
                            except Exception:
                                dead_queues.add(q)
                        SSE_CLIENTS[groupId].difference_update(dead_queues)

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'timestamp': data.get('timestamp', time.time())}).encode())
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        super().do_POST()

    def log_message(self, format, *args):
        pass  # 静默日志

class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    allow_reuse_address = True
    daemon_threads = True

def git_auto_pull_daemon():
    print("🔄 GitHub 自动检测服务已启动 (每 10 秒自动同步 GitHub 最新提交)...", flush=True)
    while True:
        try:
            time.sleep(10)
            subprocess.run(['git', 'config', '--global', '--add', 'safe.directory', DIR], check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            subprocess.run(['git', 'fetch', 'origin', 'main'], cwd=DIR, check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

            local_head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=DIR).decode().strip()
            remote_head = subprocess.check_output(['git', 'rev-parse', 'origin/main'], cwd=DIR).decode().strip()

            if local_head != remote_head:
                print(f"🚀 检测到 GitHub 新代码 [{remote_head[:7]}]，自动拉取更新中...", flush=True)
                res = subprocess.run(['git', 'reset', '--hard', 'origin/main'], cwd=DIR, capture_output=True, text=True, check=False)
                print(f"✅ GitHub 代码已全自动同步: {res.stdout.strip()}", flush=True)
        except Exception as e:
            pass

if __name__ == '__main__':
    # 启动后台自动代码检测与更新守护线程
    threading.Thread(target=git_auto_pull_daemon, daemon=True).start()

    print(f'🚀 集智多线程+SSE毫秒级实时服务器运行在端口 {PORT}...', flush=True)
    with ThreadingTCPServer(('0.0.0.0', PORT), Handler) as httpd:
        httpd.serve_forever()
