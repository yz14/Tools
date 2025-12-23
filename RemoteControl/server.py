"""
远程控制服务端
- 屏幕捕获并通过WebSocket传输
- 接收键鼠事件并执行
- 支持 ngrok 内网穿透（外网访问）
"""

import io
import json
import time
import logging
import threading
import socket
from typing import Optional

from flask import Flask, send_file, request
from flask_sock import Sock
from PIL import Image
import mss
import pyautogui

# ============================================================
# 配置
# ============================================================

CONFIG = {
    "host": "0.0.0.0",      # 监听所有网卡
    "port": 5000,           # 服务端口
    "fps": 10,              # 目标帧率
    "quality": 60,          # JPEG压缩质量 (1-100)
    "scale": 0.5,           # 缩放比例 (降低分辨率减少带宽)
    "password": "",         # 访问密码 (空字符串表示不需要密码)
    "use_ngrok": True,      # 是否启用 ngrok 内网穿透
    "ngrok_token": "37ErQNKdBtbVSE5d7NNJVkWbICu_7Lguv4dFobyBbKCwaa7iZ",      # ngrok authtoken (从 https://ngrok.com 获取)
}

# ============================================================
# 日志配置
# ============================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger(__name__)

# ============================================================
# 全局状态
# ============================================================

app = Flask(__name__)
sock = Sock(app)

# 屏幕信息
screen_info = {
    "width": 0,
    "height": 0,
    "scaled_width": 0,
    "scaled_height": 0,
}

# pyautogui 安全设置
pyautogui.FAILSAFE = False  # 禁用左上角紧急停止
pyautogui.PAUSE = 0         # 禁用操作间隔

# ============================================================
# 工具函数
# ============================================================

