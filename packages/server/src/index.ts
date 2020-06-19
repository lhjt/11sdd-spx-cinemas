import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { DatabaseController } from "./classes/DatabaseController";
import { MovieResolver } from "./resolvers/MovieResolver";
import { ReservationResolver } from "./resolvers/ReservationResolver";
import { SessionResolver } from "./resolvers/SessionResolver";
import { UserResolver } from "./resolvers/UserResolver";
import "./schemas/views/SessionsView";

async function startServer(): Promise<void> {
    await DatabaseController.initialise("mongodb://localhost:27017/spx-cinemas");
    // await createTheatres();
    // await createMovies(10);
    // await createSessions(50);
    // createUsers(200);

    const schema = await buildSchema({
        resolvers: [MovieResolver, SessionResolver, ReservationResolver, UserResolver],
    });

    const app = express();
    const apolloServer = new ApolloServer({ schema });

    apolloServer.applyMiddleware({ app, path: "/graph" });

    app.listen(3001, () => console.log("Listening at http://localhost:3001"));
}

startServer();
