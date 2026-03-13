---
layout: post
title:  "The Rise of GPU-Accelerated Data Analytics"
date:   2026-03-12 11:00:00 -0700
categories: database gpu nvidia rapids libcudf
---

The need for GPU-accelerated databases is growing!

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

### CPU Performance Gains Are Slowing Relative to GPU — And the Gap Is Widening

Yet even as software pushes the CPU performance frontier further, the underlying hardware is hitting diminishing returns. CPUs continue to gain cores and memory capacity, but the rate of improvement is slowing: per-query latency gains are modest and memory bandwidth grows incrementally. 

GPUs, driven by the insatiable demand for AI training and inference, have been advancing at a far faster pace. The numbers bear this out concretely. Looking at NVIDIA's flagship data-center CPU-GPU superchips across three recent generations, each roughly one to two years apart:

| | GH200 (Grace Hopper)[^gh200-spec] | GB200 (Grace Blackwell)[^gb200-spec] | VR200 (Vera Rubin)[^vr200-spec] |
|---|---|---|---|
| **Superchip Configuration** | 1x Grace CPU + 1x H200 GPU | 1x Grace CPU + 2x B200 GPUs | 1x Vera CPU + 2x R100 GPUs |
| **GPU HBM Memory** | 144 GB HBM3e | 384 GB HBM3e (192 GB × 2) | 576 GB HBM4 (288 GB × 2) |
| **CPU Memory (LPDDR5X)** | 480 GB | Up to 480 GB | Up to 1.5 TB |
| **Total Unified Memory** | **624 GB** | **Up to 864 GB** | **Up to 2.1 TB** |
| **GPU Memory Bandwidth** | 4.9 TB/s | 16 TB/s (8 TB/s × 2) | 44 TB/s (22 TB/s × 2) |
| **FP32 Compute** | 67 TFLOPS | 150 TFLOPS (75 × 2)* | 260 TFLOPS (130 × 2) |
| **CPU-to-GPU Interconnect** | NVLink-C2C (900 GB/s) | NVLink-C2C (900 GB/s) | NVLink-C2C (1.8 TB/s) |
| **TDP (Total Module)** | ~1,000W | ~2,700W | Est. 4,500W+ |

*\*Note: The individual B200 GPUs within the GB200 Superchip are slightly downclocked compared to the standalone 1000W SXM versions, delivering ~75 TFLOPS FP32 each rather than 80.*

Memory bandwidth, the single most important metric for analytical database workloads which are almost universally memory-bound, has grown roughly 9× across three superchip generations: from 4.9 TB/s on the GH200 to 44 TB/s on the VR200. HBM capacity has grown 4× over the same span, from 144 GB to 576 GB. The NVLink-C2C architecture further extends this by exposing unified memory that spans both HBM and LPDDR5X — the VR200 makes up to 2.1 TB (576 GB HBM4 + 1.5 TB LPDDR5X) accessible to the GPU, matching or exceeding typical dual-socket server configurations. That said, HBM remains orders of magnitude more expensive per gigabyte, and for workloads that spill beyond the fast HBM tier, performance falls back on the lower LPDDR5X bandwidth. Technologies like GPUDirect Storage push even further, establishing a direct DMA path between GPU memory and local or network-attached NVMe storage, bypassing the CPU and system memory entirely for workloads that exceed even the unified memory footprint.

For contrast, server CPUs from Intel and AMD have seen real but incremental progress over the same period. AMD EPYC has been the more aggressive of the two — Turin (2024) tripled memory bandwidth relative to Milan (2021) by moving to 12-channel DDR5 and doubling the core count to 192. Intel's Xeon Scalable gains have been more modest — moving from the 4th-generation Sapphire Rapids to the 5th-generation Emerald Rapids, memory bandwidth grew only ~1.2×, from ~307 GB/s to ~358 GB/s (both using 8-channel DDR5). But even AMD's best figure sits around 576 GB/s per socket — still 76× below the VR200 superchip's 44 TB/s — and that gap is only widening. The compute gap is similarly stark: the top-end EPYC 9965X (192 Zen5 cores at up to 5.0 GHz boost) delivers roughly 10–15 TFLOPS of peak FP32, meaning you would need somewhere between 17 and 26 EPYC sockets to match the 260 TFLOPS FP32 of a single VR200 superchip — a server footprint of 9–13 dual-socket nodes just to reach parity on raw compute throughput.

### GPU-Accelerated Databases Are Rising in Research and Industry

Unsurprisingly, the database research community has been paying close attention since 2020, with top conferences like SIGMOD and VLDB regularly accepting papers evaluating and building GPU-accelerated databases — both hybrid CPU-GPU and fully GPU-native. Recent highlights include:

- **Rethinking Analytical Processing in the GPU Era**[^sirius-cidr26] (CIDR 2026) — Sirius, a GPU plugin for DuckDB that rethinks analytical processing natively on the GPU.
- **Scaling GPU-Accelerated Databases beyond GPU Memory Size**[^gpudb-vldb25] (VLDB 2025) — tackles the fundamental GPU memory capacity bottleneck with a hybrid CPU-GPU filtering strategy, achieving a 3.5× speedup over SQL Server at 1 TB scale on a single A100.
- **GPU Database Systems Characterization and Optimization**[^gpudb-vldb24] (VLDB 2024) — systematically characterizes GPU database performance bottlenecks and proposes optimizations for modern workloads.
- **A Study of the Fundamental Performance Characteristics of GPUs and CPUs for Database Analytics**[^crystal-sigmod20] (SIGMOD 2020) — proposes Crystal, a GPU query library, and shows that full query GPU speedup can exceed the memory bandwidth ratio (up to 25×) due to CPU vectorization limitations.

On the industry side, 2025 saw GPU acceleration reach mainstream data tools:

- GPU execution landed in CPU dataframe engines like **Velox**[^velox-gpu] and **Polars**[^polars-gpu].
- The **RAPIDS Accelerator for Apache Spark**[^spark-rapids] enabled faster migration to GPU-accelerated distributed data engineering and analytics workloads.
- Theseus from Voltron published their design paper[^theseus] on petabyte-scale GPU query processing.

Despite genuine progress, building correct and performant GPU implementations of the full relational algebra remains enormously difficult. Managing GPU memory limits, PCIe transfer bottlenecks, operator fusion, and full SQL coverage is a hard engineering problem with no easy shortcut.

### NVIDIA's Moat: RAPIDS and libcudf

NVIDIA has seen this challenge coming for a while and has been systematically building a solution through its RAPIDS AI[^rapids-ai] ecosystem, first launched in 2018[^rapids-launch], well before the generative AI and LLM revolution had taken hold. At its core is a little-known C++ library, **libcudf** (and its sister libraries), a highly optimized, native GPU foundation that underpins virtually all GPU-accelerated analytic systems being built today. 

It is the de facto single-node physical operator infrastructure in this space, and understanding it is the key to understanding how GPU databases actually work. And yet, despite its central role, in-depth technical coverage of libcudf's internals is surprisingly scarce. Most available material stays at the user-facing API level, leaving critical questions about kernel design, memory management, and performance characteristics largely undocumented outside of the source code itself.

In future posts, I'll thus be diving deeper into the technical internals of libcudf and answering questions such as:

- ❓ How does libcudf translate relational operators into parallel GPU kernels?
- ❓ What is the tooling like to evaluate the library's performance?
- ❓ How is the libcudf used as a building blog for larger distributed systems?

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
