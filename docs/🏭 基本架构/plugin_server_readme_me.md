# PostHog 插件服务器

该服务负责通过插件处理事件等任务。

## 开始使用

让我们快速开始开发插件服务器：

1. 激活来自主 PostHog 仓库的虚拟环境。

1. 运行命令 `pnpm i` 安装依赖并准备启动。

1. 启动 [PostHog](/PostHog/posthog) 的开发实例 - [此处有说明](https://posthog.com/docs/developing-locally)。毕竟这是 _PostHog_ 插件服务器，它与主服务器协同工作。

1. 确保插件服务器配置正确（参见 [配置](#配置)）。以下设置需要在插件服务器和主服务器中保持一致：`DATABASE_URL`、`REDIS_URL`、`KAFKA_HOSTS`、`CLICKHOUSE_HOST`、`CLICKHOUSE_DATABASE`、`CLICKHOUSE_USER` 和 `CLICKHOUSE_PASSWORD`。不过在本地开发中，它们的默认值应该可以正常工作。

1. 使用 `pnpm start:dev` 以自动重载模式启动插件服务器，或使用 `pnpm build && pnpm start:dist` 以编译模式启动，然后开始开发吧！

1. 使用 `pnpm setup:test` 准备运行测试，这将运行必要的迁移。使用 `pnpm test:{1,2}` 运行测试本身。

1. 准备运行功能测试。请参阅下面的说明。

### 运行功能测试

功能测试位于 `functional_tests` 中。它们提供了插件服务器高级功能的测试，即任何插件服务器客户端应能使用的功能。它尽量不假设插件服务器的实现细节。

在撰写本文时，它假设：

1. 事件被推送到 Kafka 主题中。
1. 插件服务器的副作用是更新 ClickHouse 表数据。
1. 插件服务器从 Postgres 表中读取某些数据，例如 `posthog_team`、`posthog_pluginsource` 等。理想情况下，这些数据应封装在某种实现细节无关的 API 中。

它特别不假设运行插件服务器进程的细节，例如运行时栈。

有关如何在 CI 中运行这些测试，请参阅 `bin/ci_functional_tests.sh`。对于本地测试：

1. 运行 docker `docker compose -f docker-compose.dev.yml up`（在 posthog 文件夹中）
1. 设置测试数据库 `pnpm setup:test`
1. 启动插件服务器：
    ```bash
    APP_METRICS_FLUSH_FREQUENCY_MS=0 \
        CLICKHOUSE_DATABASE='default' \
        DATABASE_URL=postgres://posthog:posthog@localhost:5432/test_posthog \
        PLUGINS_DEFAULT_LOG_LEVEL=0 \
        RELOAD_PLUGIN_JITTER_MAX_MS=0 \
        PLUGIN_SERVER_MODE=functional-tests \
        pnpm start:dev
    ```
1. 运行测试：
    ```bash
    CLICKHOUSE_DATABASE='default' \
        DATABASE_URL=postgres://posthog:posthog@localhost:5432/test_posthog \
        pnpm functional_tests --watch
    ```

## CLI 标志

还有一些替代的实用选项来启动插件服务器。每个选项只做一件事。它们按优先级顺序列在下表中。

| 名称    | 描述                                                | CLI 标志         |
| ------- | ---------------------------------------------------------- | ----------------- |
| 帮助    | 显示插件服务器 [配置选项](#配置) | `-h`, `--help`    |
| 版本   | 仅显示当前运行的插件服务器版本          | `-v`, `--version` |
| 迁移   | 迁移 Graphile Worker                                    | `--migrate`       |

## 替代模式

默认情况下，插件服务器负责并执行以下所有任务：

1. 数据摄取（调用插件并将事件和个人数据写入 ClickHouse 和 Postgres，缓冲事件）
2. 计划任务（runEveryX 类型的插件任务）
3. 处理插件作业
4. 异步插件任务（onEvent 插件任务）

在更高规模下，摄取可以拆分为自己的进程。为此，您需要运行两个不同的插件服务器实例，并设置以下环境变量：

| 环境变量                        | 描述                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `PLUGIN_SERVER_MODE=ingestion` | 此插件服务器实例仅运行摄取 (1)                                                                             |
| `PLUGIN_SERVER_MODE=async`     | 此插件服务器处理所有异步任务 (2-4)。请注意，异步插件任务基于 ClickHouse 事件主题触发 |

如果未设置 `PLUGIN_SERVER_MODE`，插件服务器将执行所有任务 (1-4)。

## 配置

您可以使用多种设置来控制插件服务器。将它们作为环境变量使用。

| 名称                                   | 描述                                                                                                                                                                                                    | 默认值                         |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| DATABASE_URL                           | Postgres 数据库 URL                                                                                                                                                                                          | `'postgres://localhost:5432/posthog'` |
| REDIS_URL                              | Redis 存储 URL                                                                                                                                                                                                | `'redis://localhost'`                 |
| BASE_DIR                               | 解析本地插件的基本路径                                                                                                                                                                          | `'.'`                                 |
| WORKER_CONCURRENCY                     | 并发工作线程数                                                                                                                                                                            | `0` – 所有核心                       |
| TASKS_PER_WORKER                       | 每个工作线程的并行任务数                                                                                                                                                                     | `10`                                  |
| REDIS_POOL_MIN_SIZE                    | 每个线程使用的最小 Redis 连接数                                                                                                                                                          | `1`                                   |
| REDIS_POOL_MAX_SIZE                    | 每个线程使用的最大 Redis 连接数                                                                                                                                                          | `3`                                   |
| SCHEDULE_LOCK_TTL                      | 计划任务的锁保持时间（秒）                                                                                                                                                             | `60`                                  |
| PLUGINS_RELOAD_PUBSUB_CHANNEL          | 用于重新加载事件的 Redis 频道                                                                                                                                                                                | `'reload-plugins'`                    |
| CLICKHOUSE_HOST                        | ClickHouse 主机                                                                                                                                                                                                | `'localhost'`                         |
| CLICKHOUSE_OFFLINE_CLUSTER_HOST        | 用于离线工作负载的 ClickHouse 主机。回退到 CLICKHOUSE_HOST                                                                                                                                    | `null`                                |
| CLICKHOUSE_DATABASE                    | ClickHouse 数据库                                                                                                                                                                                            | `'default'`                           |
| CLICKHOUSE_USER                        | ClickHouse 用户名                                                                                                                                                                                            | `'default'`                           |
| CLICKHOUSE_PASSWORD                    | ClickHouse 密码                                                                                                                                                                                            | `null`                                |
| CLICKHOUSE_CA                          | ClickHouse CA 证书                                                                                                                                                                                            | `null`                                |
| CLICKHOUSE_SECURE                      | 是否保护 ClickHouse 连接                                                                                                                                                                        | `false`                               |
| KAFKA_HOSTS                            | 逗号分隔的 Kafka 主机                                                                                                                                                                                    | `null`                                |
| KAFKA_CONSUMPTION_TOPIC                | Kafka 传入事件主题                                                                                                                                                                                    | `'events_plugin_ingestion'`           |
| KAFKA_CLIENT_CERT_B64                  | Kafka 证书（Base64 编码）                                                                                                                                                                                    | `null`                                |
| KAFKA_CLIENT_CERT_KEY_B64              | Kafka 证书密钥（Base64 编码）                                                                                                                                                                                | `null`                                |
| KAFKA_TRUSTED_CERT_B64                 | Kafka 受信任的 CA（Base64 编码）                                                                                                                                                                                     | `null`                                |
| KAFKA_PRODUCER_MAX_QUEUE_SIZE          | Kafka 生产者在刷新前的最大批量大小                                                                                                                                                                  | `20`                                  |
| KAFKA_FLUSH_FREQUENCY_MS               | Kafka 生产者在刷新前的最大批量持续时间                                                                                                                                                              | `500`                                 |
| KAFKA_MAX_MESSAGE_BATCH_SIZE           | Kafka 生产者在刷新前的最大批量大小（字节）                                                                                                                                                         | `900000`                              |
| LOG_LEVEL                              | 最低日志级别                                                                                                                                                                                              | `'info'`                              |
| SENTRY_DSN                             | Sentry 数据接收 URL                                                                                                                                                                                           | `null`                                |
| DISABLE_MMDB                           | 是否禁用 MMDB IP 定位功能                                                                                                                                                               | `false`                               |
| INTERNAL_MMDB_SERVER_PORT              | 用于 IP 定位的内部服务器端口（0 表示随机）                                                                                                                                              | `0`                                   |
| DISTINCT_ID_LRU_SIZE                   | 个人唯一 ID LRU 缓存大小                                                                                                                                                                          | `10000`                               |
| PISCINA_USE_ATOMICS                    | 对应于 piscina useAtomics 配置选项 (https://github.com/piscinajs/piscina#constructor-new-piscinaoptions)                                                                                      | `true`                                |
| PISCINA_ATOMICS_TIMEOUT                | （高级）对应于 piscina 工作线程在寻找任务时应阻塞的时间长度（毫秒） - 高流量实例（每秒 100+ 事件）可能会受益于将此值设置为较低值 | `5000`                                |
| HEALTHCHECK_MAX_STALE_SECONDS          | '插件服务器在健康检查失败前可以多久不摄取事件的最大秒数'                                                                                                     | `7200`                                |
| KAFKA_PARTITIONS_CONSUMED_CONCURRENTLY | （高级）插件服务器应同时从多少个 Kafka 分区消费                                                                                                                        | `1`                                   |
| PLUGIN_SERVER_MODE                     | （高级）参见替代模式部分                                                                                                                                                                       | `null`                                |

## 发布新版本

只需在主分支上增加 `package.json` 中的 `version`，新版本将自动发布，并在 [主 PostHog 仓库](https://github.com/posthog/posthog) 中创建一个匹配的 PR。

建议在 PR 上使用 `bump patch/minor/major` 标签 - 这样在 PR 合并时上述操作将自动完成。

由 GitHub Actions 提供支持。

## 详细说明

故事从 `pluginServer.ts -> startPluginServer` 开始，这是插件服务器的主线程。

该主线程生成 `WORKER_CONCURRENCY` 个工作线程，使用 Piscina 进行管理。每个工作线程运行 `TASKS_PER_WORKER` 个任务（[concurrentTasksPerWorker](https://github.com/piscinajs/piscina#constructor-new-piscinaoptions)）。

### 主线程

首先谈谈主线程。它包含：

1. `pubSub` – Redis 驱动的发布-订阅机制，用于在主 PostHog 应用程序发布消息时重新加载插件。

1. `hub` – 处理与所需数据库和队列（ClickHouse、Kafka、Postgres、Redis）的连接，保存加载的插件。通过 `hub.ts -> createHub` 创建。每个线程都有自己的实例。

1. `piscina` – 这曾经是委托给线程的任务管理器。现在它是一个普通的 JS 函数调用的垫片，将来会被移除。

1. `pluginScheduleControl` – 计划任务控制器。负责在时间到来时为计划任务添加 Piscina 任务。计划信息在创建插件 VM 时进入控制器。

    计划任务使用 [Redlock](https://redis.io/topics/distlock)（基于 Redis 的分布式锁）进行控制，并且在整个集群中仅在一个插件服务器实例上运行。

1. `jobQueueConsumer` – 内部作业队列消费者。这支持重试、在未来调度作业（一次）（注意：这是 `pluginScheduleControl` 和此内部 `jobQueue` 之间的区别）。虽然 `pluginScheduleControl` 通过 `runEveryMinute`、`runEveryHour` 任务触发，但 `jobQueueConsumer` 处理 `meta.jobs.doX(event).runAt(new Date())`。

    作业由 `job-queue-manager.ts` 入队，该管理器由基于 Postgres 的 [Graphile-worker](https://github.com/graphile/worker)（`graphile-queue.ts`）支持。

1. `queue` – 事件摄取队列。这是一个 Celery（由 Redis 支持）或 Kafka 队列，具体取决于设置（EE/Cloud 由于高流量使用 Kafka）。这些由上述 `queue` 消费，并发送到 Piscina 工作线程（`src/main/ingestion-queues/queue.ts -> ingestEvent`）。由于所有实际的摄取都发生在工作线程内部，您可以在那里找到具体的摄取代码（`src/worker/ingestion/ingest-event.ts`）。数据在那里保存到 Postgres（在 EE/Cloud 上通过 Kafka 保存到 ClickHouse）。

    查看此摄取队列的生产者端也是一个好主意，它来自 `posthog/posthog/api/capture.py`。插件服务器从那里获取 `process_event_with_plugins` Celery 任务，在 Postgres 管道中。通过 Kafka 的 ClickHouse 管道通过 Kafka 主题 `events_plugin_ingestion` 获取数据。

1. `mmdbServer` – TCP 服务器，作为位于主线程内存中的 GeoIP MMDB 数据读取器与在同一插件服务器实例的工作线程中运行的插件之间的接口。这样，GeoIP 读取器仅加载在一个线程中，并可在所有线程中使用。此外，此机制确保在开始摄取之前 `mmdbServer` 已准备就绪（从 [http-mmdb](https://github.com/PostHog/http-mmdb) 下载数据库并读取），并在后台保持数据库最新。

> 注意：
> `organization_id` 与 _公司_ 及其 _安装的插件_ 相关联，`team_id` 与 _项目_ 及其 _插件配置_（启用/禁用+额外配置）相关联。

### 修补 node-rdkafka

我们携带了一个 node-rdkafka 补丁，添加了协作重新平衡。要生成此补丁：

    # 设置本地 node-rdkafka 克隆
    git clone git@github.com:PostHog/node-rdkafka.git
    cd node-rdkafka
    git remote add blizzard git@github.com:Blizzard/node-rdkafka.git
    git fetch blizzard

    # 生成差异
    git diff blizzard/master > ~/node-rdkafka.diff

    # 在插件服务器目录中，这将输出一个临时工作目录
    pnpm patch node-rdkafka@2.17.0

    # 进入上一个命令中的临时目录
    cd /private/var/folders/b7/bmmghlpx5qdd6gpyvmz1k1_m0000gn/T/6082767a6879b3b4e11182f944f5cca3

    # 如果询问，跳过任何缺失的文件
    patch -p1 < ~/node-rdkafka.diff

    # 在插件服务器目录中，目标为上一个命令中的临时目录
    pnpm patch-commit /private/var/folders/b7/bmmghlpx5qdd6gpyvmz1k1_m0000gn/T/6082767a6879b3b4e11182f944f5cca3