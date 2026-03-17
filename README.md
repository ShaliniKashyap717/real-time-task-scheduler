# Operating System Scheduling Simulator

## Overview

This project is an interactive Operating System simulator developed in C++ to demonstrate and analyze the behavior of various CPU scheduling algorithms. It enables users to simulate process execution, evaluate scheduling strategies, and study performance metrics through structured outputs and visual representations.

The simulator bridges theoretical operating system concepts with practical implementation and analysis, incorporating core OS abstractions such as Process Control Blocks (PCB) for realistic process management.

---

## Features

### CPU Scheduling Algorithms

The simulator implements the following scheduling algorithms:

- First Come First Serve (FCFS)  
- Shortest Job First (SJF)  
- Shortest Remaining Time First (SRTF)  
- Round Robin (RR)  
- Priority Scheduling  
- Highest Response Ratio Next (HRRN)  
- Feedback Queue (FB)  
- Feedback Queue with Variable Quantum (FBV)  

---

### Process Simulation

- Supports dynamic process creation using:
  - Arrival Time  
  - Burst Time  
  - Priority (Lower value indicates higher priority)  
- Each process is internally represented using a **Process Control Block (PCB)** to track:
  - Process state (Ready, Running, Waiting, Terminated)  
  - Execution progress and remaining time  
  - Scheduling-related metrics  
- Simulates real-time process lifecycle transitions  
- Handles multiple processes efficiently  

---

### Interactive Input Interface

The system provides an interface to:

- Add new processes dynamically  
- Configure process parameters:
  - Arrival Time  
  - Burst Time  
  - Priority  
- Maintain and display a live **Process Queue**  


---

### Performance Metrics

For each scheduling algorithm, the simulator computes:

- Average Waiting Time  
- Turnaround Time  
- Response Time  
- CPU Utilization  

---

### Algorithm Comparison

The simulator allows comparison across different scheduling algorithms based on computed metrics, enabling analysis of:

- Efficiency of execution  
- Waiting time optimization  
- Responsiveness of scheduling strategies  

This helps in understanding trade-offs between different scheduling approaches.

---

### Visualization

- Gantt chart representation of process execution  
- Timeline-based scheduling visualization  
- Clear depiction of CPU allocation over time  

---

### Data Structures Used

- Queues for scheduling (FCFS, Round Robin)  
- Priority queues for optimized selection (SJF, Priority Scheduling)  
- Vectors and structured data models for process management  

---

## Tech Stack

### Frontend
- TypeScript  
- Tailwind CSS  
- lucide-react  

### Backend / Core Logic
- C++ (scheduler.cpp)  
- Standard Template Library (STL)
 
---

## System Design

The project follows a modular design:

- Process management layer using PCB abstraction  
- Scheduling engine implementing multiple algorithms  
- Metric computation module  
- Visualization layer for execution timelines  

This design ensures extensibility and maintainability.

---

## How It Works

1. Add processes with arrival time, burst time, and priority  
2. Processes are stored and managed using PCB structures  
3. Select a scheduling algorithm  
4. Run the simulation  
5. Track execution and process state transitions  
6. View:
   - Gantt chart  
   - Performance metrics  
   - Algorithm comparisons  

---

## Future Enhancements

- Multilevel Feedback Queue (MLFQ)  
- Deadlock detection using Banker’s Algorithm  
- Memory management simulation (paging and allocation strategies)  
- Large-scale workload simulation for benchmarking  
- Enhanced graphical interface  

---

## Learning Outcomes

- Practical implementation of CPU scheduling algorithms  
- Understanding of process lifecycle and OS abstractions  
- Performance evaluation and algorithm comparison  
- Application of data structures in system-level design  

---




