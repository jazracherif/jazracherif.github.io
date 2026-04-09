---
layout: post
title: "NVIDIA GTC 2026 Accelerated Analytics - Part 1: Technical Deep Dives"
date: 2026-04-06 00:00:00 -0700
categories: nvidia gtc
tags: []
toc: true
---

*This is Part 1 of a 3-part series on Accelerated Analytics at GTC 2026. Jump to [Part 2: Industry Use Cases & Training Labs](/nvidia/gtc/2026/04/06/accelerated-analytics-at-gtc-2026-part2-industry-cases-and-training-labs.html) or [Part 3: Overall GTC Analytics Takeaways](/nvidia/gtc/2026/04/06/accelerated-analytics-at-gtc-2026-part3-overall-gtc-analytics-takeaways.html).*

One of the big surprises at GTC2026 was the focus on accelerated Analytics for Enterprise AI.

### Technical Deep Dives

#### [🔗 The Era of GPU Data Processing: From SQL to Search and Back Again](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81769/) 

<small>
<strong>Joshua Patterson</strong> · VP, Solutions Architecture, NVIDIA<br>
<strong>Todd Mostak</strong> · Sr. Director of Engineering, NVIDIA
</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>This session delivers a technical state of the union on GPU-accelerated data processing across SQL/DataFrames, vector search, ML, and decision optimization. Learn how GPU-native engines enable interactive analytics on massive lakehouse-scale datasets, real-time semantic and vector search over billions of embeddings, and makes the hardest ML and decision science workloads tractable, cost-efficient, and energy-efficient. The talk highlights the implications for high-impact scientific and enterprise computing, then looks ahead to what's in flight for 2026 and beyond, outlining concrete architectural patterns and practical guidance for building the next generation of GPU-accelerated data platforms and using them in your day-to-day work.</p></details>

In this session, Joshua and Todd argue that CPU performance improvements on TPC-H have flattened over the past few years. They explore how the NVIDIA ecosystem can bring faster developments, either through adoption of the new Vera CPU, moving to cuDF/CuVS accelerated databases, or redesigning the data center clusters with analytics in mind so as to maximize the overlap of compute-intensive aggregations and joins vs IO-intensive tasks like shuffle and storage IO.


**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. CPU TPC-H price/performance has flatlined</strong></td>
  <td class="tk-time">@ 04:27</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Speakers argue that over the past few years CPU performance for analytics has not improved by orders of magnitude. For example, SQL Server and peers show only 15–20% gains every two years, probably just due to CPU refresh cycles. They also argue NVIDIA can help push the field forward.
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s81769-gpu-data-processing-cpu-tpch-flatlined.png" alt="CPU TPC-H price/performance has flatlined">
      <img src="/assets/img/gtc-2026/sessions/s81769-gpu-data-processing-tpch-over-time.png" alt="TPC-H performance over time — all best times have stagnated">

    </div>    
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. Vera CPU accelerates analytics for free</strong></td>
  <td class="tk-time">@ 05:17</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      Vera CPU shows impressive performance improvements for analytics workloads. Some of the attributes that make it a good fit are: 1) massive amount of memory BW (1.2 TB/s) 2) "tons of cross-section BW that avoids the NUMA locality problem seen in multi-socket machines" 3) lots of BW/per core (14 GB/s per core, 3× that of x86/ARM) <br>
      ➜ Vera gives analytics workloads a 2.5–3× lift with zero recompilation. Starburst, Kinetica, Redpanda all validate this. More GPU headroom per watt is the secondary win. Speakers show the performance on the TPC-DS Benchmark with Vera CPU compared to Intel and AMD for the <a href="https://www.starburst.io">Starburst Lakehouse</a>, which is built on Trino. 
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s81769-gpu-data-processing-vera-cpu-analytics-lift.png" alt="Vera CPU analytics performance lift">
      <img src="/assets/img/gtc-2026/sessions/s81769-gpu-data-processing-vera-starburst-benchmark.png" alt="Starburst benchmark on Vera CPU">
    </div>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Enterprise unstructured data: cuVS helps close the indexing gap</strong></td>
  <td class="tk-time">@ 08:54</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <span class="tk-body">
      90% of enterprise data is unstructured but only 10% is properly indexed. GPU-accelerated CAGRA (a graph nearest neighbor algorithm that outcompetes the CPU based HNSW) hits 10–13× faster indexing vs CPU HNSW at equivalent accuracy, on a cheaper instance. CuVS Plugin integration with Milvus, Elasticsearch, and OpenSearch means no rewrite required.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. 2% of queries consume 92% of cluster resources.</strong></td>
  <td class="tk-time">@ 11:15</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      An interesting statistic from Trino usage at Airbnb shows that 2% of queries consume 92% of cluster resources. cuDF was created to help with this, first as a simple pandas drop-in replacement, but now more targeted at accelerating large-scale systems like databases and lakehouses such as Spark, Trino, Presto, and DuckDB. Companion libraries support efficient memory management, filesystem transfer, distributed communication, data prefetching, etc.
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s81769-gpu-data-processing-small-number-of-big-queries.png" alt="2% of queries consume 92% of cluster resources">
      <img src="/assets/img/gtc-2026/sessions/s81769-gpu-data-processing-cudf-ecosystem.png" alt="cuDF ecosystem for GPU-accelerated data processing">
    </div>
  </td>
