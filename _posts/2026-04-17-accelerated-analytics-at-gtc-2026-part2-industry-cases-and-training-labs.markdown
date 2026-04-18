---
layout: post
title: "NVIDIA GTC 2026 Accelerated Analytics - Part 2: Industry Use Cases and Training Labs"
date: 2026-04-17 00:00:00 -0700
categories: nvidia gtc analytics gpu
tags: [gtc2026, analytics, rapids, cudf, cuml, spark-rapids, gpu-databases, triton, postgres, dli]
toc: true
---

*This is Part 2 of my series on Accelerated Analytics at GTC 2026, focusing on 3 industry talks and 2 DLI training workshops. Read [Part 1: Technical Deep Dives](/nvidia/gtc/analytics/gpu/2026/04/09/accelerated-analytics-at-gtc-2026-part1-technical-deep-dives.html).*

This post tackles the following sessions:

1. <strong>Quais Taraki</strong> (CTO, EDB) shows how [standard Postgres breaks under agentic query loads](#edb) and walks through PGAA — a GPU-accelerated HTAP solution that swaps the Postgres compute back-end for Iceberg + Spark RAPIDS, achieving 100× TPC-DS speedup and enabling a complete LangFlow-based agentic stack on top.

2. <strong>Liang Chen</strong> and <strong>Prudhvi Vatala</strong> from Snap detail [how Spark RAPIDS cut A/B pipeline costs by 90%](#snap) — not through any Spark tuning magic, but by rerouting 11,000 idle inference L4s into a three-tier fallback Spark fleet at near-zero incremental cost.

3. <strong>Harishankar G</strong> and <strong>Jalakandeshwaran A</strong> from Zoho give a [deep dive into Velociraptor](#zoho), their in-house GPU OLAP engine built as a Postgres extension, which runs all 22 TPC-H queries at 1 TB on a single H200 in under two minutes — then explain why PCIe is still the bottleneck even after every I/O optimization.

4. <strong>Hirakendu Das</strong>, <strong>Navin Kumar</strong>, and <strong>Rishi Chandra</strong> lead a [hands-on Spark RAPIDS workshop](#dlit81642) covering the cuDF plugin, Project Aether's automated qualify → tune → validate loop, and Ether Assistant's LLM-based UDF rewriter.

5. <strong>Allison Ding</strong> walks through a [full GPU data science pipeline](#dlit81754) — from zero-copy feature engineering with cuDF and GPU Polars, through cuML model training (k-means 40×, XGBoost 7×), to Triton Inference Server deployment with dynamic batching.

### Industry Use Cases

#### [🔗 [EDB] Supercharging Postgres for Agentic Analytics with Rapids Accelerator and Apache Iceberg](https://www.nvidia.com/en-us/on-demand/session/gtc26-ex82253/) {#edb}

<small><strong>Quais Taraki</strong> · CTO, EDB</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>As data volumes increase, the primary bottleneck for high-performance AI agents will shift from the model to the data. This increases the importance of the underlying data engine’s ability to process massive enterprise datasets in real time. This scaling problem is further amplified by the desire to make the latest transactional business data seamlessly available to agentic processing. Join the experts from EDB for a technical deep dive into how to overcome these scaling and transactional integration hurdles using the world's most popular open-source database. We will showcase the architecture behind GPU acceleration in EDB Postgres AI, specifically how offloading complex analytical workloads to an NVIDIA RAPIDS Accelerator for Apache Spark eliminates traditional CPU bottlenecks. Through a review of TPC-DS benchmarks, we will demonstrate how to transform Postgres into a high-throughput engine capable of powering autonomous agentic analytics for real-time business decision-making. We will also showcase how EDB Postgres makes all transactional data available to GPU processing in real time through Apache Iceberg. This establishes a GPU-accelerated Hybrid Analytics and Transactional Processing (HTAP) stack, which at the same time avoids vendor lock-in by being fully compatible with the modern open analytics ecosystems.
</p></details>

EDB (EnterpriseDB) develops solutions on top of PostgreSQL, such as the proprietary extension PostgreSQL Analytics Accelerator (PGAA) discussed in this talk. EDB recognizes the problem that Analytics Agents are now bottlenecked by CPU-based data systems for their OLAP needs. In this talk, Quais discusses PGAA, their hybrid OLTP/OLAP solution that relies on Spark Rapids GPU acceleration for large-scale analytics and making it available to Agents via technologies like langflow and kserve. More on PGAA in their [blog post](https://www.enterprisedb.com/blog/achieving-predictable-performance-scale-agentic-analytics).

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. Agent queries time out on standard Postgres — the database becomes the bottleneck</strong></td>
  <td class="tk-time">@ 03:54</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="pain"></takeaway-tag>
    <span class="tk-body">
      Agents generate far more complex and random query patterns than human-written queries. "We see customers hitting timeouts with large data sets, thereby starving the agent." Constraining the agents or doing an application rewrite are the typical mitigations — both undesirable. The fix must come from the database layer.
    </span>
    <img src="/assets/img/gtc-2026/sessions/edb-pgaa-tpcds-benchmark.png" alt="EDB PGAA TPC-DS benchmark: Postgres times out vs Spark RAPIDS on L40S">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. PGAA swaps the Postgres compute back-end: Iceberg + DataFusion + Spark Connect on RAPIDS</strong></td>
  <td class="tk-time">@ 05:11</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="storage"></takeaway-tag>
    <span class="tk-body">
      EDB's Postgres Analytics Accelerator (PGAA) replaces the Postgres compute back-end with three components: (1) replicate data to object storage in Apache Iceberg format; (2) DataFusion — "a columnar vectorized open source query engine" — as a plug-and-play compute layer; (3) Spark Connect to offload massive distributed joins to a Spark cluster, further accelerated via Spark RAPIDS on GPU. The Postgres front-end and SQL interface remain unchanged.
    </span>
    <img src="/assets/img/gtc-2026/sessions/edb-pgaa-architecture.png" alt="EDB PGAA architecture: Iceberg + DataFusion + Spark Connect on RAPIDS">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. TPC-DS: Postgres times out at 10 TB; Spark RAPIDS on L40S is 100× faster; Blackwell adds 14× more</strong></td>
  <td class="tk-time">@ 05:57</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      Three-tier TPC-DS comparison across data sizes: standard Postgres (orange) grows unbounded and times out at 10 TB; vanilla Spark+PGAA (blue) is a substantial improvement; Spark RAPIDS on L40S (green) lands "on the order of 100x over standard Postgres." Re-ran on RTX 6000 Pro (Blackwell): "a further 14x speedup" on top of that.
    </span>
    <img src="/assets/img/gtc-2026/sessions/edb-pgaa-tpcds-comparison.png" alt="EDB PGAA TPC-DS three-tier comparison: Postgres vs Spark vs Spark RAPIDS on L40S">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. Full agentic stack: AIDB vectorization + MCP endpoints + NVIDIA NIMs + LangFlow on top of PGAA</strong></td>
  <td class="tk-time">@ 08:02</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      Above the analytics layer: the AIDB extension generates embedding vectors from Postgres data for semantic search; MCP endpoints expose all data stores to LLM agents; containerized NVIDIA NIMs run local model inference via KServe; LangFlow provides a low/no-code agent authoring environment. The entire stack runs on NVIDIA GPUs. Speaker's admission: "there are a lot of moving parts… a lot of security to consider" — EDB packages all of it so customers don't have to.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. EDB ships the full stack as a sovereign, batteries-included Postgres platform</strong></td>
  <td class="tk-time">@ 09:41</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="oss"></takeaway-tag>
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      Stack choices are opinionated: <strong>Lakekeeper</strong> as the Iceberg catalog ("a much more modern version than, say, something like Hive Metastore"), <strong>LangFlow</strong> for agent authoring, NVIDIA NIMs on <strong>KServe</strong> for inference. The platform is "complete, batteries included, modular, composable, sovereign, open source" — deployable on IBM mainframes, on-premise, all hyperscalers, or custom Supermicro+NVIDIA hardware.
    </span>
    <img src="/assets/img/gtc-2026/sessions/edb-pgaa-agentic-stack.png" alt="EDB PGAA full agentic stack: AIDB + MCP + NVIDIA NIMs + LangFlow">
  </td>
</tr>

</table>


#### [🔗 [Snap] How Snap Saves Millions with Accelerated Apache Spark](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81678/) {#snap}

<small><strong>Liang Chen</strong> · Staff Software Engineer, Snap, Inc.<br><strong>Prudhvi Vatala</strong> · Sr. Engineering Manager, Snap, Inc.</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>Snap's A/B experimentation platform processes 10 petabytes per day across ~45,000 machines with a strict 11 AM SLA and zero tolerance for failure. This talk is an eight-month engineering journey: from discovering the RAPIDS Spark accelerator, through benchmarks, infrastructure blockers, and a novel GPU reuse strategy, to a fully productionized petabyte-scale GPU Spark platform that cut costs by 90%.</p></details>

This session takes us through Snap's experience adopting Spark on RAPIDS for its A/B pipelines. All these experiments were done on GCP instances featuring L4 and T4 GPUs like the g2-standard-48, with an on-demand price of $1.76. Interestingly, using Spark on RAPIDS was mostly a smooth experience with little engineering effort; the main bottleneck was rather the scarcity of GPUs available for these data processing jobs, at a time when almost everything is going toward AI inference and training. The team's main engineering effort was thus moving their system over to the AI K8s GKE cluster to take advantage of the idle GPUs often seen late at night. Nevertheless, the team highlights their collaborative effort with Google and NVIDIA in getting this to work. Look at this companion [article](https://eng.snap.com/snap-nvidia-gcp) from Snap Engineering for a good read.

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. Non I/O-bound jobs saw significant speedups with Spark Rapids, particularly in join and repartition stages</strong></td>
  <td class="tk-time">@ 04:21</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      For the merge sort join operator on 3 TB of input, total Spark execution time dropped 20×, leading to a wall-time speedup of 2.5×. For the union operator on 9 TB of input, total Spark execution time dropped ~4×, for a wall-time speedup of 1.8×. Aggregation's wall-time speedup was 1.6×. The authors note that in the first two cases, the speedup was due to no longer seeing terabytes of data spilling onto disk when using RAPIDS. 
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s81678-snap-operator-speedup-1.png" alt="Snap Rapids Spark operator speedup benchmark - slide 1">
      <img src="/assets/img/gtc-2026/sessions/s81678-snap-operator-speedup-2.png" alt="Snap Rapids Spark operator speedup benchmark - slide 2">
      <img src="/assets/img/gtc-2026/sessions/s81678-snap-operator-speedup-3.png" alt="Snap Rapids Spark operator speedup benchmark - slide 3">
      <img src="/assets/img/gtc-2026/sessions/s81678-snap-operator-speedup-4.png" alt="Snap Rapids Spark operator speedup benchmark - slide 4">
    </div>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. At Peak, the actual bottleneck is GPU Availability!</strong></td>
  <td class="tk-time">@ 08:54</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="pain"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      A/B cluster uses 60k machines to finish within its time window. GPUs would reduce peak machine count by two-thirds — from 62,000 to ~20,000 GPUs simultaneously, still a huge amount! On-demand GPU procurement at that scale was not feasible. The breakthrough was finding idle capacity already inside Snap: the ML inference fleet for ad ranking and content recommendations drops to low utilization between 2–5 AM Pacific as users sleep, leaving thousands of GPUs sitting idle every night.
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s81678-snap-gpu-availability-1.png" alt="Snap GPU availability bottleneck - slide 1">
      <img src="/assets/img/gtc-2026/sessions/s81678-snap-gpu-availability-2.png" alt="Snap GPU availability bottleneck - slide 2">
    </div>
  </td>
</tr>



<tr>
  <td class="tk-head"><strong>3. Reusing the inference fleet's idle window — the unlock for scale</strong></td>
  <td class="tk-time">@ 11:12</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      Snap built a Spark-on-GKE platform that runs batch jobs on the same infrastructure as the serving stack. Jobs use GPUs only when available and fall back to CPU GKE, then Dataproc — "GPU acceleration is just opportunistic, never mandatory." Pipelines were shifted into the 1–5 AM idle window by moving from client timestamps to server timestamps and rescheduling upstream Airflow dependencies to start at 2–3 AM.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. Three-tier fallback: GPU GKE → CPU GKE → Dataproc; no job ever fails to complete</strong></td>
  <td class="tk-time">@ 15:46</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      At submission: no GPU quota → fall back to CPU Kubernetes. At runtime: GPU preempted by serving traffic → retry on GPU GKE, then CPU GKE, then Dataproc. "Every single job has a path to completion." Production shows 99% hourly job success rate and 96% daily — "and these numbers aren't even cherry picked. These numbers include all the infra failures even beyond GPUs."
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. 90% net cost reduction; 11,000 L4s, 81% less memory, zero new spend</strong></td>
  <td class="tk-time">@ 22:15</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Because Snap reuses idle capacity, "there is no net new compute cost added." Net experimentation platform footprint dropped 90%. Apples-to-apples (counting GPU cost as incremental): 76% savings. The switch to g2-standard-48 instances leads to a dramatic drop in resource usage and costs: the pipeline now runs on ~11,000 L4s during the six-hour overnight window, "number of cores went down 62.5%," "memory went from about three petabytes to half a petabyte, 81% reduction." 
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s81678-snap-spark-on-gke.png" alt="Snap Spark-on-GKE cost reduction: 90% net savings, 11,000 L4s, 81% memory reduction">
      <img src="/assets/img/gtc-2026/sessions/s81678-snap-cost-breakdown.png" alt="Snap cost breakdown: cores -62.5%, memory 3PB → 0.5PB">
    </div>
  </td>
</tr>

</table>

#### [🔗 [Zoho] Build a GPU-Accelerated Database Engine With CUDA](https://www.nvidia.com/en-us/on-demand/session/gtc26-s82203/) {#zoho}
<small><strong>Harishankar G</strong> · Leadership Staff, Zoho Corp.</small> <br>
<small><strong>Jalakandeshwaran A</strong> · Leadership Staff, Zoho Corp.</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>Join us for a deep dive into how data-intensive workloads can be accelerated using GPUs. This session explores the inner workings of a GPU-accelerated query pipeline that offers excellent performance by leveraging custom kernels and NVIDIA libraries like Thurst and nvCOMP. Learn how data transfer becomes the primary bottleneck, and how faster interconnects like NVLink and GPU-accelerated decompression help mitigate the issue.</p></details>

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. Velociraptor processes all 22 TPC-H queries at SF1k (1TB) in under 2 minutes on a single H200 GPU</strong></td>
  <td class="tk-time">@ 03:37</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Zoho's in-house GPU-accelerated OLAP engine, shipped as a Postgres extension, runs the full TPC-H benchmark at scale factor 1000 on a single GPU with 90 GB of memory. "The longest query executes in under eight seconds. The shortest one runs in under a second. And the median query execution time is five seconds." It currently powers Zoho Analytics' largest customers.
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s82203-zoho-t1-1.png" alt="Zoho Velociraptor TPC-H Benchmark showing total execution time at SF1000">
      <img src="/assets/img/gtc-2026/sessions/s82203-zoho-t1-2.png" alt="Zoho Velociraptor TPC-H Benchmark showing median query execution time at SF1000">
    </div>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. Plan conversion layer decouples GPU-optimal rewrites from the Postgres front-end and keeps the original plan for OOM fallback</strong></td>
  <td class="tk-time">@ 04:48</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      Postgres selects hash vs. sort group-by based on work_mem and expected cardinality — optimal for CPU, not for GPU. A plan conversion step lets Velociraptor substitute GPU-optimal choices while keeping the original Postgres plan intact for OOM fallback: "allows us to keep the original plan untouched in case we need to fall back due to situations like out of memory." It also let the team switch from Apache Calcite to Postgres as the front-end with minimal changes to code generation and execution layers.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Four-layer I/O stack: columnar storage + block filtering + compression + late materialization — all to minimize bytes sent to the GPU</strong></td>
  <td class="tk-time">@ 06:27</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      Techniques compound: (1) column-store layout skips unneeded columns; (2) per-block min/max metadata prunes blocks that can't pass a filter without reading them; (3) columnar layout boosts compression ratios since same-type data compresses better; (4) late materialization fetches only columns needed for the current operator. The result: sometimes only a very small amount of data per batch actually crosses the PCIe bus.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. GPU decompression blows past the PCIe limit for high-compression data; LZ4 for strings is the weak link</strong></td>
  <td class="tk-time">@ 10:23</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      A three-stage pipeline — disk read → PCIe transfer → GPU decompress — runs concurrently using nvCOMP. On PCIe Gen 4 x8 (13 GB/s cap), GPU-accelerated decompression of cascaded RLE/delta columns exceeds the interconnect ceiling for highly compressed data. On H200 (PCIe Gen 5, 58 Gbps; 8.5× the memory bandwidth of the previous system), numbers are similarly strong. Weak link: LZ4 used for strings and doubles has lower throughput at low compression ratios — Blackwell's on-chip LZ4 decompressor is on the team's roadmap.
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s82203-zoho-t4-1.png" alt="Zoho GPU decompression throughput vs PCIe limit - slide 1">
      <img src="/assets/img/gtc-2026/sessions/s82203-zoho-t4-2.png" alt="Zoho GPU decompression throughput vs PCIe limit - slide 2">
      <img src="/assets/img/gtc-2026/sessions/s82203-zoho-t4-3.png" alt="Zoho GPU decompression throughput vs PCIe limit - slide 3">
      <img src="/assets/img/gtc-2026/sessions/s82203-zoho-t4-4.png" alt="Zoho GPU decompression throughput vs PCIe limit - slide 4">
    </div>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. Even after all optimizations, GPU execution is only 25% of end-to-end query time — PCIe is still the bottleneck</strong></td>
  <td class="tk-time">@ 12:15</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="pain"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      "Despite all of these optimizations… the actual time spent on executing the query on the GPU in a benchmark like TPC-H is only 25% of the end-to-end time. So we are still bottlenecked by the interconnect and decompression." The team is explicitly waiting for NVLink as a CPU-to-GPU interconnect on x86 — NVLink already reaches 900 GB/s for hosted devices vs. PCIe Gen 6 at 128 GB/s. They welcomed the Intel/NVIDIA NVLink fusion partnership as a step in that direction.
    </span>
    <img src="/assets/img/gtc-2026/sessions/s82203-zoho-t5-1.png" alt="Zoho query time breakdown: GPU execution is only 25% of end-to-end time, PCIe is the bottleneck">
  </td>
</tr>

</table>


### DLI Training Labs

#### [🔗 Accelerate Apache Spark With GPU and AI: A Hands-On Workshop](https://www.nvidia.com/en-us/on-demand/session/gtc26-dlit81642/) {#dlit81642}

<small><strong>Hirakendu Das</strong> · Principal Software Engineer, NVIDIA<br><strong>Navin Kumar</strong> · Sr. System Software Engineer, NVIDIA<br><strong>Rishi Chandra</strong> · Systems Software Engineer, NVIDIA</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>A hands-on DLI workshop covering three layers of GPU-accelerated Spark: the RAPIDS cuDF plugin (zero-code-change columnar acceleration), Project Aether (automated qualification, testing, and migration toolchain), and Ether Assistant (LLM-based UDF rewriter). Uses the NVIDIA Decision Support (NDS) TPC-DS-derived benchmark throughout.</p></details>

Apache Spark usage is predominant in enterprise. Four different use cases are highlighted at the beginning of the training session to remind us how central the system is and how enabling RAPIDS on Spark has wide impact across enterprise operations:
1. RAW ETL into the data lake
2. Analytics on this ingested data
3. Loading data from the lake into traditional data warehouses
4. Pre-processing this data for machine learning training and other data science use cases.

<img src="/assets/img/gtc-2026/sessions/dlit81642-apache-spark-accelerate-workshop-hero.png" alt="Accelerate Apache Spark with GPU and AI workshop overview slide">

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. cuDF is the CUDA library at the center of RAPIDS Spark</strong></td>
  <td class="tk-time">@ 07:41</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      cuDF implements relational algebra on the GPU. Each node will convert the Spark physical plan into a plan that can be run over CuDF. Data is stored in columnar format and remains so until an unsupported operator forces a CPU fallback. The cost is the conversion round-trip not the operation itself. The RAPIDS qualification tools help determine if the overall query will overcome these challenges or not.
    </span>
    <div class="post-images">
      <img src="/assets/img/gtc-2026/sessions/dlit81642-cudf-rapids-spark-architecture.png" alt="cuDF at the center of RAPIDS Spark: columnar data flow through physical operators">
    </div>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. Spark on GPU wins on compute intensive tasks like joins, aggregates, sorts over high-cardinality data — not I/O-bound ops</strong></td>
  <td class="tk-time">@ 12:18</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <span class="tk-body">
      "If you have systems with very large amounts of high cardinality data.. and joins and aggregates and sorting, those tend to be the most ideal workloads for GPU." I/O-bound jobs, where most time is spent reading from or writing to a data store, see little benefit. Small datasets also underperform due to the overhead of staging data into GPU memory. Know which regime your job is in before expecting a speedup.
    </span>
    <div class="post-images">
      <img src="/assets/img/gtc-2026/sessions/dlit81642-gpu-wins-high-cardinality.png" alt="GPU wins on high-cardinality joins, aggregates, and sorts — not I/O-bound ops">
    </div>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Project Aether automates the full qualify → submit → profile → tune → validate loop</strong></td>
  <td class="tk-time">@ 13:56</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      The old manual migration process — qualification, staging, POC, config iteration, production argument — requires enough engineering resources that "this process generally stops somewhere before getting the workloads migrated." Aether wraps all four steps (`qualify`, `submit`, `profile`, `report`) into a single <strong>aether run</strong> command. Results and configs are stored in a <strong>SQLite</strong> history database. Supports on-prem, Amazon EMR, and Google Dataproc.
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/dlit81642-aether-qualify-pipeline.png" alt="Project Aether qualify pipeline: automated qualification and staging">
      <img src="/assets/img/gtc-2026/sessions/dlit81642-aether-run-command.png" alt="Project Aether single aether run command wrapping all four steps">
    </div>
  </td>
</tr>


<tr>
  <td class="tk-head"><strong>4. Aether TuneML: XGBoost model predicts optimal Spark config changes with 90% AUC ranking accuracy</strong></td>
  <td class="tk-time">@ 43:10</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="algo"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Replacing rule-based formulas (QualX tunable with `aether profile`) with an XGBoost model trained on 100 NDS queries (90 train / 10 holdout), TuneML uses profiling metrics (input bytes, shuffle read/write bytes, spill rates) to predict speedup for candidate config changes. Ranking AUC ~90%: "90% of the time, the configs should lead to some speedup." Roadmap: replace XGBoost with a fine-tunable DNN and add reinforcement learning for efficient config space exploration.
    </span>
  </td>
</tr>


<tr>
  <td class="tk-head"><strong>5. The two critical GPU Spark configs are `sql.files.maxPartitionBytes` and `sql.shuffle.partitions`</strong></td>
  <td class="tk-time">@ 53:09</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      `maxPartitionBytes` controls data per read partition; `shuffle.partitions` controls the number of shuffle tasks for joins and group-bys. "In order to take advantage of the massive parallelism, you want to have bigger and bigger batch sizes or tasks" — but too large and the job spills. Memory spill metrics in event logs are the leading indicator that shuffle tasks are oversized. These two configs drive 80% of the tuning value.
    </span>
    <div class="post-images">
      <img src="/assets/img/gtc-2026/sessions/dlit81642-spark-gpu-configs-partition-tuning.png" alt="Critical GPU Spark configs: maxPartitionBytes and shuffle.Partitions tuning guide">
    </div>
  </td>
</tr>


<tr>
  <td class="tk-head"><strong>6. UDFs force a full GPU→CPU PCIe round trip — columnar→row conversion included</strong></td>
  <td class="tk-time">@ 01:03:25</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="pain"></takeaway-tag>
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      "You have to ship all the data back over PCIe to the CPU. You have to convert from those columnar batches back to row-by-row formats. You have to run the UDF, and then you have to reverse that process." The RAPIDS Accelerator cannot optimize inside a UDF — it's opaque to the query planner. Any UDF in a GPU Spark job is a performance cliff, especially for compute-heavy functions where the GPU speedup would have been highest.
    </span>
    <div class="post-images">
      <img src="/assets/img/gtc-2026/sessions/dlit81642-udf-gpu-cpu-pcie-roundtrip.png" alt="UDFs force full GPU→CPU PCIe round trip including columnar-to-row conversion">
    </div>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>7. Ether Assistant: LLM rewrites CPU UDFs to GPU columnar — test generation → conversion → benchmark</strong></td>
  <td class="tk-time">@ 01:05:18</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      Three-phase LLM pipeline: (1) generate unit tests for the existing CPU UDF, (2) rewrite the UDF to SQL or cuDF columnar using those tests for verification, (3) generate a synthetic dataset and benchmark both versions for speedup. Each phase is an iterative feedback loop before proceeding. The target is the RAPIDS UDF interface — a `evaluateColumnar()` override that hands the UDF GPU columnar batches directly, eliminating the PCIe round trip entirely.
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/dlit81642-ether-assistant-udf-rewrite-as-sql.png" alt="Ether Assistant benchmark rewrite as Sql">
      <img src="/assets/img/gtc-2026/sessions/dlit81642-ether-assistant-udf-rewrite-as-cudf-code.png" alt="Ether Assistant LLM pipeline: UDF rewrite to cuDF columnar">
    </div>
  </td>
</tr>

</table>


#### [🔗 From Ingestion to Inference: Mastering the High-Performance GPU Data Science Pipeline](https://www.nvidia.com/en-us/on-demand/session/gtc26-dlit81754/) {#dlit81754}

<small><strong>Allison Ding</strong> · Senior Developer Advocate, Data Science, NVIDIA</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>A hands-on DLI workshop walking through an end-to-end GPU-accelerated data science pipeline: data ingestion and feature engineering with cuDF/GPU Polars, unsupervised and supervised learning with cuML, and model deployment with Triton Inference Server. Uses the IEEE CIS fraud detection dataset throughout. Notebooks remain available for six months post-session.</p></details>

This session covers the tools developed by NVIDIA for the full end-to-end machine learning workflow, from feature wrangling and exploration with cuDF, to accelerating various machine learning models for classification, regression, and clustering tasks with cuML, a drop-in replacement for scikit-learn, and finally how to profile and deploy the model to inference servers like Triton.

<img src="/assets/img/gtc-2026/sessions/dlit81754-session-hero.png" alt="From Ingestion to Inference: GPU Data Science Pipeline workshop overview slide">

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. Apache Arrow is the zero-copy glue between cuDF, cuML, and GPU Polars</strong></td>
  <td class="tk-time">@ 10:33</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <span class="tk-body">
      All CUDA-X libraries — cuDF, cuML, cuGraph, cuVS — share data through Apache Arrow: "Arrow provides zero copy data transfers from pandas to CUDA-X, which means the data doesn't need to be copied or converted, just a pointer is passed." This is what allows the entire pipeline to stay on GPU without marshaling overhead between steps.
    </span>
    <img src="/assets/img/gtc-2026/sessions/dlit81754-t1-apache-arrow-zero-copy-glue.png" alt="Apache Arrow as zero-copy glue between cuDF, cuML, and GPU Polars">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. cuDF group-by: 200× faster; merges: 130× faster on GPU</strong></td>
  <td class="tk-time">@ 12:35</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <span class="tk-body">
      Key cuDF operation speedups: CSV reads ~20×, merges ~130×, group-by ~200×, select+filter ~3×. The full data processing + EDA + feature engineering pipeline on the IEEE CIS dataset runs in 43 seconds on GPU vs. 87 seconds on CPU — about 2× end-to-end, with the gains concentrated in the merge and aggregation steps.
    </span>
    <img src="/assets/img/gtc-2026/sessions/dlit81754-t2-cudf-groupby-merge-speedup.png" alt="cuDF operation speedups: group-by 200×, merges 130×, CSV reads 20×">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. GPU Polars uses cuDF as its engine — same performance, Polars syntax</strong></td>
  <td class="tk-time">@ 18:07</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      "GPU Polars uses CUDA-X as its execution engine" — it is not an alternative to cuDF, it is cuDF with a Polars API surface. The only change required: set `engine="gpu"` in the `.collect()` call. An email domain aggregation query runs in 78ms on CPU vs 11ms on GPU — 7×. Choose cuDF for pandas users, GPU Polars for Polars users; same hardware, same performance.
    </span>
    <img src="/assets/img/gtc-2026/sessions/dlit81754-t3-gpu-polars-cudf-engine.png" alt="GPU Polars uses cuDF as its engine — same performance, Polars syntax">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. cuML accelerates highly parallelizable algorithms like UMAP: 40× on 2D, 20× on 3D — GPU makes it interactive</strong></td>
  <td class="tk-time">@ 37:45</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      2D UMAP projection: 48 seconds on CPU, 1.3 seconds on GPU (~37×). 3D UMAP: 56 seconds → 2.8 seconds (~20×). KNN graph construction, mutual reachability distance, and gradient descent layout steps are all parallelized. At these speeds, exploratory cluster visualization becomes interactive during model development rather than a batch job.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. Both supervised and unsupervised algorithms can be accelerated: k-means 40× faster; XGBoost training 7× faster; grid search cross-validation 4×</strong></td>
  <td class="tk-time">@ 42:15</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      k-means: 4.9s CPU → 1.3s GPU, "over 40 times speedup." XGBoost single training run: 26.8s → 4.6s (7×). 5-fold cross-validation: 124s → 26.7s (~5×). 3-fold cross-validated grid search (9 XGBoost runs): 159s → 44s (4×). The acceleration applies to gradient/hessian computation, tree building, and loss evaluation — all four XGBoost phases are GPU-parallelized.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>6. cuDF and cuML profilers give per-operation and line-by-line CPU vs GPU breakdown</strong></td>
  <td class="tk-time">@ 48:08</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      Both <strong>cuDF</strong> and <strong>cuML</strong> ship with two built-in profilers: an operation-level breakdown (what ran on CPU vs GPU) and a line-by-line profiler that pinpoints bottlenecks. Common performance killers to watch for: small batch sizes that cause repeated CPU↔GPU transfers, silent CPU fallbacks for unsupported operations, and complex string operations which don't accelerate well on GPU.
    </span>
    <img src="/assets/img/gtc-2026/sessions/dlit81754-t6-cudf-cuml-profiler.png" alt="cuDF and cuML profilers: per-operation and line-by-line CPU vs GPU breakdown">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>7. Triton Inference Server: dynamic batching from 128 to 1024, 100% success rate in testing</strong></td>
  <td class="tk-time">@ 01:16:26</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Triton sits between client applications and GPUs, supporting Python, TensorRT, ONNX, and PyTorch backends. For the XGBoost fraud model (461 input features, 1 output probability), dynamic batching is configured from 128 to 1024. In the workshop demo, Triton reports "100% success rate, zero failure rate." Metrics surface latency, throughput, queue efficiency, and per-GPU utilization.
    </span>
    <img src="/assets/img/gtc-2026/sessions/dlit81754-t7-triton-dynamic-batching.png" alt="Triton Inference Server: dynamic batching from 128 to 1024, 100% success rate">
  </td>
</tr>

</table>


---

### Cross-session themes

The five sessions share a common vocabulary captured in the takeaway tags. Here is what each theme amounted to across all sessions.

<table class="takeaway-table">

<tr>
  <td colspan="2" class="tk-head"><takeaway-tag name="pain"></takeaway-tag> <strong>GPU scarcity and PCIe bandwidth — not compute — are the hardest constraints; CPU databases and UDFs are performance cliffs</strong></td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <ul class="tk-body">
      <li>[<a href="#edb">EDB</a>] Postgres times out on agentic query loads even at modest data sizes; the database layer, not the model, is the bottleneck</li>
      <li>[<a href="#snap">Snap</a>] At peak demand, GPU availability — not Spark configuration — was Snap's primary constraint</li>
      <li>[<a href="#zoho">Zoho</a>] Even after every I/O optimization, GPU compute is only 25% of query time; PCIe is still the bottleneck</li>
      <li>[<a href="#dlit81642">Spark Workshop</a>] Any UDF in a Spark GPU job forces a full GPU→CPU PCIe round trip plus columnar→row conversion — a performance cliff for any compute-heavy function</li>
      <li>[<a href="#dlit81642">Spark Workshop</a>] Spark on GPU sees little benefit for I/O-bound jobs or small datasets; the workload profile must be right</li>
    </ul>
  </td>
</tr>

<tr>
  <td colspan="2" class="tk-head"><takeaway-tag name="benchmark"></takeaway-tag> <strong>GPU delivers 7–200× speedups across very different analytics workloads — the gains compound when the workload fits</strong></td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <ul class="tk-body">
      <li>[<a href="#edb">EDB</a>] Spark RAPIDS on L40S runs TPC-DS 100× faster than standard Postgres; Blackwell adds a further 14×</li>
      <li>[<a href="#zoho">Zoho</a>] Zoho's Velociraptor completes all 22 TPC-H SF1k queries on a single H200 in under 2 minutes</li>
      <li>[<a href="#dlit81754">Data Science Pipeline</a>] cuDF group-by: 200× faster; merges: 130× faster; CSV reads: 20× faster on GPU</li>
      <li>[<a href="#dlit81754">Data Science Pipeline</a>] cuML k-means: 40× faster; XGBoost training: 7× faster; grid search cross-validation: 4×</li>
      <li>[<a href="#dlit81754">Data Science Pipeline</a>] UMAP dimensionality reduction: 40× on 2D, 20× on 3D — GPU makes it interactive</li>
      <li>[<a href="#snap">Snap</a>] [<a href="#dlit81642">Spark Workshop</a>] Snap achieved 90% net cost reduction; Aether TuneML correctly ranks Spark config improvements with 90% AUC</li>
    </ul>
  </td>
</tr>

<tr>
  <td colspan="2" class="tk-head"><takeaway-tag name="tco"></takeaway-tag> <strong>GPU reuse at near-zero incremental cost is Snap's headline finding — idle inference fleets are an untapped analytics resource</strong></td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <ul class="tk-body">
      <li>[<a href="#snap">Snap</a>] Snap reused 11,000 idle inference L4s for Spark with zero new hardware spend, cutting costs by 90% and memory by 81%</li>
      <li>[<a href="#edb">EDB</a>] EDB's PGAA eliminates the need for a separate analytics cluster alongside Postgres — one stack for OLTP and OLAP</li>
      <li>[<a href="#snap">Snap</a>] Spark RAPIDS delivered measurable savings on Snap's non-I/O-bound jobs with minimal engineering effort</li>
    </ul>
  </td>
</tr>

<tr>
  <td colspan="2" class="tk-head"><takeaway-tag name="design"></takeaway-tag> <strong>Zero-code-change and graceful fallback are the dominant design principles across every session</strong></td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <ul class="tk-body">
      <li>[<a href="#edb">EDB</a>] PGAA replaces only the Postgres compute back-end, leaving the SQL front-end and application layer untouched</li>
      <li>[<a href="#zoho">Zoho</a>] Zoho's plan conversion layer keeps the original Postgres query plan intact for OOM fallback</li>
      <li>[<a href="#snap">Snap</a>] Snap's three-tier fallback (GPU GKE → CPU GKE → Dataproc) ensures no Spark job ever fails to complete</li>
      <li>[<a href="#dlit81754">Data Science Pipeline</a>] Apache Arrow zero-copy transfers between cuDF, cuML, and GPU Polars keep the full data science pipeline on GPU with no serialization overhead</li>
      <li>[<a href="#dlit81754">Data Science Pipeline</a>] <code>%load_ext cudf.pandas</code> and <code>%load_ext cuml.accel</code> — full GPU acceleration with no code changes in notebooks</li>
      <li>[<a href="#dlit81642">Spark Workshop</a>] Project Aether wraps qualify → submit → profile → tune → validate into a single <code>aether run</code> command</li>
      <li>[<a href="#dlit81642">Spark Workshop</a>] Ether Assistant's three-phase LLM pipeline (test generation → UDF rewrite → benchmark) eliminates PCIe round trips without manual rewriting</li>
    </ul>
  </td>
</tr>

<tr>
  <td colspan="2" class="tk-head"><takeaway-tag name="storage"></takeaway-tag> <strong>Minimizing bytes that cross the PCIe bus is the central I/O strategy at every layer</strong></td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <ul class="tk-body">
      <li>[<a href="#edb">EDB</a>] EDB replicates Postgres data to object storage in Apache Iceberg format, enabling columnar GPU-optimized reads</li>
      <li>[<a href="#zoho">Zoho</a>] Zoho's four-layer I/O stack (columnar layout + block filtering + compression + late materialization) reduces bytes per batch to a small fraction of the raw data</li>
    </ul>
  </td>
</tr>

<tr>
  <td colspan="2" class="tk-head"><takeaway-tag name="memory-bw"></takeaway-tag> <strong>Bandwidth is the real limiting factor; NVLink on x86 is the industry's next unlock</strong></td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <ul class="tk-body">
      <li>[<a href="#zoho">Zoho</a>] GPU decompression of cascaded RLE/delta columns already exceeds the PCIe Gen 4 ceiling for high-compression data</li>
      <li>[<a href="#zoho">Zoho</a>] Zoho is explicitly waiting for NVLink on x86; the Intel/NVIDIA NVLink fusion announcement is a direct response to PCIe being the dominant bottleneck</li>
      <li>[<a href="#dlit81754">Data Science Pipeline</a>] Arrow zero-copy means passing a pointer, not copying data — essential when group-by and merge speedups reach 130–200×</li>
    </ul>
  </td>
</tr>

<tr>
  <td colspan="2" class="tk-head"><takeaway-tag name="algo"></takeaway-tag> <strong>ML-driven tooling closes the GPU Spark adoption gap; statistical encoding techniques compound GPU throughput gains</strong></td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <ul class="tk-body">
      <li>[<a href="#dlit81642">Spark Workshop</a>] Aether TuneML replaces hand-tuned Spark config rules with an XGBoost model trained on 100 NDS queries, achieving 90% AUC ranking accuracy</li>
      <li>[<a href="#dlit81642">Spark Workshop</a>] Ether Assistant uses an iterative LLM pipeline to rewrite CPU UDFs into GPU-native columnar code, verified by auto-generated unit tests</li>
      <li>[<a href="#dlit81754">Data Science Pipeline</a>] k-fold target encoding with smoothing (W=20–40) prevents rare-category overfitting and lifts standalone AUC from 0.589 to 0.95</li>
      <li>[<a href="#dlit81754">Data Science Pipeline</a>] GPU algorithms win in proportion to their parallelizability — UMAP and k-means benefit more than gradient boosting</li>
    </ul>
  </td>
</tr>

<tr>
  <td colspan="2" class="tk-head"><takeaway-tag name="memory-cap"></takeaway-tag> <strong>Partition sizing is the primary GPU Spark config lever — spill metrics are the signal</strong></td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <ul class="tk-body">
      <li>[<a href="#dlit81642">Spark Workshop</a>] <code>sql.files.maxPartitionBytes</code> and <code>sql.shuffle.partitions</code> drive 80% of Spark GPU tuning value; memory spill metrics in event logs are the leading indicator of oversized tasks</li>
    </ul>
  </td>
</tr>

<tr>
  <td colspan="2" class="tk-head"><takeaway-tag name="oss"></takeaway-tag> <strong>EDB packages the full agentic data stack as a sovereign, open-source, deployable-anywhere platform</strong></td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <ul class="tk-body">
      <li>[<a href="#edb">EDB</a>] Lakekeeper (Iceberg catalog), LangFlow (agent authoring), NVIDIA NIMs on KServe (inference), and PGAA are packaged together — deployable on-prem, on all hyperscalers, or on custom NVIDIA hardware</li>
    </ul>
  </td>
</tr>

</table>

### Connect With Experts

One of the advantages of being at the conference is the opportunity to meet with NVIDIA engineers working directly on these systems, and there were several opportunities to do so with the folks involved in the accelerated data stack, which I list below for reference.

[🔗 <strong>Next-Gen Data Systems: GPU Acceleration for SQL and Vector Databases</strong>](https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-cwes81481/) 

<small><strong>Tanmay Gujar</strong> · Developer Technology Engineer, NVIDIA<br>
<strong>Corey Nolet</strong> · Distinguished Engineer, Unstructured Data Processing & Database Acceleration, NVIDIA<br>
<strong>Felipe Aramburu</strong> · Distinguished Solutions Architect, NVIDIA<br>
<strong>Manas Singh</strong> · TPM Vector Search, NVIDIA<br>
<strong>Benjamin Karsin</strong> · Senior Developer Technology Engineer, NVIDIA<br>
<strong>Greg Kimball</strong> · Software Engineering Manager, NVIDIA</small>


[🔗 <strong>Boost Data Science Pipelines With Accelerated Libraries</strong>](https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-cwes82212/) 

<small><strong>Greg Kimball</strong> · Software Engineering Manager, NVIDIA<br>
<strong>Alexandria Barghi</strong> · Senior Software Engineer, NVIDIA<br>
<strong>Divye Gala</strong> · Senior Software Engineer, NVIDIA<br>
<strong>Vyas Ramasubramani</strong> · Sr. Systems Software Engineer, NVIDIA<br>
<strong>Bobby Evans</strong> · Distinguished Software Engineer, NVIDIA</small>

<style>
  .post-content h4 a { color: #111827; text-decoration: none; }
  .post-content h4 a:hover { color: #2a7ae2; text-decoration: none; }
  /* ul.tk-body overrides the inline display set by the base rule for span.tk-body */
  .takeaway-table .tk-content ul.tk-body {
    display: block;
    list-style: disc;
    padding-left: 1.4em;
    margin: 0;
    font-size: 0.92em;
    line-height: 1.6;
  }
  .takeaway-table .tk-content ul.tk-body li { margin-bottom: 0.2em; }
</style>

---

*[← Part 1: Technical Deep Dives](/nvidia/gtc/analytics/gpu/2026/04/09/accelerated-analytics-at-gtc-2026-part1-technical-deep-dives.html)*


