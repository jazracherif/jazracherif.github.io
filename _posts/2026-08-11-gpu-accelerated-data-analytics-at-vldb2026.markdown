---
layout: post
title: "GPU Accelerated Data Analytics at VLDB2026"
date: 2026-08-11 00:00:00 -0700
categories: database gpu analytics conference
tags: [vldb2026, gpu-databases, analytics, rapids, tqp, compression, spatial, conference]
image: /assets/img/vldb2026.png
label: conference
description: "A guide to GPU-accelerated data analytics sessions at VLDB 2026 in Boston — covering the ADMS workshop, research tracks on GPU query processing and scalar functions, and industry talks on ZipFlow, RayBooster, and TQP++."
toc: true
extra_css:
  - /assets/css/paper-abstract.css
---

The 52nd [Very Large Data bases conference](https://vldb.org/2026/) (VLDB 2026) is just around the corner,  August 31st - September 4th in Boston, MA USA! 

![VLDB 2026 Boston](/assets/img/vldb2026.png)

A searchable [program](https://vldb.org/2026/program.html) has been released and there are several interesting research and industry topics tackling the space of GPU analytics. Here's a quick highlight of sessions that caught my eye:

- The 17th ADMS Workshop on Accelerated Analytics features a keynote by NVIDIA's Joshua Patterson on design principles gained from experience building GPU query engines MapD, to Theseus, SiriusDB, and MICE project. Several papers tackle accelerating Presto on GPU, improving hash join and string search on GPUs, and algorithms for automating operator fusion.
- Research track #27 for GPU-Accelerated Query Processing has 4 technical sessions covering papers on distributed GPU systems over TCR runtime like PyTorch, theoretical upper bound performance study on multi-GPU query engines, GPU processing over compressed data, and supporting performant indexes on GPUs.
- Research track #21 · Data Systems on Modern Hardware has sessions on a communication framework for inter-GPU transfer (MGI) and a DB engine built using Ray tracing cores (RayDb).
- Research track #37 has a session on improving scalar function support over GPU analytics databases.
- Industry Session #2 on Query Execution Engines & Hardware Acceleration features talks about ZipFlow (accelerate compression based data movement to GPU), RayBooster (accelerate SedonaDB spatial joins using Ray tracer cores, also see Tutorial 1), and TQP++ (innovations to the GPU agnostic and portable TQP engine)
- ... and many other interesting sessions across the spectrum of database research


## The 17th ADMS Workshop on Accelerated Analytics

On Monday August 31st, the [workshop on Accelerating Analytics and Data Management Systems Using Modern Processor and Storage Architectures](https://www.adms-conf.org/) will be held with talks specifically dedicated to the use of GPU for data processing.

### From MapD to Sirius: Co-Designing GPU-Native OLAP, Joshua Patterson, Vice President, NVIDIA

<p class="paper-abstract"><strong>Abstract:</strong> GPU acceleration of analytical databases has evolved from accelerating individual operators to redesigning complete query engines around heterogeneous computing. MapD demonstrated how columnar execution, LLVM-based query compilation, and GPU memory bandwidth could enable interactive analysis over billions of rows. Theseus extended this approach with asynchronous execution and coordinated data movement across GPU, CPU, storage, and distributed resources. Sirius advances the model toward a composable GPU-native backend that can integrate with existing database systems through interoperable query representations and reusable accelerated libraries. This evolution has been enabled by corresponding advances in hardware: coherent CPU–GPU interconnects such as NVLink-C2C, NVLink fabrics extending beyond a single node, GPUDirect Storage for direct movement between storage and GPU memory, and nvCOMP for accelerated compression and decompression. These capabilities require query engines to jointly optimize computation, data placement, communication, and concurrency. This talk examines the hardware–software co-design principles behind these systems and introduces SPACE MICE: Scale, Performance, and Concurrent Execution through Modular, Interoperable, Composable, and Extensible components.</p>


Below are the GPU specific papers that were accepted in the workshop:

- Accelerating Presto with GPUs, Sean Rooney, Luis Garcés-Erice, Daniel Bauer, Zoltan Nagy, IBM, Greg Kimball, NVIDIA, Deepak Majeti, IBM, Devavret Makkar, Todd Mostak and Karthikeyan Natarajan, NVIDIA.
- Automated Operator Fusion for GPU-Accelerated SQL: Generation and Evolutionary Refinement, Corey Lammie, Yotam Perlitz, Andrea Giovannini and Abdel Labbi. IBM Research, Zurich
- Rubberband: Memory-Elastic, Skew-Tolerant GPU Hash Joins, Hangdong Zhao, Rathijit Sen, Craig Peeper and Matteo Interlandi, Microsoft
- HetMatch: GPU-Accelerated Heterogeneous String Pattern Matching, Abigale Kim and Xiangyao Yu, University of Wisconsin—Madison

## Research 27 · GPU-Accelerated Query Processing 

Wednesday September 2nd.  13:45 – 15:15, Ballroom C

### 1. GPU Acceleration of SQL Analytics on Compressed Data

**Zezhou Huang** (Microsoft) · **Krystian Sakowski** (Microsoft) · **Hans Lehnert** (Microsoft) · **Wei Cui** (Microsoft) · **Carlo Curino** (Microsoft) · **Matteo Interlandi** (Microsoft) · **Marius Dumitru** (Microsoft) · **Rathijit Sen** (Microsoft)

<p class="paper-abstract"><strong>Abstract:</strong> GPUs are uniquely suited to accelerate (SQL) analytics workloads when datasets fit in the GPU High Bandwidth Memory (HBM). Unfortunately, GPU HBMs remain typically small when compared with lower-bandwidth CPU main memory. Current solutions to accelerate queries on large datasets include multi-GPU execution, processing smaller data batches, and hybrid execution with a connected device (e.g., CPUs). Unfortunately, these approaches are exposed to the limitations of lower main memory and host-to-device interconnect bandwidths, introduce additional I/O overheads, or incur higher costs. This is a substantial problem when trying to scale adoption of GPUs on larger datasets. Data compression can alleviate this bottleneck, but to avoid paying for costly decompression/ decoding, an ideal solution must include computation primitives to operate directly on data in compressed form. This is the focus of our paper: a set of new methods for running queries directly on light-weight compressed data using schemes such as Run-Length Encoding (RLE), index encoding, bit-width reductions, and dictionary encoding. Our novelty includes operating on multiple RLE columns without decompression, handling heterogeneous column encodings, and leveraging PyTorch tensor operations for portability across devices. Experimental evaluations show speedups of an order of magnitude compared to state-of-the-art commercial CPU-only analytics systems, for real-world queries on a production dataset that would not fit into GPU memory uncompressed. This work paves the road for GPU adoption in a much broader set of use cases, and it is complementary to most other scale-out or fallback mechanisms.</p>

### 2. PystachIO: Efficient Distributed GPU Query Processing with PyTorch over Fast Networks & Fast Storage

**Jigao Luo** (TU Darmstadt) · **Nils Boeschen** (TU Darmstadt) · **Muhammad El-Hindi** (TU München) · **Carsten Binnig** (TU Darmstadt & DFKI)

<p class="paper-abstract"><strong>Abstract:</strong> The AI hardware boom has led modern data centers to adopt HPC-style architectures centered on distributed, GPU-centric computation. Large GPU clusters interconnected by fast RDMA networks and backed by high-bandwidth NVMe storage enable scalable computation and rapid access to storage-resident data. Tensor computation runtimes (TCRs), such as PyTorch, originally designed for AI workloads, have recently been shown to accelerate analytical workloads. However, prior work has primarily considered settings where the data fits in aggregated GPU memory. In this paper, we systematically study how TCRs can support scalable, distributed query processing for large-scale, storage-resident OLAP workloads. Although TCRs provide abstractions for network and storage I/O, naive use often underutilizes GPU and I/O bandwidth due to insufficient overlap between computation and data movement. As a core contribution, we present PystachIO, a prototype of a PyTorch-based distributed OLAP engine that combines fast network and storage I/O with key optimizations to maximize GPU, network, and storage utilization. Our evaluation shows up to 3x end-to-end speedups over existing distributed GPU-based query processing approaches.</p>

### 3. Bridging the Indexing Gap in Fused GPU Query Engines

**Tianjun Bu** (University of Chinese Academy of Sciences) · **Gaoyuan Zhou** (Institute of Software, Chinese Academy of Sciences) · **Xuhui Li** (University of Chinese Academy of Sciences) · **Qiusong Yang** (Institute of Software, Chinese Academy of Sciences)

<p class="paper-abstract"><strong>Abstract:</strong> GPU query backends achieve high throughput on analytical workloads through massive parallelism, but lack indexing support that accelerates selective queries in CPU databases. Existing GPU index implementations face three limitations: (1) supporting conjunctive predicates only, (2) materializing intermediate results between index access and query execution, and (3) assuming query boundaries align with pre-built index bins. We present a fused bitmap indexing approach that addresses these limitations. We introduce virtual query program that exe- cutes arbitrary boolean predicates with low overhead. We fuse index access with subsequent column lookups, joins, and aggre- gation, keeping intermediate results in registers and eliminating global-memory round-trips. To handle misaligned query bound- aries, we propose GPU friendly candidate checking that tracks three-valued row states (certain-in, certain-out, uncertain) through in-register boolean operations and verifies only the necessary can- didates, without accessing global memory. On Star Schema Benchmark SF=140 with RTX 5090 D, our fused bitmap index achieves up to 6.9× geometric-mean speed over our optimized non-indexed baseline built upon the Crystal GPU data- base query backend (Dense layout), and 4.3× with practical Sparse layout using less memory. Compared to current best compressed GPU bitmap implementation under perfect bin alignment (best case), our Sparse layout achieves 1.4× speed end-to-end. We show that generic elementwise-style GPU fusion achieves only 1.34× speed, while our pipeline reaches 3.19× with 0.8% overhead versus dedicated compile-time kernels. Results on an NVIDIA H800 server GPU show the approach remains stable across GPU architectures, with smaller but still consistent fusion benefits on server GPUs.</p>

### 4. Terabyte-Scale Analytics in the Blink of an Eye

**Bowen Wu** (ETH Zurich) · **Wei Cui** (Microsoft) · **Carlo Curino** (Microsoft) · **Matteo Interlandi** (Microsoft) · **Rathijit Sen** (Microsoft)

<p class="paper-abstract"><strong>Abstract:</strong> For the past two decades, the DB community has devoted substantial research to take advantage of cheap clusters of machines for distributed data analytics — we believe that we are at the beginning of a paradigm shift. The scaling laws and popularity of AI models lead to the deployment of incredibly powerful GPU clusters in commercial data centers. Compared to CPU-only solutions, these clusters deliver impressive improvements in per-node compute, memory bandwidth, and inter-node interconnect performance. In this paper, we study the problem of scaling analytical SQL queries on distributed clusters of GPUs, with the stated goal of establishing an upper bound on the likely performance gains. To do so, we build a prototype designed to maximize performance by leveraging ML/HPC best practices, such as group communication primitives for cross-device data movements. This allows us to conduct thorough performance experimentation to point our community towards a massive performance opportunity of at least 60x. To make these gains more relatable, before you can blink twice, our system can run all 22 queries of TPC-H at a 1TB scale factor!</p>

## Research 37 · Caching, Memory, and Storage Systems

Thursday 10:45 – 12:15 - Grand Ballroom E

### 1. Scalable GPU Acceleration of Scalar Functions in Analytical Databases: Compilation, Benchmarking and Optimization

**Kaushik Rajan** (Microsoft Research) · **Sampath Rajendra** (Microsoft Research) · **Momin Al-Ghosien** (Microsoft) · **Nicolas Bruno** (Microsoft) · **Carlo Curino** (Microsoft) · **Matteo Interlandi** (Microsoft) · **Yinan Li** (Microsoft Research) · **Lukas Maas** (Microsoft Research) · **Craig Peeper** (Microsoft) · **Surajit Chaudhuri** (Microsoft Research) · **Johannes Gehrke** (Microsoft)

<p class="paper-abstract"><strong>Abstract:</strong> Accelerating SQL query execution with GPUs is a central focus in database research. While prior systems have achieved notable speedups by offloading relational operators, the acceleration of the wide range of scalar functions that are supported by analytical engines remains unaddressed. Our analysis reveals that many scalar functions incur substantial computational overhead and often constitute the primary bottleneck in analytical queries on CPUs. This observation motivates a systematic exploration of the opportunities and challenges in accelerating scalar functions on GPUs. Unlike relational operators, which are few in number and standardized, production databases support hundreds of scalar functions. The absence of a standardized specification, combined with this diversity, renders manual GPU porting infeasible. To address this, we present an LLVM-MLIR-based compiler toolchain that automatically translates the CPU-based implementations of scalar functions from production databases into efficient GPU kernels while preserving their original semantics. Our approach lifts scalar functions to a high-level intermediate representation, applies resource-optimizing transformations, and generates GPU assembly code, supporting all relevant data types, parameters, and database context variables. As existing benchmarks do not sufficiently stress test scalar functions in analytical queries, we introduce a variant of TPC-H that utilizes scalar functions while preserving the original query intent. Integrating our GPU kernels into a state-of-the-art GPU database system, we demonstrate substantial performance gains over a leading CPU database that uses slightly more expensive hardware: 7.6× on enhanced TPC-H and 6.4× on production queries, further widening the gap between GPU and CPU databases. The generated kernels deliver performance comparable to hand-optimized GPU implementations, establishing our approach as a scalable and practical solution for accelerating scalar functions on GPUs.</p>

## Industry Session 2 · Query Execution Engines & Hardware Acceleration Industrial Track

### 1. ZipFlow: a Compiler-based Framework to Unleash Compressed Data Movement for Modern GPUs

**Gwangoo Yeo** (KAIST) · **Zhiyang Shen** (Tsinghua University) · **Wei Cui** (Microsoft Research Asia) · **Matteo Interlandi** (Microsoft Gray Systems Lab) · **Rathijit Sen** (Microsoft Gray Systems Lab) · **Bailu Ding** (Microsoft Research) · **Qi Chen** (Microsoft Research Asia) · **Minsoo Rhu** (KAIST)

<p class="paper-abstract"><strong>Abstract:</strong> Modern Lakehouse architectures store data in open, columnar formats to enable cross-engine interoperability, and GPU-accelerated data analytics is increasingly becoming one of these engines. In GPU-accelerated analytics, data transfer from CPU to GPU becomes a performance bottleneck due to limited PCIe bandwidth. Data compression is widely used to reduce transfer volume while leveraging GPUs for decompression. However, to optimize end-to-end query performance, the workflow of compression, transfer, and decompression must be holistically designed based on the compression strategy and hardware characteristics to balance I/O latency and computational overhead. In this work, we present ZipFlow, a compiler-based framework for optimizing compressed data movement in GPU-accelerated data analytics. ZipFlow classifies compression algorithms into three distinct patterns based on their inherent parallelism. For each pattern, ZipFlow applies generalized scheduling strategies to effectively exploit GPU computational resources across diverse architectures. Building on these patterns, ZipFlow provides flexible optimizations allowing to improve end-to-end query latency by 2.08× over the state-of-the-art GPU compression library (nvCOMP), and by up to 3.14× over a state-of-the-art CPU engines.</p>

### 2. RayBooster: A Ray Tracing Engine to Accelerate SedonaDB

**Liang Geng** (the Ohio State University) · **Rubao Lee** (The Ohio State University) · **Dewey Dunnington** (Wherobots, Inc) · **Feng Zhang** (Wherobots, Inc) · **Jia Yu** (Wherobots, Inc) · **Xiaodong Zhang** (The Ohio State University)

<p class="paper-abstract"><strong>Abstract:</strong> Hardware acceleration is becoming increasingly critical for spatial databases, as their workloads are geometrically complex, data-intensive, and subject to growing real-time requirements. Building on our prior evidence that Ray Tracing (RT) cores can significantly accelerate spatial queries through dedicated hardware support, this paper presents RayBooster, the first solution that incorporates RT-core acceleration into a production-grade geospatial database system, Apache SedonaDB. Our approach delivers substantial performance improvements cost-effectively, focusing on spatial joins, which dominate execution time in spatial databases. To enable this integration, we bridge the mismatch between spatial query engines and RT hardware through three key systematic designs. First, to overcome the lack of random access in Well-Known Binary format, we design a GPU-optimized Structure of Arrays storage layout. Second, we eliminate indexing bottlenecks by constructing a monolithic Bounding Volume Hierarchy tree that encodes geometry IDs into the Z-axis, bypassing micro-index overhead. Third, to manage the diverse geometry types, our unified RelateEngine utilizes RT cores to compute the Dimensionally Extended 9-Intersection Model as a universal topological descriptor. Furthermore, we implement a memory-aware execution strategy to mitigate out-of-memory failures through robust resource management. Seamlessly integrated as an extension to SedonaDB, RayBooster delivers up to a 5.93X performance speedup on SpatialBench and provides a 59.02% reduction in operational costs, effectively transforming these idle RT units into an efficient engine for spatial analytics.</p>

### 3. TQP++: Leveraging AI-native Compilation for Query Processing

**Wei Cui** (Microsoft) · **Peng Cheng** (Microsoft) · **Carlo Curino** (Microsoft) · **Rathijit Sen** (Microsoft) · **Matteo Interlandi** (Microsoft)

<p class="paper-abstract"><strong>Abstract:</strong> The convergence of unified, cloud-native Lakehouse platforms such as Microsoft Fabric, and the widespread deployment of AI-optimized hardware in datacenters is driving the rise of GPU-based analytical engines. However, building a GPU query engine that is both competitive with hand-tuned implementations and portable across vendors (NVIDIA, AMD, custom silicon) remains an open challenge, as existing systems either lock into a single vendor's toolchain or sacrifice performance for generality. In this paper, we present TQP++, an AI-native analytical query processor that repurposes ML compiler infrastructure to close this gap, achieving high performance and hardware portability from a single codebase. TQP++ integrates the Antares compilation framework with tiered GPU resource scheduling for SQL operators, a map-reduce-oriented fusion schema that eliminates intermediate materializations, and a multi-gated execution graph that adapts operator algorithms to runtime data characteristics. On TPC-H SF100, TQP++ executes all 22 queries in 1.1 second on an A100 (7x faster than HeavyDB, 15x faster than CPU baselines) and under 0.7 seconds on H100 and MI300, while targeting 9 devices across 3 vendors---including Xbox---without code changes. To our knowledge, this is the most hardware-diverse GPU query processor reported to date, achieving sub-second TPC-H SF100 on a single GPU, while delivering the deployment flexibility required by modern Lakehouse systems.</p>



