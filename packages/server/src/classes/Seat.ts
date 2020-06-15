import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Theatre } from "./Theatre";

@modelOptions({ schemaOptions: { collection: "seats" } })
export class Seat {
    @prop({ ref: Theatre, index: true })
    theatre!: Ref<Theatre>;

    @prop({ index: true, maxlength: 1 })
    row!: string;

    @prop({ index: true })
    seatNumber!: number;
}

export const SeatModel = getModelForClass(Seat);
