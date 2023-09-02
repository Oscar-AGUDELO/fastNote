import { gql } from "@apollo/client";

export const updateCart = gql`
  mutation UpdateCart($data: CartInput!, $id: ID!) {
    updateCart(data: $data, Id: $id) {
      id
    }
  }
`;

export const verifyReservationsList = gql`
  mutation VerifyReservationsList($id: ID!) {
    verifyReservationsList(Id: $id)
  }
`;

export const createOrder = gql`
  mutation CreateOrder {
    createOrder {
      id
    }
  }
`;

export const createReservation = gql`
  mutation CreateReservation($data: ReservationInput!) {
    createReservation(data: $data) {
      id
    }
  }
`;

export const updateReservation = gql`
  mutation UpdateReservation($data: ReservationInput!, $id: ID!) {
    updateReservation(data: $data, Id: $id) {
      id
    }
  }
`;

export const deleteReservation = gql`
  mutation DeleteReservation($id: ID!) {
    deleteReservation(Id: $id) {
      id
    }
  }
`;
