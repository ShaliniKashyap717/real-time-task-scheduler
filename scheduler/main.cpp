#include <iostream>
#include <vector>
#include <string>
#include "scheduler.h"

int main() {
    std::string algoStr;
    int quantum;
    int numProcesses;

    // Read Input
    // Line 1: ALGO QUANTUM
    if (!(std::cin >> algoStr >> quantum)) return 1;
    
    // Line 2: NUM_PROCESSES
    if (!(std::cin >> numProcesses)) return 1;
    
    std::vector<Process> processes;
    for(int i=0; i<numProcesses; i++) {
        Process p;
        // Line 3+: ID ARRIVAL BURST PRIORITY
        std::cin >> p.id >> p.arrivalTime >> p.burstTime >> p.priority;
        processes.push_back(p);
    }

    // Resolve Algorithm Enum
    Algorithm algo = FCFS;
    if (algoStr == "FCFS") algo = FCFS;
    else if (algoStr == "RR") algo = RR;
    else if (algoStr == "SPN") algo = SPN;
    else if (algoStr == "SRT") algo = SRT;
    else if (algoStr == "HRRN") algo = HRRN;
    else if (algoStr == "FB") algo = FB;
    else if (algoStr == "FBV") algo = FBV;
    else if (algoStr == "AGING") algo = AGING;

    // Run Scheduler
    Scheduler scheduler(algo, quantum, processes);
    scheduler.run();
    scheduler.printJSON();

    return 0;
}
