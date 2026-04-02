export interface WebhookEvent {
  name: string;
  description: string;
  actions: string[];
  keyPayloadFields: Array<{ field: string; type: string; description: string }>;
  docsUrl: string;
}

export const webhookEvents: WebhookEvent[] = [
  {
    name: 'push',
    description: 'One or more commits are pushed to a repository branch or tag.',
    actions: [],
    keyPayloadFields: [
      { field: 'ref', type: 'string', description: 'The full git ref that was pushed (e.g. refs/heads/main)' },
      { field: 'before', type: 'string', description: 'SHA of the most recent commit before the push' },
      { field: 'after', type: 'string', description: 'SHA of the most recent commit after the push' },
      { field: 'commits', type: 'array', description: 'Array of commit objects with id, message, author, url' },
      { field: 'pusher', type: 'object', description: 'The user who pushed the commits' },
      { field: 'repository', type: 'object', description: 'Full repository object' },
      { field: 'forced', type: 'boolean', description: 'Whether this was a force push' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#push',
  },
  {
    name: 'pull_request',
    description: 'Activity related to pull requests.',
    actions: ['opened', 'closed', 'reopened', 'edited', 'assigned', 'unassigned', 'labeled', 'unlabeled', 'synchronize', 'converted_to_draft', 'ready_for_review', 'review_requested', 'review_request_removed', 'auto_merge_enabled', 'auto_merge_disabled', 'merged'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action that was performed' },
      { field: 'number', type: 'integer', description: 'The pull request number' },
      { field: 'pull_request', type: 'object', description: 'Full PR object with title, body, head, base, user, merged, mergeable' },
      { field: 'repository', type: 'object', description: 'Repository where the PR exists' },
      { field: 'sender', type: 'object', description: 'User who triggered the event' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#pull_request',
  },
  {
    name: 'pull_request_review',
    description: 'Activity related to pull request reviews.',
    actions: ['submitted', 'edited', 'dismissed'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action (submitted, edited, dismissed)' },
      { field: 'review', type: 'object', description: 'Review object with state (approved/changes_requested/commented), body, user' },
      { field: 'pull_request', type: 'object', description: 'The pull request being reviewed' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#pull_request_review',
  },
  {
    name: 'issues',
    description: 'Activity related to an issue.',
    actions: ['opened', 'closed', 'reopened', 'edited', 'deleted', 'assigned', 'unassigned', 'labeled', 'unlabeled', 'pinned', 'unpinned', 'milestoned', 'demilestoned', 'transferred', 'locked', 'unlocked'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action performed on the issue' },
      { field: 'issue', type: 'object', description: 'Full issue object with title, body, state, labels, assignees, milestone' },
      { field: 'repository', type: 'object', description: 'Repository the issue belongs to' },
      { field: 'sender', type: 'object', description: 'User who triggered the event' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#issues',
  },
  {
    name: 'issue_comment',
    description: 'Activity related to a comment on an issue or pull request.',
    actions: ['created', 'edited', 'deleted'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'created, edited, or deleted' },
      { field: 'comment', type: 'object', description: 'Comment object with body, user, created_at' },
      { field: 'issue', type: 'object', description: 'The issue or PR the comment belongs to' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#issue_comment',
  },
  {
    name: 'workflow_run',
    description: 'A GitHub Actions workflow run is requested, in progress, or completed.',
    actions: ['requested', 'in_progress', 'completed'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'requested, in_progress, or completed' },
      { field: 'workflow_run', type: 'object', description: 'Workflow run with status, conclusion, head_sha, workflow_id' },
      { field: 'workflow', type: 'object', description: 'The workflow definition' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#workflow_run',
  },
  {
    name: 'workflow_job',
    description: 'A job in a GitHub Actions workflow is queued, in progress, or completed.',
    actions: ['queued', 'in_progress', 'completed', 'waiting'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'queued, in_progress, completed, or waiting' },
      { field: 'workflow_job', type: 'object', description: 'Job with name, status, conclusion, runner_name, labels, steps' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#workflow_job',
  },
  {
    name: 'check_run',
    description: 'Check run activity (CI/CD status checks).',
    actions: ['created', 'completed', 'rerequested', 'requested_action'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action performed' },
      { field: 'check_run', type: 'object', description: 'Check run with name, status, conclusion, output, check_suite' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#check_run',
  },
  {
    name: 'deployment',
    description: 'A deployment is created.',
    actions: ['created'],
    keyPayloadFields: [
      { field: 'deployment', type: 'object', description: 'Deployment with sha, ref, task, environment, description' },
      { field: 'repository', type: 'object', description: 'Repository being deployed' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#deployment',
  },
  {
    name: 'deployment_status',
    description: 'A deployment status is updated.',
    actions: ['created'],
    keyPayloadFields: [
      { field: 'deployment_status', type: 'object', description: 'Status with state (success/failure/error/pending), environment_url' },
      { field: 'deployment', type: 'object', description: 'The deployment this status belongs to' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#deployment_status',
  },
  {
    name: 'create',
    description: 'A branch or tag is created.',
    actions: [],
    keyPayloadFields: [
      { field: 'ref', type: 'string', description: 'The git ref (branch or tag name)' },
      { field: 'ref_type', type: 'string', description: 'branch or tag' },
      { field: 'master_branch', type: 'string', description: 'The default branch of the repository' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#create',
  },
  {
    name: 'delete',
    description: 'A branch or tag is deleted.',
    actions: [],
    keyPayloadFields: [
      { field: 'ref', type: 'string', description: 'The git ref that was deleted' },
      { field: 'ref_type', type: 'string', description: 'branch or tag' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#delete',
  },
  {
    name: 'release',
    description: 'Activity related to a release.',
    actions: ['published', 'unpublished', 'created', 'edited', 'deleted', 'prereleased', 'released'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action performed' },
      { field: 'release', type: 'object', description: 'Release with tag_name, name, body, draft, prerelease, assets' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#release',
  },
  {
    name: 'repository',
    description: 'Activity related to a repository.',
    actions: ['created', 'deleted', 'archived', 'unarchived', 'edited', 'renamed', 'transferred', 'publicized', 'privatized'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action performed' },
      { field: 'repository', type: 'object', description: 'Full repository object' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#repository',
  },
  {
    name: 'member',
    description: 'Activity related to repository collaborators.',
    actions: ['added', 'removed', 'edited'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'added, removed, or edited' },
      { field: 'member', type: 'object', description: 'The user who was added/removed' },
      { field: 'changes', type: 'object', description: 'Changes to permissions (for edited action)' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#member',
  },
  {
    name: 'membership',
    description: 'User is added or removed from a team.',
    actions: ['added', 'removed'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'added or removed' },
      { field: 'member', type: 'object', description: 'The user' },
      { field: 'team', type: 'object', description: 'The team' },
      { field: 'scope', type: 'string', description: 'always "team"' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#membership',
  },
  {
    name: 'organization',
    description: 'Activity related to an organization and its members.',
    actions: ['member_added', 'member_removed', 'member_invited', 'renamed', 'deleted'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action performed' },
      { field: 'membership', type: 'object', description: 'Membership details (for member actions)' },
      { field: 'organization', type: 'object', description: 'The organization' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#organization',
  },
  {
    name: 'team',
    description: 'Activity related to a team.',
    actions: ['created', 'deleted', 'edited', 'added_to_repository', 'removed_from_repository'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action performed' },
      { field: 'team', type: 'object', description: 'The team object with name, slug, permission' },
      { field: 'repository', type: 'object', description: 'Repository (for repo add/remove actions)' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#team',
  },
  {
    name: 'code_scanning_alert',
    description: 'Activity related to code scanning alerts.',
    actions: ['created', 'reopened', 'closed_by_user', 'fixed', 'appeared_in_branch'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action performed' },
      { field: 'alert', type: 'object', description: 'Alert with rule, tool, state, most_recent_instance' },
      { field: 'ref', type: 'string', description: 'Branch ref where the alert was detected' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#code_scanning_alert',
  },
  {
    name: 'secret_scanning_alert',
    description: 'Activity related to secret scanning alerts.',
    actions: ['created', 'resolved', 'reopened', 'revoked'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action performed' },
      { field: 'alert', type: 'object', description: 'Alert with secret_type, resolution, resolved_by' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#secret_scanning_alert',
  },
  {
    name: 'dependabot_alert',
    description: 'Activity related to Dependabot alerts.',
    actions: ['created', 'dismissed', 'fixed', 'reintroduced', 'reopened'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'The action performed' },
      { field: 'alert', type: 'object', description: 'Alert with dependency, security_advisory, severity' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#dependabot_alert',
  },
  {
    name: 'star',
    description: 'A user stars or unstars a repository.',
    actions: ['created', 'deleted'],
    keyPayloadFields: [
      { field: 'action', type: 'string', description: 'created (starred) or deleted (unstarred)' },
      { field: 'starred_at', type: 'string', description: 'Timestamp when starred (null for deleted)' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#star',
  },
  {
    name: 'fork',
    description: 'A user forks a repository.',
    actions: [],
    keyPayloadFields: [
      { field: 'forkee', type: 'object', description: 'The newly created fork repository object' },
      { field: 'repository', type: 'object', description: 'The original repository that was forked' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#fork',
  },
  {
    name: 'ping',
    description: 'Sent when a new webhook is created to test the connection.',
    actions: [],
    keyPayloadFields: [
      { field: 'zen', type: 'string', description: 'Random Zen of GitHub quote' },
      { field: 'hook_id', type: 'integer', description: 'The ID of the webhook' },
      { field: 'hook', type: 'object', description: 'The webhook configuration object' },
    ],
    docsUrl: 'https://docs.github.com/webhooks/webhook-events-and-payloads#ping',
  },
];
