import { beforeAll, describe, expect, it } from "@jest/globals";
import { graphql, GraphQLSchema, print } from "graphql";
import { buildSchema } from "type-graphql";
import { UserResolver } from "../src/resolvers/userResolver";
import { authChecker } from "../src/services/auth";
import datasource from "../src/services/datasource";
import { User } from "../src/entities/userEntity";
import { me, signin, createUser } from "./graphql/gql";
import { NoteResolver } from "../src/resolvers/noteResolver";

let schema: GraphQLSchema;

beforeAll(async () => {
  // connect to DB
  await datasource.initialize();

  // purge DB
  try {
    const entities = datasource.entityMetadatas;
    const tableNames = entities
      .map((entity) => `"${entity.tableName}"`)
      .join(", ");
    await datasource.query(`TRUNCATE ${tableNames} CASCADE;`);
    console.log("[TEST DATABASE]: Clean");
  } catch (error) {
    throw new Error(`ERROR: Cleaning test database : ${JSON.stringify(error)}`);
  }

  // compute GraphQL schema
  schema = await buildSchema({
    resolvers: [UserResolver, NoteResolver],
    authChecker,
  });
});

describe("users", () => {
  describe("user signup", () => {
    it("creates a new user", async () => {
      // check here

      const result = await graphql({
        schema,
        source: print(createUser),
        variableValues: {
          data: {
            email: "toto@test.com",
            password: "supersecret",
          },
        },
      });
      expect(result.data.createUser).toBeTruthy();
    });
    it("creates user in db", async () => {
      const user = await datasource
        .getRepository(User)
        .findOneBy({ email: "toto@test.com" });
      expect(user.password !== "supersecret").toBe(true);
      expect(user).toBeDefined();
    });
    it("cannot create 2 users with the same email", async () => {
      const result = await graphql({
        schema,
        source: print(createUser),
        variableValues: {
          data: {
            email: "toto@test.com",
            password: "supersecret",
          },
        },
      });
      expect(result.data.createUser).toBe("Server error");
    });
  });

  describe("user signin", () => {
    let userToken: string;
    it("returns a token on a valid mutation", async () => {
      const result = await graphql({
        schema,
        source: print(signin),
        variableValues: {
          data: {
            email: "toto@test.com",
            password: "supersecret",
          },
        },
      });

      expect(result.data?.signin).toBeTruthy();
      expect(typeof result.data?.signin).toBe("string");
      userToken = result.data.signin;
    });

    it("returns current logged user", async () => {
      const result = await graphql({
        schema,
        source: print(me),
        contextValue: {
          token: userToken,
        },
      });

      expect(result.data?.me).toBeTruthy();
      expect(result.data.me.email).toBe("toto@test.scom");
    });
  });
});
