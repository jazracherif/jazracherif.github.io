---
layout: post
title: "OLAP Engines: A 40-Year Architecture History"
date: 2026-04-27 00:00:00 -0700
categories: [database, analytics, architecture]
tags: [olap, database-engines, gpu, columnar, vectorized, compilation, distributed, history]
extra_css: ["/assets/css/milestone-timeline.css"]
toc: true
---

Every decade, the dominant bottleneck in analytical database engines has shifted.
In the 1980s and early 1990s it was disk I/O — the spinning platter was so slow that the CPU sat idle most of the time.
By the 2000s it became CPU cache efficiency: data fit in memory, but the engine was thrashing cache lines.
In the 2010s the problem was multi-core scaling and NUMA topology: dozens of cores sat starved of well-scheduled work.
Today the frontier is the still-nascent world of accelerated analytics: GPU memory bandwidth, PCIe/NVLink data movement, and heterogeneous execution.

Each transition forced a fundamental rethinking of storage layouts, execution models, and parallelization strategies.
This post traces those transitions using primary research papers as waypoints.
The goal is not a catalog of systems, but an explanation of *why* each architectural shift happened — what hardware reality made the previous design untenable, and what insight unlocked the next order of magnitude.

<div class="tldr">
<p class="tldr-label">TL;DR</p>
<ol>
  <li><strong>Shared-nothing MPP / disk era (1984–1995)</strong> — Gamma and Teradata proved shared-nothing MPP with horizontal partitioning and hybrid hash join. Row stores dominated; the CPU sat idle while disk I/O was the binding constraint.</li>
  <li><strong>Column store insight + Volcano model (1985–2000)</strong> — Copeland and Khoshafian's DSM showed columnar storage cuts I/O by reading only queried attributes. Graefe's Volcano iterator model became the universal execution abstraction — but both waited a decade for hardware to make their impact felt.</li>
  <li><strong>Cache-conscious vectorized execution (2000–2008)</strong> — CPUs outpaced disk; cache efficiency became the bottleneck. C-Store formalized late materialization; MonetDB/X100 replaced tuple-at-a-time Volcano with vector-at-a-time processing, delivering 1–2 OOM improvement on TPC-H.</li>
  <li><strong>In-memory + query compilation (2007–2014)</strong> — DRAM grew large enough to hold analytical datasets. HyPer's LLVM-based compilation fused pipelines into tight machine code rivaling hand-written C++, eliminating Volcano's virtual-dispatch overhead entirely.</li>
  <li><strong>NUMA-aware morsel-driven parallelism (2012–2018)</strong> — Many-core CPUs exposed NUMA bottlenecks. Morsel-driven parallelism replaced the Exchange operator with work-stealing over fine-grained task morsels; SIMD-aware joins exploited hardware vector units directly.</li>
  <li><strong>Composable stacks + cloud disaggregation (2016–2023)</strong> — Snowflake decoupled storage from compute. Apache Arrow, Parquet, and Substrait enabled interchangeable components (DuckDB, Velox, DataFusion). The Composable Data Manifesto articulated the new paradigm.</li>
  <li><strong>Emerging accelerated analytics: GPUs, data movement, and the next OLAP architecture (2019–present)</strong> — This is still a nascent era: GPUs offer 8–10× CPU memory bandwidth and massive thread-level parallelism, but the architecture has not converged. Systems like Crystal, HetExchange, TQP, Vortex, Maximus, SiriusDB, and Theseus push against the remaining barriers: memory capacity, PCIe bottleneck, distributed shuffle, and engineering complexity.</li>
</ol>
</div>

---

## Era 1 — Shared-Nothing MPP: The Disk Era (1984–1995)

The foundational insight that made large-scale parallel analytics tractable arrived in two papers separated by a few years.
In 1986, Michael Stonebraker articulated "The Case for Shared Nothing"[^stonebraker-shared-nothing]: a cluster of independent nodes — each with its own CPU, memory, and disk, connected only by a message-passing network — could scale linearly without coordination overhead.
Shared memory buses and shared disk buses do not scale; the cost of coordination should be explicit in network messages, not hidden in hardware contention.

The **Gamma Database Machine**[^dewitt-gamma] project at Wisconsin operationalized this on a 32-processor Intel iPSC/2 hypercube with 32 disk drives.
Gamma introduced the algorithms all commercial MPP systems would inherit:
horizontal data partitioning by hashing join attributes across nodes,
the hybrid hash join (with a grace partition-based phase for data larger than memory),
and a pipeline-breaking *Γ operator* for aggregation.
The result: near-linear speedup for equi-join queries as nodes are added.

DeWitt and Gray's 1992 survey[^dewitt-parallel-db] formalized the taxonomy — shared-memory, shared-disk, shared-nothing — and made the canonical argument that shared-nothing was the only architecture that would scale to hundreds of nodes.
This shaped Teradata (1984), Tandem NonStop SQL[^tandem-nonstop] (1988), Red Brick Warehouse, and eventually Greenplum, Netezza, and Amazon Redshift.

**The structural problem**: all of these systems used the *N-ary Storage Model* (NSM) — entire tuples packed row-by-row on disk pages.
For an OLAP query reading 5 columns from a 100-column table, a row store transfers 95 columns of irrelevant data from disk on every I/O.
With disk seek latency measured in milliseconds and analytical queries scanning billions of rows, this was the bottleneck — and it made the CPU irrelevant.
You could not fix this with a faster CPU; you had to reduce the amount of disk traffic.

### Era 1 Timeline

<div class="milestone-timeline">

  <div class="mt-year">1979</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>DIRECT</strong>[^dewitt-direct] — early Wisconsin multiprocessor database-machine work; a precursor to Gamma's shared-nothing design</div>

  <div class="mt-year">1984</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Teradata Database</strong> — commercial shared-nothing MPP analytics arrives before the academic architecture is fully named</div>

  <div class="mt-year">1986</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>The Case for Shared Nothing</strong>[^stonebraker-shared-nothing] — Stonebraker argues that independent CPU-memory-disk nodes are the scalable architecture</div>

  <div class="mt-year">1988</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Tandem NonStop SQL</strong>[^tandem-nonstop] — high-availability distributed SQL shows shared-nothing ideas in production transaction systems</div>

  <div class="mt-year">1989</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>A Performance Evaluation of Four Parallel Join Algorithms</strong>[^schneider-parallel-joins] — Schneider and DeWitt evaluate partitioned joins in a shared-nothing multiprocessor environment</div>

  <div class="mt-year">1990</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Gamma Database Machine</strong>[^dewitt-gamma] — hash partitioning, hybrid hash joins, parallel aggregation, and dataflow scheduling on a 32-processor iPSC/2</div>

  <div class="mt-year">1992</div>
  <div class="mt-connector"><div class="mt-dot mt-dot--last"></div></div>
  <div class="mt-content mt-content--last" markdown="span"><strong>Parallel Database Systems</strong>[^dewitt-parallel-db] — DeWitt and Gray make shared-nothing the canonical scale-out OLAP architecture</div>

</div>

---

## Era 2 — The Column Store Insight and the Volcano Execution Model (1985–2000)

Two papers in this window established the intellectual foundation for the next twenty years, even though their full impact would not arrive for another decade.

**Copeland and Khoshafian**[^copeland-dsm] proposed the *Decomposition Storage Model* (DSM) at SIGMOD 1985.
Instead of packing all attributes of a tuple together, DSM stores each attribute in a separate relation keyed by a surrogate ID.
For queries touching 3 of 100 columns, DSM reads 3% of the data NSM would.
The catch: without *late materialization* (formalized only in C-Store twenty years later), assembling a full tuple from 100 separate files was prohibitive for queries that materialized many rows.
DSM was correct in principle but practically unusable at scale — a solution that had to wait for the right execution model around it.

