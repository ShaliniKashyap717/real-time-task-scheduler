import { useState } from "react";
import { Plus, Trash2, RotateCcw, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Process, ALGORITHMS, AlgorithmType } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProcessInputProps {
  processes: Process[];
  onProcessesChange: (processes: Process[]) => void;
  algorithm: AlgorithmType;
  onAlgorithmChange: (algo: AlgorithmType) => void;
  quantum: number;
  onQuantumChange: (q: number) => void;
  onRun: () => void;
  isRunning: boolean;
}

export function ProcessInput({
  processes,
  onProcessesChange,
  algorithm,
  onAlgorithmChange,
  quantum,
  onQuantumChange,
  onRun,
  isRunning
}: ProcessInputProps) {
  const [newProcess, setNewProcess] = useState<Partial<Process>>({
    arrivalTime: 0,
    burstTime: 1,
    priority: 0,
  });

  const handleAdd = () => {
    const process: Process = {
      id: `P${processes.length + 1}`,
      arrivalTime: newProcess.arrivalTime || 0,
      burstTime: newProcess.burstTime || 1,
      priority: newProcess.priority || 0,
    };
    onProcessesChange([...processes, process]);
  };

  const handleRemove = (id: string) => {
    onProcessesChange(processes.filter((p) => p.id !== id));
  };

  const generateRandom = () => {
    const count = 5;
    const newProcs: Process[] = Array.from({ length: count }).map((_, i) => ({
      id: `P${i + 1}`,
      arrivalTime: Math.floor(Math.random() * 10),
      burstTime: Math.floor(Math.random() * 10) + 1,
      priority: Math.floor(Math.random() * 5),
    }));
    onProcessesChange(newProcs);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md border-border/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-primary" />
            Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Scheduling Algorithm</Label>
              <Select
                value={algorithm}
                onValueChange={(v) => onAlgorithmChange(v as AlgorithmType)}
              >
                <SelectTrigger className="font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALGORITHMS.map((algo) => (
                    <SelectItem key={algo} value={algo} className="font-mono">
                      {algo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(algorithm === "RR" || algorithm === "FB" || algorithm === "FBV") && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Time Quantum (q={quantum})</Label>
                </div>
                <Slider
                  value={[quantum]}
                  onValueChange={([v]) => onQuantumChange(v)}
                  min={1}
                  max={10}
                  step={1}
                  className="py-4"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button 
              onClick={onRun} 
              disabled={processes.length === 0 || isRunning}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
            >
              {isRunning ? "Simulating..." : "Run Simulation"}
              <Play className="w-4 h-4 ml-2 fill-current" />
            </Button>
            <Button variant="outline" onClick={generateRandom} className="border-primary/20 hover:bg-accent">
              Generate Random Workload
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-md border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Add Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Arrival Time</Label>
              <Input
                type="number"
                min={0}
                value={newProcess.arrivalTime}
                onChange={(e) =>
                  setNewProcess({ ...newProcess, arrivalTime: parseInt(e.target.value) || 0 })
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Burst Time</Label>
              <Input
                type="number"
                min={1}
                value={newProcess.burstTime}
                onChange={(e) =>
                  setNewProcess({ ...newProcess, burstTime: parseInt(e.target.value) || 1 })
                }
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority (Lower = Higher)</Label>
              <Input
                type="number"
                min={0}
                value={newProcess.priority}
                onChange={(e) =>
                  setNewProcess({ ...newProcess, priority: parseInt(e.target.value) || 0 })
                }
                className="font-mono"
              />
            </div>
            <Button onClick={handleAdd} className="w-full mt-4" variant="secondary">
              <Plus className="w-4 h-4 mr-2" /> Add to Queue
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-md border-border/60 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Process Queue</CardTitle>
            <Badge variant="outline" className="font-mono text-muted-foreground">
              count: {processes.length}
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[300px] overflow-y-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[80px]">PID</TableHead>
                    <TableHead>Arrival</TableHead>
                    <TableHead>Burst</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No processes added. Add one or generate random.
                      </TableCell>
                    </TableRow>
                  ) : (
                    processes.map((p) => (
                      <TableRow key={p.id} className="font-mono text-sm hover:bg-muted/30">
                        <TableCell className="font-medium text-primary">{p.id}</TableCell>
                        <TableCell>{p.arrivalTime}</TableCell>
                        <TableCell>{p.burstTime}</TableCell>
                        <TableCell>{p.priority}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(p.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
