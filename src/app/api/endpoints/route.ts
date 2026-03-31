import { NextRequest, NextResponse } from 'next/server';
import {
  getEndpointCategories, getEndpointsByCategory,
  searchEndpoints, getEndpointCount
} from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'categories';

  if (action === 'categories') {
    const categories = getEndpointCategories();
    const total = getEndpointCount();
    return NextResponse.json({ categories, total });
  }

  if (action === 'by-category') {
    const category = searchParams.get('category');
    if (!category) return NextResponse.json({ error: 'category required' }, { status: 400 });
    const endpoints = getEndpointsByCategory(category);
    return NextResponse.json(endpoints);
  }

  if (action === 'search') {
    const query = searchParams.get('q');
    if (!query) return NextResponse.json({ error: 'q required' }, { status: 400 });
    const limit = parseInt(searchParams.get('limit') || '50');
    const endpoints = searchEndpoints(query, limit);
    return NextResponse.json(endpoints);
  }

  if (action === 'count') {
    const count = getEndpointCount();
    return NextResponse.json({ count });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
