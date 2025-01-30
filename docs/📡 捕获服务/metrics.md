 # PostHog Capture 监控指标

## Prometheus 指标

### 事件相关指标

1. **事件接收计数**
```
capture_events_received_total{type="<event_type>"}
```
- 类型：Counter
- 标签：
  - type: "event" 或 "recording"
- 说明：接收到的事件总数

2. **事件丢弃计数**
```
capture_events_dropped_total{cause="<cause>"}
```
- 类型：Counter
- 标签：
  - cause: 丢弃原因（如 "size_exceeded", "quota_limited" 等）
- 说明：被丢弃的事件数量

3. **事件大小分布**
```
capture_event_size_bytes{type="<event_type>"}
```
- 类型：Histogram
- 标签：
  - type: "event" 或 "recording"
- Buckets: [1024, 5120, 10240, 51200, 102400, 512000, 1048576, 5242880, 10485760]
- 说明：事件大小分布情况

### 请求处理指标

1. **请求处理时间**
```
capture_request_duration_seconds{path="<path>",method="<method>"}
```
- 类型：Histogram
- 标签：
  - path: 请求路径
  - method: HTTP 方法
- 说明：请求处理耗时分布

2. **Kafka 生产者错误**
```
capture_kafka_producer_errors_total
```
- 类型：Counter
- 说明：Kafka 生产者错误总数

### Redis 操作指标

1. **Redis 操作延迟**
```
capture_redis_operation_duration_seconds{operation="<operation>"}
```
- 类型：Histogram
- 标签：
  - operation: 操作类型
- 说明：Redis 操作耗时分布

### 配额和限制指标

1. **配额限制计数**
```
capture_quota_limited_total{type="<type>",token="<token>"}
```
- 类型：Counter
- 标签：
  - type: 事件类型
  - token: API 令牌
- 说明：因配额限制而被拒绝的请求数

2. **Token 验证结果**
```
capture_token_validation_total{result="<result>"}
```
- 类型：Counter
- 标签：
  - result: "success" 或 "failure"
- 说明：Token 验证结果统计

### 处理错误指标

1. **处理错误计数**
```
capture_processing_errors_total{type="<type>",error="<error>"}
```
- 类型：Counter
- 标签：
  - type: 事件类型
  - error: 错误类型
- 说明：事件处理错误统计

## 监控面板

### 推荐的 Grafana 面板配置

1. **总体概览**
- 事件接收速率
- 错误率
- 响应时间 P95/P99
- 配额限制情况

2. **性能监控**
- Redis 操作延迟
- Kafka 生产延迟
- 请求处理时间分布
- 事件大小分布

3. **错误追踪**
- 各类错误数量
- Token 验证失败率
- Kafka 错误率
- Redis 错误率

4. **容量规划**
- 事件吞吐量趋势
- 存储使用趋势
- 配额使用情况
- 资源使用率

## 告警规则

### 关键告警

1. **高错误率**
```
rate(capture_processing_errors_total[5m]) > 0.1
```

2. **高延迟**
```
histogram_quantile(0.95, rate(capture_request_duration_seconds_bucket[5m])) > 1
```

3. **Kafka 错误**
```
rate(capture_kafka_producer_errors_total[5m]) > 0
```

### 警告级别告警

1. **配额限制增加**
```
rate(capture_quota_limited_total[1h]) > rate(capture_quota_limited_total[1h] offset 1h)
```

2. **事件丢弃率高**
```
rate(capture_events_dropped_total[5m]) / rate(capture_events_received_total[5m]) > 0.05
```

## 监控最佳实践

1. **数据保留**
- 原始指标数据保留 15 天
- 聚合数据保留 90 天
- 重要事件永久存储

2. **采样率**
- 一般指标 15s 采样
- 详细指标 1min 采样
- 长期趋势 5min 采样

3. **告警配置**
- 设置合适的告警阈值
- 配置告警升级机制
- 建立告警响应流程
- 定期审查告警规则