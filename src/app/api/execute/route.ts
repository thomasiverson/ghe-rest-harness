import { NextResponse } from 'next/server';
import { createOctokit } from '@/lib/auth';
import { addHistory, getActiveEnvironment, lookupCategory } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const body = await request.json();
  const {
    environmentId,
    method,
    path: pathTemplate,
    pathParams = {},
    queryParams = {},
    headers: customHeaders = {},
    body: requestBody,
    operationId,
    category,
    nextPageUrl,
  } = body;

  // Determine target environment
  const envId = environmentId || getActiveEnvironment()?.id;
  if (!envId) {
    return NextResponse.json({ error: 'No active environment' }, { status: 400 });
  }

  try {
    const { octokit, baseUrl } = createOctokit(envId);

    // Resolve path parameters
    let resolvedPath = pathTemplate;
    for (const [key, value] of Object.entries(pathParams)) {
      resolvedPath = resolvedPath.replace(`{${key}}`, encodeURIComponent(value as string));
    }

    // Build full URL (or use nextPageUrl for pagination)
    let fullUrl: string;
    if (nextPageUrl) {
      fullUrl = nextPageUrl;
    } else {
      const queryString = Object.entries(queryParams)
        .filter(([, v]) => v !== '' && v !== undefined)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
        .join('&');
      fullUrl = `${baseUrl}${resolvedPath}${queryString ? '?' + queryString : ''}`;
    }

    // SSRF protection: validate URL against configured base
    const parsed = new URL(fullUrl);
    const baseParsed = new URL(baseUrl);
    if (parsed.hostname !== baseParsed.hostname) {
      return NextResponse.json(
        { error: `SSRF blocked: ${parsed.hostname} does not match configured base ${baseParsed.hostname}` },
        { status: 403 }
      );
    }

    // Execute request
    const startTime = performance.now();

    const fetchHeaders: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...customHeaders,
    };

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: fetchHeaders,
    };

    if (requestBody && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      fetchOptions.body = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody);
      fetchHeaders['Content-Type'] = 'application/json';
    }

    // Use octokit's auth to get the token for the request
    const auth = await octokit.auth() as { token?: string; type?: string };
    if (auth.token) {
      fetchHeaders['Authorization'] = `token ${auth.token}`;
    }

    const response = await fetch(fullUrl, fetchOptions);
    const timing = Math.round(performance.now() - startTime);

    // Parse response
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let responseBody: unknown = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('json')) {
      responseBody = await response.json();
    } else {
      const text = await response.text();
      if (text.length > 0) {
        responseBody = text;
      }
    }

    // Parse rate limit info
    const rateLimit = responseHeaders['x-ratelimit-limit'] ? {
      limit: parseInt(responseHeaders['x-ratelimit-limit']),
      remaining: parseInt(responseHeaders['x-ratelimit-remaining']),
      reset: parseInt(responseHeaders['x-ratelimit-reset']),
      used: parseInt(responseHeaders['x-ratelimit-used'] || '0'),
      resource: responseHeaders['x-ratelimit-resource'] || 'core',
    } : null;

    // Parse pagination Link header
    let nextPage: string | null = null;
    const linkHeader = responseHeaders['link'];
    if (linkHeader) {
      const nextMatch = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      if (nextMatch) {
        nextPage = nextMatch[1];
      }
    }

    // Store in history (truncate large bodies)
    const bodyStr = responseBody ? JSON.stringify(responseBody) : null;
    const truncatedBody = bodyStr && bodyStr.length > 100000 ? bodyStr.substring(0, 100000) + '...[truncated]' : bodyStr;

    addHistory({
      id: uuidv4(),
      environmentId: envId,
      method: method.toUpperCase(),
      path: pathTemplate,
      resolvedUrl: fullUrl,
      status: response.status,
      timing,
      requestBody: requestBody ? (typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody)) : null,
      responseBody: truncatedBody,
      responseHeaders: JSON.stringify(responseHeaders),
      operationId: operationId || null,
      category: category || lookupCategory(operationId || null, pathTemplate) || null,
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      timing,
      rateLimit,
      nextPageUrl: nextPage,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
