---
layout: post
title: "NVIDIA GTC 2026 Accelerated Analytics - Part 2: Industry Use Cases and Training labs"
date: 2026-04-06 00:00:00 -0700
categories: nvidia gtc
tags: []
toc: true
---

*This is Part 2 of a 3-part series on Accelerated Analytics at GTC 2026. Read [Part 1: Technical Deep Dives](/nvidia/gtc/2026/04/06/accelerated-analytics-at-gtc-2026-part1-technical-deep-dives.html) or jump to [Part 3: Overall GTC Analytics Takeaways](/nvidia/gtc/2026/04/06/accelerated-analytics-at-gtc-2026-part3-overall-gtc-analytics-takeaways.html).*

This part covers industry deployments from Capgemini and Snap, plus three hands-on training labs from NVIDIA's Deep Learning Institute, and the Connect With Experts sessions.

### Industry Use Cases

#### [🔗 The Agentic AI Data Factory: Why Agents Need a GPU-Native Data Platform to Create Real Value (Presented by Capgemini)](https://www.nvidia.com/en-us/on-demand/session/gtc26-ex82286/)

<small><strong>Rajesh Iyer</strong> · Global Head of ML and Gen AI for Financial Services, Capgemini</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>Capgemini's three-year effort to automate enterprise back-office processes with agentic AI surfaced a hard data problem: agents fail when source data is fragmented across audio, video, and documents. This talk introduces the Agentic AI Data Factory — a four-layer GPU-native data platform that unifies multimodal data into a shared vector space and makes it queryable in real time, enabling agentic workflows that could not function on CPU-bound architectures.</p></details>

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. Four-layer data factory: Sentinel → Concord → Signal → Pulse Grids</strong></td>
  <td class="tk-time">@ 02:56</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="storage"></takeaway-tag>
    <span class="tk-body">
      All storage layers are Apache Iceberg. Structured data lands directly in the Sentinel Grid (bronze); unstructured data routes through a joint embedding facility first, then joins structured data in the Concord Grid. The Signal Grid exposes an ad-hoc multimodal analytics surface; the Pulse Grid runs continuous KPI monitoring. Every inter-grid hop is processed via RAPIDS and Polars.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. Unified multimodal embedding is the unsolved layer</strong></td>
  <td class="tk-time">@ 03:35</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="pain"></takeaway-tag>
    <span class="tk-body">
      Getting audio, video, and text into the same vector space ("the same meaning space") is not a solved problem, especially when motion matters. The speaker cites ImageBind as a partial option and 12Labs for temporal/kinetic relationships, but concludes: "there's even less solutions that you have" once motion is a requirement. Capgemini expects much better embedded models to emerge — but doesn't have them yet.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Tensor decomposition lets agents explain KPI shifts by segment</strong></td>
  <td class="tk-time">@ 05:49</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      The Pulse Grid uses tensor decomposition — described as "very GPU-friendly" — to attribute KPI changes to individual segments: "of that 5%, 2% came from this segment, 3% came from this segment." The Lending Club demo shows a default rate breakdown in real time. This gives agents an always-on root-cause layer without running an offline attribution job.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. Text-in, audio-out querying — no transcription in the pipeline</strong></td>
  <td class="tk-time">@ 10:38</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      In the Signal Grid demo, a text query against a corpus of recorded calls returns audio segments — not transcriptions. "I'm talking to it in text, but it's actually returning audio. There is no transcription behind the scenes." The query operates natively on audio embeddings, which means no STT latency and no transcription errors in the retrieval path.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. Insurance claim estimation: video + audio cross-validation converges as customer walks the scene</strong></td>
  <td class="tk-time">@ 07:52</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      The insurance damage estimation use case stitches a customer's 360-degree walk-around video with their simultaneous audio description, then cross-validates both against claim facts. The estimate "oscillates a lot" early and converges as coverage improves — flagging inconsistencies between what's said and what's visible. This is the clearest example of why temporal alignment ("kinetics") across modalities is a hard prerequisite for agentic automation.
    </span>
  </td>
