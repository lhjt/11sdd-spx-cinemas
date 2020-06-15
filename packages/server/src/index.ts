import mongoose from "mongoose";
import "reflect-metadata";
import { Role, User, UserModel } from "./classes/User";

mongoose
    .connect("mongodb://localhost:27017/spx-cinemas", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        mongoose.set("debug", true);

        const user = new User();
        user.firstName = "TestFirstName";
        user.lastName = "TestLastName";
        user.email = "test@test.com";
        user.createdAt = new Date();
        user.role = Role.user;
        const userDocument = new UserModel(user);

        console.log(user);
        console.log(userDocument);
        userDocument.save();
    });
