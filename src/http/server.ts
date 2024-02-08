import fastify from "fastify";
import cookie from "@fastify/cookie";
import { createPoll, getPoll, voteOnPoll } from "http/routes";

const app = fastify();

app.register(cookie, {
  secret: "polls-app-secret-key",
  hook: "onRequest",
});

app.register(getPoll);
app.register(createPoll);
app.register(voteOnPoll);

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running on port 3333");
});
