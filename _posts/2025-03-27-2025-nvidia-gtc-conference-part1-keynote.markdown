---
layout: post
title:  "GTC 2025 Part 1: Keynote and Main Announcements"
date:   2025-03-27 10:00:00 -0700
categories: conference nvidia gpu
---

![At GTC 2025, San Jose McEnery Convention Center](/assets/img/gtc-2025-cover.jpg)

I attended NVIDIA's GTC conference in San Jose this year, from March 16th to 21st, and as expected, it was a lot of fun and a very inspiring experience for anyone who is a tech practitioner or is interested in accelerated hardware and CUDA software ecosystem.

*This is Part 1 of a 3-part series covering GTC 2025:*
- **Part 1: Keynote and Main Announcements** (this post)
- [Part 2: Deep Dive into CUDA]({% post_url 2025-03-28-2025-nvidia-gtc-conference-part2-cuda %})
- [Part 3: Exhibit Hall - Hardware and Robotics]({% post_url 2025-03-29-2025-nvidia-gtc-conference-part3-exhibit-hall %})

## Main Highlights

- GTC Keynote with Jensen Huang + live Acquired podcast
- "CUDA, New Features and Beyond" with Stephen Jones gives overview of CUDA-X libraries + announces CuTile programming paradigm
- Multiple deep-dive CUDA sessions on bandwidth, latency, compute optimization and cuda kernel writing
- 4 hours C++ workshop using the Thrust library
- GPU acceleration for Apache Spark, with Project Aether for job migration between cpu and gpu
- Exhibit hall showcasing the latest hardware, robotics, and medical equipment

The conference seemed to be more packed than last year, and extended beyond the convention center / Marriott / Hyatt, to the nearby Civic Center and Montgomery Theater for sessions, as well as additional outside tents at the nearby park to showcase exhibitors.

## GTC Keynote

<div class="image-grid">
  <img src="/assets/img/gtc-2025/img01.jpg" alt="SAP Center packed for the keynote">
  <img src="/assets/img/gtc-2025/img02.jpg" alt="Jensen Huang on stage">
  <img src="/assets/img/gtc-2025/img03.jpg" alt="Selfie at the keynote with the Acquired podcast on screen">
</div>

The keynote summarized the trend and direction of accelerated computing, which continues to "eat" cpu-only software applications, and spread to more and more fields, from hard sciences, to wireless communications, to industrial robotics, to enterprise AI.

Training and inference workloads for large language models remains a huge focus for the next generation of high performance accelerated hardware, with the argument that agentic AI will require "10-100x more compute" for inference than traditional one-shot prompts. Data center energy constraints also drive the need for more efficient hardware.

<div class="image-grid">
  <img src="/assets/img/gtc-2025/img04.jpg" alt="Vera Rubin NVL144 specs">
  <img src="/assets/img/gtc-2025/img05.jpg" alt="Rubin Ultra NVL576 specs">
</div>

Nvidia sneak-peeked the next generation Exaflops compute hardware, Vera Rubin NVL144 for 2026 and Rubin Ultra NVL576 for 2027. Feynman will be the name of the architecture following Rubin.

<div class="image-grid">
  <img src="/assets/img/gtc-2025/img06.jpg" alt="NVIDIA Photonics">
  <img src="/assets/img/gtc-2025/img07.jpg" alt="NVIDIA AI Infrastructure for Enterprise Computing">
</div>

Other key announcements included Isaac Groot N1 humanoid model, Newton physics engine, Grace-Blackwell DGX systems, and photonics-based Spectrum-X for scaled clusters.

![GTC 2025 keynote highlights](/assets/img/gtc-2025/img08.jpg)

<br>
<br>

---

*Continue to [Part 2: Deep Dive into CUDA]({% post_url 2025-03-28-2025-nvidia-gtc-conference-part2-cuda %}) to learn about the CUDA workshops, CuTile programming paradigm, and the comprehensive CUDA-X library ecosystem.*
