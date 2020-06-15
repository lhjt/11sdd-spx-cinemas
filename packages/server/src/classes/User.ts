import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

export enum Role {
    admin = "admin",
    user = "user",
}

@modelOptions({ schemaOptions: { collection: "users", _id: false } })
export class User {
    @prop({ index: true, unique: true })
    id!: string;

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