</tr>


<tr>
  <td class="tk-head"><strong>4. Sirius on DuckDB on a single GB300: 21 seconds for TPC-H 1 TB</strong></td>
  <td class="tk-time">@ 19:01</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="oss"></takeaway-tag>
    <span class="tk-body">
      The speakers reference a later session on SiriusDB showcasing how fast the acceleration is. The Sirius cuDF-DuckDB integration delivers 7× TCO on ClickBench. Transwarp's TPC-DS 150 GB run clocked 26× faster than CPU DuckDB on the same GPU. 
      <br>
      Another accelerated database mentioned <em>(@19:45)</em> is Heavy AI / OmniSci, which will be open-sourced in late Q2 2026. It features LLVM compilation engine, Vulkan in-process rendering, geospatial/time series support, fast OLAP. Todd Mostak is now at NVIDIA leading this.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. Theseus's Async mini-executor architecture + GPU Direct Storage help break the memory wall</strong></td>
  <td class="tk-time">@ 20:41</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <takeaway-tag name="storage"></takeaway-tag>
    <span class="tk-body">
      The Theseus engine from Voltron was able to run TPCH-100TB on 2 DGX A100 servers (each with 8× A100 80GB/GPU, 640GB total GPU HBM2e memory, 2TB/s per-GPU memory bandwidth, connected via NVLink 3.0 at 600GB/s) + 200 Gbps InfiniBand + GPU Direct Storage. GDS enables all GPUs to talk directly to storage network instead of waiting for data to be served via a single CPU attached to the system. The practical consequence: petabytes of NVMe storage becomes queryable working memory. Replacing the monolithic executor with specialized actors — compute, memory-tier management, prefetch/decode, networking — enabled true overlap of I/O and compute. The speakers described it as "an agent swarm for query processing." See the <a href="https://arxiv.org/pdf/2508.05029">Theseus paper</a> for more on the architecture.
    </span>
    <img src="/assets/img/gtc-2026/sessions/s81769-gpu-data-processing-theseus-breaking-memory-barrier.png" alt="">    
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>6. SPACE MICE, a reference design to push Data Analytics cluster to the next level </strong></td>
  <td class="tk-time">@ 24:53</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="comm"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      This design consists of 1) 1 GB200 NVL72 2) 9 DGX B300 3) 10 RTX PRO 6000 nodes 4) 20 RTX 4500. NVLink is mainly for all GPU-to-GPU shuffle (east-west, ~1.8 TB/s) while CX8 NICs are dedicated to storage I/O (north-south, 3–4 TB/s). The two networks run simultaneously and non-overlapping. 18 GPUs × 100 TB reachable per TB of GPU memory = ~1.8 PB per rack. Vera Rubin (144 GPUs) pushes this to ~5 PB.
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s81769-gpu-data-processing-space-mice-cluster.png" alt="SPACE MICE cluster configuration">
      <img src="/assets/img/gtc-2026/sessions/s81769-gpu-data-processing-space-mice-architecture.png" alt="SPACE MICE network architecture">
    </div>
  </td>
