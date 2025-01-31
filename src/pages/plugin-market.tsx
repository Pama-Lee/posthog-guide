import React from 'react';
import Layout from '@theme/Layout';
import { PluginMarket } from '@site/src/components/PluginMarket';

const PluginMarketPage: React.FC = () => {
  return (
    <Layout
      title="PostHog 插件市场"
      description="浏览和搜索 PostHog 插件，扩展您的数据分析能力"
    >
      <main>
        <PluginMarket
          showHeader={true}
          title="探索 PostHog 插件"
          subtitle="发现来自社区的优质插件，为您的 PostHog 实例添加更多功能。"
        />
      </main>
    </Layout>
  );
};

export default PluginMarketPage; 