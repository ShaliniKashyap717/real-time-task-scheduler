import { 
  type Process, 
  type SimulationConfig, 
  type SimulationResult 
} from "@shared/schema";

export interface IStorage {
  // We can add methods here if we want to save history later.
  // For now, it's a pass-through or simple memory store for session data.
  saveSimulation(config: SimulationConfig, result: SimulationResult): Promise<void>;
}

export class MemStorage implements IStorage {
  private history: { config: SimulationConfig; result: SimulationResult }[] = [];

  async saveSimulation(config: SimulationConfig, result: SimulationResult): Promise<void> {
    this.history.push({ config, result });
  }
}

export const storage = new MemStorage();
