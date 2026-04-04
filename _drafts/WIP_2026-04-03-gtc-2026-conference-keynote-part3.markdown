---
layout: post
title: "GTC 2026 Keynote — Part 3: Vera Rubin Hardware, OpenClaw & Robotics"
date: 2026-04-01 00:00:00 -0700
categories: nvidia gtc keynote gpu hardware
tags: [gtc2026, vera-rubin, groq, openclaw, robotics, physical-ai, dsx]
extra_css: ["/assets/css/keynote-table.css"]
---

*This is Part 3 of a 3-part breakdown of the GTC 2026 keynote. Start with [Part 1: Overview & Context](/nvidia/gtc/keynote/gpu/hardware/2026/04/01/gtc-2026-conference-keynote-part1.html) or go back to [Part 2: Intro, Analytics, CUDA-X & Inference](/nvidia/gtc/keynote/gpu/hardware/2026/04/03/gtc-2026-conference-keynote-part2.html). The original single-page version is <span style="color:#bbb">also available</span> (coming soon).*

---

**Previously in Parts 1 & 2:** After setting the scene at GTC, Jensen spent the first half of the keynote celebrating CUDA's 20-year flywheel, making the case for NVIDIA's role in accelerating enterprise analytics (with partnerships from IBM, Dell, and Google Cloud), reviewing the CUDA-X library ecosystem, and laying out the economics of the AI inference boom, framing the $1T infrastructure wave ahead and how GB300 NVL72 became the inference king on tokens-per-watt.

---

### Summary of Part 3 sections

The second half of the keynote covered the following sections:

