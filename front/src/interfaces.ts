import { CSSProperties } from "react";

export interface INote {
  id: string;
  title: string;
  content: string;
  createdAt: Date | null;
  deleted: Date | null;
  user: { id: string };
}
export interface INoteInput {
  title: string;
  content: string;
}

export interface IStyles {
  [key: string]: CSSProperties;
}

export interface IDATA {
  screenMode: "horizontal" | "vertical";
  burger: boolean;
  setBurger: (burger: boolean) => void;
  user: IUser | null | undefined;
  refetchUser: Function;
}
export interface IUser {
  id: number;
  email: string;
  createdAt: Date;
  notes: INote[];
}

export interface IContent {
  style: IStyles;
  text: string[];
}
