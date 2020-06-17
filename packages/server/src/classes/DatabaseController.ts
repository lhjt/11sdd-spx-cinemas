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
        Logger.warn("DatabaseController.createViews() is currently a stub");
    }
}