**Graefe's Volcano**[^graefe-volcano] designed the execution engine abstraction that became universal: the *iterator model*.
Every operator implements three methods: `open()`, `next()`, `close()`.
Parent operators call `next()` on their children, pulling tuples up the plan tree.
The *Exchange* operator, inserted at parallelism boundaries, distributed work across threads or nodes via mailboxes — enabling horizontal, vertical, and bushy parallelism without modifying individual operators.
Volcano was modular, composable, and teachable.

But Volcano contained a fatal flaw that would only become visible once CPUs grew fast enough to expose it.
Calling a virtual function once per tuple — dispatching to a different child operator on every iteration of `while (tuple = child.next())` — prevents the compiler from vectorizing the inner loop, thrashes the instruction cache, and generates unpredictable branch targets on every step.
On a CPU executing hundreds of millions of operations per second, the Volcano interface itself consumed a large fraction of execution time.
In 2000, disk was still slow enough that this did not matter.
By 2005, it mattered enormously.

### Era 2 Timeline

<div class="milestone-timeline">

  <div class="mt-year">1985</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>A Decomposition Storage Model</strong>[^copeland-dsm] — Copeland and Khoshafian propose fully decomposed, attribute-at-a-time storage</div>

  <div class="mt-year">1990</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Encapsulation of Parallelism in Volcano</strong>[^graefe-volcano-exchange] — Graefe encapsulates parallelism behind an operator boundary, separating parallel execution from operator internals</div>

  <div class="mt-year">1993</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Query Evaluation Techniques for Large Databases</strong>[^graefe-query-evaluation] — Graefe systematizes external sort, hash join, pipelining, and iterator-based execution techniques</div>

  <div class="mt-year">1994</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Volcano TKDE</strong>[^graefe-volcano] — open/next/close becomes the durable mental model for relational execution engines</div>

  <div class="mt-year">1994</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Sybase IQ</strong> — commercial columnar analytics appears, but remains outside the mainstream row-store architecture</div>

  <div class="mt-year">1995</div>
  <div class="mt-connector"><div class="mt-dot mt-dot--last"></div></div>
  <div class="mt-content mt-content--last" markdown="span"><strong>Cascades Framework</strong>[^graefe-cascades] — rule-based optimizer search becomes modular; the frontend evolves separately from storage and execution</div>

</div>

---

## Era 3 — Cache-Conscious Vectorized Execution (2000–2008)

By 2001, commodity DRAM was cheap enough that the working set of many analytical queries could fit in RAM.
The bottleneck shifted from disk I/O to *CPU cache efficiency and instructions-per-cycle (IPC)*.

**Ailamaki et al.**[^ailamaki-pax] diagnosed the problem empirically at VLDB 2001.
Profiling TPC-D queries on commercial row-store systems showed that engines spent 50–90% of cycles stalled waiting for memory — not computing.
The culprit: NSM row layout places attributes the query never accesses immediately adjacent to those it does, polluting every cache line.
Their PAX (Partition Attributes Across) layout stored columns within each disk page as mini-arrays, preserving page-level tuple locality for point queries while exposing columnar access for vectorized scans within a page.

**MonetDB/X100**[^boncz-monetdb] made the definitive case for full columnar storage plus vectorized execution.
The paper's central observation: the original MonetDB used a *Binary Association Table* (BAT) algebra that processed entire columns in one pass — which worked on larger-than-cache workloads but did not fit in L1/L2 cache.
Volcano called `next()` once per tuple, preventing SIMD.
X100 introduced *vector processing at ~1000 tuples per call*: large enough to amortize function-call overhead, small enough to fit in L1/L2 cache, and exposing the regular loop structure that compilers need to emit SIMD instructions.
Each primitive (e.g., `multiply(float* out, float* a, float* b, int n)`) operates on a typed, fixed-length vector with no virtual dispatch.
On TPC-H at 100 GB: **one to two orders of magnitude faster** than contemporary systems.

This paper reoriented the field's understanding of the bottleneck.
The lesson: a disk-bound system and a cache-bound system require fundamentally different architectures.
Volcano was right for its time; it became a liability when the hardware changed.

**C-Store**[^stonebraker-cstore] advanced the column store design with three innovations:

1. **Overlapping projections**: rather than one column store, C-Store maintains multiple overlapping sorted column groups — each covering a different attribute subset in a sort order optimized for common query patterns.
2. **Late materialization**: filters and joins are evaluated on compressed column IDs; actual values are fetched only when the final result set is determined, minimizing decompression cost and cache footprint.
3. **ROS + WOS**: a Read-Optimized Store (compressed, sorted columns) and a Write-Optimized Store (unsorted, row-format) with a background Tuple Mover reconciling them — cleanly separating OLAP read performance from update throughput.

Compression became part of the same architectural turn.
Żukowski's bandwidth-optimized storage work[^zukowski-bandwidth-storage] showed that vectorized execution and lightweight compressed column formats should be designed together: keeping data compressed reduces memory bandwidth demand, but only if decompression feeds vectorized operators without destroying CPU efficiency.

C-Store became **Vertica**.
VectorWise (the X100 commercialization) became part of Actian.
Together, these systems made pure row stores uncompetitive for scan-heavy analytical workloads.

### Era 3 Timeline

<div class="milestone-timeline">

  <div class="mt-year">2001</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Weaving Relations for Cache Performance</strong>[^ailamaki-pax] — keeps page-level row locality while clustering attributes inside each page for cache efficiency</div>

  <div class="mt-year">2005</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>MonetDB/X100</strong>[^boncz-monetdb] — vector-at-a-time execution amortizes iterator overhead and exposes SIMD-friendly tight loops</div>

  <div class="mt-year">2005</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>C-Store</strong>[^stonebraker-cstore] — overlapping projections, late materialization, compression, and ROS/WOS split become the modern column-store template</div>

  <div class="mt-year">2008</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Column-Stores vs. Row-Stores</strong>[^abadi-columnstores-rowstores] — Abadi et al. clarify that column stores are not merely vertically partitioned row stores</div>

  <div class="mt-year">2009</div>
  <div class="mt-connector"><div class="mt-dot mt-dot--last"></div></div>
  <div class="mt-content mt-content--last" markdown="span"><strong>Balancing Vectorized Execution with Bandwidth-Optimized Storage</strong>[^zukowski-bandwidth-storage] — compressed column formats and vectorized execution are treated as one design problem</div>

</div>

---

## Era 4 — In-Memory Databases and Query Compilation (2007–2014)

By the late 2000s, a midrange server could hold 1 TB of DRAM.
The question shifted: *what is left in the critical path when disk is removed entirely?*

Stonebraker's provocation, "The End of an Architectural Era"[^stonebraker-end-era], argued that traditional DBMS components were designed for a disk-bound world.
In an in-memory system, the traditional disk buffer pool largely leaves the critical path, two-phase locking can be replaced in some workloads with optimistic concurrency or partitioned single-threading, and WAL logging can be streamlined.
**H-Store**[^kallman-hstore] demonstrated this: partitioned, single-threaded-per-partition execution avoided conventional locking and latching overheads for single-partition transactions.
H-Store became **VoltDB**[^stonebraker-voltdb].

**Hekaton**[^diaconu-hekaton] showed the commercial counterpoint: rather than replacing the DBMS, SQL Server added memory-optimized tables, latch-free data structures, optimistic multiversion concurrency control, and natively compiled stored procedures inside an existing relational system.

