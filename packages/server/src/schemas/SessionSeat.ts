import { getModelForClass, index, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Session } from "inspector";
import { Reservation } from "./Reservation";
import { Seat } from "./Seat";

@modelOptions({ schemaOptions: { collection: "session-seats", id: false } })
@index({ session: 1, reservation: 1, seat: 1 }, { name: "sessionReservationSeatIndex" })
export class SessionSeat {
    @prop({ index: true, unique: true })
    id!: string;

    @prop({ ref: Session, index: true })
    session!: Ref<Session>;

    @prop({ ref: Seat, index: true })
    seat!: Ref<Seat>;

    @prop({ index: true })
    reserved!: boolean;

    @prop({ ref: "Reservation", index: true })
    reservation!: Ref<Reservation>;
}

export const SeatSessionModel = getModelForClass(SessionSeat);
