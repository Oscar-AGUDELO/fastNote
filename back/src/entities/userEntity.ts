import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { Note } from "./noteEntity";

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt: Date;

  @Field(() => [Note], { nullable: true })
  @OneToMany(() => Note, "user", { nullable: true })
  notes: Note[];
}

@ObjectType()
export class UserData {
  @Field()
  id: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  createdAt: Date;

  @Field(() => [Note], { nullable: true })
  notes: Note[];
}

@InputType()
export class UserSignin {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @Length(8, 60)
  password: string;
}
