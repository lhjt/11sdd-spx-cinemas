import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { SessionSeat } from "./SessionSeat";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "reservations", id: false } })
export class Reservation {
    @prop({ index: true, unique: true })
    id!: string;

    @prop({ ref: User, index: true })
    user!: Ref<User>;

    @prop({ ref: SessionSeat, index: true })
    seats!: Ref<SessionSeat>[];
}

export const ReservationModel = getModelForClass(Reservation);
