import { userPool } from '@/lib/cognito'
import { set_cookie } from '@/lib/cookie'
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request): Promise<NextResponse> {
  const { email, password } = await request.json()

  const user = new CognitoUser({
    Username: email,
    Pool: userPool,
  })

  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  })

  try {
    const token = await authenticateUser(user, authDetails)
    // トークンをCookieに保存
    setAuthCookies(email, token)

    return NextResponse.json({ message: 'Sign-in successful!' })
  } catch (error: unknown) {
    // Type guard to ensure error is an object with a message property
    const errorMessage = error instanceof Error ? error.message : String(error)

    return NextResponse.json({ error: errorMessage }, { status: 401 })
  }
}

// Cognito認証をPromiseにラップ
function authenticateUser(
  user: CognitoUser,
  authDetails: AuthenticationDetails,
): Promise<string> {
  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
      onFailure: reject,
    })
  })
}

// 認証用のCookieを設定
function setAuthCookies(email: string, token: string) {
  set_cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  })

  set_cookie('email', email, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}
