import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";
import { User, UserData } from "./userEntity";

@Entity()
@ObjectType()
export class Note {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  title: string;

  @Column()
  @Field()
  content: string;

  @Field(() => UserData)
  @ManyToOne(() => User, "notes")
  user: UserData;
  
  @Column({ nullable: true })
  @Field({ nullable: true })
  deleted: Date;
}

@InputType()
export class NoteInput {
  @Field()
  title: string;

  @Field()
  content: string;
}
