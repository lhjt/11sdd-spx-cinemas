import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { User, UserBase, UserModel } from "../schemas/User";
import { ReservationView } from "../schemas/views/ReservationView";
import { ReservationResolver } from "./ReservationResolver";

@Resolver(User)
export class UserResolver {
    @Query(() => User, { nullable: true })
    async getUserDetails(@Arg("userId") userId: string): Promise<User | null> {
        return await UserModel.findOne({ id: userId });
    }

    @FieldResolver(() => [ReservationView])
    async reservations(@Root() user: UserBase): Promise<ReservationView[]> {
        // TODO: Create View for this Query, so that information regarding each reservation
        // TODO: can easily be accessed without needing another query
        return await ReservationResolver.aggregateReservationView(user.id);
    }
}
