import { useState } from "react";
import { useRunSimulation } from "@/hooks/use-simulation";
import { ProcessInput } from "@/components/simulation/ProcessInput";
import { GanttChart } from "@/components/simulation/GanttChart";
import { MetricsDisplay } from "@/components/simulation/MetricsDisplay";
import { Process, AlgorithmType } from "@shared/schema";
import { Separator } from "@/components/ui/separator";

export default function Compare() {
  const [processes, setProcesses] = useState<Process[]>([]);
  
  // Left config
  const [algo1, setAlgo1] = useState<AlgorithmType>("FCFS");
  const [q1, setQ1] = useState<number>(2);
  
  // Right config
  const [algo2, setAlgo2] = useState<AlgorithmType>("RR");
  const [q2, setQ2] = useState<number>(2);

  const sim1 = useRunSimulation();
  const sim2 = useRunSimulation();

  const handleRunAll = () => {
    if (processes.length === 0) return;
    
    sim1.mutate({
      algorithm: algo1,
      timeQuantum: q1,
      processes: processes,
    });
    
    sim2.mutate({
      algorithm: algo2,
      timeQuantum: q2,
      processes: processes,
    });
  };

  const isRunning = sim1.isPending || sim2.isPending;

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Compare Algorithms</h1>
        <p className="text-muted-foreground">Run the same workload on two different algorithms side-by-side.</p>
      </div>

      {/* Shared Input Section */}
      <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Shared Workload Configuration</h3>
        <ProcessInput
          processes={processes}
          onProcessesChange={setProcesses}
          algorithm={algo1} // Dummy binding, we override controls below
          onAlgorithmChange={() => {}} // Disabled here
          quantum={2}
          onQuantumChange={() => {}}
          onRun={handleRunAll}
          isRunning={isRunning}
        />
        <div className="mt-4 text-xs text-muted-foreground text-center">
          *Note: Process configuration above applies to BOTH simulations below.
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Simulation 1 */}
        <div className="space-y-6">
           <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
             <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
               <span className="bg-primary text-white w-6 h-6 rounded flex items-center justify-center text-sm">1</span>
               Config A
             </h2>
             <ProcessInput
               processes={[]} // Hide the list, only show controls
               onProcessesChange={() => {}}
               algorithm={algo1}
               onAlgorithmChange={setAlgo1}
               quantum={q1}
               onQuantumChange={setQ1}
               onRun={() => {}} // Disabled
               isRunning={false}
             />
             {/* Hack: The ProcessInput component is a bit coupled, in a real app I'd separate Controls from List */}
             <style>{`
               .space-y-6 .lg\\:col-span-1, .space-y-6 .lg\\:col-span-2 { display: none; }
               .space-y-6 .flex.items-center.gap-4 { display: none; }
             `}</style>
           </div>
           
           {sim1.data && (
             <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
               <Separator />
               <GanttChart 
                 timeline={sim1.data.timeline} 
                 totalTime={sim1.data.timeline[sim1.data.timeline.length - 1]?.endTime || 0} 
               />
               <MetricsDisplay results={sim1.data} />
             </div>
           )}
        </div>

        {/* Simulation 2 */}
        <div className="space-y-6">
           <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/20">
             <h2 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
               <span className="bg-secondary text-white w-6 h-6 rounded flex items-center justify-center text-sm">2</span>
               Config B
             </h2>
             <ProcessInput
               processes={[]} 
               onProcessesChange={() => {}}
               algorithm={algo2}
               onAlgorithmChange={setAlgo2}
               quantum={q2}
               onQuantumChange={setQ2}
               onRun={() => {}} 
               isRunning={false}
             />
           </div>

           {sim2.data && (
             <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
               <Separator />
               <GanttChart 
                 timeline={sim2.data.timeline} 
                 totalTime={sim2.data.timeline[sim2.data.timeline.length - 1]?.endTime || 0} 
               />
               <MetricsDisplay results={sim2.data} />
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
