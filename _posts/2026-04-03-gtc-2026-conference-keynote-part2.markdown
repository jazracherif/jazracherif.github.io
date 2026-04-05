---
layout: post
title: "GTC 2026 Keynote — Part 2: Intro, Analytics, CUDA-X & Inference"
date: 2026-04-03 00:00:00 -0700
categories: nvidia gtc keynote gpu hardware
tags: [gtc2026, cuda, analytics, inference, rapids]
extra_css: ["/assets/css/keynote-table.css"]
---

*This is Part 2 of a 3-part breakdown of the GTC 2026 keynote. Start with [Part 1: Overview & Context](/nvidia/gtc/keynote/gpu/hardware/2026/04/01/gtc-2026-conference-keynote-part1.html) or jump to [Part 3: Vera Rubin Hardware, OpenClaw & Robotics](/nvidia/gtc/keynote/gpu/hardware/2026/04/05/gtc-2026-conference-keynote-part3.html). The single-page version is [also available](/nvidia/gtc/keynote/gpu/hardware/2026/04/05/nvidia-gtc-2026-conference-the-keynote.html).*

---

**Previously in Part 1:** I covered the conference's atmosphere, shared a bit about the keynote's energy, NVIDIA's celebration of CUDA's 20th anniversary and the flywheel it has created, and how the introduction of the new Groq rack  expended NIVDIA's AI Factory Pod, now a five-rack system combining the Groq LPX, BlueField-4, Vera CPU, and Spectrum-6 networking racks alongside the Vera Rubin GPU node.

---

### Summary of Part 2 sections

Here's a short breakdown of the first hour of the Keynote. For each of the section i give how much time Jensen spent on it along with my impressions and summary notes. I also link directly into each section on the YouTube video.