</tr>

</table>



#### [🔗 Unlock Fast, Cost-Effective Interactive Analytics on Massive Data Lakehouses](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81563/) 

<small><strong>Greg Kimball</strong> · Software Engineering Manager, NVIDIA<br><strong>Zoltán Arnold Nagy</strong> · Sr. Software Engineer, IBM Research</small>

<img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-presto-session.jpeg" alt="">


<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>Running interactive SQL at scale is still far slower, and more expensive, than it should be. This session explores how GPU acceleration fundamentally changes that equation. We'll dive into open-source community work speeding up the popular open data lakehouse engine Presto—work that required rethinking not just the core execution engine, but also the surrounding system components that drive performance at scale. We'll walk through benchmark results, lessons from real enterprise deployments, and the architectural details that actually matter in practice. You'll leave with concrete guidance for GPU-accelerating your own data processing workloads to achieve better performance at lower cost.</p></details>

This session focuses on the distributed SQL engine Presto and recent performance improvement for its GPU accelerated mode. It is presented by Greg from NVIDIA's cuDF team, and Zoltan from IBM Research and working on Presto. Presto C++ workers use the open source proejct Velox as single node query engine and velox provides experimental support for GPUs via the RAPIDS AI libraries including CuDF. See this [article](https://developer.nvidia.com/blog/accelerating-large-scale-data-analytics-with-gpu-native-velox-and-nvidia-cudf/) from last year on Velox over CuDF. The picture below shows the evolution of the Presto project from native Java to Natice C++. Together with Spark, Presto is one of the most stable and widely adopted open source systems for distributed data processing.

<img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-presto-gpu-tco.png" alt="Presto GPU TCO comparison">


