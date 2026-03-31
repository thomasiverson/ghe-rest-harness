'use client';

import React from 'react';
import { TopBar } from '@/components/TopBar';

export default function CollectionsPage() {
  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-text-primary">Collections</h1>
              <p className="text-sm text-text-secondary mt-1">Save and organize API requests into reusable groups</p>
            </div>
            <button className="px-3 py-1.5 bg-accent-emphasis text-white text-sm rounded-md hover:opacity-90 transition-opacity">
              + New Collection
            </button>
          </div>

          <div className="bg-panel border border-border rounded-lg overflow-hidden">
            <div className="p-12 text-center">
              <svg width="40" height="40" viewBox="0 0 16 16" fill="currentColor" className="text-text-muted mx-auto mb-3">
                <path d="M1.75 1h8.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 10.25 10H7.061l-2.574 2.573A1.458 1.458 0 0 1 2 11.543V10h-.25A1.75 1.75 0 0 1 0 8.25v-5.5C0 1.784.784 1 1.75 1ZM1.5 2.75v5.5c0 .138.112.25.25.25h1a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h3.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25Zm13 2a.25.25 0 0 0-.25-.25h-.5a.75.75 0 0 1 0-1.5h.5c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 14.25 12H14v1.543a1.458 1.458 0 0 1-2.487 1.03L9.22 12.28a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l2.22 2.22V11.25a.75.75 0 0 1 .75-.75h.5a.25.25 0 0 0 .25-.25Z" />
              </svg>
              <p className="text-text-secondary text-sm">No collections yet</p>
              <p className="text-text-muted text-xs mt-1">Collections let you save and replay groups of API requests</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
