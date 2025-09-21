# 🖥️ Real-Time CPU Scheduling Algorithms Simulator  

An implementation of **major CPU scheduling algorithms** in **C++** with a focus on process scheduling in Operating Systems.  
The simulator can compute **waiting time, turnaround time, response time, and visualize Gantt charts** for various algorithms.  

> 🚀 **Planned Extension:** Building a **Node.js backend** and **React-based frontend** to provide an interactive web interface with real-time scheduling visualization.  

---

## 📊 Algorithms Implemented  

This project supports simulation of the following CPU scheduling algorithms:  

- **First Come First Serve (FCFS)** – Non-preemptive scheduling based on arrival order  
- **Round Robin (RR)** – Time-sharing scheduler with configurable quantum  
- **Shortest Process Next (SPN)** – Non-preemptive shortest job first  
- **Shortest Remaining Time (SRT)** – Preemptive version of SPN  
- **Highest Response Ratio Next (HRRN)** – Balances waiting and burst time to avoid starvation  
- **Feedback (FB)** – Multilevel feedback queue scheduler  
- **Feedback with Varying Time Quantum (FBV)** – FB with configurable quantum for each queue  
- **Aging** – Starvation-prevention algorithm that increases priority over time  

---