**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. Presto GPU Node is 30× faster than an 8-node Grace CPU cluster on TPC-H SF1K</strong></td>
  <td class="tk-time">@ 05:29</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      The comparison baseline is "each node has a two socket Grace CPU" running the 22-query TPC-H-derived suite. Four B200 GPUs drop that to "30 times faster speed" — Supports caching ingested Parquet data. ThPowered by Velox and CuDF under the hood.
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-presto-gpu-benchmark.png" alt="Presto GPU: 30× faster than Grace CPU cluster on TPC-H SF1K">
      <img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-presto-gpu-operator-breakdown.png" alt="Presto GPU operator breakdown">
    </div>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. Table scan & Parquet I/O dominates TPCH Runtime — not compute</strong></td>
  <td class="tk-time">@ 07:22</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <span class="tk-body">
      The operator breakdown at SF-100 and SF-1K shows the "big blue part, parquet data source" dwarfs hash join, filter, and partitioning combined and accounts for 60-70% of the runtime. Tuning Presto GPU is almost entirely an I/O problem.
    </span>
    <img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-parquet-operator-breakdown.png" alt="Parquet table scan dominates Presto GPU operator breakdown">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Picking a good File Format Encoding + using NUMA pinning improves Performance by ~30%</strong></td>
  <td class="tk-time">@ 08:29</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <span class="tk-body">
      "The <strong>Delta binary packed encoding</strong> came out with Parquet… it makes a huge difference on GPU execution." For integer physical types, switching to <a href="https://parquet.apache.org/docs/file-format/data-pages/encodings/#DELTAENC">DBP encoding</a> is described as a way to make your data lake "scream fast on GPU." Also, <strong>NUMA pinning</strong> on DGX boxes gives a significant GPU speedup. On a DGX, one CPU is connected close to four of the GPUs. Keeping that CPU in charge of all CUDA launching and copy activity for its four GPUs improves throughput.
    </span>
    <img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-delta-binary-pack-encoding.png" alt="Delta Binary Pack encoding performance impact on GPU execution">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. 10x Lower TCO for Presto GPU when running all TPCH Queries</strong></td>
  <td class="tk-time">@ 09:33</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Greg's cost-per-run chart shows that for SF1K (1TB), a single GPU delivers better price/performance than four. At SF3K (3TB), three GPUs beat eight. The headline: "around a 10x benefit using Presto GPU versus Presto CPU" — but only if you <strong>optimize for cost</strong>, not raw speed. Perhaps counterintuitively, the $ cost per performance is more pronounced for smaller cluster with less capable hardware, "that's where the TCO story is" says Greg.
    </span>
    <img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-tco-cost-per-run.png" alt="Cost-per-run chart: fewer GPUs win on price/performance at SF1K and SF3K">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. UCX Exchange Operator helps enable 900 GB/s NVLink5 for Data Shuffle.</strong></td>
  <td class="tk-time">@ 13:22</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="comm"></takeaway-tag>
    <span class="tk-body">
      Zoltan's comparison: normal Linux kernel TCP "just doesn't have the bandwidth" once you go multi-hundred gigabit. NVLink 5 on Blackwell delivers "1800 gigabytes a second bi-directional bandwidth" — "900 gigabytes a second to move between GPU to GPU." Presto uses <strong>UCXExchange</strong> to select NVLink when available and falls back gracefully to RoCE or TCP otherwise. It's a drop-in replacement. Zoltan shows an a TPCH-SF1K benchmark comparison betweeen 16x Grace CPU (8 nodes), 8xA100 with Http exchange and 8xA100 with CuDFExchange and show the dramatric drop from 690s ➜ 453s ➜ 60s!
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-nvlink-shuffle.png" alt="NVLink 5 vs TCP shuffle bandwidth comparison">
      <img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-ucx-exchange.png" alt="UCXExchange abstraction layer for NVLink, RoCE, and TCP">
    </div>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>6. S3 on cloud has a *per-VM* BW ceiling AWS doesn't officially document</strong></td>
  <td class="tk-time">@ 19:18</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="pain"></takeaway-tag>
    <takeaway-tag name="comm"></takeaway-tag>
    <span class="tk-body">
      AWS will throttle traffict from a single VM. The workaround is to spin up CPU instances that pull from S3 in parallel and write directly to GPU memory bypassing host memory entirely. On B300, "AWS gives you 800 gigabit per GPU (100GB/s), and it has eight GPUs, 6.4 terabits a second of bandwidth (800GB/s) to fill up", performance you would never be able to achieve on a single S3 connection. 
    </span>
    <img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-s3-per-vm-bw.png" alt="S3 per-VM bandwidth ceiling and GPU memory bypass workaround">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>7. Velox "Async data Cache" improvements drop the runtime further for hot queries</strong></td>
  <td class="tk-time">@ 24:29</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <takeaway-tag name="comm"></takeaway-tag>
    <span class="tk-body">
      By reading Parquet metadata first to predict what will be fetched, nearby small reads are combined into larger requests: "just coalescing the reads drops your request number from 700 to around 200." Parallelism is preserved but metadata overhead drops, pushing the hot run to ~20 seconds — described as "basically saturating the PCI Express bus on the RTX 6000."
      <img src="/assets/img/gtc-2026/sessions/s81563-lakehouse-analytics-velox-async-cache.png" alt="Velox async data cache extended for GPU usage">
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>8. UDF needs more support in libcudF + Overlapping shuffle with parquet </strong></td>
  <td class="tk-time">@ 34:30</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="pain"></takeaway-tag>
    <takeaway-tag name="comm"></takeaway-tag>
    <span class="tk-body">
      JIT compilation for supporting <strong>User defined functions</strong> in libcudf will be a big of the story needed to bridge the gap to wider adoption in the industry. Also supporting parallel IO traffic from different sources such as for shuffle and table scan was a big challenge. A recent article digs into the latest JIT improvements in CuDF for string transform UDFs <a href="https://developer.nvidia.com/blog/efficient-transforms-in-cudf-using-jit-compilation/">Efficient Transforms in cuDF Using JIT Compilation</a>
    </span>
  </td>
</tr>


</table>

#### [🔗 Achieving 8x Lower Cost Analytics with GPU-Accelerated DuckDB](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81870/) 

<small><strong>Bobbi Yogatama</strong> · Sr. Systems Software Engineer, NVIDIA<br><strong>Xiangyao Yu</strong> · Assistant Professor, University of Wisconsin-Madison</small>

