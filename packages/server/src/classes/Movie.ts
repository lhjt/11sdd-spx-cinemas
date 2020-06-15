import { arrayProp, getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { collection: "movies" } })
@index({ name: "text" })
export class Movie {
    @prop()
    name!: string;

    @arrayProp({ items: String })
    genre!: string[];

    @prop()
    director!: string;

    @prop()
    duration!: number;

    @prop({ index: true })
    rating!: number;
}

export const MovieModel = getModelForClass(Movie);
