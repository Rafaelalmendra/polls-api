import { FastifyInstance } from "fastify";
import z from "zod";

export async function pollResults(app: FastifyInstance) {
  app.get(
    "/polls/:pollId/results",
    {
      websocket: true,
    },
    (connection, request) => {
      connection.socket.on("message", (message: string) => {
        const getPollParams = z.object({
          pollId: z.string().uuid(),
        });

        const { pollId } = getPollParams.parse(request.params);

        voting.subscribe(pollId, (message: string) => {
          connection.socket.send(JSON.stringify(message));
        });
      });
    }
  );
}