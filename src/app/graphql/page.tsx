'use client';

import React, { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { useApp } from '@/components/AppContext';

const EXAMPLE_QUERIES = [
  {
    name: 'Viewer info',
    query: `query {
  viewer {
    login
    name
    email
    company
    createdAt
    organizations(first: 10) {
      nodes {
        login
        name
      }
    }
  }
}`,
  },
  {
    name: 'Repository details',
    query: `query($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    description
    stargazerCount
    forkCount
    isPrivate
    defaultBranchRef {
      name
    }
    languages(first: 5) {
      nodes { name }
    }
    pullRequests(states: OPEN, first: 5) {
      totalCount
      nodes { title number author { login } }
    }
    issues(states: OPEN, first: 5) {
      totalCount
      nodes { title number author { login } }
    }
  }
}`,
    variables: '{\n  "owner": "",\n  "name": ""\n}',
  },
  {
    name: 'Org members & teams',
    query: `query($org: String!) {
  organization(login: $org) {
    membersWithRole(first: 20) {
      totalCount
      nodes {
        login
        name
        email
      }
    }
    teams(first: 20) {
      totalCount
      nodes {
        name
        slug
        members { totalCount }
        repositories { totalCount }
      }
    }
  }
}`,
    variables: '{\n  "org": ""\n}',
  },
  {
    name: 'Copilot org usage',
    query: `query($org: String!) {
  organization(login: $org) {
    login
    copilotAllocations: copilotSeatManagement {
      copilotSeats(first: 50) {
        totalCount
        nodes {
          assignee {
            ... on User { login name }
          }
          createdAt
          updatedAt
          pendingCancellationDate
        }
      }
    }
  }
}`,
    variables: '{\n  "org": ""\n}',
  },
  {
    name: 'Enterprise overview',
    query: `query($slug: String!) {
  enterprise(slug: $slug) {
    name
    slug
    createdAt
    members(first: 10) {
      totalCount
      nodes {
        ... on EnterpriseUserAccount {
          login
          name
          organizations(first: 5) {
            nodes { login }
          }
        }
      }
    }
    organizations(first: 10) {
      totalCount
      nodes {
        login
        name
        membersWithRole { totalCount }
        repositories { totalCount }
      }
    }
  }
}`,
    variables: '{\n  "slug": ""\n}',
  },
  {
    name: 'Search repositories',
    query: `query($q: String!) {
  search(query: $q, type: REPOSITORY, first: 10) {
    repositoryCount
    nodes {
      ... on Repository {
        nameWithOwner
        description
        stargazerCount
        primaryLanguage { name }
        updatedAt
      }
    }
  }
}`,
    variables: '{\n  "q": "language:typescript stars:>100"\n}',
  },
];

export default function GraphQLPage() {
  const { activeEnv } = useApp();
  const [query, setQuery] = useState(EXAMPLE_QUERIES[0].query);
  const [variables, setVariables] = useState('{}');
  const [response, setResponse] = useState<unknown>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [timing, setTiming] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'response' | 'errors'>('response');

  async function executeQuery() {
    if (!activeEnv) return;
    setIsLoading(true);
    try {
      let parsedVars = {};
      try { parsedVars = JSON.parse(variables); } catch { /* ignore */ }

      const res = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: parsedVars,
          environmentId: activeEnv.id,
        }),
      });
      const data = await res.json();
      setResponse(data.body || data);
      setStatus(data.status || res.status);
      setTiming(data.timing || null);
    } catch (err) {
      setResponse({ error: err instanceof Error ? err.message : 'Unknown error' });
      setStatus(0);
    }
    setIsLoading(false);
  }

  function loadExample(idx: number) {
    const ex = EXAMPLE_QUERIES[idx];
    setQuery(ex.query);
    setVariables(ex.variables || '{}');
    setResponse(null);
    setStatus(null);
    setTiming(null);
  }

  const responseData = response as Record<string, unknown> | null;
  const errors = responseData && Array.isArray(responseData.errors) ? responseData.errors : null;
  const hasErrors = errors !== null && errors.length > 0;

  return (
    <div className="h-full flex flex-col">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Query editor */}
        <div className="flex-1 flex flex-col border-r border-border min-w-0">
          {/* Toolbar */}
          <div className="p-3 border-b border-border flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">GraphQL</span>
            <div className="flex-1" />
            <select onChange={e => loadExample(parseInt(e.target.value))}
              className="bg-surface border border-border rounded-md px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent">
              {EXAMPLE_QUERIES.map((ex, i) => (
                <option key={i} value={i}>{ex.name}</option>
              ))}
            </select>
            <button onClick={executeQuery} disabled={isLoading || !activeEnv}
              className="px-4 py-1.5 bg-accent-emphasis text-white text-sm font-medium rounded-md
                         hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2">
              {isLoading ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4.879-2.773 4.264 2.559a.25.25 0 0 1 0 .428l-4.264 2.559A.25.25 0 0 1 6 10.559V5.442a.25.25 0 0 1 .379-.215Z" />
                </svg>
              )}
              Run Query
            </button>
          </div>

          {/* Query textarea */}
          <div className="flex-1 flex flex-col">
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-canvas border-0 px-4 py-3 text-sm text-text-primary font-mono resize-none focus:outline-none"
              spellCheck={false}
              placeholder="Enter your GraphQL query..."
            />

            {/* Variables */}
            <div className="border-t border-border">
              <div className="px-4 py-1.5 text-[11px] text-text-muted uppercase font-semibold bg-surface/50">Variables</div>
              <textarea
                value={variables}
                onChange={e => setVariables(e.target.value)}
                className="w-full bg-canvas border-0 px-4 py-2 text-xs text-text-primary font-mono resize-none focus:outline-none h-20"
                spellCheck={false}
                placeholder='{"key": "value"}'
              />
            </div>
          </div>
        </div>

        {/* Right: Response */}
        <div className="flex-1 flex flex-col bg-panel min-w-0">
          {/* Response header */}
          {status !== null && (
            <div className="p-3 border-b border-border flex items-center gap-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                status === 200 && !hasErrors ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
              }`}>
                {status} {hasErrors ? 'Errors' : 'OK'}
              </span>
              {timing !== null && <span className="text-xs text-text-muted">{timing}ms</span>}
              <div className="flex-1" />
              <button onClick={() => navigator.clipboard.writeText(JSON.stringify(response, null, 2))}
                className="text-xs text-text-muted hover:text-text-primary">Copy</button>
            </div>
          )}

          {/* Tabs */}
          {response !== null && (
            <div className="flex border-b border-border">
              <button onClick={() => setActiveTab('response')}
                className={`px-4 py-2 text-xs font-medium border-b-2 ${
                  activeTab === 'response' ? 'text-text-primary border-accent' : 'text-text-secondary border-transparent'
                }`}>Response</button>
              {hasErrors && (
                <button onClick={() => setActiveTab('errors')}
                  className={`px-4 py-2 text-xs font-medium border-b-2 ${
                    activeTab === 'errors' ? 'text-text-primary border-accent' : 'text-danger border-transparent'
                  }`}>Errors ({errors!.length})</button>
              )}
            </div>
          )}

          {/* Response body */}
          <div className="flex-1 overflow-auto p-4">
            {response !== null ? (
              <pre className="text-xs font-mono text-text-secondary whitespace-pre-wrap break-all">
                {activeTab === 'errors' && hasErrors
                  ? JSON.stringify(errors, null, 2)
                  : JSON.stringify(activeTab === 'response' && responseData?.data ? responseData.data : response, null, 2)}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full text-text-muted text-sm">
                {activeEnv ? 'Run a query to see results' : 'Configure an environment first'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
