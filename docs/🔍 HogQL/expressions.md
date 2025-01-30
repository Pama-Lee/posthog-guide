# HogQL 表达式指南

## 表达式概述

HogQL 表达式是一种强大的数据访问和处理工具，它允许您直接访问、修改和聚合数据。这些表达式可以在 PostHog 的多个功能中使用，包括过滤器、趋势分析、数据分组等。

## 常用函数

### 1. 比较函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `if(条件, 真值, 假值)` | 条件判断 | `if(properties.$os == 'iOS', '苹果', '其他')` |
| `multiIf(条件1, 值1, 条件2, 值2, ..., 默认值)` | 多重条件判断 | `multiIf(properties.$os == 'iOS', '苹果', properties.$os == 'Android', '安卓', '其他')` |
| `in(值, 集合)` | 检查值是否在集合中 | `in(properties.$browser, ['Chrome', 'Firefox'])` |
| `match(值, 正则表达式)` | 正则表达式匹配 | `match(properties.$current_url, '^/blog/')` |
| `like` | 模式匹配 | `properties.$current_url like '%/blog%'` |

### 2. 聚合函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `count` | 计数 | `count()` |
| `count(distinct)` | 去重计数 | `count(distinct person_id)` |
| `uniq` | 近似去重计数 | `uniq(person_id)` |
| `sum` | 求和 | `sum(properties.$value)` |
| `avg` | 平均值 | `avg(properties.$value)` |
| `median` | 中位数 | `median(properties.$value)` |

### 3. 字符串函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `extract(字符串, 模式)` | 提取匹配内容 | `extract(properties.$current_url, 'ref=([^&]*)')` |
| `concat(字符串1, 字符串2, ...)` | 字符串连接 | `concat(person.properties.$name, ' - ', properties.$browser)` |
| `splitByChar(分隔符, 字符串)` | 字符串分割 | `splitByChar(',', properties.tags)` |
| `replaceOne(字符串, 查找, 替换)` | 替换第一个匹配 | `replaceOne(properties.$current_url, 'https://', '')` |

### 4. 日期函数

| 函数 | 说明 | 示例 |
|------|------|------|
| `dateDiff('单位', 开始日期, 结束日期)` | 计算日期差 | `dateDiff('day', person.created_at, now())` |
| `toHour(timestamp)` | 提取小时 | `toHour(timestamp)` |
| `now()` | 当前时间 | `now()` |
| `today()` | 今天日期 | `today()` |
| `interval` | 时间间隔 | `now() - interval 7 day` |

## 实用示例

### 1. 用户分组

```sql
multiIf(
    properties.$device_type == 'Desktop', '桌面端',
    properties.$os == 'iOS', 'iOS设备',
    properties.$os == 'Android', '安卓设备',
    '其他'
)
```

### 2. URL 分析

```sql
extract(properties.$current_url, 'utm_source=([^&]*)')
```

### 3. 时间段分析

```sql
multiIf(
    toHour(timestamp) < 6, '凌晨',
    toHour(timestamp) < 12, '上午',
    toHour(timestamp) < 18, '下午',
    '晚上'
)
```

### 4. 复合条件过滤

```sql
properties.$browser = 'Chrome' 
AND dateDiff('day', timestamp, now()) <= 7
AND person.properties.is_active = true
```

### 5. 数据转换

```sql
toString(properties.$value)
toFloat(properties.$amount)
toDate(properties.$signup_date)
```

## 调试技巧

1. **分步调试**：
   - 将复杂表达式拆分为小部分
   - 使用趋势表视图查看中间结果
   - 验证数据类型转换是否正确

2. **常见问题**：
   - 检查属性名称是否正确（注意 `$` 前缀）
   - 验证日期格式是否符合要求
   - 确保聚合函数使用正确

3. **性能优化**：
   - 使用适当的索引字段
   - 避免不必要的类型转换
   - 合理使用聚合函数

