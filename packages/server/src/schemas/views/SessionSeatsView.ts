import { buildSchema, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Session } from "inspector";
import { Document, model as newMongooseModel } from "mongoose";
import { Reservation } from "../Reservation";
import { Seat } from "../Seat";
import { SessionsView } from "./SessionsView";

@modelOptions({ schemaOptions: { collection: "populated-session-seats", id: false } })
export class SessionSeatsView {
    @prop({ index: true, unique: true })
    id!: string;

    @prop({ ref: Session, index: true })
    session!: Ref<Session>;

    @prop({ index: true })
    seat!: Seat;

    @prop({ index: true })
    reserved!: boolean;

    @prop({ index: true })
    reservation!: Reservation;
}

export const SessionsViewModel = newMongooseModel<typeof SessionsView & Document>(
    "populated-session-seats",
    buildSchema(SessionSeatsView),
    "populated-session-seats",
    true
);
