import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Session } from "inspector";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "reservations" } })
export class Reservation {
    @prop({ ref: User, index: true })
    user!: Ref<User>;

    @prop({ ref: Session, index: true })
    session!: Ref<Session>;
}

export const ReservationModel = getModelForClass(Reservation);
