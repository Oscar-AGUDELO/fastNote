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
import { IResponse, objectTypeResponse } from "../utils/interfaces";
import { Note, NoteInput } from "../entities/noteEntity";

@Resolver()
export class NoteResolver {
  @Authorized()
  @Mutation(() => Note, { nullable: true })
  async createNote(
    @Ctx() context: IContext,
    @Arg("data", () => NoteInput) data: NoteInput
  ): Promise<Note> {
    try {
      const newNote = await datasource.getRepository(Note).save({
        ...data,
        createdAt: new Date(),
        user: context.user,
      });
      if (newNote && newNote.id) {
        return newNote;
      }
      console.log({
        type: "error",
        message: "No user created",
      });
    } catch {
      console.log({
        type: "error",
        message: "Server error",
      });
    }
  }

  @Authorized()
  @Query(() => Note, { nullable: true })
  async noteById(
    @Ctx() context: IContext,
    @Arg("Id", () => ID) id: string
  ): Promise<Note | void> {
    try {
      const note = await datasource
        .getRepository(Note)
        .findOne({ where: { id }, relations: ["user"] });
      if (note && note.id) {
        if (context.user.id === note.user.id) {
          return note;
        }
        console.log({
          type: "error",
          message: "No owner note",
        });
      }
      console.log({
        type: "error",
        message: "Note not found",
      });
    } catch {
      console.log({
        type: "error",
        message: "Server error",
      });
    }
  }

  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async deleteNoteById(
    @Ctx() context: IContext,
    @Arg("Id", () => ID) id: string
  ): Promise<boolean> {
    try {
      const note = await datasource
        .getRepository(Note)
        .findOne({ where: { id }, relations: ["user"] });
      if (note && note.id) {
        if (context.user.id === note.user.id) {
          const noteDeleted = await datasource.getRepository(Note).save({
            ...note,
            deleted: new Date(),
          });
          if (noteDeleted && noteDeleted.id) {
            console.log({
              type: "ok",
              message: "Note deleted!",
            });
            return true;
          }
          console.log({
            type: "error",
            message: "Note not deleted",
          });
          return false;
        }
        console.log({
          type: "error",
          message: "No owner note",
        });
        return false;
      }
      console.log({
        type: "error",
        message: "Note not found",
      });
      return false;
    } catch {
      console.log({
        type: "error",
        message: "Server error",
      });
      return false;
    }
  }

  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async restoreNoteById(
    @Ctx() context: IContext,
    @Arg("Id", () => ID) id: string
  ): Promise<boolean> {
    try {
      const note = await datasource
        .getRepository(Note)
        .findOne({ where: { id }, relations: ["user"] });
      if (note && note.id) {
        if (context.user.id === note.user.id) {
          const noteRestored = await datasource.getRepository(Note).save({
            ...note,
            deleted: null,
          });
          if (noteRestored && noteRestored.id) {
            console.log({
              type: "ok",
              message: "Note restored!",
            });
            return true;
          }
          console.log({
            type: "error",
            message: "Note not restored",
          });
          return true;
        }
        console.log({
          type: "error",
          message: "No owner note",
        });
        return true;
      }
      console.log({
        type: "error",
        message: "Note not found",
      });
      return true;
    } catch {
      console.log({
        type: "error",
        message: "Server error",
      });
      return true;
    }
  }

  @Authorized()
  @Mutation(() => Boolean, { nullable: true })
  async modifyNoteById(
    @Ctx() context: IContext,
    @Arg("data", () => NoteInput) data: NoteInput,
    @Arg("Id", () => ID) id: string
  ): Promise<boolean> {
    try {
      const note = await datasource
        .getRepository(Note)
        .findOne({ where: { id }, relations: ["user"] });
      if (note && note.id) {
        if (context.user.id === note.user.id) {
          const noteUpdated = await datasource.getRepository(Note).save({
            ...note,
            ...data,
          });
          if (noteUpdated && noteUpdated.id) {
            console.log({
              type: "ok",
              message: "Note modified!",
            });
            return true;
          }
          console.log({
            type: "error",
            message: "Note no modified",
          });
          return true;
        }
        console.log({
          type: "error",
          message: "No owner note",
        });
        return true;
      }
      console.log({
        type: "error",
        message: "Note not found",
      });
      return true;
    } catch {
      console.log({
        type: "error",
        message: "Server error",
      });
      return true;
    }
  }
}
