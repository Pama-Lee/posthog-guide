 # PostHog Capture 部署指南

## 环境要求

### 系统要求
- 操作系统：Linux/Unix
- CPU：2+ 核心
- 内存：4GB+
- 磁盘：20GB+

### 依赖服务
- Kafka 2.8+
- Redis 6.0+
- Prometheus（可选，用于监控）

## 部署步骤

### 1. 准备工作

1. **安装 Go 环境**
```bash
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

2. **获取源代码**
```bash
git clone <repository_url>
cd capture
```

3. **安装依赖**
```bash
go mod download
go mod verify
```

### 2. 配置服务

1. **创建配置文件**
```bash
cp config.example.json config.json
```

2. **修改配置**
```json
{
    "port": 8000,
    "kafka_brokers": ["kafka1:9092", "kafka2:9092"],
    "kafka_topics": {
        "events_plugin_ingestion": "events_plugin_ingestion",
        "session_recordings": "session_recordings"
    },
    "redis_addr": "redis:6379",
    "redis_password": "your_password",
    "redis_db": 0,
    "max_request_size": 20,
    "max_event_size": 20971520
}
```

### 3. 构建服务

1. **本地构建**
```bash
go build -o capture
```

2. **Docker 构建**
```bash
docker build -t posthog-capture .
```

### 4. 运行服务

1. **直接运行**
```bash
./capture -config config.json
```

2. **使用 Docker 运行**
```bash
docker run -d \
    --name posthog-capture \
    -p 8000:8000 \
    -v $(pwd)/config.json:/app/config.json \
    posthog-capture
```

3. **使用 Docker Compose**
```yaml
version: '3'
services:
  capture:
    image: posthog-capture
    ports:
      - "8000:8000"
    volumes:
      - ./config.json:/app/config.json
    depends_on:
      - kafka
      - redis
```

### 5. 验证部署

1. **健康检查**
```bash
curl http://localhost:8000/_readiness
curl http://localhost:8000/_liveness
```

2. **发送测试事件**
```bash
curl -X POST http://localhost:8000/e/ \
    -H "Content-Type: application/json" \
    -d '{
        "event": "test_event",
        "properties": {
            "distinct_id": "test_user"
        }
    }'
```

## 监控设置

### 1. Prometheus 配置

```yaml
scrape_configs:
  - job_name: 'posthog-capture'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'
```

### 2. Grafana 设置

1. 添加 Prometheus 数据源
2. 导入推荐的仪表板
3. 配置告警规则

## 运维建议

### 1. 日志管理

- 使用 logrotate 管理日志文件
- 配置适当的日志级别
- 定期清理旧日志

### 2. 备份策略

- 定期备份配置文件
- 保存 Kafka 消息副本
- 备份 Redis 数据

### 3. 扩展性建议

- 使用负载均衡器分发流量
- 配置多个服务实例
- 监控系统资源使用情况

### 4. 安全建议

1. **网络安全**
   - 配置防火墙规则
   - 使用 HTTPS
   - 限制访问来源

2. **认证安全**
   - 使用强密码
   - 定期轮换密钥
   - 限制访问权限

3. **系统安全**
   - 及时更新系统
   - 最小权限原则
   - 定期安全审计

## 故障排除

### 常见问题

1. **服务无法启动**
   - 检查配置文件
   - 验证依赖服务状态
   - 查看错误日志

2. **性能问题**
   - 检查系统资源
   - 优化配置参数
   - 分析监控指标

3. **连接问题**
   - 验证网络连接
   - 检查防火墙规则
   - 测试依赖服务

### 调试工具

1. **日志查看**
```bash
tail -f /var/log/capture.log
```

2. **指标查询**
```bash
curl http://localhost:8000/metrics
```

3. **性能分析**
```bash
go tool pprof http://localhost:8000/debug/pprof/profile
```