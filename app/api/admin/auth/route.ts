import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

/**
 * Authenticate an admin using a password provided in the request body and respond with a JSON result.
 *
 * Attempts to read `password` from the request JSON, validates it against the configured admin password,
 * and on success returns a session token. On failure returns a JSON error with an appropriate HTTP status.
 *
 * @returns On success: `{ success: true, token: string, message: 'Authentication successful' }` with HTTP 200.
 *          If `password` is missing: `{ error: 'Password is required' }` with HTTP 400.
 *          If `password` is invalid: `{ error: 'Invalid password' }` with HTTP 401.
 *          On unexpected errors: `{ error: 'Internal server error' }` with HTTP 500.
 */
export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Simple password verification
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate a simple session token (in production, use a proper JWT library)
    const token = Buffer.from(`${Date.now()}-${Math.random()}`).toString('base64')

    return NextResponse.json(
      {
        success: true,
        token,
        message: 'Authentication successful',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
