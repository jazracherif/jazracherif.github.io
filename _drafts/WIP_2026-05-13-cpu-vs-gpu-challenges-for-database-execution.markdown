---
layout: post
title: "CPU vs GPU Challenges for Database Execution"
date: 2026-05-13 00:00:00 -0700
categories: []
tags: []
toc: true
extra_css:
  - /assets/css/post-tables.css
---

GPU query execution is not just CPU query execution with more threads. The hardware changes the cost model for memory, synchronization, branching, and data movement, so database operators need different physical designs even when the relational algebra stays the same.

<div class="tldr">
<p class="tldr-label">TL;DR</p>
<ol>
  <li><strong>GPUs change the bottleneck</strong> — CPU engines usually fight cache locality and per-core coordination, while GPU engines fight global memory traffic, warp divergence, and massive atomic contention.</li>
  <li><strong>Shared memory is explicit</strong> — GPU operators must stage reusable state in small on-chip buffers instead of relying on hardware-managed cache behavior.</li>
  <li><strong>Database algorithms need different physical plans</strong> — familiar operators such as GROUP BY, sort, join, and spill need GPU-specific designs to avoid wasting parallelism.</li>
</ol>
</div>

### CPU vs GPU challenges

<table class="takeaway-table">

<tr><td class="tk-head" colspan="2"><strong>1. Parallelism model</strong></td></tr>
<tr><td colspan="2" class="tk-content"><div class="cpu-gpu">
  <div class="cpu-gpu-col cpu"><div class="cpu-gpu-label">CPU</div>A handful of powerful cores process rows sequentially within each thread, often with morsel-driven parallelism across threads. Threads build into independent per-thread hash tables that are merged at the end; contention is rare by design.</div>
  <div class="cpu-gpu-col gpu"><div class="cpu-gpu-label">GPU</div>Tens of thousands of threads launch simultaneously and must all make progress. Every operator must be decomposed so each block works on an independent slice with no shared mutable state. Contention on shared structures is the default failure mode, not the exception.</div>
</div></td></tr>

<tr><td class="tk-head" colspan="2"><strong>2. On-chip memory management</strong></td></tr>
<tr><td colspan="2" class="tk-content"><div class="cpu-gpu">
  <div class="cpu-gpu-col cpu"><div class="cpu-gpu-label">CPU</div>Hardware-managed L1/L2/L3 caches absorb most data reuse automatically. Algorithms can be designed to exploit cache locality (e.g., partition a hash table to fit in L2), but this is an optional optimization, the hardware handles the common case.</div>
  <div class="cpu-gpu-col gpu"><div class="cpu-gpu-label">GPU</div>There is no transparent data cache for most access patterns. On-chip <strong>shared memory</strong> (48–232 KB per SM depending on architecture; 100 KB on GB10) must be explicitly allocated and managed by the programmer. For aggregation this means staging partial sums there and flushing to global memory only once per block. Without it, every row update incurs a slow DRAM round-trip.</div>
</div></td></tr>

<tr><td class="tk-head" colspan="2"><strong>3. Memory access pattern (coalescing)</strong></td></tr>
<tr><td colspan="2" class="tk-content"><div class="cpu-gpu">
  <div class="cpu-gpu-col cpu"><div class="cpu-gpu-label">CPU</div>Sequential column scans trigger hardware prefetchers efficiently. Random-access hash probes cause cache misses, but each miss stalls only the one core issuing it, other threads continue unaffected.</div>
  <div class="cpu-gpu-col gpu"><div class="cpu-gpu-label">GPU</div>A warp's 32 threads issue memory transactions as a unit. If each thread probes a different hash slot, up to 32 separate cache-line loads are issued, a 32× bandwidth blowup. Data structure layouts must ensure neighbouring threads access neighbouring addresses, which conflicts directly with hash-table random access.</div>
</div></td></tr>

<tr><td class="tk-head" colspan="2"><strong>4. Atomic contention</strong></td></tr>
<tr><td colspan="2" class="tk-content"><div class="cpu-gpu">
  <div class="cpu-gpu-col cpu"><div class="cpu-gpu-label">CPU</div>Contention is not free on CPU either. Cache coherence protocols (e.g., MESI) require cache-line ownership transfers between cores on every write, and <strong>false sharing</strong> (two threads writing to different variables on the same 64-byte cache line) can serialize cores as badly as a real lock. High-performance engines therefore must be designed to avoid shared mutable state entirely: each thread builds into its own private accumulator, keeping all writes cache-local.</div>
  <div class="cpu-gpu-col gpu"><div class="cpu-gpu-label">GPU</div>With thousands of concurrent threads, low-cardinality keys attract massive simultaneous writes to the same output slot. A single <strong>atomicAdd</strong> per row serializes all those threads, collapsing parallelism entirely. The algorithm must absorb partial sums per-block in shared memory first and flush only one atomic per group per block, the two-level strategy libcudf uses. However, the limited size of shared memory is a challenge for datasets with large cardinality. In the case of libcudf, a max of 128 unique keys is supported per block, a limit that triggers fallback to a slower algorithm.</div>
</div></td></tr>

<tr><td class="tk-head" colspan="2"><strong>5. Instruction divergence</strong></td></tr>
<tr><td colspan="2" class="tk-content"><div class="cpu-gpu">
  <div class="cpu-gpu-col cpu"><div class="cpu-gpu-label">CPU</div>Each core has its own program counter and executes independently. Branches, early exits, and variable-length loops inside a hash probe carry no penalty for other cores. That said, data-dependent branches (e.g., hash probe hit/miss) and virtual dispatch can degrade branch prediction, causing pipeline flushes on mispredictions, a cost that grows with pipeline depth on modern out-of-order cores.</div>
  <div class="cpu-gpu-col gpu"><div class="cpu-gpu-label">GPU</div>Each thread has its own program counter, but a warp's 32 threads issue one instruction per cycle in lockstep (SIMT). When threads diverge, some resolving a key on the first probe, others needing two or three, the warp serializes each divergent path, masking inactive lanes per branch. Hash-probe loops must minimise iteration-count variance across threads.</div>
