import { createClient } from "urql";

export const client = createClient({
    url: process.env.NODE_ENV === "production" ? "http://localhost:3001/graph" : "/graph",
    requestPolicy: "cache-and-network",
});
