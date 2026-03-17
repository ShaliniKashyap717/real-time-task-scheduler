import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Compile C++ on startup (or check if exists)
  const schedulerDir = path.join(process.cwd(), "scheduler");
  const executablePath = path.join(schedulerDir, "scheduler");
  
  // Simple compilation check
  if (!fs.existsSync(executablePath)) {
    console.log("Compiling C++ scheduler...");
    try {
      const compileProcess = spawn("g++", ["-o", "scheduler", "main.cpp", "scheduler.cpp"], {
        cwd: schedulerDir,
        stdio: "inherit"
      });
      
      compileProcess.on('close', (code) => {
        if (code === 0) {
          console.log("Compilation successful.");
        } else {
          console.error("Compilation failed.");
        }
      });
    } catch (e) {
      console.error("Failed to start compilation:", e);
    }
  }

  app.post(api.simulation.run.path, async (req, res) => {
    try {
      const config = api.simulation.run.input.parse(req.body);

      // Convert config to custom input format for C++
      // Line 1: ALGO QUANTUM
      // Line 2: NUM_PROCESSES
      // Line 3+: ID ARRIVAL BURST PRIORITY
      
      let inputData = `${config.algorithm} ${config.timeQuantum}\n`;
      inputData += `${config.processes.length}\n`;
      config.processes.forEach(p => {
        // Ensure ID is safe (no spaces), though schema allows string. 
        // We'll replace spaces with underscores just in case.
        const safeId = p.id.replace(/\s+/g, '_');
        inputData += `${safeId} ${p.arrivalTime} ${p.burstTime} ${p.priority}\n`;
      });

      // Spawn C++ process
      const child = spawn(executablePath, [], {
        cwd: schedulerDir
      });

      let stdoutData = "";
      let stderrData = "";

      child.stdin.write(inputData);
      child.stdin.end();

      child.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });

      child.stderr.on("data", (data) => {
        stderrData += data.toString();
      });

      child.on("close", (code) => {
        if (code !== 0) {
          console.error("Scheduler error:", stderrData);
          return res.status(500).json({ message: "Scheduler execution failed", details: stderrData });
        }

        try {
          const result = JSON.parse(stdoutData);
          // Optional: save to history
          storage.saveSimulation(config, result);
          res.json(result);
        } catch (e) {
          console.error("Failed to parse JSON output from C++:", stdoutData);
          res.status(500).json({ message: "Invalid output from scheduler", output: stdoutData });
        }
      });

    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          path: err.errors[0].path
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}
