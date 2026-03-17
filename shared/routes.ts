import { z } from "zod";
import { simulationConfigSchema, simulationResultSchema } from "./schema";

export const api = {
  simulation: {
    run: {
      method: "POST" as const,
      path: "/api/simulation/run",
      input: simulationConfigSchema,
      responses: {
        200: simulationResultSchema,
        400: z.object({ message: z.string() }),
        500: z.object({ message: z.string() }),
      },
    },
  },
};