| Duration | Section |
|---|---|
| 16 min | [Intro, Cuda flywheel, Graphics improvements](#intro-cuda-flywheel-graphics-improvements-16min) — Celebrating Cuda's 20y anniversary and showing DLSS5 graphics improvements |
| 22 min | [Accelerated Analytics](#accelerated-analytics-22min) — Emphasizing NVIDIA's role in accelerating enterprise analytics and many of the CSP's AI offerings in the agentic era |
| 7 min | [Cuda-X review and AI native companies](#cuda-x-review-and-ai-native-companies-7min) — Reviewing the library ecosystem that forms CUDA-X |
| 22 min | [AI Inference Inflection + Datacenter efficiency overview](#ai-inference-inflection--overview-of-datacenter-efficiency-tokenswatt-vs-interactivity-tokenss-per-user-across-different-tiers-22min) — Discussing the AI inference inflection point and how CEO's will be evaluating their agentic companies |


#### Intro, Cuda flywheel, Graphics improvements (*16min*)

<table class="keynote-table">
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU">Tokens, the Building Blocks of AI</a> <em>· 3:15min</em></td></tr>
  <tr class="keynote-content"><td>The keynote starts with an inspiring video describing how AI tokens are the main "commodity" produced by AI factories and their power to unlock new knowledge and possibilities</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=195s">Welcome to GTC 2026</a> <em>· 2:47min</em></td></tr>
  <tr class="keynote-content"><td>Jensen enters the stage and gives introductory remarks thanking the pre-game show hosts, and also how the conference will be covering the AI <a href="https://blogs.nvidia.com/blog/ai-5-layer-cake/">5 layer cake</a>, a reference to his blog post that divides the stack along: Energy, Chips, Infrastructure, Models, and Applications</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=362s">20 Years of CUDA</a> <em>· 4:21min</em></td></tr>
  <tr class="keynote-content"><td>Jensen reviews the flywheel that Cuda software has been enabling for the past 20 years. <img src="/assets/img/gtc-2026/cuda-flywheel.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=623s">GeForce</a> <em>· 3:27min</em></td></tr>
  <tr class="keynote-content"><td>CUDA made GPUs programmable first on the consumer product GeForce in 2006, which then enabled the deep learning community to test the viability of training neural networks and launched the new AI revolution.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=830s">DLSS 5</a> <em>· 2:29min</em></td></tr>
  <tr class="keynote-content"><td>Jensen shows a video featuring the new DLSS5 capability, a Neural rendering technology that fuses 3d Graphics with AI to give more beautiful and detailed textures to videos. Video details triggered a backlash from game developers. <img src="/assets/img/gtc-2026/dlss5.png" alt=""></td></tr>
</table>

#### Accelerated Analytics (*22min*)

<table class="keynote-table">
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=979s">Structured Data is the Ground Truth of AI</a> <em>· 3:26min</em></td></tr>
  <tr class="keynote-content"><td>Jensen says Analytics are ripe for acceleration with the arrival of AI agent and emphasizes CuDF and CuVS as foundation libraries powering the whole ecosystem.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=1216s">IBM Reinvents Data Processing With NVIDIA</a> <em>· 18:10min</em></td></tr>
  <tr class="keynote-content"><td>He announced partnerships with <strong>IBM</strong> for Watson-X, a major contributed to open source Presto C++ and user of Spark over Rapids, NVIDIA's own accelerated dataframe libraries. Also announced were partnerships with <strong>Dell</strong> for an AI platform over RTX6000 servers, and for <strong>Google Cloud</strong>'s AI Hypercomputer. Jensen highlights NVIDIA's stack that accelerate many of the CSP's offerings for AI and he spent some time reviewing them for different cloud providers. <img src="/assets/img/gtc-2026/ibm.png" alt=""></td></tr>
</table>

#### Cuda-X review and AI native companies (*7min*)

<table class="keynote-table">
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=2311s">NVIDIA Foundational Technology Montage</a> <em>· 4:44min</em></td></tr>
  <tr class="keynote-content"><td>Jensen does a quick review of the list of cuda-x libraries and shows a video simulation of these libraries at work</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=2595s">AI Natives</a> <em>· 2:46min</em></td></tr>
  <tr class="keynote-content"><td>The number of AI native companies has exploded in the past year with $150B VC investments. They all need token compute that NVIDIA can provide.</td></tr>
</table>

#### AI Inference Inflection + Overview of datacenter efficiency (Tokens/Watt) vs interactivity (Tokens/s per user) across different tiers (*22min*)

<table class="keynote-table">
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=2761s">Inference Inflection Arrives</a> <em>· 4:42min</em></td></tr>
  <tr class="keynote-content"><td>Jensen highlights 3 key moments for AI inference in the past 2 years: 2023) ChatGPT is released 2024) reasoning AI model with o1 and o3 takeoff and in 2025) Claude code agentic system revolutionizes software engineering. <img src="/assets/img/gtc-2026/inference-inflection.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3043s">"The inflection point for inference has arrived."</a> <em>· 1:40min</em></td></tr>
  <tr class="keynote-content"><td>Agent thinking capabilities led to an explosion in the amount of inference by 10,000x since ChatGPT was released. Coupled with 100x increase in end-user demand, Jensen says we have 1M x more inference demand since 2023. We are now at an inflection point for inference</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3143s">Inference Inflection Drives Strong Growth</a> <em>· 8:30min</em></td></tr>
  <tr class="keynote-content"><td>Last year Jensen saw $500B demand for blackwell. This year through 2027, he see $1Tr in infrastructure investments on NVIDIA mainly for inference. 60% of the business is for hyperscalers (some of it for internal use), and 40% is all the rest, such as regional or sovereign cloud, enterprise, supercomputers and all the rest. GB + NVL72 + inference over fp4 for training, dynamo, tensorRT. DGX Cloud. <img src="/assets/img/gtc-2026/inference-drives-growth.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3653s">NVIDIA Extreme Co-Design Revolutionized Token Cost</a> <em>· 3:57min</em></td></tr>
  <tr class="keynote-content"><td>Datacenters are constrained by a fixed amount of power (Watts) available. Emphasize Tokens Per Watt as the metric to maximize, and interactivity (token/s per User) as a use case differentiator. <img src="/assets/img/gtc-2026/inference-king.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3890s">InferenceMAX King</a> <em>· 1:23min</em></td></tr>
  <tr class="keynote-content"><td>Shows how GB300NVL72 has improved on both efficiency and cost for inference and has been recognized by semianalysis as inference King!</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3973s">NVIDIA is the Global Standard for AI Inference at Scale</a> <em>· 0:33min</em></td></tr>
  <tr class="keynote-content"><td>Inference service providers should be seen as token factories. The output token rate from companies like eigen AI, together.ai, nebius, etc. has increased very fast, now reaching 400+ token/s for kimiK2.5 reasoning agent. Also see <a href="https://artificialanalysis.ai/models/kimi-k2-5/providers">artificial analysis</a> for a breakdown between providers.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4006s">AI Factories are the Industrial Infrastructure of the AI Era</a> <em>· 1:10min</em></td></tr>
  <tr class="keynote-content"><td>Inference drives revenues and Token effectiveness is the most important metric.</td></tr>
</table>

---

The first hour of the keynote established the foundations: CUDA's flywheel, NVIDIA's growing role in enterprise analytics, and the massive scale of the inference inflection. Part 3 shifts to the hardware itself where Jensen walks through the full Vera Rubin stack with Groq, then turns to what he called one of the most important open source moments in history.

---

*← [Part 1: Overview & Context](/nvidia/gtc/keynote/gpu/hardware/2026/04/01/gtc-2026-conference-keynote-part1.html) · [Part 3: Vera Rubin Hardware, OpenClaw & Robotics →](/nvidia/gtc/keynote/gpu/hardware/2026/04/05/gtc-2026-conference-keynote-part3.html)*

<script>
  document.querySelectorAll('.post-content a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href && !href.startsWith('#')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
</script>
