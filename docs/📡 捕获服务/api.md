# PostHog Capture API 文档

## API 端点

### 1. 事件捕获接口

#### 普通事件捕获

```
POST /e/
POST /e
GET /e/
GET /e
POST /engage
GET /engage
POST /track
GET /track
POST /i/v0/e/
POST /i/v0/e
GET /i/v0/e/
GET /i/v0/e
POST /capture/
POST /capture
```

**功能说明**：
- 接收分析事件数据
- 支持单个事件、事件数组和批量事件
- 支持历史数据迁移
- 支持事件去重
- `/i/v0/e` 是为了兼容性保留的旧版本 API

**请求格式**：

单个事件：
```json
{
    "event": "事件名称",
    "properties": {
        "distinct_id": "用户标识",
        "token": "项目令牌",
        "key1": "value1",
        "key2": "value2"
    },
    "timestamp": "2024-03-21T12:00:00Z",
    "uuid": "事件唯一标识",
    "distinct_id": "用户标识",
    "ip": "用户IP"
}
```

事件数组：
```json
[
    {
        "event": "事件名称1",
        "properties": {...},
        "timestamp": "2024-03-21T12:00:00Z"
    },
    {
        "event": "事件名称2",
        "properties": {...},
        "timestamp": "2024-03-21T12:01:00Z"
    }
]
```

批量事件：
```json
{
    "token": "项目令牌",
    "batch": [
        {
            "event": "事件名称1",
            "properties": {...}
        },
        {
            "event": "事件名称2",
            "properties": {...}
        }
    ],
    "historical_migration": false
}
```

**响应格式**：
```json
{
    "code": 1,
    "status": "ok"
}
```

#### 会话录制事件

```
POST /s/
POST /s
GET /s/
GET /s
POST /capture/recording/
POST /capture/recording
```

**功能说明**：
- 接收会话录制和快照数据
- 支持数据压缩
- 自动处理大数据量

**请求格式**：
```json
{
    "event": "$snapshot",
    "properties": {
        "distinct_id": "用户标识",
        "token": "项目令牌",
        "$session_id": "会话ID",
        "$snapshot_data": []
    },
    "timestamp": "2024-03-21T12:00:00Z"
}
```

### 2. 健康检查接口

```
GET /
GET /_readiness
GET /_liveness
GET /health
```

**响应**：
- 200 OK: 服务正常
- 503 Service Unavailable: 服务异常

## 请求处理说明

### 认证方式

项目令牌（Token）可以通过以下方式提供：
1. 请求头 `Token`
2. 事件属性中的 `token` 字段
3. 批量事件中的顶级 `token` 字段

### 数据格式

1. **Content-Type**:
   - `application/json`
   - `application/x-www-form-urlencoded`（支持 Base64 编码的数据）

2. **数据大小限制**:
   - 单个事件最大 2MB
   - 支持 gzip 压缩

### 事件处理

1. **事件验证**:
   - 事件名称必填且长度不超过 200 字符
   - 事件大小不超过配置的最大限制

2. **去重处理**:
   - 基于 distinctID、事件名称和时间戳
   - 去重有效期 24 小时

3. **配额控制**:
   - 按 token 和事件类型限制
   - 支持溢出保护

4. **批处理机制**:
   - 支持单条和批量处理
   - 批处理超时时间可配置
   - 失败事件自动重试

### 错误处理

常见错误响应：
- 400 Bad Request: 请求格式错误
- 413 Payload Too Large: 请求体超过大小限制
- 429 Too Many Requests: 超出速率限制
- 500 Internal Server Error: 服务器内部错误

### 性能优化

1. **压缩处理**:
   - 支持请求体 gzip 压缩
   - 大于 1KB 的属性自动压缩

2. **异步处理**:
   - 事件异步发送到 Kafka
   - 支持批量处理和重试机制

3. **缓存优化**:
   - 使用 Redis 进行事件去重
   - 配额和速率限制使用 Redis 实现 