<img src="/assets/img/gtc-2026/sessions/s81870-duckdb-sirius-session.jpeg" alt="">

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>DuckDB has become the analytical engine of choice everywhere—from notebooks and embedded applications to production data workflows. At the same time GPUs have rapidly evolved into powerful and cost-efficient engines for general-purpose parallel compute. Sirius brings these two trends together by enabling GPU-native execution for DuckDB—without requiring users to change how they write queries. In this session, we'll explore how Sirius offloads DuckDB workloads to GPUs, accelerating analytics by up to 8x at the same hardware rental cost. Learn how this new architecture combines DuckDB's simplicity with the power of GPU compute, unlocking faster, more cost-efficient interactive analytics while preserving the elegance of a single-node engine.</p></details>

GPU is becoming a general purpose computing system. OLAP data systems stand to benefit because there are lots of parallelizable algorithms in analytics. Recent SW/HW trends are helping overcome traditional challenges to GPU accelerated databases like GPU memory, CPU-GPU PCIe bottlenck, and engineering complexity. Sirius uses duckDb modularity to bring GPU acceleration without having to change end user queries. More in the recent article <a href="https://developer.nvidia.com/blog/nvidia-gpu-accelerated-sirius-achieves-record-setting-clickbench-record/">NVIDIA CUDA-X Powers the New Sirius GPU Engine for DuckDB, Setting ClickBench Records</a>

<div class="image-grid">
  <img src="/assets/img/gtc-2026/sessions/s81870-duckdb-sirius-clickbench-leaderboard.png" alt="Sirius ClickBench leaderboard — #1 and #2 on hot run">
  <img src="/assets/img/gtc-2026/sessions/s81870-duckdb-sirius-architecture.png" alt="Sirius — A GPU-Native SQL Engine architecture overview">
</div>

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. ClickBench world record: Sirius holds #1 and #2 on hot run at $2/hr</strong></td>
  <td class="tk-time">@ 06:37</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      Sirius took both first and second place on the ClickBench hot-run leaderboard — GH200 on LambdaLabs and H100 on AWS — and holds first on the combined run. The GH200 instance costs $2/hr, far below the CPU-based systems it beats. When you normalize for cost, the gap widens even further.
    </span>
    <img src="/assets/img/gtc-2026/sessions/s81870-duckdb-sirius-clickbench-hot-run.png" alt="Sirius ClickBench hot-run: #1 GH200 and #2 H100 at $2/hr">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. GPU-only execution: fall back to DuckDB entirely, never hybrid</strong></td>
  <td class="tk-time">@ 07:53</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <span class="tk-body">
      Sirius does not mix CPU and GPU execution within a single query. When it encounters an unsupported operator, it falls back cleanly to stock DuckDB — "the worst performance that you can get is a DuckDB performance, which is pretty damn good." This avoids the complexity and performance cliffs of hybrid scheduling while preserving correctness. It's interesting that the direction of newer systems seems to be GPU or CPU only rather than hybrid CPU-GPU execution which has been a topic of research in the past few years from the speaker's own work with <a href="https://www.vldb.org/pvldb/vol15/p2491-yogatama.pdf">Mordred</a> as well as other projects like CoGaDB, Ocelot, and HetExchange. See Yogatama's <a href="https://search.library.wisc.edu/digital/AHPRELL5IHBT6T8M">phD thesis</a> for more details, including Sirius.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Live demo: TPC-H Q9 on 1TB Parquet — 2.5s vs 16s, data exceeds GPU memory</strong></td>
  <td class="tk-time">@ 10:30</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      On a GB300 DGX station, Sirius completes TPC-H Query 9 against a 1 TB Parquet dataset in 2.5 seconds; DuckDB on CPU takes 16 seconds. The data intentionally exceeds GPU memory — <strong>cuCascade</strong> spills transparently to host. Results between the two engines are identical. The CPU instance was c8id.metal-96xl which contains a 384 cores Intel Xeon CPU with 768GiB memory.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. DuckDB creator announces Sirius as the official GPU extension</strong></td>
  <td class="tk-time">@ 12:03</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="oss"></takeaway-tag>
    <span class="tk-body">
      Hannes Mühleisen, creator of DuckDB, appeared on stage to announce that Sirius will become a <strong>core DuckDB extension</strong> — "the blessed way of running queries on GPUs with DuckDB." This signals GPU-accelerated execution moving from an external experiment to an officially endorsed path in the DuckDB ecosystem.
    </span>
    <img src="/assets/img/gtc-2026/sessions/s81870-duckdb-sirius-duckdb-creator-announcement.jpg" alt="Hannes Mühleisen announces Sirius as the official DuckDB GPU extension">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. Sirius implements has separate executors for compute and spilling</strong></td>
  <td class="tk-time">@ 24:43</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      In Sirius a collection of Data Batches are managed by a <strong>Data Repository</strong> Managers that relies on <a href="https://github.com/NVIDIA/cuCascade">CuCascade</a> and a downgrader executor to manage spilling either back to the CPU host memory or to the GPU. Data spilling can happen simultaneously with the data processing on other data in the GPU. New operators are added in the plan to support spilling from GPUs.
    </span>
    <div class="image-grid">
      <img src="/assets/img/gtc-2026/sessions/s81870-duckdb-sirius-executor-spilling.png" alt="Sirius separate executors for compute and spilling">
      <img src="/assets/img/gtc-2026/sessions/s81870-duckdb-sirius-executor-spilling2.png" alt="Sirius executor spilling architecture detail">
    </div>
  </td>
