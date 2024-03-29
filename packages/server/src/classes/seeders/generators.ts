import { DocumentType } from "@typegoose/typegoose";
import bcrypt from "bcrypt";
import faker from "faker";
import { DateTime } from "luxon";
import { Document } from "mongoose";
import uuid from "uuid";
import { movies } from "../../data/movies";
import { Movie, MovieModel } from "../../schemas/Movie";
import { Reservation, ReservationModel } from "../../schemas/Reservation";
import { Seat, SeatModel } from "../../schemas/Seat";
import { Session, SessionModel } from "../../schemas/Session";
import { SessionSeat, SessionSeatModel } from "../../schemas/SessionSeat";
import { Theatre, TheatreModel } from "../../schemas/Theatre";
import { Role, User, UserModel } from "../../schemas/User";
import { Logger } from "../Logger";

export async function createUsers(quantity: number): Promise<void> {
    const array: number[] = [];
    for (let index = 0; index < quantity; index++) {
        array.push(index);
    }
    const reservationDocuments = [];
    const userDocuments = [];
    // for (const _ of array) {
    for (let index = 0; index < quantity; index++) {
        if (index % 100 === 0) console.log(`At:`, index);
        const user = new User();
        user.id = uuid.v4();
        user.firstName = faker.name.firstName();
        user.lastName = faker.name.lastName();
        user.createdAt = new Date();
        user.email = faker.internet.email(user.firstName, user.lastName);
        user.role = Role.customer;
        user.password = await bcrypt.hash(faker.random.alphaNumeric(12), 5);
        const userDocument = new UserModel(user);

        // await userDocument.save();
        userDocuments.push(userDocument);

        // console.group("User Saver Round");
        // console.log("user Saved to the database");

        const reservation = new Reservation();
        reservation.id = uuid.v4();
        reservation.seats = [];
        reservation.user = userDocument;
        reservation.userId = userDocument.id;
        reservation.reservationDate = faker.date.recent(5);
        const reservationDocument = new ReservationModel(reservation);

        const seats = [];
        const numArray: number[] = [];

        for (let j = 0; j < 3; j++) {
            numArray.push(j);
        }
        // for (const _ of numArray) {
        for (let index = 0; index < 3; index++) {
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
            )[0] as Session;
            sessionSeat.session = session;
            sessionSeat.sessionId = session.id;
            const sessionSeatDocument = new SessionSeatModel(sessionSeat);

            seats.push(sessionSeatDocument);
        }

        await SessionSeatModel.insertMany(seats);

        reservationDocument.seats = [...seats];
        // promises.push(reservationDocument.save());

        // await reservationDocument.save();
        reservationDocuments.push(reservationDocument);

        // console.log("Saved reservation document");
        // console.groupEnd();
    }
    console.log("Inserting documents");
    await ReservationModel.insertMany(reservationDocuments);
    await UserModel.insertMany(userDocuments);
    Logger.success("Created Reservation and Users");
    // await Promise.all(promises);
    // console.log("Length of changes:", promises);
}

export async function createSessions(quantity: number): Promise<void> {
    const promises: Promise<unknown>[] = [];
    for (let i = 0; i < quantity; i++) {
        const session = new Session();
        session.id = uuid.v4();
        session.startTime = faker.date.between(
            new Date(),
            DateTime.local().plus({ weeks: 2 }).toJSDate()
        );
        const movieDocuments: DocumentType<Movie>[] = await MovieModel.aggregate([
            { $match: {} },
            { $sample: { size: 1 } },
        ]);
        session.movie = movieDocuments[0];
        session.movieId = movieDocuments[0].id;
        session.endTime = DateTime.fromJSDate(session.startTime)
            .plus({ minutes: session.movie.duration + 15 })
            .toJSDate();

        session.theatre = (
            await TheatreModel.aggregate([{ $match: {} }, { $sample: { size: 1 } }])
        )[0];
        promises.push(new SessionModel(session).save());
    }
    console.log("Awaiting promises");
    await Promise.all(promises);
    console.log("Promise await complete");
}

export async function createMovies(): Promise<void> {
    const awaitingMovies: DocumentType<Movie>[] = [];
    for (const movieData of movies) {
        const movie = new Movie();
        movie.classification = movieData.classification;
        movie.director = movieData.director;
        movie.duration = movieData.duration;
        movie.genre = movieData.genre;
        movie.id = movieData.id;
        movie.name = movieData.name;
        movie.plot = movieData.plot;
        movie.poster = movieData.poster;
        movie.rating = movieData.rating;
        movie.trailerURL = movieData.trailerURL;

        const movieDocument = new MovieModel(movie);
        awaitingMovies.push(movieDocument);
    }
    await MovieModel.insertMany(awaitingMovies);
}

export async function createTheatres(): Promise<void> {
    const waitingPromises: Promise<unknown>[] = [];
    for (let i = 0; i < 3; i++) {
        const theatre = new Theatre();
        theatre.id = uuid.v4();
        theatre.name = (i + 1).toString();
        const theatreDocument = new TheatreModel(theatre);
        await theatreDocument.save();
        waitingPromises.push(theatreDocument.save());

        for (const character of "abcdefgh") {
            for (let i = 0; i < 10; i++) {
                const seat = new Seat();
                seat.id = uuid.v4();
                seat.row = character;
                seat.seatNumber = i + 1;
                seat.theatre = theatreDocument;
                waitingPromises.push(new SeatModel(seat).save());
            }
        }
    }
    await Promise.all(waitingPromises);
}
