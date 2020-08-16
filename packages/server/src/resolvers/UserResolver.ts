import { UserInputError } from "apollo-server-express";
import bcrypt from "bcrypt";
import {
    Arg,
    Field,
    FieldResolver,
    InputType,
    Mutation,
    Query,
    Resolver,
    Root,
} from "type-graphql";
import { v4 as uuid4 } from "uuid";
import { Role, User, UserBase, UserModel } from "../schemas/User";
import { ReservationView } from "../schemas/views/ReservationView";
import { ReservationResolver } from "./ReservationResolver";

@InputType()
class CreateUserArgs {
    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field()
    email!: string;

    @Field()
    password!: string;
}

@Resolver(User)
export class UserResolver {
    @Query(() => User, { nullable: true })
    async getUserDetails(@Arg("userId") userId: string): Promise<User | null> {
        return await UserModel.findOne({ id: userId });
    }

    @FieldResolver(() => [ReservationView])
    async reservations(@Root() user: UserBase): Promise<ReservationView[]> {
        return await ReservationResolver.aggregateReservationView(user.id);
    }

    @Mutation(() => User)
    async createUser(
        @Arg("userDetails") { email, firstName, lastName, password }: CreateUserArgs
    ): Promise<User> {
        const user = new User();
        user.id = uuid4();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.createdAt = new Date();
        user.role = Role.customer;
        user.password = await bcrypt.hash(password, 3);

        const checkUser = await UserModel.findOne({ email });
        if (checkUser)
            throw new UserInputError(`Invalid email: ${email} has already been registered.`);

        console.log(user);

        try {
            const userDoc = new UserModel(user);
            console.log(userDoc);
            await userDoc.save();
            return userDoc;
        } catch (error) {
            return error;
        }
    }
}
