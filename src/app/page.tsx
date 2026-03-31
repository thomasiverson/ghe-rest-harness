'use client';

import { TopBar } from '@/components/TopBar';
import { Sidebar } from '@/components/Sidebar';
import { RequestBuilder } from '@/components/RequestBuilder';
import { ResponseViewer } from '@/components/ResponseViewer';
import { ResizablePanels } from '@/components/ResizablePanels';
import { useApp } from '@/components/AppContext';

export default function Home() {
  const { activeEnv, sidebarCollapsed, responseCollapsed } = useApp();

  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <ResizablePanels
        left={<Sidebar />}
        center={<RequestBuilder />}
        right={<ResponseViewer />}
        defaultLeftWidth={288}
        defaultRightWidth={480}
        minLeftWidth={200}
        maxLeftWidth={500}
        minRightWidth={300}
        maxRightWidth={900}
        minCenterWidth={300}
        leftCollapsed={sidebarCollapsed}
        rightCollapsed={responseCollapsed}
      />
      {/* Status bar */}
      <footer className="h-7 flex items-center px-4 border-t border-border bg-panel text-xs text-text-muted shrink-0 gap-4">
        <span>{activeEnv ? `${activeEnv.name} — ${activeEnv.base_url}` : 'No environment selected'}</span>
        <span className="flex-1" />
        <span>GitHub REST API Harness</span>
      </footer>
    </div>
  );
}
