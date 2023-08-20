import "reflect-metadata";
require("dotenv").config();
import { ApolloServer } from "apollo-server";
import datasource from "./services/datasource";
import { buildSchema } from "type-graphql";
import { authChecker } from "./services/auth";
import { UserResolver } from "./resolvers/userResolver";
import { NoteResolver } from "./resolvers/noteResolver";

const PORT = 5000;

async function bootstrap(): Promise<void> {
  const schema = await buildSchema({
    resolvers: [UserResolver, NoteResolver],
    validate: {
      forbidUnknownValues: false,
    },
    authChecker,
  });

  const server = new ApolloServer({
    schema,
    cors: true,
    context: ({ req }) => {
      const authorization: string = req?.headers?.authorization;

      if (authorization) {
        const token = authorization.split(" ").pop();
        return { token };
      }
      return { token: null };
    },
  });

  try {
    await datasource.initialize();
    console.log("Server started!");
    const { url } = await server.listen(PORT);
    console.log(`Server is running, GraphQL Playground available at ${url}`);
  } catch (err) {
    console.log("Server problem!: ", err);
  }
}

bootstrap();