</tr>


<tr>
  <td class="tk-head"><strong>6. Sirius achieves 5x speed for DuckDB on TPC-H queries using 1 DGX GB300</strong></td>
  <td class="tk-time">@ 24:43</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      Running the full TPC-H SF1K (1 TB) suite on a DGX GB300 node, Sirius completes all 22 queries in 21 seconds total — a 5× speedup over DuckDB. The presenter notes: "the TPC-H official record is actually slower than 21 seconds," implying this result, while informal, would be the fastest ever recorded at this scale factor. Compare with Presto performance shown in previous session which got 24s on a 1/2 DGX B200 node (using only 4x B200)
    </span>
    <img src="/assets/img/gtc-2026/sessions/s81870-duckdb-sirius-tpch-21s.png" alt="TPC-H 1TB performance evaluation showing Sirius at 21 seconds">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>7. 9× TCO at the same $2/hr cost: GH200 Lambda Lab vs AWS CPU instance</strong></td>
  <td class="tk-time">@ 25:53</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      On the SF300 hot-run benchmark, Sirius on a GH200 (2022 Grace-Hopper on LambdaLabs, $2/hr) delivers 9× better TCO than DuckDB running on a comparably priced AWS Intel CPU instance (r8i.8xlarge). Same dollar spend, same wallclock budget — 9× the throughput. The implication: GPU instances are no longer a premium option; at equivalent cost they dominate.
    </span>
    <img src="/assets/img/gtc-2026/sessions/s81870-duckdb-sirius-tco-gh200-vs-cpu.png" alt="9× TCO: Sirius on GH200 vs AWS CPU instance at same $2/hr cost">
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>8. Sirius manages its own pinned memory cache — 2× transfer speedup on GB300</strong></td>
  <td class="tk-time">@ 32:43</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      Rather than relying on the OS page cache, Sirius maintains its own pinned memory buffer. This allows it to transfer data from host in compressed form and decompress on the GPU, bypassing the pageable memory path entirely. On GB300, this yields up to 2× higher sustained transfer throughput — a gain that disappears if you let the OS manage the cache.
    </span>
  </td>
</tr>

</table>

#### [🔗 Shatter the Memory Wall: Composable Building Blocks for Massive Scale Analytics](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81873/)

