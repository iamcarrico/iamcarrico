---
layout: null
---
{% capture cssPath %}{% asset_path style %}{% endcapture %}
<style>{% asset style %}</style><script defer>
loadCSS('{{ cssPath }}');document.cookie = "iC={{ cssPath | remove: "/assets/style-" }}";</script>
