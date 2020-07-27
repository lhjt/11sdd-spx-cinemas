import { Field, ID, Int, ObjectType } from "type-graphql";
import { Movie } from "../Movie";
import { Theatre } from "../Theatre";

@ObjectType()
class ReservationSeat {
    @Field(() => ID)
    id!: string;

    @Field()
    row!: string;

    @Field(() => Int)
    seatNumber!: number;
}

@ObjectType()
class ReservationSession {
    @Field(() => ID)
    id!: string;

    @Field(() => Movie)
    movie!: Movie;

    @Field(() => Theatre)
    theatre!: Theatre;

    @Field(() => Date)
    startTime!: Date;

    @Field(() => Date)
    endTime!: Date;
}

@ObjectType()
class ReservationSessionSeat {
    @Field(() => ID)
    id!: string;

    @Field(() => ReservationSession)
    session!: ReservationSession;

    @Field(() => ReservationSeat)
    seat!: ReservationSeat;

    @Field()
    reserved!: boolean;
}

@ObjectType()
export class ReservationView {
    @Field(() => ID)
    id!: string;

    @Field()
    userId!: string;

    @Field(() => ReservationSessionSeat)
    seats!: ReservationSessionSeat[];

    @Field(() => Date)
    reservationDate!: Date;
}
