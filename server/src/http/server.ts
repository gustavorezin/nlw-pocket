import fastify from "fastify";
import { createGoal } from "../services/create-goal";
import z from "zod";

const app = fastify();

app.post("/goals", async (request) => {
  const createGoalSchema = z.object({
    title: z.string(),
    desiredWeeklyFrequency: z.number().int().min(1).max(7),
  });
  const body = createGoalSchema.parse(request.body);
  await createGoal(body);
});

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running! 🏆");
});