**SAP HANA**[^farber-hana] took a different path.
Rather than discarding existing DBMS infrastructure, HANA unified OLTP and OLAP in a single in-memory column store — a row store for hot OLTP data, a column store for analytics, with a delta merge process reconciling them.
HANA reduced or eliminated the ETL pipeline to a separate data warehouse for many SAP workloads.

**HyPer**[^kemper-hyper] combined HTAP with the execution breakthrough of the era.
For HTAP isolation, it used OS-level fork-based copy-on-write snapshots: OLAP queries run on a frozen snapshot while OLTP proceeds on the live database, with no locking between them.
More consequentially, Neumann's companion paper "Efficiently Compiling Efficient Query Plans for Modern Hardware"[^neumann-compilation] introduced **data-centric code generation via LLVM**:

- Each relational operator implements `produce()` and `consume()` methods that *generate code* rather than execute it.
- A depth-first traversal of the query plan generates LLVM IR for the entire pipeline, fusing all non-blocking operators (filters, projections, expression evaluation, hash table probes) into a single tight function with no intermediate materialization.
- The resulting LLVM IR is JIT-compiled to native machine code with full SIMD and register-reuse opportunities.

For TPC-H Q1 — a simple scan + aggregation that has a hand-written reference implementation — HyPer's compiled code performed within 2× of hand-written C++.
Volcano-based systems were 10–100× slower on the same query.

### Vectorization vs. Compilation

The community debated: which model is better?
Kersten et al.[^kersten-vectorized-compiled] resolved this experimentally by implementing both models inside the *same test system* with identical algorithms and data structures, enabling a direct apples-to-apples comparison:

- **Compilation wins** when data is cache-resident: fewer CPU instructions, no iteration overhead, tight register reuse.
- **Vectorization wins** when data is cache-cold: larger vector granularity amortizes the latency of LLC misses; compilation's tight loops stall while waiting for data.

The conclusion is not "pick one" but rather "they trade off on workload characteristics."
Modern systems converge: DuckDB uses vectorized execution; Umbra uses lightweight compilation that avoids slow LLVM passes for short queries[^neumann-umbra].

### Era 4 Timeline

<div class="milestone-timeline">

  <div class="mt-year">2007</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>The End of an Architectural Era</strong>[^stonebraker-end-era] — Stonebraker et al. argue that disk-era DBMS internals are the wrong baseline for main-memory OLTP</div>

  <div class="mt-year">2008</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>H-Store</strong>[^kallman-hstore] — partitioned main-memory execution removes many classic transactional overheads for single-partition workloads</div>

  <div class="mt-year">2011</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>HyPer</strong>[^kemper-hyper] — fork-based OLAP snapshots plus LLVM code generation define the research HTAP/compilation path</div>

  <div class="mt-year">2011</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>SAP HANA Database</strong>[^farber-hana] — commercial in-memory columnar HTAP brings the architecture into enterprise workloads</div>

  <div class="mt-year">2013</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>VoltDB</strong>[^stonebraker-voltdb] — H-Store's partitioned main-memory OLTP ideas become a production system</div>

  <div class="mt-year">2013</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Hekaton</strong>[^diaconu-hekaton] — SQL Server integrates memory-optimized tables and native stored-procedure compilation without replacing the DBMS</div>

  <div class="mt-year">2018</div>
  <div class="mt-connector"><div class="mt-dot mt-dot--last"></div></div>
  <div class="mt-content mt-content--last" markdown="span"><strong>Everything You Always Wanted to Know About Compiled and Vectorized Queries</strong>[^kersten-vectorized-compiled] — the field reframes execution as a hardware-dependent tradeoff, not a single winning model</div>

</div>

---

## Era 5 — NUMA-Aware Morsel-Driven Parallelism (2012–2018)

Multi-core processors created a new scaling problem: how to divide a single query across 32+ threads efficiently.
Volcano-style plan-driven parallelism assigned partitions of work before execution — a fixed degree of parallelism determined before the query's actual runtime behavior was visible.
This created three compounding problems:

1. **Static load imbalance**: if one data partition is heavier (due to key skew), that thread's pipeline stalls the entire query.
2. **No NUMA awareness**: threads are assigned data that may reside in memory physically attached to a different NUMA node, incurring 2–4× latency penalties.
3. **Coarse granularity**: the plan decides parallelism, not the scheduler. No dynamic adaptation to actual execution speed.

Adaptive execution was not a new idea — eddies[^avnur-eddies] had already explored continuously reordering operators while a query runs — but morsel-driven parallelism brought runtime adaptivity to shared-memory analytical execution.

**Morsel-Driven Parallelism**[^leis-morsel] replaced static parallel work assignment with runtime scheduling:

- A **morsel** is a small chunk of input data (~10K tuples).
- A **dispatcher** assigns morsels to worker threads dynamically at runtime; each thread executes the full non-blocking pipeline for its morsel until the next pipeline-breaker (e.g., a hash join build phase).
- A **work-stealing** mechanism eliminates load imbalance: idle threads steal morsels from overloaded threads.
- The dispatcher tracks NUMA topology and assigns morsels preferentially to threads on the same NUMA node as the data.

The result: >30× speedup on 32 cores for TPC-H, close to the theoretical maximum.
This scheduling architecture was adopted by HyPer and subsequently DuckDB.

**Hardware-conscious hash joins** were rethought in parallel.
Balkesen et al.[^balkesen-radix-join] provided the definitive multi-core join analysis, showing that a *radix-partitioned hash join* — a two-phase strategy that first partitions both relations into L2-sized chunks, then probes L1-sized sub-partitions — minimizes TLB pressure and cache misses during the probe phase.
The naive "build a global hash table, then probe in parallel" approach stalls on random memory accesses at large scales.

**Polychroniou, Raghavan, and Ross**[^polychroniou-simd] extended SIMD exploitation to the full operator repertoire — scan, hash aggregation, sort, partitioning.
The core challenge: database operations have irregular control flow (predicate branching, conditional updates) that prevents naïve auto-vectorization.
They introduced SIMD-aware algorithms that rewrite each operator to expose regularity: conflict-detection for concurrent hash aggregation, permutation-based SIMD sorting networks, and linear-probing with SIMD gather/scatter for hash tables.

The execution-model debate also became sharper: push-based loop fusion can recover many of compilation's locality benefits without LLVM-style per-query compilation cost, while pull-based iterators preserve modularity and scheduling control.[^neumann-push-pull]

### Era 5 Timeline

<div class="milestone-timeline">

  <div class="mt-year">2000</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Eddies</strong>[^avnur-eddies] — continuously adaptive query processing shows that runtime behavior can feed execution decisions</div>

  <div class="mt-year">2011</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Design and Evaluation of Main Memory Hash Join Algorithms</strong>[^blanas-main-memory-joins] — Blanas et al. revisit join design once random memory access, not disk I/O, dominates</div>

  <div class="mt-year">2013</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Multi-Core, Main-Memory Joins</strong>[^balkesen-radix-join] — cache/TLB-conscious partitioning becomes central to multi-core join performance</div>

  <div class="mt-year">2014</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Morsel-Driven Parallelism</strong>[^leis-morsel] — fine-grained work assignment, NUMA locality, and work stealing replace static plan-level parallelism</div>

  <div class="mt-year">2015</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Rethinking SIMD Vectorization for In-Memory Databases</strong>[^polychroniou-simd] — scans, joins, aggregation, sorting, and partitioning are redesigned to expose vector lanes explicitly</div>

  <div class="mt-year">2016</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Push vs. Pull-Based Loop Fusion</strong>[^neumann-push-pull] — execution models are compared through the lens of locality, fusion, and compilation cost</div>

  <div class="mt-year">2018</div>
  <div class="mt-connector"><div class="mt-dot mt-dot--last"></div></div>
  <div class="mt-content mt-content--last" markdown="span"><strong>Everything You Always Wanted to Know About Compiled and Vectorized Queries</strong>[^kersten-vectorized-compiled] — Kersten et al. show cold-data and hot-data workloads favor different execution strategies</div>

