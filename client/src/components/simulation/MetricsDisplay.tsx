import { SimulationResult } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { Clock, Hourglass, Zap, Activity } from "lucide-react";

interface MetricsDisplayProps {
  results: SimulationResult;
}

export function MetricsDisplay({ results }: MetricsDisplayProps) {
  const stats = [
    {
      label: "Avg. Waiting Time",
      value: results.averages.waitingTime.toFixed(2),
      unit: "ms",
      icon: Hourglass,
      color: "text-amber-600",
    },
    {
      label: "Avg. Turnaround",
      value: results.averages.turnaroundTime.toFixed(2),
      unit: "ms",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "Avg. Response",
      value: results.averages.responseTime.toFixed(2),
      unit: "ms",
      icon: Zap,
      color: "text-purple-600",
    },
    {
      label: "CPU Utilization",
      value: results.averages.cpuUtilization.toFixed(1),
      unit: "%",
      icon: Activity,
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <div className={`mb-3 p-3 rounded-full bg-background border border-border ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-3xl font-bold font-mono tracking-tighter mt-1">
                {stat.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span>
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Metrics Table */}
        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <CardTitle>Detailed Process Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">PID</TableHead>
                  <TableHead className="text-right">Burst</TableHead>
                  <TableHead className="text-right">Completion</TableHead>
                  <TableHead className="text-right text-blue-600">Turnaround</TableHead>
                  <TableHead className="text-right text-amber-600">Waiting</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.metrics.map((m) => (
                  <TableRow key={m.processId} className="font-mono text-xs">
                    <TableCell className="font-bold">{m.processId}</TableCell>
                    <TableCell className="text-right">{m.burstTime}</TableCell>
                    <TableCell className="text-right">{m.completionTime}</TableCell>
                    <TableCell className="text-right font-semibold">{m.turnaroundTime}</TableCell>
                    <TableCell className="text-right font-semibold">{m.waitingTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="border-border/60 shadow-md">
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={results.metrics} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="processId" tick={{ fontFamily: 'JetBrains Mono', fontSize: 12 }} />
                <YAxis tick={{ fontFamily: 'JetBrains Mono', fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                />
                <Legend />
                <Bar dataKey="waitingTime" name="Waiting Time" fill="#d97706" radius={[4, 4, 0, 0]} />
                <Bar dataKey="turnaroundTime" name="Turnaround Time" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
