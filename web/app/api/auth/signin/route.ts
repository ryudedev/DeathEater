import { userPool } from '@/lib/cognito' // Cognitoの設定をインポート
import { set_cookie } from '@/lib/cookie'
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js' // Cognito関連のクラスをインポート
import { NextResponse } from 'next/server' // Next.jsのレスポンスヘルパーをインポート

export async function POST(request: Request) {
  const { email, password } = await request.json() // リクエストボディからemailとpasswordを取得

  // Cognitoユーザーオブジェクトを作成
  const user = new CognitoUser({
    Username: email, // ユーザー名（ここではemailを使用）
    Pool: userPool, // Cognitoのユーザープール情報
  })

  // 認証詳細オブジェクトを作成
  const authDetails = new AuthenticationDetails({
    Username: email, // 認証に使用するユーザー名
    Password: password, // 認証に使用するパスワード
  })

  // Promiseを利用して非同期処理をラップ
  return new Promise((resolve) => {
    user.authenticateUser(authDetails, {
      onSuccess: (result) => {
        const token = result.getIdToken().getJwtToken() // JWTトークンを取得
        const response = NextResponse.json({
          message: 'Sign-in successful!',
        })

        // CookieにJWTトークンとメールアドレスを保存
        set_cookie('jwtToken', token, {
          httpOnly: true, // クライアント側からのJavaScriptでのアクセスを防止
          secure: process.env.NODE_ENV === 'production', // HTTPSでのみ送信
          sameSite: 'strict', // CSRF対策のため、同一サイトでのみ送信
          path: '/', // Cookieの有効パスを設定
          maxAge: 60 * 60 * 24, // Cookieの有効期限（例: 1日）
        })

        set_cookie('email', email, {
          httpOnly: false, // クライアント側からアクセス可能
          secure: process.env.NODE_ENV === 'production', // HTTPSでのみ送信
          sameSite: 'strict', // CSRF対策のため、同一サイトでのみ送信
          path: '/', // Cookieの有効パスを設定
          maxAge: 60 * 60 * 24, // Cookieの有効期限（例: 1日）
        })

        resolve(response)
      },
      onFailure: (err) => {
        resolve(
          NextResponse.json(
            { error: err.message },
            { status: 401 }, // エラーメッセージと401ステータスを返す
          ),
        )
      },
    })
  })
}