</tr>

</table>

#### [🔗 How Snap Saves Millions with Accelerated Apache Spark](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81678/)

<small><strong>Liang Chen</strong> · Staff Software Engineer, Snap, Inc.<br><strong>Prudhvi Vatala</strong> · Sr. Engineering Manager, Snap, Inc.</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>Snap's A/B experimentation platform processes 10 petabytes per day across ~45,000 machines with a strict 11 AM SLA and zero tolerance for failure. This talk is an eight-month engineering journey: from discovering the RAPIDS Spark accelerator, through benchmarks, infrastructure blockers, and a novel GPU reuse strategy, to a fully productionized petabyte-scale GPU Spark platform that cut costs by 90%.</p></details>

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. Zero code changes — RAPIDS plugin drops in and delivers 2.5× on joins</strong></td>
  <td class="tk-time">@ 03:32</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      The RAPIDS Accelerator for Spark requires no pipeline rewrites — "zero code changes." On a 2 TB × 100 GB join job running on the same number of T2 GPU workers as CPU workers, end-to-end runtime dropped by 2.5×. The task-time view is starker: "total task time dropped from 400 hours on CPU to just 28 hours with GPUs. That's a 14 times reduction."
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. GPU eliminates spill entirely — 54 TB memory + 4 TB disk gone on the join job</strong></td>
  <td class="tk-time">@ 05:13</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      At Snap's scale, Spark spill is the primary cause of slowness. The GPU "completely eliminates the 54 terabytes of memory spill and four terabytes of the disk spills." On the 10 TB union job, 90 TB memory spill and 30 TB disk spill vanish. Task duration consistency improved at every percentile: "the consistency is what really stood out to us."
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Half the GPU cluster still beats the full CPU cluster on aggregation</strong></td>
  <td class="tk-time">@ 07:01</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      For straightforward aggregation (sum-type functions), GPUs provide a modest 1.6× speedup — CPU is already fast here. But even in this favorable CPU case, "half the GPU cluster with only 100 workers, it still beats the full CPU cluster with 200 workers." Fewer machines achieving the same result is a TCO win regardless of the speedup ratio.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. The scale problem: 62,000 machines → still needs 20,000 GPUs</strong></td>
  <td class="tk-time">@ 09:06</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <span class="tk-body">
      GPUs would reduce peak machine count by two-thirds — from 62,000 to ~20,000 GPUs simultaneously. On-demand GPU procurement at that scale was not feasible. The breakthrough was finding idle capacity already inside Snap: the ML inference fleet for ad ranking and content recommendations drops to low utilization between 2–5 AM Pacific as users sleep, leaving thousands of GPUs sitting idle every night.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. Reusing the inference fleet's idle window — the unlock for scale</strong></td>
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
  <td class="tk-head"><strong>6. Three-tier fallback: GPU GKE → CPU GKE → Dataproc; no job ever fails to complete</strong></td>
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
  <td class="tk-head"><strong>7. 90% net cost reduction; 11,000 L4s, 81% less memory, zero new spend</strong></td>
  <td class="tk-time">@ 22:15</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Because Snap reuses idle capacity, "there is no net new compute cost added." Net experimentation platform footprint dropped 90%. Apples-to-apples (counting GPU cost as incremental): 76% savings. Detailed breakdown: "cores went down 62.5%," "memory went from about three petabytes to half a petabyte, 81% reduction." The pipeline now runs on ~11,000 L4s during the six-hour overnight window.
    </span>
  </td>
</tr>

</table>


### Training Labs

#### [🔗 From Ingestion to Inference: Mastering the High-Performance GPU Data Science Pipeline](https://www.nvidia.com/en-us/on-demand/session/gtc26-dlit81754/)