| Duration | Section |
|---|---|
| 38 min | [Full Vera Rubin hardware stack + DSX platform](#full-vera-rubin-hardware-stack--gpu-nvlink-rubin-ultra-and-spectrum-x-groq-lpx--dsx-platform-for-ai-factory-optimization-38min) — Showing Vera Rubin + Groq hardware and explaining how they improve the throughput vs. interactivity performance curves |
| 19 min | [OpenClaw, NemoClaw, Open Model Coalition](#openclaw-nemoclaw-open-model-coalition-19min) — Praising the explosive growth of OpenClaw as a revolutionary moment, and announcing NVIDIA's enterprise reference NemoClaw and the open model coalition |
| 14 min | [Robotics, Physical AI, & recap](#robotics-physical-ai--recap-14min) — Describing the evolution of physical AI and the robotic landscape and recaping with a specially generated music video |

---

#### Full Vera Rubin hardware stack — GPU, NVLink, Rubin Ultra, and Spectrum-X Groq LPX + DSX platform for AI factory optimization (*38min*)

<table class="keynote-table">
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4076s">A Decade of AI Infrastructure Innovation: From DGX-1 to Vera Rubin</a> <em>· 3:30min</em></td></tr>
  <tr class="keynote-content"><td>In this video, Jensen narrates NVIDIA's history of data center infrastructure starting in 2016 with the DGX1, the first Supercomputer designed for deep learning with 8 Pascal GPUS -> then Volta brings nvlink2 switch -> followed by the mellanox acquisition that makes the Data center a single unit of computing -> then in 2020 DGX A100 superpod combined scaleup (with nvlink3) with scale out (with ConnectX-6 and InfiniBand) -> Hopper brought fp8 transformer engine for Gen AI + nvlink4 and ConnectX-7 -> Blackwell expanded this to NVl72 130TB/s of bw and deeper integration -> and finally Vera Rubin made for agentic AI bringing 35x more throughput per MW and a diversity of rack performance that reaches 40Mx more compute at the end of this 10 year period. <img src="/assets/img/gtc-2026/vera-rubin-video.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4286s">NVIDIA Vera Rubin</a> <em>· 2:27min</em></td></tr>
  <tr class="keynote-content"><td>Jensen introduces the Vera Rubin hardware on stage <img src="/assets/img/gtc-2026/IMG_6226.JPG" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4433s">NVIDIA Vera Rubin, NVLink and Groq</a> <em>· 1:36min</em></td></tr>
  <tr class="keynote-content"><td>He makes some interesting observations: with the recent tray designs, installation time falls down from 2 days to 2 hours. Also cooling is done with hot water at 45 degrees.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4529s">Spectrum-X Switch, Co-Packaged Optics, Vera and BlueField-4</a> <em>· 2:09min</em></td></tr>
  <tr class="keynote-content"><td>discusses the 8 grok 3rd gen tray which is in production and shows the Spectrum Co-packaged optics switch. Vera is 2x performance per watt. ConnectX9 and storage platform are powered by Vera CPU.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4658s">Rubin Ultra</a> <em>· 2:03min</em></td></tr>
  <tr class="keynote-content"><td>Jensen also shows VR Ultra and the new Kyber rack that can connect 144 gpus that now slide vertically into the rack. He also shows the new NVLink tray design that sits behind, also vertically.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4781s">Inference Performance and Efficiency Drive Company Results</a> <em>· 9:35min</em></td></tr>
  <tr class="keynote-content"><td>Jensen's main message to CEOs is how they will need to evaluate their company's usage of tokens, and study the tradeoff between throughput (as Token per Sec per MW) vs Interactivity (as token per second per user). Input and output Context length are growing and usage depends on use case. Jensen shows a graph partitionned by kind of model at different prices and how nvidia's chips performs on this tradeoff. The value of Ultra lays enabling bigger more interactive models with better energy efficiencies. GB NVL72 has increased the medium tier by 35x and Vera rubin will increase high tier by 3x and increased premium tier by 10x. Rubin + Groq LPX increase most valuable tier by 35x. Ultra enables even better interactivity. <img src="/assets/img/gtc-2026/performance-interactivity.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=5356s">Uniting Processors of Extreme Performances</a> <em>· 3:36min</em></td></tr>
  <tr class="keynote-content"><td>Jensen delves into the performance of Groq, which has high SRAM capacity (500MB) at very high throughput (150TB). This complements Rubin's 288GB of HBM4 memory at 22TB/s by providing statically compiled compute primitives specially used for the decode Feed Forward phase of AI inference, and helps achieve very low latency for token generation. <img src="/assets/img/gtc-2026/rubin-groq.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=5572s">NVIDIA Groq 3 LPX</a> <em>· 0:38min</em></td></tr>
  <tr class="keynote-content"><td>Jensen shows Groq LPX manufactured by samsung and say he expects to ship by Q3 this year.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=5610s">Announcing NVIDIA Launch Partners</a> <em>· 1:56min</em></td></tr>
  <tr class="keynote-content"><td>shows all the AI labs, cloud, and OEM/ODM that will launch Vera Rubin. Expects production in the 1000s per week. also shows launch partners for Vera CPU and BlueField storage systems</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=5726s">NVIDIA Vera Rubin: 7 Chips – 5 Rack Systems</a> <em>· 1:02min</em></td></tr>
  <tr class="keynote-content"><td>Jensen shows how much progress was made by comparing x86 hopper generation to Vera Rubin GW factory. VR can generate 350x more tokens per seconds than Hopper thanks to 35x more scale up BW per Rack (at 288TB/s) and with half as many GPUs. <img src="/assets/img/gtc-2026/vera-rubin-pod.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=5788s">NVIDIA Extreme Co-Design Delivering X-Factors Every Year</a> <em>· 3:37min</em></td></tr>
  <tr class="keynote-content"><td>shows the roadmap to 2028 with Feynman. Oberon will enable scale up in both copper and optical to support NVL576 racks (Kyber) and then NVL1152 for Feynman with Kyber.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=6005s">NVIDIA DSX AI Factory Platform</a> <em>· 2:10min</em></td></tr>
  <tr class="keynote-content"><td>Jensen describes the importance of the NVIDIA Omniverse solution to help design GW factory digital twins and reach max performance at lowest possible energy usage. He talks about tools for simulation such as DSX Sim, DSX exchange, DSX flex power management and DSX Max Q for dynamic power adjustment in the data center.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=6135s">How AI Factories Maximize Tokens, Power, and Profit With NVIDIA DSX</a> <em>· 3:25min</em></td></tr>
  <tr class="keynote-content"><td><img src="/assets/img/gtc-2026/dsx-platform.png" alt=""> The video summarizes all the components of the DSX AI factory platform</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=6340s">Space-1 Vera Rubin Module</a> <em>· 0:43min</em></td></tr>
  <tr class="keynote-content"><td>Jensen briefly mentions NVIDIA's foray in space with Space-1 Vera Rubin module and mentions the challenge of cooling in space.</td></tr>
</table>

#### OpenClaw, NemoClaw, Open Model Coalition (*19min*)

<table class="keynote-table">
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=6383s">NemoClaw for OpenClaw</a> <em>· 1:24min</em></td></tr>
  <tr class="keynote-content"><td>Jensen is very excited about OpenClaw, the most popular open source in history, <img src="/assets/img/gtc-2026/open-claw-adoption.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=6467s">OpenClaw: The ChatGPT Moment for Long-Running, Autonomous Agents</a> <em>· 9:14min</em></td></tr>
  <tr class="keynote-content"><td>He shows how openclaw grew as a project to 340k stars on GitHub since end of january 2026. it is the operating system of agents and every enterprise will soon need an OpenClaw strategy.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7021s">NVIDIA Nemotron and Open Models</a> <em>· 0:28min</em></td></tr>
  <tr class="keynote-content"><td>Jensen announces new models in Nvidia's 6 families: bioNemo for biomedical AI, earth-2 for Ai physics, Nemotron for Agentic AI, Cosmos for Physical AI, GROOT for Robotics, and Alpamayo for Autonomous Vehicles. <img src="/assets/img/gtc-2026/nemoclaw.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7049s">How NVIDIA Open Models Power Every Industry's AI</a> <em>· 4:17min</em></td></tr>
  <tr class="keynote-content"><td>The video shows models from each of the Nvidia families. They are world class, doing well on benchmarks. Shows nemotron 3 super 12b as #4 on best open model for openClaw. Nemotron 3 ultra.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7306s">Announcing Global AI Leaders Join NVIDIA Nemotron Coalition</a> <em>· 2:57min</em></td></tr>
  <tr class="keynote-content"><td>Jensen announces the NVIDIA Nemotron Coalition<sup><a href="#fn:nemotron-coalition">1</a></sup> for the co-development of open AI frontier models with partners Black Forest Labs, Cursor, LangChain, Mistral AI, Perplexity, Reflection AI, Sarvam and Thinking Machines Lab <img src="/assets/img/gtc-2026/open-models-coalition.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7483s">Announcing NVIDIA NemoClaw Reference OpenClaw</a> <em>· 0:39min</em></td></tr>
  <tr class="keynote-content"><td>Jensen says the openClaw event cannot be understated and is as big as linux and html. In response, Nvidia is releasing NemoClaw, a reference enterprise ready solution to secure openClaw deployments inside enterprises.</td></tr>
</table>

#### Robotics, Physical AI, & recap (*14min*)

<table class="keynote-table">
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7522s">Physical AI and Robotics</a> <em>· 3:11min</em></td></tr>
  <tr class="keynote-content"><td>Jensen talks robots, mentions there are 110 robots at GTC, announces 4 new auto partners: BYD, Hyundai, Nissan, and Geely are joining Mercedes, Toyota, and GM to build robotaxi. Jensen also announces a partnership with uber.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7713s">The Age of Physical AI and Robotics</a> <em>· 4:27min</em></td></tr>
  <tr class="keynote-content"><td>This video shows how autonomous cars have been improving thanks to NVIDIA's and partner ecosystem. <img src="/assets/img/gtc-2026/physical-ai.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7980s">Olaf Takes the Stage With Jensen Huang</a> <em>· 1:55min</em></td></tr>
  <tr class="keynote-content"><td>Jensen welcomes the only guest at the keynote. Last year it was a Star Wars inspired robot "blue", this year it is Olaf from Frozen</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=8095s">Official Keynote Closing Video</a> <em>· 4:02min</em></td></tr>
  <tr class="keynote-content"><td>The Keynote ends with a video generated recap with a jensen emoticon playing harmonica in the forest surrounded by a band of robots playing instruments.</td></tr>
</table>

Full keynote is available [here](https://www.nvidia.com/gtc/keynote/) and the slides [here](https://s201.q4cdn.com/141608511/files/doc_events/2026/Mar/16/GTC-2026-Keynote.pdf).

<br>

---

*← [Part 2: Intro, Analytics, CUDA-X & Inference](/nvidia/gtc/keynote/gpu/hardware/2026/04/03/gtc-2026-conference-keynote-part2.html)*

<script>
  document.querySelectorAll('.post-content a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href && !href.startsWith('#')) {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    }
  });
</script>

---

### References

[^nemotron-coalition]: NVIDIA Launches Nemotron Coalition of Leading Global AI Labs to Advance Open Frontier Models - <https://nvidianews.nvidia.com/news/nvidia-launches-nemotron-coalition-of-leading-global-ai-labs-to-advance-open-frontier-models>
