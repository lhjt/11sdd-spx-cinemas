import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { DatabaseController } from "./classes/DatabaseController";
import {
    createMovies,
    createSessions,
    createTheatres,
    createUsers,
} from "./classes/seeders/generators";
import { MovieResolver } from "./resolvers/MovieResolver";
import { ReservationResolver } from "./resolvers/ReservationResolver";
import { SessionResolver } from "./resolvers/SessionResolver";
import { SessionSeatsResolver } from "./resolvers/SessionSeatResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { accountsRouter } from "./routes/accounts";
import "./schemas/views/SessionsView";
async function startServer(): Promise<void> {
    await DatabaseController.initialise("mongodb://localhost:27017/spx-cinemas");
    if (process.env.NODE_ENV === "setup") {
        await createTheatres();
        await createMovies();
        await createSessions(200);
        await createUsers(200);

        process.exit(0);
    }

    const schema = await buildSchema({
        resolvers: [
            MovieResolver,
            SessionResolver,
            ReservationResolver,
            UserResolver,
            SessionSeatsResolver,
        ],
    });

    const app = express();

    app.use(
        cors({
            origin: ["http://localhost:3000"],
            credentials: true,
        })
    );

    app.use("/accounts", accountsRouter);
    const apolloServer = new ApolloServer({ schema, tracing: true });

    apolloServer.applyMiddleware({ app, path: "/graph" });

    app.listen(3001, () => console.log("Listening at http://localhost:3001/graph"));
}

startServer();