def get_local_ip() -> str:
    """获取本机局域网IP"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


def init_screen_info():
    """初始化屏幕信息"""
    with mss.mss() as sct:
        monitor = sct.monitors[1]  # 主显示器
        screen_info["width"] = monitor["width"]
        screen_info["height"] = monitor["height"]
        screen_info["scaled_width"] = int(monitor["width"] * CONFIG["scale"])
        screen_info["scaled_height"] = int(monitor["height"] * CONFIG["scale"])
    logger.info(f"屏幕尺寸: {screen_info['width']}x{screen_info['height']}")
    logger.info(f"传输尺寸: {screen_info['scaled_width']}x{screen_info['scaled_height']}")


def capture_screen() -> bytes:
    """捕获屏幕并返回JPEG字节"""
    with mss.mss() as sct:
        monitor = sct.monitors[1]
        screenshot = sct.grab(monitor)
        img = Image.frombytes("RGB", screenshot.size, screenshot.bgra, "raw", "BGRX")
    
    # 缩放
    if CONFIG["scale"] != 1.0:
        new_size = (screen_info["scaled_width"], screen_info["scaled_height"])
        img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    # 压缩为JPEG
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=CONFIG["quality"], optimize=True)
    return buffer.getvalue()


def handle_mouse_event(data: dict):
    """处理鼠标事件"""
    event_type = data.get("type")
    # 将缩放后的坐标转换回实际屏幕坐标
    x = int(data.get("x", 0) / CONFIG["scale"])
    y = int(data.get("y", 0) / CONFIG["scale"])
    
    # 确保坐标在屏幕范围内
    x = max(0, min(x, screen_info["width"] - 1))
    y = max(0, min(y, screen_info["height"] - 1))
    
    if event_type == "click":
        button = data.get("button", "left")
        pyautogui.click(x, y, button=button)
        logger.debug(f"点击: ({x}, {y}) 按键: {button}")
    
    elif event_type == "doubleclick":
        pyautogui.doubleClick(x, y)
        logger.debug(f"双击: ({x}, {y})")
    
    elif event_type == "move":
        pyautogui.moveTo(x, y)
    
    elif event_type == "scroll":
        delta = data.get("delta", 0)
        pyautogui.scroll(delta, x, y)
        logger.debug(f"滚动: ({x}, {y}) delta: {delta}")
    
    elif event_type == "drag":
        pyautogui.moveTo(x, y)
        pyautogui.mouseDown()
    
    elif event_type == "dragend":
        pyautogui.mouseUp()




def handle_keyboard_event(data: dict):
    """处理键盘事件"""
    event_type = data.get("type")
    key = data.get("key", "")
    
    # 处理文本输入（整段文字）
    if event_type == "text":
        text = data.get("text", "")
        if text:
            # 使用 pyperclip + 粘贴 来输入文本（支持中文）
            try:
                import pyperclip
                pyperclip.copy(text)
                pyautogui.hotkey("ctrl", "v")
                logger.info(f"输入文本: {text[:20]}{'...' if len(text) > 20 else ''}")
            except Exception as e:
                # 备用方案：逐字符输入（仅支持ASCII）
                pyautogui.write(text, interval=0.02)
                logger.info(f"输入文本(ASCII): {text}")
        return
    
    # 特殊键映射
    special_keys = {
        "Enter": "enter",
        "Backspace": "backspace",
        "Tab": "tab",
        "Escape": "escape",
        "ArrowUp": "up",
        "ArrowDown": "down",
        "ArrowLeft": "left",
        "ArrowRight": "right",
        "Delete": "delete",
        "Home": "home",
        "End": "end",
        "PageUp": "pageup",
        "PageDown": "pagedown",
        "F1": "f1", "F2": "f2", "F3": "f3", "F4": "f4",
        "F5": "f5", "F6": "f6", "F7": "f7", "F8": "f8",
        "F9": "f9", "F10": "f10", "F11": "f11", "F12": "f12",
        " ": "space",
    }
    
    mapped_key = special_keys.get(key, key)
    
    if event_type == "keydown":
        # 处理组合键
        modifiers = []
        if data.get("ctrl"):
            modifiers.append("ctrl")
        if data.get("alt"):
            modifiers.append("alt")
        if data.get("shift"):
            modifiers.append("shift")
        
        if modifiers:
            pyautogui.hotkey(*modifiers, mapped_key)
            logger.debug(f"组合键: {'+'.join(modifiers)}+{mapped_key}")
        else:
            pyautogui.press(mapped_key)
            logger.debug(f"按键: {mapped_key}")


# ============================================================
# 路由
# ============================================================

@app.route("/")
def index():
    """返回控制页面"""
    return send_file("index.html")


@app.route("/info")
def info():
    """返回屏幕信息"""
    return json.dumps({
        "width": screen_info["scaled_width"],
        "height": screen_info["scaled_height"],
        "realWidth": screen_info["width"],
        "realHeight": screen_info["height"],
    })


@sock.route("/ws")
def websocket(ws):
    """WebSocket处理"""
    client_ip = request.remote_addr
    logger.info(f"客户端连接: {client_ip}")
    
    # 密码验证
    if CONFIG["password"]:
        try:
            auth_msg = ws.receive(timeout=10)
            auth_data = json.loads(auth_msg)
            if auth_data.get("password") != CONFIG["password"]:
                ws.send(json.dumps({"type": "auth", "success": False}))
                logger.warning(f"认证失败: {client_ip}")
                return
            ws.send(json.dumps({"type": "auth", "success": True}))
        except Exception as e:
            logger.error(f"认证错误: {e}")
            return
    
    # 发送屏幕信息
    ws.send(json.dumps({
        "type": "info",
        "width": screen_info["scaled_width"],
        "height": screen_info["scaled_height"],
    }))
    
    # 启动屏幕推送线程
    stop_event = threading.Event()
    
    def push_screen():
        frame_interval = 1.0 / CONFIG["fps"]
        while not stop_event.is_set():
            try:
                start = time.time()
                frame_data = capture_screen()
                ws.send(frame_data)
                elapsed = time.time() - start
                sleep_time = max(0, frame_interval - elapsed)
                time.sleep(sleep_time)
            except Exception as e:
                logger.error(f"推送屏幕错误: {e}")
                break
    
    push_thread = threading.Thread(target=push_screen, daemon=True)
    push_thread.start()
    
    # 接收控制事件
    try:
        while True:
            message = ws.receive()
            if message is None:
                break
            
            try:
                data = json.loads(message)
                event_category = data.get("category")
                
                if event_category == "mouse":
                    handle_mouse_event(data)
                elif event_category == "keyboard":
                    handle_keyboard_event(data)
            except json.JSONDecodeError:
                logger.warning(f"无效的JSON消息")
            except Exception as e:
                logger.error(f"处理事件错误: {e}")
    
    except Exception as e:
        logger.info(f"客户端断开: {client_ip} ({e})")
    finally:
        stop_event.set()
        push_thread.join(timeout=1)
        logger.info(f"客户端断开: {client_ip}")


# ============================================================
# 主函数
# ============================================================

def start_ngrok(port: int) -> str:
    """启动 ngrok 隧道，返回公网URL"""
    try:
        from pyngrok import ngrok, conf
        
        # 如果配置了 authtoken，先设置
        if CONFIG["ngrok_token"]:
            ngrok.set_auth_token(CONFIG["ngrok_token"])
            logger.info("已使用配置的 ngrok authtoken")
        
        # 关闭已存在的隧道
        try:
            tunnels = ngrok.get_tunnels()
            for tunnel in tunnels:
                ngrok.disconnect(tunnel.public_url)
        except Exception:
            pass
        
        # 创建隧道
        tunnel = ngrok.connect(port, "http")
        public_url = tunnel.public_url
        
        # 如果是 http，ngrok 也会提供 https
        if public_url.startswith("http://"):
            public_url = public_url.replace("http://", "https://")
        
        return public_url
    
    except Exception as e:
        logger.error(f"ngrok 启动失败: {e}")
        print("\n" + "=" * 60)
        print("  ngrok 需要配置 authtoken (免费)")
        print("=" * 60)
        print("  1. 访问 https://ngrok.com 注册 (可用GitHub登录)")
        print("  2. 登录后进入 Dashboard -> Your Authtoken")
        print("  3. 复制 authtoken 填入 CONFIG['ngrok_token']")
        print("=" * 60 + "\n")
        return None


def main():
    """启动服务"""
    init_screen_info()
    
    local_ip = get_local_ip()
    ngrok_url = None
    
    # 启动 ngrok
    if CONFIG["use_ngrok"]:
        print("正在启动 ngrok 内网穿透...")
        ngrok_url = start_ngrok(CONFIG["port"])
    
    print("\n" + "=" * 60)
    print("  远程控制服务已启动")
    print("=" * 60)
    print(f"  本机访问: http://127.0.0.1:{CONFIG['port']}")
    print(f"  局域网:   http://{local_ip}:{CONFIG['port']}")
    
    if ngrok_url:
        print("\n  ★ 外网访问 (手机用这个):")
        print(f"    {ngrok_url}")
    else:
        print("\n  ⚠ ngrok 未启动，仅支持局域网访问")
    
    print("=" * 60)
    print("  按 Ctrl+C 停止服务")
    print("=" * 60 + "\n")
    
    app.run(
        host=CONFIG["host"],
        port=CONFIG["port"],
        debug=False,
        threaded=True
    )


if __name__ == "__main__":
    main()
