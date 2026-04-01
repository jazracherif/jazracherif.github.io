---
layout: post
title: "NVIDIA GTC 2026 Conference: The Keynote"
date: 2026-04-01 00:00:00 -0700
categories: nvidia gtc keynote gpu hardware
tags: [gtc2026, vera-rubin, inference, cuda, groq, openclaw, physical-ai, robotics]
extra_css: ["/assets/css/keynote-table.css"]
---

*Prefer a section-by-section breakdown? This keynote is also available as a [3-part series starting with Part 1](/nvidia/gtc/keynote/gpu/hardware/2026/04/01/gtc-2026-conference-keynote-part1.html).*

I was back this year for the 2026 edition of NVIDIA's GTC conference held at the San Jose Convention Center and surroundings from March 16-19. 

![At the conference](/assets/img/gtc-2026/IMG_6244.JPG)


Like last year, there was plenty of energy at the conference with attendee numbers said to have reached more than 30k. The conference was packed with interesting technical sessions on new developments in the NVIDIA ecosystem including technical sessions on CUDA-X libraries and industry and state partners presenting how they have integrated the NVIDIA stack into their products. 

The conference expanded to the nearby hotels for additional space, the security check-ins were moved out of the convention center and onto the street and an additional lunch section was added in the parking lot in front of the Hylton Hotel on S. Almaden Road. 

Finally the keynote was held like previous years at the SAP Center, a 15min walk away, with a larger pavilion setup just outside of it for free coffee and pastries and for hosting the "pre-game" show featuring executives and technical leaders of companies working with NVIDIA. Other than that, the conference looks about the same as last year!

In this post, I will only cover the keynote and will delve into the sessions I attended and the exhibit hall in followup posts.

## The Keynote

The keynote was the main event held on the first day of conference and it was moved ahead to 11AM, making it easier to get there early and avoid long lines. Here are some pictures from the packed SAP Center stadium where it was held

<div class="image-grid">
  <img src="/assets/img/gtc-2026/IMG_6205.JPG" alt="Me at the keynote">
  <img src="/assets/img/gtc-2026/IMG_6211.JPG" alt="Packed stadium">
</div>

As he does every year, Jensen showed hardware on stage, including the new Vera Rubin tray, the new Groq LPX tray, and the new Co-Packaged Optical switch tray for scaling up. He also showed Vera Ultra and its Kyber rack design where trays are inserted vertically instead of horizontally. The exhibit hall had all these nicely on display.
<div class="image-grid">
  <img src="/assets/img/gtc-2026/IMG_6223.JPG" alt="">
  <img src="/assets/img/gtc-2026/IMG_6226.JPG" alt="">
  <img src="/assets/img/gtc-2026/IMG_6227.JPG" alt="">
  <img src="/assets/img/gtc-2026/IMG_6229.JPG" alt="">
</div>

One interesting aspect I wasn't expecting was Jensen spending 18 minutes almost at the outset of the keynote talking about how NVIDIA's libraries are sitting at the foundation of accelerated analytics in Enterprise structured and unstructured data. He announced several partnerships with the cloud providers and highlighted how many of NVIDIA's solutions accelerate CSP's offerings. I will cover the analytics aspects of the conference in a separate post.
<div class="image-grid">
  <img src="/assets/img/gtc-2026/IMG_6218.JPG" alt="">
  <img src="/assets/img/gtc-2026/IMG_6219.JPG" alt="">
</div>

Jensen reveled in being crowned "inference king" by Semianalysis for GB NVL72 system! Also check their review[^semialanalysis-gtc-review] of the GTC conference.
<img src="/assets/img/gtc-2026/IMG_6222.JPG" alt="">

### CUDA is 20 years old

CUDA is now 20 years old, and Jensen celebrated that by spending a few extra minutes talking about its core importance to NVIDIA as a company. He emphasized the crucial flywheel role that CUDA-X plays for NVIDIA as an ecosystem of hundreds of libraries for accelerating all kinds of workloads. As the install base for CUDA has grown, reaching hundreds of millions of GPUs deployed around the world, so has the reach to developers, leading to new breakthroughs in many domains, each creating new markets and new customers who then want to buy more GPUs, further growing the user base.

<img src="/assets/img/gtc-2026/cuda-flywheel.png" alt="">

### The Vera Rubin POD is expanding: Seven Chips, Five Rack-scale Systems

One of the major reveals at this year's conference and worth re-emphasizing is the addition of the Groq LPU to speed up AI inference and the addition of co-packaged optics for the scale network. The NVIDIA AI factory is built around five rack types, and a full Vera Rubin POD "features 40 racks, 1.2 quadrillion transistors, nearly 20,000 NVIDIA dies, 1,152 NVIDIA Rubin GPUs, 60 exaflops, and 10 PB/s total scale-up bandwidth"[^NVIDIA-5-racks]

![Vera Rubin Pod racks](/assets/img/gtc-2026/five-rack-scale-system-nvidia-vera-rubin-1.jpeg)

1. The VR NVL72 GPU node
2. The newly announced companion Groq LPU rack offloading part of the AI inference pass (decode)
3. BlueField-4 to store KV cache offloaded from the GPU memory
4. Vera CPU Rack for more general Agentic workloads and RL, and
5. the Spectrum-6 networking rack to connect the whole POD. 

### Summary of the Keynote by section

Here's a short breakdown of the main section Jensen covered in the Keynote. 

