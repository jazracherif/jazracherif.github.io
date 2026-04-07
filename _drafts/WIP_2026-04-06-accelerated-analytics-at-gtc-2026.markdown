---
layout: post
title: "Accelerated Analytics at GTC 2026"
date: 2026-04-06 00:00:00 -0700
categories: []
tags: []
---

One of the big surprises at GTC2026 was the focus on accelerated Analytics for Enterprise AI. In this post, i dive into the annoucements and cover the several session covering these topics

<div class="tldr">
<p class="tldr-label">TL;DR</p>
<ol>
  <li><strong>KEY_POINT_1</strong> — Brief explanation.</li>
  <li><strong>KEY_POINT_2</strong> — Brief explanation.</li>
  <li><strong>KEY_POINT_3</strong> — Brief explanation.</li>
</ol>
</div>

### <FIRST_SECTION_HEADING>

we will cover the following 

### Technical Deep Dives

#### [🔗](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81769/) The Era of GPU Data Processing: From SQL to Search and Back Again

<small><strong>Joshua Patterson</strong> · VP, Solutions Architecture, NVIDIA<br><strong>Todd Mostak</strong> · Sr. Director of Engineering, NVIDIA</small>

<details class="session-abstract"><summary>Session overview</summary><p>This session delivers a technical state of the union on GPU-accelerated data processing across SQL/DataFrames, vector search, ML, and decision optimization. Learn how GPU-native engines enable interactive analytics on massive lakehouse-scale datasets, real-time semantic and vector search over billions of embeddings, and makes the hardest ML and decision science workloads tractable, cost-efficient, and energy-efficient. The talk highlights the implications for high-impact scientific and enterprise computing, then looks ahead to what's in flight for 2026 and beyond, outlining concrete architectural patterns and practical guidance for building the next generation of GPU-accelerated data platforms and using them in your day-to-day work.</p></details>


**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. CPU TPC-H price/performance has flatlined</strong></td>
  <td class="tk-time">@ 04:27</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      SQL Server and peers show only 15–20% gains every two years probably just due to CPU refresh cycles. An interesting number from trino Usage at Airbnb says <em>(@ 12:20)</em>: 2% of queries consume 92% of cluster resources.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. Vera is the surprising GPU companion story</strong></td>
  <td class="tk-time">@ 05:17</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      Some of the attributes taht makes Vera good for analytics and processing are: 1) massive amount of Memory Bw 1.2 TB/s, 2) "tons of cross-section BW avoid numa locality pb with multi socket machines 3) lost of BW/per core at 14 GB/s per core (3× x86/ARM), Vera gives analytics workloads a 2.5–3× lift with zero recompilation. Starburst, Kinetica, Redpanda all validate this. More GPU headroom per watt is the secondary win.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Only 10% of enterprise unstructured data is properly indexed — cuVS closes that gap</strong></td>
  <td class="tk-time">@ 08:54</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <span class="tk-body">
      GPU-accelerated cagra (a graph HNSW variant) hits 10–13× faster indexing vs CPU HNSW at equivalent accuracy, on a cheaper instance. Plugin integration with Milvus, Elasticsearch, and OpenSearch means no rewrite required.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. DuckDB on a single GB300: 21 seconds for TPC-H 1 TB</strong></td>
  <td class="tk-time">@ 19:01</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      The speakers were careful not to name the existing world record, but the implication was clear. The Sirius cuDF-DuckDB integration delivers 7× TCO on ClickBench. Transwarp's TPC-DS 150 GB run clocked 26× faster than CPU DuckDB on the same GPU.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. Heavy AI / OmniSci going open source late Q2 2026</strong></td>
  <td class="tk-time">@ 19:45</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="oss"></takeaway-tag>
    <span class="tk-body">
      Full stack: LLVM compilation engine, Vulkan in-process rendering, geospatial/time series support, fast OLAP. Todd Mostak is now at NVIDIA leading this. Worth watching for anyone who wanted GPU-native SQL without the enterprise price tag.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>6. GPU Direct Storage collapses the memory hierarchy</strong></td>
  <td class="tk-time">@ 20:41</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <takeaway-tag name="design"></takeaway-tag>
    <span class="tk-body">
      Theseus engine was able to run TPCH-100TB on 2 DGX A100 servers (each with 8× A100 80GB/GPU, 640GB total GPU HBM2e memory, 2TB/s per-GPU memory bandwidth, connected via NVLink 3.0 at 600GB/s) + 200Gbs Infiniband + GPU Direct Storage. GDS enables all GPUs to talk directly to storage network instead of waiting for data to be served via a single CPU attached to the system. The practical consequence: petabytes of NVMe storage becomes queryable working memory.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>7. Async mini-executor decomposition was Theseus's secret</strong></td>
  <td class="tk-time">@ 22:52</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="comm"></takeaway-tag>
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      Replacing the monolithic executor with specialized actors — compute, memory-tier management, prefetch/decode, networking — enabled true overlap of I/O and compute. The speakers described it as "an agent swarm for query processing." See the <a href="https://arxiv.org/pdf/2508.05029">Theseus paper</a> for more on the architecture.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>8. SPACE MICE cluster for Data Analytics</strong></td>
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
      The cluster design uses NVLink for all GPU-to-GPU shuffle (east-west, ~1.8 TB/s) while repurposing CX8 NICs entirely for storage I/O (north-south, 3–4 TB/s). The two networks run simultaneously and non-overlapping. 18 GPUs × 100 TB reachable per TB of GPU memory = ~1.8 PB per rack. Vera Rubin (144 GPUs) pushes this to ~5 PB.
    </span>
  </td>
