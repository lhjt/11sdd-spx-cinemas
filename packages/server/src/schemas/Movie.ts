import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "movies", id: false } })
@index({ name: "text" }, { name: "movieNameIndex" })
export class Movie {
    @prop({ index: true, unique: true })
    id!: string;

    @prop()
    name!: string;

    @prop({ type: String })
    genre!: string[];

    @prop()
    director!: string;

    @prop()
    duration!: number;

    @prop({ index: true })
    rating!: number;
}

export const MovieModel = getModelForClass(Movie);
