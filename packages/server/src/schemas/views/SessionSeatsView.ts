import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
class SessionsSeatTheatre {
    @Field(() => ID)
    id!: string;

    @Field()
    name!: string;
}
@ObjectType()
class SessionSeatsSeat {
    @Field(() => ID)
    id!: string;

    @Field(() => SessionsSeatTheatre)
    theatre!: SessionsSeatTheatre;

    @Field()
    row!: string;

    @Field(() => Int)
    seatNumber!: number;
}

@ObjectType()
export class SessionSeatsView {
    @Field()
    id!: string;

    @Field(() => SessionSeatsSeat)
    seat!: SessionSeatsSeat;
}
