---
layout: page
title: Writings
permalink: /writings/
---

<link rel="stylesheet" href="{{ "/assets/css/timeline.css" | relative_url }}">

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