| Duration | Section |
|---|---|
| 16 min | [Intro, Cuda flywheel, Graphics improvements](#intro-cuda-flywheel-graphics-improvements-16min) — Celebrating Cuda's 20y anniversary and showing DLSS5 graphics improvements |
| 22 min | [Accelerated Analytics](#accelerated-analytics-22min) — Emphasizing NVIDIA's role in accelerating enterprise analytics and many of the CSP's AI offerings in the agentic era |
| 7 min | [Cuda-X review and AI native companies](#cuda-x-review-and-ai-native-companies-7min) — Reviewing the library ecosystem that forms CUDA-X |
| 22 min | [AI Inference Inflection + Datacenter efficiency overview](#ai-inference-inflection--overview-of-datacenter-efficiency-tokenswatt-vs-interactivity-tokenss-per-user-across-different-tiers-22min) — Discussing the AI inference inflection point and how CEO's will be evaluating their agentic companies |
| 38 min | [Full Vera Rubin hardware stack + DSX platform](#full-vera-rubin-hardware-stack--gpu-nvlink-rubin-ultra-and-spectrum-x-groq-lpx--dsx-platform-for-ai-factory-optimization-38min) — Showing Vera Rubin + Groq hardware and explaining how they improve the throughput vs. interactivity performance curves |
| 19 min | [OpenClaw, NemoClaw, Open Model Coalition](#openclaw-nemoclaw-open-model-coalition-19min) — Praising the explosive growth of OpenClaw as a revolutionary moment, and announcing NVIDIA's enterprise reference NemoClaw and the open model coalition |
| 14 min | [Robotics, Physical AI, & recap](#robotics-physical-ai--recap-14min) — Describing the evolution of physical AI and the robotic landscape and recaping with a specially generated music video |


Find the breakdown below, linking directly into each section on the YouTube video, along with summary notes and section durations.

#### Intro, Cuda flywheel, Graphics improvements (*16min*)

<table class="keynote-table">
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU">Tokens, the Building Blocks of AI</a> <em>· 3:15min</em></td></tr>
  <tr class="keynote-content"><td>Keynotes start with an inspiring video describing how AI tokens are the main "commodity" produced by AI factories and their power to unlock new knowledge and possibilities</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=195s">Welcome to GTC 2026</a> <em>· 2:47min</em></td></tr>
  <tr class="keynote-content"><td>Jensen enters the stage and gives introductory remarks thanking the pre-game show hosts, and also how the conference will be covering the AI <a href="https://blogs.nvidia.com/blog/ai-5-layer-cake/">5 layer cake</a>, a reference to his blog post that divides the stack along: Energy, Chips, Infrastructure, Models, and Applications</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=362s">20 Years of CUDA</a> <em>· 4:21min</em></td></tr>
  <tr class="keynote-content"><td>Jensen reviews the flywheel that Cuda software has been enabling for the past 20 years.</td></tr>
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
  <tr class="keynote-content"><td>Last year Jensen saw $500B demand for blackwell. This year through 2027, he see $1Tr in infrastructure investments on NVIDIA mainly for inference. 60% of the business is for hyperscalers (some of it for internal use), and 40% is all the rest, such as regional or sovereign cloud, enterprise, supercomputers and all the rest. GB + NVL72 + inference over fp4 for training , dynamo, tensorRT. DGX Cloud. <img src="/assets/img/gtc-2026/inference-drives-growth.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3653s">NVIDIA Extreme Co-Design Revolutionized Token Cost</a> <em>· 3:57min</em></td></tr>
  <tr class="keynote-content"><td>Datacenters are constrained by a fixed amount of power (Watts) available. Emphasize Tokens Per Watt as the metric to maximize, and interactivity (token/s per User) as a use case differentiator. <img src="/assets/img/gtc-2026/inference-king.png" alt=""></td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3890s">InferenceMAX King</a> <em>· 1:23min</em></td></tr>
  <tr class="keynote-content"><td>Shows how GB300NVL72 has improved on both efficiency and cost for inference and has been recognized by semianalysis as inference King!</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3973s">NVIDIA is the Global Standard for AI Inference at Scale</a> <em>· 0:33min</em></td></tr>
  <tr class="keynote-content"><td>Inference service providers should be seen as token factories. The output token rate from companies like eigen AI, together.ai, nebius, etc. has increased very fast, now reaching 400+ token/s for kimiK2.5 reasoning agent. Also see <a href="https://artificialanalysis.ai/models/kimi-k2-5/providers">artificial analysis</a> for a breakdown between providers.</td></tr>
  <tr class="keynote-title"><td><a href="https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4006s">AI Factories are the Industrial Infrastructure of the AI Era</a> <em>· 1:10min</em></td></tr>
  <tr class="keynote-content"><td>Inference drives revenues and Token effectiveness is the most important metric.</td></tr>
</table>

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

[^NVIDIA-5-racks]: NVIDIA - Vera Rubin POD: Seven Chips, Five Rack-Scale Systems, One AI Supercomputer - <https://developer.nvidia.com/blog/nvidia-vera-rubin-pod-seven-chips-five-rack-scale-systems-one-ai-supercomputer/>
[^semialanalysis-gtc-review]: Semianalysis - Nvidia – The Inference Kingdom Expands — <https://newsletter.semianalysis.com/p/nvidia-the-inference-kingdom-expands>
[^nemotron-coalition]: NVIDIA Launches Nemotron Coalition of Leading Global AI Labs to Advance Open Frontier Models - <https://nvidianews.nvidia.com/news/nvidia-launches-nemotron-coalition-of-leading-global-ai-labs-to-advance-open-frontier-models>