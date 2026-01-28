---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: Main
---

<style>
.bio-intro {
  text-align: center;
  margin: 40px 0 60px 0;
}

.bio-intro h2 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
}

.bio-intro p {
  font-size: 1.2em;
  line-height: 1.8;
  max-width: 700px;
  margin: 20px auto;
  color: #555;
}

.bio-photos {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.bio-photo {
  text-align: center;
}

.bio-photo img {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.bio-photo p {
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
  max-width: 200px;
}

.timeline-section {
  max-width: 800px;
  margin: 60px auto;
}

.timeline-section h2 {
  text-align: center;
  margin-bottom: 50px;
  font-size: 1.8em;
  color: #333;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 50px;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.timeline-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
}

.timeline-logo {
  flex-shrink: 0;
  margin-right: 25px;
}

.timeline-logo img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 8px;
}

.timeline-content {
  flex-grow: 1;
}

.timeline-content h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.3em;
}

.timeline-content .period {
  color: #888;
  font-size: 0.9em;
  margin-bottom: 10px;
  font-style: italic;
}

.timeline-content p {
  margin: 0;
  line-height: 1.6;
  color: #555;
}
</style>

<div class="bio-intro">
  <h2>Hello, I'm Cherif Jazra!</h2>
  
  <p>I'm an engineer with over a decade of experience in embedded software, cellular communications, and real-time systems at Palm and Apple, followed by roles in ML-powered fraud detection at Postmates and data platforms at C3 AI. I hold a Masters from Cornell University in Wireless Digital Communications and completed advanced studies at Stanford in machine learning and data science. I'm the inventor on 8+ US patents and am passionate about the intersection of software and hardware, particularly heterogeneous computing, GPU acceleration, and CUDA development.</p>
  
  <div class="bio-photos">
    <div class="bio-photo">
      <img src="/assets/img/cherif-2025.png" alt="Cherif Jazra 2025"/>
      <p>2025</p>
    </div>
    <div class="bio-photo">
      <img src="/assets/img/cherif.jpeg" alt="Cherif at Cafe de Flore"/>
      <p>At Cafe de Flore, Paris (2017)</p>
    </div>
  </div>
</div>

<div class="timeline-section">
  <h2>Education</h2>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/cornell-logo.jpg" alt="Cornell University"/>
    </div>
    <div class="timeline-content">
      <h3><a href="https://www.ece.cornell.edu/ece">Cornell University</a></h3>
      <div class="period">2006</div>
      <p>Masters in Electrical Engineering with a focus on digital communications</p>
    </div>
  </div>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/usj-logo.jpg" alt="USJ"/>
    </div>
    <div class="timeline-content">
      <h3><a href="https://www.usj.edu.lb/esib/">Ecole Superieure d'Ingenierie de Beyrouth (ESIB/USJ)</a></h3>
      <div class="period">2005</div>
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
      <p>Platform Data Group on C3 AI Dataset product</p>
    </div>
  </div>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/postmates-logo.jpg" alt="Postmates"/>
    </div>
    <div class="timeline-content">
      <h3>Postmates</h3>
      <div class="period">2017 - 2020</div>
      <p>Fraud Detection team, training, deploying and evaluating Machine Learning models used by the Fraud Service</p>
    </div>
  </div>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/apple-logo.jpg" alt="Apple"/>
    </div>
    <div class="timeline-content">
      <h3>Apple</h3>
      <div class="period">2009 - 2017</div>
      <p>Wireless technologies group</p>
    </div>
  </div>
  
  <div class="timeline-item">
    <div class="timeline-logo">
      <img src="/assets/img/logos/palm-logo.jpg" alt="Palm"/>
    </div>
    <div class="timeline-content">
      <h3>Palm</h3>
      <div class="period">2006 - 2009</div>
      <p>Wireless technologies group</p>
    </div>
  </div>
</div>
