'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { webhookEvents } from '@/lib/webhooks';

export default function WebhooksPage() {
  const [selectedEvent, setSelectedEvent] = useState(webhookEvents[0]?.name || '');
  const [search, setSearch] = useState('');

  const filtered = search
    ? webhookEvents.filter(e => e.name.includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase()))
    : webhookEvents;

  const event = webhookEvents.find(e => e.name === selectedEvent);

  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Event list */}
        <div className="w-64 border-r border-border bg-panel flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Webhook Events <span className="font-normal text-text-muted">({webhookEvents.length})</span>
            </span>
          </div>
          <div className="p-2 border-b border-border">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full bg-surface border border-border rounded-md px-3 py-1.5 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(e => (
              <button key={e.name} onClick={() => setSelectedEvent(e.name)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-surface/50 transition-colors border-l-2 ${
                  selectedEvent === e.name ? 'bg-surface border-accent text-text-primary' : 'border-transparent text-text-secondary'
                }`}>
                <div className="font-mono text-xs">{e.name}</div>
                {e.actions.length > 0 && (
                  <div className="text-[10px] text-text-muted mt-0.5">{e.actions.length} actions</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Event detail */}
        <div className="flex-1 overflow-y-auto">
          {event ? (
            <div className="max-w-3xl mx-auto py-8 px-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-text-primary font-mono">{event.name}</h1>
                  <p className="text-sm text-text-secondary mt-1">{event.description}</p>
                </div>
                <a href={event.docsUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline shrink-0 flex items-center gap-1">
                  Docs
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.25.25 0 0 1 .25.25v4.146a.25.25 0 0 1-.427.177L13.03 4.03 9.28 7.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.75-3.75-1.543-1.543A.25.25 0 0 1 10.604 1Z" />
                  </svg>
                </a>
              </div>

              {/* Actions */}
              {event.actions.length > 0 && (
                <div className="bg-panel border border-border rounded-lg p-4">
                  <h2 className="text-sm font-medium text-text-primary mb-2">Actions</h2>
                  <p className="text-xs text-text-muted mb-2">Filter with the <code className="px-1 py-0.5 bg-surface rounded text-accent text-[11px]">action</code> field in your webhook configuration</p>
                  <div className="flex flex-wrap gap-1.5">
                    {event.actions.map(a => (
                      <span key={a} className="px-2 py-0.5 bg-surface border border-border rounded-full text-xs font-mono text-text-secondary">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Payload fields */}
              <div className="bg-panel border border-border rounded-lg overflow-hidden">
                <div className="p-4 border-b border-border">
                  <h2 className="text-sm font-medium text-text-primary">Key Payload Fields</h2>
                  <p className="text-xs text-text-muted mt-0.5">Fields available in the webhook payload JSON</p>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-text-secondary text-left">
                      <th className="px-4 py-2 font-medium">Field</th>
                      <th className="px-4 py-2 font-medium w-24">Type</th>
                      <th className="px-4 py-2 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.keyPayloadFields.map(f => (
                      <tr key={f.field} className="border-b border-border/50">
                        <td className="px-4 py-2 font-mono text-accent text-xs">{f.field}</td>
                        <td className="px-4 py-2 text-xs text-text-muted">{f.type}</td>
                        <td className="px-4 py-2 text-xs text-text-secondary">{f.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* HTTP headers */}
              <div className="bg-panel border border-border rounded-lg p-4">
                <h2 className="text-sm font-medium text-text-primary mb-2">Webhook HTTP Headers</h2>
                <div className="space-y-1 text-xs font-mono">
                  <div><span className="text-accent">X-GitHub-Event:</span> <span className="text-text-secondary">{event.name}</span></div>
                  <div><span className="text-accent">X-GitHub-Delivery:</span> <span className="text-text-muted">unique-guid</span></div>
                  <div><span className="text-accent">X-Hub-Signature-256:</span> <span className="text-text-muted">sha256=...</span></div>
                  <div><span className="text-accent">Content-Type:</span> <span className="text-text-secondary">application/json</span></div>
                  <div><span className="text-accent">User-Agent:</span> <span className="text-text-secondary">GitHub-Hookshot/...</span></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted text-sm">
              Select a webhook event
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
