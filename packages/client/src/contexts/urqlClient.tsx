import { createClient } from "urql";

export const client = createClient({
    url: "/graph",
    requestPolicy: "cache-and-network",
});
