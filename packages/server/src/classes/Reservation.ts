import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { User } from "./User";

@modelOptions({ schemaOptions: { collection: "reservations" } })
export class Reservation {
    @prop({ ref: User })
    user!: Ref<User>;
}

export const ReservationModel = getModelForClass(Reservation);
