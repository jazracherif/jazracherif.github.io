---
layout: post
title: "GPU vs CPU for In-Memory Analytics: Bandwidth Holds as Compute and Cost Advantages Narrow Across Three Generations"
date: 2026-03-25 00:00:00 -0700
categories: nvidia gpu hardware amd memory
tags: []
---

One of the central arguments for GPU-accelerated analytics is that GPU hardware is advancing faster than server CPUs. But for analytics workloads, the outcome depends on more than raw compute: **memory bandwidth**, **memory capacity**, **cost**, and **power efficiency** all matter. This post examines three generations of NVIDIA CPU-GPU superchips against the best contemporary AMD CPUs across three lenses: raw compute parity, a $1M bare-metal capital budget, and equal hourly spend on AWS cloud instances.

**Scope:** This analysis applies to **in-memory analytics** — workloads whose active dataset fits within the system’s fast memory tier (HBM for GPUs, DRAM for CPUs). Once a workload spills to storage or a slower memory tier, the bandwidth and capacity comparisons change fundamentally: GPU HBM bandwidth advantages disappear when the bottleneck shifts to PCIe, NVMe, or network I/O, and CPU DRAM’s larger capacity becomes a decisive structural advantage. The conclusions here do not generalize to disk-spilling or out-of-core workloads.

The findings are consistent across all three views. GPU **memory bandwidth** is the most durable advantage — it crossed above parity between the GH200 and GB200 generations and holds steady at 3.5–5.4× at equal spend, whether bare-metal or cloud. The **compute and cost advantages** that originally drove GPU adoption are compressing: GPU prices are rising faster than per-chip compute gains, and the Perf/W lead is narrowing in parallel. The **capacity gap** between cheap DDR DRAM and expensive HBM collapses dramatically at equal budget — from 51–91× at compute parity to 8–11× at equal spend.

---

