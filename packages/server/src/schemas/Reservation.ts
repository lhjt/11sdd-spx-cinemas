import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { SessionSeat } from "./SessionSeat";
import { User } from "./User";

@ObjectType()
@modelOptions({ schemaOptions: { collection: "reservations", id: false } })
export class Reservation {
    @Field(() => ID)
    @prop({ index: true, unique: true })
    id!: string;

    @Field(() => User)
    @prop({ ref: User, index: true })
    user!: Ref<User>;

    @Field()
    @prop({ index: true })
    userId!: string;

    @Field(() => SessionSeat)
    @prop({ ref: SessionSeat, index: true })
    seats!: Ref<SessionSeat>[];

    @Field(() => Date)
    @prop()
    reservationDate!: Date;
}

export const ReservationModel = getModelForClass(Reservation);
