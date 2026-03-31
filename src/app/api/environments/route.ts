import { NextResponse } from 'next/server';
import {
  getEnvironments, createEnvironment, updateEnvironment,
  deleteEnvironment, setActiveEnvironment, getActiveEnvironment,
  saveCredential, getCredential
} from '@/lib/db';
import { validateAuth } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const envs = getEnvironments();
  return NextResponse.json(envs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;

  if (action === 'create') {
    const id = uuidv4();
    createEnvironment({
      id,
      name: body.name || 'New Environment',
      baseUrl: body.baseUrl || 'https://api.github.com',
      enterpriseSlug: body.enterpriseSlug || '',
      orgName: body.orgName || '',
      authMethod: body.authMethod || 'pat',
    });

    if (body.token) {
      saveCredential(id, 'pat', body.token);
    }
    if (body.appCredentials) {
      saveCredential(id, 'github-app', JSON.stringify(body.appCredentials));
    }

    // If first environment, activate it
    const envs = getEnvironments();
    if (envs.length === 1) {
      setActiveEnvironment(id);
    }

    return NextResponse.json({ id, success: true });
  }

  if (action === 'update') {
    updateEnvironment(body.id, {
      name: body.name,
      baseUrl: body.baseUrl,
      enterpriseSlug: body.enterpriseSlug,
      orgName: body.orgName,
      authMethod: body.authMethod,
    });

    if (body.token) {
      saveCredential(body.id, 'pat', body.token);
    }
    if (body.appCredentials) {
      saveCredential(body.id, 'github-app', JSON.stringify(body.appCredentials));
    }

    return NextResponse.json({ success: true });
  }

  if (action === 'activate') {
    setActiveEnvironment(body.id);
    return NextResponse.json({ success: true });
  }

  if (action === 'delete') {
    deleteEnvironment(body.id);
    return NextResponse.json({ success: true });
  }

  if (action === 'validate') {
    const result = await validateAuth(body.id);
    return NextResponse.json(result);
  }

  if (action === 'get-active') {
    const active = getActiveEnvironment();
    return NextResponse.json(active || null);
  }

  if (action === 'has-credential') {
    const cred = getCredential(body.id);
    return NextResponse.json({ hasCredential: !!cred });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
