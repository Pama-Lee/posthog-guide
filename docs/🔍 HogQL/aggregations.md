# HogQL 聚合函数

## 聚合函数概述

HogQL 提供了丰富的聚合函数，用于数据分析和统计。这些函数基于 ClickHouse 的聚合函数，并进行了优化和扩展。

## 标准聚合函数

### 1. 基础统计函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `count` | 计数 | `count()` |
| `countIf` | 条件计数 | `countIf(properties.$browser = 'Chrome')` |
| `min` | 最小值 | `min(timestamp)` |
| `max` | 最大值 | `max(timestamp)` |
| `sum` | 求和 | `sum(properties.$value)` |
| `avg` | 平均值 | `avg(properties.$value)` |

### 2. 条件聚合函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `minIf` | 条件最小值 | `minIf(timestamp, event = 'pageview')` |
| `maxIf` | 条件最大值 | `maxIf(timestamp, event = 'pageview')` |
| `sumIf` | 条件求和 | `sumIf(properties.$value, properties.$currency = 'USD')` |
| `avgIf` | 条件平均值 | `avgIf(properties.$value, properties.$currency = 'USD')` |

### 3. 统计学函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `stddevPop` | 总体标准差 | `stddevPop(properties.$value)` |
| `stddevSamp` | 样本标准差 | `stddevSamp(properties.$value)` |
| `varPop` | 总体方差 | `varPop(properties.$value)` |
| `varSamp` | 样本方差 | `varSamp(properties.$value)` |

## ClickHouse 特有聚合函数

### 1. 数组和集合函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `groupArray` | 将值收集到数组 | `groupArray(distinct_id)` |
| `groupUniqArray` | 将唯一值收集到数组 | `groupUniqArray(distinct_id)` |
| `uniq` | 近似唯一值计数 | `uniq(distinct_id)` |
| `uniqExact` | 精确唯一值计数 | `uniqExact(distinct_id)` |

### 2. 位运算聚合函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `groupBitAnd` | 按位与 | `groupBitAnd(properties.$flags)` |
| `groupBitOr` | 按位或 | `groupBitOr(properties.$flags)` |
| `groupBitXor` | 按位异或 | `groupBitXor(properties.$flags)` |

### 3. 高级统计函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `skewPop` | 总体偏度 | `skewPop(properties.$value)` |
| `kurtPop` | 总体峰度 | `kurtPop(properties.$value)` |
| `simpleLinearRegression` | 简单线性回归 | `simpleLinearRegression(x, y)` |

## 实用示例

### 1. 用户活跃度分析

```sql
SELECT
    toDate(timestamp) as date,
    uniqExact(distinct_id) as unique_users,
    countIf(event = 'pageview') as pageviews,
    avgIf(properties.$session_duration, event = 'session_end') as avg_session_duration
FROM events
GROUP BY date
ORDER BY date DESC
```

### 2. 收入统计

```sql
SELECT
    toStartOfMonth(timestamp) as month,
    sumIf(properties.$amount, properties.$currency = 'USD') as revenue_usd,
    countIf(event = 'purchase') as purchase_count
FROM events
GROUP BY month
ORDER BY month DESC
```

### 3. 用户行为分析

```sql
SELECT
    person_id,
    groupArray(event) as event_sequence,
    uniq(properties.$current_url) as unique_pages_visited,
    max(timestamp) as last_seen
FROM events
GROUP BY person_id
```

## 性能优化建议

1. **选择合适的聚合函数**：
   - 使用 `uniq` 而不是 `uniqExact` 处理大规模数据
   - 使用条件聚合函数而不是 WHERE 子句
   - 避免不必要的精确计算

2. **数据预处理**：
   - 使用适当的数据类型
   - 提前过滤无关数据
   - 合理使用索引

3. **查询优化**：
   - 合理设置 GROUP BY 字段
   - 使用合适的排序键
   - 控制返回数据量

## 最佳实践

1. **数据质量**：
   - 处理异常值
   - 考虑空值情况
   - 验证数据类型

2. **性能考虑**：
   - 选择合适的聚合粒度
   - 使用高效的聚合函数
   - 注意内存使用

3. **可维护性**：
   - 添加适当的注释
   - 使用清晰的命名
   - 保持查询结构清晰 