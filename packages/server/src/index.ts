import { ApolloServer } from "apollo-server-express";
import express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { DatabaseController } from "./classes/DatabaseController";
import { MovieResolver } from "./resolvers/MovieResolver";
import { ReservationResolver } from "./resolvers/ReservationResolver";
import { SessionResolver } from "./resolvers/SessionResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { accountsRouter } from "./routes/accounts";
import "./schemas/views/SessionsView";

async function startServer(): Promise<void> {
    await DatabaseController.initialise("mongodb://localhost:27017/spx-cinemas");
    // await createTheatres();
    // await createMovies(20);
    // await createSessions(500);
    // createUsers(2000);

    const schema = await buildSchema({
        resolvers: [MovieResolver, SessionResolver, ReservationResolver, UserResolver],
    });

    const app = express();
    app.use("/accounts", accountsRouter);
    const apolloServer = new ApolloServer({ schema, tracing: true });

    apolloServer.applyMiddleware({ app, path: "/graph" });

    app.listen(3001, () => console.log("Listening at http://localhost:3001/graph"));
}

startServer();
