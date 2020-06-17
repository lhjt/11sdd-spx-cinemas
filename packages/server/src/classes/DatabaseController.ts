import { mongoose } from "@typegoose/typegoose";
import { Logger } from "./Logger";

export class DatabaseController {
    private static _connection: mongoose.Connection;

    /**
     * Initialise the database controller and connect to the specified `connectionAddress`.
     * @param connectionAddress The address of the database to connect to.
     */
    public static async initialise(connectionAddress: string): Promise<void> {
        const conn = await mongoose.connect(connectionAddress, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        this._connection = conn.connection;
        if (process.env.NODE_ENV !== "production") mongoose.set("debug", true);

        await this.createViews();
        Logger.success("Successfully initialised and connected to the database");
    }

    /** Connection to the current database. */
    public static get connection(): mongoose.Connection {
        if (!(this._connection instanceof mongoose.Connection))
            throw new Error("Cannot connect to a database before running `initialise()`");
        return this._connection;
    }

    /**
     * Instantiate the views for the database.
     */
    private static async createViews(): Promise<void> {
        await this.createSessionsView();
    }

    /**
     * Creates a new MongoDB `View` for `SessionsView`.
     * @param connection Connection to the database.
     */
    private static async createSessionsView(): Promise<void> {
        if (
            (await this._connection.db.listCollections({ name: "sessions" }).toArray()).length !== 1
        ) {
            await this._connection.db.createCollection("sessions");
            Logger.info("Sessions had to be created");
        }
        Logger.info("Creating the testView collection");
        await this._connection.db.dropCollection("testView");
        await this._connection.db.createCollection("testView", {
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
