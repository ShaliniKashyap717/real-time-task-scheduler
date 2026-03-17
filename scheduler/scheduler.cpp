#include "scheduler.h"
#include <sstream>

Scheduler::Scheduler(Algorithm algo, int quantum, std::vector<Process> procs) 
    : algorithm(algo), timeQuantum(quantum), processes(procs) {
    // specific initialization if needed
    for(auto& p : processes) {
        p.remainingTime = p.burstTime;
        p.currentPriority = p.priority;
        p.queuesIndex = 0;
    }
    // Sort initially by arrival time for easier handling
    std::sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
        return a.arrivalTime < b.arrivalTime;
    });
}

void Scheduler::addTimeSlice(int start, int end, std::string pid, std::string state) {
    if (!timeline.empty() && timeline.back().processId == pid && timeline.back().state == state && timeline.back().endTime == start) {
        timeline.back().endTime = end;
    } else {
        timeline.push_back({start, end, pid, state});
    }
}

void Scheduler::run() {
    runTickBased();
}

void Scheduler::runTickBased() {
    int currentTime = 0;
    int completedCount = 0;
    int n = processes.size();
    
    std::deque<Process*> readyQueue;
    // For MLFQ, we might need multiple queues
    std::vector<std::deque<Process*>> mlfq(3); // 3 levels for FB/FBV
    
    Process* currentProcess = nullptr;
    int quantumTimer = 0;
    int currentQuantum = timeQuantum;

    // Use pointers to manipulate original process objects
    std::vector<Process*> activeProcs;
    for(auto& p : processes) activeProcs.push_back(&p);
    
    // Reset sort for arrival check (though already sorted in constructor)
    int nextArrivalIdx = 0;

    while (completedCount < n) {
        // 1. Check for new arrivals
        while(nextArrivalIdx < n && processes[nextArrivalIdx].arrivalTime == currentTime) {
            Process* p = &processes[nextArrivalIdx];
            if (algorithm == FB || algorithm == FBV) {
                p->queuesIndex = 0;
                mlfq[0].push_back(p);
            } else {
                readyQueue.push_back(p);
            }
            nextArrivalIdx++;
        }

        // 2. Scheduler Logic / Selection
        Process* selected = nullptr;
        
        if (algorithm == FCFS) {
            if (currentProcess && currentProcess->remainingTime > 0) {
                selected = currentProcess;
            } else if (!readyQueue.empty()) {
                selected = readyQueue.front();
                readyQueue.pop_front();
            }
        } 
        else if (algorithm == RR) {
            if (currentProcess) {
                if (currentProcess->remainingTime == 0) {
                    // Finished
                    currentProcess = nullptr;
                    quantumTimer = 0;
                } else if (quantumTimer >= timeQuantum) {
                    // Quantum expired
                    readyQueue.push_back(currentProcess);
                    currentProcess = nullptr;
                    quantumTimer = 0;
                } else {
                    // Continue
                    selected = currentProcess;
                }
            }
            
            if (!selected && !readyQueue.empty()) {
                selected = readyQueue.front();
                readyQueue.pop_front();
                quantumTimer = 0;
            }
        }
        else if (algorithm == SPN) { // Non-preemptive SJF
            if (currentProcess && currentProcess->remainingTime > 0) {
                selected = currentProcess;
            } else {
                // Find shortest job in ready queue
                auto it = std::min_element(readyQueue.begin(), readyQueue.end(), [](Process* a, Process* b) {
                    return a->burstTime < b->burstTime;
                });
                if (it != readyQueue.end()) {
                    selected = *it;
                    readyQueue.erase(it);
                }
            }
        }
        else if (algorithm == SRT) { // Preemptive SJF
             // Always pick process with shortest remaining time from Ready + Current
             // If current is running, put back in ready, re-evaluate
             if (currentProcess) readyQueue.push_back(currentProcess);
             
             auto it = std::min_element(readyQueue.begin(), readyQueue.end(), [](Process* a, Process* b) {
                 return a->remainingTime < b->remainingTime;
             });
             
             if (it != readyQueue.end()) {
                 selected = *it;
                 readyQueue.erase(it);
             }
        }
        else if (algorithm == HRRN) { // Non-preemptive
            if (currentProcess && currentProcess->remainingTime > 0) {
                selected = currentProcess;
            } else {
                // Calculate Response Ratio: (W + S) / S
                // W = currentTime - arrivalTime
                auto it = std::max_element(readyQueue.begin(), readyQueue.end(), [currentTime](Process* a, Process* b) {
                    double rrA = (double)((currentTime - a->arrivalTime) + a->burstTime) / a->burstTime; // Note: burstTime is total service time
                    double rrB = (double)((currentTime - b->arrivalTime) + b->burstTime) / b->burstTime;
                    return rrA < rrB;
                });
                
                if (it != readyQueue.end()) {
                    selected = *it;
                    readyQueue.erase(it);
                }
            }
        }
        else if (algorithm == FB || algorithm == FBV) {
            // Multilevel Feedback Queue
            // FB: Fixed quantum for all? Or usually Q0=RR, Q1=RR, Q2=FCFS
            // FBV: Varying quantum Q0=1, Q1=2, Q2=4...
            
            // Logic: Preempt if higher priority queue has process.
            // If current process consumes quantum, downgrade.
            
            if (currentProcess) {
                if (currentProcess->remainingTime == 0) {
                    currentProcess = nullptr;
                    quantumTimer = 0;
                } else {
                    // Determine max quantum for current level
                    int limit = (algorithm == FB) ? timeQuantum : (timeQuantum * std::pow(2, currentProcess->queuesIndex));
                    
                    if (quantumTimer >= limit) {
                        // Downgrade
                        if (currentProcess->queuesIndex < 2) currentProcess->queuesIndex++;
                        mlfq[currentProcess->queuesIndex].push_back(currentProcess);
                        currentProcess = nullptr;
                        quantumTimer = 0;
                    } else {
                         // Check for preemption by higher priority queue
                        bool higherExists = false;
                        for(int i=0; i < currentProcess->queuesIndex; i++) {
                            if (!mlfq[i].empty()) {
                                higherExists = true; 
                                break;
                            }
                        }
                        
                        if (higherExists) {
                             // Preempted, but stays in same queue (head)
                             mlfq[currentProcess->queuesIndex].push_front(currentProcess);
                             currentProcess = nullptr;
                             quantumTimer = 0;
                        } else {
                            selected = currentProcess;
                        }
                    }
                }
            }
            
            if (!selected) {
                for(int i=0; i<3; i++) {
                    if (!mlfq[i].empty()) {
                        selected = mlfq[i].front();
                        mlfq[i].pop_front();
                        quantumTimer = 0; // Reset for new process
                        break;
                    }
                }
            }
        }
        else if (algorithm == AGING) {
            // Preemptive Priority with Aging
            // Increase priority of waiting processes every tick?
            // Or just Standard Priority Scheduling where we manually simulate aging.
            // Let's implement: Standard Preemptive Priority + Increase Priority of processes in Ready Queue every tick.
            
             // Aging Logic: Increase priority of everyone in readyQueue
             // (Assuming higher number = higher priority? Or lower? Standard Unix is lower=higher, but usually simulations use higher=higher)
             // Let's assume High Number = High Priority.
             
             if (currentProcess) readyQueue.push_back(currentProcess);
             
             // Select highest priority
             auto it = std::max_element(readyQueue.begin(), readyQueue.end(), [](Process* a, Process* b) {
                 // Primary: Priority, Secondary: Arrival (FIFO)
                 if (a->currentPriority != b->currentPriority)
                     return a->currentPriority < b->currentPriority;
                 return a->arrivalTime > b->arrivalTime; // if equal priority, earlier arrival wins (min arrival)
             });
             
             if (it != readyQueue.end()) {
                 selected = *it;
                 readyQueue.erase(it);
             }
             
             // Age others
             for(auto* p : readyQueue) {
                 // Age them!
                 p->currentPriority++;
             }
        }

        // 3. Execution
        if (selected) {
            currentProcess = selected;
            if (currentProcess->startTime == -1) currentProcess->startTime = currentTime;
            
            // Record stats
            if (currentProcess->remainingTime == currentProcess->burstTime) {
                // First time running response time
                currentProcess->responseTime = currentTime - currentProcess->arrivalTime;
            }
            
            addTimeSlice(currentTime, currentTime + 1, currentProcess->id, "RUNNING");
            
            currentProcess->remainingTime--;
            quantumTimer++;
            
            if (currentProcess->remainingTime == 0) {
                currentProcess->completionTime = currentTime + 1;
                currentProcess->turnaroundTime = currentProcess->completionTime - currentProcess->arrivalTime;
                currentProcess->waitingTime = currentProcess->turnaroundTime - currentProcess->burstTime;
                completedCount++;
            }
        } else {
            addTimeSlice(currentTime, currentTime + 1, "", "IDLE");
        }

        currentTime++;
    }
}

