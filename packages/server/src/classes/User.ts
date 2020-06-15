import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

export enum Role {
    admin = "admin",
    user = "user",
}

@modelOptions({ schemaOptions: { collection: "users" } })
export class User {
    @prop({ trim: true })
    firstName!: string;

    @prop({ trim: true })
    lastName!: string;

    @prop({
        match: /.+\@.+\..+/,
        trim: true,
    })
    email!: string;

    @prop()
    createdAt!: Date;

    @prop({ enum: Role })
    role!: Role;
}

export const UserModel = getModelForClass(User);
