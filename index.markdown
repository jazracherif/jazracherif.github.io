---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: Main
hide_title: true

---

<link rel="stylesheet" href="{{ "/assets/css/featured-post.css" | relative_url }}">
<link rel="stylesheet" href="{{ "/assets/css/timeline.css" | relative_url }}">

<div class="bio-intro">
  <h2>Hello, I'm Cherif Jazra!</h2>
  
  <div class="bio-photos">
    <div class="bio-photo">
      <img src="/assets/img/cherif-2025.png" alt="Cherif Jazra 2025"/>
    </div>
  </div>
  
  <p>I am an engineer with over two decades of experience integrating cutting-edge technologies across different industries. At <b>Palm</b> and <b>Apple</b>, I led the integration of wireless cellular software and GPS for end-user applications on iPhone and iPad. At <b>Postmates</b>, I re-designed the cloud-based toolset for exploration and productionization of machine learning models for the Risk and Fraud Detection team. For the <b>C3 AI</b> Platform engineering team, I helped architect and bring to life the C3 Dataset product, a solution that integrates different data execution engines like pandas, Modin, and Spark into a single front-end user interface, enabling smoother transitions from exploration to productionization.</p>

 <p>Please enjoy exploring my website!</p>

<div class="featured-post">
  <h2>Featured Blog Post</h2>
  <a href="{% post_url 2025-03-26-2025-nvidia-gtc-conference %}" class="featured-post-card">
    <img src="/assets/img/gtc-2025-cover.jpg" alt="GTC 2025 Conference">
    <div class="featured-post-content">
      <h3>2025 NVIDIA GTC Conference - Summary</h3>
      <p>I attended NVIDIA's GTC conference in San Jose from March 16-21, 2025. A comprehensive 3-part series covering Jensen Huang's keynote, deep dives into CUDA programming, and hands-on exploration of the latest GPU hardware and robotics in the exhibit hall.</p>
      <span class="read-more">Read the full series →</span>
    </div>
  </a>
</div>


<div class="timeline-section">
  <h2>Education</h2>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/stanford-logo.png" alt="Stanford University"/>
    </div>
    <div class="timeline-content">
      <h3><a href="https://cgoe.stanford.edu">Stanford University</a></h3>
      <div class="period">Since 2011</div>
      <p>CGOE Graduate Courses in machine learning, Software Systems, and Computer Architecture</p>
    </div>
  </div>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/cornell-logo.jpg" alt="Cornell University"/>
    </div>
    <div class="timeline-content">
      <h3><a href="https://www.ece.cornell.edu/ece">Cornell University</a></h3>
      <div class="period">2005-2006</div>
      <p>Masters in Electrical Engineering with a focus on digital communications</p>
    </div>
  </div>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/usj-logo.jpg" alt="USJ"/>
    </div>
    <div class="timeline-content">
      <h3><a href="https://www.usj.edu.lb/esib/">Ecole Superieure d'Ingenierie de Beyrouth (ESIB/USJ)</a></h3>
      <div class="period">200-2005</div>
      <p>Engineering diploma</p>
    </div>
  </div>
</div>

<div class="timeline-section">
  <h2>Experience</h2>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/c3ai-logo.jpg" alt="C3 AI"/>
    </div>
    <div class="timeline-content">
      <h3>C3 AI</h3>
      <div class="period">2020 - 2023</div>
      <p>Platform Engineering - C3 AI Dataset product</p>
    </div>
  </div>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/postmates-logo.jpg" alt="Postmates"/>
    </div>
    <div class="timeline-content">
      <h3>Postmates</h3>
      <div class="period">2017 - 2020</div>
      <p>Risk and Fraud Detection team, training.</p>
    </div>
  </div>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/apple-logo.jpg" alt="Apple"/>
    </div>
    <div class="timeline-content">
      <h3>Apple</h3>
      <div class="period">2009 - 2017</div>
      <p>Wireless technologies group - iphone and ipad</p>
    </div>
  </div>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/palm-logo.jpg" alt="Palm"/>
    </div>
    <div class="timeline-content">
      <h3>Palm</h3>
      <div class="period">2006 - 2009</div>
      <p>Wireless technologies group - Palm Treo and Palm Pre smartphones</p>
    </div>
  </div>
</div>

<div class="timeline-section">
  <h2>Personal Projects</h2>
  
  <div class="bio-photos">
    <div class="bio-photo">
      <img src="/assets/img/nvidia-gpus-personal-project.jpg" alt="NVIDIA GPU Personal Project"/>
    </div>
    <div class="bio-photo">
      <img src="/assets/img/nvidia-gpus-personal-project2.jpg" alt="NVIDIA GPU Personal Project 2"/>
    </div>
  </div>

  <p style="text-align: center; color: #888; font-style: italic; margin-top: 30px;">Coming Soon!</p>

</div>

<div class="timeline-section">
  <h2>Interested in Collaborating?</h2>
  
  <div style="text-align: center; margin: 20px 0;">
    <img src="/assets/img/collaboration-illustration.jpg" alt="AI Collaboration Workspace" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"/>
  </div>
  
  <p>The last decade's Deep Learning and LLM revolution has fundamentally changed the technological stack needed to engineer performant AI-powered solutions. Now more than ever, engineers must leverage the best capabilities from CPU and GPU hardware while integrating complex software system infrastructure tailored to their enterprise needs, tools like NVIDIA's CUDA, PyTorch, Ray, vLLM, as well as data engine products like DataFusion, Velox, and many others. Reach out if you would like to talk more about these topics!</p>  
</div>

