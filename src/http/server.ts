import fastify from "fastify";
import { createPoll } from "http/routes";

const app = fastify();
app.register(createPoll);

app.listen({ port: 3333 }).then(() => {
  console.log("Server is running on port 3333");
});
