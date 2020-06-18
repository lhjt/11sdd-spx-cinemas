import { getModelForClass, index, modelOptions, prop } from "@typegoose/typegoose";
import { Field, ID, Int, ObjectType } from "type-graphql";

export interface MovieBase {
    id: string;

    name: string;

    genre: string[];

    director: string;

    duration: number;

    rating: number;
}

@ObjectType()
@modelOptions({ schemaOptions: { collection: "movies", id: false } })
@index({ name: "text" }, { name: "movieNameIndex" })
export class Movie implements MovieBase {
    @Field(() => ID)
    @prop({ index: true, unique: true })
    id!: string;

    @Field()
    @prop()
    name!: string;

    @Field(() => [String])
    @prop({ type: String })
    genre!: string[];

    @Field()
    @prop()
    director!: string;

    @Field(() => Int)
    @prop()
    duration!: number;

    @Field(() => Int)
    @prop({ index: true })
    rating!: number;
}

export const MovieModel = getModelForClass(Movie);
