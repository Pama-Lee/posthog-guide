import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { FaStar, FaCodeBranch, FaCode } from 'react-icons/fa';
import { GoRepo } from 'react-icons/go';
import clsx from 'clsx';

interface GitHubCardProps {
  repo: string;
  size?: 'small' | 'medium' | 'large';
  showOwner?: boolean;
  showLanguage?: boolean;
  showStats?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface RepoData {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  html_url: string;
  owner: {
    avatar_url: string;
    login: string;
  };
  language: string;
}

export default function GitHubCard({ 
  repo, 
  size = 'medium',
  showOwner = true,
  showLanguage = true,
  showStats = true,
  className,
  style
}: GitHubCardProps) {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${repo}`);
        if (!response.ok) {
          throw new Error('仓库获取失败');
        }
        const data = await response.json();
        setRepoData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchRepoData();
  }, [repo]);

  if (loading) {
    return <div className={clsx(styles.loading, styles[size])}>加载中...</div>;
  }

  if (error || !repoData) {
    return <div className={clsx(styles.error, styles[size])}>加载失败: {error}</div>;
  }

  return (
    <a 
      href={repoData.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(styles.card, styles[size], className)}
      style={style}
    >
      <div className={styles.header}>
        <img 
          src={repoData.owner.avatar_url}
          alt={repoData.owner.login}
          className={styles.avatar}
        />
        <div className={styles.title}>
          <div className={styles.repoTitle}>
            <GoRepo className={styles.repoIcon} />
            <h3>{repoData.name}</h3>
          </div>
          {showOwner && (
            <span className={styles.owner}>by {repoData.owner.login}</span>
          )}
        </div>
      </div>
      
      <p className={styles.description}>{repoData.description}</p>
      
      {showStats && (
        <div className={styles.footer}>
          <div className={styles.stats}>
            <span className={styles.stat}>
              <FaStar className={styles.icon} />
              {repoData.stargazers_count.toLocaleString()}
            </span>
            <span className={styles.stat}>
              <FaCodeBranch className={styles.icon} />
              {repoData.forks_count.toLocaleString()}
            </span>
            {showLanguage && repoData.language && (
              <span className={styles.language}>
                <FaCode className={styles.icon} />
                {repoData.language}
              </span>
            )}
          </div>
        </div>
      )}
    </a>
  );
}
