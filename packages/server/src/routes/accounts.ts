import bcyrpt from "bcrypt";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import { TokenController as RTC } from "../classes/RefreshToken";
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

    const token = RTC.instance.createJWT(user.id);

    console.log(jwt.decode(token));

    return res
        .cookie("_r", RTC.instance.createRefreshToken(user.id), {
            httpOnly: true,
            sameSite: true,
            expires: DateTime.local().plus({ days: 2 }).toJSDate(),
        })
        .send(token);
});

accountsRouter.post("/refresh", cookieParser(), (req, res) => {
    if (!req.cookies._r) return res.sendStatus(400);
    const uid = RTC.instance.checkRefreshToken(req.cookies._r);
    if (!uid) return res.sendStatus(401);
    const token = RTC.instance.createJWT(uid);
    res.cookie("_r", RTC.instance.createRefreshToken(uid), {
        httpOnly: true,
        sameSite: true,
        expires: DateTime.local().plus({ days: 2 }).toJSDate(),
    }).send(token);
});
