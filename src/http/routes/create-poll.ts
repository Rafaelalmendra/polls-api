import z from "zod";
import { FastifyInstance } from "fastify";
import { prisma } from "lib";

export const createPoll = async (app: FastifyInstance) => {
  app.post("/polls", async (request, reply) => {
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    });

    const { title, options } = createPollBody.parse(request.body);

    const responsePoll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map((option) => {
              return { title: option };
            }),
          },
        },
      },
    });

    return reply.code(201).send(responsePoll);
  });
};
