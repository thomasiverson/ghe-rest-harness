'use client';

import React, { useCallback, useRef, useEffect, useState } from 'react';

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  side: 'left' | 'right';
}

export function ResizeHandle({ onResize, side }: ResizeHandleProps) {
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    lastX.current = e.clientX;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - lastX.current;
      lastX.current = e.clientX;
      // For a handle on the right side of a left panel, positive delta = grow
      // For a handle on the left side of a right panel, positive delta = shrink
      onResize(side === 'left' ? -delta : delta);
    };

    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize, side]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className="w-1 cursor-col-resize hover:bg-accent/40 active:bg-accent/60 transition-colors shrink-0 relative group"
      title="Drag to resize"
    >
      {/* Wider invisible hit area */}
      <div className="absolute inset-y-0 -left-1 -right-1" />
      {/* Visible line on hover */}
      <div className="absolute inset-y-0 left-0 w-px bg-border group-hover:bg-accent/40 group-active:bg-accent/60 transition-colors" />
    </div>
  );
}

interface ResizablePanelsProps {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
  defaultLeftWidth?: number;
  defaultRightWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  minRightWidth?: number;
  maxRightWidth?: number;
  minCenterWidth?: number;
  leftCollapsed?: boolean;
  rightCollapsed?: boolean;
}

export function ResizablePanels({
  left, center, right,
  defaultLeftWidth = 288,
  defaultRightWidth = 480,
  minLeftWidth = 200,
  maxLeftWidth = 500,
  minRightWidth = 300,
  maxRightWidth = 800,
  minCenterWidth = 300,
  leftCollapsed = false,
  rightCollapsed = false,
}: ResizablePanelsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [rightWidth, setRightWidth] = useState(defaultRightWidth);

  const handleLeftResize = useCallback((delta: number) => {
    setLeftWidth(prev => {
      const containerWidth = containerRef.current?.offsetWidth || 1200;
      const collapsedRight = rightCollapsed ? 40 : rightWidth;
      const maxAvailable = containerWidth - collapsedRight - minCenterWidth;
      return Math.max(minLeftWidth, Math.min(maxLeftWidth, Math.min(maxAvailable, prev + delta)));
    });
  }, [rightWidth, rightCollapsed, minLeftWidth, maxLeftWidth, minCenterWidth]);

  const handleRightResize = useCallback((delta: number) => {
    setRightWidth(prev => {
      const containerWidth = containerRef.current?.offsetWidth || 1200;
      const collapsedLeft = leftCollapsed ? 40 : leftWidth;
      const maxAvailable = containerWidth - collapsedLeft - minCenterWidth;
      return Math.max(minRightWidth, Math.min(maxRightWidth, Math.min(maxAvailable, prev + delta)));
    });
  }, [leftWidth, leftCollapsed, minRightWidth, maxRightWidth, minCenterWidth]);

  const actualLeftWidth = leftCollapsed ? 40 : leftWidth;
  const actualRightWidth = rightCollapsed ? 40 : rightWidth;

  return (
    <div ref={containerRef} className="flex-1 flex overflow-hidden">
      {/* Left panel */}
      <div style={{ width: actualLeftWidth }} className="shrink-0 overflow-hidden">
        {left}
      </div>

      {/* Left resize handle */}
      {!leftCollapsed && <ResizeHandle onResize={handleLeftResize} side="right" />}

      {/* Center panel */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {center}
      </div>

      {/* Right resize handle */}
      {!rightCollapsed && <ResizeHandle onResize={handleRightResize} side="left" />}

      {/* Right panel */}
      <div style={{ width: actualRightWidth }} className="shrink-0 overflow-hidden">
        {right}
      </div>
    </div>
  );
}
