import { getModelForClass, index, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Reservation } from "./Reservation";
import { Seat } from "./Seat";
import { Session } from "./Session";

export interface BaseSessionSeat {
    id: string;

    session: Session;

    seat: Seat;

    reserved: boolean;

    reservation: Reservation;
}

@ObjectType()
@modelOptions({ schemaOptions: { collection: "session-seats", id: false } })
@index({ session: 1, reservation: 1, seat: 1 }, { name: "sessionReservationSeatIndex" })
export class SessionSeat {
    @Field(() => ID)
    @prop({ index: true, unique: true })
    id!: string;

    @Field(() => Session)
    @prop({ ref: Session, index: true })
    session!: Ref<Session>;

    @Field()
    @prop({ index: true })
    sessionId!: string;

    @Field(() => Seat)
    @prop({ ref: Seat, index: true })
    seat!: Ref<Seat>;

    @Field()
    @prop({ index: true })
    reserved!: boolean;

    @Field(() => Reservation)
    @prop({ ref: "Reservation", index: true })
    reservation!: Ref<Reservation>;
}

export const SessionSeatModel = getModelForClass(SessionSeat);
