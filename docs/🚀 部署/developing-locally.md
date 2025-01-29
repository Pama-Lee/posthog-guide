---
title: 本地开发
sidebar: Docs
showTitle: true
---

> ❗️ 本指南仅适用于 PostHog 本身的开发。如果你想部署 PostHog 用于产品分析需求，请前往[自托管 PostHog](/docs/self-host)。

## PostHog 内部结构是什么样的？

在开始设置之前，让我们先了解 PostHog 的组成部分。

该应用由 4 个同时运行的组件组成：

- Celery worker（处理后台任务）
- Django 服务器
- Node.js 插件服务器（处理事件接收和应用/插件）
- 使用 Node.js 构建的 React 前端

这些组件依赖于以下外部服务：

- ClickHouse – 用于存储大数据（事件、用户、分析查询）
- Kafka – 用于事件接收队列
- MinIO – 用于存储文件（会话录制、文件导出）
- PostgreSQL – 用于存储普通数据（用户、项目、保存的洞察）
- Redis – 用于缓存和服务间通信
- Zookeeper – 用于协调 Kafka 和 ClickHouse 集群

在启动 PostHog 开发实例时，我们推荐以下配置：

- 外部服务通过 `docker compose` 在 Docker 中运行
- PostHog 本身在主机（你的系统）上运行

这就是我们在下面的指南中将要使用的配置。

> 技术上也可以完全在 Docker 中运行 PostHog，但同步更改会变得更慢，而且为了开发，你仍然需要在主机上安装 PostHog 依赖项（如格式化或类型检查工具）。
> 另一种方式 - 完全在主机上运行所有内容，由于从头开始实例化 Kafka 或 ClickHouse 涉及的复杂性较大，这在实践中是不可行的。

本指南假设你运行的是 macOS 或当前的 Ubuntu Linux LTS（24.04）。

对于其他 Linux 发行版，请根据需要调整步骤（例如，使用 `dnf` 或 `pacman` 代替 `apt`）。

Windows 本身不支持。但是，Windows 用户可以运行 Linux 虚拟机。推荐使用最新的 Ubuntu LTS Desktop。（不推荐使用 Ubuntu Server，因为调试前端需要能够访问 localhost 的浏览器。）

