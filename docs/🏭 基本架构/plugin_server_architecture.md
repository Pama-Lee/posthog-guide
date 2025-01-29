# PostHog Plugin Server 架构说明

## 命名由来

Plugin Server 的命名反映了它最初的核心功能 - 作为 PostHog 的插件系统服务器。虽然现在它的功能已经远超出了单纯的插件管理，但这个名字仍然保留下来作为历史见证。

## 核心功能

Plugin Server 目前承担了以下四个主要功能：

1. **数据摄入(Ingestion)**
   - 调用插件处理数据
   - 将事件和用户数据写入 ClickHouse 和 PostgreSQL
   - 管理数据缓冲和批处理

2. **定时任务(Scheduled Tasks)**
   - 处理 runEveryX 类型的插件任务
   - 管理定时执行的插件功能

3. **插件作业处理(Plugin Jobs)**
   - 处理插件相关的后台任务
   - 管理插件的生命周期

4. **异步插件任务(Async Tasks)**
   - 处理 onEvent 类型的插件任务
   - 基于 ClickHouse events topic 触发

## 运行模式

Plugin Server 支持两种主要运行模式：

1. **Ingestion 模式**
   ```bash
   PLUGIN_SERVER_MODE=ingestion
   ```
   - 仅运行数据摄入功能
   - 适用于需要高性能数据摄入的场景

2. **Async 模式**
   ```bash
   PLUGIN_SERVER_MODE=async
   ```
   - 处理所有异步任务(定时任务、插件作业、异步插件任务)
   - 基于 ClickHouse events topic 触发任务

如果不设置 PLUGIN_SERVER_MODE，则会执行所有功能。

## 主要组件

1. **IngestionConsumer**
   - 负责数据摄入的核心组件
   - 处理事件的接收和处理
   - 管理数据流控和溢出处理

2. **EventPipelineRunner**
   - 事件处理管道
   - 确保事件按正确的顺序处理
   - 处理插件的事件处理逻辑

3. **SessionRecordingIngester**
   - 处理会话录制数据
   - 管理录制数据的存储和处理

## 配置要求

Plugin Server 需要与主 PostHog 服务器共享以下配置：

- DATABASE_URL
- REDIS_URL 
- KAFKA_HOSTS
- CLICKHOUSE_HOST
- CLICKHOUSE_DATABASE
- CLICKHOUSE_USER
- CLICKHOUSE_PASSWORD

## 高并发处理

1. **模式分离**
   - 通过分离 ingestion 和 async 模式实现更好的扩展性
   - 允许独立扩展数据摄入和任务处理能力

2. **溢出处理**
   - 提供多种溢出处理模式(IngestionOverflowMode)
   - 支持基于队列的背压机制

3. **批处理机制**
   - 支持事件批量处理
   - 提供可配置的缓冲区大小和刷新间隔

## 开发和测试

1. **开发环境设置**
   - 提供完整的开发环境配置指南
   - 支持自动重载模式便于开发

2. **测试支持**
   - 包含完整的单元测试和功能测试
   - 提供测试数据库迁移工具

3. **监控和调试**
   - 详细的日志记录
   - 性能指标收集
   - 支持分布式追踪 