</div>

---

## Era 6 — Composable Stacks and Cloud Disaggregation (2016–2023)

Two parallel developments — cloud-native disaggregation and open interoperability standards — transformed the economics and architecture of analytical systems.

### Cloud Disaggregation

**Snowflake**[^dageville-snowflake] made the bet that storage and compute should be physically separated.
The architecture has three independent layers:
- **Cloud storage** (S3-compatible): immutable, micro-partitioned columnar files with rich metadata. Durability and elasticity come from the object store, not the database.
- **Virtual Warehouses**: independent EC2 clusters that cache hot data locally on SSD and execute queries. They can scale to zero between queries and scale up in seconds.
- **Cloud Services Layer**: shared metadata, query optimization, and access control as a multi-tenant service.

The payoff: compute and storage scale independently.
A short-lived query burst adds compute nodes without moving data; long-term data growth adds storage without buying compute.
A 2020 follow-on paper[^vuppalapati-snowflake-elastic] described the engineering challenges of building an elastic query engine over an object store at production scale — consistent metadata despite concurrent writers, speculative execution against S3 tail latency, and local SSD caching strategies.

### The Composable Stack

The proliferation of specialized engines — Presto for federated SQL, Spark for ETL, Flink for streaming, custom ML pipelines — created a siloed landscape.
Each engine independently reimplemented the same string functions, date arithmetic, JSON parsing, expression evaluators, and type systems, with subtly different semantics and significant duplicated engineering cost.

**DuckDB**[^raasveldt-duckdb] demonstrated that a full-featured embeddable analytical DBMS could fit in a single-process library with zero external dependencies.
Push-based vectorized execution, morsel-driven parallelism, and careful use of modern C++ made DuckDB competitive with cloud data warehouses on node-local workloads.
The "SQLite for analytics" framing captured the insight: embeddability enables use cases where spinning up a warehouse is impractical.

**Velox**[^pedreira-velox] took the reuse argument to Meta's scale.
Rather than maintaining separate execution engines for Presto, Spark, the feature store, and PyTorch preprocessing, Meta built a single reusable C++ execution library — a vectorized expression evaluator, type system, operator library, and adaptive runtime — and plugged it into over a dozen data systems.
The economic argument: engineering investment compounds across all systems simultaneously rather than each team reimplementing the same optimizer.

**Apache Arrow DataFusion**[^lamb-datafusion] realized the same vision in Rust on top of Apache Arrow: a modular, Arrow-native analytical query engine where every component (SQL parser, logical optimizer, physical planner, execution engine) is replaceable and independently extensible.

**Photon**[^behm-photon] represents the lakehouse version of the same pressure: a native vectorized engine inside Databricks that accelerates SQL and Spark workloads over open columnar lake formats such as Parquet, rather than assuming data already lives in a warehouse-managed storage layer.

**The Composable Data Management System Manifesto**[^pedreira-composable] articulated the thesis formally.
Every data management system is composed of the same logical layers: a language frontend, an intermediate representation (IR), a query optimizer, an execution engine, and a distributed runtime.
The components are not system-specific — there is nothing fundamentally different between the SQL frontend of an operational database and that of a data warehouse.
The manifesto advocates standardizing the API boundaries between these layers using open projects: **Apache Arrow** (in-memory columnar format), **Apache Parquet** (on-disk columnar format), and **Apache Substrait** (portable query plan representation) as the interchange lingua franca.

The practical consequence: a new GPU execution engine can plug into systems that emit compatible Substrait plans and expose compatible data/runtime boundaries, avoiding the need to rebuild the SQL parser or optimizer from scratch.
SiriusDB (Era 7) is one realization of this design direction.

### Era 6 Timeline

<div class="milestone-timeline">

  <div class="mt-year">2014</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Orca</strong>[^soliman-orca] — Greenplum's modular optimizer demonstrates that optimization can become a reusable component for big-data systems</div>

  <div class="mt-year">2016</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Snowflake</strong>[^dageville-snowflake] — storage and compute are physically disaggregated; virtual warehouses make elasticity an engine feature</div>

  <div class="mt-year">2016</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>ClickHouse DBMS</strong> — open-source columnar OLAP proves that very high-throughput vectorized analytics can be operational software, not only a warehouse service</div>

  <div class="mt-year">2018</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Apache Calcite</strong>[^begoli-calcite] — optimizer/planner infrastructure spreads across heterogeneous SQL engines and federated data systems</div>

  <div class="mt-year">2019</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>DuckDB</strong>[^raasveldt-duckdb] — an embeddable vectorized OLAP engine moves analytical SQL into applications and notebooks</div>

  <div class="mt-year">2020</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Building an Elastic Query Engine on Disaggregated Storage</strong>[^vuppalapati-snowflake-elastic] — Snowflake's production follow-up exposes object-store execution challenges: metadata, caching, and tail latency</div>

  <div class="mt-year">2022</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Velox</strong>[^pedreira-velox] — Meta's reusable execution library attacks duplicated engine work across Presto, Spark, feature stores, and ML preprocessing</div>

  <div class="mt-year">2022</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Photon</strong>[^behm-photon] — Databricks' lakehouse-native vectorized engine accelerates SQL and Spark over open columnar lake formats</div>

  <div class="mt-year">2022</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>SingleStore</strong>[^singlestore-cloud-native] — cloud-native HTAP shows another synthesis: distributed transactions and analytics in one operational engine</div>

  <div class="mt-year">2023</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Composable Data Management System Manifesto</strong>[^pedreira-composable] — Arrow, Parquet, Substrait, and shared engines become an explicit architecture agenda</div>

  <div class="mt-year">2024</div>
  <div class="mt-connector"><div class="mt-dot mt-dot--last"></div></div>
  <div class="mt-content mt-content--last" markdown="span"><strong>Apache Arrow DataFusion</strong>[^lamb-datafusion] — Arrow-native modular execution makes embeddable query engines a reusable software layer</div>

</div>

---

## Era 7 — Emerging Accelerated Analytics: GPUs, Data Movement, and the Next OLAP Architecture (2019–present)

Unlike the earlier eras, this one is still forming. The hardware direction is clear — analytics is becoming bandwidth-bound across CPUs, GPUs, memory tiers, and interconnects — but the database architecture that best exploits that hardware is not yet settled.

### The Hardware Argument

A modern GPU (NVIDIA H100 SXM) delivers approximately 3.35 TB/s of HBM3 memory bandwidth — roughly **8–10× a high-end CPU server** (~400 GB/s on AMD EPYC or Intel Xeon).
It exposes 16,000+ CUDA cores executing in a SIMT (Single Instruction Multiple Thread) model that is structurally aligned with OLAP's regular, data-parallel patterns: scan+filter, hash join, sort, aggregation.
The bandwidth advantage alone makes GPUs compelling for memory-bandwidth-bound analytics.

### From Coprocessor to First-Class Engine

Early work demonstrated GPUs as database coprocessors.
Govindaraju et al.[^govindaraju-gpu-db] showed GPU-based database operations using graphics APIs.
By 2008–2009, researchers had implemented relational joins[^he-gpu-joins] and full query coprocessing[^he-query-coprocessing] on CUDA.
These systems treated the GPU as an accelerator: data was computed on CPU, transferred to GPU for a single hot operator, and results returned.
The PCIe bottleneck (~16 GB/s on PCIe 3.0, a 75× mismatch with HBM bandwidth) made full-query GPU execution impractical for cold data.