如果这里的一些步骤已经过时，请告诉我们 - 欢迎[提交补丁](https://github.com/PostHog/posthog.com/blob/master/contents/handbook/engineering/developing-locally.md)！

## 选项一：使用 Codespaces 开发

这是一个更快速的入门选项。如果你不想或无法使用 Codespaces，请继续阅读下一节。

1. 创建你的 codespace。
![](https://user-images.githubusercontent.com/890921/231489405-cb2010b4-d9e3-4837-bfdf-b2d4ef5c5d0b.png)
2. 更新为 8 核机器类型（最小配置可能太小，无法正常运行 PostHog）。
![](https://user-images.githubusercontent.com/890921/231490278-140f814e-e77b-46d5-9a4f-31c1b1d6956a.png)
3. 打开 codespace，使用列表中的"Open in"选项之一。
4. 在 codespace 中，打开终端窗口并运行 `docker compose -f docker-compose.dev.yml up`。
5. 在另一个终端中，运行 `pnpm i`（并在后续命令中使用相同的终端）
6. 然后运行 `pip install -r requirements.txt -r requirements-dev.txt`
7. 现在运行 `./bin/migrate` 然后运行 `./bin/start`。
8. 在浏览器中打开 http://localhost:8010/。
9. 要在你全新的 PostHog 实例中获取一些实用的测试数据，运行 `DEBUG=1 ./manage.py generate_demo_data`。

## 选项二：本地开发

### 先决条件

#### macOS

1. 如果你还没有安装 Xcode Command Line Tools，请安装：`xcode-select --install`。

2. 按照[这里的说明](https://brew.sh/)安装包管理器 Homebrew。

    <blockquote class="warning-note">
        安装后，请务必按照终端中打印的说明将 Homebrew 添加到你的 <code>$PATH</code> 中。否则命令行将无法识别使用 <code>brew</code> 安装的包。
    </blockquote>

3. 使用 `brew install orbstack` 安装 [OrbStack](https://orbstack.dev/) – 一个性能更好的 Docker Desktop 替代品。进入 OrbStack 设置，将内存使用限制设置为**至少 4 GB**（如果可以的话设置为 8 GB）+ CPU 使用限制设置为至少 4 核（即 400%）。如果你在 PostHog 工作，你可以使用 Brex 获取许可证。

4. 继续[克隆仓库](#克隆仓库)。

#### Ubuntu

1. 按照[这里的官方说明](https://docs.docker.com/engine/install/ubuntu/)安装 Docker。

2. 安装 `build-essential` 包：

    ```bash
    sudo apt install -y build-essential
    ```
3. 继续[克隆仓库](#克隆仓库)。

#### 克隆仓库

克隆 [PostHog 仓库](https://github.com/posthog/posthog)。所有后续命令都假设你在 `posthog/` 文件夹中。

```bash
git clone https://github.com/PostHog/posthog && cd posthog/
```

### 即时设置

你可以使用 [Flox](https://flox.dev/) 立即设置你的开发环境。Flox 是一个开发环境管理器，它负责管理开发 PostHog 所需的整个依赖关系图 – 所有这些都在仓库的 `.flox/manifest.toml` 中声明。要启动这个环境：

1. 安装 Flox（以及用于预提交检查的 `ruff` 和 `rustup`，这些在 Flox 环境之外）。

    ```bash
    brew install flox ruff rustup && rustup-init && rustup default stable
    ```

2. 在仓库根目录下，激活环境。（首次激活时，系统会询问你是否希望使用 `direnv` 自动激活环境。）

    ```bash
    flox activate
    ```

这会为你提供一个功能齐全的环境，其可执行文件和链接库存储在 `.flox/` 下。你现在应该能看到有关迁移和运行应用程序的说明。

就是这样！你现在可以按照你想要的方式修改 PostHog。查看[项目结构](/handbook/engineering/project-structure)了解仓库内容的介绍。要提交更改，请基于 `master` 创建一个新分支用于你的预期更改，然后开始开发。

### 手动设置

如果你不想使用[基于 Flox 的即时设置](#即时设置)，你也可以手动设置环境：

#### 1. 启动外部服务

在这一步中，我们将启动 PostHog 工作所需的所有外部服务。

首先，将 `127.0.0.1 kafka clickhouse` 行添加到 `/etc/hosts` 中。如果没有这些映射的主机，我们的 ClickHouse 和 Kafka 数据服务将无法相互通信。
你可以使用一行命令完成此操作：

```bash
echo '127.0.0.1 kafka clickhouse' | sudo tee -a /etc/hosts
```

> 如果你使用的是较新版本（>=4.1）的 Podman 而不是 Docker，主机的 `/etc/hosts` 默认用作容器的基础 hosts 文件，而不是像 Docker 中那样使用容器的 `/etc/hosts`。这可能会导致 ClickHouse 容器中的主机名解析失败，可以通过在 [`containers.conf`](https://github.com/containers/common/blob/main/docs/containers.conf.5.md#containers-table) 中设置 `base_hosts_file="none"` 来解决。

现在，启动 Docker Compose 堆栈：

```bash
docker compose -f docker-compose.dev.yml up
```

> **友情提示 1：** 如果你看到 `Error while fetching server API version: 500 Server Error for http+docker://localhost/version:`，很可能是 Docker Engine 没有运行。

> **友情提示 2：** 如果你在任何地方看到"Exit Code 137"，这意味着容器内存不足。在这种情况下，你需要在 OrbStack 设置中分配更多的 RAM。

> **友情提示 3：** 在 Linux 上，你可能需要 `sudo` – 参见 [Docker 文档关于以非 root 用户管理 Docker](https://docs.docker.com/engine/install/linux-postinstall)。或者考虑使用 [Podman](https://podman.io/getting-started/installation) 作为支持无根容器的替代方案。

> **友情提示 4：** 如果你看到 `Error: (HTTP code 500) server error - Ports are not available: exposing port TCP 0.0.0.0:5432 -> 0.0.0.0:0: listen tcp 0.0.0.0:5432: bind: address already in use`，说明某处已经运行了 Postgres。先尝试 `docker compose -f docker-compose.dev.yml`，或者运行 `lsof -i :5432` 查看哪个进程正在使用此端口。
```bash
sudo service postgresql stop
```

其次，通过 `docker ps` 和 `docker logs`（或通过 OrbStack 仪表板）验证所有这些服务是否正在运行。它们的日志应该显示类似这样的内容：

```shell
# docker ps                                                                                     NAMES
CONTAINER ID   IMAGE                                      COMMAND                  CREATED          STATUS                    PORTS                                                                                            NAMES
5a38d4e55447   temporalio/ui:2.10.3                       "./start-ui-server.sh"   51 seconds ago   Up 44 seconds             0.0.0.0:8081->8080/tcp                                                                           posthog-temporal-ui-1
89b969801426   temporalio/admin-tools:1.20.0              "tail -f /dev/null"      51 seconds ago   Up 44 seconds                                                                                                              posthog-temporal-admin-tools-1
81fd1b6d7b1b   clickhouse/clickhouse-server:23.6.1.1524   "/entrypoint.sh"         51 seconds ago   Up 50 seconds             0.0.0.0:8123->8123/tcp, 0.0.0.0:9000->9000/tcp, 0.0.0.0:9009->9009/tcp, 0.0.0.0:9440->9440/tcp   posthog-clickhouse-1
f876f8bff35f   bitnami/kafka:2.8.1-debian-10-r99          "/opt/bitnami/script…"   51 seconds ago   Up 50 seconds             0.0.0.0:9092->9092/tcp                                                                           posthog-kafka-1
d22559261575   temporalio/auto-setup:1.20.0               "/etc/temporal/entry…"   51 seconds ago   Up 45 seconds             6933-6935/tcp, 6939/tcp, 7234-7235/tcp, 7239/tcp, 0.0.0.0:7233->7233/tcp                         posthog-temporal-1
5313fc278a70   postgres:12-alpine                         "docker-entrypoint.s…"   51 seconds ago   Up 50 seconds (healthy)   0.0.0.0:5432->5432/tcp                                                                           posthog-db-1
c04358d8309f   zookeeper:3.7.0                            "/docker-entrypoint.…"   51 seconds ago   Up 50 seconds             2181/tcp, 2888/tcp, 3888/tcp, 8080/tcp                                                           posthog-zookeeper-1
09add699866e   maildev/maildev:2.0.5                      "bin/maildev"            51 seconds ago   Up 50 seconds (healthy)   0.0.0.0:1025->1025/tcp, 0.0.0.0:1080->1080/tcp                                                   posthog-maildev-1
61a44c094753   elasticsearch:7.16.2                       "/bin/tini -- /usr/l…"   51 seconds ago   Up 50 seconds             9200/tcp, 9300/tcp                                                                               posthog-elasticsearch-1
a478cadf6911   minio/minio:RELEASE.2022-06-25T15-50-16Z   "sh -c 'mkdir -p /da…"   51 seconds ago   Up 50 seconds             9000/tcp, 0.0.0.0:19000-19001->19000-19001/tcp                                                   posthog-object_storage-1
91f838afe40e   redis:6.2.7-alpine                         "docker-entrypoint.s…"   51 seconds ago   Up 50 seconds             0.0.0.0:6379->6379/tcp                                                                           posthog-redis-1

# docker logs posthog-db-1 -n 1
2021-12-06 13:47:08.325 UTC [1] LOG:  database system is ready to accept connections

# docker logs posthog-redis-1 -n 1
1:M 06 Dec 2021 13:47:08.435 * Ready to accept connections

# docker logs posthog-clickhouse-1 -n 1
Saved preprocessed configuration to '/var/lib/clickhouse/preprocessed_configs/users.xml'.

# ClickHouse writes logs to `/var/log/clickhouse-server/clickhouse-server.log` and error logs to `/var/log/clickhouse-server/clickhouse-server.err.log` instead of stdout/stsderr. It can be useful to `cat` these files if there are any issues:
# docker exec posthog-clickhouse-1 cat /var/log/clickhouse-server/clickhouse-server.log
# docker exec posthog-clickhouse-1 cat /var/log/clickhouse-server/clickhouse-server.err.log

# docker logs posthog-kafka-1
[2021-12-06 13:47:23,814] INFO [KafkaServer id=1001] started (kafka.server.KafkaServer)

# docker logs posthog-zookeeper-1
# Because ClickHouse and Kafka connect to Zookeeper, there will be a lot of noise here. That's good.
```

> **友情提示：** Kafka 目前是唯一使用的 x86 容器，在 ARM 上运行时可能会随机崩溃。重启它，当发生这种情况时。

最后，在本地安装 Postgres。即使你计划在 Docker 中运行 Postgres，我们也需要本地安装 Postgres（11+ 版本）来获取其 CLI 工具和开发库/头文件。这些是 `pip` 安装 `psycopg2` 所必需的。

- 在 macOS 上：
    ```bash
    brew install postgresql
    ```

这会同时安装 Postgres 服务器和其工具。运行此命令后不要启动服务器。

- 在基于 Debian 的 Linux 上：
    ```bash
    sudo apt install -y postgresql-client postgresql-contrib libpq-dev
    ```

这有意只安装 Postgres 客户端和驱动程序，而不是服务器。如果你想安装服务器，或者已经安装了服务器，你需要停止它，因为它使用的 TCP 端口与 Postgres Docker 容器使用的端口冲突。在 Linux 上，可以使用 `sudo systemctl disable postgresql.service` 来完成此操作。

在 Linux 上，你通常有单独的包：`postgres` 用于工具，`postgres-server` 用于服务器，`libpostgres-dev` 用于 `psycopg2` 依赖项。查看你的发行版的包列表以获取最新的包列表。

如果你的工作站是 Apple Silicon Mac，第一次运行 `pip install` 时，你必须设置自定义 OpenSSL 头：

```bash
brew install openssl
CFLAGS="-I /opt/homebrew/opt/openssl/include $(python3.11-config --includes)" LDFLAGS="-L /opt/homebrew/opt/openssl/lib" GRPC_PYTHON_BUILD_SYSTEM_OPENSSL=1 GRPC_PYTHON_BUILD_SYSTEM_ZLIB=1 uv pip install -r requirements.txt
```

这些将在安装 `grpcio` 和 `psycopg2` 时使用。完成此操作一次后，假设这两个包没有任何更改，下次只需运行：

```bash
uv pip install -r requirements.txt -r requirements-dev.txt
```

#### 5. 准备 Django 服务器

1. 安装一些 SAML 工作所需的依赖项。如果你使用 macOS，运行下面的命令，否则查看官方 [xmlsec 仓库](https://github.com/mehcode/python-xmlsec)了解更多详情。

    - 在 macOS 上：
        ```bash
        brew install libxml2 libxmlsec1 pkg-config
        ```
        > 如果安装 `xmlsec` 不成功，尝试更新 macOS 到最新版本（Sonoma）。

    - 在基于 Debian 的 Linux 上：
        ```bash
        sudo apt install -y libxml2 libxmlsec1-dev libffi-dev pkg-config
        ```

2. 安装 Python 3.11。

    - 在 macOS 上，你可以使用 Homebrew：`brew install python@3.11`。

    - 在基于 Debian 的 Linux 上：
        ```bash
        sudo add-apt-repository ppa:deadsnakes/ppa -y
        sudo apt update
        sudo apt install python3.11 python3.11-venv python3.11-dev -y
        ```

确保在 `venv` 外部时始终使用 `python3` 而不是 `python`，因为后者在某些系统上可能指向 Python 2.x。如果安装多个版本的 Python 3，例如使用 `deadsnakes` PPA，使用 `python3.11` 而不是 `python3`。

你也可以使用 [pyenv](https://github.com/pyenv/pyenv)，如果你希望在同一台机器上管理多个 Python 3 版本。

3. 安装 `uv`

`uv` 是一个非常快速的工具，你可以用它来管理 python 虚拟环境和依赖项。查看 [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)。安装后，你可以在任何 `pip` 命令前加上 `uv` 来获得速度提升。

4. 在当前目录下创建名为 'env' 的虚拟环境：

    ```bash
    uv venv env --python 3.11
    ```

5. 激活虚拟环境：

    ```bash
    # 对于 bash/zsh/等
    source env/bin/activate

    # 对于 fish
    source env/bin/activate.fish
    ```

6. 将 pip 升级到最新版本：

    ```bash
    uv pip install -U pip
    ```

7. 使用 pip 安装依赖项

#### 6. 准备数据库

我们现在已经准备好了后端，并且 Postgres 和 ClickHouse 正在运行 – 但是这些数据库目前是空白的，所以我们需要运行_迁移_来创建所有表等：

```bash
cargo install sqlx-cli # 如果你还没有安装
DEBUG=1 ./bin/migrate
```

#### 7. 启动 PostHog

现在同时启动 PostHog 的所有组件（后端、worker、插件服务器和前端）：

```bash
./bin/start
```

> **注意：** 此命令使用 [mprocs](https://github.com/pvolok/mprocs) 在单个终端窗口中运行所有开发进程。

打开 [http://localhost:8010](http://localhost:8010) 查看应用程序。

> **注意：** 第一次运行此命令时，你可能会收到一个错误，说"layout.html is not defined"。请确保等待前端编译完成后再试一次。

要在你全新的 PostHog 实例中获取一些实用的测试数据，运行 `DEBUG=1 ./manage.py generate_demo_data`。要查看命令的有用参数列表，运行 `DEBUG=1 ./manage.py generate_demo_data --help`。

#### 8. 开发

就是这样！你现在可以按照你想要的方式修改 PostHog。查看[项目结构](/handbook/engineering/project-structure)了解仓库内容的介绍。要提交更改，请基于 `master` 创建一个新分支用于你的预期更改，然后开始开发。

## 测试

要合并 PostHog PR，所有测试都必须通过，理想情况下你还应该引入新的测试 - 这就是为什么你必须能够轻松运行测试。

### 前端

对于前端单元测试，运行：

```bash
pnpm test:unit
```

你可以将运行范围缩小到仅匹配路径下的文件：

```bash
pnpm jest --testPathPattern=frontend/src/lib/components/IntervalFilter/intervalFilterLogic.test.ts
```

要更新所有视觉回归测试快照，请确保 Storybook 在你的机器上运行（你可以在单独的终端标签中使用 `pnpm storybook` 启动它）。你可能还需要使用 `pnpm exec playwright install` 安装 Playwright。然后运行：

```bash
pnpm test:visual
```

要仅更新特定路径下的故事的快照，运行：

```bash
pnpm test:visual:update frontend/src/lib/Example.stories.tsx
```

### 后端

对于后端测试，运行：

```bash
pytest
```

你可以将运行范围缩小到仅匹配路径下的文件：

```bash
pytest posthog/test/test_example.py
```

或者仅测试匹配函数名的测试用例：

```bash
pytest posthog/test/test_example.py -k test_something
```

要查看调试日志（如 ClickHouse 查询），添加参数 `--log-cli-level=DEBUG`。

### 端到端

对于 Cypress 端到端测试，运行 `bin/e2e-test-runner`。这将启动一个 PostHog 的测试实例并显示 Cypress 界面，你可以从中手动选择要运行的测试。你需要安装 `uv`（Python 包管理器），你可以通过 `brew install uv` 来安装。完成后，使用 Cmd + C 终止命令。

## 额外：使用特性标志

当使用环境变量 `DEBUG=1`（启用名为 `SELF_CAPTURE` 的设置）在本地开发时，
你的本地 PostHog 实例中的所有分析都基于该实例本身 - 更具体地说，是基于当前选择的项目。
这意味着你的活动会立即反映在当前项目中，这对于测试功能可能很有用
- 例如，当前开发实例启用哪些特性标志是由你同时打开的项目决定的。

因此，当使用基于特性标志 `foo-bar` 的功能时，[在你的本地实例中添加具有此键的特性标志](http://localhost:8010/feature_flags/new)并在那里发布它。

如果你想立即拥有 PostHog 中存在的所有特性标志，运行 `DEBUG=1 python3 manage.py sync_feature_flags` - 它们将被添加到实例中的每个项目中，默认情况下完全展开。

此命令会自动将任何以 `_EXPERIMENT` 结尾的特性标志设置为具有 `control` 和 `test` 变体的多变量标志。

后端侧的标志仅在本地评估，这需要设置 `POSTHOG_PERSONAL_API_KEY` 环境变量。在[你的用户设置](http://localhost:8010/settings/user#personal-api-keys)中生成密钥。

## 额外：使用 VS Code 调试

PostHog 仓库包含了 [VS Code 调试选项](https://github.com/PostHog/posthog/blob/master/.vscode/launch.json)。只需转到 VS Code 中的 `运行和调试` 标签，选择你想要调试的所需服务，然后运行它。一旦它启动，你就可以设置断点并逐步执行代码，以准确了解发生了什么。如果你遇到棘手的测试失败，还有用于前端和后端测试的调试启动选项。

> **注意：** 你可以使用主要的"PostHog"启动选项调试所有服务。否则，如果你使用 `./bin/start` 在本地运行大多数 PostHog 服务，例如，如果你只想调试后端，请确保暂时从[启动脚本](https://github.com/PostHog/posthog/blob/master/bin/start#L22)中注释掉该服务。

## Extra: Debugging the backend in PyCharm

借助 PyCharm 内置的 Django 支持，在后端设置调试相当容易。当你想要跟踪和调试从客户端发出的网络请求一直到服务器时，这特别有用。你可以设置断点并逐步执行代码，以准确了解后端如何处理你的请求。

### 设置 PyCharm

1. 打开仓库文件夹。
2. 设置 python 解释器（设置... > 项目：posthog > Python 解释器 > 添加解释器）：选择"现有"并将其设置为 `path_to_repo/posthog/env/bin/python`。
3. 设置 Django 支持（设置... > 语言和框架 > Django）：
   - Django 项目根目录：`path_to_repo`
   - 设置：`posthog/settings/__init__py`

### 启动调试环境

1. 不要手动运行 `docker compose`，你可以打开 `docker-compose.dev.yml` 文件并点击 `services` 旁边的双播放图标
2. 从运行配置中选择：
   - "PostHog" 并点击调试
   - "Celery" 并点击调试（可选）
   - "Frontend" 并点击运行
   - "Plugin server" 并点击运行

## Extra: Accessing Postgres

在开发过程中，你可能需要连接到数据库来查询本地数据库、进行更改等。要连接到数据库，请使用像 pgAdmin 这样的工具并输入以下连接详细信息：_host_:`localhost` _port_:`5432` _database_:`posthog`, _username_:`posthog`, _pwd_:`posthog`。

## Extra: Accessing the Django Admin

如果你无法访问 Django admin http://localhost:8000/admin/，可能是因为你的本地用户未设置为工作人员用户。你可以连接到数据库，找到你的 `posthog_user` 并将 `is_staff` 设置为 `true`。这应该使管理页面可以访问。

## 额外：开发付费功能（仅限 PostHog 员工）

如果你是 PostHog 员工，你可以在本地实例上访问付费功能，以使开发更容易。[在我们的内部指南中了解如何操作](https://github.com/PostHog/billing?tab=readme-ov-file#licensing-your-local-instance)。

## Extra: Working with the data warehouse and a MySQL source

如果你想将本地 MySQL 数据库设置为数据仓库的源，你需要完成一些额外的设置步骤：
1. 设置要连接的本地 MySQL 数据库。
2. 在你的机器上安装 MS SQL 驱动程序。
3. 为 Temporal 任务运行器定义额外的环境变量。

首先，安装 MySQL：

```bash
brew install mysql
brew services start mysql
```

安装 MySQL 后，创建数据库和表，插入一行数据，并创建一个可以连接的用户：

```bash
mysql -u root
```
```sql
CREATE DATABASE posthog_dw_test;
CREATE TABLE IF NOT EXISTS payments (id INT AUTO_INCREMENT PRIMARY KEY, timestamp DATETIME, distinct_id VARCHAR(255), amount DECIMAL(10,2));
INSERT INTO payments (timestamp, distinct_id, amount) VALUES (NOW(), 'testuser@example.com', 99.99);
CREATE USER 'posthog'@'%' IDENTIFIED BY 'posthog';
GRANT ALL PRIVILEGES ON posthog_dw_test.* TO 'posthog'@'%';
FLUSH PRIVILEGES;
```

接下来，你需要安装一些 MS SQL 驱动程序，以便 PostHog 应用程序连接到 MySQL 数据库。在 [posthog/warehouse/README.md](https://github.com/PostHog/posthog/blob/master/posthog/warehouse/README.md) 中了解完整过程。如果没有驱动程序，在将 SQL 数据库连接到数据仓库时，你会收到以下错误：

```
symbol not found in flat namespace '_bcp_batch'
```

最后，你需要定义这些环境变量，以便 Temporal 任务运行器监视正确的队列并按预期工作：

```
# 在 #team-data-warehouse 中询问这些值
export PYTHONUNBUFFERED=
export DJANGO_SETTINGS_MODULE=
export DEBUG=
export CLICKHOUSE_SECURE=
export KAFKA_HOSTS=
export DATABASE_URL=
export SKIP_SERVICE_VERSION_REQUIREMENTS=
export PRINT_SQL=
export BUCKET_URL=
export AIRBYTE_BUCKET_KEY=
export AIRBYTE_BUCKET_SECRET=
export AIRBYTE_BUCKET_REGION=
export AIRBYTE_BUCKET_DOMAIN=
export TEMPORAL_TASK_QUEUE=
export AWS_S3_ALLOW_UNSAFE_RENAME=
export HUBSPOT_APP_CLIENT_ID=
export HUBSPOT_APP_CLIENT_SECRET=
```

如果你将它们放在 `.temporal-worker-settings` 文件中，你可以在调用 `DEBUG=1 ./bin/start` 之前运行 `source .temporal-worker-settings`。

要验证一切是否按预期工作：
1. 在 PostHog 应用程序中导航到"数据管道"。
2. 使用上述设置创建新的 MySQL 源。
3. 创建源后，点击"MySQL"项。在架构表中，点击三点菜单并选择"重新加载"选项。

作业运行后，点击同步的表名应该会带你到你的数据。