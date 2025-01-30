# PostHog Capture 配置说明

## 配置文件

服务使用 JSON 格式的配置文件，默认为 `config.json`。可以通过 `-config` 命令行参数指定其他配置文件路径。

### 配置项说明

```json
{
    "port": 8000,                        // 服务监听端口
    "kafka_brokers": [                   // Kafka 代理地址列表
        "localhost:9092"
    ],
    "kafka_topics": {                    // Kafka 主题配置
        "events_plugin_ingestion": "clickhouse_events",              // 普通事件主题
        "session_recordings": "clickhouse_session_recording_events", // 会话录制主题
        "historical_events": "historical_events",                    // 历史事件主题
        "client_warnings": "client_warnings",                        // 客户端警告主题
        "exceptions": "exceptions",                                  // 异常主题
        "heatmaps": "heatmaps",                                     // 热图主题
        "replay_overflow": "replay_overflow"                         // 重放溢出主题
    },
    "redis_addr": "localhost:6379",      // Redis 服务器地址
    "redis_password": "",                // Redis 密码（可选）
    "redis_db": 0,                       // Redis 数据库编号
    "max_request_size": 20,              // 最大请求大小（MB）
    "max_event_size": 2097152,          // 单个事件最大大小（字节，2MB）
    "log_config": {                      // 日志配置
        "dir": "./logs",                 // 日志目录
        "file": "capture.log",           // 日志文件名
        "max_size": 100,                 // 日志文件最大大小（MB）
        "console_output": true,          // 是否输出到控制台
        "level": "info"                  // 日志级别
    }
}
```

## 环境变量支持

配置项也可以通过环境变量设置，环境变量优先级高于配置文件。

| 环境变量 | 说明 | 默认值 |
|---------|------|--------|
| PORT | 服务端口 | 8000 |
| KAFKA_BROKERS | Kafka 代理地址（逗号分隔） | localhost:9092 |
| REDIS_ADDR | Redis 地址 | localhost:6379 |
| REDIS_PASSWORD | Redis 密码 | - |
| REDIS_DB | Redis 数据库编号 | 0 |
| MAX_REQUEST_SIZE | 最大请求大小（MB） | 20 |
| MAX_EVENT_SIZE | 最大事件大小（字节） | 2097152 |
| LOG_DIR | 日志目录 | ./logs |
| LOG_FILE | 日志文件名 | capture.log |
| LOG_LEVEL | 日志级别 | info |

## 配置最佳实践

### Kafka 配置

1. **主题配置**
   - `clickhouse_events`: 用于普通事件的处理
   - `clickhouse_session_recording_events`: 用于会话录制和快照事件
   - 其他主题根据具体业务需求配置

2. **事件处理**
   - 批处理大小和超时时间可调整
   - 默认批处理大小：1（调试模式）
   - 默认批处理超时：1000ms

### Redis 配置

1. **去重配置**
   - 事件去重过期时间：24小时
   - 使用事件的 distinctID、事件名和时间戳作为唯一标识

2. **速率限制**
   - 支持按 token 和事件类型进行限制
   - 可配置溢出限制器

### 日志配置

1. **日志级别**
   - 支持的级别：debug、info、warn、error
   - 建议生产环境使用 info 级别
   - 调试时可使用 debug 级别

2. **日志输出**
   - 支持同时输出到文件和控制台
   - 支持日志文件大小限制和轮转

### 安全限制

1. **事件大小限制**
   - 单个事件最大 2MB
   - 可通过配置调整限制

2. **请求处理**
   - 支持 gzip 压缩
   - 大于 1KB 的属性自动使用 gzip 压缩

## 监控指标

1. **Kafka 指标**
   - 消息发送成功率
   - 消息延迟
   - 消息大小分布

2. **处理指标**
   - 事件处理速率
   - 批处理性能
   - 错误率统计

## 开发环境配置

1. **本地开发**
   - 使用单节点 Kafka（KRaft 模式）
   - 使用本地 Redis
   - 启用控制台日志输出

2. **调试设置**
   - 设置较小的批处理大小
   - 缩短批处理超时时间
   - 使用 debug 日志级别