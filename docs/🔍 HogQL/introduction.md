# HogQL 简介

HogQL 是 PostHog 基于 ClickHouse SQL 开发的查询语言，它提供了更简单的事件和用户属性访问、空值处理以及可视化集成等增强功能。目前该功能处于公测阶段。

## 核心特性

### 1. HogQL 表达式

HogQL 表达式允许您直接访问、修改和聚合数据。它可以在以下场景中使用：

- 过滤器
- 趋势分析
- 数据分组
- 漏斗聚合
- 用户路径分析
- 会话回放
- 仪表板
- 活动标签页

### 2. SQL 洞察

通过 SQL 洞察功能，您可以使用标准的 SQL 命令（如 `SELECT`、`FROM`、`JOIN`、`WHERE`、`GROUP BY`）直接查询数据，并且可以使用 ClickHouse 的丰富函数库。这使得查询和结果展示更加灵活和可定制。

### 3. 数据仓库集成

HogQL 支持查询多个数据源：
- PostHog 内部数据
- 外部数据源（如 Stripe、Hubspot 等）
- 自定义数据源

## 数据访问

HogQL 可以访问以下数据：

1. **事件属性**：`properties`
2. **用户属性**：`person.properties`
3. **基础字段**：
   - `event`：事件名称
   - `elements_chain`：自动捕获的元素链
   - `timestamp`：时间戳
   - `distinct_id`：唯一标识符
   - `person_id`：用户 ID

## 数据类型

支持的数据类型包括：

- `STRING`（默认）
- `JSON`（支持点号或方括号访问）
- `DATETIME`（ISO 8601 格式）
- `INTEGER`
- `NUMERIC`（浮点数）
- `BOOLEAN`

## 常用操作符

1. **比较运算符**：
   - `=`：等于
   - `!=`：不等于
   - `<`：小于
   - `>=`：大于等于

2. **逻辑运算符**：
   - `AND`：与
   - `OR`：或
   - `IS`：是
   - `NOT`：非

3. **算术运算符**：
   - `+`：加
   - `-`：减
   - `*`：乘
   - `/`：除

## API 查询

要通过 API 使用 HogQL，您需要：

1. 获取项目 ID
2. 创建具有项目查询读取权限的个人 API 密钥
3. 向 `/api/projects/:project_id/query` 端点发送 POST 请求

示例请求：

```bash
curl -X POST "https://us.posthog.com/api/projects/:project_id/query" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <personal_api_key>" \
     -d '{
            "query": {
              "kind": "HogQLQuery", 
              "query": "SELECT event, COUNT() FROM events GROUP BY event ORDER BY COUNT() DESC"
            }
         }'
```

## 最佳实践

1. **性能优化**：
   - 使用适当的索引
   - 优化查询结构
   - 合理使用聚合函数

2. **数据处理**：
   - 使用批量操作
   - 合理设置过滤条件
   - 注意数据类型转换

3. **调试技巧**：
   - 使用趋势表可视化进行调试
   - 将复杂表达式拆分为小部分测试
   - 检查数据类型匹配
