import bcyrpt from "bcrypt";
import bodyParser from "body-parser";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { RefreshTokenController as RTC } from "../classes/RefreshToken";
import { UserModel } from "../schemas/User";

export const accountsRouter = Router();

interface LoginObject {
    email: string;
    password: string;
}

accountsRouter.post("/login", bodyParser.json(), async (req, res) => {
    const { email, password } = req.body as LoginObject;
    if (!email || !password) return res.sendStatus(400);

    const user = await UserModel.findOne({ email });
    if (!user) return res.sendStatus(404);

    const correctPassword = await bcyrpt.compare(password, user.password);
    if (!correctPassword) return res.sendStatus(404);

    const token = jwt.sign(
        { uid: user.id },
        process.env.CINEMA_BACKEND_SIGNING_KEY ?? "super-secret-test-key",
        { expiresIn: "15m" }
    );

    console.log(jwt.decode(token));

    return res.cookie("_r", RTC.instance.createToken(user.id)).send(token);
});
