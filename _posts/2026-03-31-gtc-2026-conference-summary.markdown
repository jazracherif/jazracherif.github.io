---
layout: post
title: "NVIDIA GTC 2026 Conference: The Keynote"
date: 2026-03-31 00:00:00 -0700
categories: nvidia gtc keynote gpu hardware
tags: [gtc2026, vera-rubin, inference, cuda, groq, openclaw, physical-ai, robotics]
---

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

End to end, the keynote was 2h18m long, with a large chunk of time divided between 
1. Celebrating Cuda's 20y anniversary and showing DLSS5 graphics improvements (16min)
2. Emphasizing NVIDIA's role in accelerating enterprise analytics and many of the CSP's AI offerings in the agentic era (~22 min)
3. Discussing the AI inference inflection point and how CEO's will be evaluating their agentic companies (~22 min)
4. Showing Vera Rubin + Groq hardware and explaining how they improve the throughput vs. interactivity performance curves (~38 min)
5. Praising the explosive growth of OpenClaw as a revolutionary moment, and announcing NVIDIA's enterprise reference NemoClaw and the open model coalition, (19min)
6. Describing the evolution of physical AI and the robotic landscape and recaping with a specially generated music video (~14 min).

Find the breakdown below, linking directly into each section on the YouTube video, along with summary notes and section durations.

**Intro, Cuda flywheel, Graphics improvements (\*16min\*)**

