import z from "zod";
import { FastifyInstance } from "fastify";

// libs
import { prisma } from "lib";

export const getPoll = async (app: FastifyInstance) => {
  app.get("/polls/:pollId", async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = getPollParams.parse(request.params);

    const responsePoll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return reply.send({ responsePoll });
  });
};
