import { Field, ObjectType } from "type-graphql";
import * as CSS from 'csstype';
export interface IResponse {
  type: "error" | "ok";
  message: string;
}
@ObjectType()
export class objectTypeResponse {
  @Field()
  type: "error" | "ok";

  @Field()
  message: string;
}
export interface IStyles {
  [key: string]: CSS.Properties;
}
export interface IContent {
  style: IStyles;
  text: string;
}