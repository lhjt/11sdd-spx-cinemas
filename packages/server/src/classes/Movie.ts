import { arrayProp, getModelForClass, index, prop } from "@typegoose/typegoose";

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