</tr>

</table>



#### [🔗](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81563/) Unlock Fast, Cost-Effective Interactive Analytics on Massive Data Lakehouses

<small><strong>Greg Kimball</strong> · Software Engineering Manager, NVIDIA<br><strong>Zoltán Arnold Nagy</strong> · Sr. Software Engineer, IBM Research</small>

<details class="session-abstract"><summary>Session overview</summary><p>Running interactive SQL at scale is still far slower, and more expensive, than it should be. This session explores how GPU acceleration fundamentally changes that equation. We'll dive into open-source community work speeding up the popular open data lakehouse engine Presto—work that required rethinking not just the core execution engine, but also the surrounding system components that drive performance at scale. We'll walk through benchmark results, lessons from real enterprise deployments, and the architectural details that actually matter in practice. You'll leave with concrete guidance for GPU-accelerating your own data processing workloads to achieve better performance at lower cost.</p></details>

**Takeaways**

<table class="takeaway-table">

<tr>
  <td class="tk-head"><strong>1. Presto GPU: 30× faster than an 8-node Grace CPU cluster on TPC-H SF1K</strong></td>
  <td class="tk-time">@ 05:29</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <span class="tk-body">
      The comparison baseline is "each node has a two socket Grace CPU" running the 22-query TPC-H-derived suite. Four B200 GPUs drop that to "30 times faster speed" — and the input is hot-cache Parquet, exactly what you'd have in a real data lake.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>2. Table scan / Parquet I/O dominates — not compute</strong></td>
  <td class="tk-time">@ 07:22</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <span class="tk-body">
      The operator breakdown at SF-100 and SF-1K shows the "big blue part, parquet data source" dwarfs hash join, filter, and partitioning combined. Tuning Presto GPU is almost entirely an I/O problem.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>3. Delta Binary Pack encoding is a hidden performance lever</strong></td>
  <td class="tk-time">@ 08:29</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <span class="tk-body">
      "The Delta binary packed encoding came out with Parquet… it makes a huge difference on GPU execution." For integer physical types, switching to DBP encoding is described as a way to make your data lake "scream fast on GPU."
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>4. NUMA pinning on DGX boxes gives a significant GPU speedup that Velox ignores on CPU</strong></td>
  <td class="tk-time">@ 08:53</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="design"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <span class="tk-body">
      On a DGX, "one CPU is connected close to four of the GPUs." Keeping that CPU in charge of all CUDA launching and copy activity for its four GPUs improves throughput — but "Velox is not NUMA aware today, so the CPU side doesn't really benefit from that."
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. The TCO sweet spot is fewer, cheaper GPUs — not the biggest box</strong></td>
  <td class="tk-time">@ 09:33</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Greg's cost-per-run chart shows that for SF1K, a single GPU delivers better price/performance than four. At SF3K, three GPUs beat eight. The headline: "around a 10x benefit using Presto GPU versus Presto CPU" — but only if you optimize for cost, not raw speed.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>6. Everything is open source and actively upstreaming</strong></td>
  <td class="tk-time">@ 12:03</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="oss"></takeaway-tag>
    <span class="tk-body">
      All development happens in public Velox and Presto repositories: "you can see our PRs, you can see us argue." The IBM Research Preview branches contain work that isn't upstream yet, but the goal is "to push down to very minimal over the coming months."
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>7. NVLink 5 is 900 GB/s GPU-to-GPU — TCP shuffle on Linux can't come close</strong></td>
  <td class="tk-time">@ 14:27</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="comm"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      Zoltan's comparison: normal Linux kernel TCP "just doesn't have the bandwidth" once you go multi-hundred gigabit. NVLink 5 on Blackwell delivers "1800 gigabytes a second bi-directional bandwidth" — "900 gigabytes a second to move between GPU to GPU." UCX is the abstraction that selects NVLink when available and falls back gracefully to RoCE or TCP otherwise.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>8. S3 on cloud has a per-VM bandwidth ceiling AWS doesn't officially document</strong></td>
  <td class="tk-time">@ 19:18</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="pain"></takeaway-tag>
    <takeaway-tag name="memory-bw"></takeaway-tag>
    <span class="tk-body">
      The workaround: spin up CPU instances that pull from S3 in parallel and write directly to GPU memory, bypassing host memory entirely. On B300, "AWS gives you 800 gigabit per GPU, and it has eight GPUs" — "6.4 terabits a second of bandwidth to fill up" — which a single S3 connection can never saturate.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>9. Coalescing S3 reads drops request count from 700 to ~200 for Q1</strong></td>
  <td class="tk-time">@ 24:29</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="storage"></takeaway-tag>
    <takeaway-tag name="algo"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      By reading Parquet metadata first to predict what will be fetched, nearby small reads are combined into larger requests: "just coalescing the reads drops your request number from 700 to around 200." Parallelism is preserved but metadata overhead drops, pushing the hot run to ~20 seconds — described as "basically saturating the PCI Express bus on the RTX 6000."
    </span>
  </td>
