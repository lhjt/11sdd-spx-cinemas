import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
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

export const SessionsViewModel = getModelForClass(SessionsView);
