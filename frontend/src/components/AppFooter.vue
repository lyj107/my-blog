<template>
  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <div class="footer-logo">
          <span class="logo-mark">墨</span>记
        </div>
        <p class="footer-tagline">记录技术，沉淀思考，分享成长。</p>
      </div>

      <div class="footer-links">
        <div class="link-group">
          <h4>内容</h4>
          <router-link to="/articles">所有文章</router-link>
          <router-link to="/archives">归档</router-link>
          <router-link to="/projects">项目</router-link>
        </div>
        <div class="link-group">
          <h4>关于</h4>
          <router-link to="/about">关于我</router-link>
          <router-link to="/admin">管理后台</router-link>
        </div>
      </div>

      <div class="footer-meta">
        <p>&copy; {{ year }} 墨记 · MoJi</p>
        <p class="built-with">Built with Vue 3 &amp; Node.js</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--ink);
  color: var(--bg-alt);
  padding: 4rem 0 2rem;
  margin-top: 6rem;
}

.footer-inner {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 3rem;
}

.footer-logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.logo-mark {
  color: var(--accent);
  font-size: 1.8rem;
}

.footer-tagline {
  color: var(--muted-light);
  font-size: 0.9rem;
  max-width: 280px;
  line-height: 1.6;
}

.footer-links {
  display: flex;
  gap: 3rem;
}

.link-group h4 {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--gold);
  margin-bottom: 1rem;
}

.link-group a {
  display: block;
  color: var(--muted-light);
  font-size: 0.9rem;
  padding: 0.3rem 0;
  transition: color 0.2s;
}

.link-group a:hover {
  color: var(--bg);
}

.footer-meta {
  text-align: right;
}

.footer-meta p {
  font-size: 0.85rem;
  color: var(--muted);
  margin-bottom: 0.3rem;
}

.built-with {
  font-family: var(--font-mono);
  font-size: 0.75rem !important;
  color: var(--muted) !important;
}

@media (max-width: 768px) {
  .footer-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  .footer-links {
    gap: 2rem;
  }
  .footer-meta {
    text-align: left;
  }
}
</style>
