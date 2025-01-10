import { gql } from '@apollo/client'

export const CREATE_ORDER = gql`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(createOrderInput: $createOrderInput) {
      id
      total_amount
    }
  }
`

export const CREATE_CHECKOUT_SESSION = gql`
  mutation CreateCheckoutSession($createOrderInput: CreateOrderInput!) {
    createCheckoutSession(createOrderInput: $createOrderInput)
  }
`
