import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We don't strictly need a database for a simulator, but we'll define the process structure here for consistency.
// This schema is mainly used for Zod validation of API requests/responses.

export const ALGORITHMS = [
  "FCFS",
  "RR",
  "SPN",
  "SRT",
  "HRRN",
  "FB",
  "FBV",
  "AGING"
] as const;

export type AlgorithmType = typeof ALGORITHMS[number];

export const processSchema = z.object({
  id: z.string(),
  arrivalTime: z.number().int().min(0),
  burstTime: z.number().int().min(1),
  priority: z.number().int().default(0),
});

export type Process = z.infer<typeof processSchema>;

export const simulationConfigSchema = z.object({
  algorithm: z.enum(ALGORITHMS),
  timeQuantum: z.number().int().min(1).default(2),
  processes: z.array(processSchema).min(1),
});

export type SimulationConfig = z.infer<typeof simulationConfigSchema>;

export const timeSliceSchema = z.object({
  startTime: z.number(),
  endTime: z.number(),
  processId: z.string().nullable(), // null for IDLE
  state: z.enum(["RUNNING", "IDLE", "CONTEXT_SWITCH"]),
});

export type TimeSlice = z.infer<typeof timeSliceSchema>;

export const processMetricsSchema = z.object({
  processId: z.string(),
  arrivalTime: z.number(),
  burstTime: z.number(),
  completionTime: z.number(),
  turnaroundTime: z.number(),
  waitingTime: z.number(),
  responseTime: z.number(),
});

export type ProcessMetrics = z.infer<typeof processMetricsSchema>;

export const simulationResultSchema = z.object({
  timeline: z.array(timeSliceSchema),
  metrics: z.array(processMetricsSchema),
  averages: z.object({
    waitingTime: z.number(),
    turnaroundTime: z.number(),
    responseTime: z.number(),
    cpuUtilization: z.number(),
  }),
});

export type SimulationResult = z.infer<typeof simulationResultSchema>;
