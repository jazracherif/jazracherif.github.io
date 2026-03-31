---
layout: page
title: Writings
permalink: /writings/
---

<link rel="stylesheet" href="{{ "/assets/css/timeline.css" | relative_url }}">

<div class="post-list">
  {% for post in site.posts %}
  {% include post-card.html post=post %}
  {% endfor %}
</div>
