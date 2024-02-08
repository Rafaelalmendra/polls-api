import z from "zod";
import { randomUUID } from "crypto";
import { FastifyInstance } from "fastify";
import { prisma, redis } from "lib";

export const voteOnPoll = async (app: FastifyInstance) => {
  app.post("/polls/:pollId/votes", async (request, reply) => {
    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    });
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    const { pollId } = voteOnPollParams.parse(request.params);
    const { pollOptionId } = voteOnPollBody.parse(request.body);

    let { sessionId } = request.cookies;

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        },
      });

      if (
        userPreviousVoteOnPoll &&
        userPreviousVoteOnPoll.pollOptionId !== pollOptionId
      ) {
        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id,
          },
        });

        await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId);
      } else if (userPreviousVoteOnPoll) {
        return reply.status(400).send({
          message: "You have already voted on this poll",
        });
      }
    }

    if (!sessionId) {
      sessionId = randomUUID();

      reply.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        signed: true,
        httpOnly: true, // cookie is only accessible via HTTP (back-end)
      });
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    });

    await redis.zincrby(pollId, 1, pollOptionId);

    return reply.status(201).send();
  });
};
