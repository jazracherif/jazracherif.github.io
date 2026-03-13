---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: page
title: Home
hide_title: true

---

<link rel="stylesheet" href="{{ "/assets/css/featured-post.css" | relative_url }}">
<link rel="stylesheet" href="{{ "/assets/css/timeline.css" | relative_url }}">

<div class="hero">
  <div class="hero-photo">
    <img src="/assets/img/cherif-2025.png" alt="Cherif Jazra"/>
  </div>
  <div class="hero-content">
    <h1 class="hero-name">Cherif Jazra</h1>
    <p class="hero-tagline">Software Engineer &middot; Palo Alto, California</p>
    <p class="hero-bio">I have two decades of experience working on complex engineering problems, from real-time embedded wireless systems to large-scale cloud data platforms for Data processing and machine learning. I'm currently focused on GPU-accelerated computing for AI Agent driven data exploration.</p>
    <p class="hero-companies">I've worked at: <span>Palm</span> &middot; <span>Apple</span> &middot; <span>Postmates</span> &middot; <span>C3 AI</span></p>
    <div class="hero-social">
      <a href="https://github.com/{{ site.github_username }}" target="_blank" rel="noopener noreferrer">
        <svg class="svg-icon"><use xlink:href="{{ '/assets/minima-social-icons.svg#github' | relative_url }}"></use></svg>
        GitHub
      </a>
      <a href="https://www.linkedin.com/in/{{ site.linkedin_username }}" target="_blank" rel="noopener noreferrer">
        <svg class="svg-icon"><use xlink:href="{{ '/assets/minima-social-icons.svg#linkedin' | relative_url }}"></use></svg>
        LinkedIn
      </a>
      <a href="mailto:{{ site.email }}">
        <svg class="svg-icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        Email
      </a>
    </div>
  </div>
</div>

<div class="timeline-section">
  <p>The AI revolution is fundamentally changing the work of data scientists and engineers. Powerful AI software agents will soon be automating a much larger part of the traditional engineering workflow. As more capable GPU accelerators come to market and the software stack for accelerated query engines matures, we are entering a new era of GPU-accelerated data exploration, one increasingly driven by AI data agents in the enterprise.
  </p>
  <ul>
    <li><strong>Accelerator hardware breakthroughs</strong> and deeper CPU and GPU integration in data centers will help overcome memory and communication bottlenecks, enabling massively parallelized query engines that are orders of magnitude faster.</li>
    <li><strong>Maturing software stack</strong> and frameworks like RAPIDS AI will provide the building blocks for distributed, multi-node systems that take full advantage of GPU hardware capability and at a lower total cost of ownership.</li>
    <li><strong>AI-accelerated insights</strong> driven by AI agents orchestrating data pipelines end-to-end will make high-quality insights accessible to a much broader audience.</li>
  </ul>
  <p> In my writing I will cover industry and research work being done on GPU accelerated data system, and will offer deep technical dive into the software and hardware stack needed to help bring to life this vision.</p>
</div>

<div class="timeline-section">
  <div class="section-label">Recent Writings</div>
  <div class="post-list">
    {% for post in site.posts %}
    <div class="post-card">
      <div class="post-card-header">
        <a href="{{ post.url | relative_url }}" class="post-card-title">{{ post.title }}</a>
        <span class="post-card-date">{{ post.date | date: "%b %-d, %Y" }}</span>
      </div>
      {% if post.categories.size > 0 %}
      <div class="post-card-tags">
        {% for tag in post.categories %}
        <span class="post-tag">#{{ tag }}</span>
        {% endfor %}
      </div>
      {% endif %}
      <p class="post-card-excerpt">{{ post.excerpt | strip_html | truncatewords: 30 }}</p>
    </div>
    {% endfor %}
  </div>
</div>
