
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({ name: 'token', value: '', httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
/**
 * logout.ts (API Route)
 * ----------------------
 * This Next.js API route handles user logout.
 *
 * 1. POST Function:
 *    - Triggered when a POST request is made to this route.
 *
 * 2. NextResponse.json({ ok: true }):
 *    - Sends a JSON response indicating the logout was successful.
 *
 * 3. res.cookies.set(...):
 *    - Clears the 'token' cookie by setting its value to an empty string.
 *    - httpOnly: true → prevents client-side JS from accessing the cookie.
 *    - path: '/' → cookie is cleared for the entire site.
 *    - maxAge: 0 → immediately expires the cookie.
 *
 * 4. return res:
 *    - Returns the response with the cleared cookie to the client.
 *
 * Usage:
 * Call this endpoint from the frontend to log out the user and remove the authentication token.
 */
