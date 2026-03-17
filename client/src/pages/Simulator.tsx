import { useState } from "react";
import { useRunSimulation } from "@/hooks/use-simulation";
import { ProcessInput } from "@/components/simulation/ProcessInput";
import { GanttChart } from "@/components/simulation/GanttChart";
import { MetricsDisplay } from "@/components/simulation/MetricsDisplay";
import { Process, AlgorithmType } from "@shared/schema";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Simulator() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>("RR");
  const [quantum, setQuantum] = useState<number>(2);
  
  const { mutate: runSimulation, data: result, isPending, error } = useRunSimulation();

  const handleRun = () => {
    runSimulation({
      algorithm,
      timeQuantum: quantum,
      processes,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Single Algorithm Simulation</h1>
        <p className="text-muted-foreground">Configure processes and run the scheduler to visualize execution.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Simulation Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <ProcessInput
        processes={processes}
        onProcessesChange={setProcesses}
        algorithm={algorithm}
        onAlgorithmChange={setAlgorithm}
        quantum={quantum}
        onQuantumChange={setQuantum}
        onRun={handleRun}
        isRunning={isPending}
      />

      {result && (
        <div className="space-y-8 mt-12 pt-8 border-t border-border animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">Simulation Results</h2>
            <div className="text-sm font-mono bg-muted px-3 py-1 rounded border border-border">
              Total Duration: {result.timeline[result.timeline.length - 1]?.endTime || 0} ticks
            </div>
          </div>
          
          <GanttChart 
            timeline={result.timeline} 
            totalTime={result.timeline[result.timeline.length - 1]?.endTime || 0} 
          />
          
          <MetricsDisplay results={result} />
        </div>
      )}
    </div>
  );
}
