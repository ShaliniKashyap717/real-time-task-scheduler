#ifndef SCHEDULER_H
#define SCHEDULER_H

#include <string>
#include <vector>
#include <iostream>
#include <algorithm>
#include <queue>
#include <map>
#include <cmath>
#include <iomanip>

enum Algorithm {
    FCFS,
    RR,
    SPN,
    SRT,
    HRRN,
    FB,
    FBV,
    AGING
};

enum State {
    RUNNING,
    IDLE,
    CONTEXT_SWITCH // Not strictly used in this simple sim, but good for schema
};

struct Process {
    std::string id;
    int arrivalTime;
    int burstTime;
    int priority;
    
    // Runtime state
    int remainingTime;
    int startTime = -1;
    int completionTime = 0;
    int waitingTime = 0;
    int turnaroundTime = 0;
    int responseTime = -1; // -1 to indicate not yet started
    int currentPriority; // For Aging/Feedback
    int queuesIndex = 0; // For MLFQ
    int lastExecutedTime = -1; // To track waiting time accurately in preemptive
};

struct TimeSlice {
    int startTime;
    int endTime;
    std::string processId; // "" for IDLE
    std::string state; // "RUNNING" or "IDLE"
};

struct SimulationResult {
    std::vector<TimeSlice> timeline;
    std::vector<Process> processes;
    double avgWaitingTime;
    double avgTurnaroundTime;
    double avgResponseTime;
    double cpuUtilization;
};

class Scheduler {
public:
    Scheduler(Algorithm algo, int quantum, std::vector<Process> procs);
    void run();
    void printJSON();

private:
    Algorithm algorithm;
    int timeQuantum;
    std::vector<Process> processes;
    std::vector<Process> completedProcesses;
    std::vector<TimeSlice> timeline;
    
    // Helpers
    void addTimeSlice(int start, int end, std::string pid, std::string state);
    Process* getNextProcess(int currentTime, std::deque<Process*>& readyQueue, Process* currentRunning);
    
    // Algorithm specific logic
    void runTickBased();
};

#endif
