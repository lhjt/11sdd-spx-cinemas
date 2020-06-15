import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "theatres", _id: false } })
export class Theatre {
    @prop({ index: true, unique: true })
    id!: string;

    @prop()
    name!: string;
}

export const TheatreModel = getModelForClass(Theatre);
