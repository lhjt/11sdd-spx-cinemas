import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

export enum Role {
    admin = "admin",
    customer = "customer",
}

export interface UserBase {
    id: string;

    firstName: string;

    lastName: string;

    email: string;

    createdAt: Date;

    role: Role;
}

registerEnumType(Role, { name: "Role", description: "The role of the user" });

@ObjectType()
@modelOptions({ schemaOptions: { collection: "users", id: false } })
export class User {
    @Field(() => ID)
    @prop({ index: true, unique: true })
    id!: string;

    @Field()
    @prop({ trim: true })
    firstName!: string;

    @Field()
    @prop({ trim: true })
    lastName!: string;

    @Field()
    @prop({
        match: /.+\@.+\..+/,
        trim: true,
        index: true,
    })
    email!: string;

    @Field()
    @prop()
    createdAt!: Date;

    @Field(() => Role)
    @prop({ enum: Role })
    role!: Role;

    @prop({ index: true })
    password!: string;
}

export const UserModel = getModelForClass(User);
