import "reflect-metadata";
import { DatabaseController } from "./classes/DatabaseController";
import "./schemas/views/SessionsView";

async function startServer(): Promise<void> {
    await DatabaseController.initialise("mongodb://localhost:27017/spx-cinemas");
    // await createTheatres();
    // await createMovies(20);
    // await createSessions(50);
    // await createUsers(30);
}

startServer();
