import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { Card, Input, Spin, Tag, Tooltip } from 'antd';
import { SearchOutlined, StarOutlined, ForkOutlined } from '@ant-design/icons';

interface Plugin {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

export const PluginMarket: React.FC = () => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPlugins();
  }, []);

  const fetchPlugins = async () => {
    try {
      const response = await fetch(
        'https://api.github.com/search/repositories?q=topic:posthog-plugin&sort=stars&order=desc'
      );
      const data = await response.json();
      setPlugins(data.items);
    } catch (error) {
      console.error('Error fetching plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlugins = plugins.filter(plugin =>
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plugin.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>PostHog 插件市场</h1>
        <Input
          prefix={<SearchOutlined />}
          placeholder="搜索插件..."
          onChange={e => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>
          <Spin size="large" />
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredPlugins.map(plugin => (
            <Card
              key={plugin.id}
              className={styles.card}
              title={
                <a href={plugin.html_url} target="_blank" rel="noopener noreferrer">
                  {plugin.name}
                </a>
              }
              extra={
                <img
                  src={plugin.owner.avatar_url}
                  alt={plugin.owner.login}
                  className={styles.avatar}
                />
              }
            >
              <p className={styles.description}>{plugin.description}</p>
              <div className={styles.topics}>
                {plugin.topics.map(topic => (
                  <Tag key={topic} color="blue">
                    {topic}
                  </Tag>
                ))}
              </div>
              <div className={styles.stats}>
                <Tooltip title="Stars">
                  <span>
                    <StarOutlined /> {plugin.stargazers_count}
                  </span>
                </Tooltip>
                <Tooltip title="Forks">
                  <span>
                    <ForkOutlined /> {plugin.forks_count}
                  </span>
                </Tooltip>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 