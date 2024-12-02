import { CognitoUserPool } from 'amazon-cognito-identity-js'

const userPoolId = process.env.USERPOOL_ID
const clientId = process.env.CLIENT_ID

if (!userPoolId || !clientId) {
  throw new Error(
    'Missing Cognito User Pool ID or Client ID in environment variables',
  )
}

export const userPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId,
})