</div></td></tr>

<tr><td class="tk-head" colspan="2"><strong>6. Sort cost &amp; algorithm selection</strong></td></tr>
<tr><td colspan="2" class="tk-content"><div class="cpu-gpu">
  <div class="cpu-gpu-col cpu"><div class="cpu-gpu-label">CPU</div>General comparison sort handles any key type and produces contiguous sorted runs that are both cache-friendly and easy to spill to disk. Sort-aggregate is often preferred when memory is tight or cardinality is high.</div>
  <div class="cpu-gpu-col gpu"><div class="cpu-gpu-label">GPU</div>Radix sort is extremely fast for fixed-width keys. But string keys require indirect gather reads per comparison, and the sorted output lands in scattered memory positions that defeat coalesced writes. Hash-aggregate is typically the better path for string GROUP BY on GPU.</div>
</div></td></tr>

<tr><td class="tk-head" colspan="2"><strong>7. Output size &amp; memory provisioning</strong></td></tr>
<tr><td colspan="2" class="tk-content"><div class="cpu-gpu">
  <div class="cpu-gpu-col cpu"><div class="cpu-gpu-label">CPU</div>Hash tables and output buffers can grow dynamically at runtime using heap allocation. The number of distinct groups never needs to be known upfront.</div>
  <div class="cpu-gpu-col gpu"><div class="cpu-gpu-label">GPU</div>All GPU buffers <strong>must</strong> be allocated before kernels launch. Since the distinct group count is unknown, the implementation must either over-allocate conservatively (libcudf uses 2× input rows = 800 MB for the hash set at 100M rows) or pay for an extra counting kernel plus a host round-trip to right-size the allocation.</div>
</div></td></tr>

<tr><td class="tk-head" colspan="2"><strong>8. Key comparison &amp; hashing</strong></td></tr>
<tr><td colspan="2" class="tk-content"><div class="cpu-gpu">
  <div class="cpu-gpu-col cpu"><div class="cpu-gpu-label">CPU</div>Hash and equality functions are ordinary host code, virtual dispatch, STL calls, OS routines are all available. Adding support for a new key type means writing a standard comparator.</div>
  <div class="cpu-gpu-col gpu"><div class="cpu-gpu-label">GPU</div>Every function called inside a kernel must be annotated <code>__device__</code> and compiled into the GPU binary: no virtual dispatch, no OS calls. For string GROUP BY this means shipping a fully on-device MurmurHash3 and byte-wise UTF-8 equality callable, which libcudf provides as <code>device_row_hasher</code> / <code>device_row_comparator</code>.</div>
</div></td></tr>

<tr><td class="tk-head" colspan="2"><strong>9. Spill &amp; bounded memory</strong></td></tr>
<tr><td colspan="2" class="tk-content"><div class="cpu-gpu">
  <div class="cpu-gpu-col cpu"><div class="cpu-gpu-label">CPU</div>When memory is exhausted, the engine partitions state to disk and merges in a second pass. Partition sizing is a key design constraint: too small and merge fan-in explodes; too large and re-spilling occurs. NVMe (10–14 GB/s) helps, but NAND's erase-before-write rule means spill must be emitted in large sequential runs to avoid write amplification. Disaggregated storage removes the capacity ceiling but adds network latency; caching layers (e.g., Alluxio) are typically added in front of blob stores to avoid round-trips on repeated partition reads.</div>
  <div class="cpu-gpu-col gpu"><div class="cpu-gpu-label">GPU</div>Most GPU engines today require all working buffers to fit in device memory; production-grade spill support is still rare in the ecosystem. CPU–GPU transfers for spill are non-trivial to implement without negating the GPU performance advantage. Hardware trends also help: GPU memory is growing (B200: 192 GB) and NVLink-C2C superchips provide a unified CPU–GPU memory pool (GB200 at 1.8 TB/s, NVLink 5.0, bidirectional), making future spill paths more practical.</div>
</div></td></tr>

<tr><td class="tk-head" colspan="2"><strong>10. Large-scale &amp; distributed execution</strong></td></tr>
<tr><td colspan="2" class="tk-content"><div class="cpu-gpu">
  <div class="cpu-gpu-col cpu"><div class="cpu-gpu-label">CPU</div>When data exceeds a single node's memory, the standard answer is a distributed query engine: Spark, Trino, or Presto partition the dataset across a cluster whose aggregate memory is sufficient. Each node processes its shard independently; partial aggregates are shuffled and merged in a second pass. This model is battle-tested at petabyte scale, with mature fault tolerance, dynamic resource management, and operator-level spill on every node.</div>
  <div class="cpu-gpu-col gpu"><div class="cpu-gpu-label">GPU</div>The same distributed approach applies: Spark RAPIDS and Dask-cuDF assign data partitions to GPU nodes and merge partial results across the cluster. Each GPU handles its shard entirely in device memory, so per-node throughput is high. The new challenge is cross-node data movement: GPU-to-GPU shuffle over InfiniBand or NVLink Switch adds latency that does not exist in the single-node case and must be pipelined carefully. The ecosystem is less mature than its CPU counterpart, fault tolerance, adaptive query execution, and dynamic repartitioning are areas still being hardened for GPU cluster deployments.</div>
</div></td></tr>

</table>
