import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const CLIENT_ID = process.env.CLIENT_ID || '';
const TENANT_ID = process.env.TENANT_ID || '';
const CLIENT_SECRET = process.env.CLIENT_SECRET || '';
const SESSION_SECRET = process.env.SESSION_SECRET || 'mokshay-session-super-secret-key-123';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export function getRedirectUri(reqUrl?: string) {
  if (reqUrl) {
    const urlObj = new URL(reqUrl);
    return `${urlObj.origin}/api/auth/callback`;
  }
  return `${APP_URL}/api/auth/callback`;
}

export function getAuthUrl(state: string, reqUrl: string) {
  const redirectUri = encodeURIComponent(getRedirectUri(reqUrl));
  const tenant = TENANT_ID || 'common';
  return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=openid%20profile%20email%20User.Read&state=${state}`;
}

export async function exchangeCodeForToken(code: string, reqUrl: string) {
  const redirectUri = getRedirectUri(reqUrl);
  const tenant = TENANT_ID || 'common';
  const tokenUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange code: ${errorText}`);
  }

  return response.json();
}

export interface AdminSession {
  email: string;
  name: string;
  role: string;
  isMock?: boolean;
}

export function createSessionToken(payload: AdminSession): string {
  return jwt.sign(payload, SESSION_SECRET, { expiresIn: '8h' });
}

export function verifySessionToken(token: string): AdminSession | null {
  try {
    return jwt.verify(token, SESSION_SECRET) as AdminSession;
  } catch (err) {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('mokshay_admin_session')?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch (err) {
    console.error('Error fetching admin session:', err);
    return null;
  }
}

export interface CustomerSession {
  id: string;
  email: string;
  name: string;
  isMock?: boolean;
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('mokshay_customer_session')?.value;
    if (!token) return null;
    return jwt.verify(token, SESSION_SECRET) as CustomerSession;
  } catch (err) {
    return null;
  }
}
