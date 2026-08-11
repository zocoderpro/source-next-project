// proxy.ts (racine du projet)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const requestId = crypto.randomUUID();
  const response = NextResponse.next();

  // Utile pour tracer une requête de bout en bout dans Cloud Logging
  response.headers.set('x-request-id', requestId);

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};