</tr>

</table>

#### [🔗](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81870/) Achieving 8x Lower Cost Analytics with GPU-Accelerated DuckDB

<small><strong>Bobbi Yogatama</strong> · Sr. Systems Software Engineer, NVIDIA<br><strong>Xiangyao Yu</strong> · Assistant Professor, University of Wisconsin-Madison</small>

<details class="session-abstract"><summary>Session overview</summary><p>DuckDB has become the analytical engine of choice everywhere—from notebooks and embedded applications to production data workflows. At the same time GPUs have rapidly evolved into powerful and cost-efficient engines for general-purpose parallel compute. Sirius brings these two trends together by enabling GPU-native execution for DuckDB—without requiring users to change how they write queries. In this session, we'll explore how Sirius offloads DuckDB workloads to GPUs, accelerating analytics by up to 8x at the same hardware rental cost. Learn how this new architecture combines DuckDB's simplicity with the power of GPU compute, unlocking faster, more cost-efficient interactive analytics while preserving the elegance of a single-node engine.</p></details>

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
      Sirius takes both first and second place on the ClickBench hot-run leaderboard — GH200 on LambdaLabs and H100 on AWS — and holds first on the combined run. The GH200 instance costs $2/hr, far below the CPU-based systems it beats. When you normalize for cost, the gap widens even further.
    </span>
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
      Sirius does not mix CPU and GPU execution within a single query. When it encounters an unsupported operator, it falls back cleanly to stock DuckDB — "the worst performance that you can get is a DuckDB performance, which is pretty damn good." This avoids the complexity and performance cliffs of hybrid scheduling while preserving correctness.
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
      On a GB300 DGX station, Sirius completes TPC-H Query 9 against a 1 TB Parquet dataset in 2.5 seconds; DuckDB on CPU takes 16 seconds. The data intentionally exceeds GPU memory — cuCascade spills transparently to host. Results between the two engines are identical.
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
      Hannes Mühleisen, creator of DuckDB, appeared on stage to announce that Sirius will become a core DuckDB extension — "the blessed way of running queries on GPUs with DuckDB." This signals GPU-accelerated execution moving from an external experiment to an officially endorsed path in the DuckDB ecosystem.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>5. All 22 TPC-H queries complete in 21 seconds — implied world record</strong></td>
  <td class="tk-time">@ 24:43</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="benchmark"></takeaway-tag>
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="memory-cap"></takeaway-tag>
    <span class="tk-body">
      Running the full TPC-H SF1K (1 TB) suite on a GB300 DGX station, Sirius completes all 22 queries in 21 seconds total — a 5× speedup over DuckDB. The presenter notes: "the TPC-H official record is actually slower than 21 seconds," implying this result, while informal, would be the fastest ever recorded at this scale factor.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>6. 9× TCO at the same $2/hr cost: GH200 vs AWS CPU instance</strong></td>
  <td class="tk-time">@ 25:53</td>
