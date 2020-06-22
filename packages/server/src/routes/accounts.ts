import bcyrpt from "bcrypt";
import bodyParser from "body-parser";
import { Router } from "express";
import { UserModel } from "../schemas/User";
import jwt from "jsonwebtoken";

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

    // TODO: Integrate JWT and refresh tokens
    return res.sendStatus(200);
});
