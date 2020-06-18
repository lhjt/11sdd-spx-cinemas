import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";

export interface BaseTheatre {
    id: string;
    name: string;
}

@ObjectType()
@modelOptions({ schemaOptions: { collection: "theatres", id: false } })
export class Theatre implements BaseTheatre {
    @Field(() => ID)
    @prop({ index: true, unique: true })
    id!: string;

    @Field()
    @prop()
    name!: string;
}

export const TheatreModel = getModelForClass(Theatre);
