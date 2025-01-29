import React from 'react';
import MermaidViewer from '@site/src/components/MermaidViewer';
import BrowserOnly from '@docusaurus/BrowserOnly';

interface Props {
  children: string;
}

export default function MermaidWrapper({ children }: Props): JSX.Element {
  // 移除可能的前后空格和多余的换行
  const cleanChart = children.trim().replace(/^\s*[\r\n]/gm, '');
  
  console.log('Mermaid content:', cleanChart); // 调试用

  return (
    <BrowserOnly fallback={<div>加载中...</div>}>
      {() => <MermaidViewer chart={cleanChart} />}
    </BrowserOnly>
  );
} 