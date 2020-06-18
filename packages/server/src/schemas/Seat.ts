import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, Int, ObjectType } from "type-graphql";
import { Theatre } from "./Theatre";

@ObjectType()
@modelOptions({ schemaOptions: { collection: "seats", id: false } })
export class Seat {
    @Field(() => ID)
    @prop({ index: true, unique: true })
    id!: string;

    @Field(() => Theatre)
    @prop({ ref: Theatre, index: true })
    theatre!: Ref<Theatre>;

    @Field()
    @prop({ index: true, maxlength: 1 })
    row!: string;

    @Field(() => Int)
    @prop({ index: true })
    seatNumber!: number;
}

export const SeatModel = getModelForClass(Seat);
