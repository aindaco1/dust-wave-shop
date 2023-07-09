---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

{% assign sorted = site.products | sort: 'order' %}

# [DUST WAVE](https://dustwave.xyz){:target="_blank"}
{% for product in sorted %}
  {% if product.event == "dustwave" %}
    {% include product.html %}
  {% endif %}
{% endfor %}

# [2023 Fronteras Micro-film Festival](https://fronterasmicrofilm.com){:target="_blank"}
{% for product in sorted %}
  {% if product.event == "fronteras" %}
    {% include product.html %}
  {% endif %}
{% endfor %}