<small><strong>Felipe Aramburu</strong> · Distinguished Solutions Architect, NVIDIA<br><strong>Rodrigo Aramburu</strong> · Developer Relations for Data Processing, NVIDIA</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>As GPU-accelerated analytics scale to terabytes and beyond, memory management and observability become critical infrastructure. We introduce a composable, engine-agnostic approach to shattering GPU memory limits and understanding query-level resource consumption. We'll deep-dive into cuCascade, a library for memory reservation and topology discovery that prevents out-of-memory failures by gracefully spilling data between GPU, host, and disk memory tiers. We'll also introduce a semantic telemetry layer for always-on profiling, enabling developers to visualize query plans and resource throughput across GPUs in real time. We demonstrate both tools working together inside Sirius, NVIDIA's GPU-native analytics engine, showing real telemetry output and memory tier management on live workloads. Learn how these composable building blocks help engine developers identify bandwidth bottlenecks, optimize memory utilization, and push toward speed-of-light analytics performance.</p></details>

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. Memory frugality: pay extra compute to shrink bytes in HBM</strong></td>
  <td class="tk-time">@ 01:44</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      The session opens with a conceptual inversion of the CPU paradigm. On CPU, you minimize compute to save memory bandwidth. On GPU, the argument is the opposite: "pay a higher computational cost because there is leftover compute inside the GPU to shrink the amount of bytes for the amount of time that you necessarily have them in memory." Memory is the scarce resource; compute is not.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. 100 TB TPC-H on 1.28 TB GPU working memory — 20× ratio via spill</strong></td>
  <td class="tk-time">@ 03:09</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Theseus — the research system behind cuCascade — processed the full 100 TB TPC-H/TPC-DS suite using only 1.28 TB of GPU working memory. With host memory (9.28 TB total), the effective data-to-GPU-memory ratio is roughly 20×. This is the existence proof for cuCascade's design: a single node can handle workloads orders of magnitude larger than its HBM capacity.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. cuCascade is open source on GitHub, released at GTC 2026</strong></td>
  <td class="tk-time">@ 05:00</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="oss"></takeaway-tag>
    <span class="tk-body">
      The cuCascade library — covering topology discovery, memory reservation, and data movement primitives — was open-sourced on GitHub at the time of this talk. Engine developers can adopt it today to add multi-tier spill, memory reservation, and topology-aware scheduling without building these components from scratch.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. TPC-H Query 9 "blew up aggressively" without cuCascade's downgrade policy</strong></td>
  <td class="tk-time">@ 19:01</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="pain"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      During the SF1K run, Query 9 was the query that most aggressively exceeded GPU memory — "that's the one that actually ended up blowing up on us quite aggressively." Without cuCascade's downgrade policy (which detects memory pressure and transparently degrades to host spill), the query would have OOM'd and terminated. The downgrade policy is what separates a working system from a fragile one.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. cuCascade was a blank slate on January 1st — enabled 21s SF1K by GTC</strong></td>
  <td class="tk-time">@ 19:33</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      "The gauntlet was thrown" to hit the 21-second SF1K TPC-H result, and cuCascade was built from a blank slate starting January 1st, 2026. Three months later it was live on stage. The achievement — 21 seconds across all 22 queries on a GB300 DGX station — is what cuCascade made possible by preventing OOM failures in the hardest queries.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>6. Always-on telemetry at under 0.1% overhead — no need to turn it off</strong></td>
  <td class="tk-time">@ 27:13</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="comm"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <span class="tk-body">
      The custom Rust-based telemetry layer captures cluster-wide data movement, per-operator throughput, and memory tier transitions with less than 0.1% runtime overhead — "you're not gonna have to pay this penalty." Existing tools (OpenTelemetry, Grafana, Prometheus, NSYS) were evaluated and rejected as too heavyweight for always-on use at this scale. The system was built from scratch specifically for distributed GPU analytics.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>7. cuCascade makes cuDF multi-GPU — a capability cuDF doesn't have natively</strong></td>
  <td class="tk-time">@ 36:06</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="comm"></takeaway-tag>
    <span class="tk-body">
      "cuDF itself is not intended to be a multi-GPU library. But leveraging it with cuCascade... you're able to do that multi-GPU computation with cuDF." cuCascade provides the topology-aware routing and data movement layer that lets cuDF operate across GPU boundaries — enabling multi-GPU scale-out without modifying cuDF itself.
    </span>
  </td>
</tr>

</table>


#### [🔗 Top-K Selection at the Speed of Light](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81614/)

<small><strong>Christina Zhang</strong> · DevTech Compute Engineer, NVIDIA<br><strong>Elias Stehle</strong> · Senior Systems Software Engineer, NVIDIA<br><strong>Yue Weng</strong> · DevTech, NVIDIA</small>

