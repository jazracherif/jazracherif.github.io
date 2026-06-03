---
layout: page
title: Worldly Matters
permalink: /worldly-matters/
---

<link rel="stylesheet" href="{{ "/assets/css/timeline.css" | relative_url }}">

<div class="timeline-section" style="margin-top: 20px;">
  <p>Beyond engineering, I have a deep interest in the political and legal history of nations and how their founding ideas shape their historical trajectory to the present day.</p>
  <p> I am also deeply drawn to existentialist philosophy and its potential to answer questions about what makes individual and communal life most meaningful, particularly in a time characterized by constant change, isolation, and up-rootedness. </p>
  <p>Together, these explorations inform how I engage with the world as a husband, father of two boys, and Lebanese-American 🇱🇧 🇺🇸.</p>
</div>

{% assign worldly_posts = site.posts | where: "label", "worldly matters" %}

<div class="post-list" style="margin-top: 30px;">
  {% for post in worldly_posts %}
  {% include post-card.html post=post %}
  {% endfor %}
</div>
