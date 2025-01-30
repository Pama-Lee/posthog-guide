# Nginx 配置说明

## 配置概述

本配置文件用于在 PostHog 部署中实现请求转发和负载均衡，主要处理两类服务：
1. PostHog 主服务（Web 服务）
2. Capture 事件捕获服务

## 服务配置

### 上游服务定义

```nginx
upstream posthog_web {
    server localhost:8000;    # PostHog 主服务
}

upstream posthog_capture {
    server localhost:8001;    # Capture 事件捕获服务
}
```

## 路由规则

### 1. 事件捕获路由

所有事件相关的请求都会转发到 Capture 服务：

- `/e/` 和 `/e`：标准事件捕获
- `/engage`：用户属性更新
- `/track`：事件追踪
- `/s/` 和 `/s`：会话录制
- `/i/v0/e/`：兼容性 API
- `/capture/`：新版捕获 API

配置示例：
```nginx
location ~ ^/(e|engage|track|s|i/v0/e|capture)/ {
    proxy_pass http://posthog_capture;
    # ... 其他配置
}
```

### 2. 主服务路由

其他所有请求都转发到 PostHog 主服务：

- 静态文件（`/static/`）
- 配置文件（`/config.json`）
- API 请求
- Web 界面

配置示例：
```nginx
location / {
    proxy_pass http://posthog_web;
    # ... 其他配置
}
```

## 性能优化

### 1. GZIP 压缩

启用了 GZIP 压缩以减少传输大小：
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### 2. 缓存配置

1. **静态文件**：
   ```nginx
   location /static/ {
       expires 1y;
       add_header Cache-Control "public, no-transform";
   }
   ```

2. **配置文件**：
   ```nginx
   location /config.json {
       expires -1;
       add_header Cache-Control "no-cache";
   }
   ```

## 安全配置

### 1. CORS 配置

为事件捕获接口配置了跨域支持：
```nginx
add_header 'Access-Control-Allow-Origin' '*' always;
add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
```

### 2. 请求限制

- 最大请求体积：20MB
- 超时设置：300秒
- 连接数限制：10240

## 日志配置

### 1. 访问日志

```nginx
log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent" "$http_x_forwarded_for"';
```

### 2. 错误日志

```nginx
error_log /var/log/nginx/error.log warn;
```

## 健康检查

提供了基本的健康检查端点：
```nginx
location /health {
    access_log off;
    return 200 'ok';
}
```

## 部署说明

### 1. 文件位置

- 配置文件：`/etc/nginx/nginx.conf`
- 访问日志：`/var/log/nginx/access.log`
- 错误日志：`/var/log/nginx/error.log`

### 2. 启动命令

```bash
# 测试配置
nginx -t

# 启动 Nginx
nginx

# 重新加载配置
nginx -s reload

# 停止服务
nginx -s stop
```

### 3. 配置检查清单

- [ ] 确认上游服务地址和端口
- [ ] 检查日志路径权限
- [ ] 验证 SSL 证书（如果启用 HTTPS）
- [ ] 测试 CORS 配置
- [ ] 确认缓存策略
- [ ] 验证健康检查端点

## 参考配置

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 10240;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    keepalive_timeout 65;
    client_max_body_size 20M;
    proxy_read_timeout 300;
    proxy_connect_timeout 300;
    proxy_send_timeout 300;

    # GZIP 配置
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    upstream posthog_web {
        server localhost:8000;
    }

    upstream posthog_capture {
        server localhost:8001;
    }

    server {
        listen 80;
        server_name _;
        
        # 健康检查
        location /health {
            access_log off;
            return 200 'ok';
        }

        # 事件捕获路由 - 转发到 Capture 服务
        location ~ ^/(e|engage|track|s|i/v0/e|capture)/ {
            proxy_pass http://posthog_capture;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 允许跨域
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
            add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

            # 处理 OPTIONS 请求
            if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' '*';
                add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
                add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain; charset=utf-8';
                add_header 'Content-Length' 0;
                return 204;
            }
        }

        # 静态文件和其他请求 - 转发到 PostHog 主服务
        location / {
            proxy_pass http://posthog_web;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 静态文件缓存
            location /static/ {
                expires 1y;
                add_header Cache-Control "public, no-transform";
            }

            # 配置文件
            location /config.json {
                expires -1;
                add_header Cache-Control "no-cache";
            }
        }
    }
} 
```
