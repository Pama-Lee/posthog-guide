import React from 'react';
import Layout from '@theme/Layout';
import { PluginMarket } from '@site/src/components/PluginMarket';

const PluginMarketPage: React.FC = () => {
  return (
    <Layout
      title="PostHog 插件市场"
      description="浏览和搜索 PostHog 插件，扩展您的数据分析能力"
    >
      <main className="container margin-vert--lg">
        <h1>PostHog 插件市场</h1>
        <p className="hero__subtitle">
          浏览和搜索来自社区的 PostHog 插件，扩展您的数据分析能力。
        </p>
        <PluginMarket />
      </main>
    </Layout>
  );
};

export default PluginMarketPage; 