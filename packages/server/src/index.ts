import mongoose from "mongoose";
import "reflect-metadata";

mongoose
    .connect("mongodb://localhost:27017/spx-cinemas", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(async () => {
        mongoose.set("debug", true);

        console.log("Successfully connected to the database");
    });