Commercially, **MapD** (founded ~2013 by Todd Mostak, later renamed **OmniSci**, then **HeavyAI/HeavyDB**) demonstrated interactive visual analytics at billion-row scale when the dataset fit in GPU VRAM — one of the first production SQL engines centered on in-GPU-memory execution.
**BlazingSQL** (~2019) brought GPU SQL to the NVIDIA RAPIDS ecosystem, with pandas-compatible DataFrames and Dask integration for distributed execution.
The BlazingSQL team eventually merged into **Voltron Data**, whose production engine is **Theseus** (described below).

### The Four Barriers — and Their Erosion

SiriusDB[^yogatama-siriusdb] explicitly identifies the four barriers that constrained GPU database adoption, and argues all four have been substantially mitigated by 2026:

| Barrier | Then | Now |
|---|---|---|
| GPU memory capacity | 8–32 GB-class devices | 40–80 GB on A100, 80–141 GB on Hopper/H200/GH200-class systems, and roughly 180+ GB per Blackwell GPU, depending on SKU |
| Data movement | PCIe 3.0 ~16 GB/s | PCIe 5.0 ~64 GB/s; NVLink-C2C 900 GB/s (GH200); GPUDirect NVMe |
| Hardware cost | $30–60K GPU, scarce | Spot GPU pricing $1–3/hr; SiriusDB shows GH200 at $3.2/hr vs. CPU c6a.metal at $7.3/hr |
| Engineering cost | Full SQL engine from scratch | Composable stack: Substrait + libcudf + Arrow removes most system-level work |

### Research Systems

**HetExchange**[^chrysogelos-hetexchange] solved the heterogeneous execution problem at the scheduling layer.
Morsel-driven parallelism, as defined in Era 5, assumes CPU homogeneity and cache-coherent shared memory — neither of which holds for CPU+GPU systems.
HetExchange introduces a new Exchange operator that routes morsels to either CPU pipelines (JIT-compiled LLVM) or GPU pipelines (CUDA) based on data location, wrapping the heterogeneity behind the same operator abstraction Volcano used.
Result: 2.8× over a CPU DBMS and 6.4× over a GPU-only DBMS on analytical benchmarks by exploiting both compute resources simultaneously.

**Crystal**[^shanbhag-crystal] provided a rigorous analytical model of GPU vs. CPU database performance.
The insight: individual GPU operators (selection, projection) achieve speedup close to the memory bandwidth ratio (~16×), but hash joins achieve less due to GPU random-access patterns being less efficient than CPU.
Paradoxically, **full queries achieve 25× speedup** — *exceeding* the bandwidth ratio — because the CPU cannot effectively chain SIMD operations end-to-end across an entire operator pipeline, while the GPU exploits massive thread-level parallelism over the combined pipeline without the pipeline re-vectorization problem.
Crystal introduced the *tile-based execution model*: GPU warps cooperate over fixed-size tiles in shared memory, reusing intermediate results across operators within the same warp.

**TQP (Tensor Query Processor)**[^he-tqp] took a structurally different approach: map SQL queries to *tensor programs* and execute them on PyTorch or ONNX runtimes.
The premise: the ML community has already invested billions in highly optimized tensor execution across every accelerator (GPU, TPU, FPGA, custom chips).
Why rebuild this for databases?
TQP implements all TPC-H operators as tensor programs and reports up to **10×** lower execution time than specialized CPU- and GPU-only systems, with an additional advantage: hybrid SQL+ML queries (e.g., inference inside a SQL pipeline) run with up to **9× speedup** over CPU baselines, because the ML prediction and the SQL aggregation execute in the same runtime with no framework context switch.

**Vortex**[^yuan-vortex] addresses the memory capacity wall directly.
In a multi-GPU server, typically one GPU handles an analytical workload while others run compute-bound ML jobs.
Vortex observes that the ML-running GPUs *underutilize their PCIe IO links*.
The key innovation: route data IO through multiple GPUs' PCIe links to feed a single target analytical GPU — using the unused IO bandwidth of neighboring GPUs as a distributed IO pipeline.
Combined with late materialization via GPU zero-copy memory access (reading directly from pinned CPU memory without explicit transfers), Vortex achieves **5.7× over Proteus** (previous state-of-the-art GPU baseline) and **2.5× price-performance improvement** over DuckDB on CPU.

**Maximus**[^kabic-maximus] focuses on modularity and *operator-level heterogeneity* at ETH Zurich.
Rather than a monolithic CPU+GPU engine, Maximus decomposes execution to individual operators: each operator independently runs on CPU or GPU, with data movement optimized at operator boundaries.
Crucially, Maximus integrates with third-party engines via Substrait: it can call a DuckDB operator inside a GPU-dominant pipeline and vice versa.
This *operator-level integration* achieves better performance than each operator achieves in its native engine, because data movement is optimized across the entire pipeline rather than within a single system.
Maximus covers the full TPC-H benchmark on both CPU and GPU with adaptive execution across them.

**SiriusDB**[^yogatama-siriusdb] argues the moment for mainstream GPU SQL adoption has arrived.
Sirius is a GPU-native SQL engine designed to install as a *drop-in replacement* for compatible CPU engines via Substrait — requiring no changes to the SQL parser, query optimizer, or application code in that integration model.
It leverages NVIDIA's `libcudf` (RAPIDS) for relational operators, RMM for GPU memory management, and NCCL for distributed execution.
Benchmarks: **7× over DuckDB CPU at the same cloud rental cost** (single-node GH200 vs. c6a.metal), and **12.5× in a distributed Apache Doris deployment**.
The critical observation: at current spot pricing, the GPU instance costs *less per hour* than the CPU instance for the same TPC-H throughput.

**Theseus**[^arambu-theseus] is a production-oriented answer to distributed GPU analytics.
The system identifies the core bottleneck in GPU query processing as *serialized data movement*: if file I/O, PCIe transfer, GPU compute, and network shuffle happen sequentially, GPU utilization is low regardless of compute speed.
Theseus introduces four fully asynchronous, cooperating executors — **file I/O, network shuffle, CPU compute, and GPU compute** — that run concurrently, with proactive data pre-loading ensuring GPU computation is never blocked waiting for I/O.
The memory subsystem uses page-locked host memory allocations for maximum PCIe throughput with minimal fragmentation.
Results: TPC-H at scale factor 100,000 (**100 TB**) on as few as 2 DGX A100 nodes; up to **4× over Databricks Photon at cost parity**.

### Open Problems

Because this accelerated analytics era is still nascent, the active research fronts as of 2026 remain architectural rather than merely implementational:

1. **Spilling and memory tiering**: what happens when a hash table overflows GPU HBM? Efficient spilling from HBM → pinned CPU memory → NVMe SSD without catastrophic bandwidth drops is partially addressed in Vortex and Theseus, but lacks a principled general framework.

2. **Distributed GPU shuffle**: GROUP BY or join operations on data that exceeds GPU memory require redistributing data across nodes. The network-to-GPU data path (NVLink fabric, RDMA, GPUDirect) introduces latency and flow-control challenges absent in CPU shuffle. Lutz et al.[^lutz-distributed-gpu] is early work here.

3. **Adaptive CPU-GPU operator scheduling**: a cost model that decides, per operator, whether CPU or GPU execution is faster given current data size, available memory, and transfer costs. HetExchange and Maximus make initial contributions; a principled, production-quality cost model remains open.

4. **Query compilation for GPU**: Neumann-style LLVM compilation for CPUs is well-understood. Generating optimal CUDA kernels from a query plan — choosing thread block sizes, shared memory allocation strategy, and memory access patterns per operator — is significantly harder and less well-studied.