</tr>
<tr>
  <td colspan="2" class="tk-content">
    <takeaway-tag name="tco"></takeaway-tag>
    <takeaway-tag name="benchmark"></takeaway-tag>
    <span class="tk-body">
      On the SF300 hot-run benchmark, Sirius on a GH200 (LambdaLabs, $2/hr) delivers 9× better TCO than DuckDB running on a comparably priced AWS Intel CPU instance. Same dollar spend, same wallclock budget — 9× the throughput. The implication: GPU instances are no longer a premium option; at equivalent cost they dominate.
    </span>
  </td>
</tr>

<tr>
  <td class="tk-head"><strong>7. Sirius manages its own pinned memory cache — 2× transfer speedup on GB300</strong></td>
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

#### [🔗](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81873/) Shatter the Memory Wall: Composable Building Blocks for Massive Scale Analytics

<small><strong>Felipe Aramburu</strong> · Distinguished Solutions Architect, NVIDIA<br><strong>Rodrigo Aramburu</strong> · Developer Relations for Data Processing, NVIDIA</small>

<details class="session-abstract"><summary>Session overview</summary><p>As GPU-accelerated analytics scale to terabytes and beyond, memory management and observability become critical infrastructure. We introduce a composable, engine-agnostic approach to shattering GPU memory limits and understanding query-level resource consumption. We'll deep-dive into cuCascade, a library for memory reservation and topology discovery that prevents out-of-memory failures by gracefully spilling data between GPU, host, and disk memory tiers. We'll also introduce a semantic telemetry layer for always-on profiling, enabling developers to visualize query plans and resource throughput across GPUs in real time. We demonstrate both tools working together inside Sirius, NVIDIA's GPU-native analytics engine, showing real telemetry output and memory tier management on live workloads. Learn how these composable building blocks help engine developers identify bandwidth bottlenecks, optimize memory utilization, and push toward speed-of-light analytics performance.</p></details>

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


#### [🔗](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81614/) Top-K Selection at the Speed of Light

<small><strong>Christina Zhang</strong> · DevTech Compute Engineer, NVIDIA<br><strong>Elias Stehle</strong> · Senior Systems Software Engineer, NVIDIA<br><strong>Yue Weng</strong> · DevTech, NVIDIA</small>

<details class="session-abstract"><summary>Session overview</summary><p>Explore new techniques for top-k selection, a critical operation for accelerating scientific computing and mixture of experts that efficiently extracts the most relevant items from massive datasets. Dive into the design of our state-of-the-art GPU algorithm, cub::DeviceTopK, and learn how leveraging this primitive can accelerate high-throughput workloads by over 160x compared to previous methods.</p></details>

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


### Industry Use Cases

#### [🔗](https://www.nvidia.com/en-us/on-demand/session/gtc26-ex82286/) The Agentic AI Data Factory: Why Agents Need a GPU-Native Data Platform to Create Real Value (Presented by Capgemini)

<small><strong>Rajesh Iyer</strong> · Global Head of ML and Gen AI for Financial Services, Capgemini</small>

<details class="session-abstract"><summary>Session overview</summary><p>Capgemini's three-year effort to automate enterprise back-office processes with agentic AI surfaced a hard data problem: agents fail when source data is fragmented across audio, video, and documents. This talk introduces the Agentic AI Data Factory — a four-layer GPU-native data platform that unifies multimodal data into a shared vector space and makes it queryable in real time, enabling agentic workflows that could not function on CPU-bound architectures.</p></details>

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

