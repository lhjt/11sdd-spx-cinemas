export class HexString {
    public static create(input: string) {
        return Buffer.from(input, "utf-8").toString("hex");
    }

    public static decode(input: string) {
        return Buffer.from(input, "hex").toString();
    }
}
