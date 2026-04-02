import { NextResponse } from 'next/server';
import { createOctokit, } from '@/lib/auth';
import { getActiveEnvironment } from '@/lib/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { query, variables, environmentId } = body;

  const envId = environmentId || getActiveEnvironment()?.id;
  if (!envId) {
    return NextResponse.json({ error: 'No active environment' }, { status: 400 });
  }

  if (!query) {
    return NextResponse.json({ error: 'query is required' }, { status: 400 });
  }

  try {
    const { octokit, baseUrl } = createOctokit(envId);

    // GitHub GraphQL endpoint
    const graphqlUrl = baseUrl.replace(/\/+$/, '').replace('/api/v3', '') + '/graphql';
    // For api.github.com, the GraphQL endpoint is api.github.com/graphql
    const url = baseUrl.includes('api.github.com') ? 'https://api.github.com/graphql' : graphqlUrl;

    const auth = await octokit.auth() as { token?: string };

    const startTime = performance.now();
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${auth.token}`,
      },
      body: JSON.stringify({ query, variables: variables || {} }),
    });
    const timing = Math.round(performance.now() - startTime);

    const responseBody = await res.json();

    const rateLimit = {
      limit: parseInt(res.headers.get('x-ratelimit-limit') || '0'),
      remaining: parseInt(res.headers.get('x-ratelimit-remaining') || '0'),
      reset: parseInt(res.headers.get('x-ratelimit-reset') || '0'),
    };

    return NextResponse.json({
      status: res.status,
      body: responseBody,
      timing,
      rateLimit,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
