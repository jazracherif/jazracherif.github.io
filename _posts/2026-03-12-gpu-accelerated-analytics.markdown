---
layout: post
title:  "The Rise of GPU-Accelerated Data Analytics"
date:   2026-03-12 11:00:00 -0700
categories: database gpu nvidia rapids libcudf
---

The need for GPU-accelerated data systems for Analytics is growing!

<div class="tldr">
<p class="tldr-label">TL;DR</p>
<ol>
  <li><strong>AI agents are changing the analytics workload</strong> — agentic speculation is exploding demand for structured analytic compute.</li>
  <li><strong>CPU analytics has had a great run, but GPU is primed to take over new demand</strong> — CPU-centered databases powered enterprise analytics for decades, but surging AI hardware investment is propelling GPU memory bandwidth and parallelism further ahead.</li>
  <li><strong>GPU-accelerated databases are rising in research and industry</strong> — Conferences have seen a wave of GPU database papers since 2020, and GPU acceleration is reaching production tools. Yet building correct, full-featured GPU query engines remains a formidable engineering challenge.</li>
  <li><strong>NVIDIA has built a moat with RAPIDS AI and libcudf</strong> — virtually every GPU-accelerated analytic system today is built on libcudf, making it the critical layer to understand in this space.</li>
</ol>
</div>

### The Analytics Workload Is Changing Fast — Enter AI Agents