<small><strong>Allison Ding</strong> · Senior Developer Advocate, Data Science, NVIDIA</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>A hands-on DLI workshop walking through an end-to-end GPU-accelerated data science pipeline: data ingestion and feature engineering with cuDF/GPU Polars, unsupervised and supervised learning with cuML, and model deployment with Triton Inference Server. Uses the IEEE CIS fraud detection dataset throughout. Notebooks remain available for six months post-session.</p></details>

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
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. cuDF group-by: 200× faster; merges: 130× faster on GPU</strong></td>
  <td class="tk-time">@ 12:35</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Key cuDF operation speedups: CSV reads ~20×, merges ~130×, group-by ~200×, select+filter ~3×. The full data processing + EDA + feature engineering pipeline on the IEEE CIS dataset runs in 43 seconds on GPU vs. 87 seconds on CPU — about 2× end-to-end, with the gains concentrated in the merge and aggregation steps.
    </span>
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
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. UMAP dimensionality reduction: 40× on 2D, 20× on 3D — GPU makes it interactive</strong></td>
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
  <td class="tk-head"><strong>5. k-means 40× faster; XGBoost training 7× faster; grid search cross-validation 4×</strong></td>
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
  <td class="tk-time">@ 16:12</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      Both cuDF and cuML ship with two built-in profilers: an operation-level breakdown (what ran on CPU vs GPU) and a line-by-line profiler that pinpoints bottlenecks. Common performance killers to watch for: small batch sizes that cause repeated CPU↔GPU transfers, silent CPU fallbacks for unsupported operations, and complex string operations which don't accelerate well on GPU.
    </span>
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
  </td>
</tr>

</table>

#### [🔗 Accelerate Apache Spark With GPU and AI: A Hands-On Workshop](https://www.nvidia.com/en-us/on-demand/session/gtc26-dlit81642/)

<small><strong>Hirakendu Das</strong> · Principal Software Engineer, NVIDIA<br><strong>Navin Kumar</strong> · Sr. System Software Engineer, NVIDIA<br><strong>Rishi Chandra</strong> · Systems Software Engineer, NVIDIA</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>A hands-on DLI workshop covering three layers of GPU-accelerated Spark: the RAPIDS cuDF plugin (zero-code-change columnar acceleration), Project Aether (automated qualification, testing, and migration toolchain), and Ether Assistant (LLM-based UDF rewriter). Uses the NVIDIA Decision Support (NDS) TPC-DS-derived benchmark throughout.</p></details>

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. GPU physical plan operates on columnar batches — data stays columnar between operators</strong></td>
  <td class="tk-time">@ 07:41</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      The RAPIDS Accelerator intercepts the Spark physical plan and converts it to a GPU-native columnar plan. "As long as the operators stay on the GPU, we keep the data in the columnar format." When an unsupported operator forces a CPU fallback, Spark converts from columnar back to row format, runs on CPU, then reconverts — the cost is the conversion round-trip, not the operation itself.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. GPU wins on joins, aggregates, sorts over high-cardinality data — not I/O-bound ops</strong></td>
  <td class="tk-time">@ 12:18</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <span class="tk-body">
      "If you have systems with very large amounts of high cardinality data… and joins and aggregates and sorting, those tend to be the most ideal workloads for GPU." I/O-bound jobs — where most time is spent reading from or writing to a data store — see little benefit. Small datasets also underperform due to the overhead of staging data into GPU memory. Know which regime your job is in before expecting a speedup.
    </span>
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
      The old manual migration process — qualification, staging, POC, config iteration, production argument — requires enough engineering resources that "this process generally stops somewhere before getting the workloads migrated." Aether wraps all four steps (`qualify`, `submit`, `profile`, `report`) into a single `aether run` command. Results and configs are stored in a SQLite history database. Supports on-prem, Amazon EMR, and Google Dataproc.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. The two critical GPU Spark configs are maxPartitionBytes and shufflePartitions</strong></td>
  <td class="tk-time">@ 53:09</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      `maxPartitionBytes` controls data per read partition; `shufflePartitions` controls the number of shuffle tasks for joins and group-bys. "In order to take advantage of the massive parallelism, you want to have bigger and bigger batch sizes or tasks" — but too large and the job spills. Memory spill metrics in event logs are the leading indicator that shuffle tasks are oversized. These two configs drive 80% of the tuning value.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. TuneML: XGBoost model predicts optimal Spark config changes with 90% AUC ranking accuracy</strong></td>
  <td class="tk-time">@ 43:10</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="algo"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Replacing rule-based formulas with an XGBoost model trained on 100 NDS queries (90 train / 10 holdout), TuneML uses profiling metrics (input bytes, shuffle read/write bytes, spill rates) to predict speedup for candidate config changes. Ranking AUC ~90%: "90% of the time, the configs should lead to some speedup." Roadmap: replace XGBoost with a fine-tunable DNN and add reinforcement learning for efficient config space exploration.
    </span>
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
  </td>
