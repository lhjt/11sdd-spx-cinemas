import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { Logger } from "../classes/Logger";
import { Movie } from "./Movie";
import { Theatre } from "./Theatre";

@modelOptions({ schemaOptions: { collection: "testView", id: false } })
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
}

// TODO: Fix view creation code in relation to this function call

Logger.info("Running getModelForClass");
export const SessionsViewModel = getModelForClass(SessionsView);
Logger.info("Done getModelForClass");
