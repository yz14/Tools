#!/usr/bin/env python3
"""
支持 Range 请求的简单 HTTP 服务器
用于音乐播放器的音频文件 seek 功能
"""

import os
import re
from http.server import HTTPServer, SimpleHTTPRequestHandler
from functools import partial

class RangeHTTPRequestHandler(SimpleHTTPRequestHandler):
    """支持 Range 请求的 HTTP 请求处理器"""
    
    def do_GET(self):
        """处理 GET 请求"""
        # API: 获取可用的播放列表
        if self.path == '/api/playlists':
            self.send_playlists_list()
            return
        
        # 其他请求走默认处理
        super().do_GET()
    
    def send_playlists_list(self):
        """返回当前目录下所有 .json 播放列表文件"""
        import json
        import glob
        
        # 查找当前目录下所有 .json 文件
        json_files = glob.glob('*.json')
        
        # 提取文件名（不含扩展名），过滤掉非播放列表文件
        playlists = []
        for f in json_files:
            name = os.path.splitext(f)[0]
            # 尝试验证是否是有效的播放列表格式
            try:
                with open(f, 'r', encoding='utf-8') as file:
                    data = json.load(file)
                    if 'musicList' in data:
                        playlists.append(name)
            except:
                pass
        
        # 确保 music 在第一位（如果存在）
        if 'music' in playlists:
            playlists.remove('music')
            playlists.insert(0, 'music')
        
        response = json.dumps({'playlists': playlists})
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', len(response.encode()))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(response.encode())
    
    def send_head(self):
        """处理 HEAD 和 GET 请求的公共代码"""
        path = self.translate_path(self.path)
        
        if os.path.isdir(path):
            # 目录处理
            return super().send_head()
        
        if not os.path.exists(path):
            self.send_error(404, "File not found")
            return None
        
        # 获取文件信息
        file_size = os.path.getsize(path)
        
        # 检查 Range 请求头
        range_header = self.headers.get('Range')
        
        if range_header:
            # 解析 Range 头
            range_match = re.match(r'bytes=(\d*)-(\d*)', range_header)
            if range_match:
                start = range_match.group(1)
                end = range_match.group(2)
                
                start = int(start) if start else 0
                end = int(end) if end else file_size - 1
                
                # 确保范围有效
                if start >= file_size:
                    self.send_error(416, "Requested Range Not Satisfiable")
                    return None
                
                end = min(end, file_size - 1)
                content_length = end - start + 1
                
                # 发送 206 Partial Content 响应
                self.send_response(206)
                self.send_header("Content-Type", self.guess_type(path))
                self.send_header("Content-Length", str(content_length))
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                
                # 返回文件对象，定位到起始位置
                f = open(path, 'rb')
                f.seek(start)
                return _RangeFile(f, content_length)
        
        # 普通请求，返回完整文件
        self.send_response(200)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Length", str(file_size))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        
        return open(path, 'rb')
    
    def end_headers(self):
        # 添加 CORS 头
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Range")
        super().end_headers()
    
    def do_OPTIONS(self):
        """处理 OPTIONS 预检请求"""
        self.send_response(200)
        self.end_headers()


class _RangeFile:
    """包装文件对象，限制读取的字节数"""
    def __init__(self, f, length):
        self.f = f
        self.remaining = length
    
    def read(self, size=-1):
        if self.remaining <= 0:
            return b''
        if size < 0 or size > self.remaining:
            size = self.remaining
        data = self.f.read(size)
        self.remaining -= len(data)
        return data
    
    def close(self):
        self.f.close()


def run(port=8080, directory=None):
    """启动服务器"""
    if directory:
        os.chdir(directory)
    
    handler = RangeHTTPRequestHandler
    server = HTTPServer(('', port), handler)
    
    print(f"🎵 音乐播放器服务器启动")
    print(f"📍 地址: http://localhost:{port}")
    print(f"📂 目录: {os.getcwd()}")
    print(f"✅ 支持 Range 请求（音频 seek 功能）")
    print(f"\n按 Ctrl+C 停止服务器...")
    
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
        server.shutdown()


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description='支持 Range 请求的 HTTP 服务器')
    parser.add_argument('-p', '--port', type=int, default=4001, help='端口号 (默认: 4001)')
    parser.add_argument('-d', '--directory', type=str, default=None, help='服务目录')
    args = parser.parse_args()
    
    run(port=args.port, directory=args.directory)
