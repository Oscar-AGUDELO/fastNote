import {
  Resolver,
  Mutation,
  Arg,
  Query,
  ID,
  Authorized,
  Ctx,
} from "type-graphql";
import { User, UserData, UserSignin } from "../entities/userEntity";
import datasource from "../services/datasource";
import { hash, verify } from "argon2";
import { sign } from "jsonwebtoken";
import { IContext } from "../services/auth";

@Resolver()
export class UserResolver {
  @Mutation(() => String)
  async createUser(
    @Arg("data", () => UserSignin) data: UserSignin
  ): Promise<string> {
    try {
      data.password = await hash(data.password);
      const newUser = await datasource
        .getRepository(User)
        .save({ ...data, createdAt: new Date() });
      if (newUser && newUser.id) {
        const token = sign({ id: newUser.id }, process.env.TOKEN_PASS, {
          expiresIn: "365d",
        });
        if (token) {
          return token;
        }
        return "User created, token problem ";
      } else {
        return "No user created";
      }
    } catch {
      return "Server error";
    }
  }

  @Mutation(() => String)
  async signin(
    @Arg("data", () => UserSignin) data: UserSignin
  ): Promise<string> {
    try {
      const user = await datasource
        .getRepository(User)
        .findOne({ where: { email: data.email } });

      if (!user) {
        return "No user found";
      }

      if (await verify(user.password, data.password)) {
        const token = sign({ id: user.id }, process.env.TOKEN_PASS, {
          expiresIn: "365d",
        });
        return token;
      } else {
        return "Wrong password";
      }
    } catch {
      return "Server error";
    }
  }

  @Authorized()
  @Query(() => UserData)
  async me(@Ctx() context: IContext): Promise<UserData> {
    return context.user;
  }
}
