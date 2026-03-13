---
layout: post
title:  "The Rise of GPU-Accelerated Databases"
date:   2026-03-10 10:00:00 -0700
categories: database gpu nvidia rapids
---

The need for GPU-accelerated databases is growing!


<div style="padding: 0.8em 1.4em; margin: 1.5em 0; font-size: 0.9em; color: #444; background-color: #f8f8f8; border-radius: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.08);">
<p style="margin: 0 0 0.6em 0; font-weight: bold; letter-spacing: 0.05em; text-transform: uppercase; font-size: 0.8em; color: #888;">TL;DR</p>
<ol style="margin: 0; padding-left: 1.4em; line-height: 1.7em;">
  <li><strong>AI agents are changing the analytics workload</strong> — agentic speculation is exploding demand for structured analytic compute in ways CPU-centered systems were not designed for.</li>
  <li><strong>CPU analytics has had a great run</strong> — disaggregated architectures, columnar formats, and vectorized execution made CPU-centered databases the backbone of enterprise analytics.</li>
  <li><strong>CPU performance gains are growing more slowly than GPU gains</strong> — AI training and inference investment is propelling GPU hardware far ahead of CPU in parallelism and memory bandwidth, generation over generation, widening the gap.</li>
  <li><strong>Research and industry are responding — but it's hard</strong> — SIGMOD and VLDB have seen a wave of GPU database papers since 2020, and GPU acceleration is reaching production tools, yet building correct, full-featured GPU query engines remains a formidable engineering challenge even as GPUs steadily absorb more of the compute landscape.</li>
  <li><strong>NVIDIA has built a moat with RAPIDS and libcudf</strong> — virtually every GPU-accelerated analytic system today is built on libcudf, making it the critical layer to understand in this space.</li>
  <li><strong>GTC 2026 is next week</strong> — several sessions will tackle these exact challenges; come find me there!</li>
</ol>
</div>

### The Analytics Workload Is Changing Fast — Enter AI Agents

In 2025, the LLM-powered AI agents have started proving their value and their adoption has been rapid spreading across enterprises, particularly for the purpose of data anlytics and insights extraction. It's [2025 State of AI in Enterprise report](https://www.databricks.com/blog/state-ai-enterprise-adoption-growth-trends) shows that companies are now moving from piloting the technology to actually deploying it in production, that "many companies focused on experimenting last year[2025] have crossed the threshold into operational AI systems"

