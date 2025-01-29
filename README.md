# PostHog Guide 中文指南

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/Pama-Lee/posthog-guide?style=for-the-badge&color=yellow)](https://github.com/Pama-Lee/posthog-guide/stargazers)&nbsp;&nbsp;[![GitHub forks](https://img.shields.io/github/forks/Pama-Lee/posthog-guide?style=for-the-badge)](https://github.com/Pama-Lee/posthog-guide/network)&nbsp;&nbsp;[![GitHub license](https://img.shields.io/github/license/Pama-Lee/posthog-guide?style=for-the-badge)](https://github.com/Pama-Lee/posthog-guide/blob/main/LICENSE)

[![Website](https://img.shields.io/website?label=文档站点&style=for-the-badge&up_message=在线&url=https%3A%2F%2Fpama-lee.github.io%2Fposthog-guide%2F)](https://pama-lee.github.io/posthog-guide/)&nbsp;&nbsp;[![Made with Docusaurus](https://img.shields.io/badge/Made%20with-Docusaurus-blue?style=for-the-badge&logo=docusaurus)](https://docusaurus.io/)&nbsp;&nbsp;[![GitHub last commit](https://img.shields.io/github/last-commit/Pama-Lee/posthog-guide?style=for-the-badge)](https://github.com/Pama-Lee/posthog-guide/commits/main)

</div>

<p align="center">
PostHog Guide 是一个致力于帮助中文开发者更好地理解和使用 PostHog 的社区项目。<br>
本项目提供详细的中文文档、使用教程和最佳实践指南。
</p>

## 🌟 特性

- 📚 完整的中文文档
- 🔍 详细的使用教程
- 💡 最佳实践指南
- 👥 活跃的社区讨论
- 🛠 实用的配置示例

## 🚀 快速开始

### 在线阅读

访问我们的文档站点：[PostHog Guide](https://pama-lee.github.io/posthog-guide/)

### 加入社区

扫描文档站点中的二维码加入我们的 QQ 群，与其他开发者交流讨论。

## 🛠 本地开发

本项目使用 [Docusaurus](https://docusaurus.io/) 构建。

### 安装依赖

```bash
yarn
```

### 本地开发服务器

```bash
yarn start
```

此命令会启动本地开发服务器并打开浏览器窗口。大多数更改都会实时反映，无需重启服务器。

### 构建

```bash
yarn build
```

此命令会在 `build` 目录中生成静态内容，可以使用任何静态内容托管服务进行部署。

### 部署

使用 SSH：

```bash
USE_SSH=true yarn deploy
```

不使用 SSH：

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

如果您使用 GitHub Pages 托管，此命令可以方便地构建网站并推送到 `gh-pages` 分支。

## 📝 贡献指南

我们欢迎任何形式的贡献！如果您发现了问题或有改进建议，请：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
