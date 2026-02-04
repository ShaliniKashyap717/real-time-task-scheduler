# Real-Time CPU Scheduling Algorithms Simulator

A C++ based simulator implementing major CPU scheduling algorithms used in Operating Systems.  
The project focuses on analyzing scheduling behavior, comparing algorithm performance, and visualizing process execution using Gantt charts.

This simulator is designed as a foundational systems project with scope for future extension into an interactive, real-time web-based application.

---

## Overview

CPU scheduling plays a critical role in determining system performance, responsiveness, and fairness. This project provides a simulation framework to model how different scheduling algorithms behave under varying workloads.

The simulator computes standard scheduling metrics and produces execution timelines to help understand algorithm trade-offs in practical scenarios.

---

## Features

- Simulation of multiple classical CPU scheduling algorithms  
- Computation of:
  - Waiting Time  
  - Turnaround Time  
  - Response Time  
- Gantt chart style visualization of process execution  
- Support for both preemptive and non-preemptive scheduling  
- Configurable parameters such as arrival time, burst time, and time quantum  

---

## Implemented Scheduling Algorithms

- **First Come First Serve (FCFS)**  
  Non-preemptive scheduling based on process arrival order  

- **Round Robin (RR)**  
  Time-sharing scheduler with configurable time quantum  

- **Shortest Process Next (SPN)**  
  Non-preemptive shortest job first scheduling  

- **Shortest Remaining Time (SRT)**  
  Preemptive version of SPN  

- **Highest Response Ratio Next (HRRN)**  
  Dynamically balances waiting time and burst time to reduce starvation  

- **Feedback (FB)**  
  Multilevel feedback queue scheduling  

- **Feedback with Varying Time Quantum (FBV)**  
  Multilevel feedback scheduling with configurable quantum per queue  

- **Aging**  
  Starvation prevention algorithm that gradually increases process priority  

---

## Performance Metrics

For each scheduling algorithm, the simulator evaluates:

- Average waiting time  
- Average turnaround time  
- Average response time  
- Execution order visualization using Gantt charts  

These metrics allow comparative analysis of algorithm efficiency and fairness.

---

## Technologies Used

- Programming Language: C++  
- Core Concepts:
  - Process scheduling  
  - Queue-based systems  
  - Preemption and priority handling  
  - Time-sharing mechanisms  
- Domain: Operating Systems  

---

## Project Structure

- Modular implementation for each scheduling algorithm  
- Common data structures for process representation  
- Central simulation controller for execution and metric calculation  

---

## Future Enhancements

- Backend service using Node.js to expose scheduling logic via APIs  
- Interactive frontend using React for real-time visualization  
- Dynamic process creation and scheduling control from UI  
- Animated Gantt charts and performance comparison dashboards  
- Support for real-time scheduling policies  

---

## Learning Outcomes

- Practical understanding of CPU scheduling algorithms  
- Insight into trade-offs between throughput, fairness, and responsiveness  
- Experience with implementing core Operating Systems concepts  
- Foundation for extending low-level system simulations into full-stack applications  
