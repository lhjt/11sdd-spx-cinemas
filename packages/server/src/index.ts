import "reflect-metadata";
import { DatabaseController } from "./classes/DatabaseController";
import { SessionsViewModel } from "./schemas/SessionsView";

async function startServer(): Promise<void> {
    await DatabaseController.initialise("mongodb://localhost:27017/spx-cinemas");
    // await createUsers(1000);
    // await createTheatres();
    console.log(await SessionsViewModel.find());
}

startServer();
