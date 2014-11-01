---
layout: null
---
{% capture fontPath %}{% asset_path fonts/pt_woff %}{% endcapture %}
<script defer>loadCSS('{{ fontPath }}');document.cookie = "iF={{ fontPath | remove: "/assets/fonts/" }}";</script>
