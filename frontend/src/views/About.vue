<template>
  <div class="about-page">
    <div class="container">
      <div class="about-content reading-width">
        <span class="section-label">关于我</span>
        <h1 class="about-title">你好，我是<span class="accent">管理员</span></h1>
        <p class="about-intro">
          一个热爱技术的全栈开发者。喜欢用代码解决问题，用文字记录成长。
          相信技术的价值在于创造，而不仅是实现。
        </p>

        <div class="about-section">
          <h2 class="about-heading">技能栈</h2>
          <div class="skills-grid">
            <div class="skill-group">
              <h3>前端</h3>
              <div class="skill-tags">
                <span class="skill-tag">Vue 3</span>
                <span class="skill-tag">React</span>
                <span class="skill-tag">TypeScript</span>
                <span class="skill-tag">CSS / Sass</span>
                <span class="skill-tag">Vite</span>
              </div>
            </div>
            <div class="skill-group">
              <h3>后端</h3>
              <div class="skill-tags">
                <span class="skill-tag">Node.js</span>
                <span class="skill-tag">Express</span>
                <span class="skill-tag">Python</span>
                <span class="skill-tag">MySQL</span>
                <span class="skill-tag">Redis</span>
              </div>
            </div>
            <div class="skill-group">
              <h3>工具</h3>
              <div class="skill-tags">
                <span class="skill-tag">Git</span>
                <span class="skill-tag">Docker</span>
                <span class="skill-tag">VS Code</span>
                <span class="skill-tag">Linux</span>
                <span class="skill-tag">Nginx</span>
              </div>
            </div>
          </div>
        </div>

        <div class="about-section">
          <h2 class="about-heading">关于这个博客</h2>
          <p class="about-text">
            这个博客使用 Vue 3 + Vite 构建前端，Node.js + Express + Sequelize 构建后端，
            数据库使用 MySQL。支持 Markdown 文章编辑、分类标签管理、评论系统、
            项目展示等功能。
          </p>
          <p class="about-text">
            我在这里记录技术学习笔记、项目经验分享、工具推荐以及生活随笔。
            如果这些内容对你有帮助，那是我的荣幸。
          </p>
        </div>

        <div class="about-section">
          <h2 class="about-heading">联系方式</h2>
          <div class="contact-links">
            <a href="https://github.com" target="_blank" class="contact-link">
              <span class="contact-icon">⌥</span>
              GitHub
            </a>
            <a href="mailto:admin@example.com" class="contact-link">
              <span class="contact-icon">✉</span>
              Email
            </a>
          </div>
        </div>

        <div class="about-quote">
          <blockquote>
            "保持好奇，持续学习，用技术让世界变得更好一点。"
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-page {
  padding: 4rem 0;
}

.about-content {
  text-align: center;
}

.about-title {
  font-size: clamp(2rem, 4vw, 3rem);
  margin: 1rem 0 1.5rem;
}

.accent {
  color: var(--accent);
  font-style: italic;
}

.about-intro {
  font-size: 1.15rem;
  color: var(--muted);
  line-height: 1.8;
  margin-bottom: 3rem;
  font-family: var(--font-read);
}

.about-section {
  text-align: left;
  margin-bottom: 3rem;
}

.about-heading {
  font-size: 1.4rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.skill-group h3 {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: 0.75rem;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.3rem 0.8rem;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--ink-soft);
  transition: all 0.2s;
}

.skill-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.about-text {
  font-size: 1rem;
  color: var(--ink-soft);
  line-height: 1.8;
  margin-bottom: 1rem;
  font-family: var(--font-read);
}

.contact-links {
  display: flex;
  gap: 1rem;
}

.contact-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-weight: 500;
  font-size: 0.9rem;
  color: var(--ink-soft);
  transition: all 0.2s;
}

.contact-link:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.contact-icon {
  font-size: 1.1rem;
}

.about-quote {
  margin-top: 3rem;
  padding: 2rem;
  background: var(--bg-alt);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--accent);
}

.about-quote blockquote {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1.2rem;
  color: var(--ink-soft);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