<details class="session-abstract"><summary>NVIDIA Session overview</summary><p>Explore new techniques for top-k selection, a critical operation for accelerating scientific computing and mixture of experts that efficiently extracts the most relevant items from massive datasets. Dive into the design of our state-of-the-art GPU algorithm, cub::DeviceTopK, and learn how leveraging this primitive can accelerate high-throughput workloads by over 160x compared to previous methods.</p></details>

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. DeviceTopK delivers up to 5× speedup over full radix sort</strong></td>
  <td class="tk-time">@ 02:08</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      Sorting an entire array to extract the top K elements is wasteful — you sort data you'll never use. `cub::DeviceTopK` skips the full-sort step and delivers up to 5× speedup. The key insight is that selection and sorting are fundamentally different problems, and conflating them for convenience has a measurable performance cost at GPU scale.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. Passing unsorted + non-deterministic flags unlocks even faster selection</strong></td>
  <td class="tk-time">@ 07:28</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      DeviceTopK accepts output constraint flags: whether the top-K results must be sorted, and whether ties must be broken deterministically. Many applications — such as feeding a parallel sampler downstream — don't need either guarantee. Passing `no-guarantee-determinism` and `unsorted` allows the algorithm to skip ordering and bookkeeping work entirely, yielding significant runtime improvements on top of the base speedup.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Fancy iterators eliminate intermediate buffers — up to 1.5× speedup</strong></td>
  <td class="tk-time">@ 09:25</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="algo"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      A common pattern before top-K is generating an index array (0, 1, 2, ..., N−1) to pair values with their positions. With a CUB counting iterator, that array is generated lazily — never materialized in memory. This alone yields up to 1.5× speedup for typical workloads by eliminating an unnecessary allocation and write, with no change to correctness.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. Drug discovery: 50 billion compounds, 30 minutes → 11 seconds on a single GPU</strong></td>
  <td class="tk-time">@ 30:22</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      Numerion Labs uses DeviceTopK inside their APEX drug discovery pipeline, which screens compounds against a 50-billion-molecule library. The runtime drops from 30 minutes on CPU to 11 seconds on a single RTX 6000 Ada GPU — a 164× acceleration. The workload fits naturally into a top-K selection pattern: find the highest-affinity compounds across a massive search space, fast enough to iterate in a single session.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. Iteration-fused design: 16 kernel calls reduced to 4</strong></td>
  <td class="tk-time">@ 17:02</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="algo"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <span class="tk-body">
      The naive radix-based top-K implementation issues ~16 kernel calls per selection — iterating pass by pass, writing intermediate results to global memory between each step. The iteration-fused design computes the current iteration's filter and the next iteration's histogram in a single kernel, reading input data only once per iteration and cutting the total kernel call count to 4. Fewer launches and fewer memory reads compound into a substantial end-to-end speedup.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>6. Adaptive buffer strategy: algorithm auto-selects approach per histogram observation</strong></td>
  <td class="tk-time">@ 21:24</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="algo"></takeaway-tag>
    <span class="tk-body">
      After each radix pass, the algorithm inspects the histogram to judge how concentrated or spread the surviving candidates are. Based on this, it dynamically decides whether to use a buffer (for skewed distributions) or skip it (for uniform data). No user input or tuning is required — the algorithm adapts to the actual data distribution at runtime, making it robust across diverse workloads.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>7. 1 billion elements in under 100ms on B200 — consistently fastest in class</strong></td>
  <td class="tk-time">@ 25:03</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <span class="tk-body">
      On a B200 GPU, DeviceTopK processes 1 billion elements in under 100 milliseconds. Benchmarks show it consistently outperforms PyTorch's built-in topk and the previous state-of-the-art, RadixGlass, across all tested K values and data sizes. The algorithm is production-ready and available in the CUB library today.
    </span>
  </td>
</tr>

</table>

<style>
  .post-content h4 a { color: #111827; text-decoration: none; }
  .post-content h4 a:hover { color: #2a7ae2; text-decoration: none; }
</style>

---

*[Part 2: Industry Use Cases & Training Labs →](/nvidia/gtc/2026/04/06/accelerated-analytics-at-gtc-2026-part2-industry-cases-and-training-labs.html)*