#### [🔗](https://www.nvidia.com/en-us/on-demand/session/gtc26-s81678/) How Snap Saves Millions with Accelerated Apache Spark

<small><strong>Liang Chen</strong> · Staff Software Engineer, Snap, Inc.<br><strong>Prudhvi Vatala</strong> · Sr. Engineering Manager, Snap, Inc.</small>

<details class="session-abstract"><summary>Session overview</summary><p>Snap's A/B experimentation platform processes 10 petabytes per day across ~45,000 machines with a strict 11 AM SLA and zero tolerance for failure. This talk is an eight-month engineering journey: from discovering the RAPIDS Spark accelerator, through benchmarks, infrastructure blockers, and a novel GPU reuse strategy, to a fully productionized petabyte-scale GPU Spark platform that cut costs by 90%.</p></details>

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

#### [🔗](https://www.nvidia.com/en-us/on-demand/session/gtc26-dlit81754/) From Ingestion to Inference: Mastering the High-Performance GPU Data Science Pipeline

<small><strong>Allison Ding</strong> · Senior Developer Advocate, Data Science, NVIDIA</small>

<details class="session-abstract"><summary>Session overview</summary><p>A hands-on DLI workshop walking through an end-to-end GPU-accelerated data science pipeline: data ingestion and feature engineering with cuDF/GPU Polars, unsupervised and supervised learning with cuML, and model deployment with Triton Inference Server. Uses the IEEE CIS fraud detection dataset throughout. Notebooks remain available for six months post-session.</p></details>

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

#### [🔗](https://www.nvidia.com/en-us/on-demand/session/gtc26-dlit81642/) Accelerate Apache Spark With GPU and AI: A Hands-On Workshop

<small><strong>Hirakendu Das</strong> · Principal Software Engineer, NVIDIA<br><strong>Navin Kumar</strong> · Sr. System Software Engineer, NVIDIA<br><strong>Rishi Chandra</strong> · Systems Software Engineer, NVIDIA</small>

<details class="session-abstract"><summary>Session overview</summary><p>A hands-on DLI workshop covering three layers of GPU-accelerated Spark: the RAPIDS cuDF plugin (zero-code-change columnar acceleration), Project Aether (automated qualification, testing, and migration toolchain), and Ether Assistant (LLM-based UDF rewriter). Uses the NVIDIA Decision Support (NDS) TPC-DS-derived benchmark throughout.</p></details>

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

#### [🔗](https://www.nvidia.com/en-us/on-demand/session/gtc26-dlit81546/) Supercharge Tabular ML Models With GPU-Accelerated Feature Engineering

<small><strong>Chris Deotte</strong> · Sr. Data Scientist, NVIDIA<br><strong>Ronay Ak</strong> · Sr. Data Scientist, NVIDIA</small>

<details class="session-abstract"><summary>Session overview</summary><p>Fast experimentation in feature engineering is essential to quickly discover the most valuable features that improve model performance. In this tutorial, we leverage NVIDIA cuDF and cuML libraries to accelerate the experimentation pipeline on GPUs with their zero-code change features, enabling faster feature engineering and quicker development of more accurate models.
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

<small>Tanmay Gujar · Developer Technology Engineer, NVIDIA<br>Corey Nolet · Distinguished Engineer, Unstructured Data Processing & Database Acceleration, NVIDIA<br>Felipe Aramburu · Distinguished Solutions Architect, NVIDIA<br>Manas Singh · TPM Vector Search, NVIDIA<br>Benjamin Karsin · Senior Developer Technology Engineer, NVIDIA<br>Greg Kimball · Software Engineering Manager, NVIDIA</small>


[🔗](https://www.nvidia.com/gtc/session-catalog/sessions/gtc26-cwes82212/) <strong>Boost Data Science Pipelines With Accelerated Libraries</strong>

<small>Greg Kimball · Software Engineering Manager, NVIDIA<br>Alexandria Barghi · Senior Software Engineer, NVIDIA<br>Divye Gala · Senior Software Engineer, NVIDIA<br>Vyas Ramasubramani · Sr. Systems Software Engineer, NVIDIA<br>Bobby Evans · Distinguished Software Engineer, NVIDIA</small>



---


<script>
  document.querySelectorAll('.post-content a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href && !href.startsWith('#')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
</script>