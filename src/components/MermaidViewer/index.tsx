import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import mermaid from 'mermaid';
import styles from './styles.module.css';

interface MermaidViewerProps {
  chart: string;
}

export default function MermaidViewer({ chart }: MermaidViewerProps): JSX.Element {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  const calculateInitialScale = useCallback(() => {
    if (!contentRef.current) return 1;

    const content = contentRef.current;
    const contentRect = content.getBoundingClientRect();
    const windowWidth = window.innerWidth * 0.8;
    const windowHeight = window.innerHeight * 0.8;

    const scaleX = windowWidth / contentRect.width;
    const scaleY = windowHeight / contentRect.height;

    // 使用较小的缩放比例以确保图表完全适应屏幕
    return Math.min(scaleX, scaleY);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isFullscreen) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  }, [isFullscreen, position.x, position.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && isFullscreen) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, isFullscreen, dragStart.x, dragStart.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isFullscreen) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
    }
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => {
      if (!prev) {
        // 进入全屏时，延迟计算初始缩放比例
        setTimeout(() => {
          const initialScale = calculateInitialScale();
          setScale(initialScale);
        }, 0);
      } else {
        setScale(1);
      }
      return !prev;
    });
    setPosition({ x: 0, y: 0 });
  }, [calculateInitialScale]);

  const resetView = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const renderMermaid = useCallback(async () => {
    if (!chart) {
      console.warn('Empty chart content');
      return;
    }

    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'neutral',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif',
        themeVariables: {
          primaryColor: '#8d6e63',
          primaryTextColor: '#3e2723',
          primaryBorderColor: '#5d4037',
          lineColor: '#795548',
          secondaryColor: '#efebe9',
          tertiaryColor: '#d7ccc8',
          mainBkg: '#efebe9',
          nodeBorder: '#5d4037',
          clusterBkg: '#d7ccc8',
          titleColor: '#3e2723',
        },
        securityLevel: 'loose',
      });

      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      const { svg } = await mermaid.render(id, chart);
      setSvg(svg);
      setError(null);
    } catch (err) {
      console.error('Mermaid rendering error:', err);
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [chart]);

  useEffect(() => {
    renderMermaid();
  }, [renderMermaid]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, toggleFullscreen]);

  if (!chart) {
    return <div className="alert alert--warning">没有图表内容</div>;
  }

  if (error) {
    return (
      <div className="alert alert--danger">
        <p>图表渲染失败：</p>
        <pre>{error}</pre>
        <p>图表内容：</p>
        <pre>{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return <div className="alert alert--info">正在渲染图表...</div>;
  }

  const viewer = (
    <div className={styles.mermaidWrapper} onClick={toggleFullscreen}>
      <div
        className={styles.mermaidContent}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );

  const fullscreenViewer = (
    <div className={styles.fullscreenOverlay} onClick={e => e.target === e.currentTarget && toggleFullscreen()}>
      <div className={styles.fullscreenContent}>
        <div
          className={styles.mermaidWrapper}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            ref={contentRef}
            className={styles.mermaidContent}
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>
      <button className={styles.closeButton} onClick={toggleFullscreen} title="关闭 (ESC)">
        ✕
      </button>
      <div className={styles.controls}>
        <button className={styles.controlButton} onClick={() => setScale(prev => Math.min(prev + 0.1, 3))} title="放大 (滚轮向上)">
          <span>放大</span>
          <span>+</span>
        </button>
        <button className={styles.controlButton} onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))} title="缩小 (滚轮向下)">
          <span>缩小</span>
          <span>-</span>
        </button>
        <button className={styles.controlButton} onClick={() => {
          const initialScale = calculateInitialScale();
          setScale(initialScale);
          setPosition({ x: 0, y: 0 });
        }} title="重置大小和位置">
          <span>重置</span>
          <span>↺</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {viewer}
      {isFullscreen && createPortal(fullscreenViewer, document.body)}
    </>
  );
} 