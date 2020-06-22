import crypto from "crypto";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";

interface TokenMetadata {
    uid: string;
    exp: Date;
}

export class TokenController {
    private tokenList: Map<string, TokenMetadata> = new Map();
    private static _instance: TokenController;
    static get instance(): TokenController {
        if (!TokenController._instance) TokenController._instance = new TokenController();
        return TokenController._instance;
    }

    /**
     * Create a new JWT for a user
     * @param uid User id
     */
    public createJWT(uid: string): string {
        return jwt.sign(
            { uid },
            process.env.CINEMA_BACKEND_SIGNING_KEY ?? "super-secret-test-key",
            { expiresIn: "15m" }
        );
    }

    /**
     * Creates a refresh token attached to a uid
     * @param uid User id
     */
    public createRefreshToken(uid: string): string {
        const token = crypto.randomBytes(64).toString("hex");
        const expiryTime = DateTime.local().plus({ days: 2 }).toJSDate();
        this.tokenList.set(token, { exp: expiryTime, uid });
        console.log("Current tokens:", this.tokenList);
        return token;
    }

    /**
     * Confirms if a refresh token is valid and if it is, returns the uid
     * @param token Refresh token to check
     */
    public checkRefreshToken(token: string): false | string {
        const data = this.tokenList.get(token);
        if (!data) return false;
        if (data.exp < new Date()) return false;
        return data.uid;
    }
}
