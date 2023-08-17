import { AuthChecker } from "type-graphql";
import { JwtPayload, verify } from "jsonwebtoken";
import datasource from "./datasource";
import { User, UserData } from "../entities/userEntity";

export interface IContext {
  token: string | JwtPayload | null;
  user: UserData | null;
}

export const authChecker: AuthChecker<IContext> = async ({ context }) => {
  const token = context.token as string;
  if (token === null || token === "" || !token) {
    return false;
  }
  try {
    const todaySeconds = new Date().getTime();
    const sevenDaysInMiliseconds = 604800000;
    const decodedToken = verify(token, process.env.TOKEN_PASS) as JwtPayload;
    const userId = decodedToken.id;
    const user = await datasource.getRepository(User).findOne({
      where: { id: userId },
      relations: ["notes", "notes.user"],
    });

    if (!user) {
      return false;
    }

    const notesFiltered = user.notes.filter(
      (note) =>
        !note.deleted ||
        note.deleted.getTime() + sevenDaysInMiliseconds > todaySeconds
    );
    const userNotesFitered = { ...user, notes: notesFiltered };
    context.user = userNotesFitered as UserData;
    return true;
  } catch {
    return false;
  }
};
