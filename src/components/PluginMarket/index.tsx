import React from 'react';
import styles from './styles.module.css';
import { FaGithub, FaStar, FaCodeBranch, FaSearch, FaSpinner } from 'react-icons/fa';

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

interface PluginMarketProps {
  showHeader?: boolean;
  title?: string;
  subtitle?: string;
}

export const PluginMarket: React.FC<PluginMarketProps> = ({
  showHeader = true,
  title = 'PostHog 插件市场',
  subtitle = '浏览和搜索来自社区的 PostHog 插件，扩展您的数据分析能力。'
}) => {
  const [plugins, setPlugins] = React.useState<Plugin[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
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
      {showHeader && (
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
          </div>
          <div className={styles.searchWrapper}>
            <div className={styles.searchInputWrapper}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="搜索插件..."
                onChange={e => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>
        </div>
      )}

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <FaSpinner className={styles.spinner} />
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredPlugins.map(plugin => (
              <div key={plugin.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <a
                    href={plugin.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardTitle}
                  >
                    {plugin.name}
                  </a>
                  <img
                    src={plugin.owner.avatar_url}
                    alt={plugin.owner.login}
                    className={styles.avatar}
                  />
                </div>
                <p className={styles.description}>{plugin.description}</p>
                <div className={styles.topics}>
                  {plugin.topics.map(topic => (
                    <span key={topic} className={styles.tag}>
                      {topic}
                    </span>
                  ))}
                </div>
                <div className={styles.stats}>
                  <span title="Stars" className={styles.stat}>
                    <FaStar /> {plugin.stargazers_count}
                  </span>
                  <span title="Forks" className={styles.stat}>
                    <FaCodeBranch /> {plugin.forks_count}
                  </span>
                  <a
                    href={plugin.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View on GitHub"
                    className={styles.githubLink}
                  >
                    <FaGithub />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 