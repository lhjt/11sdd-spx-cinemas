import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "theatres" } })
export class Theatre {
    @prop()
    name!: string;
}

export const TheatreModel = getModelForClass(Theatre);
