import { buildSchema, modelOptions, prop } from "@typegoose/typegoose";
import { Document, model as newMongooseModel } from "mongoose";
import { Movie } from "../Movie";
import { SessionSeat } from "../SessionSeat";
import { Theatre } from "../Theatre";

@modelOptions({ schemaOptions: { collection: "sessionsView", id: false } })
export class SessionsView {
    @prop()
    id!: string;

    @prop()
    movie!: Movie;

    @prop()
    theatre!: Theatre;

    @prop()
    startTime!: Date;

    @prop()
    endTime!: Date;

    @prop()
    reservedSeats!: SessionSeat[];
}

export const SessionsViewModel = newMongooseModel<typeof SessionsView & Document>(
    "sessionsView",
    buildSchema(SessionsView),
    "sessionsView",
    true
);