void Scheduler::printJSON() {
    std::cout << "{\n";
    
    // Timeline
    std::cout << "  \"timeline\": [\n";
    for (size_t i = 0; i < timeline.size(); ++i) {
        std::cout << "    { \"startTime\": " << timeline[i].startTime 
                  << ", \"endTime\": " << timeline[i].endTime 
                  << ", \"processId\": " << (timeline[i].processId.empty() ? "null" : "\"" + timeline[i].processId + "\"")
                  << ", \"state\": \"" << timeline[i].state << "\" }";
        if (i < timeline.size() - 1) std::cout << ",";
        std::cout << "\n";
    }
    std::cout << "  ],\n";

    // Metrics
    double totalWait = 0, totalTurn = 0, totalResp = 0;
    std::cout << "  \"metrics\": [\n";
    // Sort processes by ID for clean output or completion? Let's sort by ID.
    // Actually using original order is fine.
    
    // We need to print stats for ALL processes, they are modified in place in 'processes' vector
    // But we need to make sure we access the modified versions. 
    // The vector 'processes' holds the objects.
    
    for (size_t i = 0; i < processes.size(); ++i) {
        Process& p = processes[i];
        totalWait += p.waitingTime;
        totalTurn += p.turnaroundTime;
        totalResp += p.responseTime;
        
        std::cout << "    { \"processId\": \"" << p.id << "\""
                  << ", \"arrivalTime\": " << p.arrivalTime
                  << ", \"burstTime\": " << p.burstTime
                  << ", \"completionTime\": " << p.completionTime
                  << ", \"waitingTime\": " << p.waitingTime
                  << ", \"turnaroundTime\": " << p.turnaroundTime
                  << ", \"responseTime\": " << p.responseTime
                  << " }";
        if (i < processes.size() - 1) std::cout << ",";
        std::cout << "\n";
    }
    std::cout << "  ],\n";

    // Averages
    double n = processes.size();
    int timelineDuration = timeline.empty() ? 0 : timeline.back().endTime;
    double busyTime = 0;
    for(const auto& slice : timeline) {
        if (!slice.processId.empty()) busyTime += (slice.endTime - slice.startTime);
    }
    
    std::cout << "  \"averages\": {\n";
    std::cout << "    \"waitingTime\": " << (n > 0 ? totalWait / n : 0) << ",\n";
    std::cout << "    \"turnaroundTime\": " << (n > 0 ? totalTurn / n : 0) << ",\n";
    std::cout << "    \"responseTime\": " << (n > 0 ? totalResp / n : 0) << ",\n";
    std::cout << "    \"cpuUtilization\": " << (timelineDuration > 0 ? (busyTime / timelineDuration) * 100.0 : 0) << "\n";
    std::cout << "  }\n";
    
    std::cout << "}\n";
}
