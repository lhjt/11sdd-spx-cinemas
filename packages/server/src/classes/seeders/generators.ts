import faker from "faker";
import { Document } from "mongoose";
import uuid from "uuid";
import { Movie, MovieModel } from "../../schemas/Movie";
import { Reservation, ReservationModel } from "../../schemas/Reservation";
import { Seat, SeatModel } from "../../schemas/Seat";
import { Session, SessionModel } from "../../schemas/Session";
import { SeatSessionModel, SessionSeat } from "../../schemas/SessionSeat";
import { Theatre, TheatreModel } from "../../schemas/Theatre";
import { Role, User, UserModel } from "../../schemas/User";
import { Logger } from "../Logger";

export async function createUsers(quantity: number): Promise<void> {
    const promises: Promise<unknown>[] = [];
    for (let index = 0; index < quantity; index++) {
        const user = new User();
        user.id = uuid.v4();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.createdAt = new Date();
        user.email = faker.internet.email(user.firstName, user.lastName);
        user.role = Role.customer;
        user.password = faker.random.alphaNumeric(12);
        const userDocument = new UserModel(user);
        promises.push(userDocument.save());

        const reservation = new Reservation();
        reservation.id = uuid.v4();
        reservation.seats = [];
        reservation.user = userDocument;
        const reservationDocument = new ReservationModel(reservation);

        const seats = [];
        for (let j = 0; j < 3; j++) {
            const sessionSeat = new SessionSeat();
            sessionSeat.id = uuid.v4();
            sessionSeat.reservation = reservationDocument;
            sessionSeat.reserved = true;
            const seat = (
                await SeatModel.aggregate<typeof Seat & Document>([
                    { $match: {} },
                    { $sample: { size: 1 } },
                ])
            )[0];
            sessionSeat.seat = seat._id;
            const session = (
                await SessionModel.aggregate([{ $match: {} }, { $sample: { size: 1 } }])
            )[0];
            sessionSeat.session = session;
            // console.log(sessionSeat.session);
            const sessionSeatDocument = new SeatSessionModel(sessionSeat);
            promises.push(sessionSeatDocument.save());
            seats.push(sessionSeatDocument._id);
        }
        reservationDocument.seats = [...seats];
        promises.push(reservationDocument.save());
    }
    Logger.success("Created Reservation and Users");
    await Promise.all(promises);
}

export async function createSessions(quantity: number): Promise<void> {
    const promises: Promise<unknown>[] = [];
    const milliseconds = 1000 * 60 * 100;
    for (let i = 0; i < quantity; i++) {
        const session = new Session();
        session.id = uuid.v4();
        session.startTime = faker.date.recent();
        session.endTime = new Date(session.startTime.getMilliseconds() + milliseconds);
        session.movie = (await MovieModel.aggregate([{ $match: {} }, { $sample: { size: 1 } }]))[0];
        session.theatre = (
            await TheatreModel.aggregate([{ $match: {} }, { $sample: { size: 1 } }])
        )[0];
        promises.push(new SessionModel(session).save());
    }
    await Promise.all(promises);
}

export async function createMovies(quantity: number): Promise<void> {
    const awaitingMovies = [];
    for (let i = 0; i < quantity; i++) {
        const m = new Movie();
        m.director = faker.name.findName();
        m.duration = 100;
        m.genre = [...faker.random.words(3).toLowerCase().split(" ")];
        m.id = uuid.v4();
        m.name = faker.random.words(2).toLowerCase().split(" ").join("-");
        m.rating = faker.random.number({ max: 5, min: 0, precision: 2 });
        const mDoc = new MovieModel(m);
        awaitingMovies.push(mDoc.save());
    }
    await Promise.all(awaitingMovies);
}

export async function createTheatres(): Promise<void> {
    const waitingPromises: Promise<unknown>[] = [];
    for (let i = 0; i < 3; i++) {
        const theatre = new Theatre();
        theatre.id = uuid.v4();
        theatre.name = faker.random.word().toLowerCase();
        const theatreDocument = new TheatreModel(theatre);
        await theatreDocument.save();
        waitingPromises.push(theatreDocument.save());

        for (const character of "abcdefgh") {
            for (let i = 0; i < 10; i++) {
                const seat = new Seat();
                seat.id = uuid.v4();
                seat.row = character;
                seat.seatNumber = i + 1;
                waitingPromises.push(new SeatModel(seat).save());
            }
        }
    }
    await Promise.all(waitingPromises);
}
