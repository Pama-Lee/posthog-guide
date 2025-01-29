import React from 'react';
import Giscus from '@giscus/react';
import { useColorMode } from '@docusaurus/theme-common';
import { useLocation } from '@docusaurus/router';

export default function Comments(): JSX.Element {
  const { colorMode } = useColorMode();
  const { pathname } = useLocation();

  return (
    <div style={{ marginTop: '2rem' }}>
      <Giscus
        repo="pama-lee/posthog-guide"
        repoId="R_kgDONxOwFQ"
        category="Comments"
        categoryId="DIC_kwDONxOwFc4CmcFl"
        mapping="pathname"
        term={pathname}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={colorMode === 'dark' ? 'dark_dimmed' : 'light'}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
} 