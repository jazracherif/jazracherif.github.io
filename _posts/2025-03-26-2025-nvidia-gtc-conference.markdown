---
layout: post
title:  "2025 NVIDIA GTC Conference - Summary"
date:   2025-03-26 10:00:00 -0700
categories: conference nvidia gpu
---

![At GTC 2025, San Jose McEnery Convention Center](/assets/img/gtc-2025-cover.jpg)

I attended NVIDIA's GTC conference in San Jose from March 16-21, 2025. It was a lot of fun and a very inspiring experience for technical professionals seeking insights into accelerated hardware and CUDA software ecosystems.

*I've written a detailed 3-part series covering this conference:*
- **[Part 1: Keynote and Main Announcements]({% post_url 2025-03-27-2025-nvidia-gtc-conference-part1-keynote %})** - Jensen Huang's keynote, Rubin hardware reveals, and key product announcements
- **[Part 2: Deep Dive into CUDA]({% post_url 2025-03-28-2025-nvidia-gtc-conference-part2-cuda %})** - CUDA workshops, CuTile paradigm, and comprehensive CUDA-X libraries reference
- **[Part 3: Exhibit Hall - Hardware and Robotics]({% post_url 2025-03-29-2025-nvidia-gtc-conference-part3-exhibit-hall %})** - Server infrastructure, GB300 hardware, liquid cooling, and robotics demos

## Main Conference Highlights

- Jensen Huang's keynote address with a live Acquired podcast
- "CUDA, New Features and Beyond" session announcing CuTile programming paradigm
- Deep-dive CUDA sessions on bandwidth, latency, compute optimization, and kernel writing
- Four-hour C++ workshop using the Thrust library
- GPU acceleration for Apache Spark with Project Aether for job migration
- Extensive exhibit hall showcasing hardware, robotics, and medical equipment

## Keynote Takeaways

Huang emphasized that accelerated computing continues displacing CPU-only applications across hard sciences, wireless communications, industrial robotics, and enterprise AI. Key announcements included:

- **Next-generation hardware:** Vera Rubin NVL144 (2026) and Rubin Ultra NVL576 (2027)
- **Architecture roadmap:** Feynman architecture following current generation
- **New products:** Isaac Groot N1 humanoid model, Newton physics engine, Grace-Blackwell DGX systems
- **Interconnect innovation:** Photonics-based Spectrum-X for scaled clusters

Data center energy constraints and agentic AI demand (requiring "10-100x more compute") were identified as major growth drivers.

*[Read the full keynote coverage with photos in Part 1]({% post_url 2025-03-27-2025-nvidia-gtc-conference-part1-keynote %})*

## Key Technical Sessions

### CUDA C++ Workshop

Participants built a multi-body heat dissipation solver using Thrust library, learning about asynchronous copying, pinned memory, CUDA streams, and Nsight Systems debugging tools.

### CuTile Programming Paradigm

A new abstraction layer allowing developers to think in terms of tiles rather than threads and clusters, promising "shorter and clearer expression of the computation."

### Ecosystem Expansion

Sessions highlighted GPU-accelerated replacements for common Python tools: RAPIDS cuDF (pandas/Polars), cuML (scikit-learn), and cuPyNumeric (NumPy).

*[See Part 2 for detailed CUDA content and complete CUDA-X libraries table]({% post_url 2025-03-28-2025-nvidia-gtc-conference-part2-cuda %})*

## CUDA-X Libraries Summary

The conference covered comprehensive GPU-accelerated libraries across categories:

**Math Libraries:** cuBLAS, cuFFT, cuRAND, cuSOLVER, cuSPARSE, cuTENSOR, cuDSS

**Data Processing:** RAPIDS (cuDF, cuML, cuGraph), cuVS, NeMo Curator, Morpheus, GPU Direct Storage

**Image/Video:** cuCIM, CV-CUDA, DALI, nvJPEG, Optical Flow SDK

**Deep Learning:** TensorRT, cuDNN

**Quantum:** cuQuantum, cuPQC

**Communication:** NVSHMEM, NCCL

## Exhibit Hall Observations

The exhibit space demonstrated current hardware capabilities, including:

- Liquid-cooled racks consuming 150KW+ (air cooling no longer viable)
- GB300 compute boards and NVLink switching infrastructure
- Humanoid robots and exoskeleton demonstrations
- Autonomous grocery shopping robots

*[Explore Part 3 for detailed exhibit hall photos and hardware specifications]({% post_url 2025-03-29-2025-nvidia-gtc-conference-part3-exhibit-hall %})*

## Venue and Attendance

The conference expanded beyond the convention center to nearby civic theaters and park spaces due to increased attendance. There was a mile long line for the SAP Center keynote, with some sessions reaching capacity.

## Conclusion

The conference was energetic and well-presented, with valuable networking opportunities among industry practitioners. The exhibit hall even had a digital fitting room demonstration, where I virtually tried on Jensen Huang's signature black leather jacket.

---

**Read the complete 3-part series:**
- [Part 1: Keynote and Main Announcements]({% post_url 2025-03-27-2025-nvidia-gtc-conference-part1-keynote %})
- [Part 2: Deep Dive into CUDA]({% post_url 2025-03-28-2025-nvidia-gtc-conference-part2-cuda %})
- [Part 3: Exhibit Hall - Hardware and Robotics]({% post_url 2025-03-29-2025-nvidia-gtc-conference-part3-exhibit-hall %})
