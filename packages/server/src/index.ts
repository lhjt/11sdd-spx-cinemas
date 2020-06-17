import "reflect-metadata";
import { DatabaseController } from "./classes/DatabaseController";

DatabaseController.initialise("mongodb://localhost:27017/spx-cinemas");
