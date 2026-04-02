export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  items: TemplateItem[];
}

export interface TemplateItem {
  method: string;
  path: string;
  summary: string;
  pathParams?: Record<string, string>; // keys use {{placeholders}} like {{org}}, {{enterprise}}
  queryParams?: Record<string, string>;
}

export const templates: Template[] = [
  {
    id: 'copilot-audit',
    name: 'Copilot Audit',
    description: 'Comprehensive Copilot usage and billing overview for an organization',
    icon: '🤖',
    items: [
      { method: 'GET', path: '/orgs/{org}/copilot/billing', summary: 'Get Copilot billing summary' },
      { method: 'GET', path: '/orgs/{org}/copilot/billing/seats', summary: 'List all Copilot seat assignments' },
      { method: 'GET', path: '/orgs/{org}/copilot/metrics', summary: 'Get Copilot usage metrics' },
      { method: 'GET', path: '/orgs/{org}/copilot/coding-agent/permissions', summary: 'Get coding agent permissions' },
      { method: 'GET', path: '/orgs/{org}/copilot/coding-agent/permissions/repositories', summary: 'List coding agent repo permissions' },
      { method: 'GET', path: '/orgs/{org}/copilot/content_exclusion', summary: 'Get content exclusion rules' },
    ],
  },
  {
    id: 'copilot-enterprise-metrics',
    name: 'Copilot Enterprise Metrics',
    description: 'Enterprise-wide Copilot usage reports and per-user activity',
    icon: '📊',
    items: [
      { method: 'GET', path: '/enterprises/{enterprise}/copilot/metrics/reports/enterprise-1-day', summary: 'Enterprise metrics (1 day)', queryParams: { day: new Date().toISOString().slice(0, 10) } },
      { method: 'GET', path: '/enterprises/{enterprise}/copilot/metrics/reports/enterprise-28-day/latest', summary: 'Enterprise metrics (28 day latest)' },
      { method: 'GET', path: '/enterprises/{enterprise}/copilot/metrics/reports/users-1-day', summary: 'Per-user metrics (1 day)', queryParams: { day: new Date().toISOString().slice(0, 10) } },
      { method: 'GET', path: '/enterprises/{enterprise}/copilot/metrics/reports/users-28-day/latest', summary: 'Per-user metrics (28 day latest)' },
      { method: 'GET', path: '/orgs/{org}/copilot/metrics/reports/organization-1-day', summary: 'Org metrics (1 day)', queryParams: { day: new Date().toISOString().slice(0, 10) } },
      { method: 'GET', path: '/orgs/{org}/copilot/metrics/reports/organization-28-day/latest', summary: 'Org metrics (28 day latest)' },
    ],
  },
  {
    id: 'org-health',
    name: 'Org Health Check',
    description: 'Overview of organization members, teams, repos, and settings',
    icon: '🏥',
    items: [
      { method: 'GET', path: '/orgs/{org}', summary: 'Get organization details' },
      { method: 'GET', path: '/orgs/{org}/members', summary: 'List org members', queryParams: { per_page: '100' } },
      { method: 'GET', path: '/orgs/{org}/teams', summary: 'List teams', queryParams: { per_page: '100' } },
      { method: 'GET', path: '/orgs/{org}/repos', summary: 'List repos', queryParams: { per_page: '100', sort: 'updated' } },
      { method: 'GET', path: '/orgs/{org}/outside_collaborators', summary: 'List outside collaborators' },
      { method: 'GET', path: '/orgs/{org}/hooks', summary: 'List org webhooks' },
      { method: 'GET', path: '/orgs/{org}/installations', summary: 'List app installations' },
    ],
  },
  {
    id: 'security-posture',
    name: 'Security Posture',
    description: 'Security alerts, scanning status, and code security configurations',
    icon: '🔒',
    items: [
      { method: 'GET', path: '/orgs/{org}/code-scanning/alerts', summary: 'List code scanning alerts', queryParams: { state: 'open', per_page: '100' } },
      { method: 'GET', path: '/orgs/{org}/secret-scanning/alerts', summary: 'List secret scanning alerts', queryParams: { state: 'open', per_page: '100' } },
      { method: 'GET', path: '/orgs/{org}/dependabot/alerts', summary: 'List Dependabot alerts', queryParams: { state: 'open', per_page: '100' } },
      { method: 'GET', path: '/enterprises/{enterprise}/code-security/configurations', summary: 'List enterprise security configs' },
      { method: 'GET', path: '/enterprises/{enterprise}/dependabot/alerts', summary: 'List enterprise Dependabot alerts', queryParams: { state: 'open' } },
    ],
  },
  {
    id: 'actions-overview',
    name: 'Actions Overview',
    description: 'GitHub Actions runners, workflows, secrets, and cache usage',
    icon: '⚡',
    items: [
      { method: 'GET', path: '/orgs/{org}/actions/runners', summary: 'List self-hosted runners' },
      { method: 'GET', path: '/orgs/{org}/actions/secrets', summary: 'List org secrets' },
      { method: 'GET', path: '/orgs/{org}/actions/variables', summary: 'List org variables' },
      { method: 'GET', path: '/orgs/{org}/actions/permissions', summary: 'Get Actions permissions' },
      { method: 'GET', path: '/orgs/{org}/actions/cache/usage', summary: 'Get Actions cache usage' },
      { method: 'GET', path: '/orgs/{org}/actions/permissions/selected-actions', summary: 'Get allowed actions' },
    ],
  },
  {
    id: 'emu-setup',
    name: 'EMU Discovery',
    description: 'Explore your EMU environment: orgs, users, SCIM, and team sync',
    icon: '🔑',
    items: [
      { method: 'GET', path: '/user', summary: 'Get authenticated user' },
      { method: 'GET', path: '/user/orgs', summary: 'List your organizations' },
      { method: 'GET', path: '/orgs/{org}/members', summary: 'List org members', queryParams: { per_page: '100' } },
      { method: 'GET', path: '/orgs/{org}/teams', summary: 'List teams' },
      { method: 'GET', path: '/enterprises/{enterprise}/teams', summary: 'List enterprise teams' },
      { method: 'GET', path: '/scim/v2/organizations/{org}/Users', summary: 'List SCIM provisioned users' },
      { method: 'GET', path: '/orgs/{org}/credential-authorizations', summary: 'List SAML SSO authorizations' },
    ],
  },
  {
    id: 'repo-deep-dive',
    name: 'Repository Deep Dive',
    description: 'Full overview of a single repository: branches, PRs, issues, deployments',
    icon: '📁',
    items: [
      { method: 'GET', path: '/repos/{owner}/{repo}', summary: 'Get repository details' },
      { method: 'GET', path: '/repos/{owner}/{repo}/branches', summary: 'List branches' },
      { method: 'GET', path: '/repos/{owner}/{repo}/pulls', summary: 'List pull requests', queryParams: { state: 'open' } },
      { method: 'GET', path: '/repos/{owner}/{repo}/issues', summary: 'List issues', queryParams: { state: 'open' } },
      { method: 'GET', path: '/repos/{owner}/{repo}/deployments', summary: 'List deployments' },
      { method: 'GET', path: '/repos/{owner}/{repo}/actions/workflows', summary: 'List workflows' },
      { method: 'GET', path: '/repos/{owner}/{repo}/collaborators', summary: 'List collaborators' },
      { method: 'GET', path: '/repos/{owner}/{repo}/topics', summary: 'Get repo topics' },
    ],
  },
];
