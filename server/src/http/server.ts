import fastify from "fastify";
import { createGoal } from "../services/create-goal";
import z from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { getWeekPendingGoals } from "../services/get-week-pending-goals";
import { CreateGoalCompletion } from "../services/create-goal-completion";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/pending-goals", async () => {
  const { pendingGoals } = await getWeekPendingGoals();
  return { pendingGoals };
});

app.post(
  "/goals",
  {
    schema: {
      body: z.object({
        title: z.string(),
        desiredWeeklyFrequency: z.number(),
      }),
    },
  },
  async (request) => {
    const { title, desiredWeeklyFrequency } = request.body;
    await createGoal({ title, desiredWeeklyFrequency });
  }
);

app.post(
  "/goal-completions",
  {
    schema: {
      body: z.object({
        goalId: z.string(),
      }),
    },
  },
  async (request) => {
    const { goalId } = request.body;
    await CreateGoalCompletion({ goalId });
  }
);

app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running! 🏆");
});
