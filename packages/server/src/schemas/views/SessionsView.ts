import { addModelToTypegoose, buildSchema, modelOptions, prop } from "@typegoose/typegoose";
import { model as newMongooseModel } from "mongoose";
import { Field, ID, ObjectType } from "type-graphql";
import { Movie } from "../Movie";
import { BaseSessionSeat, SessionSeat } from "../SessionSeat";
import { Theatre } from "../Theatre";

@ObjectType()
@modelOptions({ schemaOptions: { collection: "sessionsView", id: false } })
export class SessionsView {
    @Field(() => ID)
    @prop()
    id!: string;

    @Field(() => Movie)
    @prop()
    movie!: Movie;

    @Field(() => Theatre)
    @prop()
    theatre!: Theatre;

    @Field(() => Date)
    @prop()
    startTime!: Date;

    @Field(() => Date)
    @prop()
    endTime!: Date;

    @Field(() => [SessionSeat])
    @prop()
    reservedSeats!: BaseSessionSeat[];
}

export const SessionsViewModel = addModelToTypegoose(
    newMongooseModel("sessionsView", buildSchema(SessionsView), "sessionsView", true),
    SessionsView
);
