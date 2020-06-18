import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Movie } from "./Movie";
import { Theatre } from "./Theatre";

export interface BaseSession {
    id: string;

    movie: Movie;

    theatre: Theatre;

    startTime: Date;

    endTime: Date;
}

@ObjectType()
@modelOptions({ schemaOptions: { collection: "sessions", id: false } })
export class Session {
    @Field(() => ID)
    @prop({ index: true, unique: true })
    id!: string;

    @Field(() => Movie)
    @prop({ ref: Movie, index: true })
    movie!: Ref<Movie>;

    @Field(() => Theatre)
    @prop({ ref: Theatre, index: true })
    theatre!: Ref<Theatre>;

    @Field(() => Date)
    @prop({ index: true })
    startTime!: Date;

    @Field(() => Date)
    @prop({ index: true })
    endTime!: Date;
}

export const SessionModel = getModelForClass(Session);
