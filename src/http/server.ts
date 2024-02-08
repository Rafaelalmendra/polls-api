import fastify from "fastify";
import cookie from "@fastify/cookie";
import { createPoll, getPoll, voteOnPoll } from "http/routes";
import { pollResults } from "./ws";
import websocket from "@fastify/websocket";

const app = fastify();

app.register(cookie, {
  secret: "polls-app-secret-key",
  hook: "onRequest",
});

app.register(websocket);

app.register(getPoll);
app.register(getPoll);
app.register(createPoll);
app.register(voteOnPoll);
app.register(pollResults);

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running on port 3333");
});