5. **GPU-native compression**: many GPU query paths still decompress Parquet/Arrow data before or during transfer in ways that waste PCIe bandwidth on expanded data. FastLanes compression[^afroozeh-fastlanes][^afroozeh-gpu-fastlanes] and NVIDIA's `nvcomp` library are beginning to address decompression directly on GPU.

### Era 7 Timeline

<div class="milestone-timeline">

  <div class="mt-year">2004</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Fast Computation of Database Operations using Graphics Processors</strong>[^govindaraju-gpu-db] — Govindaraju et al. map database operations onto graphics processors before CUDA-era generality</div>

  <div class="mt-year">2008</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Relational Joins on Graphics Processors</strong>[^he-gpu-joins] — relational joins move to programmable GPUs, exposing random-access and transfer-cost limits</div>

  <div class="mt-year">2009</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Relational Query Coprocessing on Graphics Processors</strong>[^he-query-coprocessing] — full relational query coprocessing balances CPU work, GPU work, and transfer cost</div>

  <div class="mt-year">2019</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>HetExchange</strong>[^chrysogelos-hetexchange] — heterogeneous CPU-GPU scheduling is encapsulated behind an Exchange-style operator</div>

  <div class="mt-year">2020</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Crystal</strong>[^shanbhag-crystal] — analytical model explains why full GPU queries can beat the raw memory-bandwidth ratio</div>

  <div class="mt-year">2022</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>TQP</strong>[^he-tqp] — SQL is lowered into tensor programs, reusing ML accelerator runtimes instead of database-specific kernels</div>

  <div class="mt-year">2024</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Themis</strong>[^kim-themis] — GPU query execution attacks warp-level imbalance and inter-operator scheduling directly</div>

  <div class="mt-year">2024</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>GPU FastLanes</strong>[^afroozeh-gpu-fastlanes] — compressed execution becomes part of the GPU analytics path rather than only a storage concern</div>

  <div class="mt-year">2025</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Vortex</strong>[^yuan-vortex] — multi-GPU PCIe IO multiplexing turns neighboring GPUs into an IO fabric for one analytical GPU</div>

  <div class="mt-year">2025</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Maximus</strong>[^kabic-maximus] — modular heterogeneous execution makes operator-level CPU/GPU placement the integration boundary</div>

  <div class="mt-year">2025</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Theseus</strong>[^arambu-theseus] — distributed GPU data movement becomes the center of the systems problem</div>

  <div class="mt-year">2025</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>PystachIO</strong>[^pystachio-gpu-query] — PyTorch, fast networks, and fast storage are explored as a distributed GPU query-processing substrate</div>

  <div class="mt-year">2026</div>
  <div class="mt-connector"><div class="mt-dot mt-dot--last"></div></div>
  <div class="mt-content mt-content--last" markdown="span"><strong>SiriusDB</strong>[^yogatama-siriusdb] — Substrait + libcudf turns GPU SQL into a drop-in acceleration path for compatible CPU engines</div>

</div>

---

## Architecture Timeline

<div class="milestone-timeline">

  <div class="mt-year">1984</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Teradata ships</strong> — first commercial shared-nothing MPP RDBMS; row store, disk-bound</div>

  <div class="mt-year">1985</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>DSM (Copeland & Khoshafian, SIGMOD 1985)</strong> — Decomposition Storage Model; columnar storage formally proposed</div>

  <div class="mt-year">1986</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>The Case for Shared Nothing (Stonebraker, 1986)</strong> — shared-nothing architecture articulated as the scalable path</div>

  <div class="mt-year">1988</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Tandem NonStop SQL</strong> — commercial shared-nothing SQL with parallel execution on Tandem hardware</div>

  <div class="mt-year">1990</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Gamma Database Machine (DeWitt et al., IEEE TKDE 1990)</strong> — hash partitioning, parallel hash join, hybrid grace join on 32-node cluster</div>

  <div class="mt-year">1992</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Parallel Database Systems (DeWitt & Gray, CACM 1992)</strong> — taxonomy of shared-memory/disk/nothing; canonical MPP survey</div>

  <div class="mt-year">1994</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Volcano (Graefe, IEEE TKDE 1994)</strong> — iterator model with open/next/close; Exchange operator for parallelism; dominant execution model for 15 years</div>

  <div class="mt-year">1994</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Sybase IQ ships</strong> — first commercial column store; ignored by mainstream until data fits in memory</div>

  <div class="mt-year">2001</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>PAX layout (Ailamaki et al., VLDB 2001)</strong> — columns packed within disk pages; reveals 50–90% of cycles lost to cache misses in row stores</div>

  <div class="mt-year">2005</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>MonetDB/X100 (Boncz, Zukowski, Nes — CIDR 2005)</strong> — vectorized execution at ~1000 tuples/call; 1–2 OOM over Volcano on TPC-H 100 GB</div>

  <div class="mt-year">2005</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>C-Store (Stonebraker et al., VLDB 2005)</strong> — late materialization, overlapping projections, ROS+WOS; becomes Vertica</div>

  <div class="mt-year">2008</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>H-Store (Kallman et al., VLDB 2008)</strong> — partitioned main-memory execution; becomes VoltDB</div>

  <div class="mt-year">2011</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>HyPer + LLVM compilation (Neumann, VLDB 2011)</strong> — data-centric code generation fuses full pipelines into machine code rivaling hand-written C++; becomes Hyper (Tableau)</div>

  <div class="mt-year">2011</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>SAP HANA (Farber et al., 2011)</strong> — in-memory HTAP column store; eliminates separate OLAP data warehouse for many SAP workloads</div>

  <div class="mt-year">2013</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Hekaton (Diaconu et al., SIGMOD 2013)</strong> — memory-optimized tables and native procedure compilation integrated into SQL Server</div>

  <div class="mt-year">2013</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Radix hash joins (Balkesen et al., VLDB 2013)</strong> — two-pass radix partitioning for cache/TLB-conscious parallel joins on multi-core</div>

  <div class="mt-year">2014</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Morsel-Driven Parallelism (Leis et al., SIGMOD 2014)</strong> — fine-grained work-stealing + NUMA-aware scheduling replaces Volcano Exchange; &gt;30× speedup on 32 cores</div>

  <div class="mt-year">2015</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>SIMD vectorization for databases (Polychroniou et al., SIGMOD 2015)</strong> — SIMD-aware algorithms for aggregation, sort, partitioning; rewrites operators to eliminate control-flow divergence</div>

  <div class="mt-year">2016</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Snowflake (Dageville et al., VLDB 2016)</strong> — radical compute/storage separation; virtual warehouses on S3; pay-per-query elasticity</div>

  <div class="mt-year">2018</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Vectorized vs compiled (Kersten et al., PVLDB 2018)</strong> — experimental resolution: compilation wins for hot data; vectorization wins for cold data</div>

  <div class="mt-year">2019</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>HetExchange (Chrysogelos et al., PVLDB 2019)</strong> — CPU-GPU heterogeneous Exchange operator; extends morsel-driven to route morsels to GPU vs. CPU</div>

  <div class="mt-year">2019</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>DuckDB (Raasveldt & Mühleisen, SIGMOD 2019)</strong> — embeddable push-based vectorized OLAP engine; zero dependencies; "SQLite for analytics"</div>

  <div class="mt-year">2020</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Crystal (Shanbhag, Madden, Yu — SIGMOD 2020)</strong> — tile-based GPU execution model; 25× full-query speedup exceeding raw bandwidth ratio</div>

  <div class="mt-year">2022</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Velox (Pedreira et al., PVLDB 2022)</strong> — Meta's reusable C++ execution library; plugged into Presto, Spark, PyTorch, and 10+ other systems</div>

  <div class="mt-year">2022</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>TQP (He et al., PVLDB 2022)</strong> — SQL as tensor programs on PyTorch/ONNX; up to 10× lower execution time than specialized CPU/GPU baselines; seamless SQL+ML hybrid execution</div>

  <div class="mt-year">2022</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Photon (Behm et al., SIGMOD 2022)</strong> — native vectorized lakehouse engine for SQL and Spark over open columnar lake formats</div>

  <div class="mt-year">2023</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Composable Data Management Manifesto (Pedreira et al., PVLDB 2023)</strong> — advocates Arrow + Substrait + Velox/DataFusion as a modular, reusable database stack</div>

  <div class="mt-year">2024</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Apache Arrow DataFusion (Lamb et al., PVLDB 2024)</strong> — Arrow-native modular Rust query engine; fully replaceable components</div>

  <div class="mt-year">2025</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Vortex (Yuan et al., PVLDB 2025)</strong> — multi-GPU PCIe IO multiplexing to overcome GPU memory capacity limits; 5.7× over GPU baseline</div>

  <div class="mt-year">2025</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Maximus (Kabić et al., SIGMOD 2025)</strong> — operator-level CPU+GPU heterogeneity; Substrait-based third-party operator integration</div>

  <div class="mt-year">2025</div>
  <div class="mt-connector"><div class="mt-dot"></div><div class="mt-line"></div></div>
  <div class="mt-content" markdown="span"><strong>Theseus (Voltron Data, 2025)</strong> — production-oriented distributed GPU query engine; 4 async executors; 100 TB TPC-H on as few as 2 DGX nodes; up to 4× over Databricks Photon</div>

  <div class="mt-year">2026</div>
  <div class="mt-connector"><div class="mt-dot mt-dot--last"></div></div>
  <div class="mt-content mt-content--last" markdown="span"><strong>SiriusDB (Yogatama et al., CIDR 2026)</strong> — GPU-native drop-in SQL engine via Substrait; 7× over DuckDB CPU at same cost; argues all four GPU barriers are now removed</div>

