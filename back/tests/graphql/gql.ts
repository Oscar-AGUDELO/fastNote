import { gql } from "apollo-server";

export const doCreateNote = gql`
  mutation CreateNote($data: NoteInput!) {
    createNote(data: $data) {
      id
      createdAt
      title
      content
      deleted
      user {
        id
      }
    }
  }
`;

export const doModifyNote = gql`
  mutation ModifyNoteById($id: ID!, $data: NoteInput!) {
    modifyNoteById(Id: $id, data: $data)
  }
`;

export const doDeleteNote = gql`
  mutation DeleteNoteById($id: ID!) {
    deleteNoteById(Id: $id)
  }
`;

export const doRestoreNote = gql`
  mutation RestoreNoteById($id: ID!) {
    restoreNoteById(Id: $id)
  }
`;

export const oneNote = gql`
  query NoteById($id: ID!) {
    noteById(Id: $id) {
      id
      createdAt
      title
      content
      deleted
      user {
        id
      }
    }
  }
`;

export const createUser = gql`
  mutation CreateUser($data: UserSignin!) {
    createUser(data: $data)
  }
`;

export const signin = gql`
  mutation Signin($data: UserSignin!) {
    signin(data: $data)
  }
`;

export const me = gql`
  query Me {
    me {
      id
      email
      createdAt
      notes {
        id
        createdAt
        title
        content
        deleted
      }
    }
  }
`;