</tr>

</table>

#### [🔗 Supercharge Tabular ML Models With GPU-Accelerated Feature Engineering](https://www.nvidia.com/en-us/on-demand/session/gtc26-dlit81546/)

<small><strong>Chris Deotte</strong> · Sr. Data Scientist, NVIDIA<br><strong>Ronay Ak</strong> · Sr. Data Scientist, NVIDIA</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>Fast experimentation in feature engineering is essential to quickly discover the most valuable features that improve model performance. In this tutorial, we leverage NVIDIA cuDF and cuML libraries to accelerate the experimentation pipeline on GPUs with their zero-code change features, enabling faster feature engineering and quicker development of more accurate models.
</p></details>

**Takeaways**

<table class="takeaway-table">
<tr>
  <td class="tk-head"><strong>1. GPU cuts the feature engineering experiment loop by 50–92× — same code, different speed</strong></td>
  <td class="tk-time">@ 04:04</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      A benchmark slide shows the GPU pipeline running "50 times, 92 times faster" than the CPU equivalent. The bottleneck in tabular ML is not model training but feature experimentation — encoding 10 columns × 45 pairs × k-fold × smoothing on large datasets. Faster encoding means more hypotheses get tested in the same window. Tools are `%load_ext cudf.pandas` and `%load_ext cuml.accel`; no code changes required.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. Count encoding is two lines of code — GPU runs 16M rows in under 500ms vs ~6s on CPU</strong></td>
  <td class="tk-time">@ 33:44</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      Count encoding assigns each category value the frequency with which it appears in the training set, then merges it as a new numeric feature. Two lines: `.value_counts()` + merge. Multi-column count encoding (e.g. category2 + brand co-occurrence) is identical syntax. On 16M rows, GPU completes this in under 500ms vs CPU's ~6 seconds — roughly 14–15×. Count encoding is "really easy" but captures a useful signal: how popular is this category overall.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Target encoding smoothing formula: weighted average of global mean prevents overfitting rare categories</strong></td>
  <td class="tk-time">@ 43:00</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      Raw target encoding (mean of labels per category) is unreliable for rare values: a brand appearing once inherits a single observation's label. Smoothing fixes this: <code>TE = (count × computed_mean + W × global_mean) / (count + W)</code>. When count is small, the result converges to the global mean; when count is large, it trusts the computed mean. W=20 means "I need at least 20 observations before I trust what I see." W=20–40 is the practical range but is itself a tunable hyperparameter.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. Smoothing measurably improves TE quality: rare-category error 32% → 23%; AUC 0.589 → 0.95</strong></td>
  <td class="tk-time">@ 48:52</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      Target encoding produces a probability estimate, so it can be evaluated as a standalone predictor. Without smoothing: error rate for categories appearing once = 32%; AUC = 0.589. With smoothing: rare-category error drops to 23%; treating the TE column as a prediction gives AUC = 0.95. The gap is largest in the long tail — exactly where models are hurt most. (These figures include train-set leakage; k-fold in the next step removes it.)
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. K-fold target encoding eliminates leakage — compute each fold's means from the other 80% of rows</strong></td>
  <td class="tk-time">@ 50:40</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      Using a row's own target in its TE computation is leakage — the feature partially encodes the answer. Fix: divide data into 5 folds; for rows in fold <em>i</em>, compute group means from the other 80% (folds 1–4 except <em>i</em>), then merge those means onto fold <em>i</em>; repeat 5 times. `cuml.TargetEncoder` handles this in one call: `fit_transform()` applies k-fold internally on train, `.transform()` applies the saved mapping to validation/test with no leakage.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>6. K-fold smoothed target encoding across 3 combined columns: 3.6s GPU vs 40s CPU on 16M rows (11×)</strong></td>
  <td class="tk-time">@ 53:27</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      The full computation — k=5 cross-validated target encoding with smoothing on the interaction of three columns (weekday × category × brand) — completes in 3.6 seconds on GPU. The same function on CPU takes 40 seconds: roughly 11× slower. At 100M+ rows typical in production, those 40 seconds become "sleeping, waiting overnight" (Chris's words). The speedup scales because more unique interaction pairs raise group-by cardinality, where GPU parallelism has the most leverage.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>7. Target encoding is model-agnostic: XGBoost AUC 0.65 → 0.75; SVM 0.50 → 0.60; GPU training 6× faster</strong></td>
  <td class="tk-time">@ 01:10:57</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      XGBoost with built-in categorical handling: 0.65 AUC. After adding 7 target-encoded columns (one per categorical via `cuml.TargetEncoder`): 0.70–0.75 AUC — productID and userID target encodings ranked highest by feature importance. SVM (which cannot handle strings natively) shows the same pattern: label encoding → 0.505; one-hot encoding → 0.515; target encoding → 0.60. XGBoost GPU training (`device="cuda"`, one parameter): 4s vs 24s CPU = 6×. More folds (10, 15) can squeeze further AUC gains at proportionally higher compute cost.
    </span>
  </td>
</tr>

</table>

### Connect With Experts

[🔗](https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-cwes81481/) <strong>Next-Gen Data Systems: GPU Acceleration for SQL and Vector Databases</strong>

<small><strong>Tanmay Gujar</strong> · Developer Technology Engineer, NVIDIA<br><strong>Corey Nolet</strong> · Distinguished Engineer, Unstructured Data Processing & Database Acceleration, NVIDIA<br><strong>Felipe Aramburu</strong> · Distinguished Solutions Architect, NVIDIA<br><strong>Manas Singh</strong> · TPM Vector Search, NVIDIA<br><strong>Benjamin Karsin</strong> · Senior Developer Technology Engineer, NVIDIA<br><strong>Greg Kimball</strong> · Software Engineering Manager, NVIDIA</small>


[🔗](https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-cwes82212/) <strong>Boost Data Science Pipelines With Accelerated Libraries</strong>

<small><strong>Greg Kimball</strong> · Software Engineering Manager, NVIDIA<br><strong>Alexandria Barghi</strong> · Senior Software Engineer, NVIDIA<br><strong>Divye Gala</strong> · Senior Software Engineer, NVIDIA<br><strong>Vyas Ramasubramani</strong> · Sr. Systems Software Engineer, NVIDIA<br><strong>Bobby Evans</strong> · Distinguished Software Engineer, NVIDIA</small>

<style>
  .post-content h4 a { color: #111827; text-decoration: none; }
  .post-content h4 a:hover { color: #2a7ae2; text-decoration: none; }
</style>

---

*[← Part 1: Technical Deep Dives](/nvidia/gtc/2026/04/06/accelerated-analytics-at-gtc-2026-part1-technical-deep-dives.html)* · *[Part 3: Overall GTC Analytics Takeaways →](/nvidia/gtc/2026/04/06/accelerated-analytics-at-gtc-2026-part3-overall-gtc-analytics-takeaways.html)*


