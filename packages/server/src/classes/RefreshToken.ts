import crypto from "crypto";
import { DateTime } from "luxon";

interface TokenMetadata {
    uid: string;
    exp: Date;
}

export class RefreshTokenController {
    private tokenList: Map<string, TokenMetadata> = new Map();
    private static _instance: RefreshTokenController;
    static get instance(): RefreshTokenController {
        if (!RefreshTokenController._instance)
            RefreshTokenController._instance = new RefreshTokenController();
        return RefreshTokenController._instance;
    }

    /**
     * Creates a refresh token attached to a uid
     * @param uid User id
     */
    public createToken(uid: string): string {
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
    public checkToken(token: string): false | string {
        const data = this.tokenList.get(token);
        if (!data) return false;
        if (data.exp < new Date()) return false;
        return data.uid;
    }
}
