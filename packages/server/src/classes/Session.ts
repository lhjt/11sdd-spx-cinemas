import { getModelForClass, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Movie } from "./Movie";
import { Theatre } from "./Theatre";

@modelOptions({ schemaOptions: { collection: "sessions" } })
export class Session {
    @prop({ ref: Movie, index: true })
    movie!: Ref<Movie>;

    @prop({ ref: Theatre, index: true })
    theatre!: Ref<Theatre>;

    @prop({ index: true })
    startTime!: Date;

    @prop({ index: true })
    endTime!: Date;
}

export const SessionModel = getModelForClass(Session);