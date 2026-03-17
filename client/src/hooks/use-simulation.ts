import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { type SimulationConfig, type SimulationResult, simulationResultSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useRunSimulation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (config: SimulationConfig) => {
      // Validate input before sending (optional but good practice)
      const res = await fetch(api.simulation.run.path, {
        method: api.simulation.run.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Simulation failed");
      }

      const data = await res.json();
      // Validate response with Zod
      return simulationResultSchema.parse(data);
    },
    onError: (error: Error) => {
      toast({
        title: "Simulation Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