| Duration | Topic | My Notes
|---|---|---|
| 3:15min | [Tokens, the Building Blocks of AI](https://www.youtube.com/watch?v=jw_o0xr8MWU) | Keynotes start with an inspiring video describing how AI tokens are the main "commodity" produced by AI factories and their power to unlock new knowledge and possibilities
| 2:47min | [Welcome to GTC 2026](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=195s) | Jensen enters the stage and gives introductory remarks thanking the pre-game show hosts, and also how the conference will be covering the AI [5 layer cake](https://blogs.nvidia.com/blog/ai-5-layer-cake/), a reference to his blog post that divides the stack along: Energy, Chips, Infrastructure, Models, and Applications
| 4:21min | [20 Years of CUDA](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=362s) | Jensen reviews the flywheel that Cuda software has been enabling for the past 20 years. 
| 3:27min | [GeForce](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=623s) | CUDA made GPUs programmable first on the consumer product GeForce in 2006, which then enabled the deep learning community to test the viability of training neural networks and launched the new AI revolution. 
| 2:29min | [DLSS 5](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=830s) | Jensen shows a video featuring the new DLSS5 capability, a Neural rendering technology that fuses 3d Graphics with AI to give more beautiful and detailed textures to videos. Video details triggered a backlash from game developers. <img src="/assets/img/gtc-2026/dlss5.png" alt="">

**Accelerated Analytics (\*22min\*)**

|---|---|---|
| 3:26min | [Structured Data is the Ground Truth of AI](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=979s) | Jensen says Analytics are ripe for acceleration with the arrival of AI agent and emphasizes CuDF and CuVS as foundation libraries powering the whole ecosystem.
| 18:10min | [IBM Reinvents Data Processing With NVIDIA](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=1216s) | He announced partnerships with **IBM** for Watson-X, a major contributed to open source Presto C++ and user of Spark over Rapids, NVIDIA's own accelerated dataframe libraries. Also announced were partnerships with **Dell** for an AI platform over RTX6000 servers, and for **Google Cloud**'s AI Hypercomputer. Jensen highlights NVIDIA's stack that accelerate many of the CSP's offerings for AI and he spent some time reviewing them for different cloud providers. <img src="/assets/img/gtc-2026/ibm.png" alt="">

**Cuda-X review and AI native companies (\*7min\*)**

| 4:44min | [NVIDIA Foundational Technology Montage](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=2311s) | Jensen does a quick review of the list of cuda-x libraries and shows a video simulation of these libraries at work
| 2:46min | [AI Natives](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=2595s) | The number of AI native companies has exploded in the past year with $150B VC investments. They all need token compute that NVIDIA can provide. 

**AI Inference Inflection +  Overview of datacenter efficiency (Tokens/Watt) vs interactivity (Tokens/s per user) across different tiers (\*22min\*)** 

| 4:42min | [Inference Inflection Arrives](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=2761s) | Jensen highlights 3 key moments for AI inference in the past 2 years: 2023) ChatGPT is released 2024) reasoning AI model with o1 and o3 takeoff and in 2025) Claude code agentic system revolutionizes software engineering. <img src="/assets/img/gtc-2026/inference-inflection.png" alt="">
| 1:40min | ["The inflection point for inference has arrived."](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3043s) | Agent thinking capabilities led to an explosion in the amount of inference by 10,000x since ChatGPT was released. Coupled with 100x increase in end-user demand, Jensen says we have 1M x more inference demand since 2023. We are now at an inflection point for inference
| 8:30min | [Inference Inflection Drives Strong Growth](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3143s) | Last year Jensen saw $500B demand for blackwell. This year through 2027, he see $1Tr in infrastructure investments on NVIDIA mainly for inference. 60% of the business is for hyperscalers (some of it for internal use), and 40% is all the rest, such as regional or sovereign cloud, enterprise, supercomputers and all the rest. GB + NVL72 + inference over fp4 for training , dynamo, tensorRT. DGX Cloud.  <img src="/assets/img/gtc-2026/inference-drives-growth.png" alt="">
| 3:57min | [NVIDIA Extreme Co-Design Revolutionized Token Cost](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3653s) | Datacenters are constrained by a fixed amount of power (Watts) available. Emphasize Tokens Per Watt as the metric to maximize, and interactivity (token/s per User) as a use case differentiator. <img src="/assets/img/gtc-2026/inference-king.png" alt="">
| 1:23min | [InferenceMAX King](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3890s) | Shows how GB300NVL72 has improved on both efficiency and cost for inference and has been recognized by semianalysis as inference King!
| 0:33min | [NVIDIA is the Global Standard for AI Inference at Scale](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=3973s) | Inference service providers should be seen as token factories. The output token rate from companies like eigen AI, together.ai, nebius, etc. has increased very fast, now reaching 400+ token/s for kimiK2.5 reasoning agent. Also see [artificial analysis](https://artificialanalysis.ai/models/kimi-k2-5/providers) for a breakdown between providers.
| 1:10min | [AI Factories are the Industrial Infrastructure of the AI Era](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4006s) | Inference drives revenues and Token effectiveness is the most important metric. 

**Full Vera Rubin hardware stack — GPU, NVLink, Rubin Ultra, and Spectrum-X Groq LPX + DSX platform for AI factory optimization (\*38min\*)**

| 3:30min | [A Decade of AI Infrastructure Innovation: From DGX-1 to Vera Rubin](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4076s) | In this video, Jensen narrates NVIDIA's history of data center infrastructure starting in 2016 with the DGX1, the first Supercomputer designed for deep learning with 8 Pascal GPUS -> then Volta brings nvlink2 switch -> followed by the mellanox acquisition that makes the Data center a single unit of computing -> then in 2020 DGX A100 superpod combined scaleup (with nvlink3) with scale out (with ConnectX-6 and InfiniBand) -> Hopper brought fp8 transformer engine for Gen AI + nvlink4 and ConnectX-7 -> Blackwell expanded this to NVl72 130TB/s of bw and deeper integration -> and finally Vera Rubin made for agentic AI bringing 35x more throughput per MW and a diversity of rack performance that reaches 40Mx more compute at the end of this 10 year period. <img src="/assets/img/gtc-2026/vera-rubin-video.png" alt="">
| 2:27min | [NVIDIA Vera Rubin](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4286s) | Jensen introduces the Vera Rubin hardware on stage <img src="/assets/img/gtc-2026/IMG_6226.JPG" alt="">
| 1:36min | [NVIDIA Vera Rubin, NVLink and Groq](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4433s) | He makes some interesting observations: with the recent tray designs, installation time falls down from 2 days to 2 hours. Also cooling is done with hot water at 45 degrees.
| 2:09min | [Spectrum-X Switch, Co-Packaged Optics, Vera and BlueField-4](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4529s) | discusses the 8 grok 3rd gen tray which is in production and shows the Spectrum Co-packaged optics switch. Vera is 2x performance per watt. ConnectX9 and storage platform are powered by Vera CPU.
| 2:03min | [Rubin Ultra](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4658s) | Jensen also shows VR Ultra and the new Kyber rack that can connect 144 gpus that now slide vertically into the rack. He also shows the new NVLink tray design that sits behind, also vertically. 
| 9:35min | [Inference Performance and Efficiency Drive Company Results](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=4781s) | Jensen's main message to CEOs is how they will need to evaluate their company's usage of tokens, and study the tradeoff between throughput (as Token per Sec per MW) vs Interactivity (as token per second per user). Input and output Context length are growing and usage depends on use case. Jensen shows a graph partitionned by kind of model at different prices and how nvidia's chips performs on this tradeoff. The value of Ultra lays enabling bigger more interactive models with better energy efficiencies. GB NVL72 has increased the medium tier by 35x and Vera rubin will increase high tier by 3x and increased premium tier by 10x. Rubin + Groq LPX increase most valuable tier by 35x. Ultra enables even better interactivity.  <img src="/assets/img/gtc-2026/performance-interactivity.png" alt="">
| 3:36min | [Uniting Processors of Extreme Performances](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=5356s) | Jensen delves into the performance of Groq, which has high SRAM capacity (500MB) at very high throughput (150TB). This complements Rubin's 288GB of HBM4 memory at 22TB/s by providing statically compiled compute primitives specially used for the decode Feed Forward phase of AI inference, and helps achieve very low latency for token generation. <img src="/assets/img/gtc-2026/rubin-groq.png" alt="">
| 0:38min | [NVIDIA Groq 3 LPX](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=5572s) | Jensen shows Groq LPX manufactured by samsung and say he expects to ship by Q3 this year. 
| 1:56min | [Announcing NVIDIA Launch Partners](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=5610s) | shows all the AI labs, cloud, and OEM/ODM that will launch Vera Rubin. Expects production in the 1000s per week. also shows launch partners for Vera CPU and BlueField storage systems
| 1:02min | [NVIDIA Vera Rubin: 7 Chips – 5 Rack Systems](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=5726s) | Jensen shows how much progress was made by comparing x86 hopper generation to Vera Rubin GW factory. VR can generate 350x more tokens per seconds than Hopper thanks to 35x more scale up BW per Rack (at 288TB/s) and with half as many GPUs. <img src="/assets/img/gtc-2026/vera-rubin-pod.png" alt="">
| 3:37min | [NVIDIA Extreme Co-Design Delivering X-Factors Every Year](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=5788s) | shows the roadmap to 2028 with Feynman. Oberon will enable scale up in both copper and optical to support NVL576 racks (Kyber) and then NVL1152 for Feynman with Kyber. 
| 2:10min | [NVIDIA DSX AI Factory Platform](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=6005s) | Jensen describes the importance of the NVIDIA Omniverse solution to help design GW factory digital twins and reach max performance at lowest possible energy usage. He talks about tools for simulation such as DSX Sim, DSX exchange, DSX flex power management and DSX Max Q for dynamic power adjustment in the data center.
| 3:25min | [How AI Factories Maximize Tokens, Power, and Profit With NVIDIA DSX](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=6135s) | <img src="/assets/img/gtc-2026/dsx-platform.png" alt=""> The video summarizes all the components of the DSX AI factory platform
| 0:43min | [Space-1 Vera Rubin Module](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=6340s) | Jensen briefly mentions NVIDIA's foray in space with Space-1 Vera Rubin module and mentions the challenge of cooling in space.

**OpenClaw, NemoClaw, Open Model Coalition (\*19min\*)**

| 1:24min | [NemoClaw for OpenClaw](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=6383s) | Jensen is very excited about OpenClaw, the most popular open source in history, <img src="/assets/img/gtc-2026/open-claw-adoption.png" alt="">
| 9:14min | [OpenClaw: The ChatGPT Moment for Long-Running, Autonomous Agents](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=6467s) | He shows how openclaw grew as a project to 340k stars on GitHub since end of january 2026. it is the operating system of agents and every enterprise will soon need an OpenClaw strategy.
| 0:28min | [NVIDIA Nemotron and Open Models](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7021s) | Jensen announces new models in Nvidia's 6 families: bioNemo for biomedical AI, earth-2 for Ai physics, Nemotron for Agentic AI, Cosmos for Physical AI, GROOT for Robotics, and Alpamayo for Autonomous Vehicles.  <img src="/assets/img/gtc-2026/nemoclaw.png" alt="">
| 4:17min | [How NVIDIA Open Models Power Every Industry's AI](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7049s) | The video shows models from each of the Nvidia families. They are world class, doing well on benchmarks. Shows nemotron 3 super 12b as #4 on best open model for openClaw. Nemotron 3 ultra.
| 2:57min | [Announcing Global AI Leaders Join NVIDIA Nemotron Coalition](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7306s) | Jensen announces the NVIDIA Nemotron Coalition[^nemotron-coalition] for the co-development of open AI frontier models with partners Black Forest Labs, Cursor, LangChain, Mistral AI, Perplexity, Reflection AI, Sarvam and Thinking Machines Lab <img src="/assets/img/gtc-2026/open-models-coalition.png" alt="">
| 0:39min | [Announcing NVIDIA NemoClaw Reference OpenClaw](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7483s) | Jensen says the openClaw event cannot be understated and is as big as linux and html. In response, Nvidia is releasing NemoClaw, a reference enterprise ready solution to secure openClaw deployments inside enterprises.

**Robotics, Physical AI, & recap (\*14min\*)**

| 3:11min | [Physical AI and Robotics](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7522s) | Jensen talks robots, mentions there are 110 robots at GTC, announces 4 new auto partners: BYD, Hyundai, Nissan, and Geely are joining Mercedes, Toyota, and GM to build robotaxi. Jensen also announces a partnership with uber.
| 4:27min | [The Age of Physical AI and Robotics](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7713s) | This video shows how autonomous cars have been improving thanks to NVIDIA's and partner ecosystem. <img src="/assets/img/gtc-2026/physical-ai.png" alt="">
| 1:55min | [Olaf Takes the Stage With Jensen Huang](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=7980s) | Jensen welcomes the only guest at the keynote. Last year it was a Star Wars inspired robot "blue", this year it is Olaf from Frozen
| 4:02min | [Official Keynote Closing Video](https://www.youtube.com/watch?v=jw_o0xr8MWU&t=8095s) | The Keynote ends with a video generated recap with a jensen emoticon playing harmonica in the forest surrounded by a band of robots playing instruments.

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