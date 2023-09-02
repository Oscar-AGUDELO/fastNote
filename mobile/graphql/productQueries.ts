import { gql } from "@apollo/client";

export const products = gql`
  query Products {
    products {
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
`;

// export const getProduct = gql`
//   query Product($productId: ID!) {
//     product(id: $wilderId) {
//       # category {
//       #     id   
//       #     name
//       #     image   
//       # }
//       description
//       disponibility
//       image
//       name
//       price
//       # ajouter réservations
//     }
//   }
// `;

export const createProduct = gql`
  mutation createProduct($data: ProductInput!) {
    createProduct(data: $data) {
      category {
        id
        name
        image
      }
      description
      disponibility
      image
      name
      price
    }
  }
`;

export const updateWilder = gql`
  mutation UpdateProduct($data: ProductInput!, $id: ID!) {
    updateProduct(data: $data, Id: $id) {
      category {
        id
        name
        image
      }
      description
      disponibility
      image
      name
      price
    }
  }
`;

export const deleteWilder = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(Id: $id) {
      name
    }
  }
`;
