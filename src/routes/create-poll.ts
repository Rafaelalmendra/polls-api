import z from "zod";
import { FastifyInstance } from "fastify";

// libs
import { prisma } from "lib";

const createPoll = async (app: FastifyInstance) => {
  app.post("/polls", async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
    });

    const { title } = createPollBody.parse(request.body);

    const responsePoll = await prisma.poll.create({
      data: {
        title,
      },
    });

    return reply.code(201).send(responsePoll);
  });
};

export { createPoll };
