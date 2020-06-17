import { getModelForClass, modelOptions, mongoose, prop } from "@typegoose/typegoose";
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

    /**
     * Creates a new MongoDB `View` for `SessionsView`.
     * @param connection Connection to the database.
     */
    public static async createView(connection: mongoose.Connection): Promise<void> {
        if ((await connection.db.listCollections({ name: "sessions" }).toArray()).length !== 1)
            await connection.db.createCollection("sessions");
        await connection.db.createCollection("testView", {
            viewOn: "sessions",
            pipeline: [
                { $match: {} },
                {
                    $lookup: {
                        from: "movies",
                        localField: "movie",
                        foreignField: "_id",
                        as: "movie",
                    },
                },
                { $unwind: { path: "$movie", preserveNullAndEmptyArrays: true } },
                {
                    $lookup: {
                        from: "theatres",
                        localField: "theatre",
                        foreignField: "_id",
                        as: "theatre",
                    },
                },
                { $unwind: { path: "$theatre", preserveNullAndEmptyArrays: true } },
            ],
        });
        Logger.success("Created SessionsView View");
    }
}

export const SessionsViewModel = getModelForClass(SessionsView);