</div>

---

## What Has Really Changed

Stepping back, every architectural transition in this history was triggered by the same pattern: hardware changed faster than the dominant software abstraction, and a new abstraction was needed to expose the new hardware's capabilities to the query engine.

| Bottleneck shift | Old abstraction became liability | New abstraction |
|---|---|---|
| Disk → cache | NSM row pages wasted I/O bandwidth | Columnar pages (PAX, DSM) |
| Sequential → SIMD | Volcano's virtual `next()` prevented vectorization | Vector-at-a-time primitives |
| Memory hierarchy → register reuse | Vector batches materialized between operators | Compiled pipelines (LLVM code gen) |
| Single-core → many-core | Exchange with fixed parallelism degree | Morsel-driven work-stealing |
| CPU → GPU | Homogeneous morsel scheduling, shared memory atomics | Heterogeneous Exchange, tile-based GPU execution |
| Monolith → cloud | Tightly coupled storage+compute | Disaggregated virtual warehouses |
| Siloed engines → composable | Each system reimplements everything | Arrow + Substrait + shared execution libraries |

The pattern suggests a prediction: the next transition will be driven by whatever hardware develops fastest — likely CXL/disaggregated memory, NVMe-over-fabric storage, processing-in-memory (PIM), or AI-accelerated query optimization.
Early CXL hash-join work[^huang-cxl-joins] already shows the familiar pattern: the right design is not simply "move data to the faster tier," but a new operator strategy that balances bandwidth against data movement.
Each transition requires new abstractions at precisely the layer where the current ones assume the old hardware model.

---

## References

[^stonebraker-shared-nothing]: M. Stonebraker. "The Case for Shared Nothing." *IEEE Database Engineering Bulletin*, 9(1), 1986.

[^dewitt-direct]: D. DeWitt. "DIRECT: A Multiprocessor Organization for Supporting Relational Database Management Systems." 1979.

[^dewitt-gamma]: D. DeWitt, S. Ghandeharizadeh, D. Schneider, A. Bricker, H. Hsiao, R. Rasmussen. "The Gamma Database Machine Project." *IEEE TKDE*, 2(1), 1990.

[^dewitt-parallel-db]: D. DeWitt and J. Gray. "Parallel Database Systems: The Future of High Performance Database Processing." *CACM*, 35(6), 1992.

[^tandem-nonstop]: Tandem Computers. "NonStop SQL: A Distributed, High-Performance, High-Availability Implementation of SQL." *HPTS*, 1988.

[^schneider-parallel-joins]: D. Schneider and D. DeWitt. "A Performance Evaluation of Four Parallel Join Algorithms in a Shared-Nothing Multiprocessor Environment." *SIGMOD*, 1989.

[^copeland-dsm]: G. Copeland and S. Khoshafian. "A Decomposition Storage Model." *SIGMOD*, 1985.

[^graefe-volcano-exchange]: G. Graefe. "Encapsulation of Parallelism in the Volcano Query Processing System." *SIGMOD*, 1990.

[^graefe-query-evaluation]: G. Graefe. "Query Evaluation Techniques for Large Databases." *ACM Computing Surveys*, 25(2), 1993.

[^graefe-volcano]: G. Graefe. "Volcano — An Extensible and Parallel Query Evaluation System." *IEEE TKDE*, 6(1), 1994.

[^graefe-cascades]: G. Graefe. "The Cascades Framework for Query Optimization." *IEEE Data Engineering Bulletin*, 18(3), 1995.

[^ailamaki-pax]: A. Ailamaki, D. DeWitt, M. Hill, M. Skounakis. "Weaving Relations for Cache Performance." *VLDB*, 2001.

[^boncz-monetdb]: P. Boncz, M. Zukowski, N. Nes. "MonetDB/X100: Hyper-Pipelining Query Execution." *CIDR*, 2005.

[^zukowski-bandwidth-storage]: M. Żukowski. "Balancing Vectorized Query Execution with Bandwidth-Optimized Storage." PhD thesis, University of Amsterdam, 2009.

[^stonebraker-cstore]: M. Stonebraker, D. Abadi, A. Batkin et al. "C-Store: A Column-Oriented DBMS." *VLDB*, 2005.

[^abadi-columnstores-rowstores]: D. Abadi, S. Madden, N. Hachem. "Column-Stores vs. Row-Stores: How Different Are They Really?" *SIGMOD*, 2008.

[^stonebraker-end-era]: M. Stonebraker, S. Madden, D. Abadi, S. Harizopoulos, N. Hachem, P. Helland. "The End of an Architectural Era (It's Time for a Complete Rewrite)." *VLDB*, 2007.

[^kallman-hstore]: R. Kallman, H. Kimura, J. Natkins et al. "H-Store: A High-Performance, Distributed Main Memory Transaction Processing System." *VLDB*, 2008.

[^diaconu-hekaton]: C. Diaconu, C. Freedman, E. Ismert, P.-Å. Larson, P. Mittal, R. Stonecipher, N. Verma, M. Zwilling. "Hekaton: SQL Server's Memory-Optimized OLTP Engine." *SIGMOD*, 2013.

[^stonebraker-voltdb]: M. Stonebraker, A. Weisberg. "The VoltDB Main Memory DBMS." *IEEE Data Engineering Bulletin*, 2013.

[^farber-hana]: F. Färber, S. Lee, W. Unterbrunner et al. "SAP HANA Database: Data Management for Modern Business Applications." *SIGMOD Record*, 2012.

[^kemper-hyper]: A. Kemper and T. Neumann. "HyPer: A Hybrid OLTP&OLAP Main Memory Database System Based on Virtual Memory Snapshots." *VLDB*, 2011.

