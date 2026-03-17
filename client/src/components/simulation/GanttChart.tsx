import { TimeSlice } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GanttChartProps {
  timeline: TimeSlice[];
  totalTime: number;
}

// Generate deterministic colors based on process ID
const getProcessColor = (processId: string | null) => {
  if (!processId) return "bg-gray-200 border-gray-300"; // IDLE
  
  // Earth tone palette for processes
  const colors = [
    "bg-[#8b4513] text-white border-[#6b350f]", // Saddle Brown
    "bg-[#cd853f] text-white border-[#b06d2e]", // Peru
    "bg-[#bc8f8f] text-white border-[#a07070]", // Rosy Brown
    "bg-[#a0522d] text-white border-[#824020]", // Sienna
    "bg-[#556b2f] text-white border-[#405020]", // Dark Olive Green
    "bg-[#d2b48c] text-black border-[#b89a74]", // Tan
    "bg-[#808000] text-white border-[#606000]", // Olive
    "bg-[#deb887] text-black border-[#c59e6d]", // Burlywood
  ];

  const idNum = parseInt(processId.replace(/\D/g, '')) || 0;
  return colors[idNum % colors.length];
};

export function GanttChart({ timeline, totalTime }: GanttChartProps) {
  if (timeline.length === 0) return null;

  const totalDuration = timeline[timeline.length - 1].endTime;

  return (
    <div className="w-full space-y-4 py-4 overflow-x-auto">
      <h3 className="text-lg font-bold text-primary mb-4">Gantt Chart Visualization</h3>
      
      <div className="relative h-24 w-full bg-muted/20 rounded-lg border border-border flex items-center px-2 min-w-[800px]">
        {/* Timeline marks */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {Array.from({ length: totalDuration + 1 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute top-0 bottom-0 border-l border-border/50 text-[10px] text-muted-foreground pt-1 pl-1"
              style={{ left: `${(i / totalDuration) * 100}%` }}
            >
              {i % 2 === 0 ? i : ''}
            </div>
          ))}
        </div>

        {/* Process Blocks */}
        <div className="relative w-full h-12 flex">
          <AnimatePresence>
            {timeline.map((slice, index) => {
              const widthPercent = ((slice.endTime - slice.startTime) / totalDuration) * 100;
              const colorClass = getProcessColor(slice.processId);
              
              return (
                <Tooltip key={`${index}-${slice.processId}`}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`h-full border-r border-white/20 flex items-center justify-center relative group overflow-hidden first:rounded-l-md last:rounded-r-md ${colorClass}`}
                      style={{ width: `${widthPercent}%`, transformOrigin: "left" }}
                    >
                      {widthPercent > 3 && (
                        <span className="font-mono text-xs font-bold whitespace-nowrap z-10">
                          {slice.processId || "IDLE"}
                        </span>
                      )}
                      {/* Hover effect highlight */}
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-foreground text-background font-mono text-xs p-2">
                    <p>Process: {slice.processId || "IDLE"}</p>
                    <p>Time: {slice.startTime} - {slice.endTime}</p>
                    <p>Duration: {slice.endTime - slice.startTime}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 text-sm font-mono text-muted-foreground">
        {Array.from(new Set(timeline.map(t => t.processId))).filter(Boolean).map(pid => (
          <div key={pid} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${getProcessColor(pid!).split(" ")[0]}`} />
            <span>{pid}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-200" />
          <span>IDLE</span>
        </div>
      </div>
    </div>
  );
}
