import { Link } from "wouter";
import { ArrowRight, Cpu, Activity, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          v1.0 System Simulation Kernel
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary">
          Real-Time CPU <br />
          <span className="text-foreground">Scheduling Simulator</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Experience how operating systems manage processes with our advanced visualizer. 
          Compare algorithms like FCFS, Round Robin, and Aging with real-time analytics.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/simulator">
            <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              Start Simulation <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/compare">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-primary/20 hover:bg-accent hover:text-primary">
              Compare Algorithms
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Cpu}
          title="7+ Algorithms"
          description="Simulate FCFS, SPN, SRT, Round Robin, HRRN, Feedback Queues, and Aging algorithms."
        />
        <FeatureCard 
          icon={Activity}
          title="Real-Time Gantt"
          description="Visual timeline representation of process execution with tick-by-tick accuracy."
        />
        <FeatureCard 
          icon={Clock}
          title="Deep Metrics"
          description="Analyze Waiting Time, Turnaround Time, and Response Time with interactive charts."
        />
      </div>

      {/* Info Section */}
      <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-primary">How it works</h2>
        <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
          <div className="space-y-4">
            <p>
              The simulator uses a high-performance C++ backend to execute the scheduling logic, 
              ensuring 100% accuracy in simulating operating system behavior.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Define custom workloads or generate random ones.</li>
              <li>Adjust time quantum for pre-emptive algorithms.</li>
              <li>Observe context switching overhead visualization.</li>
            </ul>
          </div>
          <div className="relative h-48 bg-muted/30 rounded-lg border border-border flex items-center justify-center overflow-hidden">
             {/* Abstract decorative element representing a scheduler */}
             <div className="flex gap-1 items-end h-32">
                <div className="w-8 bg-primary/40 h-[60%] rounded-t animate-pulse"></div>
                <div className="w-8 bg-secondary/40 h-[80%] rounded-t animate-pulse delay-75"></div>
                <div className="w-8 bg-muted-foreground/40 h-[40%] rounded-t animate-pulse delay-150"></div>
                <div className="w-8 bg-primary/60 h-[90%] rounded-t animate-pulse delay-300"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <Card className="border-border/50 hover:border-primary/50 transition-colors shadow-sm">
      <CardContent className="p-6 space-y-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