Databricks is at the forefront of adopting AI LLM and agents technology and it is worthwile following how they have been preparing for the coming explosion in their adoption. Their latest [Lakebase architecture](https://www.databricks.com/blog/what-is-a-lakebase) Databricks show them positionning for both OLTP and OLAP kinds of workload requried by agents for the full automation of the Data Exploration and productionization pipeline.

> "This architecture eliminates much of the cost, complexity, and lock-in that have defined databases for decades, and it is especially powerful for modern AI and agent-driven workloads, where developers want to launch many instances, experiment freely, and pay only for what they use."

The latest [Genie](https://www.databricks.com/blog/introducing-genie-code) product is their version of the AI agents that will carry out this work, driven only by high level natural language command tied to business needs.

> Genie Code can autonomously carry out complex tasks such as building pipelines, debugging failures, shipping dashboards, and maintaining production systems.

Together these advanced will help bring AI agents onto the market simpliying much of the data science workflow. But Databricks believes a much bigger wave is ahead, one where Agents are unleased to search for insights by trying many different paths. They call this **Agent speculation**, a " a high-throughput process of exploration and solution formulation for the given task", for which Databricks engineers envision[\[2\]](#ref2) will require a redesign data system to be Agent-first.
> "Overall, as agentic workloads become more and more prevalent, the sheer scale and inefficiencies of agentic speculation will become the bottleneck, and our data systems will need to evolve in response"

The impact of the *analytics workload* will be profound. Future system will be designed almost exclusively with AI Agents as a first user, performing both exploration, idenitfy inisghts, and productionnizing their solutions. All this will be done from raw structure and unstructure data. Where will the engineering bottlenecks be? *Agentic speculation* will dramatically increases the velocity of both code generation and analytical workloads, dramatically increasing the effective memory bandwidth and working set memory requirements on the system supporting them. AI agents will also become more integrated into the data structure to provide intelligent data exploration. Do we have the right Software and Hardware to support this movement? Today we see a big invement on serving inference from GPUs  not enough of the analytics workloads have been accelerated and this is likely to become a big bottleneck

The question I'm thus posing is wherther current CPU-centered data processing system be capable of handling the scale needed to support these new agentic workloads, or whether we are at the cusp of seeing the value of GPU accelerated Database explode. 

### CPU-Centered Analytics: Decades of Dominance

In the past few decades, analytic query engines have been very successfully built around the CPU architecture, featuring a growing number of high-performance server cores (in the hundreds), deep cache hierarchies (in tens of MBs), and vectorized operations taking advantage of wider SIMD instruction sets (up to 512 bits wide).

To meet ever larger volumes of structured and unstructured data stored in object stores, these engines have moved towards disaggregated architectures enabling elastic scaling between data access and query processing, and with open columnar data formats like Parquet and Arrow, have enabled a wide ecosystem of query engines built on a composable data philosophy. It has been a remarkable run.

The milestones speak for themselves. [Snowflake](https://dl.acm.org/doi/10.1145/2882903.2903741)'s 2016 architecture pioneered separating compute from storage entirely, proving that cloud-native disaggregation could deliver elastic, multi-tenant analytics at scale. On the single-node analytical engine front, **[DuckDB](https://duckdb.org)** brought embeddable, vectorized OLAP to the edge; **[ClickHouse](https://clickhouse.com)** pushed columnar execution to extreme throughput on commodity hardware; and **[Umbra/CedarDB](https://cedardb.com)** pushed the boundary on single-node performance with JIT query compilation via LLVM and a hybrid row/columnar storage engine capable of handling both transactional and analytical workloads on a single system.

The composable data systems movement has further decoupled execution from storage, built on two key standards: **[Apache Arrow](https://arrow.apache.org)** as the universal in-memory columnar format enabling zero-copy data exchange between engines, and **[Substrait](https://substrait.io)** as a portable, cross-language query plan representation that lets a plan produced by one system be executed by another. On top of these, **[Velox](https://velox-lib.io)** (Meta) and **[Apache DataFusion](https://datafusion.apache.org)** provide reusable, modular physical execution engines that plug into larger systems rather than reinventing the wheel. This composability is now flowing upstream into the dominant distributed compute platforms — **[Gluten](https://github.com/apache/incubator-gluten)** brings Velox-backed native execution into Apache Spark, **[Apache DataFusion Comet](https://github.com/apache/datafusion-comet)** does the same using DataFusion as the native Rust backend, and **[Presto](https://prestodb.io)** has adopted Velox as its native C++ evaluation engine — extending the CPU performance frontier by replacing JVM-based execution with optimized native kernels.

### CPU Performance Gains Are Slowing Relative to GPU — And the Gap Is Widening

The challenge is compounded by a hardware divergence that is hard to ignore. CPUs continue to gain cores and memory capacity, but the rate of improvement is slowing: per-query latency gains are modest and memory bandwidth grows incrementally. GPUs, driven by the insatiable demand for AI training and inference, have been advancing at a far faster pace. The numbers bear this out concretely. Looking at NVIDIA's flagship data-center GPUs across three recent generations — each roughly one to two years apart:

| | H100 SXM (Hopper, 2022) | B200 (Blackwell, 2025) | Rubin GPU (Vera Rubin, 2026) |
|---|---|---|---|
| **HBM memory** | 80 GB HBM3 | 186 GB HBM3E | 288 GB HBM4 |
| **Memory bandwidth** | 3.4 TB/s | 8 TB/s | 22 TB/s |
| **FP32 compute (CUDA cores)** | 67 TFLOPS | 80 TFLOPS | 130 TFLOPS |
| **TDP** | 700W | 1,000W | ~1,200W |

Memory bandwidth — the single most important metric for analytical database workloads, which are almost universally memory-bound — has grown 6.5× in just four years: from 3.4 TB/s on H100 to 22 TB/s on the Rubin GPU. HBM capacity has nearly quadrupled over the same span. These are not incremental improvements; they are step-change advances that fundamentally alter what is possible for in-GPU analytics.

For contrast, server CPUs from Intel and AMD have seen real but incremental progress over the same period. AMD EPYC has been the more aggressive of the two — Turin (2024) tripled memory bandwidth relative to Milan (2021) by moving to 12-channel DDR5 and doubling the core count to 192. Intel's Xeon Platinum gains have been more modest, with bandwidth growing roughly 1.2× over three generations. But even AMD's best figure sits around 576 GB/s per socket — still 38× below a single Rubin GPU's 22 TB/s — and that gap is only widening. 

One area where CPUs retain a decisive advantage is addressable memory capacity: a dual-socket server can access several terabytes of DDR5 DRAM, while even the most capable GPU today tops out at 288 GB of HBM — and HBM remains orders of magnitude more expensive per gigabyte. For workloads whose datasets exceed GPU memory, this capacity gap is a hard constraint. TDP is also substantially lower for CPUs: a high-end Xeon or EPYC socket runs 250–500W, compared to 700W–1,000W+ for a data-center GPU — though CPU power envelopes have been rising fast, with top AMD EPYC and Intel Xeon parts nearly doubling their TDP over the past two generations, reflecting the same push for parallelism that is driving GPUs even higher. I'll be writing a detailed CPU-vs-GPU hardware comparison in the context of data system workloads in a future post.

### Research and Industry Are Responding — But It Is Hard

Unsurprisingly, the database research community has been paying close attention since 2020, with top conferences like SIGMOD and VLDB regularly accepting papers evaluating and building GPU-accelerated databases — both hybrid CPU-GPU and fully GPU-native. Recent 2025 highlights include:

- **Rethinking Analytical Processing in the GPU Era**[\[3\]](#ref3) (CIDR 2026) — Sirius, a GPU plugin for DuckDB that rethinks analytical processing natively on the GPU.
- **Scaling GPU-Accelerated Databases beyond GPU Memory Size**[\[4\]](#ref4) (VLDB 2025) — tackles the fundamental GPU memory capacity bottleneck with a hybrid CPU-GPU filtering strategy, achieving a 3.5× speedup over SQL Server at 1 TB scale on a single A100.
- **A Study of the Fundamental Performance Characteristics of GPUs and CPUs for Database Analytics**[\[5\]](#ref5) (SIGMOD 2020) — proposes Crystal, a GPU query library, and shows that full query GPU speedup can exceed the memory bandwidth ratio (up to 25×) due to CPU vectorization limitations.
- **GPU Database Systems Characterization and Optimization**[\[6\]](#ref6) (VLDB 2024) — systematically characterizes GPU database performance bottlenecks and proposes optimizations for modern workloads.

On the industry side, 2025 saw GPU acceleration reach mainstream data tools:

- GPU execution landed in CPU dataframe engines like **Velox**[\[7\]](#ref7) and **Polars**[\[8\]](#ref8).
- Theseus from Voltron published a remarkable paper[\[9\]](#ref9) on petabyte-scale GPU query processing, although the company unfortunately closed operations shortly after.

Despite genuine progress, building correct and performant GPU implementations of the full relational algebra remains enormously difficult. Managing GPU memory limits, PCIe transfer bottlenecks, operator fusion, and full SQL coverage is a hard engineering problem with no easy shortcut.

### NVIDIA's Moat: RAPIDS and libcudf

NVIDIA has seen this coming for a while and has been systematically building a moat through its RAPIDS AI[\[10\]](#ref10) ecosystem, first launched in 2018[\[11\]](#ref11) — well before the generative AI and LLM revolution had taken hold. At its core is a little know library, **libcudf** (and its sister libraries) — a highly optimized, native GPU foundation that underpins virtually all GPU-accelerated analytic systems being built today. It is the de facto single-node physical operator infrastructure in this space, and understanding it is the key to understanding how GPU databases actually work.

Yet despite its central role, in-depth technical coverage of libcudf's internals is surprisingly scarce. Most available material stays at the user-facing API level, leaving critical questions about kernel design, memory management, and performance characteristics largely undocumented outside of the source code itself. That gap is a big part of what is motivating my future posts.

In those posts, I'll be diving deep into the technical internals of libcudf and answering questions such as:

- ❓ How does libcudf translate relational operators into parallel GPU kernels?
- ❓ What hardware features power its kernels?
- ❓ What is the tooling like to evaluate the library's performance?
- ❓ Where do GPU memory and compute models impose hard limits?

### See You at GTC 2026

In the meantime, I'm heading to **GTC 2026** next week, where several sessions tackle exactly these GPU database engineering challenges. Here are the ones I'm planning to attend:

- Next-Gen Data Systems: GPU Acceleration for SQL and Vector Databases[\[12\]](#ref12)
- Shatter the Memory Wall: Composable Building Blocks for Massive Scale Analytics[\[13\]](#ref13)
- Scaling Deep Tabular: 360K Inferences per Second per GPU[\[14\]](#ref14)
- Build a GPU-Accelerated Database Engine With CUDA[\[15\]](#ref15)
- Scaling DuckDB Beyond Its Limits: GPU-Accelerated Analytics With Sirius[\[16\]](#ref16)

Will you be at GTC or tuning in? Excited about the momentum of GPU-accelerated analytics? Have questions about the software or hardware stack? Let me know below! 👇

`#DatabaseEngineering` `#Data` `#GPU` `#NVIDIA` `#RAPIDS` `#libcudf` `#Polars` `#DuckDB` `#GTC2026`

---

### References

<div style="font-size: 0.85em" markdown="1"><a name="ref1">[1]</a> Bridging the Operational and Analytical Worlds with Lakebase — VLDB 2026 keynote  
<https://vldb.org/2025/files/keynote/vldb25-keynote3.pdf>

<a name="ref2">[2]</a> Supporting Our AI Overlords: Redesigning Data Systems to be Agent-First  
<https://arxiv.org/pdf/2509.00997>

<a name="ref3">[3]</a> Rethinking Analytical Processing in the GPU Era  
<https://arxiv.org/pdf/2508.04701>

<a name="ref4">[4]</a> Scaling GPU-Accelerated Databases beyond GPU Memory Size — VLDB 2025  
<https://vldb.org/pvldb/vol18/p4518-li.pdf>

<a name="ref5">[5]</a> A Study of the Fundamental Performance Characteristics of GPUs and CPUs for Database Analytics — SIGMOD 2020  
<https://arxiv.org/pdf/2003.01178>

<a name="ref6">[6]</a> GPU Database Systems Characterization and Optimization — VLDB 2024  
<https://vldb.org/pvldb/vol17/p441-cao.pdf>

<a name="ref7">[7]</a> Accelerating Large-Scale Data Analytics with GPU-Native Velox and NVIDIA cuDF  
<https://developer.nvidia.com/blog/accelerating-large-scale-data-analytics-with-gpu-native-velox-and-nvidia-cudf/>

<a name="ref8">[8]</a> RAPIDS Adds GPU Polars Streaming, a Unified GNN API, and Zero-Code ML Speedups  
<https://developer.nvidia.com/blog/rapids-adds-gpu-polars-streaming-a-unified-gnn-api-and-zero-code-ml-speedups/>

<a name="ref9">[9]</a> Theseus: A Distributed and Scalable GPU-Accelerated Query Processing Platform Optimized for Efficient Data Movement  
<https://arxiv.org/pdf/2508.05029>

<a name="ref10">[10]</a> RAPIDS AI  
<https://rapids.ai/learn-more/>

<a name="ref11">[11]</a> GPU-Accelerated Data Analytics & Machine Learning (RAPIDS AI Launch, 2018)  
<https://developer.nvidia.com/blog/gpu-accelerated-analytics-rapids/>

<a name="ref12">[12]</a> Next-Gen Data Systems: GPU Acceleration for SQL and Vector Databases — GTC 2026  
<https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-cwes81481/>

<a name="ref13">[13]</a> Shatter the Memory Wall: Composable Building Blocks for Massive Scale Analytics — GTC 2026  
<https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-s81873/>

<a name="ref14">[14]</a> Scaling Deep Tabular: 360K Inferences per Second per GPU — GTC 2026  
<https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-s82431/>

<a name="ref15">[15]</a> Build a GPU-Accelerated Database Engine With CUDA — GTC 2026  
<https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-s82203/>

<a name="ref16">[16]</a> Scaling DuckDB Beyond Its Limits: GPU-Accelerated Analytics With Sirius — GTC 2026  
<https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-s81870/>

</div>
