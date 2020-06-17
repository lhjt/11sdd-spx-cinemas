import faker from "faker";
import uuid from "uuid";
import { Theatre, TheatreModel } from "../../schemas/Theatre";
import { Role, User, UserModel } from "../../schemas/User";

export async function createUsers(quantity: number): Promise<void> {
    for (let index = 0; index < quantity; index++) {
        const user = new User();
        user.id = uuid.v4();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.createdAt = new Date();
        user.email = faker.internet.email(user.firstName, user.lastName);
        user.role = Role.customer;
        const userDocument = new UserModel(user);
        await userDocument.save();
    }
}

export async function createTheatres(): Promise<void> {
    for (let i = 0; i < 3; i++) {
        const theatre = new Theatre();
        theatre.id = uuid.v4();
        theatre.name = faker.commerce.department();
        const theatreDocument = new TheatreModel(theatre);
        await theatreDocument.save();
    }
}
