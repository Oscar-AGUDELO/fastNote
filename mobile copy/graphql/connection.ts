import { gql } from "@apollo/client";

export const createUser = gql`
  mutation CreateUser($data: UserInput!) {
    createUser(data: $data)
  }
`;

export const signin = gql`
  mutation Signin($password: String!, $email: String!) {
    signin(password: $password, email: $email)
  }
`;

export const saveTokenNotificationPush = gql`
  mutation SaveTokenNotificationPush($userId: ID!, $token: String!) {
    saveTokenNotificationPush(userId: $userId, token: $token)
  }
`;

export const me = gql`
  query Me {
    me {
      id
      email
      password
      firstname
      lastname
      deliveryAdress
      createdAt
      cart {
        id
        billingfirstname
        billingLastname
        billingAdress
        deliveryfirstname
        deliveryLastname
        deliveryAdress
        lastTimeModified
        reservations {
          id
          startDate
          endDate
          quantity
          price
          taxes
          product {
            id
            name
            description
            image
            price
            quantity
            disponibility
            category {
              id
              name
              image
            }
          }
        }
      }
      orders {
        id
        billingfirstname
        billingLastname
        billingAdress
        deliveryfirstname
        deliveryLastname
        deliveryAdress
        totalPrice
        statusDelivery
        date
        reservations {
          id
          startDate
          endDate
          quantity
          price
          taxes
          nbJours
          product {
            id
            name
            description
            image
            price
            quantity
            disponibility
            category {
              id
              name
              image
            }
          }
        }
      }
    }
  }
`;
