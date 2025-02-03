import React from 'react';
import Layout from '@theme/Layout';
import { PluginGenerator } from '../components/PluginGenerator';

export default function PluginGeneratorPage(): JSX.Element {
  return (
    <Layout
      title="插件开发包生成器"
      description="生成 PostHog 插件开发起始包"
    >
      <main>
        <PluginGenerator />
      </main>
    </Layout>
  );
} 