**Table of Contents**
1. [The CPU Baseline](#the-cpu-baseline)
2. [GPU Superchip Specifications](#gpu-superchip-specifications)
3. [Study #1: NVIDIA GPU vs AMD CPU at Compute Parity](#study-1-nvidia-gpu-vs-amd-cpu-at-compute-parity)
4. [Study #2: Isocost Analysis - Bare Metal: What Does $1M of GPU Buy vs $1M of CPU?](#study-2-isocost-analysis---bare-metal-what-does-1m-of-gpu-buy-vs-1m-of-cpu)
5. [Study #3: Isocost Analysis - Cloud Instance: GPU vs CPU at Equal Hourly Spend on AWS](#study-3-isocost-analysis---cloud-instance-gpu-vs-cpu-at-equal-hourly-spend-on-aws)
6. [Conclusion](#conclusion)
7. [Reference Tables](#interconnect-technology-reference)

> **Methodology Caveat:** This analysis is intentionally simplified and scoped to **in-memory workloads** — datasets that fit within the fast memory tier of each system. Real platform evaluation spans many additional dimensions -- workload mix, software maturity, interconnect topology, memory tiering behavior, cluster-level networking, availability, and total cost of ownership over time. The comparisons here use a compute-parity model plus explicit assumptions (especially for cost and power) to make directional trends easier to inspect, not to claim a universally optimal chipset choice.

<div class="tldr">
<p class="tldr-label">TL;DR</p>
<ol>
  <li><strong>GPU bandwidth crossed the parity threshold between GH200 and GB200</strong> — from trailing the Genoa cluster (~0.56×) to leading it (~1.3×), then widening to ~2.1× with VR200. The inflection happens in one generation.</li>
  <li><strong>GPU bandwidth per dollar is the most stable metric across all three lenses</strong> — at equal bare-metal spend it holds at 4.3–5.4× across three generations; at equal cloud spend it holds at 3.5–3.9× across three AWS generations (Ampere through Blackwell). Unlike compute, it does not compress.</li>
  <li><strong>GPU compute and cost advantages are compressing</strong> — the FP32 advantage at equal spend falls from ~5.4× (GH200 vs Milan, $1M) to ~2.5× (VR200 vs Turin), and from ~9.5× (H100 vs Genoa, AWS) to ~5.2× (B200 vs Turin). The H100 generation was the peak: it delivered a higher compute advantage per dollar than either the A100 era (~4.5×) before it or the B200 era after it. GPU prices are rising faster than per-chip compute gains, and the Perf/W lead is narrowing for the same reason.</li>
  <li><strong>The capacity gap is structural but not fixed</strong> — CPU DRAM holds 51–91× more memory at compute parity, but that collapses to 8–11× at equal spend (both bare-metal and cloud). The difference is pricing, not technology: DDR is cheap per GB; HBM is not.</li>
  <li><strong>Neither side dominates across all axes</strong> — bandwidth now decisively favors GPUs; compute favors GPUs but compressingly so; capacity favors CPUs at any scale; cost and Perf/W advantages are narrowing. Real workloads still decide the winner.</li>
</ol>
</div>

This is a companion post to [The Case for GPU-Accelerated Data Analytics](/database/gpu/nvidia/rapids/libcudf/2026/03/12/the-case-for-gpu-accelerated-data-analytics.html).


---

### The CPU Baseline 

Server CPUs from Intel and AMD have seen real but incremental progress over the same period. AMD EPYC has been the more aggressive of the two — Turin (2024) tripled memory bandwidth relative to Milan (2021) by upgrading from 8-channel DDR4-3200 (~205 GB/s) to 12-channel DDR5-6000 (~576 GB/s), while also tripling the core count to 192 (up from 64 in Milan).

In the tables below, FP32 numbers are theoretical peak using the widest SIMD available per generation, as a rough proxy for analytics workload compute. Actual sustained throughput varies with workload, instruction mix, and all-core clock. Peak FP32 is calculated without FMA-doubling to reflect typical analytics SQL, which rarely relies on fused multiply-add operations:

`Peak FP32 = (Total SIMD units × (SIMD width ÷ 32) × Clock GHz) ÷ 1000`

E.g., for Turin: 384 units × (256 / 32) × 2.4 GHz ÷ 1000 ≈ 7.4 TFLOPS. Most analytics operations are comparisons, aggregations, and reductions—not multiply-accumulate patterns. (FMA-doubling would apply to dense linear algebra or ML kernels, not analytics, so it would be misleading here.)


**AMD EPYC (per socket)**

| | Milan (3rd Gen, 2021)[^epyc-7763-spec] | Genoa (4th Gen, 2022)[^epyc-9654-spec] | Turin (5th Gen, 2024)[^epyc-9965-spec] |
|---|---|---|---|
| **Max cores** | 64 | 96 | 192 |
| **Memory bandwidth** | **~205 GB/s (8-ch DDR4-3200)** | **~461 GB/s (12-ch DDR5-4800)** | **~576 GB/s (12-ch DDR5-6000)** |
| **Best SIMD** | AVX2 (256-bit) | AVX-512 (512-bit) | AVX-512 (512-bit) |
| **AVX FP units** | 2×256-bit/core (128 total) | 2×256-bit/core fused→512-bit (192 total) | 2×256-bit/core fused→512-bit (384 total) |
| **Peak FP32 (best SIMD) at 2.45 GHz** | **~2.5 TFLOPS** | **~3.7 TFLOPS** | **~7.4 TFLOPS** |

Intel's Xeon gains tell a two-part story. Within the Xeon Scalable lineage, progress was incremental: Emerald Rapids (2024) lifted bandwidth only ~1.2× over Sapphire Rapids — from ~307 GB/s to ~358 GB/s (both 8-ch DDR5) — while core count barely moved from 60 to 64 (+7%). The more significant step was Xeon 6 with Granite Rapids (also 2024), a new platform that doubled max cores to 128, pushed bandwidth to ~409 GB/s (8-ch DDR5-6400), and nearly tripled FP32 compute to ~10 TFLOPS. Still well below AMD's Turin on bandwidth, but a meaningful inflection within Intel's own trajectory.

**Intel Xeon Platinum (per socket)**

| | Sapphire Rapids (4th Gen, 2023)[^xeon-spr-spec] | Emerald Rapids (5th Gen, 2024)[^xeon-emr-spec] | Xeon 6 / Granite Rapids (2024)[^xeon-gnr-spec] |
|---|---|---|---|
| **Max cores** | 60 | 64 | 128 |
| **Memory bandwidth** | **~307 GB/s (8-ch DDR5-4800)** | **~358 GB/s (8-ch DDR5-5600)** | **~409 GB/s (8-ch DDR5-6400)** |
| **Best SIMD** | AVX-512 (512-bit) | AVX-512 (512-bit) | AVX-512 (512-bit) |
| **AVX FP units** | 2×512-bit/core (120 total) | 2×512-bit/core (128 total) | 2×512-bit/core (256 total) |
| **Peak FP32 (best SIMD) at 2.5GHz** | **~4.8 TFLOPS** | **~5.1 TFLOPS** | **~10 TFLOPS** |

### GPU Superchip Specifications

Looking at NVIDIA's flagship data-center CPU-GPU superchips across three recent generations, each roughly one to two years apart:

| | GH200 (Grace Hopper)[^gh200-spec] | GB200 (Grace Blackwell)[^gb200-spec] | VR200 (Vera Rubin)[^vr200-spec] |
|---|---|---|---|
| **Superchip Configuration** | 1x Grace CPU + 1x H200 GPU | 1x Grace CPU + 2x B200 GPUs | 1x Vera CPU + 2x R100 GPUs |
| **GPU Device Memory (HBM)** | 144 GB HBM3e | 384 GB HBM3e (192 GB × 2) | 576 GB HBM4 (288 GB × 2) |
| **CPU Host Memory (LPDDR5X)** | 480 GB | Up to 480 GB | Up to 1.5 TB |
| **Total Unified Memory (Host + Device)** | 624 GB | Up to 864 GB | Up to 2.1 TB |
| **GPU Memory Bandwidth** | 4.9 TB/s | 16 TB/s (8 TB/s × 2) | 44 TB/s (22 TB/s × 2) |
| **FP32 Compute** | 67 TFLOPS | 150 TFLOPS | 260 TFLOPS |
| **CPU-to-GPU Interconnect** | NVLink-C2C (900 GB/s) | NVLink-C2C (900 GB/s) | NVLink-C2C (1.8 TB/s) |

Summary: 
* Memory bandwidth has grown roughly 9× across three superchip generations: from 4.9 TB/s on the GH200 to 44 TB/s on the VR200. 
* HBM capacity has grown 4× over the same span, from 144 GB to 576 GB. 
* The NVLink-C2C architecture further extends this by exposing unified memory that spans both HBM and LPDDR5X — the VR200 makes up to 2.1 TB (576 GB HBM4 + 1.5 TB LPDDR5X) accessible to the GPU. 
* That said, HBM remains roughly an order of magnitude more expensive per gigabyte than DDR5, and for workloads that spill beyond the fast HBM tier, performance falls back on the lower LPDDR5X bandwidth.

### Study #1: NVIDIA GPU vs AMD CPU at Compute Parity

Raw compute capability is stark, and growing with each GPU generation, but compute alone does not determine analytics outcomes. The table below shows, for each superchip, the best contemporary AMD CPU, how many sockets are needed to match the GPU's FP32 throughput, and how that compute-equivalent cluster compares on bandwidth, capacity, cost, and power efficiency.

| **GPU Superchip** | GH200 (Grace Hopper) | GB200 (Grace Blackwell) | VR200 (Vera Rubin) |
| **Top AMD CPU** | EPYC 9654 (Genoa, Zen 4)[^epyc-9654-spec] | EPYC 9965 (Turin, Zen 5)[^epyc-9965-spec] | EPYC 9965 (Turin, Zen 5)[^epyc-9965-spec] |
|---|---|---|---|
| Cores / socket | 96 | 192 | 192 |
| CPU bandwidth / socket | ~461 GB/s (12-ch DDR5-4800) | ~576 GB/s (12-ch DDR5-6000) | ~576 GB/s (12-ch DDR5-6000) |
| AMD FP32 / socket | ~3.7 TFLOPS | ~7.4 TFLOPS | ~7.4 TFLOPS |
| GPU FP32** | 67 TFLOPS | 150 TFLOPS | 260 TFLOPS |
| Sockets for FP32 parity with GPU | ~19 sockets (~10 nodes) | ~21 sockets (~11 nodes) | ~36 sockets (~18 nodes) |
|
| CPU cluster bandwidth | ~8.8 TB/s | ~12.1 TB/s | ~20.7 TB/s |
| GPU HBM bandwidth | 4.9 TB/s | 16 TB/s | 44 TB/s |
| **GPU vs CPU bandwidth (higher is better for GPU)** | 🔴 **CPU ~1.8× ahead** | 🟢 **GPU ~1.3× ahead** | 🟢🟢 **GPU ~2.1× ahead** |
|
| CPU cluster DRAM | ~57 TB | ~63 TB | ~108 TB |
| GPU total memory | 624 GB | 864 GB | 2.1 TB |
| **CPU vs GPU capacity (lower is better for GPU)** | 🔴🔴 **CPU ~91× more** | 🔴 **CPU ~73× more** | 🟡 **CPU ~51× more (gap narrowing)** |
|
| Est. GPU single-chip cost | ~$34k - $44k | ~$80k - $95k | ~$153k - $222k |
| Est. CPU cost | ~$0.48M - $0.76M | ~$0.53M - $0.84M | ~$0.90M - $1.44M |
| **CPU vs GPU cost ratio (higher is better for GPU)** | 🟢🟢 **~15.9× CPU** | 🟢 **~8.0× CPU** | 🟢 **~6.8× CPU** |
|
| GPU Power for Parity | ~1.0 kW** (GH200) | ~2.7 kW (GB200) | ~5.0 kW (VR200) |
| CPU System Power | ~6.8 kW | ~10.5 kW | ~18.0 kW  |
| **GPU vs CPU Perf/W efficiency** | 🟢🟢 **~6.8×** | 🟢 **~3.9×** | 🟢 **~3.6×** |

> **Inter-node (shuffle) bandwidth is not shown here** because NVL32/NVL72 are rack-scale products, individual superchips are not sold as standalone IB nodes. Within the rack, all superchip-to-superchip traffic flows over NVLink/NVSwitch at very high bandwidth; InfiniBand only exits at the rack boundary. Inter-node comparisons are covered in Study #2 and Study #3, where rack-level deployment makes the unit of comparison clearer.

Cost assumptions use a platform-normalized method (cost per platform ÷ superchips per platform) with current market prices for full-rack CAPEX:
- GH200 (Hopper) Platform: $1.1M – $1.4M (NVL32 Rack). At 32 superchips, this yields ~$34k – $44k per equivalent.
- GB200 (Blackwell) Platform: $2.9M – $3.4M (NVL72 Rack). At 36 superchips, this yields ~$80k – $95k per equivalent.
- VR200 (Rubin) Platform: $5.5M – $8.0M (NVL72 Rack). At 36 superchips, this yields ~$153k – $222k per equivalent.

<div style="max-width: 680px; margin: 2.5rem auto 1rem;">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

  <p><strong>The Gap: Bandwidth, Capacity, Cost, and Perf/W at FP32 Parity (log scale)</strong></p>
  <canvas id="gapChart" height="300"></canvas>

  <p style="font-size: 0.8em; color: #888; margin-top: 0.5rem;">CPU cluster sized to match GPU FP32 compute at each generation. Trends Analysis: Bandwidth rising = GPU gaining. Capacity falling = CPU advantage shrinking. Cost falling = GPU's cost advantage over CPU shrinking (bad for GPU). Perf/W falling = GPU's power efficiency lead over CPU shrinking (bad for GPU).</p>

  <script src="/assets/js/charts/widening-gap-charts.js" defer></script>
</div>

Two narratives emerge from the data, one where GPUs are clearly gaining ground, and one where their traditional advantages are quietly eroding.

**1) GPUs are closing the gap on Memory Metrics**

- On **Memory Bandwidth**, the inflection point where GPU begins to outrun a compute-equivalent CPU cluster falls between the GH200 and GB200 generations. In the GH200 era, the Genoa cluster is actually ahead (~1.8× CPU advantage). By GB200, the GPU moves ahead (~1.3×). By VR200, the GPU lead widens further (~2.1×).

- On **Memory Capacity**, the direction is also positive for GPU: DDR-based clusters remain ~51–91× ahead on raw memory footprint, but the ratio is declining each generation. DDR is orders of magnitude cheaper per gigabyte than HBM, so this gap won't close quickly — but it is shrinking. For workloads that spill beyond the HBM tier, the GPU must fall back to LPDDR5X unified memory or GPUDirect Storage; spill support is therefore a required capability for any GPU database aiming to compete at scale.

**2) GPU's traditional advantages are narrowing (negative for GPU) on cost and energy efficiency**

- On **Cost at FP32 Parity**, the CPU-to-GPU cost ratio trends down from ~15.9× (GH200) to ~6.8× (VR200). A falling cost line means each successive GPU generation requires a larger single-chip capital outlay to deliver the same parity compute, eroding the hardware cost advantage that originally made GPU deployments attractive. These cost figures are the most assumption-sensitive inputs in the post.

- On **Power Efficiency**, the GPU's Perf/W lead is also shrinking — from nearly 6.8× over a Genoa cluster to ~3.6× over a Turin cluster. NVIDIA is pushing the thermal limits of silicon — the VR200 superchip draws ~5 kW total, versus ~1 kW for the GH200 — to extract raw performance, while server CPUs have maintained a more conservative power envelope. The absolute efficiency advantage remains meaningful, but the trend is moving in the wrong direction for GPU advocates.

### Study #2: Isocost Analysis - Bare Metal: What Does $1M of GPU Buy vs $1M of CPU?

The compute-parity table above asks *how many CPUs does it take to match one GPU in raw FLOPS?* An isocost analysis flips the question: **for a fixed $1M capital budget, how many GPU superchips vs CPU sockets can you buy — and what do you get?**

$1M is a meaningful procurement anchor: it buys nearly a full Hopper NVL32 rack worth of GH200s, a partial Blackwell rack of GB200s, or about five Vera Rubin superchips. On the CPU side, $1M buys a meaningful compute cluster — 125 Milan sockets (~62 nodes) or 71 Turin sockets (~36 nodes). This budget is large enough that multi-chip GPU NVLink effects start to matter, and realistic enough to represent a real infrastructure decision.

CPU socket prices are estimated market rates for the highest-core-count SKU at each generation — EPYC 7763 (Milan) at approximately $8k/socket and EPYC 9965 (Turin) at approximately $14k/socket. These are chip-level prices and do not include platform, memory, or networking, consistent with comparing silicon to silicon. GPU costs use the same rack-normalized per-superchip midpoints from the parity section above.

| GPU | GH200 | GB200 | VR200  |
| CPU | Milan | Turin |  Turin |
|---|---|---|---|
| GPU price / superchip | ~$39k | ~$87.5k | ~$187.5k |
| CPU price / socket | ~$8k (Milan) | ~$14k (Turin) | ~$14k (Turin) |
| $1M GPU fleet | ~25 GH200 superchips | ~11 GB200 superchips | ~5 VR200 superchips |
| $1M CPU fleet | ~125 Milan sockets (~62 nodes) | ~71 Turin sockets (~36 nodes) | ~71 Turin sockets (~36 nodes) |
| GPU FP32 ($1M fleet) | ~1,675 TFLOPS | ~1,650 TFLOPS | ~1,300 TFLOPS |
| CPU FP32 ($1M fleet) | ~313 TFLOPS | ~526 TFLOPS | ~526 TFLOPS |
| **GPU FP32 advantage** | 🟢🟢 **~5.4×** | 🟢 **~3.1×** | 🟢 **~2.5×** |
|
| GPU HBM bandwidth *(intra-node, $1M fleet)* | ~122.5 TB/s | ~176 TB/s | ~220 TB/s |
| CPU DDR bandwidth *(intra-node, $1M fleet)* | ~25.6 TB/s | ~40.9 TB/s | ~40.9 TB/s |
| **GPU HBM BW advantage** *(intra-node)* | 🟢🟢 **~4.8×** | 🟢🟢 **~4.3×** | 🟢🟢 **~5.4×** |
|
| GPU inter-node BW *(shuffle, per node)* | 400 Gbps / 50 GB/s (IB NDR) | 400 Gbps / 50 GB/s (IB NDR) | 1,600 Gbps / 200 GB/s (IB XDR, est.) |
| CPU inter-node BW *(shuffle, per node)* | 200 Gbps / 25 GB/s (IB HDR) | 400 Gbps / 50 GB/s (IB NDR) | 400 Gbps / 50 GB/s (IB NDR) |
| **GPU/CPU inter-node advantage (per node)** | 🟢 **~2×** | 🟡 **~1× (NDR parity)** | 🟢🟢 **~4× (XDR, est.)** |
|
| GPU total memory ($1M fleet) | ~15.6 TB | ~9.5 TB | ~10.5 TB |
| CPU DRAM ($1M fleet) | ~125 TB | ~106.5 TB | ~106.5 TB |
| **CPU capacity advantage** | 🔴 **CPU ~8×** | 🔴 **CPU ~11.2×** | 🔴 **CPU ~10.1×** |
|
| GPU fleet power | ~25 kW | ~29.7 kW | ~25 kW |
| CPU fleet power | ~45.5 kW | ~46.2 kW | ~46.2 kW |
| **GPU Perf/W advantage** | 🟢🟢 **~9.7×** | 🟢🟢 **~4.9×** | 🟢🟢 **~4.6×** |

> CPU bandwidth: sockets × per-socket bandwidth. CPU DRAM: 64 GB DIMMs, 2 per channel — ~1 TB/socket for Milan (8-ch DDR4), ~1.5 TB/socket for Turin (12-ch DDR5). CPU power adds ~30% platform overhead to socket TDP (Milan 280W, Turin 500W). GPU fleet sizes are partial racks: 25 GH200s ≈ 78% of an NVL32; 11 GB200s ≈ 30% of an NVL72; 5 VR200s ≈ 14% of an NVL72.

<div style="max-width: 680px; margin: 2.5rem auto 1rem;">
  <p><strong>Isocost Comparison: GPU vs CPU Metrics at $1M Equal Spend (log scale)</strong></p>
  <canvas id="isocostChart" height="300"></canvas>
  <p style="font-size: 0.8em; color: #888; margin-top: 0.5rem;">$1M deployed into GPU superchips vs CPU sockets at each generation. FP32, Bandwidth, and Perf/W show the GPU fleet's advantage multiplier over the CPU fleet. Capacity shows the CPU's DRAM advantage over the GPU fleet's total memory.</p>
</div>

Five patterns emerge from the $1M isocost view:

**GPU compute advantage is meaningful but compresses as GPU prices rise.** A $1M GH200 fleet delivers 5.4× more FP32 than a $1M Milan cluster. By VR200, that lead falls to 2.5× — not because GPU compute scaled down, but because $1M buys far fewer Vera Rubin superchips (5) than GH200s (25). This is a direct effect of GPU price inflation per generation outpacing the compute-per-chip gains.

**GPU bandwidth advantage is the most stable metric: 4.3–5.4× across all three generations.** Unlike the compute ratio, bandwidth per dollar holds remarkably steady. Even when buying fewer chips, each VR200 contributes 44 TB/s, which keeps the fleet aggregate well ahead of the CPU cluster. This is the GPU's most durable advantage at equal budget: memory bandwidth per dollar has not eroded the way compute per dollar has.

**The CPU capacity advantage is real but much smaller than the parity view suggests — and worsens for GPU in the GB200 generation.** At parity, CPU clusters hold 51–91× more DRAM. At $1M, that collapses to 8–11×. However, the ratio worsens for GPU going from GH200 to GB200: $1M buys many more GH200s (15.6 TB total HBM) than GB200s (9.5 TB), because GB200s are ~2.2× more expensive per chip with only a proportional HBM-per-dollar increase. The VR200 partially recovers (10.5 TB) thanks to its larger per-chip HBM. As rack-scale NVLink pooling becomes the default deployment model, the effective addressable GPU memory pool expands beyond what these single-fleet numbers reflect.

**GPU Perf/W advantage is large and consistent.** The ~9.7× lead at the GH200 generation narrows to ~4.6× by VR200 — consistent with the parity trend — and reflects that GPU silicon extracts substantially more analytics-relevant FP32 output per watt than CPU silicon at this budget. Notably, both the GPU and CPU fleets draw comparable absolute power at $1M (~25–30 kW GPU vs ~45–46 kW CPU — a factor of ~1.5–1.8×), so the Perf/W ratio is primarily a statement about performance density, not a dramatic difference in total energy draw.

**Inter-node (shuffle) bandwidth: per-node advantage recovers at VR200, but the CPU fleet still wins total aggregate egress at $1M.** Bare-metal GPU and CPU clusters connect over InfiniBand — HDR 200 Gbps (25 GB/s) for Milan era, NDR 400 Gbps (50 GB/s) for Genoa, Turin, and GB200. The GH200 generation carries a 2× per-node advantage over a Milan cluster (NDR vs HDR). By GB200, both GPU and CPU nodes sit on NDR 400 Gbps — 1× per-node parity. The VR200, estimated to ship with ConnectX-9 (XDR), breaks this parity at 1,600 Gbps (200 GB/s) — a ~4× per-node advantage over Turin's 400 Gbps (50 GB/s) NDR. At equal $1M spend, the CPU fleet's larger node count still dominates total aggregate shuffle egress: 36 Turin nodes × 400 Gbps = 14.4 Tbps vs 11 GB200 nodes × 400 Gbps = 4.4 Tbps — a ~3.3× CPU aggregate advantage in the GB200 era. For VR200, the per-node XDR lead narrows the aggregate gap significantly: 5 VR200 nodes × 1,600 Gbps = 8 Tbps vs 36 Turin nodes × 400 Gbps = 14.4 Tbps — ~1.8× CPU aggregate advantage. For workloads dominated by cross-node data movement (large hash joins, high-cardinality group-by across partitions), the CPU fleet at bare-metal $1M scale retains the aggregate shuffle throughput edge, though VR200 narrows the gap significantly.

### Study #3: Isocost Analysis - Cloud Instance: GPU vs CPU at Equal Hourly Spend on AWS

The capital budget analysis above captures bare-metal procurement economics. Cloud deployments shift this to an **operational model** — pay by the hour, no upfront commitment, scale up or down. This section uses AWS on-demand Linux pricing from [Vantage](https://instances.vantage.sh) (April 2026) to ask the same isocost question with hourly rates.

> **Cloud pricing caveat:** On-demand AWS rates are the most widely published and comparable benchmark, but they are not the cheapest option. GPU-specialized clouds — CoreWeave, Lambda Labs, Crusoe, and others — typically offer H100 capacity at $2.49–2.89/hr per GPU (~$20–23/hr for an 8-GPU node), roughly 60% below the AWS `p5.48xlarge` rate of $55.04/hr. GCP and Azure on-demand rates for equivalent instances are broadly similar to AWS. All three advantage ratios in this section (FP32, bandwidth, capacity) are sensitive to pricing: a cheaper GPU cloud means more GPU instances per $1k/hr, which shifts all ratios in the GPU's favor. The AWS numbers here should be read as a specific pricing scenario, not a hardware-fundamental result.

A key property of cloud GPU instances: **the instance price already includes the host CPU**. The `p4d.24xlarge` bundles 8× A100 GPUs with an Intel Xeon Platinum host; the `p5.48xlarge` bundles 8× H100 GPUs with an AMD EPYC host; the `p6-b200.48xlarge` bundles 8× B200 GPUs with an Intel Xeon Emerald Rapids host. This is equivalent to the superchip pricing model — you pay for the full compute node, GPU and CPU together. AWS also offers `p6e-gb200.36xlarge` — 36 native Grace-Blackwell superchips — but on-demand pricing is not yet published for that instance.

At $1,000/hour on-demand:

| CLOUD GPU | A100  | H100  | B200   |
| CLOUD CPU | Milan  | Genoa  | Turin  |
|---|---|---|---|
| GPU AWS Instances | p4d.24xlarge[^p4d24xlarge-price] | p5.48xlarge[^p548xlarge-price] | p6-b200.48xlarge[^p6b20048xlarge-price] |
| GPU $/hr per instance | $21.96 | $55.04 | $113.93 |
| CPU AWS Instances | hpc6a[^hpc6a48xlarge-price] | hpc7a[^hpc7a96xlarge-price]  | hpc8a[^hpc8a96xlarge-price] |
| CPU $/hr per instance | $2.88 | $7.20 | $7.92 |
| Instances at $1k/hr | 45 GPU / 347 CPU | 18 GPU / 138 CPU | 8 GPU / 126 CPU |
| Total GPUs / CPU cores | 360× A100 / ~33,300 Milan cores | 144× H100 / ~26,500 Genoa cores | 64× B200 / ~24,200 Turin cores |
| **GPU vs CPU instance price ratio** | 🔴 **7.6× more per GPU node** | 🔴 **7.6× more per GPU node** | 🔴🔴 **14.4× more per GPU node** |
|
| GPU FP32 ($1k/hr fleet) | ~7,020 TFLOPS | ~9,650 TFLOPS | ~4,800 TFLOPS |
| CPU FP32 ($1k/hr fleet) | ~1,570 TFLOPS | ~1,020 TFLOPS | ~930 TFLOPS |
| **GPU FP32 advantage** | 🟢🟢 **~4.5×** | 🟢🟢 **~9.5×** | 🟢🟢 **~5.2×** |
|
| GPU HBM bandwidth *(intra-node)* | ~560 TB/s (360 × 1.555 TB/s) | ~483 TB/s (144 × 3.35 TB/s) | ~512 TB/s (64 × 8 TB/s) |
| CPU mem bandwidth *(intra-node)* | ~142 TB/s (347 × 410 GB/s) | ~127 TB/s (138 × 922 GB/s) | ~145 TB/s (126 × 1,152 GB/s) |
| **GPU HBM BW advantage** *(intra-node)* | 🟢🟢 **~3.9×** | 🟢🟢 **~3.8×** | 🟢🟢 **~3.5×** |
|
| GPU inter-node BW *(shuffle, per node)* | 400 Gbps / 50 GB/s EFA | 3,200 Gbps / 400 GB/s EFA | 3,200 Gbps / 400 GB/s EFA |
| CPU inter-node BW *(shuffle, per node)* | 100 Gbps / 12.5 GB/s EFA | 300 Gbps / 37.5 GB/s EFA | 300 Gbps / 37.5 GB/s EFA |
| **GPU inter-node advantage (per node)** | 🟢 **~4×** | 🟢🟢 **~11×** | 🟢🟢 **~11×** |
|
| GPU HBM capacity | ~14.4 TB (45 × 320 GB) | ~11.3 TB (18 × 640 GB) | ~11.3 TB (8 × 1,440 GB) |
| CPU DRAM capacity | ~133 TB (347 × 384 GiB) | ~104 TB (138 × 768 GiB) | ~95 TB (126 × 768 GiB) |
| **CPU capacity advantage** | 🔴 **CPU ~9×** | 🔴 **CPU ~9×** | 🔴 **CPU ~8×** |

> FP32 estimates follow the same method as the parity section: SIMD units × (SIMD width ÷ 32) × all-core GHz. GPU FP32 uses ~19.5 TFLOPS per A100 SXM4 (NVIDIA published non-sparse FP32 peak), ~67 TFLOPS per H100, and ~75 TFLOPS per B200 (the GB200 superchip = 1 Grace CPU + 2× B200 GPUs = 150 TFLOPS total, so 75 TFLOPS per B200). CPU FP32 uses ~2.3 TFLOPS per 48-core Milan socket (EPYC 7R13: 96 SIMD units × 8 × 2.95 GHz / 1000), ~3.7 TFLOPS per 96-core Genoa socket, and ~3.7–4.0 TFLOPS per 96-core Turin socket at sustained all-core clock. CPU memory bandwidth uses per-socket figures (205 GB/s Milan, 461 GB/s Genoa, 576 GB/s Turin) multiplied by 2 sockets per instance (hpc6a/hpc7a/hpc8a are all 2-socket nodes), giving 410 GB/s, 922 GB/s, and 1,152 GB/s per instance respectively. GPU bandwidth specs are from NVIDIA datasheets; CPU bandwidth specs are from AMD datasheets. Prices are from Vantage.

<div style="max-width: 680px; margin: 2.5rem auto 1rem;">
  <p><strong>Cloud Isocost: GPU vs CPU Metrics at $1k/hr Equal Spend on AWS (log scale)</strong></p>
  <canvas id="cloudIsocostChart" height="300"></canvas>
  <p style="font-size: 0.8em; color: #888; margin-top: 0.5rem;">AWS on-demand Linux pricing, April 2026. FP32 and BW show the GPU fleet's advantage multiplier over the CPU fleet at equal hourly spend. Capacity shows the CPU DRAM advantage over the GPU HBM fleet.</p>
</div>

Four observations from the cloud view:

**The compute advantage is large but generation-sensitive.** At equal hourly spend, 18 H100 instances outcompute 138 Genoa nodes by ~9.5×. By the Blackwell generation, that lead narrows to ~5.2×: the B200 is more powerful per GPU, but $1,000/hr buys only 8 `p6-b200` instances versus 126 `hpc8a` nodes — because the B200 instance price (2.1× the H100 instance price) has risen faster than the per-GPU compute improvement (~1.1×).

**GPU bandwidth advantage is stable across all three cloud generations (~3.5–3.9×).** From A100/Milan (3.9×) to H100/Genoa (3.8×) to B200/Turin (3.5×), total memory bandwidth per dollar holds remarkably steady even as the compute ratio swings from 4.5× to 9.5× and back to 5.2×. Bandwidth is the GPU's most durable and predictable cloud advantage.

**The cloud capacity gap (8–9× on AWS) is comparable to the bare-metal view (8–11×).** This convergence reflects a similar GPU-to-CPU price ratio across both procurement models — on AWS, GPU instances cost roughly 7–14× more per node than CPU HPC instances, broadly in the same range as the bare-metal silicon cost ratios. The specific numbers will shift on cheaper clouds: at CoreWeave H100 pricing (~$20/hr per node), the same $1k/hr buys ~50 GPU nodes instead of 18, compressing the CPU capacity advantage to roughly 3×.

**On AWS, GPU instances carry a decisive per-node inter-node bandwidth advantage that extends the GPU lead from intra-node memory to inter-node shuffle.** The H100 (`p5.48xlarge`) and B200 (`p6-b200.48xlarge`) instances both carry 3,200 Gbps (400 GB/s) EFA — roughly 11× more per-node inter-node bandwidth than the 300 Gbps (37.5 GB/s) EFA on `hpc7a` (Genoa) and `hpc8a` (Turin). For analytics workloads with significant data movement between nodes (hash joins, group-by on high-cardinality keys), the GPU fleet's per-node network bandwidth means it is also faster at the shuffle phase, unlike the bare-metal case where both GPU and CPU nodes share NDR InfiniBand. The A100 era is more modest: `p4d.24xlarge` has 400 Gbps (50 GB/s) EFA vs `hpc6a`'s 100 Gbps (12.5 GB/s) — a 4× per-node advantage. At $1k/hr, the H100 fleet's total shuffle capacity (18 × 3,200 Gbps = 57.6 Tbps) also exceeds the Genoa fleet (138 × 300 Gbps = 41.4 Tbps); for the A100 and B200 eras the CPU fleet regains a total aggregate lead through node count, but the GPU maintains a 4–11× per-node inter-node advantage throughout all three cloud generations.

### Conclusion

Three lenses — compute parity, $1M bare-metal capital, and equal hourly AWS spend — tell a consistent story with two competing narratives.

**GPUs are gaining decisively on bandwidth.** Bandwidth per chip crossed above the Genoa cluster between the GH200 and GB200 generations, and that lead has widened steadily. Bandwidth per dollar is the most stable metric across all isocost views: 4.3–5.4× on bare metal across three GPU generations, and 3.5–3.9× on AWS across three cloud generations (A100 through B200). Of every metric tracked in this post, memory bandwidth per dollar has eroded the least — and for analytics workloads, that matters most.

**The compute and cost advantages that once justified GPU deployments are compressing.** The FP32 advantage at equal spend falls from ~5.4× (GH200 vs Milan, $1M bare metal) to ~2.5× (VR200 vs Turin) — not because GPU compute stagnated, but because GPU prices are rising faster than per-chip compute gains. The cloud view shows a non-monotonic pattern: the A100/Milan era started at ~4.5×, the H100/Genoa generation peaked at ~9.5× (H100 offered exceptional value at launch — ~3.4× more compute than A100 without proportional pricing), and the B200/Turin shows compression to ~5.2× as instance prices have overtaken compute gains. The Perf/W lead is narrowing for the same reasons.

**The capacity gap is structural but not fixed by price.** At compute parity, CPU DRAM clusters hold 51–91× more memory than GPU HBM. At equal budget — whether $1M capital or $1k/hr cloud — that collapses to 8–11×. The gap is real, but much of it is a pricing artifact: DDR capacity is cheap per gigabyte; HBM is not. For workloads that genuinely need TBs of fast-path memory, CPUs hold a durable structural advantage. For most analytics workloads that fit in HBM, the gap is largely academic.

We will revisit this comparison when AMD EPYC Venice (Zen 6) specs are finalized, to measure how much the CPU side shifts the balance versus NVIDIA Vera Rubin.

---

### Reference Tables

**Cloud Instance Pricing** — AWS on-demand Linux rates from [Vantage](https://instances.vantage.sh), April 2026. GPU instances include the host CPU. Prices may vary by region.

| Instance | GPU / CPU | $/hr (on-demand Linux) | Source |
|---|---|---|---|
| `p4d.24xlarge` | 8× NVIDIA A100 SXM4 40GB + Intel Xeon Platinum 8275L | $21.96 (us-east-1) | [🔗](https://instances.vantage.sh/aws/ec2/p4d.24xlarge) |
| `p5.48xlarge` | 8× NVIDIA H100 SXM5 + AMD EPYC 7R13 | $55.04 (us-east-1) | [🔗](https://instances.vantage.sh/aws/ec2/p5.48xlarge) |
| `p6-b200.48xlarge` | 8× NVIDIA B200 + Intel Xeon Emerald Rapids | $113.93 (us-east-1) | [🔗](https://instances.vantage.sh/aws/ec2/p6-b200.48xlarge) |
|
| `hpc6a.48xlarge` | 2× AMD EPYC Milan (7R13, 48-core) | $2.88 (us-east-2) | [🔗](https://instances.vantage.sh/aws/ec2/hpc6a.48xlarge) |
| `hpc7a.96xlarge` | 2× AMD EPYC Genoa (9R14) | $7.20 (us-east-2) | [🔗](https://instances.vantage.sh/aws/ec2/hpc7a.96xlarge) |
| `hpc8a.96xlarge` | 2× AMD EPYC Turin (9R45) | $7.92 (us-east-2) | [🔗](https://instances.vantage.sh/aws/ec2/hpc8a.96xlarge) |

Why these instances?
- GPU side — maximum GPU density per generation:
  - **p4d.24xlarge** (8× A100), **p5.48xlarge** (8× H100), **p6-b200.48xlarge** (8× B200) are all the flagship 8-GPU nodes AWS offers per generation. 
  - Using maximum GPU density per node minimizes fixed CPU/networking overhead per GPU and is the standard choice for GPU-heavy workloads.
- CPU side — HPC-optimized hpc* instances specifically: 
  - The **hpc6a/7a/8a** family is chosen over general compute instances (like **c6a**, **c7a**) because they match the AMD EPYC generations used in the bare-metal section (Milan → Genoa → Turin), and they include high-bandwidth EFA networking — making the networking comparison fair vs the GPU instances.
- Generation alignment: Each pair is matched within the same GPU-era: A100 (2020) paired with Milan (2021), H100 (2022) with Genoa (2022), B200 (2024) with Turin (2024). This avoids comparing late-generation CPUs to early-generation GPUs or vice v

**Memory Capacity and Bandwitdh** - *Inside a single chip*

| Instance | #GPUs / #CPU Cores | Total HBM/DRAM Capacity | Total Memory BW |
|---|---|---|---|
| `p4d.24xlarge` A100 ×8 | 8 GPUs / 96 vCPUs | 320 GB HBM2e | ~12.4 TB/s HBM |
| `p5.48xlarge` H100 ×8 | 8 GPUs / 192 vCPUs | 640 GB HBM3 | ~26.8 TB/s HBM |
| `p6-b200.48xlarge` B200 ×8 | 8 GPUs / 192 vCPUs | 1,440 GB HBM3e | ~64 TB/s HBM |
|
| `hpc6a.48xlarge`  Milan ×2s | — / 96 cores | 384 GiB DDR4 | ~410 GB/s DDR4 |
| `hpc7a.96xlarge`  Genoa ×2s | — / 192 cores | 768 GiB DDR5 | ~922 GB/s DDR5 |
| `hpc8a.96xlarge`  Turin ×2s | — / 192 cores | 768 GiB DDR5 | ~1,152 GB/s DDR5 |


**Interconnect Technologies** — *Intra-node* bandwidth connects CPUs and GPUs within a single node (NVLink, PCIe, NUMA fabric). *Inter-node* bandwidth is the network fabric used for data exchange between nodes — the shuffle phase in distributed analytics.

```
  ①  Inter-chip BW          ②  Intra-node BW              ③  Inter-node BW

  GPU superchip (e.g. GB200 NVL72):
    ┌─── SoC ──────────┐
    │[CPU]──①──[GPU]   │──────────②──────────[GPU]  ···
    └──────────────────┘    NVLink / NVSwitch      │
         NVLink C2C                                └────③────[Node B]  ···
                                                        IB / EFA

  Cloud GPU node (e.g. p5.48xlarge):
    [Host CPU]──①──[GPU 0]──────②──────[GPU 1]  ···  [GPU 7]
                PCIe           NVLink              │
                                                   └────③────[Node B]  ···
                                                           EFA

  CPU cluster (e.g. hpc7a):
    (① n/a)   [Socket 0]──────②──────[Socket 1]
                          Inf. Fabric          │
                                               └────③────[Node B]  ···
                                                     IB / EFA
```

| System | Type | Inter-chip BW | Intra-node BW | Inter-node BW (per node) |
|---|---|---|---|---|
| **GH200 NVL32** | GPU | NVLink C2C (~900 GB/s) | NVLink 4 (~900 GB/s/GPU) | IB NDR (~50 GB/s) |
| **GB200 NVL72** | GPU | NVLink C2C (~900 GB/s) | NVLink 5 NVSwitch (~1.8 TB/s/GPU) | IB NDR (~50 GB/s) |
| **VR200 NVL72** | GPU | NVLink C2C (~1.8 TB/s) | NVLink 6 (~3.6 TB/s/GPU, est.) | IB XDR / ConnectX-9 (~200 GB/s) |
|
| **AMD Milan cluster** | CPU | — | Infinity Fabric / NUMA (~200 GB/s cross-socket) | IB HDR (~25 GB/s) |
| **AMD Genoa / Turin cluster** | CPU | — | Infinity Fabric / NUMA (~250 GB/s cross-socket) | IB NDR (~50 GB/s) |
|
| **`p4d.24xlarge`** <br> A100 ×8 | GPU | PCIe 4.0 x16 (32 GB/s) | NVLink 3 bridge (~600 GB/s/GPU) | EFA2 (~50 GB/s) |
| **`p5.48xlarge`** <br> H100 ×8 | GPU | PCIe 5.0 x16 (64 GB/s) | NVLink 4 (900 GB/s/GPU) | EFA3 (~400 GB/s) |
| **`p6-b200.48xlarge`** B200 ×8 | GPU | PCIe 5.0 x16 (64 GB/s) | NVLink 5 (1.8 TB/s/GPU) | EFA3 (~400 GB/s) |
|
| **`hpc6a.48xlarge`** <br> Milan ×2s | CPU | — | Infinity Fabric / NUMA (~200 GB/s cross-socket) | EFA (~12.5 GB/s) |
| **`hpc7a.96xlarge`** <br> Genoa ×2s | CPU | — | Infinity Fabric / NUMA (~250 GB/s cross-socket) | EFA (~37.5 GB/s) |
| **`hpc8a.96xlarge`** <br> Turin ×2s | CPU | — | Infinity Fabric / NUMA (~250 GB/s cross-socket) | EFA (~37.5 GB/s) |

> AWS EFA speeds from [Vantage](https://instances.vantage.sh), April 2026. InfiniBand speeds reflect standard configurations: HDR = 200 Gbps / 25 GB/s (2021 era), NDR = 400 Gbps / 50 GB/s (2022+). The jump from `p4d` (400 Gbps / 50 GB/s EFA) to `p5` (3,200 Gbps / 400 GB/s EFA) reflects AWS's EFA3 fabric generation deployed for the Hopper generation. NVIDIA NVLink and GPU intra-node specs from NVIDIA datasheets.


**IB (InfiniBand)** is an open industry-standard network fabric — completely independent of CPU vendor. NVIDIA owns Mellanox (acquired 2020), the dominant InfiniBand hardware maker, but the HCAs (host channel adapters) plug into any server via PCIe regardless of whether it runs AMD or Intel CPUs. Standard generations used in this post: HDR = 200 Gbps / 25 GB/s (circa 2021), NDR = 400 Gbps / 50 GB/s (2022+), XDR = 1,600 Gbps (200 GB/s)/port ConnectX-9 (2024+, est.).

**EFA (Elastic Fabric Adapter)** is AWS's proprietary high-performance network interface for HPC and ML workloads. Unlike standard cloud networking, EFA uses OS-bypass RDMA (via AWS's SRD — Scalable Reliable Datagram — protocol), skipping the kernel network stack to deliver lower latency and higher throughput for tightly-coupled distributed workloads. EFA is not InfiniBand, but achieves similar application-level semantics. Generations: EFA2 (~400 Gbps / ~50 GB/s, `p4d`) → EFA3 (~3,200 Gbps / ~400 GB/s, `p5`/`p6-b200`).



---

### References

[^gh200-spec]: NVIDIA GH200 Grace Hopper Superchip — <https://www.nvidia.com/en-us/data-center/grace-hopper-superchip/>
[^gb200-spec]: NVIDIA GB200 NVL72 (Grace Blackwell Superchip) — <https://www.nvidia.com/en-us/data-center/gb200-nvl72/>
[^vr200-spec]: NVIDIA Vera Rubin NVL72 (Vera Rubin Superchip) — <https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/>
[^epyc-7763-spec]: AMD EPYC 7763 (Milan) Processor — <https://www.amd.com/en/products/processors/server/epyc/7003-series/amd-epyc-7763.html>
[^epyc-9654-spec]: AMD EPYC 9654 (Genoa) Processor — <https://www.amd.com/en/products/processors/server/epyc/9004-series/amd-epyc-9654.html>
[^epyc-9965-spec]: AMD EPYC 9965X (Turin) Processor — <https://www.amd.com/en/products/processors/server/epyc/9005-series/amd-epyc-9965.html>
[^xeon-spr-spec]: Intel Xeon Platinum 8490H (Sapphire Rapids, 4th Gen Xeon Scalable) — <https://www.intel.com/content/www/us/en/products/sku/231749/intel-xeon-platinum-8490h-processor-112-5m-cache-1-90-ghz/specifications.html>
[^xeon-emr-spec]: Intel Xeon Platinum 8592+ (Emerald Rapids, 5th Gen Xeon Scalable) — <https://www.intel.com/content/www/us/en/products/sku/237250/intel-xeon-platinum-8592-processor-320m-cache-1-90-ghz/specifications.html>
[^xeon-gnr-spec]: Intel Xeon 6980P (Granite Rapids, Xeon 6 with P-cores) — <https://www.intel.com/content/www/us/en/products/sku/240785/intel-xeon-6980p-processor-504m-cache-2-00-ghz/specifications.html>
[^p4d24xlarge-price]: AWS p4d.24xlarge (8× A100 SXM4 40GB + Intel Xeon Platinum 8275L) on-demand Linux — $21.96/hr in us-east-1 — <https://instances.vantage.sh/aws/ec2/p4d.24xlarge>
[^p548xlarge-price]: AWS p5.48xlarge (8× H100 SXM5 + AMD EPYC host) on-demand Linux — $55.04/hr in us-east-1 — <https://instances.vantage.sh/aws/ec2/p5.48xlarge>
[^p6b20048xlarge-price]: AWS p6-b200.48xlarge (8× B200 + Intel Xeon Emerald Rapids) on-demand Linux — $113.93/hr in us-east-1 — <https://instances.vantage.sh/aws/ec2/p6-b200.48xlarge>
[^hpc6a48xlarge-price]: AWS hpc6a.48xlarge (2-socket AMD EPYC Milan 7R13) on-demand Linux — $2.88/hr in us-east-2 — <https://instances.vantage.sh/aws/ec2/hpc6a.48xlarge>
[^hpc7a96xlarge-price]: AWS hpc7a.96xlarge (2-socket AMD EPYC Genoa) on-demand Linux — $7.20/hr in us-east-2 — <https://instances.vantage.sh/aws/ec2/hpc7a.96xlarge>
[^hpc8a96xlarge-price]: AWS hpc8a.96xlarge (2-socket AMD EPYC Turin) on-demand Linux — $7.92/hr in us-east-2 — <https://instances.vantage.sh/aws/ec2/hpc8a.96xlarge>