In 2025, LLM-powered AI agents started proving their value, and their adoption has been rapidly spreading across enterprises, particularly for data analytics and insights extraction. The [2025 State of AI in Enterprise report](https://www.databricks.com/blog/state-ai-enterprise-adoption-growth-trends) shows that companies are now moving from piloting the technology to actually deploying it in production, noting that "many companies focused on experimenting last year [2025] have crossed the threshold into operational AI systems."

Databricks is at the forefront of adopting LLMs and agent technology, and it is worthwhile to follow how they have been preparing for the coming explosion in their adoption. Through their latest [Lakebase architecture](https://www.databricks.com/blog/what-is-a-lakebase), Databricks shows they are positioning for both OLTP and OLAP workloads required by agents for the full automation of the data exploration and productionization pipelines.

> This architecture eliminates much of the cost, complexity, and lock-in that have defined databases for decades, and it is especially powerful for modern AI and agent-driven workloads, where developers want to launch many instances, experiment freely, and pay only for what they use.

Their latest [Genie](https://www.databricks.com/blog/introducing-genie-code) product is their version of the AI agents that will carry out this work, driven solely by high-level natural language commands tied to business needs.

> Genie Code can autonomously carry out complex tasks such as building pipelines, debugging failures, shipping dashboards, and maintaining production systems.

Together, these advances will help bring AI agents to the market, simplifying much of the data science workflow. But Databricks believes a much bigger wave is ahead, one where agents are unleashed to search for insights by trying many different paths. They call this **Agentic speculation**, "a high-throughput process of exploration and solution formulation for the given task," which Databricks engineers envision will require redesigning data systems to be agent-first[^agentic-speculation].
> Overall, as agentic workloads become more and more prevalent, the sheer scale and inefficiencies of agentic speculation will become the bottleneck, and our data systems will need to evolve in response

The impact on the *analytics workload* will be profound. Future systems will be designed almost exclusively with AI agents as **first-class users**, performing exploration, identifying insights, and productionizing their solutions. All of this will be done from raw structured and unstructured data. 

Where will the engineering bottlenecks be? *Agentic speculation* will dramatically increase the velocity of both code generation and analytical queries, vastly increasing the effective memory bandwidth and working set memory requirements of the underlying systems. AI agents will also become more deeply integrated into the data infrastructure to provide intelligent exploration. Do we have the right software and hardware to support this movement? Today, we see massive investment in serving inference from GPUs, but not enough analytics workloads have been accelerated, and this is likely to become a major bottleneck.

The question I am posing is whether current CPU-centered data processing systems will be capable of handling the scale needed to support these new agentic workloads.

### CPU-Centered Analytics: Decades of Dominance

In the past few decades, analytic query engines have been very successfully built around the CPU architecture, featuring a growing number of high-performance server cores (in the hundreds), deep cache hierarchies (in tens of MBs), and vectorized operations taking advantage of wider SIMD instruction sets (up to 512 bits wide).

To meet ever-larger volumes of data stored in object stores, these engines moved towards disaggregated architectures that enable elastic scaling of compute and storage. Coupled with open columnar data formats like Parquet and Arrow, this shift has fostered a wide ecosystem of query engines built on a composable data philosophy. It has been a remarkable run.

The milestones speak for themselves. [Snowflake](https://dl.acm.org/doi/10.1145/2882903.2903741)'s 2016 architecture pioneered separating compute from storage entirely, proving that cloud-native disaggregation could deliver elastic, multi-tenant analytics at scale. On the single-node analytical engine front, [DuckDB](https://duckdb.org) brought embeddable, vectorized OLAP to the edge; [ClickHouse](https://clickhouse.com) pushed columnar execution to extreme throughput on commodity hardware; and [Umbra/CedarDB](https://cedardb.com) pushed the boundary on single-node performance with JIT query compilation via LLVM and a hybrid row/columnar storage engine capable of handling both transactional and analytical workloads on a single system.

The composable data systems movement[^composable-manifesto] has further decoupled execution from storage, built on two key standards: [Apache Arrow](https://arrow.apache.org) as the universal in-memory columnar format enabling zero-copy data exchange between engines, and [Substrait](https://substrait.io) as a portable, cross-language query plan representation that lets a plan produced by one system be executed by another. On top of these, [Velox](https://velox-lib.io) (Meta) and [Apache DataFusion](https://datafusion.apache.org) provide reusable, modular physical execution engines that plug into larger systems rather than reinventing the wheel. This composability is now flowing upstream into the dominant distributed compute platforms — [Gluten](https://github.com/apache/incubator-gluten) brings Velox-backed native execution into Apache Spark, [Apache DataFusion Comet](https://github.com/apache/datafusion-comet) does the same using DataFusion as the native Rust backend, and [Presto](https://prestodb.io) has adopted Velox as its native C++ evaluation engine — extending the CPU performance frontier by replacing JVM-based execution with optimized native kernels.

### CPU vs GPU Hardware Trajectories: Fast GPU Gains, Mixed Analytics Outcome

Yet even as software pushes the CPU performance frontier further, the underlying hardware is hitting diminishing returns. AMD's EPYC Turin -- today's server CPU bandwidth leader -- peaks at ~576 GB/s per socket (+25% vs Genoa's ~461 GB/s) and ~15 TFLOPS FP32 (+~40% vs Genoa's ~11 TFLOPS), with max DRAM capacity flat at 6 TB across both generations. Intel's Xeon 6 (Granite Rapids) reaches ~409 GB/s (+33% vs Sapphire Rapids' ~307 GB/s) and ~14 TFLOPS FP32 (+~75% vs ~8 TFLOPS), with capacity likewise flat at 4 TB. Meaningful gains -- but incremental, and capacity has effectively plateaued.

GPUs tell a different story. Driven by the insatiable demand for AI training and inference, NVIDIA's flagship data-center superchips have advanced at a fundamentally different pace across just three generations -- the GH200 (Grace Hopper, 2023), GB200 (Grace Blackwell, 2024), and VR200 (Vera Rubin, 2025): memory bandwidth grew 9x from 4.9 TB/s to 44 TB/s, FP32 compute grew from 67 to 260 TFLOPS, and total unified memory capacity grew 3.4x generation-over-generation: 624 GB -> 864 GB (+39%) -> 2.1 TB (+143%). That puts VR200 at about 76x the bandwidth of a single EPYC Turin socket.

But for analytics workloads, raw hardware scaling alone does not determine the winner. At compute parity, the newer comparison shows a mixed outcome: GPUs have crossed into a clear bandwidth lead and the CPU capacity ratio is narrowing, while GPU cost and Perf/W advantages are also narrowing. In other words, the effective analytics gap is becoming more balanced, not one-dimensionally wider.

For a more detailed generation-by-generation comparison, see: [The Narrowing Gap for Analytics Workloads: GPU vs CPU Performance Across Three Generations]({% post_url 2026-03-25-the-narrowing-gap-gpu-vs-cpu-memory %}).

### GPU-Accelerated Databases Are Rising in Research and Industry

Unsurprisingly, the database research community has been paying close attention since 2020, with top conferences like SIGMOD and VLDB regularly accepting papers evaluating and building GPU-accelerated databases — both hybrid CPU-GPU and fully GPU-native. Recent highlights include:

- **Rethinking Analytical Processing in the GPU Era**[^sirius-cidr26] (CIDR 2026) — Sirius, a GPU plugin for DuckDB that rethinks analytical processing natively on the GPU.
- **Scaling GPU-Accelerated Databases beyond GPU Memory Size**[^gpudb-vldb25] (VLDB 2025) — tackles the fundamental GPU memory capacity bottleneck with a hybrid CPU-GPU filtering strategy, achieving a 3.5× speedup over SQL Server at 1 TB scale on a single A100.
- **GPU Database Systems Characterization and Optimization**[^gpudb-vldb24] (VLDB 2024) — systematically characterizes GPU database performance bottlenecks and proposes optimizations for modern workloads.
- **A Study of the Fundamental Performance Characteristics of GPUs and CPUs for Database Analytics**[^crystal-sigmod20] (SIGMOD 2020) — proposes Crystal, a GPU query library, and shows that full query GPU speedup can exceed the memory bandwidth ratio (up to 25×) due to CPU vectorization limitations.

On the industry side, 2025 saw GPU acceleration reach mainstream data tools:

- GPU execution landed in CPU dataframe engines like **Velox**[^velox-gpu] and **Polars**[^polars-gpu].
- The **RAPIDS Accelerator for Apache Spark**[^spark-rapids] enabled faster migration to GPU-accelerated distributed data engineering and analytics workloads.
- Voltron published the design paper for Theseus[^theseus], their petabyte-scale GPU accelerated query engine.

Despite genuine progress, building correct and performant GPU implementations of the full relational algebra remains enormously difficult. Managing GPU memory limits, PCIe transfer bottlenecks, operator fusion, and full SQL coverage is a hard engineering problem with no easy shortcut.

### NVIDIA's Moat: RAPIDS and libcudf

NVIDIA has seen this challenge coming for a while and has been systematically building a solution through its RAPIDS AI[^rapids-ai] ecosystem, first launched in 2018[^rapids-launch], well before the generative AI and LLM revolution had taken hold. At its core is a little-known C++ library, **libcudf** (and its sister libraries), a highly optimized, native GPU foundation that underpins virtually all GPU-accelerated analytic systems being built today. 

It is the de facto single-node physical operator infrastructure in this space, and understanding it is the key to understanding how GPU databases actually work. And yet, despite its central role, in-depth technical coverage of libcudf's internals is surprisingly scarce. Most available material stays at the user-facing API level, leaving critical questions about kernel design, memory management, and performance characteristics largely undocumented outside of the source code itself.

In future posts, I'll thus be diving deeper into the technical internals of libcudf and answering questions such as:

- ❓ How does libcudf translate relational operators into parallel GPU kernels?
- ❓ What is the tooling like to evaluate the library's performance?
- ❓ How is the libcudf used as a building block for larger distributed systems?

We are at an inflection point. The hardware gap between CPUs and GPUs is no longer a niche concern for ML engineers — it is becoming structurally relevant for anyone building or operating data systems at scale. The research momentum, the industry adoption, and NVIDIA's deliberate infrastructure investment all point in the same direction: GPU-accelerated analytics is moving from experimental to essential. The open question is not whether it will happen, but how fast the ecosystem matures and how much of the existing CPU-centric stack it displaces versus complements.

Excited about the momentum of GPU-accelerated analytics? Have questions about the software or hardware stack? Let me know below! 👇

---

### References

[^agentic-speculation]: Supporting Our AI Overlords: Redesigning Data Systems to be Agent-First — <https://arxiv.org/pdf/2509.00997>
[^crystal-sigmod20]: A Study of the Fundamental Performance Characteristics of GPUs and CPUs for Database Analytics — SIGMOD 2020 — <https://arxiv.org/pdf/2003.01178>
[^gpudb-vldb24]: GPU Database Systems Characterization and Optimization — VLDB 2024 — <https://vldb.org/pvldb/vol17/p441-cao.pdf>
[^gpudb-vldb25]: Scaling GPU-Accelerated Databases beyond GPU Memory Size — VLDB 2025 — <https://vldb.org/pvldb/vol18/p4518-li.pdf>
[^sirius-cidr26]: Rethinking Analytical Processing in the GPU Era — <https://arxiv.org/pdf/2508.04701>
[^composable-manifesto]: The Composable Data Management System Manifesto — VLDB 2023 — <https://www.vldb.org/pvldb/vol16/p2679-pedreira.pdf>
[^gh200-spec]: NVIDIA GH200 Grace Hopper Superchip — <https://www.nvidia.com/en-us/data-center/grace-hopper-superchip/>
[^gb200-spec]: NVIDIA GB200 NVL72 (Grace Blackwell Superchip) — <https://www.nvidia.com/en-us/data-center/gb200-nvl72/>
[^vr200-spec]: NVIDIA Vera Rubin NVL72 (Vera Rubin Superchip) — <https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/>
[^velox-gpu]: Accelerating Large-Scale Data Analytics with GPU-Native Velox and NVIDIA cuDF — <https://developer.nvidia.com/blog/accelerating-large-scale-data-analytics-with-gpu-native-velox-and-nvidia-cudf/>
[^polars-gpu]: RAPIDS Adds GPU Polars Streaming, a Unified GNN API, and Zero-Code ML Speedups — <https://developer.nvidia.com/blog/rapids-adds-gpu-polars-streaming-a-unified-gnn-api-and-zero-code-ml-speedups/>
[^spark-rapids]: RAPIDS Accelerator for Apache Spark — <https://www.nvidia.com/en-us/deep-learning-ai/solutions/data-science/apache-spark-3/>
[^theseus]: Theseus: A Distributed and Scalable GPU-Accelerated Query Processing Platform Optimized for Efficient Data Movement — <https://arxiv.org/pdf/2508.05029>
[^rapids-ai]: RAPIDS AI — <https://rapids.ai/learn-more/>
[^rapids-launch]: GPU-Accelerated Data Analytics & Machine Learning (RAPIDS AI Launch, 2018) — <https://developer.nvidia.com/blog/gpu-accelerated-analytics-rapids/>
[^gtc-sql-vector]: Next-Gen Data Systems: GPU Acceleration for SQL and Vector Databases — GTC 2026 — <https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-cwes81481/>
[^gtc-memory-wall]: Shatter the Memory Wall: Composable Building Blocks for Massive Scale Analytics — GTC 2026 — <https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-s81873/>
[^gtc-tabular]: Scaling Deep Tabular: 360K Inferences per Second per GPU — GTC 2026 — <https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-s82431/>
[^gtc-cuda-db]: Build a GPU-Accelerated Database Engine With CUDA — GTC 2026 — <https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-s82203/>
[^gtc-duckdb-sirius]: Scaling DuckDB Beyond Its Limits: GPU-Accelerated Analytics With Sirius — GTC 2026 — <https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-s81870/>