[^neumann-compilation]: T. Neumann. "Efficiently Compiling Efficient Query Plans for Modern Hardware." *VLDB*, 2011.

[^kersten-vectorized-compiled]: T. Kersten, V. Leis, A. Kemper, T. Neumann, A. Pavlo, P. Boncz. "Everything You Always Wanted to Know About Compiled and Vectorized Queries But Were Afraid to Ask." *PVLDB*, 11(13), 2018.

[^leis-morsel]: V. Leis, P. Boncz, A. Kemper, T. Neumann. "Morsel-Driven Parallelism: A NUMA-Aware Query Evaluation Framework for the Many-Core Age." *SIGMOD*, 2014.

[^avnur-eddies]: R. Avnur and J. M. Hellerstein. "Eddies: Continuously Adaptive Query Processing." *SIGMOD*, 2000.

[^blanas-main-memory-joins]: S. Blanas, Y. Li, J. M. Patel. "Design and Evaluation of Main Memory Hash Join Algorithms for Multi-core CPUs." *SIGMOD*, 2011.

[^balkesen-radix-join]: C. Balkesen, J. Teubner, G. Alonso, M. Özsu. "Multi-Core, Main-Memory Joins: Sort vs. Hash Revisited." *PVLDB*, 7(1), 2013.

[^polychroniou-simd]: O. Polychroniou, A. Raghavan, K. Ross. "Rethinking SIMD Vectorization for In-Memory Databases." *SIGMOD*, 2015.

[^neumann-push-pull]: T. Neumann. "Push vs. Pull-Based Loop Fusion in Query Engines." *BTW*, 2016.

[^dageville-snowflake]: B. Dageville, T. Cruanes, M. Zukowski et al. "The Snowflake Elastic Data Warehouse." *VLDB*, 2016.

[^vuppalapati-snowflake-elastic]: M. Vuppalapati, J. Miron, R. Agarwal, D. Truong, A. Motivala, T. Cruanes. "Building An Elastic Query Engine on Disaggregated Storage." *VLDB*, 2020.

[^soliman-orca]: M. Soliman, L. Antova, V. Raghavan et al. "Orca: A Modular Query Optimizer Architecture for Big Data." *SIGMOD*, 2014.

[^begoli-calcite]: E. Begoli, J. Camacho-Rodríguez, J. Hyde, M. J. Mior, D. Lemire. "Apache Calcite: A Foundational Framework for Optimized Query Processing Over Heterogeneous Data Sources." *SIGMOD*, 2018.

[^raasveldt-duckdb]: M. Raasveldt and H. Mühleisen. "DuckDB: An Embeddable Analytical Database." *SIGMOD*, 2019.

[^pedreira-velox]: P. Pedreira, O. Erling, M. Basmanova et al. "Velox: Meta's Unified Execution Engine." *PVLDB*, 15(12), 2022.

[^lamb-datafusion]: A. Lamb, J. Hyde, A. Gruenheid et al. "Apache Arrow DataFusion: A Fast, Embeddable, Modular Analytic Query Engine." *PVLDB*, 2024.

[^behm-photon]: A. Behm, S. Palkar, U. Agarwal et al. "Photon: A Fast Query Engine for Lakehouse Systems." *SIGMOD*, 2022.

[^pedreira-composable]: P. Pedreira, O. Erling, K. Karanasos, S. Schneider, W. McKinney, S. Valluri, M. Zait, J. Nadeau. "The Composable Data Management System Manifesto." *PVLDB*, 16(10), 2023.

[^singlestore-cloud-native]: A. Prout, S.-P. Wang, J. Victor, Z. Sun, Y. Li, J. Chen, E. Bergeron, E. Hanson, R. Walzer, R. Gomes, N. Shamgunov. "Cloud-Native Transactions and Analytics in SingleStore." *SIGMOD*, 2022.

[^govindaraju-gpu-db]: N. Govindaraju, B. Lloyd, W. Wang et al. "Fast Computation of Database Operations using Graphics Processors." *SIGMOD*, 2004.

[^he-gpu-joins]: B. He, M. Lu, K. Yang et al. "Relational Joins on Graphics Processors." *SIGMOD*, 2008.

[^he-query-coprocessing]: B. He, M. Lu, K. Yang, R. Fang, N. K. Govindaraju, Q. Luo, P. V. Sander. "Relational Query Coprocessing on Graphics Processors." *ACM TODS*, 34(4), 2009.

[^yogatama-siriusdb]: B. Yogatama, Y. Yang, K. Kristensen, D. Sarda, A. Kim, A. Cockcroft, Y. Teng, J. Patterson, G. Kimball, W. McKinney, W. Gong, X. Yu. "Rethinking Analytical Processing in the GPU Era (SiriusDB)." *CIDR*, 2026.

[^chrysogelos-hetexchange]: P. Chrysogelos, M. Karpathiotakis, R. Appuswamy, A. Ailamaki. "HetExchange: Encapsulating Heterogeneous CPU-GPU Parallelism in JIT Compiled Engines." *PVLDB*, 12(5), 2019.

[^shanbhag-crystal]: A. Shanbhag, S. Madden, X. Yu. "A Study of the Fundamental Performance Characteristics of GPUs and CPUs for Database Analytics." *SIGMOD*, 2020.

[^he-tqp]: D. He, S. Nakandala, D. Banda, R. Sen, K. Saur, K. Park, C. Curino, J. Camacho-Rodríguez, K. Karanasos, M. Interlandi. "Query Processing on Tensor Computation Runtimes." *PVLDB*, 15(11), 2022.

[^kim-themis]: K. Hong, K. Kim, Y.-K. Lee, Y.-S. Moon, S. S. Bhowmick, W.-S. Han. "Themis: A GPU-Accelerated Relational Query Execution Engine." 2024.

[^yuan-vortex]: Y. Yuan, A. Iyer, L. Ma, N. Talati. "Vortex: Overcoming Memory Capacity Limitations in GPU-Accelerated Large-Scale Data Analytics." *PVLDB*, 18(4), 2025.

[^kabic-maximus]: M. Kabić, S. Chandran, G. Alonso. "Maximus: A Modular Accelerated Query Engine for Data Analytics on Heterogeneous Systems." *SIGMOD* (PACMMOD 3:3), 2025.

[^arambu-theseus]: F. Aramburú, W. Malpica, K. Abrougui et al. "Theseus: A Distributed and Scalable GPU-Accelerated Query Processing Platform Optimized for Efficient Data Movement." *arXiv:2508.05029*, 2025.

[^pystachio-gpu-query]: J. Luo, N. Boeschen, M. El-Hindi, C. Binnig. "PystachIO: Efficient Distributed GPU Query Processing with PyTorch over Fast Networks & Fast Storage." *arXiv:2512.02862*, 2025.

[^lutz-distributed-gpu]: C. Lutz, S. Breß, S. Zeuch, T. Rabl, V. Markl. "Distributed GPU Joins on Fast RDMA-capable Networks." *SIGMOD*, 2023.

[^afroozeh-fastlanes]: L. Afroozeh and P. Boncz. "The FastLanes Compression Layout." *PVLDB*, 16(9), 2023.

[^afroozeh-gpu-fastlanes]: L. Afroozeh, P. Boncz et al. "Accelerating GPU Data Processing using FastLanes Compression." *DaMoN*, 2024.

[^neumann-umbra]: T. Neumann and V. Leis. "Tidy Tuples and Flying Start: Fast Compilation and Fast Execution of Relational Queries in Umbra." *PVLDB*, 14(4), 2021.

[^huang-cxl-joins]: W. Huang and M. Lu. "Hash Joins Meet CXL: A Fresh Look." 2026.
