// utils/cognito.ts
import { CognitoUserPool } from 'amazon-cognito-identity-js'

const USERPOOL_ID =
  process.env.NEXT_PUBLIC_USERPOOL_ID || 'ap-southeast-1_B2t5ShK8e'
const CLIENT_ID =
  process.env.NEXT_PUBLIC_CLIENT_ID || '40k77idega82fmd5qpcfbjh86m'

export const cognitoUserPool = new CognitoUserPool({
  UserPoolId: USERPOOL_ID,
  ClientId: CLIENT_ID,
})
