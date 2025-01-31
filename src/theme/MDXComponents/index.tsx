import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import type { MDXComponentsObject } from '@theme/MDXComponents';
import Mermaid from './Mermaid';
import GitHubCard from '@site/src/components/GithubCard';

const components: MDXComponentsObject = {
  ...MDXComponents,
  GitHubCard: GitHubCard,
  mermaid: (props: { value: unknown }) => {
    let content = '';
    if (typeof props.value === 'string') {
      content = props.value;
    } else if (props.value && typeof props.value === 'object') {
      content = JSON.stringify(props.value);
    }
    return <Mermaid>{content.trim()}</Mermaid>;
  },
};

export default components; 
